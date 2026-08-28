import { defaultContent } from "./defaultContent";
import { readContentRaw, writeContentRaw } from "./storage";
import type { ContentDocument, SiteContent } from "./types";

/**
 * Content service — the only module that reads/writes the content document.
 * Handles defaulting, deep-merging (so new fields added in code releases
 * appear even for existing stored documents) and draft/publish workflow.
 */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Merge stored content over defaults so newly-added fields never come back undefined. */
function mergeWithDefaults<T>(defaults: T, stored: unknown): T {
  if (stored === undefined || stored === null) return defaults;
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (isPlainObject(defaults)) {
    if (!isPlainObject(stored)) return defaults;
    const out: Record<string, unknown> = { ...defaults };
    for (const key of Object.keys(defaults as Record<string, unknown>)) {
      out[key] = mergeWithDefaults(
        (defaults as Record<string, unknown>)[key],
        stored[key]
      );
    }
    return out as T;
  }
  return stored as T;
}

function freshDocument(): ContentDocument {
  const now = new Date().toISOString();
  return {
    draft: structuredClone(defaultContent),
    published: structuredClone(defaultContent),
    updatedAt: now,
    publishedAt: now,
    dirty: false,
  };
}

export async function getDocument(): Promise<ContentDocument> {
  const raw = await readContentRaw();
  if (!raw) return freshDocument();
  try {
    const parsed = JSON.parse(raw) as Partial<ContentDocument>;
    const fresh = freshDocument();
    return {
      draft: mergeWithDefaults(defaultContent, parsed.draft),
      published: mergeWithDefaults(defaultContent, parsed.published),
      updatedAt: parsed.updatedAt ?? fresh.updatedAt,
      publishedAt: parsed.publishedAt ?? fresh.publishedAt,
      dirty: parsed.dirty ?? false,
    };
  } catch {
    return freshDocument();
  }
}

export async function getPublishedContent(): Promise<SiteContent> {
  return (await getDocument()).published;
}

export async function getDraftContent(): Promise<SiteContent> {
  return (await getDocument()).draft;
}

export async function saveDraft(draft: SiteContent): Promise<ContentDocument> {
  const doc = await getDocument();
  const next: ContentDocument = {
    ...doc,
    draft: mergeWithDefaults(defaultContent, draft),
    updatedAt: new Date().toISOString(),
    dirty: true,
  };
  await writeContentRaw(JSON.stringify(next));
  return next;
}

export async function publishDraft(): Promise<ContentDocument> {
  const doc = await getDocument();
  const now = new Date().toISOString();
  const next: ContentDocument = {
    ...doc,
    published: structuredClone(doc.draft),
    publishedAt: now,
    updatedAt: now,
    dirty: false,
  };
  await writeContentRaw(JSON.stringify(next));
  return next;
}

export async function discardDraft(): Promise<ContentDocument> {
  const doc = await getDocument();
  const next: ContentDocument = {
    ...doc,
    draft: structuredClone(doc.published),
    updatedAt: new Date().toISOString(),
    dirty: false,
  };
  await writeContentRaw(JSON.stringify(next));
  return next;
}
