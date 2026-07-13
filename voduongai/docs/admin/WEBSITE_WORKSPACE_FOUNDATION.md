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

---
---

# WEB-SPR-003 — Website Navigation Management Foundation

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Objective: xây **Navigation Management Foundation** — **không Menu Builder, không Drag & Drop** (và không Mega Menu Builder/Dynamic Menu Engine/AI Menu/Permission Engine, theo đúng brief). Foundation quản lý cấu trúc Navigation Group + Navigation Item bằng CRUD thường và field số `Sort Order` nhập tay, không có UI kéo-thả nào.

## 1. Navigation Registry (Task 1)

`src/lib/admin/website/navigationRegistry.ts` — data model chung, dùng cơ chế `useCollection()` hai tầng có sẵn (tầng localStorage — `website-navigation-groups`/`website-navigation-items` chưa nằm trong `SUPABASE_COLLECTIONS`, cùng bridge pattern đã dùng cho Website Page Registry ở WEB-SPR-002).

## 2. Navigation Group (Task 2)

`NavigationGroup`: `id, name, location (Header|Sidebar), description, sortOrder, status, updatedDate`. Một Group tương ứng một menu thật — VD "Main Nav (Header)" tương ứng `mainNav` trong `src/lib/site.ts`, "Portal Sidebar — Chính/Phụ" tương ứng 2 nhóm trong `portalNavSections` (`src/lib/portal/hubs.ts`).

**Location chỉ có `Header`/`Sidebar`** — không thêm `Footer`, vì link Footer đã thuộc "Shared Sections" theo `docs/admin/workspaces/website-workspace.md` §3 (mục 7) — tránh chồng lấn phạm vi giữa 2 nhóm IA.

## 3. Navigation Item (Task 3)

`NavigationItem`: `id, groupId, label, url, sortOrder, visibilityRule, status, updatedDate`. Phẳng, không có cấp con/sub-menu (đúng "không Mega Menu Builder").

## 4. Visibility Rule Foundation (Task 4)

Field `visibilityRule` (`Everyone` / `Logged-in Only` / `Admin Only`) trên mỗi Item — **chỉ là metadata mô tả ý định hiển thị, không có Permission Engine đứng sau thực thi** (không route Portal nào đọc/kiểm tra field này). Ghi rõ trực tiếp trong UI (`NavigationRegistry.tsx`) để tránh hiểu nhầm đây là access control đang hoạt động — đúng "không triển khai Permission Engine" trong brief.

## 5. Navigation Preview (Task 5)

`src/components/admin/website/NavigationPreview.tsx` — bản xem thử **chỉ đọc**: Header hiển thị dạng hàng ngang, Sidebar hiển thị dạng danh sách dọc theo từng Group (có dấu ngăn cách giữa các Group, giống thật), chỉ lấy Group/Item ở trạng thái `Active`. Không kéo-thả, không sửa trực tiếp trên Preview. Đây **không phải Portal thật** — Portal công khai vẫn đọc trực tiếp từ `site.ts`/`hubs.ts`, Registry này Consumer = 0 (giống Page Registry ở WEB-SPR-002/website-workspace.md §7).

## 6. Navigation Status (Task 6)

`NAVIGATION_STATUSES = ["Draft", "Active", "Inactive", "Archived"]` — vòng đời **riêng** của Navigation, khác 5 trạng thái Draft→Review→Approved→Published→Archived của Website Page (WEB-SPR-002), vì Navigation là kết cấu điều hướng không cần approval nội dung nhiều bước. Dùng lại đúng 4 tone đã có sẵn trong `Badge.tsx` (`Draft`/`Active`/`Inactive`/`Archived`) — **không cần thêm tone mới**, không đụng `STATUS_TONE`.

## 7. Mock Data (Task 7)

Seed trong `navigationRegistry.ts` (`NAVIGATION_GROUPS_SEED`/`NAVIGATION_ITEMS_SEED`) sao chép **đúng nội dung menu thật** đang chạy trên Portal — 4 mục `mainNav` (Header) và 10 mục `portalNavSections` (Sidebar, tách 2 Group "Chính"/"Phụ" đúng cấu trúc code hiện tại có dấu ngăn cách) — không phải dữ liệu bịa/test ngẫu nhiên. Quyết định này theo đúng lưu ý của Founder trước đó ("Trang Admin mới phải bám sát portal đang có ở hiện tại! Dữ liệu cũ của mình chỉ là tự test chứ chưa phải là thật") — Registry khởi tạo bằng bản sao có thể chỉnh sửa của menu thật, không phải placeholder vô nghĩa.

## Files Changed

- `src/lib/admin/website/navigationRegistry.ts` — mới, data model + seed
- `src/components/admin/website/NavigationRegistry.tsx` — mới, CRUD Group + Item (2 bảng, chọn Group để quản lý Item của Group đó)
- `src/components/admin/website/NavigationPreview.tsx` — mới, Preview chỉ đọc
- `src/app/admin/(dashboard)/website/navigation/page.tsx` — thay `WorkspaceSectionFoundation` placeholder bằng `NavigationRegistry` + `NavigationPreview` thật

**Không đổi:** Pages/Homepage/Landing Pages/Static Pages (WEB-SPR-002), Dashboard/Shared Sections/SEO/Redirect/Global Settings (vẫn Foundation placeholder). `nav.ts`/`AdminSidebar.tsx` không đổi (route Navigation đã tồn tại từ WEB-SPR-001). Mọi Workspace khác, Portal, database — không đổi. `src/lib/site.ts`/`src/lib/portal/hubs.ts` (menu thật của Portal) **không bị đụng vào** — chỉ đọc để sao chép làm mock data, Registry chưa nối dây ngược lại Portal.

## Verification

- **Lint (`npm run lint`):** phát hiện 1 lỗi thật (`react-hooks/set-state-in-effect` — gọi `setState` đồng bộ trong `useEffect` để chọn Group mặc định đầu tiên), đã sửa bằng cách suy ra `selectedGroupId` trực tiếp trong lúc render (`explicitSelectedGroupId ?? sortedGroups[0]?.id ?? null`) thay vì effect. Sau khi sửa: 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công.
- **Test (`npm run test`):** 139/139 pass, không regression.

## WEB-SPR-004 Readiness

**SẴN SÀNG.** Navigation Foundation hoàn chỉnh (Registry + Preview + Status + Visibility Rule metadata), Shared Structure nhất quán với Page Registry (cùng dùng `useCollection`, cùng pattern Badge/Modal/ConfirmDialog), không ảnh hưởng Workspace nào khác, build/test đều pass.

