"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ARCHITECTURE_STORY, STORY_ACTS } from "@/lib/constants";
import { LiveBlueprint } from "@/components/motifs/live-blueprint";
import { ActHeading } from "@/components/story/act-heading";

const ACT = STORY_ACTS[2];

const COLS = [16, 96, 176, 256];
const PROJECT_W = 68;
const SQUARE = 12;
const CENTER_X = 170;

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Diagram state is derived entirely from `step` so the whole animation stays
 * a pure function of scroll position — no imperative timeline to keep in sync
 * with the copy in ARCHITECTURE_STORY.
 */
function StoryDiagram({ step }: { step: number }) {
  const visibleProjects = step === 0 ? 1 : step === 1 ? 2 : 3;
  const coreVisible = step >= 3;
  const converged = step >= 3;
  const settled = step >= 4;

  return (
    <svg
      viewBox="0 0 340 150"
      className="w-full"
      role="img"
      aria-label={`Architecture diagram, stage ${step + 1} of ${ARCHITECTURE_STORY.length}`}
    >
      {/* Per-project duplicated concerns — the waste the story is about. */}
      {COLS.slice(0, 3).map((col, projectIndex) =>
        [0, 1, 2, 3].map((slot) => {
          const baseX = col + 4 + slot * 16;
          const shown = projectIndex < visibleProjects && !converged;
          return (
            <motion.rect
              key={`${projectIndex}-${slot}`}
              x={baseX}
              y={76}
              width={SQUARE}
              height={SQUARE}
              rx={2}
              className="fill-muted-foreground"
              initial={false}
              animate={{
                opacity: shown ? 0.55 : 0,
                x: converged ? CENTER_X - (baseX + SQUARE / 2) : 0,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          );
        }),
      )}

      {/* Shared core — grows out from the centre as the squares collapse in. */}
      <motion.g
        initial={false}
        animate={{ opacity: coreVisible ? 1 : 0, scaleX: coreVisible ? 1 : 0.12 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect
          x={16}
          y={76}
          width={308}
          height={36}
          rx={6}
          className="fill-card stroke-accent"
          strokeWidth={1.5}
        />
        <text
          x={CENTER_X}
          y={98}
          textAnchor="middle"
          className="fill-accent font-mono"
          fontSize={9}
          letterSpacing={1.5}
        >
          SHARED CORE
        </text>
      </motion.g>

      {/* Connectors only appear once projects sit on the foundation. */}
      {COLS.map((col, index) => (
        <motion.line
          key={`connector-${index}`}
          x1={col + PROJECT_W / 2}
          y1={60}
          x2={col + PROJECT_W / 2}
          y2={76}
          className="stroke-accent"
          strokeWidth={1}
          initial={false}
          animate={{ opacity: settled && (index < 3 || settled) ? 0.7 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      ))}

      {COLS.map((col, index) => {
        const isNewcomer = index === 3;
        const shown = isNewcomer ? settled : index < visibleProjects;
        return (
          <motion.g
            key={`project-${index}`}
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <rect
              x={col}
              y={16}
              width={PROJECT_W}
              height={44}
              rx={6}
              className={
                isNewcomer
                  ? "fill-card stroke-accent"
                  : "fill-card stroke-border-strong"
              }
              strokeWidth={1.5}
              strokeDasharray={isNewcomer ? "4 3" : undefined}
            />
            <text
              x={col + PROJECT_W / 2}
              y={43}
              textAnchor="middle"
              className={isNewcomer ? "fill-accent font-mono" : "fill-muted-foreground font-mono"}
              fontSize={11}
            >
              {isNewcomer ? "NEW" : `P${index + 1}`}
            </text>
          </motion.g>
        );
      })}
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
      className="relative isolate border-b border-border px-6 py-28"
    >
      <LiveBlueprint id="act-decision" />

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl">
          <ActHeading act={ACT} />
          <p className="text-body leading-relaxed text-muted-foreground">
            This is the one that changed how I work. Scroll through it — the
            problem earns the solution rather than being told it.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-16">
          {/* Desktop offset centres the diagram against the copy, which sits
              at the viewport middle; mobile keeps it pinned under the navbar. */}
          <div className="sticky top-20 z-10 self-start bg-bg/90 py-4 backdrop-blur-sm lg:top-[calc(50vh-140px)] lg:bg-transparent lg:backdrop-blur-none">
            <StoryDiagram step={step} />
            <p className="mt-4 text-center font-mono text-caption tracking-wide text-accent uppercase">
              {ARCHITECTURE_STORY[step].caption}
            </p>
            <div
              aria-hidden
              className="mx-auto mt-4 flex w-fit items-center gap-1.5"
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

          <ol ref={stepsRef}>
            {ARCHITECTURE_STORY.map((entry, index) => (
              <li
                key={entry.id}
                className="flex min-h-[70vh] flex-col justify-center"
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
      </div>
    </section>
  );
}
