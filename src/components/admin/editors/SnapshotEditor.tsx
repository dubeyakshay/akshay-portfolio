"use client";

import type { SiteContent } from "@/lib/types";
import { Field, TextInput, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function SnapshotEditor({ draft, update }: Props) {
  const s = draft.snapshot;
  const setItems = (items: SiteContent["snapshot"]["items"]) =>
    update((d) => ({ ...d, snapshot: { ...d.snapshot, items } }));

  return (
    <SectionCard
      title="Recruiter snapshot"
      subtitle="Six concise highlight cards — the 10-second summary for a busy recruiter"
      actions={
        <button
          onClick={() =>
            setItems([
              ...s.items,
              { id: crypto.randomUUID(), title: "New highlight", subtitle: "" },
            ])
          }
          className="rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-[12.5px] font-medium text-accent-300 hover:bg-accent-500/20"
        >
          + Add card
        </button>
      }
    >
      <div className="space-y-4">
        <Field label="Section heading">
          <TextInput
            value={s.heading}
            onChange={(v) => update((d) => ({ ...d, snapshot: { ...d.snapshot, heading: v } }))}
          />
        </Field>
        {s.items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-white/[0.07] bg-base-900/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-500">Card {i + 1}</span>
              <button
                onClick={() => setItems(s.items.filter((x) => x.id !== item.id))}
                className="text-[12px] font-medium text-ink-500 hover:text-red-300"
              >
                Delete
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextInput
                value={item.title}
                onChange={(v) =>
                  setItems(s.items.map((x) => (x.id === item.id ? { ...x, title: v } : x)))
                }
                placeholder="Title"
              />
              <TextInput
                value={item.subtitle}
                onChange={(v) =>
                  setItems(s.items.map((x) => (x.id === item.id ? { ...x, subtitle: v } : x)))
                }
                placeholder="Subtitle"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
