import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0B1220 0%, #111A2E 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="84" height="84" viewBox="0 0 32 32" fill="none">
            <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
            <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
          </svg>
          <span style={{ fontSize: 56, fontWeight: 800, color: "#FFFFFF" }}>
            Võ Đương AI
          </span>
        </div>
        <span style={{ marginTop: 28, fontSize: 30, color: "#94A3B8" }}>
          {siteConfig.tagline}
        </span>
      </div>
    ),
    { ...size }
  );
}
