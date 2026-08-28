"use client";

/* eslint-disable @next/next/no-img-element */
import type { SiteContent, MediaItem } from "@/lib/types";
import { SectionCard, UploadButton } from "../fields";

type Props = {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => SiteContent) => void;
  showToast: (msg: string, kind?: "ok" | "err") => void;
};

export default function MediaManager({ draft, update, showToast }: Props) {
  const media = draft.media;

  function addMedia(f: { url: string; name: string; contentType: string }) {
    const item: MediaItem = {
      id: crypto.randomUUID(),
      name: f.name,
      url: f.url,
      contentType: f.contentType,
      uploadedAt: new Date().toISOString(),
    };
    update((d) => ({ ...d, media: [item, ...d.media] }));
    showToast("File uploaded — remember to Save Draft");
  }

  async function remove(item: MediaItem) {
    if (!confirm(`Delete "${item.name}" permanently? Anything referencing it will lose the image.`))
      return;
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.url }),
      });
      if (!res.ok) throw new Error();
      update((d) => ({ ...d, media: d.media.filter((m) => m.id !== item.id) }));
      showToast("File deleted");
    } catch {
      showToast("Delete failed", "err");
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL copied to clipboard");
    } catch {
      showToast("Could not copy", "err");
    }
  }

  return (
    <SectionCard
      title="Media library"
      subtitle="Upload images here, then paste their URL into any image field (profile photo, project image)."
      actions={
        <UploadButton kind="image" accept="image/*" label="Upload image" onUploaded={addMedia} />
      }
    >
      {media.length === 0 ? (
        <p className="text-[13px] text-ink-500">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-base-900/50">
              <div className="flex h-28 items-center justify-center bg-base-900">
                {m.contentType.startsWith("image/") ? (
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono text-[11px] text-ink-500">{m.contentType}</span>
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-[12px] font-medium text-ink-200">{m.name}</p>
                <p className="font-mono text-[10px] text-ink-500">
                  {new Date(m.uploadedAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex gap-3">
                  <button onClick={() => copy(m.url)} className="text-[11.5px] font-medium text-accent-300 hover:underline">
                    Copy URL
                  </button>
                  <button onClick={() => remove(m)} className="text-[11.5px] font-medium text-ink-500 hover:text-red-300">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
