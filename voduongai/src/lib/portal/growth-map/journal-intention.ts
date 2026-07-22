/**
 * Learning Journal — "Ý định học tiếp theo" (Journey Phase P5). Companion
 * khép trang nhật ký bằng ĐÚNG MỘT lời mời nhẹ nhàng — không checklist,
 * không task manager, không bài tập về nhà. Xoay theo ngày (cùng kỹ
 * thuật `todaysPrompt`/`todaysMirrorQuestion` đã dùng ở Hub/Mirror).
 *
 * Việc 9 — kho lời mời giờ đọc live từ bảng Supabase `journal_intentions`
 * (quản qua /admin/hanh-trinh-cua-toi/journal-intentions), truyền vào
 * `todaysJournalIntention()` làm tham số thay vì tự đọc mảng tĩnh
 * JOURNAL_INTENTIONS (giữ lại @deprecated làm fallback/tham khảo — dùng
 * khi bảng live rỗng, vd. lúc chưa migrate xong hoặc Supabase lỗi).
 */

/** @deprecated Chỉ dùng làm fallback khi bảng `journal_intentions` rỗng — xem todaysJournalIntention(). */
export const JOURNAL_INTENTIONS: string[] = [
  "Bạn muốn khám phá điều gì vào ngày mai?",
  "Có điều gì bạn muốn thử tiếp, dù chỉ một bước nhỏ?",
  "Nếu được chọn một điều để học sâu hơn, đó sẽ là gì?",
  "Có kỹ năng nào bạn muốn quay lại luyện thêm?",
  "Điều gì hôm nay khiến bạn tò mò muốn tìm hiểu thêm?",
];

export function todaysJournalIntention(intentions: string[] = JOURNAL_INTENTIONS): string {
  const pool = intentions.length > 0 ? intentions : JOURNAL_INTENTIONS;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return pool[dayIndex % pool.length];
}
