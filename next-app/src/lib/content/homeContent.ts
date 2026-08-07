import type { MessageKey } from "@/lib/i18n/messages";

export const homeHighlights: MessageKey[] = [
  "home.highlight1",
  "home.highlight2",
  "home.highlight3",
];

export const homeStats: Array<{ value: string; labelKey: MessageKey }> = [
  { value: "12", labelKey: "home.statCourses" },
  { value: "4", labelKey: "home.statSchedule" },
  { value: "99%", labelKey: "home.statSuccess" },
];
