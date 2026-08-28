"use client";

import type { SiteContent } from "@/lib/types";
import { Field, TextInput, TextArea, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function SeoEditor({ draft, update }: Props) {
  const s = draft.seo;
  const set = (patch: Partial<SiteContent["seo"]>) =>
    update((d) => ({ ...d, seo: { ...d.seo, ...patch } }));

  return (
    <SectionCard title="SEO & metadata" subtitle="Applied to the public site's <head>">
      <div className="space-y-4">
        <Field label="Page title" hint="Shown in browser tabs and search results (~60 chars)">
          <TextInput value={s.title} onChange={(v) => set({ title: v })} />
        </Field>
        <Field label="Meta description" hint="~155 characters">
          <TextArea value={s.description} onChange={(v) => set({ description: v })} rows={3} />
        </Field>
        <Field label="Keywords" hint="Comma-separated">
          <TextInput value={s.keywords} onChange={(v) => set({ keywords: v })} />
        </Field>
        <Field label="Site URL" hint="Your deployed domain, e.g. https://yourname.vercel.app — used for canonical/OG URLs">
          <TextInput value={s.siteUrl} onChange={(v) => set({ siteUrl: v })} placeholder="https://…" />
        </Field>
      </div>
    </SectionCard>
  );
}
