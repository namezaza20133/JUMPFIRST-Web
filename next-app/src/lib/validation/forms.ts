import type {
  ContactRequest,
  LoginRequest,
  RecoveryRequest,
  ResetPasswordRequest,
  RegisterRequest,
  SocialLoginRequest,
} from "@/lib/types/services";

export type ValidationFieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{9,20}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,20}$/;
const SOCIAL_PROVIDERS = new Set(["google", "facebook", "apple"]);

function isEmailOrPhone(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

export function validateLoginPayload(payload: LoginRequest): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};
  const identifier = payload.identifier?.trim() ?? "";

  if (!identifier) {
    fieldErrors.identifier = "common.validationFields.identifier.required";
  } else if (!isEmailOrPhone(identifier)) {
    fieldErrors.identifier = "common.validationFields.identifier.format";
  }

  if (!payload.password?.trim()) {
    fieldErrors.password = "common.validationFields.password.required";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function validateRecoveryPayload(
  payload: RecoveryRequest
): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};
  const identifier = payload.identifier?.trim() ?? "";

  if (!identifier) {
    fieldErrors.identifier = "common.validationFields.identifier.required";
  } else if (!isEmailOrPhone(identifier)) {
    fieldErrors.identifier = "common.validationFields.identifier.format";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function validateSocialLoginPayload(
  payload: SocialLoginRequest
): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};

  if (!payload.provider?.trim()) {
    fieldErrors.provider = "common.validationFields.provider.required";
  } else if (!SOCIAL_PROVIDERS.has(payload.provider)) {
    fieldErrors.provider = "common.validationFields.provider.unsupported";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function validateResetPasswordPayload(
  payload: ResetPasswordRequest
): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};

  if (!payload.token?.trim()) {
    fieldErrors.token = "common.validationFields.token.required";
  }

  if (!payload.password?.trim()) {
    fieldErrors.password = "common.validationFields.password.required";
  } else if (payload.password.trim().length < 8) {
    fieldErrors.password = "common.validationFields.password.min8";
  }

  if (!payload.otpCode?.trim()) {
    fieldErrors.otpCode = "common.validationFields.otpCode.required";
  } else if (!/^\d{6}$/.test(payload.otpCode.trim())) {
    fieldErrors.otpCode = "common.validationFields.otpCode.format";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function validateRegisterPayload(
  payload: RegisterRequest
): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};

  if (!payload.fullName?.trim()) {
    fieldErrors.fullName = "common.validationFields.fullName.required";
  } else if (payload.fullName.trim().length < 2) {
    fieldErrors.fullName = "common.validationFields.fullName.min2";
  }

  if (!payload.phone?.trim()) {
    fieldErrors.phone = "common.validationFields.phone.required";
  } else if (!PHONE_PATTERN.test(payload.phone.trim())) {
    fieldErrors.phone = "common.validationFields.phone.format";
  }

  if (!payload.email?.trim()) {
    fieldErrors.email = "common.validationFields.email.required";
  } else if (!EMAIL_PATTERN.test(payload.email.trim())) {
    fieldErrors.email = "common.validationFields.email.format";
  }

  if (!payload.username?.trim()) {
    fieldErrors.username = "common.validationFields.username.required";
  } else if (!USERNAME_PATTERN.test(payload.username.trim())) {
    fieldErrors.username = "common.validationFields.username.format";
  }

  if (!payload.password?.trim()) {
    fieldErrors.password = "common.validationFields.password.required";
  } else if (payload.password.trim().length < 8) {
    fieldErrors.password = "common.validationFields.password.min8";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function validateContactPayload(
  payload: ContactRequest
): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};

  if (!payload.name?.trim()) {
    fieldErrors.name = "common.validationFields.name.required";
  } else if (payload.name.trim().length < 2) {
    fieldErrors.name = "common.validationFields.name.min2";
  }

  if (!payload.email?.trim()) {
    fieldErrors.email = "common.validationFields.email.required";
  } else if (!EMAIL_PATTERN.test(payload.email.trim())) {
    fieldErrors.email = "common.validationFields.email.format";
  }

  if (!payload.message?.trim()) {
    fieldErrors.message = "common.validationFields.message.required";
  } else if (payload.message.trim().length < 10) {
    fieldErrors.message = "common.validationFields.message.min10";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}