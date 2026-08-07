import { ContactPageView } from "@/components/pages/ContactPageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("contact.title", "contact.desc");

export default function ContactPage() {
  return <ContactPageView />;
}
