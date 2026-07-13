/**
 * Media Settings — singleton record (MEDIA-SPR-201 Task 9). Cùng pattern
 * Global Website/Brand Settings: đúng 1 record duy nhất (id cố định
 * `MEDIA_SETTINGS_ID`), dùng lại `useCollection()` hai tầng, không dựng
 * cơ chế lưu trữ mới. Foundation — không có UI cấu hình Storage Provider
 * thật (không CDN/Storage Migration).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const MEDIA_SETTINGS_STATUSES = NAVIGATION_STATUSES;
export type MediaSettingsStatus = NavigationStatus;

export const MEDIA_VISIBILITY_MODES = ["Public", "Private", "Workspace Only"] as const;
export type MediaVisibilityMode = (typeof MEDIA_VISIBILITY_MODES)[number];

export type MediaSettings = {
  id: string;
  uploadRulesNote: string;
  defaultFolderId: string;
  visibility: MediaVisibilityMode;
  storagePolicyNote: string;
  status: MediaSettingsStatus;
  updatedDate: string;
};

export const MEDIA_SETTINGS_ID = "media_settings_singleton";
export const MEDIA_SETTINGS_COLLECTION_KEY = "media-settings";

/**
 * Mock Data — mô tả trung thực hiện trạng: chưa có Upload Rules/Storage
 * Policy chính thức nào (không có cơ chế upload file thật ở Foundation
 * này), `defaultFolderId` trỏ về Folder thật đầu tiên trong seed
 * (folderRegistry.ts) làm ví dụ, không phải quyết định chính thức.
 */
export const MEDIA_SETTINGS_SEED: MediaSettings[] = [
  {
    id: MEDIA_SETTINGS_ID,
    uploadRulesNote:
      "Chưa có quy tắc upload chính thức (giới hạn dung lượng/định dạng cho phép) — Foundation này chưa có cơ chế upload file thật, chỉ quản lý metadata.",
    defaultFolderId: "folder_founder_brand",
    visibility: "Public",
    storagePolicyNote:
      "Chưa có Storage Policy chính thức (retention/backup/CDN). Toàn bộ asset hiện là file tĩnh trong public/ hoặc src/assets/ của repo — không qua storage provider riêng.",
    status: "Draft",
    updatedDate: "2026-07-12",
  },
];
