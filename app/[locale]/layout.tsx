import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Cinzel, EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CONTACT_LINKS, SITE_URL } from "@/lib/constants";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_HREFLANG,
  getDictionary,
  isLocale,
  localePath,
} from "@/lib/i18n";
import "../globals.css";

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

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * `alternates.languages` is what makes the two-register strategy legible to
 * search engines: one person, two languages, neither a duplicate of the other.
 * Without hreflang, Google picks a winner and the Indonesian page ends up
 * competing with the English one instead of ranking for Indonesian queries.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: "%s — Muhammad Royhan",
    },
    description: dict.meta.description,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [LOCALE_HREFLANG[l], localePath(l, "/")])),
        "x-default": localePath(DEFAULT_LOCALE, "/"),
      },
    },
    openGraph: {
      type: "website",
      url: localePath(locale, "/"),
      siteName: "Muhammad Royhan",
      locale: locale === "id" ? "id_ID" : "en_US",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhammad Royhan",
    jobTitle: "Senior Fullstack Engineer",
    description: dict.meta.description,
    url: `${SITE_URL}${localePath(locale, "/")}`,
    knowsLanguage: ["en", "id"],
    sameAs: [CONTACT_LINKS.linkedin, CONTACT_LINKS.github],
  };

  return (
    <html
      lang={LOCALE_HREFLANG[locale]}
      className={`${cormorant.variable} ${cinzel.variable} ${ebGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionConfig reducedMotion="user">
          <Navbar locale={locale} dict={dict} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}
