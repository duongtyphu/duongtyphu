/**
 * First Footprint Mirror Integration (Sprint 16.0, Nhiệm vụ 08). Khung
 * (framework) để Mirror mở lại dấu chân đầu tiên của người dùng sau
 * nhiều tháng — không có automation tự động kích hoạt, chỉ định nghĩa
 * dữ liệu và lời mở của Companion khi trang Mirror chọn hiển thị. Xem
 * `docs/THE_FIRST_FOOTPRINT_CEREMONY.md`, `docs/THE_MIRROR_OF_GROWTH.md`.
 */

import type { MemoryCapsule } from "@/lib/portal/memoryCapsules";

export type FirstFootprintMirrorView = {
  /** Lời Companion nói khi mở lại dấu chân đầu tiên. */
  companionLine: string;
  /** Điều người dùng đã viết, nếu có viết. */
  footprint?: string;
  occurredAt: string;
};

/**
 * Trả về dữ liệu để Mirror hiển thị lại "The First Footprint", hoặc
 * `null` nếu người dùng chưa từng có capsule này (ví dụ đã bỏ qua ở
 * Sprint cũ, hoặc capsule bị xoá). Không chấm điểm, không so sánh tiến
 * bộ — chỉ nhắc "đây là nơi bạn từng đứng".
 */
export function buildFirstFootprintMirrorView(capsules: MemoryCapsule[]): FirstFootprintMirrorView | null {
  const capsule = capsules.find((c) => c.kind === "first_footprint");
  if (!capsule) return null;
  return {
    companionLine: "Đây là dấu chân đầu tiên của bạn.",
    footprint: capsule.description,
    occurredAt: capsule.occurredAt,
  };
}
