export type AffiliateHubSection = {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  relatedResource?: string;
  relatedPrompt?: string;
  relatedTool?: string;
  relatedAffiliateProduct?: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  status: "Draft" | "Published" | "Hidden";
};

export const affiliateHubSeed: AffiliateHubSection[] = [
  {
    id: "ahub_1",
    key: "start",
    title: "Bắt đầu Affiliate",
    description: "Affiliate Marketing là gì, lộ trình cho người mới, sai lầm cần tránh.",
    icon: "🚀",
    relatedResource: "/portal/start-here",
    ctaText: "Xem lộ trình",
    ctaHref: "/portal/start-here",
    order: 1,
    status: "Published",
  },
  {
    id: "ahub_2",
    key: "niche",
    title: "Chọn ngách",
    description: "Cách chọn ngách bằng AI, checklist chọn ngách, prompt nghiên cứu thị trường.",
    icon: "🎯",
    relatedPrompt: "prompt_2",
    ctaText: "Mở Thư viện Prompt",
    ctaHref: "/portal/prompts",
    order: 2,
    status: "Published",
  },
  {
    id: "ahub_3",
    key: "product",
    title: "Chọn sản phẩm",
    description: "Tiêu chí chọn sản phẩm, sản phẩm đề xuất, công cụ nên dùng.",
    icon: "🛒",
    ctaText: "Xem công cụ",
    ctaHref: "/portal/tools",
    order: 3,
    status: "Published",
  },
  {
    id: "ahub_4",
    key: "content",
    title: "Xây nội dung",
    description: "Kế hoạch nội dung 30 ngày, prompt viết bài, template review sản phẩm.",
    icon: "📝",
    relatedResource: "/portal/templates",
    ctaText: "Xem Template",
    ctaHref: "/portal/templates",
    order: 4,
    status: "Published",
  },
  {
    id: "ahub_5",
    key: "tools",
    title: "Công cụ Affiliate",
    description: "Hosting, AI Tools, Email marketing, Landing page, Automation.",
    icon: "🧰",
    ctaText: "Xem Thư viện công cụ",
    ctaHref: "/portal/tools",
    order: 5,
    status: "Published",
  },
  {
    id: "ahub_6",
    key: "case-study",
    title: "Case Study",
    description: "Cách xây một phễu Affiliate, workflow thực tế.",
    icon: "📊",
    ctaText: "Xem Case Study",
    ctaHref: "/portal/case-studies",
    order: 6,
    status: "Published",
  },
  {
    id: "ahub_7",
    key: "top-products",
    title: "Top sản phẩm tháng này",
    description: "Sản phẩm Affiliate nổi bật tháng này — xem hướng dẫn và dùng thử.",
    icon: "🏆",
    ctaText: "Xem hướng dẫn",
    ctaHref: "/portal/affiliate-hub",
    order: 7,
    status: "Published",
  },
];

export type AffiliateHubTopProduct = {
  id: string;
  productId: string;
  productName: string;
  badge: "Recommended" | "Best Choice" | "New";
  order: number;
  guideHref: string;
  trialHref: string;
  status: "Active" | "Inactive";
};

export const affiliateHubTopProductsSeed: AffiliateHubTopProduct[] = [
  {
    id: "ahubtop_1",
    productId: "affp_1",
    productName: "Hostinger",
    badge: "Recommended",
    order: 1,
    guideHref: "/portal/tools/hostinger",
    trialHref: "https://hostinger.com",
    status: "Active",
  },
];
