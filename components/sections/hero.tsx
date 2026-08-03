"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { Term } from "@/components/ui/term-tooltip";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";

const HEADLINE = "Every system breaks. I design for the moment it does.";

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
      className="relative isolate flex min-h-[85vh] flex-col items-center justify-center gap-8 overflow-hidden border-b border-border px-6 text-center"
    >
      <LiveBlueprint id="hero" />

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
        Tech Lead &amp; Senior Software Engineer — 7+ years architecting backend
        systems that scale with the team, not just the traffic. I lean on{" "}
        <Term definition="Understanding a system by how its parts affect each other over time, not by inspecting any one part in isolation.">
          systems thinking
        </Term>{" "}
        and a{" "}
        <Term definition="The Stoic dichotomy of control: spend effort only on what you can actually influence, and design for the rest.">
          Stoic bias for what&apos;s controllable
        </Term>{" "}
        to make that hold under pressure.
      </motion.p>

      {/* Open loop: the question this line points at is restated and answered
          in the final act, which is the whole reason to keep scrolling. */}
      <motion.a
        href="#act-beginnings"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="group mt-4 flex flex-col items-center gap-2 font-mono text-caption tracking-wide text-muted-foreground uppercase transition-colors hover:text-accent"
      >
        Seven years, three promotions, one question I still can&apos;t fully answer
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-y-1 motion-reduce:transition-none"
        >
          ↓
        </span>
      </motion.a>
    </section>
  );
}
