"use client";

import { useEffect, useState } from "react";
import type { SectionConfig } from "@/lib/types";

const NAV_TARGETS: Partial<Record<string, string>> = {
  about: "About",
  skills: "Expertise",
  architecture: "Architecture",
  experience: "Experience",
  projects: "Projects",
  contact: "Contact",
};

export default function Navbar({
  name,
  sections,
}: {
  name: string;
  sections: SectionConfig[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = sections
    .filter((s) => s.enabled && NAV_TARGETS[s.id])
    .map((s) => ({ id: s.id, label: NAV_TARGETS[s.id] as string }));

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_8px_32px_-16px_rgba(0,0,0,0.7)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 font-mono text-sm font-bold text-white">
            {initials || "QA"}
          </span>
          <span className="hidden text-sm font-semibold text-ink-100 sm:block">{name}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-300 transition-colors hover:bg-white/[0.05] hover:text-ink-100"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary ml-3 !px-4 !py-2 text-xs">
            Get in touch
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink-200 md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? (
              <>
                <path d="M3 3l12 12" />
                <path d="M15 3L3 15" />
              </>
            ) : (
              <>
                <path d="M2 4.5h14" />
                <path d="M2 9h14" />
                <path d="M2 13.5h14" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="glass-strong border-t border-white/5 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-200 hover:bg-white/[0.06]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
