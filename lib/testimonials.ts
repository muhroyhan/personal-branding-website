export type Testimonial = {
  name: string;
  role: string;
  company?: string;
  quoteEn: string;
  /** Falls back to `quoteEn` when omitted — a testimonial is someone else's
   * words, not prose this site rewrites per locale the way the rest of the
   * copy is. Only add this if the person actually said it in Indonesian. */
  quoteId?: string;
};

/**
 * Empty by default — `components/sections/testimonials.tsx` renders nothing
 * until at least one entry exists here. Add real testimonials as they're
 * collected; each one appears automatically on both `/` and `/id`, no other
 * code change needed.
 */
export const TESTIMONIALS: Testimonial[] = [];
