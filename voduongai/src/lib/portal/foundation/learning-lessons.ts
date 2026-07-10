/**
 * Learning Journal — "Những bài học đáng nhớ" (Journey Phase P5).
 * KHÔNG phải bài học CKOS (kiến thức) — đây là bài học CÁ NHÂN suy ra từ
 * CÁCH bạn làm việc thật trong Workspace (WorkspaceSessionRecord thật,
 * localStorage), khác hẳn "Những bài học đã thay đổi tôi" ở My Story
 * (suy ra từ NỘI DUNG bạn viết trong Reflection) — hai nguồn bằng chứng
 * khác nhau, không lặp lại cùng một câu ở hai cửa.
 *
 * Mỗi bài học chỉ xuất hiện khi vượt ngưỡng bằng chứng thật rõ ràng
 * (>=2 phiên làm việc thật trở lên cho mọi so sánh tỉ lệ) — không suy
 * diễn từ 1 lần duy nhất, không bịa "trí tuệ".
 */

import type { WorkspaceSessionRecord } from "./workspace-session-store";

const DAY_MS = 24 * 60 * 60 * 1000;

export function buildBehaviorLessons(sessions: WorkspaceSessionRecord[]): string[] {
  if (sessions.length < 2) return [];

  const lessons: string[] = [];
  const sorted = [...sessions].sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  const withOutputs = sorted.filter((s) => s.outputs.length > 0).length;
  if (withOutputs / sorted.length >= 0.6) {
    lessons.push("Bạn thường tạo ra kết quả thật trong hầu hết những lần làm việc — không chỉ đọc qua.");
  }

  const completed = sorted.filter((s) => s.status === "completed").length;
  if (completed / sorted.length >= 0.6) {
    lessons.push("Bạn thường hoàn thành trọn vẹn những gì mình đã bắt đầu.");
  }

  let chainedReturns = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prevFinished = sorted[i - 1].finishedAt;
    if (!prevFinished) continue;
    const gap = new Date(sorted[i].startedAt).getTime() - new Date(prevFinished).getTime();
    if (gap >= 0 && gap <= DAY_MS) chainedReturns++;
  }
  if (chainedReturns >= 2) {
    lessons.push("Bạn hay quay lại học tiếp ngay sau khi vừa hoàn thành một phiên trước đó.");
  }

  const distinctModules = new Set(sorted.map((s) => s.context.module).filter(Boolean));
  if (distinctModules.size >= 3) {
    lessons.push("Bạn thường thử sức ở nhiều lĩnh vực khác nhau thay vì chỉ đi sâu một hướng.");
  }

  return lessons;
}
