/**
 * CKOS — EC-001: Knowledge Foundation
 * Nhãn hiển thị tiếng Việt cho UI — giữ thuật ngữ CKOS/KnowledgeAsset
 * chỉ ở trong code, không lộ ra người dùng cuối.
 */

import { KnowledgeType } from "../types/knowledge.types";

export const KNOWLEDGE_TYPE_LABELS: Record<KnowledgeType, string> = {
  [KnowledgeType.ARTICLE]: "Bài viết",
  [KnowledgeType.GUIDE]: "Hướng dẫn",
  [KnowledgeType.PROMPT]: "Prompt",
  [KnowledgeType.CHECKLIST]: "Checklist",
  [KnowledgeType.TEMPLATE]: "Template",
  [KnowledgeType.FRAMEWORK]: "Framework",
  [KnowledgeType.SOP]: "SOP",
  [KnowledgeType.PLAYBOOK]: "Playbook",
  [KnowledgeType.WORKFLOW]: "Quy trình",
  [KnowledgeType.CASE_STUDY]: "Case Study",
  [KnowledgeType.VIDEO]: "Video",
  [KnowledgeType.PDF]: "PDF",
  [KnowledgeType.FAQ]: "FAQ",
  [KnowledgeType.EXERCISE]: "Bài tập",
  [KnowledgeType.REFLECTION]: "Chiêm nghiệm",
  [KnowledgeType.ASSESSMENT]: "Đánh giá",
  [KnowledgeType.CHEATSHEET]: "Cheatsheet",
  [KnowledgeType.MINDMAP]: "Mindmap",
};

/** Danh sách persona/goal phổ biến trong seed data — dùng cho filter UI. */
export const KNOWLEDGE_PERSONAS = [
  "Nhân viên văn phòng",
  "Quản lý",
  "Kế toán",
  "Chăm sóc khách hàng",
  "Người làm nội dung",
  "Nhà nghiên cứu",
] as const;

export const KNOWLEDGE_GOALS = [
  "Viết email nhanh hơn",
  "Xử lý dữ liệu nhanh hơn",
  "Làm slide nhanh hơn",
  "Viết báo cáo nhanh hơn",
  "Không bỏ sót việc cần làm sau họp",
  "Đọc tài liệu dài nhanh hơn",
  "Viết nội dung hấp dẫn hơn",
  "Làm việc có ưu tiên rõ ràng hơn",
  "Nghiên cứu nhanh hơn",
  "Trả lời nhất quán hơn",
] as const;
