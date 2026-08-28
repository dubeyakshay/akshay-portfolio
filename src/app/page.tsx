import { getPublishedContent } from "@/lib/content";
import { withVerifiedAssets } from "@/lib/assets";
import PortfolioPage from "@/components/site/PortfolioPage";

/**
 * Public portfolio — server-rendered from published content.
 * Revalidated on publish (revalidatePath) and every 60s as a safety net.
 */
export const revalidate = 60;

export default async function Home() {
  const content = await withVerifiedAssets(await getPublishedContent());
  return <PortfolioPage content={content} />;
}
