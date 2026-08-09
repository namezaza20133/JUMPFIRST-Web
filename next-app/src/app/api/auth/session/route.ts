import { okResponse } from "@/lib/api/response";
import { readSessionCookie, verifySessionToken } from "@/lib/server/session";
import { getUserByUsername, toPublicProfile } from "@/lib/server/userStore";
import type { AuthSessionData } from "@/lib/types/services";

export async function GET(request: Request) {
  const token = readSessionCookie(request);

  if (!token) {
    return okResponse<AuthSessionData>({
      authenticated: false,
    });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return okResponse<AuthSessionData>({
      authenticated: false,
    });
  }

  if (payload.provider === "password") {
    const user = getUserByUsername(payload.sub);

    if (!user) {
      return okResponse<AuthSessionData>({
        authenticated: false,
      });
    }

    const profile = toPublicProfile(user);

    return okResponse<AuthSessionData>({
      authenticated: true,
      user: {
        ...profile,
        provider: "password",
      },
    });
  }

  return okResponse<AuthSessionData>({
    authenticated: true,
    user: {
      fullName: payload.name ?? "Social User",
      username: payload.sub,
      email: payload.email ?? "",
      phone: "",
      provider: payload.provider,
    },
  });
}
