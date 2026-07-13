# MEDIA CENTER FOUNDATION — IMP-MEDIA-201 (MEDIA-SPR-201, EPIC-02 Phase 2)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Workspace thứ ba được phép triển khai kỹ thuật, sau khi Founder/PMO xác nhận Media Center Product Package đã được phê duyệt (brief IMP-MEDIA-201, Founder Directive: *"Không kế thừa Legacy Admin. Không sử dụng dữ liệu test cũ."*). Khác Website/Brand Studio (đã có Foundation từ các sprint trước, các brief EPIC-02 Phase 2 sau đó chỉ mở rộng), Media Center **chưa có route/CRUD nào** trước sprint này — đây là Sprint kỹ thuật đầu tiên thật sự cho Workspace này, đi thẳng từ skeleton Draft (1 trang ComingSoon) sang Foundation đầy đủ kèm Registry hoạt động thật, cùng cách BRAND-SPR-001 làm cho Brand Studio.

**Canonical Information Architecture** (10 mục theo Scope của brief, khóa):
Dashboard → Media Library → Images → Videos → Documents → Audio → Folder Management → Collections → Tags → Media Settings.

---

## Bối cảnh trước sprint

Audit xác nhận: `docs/admin/workspaces/media-center.md` là skeleton Draft (mọi mục TBD), `src/lib/admin/nav.ts` chỉ có 1 dòng `{ label: "Media Center", href: "/admin/media-center", comingSoon: true }`, và route `/admin/media-center/page.tsx` chỉ render `WorkspaceSectionFoundation` (ComingSoon placeholder). Không có schema, không có Registry, không có route con nào. MEDIA-SPR-201 xây toàn bộ 10 module từ đầu.

## 1. Media Asset Registry (Task 2-5, 8) — lõi của Workspace

`src/lib/admin/media/assetRegistry.ts` — schema `MediaAsset` dùng chung cho cả 4 category (`MEDIA_CATEGORIES = ["Image", "Video", "Document", "Audio"]`), cùng nguyên tắc Shared Structure đã dùng cho Brand Asset Registry. Field `subType` (Task 3-5: Banner/Thumbnail/Hero/Logo Files/Gallery cho Image; Intro/Course/Marketing/Tutorial cho Video; PDF/DOCX/XLSX/PPTX cho Document) là text tự do có gợi ý (`MEDIA_SUBTYPE_OPTIONS`) theo category đã chọn qua `<datalist>`. Field Metadata (Task 8: File Name/Type/Size/Dimensions/Created/Updated/Used By/Workspace Owner) đều có trên `MediaAsset`. `folderId`/`collectionId` tham chiếu Folder/Collection Registry; `tags` (mảng) tham chiếu tên trong Tag Registry (không ràng buộc cứng).

`src/components/admin/media/MediaAssetRegistry.tsx` — bảng + modal CRUD đầy đủ (thêm/sửa/xoá, search theo tên/tag, filter theo status), dùng chung cho `/library` (không lọc) và `/images`, `/videos`, `/documents`, `/audio` (qua prop `lockedCategory`).

**Seed 16 asset thật**, bám sát audit codebase (`public/`, `src/assets/`, grep tham chiếu thật — không bịa "Used By"):
- **6 Image thật:** Founder Portrait (trang chủ, `/founder.png`), Founder Portrait (Portal Story, `/images/founder-portrait.jpg`), Companion Avatar Set (6 kích thước), Garden Tree Scene (dùng ở 3 nơi), Garden Care Visual (mồ côi), Vendor Tool Logos (11 file `.ico`/`.svg`).
- **4 Video gap:** Intro/Course/Marketing/Tutorial — Portal hoàn toàn không có video nào.
- **4 Document:** 1 entry PDF ghi nhận kiến trúc URL động (`products.pdf_url`) + 3 gap (DOCX/XLSX/PPTX).
- **1 Audio gap:** Portal hoàn toàn không có nội dung âm thanh.

**Phát hiện đáng chú ý:**
1. **2 ảnh founder khác nhau cho cùng chủ đề** — `/founder.png` (FounderStory.tsx, trang chủ) vs `/images/founder-portrait.jpg` (`src/data/portal/founder.ts`, Portal Story) — chưa rõ chủ đích.
2. **`garden-care-visual.jpg` là asset mồ côi** — tồn tại trong `public/images/garden/` nhưng grep toàn repo không tìm thấy nơi nào tham chiếu.
3. **`founder.png` trước đó là gap trong Brand Asset Registry** (BRAND-SPR-201: `asset_seed_brand_image_gap`, "founder.png tồn tại nhưng chưa được đăng ký") — nay đăng ký thật ở Media Center, đúng ranh giới đã ghi trong `brand-studio.md` (asset nhận diện thương hiệu → Brand Studio; asset nội dung → Media Center).
4. **Không có Video/Audio nào tồn tại** trong Portal — cả 2 module 100% khoảng trống, không `<video>`/`<audio>` tag, không file media động nào trong `public/`.
5. **PDF khoá học là URL động** (`products.pdf_url`/`lessons.pdf_url`, Premium Workspace, Supabase) — kiến trúc khác biệt hoàn toàn với mọi asset khác trong Registry: Founder nhập URL ngoài trực tiếp khi tạo sản phẩm, không đi qua Media Center.

