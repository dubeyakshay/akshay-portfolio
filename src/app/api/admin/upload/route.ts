import { NextRequest, NextResponse } from "next/server";
import { storeFile, deleteFile } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15 MB

/**
 * POST multipart/form-data
 *   file:   the file
 *   kind:   "image" | "resume"
 */
export async function POST(req: NextRequest) {
  // On Vercel the filesystem is read-only — Blob storage is required.
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not connected. In Vercel: Storage → Create → Blob → Connect to this project, then redeploy.",
      },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }
  const file = form.get("file");
  const kind = form.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (kind === "image") {
    if (!IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use JPG, PNG, WebP, GIF or SVG." },
        { status: 400 }
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image exceeds 8 MB limit" }, { status: 400 });
    }
    try {
      const stored = await storeFile(file, "images");
      return NextResponse.json({
        url: stored.url,
        name: file.name,
        contentType: file.type,
      });
    } catch (e) {
      return NextResponse.json(
        { error: `Storage error: ${e instanceof Error ? e.message : "unknown"}` },
        { status: 500 }
      );
    }
  }

  if (kind === "resume") {
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Resume must be a PDF" }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "PDF exceeds 15 MB limit" }, { status: 400 });
    }
    try {
      const stored = await storeFile(file, "resume");
      return NextResponse.json({
        url: stored.url,
        name: file.name,
        contentType: file.type,
      });
    } catch (e) {
      return NextResponse.json(
        { error: `Storage error: ${e instanceof Error ? e.message : "unknown"}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Unknown upload kind" }, { status: 400 });
}

/** DELETE { url } — removes a previously uploaded file */
export async function DELETE(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }
  await deleteFile(body.url);
  return NextResponse.json({ ok: true });
}
