# MEDIA-SPR-202 — Media Center: Portal-aligned Management

**Epic:** EPIC-02 · **Phase:** Phase 2 — Website & Brand · **Sprint:** MEDIA-SPR-202
**Brief:** IMP-MEDIA-202 · **Tiếp theo:** BRAND-SPR-202 (cùng mẫu Portal-aligned Management, áp dụng cho Brand Studio)

Tuân thủ **PMO Directive FOUNDER-001** (Portal Coverage First) và **Founder Directive Admin Simplicity**. Portal hiện tại là Reference Source duy nhất — mọi phát hiện dưới đây đối chiếu trực tiếp code hiện tại (`src/app/**`, `src/components/portal/**`, `public/**`, `src/assets/**`), không dùng tài liệu/trí nhớ cũ.

---

## Deliverable 1 — Media Center Review (Task 1: Portal Media Mapping)

Đối chiếu lại trực tiếp Portal (không chỉ dựa vào báo cáo MEDIA-SPR-201 cũ):

| Loại | Xác nhận Portal thật | Số lượng |
|---|---|---|
| Images | `public/founder.png`, `public/images/founder-portrait.jpg`, `public/images/garden/garden-tree-scene.jpg`, `public/images/garden/garden-care-visual.jpg`, `src/assets/companion/official/*.png` (6 file), `public/tools/*.{ico,svg}` (11 file vendor logo) | 20 file (khớp seed MEDIA-SPR-201, không có file mới nào từ đó tới nay) |
| Videos | Không `<video>` tag, không file `.mp4/.webm` nào trong repo | 0 (khoảng trống thật, xác nhận lại) |
| Documents | Không file tĩnh nào; PDF khoá học là `products.pdf_url`/`lessons.pdf_url` (URL động qua Supabase, Premium Workspace) | 0 file tĩnh, 1 cơ chế URL động |
| Audio | Không `<audio>` tag, không file audio nào | 0 (khoảng trống thật, xác nhận lại) |
| File Types | PNG/JPG/ICO/SVG — không có file loại khác | — |
| Folder Structure | Không có hệ thống thư mục media thật trên Portal (chỉ là cấu trúc `public/`/`src/assets/` phẳng) — Folder Registry trong Admin là cấu trúc tổ chức do Admin tự đặt ra để nhóm asset, không phản ánh cấu trúc thư mục thật nào trên Portal | Foundation, không phải file system thật |

**Kết luận Task 1: Portal Media Mapping của MEDIA-SPR-201 vẫn chính xác về mặt kiểm kê** (đúng 20 file, đúng 0 Video/Audio/Document tĩnh). Tuy nhiên đối chiếu lại kỹ hơn phát hiện **2 chỗ sai trong mô tả "Used By"** — đã sửa (xem bên dưới), đúng tinh thần Task 1 "Đối chiếu trực tiếp với Portal".

### Đính chính (MEDIA-SPR-202 — sửa trực tiếp trong `assetRegistry.ts`)

1. **`founder-portrait.jpg`** — claim cũ (MEDIA-SPR-201): *"dùng ở trang Portal Founder page /portal/story"*. **SAI** — `/portal/story` là trang "Câu chuyện của tôi" (nhật ký tăng trưởng cá nhân hoá của học viên), hoàn toàn không liên quan Founder, không import file này. Thật ra file này là `FOUNDER.photo` trong `src/data/portal/founder.ts`, đọc bởi `CommunityGuides.tsx` (route `/portal/congdongai`) và `FounderSpotlight.tsx` (route `/portal/premium`). Đã sửa `usedByNote`/`workspaceOwnerNote`.
2. **`garden-tree-scene.jpg`** — claim cũ: *"Dùng ở 3 nơi: GardenWidget.tsx, scene/TreeLayer.tsx, LivingGardenCard.tsx"*. **Đúng 1 phần** — cả 3 component đều có tham chiếu file này trong code, nhưng chỉ `scene/TreeLayer.tsx` thật sự được mount lên Portal (qua `GardenExperience.tsx` → route `/portal/khuvuoncuaban`). `GardenWidget.tsx` và `LivingGardenCard.tsx` **không được import ở bất kỳ đâu khác trong repo** — 2 component mồ côi (Consumer = 0 ở cấp component, cùng pattern `NotificationTicker.tsx` đã phát hiện ở `ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md`). Route thật duy nhất: `/portal/khuvuoncuaban`. Đã sửa `usedByNote`/`workspaceOwnerNote`.

