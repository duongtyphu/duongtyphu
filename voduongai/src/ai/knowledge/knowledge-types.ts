/**
 * SPRINT A05 — Platform Intelligence & Knowledge Routing: Knowledge Types.
 *
 * `src/ai/knowledge/` là namespace MỚI, đứng trên `src/ai/mentor/` +
 * `src/ai/platform/` — vẫn hoàn toàn độc lập khỏi Runtime chat thật,
 * Provider Layer, Prompt, Chat, UI, Database, Memory, CKOS/Premium/Portal
 * Catalog thật. `KnowledgeType` CHỈ liệt kê các LOẠI tri thức Companion có
 * thể cần tham chiếu — KHÔNG tạo dữ liệu tri thức thật, KHÔNG đọc CKOS.
 */

export type KnowledgeType =
  | "course"
  | "lesson"
  | "tool"
  | "prompt"
  | "workflow"
  | "resource"
  | "faq"
  | "best-practice"
  | "case-study"
  | "project"
  | "premium-content"
  | "community-support"
  | "reflection"
  | "progress"
  | "general-guidance";

export const KNOWLEDGE_TYPES: readonly KnowledgeType[] = [
  "course",
  "lesson",
  "tool",
  "prompt",
  "workflow",
  "resource",
  "faq",
  "best-practice",
  "case-study",
  "project",
  "premium-content",
  "community-support",
  "reflection",
  "progress",
  "general-guidance",
];

/** Type guard thuần — chỉ kiểm tra shape. */
export function isKnowledgeType(value: string): value is KnowledgeType {
  return (KNOWLEDGE_TYPES as readonly string[]).includes(value);
}
