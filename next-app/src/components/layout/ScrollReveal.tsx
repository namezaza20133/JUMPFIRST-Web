"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  ".hero-copy",
  ".hero-card",
  ".feature-card",
  ".info-card",
  ".register-panel",
  ".member-card",
  ".page-intro",
  ".section-heading",
  ".section-status",
].join(", ");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    const revealItems = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
    revealItems.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 315)}ms`);
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
