export type StartHereStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  relatedResource?: string;
  relatedTool?: string;
  relatedPrompt?: string;
  relatedLesson?: string;
  ctaText: string;
  ctaHref: string;
  status: "Draft" | "Published" | "Hidden";
};

export const startHereSeed: StartHereStep[] = [
  {
    id: "start_1",
    title: "Làm quen với AI",
    description: "Hiểu các công cụ AI phổ biến và cách viết prompt hiệu quả.",
    icon: "🤖",
    order: 1,
    relatedResource: "/portal/hocvienai",
    relatedTool: "chatgpt",
    ctaText: "Bắt đầu bước này",
    ctaHref: "/portal/hocvienai",
    status: "Published",
  },
  {
    id: "start_2",
    title: "Học cách dùng Prompt",
    description: "Khai thác thư viện Prompt để áp dụng AI vào công việc hàng ngày.",
    icon: "✨",
    order: 2,
    relatedResource: "/portal/prompts",
    relatedTool: "claude",
    ctaText: "Bắt đầu bước này",
    ctaHref: "/portal/prompts",
    status: "Published",
  },
  {
    id: "start_3",
    title: "Xây nội dung và thương hiệu cá nhân",
    description: "Lên kế hoạch nội dung, định vị và xây hình ảnh cá nhân nhất quán.",
    icon: "👤",
    order: 3,
    relatedResource: "/portal/hocvienai",
    relatedTool: "canva",
    ctaText: "Bắt đầu bước này",
    ctaHref: "/portal/hocvienai",
    status: "Published",
  },
  {
    id: "start_4",
    title: "Bắt đầu Affiliate Marketing",
    description: "Chọn ngách, chọn sản phẩm phù hợp và xây hệ thống Affiliate đầu tiên.",
    icon: "🤝",
    order: 4,
    relatedResource: "/portal/duan-cohoi",
    relatedTool: "hostinger",
    ctaText: "Bắt đầu bước này",
    ctaHref: "/portal/duan-cohoi",
    status: "Published",
  },
  {
    id: "start_5",
    title: "Tạo sản phẩm số và tài sản số",
    description: "Đóng gói kiến thức thành sản phẩm số, tích lũy tài sản số dài hạn.",
    icon: "💎",
    order: 5,
    relatedResource: "/portal/premium",
    relatedTool: "",
    ctaText: "Bắt đầu bước này",
    ctaHref: "/portal/premium",
    status: "Published",
  },
];
