"use client";

import { useCallback, useEffect, useState } from "react";
import { FeatureCardGrid } from "@/components/sections/FeatureCardGrid";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { coursesService } from "@/lib/services/coursesService";
import type { CourseCardContent } from "@/lib/types/content";

export function CoursesPageView() {
  const { t } = useI18n();
  const [cards, setCards] = useState<CourseCardContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await coursesService.listCourses();
      setCards(response);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCourses();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchCourses]);

  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t("courses.eyebrow")} title={t("courses.title")} />

          {isLoading ? (
            <p className="section-status" role="status" aria-live="polite">
              {t("courses.loading")}
            </p>
          ) : null}

          {hasError ? (
            <div className="section-status error" role="alert">
              <p>{t("courses.loadError")}</p>
              <button className="btn btn-outline" type="button" onClick={() => void fetchCourses()}>
                {t("courses.retry")}
              </button>
            </div>
          ) : null}

          {!isLoading && !hasError ? <FeatureCardGrid cards={cards} /> : null}
        </div>
      </section>
    </main>
  );
}
