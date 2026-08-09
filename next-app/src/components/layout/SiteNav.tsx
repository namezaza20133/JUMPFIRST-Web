"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { AuthSessionData } from "@/lib/types/services";

const navItems: Array<{ href: string; key: MessageKey }> = [
  { href: "/", key: "common.nav.home" },
  { href: "/courses", key: "common.nav.courses" },
  { href: "/member-dashboard", key: "common.nav.dashboard" },
  { href: "/contact", key: "common.nav.contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { t } = useI18n();
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

  const visibleNavItems = navItems.filter((item) => item.href !== "/member-dashboard" || session.authenticated);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      {visibleNavItems.map((item) => {
        const isCurrent = item.href === "/" ? pathname === "/" : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={isCurrent ? "active" : ""}
            aria-current={isCurrent ? "page" : undefined}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
