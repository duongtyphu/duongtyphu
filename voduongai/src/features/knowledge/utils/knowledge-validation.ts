/**
 * CKOS — EC-001: Knowledge Foundation
 * Validation rules cho publish Knowledge Asset.
 *
 * Một Asset chỉ được publish khi có đủ mục tiêu, người phù hợp, giá trị
 * học tập, thực hành và bước tiếp theo — nếu thiếu, nó chưa phải là
 * Knowledge Asset của VO DUONG AI.
 */

import type {
  KnowledgeAsset,
  KnowledgeValidationError,
  KnowledgeValidationResult,
} from "../types/knowledge.types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Kiểm tra toàn bộ field bắt buộc để publish. Trả về danh sách lỗi rõ ràng
 * theo từng field — không throw, để caller (service/admin) tự quyết định
 * cách hiển thị.
 */
export function validateKnowledgeAsset(
  asset: Partial<KnowledgeAsset>
): KnowledgeValidationResult {
  const errors: KnowledgeValidationError[] = [];

  if (!isNonEmptyString(asset.title)) {
    errors.push({ field: "title", message: "Thiếu tiêu đề (title)." });
  }
  if (!isNonEmptyString(asset.slug)) {
    errors.push({ field: "slug", message: "Thiếu slug." });
  }
  if (!isNonEmptyString(asset.type)) {
    errors.push({ field: "type", message: "Thiếu loại tri thức (type)." });
  }

  const dna = asset.dna;
  if (!dna || !isNonEmptyArray(dna.goal)) {
    errors.push({ field: "goal", message: "Cần ít nhất 1 mục tiêu (goal)." });
  }
  if (!dna || !isNonEmptyArray(dna.persona)) {
    errors.push({ field: "persona", message: "Cần ít nhất 1 đối tượng phù hợp (persona)." });
  }
  if (!dna || !isNonEmptyString(dna.difficulty)) {
    errors.push({ field: "difficulty", message: "Thiếu mức độ khó (difficulty)." });
  }
  if (!dna || !isNonEmptyString(dna.learningOutcome)) {
    errors.push({ field: "learningOutcome", message: "Thiếu giá trị học tập (learningOutcome)." });
  }

  const growth = asset.growth;
  if (!growth || !isNonEmptyArray(growth.reflectionQuestions)) {
    errors.push({
      field: "reflectionQuestions",
      message: "Cần ít nhất 1 câu hỏi phản tư (reflectionQuestions).",
    });
  }
  if (!growth || !isNonEmptyString(growth.nextStep)) {
    errors.push({ field: "nextStep", message: "Thiếu bước tiếp theo (nextStep)." });
  }

  return { valid: errors.length === 0, errors };
}

/** Convenience helper: có publish được không (bool), không cần đọc chi tiết lỗi. */
export function canPublishKnowledgeAsset(asset: Partial<KnowledgeAsset>): boolean {
  return validateKnowledgeAsset(asset).valid;
}
