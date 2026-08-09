import { errorResponse, okResponse } from "@/lib/api/response";
import { buildAuthorizationUrl } from "@/lib/server/oauth";
import { setSocialStateCookie } from "@/lib/server/session";
import type { SocialLoginRequest, SubmitResult } from "@/lib/types/services";
import { validateSocialLoginPayload } from "@/lib/validation/forms";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json()) as SocialLoginRequest;
  const fieldErrors = validateSocialLoginPayload(payload);

  if (fieldErrors) {
    return errorResponse("validation", "common.errors.validation", 422, fieldErrors);
  }

  const providerLabel = `${payload.provider.charAt(0).toUpperCase()}${payload.provider.slice(1)}`;
  const state = crypto.randomUUID();

  try {
    const redirectUrl = buildAuthorizationUrl(payload.provider, state);

    const response = okResponse<SubmitResult>({
      success: true,
      message: `Continuing with ${providerLabel}...`,
      redirectUrl,
    }) as NextResponse;

    setSocialStateCookie(response, state);

    return response;
  } catch {
    return errorResponse("server", "common.errors.server", 500);
  }
}