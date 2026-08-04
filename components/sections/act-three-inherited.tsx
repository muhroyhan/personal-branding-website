import { ACT_THREE_PARAGRAPHS, STORY_ACTS } from "@/lib/constants";
import { ActHeading } from "@/components/story/act-heading";
import { ActSilhouette } from "@/components/motifs/act-silhouette";
import { DichotomyBoard } from "@/components/sections/dichotomy";

const ACT = STORY_ACTS[2];

/**
 * The low point of the story, and the only act with no blueprint backdrop:
 * the motif stands for structure you designed, and this act is about
 * structure you didn't. It returns in the next act, when the work is finally
 * his from the first commit. The narrower column and darker surface tighten
 * the reading rhythm to match.
 *
 * The Dichotomy board lives here rather than beside the leadership prose it
 * used to accompany — sorting what you can and can't control only lands once
 * the story has reached the year he was handed decisions he didn't make.
 */
export function ActThreeInherited() {
  return (
    <section
      id={ACT.id}
      className="relative isolate overflow-hidden border-b border-border bg-card/40 px-6 py-16 sm:py-20 lg:py-28"
    >
      {/* The blueprint stays absent here by design (see above), but a labyrinth
          is the opposite motif, not a return of it: being lost inside someone
          else's structure rather than reading one you drew. */}
      <ActSilhouette variant="labyrinth" />

      <div className="mx-auto max-w-xl">
        <ActHeading act={ACT} />
        <div className="flex flex-col gap-5">
          {ACT_THREE_PARAGRAPHS.map((paragraph, index) => {
            const isClosing = index === ACT_THREE_PARAGRAPHS.length - 1;
            return (
              <p
                key={index}
                className={
                  isClosing
                    ? "border-l-2 border-accent pl-5 text-body leading-relaxed text-fg"
                    : "text-body leading-relaxed text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            );
          })}
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
