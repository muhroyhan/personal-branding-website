/**
 * Typography for compiled MDX bodies, shared by `/work/[slug]` and
 * `/writing/[slug]` so the two article types cannot drift apart.
 *
 * Arbitrary-variant selectors rather than a plugin: the site has exactly one
 * prose context and a handful of tokens, so `@tailwindcss/typography` would
 * mean overriding most of its defaults back to these anyway.
 */
export const MDX_PROSE_CLASS = [
  "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-h3 [&_h2]:font-semibold [&_h2]:text-fg",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-h4 [&_h3]:font-semibold [&_h3]:text-fg",
  "[&_p]:mb-4 [&_p]:text-body [&_p]:leading-relaxed [&_p]:text-muted-foreground",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-body [&_ul]:text-muted-foreground",
  "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:text-body [&_ol]:text-muted-foreground",
  "[&_li]:leading-relaxed",
  "[&_strong]:font-semibold [&_strong]:text-fg",
  "[&_em]:italic",
  "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-accent/40 hover:[&_a]:decoration-accent",
  "[&_code]:rounded [&_code]:bg-card [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-caption [&_code]:text-fg",
  // Fenced blocks: the inline `code` rules above would otherwise pill-box every
  // line inside a <pre>.
  "[&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-card [&_pre]:p-4",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-caption [&_pre_code]:leading-relaxed",
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-body [&_blockquote]:text-fg",
  // The at-a-glance summary tables at the top of the Indonesian case studies.
  // Wrapped for horizontal scroll so a narrow phone never widens the page.
  "[&_table]:mb-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-body",
  "[&_th]:border-b [&_th]:border-border-strong [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-mono [&_th]:text-caption [&_th]:tracking-wide [&_th]:text-accent [&_th]:uppercase",
  "[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-muted-foreground",
  "[&_td:first-child]:whitespace-nowrap [&_td:first-child]:text-fg",
  "[&_hr]:my-10 [&_hr]:border-border",
].join(" ");
