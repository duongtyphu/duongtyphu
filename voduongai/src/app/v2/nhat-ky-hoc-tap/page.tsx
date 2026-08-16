import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getLearningLogData } from "@/lib/portal/live-learning-log";

import { NhatKyHocTapClient } from "./NhatKyHocTapClient";

export const metadata = { title: "Nhật ký học tập | VO DUONG AI" };

/**
 * `/v2/nhat-ky-hoc-tap` — Bước F. Toàn bộ số liệu/lịch/danh sách đọc thật
 * từ `getLearningLogData()` (bài học Học viện AI đã hoàn thành + chiêm
 * nghiệm + ghi chú/khoảnh khắc + tài liệu) — xem docblock đầy đủ trong
 * `src/lib/portal/live-learning-log.ts`.
 */
export default async function NhatKyHocTapPage() {
  const [premium, log] = await Promise.all([getPremiumStatus(), getLearningLogData()]);
  return <NhatKyHocTapClient premium={premium} log={log} />;
}
