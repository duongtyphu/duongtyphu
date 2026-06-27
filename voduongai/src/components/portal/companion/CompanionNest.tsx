"use client";

/**
 * Companion Nest (Sprint 8.5 — Nhiệm vụ 01). "Nhà" của Companion — không
 * phải box/button/chat bubble, mà một vùng năng lượng rất nhẹ để Companion
 * "đứng nghỉ" khi idle. Render phía sau avatar (xem `.companion-nest` +
 * `.companion-ring` trong `globals.css`). Khi drag, Nest mờ đi; khi
 * minimize, Nest rộng hơn và đứng yên cùng orb thu nhỏ.
 */

export function CompanionNest({
  dragging = false,
  minimized = false,
  active = false,
}: {
  dragging?: boolean;
  minimized?: boolean;
  active?: boolean;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`companion-nest ${dragging ? "companion-nest--dragging" : ""} ${
          minimized ? "companion-nest--minimized" : ""
        }`}
      />
      <div
        aria-hidden="true"
        className={`companion-ring ${active ? "companion-ring--active" : ""}`}
      />
    </>
  );
}
