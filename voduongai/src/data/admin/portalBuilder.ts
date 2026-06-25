export type WelcomeConfig = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
};

export const welcomeSeed: WelcomeConfig = {
  title: "Chào mừng đến với Võ Đương AI Portal",
  subtitle: "Học AI, làm Affiliate và xây tài sản số — mọi thứ bạn cần đều ở đây.",
  ctaText: "Xem lộ trình của tôi →",
  ctaHref: "/portal/roadmap",
};

export type Banner = {
  id: string;
  message: string;
  icon: string;
  link?: string;
  type: "Info" | "Promotion" | "Warning" | "Update";
  status: "Active" | "Inactive";
  startDate?: string;
  endDate?: string;
};

export const bannersSeed: Banner[] = [
  {
    id: "banner_1",
    message: "Chào mừng các học viên đến với các khoá học tại V-Academy! Chúc các bạn tiếp thu được tất cả kiến thức.",
    icon: "🔔",
    link: "/portal/vdai-academy",
    type: "Info",
    status: "Active",
  },
];

export type FeaturedContent = {
  id: string;
  title: string;
  type: "Prompt" | "Công cụ" | "Ebook" | "Affiliate" | "Khóa học" | "Tài nguyên mới";
  relatedItem: string;
  priority: number;
  status: "Draft" | "Published" | "Hidden";
};

export const featuredContentSeed: FeaturedContent[] = [
  { id: "feat_1", title: "ChatGPT", type: "Công cụ", relatedItem: "chatgpt", priority: 1, status: "Published" },
  { id: "feat_2", title: "Prompt viết content viral", type: "Prompt", relatedItem: "viral-content", priority: 2, status: "Published" },
];

export type CtaItem = {
  id: string;
  text: string;
  href: string;
  type: "Primary" | "Secondary" | "Outline";
  buttonStyle: "Pill" | "Square";
  location: string;
  status: "Active" | "Inactive";
};

export const ctaSeed: CtaItem[] = [
  { id: "cta_1", text: "Xem lộ trình của tôi", href: "/portal/roadmap", type: "Primary", buttonStyle: "Pill", location: "Dashboard", status: "Active" },
  { id: "cta_2", text: "Xem Affiliate Hub", href: "/portal/affiliate-hub", type: "Secondary", buttonStyle: "Pill", location: "Dashboard", status: "Active" },
];

export type PortalSection = {
  id: string;
  key: string;
  label: string;
  description?: string;
  dataSource?: string;
  ctaText?: string;
  ctaHref?: string;
  order: number;
  visible: boolean;
};

export const portalSectionsSeed: PortalSection[] = [
  {
    id: "sec_0",
    key: "welcome",
    label: "Welcome + thẻ người dùng",
    description: "Lời chào, tên người dùng, hạng thành viên.",
    dataSource: "portal-welcome",
    ctaText: "Xem lộ trình của tôi",
    ctaHref: "/portal/roadmap",
    order: 1,
    visible: true,
  },
  {
    id: "sec_7",
    key: "today-actions",
    label: "Hôm nay bạn muốn làm gì",
    description: "Các thẻ lựa chọn hành động nhanh trên Dashboard.",
    dataSource: "today-action-cards",
    order: 2,
    visible: true,
  },
  {
    id: "sec_8",
    key: "user-goals",
    label: "Mục tiêu của tôi",
    description: "Widget chọn mục tiêu cá nhân hoá gợi ý nội dung.",
    dataSource: "user-goals",
    order: 3,
    visible: true,
  },
  { id: "sec_1", key: "roadmap", label: "Tiến độ lộ trình", dataSource: "roadmap-stages", order: 4, visible: true },
  { id: "sec_2", key: "missions", label: "Nhiệm vụ hôm nay", dataSource: "daily-missions", order: 5, visible: true },
  { id: "sec_3", key: "courses", label: "Tiếp tục học", dataSource: "ai-academy-lessons", order: 6, visible: true },
  { id: "sec_4", key: "tools", label: "Công cụ nổi bật", dataSource: "tools", order: 7, visible: true },
  {
    id: "sec_5",
    key: "affiliate",
    label: "Đề xuất hôm nay — Affiliate",
    dataSource: "affiliate-products",
    order: 8,
    visible: true,
  },
  { id: "sec_6", key: "resources", label: "Tài nguyên mới nhất", dataSource: "resources", order: 9, visible: true },
  {
    id: "sec_9",
    key: "saved-recent",
    label: "Tài nguyên đã lưu gần đây",
    description: "Danh sách rút gọn các mục người dùng vừa lưu.",
    dataSource: "saved-items",
    order: 10,
    visible: true,
  },
];
