import type { SiteContent } from "@/lib/types";
import Reveal from "./Reveal";

const GROUP_ICONS: Record<string, React.ReactNode> = {
  Programming: <path d="M8 7L4.5 10.5 8 14M12 7l3.5 3.5L12 14M10.8 5.5l-1.6 9.5" />,
  "UI Automation": <path d="M3 4h14v10H3zM3 7.2h14M7 17h6M10 14v3M5.2 5.6h.01M6.8 5.6h.01" />,
  Testing: <path d="M8 3h4M9 3v4.2L4.5 15a1.6 1.6 0 0 0 1.45 2.3h8.1A1.6 1.6 0 0 0 15.5 15L11 7.2V3M6.5 12.5h7" />,
  Architecture: <path d="M10 2.5l7 3.8-7 3.7-7-3.7zM3 10.2l7 3.8 7-3.8M3 14l7 3.8 7-3.8" />,
  "CI/CD": <path d="M13.5 5.5A5.5 5.5 0 0 0 4.6 8M6.5 14.5a5.5 5.5 0 0 0 8.9-2.5M4.6 4.5V8h3.5M15.4 15.5V12h-3.5" />,
  Database: <path d="M10 3c3.6 0 6.5 1 6.5 2.3S13.6 7.6 10 7.6 3.5 6.6 3.5 5.3 6.4 3 10 3zM3.5 5.3v9.4C3.5 16 6.4 17 10 17s6.5-1 6.5-2.3V5.3M3.5 10c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3" />,
};

export default function Skills({ content }: { content: SiteContent }) {
  const { skills } = content;
  return (
    <section id="skills" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <p className="section-label mb-3">{skills.heading}</p>
          <h2 className="heading-xl mb-10">
            The stack behind
            <span className="text-ink-400"> reliable automation.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.groups.map((g, i) => (
            <Reveal
              key={g.id}
              delay={i * 70}
              className={g.size === "lg" ? "lg:col-span-2" : ""}
            >
              <div className="glass card-hover group relative h-full overflow-hidden rounded-2xl p-6">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "rgba(59,118,224,0.22)" }}
                  aria-hidden
                />
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent-300">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      {GROUP_ICONS[g.title] ?? GROUP_ICONS["Testing"]}
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink-100">{g.title}</h3>
                    <p className="text-xs text-ink-400">{g.subtitle}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span key={item} className="chip font-mono text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
