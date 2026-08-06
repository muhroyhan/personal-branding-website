"use client";

import { useEffect, useState } from "react";
import { VIDEO_INTRO_PATH } from "@/lib/constants";

/**
 * Renders nothing until `public/videos/intro.mp4` is confirmed to exist via
 * a HEAD request. Checking first — rather than rendering the player
 * optimistically and hiding it on `onError` like `ProfilePhoto` does for its
 * `<img>` — matters here specifically: a video needs a real network round
 * trip before the browser knows a source 404s, so the optimistic approach
 * left the label and an empty player visible for a beat on every load. An
 * `<img>` error fires fast enough that nobody notices the same gap.
 */
export function VideoIntro({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(VIDEO_INTRO_PATH, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setAvailable(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!available) return null;

  return (
    <div className={className}>
      <p className="mb-3 font-mono text-caption tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <video controls preload="metadata" className="w-full rounded-lg border border-border-strong">
        <source src={VIDEO_INTRO_PATH} type="video/mp4" />
      </video>
    </div>
  );
}
