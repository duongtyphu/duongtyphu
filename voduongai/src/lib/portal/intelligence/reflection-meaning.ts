/**
 * Reflection Meaning Engine (Sprint 12.3). Portal không hỏi "Reflection
 * này sâu bao nhiêu?" — Portal hỏi "Reflection này đang nói điều gì về
 * con người?" Đây là khác biệt giữa PHÂN TÍCH và THẤU HIỂU. Xem
 * `docs/REFLECTION_MEANING_ENGINE.md`.
 *
 * `ReflectionMeaning` KHÔNG phải điểm số, không có tốt/xấu, không có
 * mạnh/yếu — chỉ là ý nghĩa Reflection đang truyền tải.
 */

export type ReflectionMeaning =
  | "persistence"
  | "curiosity"
  | "courage"
  | "humility"
  | "contribution"
  | "gratitude"
  | "recovery"
  | "focus"
  | "discovery"
  | "responsibility";

export const REFLECTION_MEANING_LABEL: Record<ReflectionMeaning, string> = {
  persistence: "Kiên trì",
  curiosity: "Tò mò",
  courage: "Can đảm",
  humility: "Khiêm tốn",
  contribution: "Đóng góp",
  gratitude: "Biết ơn",
  recovery: "Phục hồi",
  focus: "Tập trung",
  discovery: "Khám phá",
  responsibility: "Trách nhiệm",
};

type MeaningRule = { meaning: ReflectionMeaning; keywords: string[] };

/**
 * Sprint 12.3 — Nhiệm vụ 02. Rule-based đơn giản, không AI/LLM/NLP
 * phức tạp — chỉ khớp từ khoá. Không cố phân loại hoàn hảo; quan trọng
 * nhất là kiến trúc (mỗi tín hiệu mới chỉ cần thêm một rule).
 */
const MEANING_RULES: MeaningRule[] = [
  { meaning: "recovery", keywords: ["nghỉ", "mệt", "kiệt sức", "chậm lại"] },
  { meaning: "humility", keywords: ["mình sai", "nhận ra mình sai", "lẽ ra"] },
  { meaning: "contribution", keywords: ["giúp người khác", "chia sẻ với", "hỗ trợ"] },
  { meaning: "gratitude", keywords: ["biết ơn", "cảm ơn", "trân trọng"] },
  { meaning: "courage", keywords: ["dám", "sợ nhưng vẫn", "đối mặt"] },
  { meaning: "curiosity", keywords: ["tò mò", "thắc mắc", "muốn hiểu"] },
  { meaning: "discovery", keywords: ["nhận ra", "phát hiện", "lần đầu hiểu"] },
  { meaning: "focus", keywords: ["tập trung", "không bị phân tâm"] },
  { meaning: "responsibility", keywords: ["trách nhiệm", "cam kết", "giữ lời"] },
  { meaning: "persistence", keywords: ["quay lại", "tiếp tục", "không bỏ cuộc", "vẫn cố"] },
];

/**
 * Sprint 12.3 — Nhiệm vụ 02. Nhận nội dung Reflection thô, trả về
 * `ReflectionMeaning` đầu tiên khớp — hoặc `null` nếu không nhận ra ý
 * nghĩa nào (im lặng, không ép phân loại).
 */
export function detectReflectionMeaning(answer: string): ReflectionMeaning | null {
  const text = answer.toLowerCase();
  const match = MEANING_RULES.find((rule) =>
    rule.keywords.some((keyword) => text.includes(keyword))
  );
  return match?.meaning ?? null;
}
