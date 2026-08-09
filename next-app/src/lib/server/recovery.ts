import { jwtVerify, SignJWT } from "jose";

const RECOVERY_TOKEN_TTL_SECONDS = 60 * 15;

export type RecoveryTokenPayload = {
  identifier: string;
  otpCode: string;
  action: "password_recovery";
};

function getRecoverySecret(): string {
  const secret = process.env.RECOVERY_TOKEN_SECRET;

  if (!secret || secret.trim().length < 32) {
    if (process.env.NODE_ENV === "test") {
      return "test-recovery-secret-please-change-in-production-1234";
    }

    throw new Error("RECOVERY_TOKEN_SECRET must be set and at least 32 chars.");
  }

  return secret;
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createRecoveryToken(identifier: string, otpCode: string): Promise<string> {
  const secret = new TextEncoder().encode(getRecoverySecret());

  return new SignJWT({ identifier, otpCode, action: "password_recovery" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${RECOVERY_TOKEN_TTL_SECONDS}s`)
    .setIssuer("jumpfirst")
    .setAudience("jumpfirst-recovery")
    .sign(secret);
}

export async function verifyRecoveryToken(token: string): Promise<RecoveryTokenPayload | undefined> {
  try {
    const secret = new TextEncoder().encode(getRecoverySecret());
    const result = await jwtVerify(token, secret, {
      issuer: "jumpfirst",
      audience: "jumpfirst-recovery",
    });

    const identifier = result.payload.identifier;
    const otpCode = result.payload.otpCode;
    const action = result.payload.action;

    if (typeof identifier !== "string" || typeof otpCode !== "string" || action !== "password_recovery") {
      return undefined;
    }

    return {
      identifier,
      otpCode,
      action,
    };
  } catch {
    return undefined;
  }
}
