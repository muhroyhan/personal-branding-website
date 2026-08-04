import { ACT_TWO_PARAGRAPHS, STORY_ACTS } from "@/lib/constants";
import { ActHeading } from "@/components/story/act-heading";

const ACT = STORY_ACTS[1];

/**
 * The low point of the story, and the only act with no blueprint backdrop:
 * the motif stands for structure, and structure is precisely what's missing
 * here. It returns in the next act, when the decision gets made. The narrower
 * column and darker surface tighten the reading rhythm to match.
 */
export function ActTwoCost() {
  return (
    <section
      id={ACT.id}
      className="border-b border-border bg-card/40 px-6 py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-xl">
        <ActHeading act={ACT} />
        <div className="flex flex-col gap-5">
          {ACT_TWO_PARAGRAPHS.map((paragraph, index) => {
            const isClosing = index === ACT_TWO_PARAGRAPHS.length - 1;
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
    </section>
  );
}
