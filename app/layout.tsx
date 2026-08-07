import type { Metadata, Viewport } from "next";
import { Averia_Serif_Libre, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import IntroLoader from "@/components/IntroLoader";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";

const averiaSerifLibre = Averia_Serif_Libre({
  variable: "--font-averia-serif-libre",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thelucho | Creative Developer",
  description: "Thelucho is a creative developer with a passion for building web applications that are both functional and aesthetically pleasing.",
  applicationName: "Thelucho",
  appleWebApp: {
    capable: true,
    title: "Thelucho",
    statusBarStyle: "black-translucent",
  },
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
        <Script id="scroll-to-top-on-load" strategy="beforeInteractive">
          {`history.scrollRestoration="manual";window.scrollTo(0,0);`}
        </Script>
        <SmoothScroll>
          <CustomCursor />
          <IntroLoader />
          <PageTransition />
          <Header />
          <ScrollToTop />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
