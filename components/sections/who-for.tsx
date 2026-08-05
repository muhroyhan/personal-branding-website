import type { Dictionary } from "@/lib/i18n";
import { CarvedText } from "@/components/motion/carved-text";
import { MeanderRule } from "@/components/motifs/meander-rule";

/**
 * Qualifier section, placed right before the contact CTA. StoryBrand-style:
 * names the reader's situation before asking them to act, and states
 * availability specifics up front so they don't have to be asked in a first
 * email.
 */
export function WhoFor({ dict }: { dict: Dictionary }) {
  const t = dict.whoFor;

  return (
    <section className="border-b border-border px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-16">
          <span className="font-mono text-caption tracking-wide text-accent uppercase">
            {t.eyebrow}
          </span>
          <CarvedText
            as="h2"
            text={t.heading}
            className="font-display text-h2 font-semibold text-fg"
          />
          <MeanderRule className="max-w-32 text-border-strong" />
          <p className="max-w-xl text-body text-muted-foreground">{t.intro}</p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {t.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-lg border border-border-strong bg-card p-5 text-body text-fg"
            >
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
          <span className="font-mono text-caption tracking-wide text-accent uppercase">
            {t.availabilityLabel}
          </span>
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-caption text-muted-foreground">
            {t.availability.map((fact, i) => (
              <li key={fact} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden className="h-3 w-px bg-border-strong" />
                ) : null}
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
