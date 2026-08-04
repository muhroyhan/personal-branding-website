"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ARCHITECTURE_STORY, STORY_ACTS, SYLLOGISM } from "@/lib/constants";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { ActHeading } from "@/components/story/act-heading";
import { LambdaMark } from "@/components/motifs/lambda-mark";

const ACT = STORY_ACTS[3];

const EASE = [0.22, 1, 0.36, 1] as const;

// Payslip dots stand for people paid, not headcount to scale — 24 of them
// read as "many" without pretending to draw 800.
const DOT_COLS = 12;
const DOT_X0 = 38;
const DOT_GAP = 24;
const DOT_ROW_Y = [24, 48];
const DOT_TOTAL = 24;
// Second row, mid-run: the one figure the story turns on.
const FLAGGED_DOT = 15;

const dotsShownAt = [4, 6, DOT_TOTAL, DOT_TOTAL, DOT_TOTAL];

/**
 * Diagram state is derived entirely from `step` so the whole animation stays
 * a pure function of scroll position — no imperative timeline to keep in sync
 * with the copy in ARCHITECTURE_STORY.
 *
 * Deliberately monochrome plus the single accent: the palette has one accent
 * by design, so the "wrong figure" beat is carried by a ring and a scale bump
 * rather than by introducing an alarm colour the rest of the site never uses.
 */
