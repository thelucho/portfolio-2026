import type { Metadata, Viewport } from "next";
import { Averia_Serif_Libre, Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

import CustomCursorGate from "@/components/CustomCursorGate";
import Header from "@/components/Header";
import IntroLoader from "@/components/IntroLoader";
import JsonLd from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import SkipToContent from "@/components/SkipToContent";
import SmoothScroll from "@/components/SmoothScroll";
import { siteGraphJsonLd } from "@/lib/seo";
import { SITE, SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/site";

const averiaSerifLibre = Averia_Serif_Libre({
  variable: "--font-averia-serif-libre",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const speculationRules = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: "/api/*" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.person.name, url: SITE.url }],
  creator: SITE.person.name,
  publisher: SITE.name,
  keywords: [...SITE_KEYWORDS],
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE_DESCRIPTION,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "black-translucent",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2B4625" },
    { media: "(prefers-color-scheme: dark)", color: "#2B4625" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-intro-pending=""
      className={`${averiaSerifLibre.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col overflow-x-clip font-sans">
        <JsonLd data={siteGraphJsonLd()} />
        <SkipToContent />
        <Script id="scroll-to-top-on-load" strategy="beforeInteractive">
          {`history.scrollRestoration="manual";window.scrollTo(0,0);`}
        </Script>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: speculationRules }}
        />
        <SmoothScroll>
          <CustomCursorGate />
          <IntroLoader />
          <PageTransition />
          <Header />
          <ScrollToTop />
          {children}
        </SmoothScroll>
      </body>
      {process.env.NODE_ENV === "production" ? (
        <GoogleAnalytics gaId={SITE.analytics.gaId} />
      ) : null}
    </html>
  );
}
