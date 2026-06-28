/**
 * Daily Thought Source & Context Mapping (Sprint 18.5 — The Daily Thought).
 * Xem `docs/DAILY_THOUGHT_ENGINE.md`.
 *
 * QUAN TRỌNG: đây KHÔNG phải một Delivery Engine mới. Cooldown, storage,
 * bubble, dismiss, và toàn bộ luồng quyết định "có nói hay không / nói lúc
 * nào / im lặng" đã có sẵn ở `proactive-thought-engine.ts` (Sprint 13.1) —
 * Daily Thought chỉ đăng ký thêm MỘT Thought Source mới vào đó, không tạo
 * thêm một hệ thống nói song song. Một Delivery Engine. Nhiều Thought
 * Sources.
 *
 * File này chỉ định nghĩa: nguồn suy nghĩ (`ThoughtSource`), ngữ cảnh hiện
 * tại (`ThoughtContext`), việc ánh xạ ngữ cảnh sang nguồn phù hợp (Thought
 * Context Mapping — NV05), và cấu hình tần suất im lặng (Thought Frequency
 * — NV03). Không gọi Supabase ở đây — `ThoughtContext` được dựng ở
 * page/layout từ dữ liệu đã có sẵn (lifeMoment, gardenStage,...).
 */

import type { ExperienceSource } from "@/lib/portal/companion/living-experience";

/** 9 nguồn suy nghĩ ban đầu — đúng danh sách đã định nghĩa, không thêm tuỳ ý. */
export type ThoughtSource =
  | "garden"
  | "reflection"
  | "story"
  | "memory"
  | "journey"
  | "knowledge"
  | "life-moments"
  | "origin-memory"
  | "companion-chapter";

/**
 * Sprint 18.7 — Living Experiences: mỗi `ThoughtSource` truy ngược về
 * đúng một `ExperienceSource` (`living-experience.ts`), nguồn để chọn
 * `LivingExperience` mà một Daily Thought bắt nguồn từ. "companion-chapter"
 * không có trong 8 ExperienceSource chính thức — một chương mới của
 * Companion tự nó cũng là một dạng "journey" (hành trình của chính
 * Companion, không phải của người dùng), nên gộp vào đó thay vì thêm một
 * ExperienceSource thứ 9 chỉ để phục vụ một nhóm rất nhỏ.
 */
export function toExperienceSource(source: ThoughtSource): ExperienceSource {
  if (source === "origin-memory") return "origin";
  if (source === "companion-chapter") return "journey";
  return source;
}

/**
 * Ngữ cảnh hiện tại của một Portal session — Daily Thought đọc từ đây để
 * quyết định nguồn nào phù hợp (NV05 — "Không random hoàn toàn"). Mọi
 * field đều optional: thiếu field nào nghĩa là tín hiệu đó chưa xảy ra.
 */
export type ThoughtContext = {
  gardenStage?: string;
  reflectionMeaning?: string;
  hasMemoryCapsule?: boolean;
  journeyState?: string;
  isBirthday?: boolean;
  isReturnAfterSilence?: boolean;
  isAnnualMirror?: boolean;
  isOriginMoment?: boolean;
  hasNewCompanionChapter?: boolean;
};

/**
 * Tỉ lệ Companion thật sự có một Daily Thought (phần còn lại là Soulful
 * Silence — NV08). Không hardcode 70/30 ở logic chọn — định nghĩa bằng
 * config tại đây (NV03), để thay đổi tỉ lệ không cần sửa engine.
 */
export type ThoughtFrequency = {
  /** 0 → luôn im lặng; 1 → luôn có Thought. */
  showProbability: number;
};

export const DAILY_THOUGHT_FREQUENCY: ThoughtFrequency = {
  showProbability: 0.3,
};

/**
 * Thought Context Mapping (NV05) — ưu tiên các tín hiệu hiếm/ý nghĩa hơn
 * (sinh nhật, quay lại sau im lặng, mirror năm) trước các tín hiệu thường
 * gặp hơn (garden, reflection). Trả về `null` nếu không có tín hiệu nào —
 * khi đó Daily Thought không có gì để nói, dẫn tới Soulful Silence.
 */
export function mapContextToSource(context: ThoughtContext): ThoughtSource | null {
  if (context.isBirthday) return "life-moments";
  if (context.isReturnAfterSilence) return "life-moments";
  if (context.isAnnualMirror) return "life-moments";
  if (context.isOriginMoment) return "origin-memory";
  if (context.hasNewCompanionChapter) return "companion-chapter";
  if (context.journeyState) return "journey";
  if (context.reflectionMeaning) return "reflection";
  if (context.gardenStage) return "garden";
  if (context.hasMemoryCapsule) return "memory";
  return null;
}

/**
 * Pseudo-random có chủ đích, giống cách `proactive-thought-engine.ts` đang
 * dùng `now` thay vì `Math.random()` ở mọi nơi gọi — giữ engine dễ test.
 */
export function shouldShowDailyThoughtToday(
  context: ThoughtContext,
  now: number,
  frequency: ThoughtFrequency = DAILY_THOUGHT_FREQUENCY
): boolean {
  if (!mapContextToSource(context)) return false;
  const slot = now % 100;
  return slot < frequency.showProbability * 100;
}
