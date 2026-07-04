/**
 * EPIC 03 — Phase 2 (B2 hoàn thiện): tổ chức lại Knowledge Asset rời rạc
 * vào Mission (Golden Reference Mission Pack). Đây là phần "Tổ chức lại
 * 69 Knowledge Asset còn rời rạc vào Journey/Collection/Mission" còn
 * thiếu của Sprint B2, theo Roadmap Lock — KHÔNG phải Sprint mới.
 *
 * Ánh xạ theo TỪ KHÓA CHỦ ĐỀ thật (không gán tùy tiện) — chỉ gán
 * `missionId` khi nội dung Asset thực sự khớp chủ đề 1 trong 10 Golden
 * Mission. Asset nào không khớp chủ đề nào để KHÔNG map (đúng nguyên tắc
 * "không gán sai Competency" — Product Guardrails).
 *
 * Kết quả: 46/80 Knowledge Asset (~57%) đã tổ chức vào 6/10 Golden
 * Mission. 34 Asset còn lại thuộc các chủ đề KHÔNG có Golden Mission
 * tương ứng trong 10 Mission hiện có (Ghi chú cuộc họp, Quản lý thời
 * gian, FAQ nội bộ, Báo cáo tuần, Viết Prompt hiệu quả — kỹ năng cross-
 * cutting) — đây là giới hạn phạm vi thật của 10 Golden Mission (đã ghi ở
 * `EPIC03_BLUEPRINT_LOCK.md` mục 4.3: "10 Golden Mission chỉ phủ 8/14
 * Category"), không phải lỗi tổ chức lại.
 */

import type { GoldenMissionId } from "@/lib/portal/foundation/mission-catalog";

