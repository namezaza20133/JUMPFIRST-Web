import { RegisterPageView } from "@/components/pages/RegisterPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("register.title", "register.desc");

export default function RegisterPage() {
  return <RegisterPageView />;
}
