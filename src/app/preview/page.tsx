import { getDraftContent } from "@/lib/content";
import { withVerifiedAssets } from "@/lib/assets";
import PortfolioPage from "@/components/site/PortfolioPage";
import Link from "next/link";

/** Draft preview — admin-only (guarded by middleware), never cached. */
export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const content = await withVerifiedAssets(await getDraftContent());
  return (
    <div>
      <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2">
        <div className="glass-strong flex items-center gap-3 rounded-full py-2 pl-4 pr-2 shadow-2xl">
          <span className="flex items-center gap-2 font-mono text-xs text-amber-350">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-amber-350" />
            DRAFT PREVIEW
          </span>
          <Link
            href="/admin"
            className="rounded-full bg-accent-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-400"
          >
            Back to Admin
          </Link>
        </div>
      </div>
      <PortfolioPage content={content} />
    </div>
  );
}
