"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p>
          © {new Date().getFullYear()} {t("footer.rights")}
        </p>
        <p>{t("footer.tagline")}</p>
      </div>
    </footer>
  );
}
