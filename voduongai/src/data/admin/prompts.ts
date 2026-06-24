export type AdminPrompt = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  exampleOutput: string;
  tags: string[];
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  tier: "Free" | "Premium";
  featured: boolean;
  copyCount: number;
  status: "Draft" | "Published" | "Hidden";
};

export const promptsSeed: AdminPrompt[] = [
  {
    id: "prompt_1",
    title: "Viết content viral cho Facebook",
    slug: "viral-content",
    category: "Content",
    description: "Tạo bài viết Facebook thu hút tương tác.",
    content: "Viết 1 bài Facebook về [chủ đề] theo phong cách kể chuyện, có hook mở đầu gây tò mò...",
    exampleOutput: "Hôm qua tôi vừa...",
    tags: ["content", "facebook"],
    level: "Cơ bản",
    tier: "Free",
    featured: true,
    copyCount: 482,
    status: "Published",
  },
  {
    id: "prompt_2",
    title: "Phân tích đối thủ Affiliate",
    slug: "phan-tich-doi-thu",
    category: "Affiliate",
    description: "Phân tích chiến lược của đối thủ Affiliate.",
    content: "Phân tích website [URL] và liệt kê chiến lược Affiliate đang dùng...",
    exampleOutput: "1. Họ dùng landing page...",
    tags: ["affiliate", "research"],
    level: "Trung cấp",
    tier: "Premium",
    featured: false,
    copyCount: 213,
    status: "Published",
  },
];
