"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { SiteNav } from "@/components/layout/SiteNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/">
          <span className="brand-logo-stack" aria-hidden="true">
            <Image
              className="brand-logo brand-logo-dark"
              src="/assets/logos/jumpfirst-logo.svg"
              alt=""
              width={160}
              height={160}
              priority
            />
            <Image
              className="brand-logo brand-logo-light"
              src="/assets/logos/jumpfirst-logo-lightmode.svg"
              alt=""
              width={160}
              height={160}
              priority
            />
          </span>
          <span className="brand-slogan">
            <span className="brand-line">
              JUMP <span className="brand-accent">FIRST</span>
            </span>
            <span className="brand-line">
              THINK <span className="brand-accent">LATER</span>
            </span>
          </span>
        </Link>

        <div className="header-right">
          <div className="nav-actions">
            <ThemeToggle />
            <LanguageToggle />
            <Link className="btn btn-secondary" href="/login">
              {t("common.auth.login")}
            </Link>
            <Link className="btn btn-primary" href="/register">
              {t("common.auth.register")}
            </Link>
          </div>

          <SiteNav />
        </div>
      </div>
    </header>
  );
}
