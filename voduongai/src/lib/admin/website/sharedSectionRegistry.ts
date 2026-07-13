/**
 * Website Shared Section Registry — shared data model (WEB-SPR-004).
 *
 * Foundation only, per brief: KHÔNG Section Builder, KHÔNG Landing Builder,
 * KHÔNG AI Generator, KHÔNG Dynamic Layout Engine, KHÔNG Drag & Drop, KHÔNG
 * Visual Builder. Registry quản lý NỘI DUNG/COPY của khối dùng chung (tiêu
 * đề, mô tả, CTA) — không quản lý bố cục/thiết kế trực quan của khối.
 *
 * Task 1 (Shared Section Registry): MỘT schema `SharedSection` duy nhất
 * dùng chung cho cả 9 category (Task 2) — đúng nguyên tắc "Shared
 * Structure" đã dùng ở Website Page Registry (WEB-SPR-002) và Navigation
 * Registry (WEB-SPR-003), phân biệt bằng field `category`.
 *
 * Persisted via `useCollection()` hai tầng có sẵn (tầng localStorage —
 * "website-shared-sections" chưa nằm trong SUPABASE_COLLECTIONS).
 */

import { VISIBILITY_RULES, type VisibilityRule } from "@/lib/admin/website/navigationRegistry";

/**
 * Section Categories (Task 2) — đúng 9 category theo Scope của brief, khóa,
 * không tự thêm/bớt/đổi tên.
 */
export const SECTION_CATEGORIES = [
  "Hero",
  "CTA",
  "Banner",
  "Feature",
  "Founder",
  "Testimonial",
  "FAQ",
  "Footer",
  "Announcement",
] as const;
export type SectionCategory = (typeof SECTION_CATEGORIES)[number];

/**
 * Section Status (Task 3) — vòng đời RIÊNG của Shared Section, khác 4
 * trạng thái Draft/Active/Inactive/Archived của Navigation (WEB-SPR-003).
 * Nội dung Section (Hero/CTA/Founder Story...) là copy marketing thật, cần
 * bước xem xét trước khi lên production — giống bản chất Website Page hơn
 * là cấu trúc menu thuần túy — nên dùng lại đúng 5 trạng thái
 * Draft→Review→Approved→Published→Archived của Page Lifecycle (WEB-SPR-002).
 * Dùng lại đúng các tone Badge đã có sẵn (Review/Approved đã thêm từ
 * WEB-SPR-002) — không cần thêm tone mới.
 */
export const SECTION_STATUSES = ["Draft", "Review", "Approved", "Published", "Archived"] as const;
export type SectionStatus = (typeof SECTION_STATUSES)[number];

/**
 * Visibility Rule Foundation (Task 4) — dùng lại ĐÚNG enum
 * `VisibilityRule`/`VISIBILITY_RULES` đã định nghĩa ở Navigation Registry
 * (WEB-SPR-003) thay vì định nghĩa lại — cùng một khái niệm "ý định hiển
 * thị", cùng một giới hạn: CHỈ là metadata, KHÔNG có Permission Engine nào
 * thực thi (không route Portal nào đọc field này).
 */
export { VISIBILITY_RULES, type VisibilityRule };

export type SharedSection = {
  id: string;
  title: string;
  category: SectionCategory;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  status: SectionStatus;
  visibilityRule: VisibilityRule;
  sortOrder: number;
  updatedDate: string;
};

export function emptySharedSection(category: SectionCategory = "Hero"): Omit<SharedSection, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    category,
    headline: "",
    body: "",
    ctaLabel: "",
    ctaUrl: "",
    status: "Draft",
    visibilityRule: "Everyone",
    sortOrder: 0,
    updatedDate: today,
  };
}

export const SHARED_SECTIONS_COLLECTION_KEY = "website-shared-sections";

/**
 * Mock Data (Task 6) — theo đúng lưu ý của Founder ("bám sát portal đang có
 * ở hiện tại"), mỗi mục dưới đây sao chép hoặc mô tả sát nội dung THẬT hiện
 * có trong `src/components/home/*.tsx`/`src/components/site/Footer.tsx` khi
 * có nguồn hardcode rõ ràng. 3 category (Testimonial/FAQ/Announcement)
 * KHÔNG có khối hardcode 1-1 tương ứng trên Home hiện tại — Portal chỉ có
 * `TrustStats.tsx` (số liệu, không phải trích dẫn khách hàng thật), không
 * có khối FAQ marketing công khai trên Home, và `portal_banners` (Announcement
 * thật) là dữ liệu Admin-editable, không phải literal hardcode — nên 3 mục
 * này được đánh dấu rõ "minh họa" (illustrative), không phải copy nguyên
 * văn từ Portal, để không gây hiểu nhầm là nội dung thật đã có sẵn.
 */
