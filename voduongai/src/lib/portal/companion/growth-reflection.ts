/**
 * Companion Growth Reflection (Sprint 14.0 — The Human Growth Map,
 * Nhiệm vụ 06). Companion có thể phản chiếu lại hành trình trưởng
 * thành của người dùng — KHÔNG đánh giá, KHÔNG so sánh, KHÔNG chấm
 * điểm, KHÔNG nói người dùng tốt hơn/kém hơn người khác. Rule-based
 * thuần, cùng triết lý với `proactive-thought-engine.ts` và
 * `micro-reaction-engine.ts`. Xem `docs/HUMAN_GROWTH_PHILOSOPHY.md`.
 */

import type { GrowthSignal } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones, type GrowthMilestoneId } from "@/lib/portal/growth-map/growth-milestones";

const MILESTONE_REFLECTION_LINE: Partial<Record<GrowthMilestoneId, string>> = {
  "return-after-silence": "Mình thấy bạn đã quay lại sau một khoảng lặng. Điều đó rất đáng được ghi nhận.",
  "quiet-season": "Có một khoảng lặng trong hành trình của bạn — và mình vẫn ở đây khi bạn quay lại.",
  "first-reflection": "Bạn vừa viết Reflection đầu tiên của mình. Đó là một bước nhỏ, nhưng là một bước thật.",
  "first-living-story-saved": "Bạn vừa giữ lại một câu chuyện đúng lúc — như một dấu chân nhỏ trong hành trình.",
  "garden-begins-to-grow": "Khu vườn của bạn vừa rời khỏi sự tĩnh lặng ban đầu. Những dấu hiệu đầu tiên đã ở đó.",
  "first-contribution": "Có một điều bạn đã chia sẻ hoặc giúp ai đó gần đây — mình nhận thấy điều đó.",
};

/** Dùng khi không có milestone nào mới — vẫn một câu phản chiếu chung, không ép phải có nội dung cụ thể. */
const GENERAL_GROWTH_REFLECTION_LINES = [
  "Có những bước tiến rất nhỏ, nhưng khi nhìn lại, chúng ta mới thấy mình đã đi xa hơn mình nghĩ.",
  "Bạn không cần phải chứng minh mình đã trưởng thành. Chỉ cần nhìn lại những dấu chân này.",
];

/**
 * Trả về một câu Companion có thể nói khi phản chiếu hành trình, hoặc
 * `null` nếu chưa có gì để phản chiếu (im lặng là một kết quả hợp lệ).
 * Ưu tiên milestone gần nhất (gần đây nhất theo thời gian) nếu có.
 */
export function buildCompanionGrowthReflection(signals: GrowthSignal[]): string | null {
  if (signals.length === 0) return null;

  const milestones = detectGrowthMilestones(signals);
  const recentMilestone = [...milestones]
    .filter((m) => MILESTONE_REFLECTION_LINE[m.id])
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0];

  if (recentMilestone) {
    return MILESTONE_REFLECTION_LINE[recentMilestone.id] ?? null;
  }

  // Không có milestone nào để gọi tên cụ thể, nhưng đã có đủ dấu chân để phản chiếu một câu chung.
  if (signals.length >= 3) {
    return GENERAL_GROWTH_REFLECTION_LINES[signals.length % GENERAL_GROWTH_REFLECTION_LINES.length];
  }

  return null;
}
