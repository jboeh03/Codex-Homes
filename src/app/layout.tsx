import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Codex Homes — Cincinnati Kitchen, Bath & Whole-Home Remodeling",
    template: "%s · Codex Homes",
  },
  description:
    "Cincinnati custom building and remodeling. Upload a photo of your room, pick the finishes you love, and see your remodel — with a real price range — before you ever schedule a consult.",
  metadataBase: new URL("https://www.codex.homes"),
  openGraph: {
    title: "Codex Homes — Cincinnati remodels, decoded.",
    description:
      "Custom kitchens, baths, and whole-home renovations built without the guesswork.",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
