# Admin Information Architecture v2 — IMP-ADM-100 (Admin CMS Foundation Architecture Freeze)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge. Không code CRUD/Database/API/Runtime — tài liệu thiết kế thuần.**

Epic: EPIC-02. Brief xác nhận Foundation Architecture v1.0 đã hoàn thành và 7 Workspace đã "hoàn thành Product" (Website, Brand Studio, Media Center, CKOS, Academy, Premium, Companion Studio), chỉ thị dừng xây Workspace độc lập, chuyển sang thiết kế một Admin CMS thống nhất. Tài liệu này (Task 1-5) + `ADMIN_FOUNDATION_V2.md` (Task 6-10) là output theo đúng brief.

**Nguyên tắc đã áp dụng khi viết tài liệu này:** Portal/code hiện tại là Reference Source (ưu tiên bằng chứng thật hơn giả định); Workspace Canonical Specification (`docs/admin/workspaces/*.md`) là Single Source of Truth cho từng Workspace đã có; khi phát hiện khác biệt giữa brief và code thật — ghi nhận, không tự sửa, trình PMO (đúng `docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md` §7).

---

## Task 1 — Audit toàn bộ Admin

### ⚠️ Phát hiện quan trọng nhất: tiền đề của brief khác với code thật

Brief nêu 7 Workspace **"hoàn thành Product"**. Audit trực tiếp `src/lib/admin/nav.ts` + source code cho thấy:

| Workspace (theo brief) | Thực trạng trong code | Kết luận |
|---|---|---|
| **Website** | 10 route thật, Registry pattern đầy đủ (`useCollection` + schema riêng + Modal/Badge chuẩn), WCS **Approved** | ✅ Khớp — thật sự hoàn thành Foundation |
| **Brand Studio** | 10 route thật, Registry pattern đầy đủ, WCS **Approved** | ✅ Khớp — thật sự hoàn thành Foundation |
| **CKOS** | 10/11 route dùng `KnowledgeCrudPage` (framework canonical riêng, nhất quán nội bộ) — nhưng **chưa có WCS** | 🟡 Gần khớp — code hoàn chỉnh, thiếu governance doc |
| **Media Center** | `/admin/media-center` — **`ComingSoon` stub, không có route/Registry/CRUD thật nào** | ❌ **KHÔNG khớp brief** — chưa có gì được xây, WCS vẫn Draft (`media-center.md`), không có Product Package |
| **Companion Studio** | `/admin/companion-studio` — **`ComingSoon` stub, không có route/Registry/CRUD thật nào** | ❌ **KHÔNG khớp brief** — chưa có gì được xây, không có WCS |
| **Academy** | 3 route (`roadmap`, `daily-missions`, `projects`) — pattern legacy hỗn hợp (generic `CrudPage` + seed file; `projects` dùng Supabase `actions.ts` bespoke) — **chưa có WCS**, chưa qua canonicalization nào trong EPIC-02 | 🟡 Có route thật nhưng KHÔNG dùng Foundation Architecture pattern — là legacy pre-EPIC-02 |
| **Premium** | 12 route — 3 pattern legacy khác nhau cùng tồn tại (generic `CrudPage`+seed; Supabase `actions.ts` bespoke cho Orders/Coupons/Leads/Support; read-only report cho Affiliate Analytics) — **chưa có WCS** | 🟡 Có route thật, dữ liệu thật (Supabase), nhưng KHÔNG theo Foundation Architecture — nhiều pattern trộn lẫn |

**Kết luận Task 1:** Chỉ **2/7** Workspace brief liệt kê thực sự khớp "hoàn thành Product" theo đúng Foundation Architecture v1.0 (Registry pattern, WCS Approved) — Website và Brand Studio. Media Center và Companion Studio **chưa hề được xây** (0% — chỉ là placeholder). CKOS gần đạt (code hoàn chỉnh, thiếu WCS). Academy và Premium có route/dữ liệu thật nhưng thuộc kiến trúc pre-EPIC-02, chưa canonical hóa. **Ghi nhận, không tự sửa premise của brief** — trình PMO xác nhận lại danh sách "hoàn thành" trước khi dùng làm căn cứ cho Feature Freeze chính thức của EPIC-02.

