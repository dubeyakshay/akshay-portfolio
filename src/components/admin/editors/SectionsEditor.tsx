"use client";

import type { SiteContent } from "@/lib/types";
import { SectionCard, Toggle } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function SectionsEditor({ draft, update }: Props) {
  const sections = draft.sections;

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    update((d) => ({ ...d, sections: next }));
  };

  const toggle = (id: string, enabled: boolean) =>
    update((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, enabled } : s)),
    }));

  return (
    <SectionCard
      title="Section visibility & order"
      subtitle="Reorder sections with the arrows; toggle to show or hide them on the public site. The hero is always shown first."
    >
      <div className="space-y-2">
        {sections.map((s, i) => (
          <div
            key={s.id}
            className={`flex items-center justify-between rounded-xl border p-3.5 transition-colors ${
              s.enabled ? "border-white/[0.09] bg-base-900/50" : "border-white/[0.05] bg-base-900/25 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] font-mono text-[11px] text-ink-400">
                {i + 1}
              </span>
              <span className="text-[14px] font-medium text-ink-100">{s.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${s.label} up`} className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} aria-label={`Move ${s.label} down`} className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↓</button>
              <Toggle checked={s.enabled} onChange={(v) => toggle(s.id, v)} label={`Toggle ${s.label}`} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
