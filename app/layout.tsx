import type { Metadata } from "next";
import { Averia_Serif_Libre, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import IntroLoader from "@/components/IntroLoader";
import SmoothScroll from "@/components/SmoothScroll";

const averiaSerifLibre = Averia_Serif_Libre({
  variable: "--font-averia-serif-libre",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thelucho | Creative Developer",
  description: "Thelucho is a creative developer with a passion for building web applications that are both functional and aesthetically pleasing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${averiaSerifLibre.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col overflow-x-clip font-sans">
        <Script id="scroll-to-top-on-load" strategy="beforeInteractive">
          {`history.scrollRestoration="manual";window.scrollTo(0,0);`}
        </Script>
        <SmoothScroll>
          <CustomCursor />
          <IntroLoader />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
