import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWritingSlugs, getWritingBySlug } from "@/lib/mdx";
import { ReadingProgress } from "@/components/writing/reading-progress";

export async function generateStaticParams() {
  const slugs = await getAllWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug).catch(() => null);
  if (!writing) return {};

  return {
    title: writing.frontmatter.title,
    description: writing.frontmatter.summary,
  };
}

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const writing = await getWritingBySlug(slug).catch(() => null);
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

      <div
        className="[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-h3 [&_h2]:font-semibold [&_h2]:text-fg [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-h4 [&_h3]:font-semibold [&_h3]:text-fg [&_p]:mb-4 [&_p]:text-body [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-body [&_ul]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-fg [&_code]:rounded [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-caption [&_code]:text-fg"
      >
        {content}
      </div>
    </article>
  );
}
