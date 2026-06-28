/**
 * Companion Mirror Dialogue (Sprint 15.0 — The Mirror of Growth, Nhiệm
 * vụ 04). Companion được quyền MỜI người dùng nhìn lại hành trình —
 * không bao giờ chúc mừng kiểu "Congratulations" / "Achievement
 * unlocked". Lời mời, không phải thông báo thành tích. Xem
 * `docs/THE_MIRROR_OF_GROWTH.md`.
 */

import type { GrowthSignal } from "@/lib/portal/growth-map/growth-signals";

const MIRROR_INVITATION_LINES = [
  "Mình muốn cho bạn xem một điều.",
  "Bạn có muốn nhìn lại hành trình của mình không?",
  "Mình nghĩ hôm nay là lúc thích hợp để nhìn lại.",
  "Mình thấy có vài điều rất đẹp mà có thể chính bạn cũng quên.",
];

/**
 * Trả về một lời mời của Companion, hoặc `null` nếu chưa đủ dấu chân để
 * mời (im lặng là một kết quả hợp lệ — Companion không ép người dùng
 * nhìn lại khi chưa có gì đáng kể).
 */
export function buildCompanionMirrorInvitation(signals: GrowthSignal[]): string | null {
  if (signals.length < 3) return null;
  return MIRROR_INVITATION_LINES[signals.length % MIRROR_INVITATION_LINES.length];
}
