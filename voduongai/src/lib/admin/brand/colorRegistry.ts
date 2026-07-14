/**
 * Color Palette Foundation — shared data model (BRAND-SPR-001 Task 5,
 * mở rộng BRAND-SPR-201 Task 5: thêm field `role` (Primary/Secondary/
 * Accent/Semantic Colors — đúng 4 mục brief yêu cầu) và 3 Semantic Color
 * thật (Success/Warning/Danger) lấy từ nhóm GemOS Design System trong
 * globals.css — trước đó (BRAND-SPR-001) nhóm này bị loại khỏi seed vì
 * coi là "token nội bộ UI, không phải bảng màu thương hiệu"; BRAND-SPR-201
 * Task 5 liệt kê rõ "Semantic Colors" là 1 trong 4 mục Color Palette
 * Management — đây là chỉ thị Founder/PMO ghi đè quyết định loại trừ đó.
 *
 * Danh sách token màu (tên/mã hex/role/ghi chú sử dụng) — không có color
 * picker sinh mã tự động, không Theme Builder. Status dùng lại
 * NAVIGATION_STATUSES (xem assetRegistry.ts).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const COLOR_STATUSES = NAVIGATION_STATUSES;
export type ColorStatus = NavigationStatus;

export const COLOR_ROLES = ["Primary", "Secondary", "Accent", "Semantic"] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];

export type ColorToken = {
  id: string;
  name: string;
  hexValue: string;
  role: ColorRole;
  usageNote: string;
  status: ColorStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyColorToken(): Omit<ColorToken, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", hexValue: "#2563EB", role: "Primary", usageNote: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const COLOR_TOKENS_COLLECTION_KEY = "brand-color-tokens";

/**
 * Mock Data — sao chép đúng các biến `--color-brand-*` THẬT trong
 * `src/app/globals.css` (nhóm "Brand — VO DUONG AI") cộng 3 Semantic
 * Color thật từ nhóm GemOS Design System (`--color-gemos-success/warning/
 * danger`) — theo đúng yêu cầu Task 5 (BRAND-SPR-201). Bao gồm phát hiện:
 * "Brand Orange" có 2 giá trị khác nhau đang tồn tại song song trong code
 * (xem assetRegistry.ts seed + báo cáo BRAND-SPR-001) — cả 2 đều được ghi
 * nhận ở đây, không tự chọn 1 giá trị "đúng".
 */
export const COLOR_TOKENS_SEED: ColorToken[] = [
  {
    id: "color_seed_blue",
    name: "Brand Blue (Primary)",
    hexValue: "#2563EB",
    role: "Primary",
    usageNote: "--color-brand-blue trong globals.css — màu chính, dùng cho path logo, CTA, focus ring.",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_blue_dark",
    name: "Brand Blue Dark",
    hexValue: "#0B1F4D",
    role: "Primary",
    usageNote: "--color-brand-blue-dark — cũng là màu nền hardcode của Modal/Admin surface tối (bg-[#0B1F4D]).",
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_violet",
    name: "Brand Violet",
    hexValue: "#5B8CFF",
    role: "Secondary",
    usageNote: "--color-brand-violet — dùng cho gradient/hover accent.",
    status: "Active",
    sortOrder: 3,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_orange_current",
    name: "Brand Orange (đang dùng — Footer/Nav)",
    hexValue: "#FF7A00",
    role: "Accent",
    usageNote: "--color-brand-orange trong globals.css — khớp chấm tròn accent trong Footer.tsx/nav logo hiện tại.",
    status: "Active",
    sortOrder: 4,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_orange_claude_md",
    name: "Brand Orange (quy ước CLAUDE.md — KHÁC giá trị trên)",
    hexValue: "#F97316",
    role: "Accent",
    usageNote:
      "⚠️ Quy ước logo bắt buộc cho trang mới trong root CLAUDE.md dùng mã này cho chấm tròn accent — khác #FF7A00 đang dùng thật. Cần Founder chọn 1 giá trị chính thức, xem báo cáo BRAND-SPR-001.",
    status: "Draft",
    sortOrder: 5,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_navy",
    name: "Brand Navy",
    hexValue: "#06142D",
    role: "Secondary",
    usageNote: "--color-brand-navy — nền tối sâu nhất, dùng ở một số khối hero/section.",
    status: "Active",
    sortOrder: 6,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_purple",
    name: "Brand Purple",
    hexValue: "#8B5CF6",
    role: "Accent",
    usageNote: "--color-brand-purple — accent phụ.",
    status: "Active",
    sortOrder: 7,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_cyan",
    name: "Brand Cyan",
    hexValue: "#22D3EE",
    role: "Accent",
    usageNote: "--color-brand-cyan — accent phụ, trùng với --color-gemos-gem-cyan.",
    status: "Active",
    sortOrder: 8,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_semantic_success",
    name: "Semantic — Success",
    hexValue: "#10B981",
    role: "Semantic",
    usageNote: "--color-gemos-success trong globals.css (nhóm GemOS Design System) — trạng thái thành công.",
    status: "Active",
    sortOrder: 9,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_semantic_warning",
    name: "Semantic — Warning",
    hexValue: "#F59E0B",
    role: "Semantic",
    usageNote: "--color-gemos-warning trong globals.css — trạng thái cảnh báo.",
    status: "Active",
    sortOrder: 10,
    updatedDate: "2026-07-12",
  },
  {
    id: "color_seed_semantic_danger",
    name: "Semantic — Danger",
    hexValue: "#F43F5E",
    role: "Semantic",
    usageNote: "--color-gemos-danger trong globals.css — trạng thái lỗi/nguy hiểm.",
    status: "Active",
    sortOrder: 11,
    updatedDate: "2026-07-12",
  },
];
