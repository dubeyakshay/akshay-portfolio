"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentDocument, SiteContent } from "@/lib/types";
import ProfileEditor from "./editors/ProfileEditor";
import AboutEditor from "./editors/AboutEditor";
import SnapshotEditor from "./editors/SnapshotEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import SkillsEditor from "./editors/SkillsEditor";
import CertificationsEditor from "./editors/CertificationsEditor";
import MediaManager from "./editors/MediaManager";
import ContactEditor from "./editors/ContactEditor";
import SeoEditor from "./editors/SeoEditor";
import SectionsEditor from "./editors/SectionsEditor";

const TABS = [
  { id: "profile", label: "Profile", icon: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 14a5.5 5.5 0 0 1 11 0" },
  { id: "about", label: "About", icon: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 7.5V11M8 5v.01" },
  { id: "snapshot", label: "Snapshot", icon: "M2 3.5h12v9H2zM5.5 6.5h5M5.5 9h3" },
  { id: "experience", label: "Experience", icon: "M2.5 5h11v8h-11zM5.5 5V3.5h5V5M2.5 8.5h11" },
  { id: "projects", label: "Projects", icon: "M2 4.5h5l1.5 1.5H14v7H2zM2 4.5V3h4" },
  { id: "skills", label: "Skills", icon: "M5.5 5L2.5 8l3 3M10.5 5l3 3-3 3" },
  { id: "certs", label: "Certifications", icon: "M8 9.5A3.5 3.5 0 1 0 8 2.5a3.5 3.5 0 0 0 0 7zM6 9L5 14l3-1.7L11 14l-1-5" },
  { id: "media", label: "Media", icon: "M2.5 3h11v10h-11zM5.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM13.5 10L10 6.5 4 12.5" },
  { id: "contact", label: "Contact & Social", icon: "M2 4h12v8H2zM2 4.5L8 9l6-4.5" },
  { id: "seo", label: "SEO", icon: "M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM10.5 10.5L14 14" },
  { id: "sections", label: "Sections", icon: "M2.5 3h11M2.5 6.5h11M2.5 10h7M2.5 13.5h9" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminShell() {
  const router = useRouter();
  const [doc, setDoc] = useState<ContentDocument | null>(null);
  const [tab, setTab] = useState<TabId>("profile");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);
  const [unsaved, setUnsaved] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          throw new Error("unauthorized");
        }
        return r.json();
      })
      .then(setDoc)
      .catch(() => {});
  }, [router]);

  const updateDraft = useCallback((updater: (draft: SiteContent) => SiteContent) => {
    setDoc((prev) => (prev ? { ...prev, draft: updater(prev.draft) } : prev));
    setUnsaved(true);
  }, []);

  async function post(body: object) {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Request failed");
    return (await res.json()) as ContentDocument;
  }

  async function saveDraft(): Promise<boolean> {
    if (!doc) return false;
    setSaving(true);
    try {
      const next = await post({ action: "save", draft: doc.draft });
      setDoc(next);
      setUnsaved(false);
      showToast("Draft saved");
      return true;
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Save failed", "err");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (!doc) return;
    setPublishing(true);
    try {
      if (unsaved) {
        const ok = await saveDraft();
        if (!ok) return;
      }
      const next = await post({ action: "publish" });
      setDoc(next);
      setUnsaved(false);
      showToast("Published — live site updated");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Publish failed", "err");
    } finally {
      setPublishing(false);
    }
  }

  async function discard() {
    if (!confirm("Discard all draft changes and revert to the published version?")) return;
    try {
      const next = await post({ action: "discard" });
      setDoc(next);
      setUnsaved(false);
      showToast("Draft reverted to published version");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Discard failed", "err");
    }
  }

  async function openPreview() {
    if (unsaved) {
      const ok = await saveDraft();
      if (!ok) return;
    }
    window.open("/preview", "_blank");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (!doc) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse-soft font-mono text-sm text-ink-400">Loading dashboard…</p>
      </div>
    );
  }

  const dirty = doc.dirty || unsaved;
  const draft = doc.draft;

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="glass-strong sticky top-0 z-40 border-b border-white/[0.06]">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ink-300 lg:hidden"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 font-mono text-xs font-bold text-white">
              CMS
            </span>
            <div className="hidden sm:block">
              <p className="text-[13px] font-semibold leading-tight text-ink-100">
                Portfolio Admin
              </p>
              <p className="font-mono text-[10.5px] leading-tight text-ink-500">
                {dirty ? "● unsaved / unpublished changes" : "✓ in sync with live site"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[13px] font-semibold text-ink-100 transition-colors hover:bg-white/[0.09] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              onClick={openPreview}
              className="rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[13px] font-semibold text-ink-100 transition-colors hover:bg-white/[0.09]"
            >
              Preview
            </button>
            <button
              onClick={publish}
              disabled={publishing}
              className="rounded-lg bg-accent-500 px-3.5 py-2 text-[13px] font-semibold text-white shadow-[0_6px_20px_-8px_rgba(59,118,224,0.8)] transition-colors hover:bg-accent-400 disabled:opacity-60"
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
            <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
            <a
              href="/"
              target="_blank"
              className="hidden rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-100 sm:block"
            >
              View live ↗
            </a>
            <button
              onClick={logout}
              className="rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-400 transition-colors hover:text-red-300"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[88rem]">
        {/* side nav */}
        <aside
          className={`${
            navOpen ? "block" : "hidden"
          } fixed inset-y-14 left-0 z-30 w-60 overflow-y-auto border-r border-white/[0.06] bg-base-950/95 p-3 backdrop-blur lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:bg-transparent`}
        >
          <nav className="space-y-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setNavOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
                  tab === t.id
                    ? "bg-accent-500/15 text-accent-300"
                    : "text-ink-400 hover:bg-white/[0.04] hover:text-ink-200"
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d={t.icon} />
                </svg>
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 border-t border-white/[0.06] pt-4">
            <button
              onClick={discard}
              className="w-full rounded-lg px-3 py-2 text-left text-[12.5px] font-medium text-ink-500 transition-colors hover:text-red-300"
            >
              Discard draft changes
            </button>
            <p className="mt-3 px-3 font-mono text-[10px] leading-relaxed text-ink-500">
              Last published:
              <br />
              {new Date(doc.publishedAt).toLocaleString()}
            </p>
          </div>
        </aside>

        {/* editor pane */}
        <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl space-y-5">
            {tab === "profile" && <ProfileEditor draft={draft} update={updateDraft} />}
            {tab === "about" && <AboutEditor draft={draft} update={updateDraft} />}
            {tab === "snapshot" && <SnapshotEditor draft={draft} update={updateDraft} />}
            {tab === "experience" && <ExperienceEditor draft={draft} update={updateDraft} />}
            {tab === "projects" && <ProjectsEditor draft={draft} update={updateDraft} />}
            {tab === "skills" && <SkillsEditor draft={draft} update={updateDraft} />}
            {tab === "certs" && <CertificationsEditor draft={draft} update={updateDraft} />}
            {tab === "media" && (
              <MediaManager draft={draft} update={updateDraft} showToast={showToast} />
            )}
            {tab === "contact" && <ContactEditor draft={draft} update={updateDraft} />}
            {tab === "seo" && <SeoEditor draft={draft} update={updateDraft} />}
            {tab === "sections" && <SectionsEditor draft={draft} update={updateDraft} />}
          </div>
        </main>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div
            className={`glass-strong animate-fade-up rounded-xl px-5 py-3 text-sm font-medium shadow-2xl ${
              toast.kind === "ok" ? "text-mint-400" : "text-red-300"
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
