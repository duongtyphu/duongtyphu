export type MomentumSignal = {
  id: string;
  message: string;
};

/**
 * Mock momentum data — to be replaced by real activity counters
 * (login streak, saved notes, completed missions) once available.
 */
export const humanMomentumSignals: MomentumSignal[] = [
  { id: "streak", message: "Bạn đã quay lại 3 ngày liên tiếp." },
  { id: "legacy-notes", message: "Bạn đã lưu 2 ghi chú vào My Legacy." },
  { id: "first-step", message: "Bạn đã hoàn thành bước đầu tiên trong hành trình kiến tạo." },
];

export const livingPortalCopy = {
  momentumClosing: "Viên ngọc của bạn đang sáng hơn qua từng hành động nhỏ.",
  footerNote: "Bước nhỏ hôm nay là nền móng cho phiên bản tốt hơn của bạn ngày mai.",
};