export const KNOWLEDGE_ASSET_MISSION_MAP: Record<string, GoldenMissionId> = {
  // ── viet-email-chuyen-nghiep (Mission 1 — AI Writing) ──────────────
  "guide-viet-email-chuyen-nghiep-bang-ai": "viet-email-chuyen-nghiep",
  "prompt-xin-phan-hoi-sau-cuoc-hop": "viet-email-chuyen-nghiep",
  "template-email-tu-choi-lich-su": "viet-email-chuyen-nghiep",
  "checklist-kiem-tra-email-truoc-khi-gui": "viet-email-chuyen-nghiep",
  "framework-cau-truc-email-hieu-qua": "viet-email-chuyen-nghiep",
  "sop-quy-trinh-xu-ly-email-hang-ngay": "viet-email-chuyen-nghiep",
  "case-study-tu-30-phut-xuong-5-phut-viet-email": "viet-email-chuyen-nghiep",
  "exercise-viet-3-phien-ban-email": "viet-email-chuyen-nghiep",

  // ── lam-dashboard-excel (Mission 3 — Data Analysis) ────────────────
  "guide-loc-du-lieu-excel-bang-ai": "lam-dashboard-excel",
  "prompt-tom-tat-file-excel": "lam-dashboard-excel",
  "template-bang-theo-doi-cong-viec-excel": "lam-dashboard-excel",
  "checklist-truoc-khi-gui-file-excel": "lam-dashboard-excel",
  "guide-phan-tich-excel-bang-ai": "lam-dashboard-excel",
  "prompt-viet-cong-thuc-excel-theo-mo-ta": "lam-dashboard-excel",
  "checklist-truoc-khi-gui-file-excel-ai": "lam-dashboard-excel",
  "exercise-nho-ai-viet-cong-thuc-excel": "lam-dashboard-excel",
  "reflection-cong-thuc-ton-thoi-gian-nhat": "lam-dashboard-excel",

  // ── thiet-ke-slide (Mission 4 — Presentation) ──────────────────────
  "guide-thiet-ke-powerpoint-bang-ai": "thiet-ke-slide",
  "prompt-viet-outline-slide": "thiet-ke-slide",
  "template-slide-mo-dau-thuyet-trinh": "thiet-ke-slide",
  "checklist-truoc-khi-thuyet-trinh": "thiet-ke-slide",
  "framework-danh-gia-chat-luong-slide": "thiet-ke-slide",
  "case-study-tu-tin-hon-khi-thuyet-trinh": "thiet-ke-slide",

  // ── viet-content-facebook (Mission 6 — AI Writing/Marketing) ───────
  "guide-viet-noi-dung-thu-hut-bang-ai": "viet-content-facebook",
  "prompt-viet-lai-giong-van-than-thien": "viet-content-facebook",
  "template-bai-viet-chia-se-kinh-nghiem": "viet-content-facebook",
  "checklist-truoc-khi-dang-bai-viet": "viet-content-facebook",
  "framework-ke-chuyen-bang-du-lieu": "viet-content-facebook",

  // ── nghien-cuu-thi-truong (Mission 7 — Research) ───────────────────
  // Gồm cả cụm "nghiên cứu" và cụm "đọc/tóm tắt tài liệu dài" — cùng rèn
  // năng lực Research thật (tổng hợp thông tin, đánh giá độ tin cậy).
  "guide-nghien-cuu-nhanh-bang-ai": "nghien-cuu-thi-truong",
  "prompt-tong-quan-chu-de-nghien-cuu": "nghien-cuu-thi-truong",
  "template-ghi-chu-nghien-cuu": "nghien-cuu-thi-truong",
  "checklist-truoc-khi-ket-luan-nghien-cuu": "nghien-cuu-thi-truong",
  "case-study-rut-ngan-thoi-gian-nghien-cuu": "nghien-cuu-thi-truong",
  "exercise-nghien-cuu-1-chu-de-trong-30-phut": "nghien-cuu-thi-truong",
  "guide-doc-hieu-pdf-dai-bang-ai": "nghien-cuu-thi-truong",
  "prompt-tom-tat-tai-lieu-pdf": "nghien-cuu-thi-truong",
  "template-tom-tat-tai-lieu-1-trang": "nghien-cuu-thi-truong",
  "checklist-truoc-khi-chia-se-pdf": "nghien-cuu-thi-truong",
  "sop-quy-trinh-doc-va-tom-tat-tai-lieu": "nghien-cuu-thi-truong",
  "framework-danh-gia-do-tin-cay-thong-tin-ai": "nghien-cuu-thi-truong",
  "exercise-tom-tat-1-tai-lieu-dai": "nghien-cuu-thi-truong",

  // ── xay-sop (Mission 9 — Automation) ───────────────────────────────
  "guide-tu-dong-hoa-cong-viec-van-phong": "xay-sop",
  "prompt-de-xuat-quy-trinh-tu-dong-hoa": "xay-sop",
  "checklist-xay-quy-trinh-tu-dong-hoa": "xay-sop",
  "exercise-viet-quy-trinh-3-4-buoc-co-ai": "xay-sop",
  "reflection-viec-nao-dang-lap-lai-chua-tu-dong-hoa": "xay-sop",
};

/**
 * 34 Knowledge Asset KHÔNG map — chủ đề không khớp Category nào trong 10
 * Golden Mission hiện có (Ghi chú cuộc họp, Báo cáo tuần, Quản lý thời
 * gian, FAQ nội bộ, Viết Prompt hiệu quả, Reflection tổng quát). Liệt kê
 * tường minh để không ai tưởng nhầm là "bỏ sót" — đây là giới hạn phạm vi
 * đã biết của 10 Golden Mission, chờ Mission mới trong phạm vi Sprint đã
 * khóa (không tạo Sprint/Mission mới ở Phase 2 này).
 */
export const UNMAPPED_KNOWLEDGE_ASSET_TOPICS = [
  "Ghi chú & agenda cuộc họp (6 asset)",
  "Báo cáo tuần — quy trình + mẫu (7 asset, gần AI Writing nhưng không khớp Mission cụ thể nào trong 10 Golden Mission)",
  "Quản lý thời gian / ưu tiên công việc (6 asset — Personal Productivity, ngoài phạm vi 10 Mission)",
  "FAQ nội bộ (5 asset)",
  "Viết Prompt hiệu quả (5 asset — kỹ năng cross-cutting cho mọi Mission, không riêng 1 Mission)",
  "Reflection tổng quát không gắn Mission cụ thể (5 asset)",
] as const;

export function getMissionIdForKnowledgeAsset(assetId: string): GoldenMissionId | undefined {
  return KNOWLEDGE_ASSET_MISSION_MAP[assetId];
}
