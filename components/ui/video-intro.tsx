"use client";

import { useState } from "react";
import { VIDEO_INTRO_PATH } from "@/lib/constants";

/**
 * Renders nothing until `public/videos/intro.mp4` actually exists. Label and
 * player are hidden together so a reader never sees a caption over a broken
 * player — same activation story as `ProfilePhoto`: drop the file in, no
 * code change needed.
 */
export function VideoIntro({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div className={className}>
      <p className="mb-3 font-mono text-caption tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <video
        controls
        preload="metadata"
        onError={() => setFailed(true)}
        className="w-full rounded-lg border border-border-strong"
      >
        <source src={VIDEO_INTRO_PATH} type="video/mp4" />
      </video>
    </div>
  );
}
