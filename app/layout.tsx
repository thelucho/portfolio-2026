import type { Metadata } from "next";
import { Averia_Serif_Libre, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import IntroLoader from "@/components/IntroLoader";

const averiaSerifLibre = Averia_Serif_Libre({
  variable: "--font-averia-serif-libre",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thelucho | Creative Developers",
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
      className={`${averiaSerifLibre.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col font-sans">
        <IntroLoader />
        <Header />
        {children}
      </body>
    </html>
  );
}
