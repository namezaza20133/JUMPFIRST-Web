import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JUMPFIRST",
  description: "Jump First - Think later",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <I18nProvider>
          <ScrollReveal />
          <SiteHeader />
          {children}
          <SiteFooter />
          <BackToTopButton />
        </I18nProvider>
      </body>
    </html>
  );
}
