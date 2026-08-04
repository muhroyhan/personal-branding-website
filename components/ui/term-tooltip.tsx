"use client";

import { useId } from "react";
import type { ReactNode } from "react";

export function Term({
  definition,
  children,
}: {
  definition: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        aria-describedby={id}
        className="cursor-help border-b border-dotted border-muted-foreground/60 outline-none focus-visible:border-accent"
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-md border border-border-strong bg-card px-3 py-2 text-left font-sans text-caption leading-snug normal-case text-muted-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {definition}
      </span>
    </span>
  );
}
