import { NextResponse } from "next/server";
import { storageMode } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only diagnostics (guarded by middleware).
 * GET /api/admin/status — shows what the server can actually see,
 * without leaking any secret values.
 */
export async function GET() {
  const tokenVars = Object.keys(process.env).filter((k) =>
    k.endsWith("READ_WRITE_TOKEN")
  );
  return NextResponse.json({
    onVercel: !!process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    storageMode: storageMode(),
    blobTokenDetected: storageMode() === "blob",
    tokenVariableNamesFound: tokenVars, // names only, never values
    authConfigured:
      !!process.env.ADMIN_USERNAME &&
      !!(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) &&
      !!process.env.AUTH_SECRET,
  });
}
