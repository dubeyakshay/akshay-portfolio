import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export const runtime = "nodejs";

// naive in-memory throttle (per instance) to slow brute force
const attempts = new Map<string, { count: number; ts: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.ts < 60_000 && rec.count >= 8) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ok = await verifyCredentials(body.username ?? "", body.password ?? "");
  if (!ok) {
    const prev = rec && now - rec.ts < 60_000 ? rec.count : 0;
    attempts.set(ip, { count: prev + 1, ts: now });
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  attempts.delete(ip);
  await createSession(body.username as string);
  return NextResponse.json({ ok: true });
}
