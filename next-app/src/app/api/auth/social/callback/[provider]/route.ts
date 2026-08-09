import { NextResponse } from "next/server";
import { exchangeCodeForProfile } from "@/lib/server/oauth";
import {
  clearSocialStateCookie,
  createSessionToken,
  readSocialStateCookie,
  setSessionCookie,
} from "@/lib/server/session";
import type { SocialProvider } from "@/lib/types/services";

const SUPPORTED_PROVIDERS = new Set<SocialProvider>(["google", "facebook", "apple", "line"]);

function redirectToLoginWithError(request: Request, error: string): NextResponse {
  const url = new URL("/login", request.url);
  url.searchParams.set("socialError", error);
  return NextResponse.redirect(url);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> }
): Promise<NextResponse> {
  const { provider } = await context.params;

  if (!SUPPORTED_PROVIDERS.has(provider as SocialProvider)) {
    return redirectToLoginWithError(request, "unsupported_provider");
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code") ?? "";
  const state = requestUrl.searchParams.get("state") ?? "";

  if (!code || !state) {
    return redirectToLoginWithError(request, "missing_oauth_params");
  }

  const storedState = readSocialStateCookie(request);
  if (!storedState || storedState !== state) {
    return redirectToLoginWithError(request, "invalid_oauth_state");
  }

  try {
    const profile = await exchangeCodeForProfile(provider as SocialProvider, code);

    if (!profile.id) {
      return redirectToLoginWithError(request, "missing_subject");
    }

    const token = await createSessionToken({
      provider: provider as SocialProvider,
      subject: profile.id,
      email: profile.email,
      name: profile.name,
    });

    const destination = new URL("/member-dashboard", request.url);
    const response = NextResponse.redirect(destination);
    setSessionCookie(response, token);
    clearSocialStateCookie(response);

    return response;
  } catch {
    return redirectToLoginWithError(request, "oauth_exchange_failed");
  }
}
