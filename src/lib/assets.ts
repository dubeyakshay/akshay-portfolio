import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./types";

/**
 * Server-side guard against broken local asset links.
 * If resumeUrl / profileImageUrl point at a local /public path that does
 * not exist on disk, blank them so the UI hides the button/image instead
 * of rendering a dead link. Remote URLs (uploads on Vercel Blob) pass through.
 */
async function localFileExists(publicPath: string): Promise<boolean> {
  try {
    await fs.access(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

export async function withVerifiedAssets(content: SiteContent): Promise<SiteContent> {
  const next = structuredClone(content);
  const { profile } = next;

  if (profile.resumeUrl.startsWith("/") && !(await localFileExists(profile.resumeUrl))) {
    profile.resumeUrl = "";
  }
  if (
    profile.profileImageUrl.startsWith("/") &&
    !(await localFileExists(profile.profileImageUrl))
  ) {
    profile.profileImageUrl = "";
  }
  return next;
}
