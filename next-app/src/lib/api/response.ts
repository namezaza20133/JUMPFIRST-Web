import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiResponse } from "@/lib/types/services";

export function okResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, init);
}

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  fieldErrors?: Record<string, string>
) {
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      error: {
        code,
        message,
        fieldErrors,
      },
    },
    { status }
  );
}
