# Media Center — Workspace Canonical Specification

> ℹ️ **Cập nhật MEDIA-SPR-201:** Brief IMP-MEDIA-201 xác nhận rõ *"Workspace Canonical Specification (WCS) và Product Package của Media Center đã được Founder và PMO phê duyệt"* và cung cấp Scope 10 mục cụ thể (Dashboard/Media Library/Images/Videos/Documents/Audio/Folder Management/Collections/Tags/Media Settings). Đây là chỉ thị Founder/PMO rõ ràng, giải quyết dứt điểm cảnh báo "chưa có Product Package" ghi nhận từ IMP-GOV-001 và nhắc lại ở BRAND-SPR-001/ADM-SPR-201. WCS này được viết lại theo đúng Update Rules của `docs/admin/workspaces/README.md`: Status chuyển **Draft (skeleton) → Approved**, Scope/IA điền đầy đủ theo Product Package thật thay vì TBD. Khác Website/Brand Studio (đã có Foundation từ trước, sprint sau chỉ mở rộng), Media Center **chưa có route/CRUD nào** trước sprint này — đây là Sprint kỹ thuật đầu tiên thật sự, không phải "audit lại việc đã làm".
>
> ℹ️ **Cập nhật MEDIA-SPR-202 (Portal-aligned Management):** Đối chiếu lại trực tiếp Portal — xác nhận cấu trúc 10 route hiện tại **sạch, không route/menu/module Legacy nào cần loại bỏ**. Đính chính 2 chỗ sai trong dữ liệu mock MEDIA-SPR-201 (`usedByNote` của `founder-portrait.jpg` và `garden-tree-scene.jpg` — route/component thật khác claim cũ, xem báo cáo đầy đủ). Đánh dấu `garden-care-visual.jpg` là `UNUSED MEDIA` (không tự xoá). Phát hiện mới: chưa có Visibility riêng theo từng Media Object (chỉ có Visibility toàn cục 1 record) — NEEDS PMO DECISION. Không đổi Scope/IA, không version bump. Xem `docs/admin/MEDIA_CENTER_PORTAL_ALIGNED_REVIEW.md`.

## 1. Executive Summary

Media Center là **Single Source of Digital Assets** của VO DUONG AI — nơi Founder quản lý metadata của mọi Image/Video/Document/Audio dùng trong Portal và các Workspace khác, cộng với cấu trúc tổ chức (Folder/Collection/Tag) và cấu hình chung (Media Settings). MEDIA-SPR-201 (Foundation) audit trực tiếp `public/` và `src/assets/` trong codebase, phát hiện một số bất nhất/khoảng trống thật đang tồn tại (xem Mục 6) — giá trị lớn nhất giai đoạn đầu là **làm lộ rõ** những khoảng trống đó (không có Video/Audio nào, 2 ảnh founder trùng mục đích, 1 asset mồ côi) để Founder quyết định, trước khi xây bất kỳ cơ chế Upload/CDN nào.

## 2. Mission

Đảm bảo mọi Digital Asset dùng trong Portal có một nơi tra cứu metadata duy nhất (tên, loại, đường dẫn, kích thước, nơi sử dụng, chủ sở hữu Workspace) — Founder không cần lục code để biết ảnh nào dùng ở đâu, ảnh nào còn mồ côi, hay module nào (Video/Audio) hoàn toàn chưa có nội dung. Ở giai đoạn Foundation, Mission thực hiện một phần: Registry đã có (Founder xem/quản lý được), nhưng chưa có Upload thật — asset mới vẫn phải được thêm vào code trước, sau đó đăng ký metadata vào đây.

## 3. Scope

Đúng 10 mục theo Product Package (brief MEDIA-SPR-201, khóa — không tự đổi tên/thêm/bớt):

1. **Dashboard** — Tổng số Digital Assets/Storage Usage/Recently Uploaded/Recently Used/Asset Distribution, đọc dữ liệu thật từ Registry (không phải Mock Data số 0).
2. **Media Library** — Toàn bộ asset, Browse/Search/Filter theo tên/tag/trạng thái.
3. **Images** — Banner/Thumbnail/Hero/Logo Files/Gallery (Media Asset Registry, category Image).
4. **Videos** — Intro/Course/Marketing/Tutorial (category Video) — **100% khoảng trống thật**, xem Mục 6.
5. **Documents** — PDF/DOCX/XLSX/PPTX (category Document) — PDF là URL động (Premium Workspace), không phải file quản lý qua đây; DOCX/XLSX/PPTX chưa có ví dụ nào.
6. **Audio** (category Audio) — **100% khoảng trống thật**, brief không cho danh sách sub-type cụ thể.
7. **Folder Management** — cấu trúc thư mục phân loại asset (tối đa 1 cấp cha).
8. **Collections** — nhóm tuyển chọn linh hoạt, không phân cấp như Folder.
9. **Tags** — danh sách tag phẳng dùng chung toàn hệ thống.
10. **Media Settings** — Upload Rules/Default Folder/Visibility/Storage Policy, 1 record duy nhất.

