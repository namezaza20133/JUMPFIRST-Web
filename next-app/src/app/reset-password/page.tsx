import { Suspense } from "react";
import { ResetPasswordPageView } from "@/components/pages/ResetPasswordPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("login.resetTitle", "login.resetDesc");

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageView />
    </Suspense>
  );
}
