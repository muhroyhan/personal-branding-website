import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWriting } from "@/lib/mdx";
import { WritingCard } from "@/components/writing/writing-card";
import { LOCALES, LOCALE_HREFLANG, getDictionary, isLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: dict.meta.writingTitle,
    description: dict.meta.writingDescription,
    alternates: {
      canonical: localePath(locale, "/writing"),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], localePath(l, "/writing")]),
      ),
    },
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const allWriting = await getAllWriting(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="mb-4 text-center font-display text-4xl font-semibold text-fg sm:text-h1">
        {dict.writing.pageHeading}
      </h1>
      <p className="mx-auto mb-16 max-w-xl text-center text-body text-muted-foreground">
        {dict.writing.pageIntro}
      </p>
      {allWriting.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {allWriting.map((item) => (
            <WritingCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-center font-mono text-caption text-muted-foreground">
          {dict.writing.empty}
        </p>
      )}
    </div>
  );
}
