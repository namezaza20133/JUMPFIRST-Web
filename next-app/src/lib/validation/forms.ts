import type { ContactRequest, LoginRequest, RegisterRequest } from "@/lib/types/services";

export type ValidationFieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{9,20}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,20}$/;

export function validateLoginPayload(payload: LoginRequest): ValidationFieldErrors | undefined {
  const fieldErrors: ValidationFieldErrors = {};

  if (!payload.identifier?.trim()) {
    fieldErrors.identifier = "common.validationFields.identifier.required";
  }

  if (!payload.password?.trim()) {
    fieldErrors.password = "common.validationFields.password.required";
  } else if (payload.password.trim().length < 6) {
    fieldErrors.password = "common.validationFields.password.min6";
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