Đây là phát hiện **ngoài phạm vi Media Center** (component Portal, không phải Admin CMS) — chỉ ghi nhận để dữ liệu Registry chính xác, **không tự sửa/xoá 2 component mồ côi đó** (thuộc phạm vi Portal cleanup, không phải Sprint này).

---

## Deliverable 2 — Danh sách Legacy đã loại bỏ hoặc đề xuất loại bỏ (Task 2: Media Workspace Structure)

Rà soát menu/route/module/placeholder/component của Media Center:

- **Route ↔ `nav.ts` ↔ `MEDIA_WORKSPACE_SECTIONS` ↔ `AdminSidebar.tsx` icon map:** đối chiếu cả 4 nơi — **10/10 khớp hoàn toàn**, không route dư, không menu dư, không icon map dư/thiếu.
- **Component:** `MediaWorkspaceShell.tsx` là shell riêng của Media Center (không dùng chung `WorkspaceSectionFoundation.tsx`) — không lệch vị trí.
- **Placeholder rỗng (ComingSoon):** không có — cả 10 route đều có Registry/nội dung thật (xác nhận `grep "ComingSoon"` trên cả 10 file trả về 0 kết quả).
- **Legacy Admin:** Media Center xây Greenfield hoàn toàn từ MEDIA-SPR-201 (trước đó chỉ có 1 `ComingSoon` placeholder duy nhất, đã thay thế toàn bộ) — không có code Legacy nào để loại bỏ.

**Kết luận Task 2: không có gì cần loại bỏ bên trong Media Center — đúng "Không tự xóa nếu chưa đủ bằng chứng".** Cùng kết luận với BRAND-SPR-202 (Brand Studio) — khác Website Workspace (có 1 route dư rõ ràng `/admin/seo`, đã xoá ở WEB-SPR-201R).

**Không có thay đổi cấu trúc code nào trong sprint này** — chỉ sửa 3 đoạn text (`usedByNote`/`workspaceOwnerNote`) trong dữ liệu mock đã có sẵn (Deliverable 1), không đụng route/component/schema.

---

## Deliverable 5 — Danh sách Digital Assets Founder quản lý được (Task 3: Media Management Chain)

| Bước | Quản lý được không cần sửa code? | Ghi chú |
|---|---|---|
| Media (Image/Video/Document/Audio) | ✅ Add/Edit/Delete qua Media Asset Registry, lọc theo category | |
| → Folder | ✅ Folder Registry (Add/Edit/Delete, không giới hạn số lượng) | |
| → Collection | ✅ Collection Registry (Add/Edit/Delete) | |
| → Tag | ✅ Tag Registry (Add/Edit/Delete) — asset gán tag qua ô nhập tự do (không ràng buộc cứng với Tag Registry) | |
| → Metadata | ✅ Name/Sub Type/File Note/Format/Size/Dimensions — sửa trực tiếp trong Edit modal của từng asset | |
| → Visibility | ⚠️ **Chỉ có Visibility CẤP TOÀN CỤC** (`MediaSettings.visibility`, 1 record duy nhất: Public/Private/Workspace Only) — **KHÔNG có Visibility riêng cho từng Media Object**. `MediaAsset` không có field `visibility` — chỉ có `status` (Draft/Active/Inactive/Archived, lifecycle chứ không phải hiển thị/ẩn). Đây là khoảng trống thật so với yêu cầu chuỗi quản lý của Task 3. |
| → Usage | ✅ `usedByNote`/`workspaceOwnerNote` hiển thị ngay trong bảng danh sách (không cần mở Edit) — nhưng là TEXT tự do, không phải dữ liệu có cấu trúc/liên kết thật tới route Portal |

**Kết luận Task 3:** 6/7 bước quản lý được hoàn toàn không cần sửa code. Bước **Visibility riêng theo từng Media Object CHƯA tồn tại** — chỉ có 1 cấu hình Visibility toàn cục áp dụng chung cho mọi asset, không thể đặt asset A là Public và asset B là Private. Đây là khoảng trống thật, không tự sửa (ngoài phạm vi Task 4, chỉ Task 3 yêu cầu xác nhận — Task 4 mới là nơi xử lý báo cáo Flexibility, không yêu cầu sửa kiến trúc ở Task 3).

---

## Deliverable 5 (tiếp) — Founder Directive bổ sung: Flexibility Verification (Task 4)

