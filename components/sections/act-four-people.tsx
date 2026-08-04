import { ACT_FOUR_PARAGRAPHS, STORY_ACTS } from "@/lib/constants";
import { ActHeading } from "@/components/story/act-heading";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { DichotomyBoard } from "@/components/sections/dichotomy";

const ACT = STORY_ACTS[3];

export function ActFourPeople() {
  return (
    <section
      id={ACT.id}
      className="relative isolate overflow-hidden border-b border-border px-6 py-16 sm:py-20 lg:py-28"
    >
      <LiveBlueprint id="act-people" />

      <div className="mx-auto max-w-2xl">
        <ActHeading act={ACT} />
        <div className="flex flex-col gap-5">
          {ACT_FOUR_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className="text-body leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <p className="mb-8 border-t border-border pt-8 text-body leading-relaxed text-muted-foreground">
          Seven years in, this is roughly how I sort it. Try a few before you
          read where I land — the disagreements are the interesting part.
        </p>
        <DichotomyBoard />
      </div>
    </section>
  );
}
