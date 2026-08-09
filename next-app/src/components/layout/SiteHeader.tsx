"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { SiteNav } from "@/components/layout/SiteNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { authService } from "@/lib/services/authService";
import type { AuthSessionData } from "@/lib/types/services";

export function SiteHeader() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [session, setSession] = useState<AuthSessionData>({ authenticated: false });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "include" });
        const payload = (await response.json()) as { success: boolean; data?: AuthSessionData };

        if (payload.success && payload.data) {
          setSession(payload.data);
        }
      } catch {
        setSession({ authenticated: false });
      }
    };

    void loadSession();

    const handleAuthChanged = () => {
      void loadSession();
    };

    window.addEventListener("auth:changed", handleAuthChanged);

    return () => {
      window.removeEventListener("auth:changed", handleAuthChanged);
    };
  }, [pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authService.logout();
      setSession({ authenticated: false });
      window.dispatchEvent(new Event("auth:changed"));
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  };

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
            {session.authenticated ? (
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
              >
                {t("common.auth.logout")}
              </button>
            ) : (
              <>
                <Link className="btn btn-secondary" href="/login">
                  {t("common.auth.login")}
                </Link>
                <Link className="btn btn-primary" href="/register">
                  {t("common.auth.register")}
                </Link>
              </>
            )}
          </div>

          <SiteNav />
        </div>
      </div>
    </header>
  );
}
