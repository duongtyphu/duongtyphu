/**
 * Media Asset Registry — shared data model (MEDIA-SPR-201, Task 2-5 + 8).
 *
 * Foundation only: KHÔNG Upload thật/Media File Manager/Image-Video
 * Editor/AI Image/AI Video/CDN Migration/Storage Migration. Registry chỉ
 * lưu METADATA của asset (tên, category, đường dẫn hiện có trong code,
 * kích thước ước lượng, ghi chú sử dụng) — `fileNote` mô tả path file
 * TĨNH thật đang tồn tại trong `public/` hoặc `src/assets/` (không phải
 * URL từ một thư viện media/CDN thật).
 *
 * MỘT schema `MediaAsset` dùng chung cho cả 4 category (Image/Video/
 * Document/Audio — Task 8 "Media Metadata": File Name/Type/Size/
 * Dimensions/Created/Updated/Used By/Workspace Owner đều là field trên
 * type này) — cùng nguyên tắc Shared Structure đã dùng cho Brand Asset
 * Registry (Brand Studio). `/admin/media-center/images`, `/videos`,
 * `/documents`, `/audio` dùng chung component `MediaAssetRegistry`, lọc
 * theo category; `/admin/media-center/library` hiển thị toàn bộ.
 *
 * `subType` (Task 3-5: Banner/Thumbnail/Hero/Logo Files/Gallery cho Image;
 * Intro/Course/Marketing/Tutorial cho Video; PDF/DOCX/XLSX/PPTX cho
 * Document) là field TEXT tự do — form gợi ý theo `MEDIA_SUBTYPE_OPTIONS`
 * ứng với category đã chọn, không ép kiểu union cứng (Audio brief không
 * cho danh sách sub-type cụ thể nên để trống, không tự bịa).
 *
 * `folderId`/`collectionId` tham chiếu `folderRegistry.ts`/
 * `collectionRegistry.ts` (Task 6); `tags` tham chiếu tên trong
 * `tagRegistry.ts` (Task 7, không ràng buộc cứng — asset có thể gõ tag
 * chưa có trong Registry).
 *
 * Status dùng lại ĐÚNG `NAVIGATION_STATUSES` từ Website Workspace — nhất
 * quán xuyên Workspace, không định nghĩa Status riêng.
 */

import { NAVIGATION_STATUSES, type NavigationStatus } from "@/lib/admin/website/navigationRegistry";

export const MEDIA_STATUSES = NAVIGATION_STATUSES;
export type MediaStatus = NavigationStatus;

export const MEDIA_CATEGORIES = ["Image", "Video", "Document", "Audio"] as const;
export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

/** Gợi ý sub-type theo category — đúng danh sách brief liệt kê ở Task 3-5. Audio: brief không cho danh sách, để trống (không bịa). */
export const MEDIA_SUBTYPE_OPTIONS: Record<MediaCategory, string[]> = {
  Image: ["Banner", "Thumbnail", "Hero", "Logo Files", "Gallery"],
  Video: ["Intro Video", "Course Video", "Marketing Video", "Tutorial"],
  Document: ["PDF", "DOCX", "XLSX", "PPTX"],
  Audio: [],
};

export type MediaAsset = {
  id: string;
  name: string;
  category: MediaCategory;
  subType: string;
  fileNote: string;
  formatNote: string;
  sizeNote: string;
  dimensionsNote: string;
  folderId: string;
  collectionId: string;
  tags: string[];
  usedByNote: string;
  workspaceOwnerNote: string;
  status: MediaStatus;
  sortOrder: number;
  createdDate: string;
  updatedDate: string;
};

export function emptyMediaAsset(category: MediaCategory = "Image"): Omit<MediaAsset, "id"> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: "",
    category,
    subType: "",
    fileNote: "",
    formatNote: "",
    sizeNote: "",
    dimensionsNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 0,
    createdDate: today,
    updatedDate: today,
  };
}

export const MEDIA_ASSETS_COLLECTION_KEY = "media-assets";

