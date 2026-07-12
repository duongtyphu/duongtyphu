# BRAND STUDIO FOUNDATION — IMP-BRAND-001 (BRAND-SPR-001, EPIC-BRAND-001)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Workspace thứ hai được phép triển khai kỹ thuật, sau khi Founder/PMO xác nhận Brand Studio Product Package v1.0 đã được phê duyệt (brief IMP-BRAND-001, Founder Directive: *"Không kế thừa Legacy Admin. Không giữ compatibility với dữ liệu test."*). Khác với Website Workspace (Foundation-only ở WEB-SPR-001, CRUD trải qua nhiều sprint sau), brief này yêu cầu Foundation **kèm Registry hoạt động thật** trong cùng 1 sprint — không có caveat "chưa CRUD sprint này" như WEB-SPR-001.

**Canonical Information Architecture** (10 mục theo Scope của brief, khóa):
Dashboard → Logo → Wordmark → Typography → Color Palette → Theme → Icons → Open Graph → Brand Assets Registry → Global Brand Settings.

---

## 1. Brand Workspace Shell (Task 1)

`src/components/admin/brand/BrandWorkspaceShell.tsx` + `src/lib/admin/brand/navigation.ts` (`BRAND_WORKSPACE_SECTIONS`) — cùng pattern `WebsiteWorkspaceShell`/`WEBSITE_WORKSPACE_SECTIONS` (Website Workspace): title bar + tab nav ngang qua đúng 10 mục, nằm trong Shared Admin Layout chung (AdminShell/Breadcrumb/Header/access-guard qua `(dashboard)/layout.tsx`).

## 2. Brand Dashboard — Mock Data (Task 2)

`src/app/admin/(dashboard)/brand/page.tsx` — theo đúng chỉ thị "(Mock Data)" của Task 2: 4 stat card (`Brand Assets`/`Color Tokens`/`Typography Tokens`/`Theme Profiles`) là số cứng, không đọc Registry thật, cộng thêm khối "⚠️ Phát hiện cần Founder xác nhận" tóm tắt 3 bất nhất thương hiệu tìm được khi xây Registry (Mục 3-6 dưới). **Khác WEB-SPR-001** (Dashboard mock rồi 5 sprint sau mới nối dữ liệu thật ở WEB-SPR-006): ở đây Registry thật đã được xây ngay trong CÙNG sprint, nhưng Task 2 vẫn yêu cầu rõ Mock Data cho Dashboard — không tự ý nối vào Registry thật, giữ đúng phạm vi Task được giao.

## 3. Brand Asset Registry Foundation (Task 3)

`src/lib/admin/brand/assetRegistry.ts` + `src/components/admin/brand/BrandAssetRegistry.tsx` — MỘT schema `BrandAsset` dùng chung cho cả 4 category (`Logo`/`Wordmark`/`Icon`/`OpenGraphImage`), phân biệt bằng `category` — đúng nguyên tắc Shared Structure đã dùng cho Website Page Registry. 4 route (`/logo`, `/wordmark`, `/icons`, `/open-graph`) dùng chung component qua `lockedCategory`; `/admin/brand/assets` hiển thị toàn bộ. Quản lý METADATA (tên/ghi chú file/format/usage) — không upload/thư viện file thật (không Asset Editor, chưa có Media Center).

**Phát hiện khi sưu tầm dữ liệu mẫu (bám sát code thật):**
- **2 mã màu "Brand Orange" khác nhau đang tồn tại song song:** `#FF7A00` (`--color-brand-orange` trong `globals.css`, khớp chấm tròn accent trong `Footer.tsx`/logo hiện tại) vs `#F97316` (quy ước logo bắt buộc cho trang MỚI trong root `CLAUDE.md`). Cùng một logo, 2 giá trị khác nhau — **cần Founder chọn 1 giá trị chính thức**.
- **Chưa có Open Graph Image mặc định nào:** `layout.tsx` `generateMetadata()` không set `openGraph.images` — chia sẻ link Portal lên Facebook/Zalo hiện không có ảnh preview. Đây là khoảng trống asset thật, không phải lỗi Registry.
- **Favicon đã có Admin CRUD ở System Settings** (`settings.faviconUrl`, `/admin/settings`) — chồng lấn với category Icon, ghi nhận không tự gộp.

## 4. Typography Foundation (Task 4)