Founder yêu cầu xác minh nghiêm ngặt: **thêm hình ảnh, thêm video, thêm tài liệu, thêm folder, thêm collection, thêm tag** phải thực hiện được **chỉ bằng dữ liệu/cấu hình**, không phát hiện trường hợp nào phải sửa TypeScript/Route/Component. Đã đọc trực tiếp source từng luồng "Thêm":

| Hành động | Component xử lý "Thêm" | Xác minh trực tiếp | Cần sửa code? |
|---|---|---|---|
| Thêm hình ảnh | `MediaAssetRegistry` (route `/admin/media-center/images`, `lockedCategory="Image"`) | Nút "+ Thêm Asset" → modal → `category` khoá "Image" (có sẵn trong `MEDIA_CATEGORIES`) → `add()` ghi vào collection `media-assets` | ❌ **Không** |
| Thêm video | `MediaAssetRegistry` (`lockedCategory="Video"`) | Cùng luồng, `category` khoá "Video" | ❌ **Không** |
| Thêm tài liệu | `MediaAssetRegistry` (`lockedCategory="Document"`) | Cùng luồng, `category` khoá "Document" | ❌ **Không** |
| Thêm folder | `MediaFolderRegistry` (route `/admin/media-center/folders`) | Nút "+ Thêm Folder" → modal → không có union đóng nào (chỉ name/parent/description/status) → `add()` ghi vào collection `media-folders` | ❌ **Không** |
| Thêm collection | `MediaCollectionRegistry` (route `/admin/media-center/collections`) | Nút "+ Thêm Collection" → modal tự do (name/description/status) → `add()` ghi vào collection `media-collections` | ❌ **Không** |
| Thêm tag | `MediaTagRegistry` (route `/admin/media-center/tags`) | Nút "+ Thêm Tag" → modal tự do (name/description/status) → `add()` ghi vào collection `media-tags` | ❌ **Không** |

**Kết luận:** Xác nhận qua đọc trực tiếp mã nguồn — cả 6 luồng "Thêm" đều thuần dữ liệu (`useCollection().add()`). **0 trường hợp phát hiện Founder phải sửa TypeScript, Route hoặc Component** để thực hiện đúng 6 hành động Founder Directive bổ sung liệt kê. Đáng chú ý: `MediaFolder`/`MediaCollection`/`MediaTag` **không có bất kỳ trường phân loại (category/role) đóng nào** — khác Brand Studio (nơi Color/Typography có Role union đóng) — nên Folder/Collection/Tag không có giới hạn "thêm 1 phân loại mới" nào cả, linh hoạt hơn Brand Studio ở điểm này.

### Giới hạn còn lại — nêu rõ để không che giấu (KHÔNG thuộc phạm vi 6 hành động trên)

- Thêm 1 **category** Media Asset mới (vượt ngoài 4 category: Image/Video/Document/Audio) → phải sửa `MEDIA_CATEGORIES` (TypeScript union đóng) trong `src/lib/admin/media/assetRegistry.ts`. Đây KHÔNG phải hành động Founder Directive yêu cầu (chỉ yêu cầu thêm ảnh/video/tài liệu — cả 3 category này đã có sẵn), nên **không tính là ngoại lệ vi phạm chỉ thị**, chỉ nêu rõ để đầy đủ thông tin — cùng pattern với `ASSET_CATEGORIES`/`COLOR_ROLES`/`TYPOGRAPHY_ROLES` đã ghi ở Brand Studio (BRAND-SPR-202).
- Visibility riêng theo từng Media Object (xem Deliverable 5 Task 3) — đây KHÔNG phải hành động "thêm" mà Founder Directive liệt kê, nhưng liên quan trực tiếp tới "mở rộng Media Center" nói chung nên nêu ở đây để không sót: hiện chưa có field, cần sửa `MediaAsset` type + `MediaAssetRegistry.tsx` để thêm — **không tự sửa ngoài phạm vi Sprint**.

---

## Deliverable 5 (tiếp) — Workspace Ownership Confirmation (Task 5)

Quét `workspaceOwnership.ts` (entry `media-center`, dòng 97-103): `owns: "Media Asset (Image/Video/Document/Audio) metadata, Folder, Collection, Tag, Media Settings"` — khớp đúng phạm vi Scope. Quét toàn bộ `src/lib/admin/media/**` và `src/components/admin/media/**` cho từ khóa "knowledge"/"learning"/"commercial"/"mentor" — 0 kết quả. Từ khóa "website"/"brand" chỉ xuất hiện dưới 2 dạng an toàn: (a) import `NAVIGATION_STATUSES` (tái sử dụng type có sẵn, không sở hữu dữ liệu Website), (b) `workspaceOwnerNote` — field văn bản mô tả **workspace nào khác đang dùng asset**, đúng chức năng tham chiếu chéo, không phải tuyên bố sở hữu.

