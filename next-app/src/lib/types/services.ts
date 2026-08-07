export type SubmitResult = {
  success: boolean;
  message?: string;
};

export type ApiErrorCode = "network" | "validation" | "not-found" | "server" | "unknown";

export type ApiErrorPayload = {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ApiErrorPayload;
    };

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
};
