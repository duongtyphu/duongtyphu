/**
 * EPIC 02 — Sprint 01: AI Workspace Foundation.
 * Dữ liệu mới cho các khu vực "Theo nhu cầu công việc", "Workspace đề
 * xuất", "AI Workflows", "Lộ trình học AI" và "Tài nguyên AI" trên trang
 * /portal/aiworkspace. Không thay thế dữ liệu AI_TOOLS/AI_ARTICLES/
 * NEED_CATEGORIES cũ (vẫn dùng nguyên, chỉ đổi vị trí/vai trò hiển thị).
 */

export type LearningPath = {
  id: string;
  level: number;
  title: string;
  goal: string;
  missionCount: number;
  href: string;
};

export const LEARNING_PATHS: LearningPath[] = [
  { id: "nguoi-moi-bat-dau", level: 1, title: "Người mới bắt đầu", goal: "Làm quen AI Chat, viết prompt đầu tiên.", missionCount: 6, href: "/portal/hocvienai" },
  { id: "ung-dung-cong-viec", level: 2, title: "Ứng dụng AI vào công việc", goal: "Dùng AI cho các công việc hàng ngày.", missionCount: 8, href: "/portal/hocvienai" },
  { id: "he-thong-noi-dung", level: 3, title: "Xây hệ thống nội dung bằng AI", goal: "Lên quy trình sản xuất nội dung đều đặn.", missionCount: 10, href: "/portal/roadmap" },
  { id: "tu-dong-hoa", level: 4, title: "Tự động hóa với AI", goal: "Kết nối công cụ, giảm việc lặp lại thủ công.", missionCount: 6, href: "/portal/aiworkspace/tu-dong-hoa" },
  { id: "ai-cho-doanh-nghiep", level: 5, title: "AI cho kinh doanh / đội nhóm", goal: "Áp dụng AI ở quy mô đội nhóm/doanh nghiệp.", missionCount: 8, href: "/portal/premium" },
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
