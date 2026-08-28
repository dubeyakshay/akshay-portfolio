import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

export default function About({ content }: { content: SiteContent }) {
  const { about } = content;
  return (
    <section id="about" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <p className="section-label mb-3">{about.heading}</p>
              <h2 className="heading-xl mb-8">
                Quality engineering,
                <br />
                <span className="text-ink-400">treated as engineering.</span>
              </h2>
            </Reveal>
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="text-[15.5px] leading-relaxed text-ink-300">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={150}>
            <div className="glass rounded-2xl p-6">
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
                Focus Areas
              </h3>
              <ul className="space-y-3.5">
                {about.focusAreas.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14.5px] text-ink-200">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0 text-mint-400" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 8l3.2 3.2L12.5 4.2" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
