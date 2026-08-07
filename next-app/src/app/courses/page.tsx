import { CoursesPageView } from "@/components/pages/CoursesPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("courses.title", "courses.desc");

export default function CoursesPage() {
  return <CoursesPageView />;
}
