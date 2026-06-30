/**
 * CompanionIndex — Metadata schema để Companion đọc hiểu từng Knowledge Object.
 * Sprint: Portal Knowledge Architecture
 * Xem: docs/PORTAL_KNOWLEDGE_ARCHITECTURE.md#companion-knowledge-index
 *
 * Mục tiêu: Sau này Companion có thể trả lời:
 * - mục này là gì?
 * - dùng cho ai?
 * - nên đọc phần nào trước?
 * - tài liệu nào liên quan?
 * - bài viết nào mới?
 * - cơ hội nằm ở đâu?
 * - rủi ro nằm ở đâu?
 */

import type { KnowledgeObjectType } from "./types";
import type { SupportedLocale } from "@/lib/i18n/config";

/** Mức độ tin cậy của nội dung — Companion sẽ cẩn thận hơn với low trust. */
export type TrustLevel = "verified" | "curated" | "user_generated" | "external";

/** Đường dẫn được đề xuất để người dùng đọc theo thứ tự. */
export type RecommendedPath = {
  step: number;
  label: string;
  href: string;
  objectType: KnowledgeObjectType;
};

/**
 * CompanionIndex là metadata đính kèm vào mỗi Knowledge Object.
 * Companion dùng để hiểu nội dung mà không cần đọc toàn bộ object.
 */
export type CompanionIndex = {
  /** Loại tri thức này là gì về mặt nhận thức. */
  knowledgeType:
    | "tool_guide"       // hướng dẫn dùng công cụ
    | "reference"        // tài liệu tham khảo
    | "tutorial"         // hướng dẫn từng bước
    | "concept"          // khái niệm, lý thuyết
    | "case_study"       // nghiên cứu thực tế
    | "opportunity"      // cơ hội đầu tư/tham gia
    | "community"        // không gian cộng đồng
    | "personal_space"   // không gian cá nhân
    | "companion_doc";   // tài liệu về Companion

  /** Danh mục trong Portal (maps to nav section). */
  category:
    | "ai_workspace"
    | "knowledge_library"
    | "learning_journal"
    | "academy"
    | "projects_opportunities"
    | "community"
    | "companion"
    | "my_journey";

  /** Chủ đề cụ thể (tự do, dùng để search và recommend). */
  topics: string[];

  /** Ai nên đọc tài liệu này? */
  targetAudience?: string;

  /** Cấp độ từ góc nhìn người dùng. */
  level: "beginner" | "intermediate" | "advanced" | "all";

  /** Nội dung phức tạp thế nào với người mới? */
  difficulty: "easy" | "medium" | "hard";

  /** Các object liên quan để Companion gợi ý tiếp theo. */
  relatedObjects?: Array<{
    id: string;
    type: KnowledgeObjectType;
    reason: string; // tại sao liên quan
  }>;

  /** Lộ trình đọc được đề xuất nếu object này là điểm bắt đầu. */
  recommendedPath?: RecommendedPath[];

  /**
   * Tóm tắt ngắn để Companion dùng khi giới thiệu object này với người dùng.
   * Viết như Companion đang giải thích: "Đây là..."
   * Không phải marketing copy. Phải trung thực và cụ thể.
   */
  summaryForCompanion: string;

  /** Nguồn gốc nội dung. */
  sourceType: "internal" | "external" | "community" | "founder";

  /** Thời điểm cập nhật — Companion ưu tiên nội dung mới hơn. */
  lastUpdated?: string;

  /** Mức độ tin cậy. */
  trustLevel: TrustLevel;

  /** Ngôn ngữ nội dung gốc. */
  language: SupportedLocale;

  /**
   * Ghi chú đặc biệt cho Companion — những điều cần lưu ý khi giới thiệu.
   * Ví dụ: "Đây là cơ hội — luôn trình bày rủi ro trước."
   * Ví dụ: "Nội dung này có thể đã cũ — hỏi ngày cập nhật."
   */
  companionNotes?: string;
};

/**
 * Helper tạo CompanionIndex tối thiểu với default an toàn.
 * Dùng khi chưa muốn điền đầy đủ metadata.
 */
export function createBasicCompanionIndex(
  partial: Pick<CompanionIndex, "knowledgeType" | "category" | "summaryForCompanion"> &
    Partial<CompanionIndex>
): CompanionIndex {
  return {
    topics: [],
    level: "all",
    difficulty: "easy",
    sourceType: "internal",
    trustLevel: "curated",
    language: "vi",
    ...partial,
  };
}
