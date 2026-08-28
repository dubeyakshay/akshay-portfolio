"use client";

/* eslint-disable @next/next/no-img-element */
import type { SiteContent } from "@/lib/types";
import { Field, TextInput, TextArea, TagInput, SectionCard, UploadButton } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

export default function ProfileEditor({ draft, update }: Props) {
  const p = draft.profile;
  const set = (patch: Partial<SiteContent["profile"]>) =>
    update((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  return (
    <>
      <SectionCard title="Identity" subtitle="Shown in the hero and site header">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput value={p.name} onChange={(v) => set({ name: v })} placeholder="Your Name" />
          </Field>
          <Field label="Title">
            <TextInput value={p.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Experience badge">
            <TextInput value={p.experienceBadge} onChange={(v) => set({ experienceBadge: v })} />
          </Field>
          <Field label="Tagline" hint="Short positioning line (used in metadata contexts)">
            <TextInput value={p.tagline} onChange={(v) => set({ tagline: v })} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Professional introduction" hint="2–3 sentences shown in the hero">
            <TextArea value={p.intro} onChange={(v) => set({ intro: v })} rows={4} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Hero technology chips">
            <TagInput tags={p.heroTech} onChange={(v) => set({ heroTech: v })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Profile photo"
        subtitle="Shown in the hero. If no photo is set, an elegant monogram is displayed instead."
      >
        <div className="flex flex-wrap items-center gap-5">
          <div className="glass h-24 w-24 overflow-hidden rounded-2xl">
            {p.profileImageUrl ? (
              <img src={p.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-xs text-ink-500">
                none
              </div>
            )}
          </div>
          <div className="space-y-2">
            <UploadButton
              kind="image"
              accept="image/*"
              label="Upload photo"
              onUploaded={(f) => {
                set({ profileImageUrl: f.url });
                update((d) => ({
                  ...d,
                  media: [
                    {
                      id: crypto.randomUUID(),
                      name: f.name,
                      url: f.url,
                      contentType: f.contentType,
                      uploadedAt: new Date().toISOString(),
                    },
                    ...d.media,
                  ],
                }));
              }}
            />
            {p.profileImageUrl && (
              <button
                onClick={() => set({ profileImageUrl: "" })}
                className="block text-[12.5px] font-medium text-ink-500 hover:text-red-300"
              >
                Remove photo (keep file in Media)
              </button>
            )}
            <p className="text-[11.5px] text-ink-500">
              Or use a file placed at <code className="font-mono">/public/images/profile.jpg</code>{" "}
              by setting the URL below.
            </p>
            <TextInput
              value={p.profileImageUrl}
              onChange={(v) => set({ profileImageUrl: v })}
              placeholder="/images/profile.jpg"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Resume"
        subtitle="Upload a PDF, or leave the default /resume.pdf if you commit one to /public. If empty, resume buttons are hidden — no broken links."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <UploadButton
              kind="resume"
              accept="application/pdf"
              label="Upload / replace resume (PDF)"
              onUploaded={(f) => set({ resumeUrl: f.url })}
            />
            {p.resumeUrl && (
              <a
                href={p.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-accent-300 hover:underline"
              >
                Open current resume ↗
              </a>
            )}
          </div>
          <Field label="Resume URL" hint="Clear this field to hide all Download Resume buttons">
            <TextInput
              value={p.resumeUrl}
              onChange={(v) => set({ resumeUrl: v })}
              placeholder="/resume.pdf"
            />
          </Field>
        </div>
      </SectionCard>
    </>
  );
}
