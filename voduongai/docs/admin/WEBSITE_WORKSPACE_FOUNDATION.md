# WEBSITE WORKSPACE FOUNDATION — IMP-WEB-001 + IMP-WEB-002 (WEB-SPR-001/002, EPIC-WEB-001)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

**Cập nhật WEB-SPR-002 (Website Page Management Foundation) ở cuối tài liệu, từ "## WEB-SPR-002" trở xuống. Mục 1-9 bên dưới là báo cáo gốc của WEB-SPR-001, giữ nguyên không sửa.**

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

---
---

# WEB-SPR-002 — Website Page Management Foundation

Context: WEB-SPR-001 đã được PMO phê duyệt, Canonical IA đã khóa. Sprint này xây nền tảng quản lý Page — **không Landing Builder, không Visual Builder, không Block/Section Editor, không AI Generator** (Task 6). 2 điểm khác biệt SEO/Global Settings nêu ở Mục 2 chưa được PMO xử lý — không chặn sprint này vì phạm vi WEB-SPR-002 không đụng đến 2 mục đó.

## Task 1 — Website Page Registry

`src/components/admin/website/PageRegistry.tsx` — registry hoạt động thật (không phải mock tĩnh): List + Create + Edit + Delete, đọc/ghi qua `useCollection("website-pages", [])` (tầng localStorage, chưa có trong `SUPABASE_COLLECTIONS` — đúng mẫu "cầu nối 2 tầng" đã dùng cho 5 module CKOS mới ở ADM-SPR-003, không đổi schema Supabase nào). Mỗi Page có đúng 5 field Registry yêu cầu — Title, Slug, Status, Visibility, Updated Date — cộng thêm Page Type (discriminator) và SEO/Publish/Revision fields phục vụ Task 5.

`/admin/website/pages` hiển thị registry đầy đủ (không lọc loại trang) — đúng "quản lý toàn bộ Homepage/Landing Pages/Static Pages."

## Task 2 — Shared Page Structure

**Một schema duy nhất** (`WebsitePage` — `src/lib/admin/website/pageRegistry.ts`) cho cả 3 loại trang, phân biệt bằng field `pageType` — không có `HomepageSchema`/`LandingPageSchema`/`StaticPageSchema` riêng biệt. `/admin/website/homepage`, `/admin/website/landing-pages`, `/admin/website/static-pages` đều dùng lại đúng component `PageRegistry` với prop `lockedPageType` — chỉ lọc view và khóa Page Type khi tạo mới, không phải 3 hệ thống khác nhau.

## Task 3 — Page Overview

`src/components/admin/website/PageOverviewStats.tsx` — hiển thị Draft/Published/Archived (3 stat card) + Recently Updated (5 mục gần nhất), tính toán thật từ registry (không phải số hardcode). "Mock Data được phép" được đáp ứng bằng cách không seed dữ liệu giả — registry bắt đầu rỗng, số liệu là 0 cho tới khi có Page thật được tạo, thay vì hiển thị số liệu bịa. Xuất hiện trên cả `/admin/website/pages` (toàn bộ) và 3 trang loại riêng (đã lọc theo `lockedPageType`).

**Lưu ý:** brief liệt kê Draft/Published/Archived/Recently Updated cho Page Overview (không có Pending Review như Dashboard Workspace ở WEB-SPR-001) — đã làm đúng theo danh sách này, không tự thêm Pending Review vào Page Overview dù Lifecycle có trạng thái "Review".

## Task 4 — Page Lifecycle

`PAGE_LIFECYCLE_STATUSES` — đúng 5 trạng thái theo brief: **Draft → Review → Approved → Published → Archived** (khác với Lifecycle 6 trạng thái của CKOS ở ADM-SPR-003/004, vốn có thêm "Changes Requested" — hai Workspace có 2 lifecycle riêng biệt, đúng tinh thần "mỗi content type có thể bổ sung field đặc thù"). Đã thêm tông màu `Review` (xanh dương) vào `Badge.tsx` `STATUS_TONE` — cộng thêm, không đổi các key có sẵn (kể cả `Approved`/`Archived` đã có từ CKOS, tái sử dụng đúng ý nghĩa). **Chưa có Workflow Engine** — chuyển trạng thái là một dropdown chọn tay trong tab Publish, không có gate/duyệt tự động, đúng yêu cầu "Chưa cần Workflow Engine."

