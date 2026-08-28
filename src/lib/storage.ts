/**
 * Storage adapter layer.
 *
 * - Production (Vercel):  Vercel Blob — set BLOB_READ_WRITE_TOKEN.
 *   Content JSON and uploaded files persist in Blob storage, which
 *   survives deployments and works across serverless instances.
 *
 * - Local development:    the filesystem under ./.data and ./public/uploads.
 *
 * The rest of the app only talks to this interface, so the backing
 * store can be swapped (e.g. for Postgres/KV) without touching the UI.
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Resolve the Vercel Blob read-write token.
 * Normally it's BLOB_READ_WRITE_TOKEN, but when a store is connected with a
 * custom env-prefix, Vercel names it <PREFIX>_READ_WRITE_TOKEN. We accept any
 * env var that ends with READ_WRITE_TOKEN and holds a Blob token value.
 */
function resolveBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("READ_WRITE_TOKEN") && value && value.startsWith("vercel_blob_rw_")) {
      return value;
    }
  }
  return undefined;
}

export function hasBlobStorage(): boolean {
  return !!resolveBlobToken();
}

const DATA_DIR = path.join(process.cwd(), ".data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Content document key. On a public Blob store every blob URL is world-readable,
 * so we make the content document's path unguessable by deriving a suffix from
 * AUTH_SECRET. (It contains your draft content — not secret, but not meant to
 * be browsed directly either.)
 */
function contentKey(): string {
  const secret = process.env.AUTH_SECRET ?? "";
  const suffix = secret
    ? crypto.createHash("sha256").update(secret).digest("hex").slice(0, 20)
    : "local";
  return `portfolio/content-${suffix}.json`;
}

/** Rewrites Vercel Blob errors about private stores into actionable guidance. */
function translateBlobError(e: unknown): Error {
  const msg = e instanceof Error ? e.message : String(e);
  if (/private/i.test(msg) && /(public|access)/i.test(msg)) {
    return new Error(
      "Your Blob store was created with PRIVATE access, but this site needs a PUBLIC store (visitors must be able to load images and the resume). In Vercel: Storage → Create Database → Blob → choose Public access → Connect to this project → disconnect the old private store → Redeploy."
    );
  }
  return e instanceof Error ? e : new Error(msg);
}

// ---------- JSON document storage ----------

export async function readContentRaw(): Promise<string | null> {
  const token = resolveBlobToken();
  if (token) {
    try {
      const key = contentKey();
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: key, limit: 1, token });
      const blob = blobs.find((b) => b.pathname === key);
      if (!blob) return null;
      // Cache-bust the Blob CDN: without this, reads can be stale for up to
      // ~60s after a write, making Publish appear to "not work".
      const bust = `${blob.url}${blob.url.includes("?") ? "&" : "?"}ts=${Date.now()}`;
      const res = await fetch(bust, { cache: "no-store" });
      if (!res.ok) return null;
      return res.text();
    } catch (e) {
      throw translateBlobError(e);
    }
  }
  try {
    return await fs.readFile(path.join(DATA_DIR, "content.json"), "utf-8");
  } catch {
    return null;
  }
}

export async function writeContentRaw(json: string): Promise<void> {
  const token = resolveBlobToken();
  if (token) {
    try {
      const { put } = await import("@vercel/blob");
      await put(contentKey(), json, {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
        token,
      });
    } catch (e) {
      throw translateBlobError(e);
    }
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, "content.json"), json, "utf-8");
}

// ---------- File uploads (images / resume) ----------

export type StoredFile = { url: string; pathname: string };

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function storeFile(
  file: File,
  folder: "images" | "resume"
): Promise<StoredFile> {
  const safe = sanitizeName(file.name || "file");
  const token = resolveBlobToken();
  if (token) {
    try {
      const { put } = await import("@vercel/blob");
      const key = `portfolio/${folder}/${Date.now()}-${safe}`;
      const blob = await put(key, file, { access: "public", addRandomSuffix: false, token });
      return { url: blob.url, pathname: blob.pathname };
    } catch (e) {
      throw translateBlobError(e);
    }
  }
  const dir = path.join(UPLOADS_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${safe}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buf);
  return { url: `/uploads/${folder}/${filename}`, pathname: `uploads/${folder}/${filename}` };
}

export async function deleteFile(urlOrPath: string): Promise<void> {
  const token = resolveBlobToken();
  if (token) {
    const { del } = await import("@vercel/blob");
    await del(urlOrPath, { token });
    return;
  }
  // local: url looks like /uploads/images/xyz.png
  const rel = urlOrPath.replace(/^\//, "");
  if (!rel.startsWith("uploads/")) return; // never delete outside uploads
  try {
    await fs.unlink(path.join(process.cwd(), "public", rel));
  } catch {
    /* already gone */
  }
}

export function storageMode(): "blob" | "filesystem" {
  return resolveBlobToken() ? "blob" : "filesystem";
}