### Bản đồ kiến trúc CRUD hiện tại (toàn bộ Admin, không chỉ 7 Workspace trên)

5 kiểu kiến trúc CRUD khác nhau đang cùng tồn tại:

1. **Registry pattern** (Website, Brand Studio) — `useCollection` + schema riêng theo domain (`lib/admin/{website,brand}/*.ts`) + Modal/ConfirmDialog/Badge chuẩn + Status model dùng chung xuyên Workspace. Đây là pattern **canonical** theo Foundation Architecture v1.0.
2. **`KnowledgeCrudPage`** (CKOS, + 4 route "Content": templates/ebooks/checklists/sop) — framework CRUD chuyên biệt cho nội dung tri thức (markdown editor, relationship picker), nội bộ nhất quán nhưng KHÔNG dùng chung primitive với Registry pattern.
3. **Generic `CrudPage` + `@/data/admin/*.ts` seed file** — pattern chiếm số đông nhất (~25 route: phần lớn Content/Academy/Premium/Projects & Opportunities), giống Registry pattern ở chỗ cùng dùng `useCollection`/`Modal`/`Badge`, nhưng thiếu schema file riêng theo domain (seed nằm phẳng trong `data/admin/`, không có type/status model riêng).
4. **Supabase `actions.ts` + component bespoke** (Premium: Orders/Coupons/Leads/Support/Users; Academy: Projects) — kết nối dữ liệu thật (Server Actions + Supabase) nhưng mỗi route tự viết Row/Form riêng, không có scaffolding dùng chung.
5. **Dashboard/Report chỉ đọc** (Analytics, Saved, Affiliate Analytics) — không phải CRUD, hiển thị số liệu qua `MiniBarChart`.

Cộng thêm **3 `ComingSoon` stub** (Companion Studio, Media Center, SEO độc lập) — chưa có gì.

### Bất nhất khác đã ghi nhận từ trước, vẫn còn treo (không lặp lại chi tiết, chỉ liệt kê)

- SEO (Website Workspace) vs. mục "SEO" độc lập cấp cao nhất (stub) — WEB-SPR-001, nhắc lại nhiều lần.
- Global Settings (Website) vs. System Settings — WEB-SPR-001.
- Banner vs. Announcement (Website Shared Sections) — WEB-SPR-004.
- Brand Orange 2 mã màu khác nhau; theme kép chưa hợp nhất — BRAND-SPR-001.
- Icons/Global Brand Settings (Brand Studio) vs. System Settings — BRAND-SPR-001.

### `/admin/dashboard` hiện tại

Legacy, không nhận biết Workspace — hardcode `useCollection` trực tiếp cho 7 collection cụ thể (users/leads/resources/prompts/tools/blog/affiliate), không phải một Dashboard tổng theo tinh thần "Admin CMS thống nhất". Cần thiết kế lại hoàn toàn (xem Task 3).

---

## Task 2 — Đề xuất Information Architecture mới

### Nguyên tắc thiết kế

