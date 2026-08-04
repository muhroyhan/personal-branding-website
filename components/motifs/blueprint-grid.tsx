/**
 * Low-opacity dot grid — "blueprint paper" backdrop reinforcing the
 * system-diagram motif (Logomark) used elsewhere on the site. `id` must be
 * unique per instance since SVG patterns are referenced by id in the DOM.
 */
export function BlueprintGrid({
  id,
  className,
  dotClassName = "fill-border-strong",
}: {
  id: string;
  className?: string;
  dotClassName?: string;
}) {
  const patternId = `blueprint-grid-${id}`;

  return (
    <svg aria-hidden className={className} width="100%" height="100%">
      <defs>
        <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" className={dotClassName} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
