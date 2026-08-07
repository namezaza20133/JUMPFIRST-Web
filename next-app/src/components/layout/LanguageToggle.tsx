"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label="Language switcher">
      <button
        className={`lang-option ${language === "th" ? "active" : ""}`}
        type="button"
        aria-pressed={language === "th"}
        onClick={() => setLanguage("th")}
      >
        TH
      </button>
      <button
        className={`lang-option ${language === "en" ? "active" : ""}`}
        type="button"
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
