import type { MemberMetricContent } from "@/lib/types/content";
import { useI18n } from "@/lib/i18n/I18nProvider";

type MetricsGridProps = {
  items: MemberMetricContent[];
};

export function MetricsGrid({ items }: MetricsGridProps) {
  const { t } = useI18n();

  return (
    <div className="dashboard-metrics">
      {items.map((metric) => (
        <article className="feature-card" key={metric.id}>
          <h3>{t(metric.titleKey)}</h3>
          <p className="metric-value">{t(metric.valueKey)}</p>
          <span>{t(metric.descriptionKey)}</span>
        </article>
      ))}
    </div>
  );
}
