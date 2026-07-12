# WEBSITE WORKSPACE FOUNDATION — IMP-WEB-001 (WEB-SPR-001, EPIC-WEB-001)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Workspace đầu tiên được phép triển khai kỹ thuật sau khi Website Workspace Product Package v1.0 được Founder/PMO phê duyệt. Sprint này chỉ xây **Foundation** — khung/shell/navigation/dashboard mock/settings placeholder — **không CRUD, không Page Editor, không Landing Builder, không SEO Editor**. Theo đúng `docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`: Greenfield Architecture, không kế thừa Legacy Admin/Portal Builder cũ, không giữ compatibility với dữ liệu test.

**Canonical Information Architecture** (theo PMO Clarification, đúng 10 nhóm, không đổi tên/thêm/bớt):
Dashboard → Pages → Navigation → Homepage → Landing Pages → Static Pages → Shared Sections → SEO → Redirect → Global Settings.

---

## 1. Website Workspace Foundation

Đã xây dựng đầy đủ khung cho cả 10 nhóm — mỗi nhóm là 1 route thật (`/admin/website/*`), không phải mock UI rời rạc. Route:

| Nhóm | Route |
|---|---|
| Dashboard | `/admin/website` |
| Pages | `/admin/website/pages` |
| Navigation | `/admin/website/navigation` |
| Homepage | `/admin/website/homepage` |
| Landing Pages | `/admin/website/landing-pages` |
| Static Pages | `/admin/website/static-pages` |
| Shared Sections | `/admin/website/shared-sections` |
| SEO | `/admin/website/seo` |
| Redirect | `/admin/website/redirect` |
| Global Settings | `/admin/website/global-settings` |

Nguồn IA duy nhất: `src/lib/admin/website/navigation.ts` (`WEBSITE_WORKSPACE_SECTIONS`) — dùng chung bởi cả tab navigation nội bộ Workspace (`WebsiteWorkspaceShell`) và sidebar Admin (`nav.ts`), tránh 2 nơi định nghĩa lệch nhau.

---

## 2. Navigation

Đúng 10 nhóm theo Canonical IA đã được PMO xác nhận — **không đổi tên, không thêm, không bớt** (Quy định 1-5 trong PMO Clarification). Xác minh bằng script so khớp `nav.ts`: 62→71 mục, không mất href nào, chỉ thêm đúng 9 route con mới (mục Dashboard đã tồn tại từ trước dưới dạng `/admin/website` Coming Soon, nay trở thành route thật).

**Khác biệt cần trình PMO quyết định (theo đúng thứ tự ưu tiên Founder Decision → PMO Clarification → Portal hiện tại → tài liệu cũ):**

1. **SEO trùng tên với mục "SEO" đã có ở cấp cao nhất sidebar** (`/admin/seo`, đặt ở ADM-SPR-002, hiện là Coming Soon, phạm vi có thể rộng hơn — SEO cho mọi nội dung chứ không riêng Website). Đã **không tự gộp/xóa** mục nào — giữ nguyên cả hai, ghi rõ trong trang `/admin/website/seo`.
2. **Global Settings chồng lấn một phần với "System Settings"** (`/admin/settings`, đã tồn tại từ trước EPIC-02, đang quản lý tên site/logo/favicon/SEO mặc định/social link/footer text). Đã **không tự gộp hai trang** — ghi rõ trong trang `/admin/website/global-settings`.

Cả hai khác biệt này **không phải lỗi của sprint này** — chúng phát sinh vì Product Package (IA của Website Workspace) được PMO xác nhận độc lập với cấu trúc 14 nhóm Admin đã duyệt trước đó (ADM-SPR-002). Theo đúng chỉ thị "không tự đoán, không tự xóa, trình PMO quyết định khi khác biệt ảnh hưởng đến product ownership" — đã ghi nhận đầy đủ, chờ PMO xử lý ở WEB-SPR-002.

---

## 3. Dashboard

`/admin/website` hiển thị đúng 6 nhóm brief yêu cầu: **Website Overview** (tổng số mục), **Draft**, **Published**, **Pending Review** (4 stat card), **Recent Changes** (danh sách rỗng — chưa có CRUD nên chưa có thay đổi thật, hiển thị trạng thái rỗng rõ ràng thay vì giả lập dữ liệu), **Quick Actions** (9 nút điều hướng nhanh sang 9 nhóm còn lại).

**Toàn bộ số liệu là Mock, gắn nhãn rõ ràng** ("Dữ liệu mẫu — thay bằng dữ liệu thật ở WEB-SPR-002") — đúng yêu cầu "Không cần dữ liệu thật. Có thể dùng Mock." Không đọc/ghi bất kỳ bảng Supabase hay collection nào.

---

## 4. Workspace Layout

`src/components/admin/website/WebsiteWorkspaceShell.tsx` — bọc quanh cả 10 trang, hiển thị tiêu đề "Website Workspace" + thanh tab điều hướng ngang qua đúng 10 nhóm Canonical IA.

