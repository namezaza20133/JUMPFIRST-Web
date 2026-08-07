import { HomePageView } from "@/components/pages/HomePageView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("home.title", "home.desc");

export default function Home() {
  return <HomePageView />;
}
