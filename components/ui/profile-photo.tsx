"use client";

import { useState } from "react";
import { PROFILE_PHOTO_PATH } from "@/lib/constants";

/**
 * Renders nothing until `public/images/profile.jpg` actually exists — the
 * `onError` swallows the 404 instead of showing a broken-image icon, so this
 * is safe to leave mounted in production before the photo is ready. Once the
 * file is uploaded, it appears on the next load with no code change.
 */
export function ProfilePhoto({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // next/image would fail the build against a file that doesn't exist yet;
    // a plain <img> just 404s at runtime, which onError below handles.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={PROFILE_PHOTO_PATH}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
