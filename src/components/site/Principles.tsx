import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

const ICONS: React.ReactNode[] = [
  // wrench — maintainability
  <path key="0" d="M13.8 6.2a3.8 3.8 0 0 1-5 3.6l-4.2 4.2a1.5 1.5 0 0 1-2.1-2.1l4.2-4.2a3.8 3.8 0 0 1 4.8-4.9L9 5.3l1.7 1.7 2.5-2.5c.4.5.6 1.1.6 1.7z" />,
  // shield — reliability
  <path key="1" d="M8 1.5l5.5 2v4c0 3.4-2.3 5.9-5.5 7-3.2-1.1-5.5-3.6-5.5-7v-4zM5.5 8l1.8 1.8 3.2-3.4" />,
  // expand — scalability
  <path key="2" d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9" />,
  // layers — separation
  <path key="3" d="M8 1.8l6 3.2-6 3.2-6-3.2zM2 8.2l6 3.2 6-3.2M2 11.4l6 3.2 6-3.2" />,
  // bolt — fast feedback
  <path key="4" d="M8.8 1.5L3.5 9h3.5l-1 5.5L11.5 7H8z" />,
];

export default function Principles({ content }: { content: SiteContent }) {
  const principles = content.principles;
  if (principles.length === 0) return null;

  return (
    <section id="principles" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-3">Engineering Principles</p>
          <h2 className="heading-xl mb-12">
            What every framework
            <span className="text-ink-400"> I build is measured against.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((p, i) => (
            <Reveal key={p.id} delay={i * 70} className="h-full">
              <div className="glass card-hover flex h-full flex-col rounded-2xl p-5">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-500/10 text-accent-300">
                  <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[i % ICONS.length]}
                  </svg>
                </span>
                <h3 className="mb-2 text-[14.5px] font-semibold text-ink-100">{p.title}</h3>
                <p className="text-[13px] leading-relaxed text-ink-400">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
