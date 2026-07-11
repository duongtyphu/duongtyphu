export type UserGoal = {
  id: string;
  goalKey: string;
  label: string;
  description: string;
  icon: string;
  suggestionText: string;
  suggestedRoute: string;
  relatedResource?: string;
  relatedTool?: string;
  order: number;
  status: "Draft" | "Published" | "Hidden";
};

export const userGoalsSeed: UserGoal[] = [
  {
    id: "goal_1",
    goalKey: "ai",
    label: "Học AI",
    description: "Bắt đầu với Học viện AI và Prompt thực chiến.",
    icon: "🤖",
    suggestionText: "Bắt đầu với Học viện AI và Prompt thực chiến.",
    suggestedRoute: "/portal/hocvienai",
    relatedTool: "chatgpt",
    order: 1,
    status: "Published",
  },
  {
    id: "goal_2",
    goalKey: "affiliate",
    label: "Làm Affiliate",
    description: "Vào Affiliate Hub để chọn ngách và sản phẩm phù hợp.",
    icon: "🤝",
    suggestionText: "Vào Affiliate Hub để chọn ngách và sản phẩm phù hợp.",
    suggestedRoute: "/portal/affiliate-hub",
    order: 2,
    status: "Published",
  },
  {
    id: "goal_3",
    goalKey: "brand",
    label: "Xây thương hiệu cá nhân",
    description: "Lên kế hoạch nội dung và xây hình ảnh cá nhân.",
    icon: "👤",
    suggestionText: "Lên kế hoạch nội dung và xây hình ảnh cá nhân.",
    suggestedRoute: "/portal/hocvienai",
    relatedTool: "canva",
    order: 3,
    status: "Published",
  },
  {
    id: "goal_4",
    goalKey: "product",
    label: "Tạo sản phẩm số",
    description: "Khám phá Sản phẩm số để đóng gói kiến thức của bạn.",
    icon: "📦",
    suggestionText: "Khám phá Sản phẩm số để đóng gói kiến thức của bạn.",
    suggestedRoute: "/portal/premium",
    order: 4,
    status: "Published",
  },
];