## 2. Folder Management (Task 6)

`src/lib/admin/media/folderRegistry.ts` + `MediaFolderRegistry.tsx` — Folder phẳng với `parentFolderId` tuỳ chọn (tối đa 1 cấp cha). Seed 5 Folder thật bám theo nhóm asset đã audit: Founder & Brand, Companion, Living Garden, Tools & Vendor Logos, Course Materials.

## 3. Collections (Task 6)

`src/lib/admin/media/collectionRegistry.ts` + `MediaCollectionRegistry.tsx` — nhóm tuyển chọn phẳng (khác Folder, không phân cấp). Seed 2 Collection thật: Homepage Hero Assets, Companion Avatar Set.

## 4. Tags (Task 7)

`src/lib/admin/media/tagRegistry.ts` + `MediaTagRegistry.tsx` — danh sách tag phẳng dùng chung toàn hệ thống. Seed 6 tag khớp với asset seed thật (founder, companion, homepage, garden, vendor-logo, unused — tag "unused" đánh dấu chính asset mồ côi phát hiện ở Mục 1).

## 5. Media Settings (Task 9)

`src/lib/admin/media/settings.ts` + `MediaSettingsForm.tsx` — **1 record duy nhất** (singleton, id cố định `media_settings_singleton`), dùng lại đúng `useCollection()`. Không dùng `useEffect` để đồng bộ state — `form = localEdits ?? record` tính trực tiếp trong lúc render, tránh lỗi `react-hooks/set-state-in-effect` đã gặp ở Brand Studio (BRAND-SPR-001) ngay từ đầu (cùng cách WEB-SPR-201 đã làm đúng). Fields: Upload Rules, Default Folder (dropdown từ Folder Registry), Visibility (`MEDIA_VISIBILITY_MODES`), Storage Policy — cả 2 note đều ghi nhận trung thực "chưa có quy tắc/chính sách chính thức" vì Foundation chưa có upload/storage provider thật.

## 6. Media Dashboard (Task 1)

`src/app/admin/(dashboard)/media-center/page.tsx` — đọc dữ liệu THẬT từ Media Asset/Folder/Collection/Tag Registry (không phải Mock Data số 0 như WEB-SPR-001 làm ban đầu — Media Center có Registry thật ngay từ Foundation, cùng cách BRAND-SPR-001 làm cho Brand Studio). Hiển thị: Tổng số Digital Assets, Active count, số lượng khoảng trống "(Chưa có)", Storage Usage ("Chưa đo" — trung thực, chưa có cơ chế đo dung lượng), Asset Distribution theo 4 category, Recently Uploaded (sort theo `createdDate`), Recently Used (asset có `usedByNote` thật), cảnh báo Founder về 4 phát hiện chính (Mục 1), Quick Actions tới 9 module còn lại.

## Shared Structure (nguyên tắc xuyên suốt sprint)

- Status dùng chung `NAVIGATION_STATUSES` (Draft/Active/Inactive/Archived) cho mọi Registry mới — không định nghĩa Status riêng.
- Cùng pattern CRUD (Modal/ConfirmDialog/`useCollection`/`genId`/`useAdminToast`) như mọi Registry của Website/Brand Studio.
- "Category" (Task 6) không dựng CRUD Registry thứ 3 riêng — dùng schema-level union `MEDIA_CATEGORIES` đã có, tránh trùng khái niệm với `category` field.
- Mọi khoảng trống thật (Video/Audio/DOCX/XLSX/PPTX) seed entry "(Chưa có)" với `usedByNote` trung thực — không bịa dữ liệu, đúng quy ước đã dùng xuyên suốt Website/Brand Studio.

## Cập nhật Governance

- `docs/admin/workspaces/media-center.md` — viết lại hoàn toàn từ skeleton Draft (mọi mục TBD) sang **Approved** (MEDIA-SPR-201), Scope/IA/Dependency/Product Decisions đầy đủ, Version 1.0 (mới, không phải bump vì bản trước là skeleton chưa có nội dung thật để tính version).
- `src/lib/admin/brand/assetRegistry.ts` — cập nhật 2 đoạn comment lỗi thời ("Media Center chưa tồn tại"/"chưa xây") để phản ánh đúng hiện trạng mới, không đổi logic/schema.

## nav.ts / Route Changes

- `src/lib/admin/nav.ts` — thay 1 mục `comingSoon: true` duy nhất bằng nhóm thật `"Media Center"` (10 item, `/admin/media-center/*`).
- `src/components/admin/AdminSidebar.tsx` — thêm icon cho 9 href mới (`navIcons`): Video, Music, Folder, Tag (import mới) + Layers/ImageIcon/FileText/Library/Settings (tái dùng).
- `src/lib/admin/workspaceOwnership.ts` — cập nhật entry `media-center`: `maturity: "Not Started" → "Canonical"`, `wcsStatus: "Draft" → "Approved"`, `owns` cập nhật đúng phạm vi thật.

