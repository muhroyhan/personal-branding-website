"use client";

import { useState } from "react";
import type { CareerNode } from "@/lib/constants";

export function TimelineNode({ node }: { node: CareerNode }) {
  const [pinned, setPinned] = useState(false);

  return (
    <li className="group relative pl-10">
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        aria-expanded={pinned}
        className="block w-full cursor-pointer text-left"
      >
        <span
          aria-hidden
          className={`absolute top-1.5 left-0 h-3 w-3 rounded-full border-2 transition-colors motion-reduce:transition-none ${
            pinned
              ? "border-accent bg-accent"
              : "border-border-strong bg-bg group-hover:border-accent"
          }`}
        />
        <span className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {node.period}
        </span>
        <h3 className="font-display text-h4 font-semibold text-fg">{node.role}</h3>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          pinned
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-md pt-2 text-body text-muted-foreground">{node.summary}</p>
        </div>
      </div>
    </li>
  );
}
