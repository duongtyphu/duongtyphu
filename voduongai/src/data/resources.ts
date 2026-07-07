export type FreeResource = {
  id: string;
  title: string;
  type: "Ebook" | "Danh sách kiểm tra" | "Mẫu" | "Bộ Prompt" | "Lộ trình" | "Mẫu tham khảo";
  description: string;
  /** Portal 4.0 Phase 5 — CKOS Product Completion: khi nào nên dùng tài nguyên này. */
  whenToUse: string;
};

export const freeResources: FreeResource[] = [
  {
    id: "r1",
    title: "AI Toolkit cho người mới",
    type: "Ebook",
    description: "Tổng hợp công cụ AI cần thiết để bắt đầu học và làm việc với AI.",
    whenToUse: "Đọc trước khi thử bất kỳ công cụ AI nào — giúp bạn không mất thời gian thử sai công cụ không phù hợp với việc bạn đang làm.",
  },
  {
    id: "r2",
    title: "100 Prompt ChatGPT thực chiến",
    type: "Bộ Prompt",
    description: "Bộ prompt dùng ngay cho công việc, marketing và Affiliate.",
    whenToUse: "Dùng khi bạn đã biết việc cần làm nhưng chưa biết diễn đạt yêu cầu với AI thế nào cho hiệu quả.",
  },
  {
    id: "r3",
    title: "Affiliate Checklist khởi đầu",
    type: "Danh sách kiểm tra",
    description: "Danh sách việc cần làm trước khi bắt đầu Affiliate Marketing.",
    whenToUse: "Dùng trước khi tham gia bất kỳ chương trình Affiliate nào — không dùng sau khi đã bắt đầu, vì mục đích là chuẩn bị trước.",
  },
  {
    id: "r4",
    title: "Website Toolkit",
    type: "Mẫu",
    description: "Bộ công cụ và mẫu để dựng website cá nhân nhanh chóng.",
    whenToUse: "Dùng khi bạn đã có nội dung/sản phẩm cụ thể và cần một nơi để giới thiệu — không cần nếu bạn chỉ đang thử nghiệm ý tưởng.",
  },
  {
    id: "r5",
    title: "Content Calendar 30 ngày",
    type: "Mẫu",
    description: "Lịch nội dung mẫu cho 30 ngày đầu xây kênh.",
    whenToUse: "Dùng khi bạn đã chọn được kênh và ngách, cần một khung sườn để không phải nghĩ chủ đề mỗi ngày từ đầu.",
  },
  {
    id: "r6",
    title: "AI Ebook: Ứng dụng AI vào công việc",
    type: "Ebook",
    description: "Hướng dẫn ứng dụng AI thực chiến vào công việc hàng ngày.",
    whenToUse: "Đọc khi bạn đã dùng thử AI vài lần nhưng thấy kết quả chưa như mong đợi — thường là do cách đặt câu hỏi, không phải do công cụ.",
  },
  {
    id: "r7",
    title: "Roadmap học AI 90 ngày",
    type: "Lộ trình",
    description: "Lộ trình từng bước học và ứng dụng AI trong 90 ngày.",
    whenToUse: "Dùng khi bạn muốn học có hệ thống thay vì học lắt nhắt từng chủ đề rời rạc — không phù hợp nếu bạn chỉ cần giải quyết một việc cụ thể ngay.",
  },
  {
    id: "r8",
    title: "Swipe File tiêu đề bán hàng",
    type: "Mẫu tham khảo",
    description: "Tuyển tập tiêu đề bán hàng hiệu quả để tham khảo và biến tấu.",
    whenToUse: "Dùng khi đã có nội dung nhưng đang bí tiêu đề — không dùng để copy nguyên văn, chỉ để tham khảo cấu trúc.",
  },
  {
    id: "r9",
    title: "Checklist chọn ngách Affiliate",
    type: "Danh sách kiểm tra",
    description: "Bộ tiêu chí giúp chọn đúng ngách Affiliate phù hợp với bạn.",
    whenToUse: "Dùng khi đang phân vân giữa nhiều ngách — giúp bạn quyết định dựa trên tiêu chí, không chỉ theo cảm hứng nhất thời.",
  },
  {
    id: "r10",
    title: "Template landing page đơn giản",
    type: "Mẫu",
    description: "Mẫu cấu trúc landing page tối giản, dễ tuỳ biến.",
    whenToUse: "Dùng khi cần ra mắt trang bán hàng nhanh với nguồn lực hạn chế — không thay thế cho việc có outline nội dung rõ ràng trước.",
  },
];
