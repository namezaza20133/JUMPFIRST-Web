import { MemberDashboardPageView } from "@/components/pages/MemberDashboardPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("member.title", "member.desc");

export default function MemberDashboardPage() {
  return <MemberDashboardPageView />;
}
