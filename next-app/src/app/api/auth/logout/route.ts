import { NextResponse } from "next/server";
import { okResponse } from "@/lib/api/response";
import { clearSessionCookie } from "@/lib/server/session";
import type { SubmitResult } from "@/lib/types/services";

export async function POST() {
  const response = okResponse<SubmitResult>({
    success: true,
    message: "Logged out successfully",
  }) as NextResponse;

  clearSessionCookie(response);
  return response;
}
