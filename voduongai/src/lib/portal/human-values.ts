/**
 * Human Values Engine — design-only scaffold for a future Human Evolution
 * Index. Deliberately NOT wired to page views/sessions/clicks. Each
 * dimension should eventually be derived from meaningful signals (a
 * reflection answered, a lesson finished, a workflow shared, a member
 * helped) rather than raw usage metrics.
 */
export type HumanValueDimension = "perseverance" | "learning" | "creation" | "contribution" | "collaboration" | "growth";

export type HumanValueSignal = {
  dimension: HumanValueDimension;
  label: string;
  description: string;
};

export const humanValueDimensions: HumanValueSignal[] = [
  { dimension: "perseverance", label: "Kiên trì", description: "Quay lại và tiếp tục, kể cả sau những ngày vắng mặt." },
  { dimension: "learning", label: "Học hỏi", description: "Chủ động tìm hiểu và hoàn thành những gì đã bắt đầu." },
  { dimension: "creation", label: "Kiến tạo", description: "Biến điều đã học thành một kết quả cụ thể." },
  { dimension: "contribution", label: "Đóng góp", description: "Chia sẻ lại điều mình biết cho người khác." },
  { dimension: "collaboration", label: "Hợp tác", description: "Đồng hành và giúp đỡ những thành viên khác." },
  { dimension: "growth", label: "Trưởng thành", description: "Trở thành phiên bản tốt hơn của chính mình theo thời gian." },
];
