"use client";

import { useState } from "react";
import type { SiteContent, ExperienceEntry } from "@/lib/types";
import { Field, TextInput, TextArea, StringListEditor, TagInput, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

function emptyEntry(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    start: "",
    end: "",
    location: "",
    summary: "",
    responsibilities: [],
    technologies: [],
    achievements: [],
  };
}

export default function ExperienceEditor({ draft, update }: Props) {
  const entries = draft.experience;
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  const setEntries = (experience: ExperienceEntry[]) =>
    update((d) => ({ ...d, experience }));

  const patch = (id: string, p: Partial<ExperienceEntry>) =>
    setEntries(entries.map((e) => (e.id === id ? { ...e, ...p } : e)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= entries.length) return;
    const next = [...entries];
    [next[i], next[j]] = [next[j], next[i]];
    setEntries(next);
  };

  return (
    <SectionCard
      title="Experience timeline"
      subtitle="Entries appear top-to-bottom in this order. Use real companies and dates only."
      actions={
        <button
          onClick={() => {
            const e = emptyEntry();
            setEntries([e, ...entries]);
            setOpenId(e.id);
          }}
          className="rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-[12.5px] font-medium text-accent-300 hover:bg-accent-500/20"
        >
          + Add entry
        </button>
      }
    >
      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-[13px] text-ink-500">No entries yet — add your first role.</p>
        )}
        {entries.map((e, i) => {
          const open = openId === e.id;
          return (
            <div key={e.id} className="rounded-xl border border-white/[0.07] bg-base-900/50">
              <div className="flex items-center gap-2 p-3.5">
                <button
                  onClick={() => setOpenId(open ? null : e.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 text-ink-500 transition-transform ${open ? "rotate-90" : ""}`}
                  >
                    <path d="M4 2.5L8 6 4 9.5" />
                  </svg>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-ink-100">
                      {e.role || "Untitled role"}
                    </span>
                    <span className="block truncate text-[12px] text-ink-400">
                      {e.company || "Company"} · {e.start || "start"} — {e.end || "end"}
                    </span>
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === entries.length - 1} aria-label="Move down" className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↓</button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${e.role || "this entry"}"?`))
                        setEntries(entries.filter((x) => x.id !== e.id));
                    }}
                    className="rounded-md px-2 py-1 text-[12px] font-medium text-ink-500 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {open && (
                <div className="space-y-4 border-t border-white/[0.06] p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Company">
                      <TextInput value={e.company} onChange={(v) => patch(e.id, { company: v })} />
                    </Field>
                    <Field label="Role">
                      <TextInput value={e.role} onChange={(v) => patch(e.id, { role: v })} />
                    </Field>
                    <Field label="Start" hint="e.g. Mar 2019">
                      <TextInput value={e.start} onChange={(v) => patch(e.id, { start: v })} />
                    </Field>
                    <Field label="End" hint="e.g. Present">
                      <TextInput value={e.end} onChange={(v) => patch(e.id, { end: v })} />
                    </Field>
                    <Field label="Location">
                      <TextInput value={e.location} onChange={(v) => patch(e.id, { location: v })} />
                    </Field>
                  </div>
                  <Field label="Summary">
                    <TextArea value={e.summary} onChange={(v) => patch(e.id, { summary: v })} rows={3} />
                  </Field>
                  <Field label="Responsibilities">
                    <StringListEditor
                      items={e.responsibilities}
                      onChange={(v) => patch(e.id, { responsibilities: v })}
                      placeholder="Add responsibility…"
                    />
                  </Field>
                  <Field label="Achievements" hint="Only add real, verifiable achievements">
                    <StringListEditor
                      items={e.achievements}
                      onChange={(v) => patch(e.id, { achievements: v })}
                      placeholder="Add achievement…"
                    />
                  </Field>
                  <Field label="Technologies">
                    <TagInput tags={e.technologies} onChange={(v) => patch(e.id, { technologies: v })} />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
