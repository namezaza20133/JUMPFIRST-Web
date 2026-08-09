const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{9,20}$/;

export function isEmailIdentifier(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isPhoneIdentifier(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}
