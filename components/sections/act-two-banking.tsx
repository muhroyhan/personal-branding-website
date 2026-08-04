import { ACT_TWO_PARAGRAPHS, STORY_ACTS } from "@/lib/constants";
import { ActHeading } from "@/components/story/act-heading";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { ActSilhouette } from "@/components/motifs/act-silhouette";

const ACT = STORY_ACTS[1];

export function ActTwoBanking() {
  return (
    <section
      id={ACT.id}
      className="relative isolate overflow-hidden border-b border-border px-6 py-16 sm:py-20 lg:py-28"
    >
      <LiveBlueprint id="act-banking" />
      <ActSilhouette variant="balance" />

      <div className="mx-auto max-w-2xl">
        <ActHeading act={ACT} />
        <div className="flex flex-col gap-5">
          <p className="text-body leading-relaxed text-fg">{ACT_TWO_PARAGRAPHS[0]}</p>
          <p className="text-body leading-relaxed text-fg">{ACT_TWO_PARAGRAPHS[1]}</p>
          <p className="text-body leading-relaxed text-fg">{ACT_TWO_PARAGRAPHS[2]}</p>
        </div>
      </div>
    </section>
  );
}
