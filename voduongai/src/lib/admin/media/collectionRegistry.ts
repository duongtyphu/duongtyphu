/**
 * Media Collection Registry — shared data model (MEDIA-SPR-201 Task 6,
 * phần "Collections"). Khác Folder (cấu trúc phân cấp cố định), Collection
 * là nhóm TUYỂN CHỌN linh hoạt (VD "Bộ ảnh dùng cho Landing Page Q3"),
 * một asset có thể thuộc nhiều Collection trong tương lai — Foundation
 * hiện chỉ hỗ trợ 1 Collection chính/asset (`MediaAsset.collectionId`),
 * xem assetRegistry.ts.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const MEDIA_COLLECTION_STATUSES = NAVIGATION_STATUSES;
export type MediaCollectionStatus = NavigationStatus;

export type MediaCollection = {
  id: string;
  name: string;
  description: string;
  status: MediaCollectionStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyMediaCollection(): Omit<MediaCollection, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", description: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const MEDIA_COLLECTIONS_COLLECTION_KEY = "media-collections";

/**
 * Mock Data — 2 Collection thật, tuyển chọn từ asset thật đã audit (không
 * bịa Collection không có cơ sở).
 */
export const MEDIA_COLLECTIONS_SEED: MediaCollection[] = [
  {
    id: "collection_homepage_hero",
    name: "Homepage Hero Assets",
    description: "Ảnh hero dùng trên trang chủ và các trang giới thiệu founder (FounderStory.tsx, founder.ts).",
    status: "Active",
    sortOrder: 1,
    updatedDate: "2026-07-12",
  },
  {
    id: "collection_companion_avatar_set",
    name: "Companion Avatar Set",
    description: "Bộ ảnh avatar Companion nhiều kích thước (48/64/96/160/320/hero) dùng trong CompanionAvatar.tsx.",
    status: "Active",
    sortOrder: 2,
    updatedDate: "2026-07-12",
  },
];
