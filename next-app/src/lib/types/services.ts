export type SubmitResult = {
  success: boolean;
  message?: string;
  redirectUrl?: string;
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

export type AuthSessionData = {
  authenticated: boolean;
  user?: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    provider: "password" | "google" | "facebook" | "apple";
  };
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type SocialProvider = "google" | "facebook" | "apple";

export type SocialLoginRequest = {
  provider: SocialProvider;
};

export type RecoveryRequest = {
  identifier: string;
};

export type ResetPasswordRequest = {
  token: string;
  otpCode: string;
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
