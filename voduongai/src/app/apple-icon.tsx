import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1220 0%, #111A2E 100%)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB" />
          <circle cx="27" cy="7.5" r="3" fill="#FF7A00" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
