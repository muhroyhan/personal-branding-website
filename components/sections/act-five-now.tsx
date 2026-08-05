import { ACT_ANCHORS, ACT_NUMERALS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { ActHeading } from "@/components/story/act-heading";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { ActSilhouette } from "@/components/motifs/act-silhouette";

/**
 * Closes the loop opened in the hero and again in Act I. The question is
 * restated verbatim on purpose — the payoff only reads as a payoff if the
 * reader recognises it as the same question they were handed at second zero.
 */
export function ActFiveNow({ dict }: { dict: Dictionary }) {
  const act = dict.acts.now;

  return (
    <section
      id={ACT_ANCHORS.now}
      className="relative isolate overflow-hidden border-b border-border px-6 py-16 sm:py-20 lg:py-28"
    >
      <LiveBlueprint id="act-now" />
      <ActSilhouette variant="pediment" />

      <div className="mx-auto max-w-2xl">
        <ActHeading
          numeral={ACT_NUMERALS.now}
          year={act.year}
          role={act.role}
          title={act.title}
        />

        <p className="mb-8 border-l-2 border-accent pl-5 font-display text-h4 leading-relaxed text-fg">
          {act.question}
        </p>

        <div className="flex flex-col gap-5">
          {act.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-body leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
