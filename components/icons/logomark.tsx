/**
 * Diamond node + center point — the "decision node" symbol used in system
 * diagrams, doubling as a monogram. Reused for the navbar mark and the
 * generated favicon/apple-icon so the brand mark stays a single source.
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 2.5L21.5 12L12 21.5L2.5 12L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.25" className="fill-accent" />
    </svg>
  );
}
