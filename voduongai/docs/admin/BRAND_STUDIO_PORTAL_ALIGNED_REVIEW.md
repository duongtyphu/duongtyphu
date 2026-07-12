# BRAND-SPR-202 — Brand Studio: Portal-aligned Management

**Epic:** EPIC-02 · **Phase:** Phase 2 — Website & Brand · **Sprint:** BRAND-SPR-202
**Brief:** IMP-BRAND-202 · **Tiếp theo:** WEB-SPR-201R (cùng mẫu Portal-aligned Management, áp dụng cho Website Workspace)

Tuân thủ **PMO Directive FOUNDER-001** (Portal Coverage First — audit trực tiếp Portal thật trước khi thay đổi Admin) và **Founder Directive Admin Simplicity**. Không dùng Legacy Admin, không dùng dữ liệu test cũ — mọi phát hiện dưới đây đối chiếu trực tiếp code hiện tại (`src/app/**`, `src/components/site/**`, `src/lib/site-settings.ts`, `src/app/globals.css`).

---

## Deliverable 1 — Brand Studio Review (Task 1: Portal Brand Mapping)

Đối chiếu 9 mục Scope của brief với Brand Asset thật đang được Portal sử dụng:

| # | Scope (brief) | Portal Brand Mapping (nguồn thật) | Brand Studio route | Kết luận |
|---|---|---|---|---|
| 1 | Logo | SVG inline trong `Header.tsx`/`Footer.tsx` (path #2563EB + chấm tròn accent #FF7A00). Root `CLAUDE.md` quy định mẫu SVG **bắt buộc cho trang mới** dùng accent **#F97316** — khác giá trị thật đang chạy. | `/admin/brand/logo` (Brand Asset Registry, category Logo, 4 entry gồm cả 2 mã màu) | ✅ Đã bám đúng, kể cả phần bất nhất — không tự chọn 1 giá trị |
| 2 | Wordmark | Text lockup "VDAI"/"ACADEMY" trong cùng SVG logo, font Inter (khác `--font-sans` toàn site) | `/admin/brand/wordmark` | ✅ Đã bám đúng |
| 3 | Favicon | `settings.faviconUrl` (bảng Supabase `settings`, đọc qua `getSiteSettings()`, set vào `generateMetadata().icons.icon` ở `layout.tsx`) — **Consumer thật, nguồn sự thật là System Settings (`/admin/settings`), không phải Brand Studio** | `/admin/brand/icons` (category Icon) | ⚠️ Đã ghi nhận đúng hiện trạng chồng lấn, KHÔNG tự gộp |
| 4 | Typography | `--font-sans` (`globals.css`) dùng toàn site; `--font-display` hiện trỏ thẳng `--font-sans` (chưa có font Display riêng) | `/admin/brand/typography` | ✅ Đã bám đúng, kể cả khoảng trống Display |
| 5 | Color Palette | `--color-brand-*` (`globals.css`) — nhưng **giá trị runtime thật đến từ `settings.primaryColor/secondaryColor/accentColor`**, được `layout.tsx` inject đè lên `:root` bằng inline `<style>` mỗi request. Nghĩa là màu thật Portal hiển thị do **System Settings** điều khiển tại runtime, Color Palette Registry của Brand Studio chỉ chụp lại giá trị mặc định trong `globals.css`, không phải giá trị runtime đang chạy. | `/admin/brand/color-palette` | ⚠️ **Phát hiện mới (BRAND-SPR-202)** — xem Mục "Phát hiện mới" bên dưới |
| 6 | Icon Set | Không có bộ icon riêng thiết kế cho thương hiệu — Portal/Admin dùng `lucide-react` (thư viện icon UI chung, 116 file, không phải nhận diện thương hiệu). "Icon" trong Scope Brand Studio = Favicon + App Icon, **không phải** icon UI. Ranh giới này đã đúng từ BRAND-SPR-001, xác nhận lại | `/admin/brand/icons` | ✅ Ranh giới đúng, không cần sửa |
| 7 | Open Graph Assets | `generateMetadata()` khai báo `openGraph`/`twitter` nhưng **không set `images`** — Portal hiện chưa có OG image nào | `/admin/brand/open-graph` | ✅ Đã ghi nhận đúng khoảng trống thật |
| 8 | Brand Assets | Tổng hợp 7 category, 13 entry — phần lớn "khoảng trống thật" (Draft), không bịa dữ liệu | `/admin/brand/assets` | ✅ Đã bám đúng |
| 9 | Global Brand Settings | `siteConfig` (`src/lib/site.ts`, tĩnh) + `settings` (Supabase, động qua `getSiteSettings()`) — **2 nguồn thật khác nhau**, Brand Studio's Global Brand Settings hiện là **bản ghi thứ 3**, không phải 1 trong 2 nguồn thật này | `/admin/brand/settings` | ⚠️ Đã ghi nhận đúng chồng lấn từ BRAND-SPR-001, xác nhận lại |

**Kết luận Task 1:** Brand Studio đã bám đúng cấu trúc/thuộc tính của mọi Brand Asset thật (không quản lý thứ Portal không dùng, không bịa dữ liệu). Nhưng **nguồn sự thật vận hành runtime thật của Favicon + 3 màu chính (Primary/Secondary/Accent) là System Settings (`/admin/settings`, bảng Supabase `settings`), không phải Brand Studio** — Brand Studio hiện là bản sao chụp (snapshot), không phải nơi điều khiển. Đây không phải lỗi thiết kế của BRAND-SPR-202 — tình trạng đã tồn tại từ BRAND-SPR-001, sprint này xác nhận lại bằng cách đọc trực tiếp `layout.tsx`/`site-settings.ts` (trước đây các báo cáo chỉ đối chiếu `globals.css` tĩnh, chưa lần theo cơ chế override runtime).

### Phát hiện mới (BRAND-SPR-202)

1. **Color Palette Registry chụp giá trị mặc định (default), không phải giá trị runtime thật.** `layout.tsx` dòng `:root{--color-brand-blue:${settings.primaryColor};...}` cho thấy Founder **đã có thể đổi màu thương hiệu qua System Settings** và Portal sẽ đổi theo thật — nhưng thay đổi đó **không phản ánh lại vào Brand Studio Color Palette Registry** (Registry vẫn hiển thị giá trị tĩnh trong `globals.css`). Nghĩa là: kênh **thay** màu thật đã tồn tại (ở System Settings, ngoài Scope Brand Studio), nhưng Brand Studio không biết/không đồng bộ với kênh đó. **NEEDS PMO DECISION** — không tự sửa (đổi kiến trúc Color Palette Registry để đọc từ `settings` bảng Supabase là thay đổi lớn, ngoài phạm vi "Portal-aligned Management" của sprint này).
2. **22 file thiết kế thương hiệu mồ côi trong `public/brand/`** — `favicon.{png,svg}`, `icon-{light,dark,transparent}.{png,svg}`, `primary-logo-{light,dark}.{png,svg}`, `wordmark-{light,dark}.{png,svg}`, và 3 file `concepts/concept{1,2,3}-*.{png,svg}` (tổng 22 file, thêm vào repo trong 1 commit không liên quan ngày 2026-07-06). **Xác nhận bằng grep toàn repo: 0 tham chiếu** ở bất kỳ file `.ts/.tsx/.json/.js/.mjs` nào — Portal hiện dùng SVG inline trong `Header.tsx`/`Footer.tsx`, hoàn toàn không đọc các file này. Đây là bộ asset thiết kế thật (không phải rác), có khả năng là kết quả một vòng thiết kế logo/wordmark biến thể sáng-tối trước đó nhưng **chưa từng được đưa vào dùng**. Theo đúng Founder Directive *"Nếu Portal không sử dụng: KHÔNG tạo"* — **không** thêm các file này vào Brand Asset Registry (sẽ là bịa "đang dùng" cho thứ chưa dùng). Cũng **không tự xoá** (là file thiết kế thật, có thể Founder muốn dùng làm Logo sáng/tối chính thức — đúng khoảng trống đã ghi nhận ở Mục Logo). **NEEDS PMO DECISION**: (a) chọn 1 bộ trong `public/brand/` làm Logo sáng/tối/App Icon chính thức và wire vào Header/Footer, hoặc (b) xác nhận không dùng và xoá khỏi repo.

---

## Deliverable 2 — Danh sách Legacy đã loại bỏ hoặc đề xuất loại bỏ (Task 2: Brand Workspace Structure)

Rà soát route/menu/module/placeholder/component của Brand Studio:

- **Route ↔ `nav.ts` ↔ `BRAND_WORKSPACE_SECTIONS` ↔ `AdminSidebar.tsx` icon map:** đối chiếu cả 4 nơi — **10/10 khớp hoàn toàn**, không route dư, không menu dư, không icon map dư/thiếu.
- **Component:** `BrandWorkspaceShell.tsx` là shell riêng của Brand Studio (không dùng chung `WorkspaceSectionFoundation.tsx` như 5 Workspace khác) — không có vấn đề lệch vị trí. Không tìm thấy component "Legacy-influenced" nào trong `src/components/admin/brand/**` — toàn bộ xây mới ở BRAND-SPR-001/201, Greenfield từ đầu.
- **Placeholder rỗng (ComingSoon):** không có — cả 10 route đều có nội dung/Registry thật, khác với `/admin/seo` (đã xoá ở WEB-SPR-201R).
- **Legacy Admin:** không tìm thấy Brand-related code nào trong Legacy Admin (đã xác nhận Greenfield từ BRAND-SPR-001, không kế thừa `admin.html`/CRUD cũ).

**Kết luận Task 2: không có gì cần loại bỏ bên trong Brand Studio.** Khác với Website Workspace (có 1 route dư rõ ràng `/admin/seo`), Brand Studio không có route/module/component nào đạt mức "REMOVE không mơ hồ" — mọi chồng lấn phát hiện được (System Settings vs Brand Icons/Global Brand Settings, đã ghi nhận từ BRAND-SPR-001 và nhắc lại ở IMP-ADM-001R) đều **NEEDS PMO DECISION** vì cả hai phía đều có nội dung thật, không phải 1 bên rỗng — đúng tiền lệ xử lý ở WEB-SPR-201R (chỉ xoá khi verdict REMOVE không mơ hồ, không tự ý xoá các mục NEEDS PMO DECISION).

**Không có thay đổi code nào được thực hiện trong sprint này** (khác WEB-SPR-201R có xoá `/admin/seo`) — kết quả audit trung thực là cấu trúc hiện tại đã sạch.

---

## Deliverable 3 — Danh sách Brand Assets Founder quản lý được (Task 3: Brand Management Chain)

| Bước | Quản lý được không cần sửa code? | Ghi chú |
|---|---|---|
| Logo | ✅ Add/Edit/Delete/reorder qua Brand Asset Registry (category Logo) | |
| → Wordmark | ✅ Cùng Registry, category Wordmark | |
| → Typography | ✅ Typography Registry (Add/Edit/Delete, Role) | |
| → Color | ✅ Color Palette Registry (Add/Edit/Delete, Role) | ⚠️ Không đồng bộ với màu runtime thật (System Settings) — xem Phát hiện mới #1 |
| → Icon | ✅ Brand Asset Registry, category Icon | |
| → Open Graph | ✅ Brand Asset Registry, category OpenGraphImage | |
| → Brand Asset | ✅ Brand Assets Registry (view tổng hợp, không lọc) | |
| → Publish | ⚠️ **Có field `status` (Draft/Active/Inactive/Archived) nhưng không có "Publish" thật ra Portal** | Toàn bộ 5 collection Brand Studio (`brand-assets`, `brand-color-tokens`, `brand-typography-tokens`, `brand-theme-profiles`, `brand-global-settings`) **không có trong `SUPABASE_COLLECTIONS` allowlist** — nghĩa là localStorage-only, không cả persist Supabase chứ chưa nói tới Portal đọc lại. Đổi `status` sang "Active" chỉ đổi hiển thị trong Admin, không tác động Portal thật. Đây là giới hạn đã biết (Consumer = 0, xem `ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md`), không phải phát hiện mới, nhắc lại ở đây vì Task 3 yêu cầu xác nhận rõ bước "Publish" |

**Kết luận Task 3:** Founder quản lý được toàn bộ chuỗi Logo→Wordmark→Typography→Color→Icon→Open Graph→Brand Asset **trong phạm vi Admin** mà không cần sửa code. Bước "Publish" cuối chuỗi **chưa tồn tại theo nghĩa thật** (đổi Registry không đổi Portal) — đúng giới hạn Consumer = 0 đã biết, không phải việc của sprint Portal-aligned Management (thuộc phạm vi "Publish Bridge" tương lai).

---

## Deliverable 4 — Flexibility Review (Task 4, chỉ báo cáo — không tự sửa ngoài phạm vi)

| Thao tác | Chỉ bằng dữ liệu/cấu hình? | Lý do |
|---|---|---|
| Thêm logo mới (biến thể) | ✅ Có | Thêm 1 `BrandAsset` mới, category `Logo` có sẵn |
| Thay logo hiện tại | ✅ Có (trong Admin) / ❌ Không (ra Portal thật) | Sửa Registry không đổi SVG inline trong `Header.tsx`/`Footer.tsx` — vẫn cần sửa code để đổi logo thật hiển thị |
| Thêm màu mới | ✅ Có, nếu dùng Role có sẵn (Primary/Secondary/Accent/Semantic) | Thêm `ColorToken` mới |
| Thêm 1 **Role** màu mới (vượt 4 role có sẵn) | ❌ Không | `COLOR_ROLES` là TypeScript union đóng — cần sửa code |
| Đổi typography (font/weight của token có sẵn) | ✅ Có | Sửa `TypographyToken` |
| Thêm 1 **Role** typography mới (vượt 5 role có sẵn) | ❌ Không | `TYPOGRAPHY_ROLES` đóng — cần sửa code |
| Thêm icon mới | ✅ Có, nếu dùng category `Icon` có sẵn | Thêm `BrandAsset` category Icon |
| Thêm Open Graph Asset mới | ✅ Có, category `OpenGraphImage` có sẵn | |
| Thêm 1 **category** Brand Asset mới (vượt 7 category có sẵn) | ❌ Không | `ASSET_CATEGORIES` đóng — cần sửa code |

**Kết luận Task 4:** Đúng pattern đã ghi nhận xuyên suốt EPIC-02 (`ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md`): thêm **1 mục mới trong 1 phân loại có sẵn** = thuần dữ liệu; thêm **1 phân loại mới** (Role/Category) = luôn cần sửa code (3 union đóng riêng của Brand Studio: `ASSET_CATEGORIES`, `COLOR_ROLES`, `TYPOGRAPHY_ROLES`). Không đề xuất sửa kiến trúc — đúng chỉ thị "Không đề xuất code" của brief.

---

## Deliverable 5 — Workspace Ownership Confirmation (Task 5)

Quét `workspaceOwnership.ts` (entry `brand-studio`, dòng 41-47): `owns: "Logo, Wordmark, Typography, Color Palette, Theme, Icons, Open Graph Image, Global Brand Settings"` — khớp đúng 9 mục Scope (Theme giữ nguyên theo tiền lệ ADM-SPR-201, xem WCS Mục 3). Quét toàn bộ `src/components/admin/brand/**` và `src/lib/admin/brand/**` cho các từ khóa "website"/"media"/"knowledge"/"learning"/"commercial"/"mentor" — không có kết quả nào ngoài các ghi chú ranh giới đã cố ý viết (VD `assetRegistry.ts` giải thích rõ Brand Image/Video/File nhận diện KHÁC Media Center, không phải sở hữu chéo).

**Kết luận Task 5: Xác nhận sạch — Brand Studio chỉ sở hữu Brand Assets, không sở hữu Website Content/Media Library/Knowledge/Learning/Commercial/Mentor.**

---

## Files Changed

**Không có thay đổi code nào trong sprint này** — toàn bộ Task 1-5 là audit/xác nhận, không phát hiện route/module/component nào đạt verdict REMOVE không mơ hồ (khác WEB-SPR-201R). Duy nhất tài liệu mới:

- `docs/admin/BRAND_STUDIO_PORTAL_ALIGNED_REVIEW.md` (file này)

---

## Verification

- [x] `npm run lint` — sạch (không đổi code, sanity check)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công
- [x] `npm run test` — 139/139 pass

---

## Acceptance Self-check (trung thực)

| Tiêu chí | Trạng thái |
|---|---|
| ✓ Brand Studio bám 100% Brand Assets của Portal hiện tại | ✅ **Đạt** — 9/9 mục Scope đối chiếu đúng Portal thật, không quản lý thứ Portal không dùng |
| ✓ Không còn module thừa | ✅ **Đạt** — 10/10 route có nội dung thật, không ComingSoon rỗng |
| ✓ Không còn route Legacy | ✅ **Đạt** — Greenfield từ đầu, không kế thừa Legacy Admin |
| ✓ Không còn menu dư | ✅ **Đạt** — `nav.ts`/`BRAND_WORKSPACE_SECTIONS`/`AdminSidebar.tsx` khớp 10/10 |
| ✓ Founder quản lý được toàn bộ Brand Assets mà không cần sửa code | ⚠️ **Đạt phần lớn** — quản lý được trong phạm vi Admin (thêm/sửa/xoá mục trong phân loại có sẵn); **KHÔNG đạt** cho: (a) thay đổi thật ra Portal (Consumer = 0, cần Publish Bridge), (b) thêm phân loại mới (Role/Category — cần sửa code) |
| ✓ Không chồng chéo với Website Workspace | ⚠️ **Có 1 điểm chồng lấn đã biết, không phải chồng chéo sở hữu** — Open Graph Image (Brand, cấp thương hiệu) vs SEO Registry per-page (Website) là 2 khái niệm khác nhau, đã phân biệt rõ từ BRAND-SPR-201; Global Brand Settings vs Global Website Settings cùng có field tagline — NEEDS PMO DECISION cũ, không phải phát hiện mới |
| ✓ Không chồng chéo với Media Center | ✅ **Đạt** — ranh giới Brand Image/Video/File nhận diện vs Media Library đã phân biệt rõ, xác nhận lại Task 5 |
| ✓ Build thành công | ✅ **Đạt** |
| ✓ Tests pass | ✅ **Đạt** (139/139) |

**Phát hiện cần Founder/PMO quyết định (mới, chưa từng ghi ở báo cáo trước):**
1. Color Palette Registry (Brand Studio) không đồng bộ với màu runtime thật do System Settings điều khiển (`layout.tsx` inline `<style>` override) — 2 kênh đổi màu tồn tại song song, không kênh nào biết kênh kia.
2. 22 file thiết kế thương hiệu (logo/wordmark/icon biến thể sáng-tối + 3 concept) nằm mồ côi trong `public/brand/`, không được Portal dùng và không có trong Brand Asset Registry — cần quyết định dùng chính thức hay xoá.

Không merge. Không deploy Production. Chờ PMO review.
