/**
 * Canonical Information Architecture của Media Center Workspace — theo
 * Scope của brief MEDIA-SPR-201 (10 mục: Dashboard, Media Library, Images,
 * Videos, Documents, Audio, Folder Management, Collections, Tags, Media
 * Settings). Single source of truth cho cả tab nav nội bộ
 * (MediaWorkspaceShell) và nhóm "Media Center" trong src/lib/admin/nav.ts —
 * cùng nguyên tắc đã dùng cho Website/Brand Studio Workspace.
 */
export type MediaWorkspaceSection = {
  key: string;
  label: string;
  href: string;
};

/**
 * PMO DIRECTIVE "ADMIN CMS v1.1 UI REFINEMENT" (Task 1/3, PMO APPROVAL) —
 * tiếng Việt, gộp Images/Videos/Documents/Audio vào tab "Thư viện" (đều đọc
 * chung Media Asset Registry, hiển thị đủ mọi loại), gộp Collections/Tags
 * vào tab "Thư mục & Bộ sưu tập". Route cũ vẫn hoạt động khi truy cập trực
 * tiếp, chỉ không còn hiện ở tab bar.
 */
export const MEDIA_WORKSPACE_SECTIONS: MediaWorkspaceSection[] = [
  { key: "dashboard", label: "Tổng quan", href: "/admin/media-center" },
  { key: "library", label: "Thư viện", href: "/admin/media-center/library" },
  { key: "folders", label: "Thư mục & Bộ sưu tập", href: "/admin/media-center/folders" },
  { key: "settings", label: "Cài đặt", href: "/admin/media-center/settings" },
];
