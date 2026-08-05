import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { WorkFrontmatter, WorkListItem } from "@/types/work";
import type { WritingFrontmatter, WritingListItem } from "@/types/writing";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

const WORK_DIR = path.join(process.cwd(), "content", "work");
const WRITING_DIR = path.join(process.cwd(), "content", "writing");

async function getMdxFilenames(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).filter((file) => file.endsWith(".mdx"));
  } catch {
    // A locale directory that doesn't exist yet is an empty one, not an error —
    // it lets a new language be wired up before its content is written.
    return [];
  }
}

function slugFromFilename(file: string): string {
  return file.replace(/\.mdx$/, "");
}

/**
 * Slugs are shared across locales on purpose: `/work/payroll-system` and
 * `/id/work/payroll-system` are the same case study, so the language switcher
 * can keep a reader on the page they were already reading.
 */
async function getSlugsAcrossLocales(baseDir: string): Promise<string[]> {
  const perLocale = await Promise.all(
    LOCALES.map((locale) => getMdxFilenames(path.join(baseDir, locale))),
  );
  return [...new Set(perLocale.flat().map(slugFromFilename))];
}

/**
 * Falls back to the default locale when a translation is missing. An English
 * card inside the Indonesian list is a worse experience than a translated one,
 * but a far better one than a 404 — and it means a new case study can go live
 * in one language without breaking the other.
 */
async function readLocalisedFile(
  baseDir: string,
  slug: string,
  locale: Locale,
): Promise<string> {
  try {
    return await readFile(path.join(baseDir, locale, `${slug}.mdx`), "utf-8");
  } catch {
    return readFile(path.join(baseDir, DEFAULT_LOCALE, `${slug}.mdx`), "utf-8");
  }
}

/**
 * GFM is on for the tables: the Indonesian case studies open with an
 * at-a-glance summary table, which is the format that audience actually reads
 * first. Plain MDX would render those as literal pipes.
 */
const MDX_OPTIONS = {
  parseFrontmatter: true,
  mdxOptions: { remarkPlugins: [remarkGfm] },
};

export async function getAllWorkSlugs(): Promise<string[]> {
  return getSlugsAcrossLocales(WORK_DIR);
}

export async function getAllWork(locale: Locale): Promise<WorkListItem[]> {
  const slugs = await getSlugsAcrossLocales(WORK_DIR);

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readLocalisedFile(WORK_DIR, slug, locale);
      const { data } = matter(raw);
      return { slug, frontmatter: data as WorkFrontmatter };
    }),
  );

  return items.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export async function getWorkBySlug(slug: string, locale: Locale) {
  const raw = await readLocalisedFile(WORK_DIR, slug, locale);

  const { content, frontmatter } = await compileMDX<WorkFrontmatter>({
    source: raw,
    options: MDX_OPTIONS,
  });

  return { slug, content, frontmatter };
}

export async function getAllWritingSlugs(): Promise<string[]> {
  return getSlugsAcrossLocales(WRITING_DIR);
}

export async function getAllWriting(locale: Locale): Promise<WritingListItem[]> {
  const slugs = await getSlugsAcrossLocales(WRITING_DIR);

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readLocalisedFile(WRITING_DIR, slug, locale);
      const { data } = matter(raw);
      return { slug, frontmatter: data as WritingFrontmatter };
    }),
  );

  return items.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export async function getWritingBySlug(slug: string, locale: Locale) {
  const raw = await readLocalisedFile(WRITING_DIR, slug, locale);

  const { content, frontmatter } = await compileMDX<WritingFrontmatter>({
    source: raw,
    options: MDX_OPTIONS,
  });

  return { slug, content, frontmatter };
}
