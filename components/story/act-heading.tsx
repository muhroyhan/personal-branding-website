"use client";

import { motion } from "motion/react";
import type { StoryAct } from "@/lib/constants";
import { MeanderRule } from "@/components/motifs/meander-rule";
import { LambdaMark } from "@/components/motifs/lambda-mark";
import { CarvedText } from "@/components/motion/carved-text";

/**
 * The year spine, in a classical register: Roman act numeral beside the year,
 * a meander fret that wipes in beneath, then the title cutting itself in word
 * by word. The year and role stay plain and scannable — a recruiter reads the
 * career progression off these headings without reading a line of prose.
 */
export function ActHeading({ act }: { act: StoryAct }) {
  return (
    <header className="mb-10 flex flex-col gap-4">
      <div className="flex items-baseline gap-4">
        <span className="font-inscribed text-h4 leading-none text-accent">
          {act.numeral}
        </span>
        <span className="font-display text-h3 leading-none font-semibold text-accent tabular-nums">
          {act.year}
        </span>
        <motion.span
          aria-hidden
          className="h-px flex-1 bg-border"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* The λ seals the ornamental line — a scribe's flourish that also
          happens to be the mark of the exact logic system this site's
          reasoning traces back to. */}
      <div className="flex items-center gap-3">
        <MeanderRule className="max-w-40 text-border-strong" />
        <LambdaMark className="text-h4" />
      </div>

      <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
        {act.role}
      </p>

      <CarvedText
        as="h2"
        text={act.title}
        className="font-display text-h2 font-semibold text-fg"
      />
    </header>
  );
}