**Nhắc lại các điểm chưa xử lý:** 2 điểm SEO/Global Settings (từ WEB-SPR-001) vẫn chưa được PMO quyết định. Ngoài ra, Navigation Registry hiện tách biệt hoàn toàn với `site.ts`/`hubs.ts` — khi nào Portal thật sự đọc menu từ Registry này (thay vì hardcode) là quyết định của một Sprint "Website Publish Bridge" tương lai, chưa nằm trong phạm vi WEB-SPR-003.

---
---

# WEB-SPR-004 — Website Shared Sections Foundation

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Objective: xây **Shared Sections Management Foundation** — **không Section Builder, không Landing Builder, không AI Generator, không Dynamic Layout Engine, không Drag & Drop**. Registry quản lý NỘI DUNG/COPY (headline/body/CTA) của khối dùng chung, không quản lý bố cục/thiết kế trực quan.

## 1. Shared Section Registry (Task 1)

`src/lib/admin/website/sharedSectionRegistry.ts` — MỘT schema `SharedSection` duy nhất dùng chung cho cả 9 category (Task 2), đúng nguyên tắc Shared Structure đã áp dụng cho Page Registry (WEB-SPR-002) và Navigation Registry (WEB-SPR-003). Persist qua `useCollection()` hai tầng có sẵn (tầng localStorage — `website-shared-sections` chưa nằm trong `SUPABASE_COLLECTIONS`).

## 2. Section Categories (Task 2)

Đúng 9 category theo Scope của brief, khóa, không tự thêm/bớt: **Hero, CTA, Banner, Feature, Founder, Testimonial, FAQ, Footer, Announcement**.

## 3. Section Status (Task 3)

`SECTION_STATUSES = ["Draft", "Review", "Approved", "Published", "Archived"]` — vòng đời **riêng** của Shared Section, khác 4 trạng thái Draft/Active/Inactive/Archived của Navigation (WEB-SPR-003). Nội dung Section là copy marketing thật (Hero/CTA/Founder Story...), cần bước xem xét trước khi lên production — gần bản chất Website Page hơn cấu trúc menu thuần túy, nên dùng lại đúng 5 trạng thái Page Lifecycle (WEB-SPR-002). Dùng lại đúng các tone Badge đã có sẵn (`Review`/`Approved` đã thêm từ trước) — **không cần thêm tone mới**.

## 4. Visibility Rule Foundation (Task 4)

Dùng lại **đúng** `VisibilityRule`/`VISIBILITY_RULES` (Everyone/Logged-in Only/Admin Only) đã định nghĩa ở Navigation Registry (WEB-SPR-003) — import trực tiếp, không định nghĩa lại. Cùng giới hạn đã ghi nhận: **chỉ là metadata, không có Permission Engine** thực thi.

## 5. Preview Placeholder (Task 5)

`SharedSectionPreviewPlaceholder.tsx` — **cố ý nhẹ hơn** Navigation Preview (WEB-SPR-003). Navigation Preview dựng lại đúng hình dạng thật vì cấu trúc menu đơn giản (hàng ngang/danh sách dọc); Section có bố cục/thiết kế trực quan riêng cho từng loại — dựng lại đúng bố cục đó là việc của Visual Builder, ngoài phạm vi Foundation này. Vì vậy đây chỉ là khung nét đứt hiển thị Headline/Body/CTA dạng **văn bản thuần** (chỉ Section đang `Published`) — xem trước NỘI DUNG, không phải xem trước GIAO DIỆN.

## 6. Mock Data (Task 6)

Seed 9 mục (1/category) trong `sharedSectionRegistry.ts`. Theo đúng lưu ý "bám sát portal đang có ở hiện tại" của Founder:

- **Có nguồn hardcode thật, sao chép sát nội dung:** Hero (`Hero.tsx`/`siteConfig`), CTA (`FinalCTA.tsx`), Feature (`Solution.tsx`, pillar "AI ứng dụng"), Founder (`FounderStory.tsx`), Footer (`Footer.tsx`, đoạn mô tả thương hiệu).
- **Không có nguồn hardcode 1-1, đánh dấu rõ "minh họa" trong chính nội dung seed** (không phải copy nguyên văn để tránh gây hiểu nhầm là nội dung thật đã tồn tại):
  - **Banner** — nội dung banner thật đã có Admin CRUD và đã nối dây thật (`portal_banners` → `NotificationTicker.tsx`), Registry mới này KHÔNG thay thế nó.
  - **Testimonial** — Portal hiện chỉ có `TrustStats.tsx` (số liệu cộng đồng), không có trích dẫn khách hàng thật nào trên Home.
  - **FAQ** — chưa tìm thấy khối FAQ marketing công khai nào trên Home (CKOS có FAQs riêng nhưng thuộc CKOS Workspace, khác phạm vi).
  - **Announcement** — Portal hiện không phân biệt Banner và Announcement (cùng qua `portal_banners`); ranh giới 2 category này cần PMO xác nhận.

## Files Changed

- `src/lib/admin/website/sharedSectionRegistry.ts` — mới, data model + seed
- `src/components/admin/website/SharedSectionRegistry.tsx` — mới, CRUD (list + filter theo category/status + modal)
- `src/components/admin/website/SharedSectionPreviewPlaceholder.tsx` — mới, Preview Placeholder chỉ đọc
- `src/app/admin/(dashboard)/website/shared-sections/page.tsx` — thay `WorkspaceSectionFoundation` placeholder bằng `SharedSectionRegistry` + `SharedSectionPreviewPlaceholder` thật

**Không đổi:** Pages/Homepage/Landing Pages/Static Pages (WEB-SPR-002), Navigation (WEB-SPR-003), Dashboard/SEO/Redirect/Global Settings (vẫn Foundation placeholder). `nav.ts`/`AdminSidebar.tsx` không đổi (route Shared Sections đã tồn tại từ WEB-SPR-001). `Badge.tsx` không đổi (dùng lại tone có sẵn). Mọi Workspace khác, Portal, database — không đổi. `src/components/home/*.tsx`/`Footer.tsx` (nội dung thật của Portal) **không bị đụng vào** — chỉ đọc để sao chép làm mock data.

## Verification

- **Lint (`npm run lint`):** sạch — 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công.
- **Test (`npm run test`):** 139/139 pass, không regression.

