"use client";

import { useEffect, useState } from "react";
import { ACT_ANCHORS, ACT_KEYS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";

/**
 * Persistent story progress: shows which of the five acts the reader is in.
 * A measurable "2 of 5" is the Zeigarnik lever — an unfinished sequence is
 * what makes finishing feel worth doing.
 *
 * Observes a thin band at the viewport middle so the active act is whichever
 * one the reader is actually looking at, not merely whichever is on screen.
 */
export function StoryRail({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = ACT_KEYS.map((key) =>
      document.getElementById(ACT_ANCHORS[key]),
    ).filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={dict.nav.storyProgress}
      className="pointer-events-none fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col gap-4">
        {ACT_KEYS.map((key, index) => {
          const isActive = index === active;
          return (
            <li key={key}>
              <a
                href={`#${ACT_ANCHORS[key]}`}
                className="pointer-events-auto flex items-center gap-3 outline-none"
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  aria-hidden
                  className={`h-px transition-all duration-300 motion-reduce:transition-none ${
                    isActive ? "w-8 bg-accent" : "w-4 bg-border-strong"
                  }`}
                />
                <span
                  className={`font-mono text-caption tabular-nums transition-colors duration-300 motion-reduce:transition-none ${
                    isActive ? "text-accent" : "text-muted-foreground/50"
                  }`}
                >
                  {dict.acts[key].year}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
