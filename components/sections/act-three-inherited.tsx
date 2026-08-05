import { ACT_ANCHORS, ACT_NUMERALS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { ActHeading } from "@/components/story/act-heading";
import { ActSilhouette } from "@/components/motifs/act-silhouette";
import { DichotomyBoard } from "@/components/sections/dichotomy";

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
export function ActThreeInherited({ dict }: { dict: Dictionary }) {
  const act = dict.acts.inherited;

  return (
    <section
      id={ACT_ANCHORS.inherited}
      className="relative isolate overflow-hidden border-b border-border bg-card/40 px-6 py-16 sm:py-20 lg:py-28"
    >
      {/* The blueprint stays absent here by design (see above), but a labyrinth
          is the opposite motif, not a return of it: being lost inside someone
          else's structure rather than reading one you drew. */}
      <ActSilhouette variant="labyrinth" />

      <div className="mx-auto max-w-xl">
        <ActHeading
          numeral={ACT_NUMERALS.inherited}
          year={act.year}
          role={act.role}
          title={act.title}
        />
        <div className="flex flex-col gap-5">
          {act.paragraphs.map((paragraph, index) => {
            const isClosing = index === act.paragraphs.length - 1;
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
          {act.dichotomyIntro}
        </p>
        <DichotomyBoard dict={dict} />
      </div>
    </section>
  );
}
