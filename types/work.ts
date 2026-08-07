export type WorkFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  tech: string[];
  /** ISO date — sorting only, never rendered. */
  date: string;
  /**
   * Human-readable span shown on the card and article header ("2024 — 2026").
   * A raw ISO date reads as a publication timestamp, which is the wrong claim
   * for a system that was built over two years. Falls back to `date`.
   */
  period?: string;
  featured?: boolean;
  /** External links shown on the card and article header, e.g. source or package registry. */
  links?: {
    github?: string;
    npm?: string;
  };
};

export type WorkListItem = {
  slug: string;
  frontmatter: WorkFrontmatter;
};
