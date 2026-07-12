/**
 * Media Folder Registry — shared data model (MEDIA-SPR-201 Task 6, phần
 * "Folder Management"). Ghi nhận cấu trúc thư mục PHÂN CẤP (tối đa 1 cấp
 * cha, qua `parentFolderId`) dùng để phân loại `MediaAsset.folderId`
 * (xem assetRegistry.ts) — không phải hệ thống file thật, chỉ là metadata
 * tổ chức để Founder duyệt nhanh theo nhóm.
 *
 * Foundation: không có upload/kéo-thả di chuyển file giữa Folder (không
 * Media File Manager UI đầy đủ, chỉ CRUD danh sách Folder).
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const MEDIA_FOLDER_STATUSES = NAVIGATION_STATUSES;
export type MediaFolderStatus = NavigationStatus;

export type MediaFolder = {
  id: string;
  name: string;
  parentFolderId: string;
  description: string;
  status: MediaFolderStatus;
  sortOrder: number;
  updatedDate: string;
};

export function emptyMediaFolder(): Omit<MediaFolder, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return { name: "", parentFolderId: "", description: "", status: "Draft", sortOrder: 0, updatedDate: today };
}

export const MEDIA_FOLDERS_COLLECTION_KEY = "media-folders";

/**
 * Mock Data — cấu trúc thư mục hợp lý bám theo nhóm asset THẬT tìm thấy
 * khi audit codebase (Founder/Brand, Companion, Garden, Tools, Courses) —
 * không phải cấu trúc bịa, dùng để tổ chức lại các asset seed thật ở
 * assetRegistry.ts.
 */
export const MEDIA_FOLDERS_SEED: MediaFolder[] = [
  { id: "folder_founder_brand", name: "Founder & Brand", parentFolderId: "", description: "Ảnh founder, ảnh thương hiệu — chồng lấn một phần với Brand Asset Registry (Brand Studio), xem báo cáo.", status: "Active", sortOrder: 1, updatedDate: "2026-07-12" },
  { id: "folder_companion", name: "Companion", parentFolderId: "", description: "Ảnh nhân vật Companion (avatar nhiều kích thước) dùng trong Companion feature.", status: "Active", sortOrder: 2, updatedDate: "2026-07-12" },
  { id: "folder_garden", name: "Living Garden", parentFolderId: "", description: "Ảnh minh hoạ tính năng Living Garden (Khu vườn của bạn).", status: "Active", sortOrder: 3, updatedDate: "2026-07-12" },
  { id: "folder_tools_logos", name: "Tools & Vendor Logos", parentFolderId: "", description: "Logo các công cụ AI bên thứ 3 hiển thị ở CKOS Tools (không phải asset thương hiệu VDAI).", status: "Active", sortOrder: 4, updatedDate: "2026-07-12" },
  { id: "folder_course_materials", name: "Course Materials", parentFolderId: "", description: "Tài liệu PDF khoá học/sản phẩm Premium — hiện lưu dưới dạng URL động trong Supabase (products.pdf_url), không phải file trong Folder này, xem báo cáo.", status: "Draft", sortOrder: 5, updatedDate: "2026-07-12" },
];
