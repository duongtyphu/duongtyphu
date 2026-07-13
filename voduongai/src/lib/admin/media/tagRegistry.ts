/**
 * Media Tag Registry — shared data model (MEDIA-SPR-201 Task 7, "Media
 * Tags... dùng chung cho toàn hệ thống"). Danh sách phẳng (không phân cấp
 * như Folder) — mỗi `MediaAsset` có thể gắn nhiều tag (`MediaAsset.tags`,
 * mảng tên tag, xem assetRegistry.ts). Tag ở đây là DANH MỤC quản trị
 * (tên/mô tả/status) để Founder biết tag nào đang "chính thức" — không
 * ràng buộc cứng 2 chiều với `MediaAsset.tags` (asset có thể gõ tag tự do,
 * Registry này chỉ là danh sách tham khảo/chuẩn hoá, giống cách Brand
 * Studio's Color/Typography Role hoạt động ở mức khác).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const MEDIA_TAG_STATUSES = NAVIGATION_STATUSES;
export type MediaTagStatus = NavigationStatus;

export type MediaTag = {
  id: string;
  name: string;
  description: string;
  status: MediaTagStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyMediaTag(): Omit<MediaTag, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", description: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const MEDIA_TAGS_COLLECTION_KEY = "media-tags";

/**
 * Mock Data — tag thật khớp với asset seed đã audit (không bịa tag chưa
 * dùng ở đâu).
 */
export const MEDIA_TAGS_SEED: MediaTag[] = [
  { id: "tag_founder", name: "founder", description: "Ảnh founder VO DUONG AI.", status: "Active", sortOrder: 1, updatedDate: "2026-07-12" },
  { id: "tag_companion", name: "companion", description: "Ảnh liên quan nhân vật Companion.", status: "Active", sortOrder: 2, updatedDate: "2026-07-12" },
  { id: "tag_homepage", name: "homepage", description: "Asset dùng ở trang chủ.", status: "Active", sortOrder: 3, updatedDate: "2026-07-12" },
  { id: "tag_garden", name: "garden", description: "Asset thuộc tính năng Living Garden.", status: "Active", sortOrder: 4, updatedDate: "2026-07-12" },
  { id: "tag_vendor-logo", name: "vendor-logo", description: "Logo công cụ bên thứ 3, không phải nhận diện VDAI.", status: "Active", sortOrder: 5, updatedDate: "2026-07-12" },
  { id: "tag_unused", name: "unused", description: "Đánh dấu asset tồn tại trong public/ nhưng không tìm thấy nơi nào tham chiếu trong code — ứng viên dọn dẹp.", status: "Draft", sortOrder: 6, updatedDate: "2026-07-12" },
];
