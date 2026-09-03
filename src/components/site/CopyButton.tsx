"use client";

import { useState } from "react";

/** Small copy-to-clipboard button with feedback, used next to the email card. */
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      onClick={copy}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-ink-400 transition-colors hover:border-accent-400/40 hover:text-accent-300"
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#4fd1a5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 8l3.2 3.2L12.5 4.2" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
          <path d="M9.5 4.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
        </svg>
      )}
    </button>
  );
}
