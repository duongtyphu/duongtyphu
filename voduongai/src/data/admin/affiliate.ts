export type AdminAffiliateProduct = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  audience: string;
  useCase: string;
  workflow: string;
  pros: string[];
  cons: string[];
  pricing: string;
  affiliateUrl: string;
  trackingCode?: string;
  isAffiliate: boolean;
  videoUrl?: string;
  badge: "Recommended" | "Best Choice" | "New" | "None";
  featured: boolean;
  status: "Draft" | "Published" | "Hidden";
};

export const affiliateProductsSeed: AdminAffiliateProduct[] = [
  {
    id: "affp_1",
    name: "Hostinger",
    slug: "hostinger",
    category: "Hosting",
    shortDescription: "Hosting tốc độ cao, giá tốt cho người mới.",
    longDescription: "Hostinger phù hợp cho website cá nhân và landing page Affiliate.",
    audience: "Người mới làm web/blog",
    useCase: "Lưu trữ website, landing page",
    workflow: "Mua hosting → trỏ domain → cài WordPress",
    pros: ["Giá rẻ", "Tốc độ ổn"],
    cons: ["Hỗ trợ tiếng Việt hạn chế"],
    pricing: "Từ 49.000đ/tháng",
    affiliateUrl: "https://hostinger.com?ref=voduongai",
    trackingCode: "hostinger-home",
    isAffiliate: true,
    badge: "Recommended",
    featured: true,
    status: "Published",
  },
];

export type AdminAffiliateLink = {
  id: string;
  name: string;
  originalUrl: string;
  affiliateUrl: string;
  shortLabel: string;
  campaign: string;
  trackingCode?: string;
  isAffiliate: boolean;
  clicks: number;
  conversions: number;
  status: "Active" | "Inactive";
};

export const affiliateLinksSeed: AdminAffiliateLink[] = [
  {
    id: "affl_1",
    name: "Hostinger - Trang chủ",
    originalUrl: "https://hostinger.com",
    affiliateUrl: "https://hostinger.com?ref=voduongai",
    shortLabel: "vdai/hostinger",
    campaign: "blog-q2",
    trackingCode: "hostinger-home",
    isAffiliate: true,
    clicks: 1248,
    conversions: 36,
    status: "Active",
  },
];
