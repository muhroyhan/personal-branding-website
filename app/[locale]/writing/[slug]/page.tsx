import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWritingSlugs, getWritingBySlug } from "@/lib/mdx";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { MDX_PROSE_CLASS } from "@/components/mdx/prose";
import { LOCALES, LOCALE_HREFLANG, isLocale, localePath } from "@/lib/i18n";

export async function generateStaticParams() {
  const slugs = await getAllWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const writing = await getWritingBySlug(slug, locale).catch(() => null);
  if (!writing) return {};

  return {
    title: writing.frontmatter.title,
    description: writing.frontmatter.summary,
    alternates: {
      canonical: localePath(locale, `/writing/${slug}`),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], localePath(l, `/writing/${slug}`)]),
      ),
    },
  };
}

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const writing = await getWritingBySlug(slug, locale).catch(() => null);
  if (!writing) {
    notFound();
  }

  const { content, frontmatter } = writing;

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <ReadingProgress />
      <header className="mb-12 border-b border-border pb-8">
        <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {frontmatter.date}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-fg sm:text-h1">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-body text-muted-foreground">{frontmatter.summary}</p>
        {frontmatter.tags?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-border px-2.5 py-1 font-mono text-caption text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className={MDX_PROSE_CLASS}>{content}</div>
    </article>
  );
}
