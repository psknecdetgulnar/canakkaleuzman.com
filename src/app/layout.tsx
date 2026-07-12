import type { Metadata } from "next";
import { Newsreader, Inter_Tight } from "next/font/google";
import "./globals.css";

// Türkçe glif kuralı (Design.md §2): latin-ext altkümesi ile ğ ş ı İ ç ö ü.
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-display",
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://canakkaleuzman.com"),
  title: {
    default: "Çanakkale Uzman — Yerel uzman dizini",
    template: "%s — Çanakkale Uzman",
  },
  description:
    "Çanakkale'deki uzmanlar: psikolog, diyetisyen, avukat, fizyoterapist. Profil incele, randevu talep et.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${newsreader.variable} ${interTight.variable} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
