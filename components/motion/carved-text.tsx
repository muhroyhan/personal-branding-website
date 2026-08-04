"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

// Rises out of the surface rather than sliding across it — the intent is
// lettering being cut into stone, not text flying in.
const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(3px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Word-by-word reveal for headings. MotionConfig (root layout) sets
 * reducedMotion="user", which snaps the y transform for users who ask for it
 * while still letting opacity fade — so this stays one code path.
 *
 * `once: false`: the reveal reverses (words sink back, re-blur) when scrolled
 * back out of view, so scrolling up through the story re-plays it rather than
 * leaving every heading already "spent" — the whole page stays alive in both
 * scroll directions instead of only working top-to-bottom.
 *
 * Words are wrapped in inline-block spans, so `text` must be a plain string;
 * markup inside would be flattened.
 */
export function CarvedText({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const MotionTag = motion[Tag];
  const words = text.split(" ");

  return (
    <MotionTag
      variants={container}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: false, amount: 0.5 }}
      className={className}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </MotionTag>
  );
}
