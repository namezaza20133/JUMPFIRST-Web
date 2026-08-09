import { RecoveryPageView } from "@/components/pages/RecoveryPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("login.recoveryTitle", "login.recoveryDesc");

export default function RecoveryPage() {
  return <RecoveryPageView />;
}