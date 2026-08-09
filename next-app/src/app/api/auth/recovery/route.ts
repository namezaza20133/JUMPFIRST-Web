import { errorResponse, okResponse } from "@/lib/api/response";
import { isEmailIdentifier, isPhoneIdentifier } from "@/lib/server/identifier";
import { sendRecoveryEmail } from "@/lib/server/mailer";
import { createRecoveryToken, generateOtpCode } from "@/lib/server/recovery";
import { sendRecoverySms } from "@/lib/server/sms";
import { findUserByIdentifier } from "@/lib/server/userStore";
import type { RecoveryRequest, SubmitResult } from "@/lib/types/services";
import { validateRecoveryPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const payload = (await request.json()) as RecoveryRequest;
  const fieldErrors = validateRecoveryPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  const identifier = payload.identifier.trim();
  const user = findUserByIdentifier(identifier);

  if (!user) {
    return okResponse<SubmitResult>({
      success: true,
      message: "Recovery request accepted",
    });
  }

  const otpCode = generateOtpCode();
  const token = await createRecoveryToken(user.email, otpCode);
  const baseUrl = process.env.AUTH_BASE_URL ?? "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

  try {
    if (isEmailIdentifier(identifier) || isEmailIdentifier(user.email)) {
      await sendRecoveryEmail({
        to: user.email,
        resetLink,
        otpCode,
      });
    } else if (isPhoneIdentifier(identifier) || isPhoneIdentifier(user.phone)) {
      await sendRecoverySms({
        phone: user.phone,
        otpCode,
      });
    }
  } catch (error) {
    console.error("[auth/recovery] Failed to deliver recovery message", error);
    return errorResponse("server", "common.errors.server", 500);
  }

  return okResponse<SubmitResult>({
    success: true,
    message: "Recovery request accepted",
  });
}