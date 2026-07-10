/**
 * JOURNEY PLATFORM — logic "Chương hiện tại" dùng CHUNG cho Journey Hub
 * (CurrentChapterCard), My Story (Opening Page) và Journey Map (Vị trí
 * hiện tại), để không cửa nào bao giờ nói lệch nhau về chương người
 * dùng đang ở. Chỉ dùng dữ liệu thật — không %, không level, không suy
 * đoán.
 *
 * Chương 1-3: suy từ growth-view (localStorage — Workspace/Session thật).
 * Chương 4 ("Xây hệ thống"): cần THÊM bằng chứng sở hữu Premium thật
 * (Supabase, server-side) — gọi nơi nào có `premiumCount` (Hub/My
 * Story/Journey Map đều tự truy vấn `getPurchasedIds("course_id")` ở
 * server rồi truyền xuống, cùng pattern Mirror đã dùng ở P4).
 * Chương 5 ("Giúp người khác"): CHƯA có nguồn dữ liệu thật nào (chưa
 * tracking chia sẻ/cộng đồng) — cố tình luôn "chưa bắt đầu", đánh dấu
 * future integration, KHÔNG suy đoán hay hiển thị giả.
 */

import { getGardenSummary, getRecentActivity, type GardenSummary } from "./growth-view";

export const JOURNEY_CHAPTER_NAMES = [
  "Bắt đầu làm quen với AI",
  "Biết sử dụng AI",
  "Tạo ra Output đầu tiên",
  "Xây hệ thống",
  "Giúp người khác",
] as const;

export type JourneyChapter = {
  index: number;
  name: string;
  evidence: string;
} | null;

export function resolveCurrentChapter(
  summary: GardenSummary,
  hasAnyActivity: boolean,
  premiumCount = 0,
): JourneyChapter {
  if (premiumCount > 0 && summary.totalOutputs >= 3) {
    return {
      index: 4,
      name: JOURNEY_CHAPTER_NAMES[3],
      evidence: `Bạn đang đồng hành cùng ${premiumCount} chương trình Premium và đã tạo ${summary.totalOutputs} output thật — dấu hiệu của một hệ thống đang được xây.`,
    };
  }
  if (summary.totalOutputs >= 1) {
    return {
      index: 3,
      name: JOURNEY_CHAPTER_NAMES[2],
      evidence: `${summary.totalOutputs} output thật đã được tạo ra trong Workspace.`,
    };
  }
  if (summary.missionsCompleted >= 1 || summary.journeysTouched >= 1) {
    return {
      index: 2,
      name: JOURNEY_CHAPTER_NAMES[1],
      evidence:
        summary.missionsCompleted >= 1
          ? `${summary.missionsCompleted} phiên làm việc thật đã hoàn thành.`
          : `${summary.journeysTouched} hành trình học đã được bạn chạm tới.`,
    };
  }
  if (hasAnyActivity) {
    return {
      index: 1,
      name: JOURNEY_CHAPTER_NAMES[0],
      evidence: "Hoạt động thật đầu tiên của bạn đã được ghi nhận.",
    };
  }
  return null;
}

/** Đọc thẳng growth-view (localStorage) — chỉ gọi được ở client sau mount.
 * `premiumCount` (dữ liệu server, Supabase) truyền vào từ trang gọi vì
 * client component không tự truy vấn được đơn hàng thật. */
export function getCurrentChapterFromClient(premiumCount = 0): JourneyChapter {
  const summary = getGardenSummary();
  const hasAnyActivity = getRecentActivity(1).length > 0;
  return resolveCurrentChapter(summary, hasAnyActivity, premiumCount);
}
