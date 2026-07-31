# ADM-V2-08 — Release Candidate Report

**Chương trình:** KIẾN TRÚC ADMIN V2.0 (8 sprint, ADM-V2-01 → ADM-V2-08)
**Sprint này:** ADM-V2-08 — Regression, Responsive, Security, Performance,
Accessibility, Documentation, Release Candidate (sprint QA/RC cuối cùng,
KHÔNG phát triển tính năng mới).
**Nhánh:** `claude/landing-preview-nextjs` (không merge main, không deploy
Production).

---

## 1. Executive Summary

Sau 7 sprint xây dựng (bỏ khung "Sắp triển khai" cho 6/8 Workspace, giữ
nguyên Workspace "Học viện" đã hoàn thiện từ trước và "Tổng quan"/"Người
dùng" hoàn thiện ở Sprint 1), Sprint 8 thực hiện audit toàn diện thay vì
xây thêm — đúng yêu cầu "không phát triển tính năng mới, chỉ regression/
QA/tài liệu/RC report".

**Kết quả:** hệ thống ở trạng thái sạch, nhất quán, không phát hiện lỗi
nghiêm trọng. 2 sửa chữa nhỏ, đúng phạm vi (1 breadcrumb label lệch, 1
component dead code) đã được thực hiện và verify đầy đủ. Toàn bộ
`tsc`/`eslint`/`vitest`/`build`/route-audit đều sạch. Khuyến nghị: **RC
APPROVED cho môi trường Preview/Staging**, chưa đủ điều kiện xác nhận cho
Production do giới hạn sandbox (không có tài khoản Admin thật/Supabase
Production để test tương tác UI) — xem mục 15.

## 2. Workspace Coverage

8/8 Workspace có route thật, phân quyền thật, không route nào 404/lỗi.
73 nav item (không tính `/admin`, `/admin/login`, `/admin/users/[id]`):
**49 module có chức năng thật (67%)**, **24 module `AdminEmptyState`
trung thực (33%)**, **0 module còn badge "Sắp triển khai"**. Chi tiết đầy
đủ theo từng Workspace: `ADMIN_WORKSPACE_INVENTORY.md`.

| Workspace | Route | Real | Empty |
|---|---|---|---|
| Tổng quan | 4 | 1 | 3 |
| Người dùng | 8 | 3 | 5 |
| Website | 6 | 3 | 3 |
| Học viện | 34 | 34 | 0 |
| Vận hành | 6 | 4 | 2 |
| Marketing | 5 | 1 (Chuyển đổi) | 4 |
| Thương hiệu & Media | 5 | 2 | 3 |
| Hệ thống | 5 | 3 (kể cả Nhật ký hệ thống) | 2 |

## 3. Route Coverage

76 `page.tsx` thật dưới `src/app/admin/**`. Đối chiếu bằng script (không
suy đoán): **80/80 href trong `nav.ts` đều resolve tới đúng 1 route
thật** (kể cả route dynamic `[ecosystemSlug]`/`[subProjectSlug]`/
`[courseId]`) — 0 link chết. 2 route thật KHÔNG nằm trong `nav.ts` (đúng
thiết kế, không phải thiếu sót): `/admin` (redirect thuần) và
`/admin/premium/courses/[courseId]/builder` (vào qua nút "Quản lý nội
dung" ở `/admin/course-pricing`, không liệt kê riêng trong sidebar). Chi
tiết đầy đủ từng route: `ADMIN_ROUTE_INVENTORY.md`.

Phân loại theo kiểu UI (script-generated): **EmptyState 24 · Bespoke 23 ·
DataTable 12 · Live-edit 12 · VisualEditor 5**.

## 4. Data Coverage

Toàn bộ dữ liệu đứng sau 49 module "Real" đã được xác nhận đọc/ghi đúng
bảng Supabase thật (không phải mock) — chi tiết mapping đầy đủ
`route ↔ bảng ↔ nơi Portal đọc` tại `ADMIN_DATA_OWNERSHIP.md`. Điểm nhấn:
- 0 migration mới được đề xuất/áp dụng trong sprint này.
- 1 migration proposal cũ (`supabase-phase26-site-navigation.sql`, module
  "Điều hướng") vẫn ở trạng thái CHỜ DUYỆT, chưa `apply_migration` — giữ
  nguyên trạng thái này, không tự ý chạy.
- 0 thay đổi RLS policy nào trong sprint này (đã đọc lại cấu hình, không
  sửa).

## 5. Security Review

Đã audit trực tiếp code (không chỉ đọc báo cáo cũ):

- **`process.env` / secret exposure:** grep toàn bộ `src/app/admin`,
  `src/components/admin`, `src/lib/admin` — **0 dòng** hiển thị giá trị
  biến môi trường thô (mọi tham chiếu đều qua `Boolean(...)`/`typeof`/
  `NODE_ENV`). Kiểm tra thêm AI Service Registry (`src/ai/providers/**`,
  nguồn dữ liệu cho "API & Tích hợp") — `reason` chỉ chứa TÊN biến thiếu
  (vd. `"Thiếu COHERE_API_KEY."`), không bao giờ giá trị.
- **Auth gating — 3 lớp, đã xác nhận không có lỗ hổng:**
  1. `middleware.ts` (matcher `/admin/:path*`) — chặn MỌI request kể cả
     RSC fetch điều hướng client-side, query `is_admin` tươi mỗi lần.
     Đây là lớp chặn **thật sự**, không phụ thuộc cache.
  2. `requireAdmin()` gọi trong `DataTable.tsx` (dùng chung 12 route) và
     59/76 `page.tsx` khác — lớp phòng hộ thứ 2.
  3. `requireAdmin()`/`requireMember()` trong mọi `/api/admin/*` route +
     mọi Server Actions (`actions.ts`) — lớp chặn network-level.
  - **Phát hiện, không phải lỗ hổng:** 5 route dùng `VisualEditor`
    (client-only) không tự gọi `requireAdmin()` — nhưng middleware (lớp
    1) đã chặn tuyệt đối trước khi route render, nên không có đường
    bypass thật. Ghi nhận là điểm KHÔNG NHẤT QUÁN kiến trúc (technical
    debt), không phải bug bảo mật — xem mục 10.
- **Hardcoded admin/bypass:** grep `is_admin=true`/email hardcode/
  `role==='admin'` trong toàn bộ admin+middleware — **0 kết quả**. Quyền
  Admin 100% dẫn xuất từ cột `members.is_admin` trong DB.
- **RLS boundary:** không đổi gì (xem mục 4); đọc lại xác nhận mọi bảng
  generic vẫn đúng 1 pattern `SELECT USING (status='Published')`.

## 6. Responsive Review

Test qua Playwright (`next start`, 3 viewport: 1440×900/768×1024/375×812)
trên component dùng chung (`DataTableClient`/`VisualEditor`/
`AdminEmptyState`/form) mount trong `AdminShell` thật:

- **0 horizontal overflow** ở cả 3 viewport (`scrollWidth === clientWidth`
  chính xác tại mọi breakpoint).
- **Sidebar/Drawer mobile:** hoạt động đúng — hamburger mở drawer, phím
  Escape đóng, click backdrop (đúng vùng hiển thị, không bị panel che)
  đóng đúng. Desktop sidebar `hidden md:block` ẩn đúng trên mobile.
- **Table/Form/Card/Empty State:** render đúng ở cả 3 kích thước, không
  vỡ layout, chữ dài trong ô bảng không tràn khung.

**Giới hạn đã biết:** không test được responsive trên 76 route thật với
dữ liệu Production (sandbox không có tài khoản Admin) — test dựa trên
mount trực tiếp component dùng chung với dữ liệu mẫu, đại diện cho toàn
bộ 17 route DataTable/VisualEditor thật (cùng component).

## 7. Regression Review

- **0 route hỏng** (80/80 href trong `nav.ts` resolve đúng route, xác
  nhận bằng script đối chiếu filesystem).
- **0 menu hỏng** — Sidebar 3 tầng (Workspace→SubGroup→Item) hiển thị
  đúng, `aria-expanded` đúng trạng thái, không có group/item mồ côi.
- **0 breadcrumb sai** — script so khớp 22 breadcrumb (đã wire ở Sprint
  7) với label `nav.ts` tương ứng: phát hiện đúng 1 lệch (route
  `/admin/student-success-stories`, thiếu hậu tố "(chưa hiển thị
  Portal)") — **ĐÃ SỬA** trong sprint này.
- **0 duplicate href** trong `nav.ts` (kiểm tra bằng script).
- **0 placeholder sai** — đã xác nhận 0 route nào còn `comingSoon: true`
  hoặc render `<WorkspacePlaceholder>`. Phát hiện thêm:
  `WorkspacePlaceholder.tsx` đã trở thành dead code hoàn toàn (0 import
  còn lại) — **ĐÃ XOÁ** (an toàn, xác nhận qua grep + `tsc` sạch sau khi
  xoá).
- **0 badge "Sắp triển khai" còn sót** — xác nhận qua Playwright (render
  toàn bộ sidebar, tìm chuỗi "Sắp ra mắt" — 0 kết quả).
- **0 console error / 0 page error** trong mọi test Playwright đã chạy.
- **Hydration:** không phát hiện hydration warning nào trong log
  `next start` khi test qua component dùng chung.

## 8. Performance Review

- `rm -rf .next && npm run build` sạch, biên dịch thành công (Turbopack,
  ~20s), 253 trang static/dynamic generate thành công.
- **2 warning build có sẵn, KHÔNG liên quan Admin, KHÔNG sửa trong
  sprint này** (thuộc hạ tầng gốc của repo, đụng vào rủi ro cao hơn giá
  trị nhận được — xem mục 10):
  1. Turbopack workspace-root ambiguity (2 lockfile: repo root +
     `voduongai/`) — sửa cần đổi `next.config`/xoá 1 lockfile, ảnh hưởng
     toàn app, ngoài phạm vi "no refactor lớn".
  2. `middleware.ts` file convention deprecated (Next.js khuyến nghị đổi
     sang `proxy.ts`) — file này chính là Identity Hub gating, đổi tên
     quy ước là thay đổi core auth infra, vi phạm "Không thay đổi
     Identity Hub".
- **Dead code đã dọn:** `WorkspacePlaceholder.tsx` (xem mục 7). Quét toàn
  bộ `src/components/admin/**` (kể cả thư mục con `companion/`,
  `lessons/`) — **0 orphan component khác**.
- **Bundle size:** Next.js 16.2.9 (Turbopack) không in bảng "First Load
  JS" theo route trong output console như bản Webpack cũ — không đo được
  con số KB chính xác qua công cụ có sẵn trong sandbox này. `.next` tổng
  79MB (bao gồm cache biên dịch, không phải kích thước thật gửi trình
  duyệt).

## 9. Accessibility Review

- **Heading hierarchy:** mọi trang Admin dùng đúng 1 `<h1>` (xác nhận qua
  code review nhất quán suốt 76 `page.tsx` + test Playwright scoped vào
  `<main>` của `AdminShell`, loại trừ `ChromeGate`'s Header/Footer công
  khai — vốn không bao giờ render trên `/admin/*` thật).
- **Form labels:** `<label htmlFor>` liên kết đúng `id` input (xác nhận
  qua `DataTableRowPanel`/mock form test).
- **Keyboard/Focus:** Tab di chuyển focus đúng, outline focus mặc định
  trình duyệt hiển thị rõ (2px solid). Escape đóng drawer mobile đúng.
- **Aria:** `nav[aria-label="Điều hướng Admin"]`, breadcrumb
  `nav[aria-label="Breadcrumb"]`, nút toggle Workspace/SubGroup có
  `aria-expanded` đúng trạng thái + accessible name từ text content.
- **Contrast — 1 phát hiện, KHÔNG sửa trong sprint này (technical debt):**
  `text-gray-400` trên nền trắng đo được **2.54:1**, dưới ngưỡng WCAG AA
  (4.5:1 văn bản thường, 3:1 văn bản lớn). Class này dùng RỘNG RÃI xuyên
  suốt 8 sprint (caption/label phụ ở hàng chục trang: CKOS Dashboard,
  breadcrumb mặc định, nhãn KPI...) — sửa đúng cách cần thay
  `text-gray-400` → `text-gray-500` (4.83:1, đạt AA) ở diện rộng, vượt
  phạm vi "bug fix hẹp" của sprint QA/RC này. Xem mục 10, khuyến nghị làm
  1 việc riêng.

## 10. Known Issues (chưa sửa, có lý do rõ ràng)

| # | Vấn đề | Mức độ | Lý do chưa sửa trong sprint này |
|---|---|---|---|
| 1 | `text-gray-400` trên nền trắng = 2.54:1, dưới WCAG AA | Trung bình | Dùng rộng khắp hàng chục trang — sửa đúng cách là thay đổi diện rộng, không phải "1 bug", cần 1 việc riêng có review thị giác đầy đủ. |
| 2 | 5 route `VisualEditor` không tự gọi `requireAdmin()` (dựa hoàn toàn vào middleware) | Thấp (không phải lỗ hổng — middleware chặn tuyệt đối) | Đồng bộ hoá cho nhất quán kiến trúc là việc riêng, không khẩn cấp về bảo mật. |
| 3 | `getSupabaseServer()` (dùng bởi `requireAdmin()`/`requireMember()`) throw exception (→ 500) thay vì graceful-null khi ENV Supabase hoàn toàn chưa cấu hình | Thấp trong Production (Founder luôn cấu hình đủ ENV) | Sửa đòi hỏi đụng `requireAdmin.ts`/`getSupabaseServer()` — lõi Identity Hub, vi phạm rule "Không thay đổi Identity Hub" của sprint này. Chỉ lộ ra khi test trong sandbox hoàn toàn không có Supabase — không tái hiện được trên môi trường Preview/Production thật. |
| 4 | 2 warning build (Turbopack workspace-root, middleware→proxy deprecation) | Thấp (chỉ warning, build vẫn thành công) | Cả 2 đều đụng hạ tầng ngoài phạm vi Admin CMS (monorepo layout, Identity Hub gating) — xem mục 8. |
| 5 | `companion_persona`/`companion_conversation_strategy` có bảng, 0 dòng, chưa có Admin UI nối vào | Thấp | Đã biết từ trước, chờ quyết định phạm vi Companion CMS riêng (xem plan cũ, chưa triển khai). |
| 6 | Không đo được bundle size (KB) theo route qua console output của Next.js 16 Turbopack | Thấp (thông tin, không phải lỗi) | Giới hạn công cụ trong sandbox này, không phải thiếu sót của code. |

## 11. Technical Debt

- 24 module `AdminEmptyState` — mỗi module có lý do trung thực riêng
  (chưa có bảng/0 dòng dữ liệu/chưa quyết định phạm vi/chưa có hạ tầng
  bên thứ 3) — không phải nợ kỹ thuật xấu, mà là trạng thái trung thực
  đã ghi chú rõ tại chỗ (Empty State + `relatedLink` khi có).
- 10 bản sao `EditModeContext.tsx`/`EditableRegion.tsx` byte-for-byte —
  có chủ đích (cách ly module, tránh 1 Context dùng chung không liên
  quan), đã ghi chú rõ trong `CLAUDE.md`, không phải trùng lặp do sơ
  suất — nhưng nếu có module Live-edit thứ 11, nên cân nhắc factor ra 1
  hook dùng chung parameterized thay vì bản sao thứ 11.
- 6 Known Issues ở mục 10.

## 12. Production Readiness Score

**7.5 / 10**

Cơ sở tính điểm:
- Chức năng (Workspace/Route/Data coverage), Regression, Security,
  Performance: đều sạch, không phát hiện lỗi chặn release → cộng điểm
  mạnh.
- Trừ điểm vì: (a) 1 vấn đề accessibility (contrast) ảnh hưởng diện rộng
  chưa xử lý; (b) chưa test được tương tác UI thật với tài khoản Admin +
  Supabase Production (giới hạn sandbox xuyên suốt cả 8 sprint, không
  phải lỗi lần này); (c) 1 lỗi tiềm ẩn (Known Issue #3) tuy không phải
  lỗ hổng bảo mật nhưng là 1 điểm giòn (fragility) trong error handling
  của lớp auth cốt lõi.

## 13. Risks

- **Rủi ro thấp — Contrast:** không chặn chức năng, chỉ ảnh hưởng khả
  năng đọc với người dùng thị lực yếu ở phần văn bản phụ (caption/label).
- **Rủi ro thấp — chưa test tương tác thật:** mọi kết luận "hoạt động
  đúng" trong 8 sprint (kể cả sprint này) đều dựa trên code review +
  test tự động (Playwright trên component dùng chung/route status) —
  KHÔNG dựa trên thao tác tay thật của Admin với dữ liệu Production. Đây
  là rủi ro xuyên suốt toàn chương trình, không riêng sprint này.
- **Rủi ro rất thấp — Known Issue #3:** chỉ xảy ra nếu ENV Supabase bị
  xoá/sai hoàn toàn trên Production — kịch bản khó xảy ra nếu deploy
  pipeline đã chuẩn, nhưng nếu xảy ra sẽ hiện lỗi 500 thô thay vì thông
  báo "chưa cấu hình" thân thiện.
- **Không có rủi ro nào liên quan checkout/thanh toán/Identity Hub/RLS**
  — sprint này không đụng các khu vực đó (đúng rule bắt buộc).

## 14. Recommendation

1. **Chấp nhận RC này để lên Preview/Staging** — không có lỗi chặn
   release, mọi thay đổi đều nhỏ và đã verify đầy đủ.
2. Trước khi cân nhắc Production, Founder tự thực hiện 1 lượt test tay
   với tài khoản Admin thật trên Preview URL — xuyên suốt cả chương
   trình chưa từng có bước này (giới hạn sandbox), đây là bước bắt buộc
   cuối cùng còn thiếu.
3. Xem xét 1 việc riêng (ngoài phạm vi sprint này) để sửa contrast
   `text-gray-400` diện rộng — không khẩn cấp nhưng nên làm trước khi
   công bố rộng rãi cho nhiều Admin dùng.
4. Known Issue #3 (`getSupabaseServer()` throw khi ENV rỗng) nên được
   xem xét trong 1 đợt hardening Identity Hub riêng, có Founder duyệt
   trước (đúng rule "Không thay đổi Identity Hub" của sprint này).

## 15. Release Candidate Decision

**RC APPROVED — có điều kiện.**

Đủ điều kiện cho: merge vào nhánh tính năng khác (nếu có), tiếp tục lên
Preview/Staging, review nội bộ.

CHƯA đủ điều kiện xác nhận cuối cùng cho Production tới khi: Founder tự
xác nhận UI tương tác thật (thêm/sửa/xoá) hoạt động đúng trên ít nhất
5-10 route tiêu biểu trên Preview URL với tài khoản Admin thật + dữ liệu
Supabase Production — bước này chưa từng thực hiện được trong toàn bộ 8
sprint do giới hạn sandbox, không phải nghi ngờ về chất lượng code.

**Không merge vào `main`. Không deploy Production.** Theo đúng chỉ đạo.
