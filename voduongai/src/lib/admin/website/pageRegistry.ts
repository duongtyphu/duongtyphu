/**
 * Website Page Registry — shared data model (WEB-SPR-002).
 *
 * Task 2 ("Shared Page Structure — Không tạo Page Schema riêng cho từng
 * loại"): Homepage, Landing Pages, and Static Pages all share this ONE
 * `WebsitePage` shape, discriminated by `pageType` — not three separate
 * schemas. Persisted via the existing `useCollection()` two-tier mechanism
 * (per-browser localStorage tier, since "website-pages" is not yet in
 * SUPABASE_COLLECTIONS — wiring to a real table is a later sprint's job,
 * same bridge pattern already used for CKOS's Goals/Workflows/etc.).
 *
 * This registry tracks page *metadata* only (title/slug/status/visibility/
 * SEO/publish info) — it does not store or edit page *content* (body,
 * sections, layout). No Visual/Block/Section Editor exists here, per
 * Task 6.
 */

export const PAGE_LIFECYCLE_STATUSES = ["Draft", "Review", "Approved", "Published", "Archived"] as const;
export type PageLifecycleStatus = (typeof PAGE_LIFECYCLE_STATUSES)[number];

export const PAGE_TYPES = ["Homepage", "Landing Page", "Static Page"] as const;
export type PageType = (typeof PAGE_TYPES)[number];

export type RevisionNote = { date: string; note: string };

export type WebsitePage = {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  status: PageLifecycleStatus;
  visible: boolean;
  seoTitle: string;
  seoDescription: string;
  publishedDate: string;
  updatedDate: string;
  revisions: RevisionNote[];
};

export function emptyWebsitePage(pageType: PageType): Omit<WebsitePage, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    slug: "",
    pageType,
    status: "Draft",
    visible: false,
    seoTitle: "",
    seoDescription: "",
    publishedDate: "",
    updatedDate: today,
    revisions: [],
  };
}

export const WEBSITE_PAGES_COLLECTION_KEY = "website-pages";

/**
 * Mock Data (WEB-SPR-202, Task 1 "Website Registry" — FOUNDER-001 Nguyên
 * tắc 1/2/6) — PHÁT HIỆN P0: từ WEB-SPR-002 tới nay, `WEBSITE_PAGES_SEED`
 * KHÔNG TỒN TẠI — mọi route (`/admin/website/pages`, `/homepage`,
 * `/landing-pages`, `/static-pages`) seed bằng mảng RỖNG (`[]`). Founder
 * mở Page Registry chưa bao giờ thấy trang nào — vi phạm trực tiếp
 * Acceptance "Founder nhìn thấy toàn bộ Website" của chính brief gốc
 * WEB-SPR-001/002. Danh sách dưới đây audit trực tiếp `src/app/*` (không
 * kể `/portal/*`, `/admin/*`, `/api/*`, `/auth/*`, `/login`,
 * `/reset-password` — các route này thuộc Portal/Auth flow, ngoài phạm vi
 * "Website Presentation Layer" công khai của Workspace này, xem báo cáo
 * WEB-SPR-202):
 *
 * - **Homepage (1):** `/` — `src/app/page.tsx`.
 * - **Static Pages (7):** `/about`, `/contact`, `/disclaimer`, `/privacy`,
 *   `/refund-policy`, `/terms` (đủ 6 trang tĩnh thật), cộng `/blogai`
 *   (trang chỉ mục Blog AI — bài viết riêng lẻ `/blogai/[slug]` thuộc
 *   Content Registry, ngoài phạm vi Page Registry này, chỉ trang chỉ mục
 *   được đăng ký).
 * - **Landing Page (0 — khoảng trống thật):** không tìm thấy route Landing
 *   Page/campaign riêng nào trong `src/app/*` — seed 1 entry "(Chưa có)"
 *   ghi nhận khoảng trống, không bịa dữ liệu.
 *
 * `seoTitle` lấy đúng biến `title`/metadata thật trong từng file (không
 * suy đoán). `status`/`visible` đặt Published/true cho toàn bộ trang đang
 * chạy thật trên Production (không phải Draft mặc định).
 */
export const WEBSITE_PAGES_SEED: WebsitePage[] = [
  {
    id: "page_seed_home",
    title: "Trang chủ",
    slug: "/",
    pageType: "Homepage",
    status: "Published",
    visible: true,
    seoTitle: "VO DUONG AI",
    seoDescription: "Học AI • Xây hệ thống • Tạo tài sản số.",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_about",
    title: "Về Võ Đương AI",
    slug: "/about",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Về Võ Đương AI",
    seoDescription: "",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_contact",
    title: "Liên hệ",
    slug: "/contact",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Liên hệ",
    seoDescription: "",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_disclaimer",
    title: "Tuyên bố miễn trừ trách nhiệm",
    slug: "/disclaimer",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Tuyên bố miễn trừ trách nhiệm",
    seoDescription: "",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_privacy",
    title: "Chính sách bảo mật",
    slug: "/privacy",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Chính sách bảo mật",
    seoDescription: "",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_refund_policy",
    title: "Chính sách hoàn phí",
    slug: "/refund-policy",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Chính sách hoàn phí",
    seoDescription: "",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_terms",
    title: "Điều khoản sử dụng",
    slug: "/terms",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Điều khoản sử dụng",
    seoDescription: "",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_blogai_index",
    title: "Blog AI (trang chỉ mục)",
    slug: "/blogai",
    pageType: "Static Page",
    status: "Published",
    visible: true,
    seoTitle: "Blog AI",
    seoDescription: "Trang chỉ mục — từng bài viết (/blogai/[slug]) thuộc Content Registry, ngoài phạm vi mục này.",
    publishedDate: "2026-07-12",
    updatedDate: "2026-07-12",
    revisions: [],
  },
  {
    id: "page_seed_landing_gap",
    title: "(Chưa có) Landing Page",
    slug: "",
    pageType: "Landing Page",
    status: "Draft",
    visible: false,
    seoTitle: "",
    seoDescription: "",
    publishedDate: "",
    updatedDate: "2026-07-12",
    revisions: [{ date: "2026-07-12", note: "Khoảng trống thật (WEB-SPR-202) — chưa tìm thấy route Landing Page/campaign riêng nào trong src/app/*." }],
  },
];