/**
 * Mock Data — bám sát asset THẬT tìm thấy khi audit `public/` và
 * `src/assets/` cùng nơi sử dụng thật trong code (grep tham chiếu, không
 * bịa "Used By"). Phát hiện đáng chú ý:
 * - **2 ảnh founder khác nhau cho cùng mục đích**: `/founder.png` (dùng ở
 *   `FounderStory.tsx`, trang chủ) vs `/images/founder-portrait.jpg`
 *   (dùng ở `src/data/portal/founder.ts`, trang Portal Founder) — không
 *   rõ có chủ đích (2 bối cảnh khác nhau) hay trùng lặp ngoài ý muốn.
 * - **`garden-care-visual.jpg` tồn tại trong `public/images/garden/`
 *   nhưng KHÔNG tìm thấy nơi nào tham chiếu trong code** — asset mồ côi,
 *   ứng viên dọn dẹp hoặc chưa được dùng tới.
 * - **`founder.png` trước đó là "khoảng trống" trong Brand Asset Registry**
 *   (`asset_seed_brand_image_gap`, BRAND-SPR-201: "founder.png tồn tại
 *   trong code nhưng chưa được đăng ký") — nay đã có entry thật ở đây,
 *   thuộc Media Center theo đúng ranh giới đã ghi ở `brand-studio.md`
 *   Mục 13 (ảnh mang tính nội dung/nhận diện dùng chung → Media Center,
 *   không phải Brand Studio).
 * - **Không có Video nào tồn tại trong Portal** — không `<video>` tag,
 *   không file `.mp4/.webm` nào trong `public/`. 4 sub-type Video theo
 *   Task 4 đều là khoảng trống thật.
 * - **Document PDF là URL động, không phải file quản lý qua Media
 *   Center**: `products.pdf_url`/`lessons.pdf_url` (Premium Workspace,
 *   Supabase) — Founder nhập URL PDF ngoài khi tạo sản phẩm, không upload
 *   qua đây. DOCX/XLSX/PPTX: không tìm thấy ví dụ nào trong repo.
 * - **Không có Audio nào** — không `<audio>` tag, không file audio nào
 *   trong `public/`. Toàn bộ module Audio là khoảng trống thật.
 */
