import type { SiteContent } from "@/lib/types";

export default function Footer({ content }: { content: SiteContent }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <p className="text-[13px] text-ink-500">
          © {year} {content.profile.name} · {content.profile.title}
        </p>
        <p className="font-mono text-[11px] tracking-wide text-ink-500">
          Built with Next.js · Deployed on Vercel
        </p>
      </div>
    </footer>
  );
}
