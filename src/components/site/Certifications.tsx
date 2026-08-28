import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

export default function Certifications({ content }: { content: SiteContent }) {
  const certs = content.certifications;
  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-3">Certifications</p>
          <h2 className="heading-xl mb-10">Credentials</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <div className="glass card-hover flex h-full items-start gap-4 rounded-2xl p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-350/20 bg-amber-350/10 text-amber-350">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5.5 9.5L4.5 15 8 13l3.5 2-1-5.5" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[14.5px] font-semibold text-ink-100">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-300">
                        {c.name}
                      </a>
                    ) : (
                      c.name
                    )}
                  </h3>
                  <p className="mt-1 text-[13px] text-ink-400">
                    {c.issuer}
                    {c.year ? ` · ${c.year}` : ""}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