## WEB-SPR-005 Readiness

**SẴN SÀNG.** Shared Section Foundation hoàn chỉnh (Registry hoạt động thật, Shared Structure nhất quán với Page/Navigation Registry, Status/Visibility Rule/Preview Placeholder đều có), không ảnh hưởng Workspace nào khác, build/test đều pass.

**Cần PMO quyết định (mới phát hiện ở sprint này):**
- Ranh giới **Banner vs Announcement** — Portal hiện chỉ có 1 cơ chế (`portal_banners`) cho cả hai, chưa rõ đây là 2 khái niệm sản phẩm khác nhau hay 1 khái niệm duy nhất bị brief liệt kê thành 2 category.
- **Testimonial và FAQ marketing công khai** — hiện không tồn tại trên Home, cần Founder xác nhận có phải xây nội dung mới (ngoài phạm vi Registry, đây là quyết định content) hay bỏ 2 category này khỏi Shared Sections.

**Nhắc lại các điểm chưa xử lý:** 2 điểm SEO/Global Settings (từ WEB-SPR-001) vẫn chưa được PMO quyết định.

---
---

# WEB-SPR-005 — Website SEO & Redirect Foundation

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Objective: xây **SEO Foundation** + **Redirect Foundation** — **không SEO Generator, không AI SEO, không Sitemap Generator, không Robots Generator, không Redirect Engine Runtime**.

