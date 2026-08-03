import Link from "next/link";
import { getAllWork } from "@/lib/mdx";
import type { WorkListItem } from "@/types/work";

export function WorkCard({ item }: { item: WorkListItem }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-border-strong bg-card p-6 transition-colors hover:border-accent"
    >
      <div>
        <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {item.frontmatter.date}
        </p>
        <h3 className="mt-2 font-display text-h4 font-semibold text-fg transition-colors group-hover:text-accent">
          {item.frontmatter.title}
        </h3>
      </div>
      <p className="text-body text-muted-foreground">{item.frontmatter.summary}</p>
      {item.frontmatter.tech?.length ? (
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {item.frontmatter.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-caption text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}

export async function WorkPreview() {
  const allWork = await getAllWork();
  const items = allWork.slice(0, 2);

  return (
    <section id="work" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-h2 font-semibold text-fg">Selected Work</h2>
          <p className="max-w-xl text-body text-muted-foreground">
            A few production systems I&apos;ve architected and shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <WorkCard key={item.slug} item={item} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/work"
            className="font-mono text-caption tracking-wide text-accent uppercase transition-colors hover:text-fg"
          >
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
