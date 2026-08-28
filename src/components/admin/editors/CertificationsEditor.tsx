"use client";

import type { SiteContent, Certification } from "@/lib/types";
import { TextInput, SectionCard } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function CertificationsEditor({ draft, update }: Props) {
  const certs = draft.certifications;
  const setCerts = (c: Certification[]) => update((d) => ({ ...d, certifications: c }));
  const patch = (id: string, p: Partial<Certification>) =>
    setCerts(certs.map((c) => (c.id === id ? { ...c, ...p } : c)));

  const enabled = draft.sections.find((s) => s.id === "certifications")?.enabled;

  return (
    <SectionCard
      title="Certifications"
      subtitle="Only list certifications you actually hold. The section is hidden on the site until enabled in Sections."
      actions={
        <button
          onClick={() =>
            setCerts([...certs, { id: crypto.randomUUID(), name: "", issuer: "", year: "", url: "" }])
          }
          className="rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-[12.5px] font-medium text-accent-300 hover:bg-accent-500/20"
        >
          + Add certification
        </button>
      }
    >
      {!enabled && (
        <p className="mb-4 rounded-lg border border-amber-350/25 bg-amber-350/[0.06] px-3 py-2 text-[12.5px] text-amber-350">
          The Certifications section is currently disabled. Enable it under Sections when you have
          entries to show.
        </p>
      )}
      <div className="space-y-3">
        {certs.length === 0 && (
          <p className="text-[13px] text-ink-500">No certifications added.</p>
        )}
        {certs.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/[0.07] bg-base-900/50 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextInput value={c.name} onChange={(v) => patch(c.id, { name: v })} placeholder="Certification name" />
              <TextInput value={c.issuer} onChange={(v) => patch(c.id, { issuer: v })} placeholder="Issuer" />
              <TextInput value={c.year} onChange={(v) => patch(c.id, { year: v })} placeholder="Year" />
              <TextInput value={c.url} onChange={(v) => patch(c.id, { url: v })} placeholder="Credential URL (optional)" />
            </div>
            <button
              onClick={() => setCerts(certs.filter((x) => x.id !== c.id))}
              className="mt-3 text-[12px] font-medium text-ink-500 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
