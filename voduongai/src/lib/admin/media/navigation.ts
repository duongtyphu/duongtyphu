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

export const MEDIA_WORKSPACE_SECTIONS: MediaWorkspaceSection[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin/media-center" },
  { key: "library", label: "Media Library", href: "/admin/media-center/library" },
  { key: "images", label: "Images", href: "/admin/media-center/images" },
  { key: "videos", label: "Videos", href: "/admin/media-center/videos" },
  { key: "documents", label: "Documents", href: "/admin/media-center/documents" },
  { key: "audio", label: "Audio", href: "/admin/media-center/audio" },
  { key: "folders", label: "Folder Management", href: "/admin/media-center/folders" },
  { key: "collections", label: "Collections", href: "/admin/media-center/collections" },
  { key: "tags", label: "Tags", href: "/admin/media-center/tags" },
  { key: "settings", label: "Media Settings", href: "/admin/media-center/settings" },
];
