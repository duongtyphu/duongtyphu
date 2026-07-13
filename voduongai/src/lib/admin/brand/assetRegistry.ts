/**
 * Brand Asset Registry — shared data model (BRAND-SPR-001 Task 3).
 *
 * Foundation only: KHÔNG Asset Editor, KHÔNG AI Brand Generator. Registry
 * chỉ lưu METADATA của asset (tên, category, ghi chú nguồn/định dạng) —
 * KHÔNG có upload/thư viện file thật (Media Center nay đã có Registry
 * thật từ MEDIA-SPR-201, nhưng Brand Studio vẫn không dùng chung cơ chế
 * upload nào với Media Center — 2 Registry độc lập, xem
 * docs/admin/workspaces/media-center.md). `fileNote` là mô tả văn bản
 * (đường dẫn file tĩnh hiện có, VD "/founder.png", hoặc mã SVG inline hiện
 * dùng trong code) — không phải asset URL từ một thư viện media thật.
 *
 * MỘT schema `BrandAsset` dùng chung cho cả 7 category (BRAND-SPR-201 mở
 * rộng từ 4: Logo/Wordmark/Icon/Open Graph Image + Brand Image/Brand
 * Video/Identity File theo Task 8 "Brand Asset Registry") — đúng nguyên
 * tắc Shared Structure đã dùng cho Website Page Registry (WEB-SPR-002) —
 * phân biệt bằng field `category`. `/admin/brand/logo`, `/wordmark`,
 * `/icons`, `/open-graph` đều dùng chung component `BrandAssetRegistry`,
 * lọc theo category; `/admin/brand/assets` hiển thị toàn bộ (không lọc)
 * — đúng vai trò "Brand Assets Registry" tổng hợp trong Scope.
 *
 * Status dùng lại ĐÚNG `NAVIGATION_STATUSES` từ Website Workspace
 * (navigationRegistry.ts) — nhất quán xuyên Workspace, không định nghĩa
 * Status riêng cho từng Registry mới.
 *
 * LƯU Ý RANH GIỚI (BRAND-SPR-201): "Brand Image"/"Brand Video"/"Identity
 * File" ở đây CHỈ áp dụng cho tài sản mang tính NHẬN DIỆN thương hiệu
 * (ảnh chụp founder, video giới thiệu thương hiệu, file logo/guideline
 * đóng gói) — không phải thư viện media nội dung chung (ảnh minh hoạ bài
 * viết, ảnh khoá học...), vẫn thuộc Media Center (`media-center.md`,
 * nay đã xây ở MEDIA-SPR-201 — xem `src/lib/admin/media/assetRegistry.ts`,
 * category "Image"/"BrandImage" boundary đã áp dụng đúng ranh giới này).
 * Ranh giới này là suy luận hợp lý từ tên "Brand Studio =
 * Single Source of Brand Truth" trong Objective của brief, chưa có PMO
 * Clarification xác nhận bằng văn bản riêng.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const BRAND_STATUSES = NAVIGATION_STATUSES;
export type BrandStatus = NavigationStatus;

export const ASSET_CATEGORIES = [
  "Logo",
  "Wordmark",
  "Icon",
  "OpenGraphImage",
  "BrandImage",
  "BrandVideo",
  "IdentityFile",
] as const;
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
    id: "asset_seed_logo_light",
    name: "Logo — Biến thể sáng (Logo sáng)",
    category: "Logo",
    fileNote: "Chưa có file SVG riêng cho biến thể sáng — logo hiện tại (asset_seed_logo_current) dùng path #2563EB, tự đủ tương phản trên cả nền sáng/tối nhờ màu path cố định, không đổi theo theme.",
    formatNote: "Khuyến nghị: nếu cần biến thể sáng thật (dùng trên nền màu đậm/ảnh), cần thiết kế riêng.",
    usageNote: "Khoảng trống thật (BRAND-SPR-201) — Task 2 yêu cầu quản lý \"Logo sáng\" nhưng chưa có asset riêng nào trong code, chỉ có 1 logo dùng chung mọi nền.",
    status: "Draft",
    sortOrder: 3,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_logo_dark",
    name: "Logo — Biến thể tối (Logo tối)",
    category: "Logo",
    fileNote: "Chưa có file SVG riêng cho biến thể tối — tương tự Logo sáng, hiện chỉ có 1 phiên bản logo dùng chung.",
    formatNote: "Khuyến nghị: nếu cần biến thể tối thật (dùng trên nền trắng/sáng), cần thiết kế riêng.",
    usageNote: "Khoảng trống thật (BRAND-SPR-201) — tương tự Logo sáng.",
    status: "Draft",
    sortOrder: 4,
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
    id: "asset_seed_wordmark_guideline",
    name: "Wordmark — Quy chuẩn sử dụng",
    category: "Wordmark",
    fileNote: "Chưa có tài liệu guideline chính thức nào — quy chuẩn hiện tại chỉ suy ra từ code (CLAUDE.md mục Logo).",
    formatNote: "N/A — tài liệu, không phải file hình ảnh.",
    usageNote:
      "Khoảng trống thật (BRAND-SPR-201, Task 3) — chưa có văn bản quy chuẩn (khoảng cách tối thiểu, kích thước tối thiểu, nền cấm dùng...) ngoài mẫu code trong root CLAUDE.md.",
    status: "Draft",
    sortOrder: 2,
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
    id: "asset_seed_app_icon",
    name: "App Icon",
    category: "Icon",
    fileNote: "Chưa tìm thấy App Icon (VD apple-touch-icon, manifest icon PWA) riêng trong code — chỉ có favicon qua settings.faviconUrl.",
    formatNote: "Khuyến nghị 512x512 PNG nếu làm PWA/app icon thật trong tương lai.",
    usageNote: "Khoảng trống thật (BRAND-SPR-201, Task 2) — chưa có asset riêng, không phải lỗi Registry.",
    status: "Draft",
    sortOrder: 2,
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
  {
    id: "asset_seed_og_social_preview",
    name: "Open Graph — Social Preview (Twitter Card)",
    category: "OpenGraphImage",
    fileNote: "layout.tsx có khai báo twitter.card = \"summary_large_image\" nhưng không set twitter.images — dùng chung ảnh OG nếu có, hiện cũng trống.",
    formatNote: "Khuyến nghị 1200x630 (đồng bộ với OG Image).",
    usageNote: "Khoảng trống thật (BRAND-SPR-201, Task 7) — Social Preview phụ thuộc trực tiếp vào OG Image mặc định còn thiếu ở trên.",
    status: "Draft",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_brand_image_gap",
    name: "(Chưa có) Hình ảnh thương hiệu",
    category: "BrandImage",
    fileNote: "Chưa có ảnh thương hiệu chính thức nào trong Registry (VD ảnh founder chính thức, ảnh sản phẩm). founder.png tồn tại trong code (FounderStory.tsx) nhưng chưa được đăng ký vào đây.",
    formatNote: "",
    usageNote: "Category mới (BRAND-SPR-201, Task 8) — chưa có entry thật, ghi nhận khoảng trống thay vì bịa dữ liệu.",
    status: "Draft",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_brand_video_gap",
    name: "(Chưa có) Video thương hiệu",
    category: "BrandVideo",
    fileNote: "Chưa tìm thấy video thương hiệu chính thức nào trong code/repo.",
    formatNote: "",
    usageNote: "Category mới (BRAND-SPR-201, Task 8) — chưa có entry thật.",
    status: "Draft",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "asset_seed_identity_file_gap",
    name: "(Chưa có) File nhận diện đóng gói",
    category: "IdentityFile",
    fileNote: "Chưa có bộ file nhận diện thương hiệu đóng gói (VD .zip logo pack, brand guideline PDF) nào trong repo.",
    formatNote: "",
    usageNote: "Category mới (BRAND-SPR-201, Task 8) — chưa có entry thật.",
    status: "Draft",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
];
