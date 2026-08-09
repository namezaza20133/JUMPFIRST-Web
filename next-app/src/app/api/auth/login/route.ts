import { NextResponse } from "next/server";
import { errorResponse, okResponse } from "@/lib/api/response";
import { createSessionToken, setSessionCookie } from "@/lib/server/session";
import { verifyUserCredentials } from "@/lib/server/userStore";
import type { LoginRequest, SubmitResult } from "@/lib/types/services";
import { validateLoginPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginRequest;
  const fieldErrors = validateLoginPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  const user = verifyUserCredentials(payload.identifier, payload.password);
  if (!user) {
    return errorResponse("validation", "common.errors.validation", 422, {
      password: "common.validationFields.password.invalidCredentials",
    });
  }

  const token = await createSessionToken({
    provider: "password",
    subject: user.username,
    email: user.email,
    name: user.fullName,
  });

  const response = okResponse<SubmitResult>({ success: true, message: "Login successful" }) as NextResponse;
  setSessionCookie(response, token);

  return response;
}
