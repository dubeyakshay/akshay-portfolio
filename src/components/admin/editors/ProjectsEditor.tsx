"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { SiteContent, Project } from "@/lib/types";
import {
  Field,
  TextInput,
  TextArea,
  TagInput,
  SectionCard,
  UploadButton,
} from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
};

function emptyProject(): Project {
  return {
    id: crypto.randomUUID(),
    title: "",
    subtitle: "",
    description: "",
    problem: "",
    approach: "",
    technologies: [],
    architecture: "",
    outcome: "",
    imageUrl: "",
    githubUrl: "",
    demoUrl: "",
  };
}

export default function ProjectsEditor({ draft, update }: Props) {
  const projects = draft.projects;
  const [openId, setOpenId] = useState<string | null>(null);

  const setProjects = (p: Project[]) => update((d) => ({ ...d, projects: p }));
  const patch = (id: string, p: Partial<Project>) =>
    setProjects(projects.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[i], next[j]] = [next[j], next[i]];
    setProjects(next);
  };

  return (
    <SectionCard
      title="Projects"
      subtitle="Case-study cards. Leave GitHub / demo URLs empty rather than inventing links — empty links are hidden."
      actions={
        <button
          onClick={() => {
            const p = emptyProject();
            setProjects([...projects, p]);
            setOpenId(p.id);
          }}
          className="rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-[12.5px] font-medium text-accent-300 hover:bg-accent-500/20"
        >
          + Add project
        </button>
      }
    >
      <div className="space-y-3">
        {projects.map((p, i) => {
          const open = openId === p.id;
          return (
            <div key={p.id} className="rounded-xl border border-white/[0.07] bg-base-900/50">
              <div className="flex items-center gap-2 p-3.5">
                <button
                  onClick={() => setOpenId(open ? null : p.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-ink-500 transition-transform ${open ? "rotate-90" : ""}`}>
                    <path d="M4 2.5L8 6 4 9.5" />
                  </svg>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-ink-100">
                      {p.title || "Untitled project"}
                    </span>
                    <span className="block truncate text-[12px] text-ink-400">
                      {p.subtitle || "no subtitle"}
                    </span>
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} aria-label="Move down" className="rounded-md px-2 py-1 text-ink-500 hover:text-ink-100 disabled:opacity-30">↓</button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.title || "this project"}"?`))
                        setProjects(projects.filter((x) => x.id !== p.id));
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
                    <Field label="Title">
                      <TextInput value={p.title} onChange={(v) => patch(p.id, { title: v })} />
                    </Field>
                    <Field label="Subtitle" hint="e.g. C# • Playwright • NUnit">
                      <TextInput value={p.subtitle} onChange={(v) => patch(p.id, { subtitle: v })} />
                    </Field>
                  </div>
                  <Field label="Description">
                    <TextArea value={p.description} onChange={(v) => patch(p.id, { description: v })} rows={3} />
                  </Field>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Problem">
                      <TextArea value={p.problem} onChange={(v) => patch(p.id, { problem: v })} rows={3} />
                    </Field>
                    <Field label="Approach">
                      <TextArea value={p.approach} onChange={(v) => patch(p.id, { approach: v })} rows={3} />
                    </Field>
                    <Field label="Architecture">
                      <TextArea value={p.architecture} onChange={(v) => patch(p.id, { architecture: v })} rows={3} />
                    </Field>
                    <Field label="Outcome">
                      <TextArea value={p.outcome} onChange={(v) => patch(p.id, { outcome: v })} rows={3} />
                    </Field>
                  </div>
                  <Field label="Technologies">
                    <TagInput tags={p.technologies} onChange={(v) => patch(p.id, { technologies: v })} />
                  </Field>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="GitHub URL" hint="Leave empty to hide the link">
                      <TextInput value={p.githubUrl} onChange={(v) => patch(p.id, { githubUrl: v })} placeholder="https://github.com/…" />
                    </Field>
                    <Field label="Live demo URL" hint="Leave empty to hide the link">
                      <TextInput value={p.demoUrl} onChange={(v) => patch(p.id, { demoUrl: v })} placeholder="https://…" />
                    </Field>
                  </div>
                  <div>
                    <label className="admin-label">Project image</label>
                    <div className="flex flex-wrap items-center gap-4">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="h-20 w-32 rounded-lg border border-white/10 object-cover" />
                      ) : (
                        <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-white/15 font-mono text-[11px] text-ink-500">
                          no image
                        </div>
                      )}
                      <div className="space-y-2">
                        <UploadButton
                          kind="image"
                          accept="image/*"
                          label="Upload image"
                          onUploaded={(f) => {
                            patch(p.id, { imageUrl: f.url });
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
                        {p.imageUrl && (
                          <button
                            onClick={() => patch(p.id, { imageUrl: "" })}
                            className="block text-[12.5px] font-medium text-ink-500 hover:text-red-300"
                          >
                            Remove from project
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
