export type Lesson = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  videoUrl?: string;
  thumbnail?: string;
  category: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  duration: string;
  relatedResource?: string;
  relatedPrompt?: string;
  relatedTool?: string;
  tier: "Free" | "Premium";
  status: "Draft" | "Published" | "Hidden";
  order: number;
};

export const aiAcademySeed: Lesson[] = [
  { id: "ai_1", title: "AI là gì và vì sao bạn cần học ngay", slug: "ai-la-gi", shortDescription: "Tổng quan về AI cho người mới.", content: "", category: "Nhập môn", level: "Cơ bản", duration: "12 phút", tier: "Free", status: "Published", order: 1 },
  { id: "ai_2", title: "Viết Prompt hiệu quả với ChatGPT", slug: "viet-prompt-hieu-qua", shortDescription: "Kỹ thuật prompt căn bản.", content: "", category: "Prompt", level: "Cơ bản", duration: "18 phút", tier: "Free", status: "Published", order: 2 },
];

export const affiliateAcademySeed: Lesson[] = [
  { id: "aff_1", title: "Affiliate Marketing là gì", slug: "affiliate-la-gi", shortDescription: "Khái niệm cơ bản về Affiliate.", content: "", category: "Nhập môn", level: "Cơ bản", duration: "15 phút", tier: "Free", status: "Published", order: 1 },
];

export const personalBrandSeed: Lesson[] = [
  { id: "pb_1", title: "Xây thương hiệu cá nhân từ con số 0", slug: "thuong-hieu-ca-nhan", shortDescription: "Lộ trình xây kênh cá nhân.", content: "", category: "Nhập môn", level: "Cơ bản", duration: "20 phút", tier: "Free", status: "Published", order: 1 },
];
