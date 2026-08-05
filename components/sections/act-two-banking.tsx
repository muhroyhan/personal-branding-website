import { ACT_ANCHORS, ACT_NUMERALS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { ActHeading } from "@/components/story/act-heading";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { ActSilhouette } from "@/components/motifs/act-silhouette";

export function ActTwoBanking({ dict }: { dict: Dictionary }) {
  const act = dict.acts.banking;

  return (
    <section
      id={ACT_ANCHORS.banking}
      className="relative isolate overflow-hidden border-b border-border px-6 py-16 sm:py-20 lg:py-28"
    >
      <LiveBlueprint id="act-banking" />
      <ActSilhouette variant="balance" />

      <div className="mx-auto max-w-2xl">
        <ActHeading
          numeral={ACT_NUMERALS.banking}
          year={act.year}
          role={act.role}
          title={act.title}
        />
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
