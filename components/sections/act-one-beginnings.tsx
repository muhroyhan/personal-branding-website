import { ACT_ONE_PARAGRAPHS, STORY_ACTS } from "@/lib/constants";
import { ActHeading } from "@/components/story/act-heading";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";

const ACT = STORY_ACTS[0];

export function ActOneBeginnings() {
  return (
    <section
      id={ACT.id}
      className="relative isolate overflow-hidden border-b border-border px-6 py-28"
    >
      <LiveBlueprint id="act-one" />

      <div className="mx-auto max-w-2xl">
        <ActHeading act={ACT} />
        <div className="flex flex-col gap-5">
          {ACT_ONE_PARAGRAPHS.map((paragraph, index) => (
            <p key={index} className="text-body leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
