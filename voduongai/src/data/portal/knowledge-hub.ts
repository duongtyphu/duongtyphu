// Mock data for the Tri Thức (Knowledge) Hub. Shapes mirror what a future
// database table / API response would return — swap the constants below
// for real fetches without touching the components that consume them.

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  level: string;
  progressPercent: number;
  href: string;
};

export const learningPaths: LearningPath[] = [
  { id: "lp1", title: "AI Foundation", description: "Nền tảng AI cho người mới — hiểu đúng trước khi dùng đúng.", level: "Cơ bản", progressPercent: 60, href: "/portal/hocvienai" },
  { id: "lp2", title: "AI Thực chiến", description: "Áp dụng AI vào công việc và dự án thật mỗi ngày.", level: "Trung cấp", progressPercent: 30, href: "/portal/practice" },
  { id: "lp3", title: "Prompt Engineering", description: "Viết Prompt hiệu quả cho từng mục tiêu cụ thể.", level: "Trung cấp", progressPercent: 45, href: "/portal/prompts" },
  { id: "lp4", title: "Automation", description: "Tự động hoá quy trình lặp lại bằng AI và công cụ.", level: "Nâng cao", progressPercent: 10, href: "/portal/tools" },
  { id: "lp5", title: "Personal Brand", description: "Xây thương hiệu cá nhân với sự hỗ trợ của AI.", level: "Trung cấp", progressPercent: 0, href: "/portal/personal-brand" },
  { id: "lp6", title: "Affiliate AI", description: "Dùng AI để chọn ngách, tạo nội dung và bán hàng.", level: "Trung cấp", progressPercent: 20, href: "/portal/affiliate-hub" },
  { id: "lp7", title: "AI Business", description: "Xây hệ thống kinh doanh vận hành cùng AI.", level: "Nâng cao", progressPercent: 0, href: "/portal/duan-cohoi" },
];

export type AcademyItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const academyItems: AcademyItem[] = [
  { id: "ac1", title: "Học viện AI", description: "Khoá học AI nền tảng đến chuyên sâu.", href: "/portal/ai-academy" },
  { id: "ac2", title: "Học viện Affiliate", description: "Lộ trình Affiliate Marketing cùng AI.", href: "/portal/affiliate-academy" },
  { id: "ac3", title: "Ứng dụng AI", description: "Ứng dụng AI thực tế vào công việc hàng ngày.", href: "/portal/hocvienai" },
  { id: "ac4", title: "Thương hiệu cá nhân", description: "Xây dựng thương hiệu cá nhân trong kỷ nguyên AI.", href: "/portal/personal-brand" },
  { id: "ac5", title: "Automation", description: "Tự động hoá quy trình bằng AI.", href: "/portal/tools" },
  { id: "ac6", title: "Marketing AI", description: "Marketing hiện đại với sự hỗ trợ của AI.", href: "/portal/affiliate-hub" },
];

export type ResourceLibraryItem = {
  id: string;
  label: string;
  href: string;
};

export const resourceLibraryItems: ResourceLibraryItem[] = [
  { id: "res1", label: "Prompt", href: "/portal/prompts" },
  { id: "res2", label: "Công cụ AI", href: "/portal/tools" },
  { id: "res3", label: "Template", href: "/portal/templates" },
  { id: "res4", label: "Workflow", href: "/portal/hetrithucai" },
  { id: "res5", label: "Checklist", href: "/portal/checklists" },
  { id: "res6", label: "SOP", href: "/portal/sop" },
  { id: "res7", label: "Ebook", href: "/portal/resources" },
  { id: "res8", label: "Case Study", href: "/portal/case-studies" },
];

export type PracticeItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const practiceItems: PracticeItem[] = [
  { id: "pr1", title: "Dự án 7 ngày", description: "Hoàn thành một dự án nhỏ trong 7 ngày để thấy kết quả nhanh.", href: "/portal/practice" },
  { id: "pr2", title: "Dự án 30 ngày", description: "Dự án dài hơi giúp bạn xây năng lực bền vững.", href: "/portal/practice" },
  { id: "pr3", title: "Mini Project", description: "Bài tập nhỏ, áp dụng ngay một kỹ năng cụ thể.", href: "/portal/practice" },
  { id: "pr4", title: "Assignment", description: "Bài tập có hướng dẫn, phù hợp người mới.", href: "/portal/practice" },
  { id: "pr5", title: "Portfolio", description: "Tổng hợp những gì bạn đã làm được thành hồ sơ năng lực.", href: "/portal/legacy" },
  { id: "pr6", title: "Thử thách thực chiến", description: "Thử thách ngắn để kiểm tra năng lực hiện tại.", href: "/portal/practice" },
];

export type AiKnowledgeTip = {
  message: string;
  href: string;
  cta: string;
};

export const aiKnowledgeTip: AiKnowledgeTip = {
  message:
    "Dựa trên mục tiêu hiện tại, bạn nên học AI Foundation trước, sau đó thực hành Prompt đầu tiên và lưu kết quả vào My Legacy.",
  href: "/portal/ai-assistant",
  cta: "Hỏi AI Coach",
};

export type RecommendedKnowledgeItem = {
  id: string;
  kind: "Bài học" | "Prompt" | "Tool" | "Template";
  title: string;
  description: string;
  href: string;
  /**
   * Sprint 13.0 — Knowledge Evolution. Chủ đề nội dung này gắn với, để
   * `emphasizeByTags()` ưu tiên hiển thị khi khớp ý nghĩa Reflection
   * gần nhất. Không dùng để lọc bỏ — chỉ dùng để sắp xếp lại.
   */
  emphasisTags?: string[];
};

export const recommendedKnowledgeItems: RecommendedKnowledgeItem[] = [
  { id: "rk1", kind: "Bài học", title: "AI Foundation — Bài 1", description: "Hiểu đúng AI là gì trước khi dùng đúng.", href: "/portal/hocvienai", emphasisTags: ["first-principles", "foundation", "explore"] },
  { id: "rk2", kind: "Prompt", title: "Prompt phân tích khách hàng", description: "Dựng chân dung khách hàng mục tiêu trong 5 phút.", href: "/portal/prompts", emphasisTags: ["practice", "deep-work"] },
  { id: "rk3", kind: "Tool", title: "Công cụ AI viết content", description: "Viết nội dung nhanh hơn với một công cụ được tuyển chọn.", href: "/portal/tools", emphasisTags: ["practice", "project", "consistency"] },
  { id: "rk4", kind: "Template", title: "Template kế hoạch nội dung 7 ngày", description: "Mẫu lên kế hoạch dùng lại được ngay.", href: "/portal/templates", emphasisTags: ["consistency", "project"] },
];

export type KnowledgeStat = {
  label: string;
  value: number;
};

export const knowledgeStats: KnowledgeStat[] = [
  { label: "Bài học đã hoàn thành", value: 8 },
  { label: "Prompt đã lưu", value: 14 },
  { label: "Workflow đã thực hành", value: 3 },
  { label: "Tài nguyên đã tải", value: 6 },
  { label: "Ghi chú đã tạo", value: 5 },
];
