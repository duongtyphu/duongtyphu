export type AdminTool = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  useCase: string;
  audience: string;
  pros: string[];
  cons: string[];
  /** Portal 4.0 Phase 4.2 — Knowledge Object Completion: khi nào KHÔNG nên dùng công cụ này. */
  whenNotToUse?: string;
  pricing: string;
  link: string;
  affiliateUrl?: string;
  videoUrl?: string;
  workflow?: string;
  relatedPromptId?: string;
  relatedResourceHref?: string;
  ctaText: string;
  ctaLink: string;
  badge: "Recommended" | "Tôi đang dùng" | "Affiliate";
  rating: number;
  featured: boolean;
  tier: "Free" | "Paid";
  status: "Draft" | "Published" | "Hidden";
  order: number;
};

export const toolsAdminSeed: AdminTool[] = [
  {
    id: "tool_1",
    name: "ChatGPT",
    slug: "chatgpt",
    logo: "chatgpt",
    category: "AI",
    shortDescription: "Trợ lý AI viết nội dung, nghiên cứu nhanh.",
    longDescription: "ChatGPT giúp viết bài, nghiên cứu và lên kế hoạch nội dung mỗi ngày.",
    useCase: "Viết nội dung, brainstorm ý tưởng",
    audience: "Người mới bắt đầu với AI",
    pros: ["Trả lời nhanh, hiểu tiếng Việt tốt", "Có app di động"],
    cons: ["Bản miễn phí giới hạn lượt hỏi"],
    whenNotToUse: "Không phù hợp cho việc cần độ chính xác pháp lý/y tế tuyệt đối, hay khi bạn cần AI truy cập dữ liệu nội bộ riêng của công ty mà chưa có cấu hình bảo mật phù hợp.",
    pricing: "Freemium",
    link: "https://chatgpt.com",
    affiliateUrl: "",
    workflow: "Sáng viết outline content bằng ChatGPT → chỉnh lại giọng văn cho phù hợp thương hiệu → đăng lên các kênh.",
    relatedPromptId: "p3",
    relatedResourceHref: "/portal/resources/r1",
    ctaText: "Dùng thử ChatGPT",
    ctaLink: "https://chatgpt.com",
    badge: "Tôi đang dùng",
    rating: 4.8,
    featured: true,
    tier: "Free",
    status: "Published",
    order: 1,
  },
];