**Quyết định "Category" (Task 6 của brief liệt kê "Category" cùng Folder/Collection):** không dựng một CRUD Registry thứ 3 riêng cho "Category" — top-level classification (Image/Video/Document/Audio) đã là `MediaAsset.category`, một union type cố định (`MEDIA_CATEGORIES`), cùng nguyên tắc đã áp dụng cho `ASSET_CATEGORIES` (Brand Studio) và `NAVIGATION_LOCATIONS` (Website) — phân loại cấu trúc dùng schema-level union, không phải CRUD Registry riêng.

## 4. Out of Scope

- **Upload/Media File Manager thật** — không triển khai ở MEDIA-SPR-201 theo brief ("Không triển khai: Image Editor, Video Editor, AI Image, AI Video, CDN Migration, Storage Migration"). Registry chỉ quản lý metadata của asset TĨNH đã tồn tại trong code.
- **Nhận diện thương hiệu** (Logo/Wordmark/Typography/Color/Theme/Icons/Open Graph token) — thuộc Brand Studio (`brand-studio.md`). Ranh giới: Media Center quản lý ảnh/video/tài liệu **nội dung** (founder portrait, ảnh Companion, ảnh Garden...); Brand Studio quản lý token/asset **nhận diện thương hiệu** (logo, favicon, màu, font). `founder.png` là ví dụ biên giới — đã thống nhất thuộc Media Center (xem Mục 8).
- **Nội dung Website** (Hero copy, Trust Stats text...) — thuộc Website Workspace, chỉ tham chiếu asset qua `MediaAsset`, không sở hữu.

## 5. Information Architecture

10 mục ở Mục 3, mỗi mục là một route thật dưới `/admin/media-center/*`:

| Mục | Route |
|---|---|
| Dashboard | `/admin/media-center` |
| Media Library | `/admin/media-center/library` |
| Images | `/admin/media-center/images` |
| Videos | `/admin/media-center/videos` |
| Documents | `/admin/media-center/documents` |
| Audio | `/admin/media-center/audio` |
| Folder Management | `/admin/media-center/folders` |
| Collections | `/admin/media-center/collections` |
| Tags | `/admin/media-center/tags` |
| Media Settings | `/admin/media-center/settings` |

Điều hướng nội bộ: tab ngang qua đúng 10 mục (`MediaWorkspaceShell`), cùng pattern `BrandWorkspaceShell`/`WebsiteWorkspaceShell`. Nguồn IA duy nhất trong code: `src/lib/admin/media/navigation.ts`. Nhóm nav Admin: `"Media Center"` trong `src/lib/admin/nav.ts` (trước MEDIA-SPR-201 chỉ là 1 mục `comingSoon: true` duy nhất — nay thay bằng 10 mục thật).

## 6. Portal Coverage

MEDIA-SPR-201 audit trực tiếp `public/` và `src/assets/`, đối chiếu tham chiếu thật trong code (grep toàn repo), phát hiện:

| Phát hiện | Chi tiết |
|---|---|
| **2 ảnh founder khác nhau cho cùng chủ đề** | `/founder.png` (dùng ở `FounderStory.tsx`, trang chủ) vs `/images/founder-portrait.jpg` (dùng ở `src/data/portal/founder.ts`, trang Portal Story) — chưa rõ có chủ đích hay trùng lặp |
| **1 asset mồ côi** | `public/images/garden/garden-care-visual.jpg` tồn tại nhưng KHÔNG có nơi nào tham chiếu trong code |
| **Không có Video nào tồn tại** | Không `<video>` tag, không file `.mp4/.webm` nào trong `public/` — toàn bộ module Videos là khoảng trống |
| **Không có Audio nào tồn tại** | Không `<audio>` tag, không file audio nào — toàn bộ module Audio là khoảng trống |
| **PDF khoá học là URL động, không phải file** | `products.pdf_url`/`lessons.pdf_url` (Premium Workspace, Supabase) — Founder nhập URL ngoài, không upload qua Media Center |
| **`founder.png` trước đó là gap trong Brand Asset Registry** | BRAND-SPR-201 (`asset_seed_brand_image_gap`) ghi nhận "founder.png tồn tại nhưng chưa được đăng ký" — nay đã đăng ký thật ở Media Center, đúng ranh giới Mục 8 |