function StoryDiagram({ step }: { step: number }) {
  const shown = dotsShownAt[step] ?? DOT_TOTAL;
  const flagged = step === 2;
  const verified = step >= 3;
  const settled = step >= 4;

  return (
    <svg
      viewBox="0 0 340 150"
      className="w-full"
      role="img"
      aria-label={`Payroll system diagram, stage ${step + 1} of ${ARCHITECTURE_STORY.length}`}
    >
      {Array.from({ length: DOT_TOTAL }, (_, i) => {
        const cx = DOT_X0 + (i % DOT_COLS) * DOT_GAP;
        const cy = DOT_ROW_Y[Math.floor(i / DOT_COLS)];
        const isFlagged = i === FLAGGED_DOT;
        const visible = i < shown;
        return (
          <motion.circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r={4}
            className={
              isFlagged && (flagged || verified)
                ? "fill-accent"
                : "fill-muted-foreground"
            }
            initial={false}
            animate={{
              opacity: visible ? (isFlagged && flagged ? 1 : 0.5) : 0,
              scale: isFlagged && flagged ? 1.6 : 1,
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            transition={{ duration: 0.45, ease: EASE, delay: visible ? i * 0.012 : 0 }}
          />
        );
      })}

      {/* Ring marking the figure that cannot be explained yet. */}
      <motion.circle
        cx={DOT_X0 + (FLAGGED_DOT % DOT_COLS) * DOT_GAP}
        cy={DOT_ROW_Y[1]}
        r={10}
        fill="none"
        className="stroke-accent"
        strokeWidth={1}
        initial={false}
        animate={{ opacity: flagged ? 0.9 : 0, scale: flagged ? 1 : 0.6 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <g>
        <rect
          x={90}
          y={72}
          width={160}
          height={30}
          rx={6}
          className="fill-card stroke-border-strong"
          strokeWidth={1.5}
        />
        <text
          x={170}
          y={91}
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize={9}
          letterSpacing={1.5}
        >
          PAYROLL RUN
        </text>
      </g>

      {/* Connectors down to the audit layer, once it exists. */}
      {[120, 170, 220].map((x) => (
        <motion.line
          key={`connector-${x}`}
          x1={x}
          y1={102}
          x2={x}
          y2={114}
          className="stroke-accent"
          strokeWidth={1}
          initial={false}
          animate={{ opacity: verified ? 0.7 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      ))}

      <motion.g
        initial={false}
        animate={{ opacity: verified ? 1 : 0, scaleX: verified ? 1 : 0.12 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect
          x={38}
          y={114}
          width={264}
          height={28}
          rx={6}
          className="fill-card stroke-accent"
          strokeWidth={1.5}
          strokeDasharray={settled ? undefined : "4 3"}
        />
        <text
          x={170}
          y={132}
          textAnchor="middle"
          className="fill-accent font-mono"
          fontSize={9}
          letterSpacing={1.5}
        >
          RE-DERIVABLE FROM INPUTS
        </text>
      </motion.g>
    </svg>
  );
}

export function ArchitectureStory() {
  const stepsRef = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.floor(progress * ARCHITECTURE_STORY.length);
    setStep(Math.min(ARCHITECTURE_STORY.length - 1, Math.max(0, next)));
  });

  return (
    // No overflow-hidden here: it would turn this section into a scroll
    // container and stop the sticky diagram below from ever sticking.
    <section
      id={ACT.id}
      className="relative isolate border-b border-border px-6 py-16 sm:py-20 lg:py-28"
    >
      <LiveBlueprint id="act-payroll" />

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl sm:mb-16">
          <ActHeading act={ACT} />
          <p className="text-body leading-relaxed text-muted-foreground">
            Two years, two systems, one engineer on each — traded between them
            whenever one needed to move faster. Scroll through it — the problem
            earns the solution rather than being told it.
          </p>
        </div>

        {/*
          Block on mobile, two-column grid from lg. This is load-bearing: as a
          single-column *grid*, the sticky child below is trapped in a grid area
          only as tall as itself and never pins. As a block, its containing
          block becomes this whole wrapper — tall enough to pin against — so the
          same scroll-driven diagram works on phones too.
        */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Mobile pins it under the navbar (h-16) as a full-bleed bar;
              desktop parks it at the vertical middle beside the copy. */}
          <div className="sticky top-16 z-10 -mx-6 border-b border-border bg-bg px-6 py-4 lg:top-[calc(50vh-140px)] lg:mx-0 lg:self-start lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0">
            {/* Capped on mobile so the pinned graphic never eats more than
                about a fifth of the viewport, leaving the copy room to read. */}
            <div className="mx-auto max-w-72 lg:max-w-none">
              <StoryDiagram step={step} />
            </div>
            <p className="mt-3 text-center font-mono text-caption tracking-wide text-accent uppercase lg:mt-4">
              {ARCHITECTURE_STORY[step].caption}
            </p>
            <div
              aria-hidden
              className="mx-auto mt-3 flex w-fit items-center gap-1.5 lg:mt-4"
            >
              {ARCHITECTURE_STORY.map((entry, index) => (
                <span
                  key={entry.id}
                  className={`h-1 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    index === step ? "w-6 bg-accent" : "w-1.5 bg-border-strong"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* svh, not vh: mobile browsers resize the viewport as their chrome
              hides on scroll, which makes vh-based steps jump mid-animation. */}
          <ol ref={stepsRef} className="pt-8 lg:pt-0">
            {ARCHITECTURE_STORY.map((entry, index) => (
              <li
                key={entry.id}
                className="flex min-h-[42svh] flex-col justify-center lg:min-h-[70svh]"
              >
                <p
                  className={`max-w-md text-body leading-relaxed transition-colors duration-300 motion-reduce:transition-none ${
                    index === step ? "text-fg" : "text-muted-foreground/45"
                  }`}
                >
                  {entry.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Formal close: the five beats above are how the reasoning was
            lived; this is the same argument checked in Aristotelian form —
            proof that the story wasn't just a nicer way to state a feeling. */}
        <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-border-strong bg-card p-6 sm:mt-20 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <LambdaMark className="text-h4" />
            <p className="font-mono text-caption tracking-wide text-muted-foreground uppercase">
              Stated formally
            </p>
          </div>
          <dl className="flex flex-col gap-4">
            {SYLLOGISM.map((line) => (
              <div key={line.label}>
                <dt className="font-mono text-caption tracking-wide text-accent uppercase">
                  {line.label}
                </dt>
                <dd
                  className={`mt-1 text-body leading-relaxed ${
                    line.label === "Conclusion" ? "font-medium text-fg" : "text-muted-foreground"
                  }`}
                >
                  {line.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
