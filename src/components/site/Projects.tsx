/* eslint-disable @next/next/no-img-element */
import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

export default function Projects({ content }: { content: SiteContent }) {
  const projects = content.projects;
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-3">Projects</p>
          <h2 className="heading-xl mb-12">
            Case studies in
            <span className="text-ink-400"> automation engineering.</span>
          </h2>
        </Reveal>

        <div className="space-y-8">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <article className="glass card-hover overflow-hidden rounded-2xl">
                <div className={`grid grid-cols-1 ${p.imageUrl ? "lg:grid-cols-[1fr_360px]" : ""}`}>
                  <div className="p-6 sm:p-8">
                    <div className="mb-1 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-ink-100">{p.title}</h3>
                      <span className="font-mono text-xs text-accent-300">{p.subtitle}</span>
                    </div>
                    <p className="mb-6 max-w-2xl text-[14.5px] leading-relaxed text-ink-300">
                      {p.description}
                    </p>

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {p.problem && (
                        <div className="rounded-xl border border-white/[0.06] bg-base-900/50 p-4">
                          <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-350">
                            Problem
                          </p>
                          <p className="text-[13.5px] leading-relaxed text-ink-300">{p.problem}</p>
                        </div>
                      )}
                      {p.approach && (
                        <div className="rounded-xl border border-white/[0.06] bg-base-900/50 p-4">
                          <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent-300">
                            Approach
                          </p>
                          <p className="text-[13.5px] leading-relaxed text-ink-300">{p.approach}</p>
                        </div>
                      )}
                      {p.architecture && (
                        <div className="rounded-xl border border-white/[0.06] bg-base-900/50 p-4">
                          <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-400">
                            Architecture
                          </p>
                          <p className="font-mono text-[12.5px] leading-relaxed text-ink-300">
                            {p.architecture}
                          </p>
                        </div>
                      )}
                      {p.outcome && (
                        <div className="rounded-xl border border-mint-400/15 bg-mint-400/[0.04] p-4">
                          <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mint-400">
                            Outcome
                          </p>
                          <p className="text-[13.5px] leading-relaxed text-ink-200">{p.outcome}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.technologies.map((t) => (
                          <span key={t} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-ink-300">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-200 transition-colors hover:text-accent-300"
                          >
                            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            GitHub
                          </a>
                        )}
                        {p.demoUrl && (
                          <a
                            href={p.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-200 transition-colors hover:text-accent-300"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M6 3H3v8h8V8M8.5 2.5H11.5V5.5M11 3L6.5 7.5" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {p.imageUrl && (
                    <div className="relative min-h-[220px] border-t border-white/[0.06] lg:border-l lg:border-t-0">
                      <img
                        src={p.imageUrl}
                        alt={`${p.title} screenshot`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
