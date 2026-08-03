import type { MetadataRoute } from "next";
import { getAllWorkSlugs } from "@/lib/mdx";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllWorkSlugs();

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
