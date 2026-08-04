"use client";

import { useEffect, useRef } from "react";
import { BlueprintGrid } from "./blueprint-grid";

const GLOW_MASK =
  "radial-gradient(190px circle at var(--mx, -1000px) var(--my, -1000px), #000 0%, transparent 72%)";

/**
 * Cursor-reactive backdrop: a dim base grid plus an accent-coloured copy
 * masked to a circle that tracks the pointer, so nodes near the cursor
 * appear to wake up. The overlay stays pointer-events-none and listens on
 * window instead, which keeps host sections as server components.
 *
 * Position is written straight to CSS custom properties (rAF-throttled) so
 * pointer movement never triggers a React render.
 */
export function LiveBlueprint({ id, className }: { id: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Touch/pen input has no hover position to follow — the base grid alone
    // is the intended fallback.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className ?? ""}`}
    >
      <BlueprintGrid id={`${id}-base`} className="absolute inset-0 opacity-[0.06]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{ maskImage: GLOW_MASK, WebkitMaskImage: GLOW_MASK }}
      >
        <BlueprintGrid
          id={`${id}-glow`}
          dotClassName="fill-accent"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