**Dùng đúng Shared Layout có sẵn, không xây layout riêng** (Task 3):
- **Shared Admin Layout** — mọi route `/admin/website/**` tự động nằm trong `(dashboard)/layout.tsx` → `AdminShell`, không cần khai báo lại.
- **Shared Breadcrumb** — `AdminBreadcrumb` (đã có từ ADM-SPR-002) tự suy ra "Admin › Website › [Tên nhóm]" từ `nav.ts`, không cần sửa gì thêm.
- **Shared Header** — `AdminHeader` (search, notification, user menu) kế thừa tự động.
- **Shared Permission Framework** — `requireAdmin`/`middleware.ts` (đã có từ ADM-SPR-001) kế thừa tự động, không mở rộng RBAC.
- **Shared Notification Area** — `AdminNotifications` (đã có từ ADM-SPR-002) kế thừa tự động.

`WebsiteWorkspaceShell` chỉ cộng thêm đúng một thứ mới: thanh tab điều hướng nội bộ 10 nhóm — không xây lại bất kỳ phần nào của Shell đã có.

---

## 5. Presentation Foundation

Đã chuẩn bị khung cho 8 khu vực Task 5 yêu cầu (Homepage, Landing, Navigation, Footer, CTA, SEO, Redirect, Announcement) — **Footer/CTA/Announcement không tách thành nhóm IA riêng** (Product Package chỉ định đúng 10 nhóm, không suy diễn thêm), mà nằm trong phạm vi của **Shared Sections** — đã ghi rõ trong nội dung trang đó.

Mỗi trong 9 trang non-Dashboard dùng chung 1 component `WorkspaceSectionFoundation` — hiển thị: phạm vi sẽ quản lý, danh sách "Sẽ quản lý (WEB-SPR-002+)", và **"Hiện đang nằm ở đâu trên Portal"** — trích dẫn trực tiếp từ `docs/admin/PORTAL_COVERAGE_AUDIT.md` (Portal hiện tại là Reference Source duy nhất, đúng Founder Directive). Không có form/nút Thêm/Sửa/Xóa nào — đúng yêu cầu "Chưa cần CRUD."

---

## 6. Settings Foundation

Trang **Global Settings** (`/admin/website/global-settings`) liệt kê đúng 4 khu vực Task 6 yêu cầu dưới dạng Foundation (chưa có form thật): Website Settings, Global Presentation Settings, Homepage Configuration, Visibility Configuration — kèm ghi chú về khác biệt với `/admin/settings` (System Settings) đã nêu ở Mục 2.

---

## 7. Files Changed

**Mới (13 file):**
- `src/lib/admin/website/navigation.ts` — nguồn IA duy nhất (10 nhóm)
- `src/components/admin/website/WebsiteWorkspaceShell.tsx` — Workspace Layout
- `src/components/admin/website/WorkspaceSectionFoundation.tsx` — khối nội dung Foundation dùng chung
- `src/app/admin/(dashboard)/website/{pages,navigation,homepage,landing-pages,static-pages,shared-sections,seo,redirect,global-settings}/page.tsx` — 9 route con

**Sửa đổi (3 file):**
- `src/app/admin/(dashboard)/website/page.tsx` — thay `ComingSoon` bằng Dashboard thật (mock data)
- `src/lib/admin/nav.ts` — nhóm "Website" từ 1 mục Coming Soon → nhóm đầy đủ 10 mục
- `src/components/admin/AdminSidebar.tsx` — icon cho 9 route con mới

**Không đổi:** mọi Workspace khác (CKOS/Academy/Premium/Community/...), Portal, database, migration — đúng Task 7 "Không refactor Workspace khác. Không đụng CKOS/Academy/Premium."

---

## 8. Verification

- **Lint (`npm run lint`):** 0 lỗi, 5 warning có từ trước (không liên quan sprint này).
- **Type-check + Build (`npm run build`):** thành công, toàn bộ 10 route Website Workspace biên dịch.
- **Test (`npm run test`):** 139/139 pass, không regression.
- **Route Website Workspace (curl qua dev server):** cả 10 route trả về 200 (chuyển hướng login đúng thiết kế), không lỗi 500.
- **Script xác minh `nav.ts`:** 62→71 mục, không mất href nào, chỉ thêm đúng 9 route con mới.

---

## 9. WEB-SPR-002 Readiness

**SẴN SÀNG.** Website Workspace đã xuất hiện đầy đủ trong Admin với đúng 10 nhóm Canonical IA, Dashboard hoạt động (mock data), Shared Layout hoàn chỉnh, không ảnh hưởng Workspace nào khác, build/test đều pass.

**2 điểm cần PMO quyết định trước khi giao WEB-SPR-002** (đã nêu ở Mục 2, nhắc lại để rõ ràng cho việc lập kế hoạch):
1. Mối quan hệ giữa "SEO" của Website Workspace và mục "SEO" độc lập đã có sẵn ở sidebar.
2. Mối quan hệ giữa "Global Settings" của Website Workspace và "System Settings" đã có sẵn.

**Không có gì chặn** việc bắt đầu WEB-SPR-002 (Website Page Management) — cả 2 điểm trên là quyết định về phạm vi/đặt tên, không phải lỗi kỹ thuật, có thể xử lý song song với việc bắt đầu xây CRUD.
