/**
 * Website SEO Registry — shared data model (WEB-SPR-005).
 *
 * Foundation only, per brief: KHÔNG SEO Generator, KHÔNG AI SEO, KHÔNG
 * Sitemap Generator, KHÔNG Robots Generator. Registry chỉ lưu metadata
 * SEO Founder tự nhập — không có công cụ tự sinh nội dung SEO.
 *
 * Task 1 (SEO Registry Foundation) + Task 3 (Shared SEO Structure): MỘT
 * schema `SEOEntry` áp dụng cho BẤT KỲ URL nào thuộc Website (Homepage/
 * Landing/Static), không tạo schema riêng theo loại trang — phân biệt
 * bằng `targetUrl` (đường dẫn), không dùng khóa ngoại tới Website Page
 * Registry để tránh phụ thuộc cứng (một SEO entry vẫn tồn tại độc lập kể
 * cả khi Page tương ứng bị xóa khỏi Page Registry).
 *
 * "Shared Structure" của sprint này còn có nghĩa: SEO Registry và Redirect
 * Registry (redirectRegistry.ts) dùng LẠI ĐÚNG một Status model — import
 * `NAVIGATION_STATUSES`/`NavigationStatus` từ navigationRegistry.ts (WEB-
 * SPR-003) thay vì mỗi Registry tự định nghĩa Status riêng.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const SEO_STATUSES = NAVIGATION_STATUSES;
export type SEOStatus = NavigationStatus;

export type SEOEntry = {
  id: string;
  title: string;
  targetUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageNote: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  sitemapInclude: boolean;
  status: NavigationStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptySEOEntry(): Omit<SEOEntry, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    targetUrl: "",
    metaTitle: "",
    metaDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogImageNote: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    sitemapInclude: true,
    status: "Draft",
    sortOrder: 0,
    updatedDate: today,
  };
}

export const SEO_ENTRIES_COLLECTION_KEY = "website-seo-entries";

/** Ngưỡng độ dài khuyến nghị dùng cho Validation Placeholder (Task 4) — quy ước phổ biến của Google SERP, không phải rule cứng. */
export const SEO_LIMITS = { metaTitle: 60, metaDescription: 160 } as const;

/**
 * Mock Data (Task 6) — sao chép sát nội dung Meta Title/Description THẬT
 * đang hardcode trong các `page.tsx` hiện có (src/app/blogai/page.tsx,
 * src/app/about/page.tsx) và SEO mặc định toàn site từ layout.tsx
 * (`settings.seoTitle`/`settings.seoDescription`, đã admin-editable qua
 * SiteSettings — mục này chỉ tham chiếu, KHÔNG trùng lặp/thay thế
 * SiteSettings). Registry này CHƯA nối dây để các page.tsx đọc từ đây
 * (Consumer = 0, giống Page/Navigation/Shared Section Registry).
 */
export const SEO_ENTRIES_SEED: SEOEntry[] = [
  {
    id: "seo_seed_home",
    title: "SEO — Trang chủ (mặc định toàn site)",
    targetUrl: "/",
    metaTitle: "VO DUONG AI — Học AI, xây hệ thống, tạo tài sản số",
    metaDescription:
      "Hệ sinh thái giúp bạn học AI, ứng dụng AI vào công việc, xây thương hiệu cá nhân, làm Affiliate Marketing và tạo tài sản số — quy tụ trong một hệ sinh thái duy nhất.",
    ogTitle: "VO DUONG AI",
    ogDescription: "Học AI • Xây hệ thống • Tạo tài sản số.",
    ogImageNote: "(chưa có thư viện media — xem docs/admin/workspaces/brand-studio.md/media-center.md)",
    canonicalUrl: "https://voduongai.com",
    robotsIndex: true,
    robotsFollow: true,
    sitemapInclude: true,
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "seo_seed_blogai",
    title: "SEO — Blog AI",
    targetUrl: "/blogai",
    metaTitle: "Blog AI",
    metaDescription:
      "Blog VO DUONG AI chia sẻ kiến thức ứng dụng AI, Affiliate Marketing và tự động hóa cho cá nhân và đội nhóm.",
    ogTitle: "Blog AI",
    ogDescription:
      "Blog VO DUONG AI chia sẻ kiến thức ứng dụng AI, Affiliate Marketing và tự động hóa cho cá nhân và đội nhóm.",
    ogImageNote: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    sitemapInclude: true,
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
  {
    id: "seo_seed_about",
    title: "SEO — Giới thiệu",
    targetUrl: "/about",
    metaTitle: "Giới thiệu",
    metaDescription: "Giới thiệu về VO DUONG AI và người sáng lập — hệ sinh thái học AI, ứng dụng AI và Affiliate Marketing.",
    ogTitle: "Giới thiệu",
    ogDescription: "Giới thiệu về VO DUONG AI và người sáng lập — hệ sinh thái học AI, ứng dụng AI và Affiliate Marketing.",
    ogImageNote: "",
    canonicalUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    sitemapInclude: true,
    status: "Active",
    sortOrder: 3,
    updatedDate: "2026-07-12",
  },
];
