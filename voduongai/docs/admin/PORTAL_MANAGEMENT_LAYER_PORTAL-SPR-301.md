# PORTAL-SPR-301 — Portal Management Layer

**Epic:** EPIC-02 · **Phase:** Phase 3 — Portal Content · **Brief:** IMP-PORTAL-301
**Mode:** Implementation only — không audit lại Website/Brand/Media, không tạo tài liệu kiến trúc mới.

## 1. Đã làm gì

- Nâng cấp Portal Area/Page từ READ-ONLY hardcode (`areas.ts`/`pages.ts`, ADM-SPR-200) lên 4 Registry CRUD thật (`useCollection`, cùng pattern Website/Brand/Media): **Area** (`areaRegistry.ts`) → **Page/Child Page** (`pageRegistry.ts`) → **Section** (`sectionRegistry.ts`, mới) → **Content** (`contentBlockRegistry.ts`, mới), mỗi Content có đúng 1 `workspaceOwner`.
- Build `PortalAreaExplorer.tsx` — drill-down 4 tầng tại `/admin/portal/areas`, Founder Add/Edit/Delete/đổi thứ tự ở mọi tầng, gắn CTA/Media qua ghi chú tham chiếu (không copy dữ liệu nghiệp vụ).
- Nâng `/admin/portal/pages` (Page Registry) và `/admin/portal` (Dashboard) đọc số liệu thật từ Registry mới thay vì mảng tĩnh.
- **Task 5 (REMOVE có bằng chứng rõ ràng):** xoá 6/7 route `/admin/portal-builder/*` (Dashboard Portal, Bắt đầu tại đây, Hôm nay bạn muốn làm gì, Nội dung nổi bật, CTA, Mục tiêu người dùng) — xác nhận độc lập (grep lại, không dựa báo cáo cũ) **0 Portal consumer** cho 6 bảng Supabase liên quan, khớp verdict REMOVE không mơ hồ của `ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md` (mục #1). Giữ lại "Banner" — verdict khác (NEEDS PMO DECISION), không đụng. Cập nhật `nav.ts`, `AdminSidebar.tsx`, đính chính 2 dòng lỗi thời trong Open PMO Questions (`founder/page.tsx`).

## 2. 10 Portal Area đã được bao phủ thế nào

Cả 10/10 Area (Trang chủ Học viện, Companion, CKOS, Học viện AI, AI Workspace, Dự án & Cơ hội, Premium, Hành trình của tôi, Sứ mệnh Companion, Cộng đồng) đều có: Parent Page thật (route khớp Portal), Workspace Owner (trừ "Trang chủ Học viện" — không Workspace nào khớp rõ ràng, giữ nguyên phát hiện từ ADM-SPR-200/201, không tự gán), Section thật (audit trực tiếp JSX top-level của từng `page.tsx` chính — 33 Section, không bịa), Content Block gắn đúng 1 Owner (33 Content, 2 mục thuộc Trang chủ đánh dấu rõ "Owner gần đúng" vì bản chất đa-Workspace). Child Page thật cho 4 Area có route con xác nhận (AI Workspace 3, Dự án & Cơ hội 3, Hành trình của tôi 5, Sứ mệnh Companion 1) — 5 Area còn lại xác nhận không có route con nào khác ngoài route chính.

## 3. Mục nào vẫn cần sửa code để mở rộng

- Thêm 1 Portal Area **mới** (vượt 10 Area cố định) — không được yêu cầu bởi brief, nhưng nếu cần: phải sửa code (Area cố định theo sidebar Portal thật).
- Không phát hiện trường hợp nào khác cần sửa TypeScript/Route/Component để **đổi tên/ẩn-hiện/đổi thứ tự/thêm Page/Child Page/Section/Content/chọn Workspace Owner** — toàn bộ thao tác Task 3 xác nhận thuần dữ liệu (`useCollection().add()`), đúng yêu cầu brief.
- `route`/`seoContextNote` trên Page là TEXT tham chiếu — sửa không đổi routing/SEO thật của Next.js (đúng "chỉ quản lý presentation context", không phải giới hạn cần sửa code).

## 4. Blocker

Không có blocker chặn Sprint. 2 lưu ý cần Founder xác nhận (không chặn merge/PMO review):
- 2 Content Block thuộc "Trang chủ Học viện" (Pillar Entrance Card, Knowledge Journey Strip) mang tính đa-Workspace thật — đã gán Owner gần đúng (CKOS), cần Founder xác nhận Owner chính thức.
- "Trang chủ Học viện" vẫn chưa có Workspace Owner rõ ràng (kế thừa từ ADM-SPR-200/201, không phải phát hiện mới).

## 5. Build/Test

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch (sau `rm -rf .next && npm run build` để regenerate route types do xoá route)
- [x] `npm run build` — thành công, xác nhận 6 route `/admin/portal-builder/*` đã biến mất, `/admin/portal-builder/banner` vẫn còn
- [x] `npm run test` — 139/139 pass

## 6. File thay đổi

**Mới:**
`src/lib/admin/portal/areaRegistry.ts`, `pageRegistry.ts`, `sectionRegistry.ts`, `contentBlockRegistry.ts`, `src/components/admin/portal/PortalAreaExplorer.tsx`, `PortalAreaTable.tsx`, `PortalPageTable.tsx`, `PortalSectionTable.tsx`, `PortalContentBlockTable.tsx`, `docs/admin/PORTAL_MANAGEMENT_LAYER_PORTAL-SPR-301.md` (file này).

**Xoá:** `src/lib/admin/portal/areas.ts`, `pages.ts`, `src/components/admin/portal/PortalAreaLanding.tsx`, 6 route `src/app/admin/(dashboard)/portal-builder/{page,cta,featured,start-here,today-actions,user-goals}.tsx`.

**Sửa:** `src/app/admin/(dashboard)/portal/page.tsx` (Dashboard, số liệu thật), `src/app/admin/(dashboard)/portal/areas/page.tsx` (dùng Explorer), `src/components/admin/portal/PortalPageRegistry.tsx` (đọc Registry mới), `src/lib/admin/nav.ts`, `src/components/admin/AdminSidebar.tsx`, `src/app/admin/(dashboard)/founder/page.tsx` (Open PMO Questions).

Không merge. Không deploy Production. Chờ PMO review.
