export type PremiumProduct = {
  id: string;
  title: string;
  type: "Ebook" | "Prompt Pack" | "Mini Course" | "Consulting" | "Membership";
  description: string;
};

export const premiumProducts: PremiumProduct[] = [
  { id: "pp1", title: "Premium Ebook: Hệ thống Affiliate AI", type: "Ebook", description: "Tài liệu chuyên sâu xây hệ thống Affiliate ứng dụng AI toàn diện." },
  { id: "pp2", title: "Prompt Pack chuyên sâu cho Marketing", type: "Prompt Pack", description: "200+ prompt nâng cao dành riêng cho marketing và bán hàng." },
  { id: "pp3", title: "Mini Course: AI cho người mới bắt đầu", type: "Mini Course", description: "Khóa học ngắn giúp làm chủ công cụ AI trong 7 ngày." },
  { id: "pp4", title: "1:1 Consulting với Võ Đương AI", type: "Consulting", description: "Tư vấn riêng để xây lộ trình AI và Affiliate phù hợp với bạn." },
  { id: "pp5", title: "VDAI Membership", type: "Membership", description: "Truy cập trọn đời toàn bộ tài liệu, công cụ và cập nhật mới nhất." },
];