## 7. Content Ownership

| Entity | Editable Workspace | Consumer Workspace/Portal | Publish Target | Visibility Rule |
|---|---|---|---|---|
| Media Asset (Image/Video/Document/Audio) | Media Center | Chưa có (xem dưới) | Toàn site (dự kiến) | Theo `status` từng Asset |
| Folder/Collection/Tag | Media Center | Chưa có | Metadata tổ chức nội bộ | N/A |
| Media Settings | Media Center | Chưa có | Cấu hình chung (dự kiến) | Theo `status` |

**Consumer hiện tại là 0** — đúng pattern đã ghi nhận ở mọi Registry Foundation của Website/Brand Studio: Registry hoạt động thật (CRUD đầy đủ), nhưng Portal/site công khai **chưa đọc dữ liệu từ đây** — asset vẫn là file tĩnh trong `public/`/`src/assets/`, tham chiếu trực tiếp trong component. Media Center hiện là **bảng tra cứu metadata song song**, không phải nguồn dữ liệu Portal đọc trực tiếp. Nối Registry vào Portal thật (VD component đọc `MediaAsset.fileNote` thay vì hardcode path) là việc của một Sprint kỹ thuật tương lai.

## 8. Dependency

- **Owns:** Media Asset metadata (Image/Video/Document/Audio), Folder, Collection, Tag, Media Settings.
- **Consumes:** `docs/admin/PORTAL_COVERAGE_AUDIT.md`, Founder Directive Greenfield Admin, `public/`/`src/assets/` (nguồn asset thật).
- **Provides (dự kiến, chưa triển khai):** Asset URL chuẩn hoá cho mọi Workspace khác (Website Shared Sections, Brand Studio Brand Image/Video/Identity File, Premium course materials).
- **Dependency Matrix:**

| Media Center | Workspace/mục khác | Loại chồng lấn | Trạng thái |
|---|---|---|---|
| Category "Image" (ảnh founder) | Brand Studio Brand Image (BRAND-SPR-201) | Ranh giới đã xác nhận — Media Center sở hữu ảnh nội dung, Brand Studio sở hữu asset nhận diện thương hiệu | Đã xác nhận MEDIA-SPR-201, kế thừa ranh giới BRAND-SPR-201 Mục 13 |
| Category "Document" (PDF khoá học) | Premium Workspace (`products.pdf_url`) | Kiến trúc khác nhau — PDF là URL động nhập tay, không qua Media Center | Ghi nhận, chưa PMO quyết định có nên hợp nhất |
| Toàn bộ Workspace | Brand Studio Open Graph Image | Brand Studio quản lý ảnh OG cấp thương hiệu (token), Media Center quản lý ảnh nội dung — ranh giới rõ, không trùng | Đã xác nhận từ BRAND-SPR-001 |

## 9. Workflow

**Asset Lifecycle (Product Workflow, không phải Technical Workflow):**

```
Draft → Active → Inactive → Archived
```

Dùng lại đúng 4 trạng thái của Navigation Registry (Website Workspace) — một Asset được thêm vào Registry (Draft), xác nhận đang dùng thật trong code (Active), tạm ngưng dùng (Inactive), hoặc lưu trữ khi không còn liên quan (Archived). Asset "(Chưa có)" (khoảng trống thật, VD Video/Audio) giữ Draft cho tới khi có nội dung thật.

## 10. Dashboard Vision

Founder mở Media Center Dashboard và thấy ngay: Tổng số Digital Assets, Asset Distribution theo 4 category, Recently Uploaded/Recently Used (đọc từ `createdDate`/`usedByNote` thật), và — quan trọng nhất ở giai đoạn này — danh sách các **bất nhất/khoảng trống cần xác nhận** (2 ảnh founder, asset mồ côi, Video/Audio trống, PDF kiến trúc khác biệt). Storage Usage hiện hiển thị "Chưa đo" — Foundation chưa có cơ chế đo dung lượng file thật.

## 11. Automation Vision

Định hướng tương lai (chưa implement):
- Tự động phát hiện asset trong `public/`/`src/assets/` chưa được đăng ký vào Media Asset Registry (script đối chiếu file hệ thống vs Registry).
- Tự động phát hiện asset mồ côi (không còn tham chiếu trong code) để đề xuất dọn dẹp.
- Đồng bộ 2 chiều: Registry → component thật (thay vì Registry chỉ là bản ghi chú song song).

## 12. Future Expansion

