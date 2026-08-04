import { ACT_NOW_PARAGRAPHS, STORY_ACTS } from "@/lib/constants";
import { ActHeading } from "@/components/story/act-heading";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { ActSilhouette } from "@/components/motifs/act-silhouette";

const ACT = STORY_ACTS[4];

/**
 * Closes the loop opened in the hero and again in Act I. The question is
 * restated verbatim on purpose — the payoff only reads as a payoff if the
 * reader recognises it as the same question they were handed at second zero.
 */
export function ActFiveNow() {
  return (
    <section
      id={ACT.id}
      className="relative isolate overflow-hidden border-b border-border px-6 py-16 sm:py-20 lg:py-28"
    >
      <LiveBlueprint id="act-now" />
      <ActSilhouette variant="pediment" />

      <div className="mx-auto max-w-2xl">
        <ActHeading act={ACT} />

        <p className="mb-8 border-l-2 border-accent pl-5 font-display text-h4 leading-relaxed text-fg">
          So — the question from the beginning. How do you decide well without
          controlling the variables?
        </p>

        <div className="flex flex-col gap-5">
          {ACT_NOW_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className="text-body leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
