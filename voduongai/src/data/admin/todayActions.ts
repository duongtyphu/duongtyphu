export type TodayActionCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  featured: boolean;
  status: "Draft" | "Published" | "Hidden";
};

export const todayActionsSeed: TodayActionCard[] = [
  {
    id: "today_1",
    title: "Học AI",
    description: "Bắt đầu với các bài học AI cơ bản và Prompt thực chiến.",
    icon: "🤖",
    gradient: "from-brand-blue/20 to-brand-blue/0",
    ctaText: "Khám phá ngay",
    ctaHref: "/portal/ai-academy",
    order: 1,
    featured: true,
    status: "Published",
  },
  {
    id: "today_2",
    title: "Làm Affiliate",
    description: "Tìm lộ trình, công cụ và sản phẩm phù hợp để bắt đầu tiếp thị liên kết.",
    icon: "🤝",
    gradient: "from-brand-violet/20 to-brand-violet/0",
    ctaText: "Khám phá ngay",
    ctaHref: "/portal/affiliate-hub",
    order: 2,
    featured: true,
    status: "Published",
  },
  {
    id: "today_3",
    title: "Xây thương hiệu cá nhân",
    description: "Lên kế hoạch nội dung, xây hình ảnh cá nhân và phát triển cộng đồng.",
    icon: "👤",
    gradient: "from-brand-orange/20 to-brand-orange/0",
    ctaText: "Khám phá ngay",
    ctaHref: "/portal/personal-brand",
    order: 3,
    featured: false,
    status: "Published",
  },
];
