"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const navItems: Array<{ href: string; key: MessageKey }> = [
  { href: "/", key: "common.nav.home" },
  { href: "/courses", key: "common.nav.courses" },
  { href: "/member-dashboard", key: "common.nav.dashboard" },
  { href: "/contact", key: "common.nav.contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
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
