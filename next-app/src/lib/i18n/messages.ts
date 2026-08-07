import { en } from "@/lib/i18n/locales/en";
import { th } from "@/lib/i18n/locales/th";

export type Language = "th" | "en";

export const defaultLanguage: Language = "th";
export const languageStorageKey = "jumpfirst-language";

type MessageShape = typeof th;
type WidenStrings<T> = T extends string ? string : { [K in keyof T]: WidenStrings<T[K]> };
type MessageTree = WidenStrings<MessageShape>;

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

export type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends string ? K & string : Join<K & string, NestedKeys<T[K]>>;
    }[keyof T]
  : never;

export type MessageKey = NestedKeys<MessageShape>;

export const messages: Record<Language, MessageTree> = {
  th,
  en,
};

const reportedMissingKeys = new Set<string>();

function readMessage(tree: MessageTree, key: MessageKey): string | undefined {
  const segments = key.split(".");
  let cursor: unknown = tree;

  for (const segment of segments) {
    if (!cursor || typeof cursor !== "object") {
      return undefined;
    }

    cursor = (cursor as Record<string, unknown>)[segment];
    if (cursor === undefined) {
      return undefined;
    }
  }

  return typeof cursor === "string" ? cursor : undefined;
}

function reportMissingKey(locale: Language, key: MessageKey) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const reportId = `${locale}:${key}`;
  if (reportedMissingKeys.has(reportId)) {
    return;
  }

  reportedMissingKeys.add(reportId);
  console.warn(`[i18n] Missing translation for key "${key}" in locale "${locale}".`);
}

export function resolveMessage(locale: Language, key: MessageKey): string {
  const localizedMessage = readMessage(messages[locale], key);
  if (localizedMessage) {
    return localizedMessage;
  }

  const fallbackMessage = readMessage(messages[defaultLanguage], key);
  reportMissingKey(locale, key);

  return fallbackMessage ?? key;
}
