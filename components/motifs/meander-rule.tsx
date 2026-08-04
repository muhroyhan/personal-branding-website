"use client";

import { motion } from "motion/react";

const TILE = 16;
const TILES = 9;
const WIDTH = TILE * TILES;

/**
 * Greek meander (key) fret, used as a short ornamental rule under headings.
 *
 * Each tile is emitted as its own subpath in a single `d`, which lets motion
 * animate `pathLength` across the whole run — the fret draws itself left to
 * right, one key at a time. (An earlier version tiled via <pattern> and wiped
 * with clip-path; clip-path never animated off its initial value, and a
 * pattern fill can't be stroke-dashed at all.)
 *
 * Fixed viewBox with default preserveAspectRatio: the rule scales uniformly
 * and never shears, which a stretched full-width fret would.
 */
// One inward spiral per tile. The turns are ordered so no segment ever crosses
// another — a self-intersecting path reads as a scribble, not a Greek key.
const D = Array.from({ length: TILES }, (_, i) => {
  const x = i * TILE;
  return `M${x} 12 L${x} 2 L${x + 12} 2 L${x + 12} 8 L${x + 4} 8 L${x + 4} 5 L${x + 9} 5`;
}).join(" ");

export function MeanderRule({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} 14`}
      fill="none"
      className={`block h-4 w-full ${className ?? ""}`}
    >
      <motion.path
        d={D}
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="square"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{
          pathLength: { duration: 1.7, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.25 },
        }}
      />
    </svg>
  );
}