## Files Changed

**Lib (mới):**
- `src/lib/admin/media/navigation.ts`, `assetRegistry.ts`, `folderRegistry.ts`, `collectionRegistry.ts`, `tagRegistry.ts`, `settings.ts`

**Components (mới):**
- `src/components/admin/media/MediaWorkspaceShell.tsx`, `MediaAssetRegistry.tsx`, `MediaFolderRegistry.tsx`, `MediaCollectionRegistry.tsx`, `MediaTagRegistry.tsx`, `MediaSettingsForm.tsx`

**Routes:**
- `src/app/admin/(dashboard)/media-center/page.tsx` (viết lại từ ComingSoon placeholder sang Dashboard thật)
- `src/app/admin/(dashboard)/media-center/{library,images,videos,documents,audio,folders,collections,tags,settings}/page.tsx` (mới, 9 route)

**Sửa:**
- `src/lib/admin/nav.ts`, `src/components/admin/AdminSidebar.tsx`, `src/lib/admin/workspaceOwnership.ts`, `src/lib/admin/brand/assetRegistry.ts` (chỉ comment)

**Docs:**
- `docs/admin/workspaces/media-center.md` (Draft skeleton → Approved), `docs/admin/MEDIA_CENTER_FOUNDATION.md` (mới, file này)

**Không đổi:** Website Workspace, Brand Studio (ngoài 2 đoạn comment), CKOS, mọi Workspace khác, `Badge.tsx`, `Modal.tsx`, `src/app/globals.css`.

## Verification

- **Lint (`npm run lint`):** phát hiện 2 lỗi thật khi build lần đầu — 1 dấu ngoặc kép chưa escape trong JSX (`collections/page.tsx`, sửa bằng `&quot;`) và 1 biến `collectionName` khai báo nhưng chưa dùng (`MediaAssetRegistry.tsx`, sửa bằng cách thêm cột Collection vào bảng — cải thiện UX thay vì xoá hàm). Sau sửa: sạch — 0 lỗi, 5 warning `<img>` có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công — đủ 10 route `/admin/media-center/*` build ở dạng `ƒ` (dynamic, sau Admin auth middleware).
- **Test (`npm run test`):** 139/139 pass, không regression.

## Acceptance (theo brief IMP-MEDIA-201)

| # | Tiêu chí | Trạng thái |
|---|---|---|
| 1 | Media Center hoạt động | ✅ |
| 2 | Dashboard hoàn chỉnh | ✅ — dữ liệu thật, không Mock Data |
| 3 | Media Library hoạt động | ✅ |
| 4 | Quản lý Images | ✅ |
| 5 | Quản lý Videos | ✅ — 100% khoảng trống thật, ghi nhận minh bạch |
| 6 | Quản lý Documents | ✅ — PDF khác kiến trúc (URL động), ghi nhận minh bạch |
| 7 | Quản lý Folder | ✅ |
| 8 | Quản lý Collections | ✅ |
| 9 | Quản lý Tags | ✅ |
| 10 | Quản lý Metadata | ✅ — File Name/Type/Size/Dimensions/Created/Updated/Used By/Workspace Owner đều có field |
| 11 | Build thành công | ✅ |
| 12 | Tests pass | ✅ |

## Cần PMO/Founder quyết định (tổng hợp)

1. **2 ảnh founder khác nhau** (`/founder.png` vs `/images/founder-portrait.jpg`) — hợp nhất thành 1 hay giữ 2 (bối cảnh khác nhau)?
2. **`garden-care-visual.jpg` mồ côi** — xoá hay đang chuẩn bị dùng cho tính năng chưa triển khai?
3. **Video/Audio hoàn toàn trống** — có nằm trong roadmap nội dung gần không, để ưu tiên đầu tư?
4. **PDF khoá học (URL động ở Premium)** — có nên chuyển sang quản lý qua Media Center, hay giữ nguyên kiến trúc hiện tại?
5. **Ranh giới Media Center vs Brand Studio** cho asset biên giới (như `founder.png`) — cần PMO Clarification xác nhận chính thức bằng văn bản, hiện là suy luận hợp lý chưa được duyệt riêng.

## EPIC-02 Phase 2 Readiness

Cùng với WEB-SPR-201/BRAND-SPR-201, Media Center nay có Foundation đầy đủ — 10/10 module Registry hoạt động thật ngay từ sprint đầu tiên (không cần nhiều sprint tích luỹ như Website Workspace ban đầu). Mọi khoảng trống thật (Video, Audio, DOCX/XLSX/PPTX, asset mồ côi) được ghi nhận minh bạch thay vì che giấu. **Consumer vẫn = 0** — Portal/site công khai chưa đọc từ Registry, giữ nguyên đặc điểm giai đoạn Foundation của mọi Workspace tính đến nay. Việc nối Media Center vào Portal thật (component đọc `MediaAsset` thay vì hardcode path) là quyết định của Sprint kỹ thuật tương lai.
