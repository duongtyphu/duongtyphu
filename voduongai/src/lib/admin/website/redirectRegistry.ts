/**
 * Website Redirect Registry — shared data model (WEB-SPR-005).
 *
 * Foundation only, per brief: KHÔNG Redirect Engine Runtime. Registry chỉ
 * LƯU danh sách rule — không có middleware/route nào đọc Registry này để
 * thực sự redirect request thật. Toàn bộ redirect thật của Portal vẫn
 * khai báo tĩnh trong next.config.ts (Consumer = 0 cho Registry này,
 * giống mọi Registry khác của Website Workspace tính đến nay).
 *
 * Task 2 (Redirect Registry Foundation). Task 3 (Shared SEO Structure) áp
 * dụng ở đây qua việc dùng LẠI ĐÚNG Status model của SEO Registry (xem
 * seoRegistry.ts) — cùng import từ navigationRegistry.ts.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const REDIRECT_STATUSES = NAVIGATION_STATUSES;
export type RedirectStatus = NavigationStatus;

export const REDIRECT_TYPES = ["301", "302"] as const;
export type RedirectType = (typeof REDIRECT_TYPES)[number];

export type RedirectEntry = {
  id: string;
  fromPath: string;
  toPath: string;
  redirectType: RedirectType;
  note: string;
  status: RedirectStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyRedirectEntry(): Omit<RedirectEntry, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { fromPath: "", toPath: "", redirectType: "301", note: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const REDIRECT_ENTRIES_COLLECTION_KEY = "website-redirect-entries";

/**
 * Mock Data (Task 6) — sao chép đúng một phần rule THẬT đang khai báo
 * tĩnh trong next.config.ts (redirects()), gồm cả 2 route đã xác nhận
 * "chết" ở ADM-SPR-005 (student-success, updates — page.tsx vẫn còn
 * nhưng không thể render vì bị redirect chặn trước ở tầng Next.js).
 * Registry này CHƯA điều khiển redirect thật — sao chép chỉ để Founder
 * xem/quản lý danh sách, không phải để thay next.config.ts.
 */
export const REDIRECT_ENTRIES_SEED: RedirectEntry[] = [
  {
    id: "redirect_seed_privacy",
    fromPath: "/privacy-policy",
    toPath: "/privacy",
    redirectType: "301",
    note: "Đổi tên route — nguồn: next.config.ts",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "redirect_seed_academy",
    fromPath: "/portal/academy",
    toPath: "/portal/hocvienai",
    redirectType: "301",
    note: "Đổi tên route — nguồn: next.config.ts",
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
  {
    id: "redirect_seed_student_success",
    fromPath: "/portal/student-success",
    toPath: "/portal/congdongai",
    redirectType: "301",
    note: "Route chết đã xác nhận ở ADM-SPR-005 — page.tsx vẫn còn nhưng không thể render vì bị chặn ở next.config.ts.",
    status: "Active",
    sortOrder: 3,
    updatedDate: "2026-07-12",
  },
  {
    id: "redirect_seed_updates",
    fromPath: "/portal/updates",
    toPath: "/portal/congdongai#tin-tuc",
    redirectType: "301",
    note: "Route chết đã xác nhận ở ADM-SPR-005 — page.tsx vẫn còn nhưng không thể render vì bị chặn ở next.config.ts.",
    status: "Active",
    sortOrder: 4,
    updatedDate: "2026-07-12",
  },
];
