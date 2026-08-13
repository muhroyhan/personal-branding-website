"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { HeroAskBar } from "@/components/chat/hero-ask-bar";
import { Term } from "@/components/ui/term-tooltip";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { MeanderRule } from "@/components/motifs/meander-rule";
import { ACT_ANCHORS, RESUME_PATH } from "@/lib/constants";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

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

const CTA_CLASS =
  "inline-flex items-center gap-2 rounded-md border px-5 py-2.5 font-mono text-caption tracking-wide uppercase transition-all duration-150 active:scale-95";

// MotionConfig (root layout) sets reducedMotion="user", which automatically
// snaps transform-based transitions (y, scaleX) to their end state for
// prefers-reduced-motion users while still letting opacity fade — so the
// mount animation below stays a single source of truth for both cases,
// and SSR/CSR markup never has to fork on the media query.
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const headlineWords = t.headline.split(" ");

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[75svh] flex-col items-center justify-center gap-6 overflow-hidden border-b border-border px-6 py-16 text-center sm:min-h-[85svh] sm:gap-7"
    >
      <LiveBlueprint id="hero" />

      {/* Identity block, ahead of the headline by design. The headline is the
          reason to keep reading; this is the reason a recruiter who gives the
          page four seconds still leaves knowing the role and the seniority.
          Before this existed, "Senior Fullstack Engineer" was the fourth
          element down and read as a caption. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="flex flex-col items-center gap-1.5"
      >
        <ProfilePhoto
          alt={t.name}
          className="mb-1.5 h-24 w-24 rounded-full border border-border-strong object-cover"
        />
        <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
          {t.name}
        </p>
        <p className="font-mono text-caption tracking-wide text-accent uppercase">
          {t.role}
        </p>
      </motion.div>

      {/* Problem-first line, ahead of the poetic headline: a recruiter with
          three seconds should learn what domain this is before the hook. */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="max-w-lg text-body font-medium text-fg"
      >
        {t.positioning}
      </motion.p>

      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl font-display text-4xl font-semibold text-fg sm:text-h1"
      >
        {headlineWords.map((w, i) => (
          <Fragment key={i}>
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
            {i < headlineWords.length - 1 ? " " : ""}
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
        {t.leadBefore}
        <Term definition={t.termOne.definition}>{t.termOne.label}</Term>
        {t.leadMiddle}
        <Term definition={t.termTwo.definition}>{t.termTwo.label}</Term>
        {t.leadAfter}
      </motion.p>

      {/* "Tanya tentang Royhan" ask bar — eager but featherweight (Task 7);
          the chat panel itself only loads once the user actually interacts
          (Task 8), so this costs nothing on first paint. */}
      <HeroAskBar locale={locale} dict={dict} />

      {/* The résumé PDF has been sitting in `public/` unlinked. A recruiter who
          wants the one-page version should never have to ask for it. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href={RESUME_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CTA_CLASS} border-accent bg-accent/10 text-accent hover:bg-accent/20`}
        >
          {t.ctaResume}
        </a>
        <Link
          href={localePath(locale, "/#work")}
          className={`${CTA_CLASS} border-border-strong text-fg hover:border-accent hover:text-accent`}
        >
          {t.ctaWork}
        </Link>
      </motion.div>

      {/* Four hard facts, scannable without reading a sentence. The five-act
          story argues for these at length; this is the version that survives a
          twenty-second skim. */}
      <motion.ul
        aria-label={t.proofLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.95 }}
        className="flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-border pt-6 font-mono text-caption text-muted-foreground"
      >
        {t.proof.map((fact, i) => (
          <li key={fact} className="flex items-center gap-3">
            {i > 0 ? (
              <span aria-hidden className="h-3 w-px bg-border-strong" />
            ) : null}
            {fact}
          </li>
        ))}
      </motion.ul>

      {/* Open loop: the question this line points at is restated and answered
          in the final act, which is the whole reason to keep scrolling. */}
      <motion.a
        href={`#${ACT_ANCHORS.beginnings}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.05 }}
        className="group mt-2 flex flex-col items-center gap-2 font-mono text-caption tracking-wide text-muted-foreground uppercase transition-colors hover:text-accent"
      >
        {t.scrollCue}
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
