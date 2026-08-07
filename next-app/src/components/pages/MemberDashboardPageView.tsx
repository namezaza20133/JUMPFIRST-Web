"use client";

import { useCallback, useEffect, useState } from "react";
import { MetricsGrid } from "@/components/sections/MetricsGrid";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { memberService } from "@/lib/services/memberService";
import type { MemberMetricContent } from "@/lib/types/content";

export function MemberDashboardPageView() {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<MemberMetricContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await memberService.getMemberMetrics();
      setMetrics(response);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMetrics();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchMetrics]);

  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t("member.eyebrow")} title={t("member.title")} />

          {isLoading ? (
            <p className="section-status" role="status" aria-live="polite">
              {t("member.loading")}
            </p>
          ) : null}

          {hasError ? (
            <div className="section-status error" role="alert">
              <p>{t("member.loadError")}</p>
              <button className="btn btn-outline" type="button" onClick={() => void fetchMetrics()}>
                {t("member.retry")}
              </button>
            </div>
          ) : null}

          {!isLoading && !hasError ? <MetricsGrid items={metrics} /> : null}
        </div>
      </section>
    </main>
  );
}
