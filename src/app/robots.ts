import type { MetadataRoute } from "next";
import { getPublishedContent } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getPublishedContent();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/preview", "/api/"] },
    ],
    sitemap: seo.siteUrl ? `${seo.siteUrl.replace(/\/$/, "")}/sitemap.xml` : undefined,
  };
}
