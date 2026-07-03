/**
 * Companion Task Entry (Sprint 04 patch). Gợi ý nhanh theo module — chỉ là
 * TIỀN TỐ điền sẵn vào ô nhập của người dùng, KHÔNG phải danh sách Agent để
 * chọn. Người dùng vẫn có thể sửa lại trước khi bấm "Giao việc cho Companion".
 */

import type { PortalModule } from "./agent.types";

/** Dùng khi route không thuộc 1 trong 4 module có gợi ý riêng (Premium/Nhật ký/Hành trình/Khu vườn, hoặc mặc định). */
export const DEFAULT_QUICK_MISSIONS: string[] = [
  "Tạo Landing Page",
  "Viết bài Blog",
  "Tạo Banner",
  "Phân tích dự án",
  "Viết Prompt",
  "Tóm tắt tài liệu",
  "Lập kế hoạch nội dung",
  "Thực hành bài đang học",
];

const MODULE_QUICK_MISSIONS: Partial<Record<PortalModule, string[]>> = {
  "khong-gian-ai": ["Thử ý tưởng với AI", "Tạo nội dung", "Tạo hình ảnh", "Viết Prompt"],
  ckos: ["Tóm tắt Seed này", "Thực hành Seed này", "Tạo Prompt từ Seed này"],
  academy: ["Bắt đầu Mission", "Tạo Evidence", "Viết Reflection", "Nhờ Companion lập kế hoạch"],
  opportunities: ["Phân tích dự án", "Đánh giá rủi ro", "Lập kế hoạch hành động"],
};

export function getQuickMissions(module: PortalModule | null): string[] {
  if (module && MODULE_QUICK_MISSIONS[module]) return MODULE_QUICK_MISSIONS[module]!;
  return DEFAULT_QUICK_MISSIONS;
}
