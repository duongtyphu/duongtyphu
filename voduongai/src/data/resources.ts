export type FreeResource = {
  id: string;
  title: string;
  type: "Ebook" | "Checklist" | "Template" | "Prompt Pack" | "Roadmap" | "Swipe File";
  description: string;
};

export const freeResources: FreeResource[] = [
  { id: "r1", title: "AI Toolkit cho người mới", type: "Ebook", description: "Tổng hợp công cụ AI cần thiết để bắt đầu học và làm việc với AI." },
  { id: "r2", title: "100 Prompt ChatGPT thực chiến", type: "Prompt Pack", description: "Bộ prompt dùng ngay cho công việc, marketing và Affiliate." },
  { id: "r3", title: "Affiliate Checklist khởi đầu", type: "Checklist", description: "Danh sách việc cần làm trước khi bắt đầu Affiliate Marketing." },
  { id: "r4", title: "Website Toolkit", type: "Template", description: "Bộ công cụ và mẫu để dựng website cá nhân nhanh chóng." },
  { id: "r5", title: "Content Calendar 30 ngày", type: "Template", description: "Lịch nội dung mẫu cho 30 ngày đầu xây kênh." },
  { id: "r6", title: "AI Ebook: Ứng dụng AI vào công việc", type: "Ebook", description: "Hướng dẫn ứng dụng AI thực chiến vào công việc hàng ngày." },
  { id: "r7", title: "Roadmap học AI 90 ngày", type: "Roadmap", description: "Lộ trình từng bước học và ứng dụng AI trong 90 ngày." },
  { id: "r8", title: "Swipe File tiêu đề bán hàng", type: "Swipe File" , description: "Tuyển tập tiêu đề bán hàng hiệu quả để tham khảo và biến tấu." },
  { id: "r9", title: "Checklist chọn ngách Affiliate", type: "Checklist", description: "Bộ tiêu chí giúp chọn đúng ngách Affiliate phù hợp với bạn." },
  { id: "r10", title: "Template landing page đơn giản", type: "Template", description: "Mẫu cấu trúc landing page tối giản, dễ tuỳ biến." },
];
