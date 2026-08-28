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

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

const DATA_DIR = path.join(process.cwd(), ".data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const CONTENT_KEY = "portfolio/content.json";

// ---------- JSON document storage ----------

export async function readContentRaw(): Promise<string | null> {
  if (useBlob) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: CONTENT_KEY, limit: 1 });
    const blob = blobs.find((b) => b.pathname === CONTENT_KEY);
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return res.text();
  }
  try {
    return await fs.readFile(path.join(DATA_DIR, "content.json"), "utf-8");
  } catch {
    return null;
  }
}

export async function writeContentRaw(json: string): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(CONTENT_KEY, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
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
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const key = `portfolio/${folder}/${Date.now()}-${safe}`;
    const blob = await put(key, file, { access: "public", addRandomSuffix: false });
    return { url: blob.url, pathname: blob.pathname };
  }
  const dir = path.join(UPLOADS_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${safe}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buf);
  return { url: `/uploads/${folder}/${filename}`, pathname: `uploads/${folder}/${filename}` };
}

export async function deleteFile(urlOrPath: string): Promise<void> {
  if (useBlob) {
    const { del } = await import("@vercel/blob");
    await del(urlOrPath);
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
  return useBlob ? "blob" : "filesystem";
}
