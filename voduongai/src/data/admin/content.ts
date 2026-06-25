export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: "Draft" | "Published" | "Hidden";
  publishedAt: string;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
};

export const blogPostsSeed: AdminBlogPost[] = [
  {
    id: "blog_1",
    title: "5 cách dùng AI để tăng năng suất công việc",
    slug: "5-cach-dung-ai-tang-nang-suat",
    excerpt: "Ứng dụng AI vào công việc hàng ngày để tiết kiệm thời gian.",
    content: "",
    category: "AI",
    tags: ["ai", "productivity"],
    author: "Võ Đương",
    status: "Published",
    publishedAt: "2026-05-01",
    featured: true,
  },
];

export type AdminContentItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  status: "Draft" | "Published" | "Hidden";
  publishedAt: string;
  featured: boolean;
};

export const caseStudySeed: AdminContentItem[] = [
  {
    id: "case_1",
    title: "Học viên A tăng thu nhập Affiliate gấp 3 lần sau 60 ngày",
    slug: "case-study-affiliate-x3",
    summary: "Case study thực chiến Affiliate Marketing.",
    body: "",
    status: "Published",
    publishedAt: "2026-04-12",
    featured: true,
  },
];

export const newsSeed: AdminContentItem[] = [
  {
    id: "news_1",
    title: "Cập nhật hệ sinh thái VO DUONG AI tháng 6",
    slug: "cap-nhat-thang-6",
    summary: "Tổng hợp thay đổi mới nhất trong hệ sinh thái.",
    body: "",
    status: "Published",
    publishedAt: "2026-06-01",
    featured: false,
  },
];
