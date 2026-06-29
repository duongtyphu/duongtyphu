/**
 * Outcome Signal (Sprint 22.0 — "The Transformation Engine"). Xem
 * `docs/TRANSFORMATION_ENGINE.md`.
 *
 * Đóng Outcome Gap ở mức nhỏ, thật, không overbuild. Outcome ở đây
 * KHÔNG đo "Companion đã hành động gì" — chưa có nơi nào trong code ghi
 * lại một Act với ID để đọc lại hiệu ứng của riêng nó (đây là khoảng
 * trống lớn nhất, xem Education Debt trong `TRANSFORMATION_ENGINE.md`).
 *
 * Outcome ở mức nhỏ nhất có thể đo THẬT hôm nay: khi một
 * `ReflectionMeaning` mới xuất hiện, nó có cùng hướng Character mà
 * Companion ĐÃ giữ với người này không (`character-memory.ts`)? Đây là
 * tín hiệu rule-based, local/user-level (localStorage, per-device, như
 * `character-memory.ts`), không analytics, không aggregate cross-user,
 * không lưu nội dung Reflection, không biến thành KPI.
 */

import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";
import {
  getCharacterMemory,
  hasCharacterPreference,
  preferenceForMeaning,
} from "./character-memory";

export type OutcomeSignal = "aligned" | "new-direction";

/**
 * Gọi sau khi một Reflection mới được lưu và đã có `ReflectionMeaning`.
 * "aligned" = hướng này đã là một Character thật của Companion với
 * người này (lặp lại — dấu hiệu của Repeated Alignment, xem Lifecycle).
 * "new-direction" = hướng này chưa từng đủ ngưỡng trở thành Character —
 * không phải sai, chỉ là chưa đủ bằng chứng để gọi là Outcome lặp lại.
 */
export function recordCompanionOutcome(meaning: ReflectionMeaning): OutcomeSignal {
  const preference = preferenceForMeaning(meaning);
  const memory = getCharacterMemory();
  return hasCharacterPreference(memory, preference) ? "aligned" : "new-direction";
}

/**
 * Đọc lại Outcome mà không ghi thêm gì — dùng khi chỉ cần biết trạng
 * thái hiện tại (ví dụ trước khi quyết định có phải Transformation
 * Candidate hay không), không cần gọi `recordCompanionOutcome` lần nữa.
 */
export function getOutcomeAfterAction(meaning: ReflectionMeaning): OutcomeSignal {
  return recordCompanionOutcome(meaning);
}

/**
 * Sprint 22.0 — Nhiệm vụ 5. Điều kiện đơn giản, rule-based, không suy
 * diễn: chỉ true khi CẢ BA đúng. Không tính `private identifier` vì
 * tham số đầu vào ở đây không bao giờ chứa văn bản Reflection gốc hay
 * thông tin nhận diện — đúng Privacy Boundary đã áp cho
 * `character-memory.ts`.
 */
export function isTransformationCandidate(params: {
  meaning: ReflectionMeaning | null;
  outcome: OutcomeSignal | null;
  hasReflectionAfterOutcome: boolean;
}): boolean {
  if (!params.meaning || !params.outcome) return false;
  if (!params.hasReflectionAfterOutcome) return false;
  if (params.outcome !== "aligned") return false;
  return true;
}
