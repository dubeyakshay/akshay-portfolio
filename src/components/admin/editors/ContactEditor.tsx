"use client";

import type { SiteContent } from "@/lib/types";
import { Field, TextInput, TextArea, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function ContactEditor({ draft, update }: Props) {
  const c = draft.contact;
  const set = (patch: Partial<SiteContent["contact"]>) =>
    update((d) => ({ ...d, contact: { ...d.contact, ...patch } }));

  return (
    <SectionCard
      title="Contact & social links"
      subtitle="Empty fields are simply not shown on the site — no broken or placeholder links."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Email">
            <TextInput value={c.email} onChange={(v) => set({ email: v })} placeholder="you@example.com" />
          </Field>
          <Field label="Phone">
            <TextInput value={c.phone} onChange={(v) => set({ phone: v })} placeholder="+91 …" />
          </Field>
          <Field label="LinkedIn URL">
            <TextInput value={c.linkedin} onChange={(v) => set({ linkedin: v })} placeholder="https://linkedin.com/in/…" />
          </Field>
          <Field label="GitHub URL">
            <TextInput value={c.github} onChange={(v) => set({ github: v })} placeholder="https://github.com/…" />
          </Field>
        </div>
        <Field label="Section heading">
          <TextInput value={c.heading} onChange={(v) => set({ heading: v })} />
        </Field>
        <Field label="Blurb">
          <TextArea value={c.blurb} onChange={(v) => set({ blurb: v })} rows={3} />
        </Field>
      </div>
    </SectionCard>
  );
}
