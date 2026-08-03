"use client";

import { motion, useScroll } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 z-60 h-0.5 w-full origin-left bg-accent"
    />
  );
}
