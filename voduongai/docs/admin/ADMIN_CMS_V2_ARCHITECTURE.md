# Admin CMS v2.0 — Kiến trúc tổng thể

Trạng thái: **Release Candidate** (ADM-V2-08, sprint QA/RC cuối cùng của chương
trình 8-sprint ADM-V2.0). Tài liệu này mô tả kiến trúc hiện tại của toàn bộ
`/admin/*` sau khi hoàn tất Sprint 1-7 (bỏ khung "Sắp triển khai", chuyển thành
module thật hoặc Empty State trung thực) và Sprint 8 (audit/QA/tài liệu).

## 1. Cấu trúc điều hướng — 3 tầng

`src/lib/admin/nav.ts` là nguồn sự thật duy nhất cho Sidebar/Search/Dashboard:

```
adminWorkspaces: AdminWorkspace[]
  → items?: AdminNavItem[]           (7/8 workspace dùng dạng phẳng này)
  → subGroups?: AdminNavSubGroup[]   (CHỈ workspace "Học viện" dùng, 10 nhóm)
       → items: AdminNavItem[]
```

8 Workspace cấp cao (tiếng Việt, theo đúng thứ tự hiển thị Sidebar):

1. **Tổng quan** — trung tâm điều hành, không sở hữu dữ liệu nghiệp vụ riêng.
2. **Người dùng** — Identity Hub (`auth.users`/`members`), chỉ đọc + xem hồ sơ.
3. **Website** — Landing Page (Live-edit) + cấu hình site-wide.
4. **Học viện** — toàn bộ nội dung Portal/Học viện, 10 subGroup khớp 1:1 với
   `portalNavSections` (menu Portal thật).
5. **Vận hành** — đơn hàng, thanh toán, khách hàng, hỗ trợ.
6. **Marketing** — chiến dịch, chuyển đổi.
7. **Thương hiệu & Media** — brand asset, media, tài liệu.
8. **Hệ thống** — cấu hình kỹ thuật, KHÔNG hiển thị secret/env value.

`flattenAdminNav()` làm phẳng cả 3 tầng, dùng chung cho `AdminSearch` và
`Dashboard`.

## 2. 5 kiểu UI (route pattern)

Phân loại 76 route thật (đã audit lại bằng script, Sprint 8):

| Kiểu | Số route | Đặc điểm |
|---|---|---|
| **EmptyState** | 24 | `AdminEmptyState` — module đã có route/layout/phân quyền thật nhưng honestly rỗng (chưa có bảng/hạ tầng/nghiệp vụ thật đứng sau). KHÔNG badge "Sắp ra mắt", KHÔNG CRUD giả. |
| **Bespoke** | 23 | Server Component tự viết JSX riêng (không qua `DataTable`/`VisualEditor` chung) — thường vì bảng dữ liệu là typed (không phải schema generic) nên cần Server Actions riêng (`case_studies`, `courses`, `coupons`, `documents`...), hoặc vì nội dung phức tạp hơn 1 danh sách phẳng (CKOS Dashboard, Lesson Editor, Course Builder). |
| **DataTable** | 12 | `<DataTable<T> collectionKey=... />` — Server Component fetch qua `/api/admin/collections/[table]`, slide-over Add/Edit/Xoá. Dùng cho danh sách phẳng, schema generic `id/data jsonb/status/order`. |
| **Live-edit** | 12 | "Cách A" — render lại ĐÚNG component `/portal/*` thật (import thẳng, không copy) bọc `<EditModeProvider>`, nhúng `EditableRegion` tại các vùng text an toàn. Đảm bảo Admin nhìn thấy pixel-perfect với Portal thật. |
| **VisualEditor** | 5 | `<VisualEditor<T> collectionKey=... />` — client-only, hover-to-edit + kéo-thả, dùng cho danh sách có thứ tự hiển thị quan trọng. |

## 3. Tầng dữ liệu

- **Generic collections** (`id/data jsonb/status/order/created_at/updated_at`,
  đăng ký trong `SUPABASE_COLLECTIONS`) — đọc/ghi qua
  `/api/admin/collections/[table]` (route dùng chung), hook client
  `useCollection()` (`src/lib/admin/store.ts`). `DataTable`/`VisualEditor`/
  `SingletonEditor`/Live-edit's `EditableRegion` đều dùng hook này.
