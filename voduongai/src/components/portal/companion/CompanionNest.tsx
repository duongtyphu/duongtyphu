"use client";

/**
 * Companion Nest (Sprint 8.5 — Nhiệm vụ 01). "Nhà" của Companion — không
 * phải box/button/chat bubble, mà một vùng năng lượng rất nhẹ để Companion
 * "đứng nghỉ" khi idle. Render phía sau avatar (xem `.companion-nest`
 * trong `globals.css`). Khi drag, Nest mờ đi; khi minimize, Nest rộng hơn
 * và đứng yên cùng orb thu nhỏ.
 *
 * Đã bỏ `.companion-ring` (viền tròn cam xoay quanh avatar) — vốn thiết
 * kế cho hào quang vàng kim của Companion Master Design cũ, không còn
 * phù hợp sau khi icon nổi đổi sang Living Core™ (đã tự có quầng sáng +
 * quỹ đạo riêng, xem `LivingCore.tsx`).
 */

export function CompanionNest({
  dragging = false,
  minimized = false,
}: {
  dragging?: boolean;
  minimized?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`companion-nest ${dragging ? "companion-nest--dragging" : ""} ${
        minimized ? "companion-nest--minimized" : ""
      }`}
    />
  );
}
