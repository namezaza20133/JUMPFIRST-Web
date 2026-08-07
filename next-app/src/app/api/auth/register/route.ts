import { errorResponse, okResponse } from "@/lib/api/response";
import type { RegisterRequest, SubmitResult } from "@/lib/types/services";
import { validateRegisterPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const payload = (await request.json()) as RegisterRequest;
  const fieldErrors = validateRegisterPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  return okResponse<SubmitResult>({ success: true, message: "Registration successful" });
}
