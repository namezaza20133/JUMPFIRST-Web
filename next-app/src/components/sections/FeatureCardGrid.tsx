import type { CourseCardContent } from "@/lib/types/content";
import { useI18n } from "@/lib/i18n/I18nProvider";

type FeatureCardGridProps = {
  cards: CourseCardContent[];
};

export function FeatureCardGrid({ cards }: FeatureCardGridProps) {
  const { t } = useI18n();

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <article className="feature-card" key={card.id}>
          <h3>{t(card.titleKey)}</h3>
          <p>{t(card.descriptionKey)}</p>
          <span>{t(card.durationKey)}</span>
        </article>
      ))}
    </div>
  );
}
