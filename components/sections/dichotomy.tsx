"use client";

import { useState } from "react";
import { DICHOTOMY_ITEMS, type DichotomyKey } from "@/lib/constants";
import { fill, type Dictionary } from "@/lib/i18n";

type Choice = "controllable" | "uncontrollable";

function DichotomyCard({
  itemKey,
  category,
  dict,
}: {
  itemKey: DichotomyKey;
  category: Choice;
  dict: Dictionary;
}) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const t = dict.dichotomy;
  const copy = t.items[itemKey];

  return (
    <li className="rounded-lg border border-border-strong bg-card p-5">
      <p className="text-body text-fg">{copy.label}</p>

      <div
        className="mt-4 flex gap-2"
        role="group"
        aria-label={fill(t.sortLabel, { item: copy.label })}
      >
        <button
          type="button"
          onClick={() => setChoice("controllable")}
          aria-pressed={choice === "controllable"}
          className={`rounded-md border px-3 py-1.5 font-mono text-caption tracking-wide uppercase transition-colors ${
            choice === "controllable"
              ? "border-accent text-accent"
              : "border-border-strong text-muted-foreground hover:text-fg"
          }`}
        >
          {t.controllable}
        </button>
        <button
          type="button"
          onClick={() => setChoice("uncontrollable")}
          aria-pressed={choice === "uncontrollable"}
          className={`rounded-md border px-3 py-1.5 font-mono text-caption tracking-wide uppercase transition-colors ${
            choice === "uncontrollable"
              ? "border-accent text-accent"
              : "border-border-strong text-muted-foreground hover:text-fg"
          }`}
        >
          {t.uncontrollable}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          choice ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="mt-4 border-t border-border pt-4 text-caption text-muted-foreground">
            <span className="font-mono text-accent uppercase">{t.verdictLabel}</span>
            {": "}
            {category === "controllable" ? t.controllable : t.uncontrollable} — {copy.note}
          </p>
        </div>
      </div>
    </li>
  );
}

/**
 * Embedded inside Act III rather than standing alone: sorting what you can and
 * can't control only lands once the story has reached the point where the
 * uncontrollable variables are people, not traffic.
 */
export function DichotomyBoard({ dict }: { dict: Dictionary }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {DICHOTOMY_ITEMS.map((item) => (
        <DichotomyCard
          key={item.id}
          itemKey={item.id}
          category={item.category}
          dict={dict}
        />
      ))}
    </ul>
  );
}
