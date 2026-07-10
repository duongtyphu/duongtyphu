/**
 * JOURNEY PLATFORM — logic "Chương hiện tại" dùng CHUNG cho Journey Hub
 * (CurrentChapterCard) và My Story (Opening Page), để hai cửa không bao
 * giờ nói lệch nhau về chương người dùng đang ở. Phiên bản P1/P3 (subset
 * — chương 4-5 chờ engine Journey Map đầy đủ ở P6, xem
 * JOURNEY_PLATFORM_ARCHITECTURE.md mục 8). Chỉ dùng dữ liệu thật từ
 * growth-view (localStorage) — không %, không level, không suy đoán.
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

export function resolveCurrentChapter(summary: GardenSummary, hasAnyActivity: boolean): JourneyChapter {
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

/** Đọc thẳng growth-view (localStorage) — chỉ gọi được ở client sau mount. */
export function getCurrentChapterFromClient(): JourneyChapter {
  const summary = getGardenSummary();
  const hasAnyActivity = getRecentActivity(1).length > 0;
  return resolveCurrentChapter(summary, hasAnyActivity);
}
