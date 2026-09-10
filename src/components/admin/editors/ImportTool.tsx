"use client";

import { useState } from "react";
import type { ContentDocument } from "@/lib/types";
import type { ParsedResume } from "@/lib/resumeParser";
import type { JdAnalysis } from "@/lib/jdAnalyzer";
import { SectionCard, TextArea } from "../fields";

type Props = {
  onApplied: (doc: ContentDocument) => void;
  showToast: (msg: string, kind?: "ok" | "err") => void;
};

const SELECTION_LABELS: Record<string, { label: string; hint: string }> = {
  profile: { label: "Profile", hint: "Name, title, intro, location" },
  contact: { label: "Contact", hint: "Email, phone, LinkedIn, GitHub" },
  skills: { label: "Hero skills", hint: "Replaces the hero tech chips" },
  experience: { label: "Experience", hint: "REPLACES all current experience entries" },
  certifications: { label: "Certifications", hint: "Replaces the certifications list" },
};

export default function ImportTool({ onApplied, showToast }: Props) {
  const [busy, setBusy] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [selections, setSelections] = useState<Record<string, boolean>>({
    profile: true,
    contact: true,
    skills: false,
    experience: false,
    certifications: false,
  });
  const [jd, setJd] = useState("");
  const [jdBusy, setJdBusy] = useState(false);
  const [analysis, setAnalysis] = useState<JdAnalysis | null>(null);

  async function handleResume(file: File) {
    setBusy(true);
    setParsed(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Parsing failed", "err");
        return;
      }
      setParsed(data.parsed);
      showToast(
        data.parsed.engine === "ai"
          ? "Resume parsed with AI — review the suggestions below"
          : "Resume parsed (rule-based) — review carefully before applying"
      );
    } catch {
      showToast("Upload failed — network error", "err");
    } finally {
      setBusy(false);
    }
  }

  async function applySelected() {
    if (!parsed) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "apply", parsed, selections }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Apply failed", "err");
        return;
      }
      onApplied(data);
      setParsed(null);
      showToast("Applied to draft — review each tab, then Preview and Publish");
    } catch {
      showToast("Apply failed — network error", "err");
    } finally {
      setBusy(false);
    }
  }

  async function runJdAnalysis() {
    setJdBusy(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze-jd", jd }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Analysis failed", "err");
        return;
      }
      setAnalysis(data.analysis);
    } catch {
      showToast("Analysis failed — network error", "err");
    } finally {
      setJdBusy(false);
    }
  }

  return (
    <>
      <SectionCard
        title="Import from resume"
        subtitle="Upload your resume PDF — the app extracts your details as suggestions. Nothing is applied until you review and confirm; publishing stays manual."
      >
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-base-900/40 px-6 py-10 text-center transition-colors hover:border-accent-400/40 ${
            busy ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#8ab8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6M9 10.5L14 5.5 19 10.5M5 22h18" />
          </svg>
          <span className="text-[14px] font-medium text-ink-100">
            {busy ? "Parsing…" : "Click to upload resume PDF"}
          </span>
          <span className="text-[12px] text-ink-500">
            Text-based PDF, max 10 MB. Scanned images cannot be read.
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleResume(f);
              e.target.value = "";
            }}
          />
        </label>

        {parsed && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider ${
                  parsed.engine === "ai"
                    ? "bg-mint-400/10 text-mint-400"
                    : "bg-amber-350/10 text-amber-350"
                }`}
              >
                {parsed.engine === "ai" ? "AI parsed" : "Rule-based"}
              </span>
              <span className="text-[12.5px] text-ink-400">Review what was found:</span>
            </div>

            {/* extracted preview */}
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/[0.07] bg-base-900/50 p-4 text-[13px] sm:grid-cols-2">
              {parsed.name && <p><span className="text-ink-500">Name:</span> <span className="text-ink-100">{parsed.name}</span></p>}
              {parsed.title && <p><span className="text-ink-500">Title:</span> <span className="text-ink-100">{parsed.title}</span></p>}
              {parsed.email && <p><span className="text-ink-500">Email:</span> <span className="text-ink-100">{parsed.email}</span></p>}
              {parsed.phone && <p><span className="text-ink-500">Phone:</span> <span className="text-ink-100">{parsed.phone}</span></p>}
              {parsed.linkedin && <p className="truncate"><span className="text-ink-500">LinkedIn:</span> <span className="text-ink-100">{parsed.linkedin}</span></p>}
              {parsed.github && <p className="truncate"><span className="text-ink-500">GitHub:</span> <span className="text-ink-100">{parsed.github}</span></p>}
              {parsed.skills && (
                <p className="sm:col-span-2">
                  <span className="text-ink-500">Skills ({parsed.skills.length}):</span>{" "}
                  <span className="text-ink-100">{parsed.skills.join(", ")}</span>
                </p>
              )}
              {parsed.experience && (
                <div className="sm:col-span-2">
                  <span className="text-ink-500">Experience ({parsed.experience.length} roles):</span>
                  <ul className="mt-1 space-y-1">
                    {parsed.experience.map((e, i) => (
                      <li key={i} className="text-ink-100">
                        • {e.role ?? "?"} — {e.company ?? "?"} ({e.start ?? "?"} – {e.end ?? "?"})
                        {e.responsibilities?.length ? ` · ${e.responsibilities.length} bullets` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsed.certifications && (
                <p className="sm:col-span-2">
                  <span className="text-ink-500">Certifications:</span>{" "}
                  <span className="text-ink-100">{parsed.certifications.map((c) => c.name).join("; ")}</span>
                </p>
              )}
            </div>

            {parsed.warnings.length > 0 && (
              <div className="rounded-lg border border-amber-350/25 bg-amber-350/[0.06] p-3">
                {parsed.warnings.map((w, i) => (
                  <p key={i} className="text-[12px] text-amber-350">⚠ {w}</p>
                ))}
              </div>
            )}

            {/* selection checkboxes */}
            <div>
              <p className="admin-label mb-2">Choose what to apply to the draft</p>
              <div className="space-y-2">
                {Object.entries(SELECTION_LABELS).map(([key, meta]) => {
                  const available =
                    (key === "profile" && (parsed.name || parsed.title || parsed.intro)) ||
                    (key === "contact" && (parsed.email || parsed.phone || parsed.linkedin || parsed.github)) ||
                    (key === "skills" && parsed.skills?.length) ||
                    (key === "experience" && parsed.experience?.length) ||
                    (key === "certifications" && parsed.certifications?.length);
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-3 rounded-lg border border-white/[0.07] bg-base-900/40 px-3.5 py-2.5 ${
                        available ? "cursor-pointer" : "opacity-40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={!available}
                        checked={!!selections[key] && !!available}
                        onChange={(e) =>
                          setSelections((s) => ({ ...s, [key]: e.target.checked }))
                        }
                        className="h-4 w-4 accent-[#3b76e0]"
                      />
                      <span className="text-[13.5px] font-medium text-ink-100">{meta.label}</span>
                      <span className={`text-[11.5px] ${key === "experience" ? "text-amber-350" : "text-ink-500"}`}>
                        {meta.hint}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={applySelected}
                disabled={busy || !Object.values(selections).some(Boolean)}
                className="rounded-lg bg-accent-500 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-400 disabled:opacity-50"
              >
                {busy ? "Applying…" : "Apply selected to draft"}
              </button>
              <button
                onClick={() => setParsed(null)}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-[13px] font-medium text-ink-300 hover:bg-white/[0.05]"
              >
                Discard suggestions
              </button>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Job description analysis"
        subtitle="Paste a JD to see which of its keywords your portfolio already covers and which are missing. Suggestions only — it never adds skills for you."
      >
        <TextArea
          value={jd}
          onChange={setJd}
          rows={6}
          placeholder="Paste the full job description here…"
        />
        <button
          onClick={runJdAnalysis}
          disabled={jdBusy || jd.trim().length < 30}
          className="mt-3 rounded-lg border border-accent-400/30 bg-accent-500/10 px-4 py-2.5 text-[13px] font-medium text-accent-300 transition-colors hover:bg-accent-500/20 disabled:opacity-50"
        >
          {jdBusy ? "Analyzing…" : "Analyze against my portfolio"}
        </button>

        {analysis && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-mint-400/15 bg-mint-400/[0.04] p-4">
                <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-mint-400">
                  ✓ Covered ({analysis.matched.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched.map((m) => (
                    <span key={m} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-ink-200">{m}</span>
                  ))}
                  {analysis.matched.length === 0 && <span className="text-[12px] text-ink-500">None detected</span>}
                </div>
              </div>
              <div className="rounded-xl border border-amber-350/15 bg-amber-350/[0.04] p-4">
                <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-amber-350">
                  Missing from portfolio ({analysis.missing.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.map((m) => (
                    <span key={m} className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-ink-200">{m}</span>
                  ))}
                  {analysis.missing.length === 0 && <span className="text-[12px] text-ink-500">Nothing missing 🎉</span>}
                </div>
              </div>
            </div>
            {analysis.emphasize.length > 0 && (
              <div className="rounded-xl border border-accent-400/15 bg-accent-500/[0.05] p-4">
                <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent-300">
                  Emphasize for this role
                </p>
                <p className="text-[13px] text-ink-200">{analysis.emphasize.join(" · ")}</p>
                <p className="mt-2 text-[11.5px] text-ink-500">
                  Tip: reorder your hero chips and skill groups so these appear first.
                </p>
              </div>
            )}
            {analysis.notes.length > 0 && (
              <ul className="space-y-1">
                {analysis.notes.map((n, i) => (
                  <li key={i} className="text-[12.5px] text-ink-400">• {n}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="AI parsing (optional upgrade)"
        subtitle="Currently using rule-based extraction unless a Gemini key is configured."
      >
        <ol className="list-decimal space-y-1.5 pl-5 text-[13px] text-ink-300">
          <li>Get a free API key at <span className="font-mono text-accent-300">aistudio.google.com/apikey</span></li>
          <li>In Vercel: Settings → Environment Variables → add <span className="font-mono text-accent-300">GEMINI_API_KEY</span></li>
          <li>Redeploy — resume parsing and JD analysis automatically switch to AI</li>
        </ol>
      </SectionCard>
    </>
  );
}
