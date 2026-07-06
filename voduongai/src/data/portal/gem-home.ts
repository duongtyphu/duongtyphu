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
  { id: "m1", label: "Một bài học nhỏ trong AI Foundation cũng đủ để hôm nay có nghĩa", description: "Học viện AI", href: "/portal/hocvienai" },
  { id: "m2", label: "Giữ lại một Prompt bạn thấy hữu ích vào My Legacy", description: "Thư viện Prompt", href: "/portal/prompts" },
  { id: "m3", label: "Thử áp dụng một Quy trình vào việc bạn đang làm", description: "Tri thức — Thực chiến", href: "/portal/practice" },
  { id: "m4", label: "Viết lại một điều bạn vừa học được, theo cách của riêng bạn", description: "My Legacy", href: "/portal/legacy" },
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
  { id: "rec1", kind: "Prompt", title: "Prompt phân tích chân dung khách hàng", description: "Một prompt nhỏ có thể giúp bạn hiểu khách hàng của mình rõ hơn, chỉ trong vài phút.", href: "/portal/prompts" },
  { id: "rec2", kind: "Tool", title: "Công cụ AI viết content", description: "Khi bạn cần viết mà chưa biết bắt đầu từ đâu, công cụ này có thể giúp bước đầu nhẹ hơn.", href: "/portal/tools" },
  { id: "rec3", kind: "Template", title: "Template kế hoạch nội dung 7 ngày", description: "Một khung sẵn có để bạn không phải bắt đầu từ trang giấy trắng.", href: "/portal/templates" },
];

export type GemUpdate = {
  id: string;
  title: string;
  date: string;
};

export const latestUpdates: GemUpdate[] = [
  { id: "u1", title: "Học viện vừa cập nhật Human Growth Index — theo dõi 5 chỉ số trưởng thành.", date: "Mới" },
  { id: "u2", title: "Thêm Case Study mới trong Tri thức.", date: "Tuần này" },
  { id: "u3", title: "Cộng đồng vừa có 3 Success Story mới.", date: "Tuần này" },
];
