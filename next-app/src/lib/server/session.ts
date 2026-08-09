import { jwtVerify, SignJWT } from "jose";
import { NextResponse } from "next/server";

const AUTH_SESSION_COOKIE = "jumpfirst_session";
const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionUser = {
  provider: "password" | "google" | "facebook" | "apple";
  subject: string;
  email?: string;
  name?: string;
};

export type SessionTokenPayload = {
  sub: string;
  provider: SessionUser["provider"];
  email?: string;
  name?: string;
};

function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;

  if (!secret || secret.trim().length < 32) {
    if (process.env.NODE_ENV === "test") {
      return "test-session-secret-please-change-in-production-1234";
    }

    throw new Error("AUTH_SESSION_SECRET must be set and at least 32 chars.");
  }

  return secret;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const secret = new TextEncoder().encode(getSessionSecret());

  return new SignJWT({
    sub: user.subject,
    provider: user.provider,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${AUTH_SESSION_MAX_AGE_SECONDS}s`)
    .setIssuer("jumpfirst")
    .setAudience("jumpfirst-web")
    .sign(secret);
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function readSessionCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const items = cookieHeader.split(";").map((item) => item.trim());

  for (const item of items) {
    if (item.startsWith(`${AUTH_SESSION_COOKIE}=`)) {
      return decodeURIComponent(item.slice(`${AUTH_SESSION_COOKIE}=`.length));
    }
  }

  return undefined;
}

export async function verifySessionToken(token: string): Promise<SessionTokenPayload | undefined> {
  try {
    const secret = new TextEncoder().encode(getSessionSecret());
    const result = await jwtVerify(token, secret, {
      issuer: "jumpfirst",
      audience: "jumpfirst-web",
    });

    const sub = result.payload.sub;
    const provider = result.payload.provider;

    if (
      typeof sub !== "string" ||
      (provider !== "password" && provider !== "google" && provider !== "facebook" && provider !== "apple")
    ) {
      return undefined;
    }

    return {
      sub,
      provider,
      email: typeof result.payload.email === "string" ? result.payload.email : undefined,
      name: typeof result.payload.name === "string" ? result.payload.name : undefined,
    };
  } catch {
    return undefined;
  }
}

export function setSocialStateCookie(response: NextResponse, state: string): void {
  response.cookies.set({
    name: "jumpfirst_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}

export function readSocialStateCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const items = cookieHeader.split(";").map((item) => item.trim());

  for (const item of items) {
    if (item.startsWith("jumpfirst_oauth_state=")) {
      return decodeURIComponent(item.slice("jumpfirst_oauth_state=".length));
    }
  }

  return undefined;
}

export function clearSocialStateCookie(response: NextResponse): void {
  response.cookies.set({
    name: "jumpfirst_oauth_state",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
