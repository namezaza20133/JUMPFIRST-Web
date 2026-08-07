import { errorResponse, okResponse } from "@/lib/api/response";
import type { ContactRequest, SubmitResult } from "@/lib/types/services";
import { validateContactPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactRequest;
  const fieldErrors = validateContactPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  return okResponse<SubmitResult>({ success: true, message: "Contact submitted" });
}
