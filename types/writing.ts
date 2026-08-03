export type WritingFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  date: string;
};

export type WritingListItem = {
  slug: string;
  frontmatter: WritingFrontmatter;
};
