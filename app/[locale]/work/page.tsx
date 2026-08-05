import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWork } from "@/lib/mdx";
import { WorkCard } from "@/components/sections/work-preview";
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
    title: dict.meta.workTitle,
    description: dict.meta.workDescription,
    alternates: {
      canonical: localePath(locale, "/work"),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], localePath(l, "/work")]),
      ),
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const allWork = await getAllWork(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="mb-4 text-center font-display text-4xl font-semibold text-fg sm:text-h1">
        {dict.work.pageHeading}
      </h1>
      <p className="mx-auto mb-16 max-w-xl text-center text-body text-muted-foreground">
        {dict.work.pageIntro}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {allWork.map((item) => (
          <WorkCard key={item.slug} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}
