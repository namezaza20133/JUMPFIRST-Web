import type { Metadata } from "next";
import { defaultLanguage, resolveMessage, type MessageKey } from "@/lib/i18n/messages";

const siteTitle = "JUMPFIRST";

export function createPageMetadata(titleKey: MessageKey, descriptionKey: MessageKey): Metadata {
  const title = resolveMessage(defaultLanguage, titleKey);
  const description = resolveMessage(defaultLanguage, descriptionKey);

  return {
    title: `${title} | ${siteTitle}`,
    description,
  };
}
