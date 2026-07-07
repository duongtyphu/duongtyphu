// Mock data for the Gem Home screen. Each shape mirrors what a future
// database table / API response would return — swap the constants below
// for real fetches without touching the components that consume them.

// Portal 4.0 Content Reconstruction: đã xoá `todayMissions` (4 mission cố
// định, không đổi theo người dùng thật) và `latestUpdates` (tin tức giả lập)
// — xem PORTAL_CONTENT_RECONSTRUCTION_PLAN.md mục B.1. Dashboard giờ dùng
// `GrowthActivityPanel` (dữ liệu Workspace thật) thay cho todayMissions.

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
  { id: "rec1", kind: "Prompt", title: "Prompt phân tích chân dung khách hàng", description: "Một prompt nhỏ có thể giúp bạn hiểu khách hàng của mình rõ hơn, chỉ trong vài phút.", href: "/portal/prompts" },
  { id: "rec2", kind: "Tool", title: "Công cụ AI viết content", description: "Khi bạn cần viết mà chưa biết bắt đầu từ đâu, công cụ này có thể giúp bước đầu nhẹ hơn.", href: "/portal/tools" },
  { id: "rec3", kind: "Template", title: "Template kế hoạch nội dung 7 ngày", description: "Một khung sẵn có để bạn không phải bắt đầu từ trang giấy trắng.", href: "/portal/templates" },
];

