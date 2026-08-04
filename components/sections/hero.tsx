"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { Term } from "@/components/ui/term-tooltip";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { MeanderRule } from "@/components/motifs/meander-rule";

const HEADLINE = "Competition kept me out. Obligation kept me in.";

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

// Matches CarvedText's language — lettering rising out of the surface with
// the blur resolving, rather than sliding in from the side.
const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
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
      className="relative isolate flex min-h-[75svh] flex-col items-center justify-center gap-6 overflow-hidden border-b border-border px-6 py-16 text-center sm:min-h-[85svh] sm:gap-8"
    >
      <LiveBlueprint id="hero" />

      {/* Byline: the page <title> is deliberately the philosophical line, not
          this name — so the name still needs to land somewhere a recruiter
          sees it in the first second, before the headline does its work. */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="font-mono text-caption tracking-wide text-muted-foreground uppercase"
      >
        Muhammad Royhan
      </motion.p>

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="w-40 text-accent"
      >
        <MeanderRule />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="max-w-xl text-body text-muted-foreground"
      >
        Senior Fullstack Engineer — backend and frontend — seven years and three
        promotions at one company. I lean on{" "}
        <Term definition="Understanding a system by how its parts affect each other over time, not by inspecting any one part in isolation.">
          systems thinking
        </Term>{" "}
        and a{" "}
        <Term definition="The Stoic dichotomy of control: spend effort only on what you can actually influence, and design for the rest.">
          Stoic bias for what&apos;s controllable
        </Term>{" "}
        to build software that holds up after I hand it over.
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
