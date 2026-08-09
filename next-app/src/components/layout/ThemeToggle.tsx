"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "jumpfirst-theme";

function applyTheme(mode: ThemeMode) {
  if (mode === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    return;
  }
  document.documentElement.removeAttribute("data-theme");
}

export function ThemeToggle() {
  const { t } = useI18n();
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      setMode(saved);
      return;
    }

    const systemPreferredMode: ThemeMode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setMode(systemPreferredMode);
  }, []);

  useEffect(() => {
    applyTheme(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
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