1. **Workspace là đơn vị tổ chức duy nhất** — mọi route Admin thuộc về đúng 1 Workspace (hoặc 1 nhóm "System" phi-Workspace, xem dưới). Không còn nhóm mơ hồ như "Content" hiện tại (chứa cả nội dung CKOS-adjacent lẫn Portal Builder cũ).
2. **Mỗi Workspace có (hoặc cần có) một WCS** (`docs/admin/workspaces/*.md`) làm Single Source of Truth — IA v2 này KHÔNG thay thế WCS từng Workspace, chỉ tổ chức lại cách chúng được trình bày/điều hướng ở cấp Admin tổng.
3. **Maturity được hiển thị trung thực**, không che giấu: mỗi Workspace mang 1 trong 4 nhãn — **Canonical** (Registry pattern + WCS Approved), **Consistent-Legacy** (framework riêng nhất quán, VD CKOS, nhưng thiếu WCS hoặc chưa dùng Registry pattern), **Mixed-Legacy** (nhiều pattern trộn lẫn, VD Academy/Premium), **Not Started** (ComingSoon stub).
4. **"System" tách khỏi "Workspace"** — Users & Access, Analytics, System Settings không phải nội dung sản phẩm (không có Content Core: title/slug/status...), là hạ tầng vận hành Admin — đề xuất nhóm riêng "System", không trộn vào danh sách Workspace.

### Danh sách Workspace đề xuất (thay thế nav.ts hiện tại)

| # | Workspace | Route gốc | Maturity | WCS | Ghi chú |
|---|---|---|---|---|---|
| — | **Founder** (mới, Task 10) | `/admin` (Dashboard tổng) | Đề xuất mới | — | Không phải Workspace nội dung — oversight surface |
| 1 | Website | `/admin/website` | Canonical | Approved | Không đổi |
| 2 | Brand Studio | `/admin/brand` | Canonical | Approved | Không đổi |
| 3 | CKOS | `/admin/ckos` | Consistent-Legacy | **Cần viết WCS** | Framework `KnowledgeCrudPage` tốt, chỉ thiếu governance doc; `knowledge-seed` (dùng `CrudPage` khác) nên xem lại có thuộc CKOS không |
| 4 | Academy | `/admin/academy` (đổi từ `/admin/roadmap` rời rạc) | Mixed-Legacy | **Cần Product Package + WCS** | Đề xuất canonical hóa theo Registry pattern ở Sprint tương lai |
| 5 | Premium | `/admin/premium` | Mixed-Legacy | **Cần Product Package + WCS** | Phức tạp nhất — có dữ liệu giao dịch thật (Orders/Coupons), canonical hóa cần cẩn trọng hơn (rủi ro mất dữ liệu thật, khác Website/Brand vốn chỉ có dữ liệu test) |
| 6 | Projects & Opportunities | `/admin/digital-assets` | Mixed-Legacy | **Cần WCS** | Giữ nguyên route hiện tại (không đổi URL), chỉ đề xuất đưa vào khung Workspace chung |
| 7 | Community | `/admin/community` | Mixed-Legacy | **Cần WCS** | Hiện chỉ 1 route — cần Product Package để biết Scope thật |
| 8 | Companion Studio | `/admin/companion-studio` | **Not Started** | Chưa có | Đúng như brief liệt kê "hoàn thành" — SAI, cần PMO xác nhận lại |
| 9 | Media Center | `/admin/media-center` | **Not Started** | Draft (skeleton) | Đúng như brief liệt kê "hoàn thành" — SAI, cần PMO xác nhận lại |
| — | **Content Library** (đề xuất workspace mới, gộp) | `/admin/content-library` | Mixed-Legacy | **Cần Product Package** | Gộp phần "Content" hiện tại KHÔNG thuộc Portal Builder cũ: Blog AI, Thành công học viên, Tin tức/Tin nội bộ, Template, Ebook, Checklist, SOP, Tài nguyên đã lưu — đây là nội dung thư viện/kiến thức, gần CKOS hơn là Website. **Cần PMO quyết định:** gộp vào CKOS, gộp vào Website, hay giữ Workspace riêng? |
| — | **Portal Builder** (giữ tên hiện tại, tách khỏi "Content") | `/admin/portal-builder` | Mixed-Legacy | **Cần WCS hoặc Deprecation Decision** | 6 route hiện tại (Dashboard Portal, Bắt đầu tại đây, Hôm nay bạn muốn làm gì, Banner, Nội dung nổi bật, CTA, Mục tiêu người dùng) — theo `docs/admin/PORTAL_COVERAGE_AUDIT.md`, 7/8 bảng collection trong nhóm này **orphan** (Portal không đọc). **Cần PMO quyết định:** giữ và nối dây thật, hay deprecate hẳn (dữ liệu chưa từng được Portal dùng thật) |