- **Typed tables** (schema riêng, không theo khuôn generic — `case_studies`,
  `courses`, `coupons`, `documents`, `course_sections`/`course_lessons`,
  `ecosystem_subprojects`...) — mỗi bảng có Server Actions riêng
  (`"use server"`, file `actions.ts` cạnh `page.tsx`), gọi
  `getSupabaseAdmin()` trực tiếp, KHÔNG qua route generic.

## 4. Auth — 3 lớp phòng hộ

1. **`middleware.ts`** (edge, chạy trên MỌI request khớp `/admin/:path*`,
   kể cả RSC fetch của điều hướng client-side) — query `members.is_admin`
   tươi mỗi lần, redirect `/admin/login` nếu không phải Admin. Đây là lớp
   **thật sự chặn** mọi truy cập trái phép, không phụ thuộc cache/Partial
   Rendering.
2. **`requireAdmin()`** gọi trong Server Component (`DataTable.tsx`,
   `(dashboard)/layout.tsx`, và 59/76 `page.tsx` bespoke/Live-edit) — lớp
   phòng hộ thứ 2, chủ yếu để tự tin khi Partial Rendering không đảm bảo
   layout cha re-run.
3. **`requireAdmin()`/`requireMember()`** trong mọi `/api/admin/*` route
   handler và mọi Server Actions (`actions.ts`) — lớp chặn network-level,
   độc lập với UI.

Chi tiết đầy đủ + phát hiện của đợt audit này: xem `ADMIN_RC_REPORT.md`
mục Security Review.

## 5. Component dùng chung quan trọng

- `AdminShell.tsx` / `AdminHeader.tsx` / `AdminSidebar.tsx` / `AdminSearch.tsx`
  / `AdminUserMenu.tsx` — khung Admin, sidebar 3 tầng, drawer mobile.
- `DataTable.tsx` + `DataTableClient.tsx` + `DataTableRowPanel.tsx` — CRUD
  danh sách phẳng, `breadcrumb` optional prop (ADM-V2-07).
- `VisualEditor.tsx` — CRUD có thứ tự kéo-thả, cùng `breadcrumb` prop.
- `SingletonEditor.tsx` — form sửa 1 dòng duy nhất (settings site-wide...).
- `AdminBreadcrumb.tsx` — breadcrumb 3 cấp dùng chung, `trail` truyền tường
  minh từ mỗi trang (không tra cứu ngầm từ `nav.ts`).
- `AdminEmptyState.tsx` — Empty State chuyên nghiệp (24 route dùng), khác
  hẳn `WorkspacePlaceholder.tsx` (đã xoá ở Sprint 8 vì không còn route nào
  dùng — mọi `comingSoon: true` đã được gỡ qua Sprint 1-6).
- `EditModeContext.tsx` + `EditableRegion.tsx` — có **10 bản sao
  byte-for-byte** (mirror/journal/story/journey-map/garden/gem-home/
  su-menh-companion/opportunities/premium/home), mỗi bản chỉ khác import,
  phục vụ đúng 1 module Live-edit — có chủ đích (tránh 1 Context dùng
  chung nhiều module không liên quan), không phải trùng lặp do sơ suất.

## 6. Nguyên tắc bất biến xuyên suốt chương trình

- Không tạo dữ liệu giả để làm đầy giao diện.
- Không tạo CRUD giả nếu chưa có nghiệp vụ thật tiêu thụ dữ liệu đó.
- Empty State chuyên nghiệp thay cho badge "Sắp ra mắt" khi module đã
  triển khai route/layout/phân quyền nhưng chưa có dữ liệu/hạ tầng.
- Không đụng checkout, thanh toán, entitlement, Identity Hub, RLS ngoài
  phạm vi đã duyệt riêng.
- Không xoá route cũ — giữ compatibility.
- Mọi migration mới phải viết báo cáo schema/rủi ro và DỪNG chờ Founder
  duyệt riêng trước khi `apply_migration`.

Lịch sử đầy đủ từng quyết định/audit/bug-fix của 8 sprint: xem
`voduongai/CLAUDE.md` (nhật ký kỹ thuật đầy đủ, theo thứ tự thời gian).