| Hướng mở rộng | Đánh giá |
|---|---|
| Mobile | Cần Media Asset API trước khi app di động dùng chung asset. |
| CRM | Không áp dụng trực tiếp. |
| Marketplace | Không áp dụng trực tiếp. |
| API | Ứng viên tự nhiên — "Media Asset API" nội bộ cho các Workspace khác đọc metadata/URL asset. |
| Enterprise | Không áp dụng cho phạm vi hiện tại. |
| Multi-language | Không áp dụng — metadata asset không phụ thuộc ngôn ngữ (asset ảnh/video dùng chung mọi ngôn ngữ). |
| Multi-site | Cần cơ chế multi-tenant asset nếu VDAI mở site con — chưa có. |
| White Label | Điểm chạm tự nhiên trong tương lai xa (thư viện asset theo tenant) — ngoài phạm vi hiện tại. |

## 13. Product Decisions

- Media Asset dùng **một schema chung** cho cả 4 category (Image/Video/Document/Audio), phân biệt bằng `category` — cùng nguyên tắc Shared Structure đã dùng cho Brand Asset Registry/Website Page Registry.
- Status dùng lại **đúng** model 4 trạng thái của Navigation Registry (Website Workspace) — không định nghĩa Status riêng.
- `subType` (Banner/Thumbnail/Hero.../Intro Video.../PDF...) là field TEXT tự do có gợi ý theo category (`MEDIA_SUBTYPE_OPTIONS`), không ép kiểu union cứng như `role` (Brand Studio) — vì brief không yêu cầu filter/badge theo sub-type như đã yêu cầu cho Color/Typography Role.
- "Category" (Task 6) không có CRUD Registry riêng — dùng schema-level union `MEDIA_CATEGORIES` đã có sẵn, tránh trùng lặp khái niệm.
- Khi brief yêu cầu quản lý thứ không tồn tại trong code (Video, Audio, DOCX/XLSX/PPTX), seed entry "(Chưa có)" có `usedByNote` trung thực ghi rõ khoảng trống — không bịa dữ liệu để lấp đầy Scope, theo đúng quy ước đã dùng xuyên suốt Website/Brand Studio.
- Ranh giới với Brand Studio (asset nhận diện thương hiệu vs asset nội dung): asset mang tính NHẬN DIỆN (logo, favicon, brand color/font) → Brand Studio; asset mang tính NỘI DUNG (ảnh founder, ảnh Companion, ảnh minh hoạ tính năng, tài liệu khoá học) → Media Center. `founder.png` áp dụng ranh giới này, đăng ký ở Media Center.

## 14. Founder Decisions

- **Media Center Product Package v1.0 — Approved.** Xác nhận qua brief IMP-MEDIA-201: *"Workspace Canonical Specification (WCS) và Product Package của Media Center đã được Founder và PMO phê duyệt."*
- **Greenfield Admin Architecture** áp dụng cho toàn bộ Media Center — không kế thừa Legacy Admin, không giữ compatibility với dữ liệu test.

## 15. PMO Decisions

- **Media Center là Workspace độc lập, tách khỏi Brand Studio — đã xác nhận từ BRAND-SPR-001, giữ nguyên.**
- Ranh giới asset nhận diện thương hiệu (Brand Studio) vs asset nội dung (Media Center) — **đã xác nhận đủ để triển khai** (Mục 13), nhưng vẫn là suy luận hợp lý từ tên Workspace, chưa có PMO Clarification xác nhận bằng văn bản riêng biệt.
- Câu hỏi còn treo: PDF khoá học (Premium Workspace) có nên chuyển sang quản lý qua Media Center thay vì URL nhập tay? — chưa PMO quyết định.
- Thứ tự ưu tiên khi phát hiện khác biệt: **Founder Decision → PMO Clarification → Portal hiện tại → tài liệu cũ** (không đổi, áp dụng chung mọi Workspace).

---

## Status

**Approved** — Product Package v1.0 xác nhận qua brief IMP-MEDIA-201 (Founder Directive). WCS này thay thế bản skeleton Draft trước (IMP-GOV-001/BRAND-SPR-001), phản ánh Scope/IA thật đã triển khai ở MEDIA-SPR-201.

## Version

1.0 — MEDIA-SPR-201, viết lại hoàn toàn từ skeleton (TBD) sang Approved, kèm Scope/IA/Dependency/Product Decisions đầy đủ.

## Approval Date

2026-07-12 (MEDIA-SPR-201, qua Founder Directive trong brief IMP-MEDIA-201).

## Last Updated

2026-07-12 (MEDIA-SPR-201 — viết lại từ skeleton Draft, xác nhận Status/Scope/IA/Dependency theo Product Package thật, kèm Registry hoạt động thật trong cùng sprint).
