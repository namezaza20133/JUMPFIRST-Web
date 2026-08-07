import type { MessageKey } from "@/lib/i18n/messages";
import type { ApiErrorCode } from "@/lib/types/services";

export type ServiceErrorCode = ApiErrorCode;

export class ServiceError extends Error {
  code: ServiceErrorCode;
  status?: number;
  fieldErrors?: Record<string, string>;

  constructor(
    code: ServiceErrorCode,
    message: string,
    status?: number,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function toServiceError(error: unknown): ServiceError {
  if (error instanceof ServiceError) {
    return error;
  }

  if (error instanceof Error) {
    return new ServiceError("unknown", error.message);
  }

  return new ServiceError("unknown", "Unknown service error");
}

export function getServiceErrorMessageKey(error: unknown): MessageKey {
  const serviceError = toServiceError(error);

  switch (serviceError.code) {
    case "network":
      return "common.errors.network";
    case "validation":
      return "common.errors.validation";
    case "not-found":
      return "common.errors.notFound";
    case "server":
      return "common.errors.server";
    default:
      return "common.errors.unknown";
  }
}

export function getFirstFieldErrorMessage(error: unknown): string | undefined {
  const serviceError = toServiceError(error);

  if (!serviceError.fieldErrors) {
    return undefined;
  }

  const messages = Object.values(serviceError.fieldErrors);
  return messages[0];
}

const FIELD_ERROR_KEY_PREFIX = "common.validationFields.";

function translateFieldErrorMessage(message: string, t: (key: MessageKey) => string): string {
  if (message.startsWith(FIELD_ERROR_KEY_PREFIX)) {
    return t(message as MessageKey);
  }

  return message;
}

export function getTranslatedFieldErrors(
  error: unknown,
  t: (key: MessageKey) => string
): Record<string, string> | undefined {
  const serviceError = toServiceError(error);

  if (!serviceError.fieldErrors) {
    return undefined;
  }

  const translatedFieldErrors: Record<string, string> = {};

  for (const [fieldName, message] of Object.entries(serviceError.fieldErrors)) {
    translatedFieldErrors[fieldName] = translateFieldErrorMessage(message, t);
  }

  return translatedFieldErrors;
}
