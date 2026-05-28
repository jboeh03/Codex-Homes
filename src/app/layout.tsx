import type { Metadata } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Cursor } from "@/components/motion/cursor";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Codex Homes — Bespoke Kitchen, Bath & Whole-Home Renovation in Cincinnati",
    template: "%s · Codex Homes",
  },
  description:
    "A Cincinnati atelier for bespoke residential renovation. Considered design, master craftsmanship, and a build experience as refined as the homes we make.",
  metadataBase: new URL("https://www.codex.homes"),
  openGraph: {
    title: "Codex Homes — The art of the considered home.",
    description:
      "Bespoke kitchens, baths, and whole-home renovations for Greater Cincinnati's finest residences.",
    type: "website",
    url: "https://www.codex.homes",
    siteName: "Codex Homes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-background)]">
        <Cursor />
        <SmoothScroll>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
