/**
 * Mirror — "TỰ HỎI" (Phase P4, MIRROR RECONSTRUCTION).
 * Mirror không bao giờ trả lời — chỉ khép lại bằng ĐÚNG MỘT câu hỏi tĩnh
 * lặng, không phán xét, không gợi ý câu trả lời. Không phải AI tạo câu
 * hỏi theo hồ sơ cá nhân (không personality analysis) — chỉ chọn XOAY
 * VÒNG một câu từ kho câu hỏi đã tuyển, theo ngày (cùng kỹ thuật
 * `todaysPrompt` ở Journey Hub) để mỗi lần ghé Mirror không lặp lại y
 * hệt hôm trước.
 *
 * Nguồn: brief P4 (3 câu gốc) + 4 câu "Reflection" từ Sanctuary cũ
 * (`/portal/hanh-trinh-cua-toi`) theo Product Owner Decision 2 — "Reflection
 * questions → Mirror" — MERGE vào đây, không hiển thị trùng lặp ở Sanctuary.
 */

export const MIRROR_QUESTIONS: string[] = [
  "Bạn muốn tiếp tục nuôi dưỡng điều gì?",
  "Điều gì khiến bạn bất ngờ nhất về chính mình?",
  "Phần nào của bạn xứng đáng được chú ý nhiều hơn?",
  "Tuần này bạn trưởng thành ở điều gì?",
  "Điều gì bạn muốn làm tốt hơn?",
  "Điều gì khiến bạn tự hào?",
  "Điều gì bạn muốn Companion đồng hành tiếp?",
];

export function todaysMirrorQuestion(): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return MIRROR_QUESTIONS[dayIndex % MIRROR_QUESTIONS.length];
}
