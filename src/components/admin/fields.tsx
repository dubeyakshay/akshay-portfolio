"use client";

import { useState } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-ink-500">{hint}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className="input-field"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className="input-field thin-scroll resize-y"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Edits a list of strings — one per line UI with add/remove. */
export function StringListEditor({
  items,
  onChange,
  placeholder = "Add item…",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="input-field"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="shrink-0 rounded-lg border border-white/10 px-3 text-ink-400 transition-colors hover:border-red-400/40 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          className="input-field"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 text-sm font-medium text-accent-300 transition-colors hover:bg-accent-500/20"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/** Comma-separated tag editor for technology lists. */
export function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter…",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const parts = draft
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => !tags.includes(p));
    if (parts.length) onChange([...tags, ...parts]);
    setDraft("");
  }

  return (
    <div className="rounded-lg border border-white/10 bg-base-900 p-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.07] px-2 py-1 font-mono text-[11.5px] text-ink-200"
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="text-ink-500 hover:text-red-300"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-sm text-ink-100 placeholder-ink-500 outline-none"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Backspace" && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={commit}
        />
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-accent-500" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink-100">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-400">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

/** File upload button that posts to /api/admin/upload. */
export function UploadButton({
  kind,
  accept,
  label,
  onUploaded,
}: {
  kind: "image" | "resume";
  accept: string;
  label: string;
  onUploaded: (file: { url: string; name: string; contentType: string }) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setError("");

    // Vercel serverless functions reject request bodies over ~4.5 MB
    if (file.size > 4 * 1024 * 1024) {
      setError(
        "File is larger than 4 MB. Please compress/resize it first (Vercel limits upload requests to ~4.5 MB)."
      );
      setBusy(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      let data: { error?: string; url?: string; name?: string; contentType?: string };
      try {
        data = await res.json();
      } catch {
        setError(
          res.status === 413
            ? "File too large for the server (max ~4 MB)."
            : `Upload failed (HTTP ${res.status}). If deployed on Vercel, make sure a Blob store is connected to the project.`
        );
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? `Upload failed (HTTP ${res.status})`);
        return;
      }
      onUploaded(data as { url: string; name: string; contentType: string });
    } catch {
      setError("Upload failed — could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label
        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-accent-400/30 bg-accent-500/10 px-3.5 py-2 text-[13px] font-medium text-accent-300 transition-colors hover:bg-accent-500/20 ${
          busy ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 9V2M4 4.5L7 1.5 10 4.5M2.5 12h9" />
        </svg>
        {busy ? "Uploading…" : label}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </label>
      {error && <p className="mt-1.5 text-[12px] text-red-300">{error}</p>}
    </div>
  );
}
