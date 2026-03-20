import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CashyLoot — Earn Rewards",
  description:
    "Earn rewards by completing offers, surveys, and tasks. Cash out via gift cards or PayPal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakarta.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="bg-mesh" aria-hidden="true" />
        <Navbar />
        <main className="flex-1 relative z-[1]">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
