import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWorkSlugs, getWorkBySlug } from "@/lib/mdx";
import { MDX_PROSE_CLASS } from "@/components/mdx/prose";
import { LOCALES, LOCALE_HREFLANG, isLocale, localePath } from "@/lib/i18n";

export async function generateStaticParams() {
  const slugs = await getAllWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const work = await getWorkBySlug(slug, locale).catch(() => null);
  if (!work) return {};

  return {
    title: work.frontmatter.title,
    description: work.frontmatter.summary,
    alternates: {
      canonical: localePath(locale, `/work/${slug}`),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], localePath(l, `/work/${slug}`)]),
      ),
    },
  };
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const work = await getWorkBySlug(slug, locale).catch(() => null);
  if (!work) {
    notFound();
  }

  const { content, frontmatter } = work;

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-12 border-b border-border pb-8">
        <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {frontmatter.period ?? frontmatter.date}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-fg sm:text-h1">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-body text-muted-foreground">{frontmatter.summary}</p>
        {frontmatter.tech?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {frontmatter.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-border px-2.5 py-1 font-mono text-caption text-muted-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className={MDX_PROSE_CLASS}>{content}</div>
    </article>
  );
}
