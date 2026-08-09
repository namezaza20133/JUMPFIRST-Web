import { errorResponse, okResponse } from "@/lib/api/response";
import { verifyRecoveryToken } from "@/lib/server/recovery";
import { updateUserPasswordByIdentifier } from "@/lib/server/userStore";
import type { ResetPasswordRequest, SubmitResult } from "@/lib/types/services";
import { validateResetPasswordPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const payload = (await request.json()) as ResetPasswordRequest;
  const fieldErrors = validateResetPasswordPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  const tokenPayload = await verifyRecoveryToken(payload.token.trim());
  if (!tokenPayload) {
    return errorResponse("validation", "common.errors.validation", 422, {
      token: "common.validationFields.token.invalid",
    });
  }

  if (tokenPayload.otpCode !== payload.otpCode.trim()) {
    return errorResponse("validation", "common.errors.validation", 422, {
      otpCode: "common.validationFields.otpCode.invalid",
    });
  }

  const isUpdated = updateUserPasswordByIdentifier(tokenPayload.identifier, payload.password.trim());
  if (!isUpdated) {
    return errorResponse("not-found", "common.errors.notFound", 404);
  }

  return okResponse<SubmitResult>({
    success: true,
    message: "Password reset successful",
  });
}