`src/lib/admin/brand/typographyRegistry.ts` + `TypographyRegistry.tsx` — danh sách token font (name/fontFamily/weight/usageNote), có preview chữ mẫu tĩnh (không phải công cụ chỉnh font). Seed 2 token thật: **Body/UI Font** (`--font-sans` trong `globals.css`, system font stack) và **Logo Wordmark Font** (`Inter`, theo quy ước `CLAUDE.md`) — ghi rõ Inter là ngoại lệ có chủ đích cho riêng wordmark, không phải lỗi.

## 5. Color Palette Foundation (Task 5)

`src/lib/admin/brand/colorRegistry.ts` + `ColorPaletteRegistry.tsx` — danh sách token màu (name/hexValue/usageNote) với swatch preview tĩnh (không phải color picker/Theme Builder). Seed 8 token sao chép đúng nhóm "Brand — VO DUONG AI" trong `globals.css` (không lấy toàn bộ ~20 token GemOS Design System nội bộ UI) — bao gồm CẢ 2 giá trị "Brand Orange" (Mục 3) để Founder thấy song song, không tự chọn 1 giá trị.

## 6. Theme Foundation (Task 6)

`src/lib/admin/brand/themeRegistry.ts` + `ThemeRegistry.tsx` — **không phải Theme Builder**, không có cơ chế switch/sinh CSS. Registry chỉ ghi nhận các "theme" (tổ hợp nền/chữ/accent) đang THỰC SỰ tồn tại trong code. Seed 2 profile thật:
1. **Root Tokens** (`--background: #F8FAFC`/`--foreground: #111827`) — định nghĩa ở `:root` nhưng phần lớn trang Portal/Admin không dùng trực tiếp.
2. **Portal/Admin (Dark, hardcode)** — `#0B1F4D`/trắng, hardcode trực tiếp trong component (VD `bg-[#0B1F4D]` ở `Modal.tsx`), **không đi qua token nào**.

**Phát hiện:** đây là theme THẬT đang hiển thị toàn bộ Portal/Admin nhưng không chuẩn hoá thành token — muốn đổi theme phải sửa code từng component. Ghi nhận đúng hiện trạng, không tự "sửa" thành 1 theme.

## 7. Global Brand Settings (Task 7)

`src/lib/admin/brand/globalBrandSettings.ts` + `GlobalBrandSettingsForm.tsx` — **1 record duy nhất** (singleton, id cố định `global_brand_settings_singleton`), dùng lại đúng `useCollection()` (không dựng cơ chế lưu trữ mới). Seed `tagline`/`taglineSecondary` sao chép đúng từ `siteConfig` (`src/lib/site.ts`) — không phải văn bản bịa.

**Chồng lấn ghi nhận (không tự gộp):** một phần field (logo/favicon/tagline) trùng với System Settings hiện có (`/admin/settings`, quản lý `siteName`/`logoUrl`/`faviconUrl`/`seoTitle`/`seoDescription`/social/footer text).

## Shared Structure (nguyên tắc xuyên suốt sprint)

- **1 Status model dùng chung mọi Registry mới:** `assetRegistry.ts`, `typographyRegistry.ts`, `colorRegistry.ts`, `themeRegistry.ts`, `globalBrandSettings.ts` đều `import { NAVIGATION_STATUSES }` từ `navigationRegistry.ts` (Website Workspace) thay vì tự định nghĩa Status riêng — 4 trạng thái Draft/Active/Inactive/Archived, dùng lại đúng tone Badge có sẵn, không đổi `Badge.tsx`.
- **Cùng pattern CRUD** (Modal/ConfirmDialog/`useCollection`/`genId`/`useAdminToast`) như mọi Registry của Website Workspace.

## Cập nhật Governance

- `docs/admin/workspaces/brand-studio.md` — viết lại từ Draft (IMP-GOV-001) sang **Approved** (BRAND-SPR-001), Scope/IA cập nhật theo Product Package thật (10 mục), Dependency Matrix cập nhật, câu hỏi "tách hay gộp với Media Center" **đã giải quyết: tách riêng**.
- `docs/admin/workspaces/media-center.md` — cập nhật Mục 5/8/15 phản ánh việc tách khỏi Brand Studio; **vẫn Draft**, vẫn chưa có Product Package.

## nav.ts / Route Changes

- `src/lib/admin/nav.ts` — thay 1 mục gộp `"Brand & Media"` (`/admin/brand-media`, ComingSoon) bằng nhóm thật `"Brand Studio"` (10 item, `/admin/brand/*`) + 1 mục mới `"Media Center"` (`/admin/media-center`, ComingSoon, tách riêng). Xác minh bằng script so sánh href trước/sau: **0 href bị mất**, đúng 11 href mới (10 Brand Studio + 1 Media Center), không trùng lặp.
- Xóa route `/admin/brand-media` (ComingSoon cũ, nay unreachable từ nav — dọn dẹp orphan route do chính thay đổi nav.ts của sprint này gây ra, không phải xoá tuỳ tiện).
- Thêm route `/admin/media-center` (ComingSoon mới, tách riêng cho Media Center).
- `src/components/admin/AdminSidebar.tsx` — thêm icon cho 11 href mới (`navIcons`).

