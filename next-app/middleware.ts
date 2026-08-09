import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readSessionCookie, verifySessionToken } from "@/lib/server/session";

export async function middleware(request: NextRequest) {
  const sessionToken = readSessionCookie(request);

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifySessionToken(sessionToken);
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member-dashboard/:path*"],
};