> ⚠️ **Nhắc lại chồng lấn đã ghi nhận từ WEB-SPR-001 (chưa PMO xử lý):** sidebar Admin đã có sẵn một mục "SEO" độc lập ở cấp cao nhất (`/admin/seo`, ADM-SPR-002, ComingSoon) — phạm vi rộng hơn nhóm "SEO" của Website Workspace (chỉ SEO cho nội dung Website). Sprint này xây đúng theo Scope Website Workspace đã khóa (nhóm IA #8), KHÔNG tự gộp/xóa mục `/admin/seo` — vẫn chờ PMO quyết định.

## 1. SEO Registry Foundation (Task 1) + 3. Shared SEO Structure (Task 3)

`src/lib/admin/website/seoRegistry.ts` — MỘT schema `SEOEntry` áp dụng cho bất kỳ URL nào thuộc Website, phân biệt bằng `targetUrl` (không dùng khóa ngoại tới Page Registry, tránh phụ thuộc cứng). Đúng phạm vi Scope: Meta Title, Meta Description, Open Graph (title/description/image ghi chú), Canonical URL, Robots (index/follow dạng checkbox), Sitemap (Foundation — chỉ cờ `sitemapInclude`, không có Sitemap Generator thật).

**"Shared SEO Structure" (Task 3)** được hiện thực hóa theo 2 cách: (1) một schema `SEOEntry` duy nhất dùng chung mọi URL — không tạo schema riêng theo loại trang; (2) SEO Registry và Redirect Registry (Task 2) **dùng lại đúng một Status model** — cả hai cùng import `NAVIGATION_STATUSES`/`NavigationStatus` từ `navigationRegistry.ts` (WEB-SPR-003) thay vì mỗi Registry tự định nghĩa Status riêng.

## 2. Redirect Registry Foundation (Task 2)

`src/lib/admin/website/redirectRegistry.ts` — `RedirectEntry`: `fromPath, toPath, redirectType (301|302), note, status, sortOrder`. **Không có Redirect Engine Runtime** — Registry chỉ lưu danh sách, không có middleware/route nào đọc Registry này để thực sự chuyển hướng request thật; toàn bộ redirect thật của Portal vẫn khai báo tĩnh trong `next.config.ts` (Consumer = 0, giống mọi Registry khác của Website Workspace).

## 4. Validation Placeholder (Task 4)

Hai kiểm tra độc lập, cả hai đều rõ ràng gắn nhãn "Placeholder" trong UI — **không phải Audit/Validation Engine đầy đủ**:

- **SEO:** đếm ký tự Meta Title (khuyến nghị ≤60) và Meta Description (khuyến nghị ≤160), hiển thị badge xanh/cam ngay trong bảng và trong form. Không kiểm tra keyword, không kiểm tra trùng lặp nội dung.
- **Redirect:** cảnh báo (a) `From Path` = `To Path` (vòng lặp tự redirect chính nó) và (b) `From Path` bị khai báo trùng ở nhiều rule đang `Active` (xung đột). Không kiểm tra vòng lặp gián tiếp nhiều bước, không đối chiếu với `next.config.ts` thật.

## 5. Preview Placeholder (Task 5)

`SEOPreviewPlaceholder.tsx` — minh họa dạng kết quả tìm kiếm Google (Title xanh/URL xanh lá/Description xám) dựng từ Meta Title/Description của SEO Entry đang `Active`. Ghi rõ đây là hình dạng **gần đúng**, không phải render pixel-perfect của Google SERP thật. (Redirect không có Preview riêng — bản chất là danh sách rule, không có gì để "xem trước" ngoài chính bảng Registry.)

## 6. Mock Data (Task 6)

- **SEO:** 3 mục sao chép sát Meta Title/Description THẬT đang hardcode — Trang chủ (SEO mặc định toàn site, tham chiếu `settings.seoTitle`/`settings.seoDescription` từ `layout.tsx`, **không trùng lặp/thay thế** `SiteSettings`), Blog AI (`src/app/blogai/page.tsx`), Giới thiệu (`src/app/about/page.tsx`).
- **Redirect:** 4 rule sao chép đúng từ `next.config.ts` (`redirects()`) — gồm 2 route đã xác nhận "chết" ở ADM-SPR-005 (`student-success`, `updates`). Sao chép chỉ để Founder xem/quản lý danh sách, **không** thay thế `next.config.ts` thật.

## Files Changed

- `src/lib/admin/website/seoRegistry.ts`, `redirectRegistry.ts` — mới, data model + seed
- `src/components/admin/website/SEORegistry.tsx`, `SEOPreviewPlaceholder.tsx`, `RedirectRegistry.tsx` — mới
- `src/app/admin/(dashboard)/website/seo/page.tsx`, `redirect/page.tsx` — thay Foundation placeholder bằng UI thật

**Không đổi:** Pages/Homepage/Landing Pages/Static Pages (WEB-SPR-002), Navigation (WEB-SPR-003), Shared Sections (WEB-SPR-004), Dashboard/Global Settings (vẫn Foundation placeholder). `nav.ts`/`AdminSidebar.tsx`/`Badge.tsx` không đổi. Mọi Workspace khác, Portal, database, `next.config.ts` — không đổi.

## Verification

- **Lint (`npm run lint`):** sạch — 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công.
- **Test (`npm run test`):** 139/139 pass, không regression.

## WEB-SPR-006 Readiness

**SẴN SÀNG.** SEO Foundation + Redirect Foundation đều hoàn chỉnh, Shared Structure nhất quán (Status model dùng chung, cùng pattern Badge/Modal/ConfirmDialog/useCollection với các Registry trước), không ảnh hưởng Workspace nào khác, build/test đều pass.

**Nhắc lại các điểm chưa xử lý:**
- SEO (Website Workspace) vs. mục "SEO" độc lập cấp cao nhất — vẫn chưa PMO quyết định (từ WEB-SPR-001, nhắc lại ở đây).
- Global Settings vs. System Settings — vẫn chưa PMO quyết định (từ WEB-SPR-001).
- Banner vs. Announcement (từ WEB-SPR-004) — vẫn chưa PMO quyết định.
- Registry chưa nối dây để Portal/`next.config.ts` đọc từ đây — thuộc phạm vi một Sprint "Website Publish Bridge" tương lai, chưa nằm trong WEB-SPR-005.

---
---

# WEB-SPR-006 — Website Workspace Feature Freeze Candidate

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Objective: rà soát toàn bộ Website Workspace Foundation (WEB-SPR-001 đến 005) trước Feature Freeze — **không thêm feature mới**, chỉ chuẩn hóa/đồng bộ/hoàn thiện/kiểm thử. Không triển khai Builder/AI/Runtime/Visual Editor/Landing Editor.

## Task 1 — Audit toàn bộ Website Workspace

Đọc lại toàn bộ 10 route (`/admin/website/*`), 5 Registry lib (`pageRegistry.ts`, `navigationRegistry.ts`, `sharedSectionRegistry.ts`, `seoRegistry.ts`, `redirectRegistry.ts`), toàn bộ component Registry/Preview, `WebsiteWorkspaceShell.tsx`, `WorkspaceSectionFoundation.tsx`, `nav.ts`, `AdminSidebar.tsx`.

## Task 2 — Information Architecture

Đối chiếu `nav.ts` (nhóm `"Website"`) với `WEBSITE_WORKSPACE_SECTIONS` (`src/lib/admin/website/navigation.ts`) — **khớp 100%**, đúng 10 cặp label/href, không thiếu/thừa/lệch thứ tự. Không có vấn đề.

## Task 3 — Shared Components

Cả 5 Registry (Page/Navigation/Shared Section/SEO/Redirect) dùng nhất quán: `useCollection` (2 tầng), `genId`, `useAdminToast`, `Modal`/`ConfirmDialog`, `Badge`/`STATUS_TONE`. Không phát hiện lệch pattern. Xác nhận **6 collection key** (`website-pages`, `website-navigation-groups`, `website-navigation-items`, `website-shared-sections`, `website-seo-entries`, `website-redirect-entries`) — không trùng nhau (grep xác nhận).

## Task 4 — Navigation

`NavigationRegistry`/`NavigationPreview` hoạt động đúng theo thiết kế WEB-SPR-003, không phát hiện lỗi.

## Task 5 — SEO Foundation

`SEORegistry`/`SEOPreviewPlaceholder` hoạt động đúng theo thiết kế WEB-SPR-005, Validation Placeholder (đếm ký tự) hoạt động đúng, không phát hiện lỗi.

## Task 6 — Redirect Foundation

`RedirectRegistry` hoạt động đúng, Validation Placeholder (From=To, trùng From Path) hoạt động đúng, không phát hiện lỗi.

## Task 7 — Shared Page Structure

`WebsitePage` (1 schema, discriminator `pageType`) được dùng nhất quán ở cả 3 route type-specific (`homepage`/`landing-pages`/`static-pages`, đều qua `lockedPageType`) và route tổng hợp `pages`. Không phát hiện lỗi.

## Task 8 — Mock Data

Không có xung đột: 6 collection key duy nhất (Task 3), mọi `genId(...)` dùng đúng collection key làm prefix nên không trùng ID giữa các Registry.

## Phát hiện & Đã sửa (P1 — Acceptance yêu cầu "Không có P0/P1")

1. **Dashboard hiển thị dữ liệu mẫu toàn số 0.** `src/app/admin/(dashboard)/website/page.tsx` (WEB-SPR-001) có `MOCK_OVERVIEW`/`MOCK_RECENT_CHANGES` hardcode với ghi chú "sẽ thay bằng dữ liệu thật ở WEB-SPR-002" — nhưng WEB-SPR-002 đến 005 đều dựng Registry thật mà không Sprint nào quay lại nối Dashboard vào đó. **Đã sửa:** Dashboard giờ đọc thật từ cả 6 collection (Page/Navigation Group/Navigation Item/Shared Section/SEO/Redirect), tính `Tổng số mục`/`Draft`/`Published hoặc Active`/`Pending Review`, và `Recent Changes` lấy 5 thay đổi gần nhất thật (gộp theo `updatedDate`). Không thêm entity/tính năng mới — chỉ đọc dữ liệu đã tồn tại.
2. **Text lỗi thời tham chiếu "WEB-SPR-002" như mốc tương lai.** `WorkspaceSectionFoundation.tsx` ("Sẽ quản lý (WEB-SPR-002+)"), `global-settings/page.tsx` ("trình PMO quyết định ở WEB-SPR-002"), `WebsiteWorkspaceShell.tsx` ("CRUD chi tiết sẽ triển khai ở WEB-SPR-002 trở đi") — cả 3 đều viết ở WEB-SPR-001 khi WEB-SPR-002 còn là tương lai; nay đã qua 5 Sprint. **Đã sửa:** cập nhật text phản ánh đúng hiện trạng (5/10 nhóm đã có Registry thật, Global Settings còn Foundation placeholder, chồng lấn System Settings vẫn mở — không gắn với số Sprint cụ thể nào nữa).

Không phát hiện P0 nào.

## Task 9 — Đề xuất danh sách còn thiếu trước Feature Freeze

**Cần một Sprint kỹ thuật riêng:**
- **Global Settings** — nhóm IA cuối cùng (10/10) chưa có Registry thật, vẫn Foundation placeholder.

**Cần PMO/Founder quyết định trước khi Sprint tiếp theo động vào các khu vực này (đã ghi nhận nhiều lần, nhắc lại lần cuối ở đây):**
- SEO (Website Workspace) vs. mục "SEO" độc lập cấp cao nhất (`/admin/seo`).
- Global Settings vs. System Settings (`/admin/settings`).
- Banner vs. Announcement (Shared Sections) — cùng dùng `portal_banners`.
- Testimonial/FAQ marketing công khai — chưa tồn tại thật trên Portal, cần quyết định xây mới hay bỏ category.
- Brand Studio/Media Center tách hay gộp (ảnh hưởng Shared Sections — cần media từ đó cho OG Image/Founder photo...).

**Khoảng cách lớn nhất, chưa nằm trong bất kỳ WEB-SPR nào tính đến nay:** cả 5 Registry (Page/Navigation/Shared Section/SEO/Redirect) đều **Consumer = 0** — Portal công khai và `next.config.ts` vẫn đọc trực tiếp từ code (`site.ts`, `hubs.ts`, `home/*.tsx`, `Footer.tsx`), chưa Sprint nào nối Registry vào Portal thật. Đây là điều kiện để đạt đúng Mission đã ghi trong `docs/admin/workspaces/website-workspace.md` ("Founder tự vận hành toàn bộ trải nghiệm website công khai... không cần deploy code") — đề xuất một Sprint "Website Publish Bridge" làm bước tiếp theo sau Feature Freeze.

## Files Changed

- `src/app/admin/(dashboard)/website/page.tsx` — Dashboard: dữ liệu mẫu → dữ liệu thật từ 6 collection
- `src/components/admin/website/WorkspaceSectionFoundation.tsx` — sửa text lỗi thời + comment
- `src/components/admin/website/WebsiteWorkspaceShell.tsx` — sửa text intro lỗi thời
- `src/app/admin/(dashboard)/website/global-settings/page.tsx` — sửa text lỗi thời

**Không đổi:** mọi Registry/schema/route khác giữ nguyên hành vi — sprint này chỉ audit + sửa text/dữ liệu hiển thị, không thêm entity/CRUD/route mới.

## Verification

- **Lint (`npm run lint`):** sạch — 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công (toàn bộ 10 route `/admin/website/*` build ở dạng `ƒ` — dynamic, đúng vì nằm sau Admin auth middleware).
- **Test (`npm run test`):** 139/139 pass, không regression.

## Kết luận — Feature Freeze Readiness

**SẴN SÀNG FEATURE FREEZE ở cấp Foundation.** Không có P0. Không có P1 còn tồn đọng (2 P1 phát hiện đã sửa ngay trong sprint này). 9/10 nhóm IA có Registry hoạt động thật với Shared Structure nhất quán; 1/10 (Global Settings) còn Foundation placeholder — không phải lỗi, mà là phạm vi chưa được giao ở bất kỳ WEB-SPR nào tính đến nay.

**Lưu ý về phạm vi "Feature Freeze":** đóng băng đúng những gì đã xây (Foundation — Registry + Shell + Preview/Validation Placeholder), **không phải** xác nhận Portal đã thực sự chạy bằng dữ liệu từ các Registry này (Consumer = 0 cho cả 5 Registry, xem Task 9). Founder/PMO cần quyết định rõ: Feature Freeze ở đây đóng băng scope Foundation hiện tại, việc nối Registry vào Portal thật là quyết định của Sprint tiếp theo, không tự động đi kèm Feature Freeze.

---
---

# WEB-SPR-201 — Website Workspace Foundation (EPIC-02 Phase 2, IMP-WEB-201)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

> ⚠️ **Phát hiện tiền đề:** Brief IMP-WEB-201 mô tả 10 module Scope như thể triển khai từ đầu, nhưng đối chiếu code cho thấy **9/10 module đã hoàn thành từ WEB-SPR-001 đến WEB-SPR-006** (cùng session này) — Dashboard, Pages/Homepage/Landing Pages/Static Pages (Page Registry), Navigation, Shared Sections, SEO, Redirect đều đã có Registry thật hoạt động. Không tự rebuild từ đầu (rủi ro regression không cần thiết) — đã audit hiện trạng, xác nhận khớp Scope, và triển khai đúng **2 khoảng trống thật** mà brief này lần đầu chỉ rõ: (1) Navigation cần thêm Footer Menu/External Links (trước đó chỉ Header/Sidebar); (2) Global Settings — module duy nhất còn là Foundation placeholder (WEB-SPR-006 đã ghi nhận) — nay có Registry thật.

## Task 1-2, 4-9 — Đã hoàn thành từ trước, xác nhận lại

Dashboard (WEB-SPR-001, hoàn thiện dữ liệu thật WEB-SPR-006), Pages/Homepage/Landing Pages/Static Pages (WEB-SPR-002, Page Registry dùng chung 1 schema), Shared Sections (WEB-SPR-004, 9 category), SEO (WEB-SPR-005), Redirect (WEB-SPR-005) — build/test xác nhận vẫn hoạt động đúng sau các thay đổi của sprint này, không có regression.

## Task 3 — Navigation Management: mở rộng Footer Menu + External Links

`navigationRegistry.ts`: `NAVIGATION_LOCATIONS` mở rộng từ `["Header", "Sidebar"]` thành `["Header", "Sidebar", "Footer", "External"]`. Seed thêm 3 Group/13 Item mới, bám sát nguồn thật:
- **Footer — Học viện AI** + **Footer — Tài nguyên** (2 cột, 9 link) — nguồn `src/components/site/Footer.tsx`.
- **External — Mạng xã hội** (4 link) — nguồn `siteConfig.links` (`src/lib/site.ts`).

**Phát hiện mới khi seed dữ liệu:** Footer link "Hệ tri thức AI (CKOS)" trỏ `/portal/hetrithucai`, **KHÁC** với `/portal/ckos` dùng ở Sidebar — cùng khái niệm CKOS nhưng 2 route khác nhau trong CHÍNH menu công khai (không chỉ giữa các trang riêng lẻ như ADM-SPR-200 phát hiện) — củng cố mạnh phát hiện đã ghi nhận, cho thấy đây là bất nhất thật trong điều hướng Portal, không phải trùng hợp ngẫu nhiên.

`NavigationPreview.tsx` được viết lại tổng quát — lặp qua `NAVIGATION_LOCATIONS` thay vì 2 khối hardcode Header/Sidebar, tự động hỗ trợ Footer/External mà không cần sửa lại nếu có location mới trong tương lai.

**Ranh giới Navigation vs Shared Sections cho Footer:** Navigation sở hữu MENU chân trang (danh sách link); Shared Sections tiếp tục sở hữu COPY/branding của khối Footer (đã có category "Footer" từ WEB-SPR-004) — 2 khái niệm khác nhau dùng chung tên, không chồng lấn dữ liệu, đã ghi rõ trong code + WCS.

## Task 10 — Global Website Settings (module mới hoàn toàn)

`globalSettings.ts` + `GlobalWebsiteSettingsForm.tsx` — **1 record duy nhất** (singleton, cùng pattern `globalBrandSettings.ts`/`GlobalBrandSettingsForm` của Brand Studio, BRAND-SPR-001). Đúng 4 mục Task 10 yêu cầu:
- **Website Announcement** — text + cờ bật/tắt (chỉ metadata, chưa nối `NotificationTicker` thật).
- **Default Homepage** — ghi chú tham chiếu Page Registry (hiện trống — chưa có Page nào được seed).
- **Visibility** — `SITE_VISIBILITY_MODES` (Public/Maintenance Mode/Coming Soon), Foundation only — đổi giá trị KHÔNG bật/tắt site thật.
- **Presentation Settings** — ghi chú tham chiếu Theme Registry của Brand Studio (`/admin/brand/theme`) — không sao chép dữ liệu, chỉ tham chiếu.

**Sự cố đã tránh:** áp dụng ngay bài học `react-hooks/set-state-in-effect` (phát hiện ở `GlobalBrandSettingsForm`, BRAND-SPR-001) — `GlobalWebsiteSettingsForm` viết đúng từ đầu (`form = localEdits ?? record`, không dùng `useEffect`), không phát sinh lỗi lint.

## Website Dashboard — cập nhật đủ 6/6 collection

Thêm `globalSettings` vào tổng hợp số liệu (`stats`/`recentChanges`) — trước đó (WEB-SPR-006) chỉ 5 collection vì Global Settings chưa tồn tại. `WebsiteWorkspaceShell.tsx` cập nhật text: "5/10 nhóm có Registry" → **"10/10 nhóm có Registry"**.

## Cập nhật WCS

`docs/admin/workspaces/website-workspace.md`: **Version 1.0 → 1.1** (đúng Update Rules — mở rộng ownership Navigation cần tăng Version + xác nhận Founder/PMO qua brief, không tự suy luận). Cập nhật Mục 3 (Navigation 4 vị trí), Mục 7 (Content Ownership), Mục 13 (Product Decisions — ranh giới Footer), Mục 14 (Founder Decisions — ghi nhận WEB-SPR-201 Directive).

## Files Changed

**Mới:** `src/lib/admin/website/globalSettings.ts`, `src/components/admin/website/GlobalWebsiteSettingsForm.tsx`

**Sửa:** `src/lib/admin/website/navigationRegistry.ts` (Footer/External locations + seed), `src/components/admin/website/NavigationPreview.tsx` (tổng quát hóa), `src/app/admin/(dashboard)/website/navigation/page.tsx`, `src/app/admin/(dashboard)/website/global-settings/page.tsx` (placeholder → form thật), `src/app/admin/(dashboard)/website/page.tsx` (Dashboard, thêm collection thứ 6), `src/components/admin/website/WebsiteWorkspaceShell.tsx` (text), `docs/admin/workspaces/website-workspace.md` (Version 1.1)

**Không đổi:** Pages/Homepage/Landing Pages/Static Pages/Shared Sections/SEO/Redirect component logic (chỉ Dashboard đọc thêm 1 collection), mọi Workspace khác, `Badge.tsx`.

## Verification

- **Lint (`npm run lint`):** sạch — 0 lỗi, 5 warning có từ trước.
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công.
- **Test (`npm run test`):** 139/139 pass, không regression.

## Acceptance Criteria — đối chiếu

| Acceptance | Đáp ứng |
|---|---|
| Website Workspace hoạt động | ✅ |
| Dashboard hoàn chỉnh | ✅ Đủ 6/6 collection (thêm Global Settings) |
| Quản lý được Homepage/Landing Pages/Static Pages | ✅ Đã có từ WEB-SPR-002, xác nhận không regression |
| Quản lý được Navigation | ✅ Mở rộng Header/Sidebar/Footer/External |
| Quản lý được Shared Sections | ✅ Đã có từ WEB-SPR-004 |
| Quản lý được SEO | ✅ Đã có từ WEB-SPR-005 |
| Quản lý được Redirect | ✅ Đã có từ WEB-SPR-005 |
| Quản lý được Website Settings | ✅ **Mới** — Registry thật lần đầu |
| Build thành công | ✅ |
| Tests pass | ✅ 139/139 |

## EPIC-02 Phase 3 Readiness

**SẴN SÀNG.** Website Workspace nay đạt đúng 10/10 module Registry thật — module cuối cùng còn thiếu (Global Settings) đã hoàn thành. Không CRUD nghiệp vụ/Database Migration/Visual Builder/Landing Builder nào được thêm, đúng giới hạn brief.

**Cần PMO quyết định (tổng hợp, không mới — nhắc lại có căn cứ mạnh hơn):**
- SEO/Global Settings vs mục độc lập cấp cao nhất — vẫn treo từ WEB-SPR-001.
- Banner vs Announcement — vẫn treo từ WEB-SPR-004.
- **Mới:** `/portal/hetrithucai` vs `/portal/ckos` — nay xác nhận bất nhất tồn tại NGAY TRONG Footer thật (không chỉ đơn lẻ), cần Founder quyết định route nào là chính thức trước khi Website Workspace tự tin khẳng định "Navigation phản ánh đúng Portal thật".

---

# WEB-SPR-202 — Website Workspace Management Foundation (EPIC-02 Phase 2, brief IMP-WEB-202)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.** Sprint đầu tiên tuân thủ **PMO Directive FOUNDER-001** (`docs/admin/PMO_DIRECTIVE_FOUNDER-001_PORTAL_COVERAGE.md`) — audit trực tiếp Portal trước khi kết luận, không dựa vào tài liệu/trí nhớ cũ.

## Phát hiện P0 mở đầu Sprint

Audit trực tiếp `src/components/admin/website/PageRegistry.tsx` và `PageOverviewStats.tsx` phát hiện: **từ WEB-SPR-002 tới nay, `WEBSITE_PAGES_SEED` không tồn tại** — cả 2 component gọi `useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, [])`, seed rỗng. `/admin/website/pages`, `/homepage`, `/landing-pages`, `/static-pages` hiển thị bảng RỖNG kể từ khi xây — vi phạm trực tiếp Acceptance "Founder nhìn thấy toàn bộ Website" mà chính brief WEB-SPR-001/002 đã đặt ra. `globalSettings.ts`'s `defaultHomepageNote` thậm chí tự ghi nhận: *"Chưa có Page nào... registry hiện trống"* — gap đã được biết nhưng chưa Sprint nào quay lại sửa. Đây là ưu tiên số 1 của Sprint này.

## 1. Website Registry (Task 1) — sửa lỗ hổng P0

`src/lib/admin/website/pageRegistry.ts`: thêm `WEBSITE_PAGES_SEED`, **9 trang thật** audit trực tiếp `src/app/*` (không kể `/portal/*`, `/admin/*`, `/api/*`, `/auth/*`, `/login`, `/reset-password` — ngoài phạm vi Website Presentation Layer công khai):
- Homepage (1): `/`.
- Static Pages (7): `/about`, `/contact`, `/disclaimer`, `/privacy`, `/refund-policy`, `/terms`, `/blogai` (trang chỉ mục — bài viết `/blogai/[slug]` thuộc Content Registry).
- Landing Page (0 thật — 1 entry gap): không tìm thấy route Landing Page/campaign nào trong `src/app/*`.

Wire `PageRegistry.tsx`, `PageOverviewStats.tsx`, và Website Dashboard (`page.tsx`) đọc từ `WEBSITE_PAGES_SEED` thay vì `[]`.

## 2. Navigation Management (Task 2) — Icon, Ẩn/hiện, đổi thứ tự

Audit `PortalSidebar.tsx` xác nhận Portal Sidebar render icon THẬT per-item (`navIcons: Record<string, LucideIcon>`, 10 icon: Home/HeartHandshake/Cpu/Library/GraduationCap/Rocket/Crown/Compass/Sparkles/Users) — Registry trước đó không có field `icon`. Thêm `icon: string` + `visible: boolean` (tách khỏi `status`, cùng pattern `WebsitePage.visible`) vào `NavigationItem`. Seed 10 icon Sidebar đúng tên Lucide thật.

**Phát hiện thêm khi audit `Footer.tsx`:** External/Social group (WEB-SPR-201) seed từ `siteConfig.links` — thực tế Footer render ĐỘNG từ `settings.facebookUrl/youtubeUrl/tiktokUrl/zaloUrl` (Supabase, Admin-editable qua `/admin/settings`, mặc định = `siteConfig.links`) và có **5 link, không phải 4** — bỏ sót "Email" (`mailto:{settings.adminEmailNotify}`). Đã sửa mô tả Group + thêm `navitem_seed_28` (Email) + ghi chú icon/màu nền thật (VD Facebook `#1877F2`) cho cả 5 item.

`NavigationRegistry.tsx`: thêm cột Icon + toggle Ẩn/Hiện (button riêng, không qua Status dropdown) + nút ↑/↓ đổi thứ tự (swap `sortOrder` với hàng kề, không kéo-thả) cho cả Group và Item.

## 3. Homepage Management (Task 3) — Section → Block → Content → CTA → Visibility

Audit trực tiếp `src/app/page.tsx` xác nhận Homepage có **11 section thật** theo đúng thứ tự render: Hero → PortalPreview → FreeResources → ToolsIUse → Problem → Solution → AcademyTeaser → TrustStats → Ecosystem → FounderStory → FinalCTA. Shared Section Registry (WEB-SPR-004) chỉ có 9 CATEGORY minh hoạ (không phải danh sách đầy đủ theo trang) — không đáp ứng yêu cầu "Founder thấy toàn bộ cấu trúc Section của Homepage".

Xây mới `src/lib/admin/website/homepageSectionRegistry.ts` + `HomepageSectionRegistry.tsx` — entity `HomepageSection` riêng (không gộp Shared Section): `componentName`, `label`, `hasCta`, `sharedSectionId` (liên kết một chiều khi có Shared Section tương ứng — 3/11: Hero/AcademyTeaser/FounderStory/FinalCTA), `visible`, `sortOrder`, `status`. Reorder ↑/↓, toggle Ẩn/Hiện, CRUD đầy đủ. Wire vào `/admin/website/homepage` (dưới Page Registry đã lọc Homepage).

## 4-5. Landing Page Registry + Static Page Registry (Task 4-5)

Không cần component mới — dùng chung `PageRegistry` (`lockedPageType`) đã có từ WEB-SPR-002, nay có dữ liệu thật nhờ Task 1.

## 6. Shared Section Registry (Task 6)

Đã audit — 9 category hiện có (Hero/CTA/Banner/Feature/Founder/Testimonial/FAQ/Footer/Announcement) bao phủ đủ 6 mục brief liệt kê (Hero/CTA/FAQ/Founder Section/Footer/Announcement). Không cần thay đổi cấu trúc.

## 7. Website Settings (Task 7)

`globalSettings.ts`: thêm `websiteName`/`tagline` (đúng 5 mục brief: Website Name/Tagline/Default Homepage/Announcement/Maintenance — Maintenance = `visibilityMode: "Maintenance Mode"` đã có). Seed giá trị thật từ `siteConfig` (`src/lib/site.ts`). `GlobalWebsiteSettingsForm.tsx` thêm 2 input tương ứng. Đồng thời sửa `defaultHomepageNote` (không còn mô tả registry rỗng — nay trỏ đúng `page_seed_home`).

## 8. Portal Mapping (Task 8) — mục IA mới

Brief yêu cầu "Mỗi Website Object phải hiển thị Current Route → Workspace Owner → Publish Status → Last Updated" — không map vào 1 trong 10 mục IA cũ, nên thêm mục thứ 11 "Portal Mapping" (`WEBSITE_WORKSPACE_SECTIONS`, additive, không đổi 10 mục đã khoá).

`PortalMappingTable.tsx` — **VIEW derive, không phải Registry mới** (đúng FOUNDER-001 Nguyên tắc 5): tổng hợp Page + Navigation Item + Shared Section + Homepage Section (4 Registry đã tồn tại) thành 1 bảng, filter theo loại, link "Quản lý" trỏ về đúng Registry gốc để sửa (không sửa trực tiếp trên bảng mapping).

## Shared Structure (nguyên tắc xuyên suốt sprint)

- `visible: boolean` tách khỏi `status` áp dụng nhất quán cho Navigation Item và Homepage Section — cùng pattern `WebsitePage.visible` đã có từ WEB-SPR-002.
- Reorder ↑/↓ (swap `sortOrder`) là pattern mới, dùng cho Navigation Group/Item và Homepage Section — không kéo-thả, không thư viện mới.
- Portal Mapping không lưu dữ liệu riêng — chỉ derive, đúng nguyên tắc "Portal Management không sở hữu dữ liệu nghiệp vụ mới" (FOUNDER-001 #5).

## Files Changed

**Lib (mới):** `src/lib/admin/website/homepageSectionRegistry.ts`
**Lib (sửa):** `pageRegistry.ts` (thêm SEED), `navigationRegistry.ts` (icon/visible fields + seed sửa External), `globalSettings.ts` (websiteName/tagline), `navigation.ts` (thêm Portal Mapping)
**Components (mới):** `HomepageSectionRegistry.tsx`, `PortalMappingTable.tsx`
**Components (sửa):** `NavigationRegistry.tsx` (icon/visible/reorder UI), `PageRegistry.tsx`, `PageOverviewStats.tsx` (wire SEED), `GlobalWebsiteSettingsForm.tsx` (2 field mới), `WebsiteWorkspaceShell.tsx` (11/11)
**Routes (mới):** `src/app/admin/(dashboard)/website/portal-mapping/page.tsx`
**Routes (sửa):** `website/page.tsx` (Dashboard, wire SEED + Homepage Section stats), `website/homepage/page.tsx` (thêm HomepageSectionRegistry), `website/navigation/page.tsx` (mô tả cập nhật)
**Sửa khác:** `src/lib/admin/nav.ts`, `src/components/admin/AdminSidebar.tsx` (icon Portal Mapping)
**Docs:** `docs/admin/workspaces/website-workspace.md` (Version 1.1 → 1.2), `docs/admin/WEBSITE_WORKSPACE_FOUNDATION.md` (file này)
**Không đổi:** Brand Studio, Media Center, CKOS, mọi Workspace khác.

## Verification

- **Lint:** phát hiện 2 vấn đề thật (JSX quote chưa escape, biến `group` khai báo nhưng chưa dùng ở `PortalMappingTable.tsx`) — sửa bằng cách dùng `group.location` để làm rõ tên Navigation Item thay vì xoá biến. Sau sửa: sạch, 5 warning `<img>` có từ trước.
- **Type-check:** sạch.
- **Build:** thành công — đủ 11 route `/admin/website/*` (thêm `/portal-mapping`).
- **Test:** 139/139 pass, không regression.

## Self-check Nguyên tắc 6 (PMO Directive FOUNDER-001, bắt buộc)

**Câu hỏi:** "Founder có thể quản lý toàn bộ nội dung của Portal hiện tại mà không cần sửa code hay chưa?"

**Đã đạt (không cần sửa code):**
- Xem/sửa metadata 9 trang thật (Title/Slug/Status/Visibility/SEO) — Pages/Homepage/Landing Pages/Static Pages.
- Xem/sửa/đổi thứ tự/ẩn-hiện/đổi icon/route/trạng thái publish của Navigation (Header/Sidebar/Footer/External).
- Xem/đổi thứ tự/ẩn-hiện 11 section Homepage + liên kết nội dung Shared Section tương ứng.
- Sửa Website Name/Tagline/Announcement/Default Homepage/Maintenance qua Global Settings.
- Tra cứu tổng hợp mọi Website Object qua Portal Mapping.

**CHƯA đạt (còn cần sửa code — ghi nhận trung thực, không che giấu):**
1. **Nội dung/bố cục BÊN TRONG mỗi Homepage section** (VD copy thật của `PortalPreview`/`Problem`/`Solution`/`Ecosystem`) — chỉ 4/11 section có Shared Section liên kết quản lý được copy; 7 section còn lại vẫn 100% hardcode trong `src/components/home/*.tsx`. Nằm ngoài phạm vi Foundation này ("Không triển khai: Visual Builder").
2. **Nội dung trang pháp lý** (Terms/Privacy/Refund/Disclaimer) — cố ý giữ ngoài CRUD tự do (Mục 4 WCS, khuyến nghị từ PORTAL_COVERAGE_AUDIT.md §5), chỉ metadata quản lý được.
3. **Bài viết Blog AI** (`/blogai/[slug]`) — thuộc Content Registry (Workspace khác), Website Workspace chỉ đăng ký trang chỉ mục.
4. **Icon/màu thật của social link** (Footer.tsx SVG inline) — Registry chỉ có ghi chú mô tả, không đổi được icon/màu thật qua Admin (chỉ đổi được URL qua System Settings).
5. **Chưa nối Portal đọc dữ liệu thật từ Registry** (Consumer = 0, xem WCS Mục 7) — mọi thay đổi trong Admin chưa phản ánh lên site công khai; đây là "Website Publish Bridge" của một Sprint kỹ thuật tương lai.

**Kết luận:** CHƯA đạt 100% theo đúng tinh thần Nguyên tắc 6 — Sprint này thu hẹp đáng kể khoảng cách (đặc biệt xoá lỗ hổng P0 Page Registry rỗng) nhưng 5 điểm trên vẫn cần sửa bằng code hoặc thuộc phạm vi cố ý loại trừ (pháp lý). Không tự nhận "hoàn thành 100%" khi chưa đúng — báo cáo trung thực theo đúng yêu cầu PMO Directive.

## Cần PMO/Founder quyết định (tổng hợp)

1. **2 ảnh founder / bất nhất route CKOS** — vẫn treo từ các Sprint trước, không mới.
2. **Landing Pages Registry sẵn sàng nhưng Portal chưa có route nào** — có nằm trong roadmap nội dung gần để ưu tiên xây không?
3. **7/11 Homepage section chưa có Shared Section liên kết** — có cần mở rộng Shared Section category để phủ hết, hay giữ nguyên hiện trạng (chỉ quản lý thứ tự/ẩn-hiện, không quản lý copy)?
4. **Consumer = 0 kéo dài qua nhiều Sprint** — có nên ưu tiên 1 Sprint "Website Publish Bridge" tiếp theo thay vì tiếp tục mở rộng Registry?
