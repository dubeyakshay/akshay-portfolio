import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

const ICONS = [
  // clock
  <path key="0" d="M10 5.5V10l3 2M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />,
  // code
  <path key="1" d="M7 6.5L3.5 10 7 13.5M13 6.5L16.5 10 13 13.5" />,
  // browser
  <path key="2" d="M2.5 4.5h15v11h-15zM2.5 8h15M5 6.25h.01M7 6.25h.01" />,
  // layers-io
  <path key="3" d="M10 2.5l7.5 4L10 10.5l-7.5-4zM3.5 10.5L10 14l6.5-3.5M3.5 14L10 17.5 16.5 14" />,
  // blueprint
  <path key="4" d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z" />,
  // pipeline
  <path key="5" d="M4 10h4m4 0h4M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />,
];

export default function Snapshot({ content }: { content: SiteContent }) {
  const { snapshot } = content;
  return (
    <section id="snapshot" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-8">{snapshot.heading}</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {snapshot.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 60}>
              <div className="glass card-hover flex h-full items-start gap-4 rounded-2xl p-5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-500/10 text-accent-300">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[i % ICONS.length]}
                  </svg>
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-100">{item.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-400">
                    {item.subtitle}
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
