/**
 * Knowledge Memory (Sprint 13.0 — Nhiệm vụ 08). Kiến trúc cho việc
 * Knowledge "nhớ" người dùng thường học theo cách nào — đọc, hình ảnh,
 * ví dụ thực tế, hay thực hành. KHÔNG AI, KHÔNG LLM — chỉ kiến trúc
 * rule-based, đúng yêu cầu của brief.
 *
 * Portal hiện CHƯA thu thập dữ liệu thật về cách người dùng tương tác
 * với từng dạng nội dung (đọc bao lâu, có quay lại ví dụ không, có mở
 * phần thực hành không...). Vì vậy `inferLearningStyle()` trả về `null`
 * khi chưa có đủ tín hiệu — đây là kiến trúc CHỜ dữ liệu thật, không
 * phải dữ liệu giả để trông có vẻ "thông minh". Khi một nguồn dữ liệu
 * thật xuất hiện (ví dụ: thời gian đọc, lượt mở ví dụ/thực hành), chỉ
 * cần truyền `LearningStyleSignals` thật vào hàm này — không cần đổi gì
 * khác trong kiến trúc.
 */

export type LearningStyle = "reading" | "visual" | "example" | "practice";

export const LEARNING_STYLE_LABEL: Record<LearningStyle, string> = {
  reading: "Thích đọc",
  visual: "Thích hình ảnh",
  example: "Thích ví dụ thực tế",
  practice: "Thích thực hành",
};

/**
 * Số lượt tương tác thật với từng dạng nội dung — tất cả optional vì
 * Portal chưa có nguồn dữ liệu này ở phần lớn nơi gọi.
 */
export type LearningStyleSignals = {
  articleOpens?: number;
  diagramOrVideoOpens?: number;
  caseStudyOpens?: number;
  practiceOpens?: number;
};

/**
 * Rule-based đơn giản: dạng nội dung được mở nhiều nhất, NẾU đủ dữ
 * liệu để tin được (tối thiểu 3 lượt mở thật, tránh kết luận từ 1 lần
 * click). Không có dữ liệu thật → trả về `null`, không suy diễn.
 */
export function inferLearningStyle(
  signals: LearningStyleSignals | null | undefined
): LearningStyle | null {
  if (!signals) return null;

  const counts: { style: LearningStyle; count: number }[] = [
    { style: "reading", count: signals.articleOpens ?? 0 },
    { style: "visual", count: signals.diagramOrVideoOpens ?? 0 },
    { style: "example", count: signals.caseStudyOpens ?? 0 },
    { style: "practice", count: signals.practiceOpens ?? 0 },
  ];

  const total = counts.reduce((sum, c) => sum + c.count, 0);
  if (total < 3) return null;

  const top = counts.reduce((best, c) => (c.count > best.count ? c : best));
  return top.count > 0 ? top.style : null;
}
