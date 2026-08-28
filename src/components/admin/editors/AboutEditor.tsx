"use client";

import type { SiteContent } from "@/lib/types";
import { Field, TextInput, StringListEditor, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function AboutEditor({ draft, update }: Props) {
  const a = draft.about;
  const set = (patch: Partial<SiteContent["about"]>) =>
    update((d) => ({ ...d, about: { ...d.about, ...patch } }));

  return (
    <>
      <SectionCard title="About section">
        <div className="space-y-4">
          <Field label="Heading">
            <TextInput value={a.heading} onChange={(v) => set({ heading: v })} />
          </Field>
          <Field label="Paragraphs" hint="Each item renders as one paragraph">
            <StringListEditor
              items={a.paragraphs}
              onChange={(v) => set({ paragraphs: v })}
              placeholder="Add a paragraph…"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Focus areas" subtitle="Shown as a checklist beside the about text">
        <StringListEditor
          items={a.focusAreas}
          onChange={(v) => set({ focusAreas: v })}
          placeholder="Add a focus area…"
        />
      </SectionCard>
    </>
  );
}
