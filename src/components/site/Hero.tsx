/* eslint-disable @next/next/no-img-element */
import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

export default function Hero({ content }: { content: SiteContent }) {
  const { profile } = content;
  const hasResume = !!profile.resumeUrl;
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* backdrop */}
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,118,224,0.35), rgba(79,209,165,0.08) 55%, transparent 75%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-400/25 bg-accent-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint-400" />
              <span className="font-mono text-xs tracking-wide text-accent-300">
                {profile.experienceBadge}
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink-100 sm:text-6xl">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-3 bg-gradient-to-r from-accent-300 via-accent-400 to-mint-400 bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl">
              {profile.title}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-300">
              {profile.intro}
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-7 flex flex-wrap gap-2">
              {profile.heroTech.map((t) => (
                <span key={t} className="chip font-mono text-xs">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn-primary">
                View My Work
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h8M8 3.5L11.5 7 8 10.5" />
                </svg>
              </a>
              {hasResume && (
                <a href={profile.resumeUrl} download className="btn-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 2v7M4 6.5L7 9.5 10 6.5M2.5 12h9" />
                  </svg>
                  Download Resume
                </a>
              )}
              <a href="#contact" className="btn-ghost">
                Contact Me →
              </a>
            </div>
          </Reveal>
        </div>

        {/* portrait */}
        <Reveal delay={220} className="justify-self-center lg:justify-self-end">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl"
              style={{
                background:
                  "linear-gradient(140deg, rgba(59,118,224,0.35), rgba(79,209,165,0.18))",
              }}
              aria-hidden
            />
            <div className="glass relative h-56 w-56 overflow-hidden rounded-[1.75rem] sm:h-72 sm:w-72">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={`Portrait of ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-base-800 to-base-900">
                  <span className="bg-gradient-to-br from-accent-300 to-mint-400 bg-clip-text font-mono text-6xl font-bold text-transparent">
                    {initials || "QA"}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
                    {profile.title.split(" ")[0]} Engineer
                  </span>
                </div>
              )}
            </div>
            {/* status card */}
            <div className="glass-strong absolute -bottom-4 -left-6 hidden items-center gap-2.5 rounded-xl px-4 py-2.5 sm:flex">
              <span className="flex h-2 w-2">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-mint-400/60" />
                <span className="h-2 w-2 rounded-full bg-mint-400" />
              </span>
              <span className="font-mono text-xs text-ink-200">Tests passing · CI green</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
