/**
 * CKOS — Sprint 02: The Knowledge Journey™
 * Danh sách mục tiêu hiển thị ở Companion Discovery — mỗi mục tiêu match
 * với `goal` của một hoặc nhiều Knowledge Seed.
 */

export type DiscoveryGoal = {
  id: string;
  label: string;
};

export const DISCOVERY_GOALS: DiscoveryGoal[] = [
  { id: "tiet-kiem-thoi-gian", label: "Tôi muốn tiết kiệm thời gian" },
  { id: "lam-viec-nhanh-hon", label: "Tôi muốn làm việc nhanh hơn" },
  { id: "hoc-ai", label: "Tôi muốn học AI" },
  { id: "viet-email", label: "Tôi muốn viết email" },
  { id: "lam-powerpoint", label: "Tôi muốn làm PowerPoint" },
  { id: "viet-bao-cao", label: "Tôi muốn viết báo cáo" },
  { id: "nghien-cuu", label: "Tôi muốn nghiên cứu" },
  { id: "hoc-prompt", label: "Tôi muốn học Prompt" },
  { id: "bat-dau-affiliate", label: "Tôi muốn bắt đầu Affiliate" },
  { id: "chua-biet-bat-dau", label: "Tôi chưa biết bắt đầu từ đâu" },
];

/**
 * Map mục tiêu Discovery -> `goal` string dùng trong KnowledgeSeed.goal.
 * Vài mục tiêu (Affiliate, học Prompt riêng lẻ) chưa có Seed tương ứng ở
 * Sprint 02 — fallback về "chưa biết bắt đầu" để vẫn gợi ý được gì đó.
 */
export const DISCOVERY_GOAL_TO_SEED_GOAL: Record<string, string> = {
  "tiet-kiem-thoi-gian": "Tôi muốn tiết kiệm thời gian",
  "lam-viec-nhanh-hon": "Tôi muốn làm việc nhanh hơn",
  "hoc-ai": "Tôi muốn học AI",
  "viet-email": "Tôi muốn viết email",
  "lam-powerpoint": "Tôi muốn làm PowerPoint",
  "viet-bao-cao": "Tôi muốn tiết kiệm thời gian",
  "nghien-cuu": "Tôi muốn nghiên cứu",
  "hoc-prompt": "Tôi muốn học AI",
  "bat-dau-affiliate": "Tôi chưa biết bắt đầu từ đâu",
  "chua-biet-bat-dau": "Tôi chưa biết bắt đầu từ đâu",
};
