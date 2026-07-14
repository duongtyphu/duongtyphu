/**
 * EPIC 02 — Sprint 01: AI Workspace Foundation.
 * Dữ liệu mới cho các khu vực "Theo nhu cầu công việc", "Workspace đề
 * xuất", "AI Workflows", "Lộ trình học AI" và "Tài nguyên AI" trên trang
 * /portal/aiworkspace. Không thay thế dữ liệu AI_TOOLS/AI_ARTICLES/
 * NEED_CATEGORIES cũ (vẫn dùng nguyên, chỉ đổi vị trí/vai trò hiển thị).
 */

export type WorkNeed = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const WORK_NEEDS: WorkNeed[] = [
  { id: "viet-noi-dung", title: "Viết nội dung", description: "Bài viết, caption, kịch bản, email — nhanh và đúng giọng văn.", icon: "✍️" },
  { id: "thiet-ke-hinh-anh", title: "Thiết kế hình ảnh", description: "Banner, hình minh hoạ, ảnh sản phẩm bằng AI.", icon: "🎨" },
  { id: "tao-video", title: "Tạo video", description: "Video ngắn, voice, phụ đề — dựng nhanh với AI.", icon: "🎬" },
  { id: "marketing", title: "Marketing", description: "Kế hoạch nội dung, quảng cáo, chiến dịch ra mắt.", icon: "📣" },
  { id: "ban-hang", title: "Bán hàng", description: "Kịch bản tư vấn, email chốt đơn, chăm sóc khách.", icon: "🛒" },
  { id: "nghien-cuu", title: "Nghiên cứu", description: "Tổng hợp thông tin, phân tích thị trường, đối thủ.", icon: "🔎" },
  { id: "phan-tich-du-lieu", title: "Phân tích dữ liệu", description: "Đọc số liệu, tìm insight, tóm tắt báo cáo.", icon: "📊" },
  { id: "hoc-tap", title: "Học tập", description: "Tóm tắt kiến thức, luyện tập, giải thích lại cho dễ hiểu.", icon: "📚" },
  { id: "van-phong", title: "Văn phòng", description: "Soạn thảo văn bản, biên bản họp, email công việc.", icon: "🗂️" },
  { id: "coding", title: "Coding", description: "Viết code, sửa lỗi, giải thích đoạn code khó hiểu.", icon: "💻" },
  { id: "automation", title: "Automation", description: "Kết nối công cụ, tự động hoá quy trình lặp lại.", icon: "⚙️" },
  { id: "dau-tu-du-an", title: "Đầu tư / dự án", description: "Lập kế hoạch, đánh giá rủi ro, theo dõi tiến độ.", icon: "📈" },
];

export type RecommendedWorkspace = {
  id: string;
  title: string;
  goal: string;
  expectedOutput: string;
  estimatedTime: string;
  suggestedTools: string[];
};

export const RECOMMENDED_WORKSPACES: RecommendedWorkspace[] = [
  { id: "viet-bai-facebook", title: "Viết bài Facebook", goal: "Viết một bài đăng thu hút tương tác cho trang/nhóm của bạn.", expectedOutput: "1 bài đăng Facebook hoàn chỉnh", estimatedTime: "15 phút", suggestedTools: ["ChatGPT", "Claude"] },
  { id: "tao-landing-page", title: "Tạo Landing Page", goal: "Dựng nội dung + bố cục cho một trang đích bán sản phẩm/dịch vụ.", expectedOutput: "Outline landing page + copy từng phần", estimatedTime: "45 phút", suggestedTools: ["ChatGPT", "Gamma"] },
  { id: "thiet-ke-banner", title: "Thiết kế Banner", goal: "Tạo banner quảng cáo hoặc bìa bài viết bằng AI.", expectedOutput: "1-3 mẫu banner", estimatedTime: "20 phút", suggestedTools: ["Canva", "Gemini"] },
  { id: "lam-video-ngan", title: "Làm Video ngắn", goal: "Dựng một video ngắn (Reels/TikTok) từ ý tưởng có sẵn.", expectedOutput: "Kịch bản + video ngắn", estimatedTime: "60 phút", suggestedTools: ["ChatGPT", "Canva"] },
  { id: "viet-email-ban-hang", title: "Viết Email bán hàng", goal: "Soạn chuỗi email thuyết phục khách hàng tiềm năng.", expectedOutput: "Chuỗi 3 email", estimatedTime: "30 phút", suggestedTools: ["Claude", "ChatGPT"] },
  { id: "phan-tich-khach-hang", title: "Phân tích khách hàng", goal: "Xây chân dung khách hàng mục tiêu chi tiết.", expectedOutput: "1 bản mô tả chân dung khách hàng", estimatedTime: "25 phút", suggestedTools: ["Perplexity", "ChatGPT"] },
  { id: "ke-hoach-30-ngay", title: "Lập kế hoạch nội dung 30 ngày", goal: "Lên lịch nội dung cho một kênh trong 30 ngày tới.", expectedOutput: "Bảng kế hoạch nội dung 30 ngày", estimatedTime: "40 phút", suggestedTools: ["ChatGPT", "NotebookLM"] },
  { id: "tao-prompt-chuyen-nghiep", title: "Tạo Prompt chuyên nghiệp", goal: "Viết một prompt chất lượng cao cho công việc lặp lại của bạn.", expectedOutput: "1 prompt template có thể tái sử dụng", estimatedTime: "15 phút", suggestedTools: ["ChatGPT", "Claude"] },
];

export type AiWorkflow = {
  id: string;
  title: string;
  steps: string[];
  suggestedTools: string[];
};

export const AI_WORKFLOWS: AiWorkflow[] = [
  { id: "lam-video-ngan", title: "Làm video ngắn", steps: ["Nghiên cứu", "Kịch bản", "Thu âm", "Hình ảnh", "Dựng video", "Phụ đề", "Đăng bài"], suggestedTools: ["ChatGPT", "Canva"] },
  { id: "viet-ebook", title: "Viết Ebook", steps: ["Ý tưởng", "Dàn ý", "Nghiên cứu", "Bản nháp", "Thiết kế", "Xuất bản"], suggestedTools: ["ChatGPT", "NotebookLM", "Canva"] },
  { id: "xay-landing-page", title: "Xây Landing Page", steps: ["Khách hàng", "Vấn đề", "Giải pháp", "Nội dung", "Thiết kế", "Đánh giá", "Đăng bài"], suggestedTools: ["ChatGPT", "Gamma"] },
  { id: "affiliate-content", title: "Affiliate Content", steps: ["Ngách", "Khách hàng", "Điểm nhấn", "Nội dung", "CTA", "Theo dõi"], suggestedTools: ["ChatGPT", "Claude"] },
];

export type AiResource = {
  id: string;
  title: string;
  type: "Checklist" | "Template" | "Cheatsheet" | "PDF" | "Mindmap" | "Quy trình mẫu";
  href: string;
};

export const AI_RESOURCES: AiResource[] = [
  { id: "checklist-viet-prompt", title: "Checklist viết Prompt hiệu quả", type: "Checklist", href: "/portal/checklists" },
  { id: "template-landing-page", title: "Template outline Landing Page", type: "Template", href: "/portal/templates" },
  { id: "cheatsheet-cong-cu-ai", title: "Cheatsheet chọn công cụ AI theo việc", type: "Cheatsheet", href: "/portal/resources" },
  { id: "sop-quy-trinh-content", title: "SOP quy trình sản xuất content", type: "Quy trình mẫu", href: "/portal/sop" },
];
