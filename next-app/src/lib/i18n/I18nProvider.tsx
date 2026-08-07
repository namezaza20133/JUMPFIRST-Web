"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  defaultLanguage,
  languageStorageKey,
  Language,
  MessageKey,
  resolveMessage,
} from "@/lib/i18n/messages";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const saved = window.localStorage.getItem(languageStorageKey);
  if (saved === "th" || saved === "en") {
    return saved;
  }

  return navigator.language.toLowerCase().startsWith("th") ? "th" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: MessageKey) => resolveMessage(language, key),
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
