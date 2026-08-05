import type { MetadataRoute } from "next";
import { getAllWorkSlugs, getAllWritingSlugs } from "@/lib/mdx";
import { SITE_URL } from "@/lib/constants";
import { DEFAULT_LOCALE, LOCALES, LOCALE_HREFLANG, localePath } from "@/lib/i18n";

type Entry = { path: string; priority: number };

/**
 * Every page is emitted once per locale, each carrying the full alternates set.
 * Without it the two language versions look like competing duplicates to a
 * crawler; with it they read as one page in two languages, which is the claim
 * we actually want to make.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workSlugs, writingSlugs] = await Promise.all([
    getAllWorkSlugs(),
    getAllWritingSlugs(),
  ]);

  const entries: Entry[] = [
    { path: "/", priority: 1 },
    { path: "/work", priority: 0.8 },
    ...workSlugs.map((slug) => ({ path: `/work/${slug}`, priority: 0.7 })),
    { path: "/writing", priority: 0.8 },
    ...writingSlugs.map((slug) => ({ path: `/writing/${slug}`, priority: 0.6 })),
    { path: "/privacy", priority: 0.2 },
  ];

  return entries.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((l) => [LOCALE_HREFLANG[l], `${SITE_URL}${localePath(l, path)}`]),
          ),
          "x-default": `${SITE_URL}${localePath(DEFAULT_LOCALE, path)}`,
        },
      },
    })),
  );
}
