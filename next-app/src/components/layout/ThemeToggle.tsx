"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "jumpfirst-theme";
const THEME_CHANGE_EVENT = "jumpfirst-theme-change";

function applyTheme(mode: ThemeMode) {
  if (mode === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    return;
  }
  document.documentElement.removeAttribute("data-theme");
}

function getThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
  };
}

export function ThemeToggle() {
  const { t } = useI18n();
  const mode = useSyncExternalStore(subscribeToThemeChanges, getThemeMode, () => "dark");

  useEffect(() => {
    applyTheme(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      className="theme-switch"
      type="button"
      onClick={toggleTheme}
      aria-pressed={mode === "light"}
      aria-label={
        mode === "light" ? t("common.theme.switchToDark") : t("common.theme.switchToLight")
      }
    >
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
      <span className="theme-switch-label">
        {mode === "light" ? t("common.theme.light") : t("common.theme.dark")}
      </span>
    </button>
  );
}
