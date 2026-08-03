"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";

const HEADLINE = "Every system breaks. I design for the moment it does.";
const SUBTITLE =
  "Tech Lead & Senior Software Engineer — 7+ years architecting backend systems that scale with the team, not just the traffic. I lean on systems thinking and a Stoic bias for what's controllable to make that hold under pressure.";

const HEADLINE_WORDS = HEADLINE.split(" ");

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const word: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// MotionConfig (root layout) sets reducedMotion="user", which automatically
// snaps transform-based transitions (y, scaleX) to their end state for
// prefers-reduced-motion users while still letting opacity fade — so the
// mount animation below stays a single source of truth for both cases,
// and SSR/CSR markup never has to fork on the media query.
export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[85vh] flex-col items-center justify-center gap-8 border-b border-border px-6 text-center"
    >
      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl font-display text-4xl font-semibold text-fg sm:text-h1"
      >
        {HEADLINE_WORDS.map((w, i) => (
          <Fragment key={i}>
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
            {i < HEADLINE_WORDS.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </motion.h1>

      <motion.span
        aria-hidden
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.65, 0, 0.35, 1] }}
        style={{ transformOrigin: "left" }}
        className="h-px w-24 bg-accent"
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="max-w-xl text-body text-muted-foreground"
      >
        {SUBTITLE}
      </motion.p>
    </section>
  );
}
