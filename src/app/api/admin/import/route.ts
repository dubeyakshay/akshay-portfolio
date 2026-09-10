import { NextRequest, NextResponse } from "next/server";
import { extractPdfText, parseResume, applyParsedToDraft } from "@/lib/resumeParser";
import type { ParsedResume } from "@/lib/resumeParser";
import { analyzeJd } from "@/lib/jdAnalyzer";
import { getDocument, saveDraft } from "@/lib/content";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // AI parsing can take a while

const MAX_PDF_BYTES = 10 * 1024 * 1024;

/**
 * POST multipart/form-data  { file (PDF) }         → parse resume, return suggestions
 * POST application/json     { action: "apply", parsed, selections } → merge into draft
 * POST application/json     { action: "analyze-jd", jd }            → JD gap analysis
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  // ---------- resume PDF → suggestions ----------
  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
    }
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF resume" }, { status: 400 });
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: "PDF exceeds 10 MB limit" }, { status: 400 });
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const text = await extractPdfText(buffer);
      if (!text || text.trim().length < 50) {
        return NextResponse.json(
          {
            error:
              "Could not extract readable text from this PDF. It may be a scanned image — export a text-based PDF from Word/Google Docs instead.",
          },
          { status: 422 }
        );
      }
      const parsed = await parseResume(text);
      return NextResponse.json({ parsed, textLength: text.length });
    } catch (e) {
      return NextResponse.json(
        { error: `Parsing failed: ${e instanceof Error ? e.message : "unknown error"}` },
        { status: 500 }
      );
    }
  }

  // ---------- JSON actions ----------
  let body: {
    action?: string;
    parsed?: ParsedResume;
    selections?: Record<string, boolean>;
    jd?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.action === "apply") {
    if (!body.parsed || !body.selections) {
      return NextResponse.json({ error: "Missing parsed data or selections" }, { status: 400 });
    }
    try {
      const doc = await getDocument();
      const nextDraft = applyParsedToDraft(doc.draft, body.parsed, body.selections);
      const saved = await saveDraft(nextDraft);
      revalidatePath("/preview");
      return NextResponse.json(saved);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Apply failed" },
        { status: 500 }
      );
    }
  }

  if (body.action === "analyze-jd") {
    if (!body.jd || body.jd.trim().length < 30) {
      return NextResponse.json(
        { error: "Paste the full job description (at least a few lines)" },
        { status: 400 }
      );
    }
    try {
      const doc = await getDocument();
      const analysis = await analyzeJd(body.jd, doc.draft);
      return NextResponse.json({ analysis });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Analysis failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