export const SHARED_SECTIONS_SEED: SharedSection[] = [
  {
    id: "section_seed_hero",
    title: "Hero — Trang chủ",
    category: "Hero",
    headline: "VO DUONG AI",
    body: "Học AI • Xây hệ thống • Tạo tài sản số — ứng dụng AI thực chiến cho công việc, kinh doanh và tạo giá trị bền vững.",
    ctaLabel: "Nhận quyền truy cập Học viện miễn phí",
    ctaUrl: "/portal/hocvienai",
    status: "Published",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_cta",
    title: "Final CTA — Trang chủ",
    category: "CTA",
    headline: "Bắt đầu hành trình AI của bạn hôm nay",
    body: "Tôi đã chuẩn bị sẵn tài nguyên, công cụ và lộ trình bên trong Học viện AI. Việc của bạn là bắt đầu.",
    ctaLabel: "Nhận quyền truy cập Học viện miễn phí",
    ctaUrl: "/portal/hocvienai",
    status: "Published",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_banner",
    title: "Banner — Thông báo Portal",
    category: "Banner",
    headline: "(minh họa) — nguồn thật: bảng Supabase portal_banners",
    body: "Nội dung banner thật hiện đã có Admin CRUD và đã nối dây thật vào NotificationTicker.tsx (portal_banners) — mục này chỉ minh họa cấu trúc, không thay thế portal_banners.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Draft",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_feature",
    title: "Feature — AI ứng dụng",
    category: "Feature",
    headline: "AI ứng dụng",
    body: "Lộ trình rõ ràng giúp bạn hiểu và ứng dụng AI vào công việc thực tế, không lan man.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Published",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_founder",
    title: "Founder Story — Trang chủ",
    category: "Founder",
    headline: "Người sáng lập, Võ Đương AI",
    body: "Câu chuyện người sáng lập hiển thị ở FounderStory.tsx trên trang chủ — mục này quản lý phần copy văn bản, không quản lý ảnh (founder.png vẫn là file tĩnh, thuộc Brand Studio/Media Center, ngoài phạm vi Registry này).",
    ctaLabel: "",
    ctaUrl: "",
    status: "Published",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_testimonial",
    title: "Testimonial — (minh họa, chưa có nguồn thật)",
    category: "Testimonial",
    headline: "(minh họa) Chưa có khối Testimonial trên Home hiện tại",
    body: "Portal hiện chỉ có TrustStats.tsx (số liệu cộng đồng: 10,000+ người theo dõi...), không có trích dẫn/đánh giá khách hàng thật nào trên Home. Mục này minh họa cấu trúc category, không phải nội dung thật — cần Founder xác nhận nguồn Testimonial thật trước khi dùng.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Draft",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_faq",
    title: "FAQ — (minh họa, chưa có nguồn thật)",
    category: "FAQ",
    headline: "(minh họa) Chưa có khối FAQ marketing công khai trên Home",
    body: "Chưa tìm thấy khối FAQ hardcode nào trên trang chủ công khai. CKOS có FAQs riêng (/admin/ckos/faqs) nhưng thuộc CKOS Workspace, không phải Website Workspace. Mục này minh họa cấu trúc category, cần Founder xác nhận có cần khối FAQ marketing riêng hay không.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Draft",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_footer",
    title: "Footer — Mô tả thương hiệu",
    category: "Footer",
    headline: "VO DUONG AI",
    body: "Nơi học AI, xây hệ thống và tạo tài sản số hội tụ trong một hệ sinh thái duy nhất, đồng hành cùng bạn từ người mới đến nhà đầu tư thực chiến trong kỷ nguyên mới.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Published",
    visibilityRule: "Everyone",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "section_seed_announcement",
    title: "Announcement — (minh họa, chưa có nguồn thật)",
    category: "Announcement",
    headline: "(minh họa) Announcement dùng chung cơ chế portal_banners",
    body: "Portal hiện không phân biệt Banner và Announcement — cả hai đều qua portal_banners/NotificationTicker.tsx. Mục này minh họa category riêng theo đúng Scope của brief; ranh giới Banner vs Announcement cần PMO xác nhận nếu 2 category này thực sự khác nhau hay chỉ là 1 khái niệm.",
    ctaLabel: "",
    ctaUrl: "",
    status: "Draft",
    visibilityRule: "Everyone",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
];
