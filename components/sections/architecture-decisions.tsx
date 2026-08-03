import { ARCHITECTURE_DECISIONS } from "@/lib/constants";

export function ArchitectureDecisions() {
  return (
    <section id="decisions" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-caption tracking-wide text-muted-foreground/60 uppercase">
            §03 — Decisions
          </span>
          <h2 className="font-display text-h2 font-semibold text-fg">
            Architecture Decisions
          </h2>
          <p className="max-w-xl text-body text-muted-foreground">
            A few calls I made under uncertainty, and what I gave up to make them.
          </p>
        </div>

        <ol className="flex flex-col gap-6">
          {ARCHITECTURE_DECISIONS.map((decision, i) => (
            <li
              key={decision.id}
              className="rounded-lg border border-border-strong bg-card p-6"
            >
              <p className="font-mono text-caption tracking-wide text-accent uppercase">
                ADR-{String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-h4 font-semibold text-fg">
                {decision.title}
              </h3>

              <dl className="mt-4 flex flex-col gap-3">
                <div>
                  <dt className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
                    Context
                  </dt>
                  <dd className="mt-1 text-body text-muted-foreground">
                    {decision.context}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
                    Decision
                  </dt>
                  <dd className="mt-1 text-body text-fg">{decision.decision}</dd>
                </div>
                <div>
                  <dt className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
                    Trade-off
                  </dt>
                  <dd className="mt-1 text-body text-muted-foreground">
                    {decision.tradeoff}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
