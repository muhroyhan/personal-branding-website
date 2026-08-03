import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { WorkFrontmatter, WorkListItem } from "@/types/work";

const WORK_DIR = path.join(process.cwd(), "content", "work");

async function getMdxFilenames(): Promise<string[]> {
  const entries = await readdir(WORK_DIR);
  return entries.filter((file) => file.endsWith(".mdx"));
}

function slugFromFilename(file: string): string {
  return file.replace(/\.mdx$/, "");
}

export async function getAllWorkSlugs(): Promise<string[]> {
  const files = await getMdxFilenames();
  return files.map(slugFromFilename);
}

export async function getAllWork(): Promise<WorkListItem[]> {
  const files = await getMdxFilenames();

  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(WORK_DIR, file), "utf-8");
      const { data } = matter(raw);
      return { slug: slugFromFilename(file), frontmatter: data as WorkFrontmatter };
    }),
  );

  return items.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export async function getWorkBySlug(slug: string) {
  const raw = await readFile(path.join(WORK_DIR, `${slug}.mdx`), "utf-8");

  const { content, frontmatter } = await compileMDX<WorkFrontmatter>({
    source: raw,
    options: { parseFrontmatter: true },
  });

  return { slug, content, frontmatter };
}