**Nhóm "System"** (tách khỏi danh sách Workspace, đặt cuối sidebar, không có Content Core/WCS vì không phải nội dung sản phẩm):

| Mục | Route | Ghi chú |
|---|---|---|
| Users & Access | `/admin/users` | Không đổi |
| Analytics | `/admin/reports` | Không đổi — cân nhắc thay bằng Dashboard tổng theo Workspace (Task 3) thay vì trang riêng |
| System Settings | `/admin/settings` | Không đổi — chồng lấn với Global Settings (Website)/Global Brand Settings (Brand Studio) vẫn treo, cần PMO |
| SEO (độc lập) | `/admin/seo` | **Đề xuất: Deprecate** — trùng lặp với SEO Registry đã có thật trong Website Workspace; giữ 1 stub thứ 2 không có giá trị. Cần PMO xác nhận trước khi xóa route (không tự xóa) |

### Những gì IA v2 KHÔNG đổi

- Không đổi IA nội bộ của Website/Brand Studio (đã Approved, WCS là Single Source of Truth riêng).
- Không đổi URL của bất kỳ route hiện có nào (đề xuất Academy/Premium/Community đổi route gốc — `/admin/academy`, không đổi các route con hiện có bên trong).
- Không tự thực hiện bất kỳ thay đổi nào ở trên — đây là **đề xuất**, chờ PMO Clarification giống cách WEB-SPR-001's Canonical IA từng được PMO khóa trước khi triển khai.

---

## Task 3 — Thiết kế Dashboard tổng

`/admin/dashboard` hiện tại (legacy, hardcode 7 collection cụ thể) đề xuất thay bằng Dashboard nhận biết Workspace, 4 khối:

1. **Founder Alert Feed** — tổng hợp mọi mục "⚠️ cần Founder xác nhận" từ các Workspace (danh sách bất nhất treo ở Task 1 + tương lai). Nguồn dữ liệu: một manifest tĩnh do từng Workspace khai báo (không phải aggregator runtime — xem `ADMIN_FOUNDATION_V2.md` Task 9).
2. **Workspace Grid** — thẻ theo từng Workspace trong danh sách Task 2, hiển thị: tên, nhãn maturity (Canonical/Consistent-Legacy/Mixed-Legacy/Not Started), trạng thái WCS (Approved/Draft/Chưa có), link vào Workspace Landing (Task 5).
3. **Global Recent Activity** — gộp "Recent Changes" đã có sẵn ở từng Workspace Dashboard (Website đã làm ở WEB-SPR-006) thành 1 feed toàn Admin, sắp theo thời gian.
4. **Quick Actions** — lối tắt tới hành động phổ biến nhất theo từng Workspace (tái dùng pattern `QUICK_ACTIONS` đã có ở Website/Brand Studio Dashboard).

Không có Founder Workspace riêng ở Dashboard này — Dashboard tổng là trang mặc định mọi Admin user thấy; **Founder Workspace** (Task 10) là một lớp sâu hơn, chỉ dành cho vai trò Founder, xem `ADMIN_FOUNDATION_V2.md`.

---

## Task 4 — Thiết kế Navigation tổng

### Vấn đề hiện tại

`nav.ts` là 1 mảng phẳng (15 nhóm) chỉ chứa `label`/`href`/`comingSoon` — không có khái niệm maturity, không liên kết tới WCS, và bị trùng lặp một phần với `navigation.ts` riêng của từng Workspace (`website/navigation.ts`, `brand/navigation.ts`) — 2 nơi phải luôn đồng bộ tay (đã có quy trình xác minh bằng script so sánh href, nhưng vẫn là rủi ro trùng lặp dữ liệu).

