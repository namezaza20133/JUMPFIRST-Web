import { errorResponse, okResponse } from "@/lib/api/response";
import type { LoginRequest, SubmitResult } from "@/lib/types/services";
import { validateLoginPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginRequest;
  const fieldErrors = validateLoginPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  return okResponse<SubmitResult>({ success: true, message: "Login successful" });
}
