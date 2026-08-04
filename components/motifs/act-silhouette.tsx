"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

export type SilhouetteVariant = "column" | "balance" | "labyrinth" | "pediment";

/**
 * Fixed pixel sizes on purpose: the artwork must never scale down with the
 * viewport. On narrow screens it simply gets cropped further, which keeps the
 * line weight and proportions identical everywhere.
 */
const ART: Record<
  SilhouetteVariant,
  { w: number; h: number; viewBox: string }
> = {
  column: { w: 540, h: 720, viewBox: "0 0 200 320" },
  balance: { w: 760, h: 700, viewBox: "0 0 300 280" },
  labyrinth: { w: 660, h: 660, viewBox: "0 0 320 320" },
  pediment: { w: 880, h: 616, viewBox: "0 0 400 280" },
};

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/** Ionic column — Act I: a structure already standing before you arrived. */
function ColumnArt() {
  const flutes = [74, 86, 98, 110, 122];
  return (
    <g {...STROKE}>
      <path d="M30 8 H170 V22 H30 Z" />
      <path d="M45 22 C40 42, 70 46, 72 30 C73 21, 58 21, 58 31" />
      <path d="M155 22 C160 42, 130 46, 128 30 C127 21, 142 21, 142 31" />
      <path d="M58 36 H142" />
      <path d="M62 40 V268" />
      <path d="M138 40 V268" />
      {flutes.map((x) => (
        <path key={x} d={`M${x} 48 V260`} />
      ))}
      <path d="M56 270 H144" />
      <path d="M50 282 H150" />
      <path d="M56 294 H144" />
      <path d="M44 298 H156 V314 H44 Z" />
    </g>
  );
}

/** Greek balance — Act II: "a misplaced figure is somebody's balance". */
function BalanceArt({ progress }: { progress: MotionValue<number> }) {
  // The beam tips through level as the section crosses the viewport, so the
  // scale reads as still settling rather than decorative.
  const rotate = useTransform(progress, [0, 0.5, 1], [-7, 0, 6]);

  return (
    <g {...STROKE}>
      <path d="M150 70 V230" />
      <path d="M150 230 L112 252" />
      <path d="M150 230 L188 252" />
      <path d="M104 254 H196" />
      <path d="M150 58 L141 72 H159 Z" />

      <motion.g style={{ rotate, transformBox: "view-box", transformOrigin: "150px 68px" }}>
        <path d="M40 68 H260" />
        <path d="M40 68 L18 96" />
        <path d="M40 68 L62 96" />
        <path d="M14 96 Q40 130 66 96" />
        <path d="M260 68 L238 96" />
        <path d="M260 68 L282 96" />
        <path d="M234 96 Q260 130 286 96" />
      </motion.g>
    </g>
  );
}

/** Square Cretan-style labyrinth — Act III: inside decisions you didn't make. */
function LabyrinthArt({ progress }: { progress: MotionValue<number> }) {
  const rotate = useTransform(progress, [0, 1], [-8, 8]);
  return (
    <motion.g
      {...STROKE}
      style={{ rotate, transformBox: "view-box", transformOrigin: "160px 160px" }}
    >
      <path d="M160 160 L160 140 L180 140 L180 180 L140 180 L140 120 L200 120 L200 200 L120 200 L120 100 L220 100 L220 220 L100 220 L100 80 L240 80 L240 240 L80 240 L80 60 L260 60 L260 260 L60 260 L60 40" />
    </motion.g>
  );
}

/** Temple front — Act V: the finished structure that holds without you. */
function PedimentArt() {
  const columns = [60, 130, 200, 270, 340];
  return (
    <g {...STROKE}>
      <path d="M20 110 L200 24 L380 110" />
      <path d="M48 104 L200 42 L352 104" />
      <path d="M8 110 H392" />
      <path d="M8 124 H392" />
      <path d="M24 124 H376" />
      <path d="M24 138 H376" />
      {columns.map((x) => (
        <g key={x}>
          <path d={`M${x - 20} 132 H${x + 20}`} />
          <path d={`M${x - 13} 138 V250`} />
          <path d={`M${x + 13} 138 V250`} />
        </g>
      ))}
      <path d="M12 250 H388" />
      <path d="M2 264 H398" />
    </g>
  );
}

/**
 * Large decorative silhouette pinned to the right edge of an act, with its
 * own half hanging off-screen. Drives a slow parallax from the section's
 * scroll progress so the artwork moves with the reader rather than sitting
 * still behind them.
 *
 * Readability is handled two ways, because on narrow screens this sits
 * directly behind the prose: opacity drops on small viewports, and a
 * left-to-right mask fades the artwork out on the side the text occupies.
 */
export function ActSilhouette({ variant }: { variant: SilhouetteVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const art = ART[variant];

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-0 -z-10 -translate-y-1/2 translate-x-[38%] opacity-[0.08] md:opacity-[0.18]"
      style={{
        width: art.w,
        height: art.h,
        // Fades only the leftmost sliver — the edge that reaches into the text
        // column. Fading further would erase the on-screen half itself, since
        // roughly the right 38% is already cropped off the viewport.
        maskImage: "linear-gradient(to right, transparent 0%, #000 20%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 20%)",
      }}
    >
      <motion.svg
        viewBox={art.viewBox}
        width={art.w}
        height={art.h}
        className="text-accent"
        style={{ y }}
      >
        {variant === "column" ? <ColumnArt /> : null}
        {variant === "balance" ? <BalanceArt progress={scrollYProgress} /> : null}
        {variant === "labyrinth" ? <LabyrinthArt progress={scrollYProgress} /> : null}
        {variant === "pediment" ? <PedimentArt /> : null}
      </motion.svg>
    </div>
  );
}
