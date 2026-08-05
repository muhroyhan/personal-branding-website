import { TESTIMONIALS } from "@/lib/testimonials";
import type { Dictionary, Locale } from "@/lib/i18n";
import { CarvedText } from "@/components/motion/carved-text";
import { MeanderRule } from "@/components/motifs/meander-rule";

/**
 * Renders nothing while `TESTIMONIALS` is empty — see `lib/testimonials.ts`
 * for how to add entries. Placed right after the work evidence and before
 * the ask, so third-party proof lands before the reader is asked to reach out.
 */
export function Testimonials({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  if (TESTIMONIALS.length === 0) return null;

  const t = dict.testimonials;

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
          {TESTIMONIALS.map((item) => (
            <li
              key={item.name}
              className="rounded-lg border border-border-strong bg-card p-5"
            >
              <p className="text-body text-fg">
                &ldquo;{locale === "id" && item.quoteId ? item.quoteId : item.quoteEn}&rdquo;
              </p>
              <p className="mt-4 font-mono text-caption tracking-wide text-muted-foreground uppercase">
                {item.name} · {item.role}
                {item.company ? ` · ${item.company}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