**Lưu ý đặt tên (không phải chồng chéo sở hữu, chỉ là trùng thuật ngữ):** Brief gọi Media Center là *"Single Source of Digital Assets"*, nhưng nhóm nav.ts **"Projects & Opportunities"** (`/admin/digital-assets/*`, 11 route quản lý link dự án đầu tư/crypto/blockchain) cũng dùng chữ **"Digital Assets"** — 2 khái niệm hoàn toàn khác nhau (Media Center = file ảnh/video/tài liệu; Projects & Opportunities = link/dữ liệu dự án đầu tư) dùng chung 1 thuật ngữ. Không phải chồng chéo sở hữu thật (đã xác nhận qua ownership entry, 2 Workspace khác nhau, không có field/route trùng), chỉ là trùng tên gọi — nêu rõ để tránh nhầm lẫn khi đọc báo cáo tổng hợp Admin.

**Kết luận Task 5: Xác nhận sạch — Media Center chỉ sở hữu Digital Assets (Image/Video/Document/Audio metadata + Folder/Collection/Tag/Settings), không sở hữu Website Content/Brand Assets/Knowledge/Learning/Commercial/Mentor.**

---

## Deliverable 4 — Danh sách UNUSED MEDIA (Task 6: Portal Usage Validation)

| Media Object | Current Route | Used By | Workspace Owner | Publish Status | Last Updated |
|---|---|---|---|---|---|
| Founder Portrait (Trang chủ) — `/founder.png` | `/` (Homepage) | `FounderStory.tsx` | Website Workspace (Shared Section Founder Story) | Active | 2026-07-12 |
| Founder Portrait (Community/Premium) — `/images/founder-portrait.jpg` | `/portal/congdongai`, `/portal/premium` | `CommunityGuides.tsx`, `FounderSpotlight.tsx` (qua `src/data/portal/founder.ts`) | Portal (Community + Premium) | Active | 2026-07-12 (đính chính route) |
| Companion Avatar Set (6 file) | Toàn bộ `/portal/**` (qua `PortalShell.tsx`) + `/portal`, `/portal/companion` | `CompanionAvatar.tsx` → `CompanionPresence.tsx` | Companion Studio | Active | 2026-07-12 |
| Garden Tree Scene — `garden-tree-scene.jpg` | `/portal/khuvuoncuaban` | `scene/TreeLayer.tsx` (qua `GardenExperience.tsx`) | Portal (Living Garden feature) | Active | 2026-07-12 (đính chính route + Used By) |
| Vendor Tool Logos (11 file) | `/admin/tools`, `/portal/tools`, `/portal/tools/[id]` | CKOS Tools module | CKOS | Active | 2026-07-12 |
| Course PDF (URL động) | Trang chi tiết sản phẩm Premium (route động theo `products.slug`) | `products.pdf_url`/`lessons.pdf_url` (Supabase) | Premium Workspace | Draft (chưa qua Media Center thật — chỉ ghi nhận hiện trạng) | 2026-07-12 |
| **Garden Care Visual** — `garden-care-visual.jpg` | **Không có** | **Không có** | **Không có** | **🚫 UNUSED MEDIA** | 2026-07-12 |
| (Chưa có) Intro/Course/Marketing/Tutorial Video ×4 | — | — | — | Draft (khoảng trống thật, không phải UNUSED) | 2026-07-12 |
| (Chưa có) DOCX/XLSX/PPTX ×3 | — | — | — | Draft (khoảng trống thật, không phải UNUSED) | 2026-07-12 |
| (Chưa có) Audio | — | — | — | Draft (khoảng trống thật, không phải UNUSED) | 2026-07-12 |

**Danh sách UNUSED MEDIA (đúng nghĩa — có file thật, tồn tại trong `public/`, nhưng 0 tham chiếu trong code):**
1. `garden-care-visual.jpg` (`public/images/garden/garden-care-visual.jpg`) — đã đánh dấu `🚫 UNUSED MEDIA` trực tiếp trong `assetRegistry.ts` (`usedByNote`). **Không tự xoá** — chờ Founder quyết định giữ hay dọn dẹp.

