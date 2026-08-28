import type { MetadataRoute } from "next";
import { getPublishedContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { seo } = await getPublishedContent();
  const base = seo.siteUrl ? seo.siteUrl.replace(/\/$/, "") : "";
  if (!base) return [];
  return [{ url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
