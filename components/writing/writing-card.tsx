import Link from "next/link";
import type { WritingListItem } from "@/types/writing";

export function WritingCard({ item }: { item: WritingListItem }) {
  return (
    <Link
      href={`/writing/${item.slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-border-strong bg-card p-6 transition-all duration-200 hover:border-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
    >
      <div>
        <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {item.frontmatter.date}
        </p>
        <h3 className="mt-2 flex items-center gap-1.5 font-display text-h4 font-semibold text-fg transition-colors group-hover:text-accent">
          {item.frontmatter.title}
          <span className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </h3>
      </div>
      <p className="text-body text-muted-foreground">{item.frontmatter.summary}</p>
      {item.frontmatter.tags?.length ? (
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {item.frontmatter.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-caption text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}
