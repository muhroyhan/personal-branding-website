"use client";

import { motion } from "motion/react";

/**
 * λ — the recurring mark tying the classical theme to the engineering one.
 * Not decoration for its own sake: lambda is a Greek letter, and it's also
 * the namesake of lambda calculus (Alonzo Church) — the formal system
 * functional programming and anonymous functions trace back to. The site's
 * "greek subset" on the display font exists specifically so this glyph
 * renders in-family rather than falling back to a mismatched system serif.
 */
export function LambdaMark({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`font-lambda inline-block leading-none text-accent select-none ${className ?? ""}`}
    >
      λ
    </motion.span>
  );
}
