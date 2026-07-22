/**
 * Mirror — "TỰ HỎI" (Phase P4, MIRROR RECONSTRUCTION).
 * Mirror không bao giờ trả lời — chỉ khép lại bằng ĐÚNG MỘT câu hỏi tĩnh
 * lặng, không phán xét, không gợi ý câu trả lời. Không phải AI tạo câu
 * hỏi theo hồ sơ cá nhân (không personality analysis) — chỉ chọn XOAY
 * VÒNG một câu từ kho câu hỏi đã tuyển, theo ngày (cùng kỹ thuật
 * `todaysPrompt` ở Journey Hub) để mỗi lần ghé Mirror không lặp lại y
 * hệt hôm trước.
 *
 * Việc 9 — kho câu hỏi giờ đọc live từ bảng Supabase `mirror_questions`
 * (quản qua /admin/hanh-trinh-cua-toi/mirror-questions), truyền vào
 * `todaysMirrorQuestion()` làm tham số thay vì tự đọc mảng tĩnh
 * MIRROR_QUESTIONS (giữ lại @deprecated làm fallback/tham khảo — dùng khi
 * bảng live rỗng, vd. lúc chưa migrate xong hoặc Supabase lỗi).
 */

/** @deprecated Chỉ dùng làm fallback khi bảng `mirror_questions` rỗng — xem todaysMirrorQuestion(). */
export const MIRROR_QUESTIONS: string[] = [
  "Bạn muốn tiếp tục nuôi dưỡng điều gì?",
  "Điều gì khiến bạn bất ngờ nhất về chính mình?",
  "Phần nào của bạn xứng đáng được chú ý nhiều hơn?",
  "Tuần này bạn trưởng thành ở điều gì?",
  "Điều gì bạn muốn làm tốt hơn?",
  "Điều gì khiến bạn tự hào?",
  "Điều gì bạn muốn Companion đồng hành tiếp?",
];

export function todaysMirrorQuestion(questions: string[] = MIRROR_QUESTIONS): string {
  const pool = questions.length > 0 ? questions : MIRROR_QUESTIONS;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return pool[dayIndex % pool.length];
}