## Task 5 — Page Detail Placeholder

Form Sửa/Thêm Page có đúng 5 tab theo brief: **General** (Title/Slug/Page Type), **SEO** (SEO Title/SEO Description — chỉ 2 field đơn giản, không có công cụ SEO nâng cao), **Visibility** (nút bật/tắt Visible), **Publish** (Status + Published Date), **Revision** (Updated Date tự động + ghi chú thay đổi dạng nhật ký, không có diff engine — cùng mẫu changelog đã dùng ở CKOS). **Chỉ Foundation** — không có field nào chỉnh nội dung/bố cục trang thật (không body, không section, không block).

## Task 6 — Giới hạn đã tuân thủ

Không có Visual Builder, Block Editor, Section Editor, Landing Builder, hay AI Generator ở bất kỳ đâu trong sprint này — xác nhận bằng cách rà lại toàn bộ file mới: chỉ có input/select/textarea đơn giản cho metadata, không có trình soạn thảo nội dung nào (kể cả `KnowledgeEditor` của CKOS cũng không được tái sử dụng ở đây, vì Task 5 chỉ yêu cầu Foundation, không yêu cầu soạn nội dung).

## Files Changed

**Mới (3 file):**
- `src/lib/admin/website/pageRegistry.ts` — schema `WebsitePage`, 5-state lifecycle, 3 page type
- `src/components/admin/website/PageRegistry.tsx` — list + tabbed detail form (Task 1, 2, 5)
- `src/components/admin/website/PageOverviewStats.tsx` — Task 3

**Sửa đổi (5 file, đều cộng thêm):**
- `src/components/admin/ui/Badge.tsx` — thêm tông `Review`
- `src/app/admin/(dashboard)/website/pages/page.tsx` — Foundation placeholder → Registry đầy đủ + Overview
- `src/app/admin/(dashboard)/website/homepage/page.tsx` — → Registry lọc "Homepage"
- `src/app/admin/(dashboard)/website/landing-pages/page.tsx` — → Registry lọc "Landing Page"
- `src/app/admin/(dashboard)/website/static-pages/page.tsx` — → Registry lọc "Static Page", giữ nguyên lưu ý về trang pháp lý từ WEB-SPR-001

**Không đổi:** Navigation/Shared Sections/SEO/Redirect/Global Settings (5 trang còn lại) vẫn là Foundation placeholder như WEB-SPR-001 — đúng Scope sprint này chỉ giới hạn ở Pages/Homepage/Landing Pages/Static Pages. `nav.ts` không đổi (IA đã khóa, không có route mới cần thêm). Mọi Workspace khác, Portal, database — không đổi.

## Verification

- **Lint (`npm run lint`):** phát hiện 6 lỗi thật (`react/no-unescaped-entities` — dấu ngoặc kép thẳng trong JSX text ở 3 file), đã sửa bằng `&quot;`. Sau khi sửa: 0 lỗi, 5 warning có từ trước.
- **Type-check + Build (`npm run build`):** thành công.
- **Test (`npm run test`):** 139/139 pass, không regression.
- **Route (curl qua dev server):** cả 4 route (`pages`/`homepage`/`landing-pages`/`static-pages`) trả về 200, không lỗi 500.

## WEB-SPR-003 Readiness

**SẴN SÀNG.** Page Registry hoạt động thật, Shared Page Structure thống nhất (1 schema, 3 loại), Lifecycle Foundation tồn tại (5 trạng thái, không workflow engine), không ảnh hưởng Workspace nào khác, build/test đều pass.

**Nhắc lại 2 điểm chưa xử lý từ WEB-SPR-001** (SEO và Global Settings trùng tên với mục cấp cao nhất sẵn có) — vẫn chưa được PMO quyết định, chưa ảnh hưởng gì tới WEB-SPR-002 vì sprint này không đụng 2 khu vực đó, nhưng cần giải quyết trước khi Sprint nào đó động vào SEO/Global Settings thật.

**Gợi ý cho WEB-SPR-003** (không phải quyết định, chỉ là input): registry hiện chưa seed Page nào — khi PMO sẵn sàng, có thể cân nhắc tạo sẵn 1 bản ghi "Trang chủ" (Homepage) khớp với Portal thật để Dashboard/Overview có số liệu khác 0 ngay từ đầu, thay vì registry trống hoàn toàn.
