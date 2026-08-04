"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// MotionConfig (root layout) has reducedMotion="user", which snaps this y
// transform to its end state for prefers-reduced-motion users while still
// letting the opacity fade play — same mechanism as the hero animation.
//
// `once: false`: sections fade back out above the fold and re-enter on the
// way back up, so scrolling in either direction feels equally alive rather
// than only "arming" once on the way down.
export function ScrollReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
