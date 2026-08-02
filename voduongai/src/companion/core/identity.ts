/**
 * EPIC-A01 — Companion Core Foundation — A01: Companion Identity.
 * (FIX EPIC-A01: thư mục đổi từ `src/ai/companion-brain/` sang
 * `src/companion/core/`, thuật ngữ "Companion Brain" đổi thành
 * "Companion Core" trong toàn bộ chú thích — schema giữ nguyên 100%.)
 *
 * THUẦN KIẾN TRÚC/DỮ LIỆU NỀN TẢNG — KHÔNG kết nối AI, KHÔNG đổi System
 * Prompt (`companion-chat.system.prompt.ts` giữ nguyên 100%, không import
 * file này), KHÔNG có Editor/Server Action nào ở Sprint này (đúng "Chưa
 * tạo Editor. Chỉ Foundation."). File độc lập hoàn toàn khỏi
 * `src/ai/providers/**` (Runtime/Adapter/ProviderManager/Manifest/
 * Credential Layer) — không import, không bị import.
 *
 * NGUYÊN TẮC TRUNG THỰC (nhất quán với Manifest/Credential Architecture
 * ở CS-03/CS-04): nội dung Mission/Vision/Personality/Tone of Voice...
 * là quyết định thương hiệu/sản phẩm CỦA FOUNDER — KHÔNG tự soạn nội
 * dung này. Bản draft dưới đây CHỈ dựng đúng SCHEMA (đủ field, có
 * version + trạng thái Draft/Published theo đúng yêu cầu), mọi giá trị
 * text đều là placeholder trung thực, chờ Founder/PMO biên tập ở Sprint
 * có Editor.
 */

export type IdentityStatus = "draft" | "published";

export type CompanionIdentity = {
  version: number;
  status: IdentityStatus;
  mission: string;
  vision: string;
  coreValues: string[];
  personality: string;
  toneOfVoice: string;
  mentorPrinciples: string[];
  boundaries: string[];
  nonGoals: string[];
};

const NOT_CURATED = "Chưa biên tập — chờ Founder/PMO xác nhận nội dung thật.";

/** Bản Draft duy nhất, version 1 — đúng yêu cầu "Identity phải có version"
    + "Identity phải có trạng thái Draft/Published". */
export const COMPANION_IDENTITY_DRAFT: CompanionIdentity = {
  version: 1,
  status: "draft",
  mission: NOT_CURATED,
  vision: NOT_CURATED,
  coreValues: [NOT_CURATED],
  personality: NOT_CURATED,
  toneOfVoice: NOT_CURATED,
  mentorPrinciples: [NOT_CURATED],
  boundaries: [NOT_CURATED],
  nonGoals: [NOT_CURATED],
};

export function getCompanionIdentity(): CompanionIdentity {
  return COMPANION_IDENTITY_DRAFT;
}
