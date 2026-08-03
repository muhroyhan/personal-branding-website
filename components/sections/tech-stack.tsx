import { TECH_STACK_GROUPS } from "@/lib/constants";

export function TechStack() {
  return (
    <section id="stack" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-16 text-center font-display text-h2 font-semibold text-fg">
          Tech Stack
        </h2>

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
