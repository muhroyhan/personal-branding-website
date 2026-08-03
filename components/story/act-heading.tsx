import type { StoryAct } from "@/lib/constants";

/**
 * The year spine: replaces section numbering across the homepage so the page
 * reads as one chronology rather than a catalogue. The role line doubles as
 * the career timeline, distributed across the story instead of listed twice.
 */
export function ActHeading({ act }: { act: StoryAct }) {
  return (
    <header className="mb-10 flex flex-col gap-3">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-h3 font-semibold text-accent tabular-nums">
          {act.year}
        </span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
      <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
        {act.role}
      </p>
      <h2 className="font-display text-h2 font-semibold text-fg">{act.title}</h2>
    </header>
  );
}
