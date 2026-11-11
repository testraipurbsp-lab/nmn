import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { IntroSplash } from "@/components/brand/IntroSplash";

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      description: site.description,
      sameAs: [site.social.instagram, site.social.github, site.social.linkedin].filter(Boolean),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} intro-active`} suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`.intro{display:none}.intro-active .mask-line>span,.intro-active .fade-in,.intro-active .draw{animation-play-state:running}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <IntroSplash />
        <ScrollProgress />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ChatWidget />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}