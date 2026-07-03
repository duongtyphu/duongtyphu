import type { KnowledgeCollection } from "../types/knowledge-collection.types";

export const knowledgeCollections: KnowledgeCollection[] = [
  {
    id: "collection-ai-office-essentials",
    slug: "ai-office-essentials",
    title: "AI Office Essentials",
    description:
      "Những kỹ năng AI nền tảng cho công việc văn phòng hằng ngày — email, báo cáo, cuộc họp, thời gian và FAQ.",
    seedSlugs: [
      "viet-email-chuyen-nghiep",
      "lam-bao-cao-tuan-bang-ai",
      "ghi-chu-va-tong-hop-cuoc-hop",
      "quan-ly-thoi-gian-lam-viec",
      "soan-bo-faq-cho-cong-viec",
    ],
  },
  {
    id: "collection-ai-research-presentation",
    slug: "ai-research-presentation",
    title: "AI Research & Presentation",
    description:
      "Kỹ năng AI cho nghiên cứu và trình bày — đọc tài liệu dài, nghiên cứu chủ đề mới, thiết kế slide thuyết trình.",
    seedSlugs: [
      "thiet-ke-powerpoint-nhanh-gon",
      "tom-tat-tai-lieu-pdf-dai",
      "nghien-cuu-mot-chu-de-nhanh-chong",
    ],
  },
];