export const MEDIA_ASSETS_SEED: MediaAsset[] = [
  {
    id: "media_seed_founder_home",
    name: "Founder Portrait (Trang chủ)",
    category: "Image",
    subType: "Hero",
    fileNote: "/founder.png (public/founder.png)",
    formatNote: "PNG",
    sizeNote: "Chưa đo — cần kiểm tra dung lượng file thật.",
    dimensionsNote: "Chưa xác nhận kích thước gốc.",
    folderId: "folder_founder_brand",
    collectionId: "collection_homepage_hero",
    tags: ["founder", "homepage"],
    usedByNote: "src/components/home/FounderStory.tsx (trang chủ). Trước là khoảng trống trong Brand Asset Registry (asset_seed_brand_image_gap, BRAND-SPR-201) — nay đăng ký thật ở đây.",
    workspaceOwnerNote: "Website Workspace (Shared Section Founder Story)",
    status: "Active",
    sortOrder: 1,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_founder_portal",
    name: "Founder Portrait (Portal Founder Page)",
    category: "Image",
    subType: "Hero",
    fileNote: "/images/founder-portrait.jpg (public/images/founder-portrait.jpg)",
    formatNote: "JPG",
    sizeNote: "Chưa đo.",
    dimensionsNote: "Chưa xác nhận kích thước gốc.",
    folderId: "folder_founder_brand",
    collectionId: "collection_homepage_hero",
    tags: ["founder"],
    usedByNote:
      "⚠️ Đính chính MEDIA-SPR-202 (claim cũ MEDIA-SPR-201 sai — KHÔNG dùng ở /portal/story, đó là trang \"Câu chuyện của tôi\" cá nhân hoá, không liên quan Founder). Thật ra: FOUNDER.photo trong src/data/portal/founder.ts, đọc bởi CommunityGuides.tsx (route /portal/congdongai) và FounderSpotlight.tsx (route /portal/premium). Ảnh founder KHÁC với media_seed_founder_home (2 file khác nhau cho cùng chủ đề founder). Chưa rõ có chủ đích, cần Founder xác nhận.",
    workspaceOwnerNote: "Portal (Community + Premium — qua src/data/portal/founder.ts)",
    status: "Active",
    sortOrder: 2,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_companion_avatar_set",
    name: "Companion Avatar Set (6 kích thước)",
    category: "Image",
    subType: "Gallery",
    fileNote: "src/assets/companion/official/companion-master-v1-{48,64,96,160,320,hero}.png",
    formatNote: "PNG, 6 file kích thước khác nhau",
    sizeNote: "Chưa đo tổng dung lượng.",
    dimensionsNote: "48/64/96/160/320px + 1 bản hero (kích thước lớn hơn, chưa xác nhận px chính xác).",
    folderId: "folder_companion",
    collectionId: "collection_companion_avatar_set",
    tags: ["companion"],
    usedByNote: "src/components/portal/companion/CompanionAvatar.tsx — chọn kích thước theo context hiển thị.",
    workspaceOwnerNote: "Companion Studio",
    status: "Active",
    sortOrder: 3,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_garden_tree_scene",
    name: "Garden Tree Scene",
    category: "Image",
    subType: "Gallery",
    fileNote: "/images/garden/garden-tree-scene.jpg",
    formatNote: "JPG",
    sizeNote: "Chưa đo.",
    dimensionsNote: "Chưa xác nhận.",
    folderId: "folder_garden",
    collectionId: "",
    tags: ["garden"],
    usedByNote:
      "⚠️ Đính chính MEDIA-SPR-202: file được reference ở 3 component (GardenWidget.tsx, scene/TreeLayer.tsx, LivingGardenCard.tsx) nhưng chỉ scene/TreeLayer.tsx thật sự được mount lên Portal (qua GardenExperience.tsx → route /portal/khuvuoncuaban). GardenWidget.tsx và LivingGardenCard.tsx có import/dùng ảnh này nhưng bản thân 2 component đó KHÔNG được import ở bất kỳ đâu khác trong repo — 2 component mồ côi (Consumer = 0 ở cấp component, cùng pattern NotificationTicker.tsx đã phát hiện ở IMP-ADM-001R). Route thật duy nhất: /portal/khuvuoncuaban.",
    workspaceOwnerNote: "Portal (Living Garden feature, route /portal/khuvuoncuaban)",
    status: "Active",
    sortOrder: 4,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_garden_care_visual",
    name: "Garden Care Visual",
    category: "Image",
    subType: "Gallery",
    fileNote: "/images/garden/garden-care-visual.jpg",
    formatNote: "JPG",
    sizeNote: "Chưa đo.",
    dimensionsNote: "Chưa xác nhận.",
    folderId: "folder_garden",
    collectionId: "",
    tags: ["garden", "unused"],
    usedByNote:
      "🚫 UNUSED MEDIA (MEDIA-SPR-202, Task 6) — xác nhận lại: không tìm thấy tham chiếu nào trong code (grep toàn repo). Tồn tại trong public/ nhưng không được Portal sử dụng. Không tự xoá — cần Founder quyết định giữ (dự phòng) hay xoá.",
    workspaceOwnerNote: "Không có Workspace Owner nào tham chiếu — Portal không dùng.",
    status: "Draft",
    sortOrder: 5,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_vendor_tool_logos",
    name: "Vendor Tool Logos (11 file)",
    category: "Image",
    subType: "Logo Files",
    fileNote: "public/tools/*.ico + *.svg (hostinger, make, gemini, heygen, capcut, notion, claude, figma, chatgpt, canva, google-workspace)",
    formatNote: "ICO/SVG, 11 file",
    sizeNote: "Chưa đo.",
    dimensionsNote: "N/A — icon nhỏ, đa dạng kích thước theo nguồn gốc bên thứ 3.",
    folderId: "folder_tools_logos",
    collectionId: "",
    tags: ["vendor-logo"],
    usedByNote: "CKOS Tools module (Admin + Portal /admin/tools, /portal/tools) — logo công cụ AI bên thứ 3, KHÔNG phải nhận diện thương hiệu VDAI (khác phạm vi Brand Studio).",
    workspaceOwnerNote: "CKOS",
    status: "Active",
    sortOrder: 6,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_video_intro_gap",
    name: "(Chưa có) Intro Video",
    category: "Video",
    subType: "Intro Video",
    fileNote: "Không tìm thấy file video hoặc <video> tag nào trong toàn bộ repo.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật (MEDIA-SPR-201, Task 4) — Portal hiện không có bất kỳ video nào.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 1,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_video_course_gap",
    name: "(Chưa có) Course Video",
    category: "Video",
    subType: "Course Video",
    fileNote: "Không tìm thấy.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật — Premium/Academy hiện chỉ có pdf_url (tài liệu), không có video bài giảng nào trong schema/code hiện tại.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 2,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_video_marketing_gap",
    name: "(Chưa có) Marketing Video",
    category: "Video",
    subType: "Marketing Video",
    fileNote: "Không tìm thấy.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 3,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_video_tutorial_gap",
    name: "(Chưa có) Tutorial Video",
    category: "Video",
    subType: "Tutorial",
    fileNote: "Không tìm thấy.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 4,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_document_pdf_dynamic",
    name: "Course PDF (URL động — Premium)",
    category: "Document",
    subType: "PDF",
    fileNote: "Không phải file tĩnh — products.pdf_url/lessons.pdf_url (Supabase, nhập URL ngoài qua ProductForm.tsx ở Premium Workspace)",
    formatNote: "PDF (qua URL ngoài, không host trong repo)",
    dimensionsNote: "N/A",
    sizeNote: "N/A — không kiểm soát dung lượng vì là URL ngoài.",
    folderId: "folder_course_materials",
    collectionId: "",
    tags: [],
    usedByNote: "⚠️ Khác kiến trúc mọi asset khác trong Registry này: PDF khoá học hiện KHÔNG đi qua Media Center — Founder nhập URL PDF trực tiếp khi tạo sản phẩm Premium (products.pdf_url), Media Center chỉ ghi nhận hiện trạng, chưa quản lý được.",
    workspaceOwnerNote: "Premium Workspace",
    status: "Draft",
    sortOrder: 1,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_document_docx_gap",
    name: "(Chưa có) DOCX",
    category: "Document",
    subType: "DOCX",
    fileNote: "Không tìm thấy file DOCX hoặc tham chiếu nào trong repo.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật (MEDIA-SPR-201, Task 5).",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 2,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_document_xlsx_gap",
    name: "(Chưa có) XLSX",
    category: "Document",
    subType: "XLSX",
    fileNote: "Không tìm thấy.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 3,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_document_pptx_gap",
    name: "(Chưa có) PPTX",
    category: "Document",
    subType: "PPTX",
    fileNote: "Không tìm thấy.",
    formatNote: "",
    dimensionsNote: "",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 4,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
  {
    id: "media_seed_audio_gap",
    name: "(Chưa có) Audio",
    category: "Audio",
    subType: "",
    fileNote: "Không tìm thấy file audio hoặc <audio> tag nào trong toàn bộ repo.",
    formatNote: "",
    dimensionsNote: "N/A",
    sizeNote: "",
    folderId: "",
    collectionId: "",
    tags: [],
    usedByNote: "Khoảng trống thật (MEDIA-SPR-201, Scope module 6 \"Audio\") — Portal hiện không có nội dung âm thanh nào. Brief không cho danh sách sub-type Audio cụ thể — không tự bịa.",
    workspaceOwnerNote: "",
    status: "Draft",
    sortOrder: 1,
    createdDate: "2026-07-12",
    updatedDate: "2026-07-12",
  },
];
