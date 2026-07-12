/**
 * Brand Asset Registry — shared data model (BRAND-SPR-001 Task 3).
 *
 * Foundation only: KHÔNG Asset Editor, KHÔNG AI Brand Generator. Registry
 * chỉ lưu METADATA của asset (tên, category, ghi chú nguồn/định dạng) —
 * KHÔNG có upload/thư viện file thật (Media Center chưa tồn tại, xem
 * docs/admin/workspaces/media-center.md). `fileNote` là mô tả văn bản
 * (đường dẫn file tĩnh hiện có, VD "/founder.png", hoặc mã SVG inline hiện
 * dùng trong code) — không phải asset URL từ một thư viện media thật.
 *
 * MỘT schema `BrandAsset` dùng chung cho cả 4 category (Logo/Wordmark/
 * Icon/Open Graph Image) — đúng nguyên tắc Shared Structure đã dùng cho
 * Website Page Registry (WEB-SPR-002) — phân biệt bằng field `category`.
 * `/admin/brand/logo`, `/wordmark`, `/icons`, `/open-graph` đều dùng chung
 * component `BrandAssetRegistry`, lọc theo category; `/admin/brand/assets`
 * hiển thị toàn bộ (không lọc) — đúng vai trò "Brand Assets Registry"
 * tổng hợp trong Scope.
 *
 * Status dùng lại ĐÚNG `NAVIGATION_STATUSES` từ Website Workspace
 * (navigationRegistry.ts) — nhất quán xuyên Workspace, không định nghĩa
 * Status riêng cho từng Registry mới.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const BRAND_STATUSES = NAVIGATION_STATUSES;
export type BrandStatus = NavigationStatus;

export const ASSET_CATEGORIES = ["Logo", "Wordmark", "Icon", "OpenGraphImage"] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export type BrandAsset = {
  id: string;
  name: string;
  category: AssetCategory;
  fileNote: string;
  formatNote: string;
  usageNote: string;
  status: BrandStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyBrandAsset(category: AssetCategory = "Logo"): Omit<BrandAsset, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", category, fileNote: "", formatNote: "", usageNote: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const BRAND_ASSETS_COLLECTION_KEY = "brand-assets";

/**
 * Mock Data — bám sát asset THẬT đang dùng trong code (không phải dữ liệu
 * bịa). Phát hiện đáng chú ý khi sưu tầm: logo SVG chuẩn hoá trong root
 * CLAUDE.md (quy ước bắt buộc cho trang MỚI) dùng màu accent `#F97316`,
 * trong khi `Footer.tsx`/nav logo hiện tại trên Portal dùng `#FF7A00`
 * (khớp `--color-brand-orange` trong globals.css) — 2 giá trị cam khác
 * nhau cho cùng một logo. Ghi rõ trong `usageNote`, KHÔNG tự chọn 1 giá
 * trị "đúng" — cần Founder quyết định (xem báo cáo BRAND-SPR-001).
 */
export const BRAND_ASSETS_SEED: BrandAsset[] = [
  {
    id: "asset_seed_logo_current",
    name: "Logo hiện tại (Footer/Nav)",
    category: "Logo",
    fileNote: "SVG inline trong code — src/components/site/Footer.tsx, các trang mới theo mẫu CLAUDE.md",
    formatNote: "SVG 32x32 viewBox, path chữ V cách điệu (#2563EB) + chấm tròn accent",
    usageNote:
      "Chấm tròn accent dùng #FF7A00 (khớp --color-brand-orange trong globals.css). Header/Footer/Nav hiện tại đang dùng giá trị này.",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_logo_claude_md",
    name: "Logo — quy ước CLAUDE.md cho trang mới",
    category: "Logo",
    fileNote: "SVG inline — mẫu bắt buộc trong root CLAUDE.md mục \"Logo (bắt buộc cho trang mới)\"",
    formatNote: "SVG 32x32 (nav) / 40x40 (footer), cùng path chữ V (#2563EB) + chấm tròn accent",
    usageNote:
      "⚠️ Chấm tròn accent dùng #F97316 — KHÁC với #FF7A00 đang dùng ở Logo hiện tại (Footer/Nav thật). Cùng một logo nhưng 2 mã màu cam khác nhau — cần Founder chọn 1 giá trị chính thức, xem báo cáo BRAND-SPR-001.",
    status: "Draft",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_wordmark",
    name: "Wordmark — \"VDAI ACADEMY\"",
    category: "Wordmark",
    fileNote: "Text lockup trong SVG logo (span 2 dòng: \"VDAI\" đậm + \"ACADEMY\" nhỏ, letter-spacing rộng)",
    formatNote: "Font Inter, weight 800 (\"VDAI\") / 600 (\"ACADEMY\")",
    usageNote:
      "Font Inter chỉ dùng riêng cho wordmark này — khác --font-sans toàn site (system font stack, không có Inter). Xem Typography Foundation.",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_favicon",
    name: "Favicon",
    category: "Icon",
    fileNote: "settings.faviconUrl (Supabase SiteSettings, /admin/settings) — đã admin-editable qua System Settings",
    formatNote: "URL, không cố định định dạng",
    usageNote: "Đã có Admin CRUD ở System Settings từ trước EPIC-BRAND-001 — chồng lấn, xem báo cáo BRAND-SPR-001.",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_og_default",
    name: "Open Graph — ảnh mặc định toàn site",
    category: "OpenGraphImage",
    fileNote: "Chưa có file OG image mặc định nào trong code — layout.tsx generateMetadata() không set openGraph.images",
    formatNote: "Khuyến nghị 1200x630 (chưa xác nhận)",
    usageNote:
      "Khoảng trống thật: Portal hiện không có OG image nào (share link lên Facebook/Zalo sẽ không có ảnh preview). Đây là brand asset còn thiếu, không phải lỗi Registry.",
    status: "Draft",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
];
