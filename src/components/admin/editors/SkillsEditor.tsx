"use client";

import type { SiteContent, SkillGroup } from "@/lib/types";
import { Field, TextInput, TagInput, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function SkillsEditor({ draft, update }: Props) {
  const groups = draft.skills.groups;
  const setGroups = (g: SkillGroup[]) =>
    update((d) => ({ ...d, skills: { ...d.skills, groups: g } }));
  const patch = (id: string, p: Partial<SkillGroup>) =>
    setGroups(groups.map((g) => (g.id === id ? { ...g, ...p } : g)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= groups.length) return;
    const next = [...groups];
    [next[i], next[j]] = [next[j], next[i]];
    setGroups(next);
  };

  return (
    <SectionCard
      title="Technical expertise (bento grid)"
      subtitle="Each group is a card. 'Wide' cards span two columns on desktop."
      actions={
        <button
          onClick={() =>
            setGroups([
              ...groups,
              { id: crypto.randomUUID(), title: "New group", subtitle: "", items: [], size: "md" },
            ])
          }
          className="rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-[12.5px] font-medium text-accent-300 hover:bg-accent-500/20"
        >
          + Add group
        </button>
      }
    >
      <div className="space-y-4">
        <Field label="Section heading">
          <TextInput
            value={draft.skills.heading}
            onChange={(v) => update((d) => ({ ...d, skills: { ...d.skills, heading: v } }))}
          />
        </Field>
        {groups.map((g, i) => (
          <div key={g.id} className="rounded-xl border border-white/[0.07] bg-base-900/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-500">Group {i + 1}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === groups.length - 1} aria-label="Move down" className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↓</button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${g.title}"?`)) setGroups(groups.filter((x) => x.id !== g.id));
                  }}
                  className="rounded-md px-2 py-1 text-[12px] font-medium text-ink-500 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextInput value={g.title} onChange={(v) => patch(g.id, { title: v })} placeholder="Group title" />
              <TextInput value={g.subtitle} onChange={(v) => patch(g.id, { subtitle: v })} placeholder="Short subtitle" />
            </div>
            <div className="mt-3">
              <TagInput tags={g.items} onChange={(v) => patch(g.id, { items: v })} placeholder="Add skill…" />
            </div>
            <label className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-400">
              <input
                type="checkbox"
                checked={g.size === "lg"}
                onChange={(e) => patch(g.id, { size: e.target.checked ? "lg" : "md" })}
                className="h-4 w-4 accent-[#3b76e0]"
              />
              Wide card (spans 2 columns on desktop)
            </label>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
