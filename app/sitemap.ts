import type { MetadataRoute } from "next";
import { getAllWorkSlugs, getAllWritingSlugs } from "@/lib/mdx";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workSlugs, writingSlugs] = await Promise.all([
    getAllWorkSlugs(),
    getAllWritingSlugs(),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...workSlugs.map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/writing`, changeFrequency: "monthly", priority: 0.8 },
    ...writingSlugs.map((slug) => ({
      url: `${SITE_URL}/writing/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
