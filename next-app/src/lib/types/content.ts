import type { MessageKey } from "@/lib/i18n/messages";

export type CourseCardContent = {
  id: string;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
  durationKey: MessageKey;
};

export type MemberMetricContent = {
  id: string;
  titleKey: MessageKey;
  valueKey: MessageKey;
  descriptionKey: MessageKey;
};
