import type { KnowledgeCollection } from "../types/knowledge-collection.types";

/**
 * @deprecated Không còn là nguồn hiển thị "Thư viện AI" (2 Collection) ở
 * /portal/hetrithucai — đã chuyển sang bảng Supabase `knowledge_collections`
 * (xem src/lib/portal/live-knowledge.ts, quản lý qua
 * /admin/ckos/knowledge-collections). Giữ lại mảng này để rollback + vì
 * knowledge-collection.service.ts (getSeedsInCollection/
 * computeCollectionProgress, dùng bởi CollectionCard) vẫn đọc trực tiếp —
 * chưa nối hết sang Supabase, xem CLAUDE.md.
 */
export const knowledgeCollections: KnowledgeCollection[] = [
  {
    id: "collection-ai-office",
    slug: "ai-office",
    title: "AI Office",
    description:
      "8 kỹ năng AI nền tảng cho công việc văn phòng — từ email, báo cáo, slide, Excel, họp hành đến tự động hoá công việc lặp lại.",
    seedSlugs: [
      "viet-email-chuyen-nghiep",
      "tom-tat-tai-lieu-pdf-dai",
      "lam-bao-cao-tuan-bang-ai",
      "thiet-ke-powerpoint-nhanh-gon",
      "viet-prompt-hieu-qua",
      "phan-tich-excel-bang-ai",
      "ghi-chu-va-tong-hop-cuoc-hop",
      "tu-dong-hoa-cong-viec-van-phong-bang-ai",
    ],
    // Chuỗi Collection tương lai theo Blueprint: AI Office → AI Content → AI
    // Marketing → AI Business. Chỉ AI Research & Productivity đã tồn tại —
    // không tạo Collection giả để lấp chỗ trống (xem Collection_Relationship_Guide.md).
    relatedCollections: ["ai-research-presentation"],
  },
  {
    id: "collection-ai-research-presentation",
    slug: "ai-research-presentation",
    title: "AI Research & Productivity",
    description:
      "Kỹ năng AI cho nghiên cứu và năng suất cá nhân — nghiên cứu chủ đề mới, quản lý thời gian, soạn FAQ cho công việc.",
    seedSlugs: [
      "nghien-cuu-mot-chu-de-nhanh-chong",
      "quan-ly-thoi-gian-lam-viec",
      "soan-bo-faq-cho-cong-viec",
    ],
    relatedCollections: ["ai-office"],
  },
];