Lưu ý phân biệt: 8 mục "(Chưa có)" (Video ×4, Document ×3, Audio ×1) là **khoảng trống thật** (không có file nào tồn tại) — khác về bản chất với UNUSED MEDIA (file tồn tại nhưng không dùng). Không gộp 2 loại vào cùng 1 danh sách để tránh hiểu nhầm.

**Giới hạn của Task 6 cần nêu rõ:** "Current Route" và "Last Updated" hiện **không phải field có cấu trúc** trên `MediaAsset` — bảng trên tổng hợp thủ công từ `usedByNote` (text tự do) + `updatedDate`. Trong giao diện Admin, cột "Used By" đã hiển thị trực tiếp ở bảng danh sách (không cần mở Edit), nhưng "Workspace Owner"/"Last Updated" chỉ xem được khi mở Edit modal — chưa có cột riêng trong bảng chính. Đây là khoảng trống UI nhỏ, không tự sửa (ngoài phạm vi, không được yêu cầu rõ trong brief).

---

## Files Changed

- `src/lib/admin/media/assetRegistry.ts` — sửa 3 đoạn `usedByNote`/`workspaceOwnerNote` (đính chính `founder-portrait.jpg`, đính chính `garden-tree-scene.jpg`, đánh dấu `garden-care-visual.jpg` là UNUSED MEDIA). Không đổi schema/route/component.
- `docs/admin/MEDIA_CENTER_PORTAL_ALIGNED_REVIEW.md` (file này, mới)

---

## Verification

- [x] `npm run lint` — sạch
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công
- [x] `npm run test` — 139/139 pass

---

## Acceptance Self-check (trung thực)

| Tiêu chí | Trạng thái |
|---|---|
| ✓ Media Center bám 100% Digital Assets của Portal hiện tại | ✅ **Đạt** — kiểm kê đúng 20/20 file thật, 2 chỗ "Used By" sai đã đính chính |
| ✓ Không còn module thừa | ✅ **Đạt** — 10/10 route có Registry/nội dung thật |
| ✓ Không còn route Legacy | ✅ **Đạt** — Greenfield từ MEDIA-SPR-201 |
| ✓ Không còn menu dư | ✅ **Đạt** — `nav.ts`/`MEDIA_WORKSPACE_SECTIONS`/`AdminSidebar.tsx` khớp 10/10 |
| ✓ Founder quản lý được toàn bộ Digital Assets mà không cần sửa code | ⚠️ **Đạt phần lớn** — 6/6 hành động "thêm" (ảnh/video/tài liệu/folder/collection/tag) xác nhận 0 code; **KHÔNG đạt** cho: Visibility riêng theo từng Media Object (chỉ có Visibility toàn cục), thêm 1 category Media mới (ngoài phạm vi yêu cầu) |
| ✓ Không chồng chéo với Website Workspace | ✅ **Đạt** — chỉ tham chiếu qua `workspaceOwnerNote` (thông tin, không phải sở hữu), reuse `NAVIGATION_STATUSES` (type dùng chung, không phải dữ liệu) |
| ✓ Không chồng chéo với Brand Studio | ✅ **Đạt** — ranh giới `founder.png` (Media Center, nội dung dùng chung) vs Brand Asset (nhận diện thương hiệu) đã phân biệt rõ từ BRAND-SPR-201/MEDIA-SPR-201, xác nhận lại |
| ✓ Build thành công | ✅ **Đạt** |
| ✓ Tests pass | ✅ **Đạt** (139/139) |

**Phát hiện cần Founder/PMO quyết định:**
1. Visibility riêng theo từng Media Object chưa tồn tại (chỉ có Visibility toàn cục 1 record) — cần quyết định có đủ ưu tiên để mở sprint riêng thêm field này không.
2. `garden-care-visual.jpg` — UNUSED MEDIA, cần quyết định giữ hay xoá.
3. `GardenWidget.tsx`/`LivingGardenCard.tsx` — 2 component Portal mồ côi (không phải Admin, phát hiện phụ khi đính chính Task 1) — cần đưa vào phạm vi 1 sprint Portal cleanup trong tương lai.
4. Trùng thuật ngữ "Digital Assets" giữa Media Center và nhóm nav.ts "Projects & Opportunities" — không phải lỗi sở hữu nhưng có thể gây nhầm lẫn khi trao đổi, cân nhắc đổi tên 1 trong 2 nếu Founder thấy cần.

Không merge. Không deploy Production. Chờ PMO review.
