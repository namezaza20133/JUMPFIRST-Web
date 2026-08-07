import type { MessageKey } from "@/lib/i18n/messages";

export type FieldType = "text" | "email" | "password" | "tel" | "textarea";

export type FormFieldSchema = {
  name: string;
  type: FieldType;
  placeholderKey: MessageKey;
  required?: boolean;
  rows?: number;
};

export const loginFormSchema: FormFieldSchema[] = [
  { name: "identifier", type: "text", placeholderKey: "login.identifierPlaceholder", required: true },
  { name: "password", type: "password", placeholderKey: "login.passwordPlaceholder", required: true },
];

export const registerFormSchema: FormFieldSchema[] = [
  { name: "fullName", type: "text", placeholderKey: "register.fullNamePlaceholder", required: true },
  { name: "phone", type: "tel", placeholderKey: "register.phonePlaceholder", required: true },
  { name: "email", type: "email", placeholderKey: "register.emailPlaceholder", required: true },
  { name: "username", type: "text", placeholderKey: "register.usernamePlaceholder", required: true },
  { name: "password", type: "password", placeholderKey: "register.passwordPlaceholder", required: true },
];

export const contactFormSchema: FormFieldSchema[] = [
  { name: "name", type: "text", placeholderKey: "contact.namePlaceholder", required: true },
  { name: "email", type: "email", placeholderKey: "contact.emailPlaceholder", required: true },
  { name: "message", type: "textarea", placeholderKey: "contact.messagePlaceholder", required: true, rows: 5 },
];
