import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CONTACT_LINKS, SITE_URL } from "@/lib/constants";
import "./globals.css";

// Display: a Garamond cut carries the classical register at long headline
// lengths, where a true inscriptional face would get hard to read.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Reserved for Roman numerals and short carved labels only — Cinzel is drawn
// from Trajan's column capitals and is deliberately not used for running text.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

// Cormorant Garamond has no Greek glyphs (next/font confirms: only latin,
// latin-ext, cyrillic, cyrillic-ext, vietnamese). EB Garamond is the closest
// stylistic relative that does carry a Greek subset, so it's loaded
// separately and used nowhere except the λ mark.
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin", "greek"],
  weight: ["500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_TITLE = "Muhammad Royhan — Senior Fullstack Engineer";
const SITE_DESCRIPTION =
  "Portfolio of Muhammad Royhan, a Senior Fullstack Engineer with seven years and three promotions at one company — banking, marketplace, and payroll systems built to stay explainable after handover.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Muhammad Royhan",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Muhammad Royhan",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Royhan",
  jobTitle: "Senior Fullstack Engineer",
  url: SITE_URL,
  sameAs: [CONTACT_LINKS.linkedin, CONTACT_LINKS.github],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cinzel.variable} ${ebGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionConfig reducedMotion="user">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
