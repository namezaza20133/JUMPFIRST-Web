"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { homeHighlights, homeStats } from "@/lib/content/homeContent";

export function HomePageView() {
  const { t } = useI18n();

  return (
    <main className="page-main" id="home">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SectionHeading eyebrow={t("home.eyebrow")} title={t("home.title")} />
            <p>{t("home.desc")}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/register">
                {t("home.ctaRegister")}
              </Link>
              <Link className="btn btn-outline" href="/login">
                {t("home.ctaLogin")}
              </Link>
            </div>
            <ul className="hero-highlights">
              {homeHighlights.map((highlightKey) => (
                <li key={highlightKey}>{t(highlightKey)}</li>
              ))}
            </ul>
          </div>

          <div className="hero-card" aria-label={t("home.cardAria")}>
            <div className="card-top">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <div className="card-body">
              <h3>{t("home.cardTitle")}</h3>
              <div className="stats-grid">
                {homeStats.map((stat) => (
                  <div key={stat.labelKey}>
                    <strong>{stat.value}</strong>
                    <span>{t(stat.labelKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
