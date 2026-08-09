"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
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
const LANGUAGE_CHANGE_EVENT = "jumpfirst-language-change";

function getInitialLanguage(): Language {
  return defaultLanguage;
}

function getLanguage(): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const saved = window.localStorage.getItem(languageStorageKey);
  if (saved === "th" || saved === "en") {
    return saved;
  }

  return navigator.language.toLowerCase().startsWith("th") ? "th" : "en";
}

function subscribeToLanguageChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleChange);
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribeToLanguageChanges, getLanguage, getInitialLanguage);
  const setLanguage = useCallback((nextLanguage: Language) => {
    window.localStorage.setItem(languageStorageKey, nextLanguage);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

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
    [language, setLanguage]
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
