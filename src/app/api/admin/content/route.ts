import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getDocument,
  saveDraft,
  publishDraft,
  discardDraft,
} from "@/lib/content";
import type { SiteContent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET → full content document (draft + published + status) */
export async function GET() {
  const doc = await getDocument();
  return NextResponse.json(doc);
}

/**
 * POST → workflow actions
 *   { action: "save",    draft: SiteContent }
 *   { action: "publish" }
 *   { action: "discard" }
 */
export async function POST(req: NextRequest) {
  // On Vercel the filesystem is read-only — Blob storage is required to save content.
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not connected. In Vercel: Storage → Create → Blob → Connect to this project, then redeploy.",
      },
      { status: 500 }
    );
  }

  let body: { action?: string; draft?: SiteContent };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (body.action) {
    case "save": {
      if (!body.draft || typeof body.draft !== "object") {
        return NextResponse.json({ error: "Missing draft" }, { status: 400 });
      }
      const doc = await saveDraft(body.draft);
      revalidatePath("/preview");
      return NextResponse.json(doc);
    }
    case "publish": {
      const doc = await publishDraft();
      revalidatePath("/");
      revalidatePath("/preview");
      return NextResponse.json(doc);
    }
    case "discard": {
      const doc = await discardDraft();
      revalidatePath("/preview");
      return NextResponse.json(doc);
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
