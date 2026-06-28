/**
 * Mirror Narrative (Sprint 15.0 — The Mirror of Growth, Nhiệm vụ 03).
 * Chuyển các mốc trưởng thành thành câu chuyện kể trực tiếp với người
 * dùng ("Đây là ngày bạn...") — KHÔNG phải log kỹ thuật ("Reflection
 * Created", "Garden Stage Updated"). Khác `growth-timeline.ts` (kể theo
 * mọi dấu chân, nhóm theo tháng): Mirror Narrative chỉ chọn những mốc có
 * ý nghĩa kể chuyện nhất. Xem `docs/THE_MIRROR_OF_GROWTH.md`.
 */

import type { GrowthSignal } from "@/lib/portal/growth-map/growth-signals";
import { detectGrowthMilestones, type GrowthMilestoneId } from "@/lib/portal/growth-map/growth-milestones";

const MILESTONE_MIRROR_LINE: Partial<Record<GrowthMilestoneId, string>> = {
  "first-reflection": "Đây là ngày bạn viết Reflection đầu tiên.",
  "first-memory": "Đây là ngày bạn giữ lại ký ức đầu tiên của mình.",
  "first-living-story-saved": "Đây là ngày một câu chuyện đúng lúc trở thành dấu chân đầu tiên trong My Story.",
  "first-knowledge-practice": "Đây là ngày bạn dành thời gian thực hành, không chỉ đọc qua.",
  "first-contribution": "Đây là ngày bạn chia sẻ điều mình học cho người khác.",
  "garden-begins-to-grow": "Khu vườn của bạn bắt đầu nảy mầm.",
  "first-comeback": "Đây là ngày bạn quay lại sau một khoảng lặng.",
};

export type MirrorNarrativeLine = {
  id: GrowthMilestoneId;
  line: string;
  occurredAt: string;
};

/**
 * Trả về các câu kể chuyện neo vào mốc trưởng thành, sắp theo thời gian.
 * Trả về mảng rỗng nếu chưa có mốc nào — im lặng là một kết quả hợp lệ.
 */
export function buildMirrorNarrative(signals: GrowthSignal[]): MirrorNarrativeLine[] {
  return detectGrowthMilestones(signals)
    .filter((m) => MILESTONE_MIRROR_LINE[m.id])
    .map((m) => ({ id: m.id, line: MILESTONE_MIRROR_LINE[m.id]!, occurredAt: m.occurredAt }))
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
}
