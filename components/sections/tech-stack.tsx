import { TECH_STACK_GROUPS } from "@/lib/constants";
import { CarvedText } from "@/components/motion/carved-text";
import { MeanderRule } from "@/components/motifs/meander-rule";

export function TechStack() {
  return (
    <section id="stack" className="border-b border-border px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-16">
          <span className="font-mono text-caption tracking-wide text-accent uppercase">
            The evidence
          </span>
          <CarvedText
            as="h2"
            text="Tech Stack"
            className="font-display text-h2 font-semibold text-fg"
          />
          <MeanderRule className="max-w-32 text-border-strong" />
          <p className="max-w-xl text-body text-muted-foreground">
            The tools I reach for — chosen for what stays boring under pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12">
          {TECH_STACK_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="mb-4 font-mono text-caption tracking-wide text-accent uppercase">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-caption text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
