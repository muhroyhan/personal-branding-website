import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { WorkFrontmatter, WorkListItem } from "@/types/work";
import type { WritingFrontmatter, WritingListItem } from "@/types/writing";

const WORK_DIR = path.join(process.cwd(), "content", "work");
const WRITING_DIR = path.join(process.cwd(), "content", "writing");

async function getMdxFilenames(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  return entries.filter((file) => file.endsWith(".mdx"));
}

function slugFromFilename(file: string): string {
  return file.replace(/\.mdx$/, "");
}

export async function getAllWorkSlugs(): Promise<string[]> {
  const files = await getMdxFilenames(WORK_DIR);
  return files.map(slugFromFilename);
}

export async function getAllWork(): Promise<WorkListItem[]> {
  const files = await getMdxFilenames(WORK_DIR);

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

export async function getAllWritingSlugs(): Promise<string[]> {
  const files = await getMdxFilenames(WRITING_DIR);
  return files.map(slugFromFilename);
}

export async function getAllWriting(): Promise<WritingListItem[]> {
  const files = await getMdxFilenames(WRITING_DIR);

  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(WRITING_DIR, file), "utf-8");
      const { data } = matter(raw);
      return { slug: slugFromFilename(file), frontmatter: data as WritingFrontmatter };
    }),
  );

  return items.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export async function getWritingBySlug(slug: string) {
  const raw = await readFile(path.join(WRITING_DIR, `${slug}.mdx`), "utf-8");

  const { content, frontmatter } = await compileMDX<WritingFrontmatter>({
    source: raw,
    options: { parseFrontmatter: true },
  });

  return { slug, content, frontmatter };
}
