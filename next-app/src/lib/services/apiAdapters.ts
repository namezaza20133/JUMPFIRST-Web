import type { ServiceAdapters } from "@/lib/services/contracts";
import { ServiceError } from "@/lib/services/errors";
import type { ApiResponse } from "@/lib/types/services";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ServiceError("network", "Network request failed");
  }

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (payload?.success === false) {
    throw new ServiceError(
      payload.error.code,
      payload.error.message,
      response.status,
      payload.error.fieldErrors
    );
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 422) {
      throw new ServiceError("validation", "Validation request failed", response.status);
    }

    if (response.status === 404) {
      throw new ServiceError("not-found", "Resource not found", response.status);
    }

    if (response.status >= 500) {
      throw new ServiceError("server", "Server request failed", response.status);
    }

    throw new ServiceError("unknown", `API request failed: ${response.status}`, response.status);
  }

  if (payload?.success === true) {
    return payload.data;
  }

  throw new ServiceError("unknown", "Invalid API response shape", response.status);
}

export function createApiAdapters(): ServiceAdapters {
  return {
    auth: {
      login: (payload) => requestJson("/api/auth/login", { method: "POST", body: payload }),
      register: (payload) => requestJson("/api/auth/register", { method: "POST", body: payload }),
    },

    contact: {
      submitContact: (payload) => requestJson("/api/contact", { method: "POST", body: payload }),
    },

    courses: {
      listCourses: () => requestJson("/api/courses"),
    },

    member: {
      getMemberMetrics: () => requestJson("/api/member/metrics"),
    },
  };
}
