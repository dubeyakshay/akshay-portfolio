import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

export default function Experience({ content }: { content: SiteContent }) {
  const entries = content.experience;
  if (entries.length === 0) return null;

  return (
    <section id="experience" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-3">Experience</p>
          <h2 className="heading-xl mb-12">
            A career built on
            <span className="text-ink-400"> shipping quality.</span>
          </h2>
        </Reveal>

        <div className="relative">
          {/* timeline spine */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-400/60 via-white/15 to-transparent sm:left-[9px]"
            aria-hidden
          />
          <div className="space-y-10">
            {entries.map((e, i) => (
              <Reveal key={e.id} delay={i * 90}>
                <article className="relative pl-10 sm:pl-14">
                  {/* node */}
                  <span
                    className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-accent-400 bg-base-950 sm:h-[19px] sm:w-[19px]"
                    aria-hidden
                  >
                    <span className="h-[5px] w-[5px] rounded-full bg-accent-300" />
                  </span>

                  <div className="glass card-hover rounded-2xl p-6 sm:p-7">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-ink-100">{e.role}</h3>
                        <p className="mt-0.5 text-[14.5px] font-medium text-accent-300">
                          {e.company}
                          {e.location ? (
                            <span className="text-ink-400"> · {e.location}</span>
                          ) : null}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-ink-300">
                        {e.start} — {e.end}
                      </span>
                    </div>

                    {e.summary && (
                      <p className="mb-4 text-[14.5px] leading-relaxed text-ink-300">
                        {e.summary}
                      </p>
                    )}

                    {e.responsibilities.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {e.responsibilities.map((r, ri) => (
                          <li key={ri} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-300">
                            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent-400" aria-hidden />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    {e.achievements.length > 0 && (
                      <div className="mb-4 rounded-xl border border-mint-400/15 bg-mint-400/[0.04] p-4">
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mint-400">
                          Achievements
                        </p>
                        <ul className="space-y-1.5">
                          {e.achievements.map((a, ai) => (
                            <li key={ai} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-200">
                              <svg width="14" height="14" viewBox="0 0 15 15" fill="none" className="mt-[3px] shrink-0 text-mint-400" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2.5 8l3.2 3.2L12.5 4.2" />
                              </svg>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {e.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {e.technologies.map((t) => (
                          <span key={t} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-ink-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