### Đề xuất: "Workspace Registry" làm nguồn duy nhất

Một file cấu hình duy nhất (VD `src/lib/admin/workspaceRegistry.ts`, KHÔNG triển khai ở sprint này — chỉ đề xuất cấu trúc) khai báo mỗi Workspace với:

```
{
  key, label, icon, rootHref,
  maturity: "canonical" | "consistent-legacy" | "mixed-legacy" | "not-started",
  wcsPath?: string,       // đường dẫn WCS nếu có
  sections: [{ key, label, href }],  // thay thế navigation.ts riêng từng Workspace
}
```

3 nơi hiện đang đọc dữ liệu rời rạc (`nav.ts` sidebar, `website/navigation.ts`/`brand/navigation.ts` tab nav nội bộ, và Dashboard's `QUICK_ACTIONS` hardcode) sẽ đọc CHUNG 1 nguồn này — loại bỏ trùng lặp, và là nền tảng dữ liệu cho Global Search (Task 6)/Command Palette (Task 7).

### Cấu trúc điều hướng 2 cấp (giữ nguyên pattern đã chứng minh hoạt động tốt)

- **Cấp 1 — Sidebar Admin**: danh sách Workspace (Task 2) + nhóm System, mỗi Workspace hiển thị badge maturity nhỏ (không phải nội dung mới, chỉ là style áp dụng lên dữ liệu Workspace Registry).
- **Cấp 2 — Tab nav trong Workspace**: giữ nguyên pattern `WebsiteWorkspaceShell`/`BrandWorkspaceShell` đã dùng — đề xuất **tổng quát hóa thành 1 component `AdminWorkspaceShell` dùng chung** (nhận `title`, `description`, `sections` từ Workspace Registry) thay vì mỗi Workspace tự viết Shell riêng (hiện đã có 2 bản gần như giống hệt nhau — `WebsiteWorkspaceShell.tsx` và `BrandWorkspaceShell.tsx`, chỉ khác nội dung text). Đây là đề xuất kiến trúc, KHÔNG triển khai ở sprint này (brief cấm code).

---

## Task 5 — Đề xuất Workspace Landing

Mọi Workspace (kể cả Mixed-Legacy) nên có trang gốc (`/admin/{workspace}`) theo cùng 1 khuôn mẫu — tổng quát hóa từ "Website Overview"/"Brand Overview" đã xây (WEB-SPR-006, BRAND-SPR-001):

1. **Header** — tên Workspace + badge maturity + link WCS (nếu có) + link "Chưa có WCS, cần Product Package" (nếu chưa có, thay vì im lặng).
2. **Overview Stats** — số liệu thật nếu Workspace dùng Registry pattern (đọc `useCollection`); với Mixed-Legacy (Academy/Premium), có thể tạm hiển thị Mock Data + nhãn rõ ràng "chưa canonical hóa", đúng tinh thần minh bạch đã áp dụng cho Brand Dashboard.
3. **Alert Block** — các bất nhất/chồng lấn đã ghi nhận cho riêng Workspace này (tái dùng khối "⚠️ Phát hiện cần Founder xác nhận" đã có ở Brand Studio Dashboard, tổng quát hóa thành pattern chung mọi Workspace).
4. **Quick Actions** — lối tắt vào section con.

Workspace Landing này CHÍNH LÀ trang Dashboard nội bộ hiện có của Website (`/admin/website`) và Brand Studio (`/admin/brand`) — không đổi 2 trang đó, chỉ đề xuất khuôn mẫu để các Workspace còn lại (khi canonical hóa) đi theo cùng cấu trúc, tránh mỗi Workspace tự sáng tạo layout riêng.

---

*(Tiếp tục ở `docs/admin/ADMIN_FOUNDATION_V2.md` — Task 6-10: Global Search, Command Palette, Notification Center, Review Queue, Founder Workspace.)*
