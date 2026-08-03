"use client";

import { useState } from "react";
import { DICHOTOMY_ITEMS, type DichotomyItem } from "@/lib/constants";

type Choice = DichotomyItem["category"];

function DichotomyCard({ item }: { item: DichotomyItem }) {
  const [choice, setChoice] = useState<Choice | null>(null);

  return (
    <li className="rounded-lg border border-border-strong bg-card p-5">
      <p className="text-body text-fg">{item.label}</p>

      <div className="mt-4 flex gap-2" role="group" aria-label={`Sort: ${item.label}`}>
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
          Controllable
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
          Not controllable
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          choice ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="mt-4 border-t border-border pt-4 text-caption text-muted-foreground">
            <span className="font-mono text-accent uppercase">Where I land</span>
            {": "}
            {item.category === "controllable" ? "Controllable" : "Not controllable"} —{" "}
            {item.note}
          </p>
        </div>
      </div>
    </li>
  );
}

/**
 * Embedded inside Act IV rather than standing alone: sorting what you can and
 * can't control only lands once the story has reached the point where the
 * uncontrollable variables are people, not traffic.
 */
export function DichotomyBoard() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {DICHOTOMY_ITEMS.map((item) => (
        <DichotomyCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
