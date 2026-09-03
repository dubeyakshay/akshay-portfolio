import { ImageResponse } from "next/og";
import { getPublishedContent } from "@/lib/content";

/**
 * Social share card (Open Graph image) — rendered from published CMS content,
 * so it always shows your current name/title. Appears when the site is shared
 * on LinkedIn, WhatsApp, Slack, X, etc.
 */

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Portfolio preview card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const { profile } = await getPublishedContent();
  const tech = profile.heroTech.slice(0, 8);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(145deg, #07090d 0%, #0b1220 55%, #0d1a2e 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,118,224,0.35) 0%, rgba(59,118,224,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#4fd1a5",
              display: "flex",
            }}
          />
          <div style={{ color: "#8ab8ff", fontSize: "26px", letterSpacing: "4px", display: "flex" }}>
            {profile.experienceBadge.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            color: "#f2f5fa",
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            color: "#5e96f5",
            fontSize: "42px",
            fontWeight: 600,
            marginTop: "14px",
            display: "flex",
          }}
        >
          {profile.title}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "48px" }}>
          {tech.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "#d6dce8",
                fontSize: "24px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
