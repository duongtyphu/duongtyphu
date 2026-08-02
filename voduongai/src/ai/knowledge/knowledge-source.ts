/**
 * SPRINT A05 — Platform Intelligence & Knowledge Routing: Knowledge
 * Sources.
 *
 * `KnowledgeSource` liệt kê CÁC NGUỒN Companion có thể ưu tiên tham
 * chiếu, cùng thứ tự ưu tiên MẶC ĐỊNH đã chốt (Phần 4 của Sprint). CHỈ
 * mô hình hoá thứ tự — KHÔNG kiểm tra quyền truy cập thật, KHÔNG đọc dữ
 * liệu thật từ CKOS/Premium/Portal Catalog nào.
 */

export type KnowledgeSource =
  | "ckos"
  | "academy"
  | "premium"
  | "workspace"
  | "projects"
  | "community"
  | "user-journey"
  | "user-reflection"
  | "platform-catalog"
  | "general-model-knowledge";

/**
 * Thứ tự ưu tiên MẶC ĐỊNH — index nhỏ hơn = ưu tiên cao hơn, đúng 5 tầng
 * đã chốt: (1) CKOS/nội dung đã kiểm duyệt; (2) Học viện/dữ liệu nền
 * tảng đã xuất bản (`academy`/`platform-catalog`/`workspace`); (3)
 * Premium/Dự án/Cộng đồng — cần liên quan/có quyền; (4) dữ liệu hành
 * trình/người dùng được phép dùng; (5) kiến thức chung của model.
 */
export const KNOWLEDGE_SOURCE_PRIORITY_ORDER: readonly KnowledgeSource[] = [
  "ckos",
  "academy",
  "platform-catalog",
  "workspace",
  "premium",
  "projects",
  "community",
  "user-journey",
  "user-reflection",
  "general-model-knowledge",
];

export const KNOWLEDGE_SOURCES: readonly KnowledgeSource[] = KNOWLEDGE_SOURCE_PRIORITY_ORDER;

/** Type guard thuần — chỉ kiểm tra shape. */
export function isKnowledgeSource(value: string): value is KnowledgeSource {
  return (KNOWLEDGE_SOURCES as readonly string[]).includes(value);
}

/**
 * Helper thuần — sắp `sources` theo đúng `KNOWLEDGE_SOURCE_PRIORITY_ORDER`,
 * khử trùng lặp, trả mảng MỚI (không mutate input). Deterministic — cùng
 * input luôn cho cùng output.
 */
export function sortSourcesByPriority(sources: readonly KnowledgeSource[]): KnowledgeSource[] {
  const unique = Array.from(new Set(sources));
  return unique.sort(
    (a, b) => KNOWLEDGE_SOURCE_PRIORITY_ORDER.indexOf(a) - KNOWLEDGE_SOURCE_PRIORITY_ORDER.indexOf(b)
  );
}