## Files Changed

**Lib (mới):**
- `src/lib/admin/brand/navigation.ts`, `assetRegistry.ts`, `typographyRegistry.ts`, `colorRegistry.ts`, `themeRegistry.ts`, `globalBrandSettings.ts`

**Components (mới):**
- `src/components/admin/brand/BrandWorkspaceShell.tsx`, `BrandAssetRegistry.tsx`, `TypographyRegistry.tsx`, `ColorPaletteRegistry.tsx`, `ThemeRegistry.tsx`, `GlobalBrandSettingsForm.tsx`

**Routes (mới):**
- `src/app/admin/(dashboard)/brand/{page,logo,wordmark,typography,color-palette,theme,icons,open-graph,assets,settings}/page.tsx`
- `src/app/admin/(dashboard)/media-center/page.tsx` (mới, ComingSoon)

**Sửa:**
- `src/lib/admin/nav.ts`, `src/components/admin/AdminSidebar.tsx`

**Xóa:**
- `src/app/admin/(dashboard)/brand-media/page.tsx` (orphan sau khi đổi nav.ts)

**Docs:**
- `docs/admin/workspaces/brand-studio.md` (Draft → Approved), `docs/admin/workspaces/media-center.md` (cập nhật), `docs/admin/BRAND_STUDIO_FOUNDATION.md` (mới, file này)

**Không đổi:** Website Workspace (mọi route/Registry), CKOS, mọi Workspace khác, `Badge.tsx`, `Modal.tsx`, `src/app/globals.css` (chỉ đọc để sưu tầm dữ liệu mẫu, không sửa).

## Sự cố đã xử lý

Lint phát hiện 1 lỗi thật (`react-hooks/set-state-in-effect` ở `GlobalBrandSettingsForm.tsx` — gọi `setState` trong `useEffect` để khởi tạo form từ record đã tải) — đã sửa bằng cách tính `form = localEdits ?? record` trực tiếp trong lúc render thay vì effect, cùng cách đã sửa ở `NavigationRegistry.tsx` (WEB-SPR-003).

## Verification

- **Lint (`npm run lint`):** sạch — 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch (sau khi rebuild `.next` để làm mới route type validator do xóa route cũ).
- **Build (`npm run build`):** thành công — 10 route `/admin/brand/*` + `/admin/media-center` đều build ở dạng `ƒ` (dynamic, đúng vì sau Admin auth middleware).
- **Test (`npm run test`):** 139/139 pass, không regression.

## Cần PMO/Founder quyết định (tổng hợp)

1. **Chọn 1 mã màu "Brand Orange" chính thức** — `#FF7A00` (đang dùng thật) hay `#F97316` (quy ước `CLAUDE.md`)?
2. **Chồng lấn Icons/Global Brand Settings vs System Settings** — gộp hay giữ 2 nơi riêng?
3. **Theme kép chưa hợp nhất** — có đáng đầu tư chuẩn hoá Portal/Admin dark UI thành token chính thức không?
4. **Open Graph Image mặc định** — chưa có, cần asset thật (ngoài phạm vi kỹ thuật, cần Founder cung cấp/thiết kế).
5. **Font Wordmark (Inter) vs Body Font** — xác nhận đây là chủ đích, không phải sai sót.

## EPIC-BRAND-001 Readiness

**Foundation hoàn chỉnh cho BRAND-SPR-001.** Brand Studio xuất hiện trong Admin (nhóm "Brand Studio", 10 route thật), Dashboard hoạt động (mock data đúng Task 2), Brand Asset Registry + Typography + Color Palette + Theme + Global Brand Settings đều có Registry CRUD thật, Shared Structure nhất quán với Website Workspace, không ảnh hưởng Workspace khác, build/test đều pass. **Không có P0.**

**Consumer = 0** cho toàn bộ Registry (Portal/site công khai chưa đọc từ đây) — đúng đặc điểm giai đoạn Foundation, giống mọi Registry của Website Workspace tính đến nay. Việc nối Brand Studio Registry vào Portal thật (đổi màu/font/theme thật khi Founder cập nhật Registry) là quyết định của Sprint kỹ thuật tương lai.
