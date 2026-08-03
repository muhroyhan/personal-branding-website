"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { CAREER_TIMELINE } from "@/lib/constants";
import { TimelineNode } from "@/components/motion/timeline-node";

export function CareerTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.6"],
  });

  const drawProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <section id="career" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-caption tracking-wide text-muted-foreground/60 uppercase">
            §02 — Career
          </span>
          <h2 className="font-display text-h2 font-semibold text-fg">Career Timeline</h2>
        </div>

        <div ref={trackRef} className="relative">
          <div
            aria-hidden
            className="absolute top-1.5 bottom-1.5 left-1.25 w-px bg-border"
          />
          {/*
            Draw the connector as the user scrolls: scaleY tracks scroll progress
            through this section rather than a one-shot reveal-on-view animation.
            See globals.css .timeline-draw for the prefers-reduced-motion override.
          */}
          <motion.div
            aria-hidden
            className="timeline-draw absolute top-1.5 bottom-1.5 left-1.25 w-px origin-top bg-accent"
            style={{ scaleY: drawProgress }}
          />

          <ol className="relative flex flex-col gap-10">
            {CAREER_TIMELINE.map((node) => (
              <TimelineNode key={node.id} node={node} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
