import { Suspense } from "react";
import { LoginPageView } from "@/components/pages/LoginPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("login.title", "login.desc");

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageView />
    </Suspense>
  );
}
