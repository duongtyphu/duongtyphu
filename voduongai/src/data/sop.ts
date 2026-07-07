export type Sop = {
  title: string;
  description: string;
  /** Portal 4.0 Phase 5 — CKOS Product Completion: khi nào nên dùng SOP này. */
  whenToUse: string;
  /** Các bước thật, không chỉ mô tả một câu. */
  steps: string[];
};

export const sops: Sop[] = [
  {
    title: "SOP sản xuất content hàng ngày",
    description: "Quy trình từ lên ý tưởng, viết, duyệt đến đăng nội dung mỗi ngày.",
    whenToUse: "Dùng khi bạn đăng nội dung đều đặn (từ 3 lần/tuần trở lên) và đang thấy mất nhiều thời gian mỗi lần ngồi vào viết vì chưa có quy trình rõ ràng.",
    steps: [
      "Chọn 1 chủ đề từ kế hoạch content 30 ngày — không nghĩ chủ đề mới mỗi ngày.",
      "Viết bản nháp trong 20-30 phút, không sửa khi đang viết.",
      "Để bản nháp qua ít nhất 1 tiếng, sau đó đọc lại và sửa 1 lần.",
      "Đăng theo khung giờ cố định — nhất quán quan trọng hơn giờ vàng.",
    ],
  },
  {
    title: "SOP chăm sóc khách hàng Affiliate",
    description: "Quy trình phản hồi, tư vấn và chốt đơn cho khách hàng quan tâm.",
    whenToUse: "Dùng khi bắt đầu có khách để lại thông tin quan tâm nhưng bạn đang phản hồi không nhất quán (lúc nhanh lúc quên).",
    steps: [
      "Phản hồi trong vòng 1 giờ kể từ khi khách để lại thông tin — càng lâu tỷ lệ chuyển đổi càng giảm.",
      "Hỏi đúng 1 câu để hiểu nhu cầu thật trước khi giới thiệu sản phẩm.",
      "Gửi thông tin phù hợp với đúng câu hỏi đó, không gửi toàn bộ catalogue.",
      "Nếu khách chưa quyết định, đưa vào chuỗi email follow-up thay vì nhắn lại thủ công.",
    ],
  },
  {
    title: "SOP đăng bài đa kênh",
    description: "Quy trình đăng và tối ưu một nội dung trên nhiều kênh khác nhau.",
    whenToUse: "Dùng khi bạn đã có nội dung tốt ở một kênh và muốn tận dụng sang kênh khác, thay vì viết nội dung mới hoàn toàn cho từng kênh.",
    steps: [
      "Chọn nội dung gốc đã hoạt động tốt nhất (nhiều tương tác nhất) trong tháng.",
      "Viết lại phần mở đầu (hook) riêng cho từng kênh — phần thân có thể giữ nguyên.",
      "Điều chỉnh định dạng đúng chuẩn từng nền tảng (độ dài, ảnh/video, hashtag).",
      "Đăng lệch giờ giữa các kênh, không đăng cùng lúc để tránh trông như spam.",
    ],
  },
  {
    title: "SOP onboarding cộng tác viên mới",
    description: "Quy trình hướng dẫn cộng tác viên mới làm quen hệ thống Affiliate.",
    whenToUse: "Dùng khi bạn bắt đầu có người thứ hai tham gia cùng — trước đó, một SOP onboarding chưa cần thiết vì bạn chưa cần bàn giao cho ai.",
    steps: [
      "Gửi trước 1 tài liệu tổng quan hệ thống, không giải thích miệng toàn bộ trong buổi đầu.",
      "Cho cộng tác viên tự làm thử 1 việc nhỏ, cụ thể trong tuần đầu tiên.",
      "Xem lại kết quả cùng nhau, chỉ ra đúng 1-2 điểm cần điều chỉnh — không sửa hết mọi thứ cùng lúc.",
      "Sau 2 tuần, đánh giá lại có nên giao thêm việc hay cần hỗ trợ thêm.",
    ],
  },
];
