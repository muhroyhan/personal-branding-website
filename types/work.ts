export type WorkFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  tech: string[];
  date: string;
  featured?: boolean;
};

export type WorkListItem = {
  slug: string;
  frontmatter: WorkFrontmatter;
};
