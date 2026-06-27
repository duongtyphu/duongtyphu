// Mock data for the Gem Home screen. Each shape mirrors what a future
// database table / API response would return — swap the constants below
// for real fetches without touching the components that consume them.

export type MissionStatus = "todo" | "in-progress" | "done";

export type TodayMission = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export const todayMissions: TodayMission[] = [
  { id: "m1", label: "Hoàn thành 1 bài học AI Foundation", description: "Học viện AI", href: "/portal/academy" },
  { id: "m2", label: "Lưu 1 Prompt vào My Legacy", description: "Thư viện Prompt", href: "/portal/prompts" },
  { id: "m3", label: "Thực hành 1 Workflow", description: "Tri thức — Thực chiến", href: "/portal/practice" },
  { id: "m4", label: "Viết 1 ghi chú học tập", description: "My Legacy", href: "/portal/legacy" },
];

export type AiCoachTip = {
  message: string;
  href: string;
  cta: string;
};

export const aiCoachTip: AiCoachTip = {
  message:
    "Dựa trên mục tiêu hiện tại, hôm nay bạn nên tập trung vào AI Foundation và thực hành Prompt đầu tiên.",
  href: "/portal/ai-assistant",
  cta: "Hỏi AI Coach",
};

export type RecommendedItem = {
  id: string;
  kind: "Prompt" | "Tool" | "Template";
  title: string;
  description: string;
  href: string;
};

export const recommendedItems: RecommendedItem[] = [
  { id: "rec1", kind: "Prompt", title: "Prompt phân tích chân dung khách hàng", description: "Dùng AI dựng chân dung khách hàng mục tiêu trong 5 phút.", href: "/portal/prompts" },
  { id: "rec2", kind: "Tool", title: "Công cụ AI viết content", description: "Một công cụ AI được tuyển chọn để viết nội dung nhanh hơn.", href: "/portal/tools" },
  { id: "rec3", kind: "Template", title: "Template kế hoạch nội dung 7 ngày", description: "Mẫu lên kế hoạch nội dung dùng lại được ngay.", href: "/portal/templates" },
];

export type GemUpdate = {
  id: string;
  title: string;
  date: string;
};

export const latestUpdates: GemUpdate[] = [
  { id: "u1", title: "Portal vừa cập nhật Human Growth Index — theo dõi 5 chỉ số trưởng thành.", date: "Mới" },
  { id: "u2", title: "Thêm Case Study mới trong Tri thức.", date: "Tuần này" },
  { id: "u3", title: "Cộng đồng vừa có 3 Success Story mới.", date: "Tuần này" },
];
