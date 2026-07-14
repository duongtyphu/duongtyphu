# Admin CMS Operational Foundation — IMP-ADM-200 (ADM-SPR-200, EPIC-02)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Objective: xây Admin CMS như công cụ làm việc hằng ngày của Founder — Main Shell hoàn chỉnh, Portal Management Layer, Workspace Management Layer. **Không CRUD nghiệp vụ, không Database mới, không API mới, không Runtime, không AI** — mọi trang mới đều READ-ONLY, dữ liệu tĩnh (catalog liệt kê cơ học từ route/code thật) hoặc đọc trực tiếp Registry đã tồn tại (Website/Brand Studio) — không route nào tạo bảng dữ liệu mới hay endpoint mới.

> ⚠️ **Lưu ý về tiền đề brief:** Context nêu *"Portal Master Coverage Package đã được phê duyệt"* và *"Workspace Canonical Specification đã hoàn thành"*. Chưa tìm thấy tài liệu tên "Portal Master Coverage Package" nào trong repo — tài liệu gần nhất là `docs/admin/PORTAL_COVERAGE_AUDIT.md` (ADM-SPR-005), dùng làm nguồn thay thế. "WCS đã hoàn thành" cũng chưa khớp thực tế: chỉ 2/9 Workspace có WCS Approved (Website, Brand Studio) — 7 Workspace còn lại chưa có WCS hoặc vẫn Draft (xem `ADMIN_INFORMATION_ARCHITECTURE_V2.md` Task 1, IMP-ADM-100). Ghi nhận, không tự sửa premise — đã triển khai sprint này dựa trên bằng chứng tốt nhất hiện có (Portal route thật + WCS đã có).

---

## Task 1 — Portal Dashboard

`/admin/portal` — "Founder mở Admin sẽ nhìn thấy toàn bộ Portal." Số liệu THẬT (không mock): 10 Portal Area, 71 Portal Page (liệt kê cơ học từ `find src/app/portal -name page.tsx`), số Area có Owner Workspace, số Page chưa khớp Area nào. Khối "⚠️ Phát hiện" liệt kê 3 phát hiện mới của sprint này (xem dưới).

## Task 2 — Portal Area Landing

`/admin/portal/areas` + `PortalAreaLanding.tsx` — 10 Area thật (đúng `portalNavSections`, `src/lib/portal/hubs.ts` — nguồn duy nhất, không suy luận thêm Area nào). Chọn 1 Area để xem Landing riêng (route con thật + Owner Workspace) — dùng pattern chọn-mục-để-xem-chi-tiết đã có ở `NavigationRegistry` (WEB-SPR-003) thay vì 10 route tĩnh riêng biệt.

## Task 3 — Portal Page Registry

`/admin/portal/pages` + `PortalPageRegistry.tsx` — READ-ONLY, toàn bộ 71 route thật, lọc theo Area/từ khóa. Không có Add/Edit/Delete — route là sản phẩm của code, không phải nội dung admin-editable.

**Phương pháp gán Area:** khớp tiền tố URL cơ học (VD `/portal/aiworkspace/*` → Area "AI Workspace") — route không khớp tiền tố nào được gán `null` ("Unmapped"), **không đoán**. Kết quả: **47/71 route (66%)** không khớp Area nào trong 10 mục sidebar chính thức.

## Task 4 — Content Registry

`/admin/portal/content` + `ContentRegistry.tsx` — gộp dữ liệu THẬT (qua `useCollection`, không mock) từ 10 collection đã tồn tại: Website (Pages/Navigation Group/Navigation Item/Shared Section/SEO/Redirect) + Brand Studio (Asset/Typography/Color/Theme). CKOS/Academy/Premium **không xuất hiện** vì chưa dùng Registry pattern — ghi nhận rõ trong UI, không giả lập dữ liệu.

## Task 5 — Workspace Owner Panel

`/admin/founder/owners` + `WorkspaceOwnerPanel.tsx` — "Founder biết Workspace Owner của từng nội dung." Bảng 9 Workspace, mỗi dòng: Maturity (Canonical/Consistent-Legacy/Mixed-Legacy/Not Started, đúng phân loại IMP-ADM-100), trạng thái WCS thật, nội dung sở hữu (transcribe từ WCS/nav.ts, không bịa).

## Task 6 — Global Search (Placeholder)

`/admin/founder/search` — đúng chỉ thị "Placeholder" của brief, dùng lại `WorkspaceSectionFoundation` (component thuần đã có từ WEB-SPR-001, không viết lại) mô tả phạm vi tương lai. Không tìm kiếm thật.

## Task 7 — Review Queue (Placeholder)

`/admin/founder/review-queue` — cùng cách làm Task 6. Ghi rõ chỉ 2/10 collection hiện có trạng thái "Review" thật (Website Pages, Shared Sections).

## Task 8 — Founder Workspace

`/admin/founder` — hub tổng: Governance Overview (đếm WCS Approved/Draft/Chưa có + nhúng Workspace Owner Panel), **Open PMO Questions (11 câu)** gộp từ mọi báo cáo sprint EPIC-02 tính đến nay (không phải danh sách mới bịa — mỗi câu trích từ báo cáo gốc, có ghi nguồn sprint), link nhanh Review Queue/Search.

## Main Shell hoàn chỉnh

`src/components/admin/AdminWorkspaceShell.tsx` — component Shell dùng chung MỚI, tổng quát hóa từ `WebsiteWorkspaceShell`/`BrandWorkspaceShell` (2 bản gần giống hệt nhau, chỉ khác text) — đúng đề xuất Task 4 của `ADMIN_INFORMATION_ARCHITECTURE_V2.md` (IMP-ADM-100). Dùng cho Portal Management + Founder (2 khu vực mới). **Không đổi** `WebsiteWorkspaceShell`/`BrandWorkspaceShell` hiện có (đã Approved, không đụng để tránh rủi ro không cần thiết) — đây là bằng chứng khả thi (proof-of-concept) cho việc tổng quát hóa, không phải migrate ngay 2 Shell cũ.

## Phát hiện mới (ADM-SPR-200)

1. **47/71 route Portal thật (66%) không khớp Area nào** trong 10 mục sidebar chính thức — khẳng định lại và định lượng chính xác hơn phát hiện định tính của `PORTAL_COVERAGE_AUDIT.md` (ADM-SPR-005: "sidebar chỉ có 10 mục nhưng ~65 route thật tồn tại").
2. **`/portal/hetrithucai` (3 route) trùng tên khái niệm với `/portal/ckos`** ("Hệ tri thức AI" = CKOS) nhưng là route hoàn toàn khác — chưa từng được ghi nhận ở audit trước, quan hệ giữa 2 route chưa xác nhận.
3. **4/10 Portal Area chưa có Workspace Admin sở hữu rõ ràng**: Trang chủ Học viện, Học viện AI, AI Workspace, Hành trình của tôi — khớp khuyến nghị cũ của Portal Coverage Audit (thêm Workspace "AI Workspace"/"My Journey") nhưng vẫn chưa được PMO xác nhận triển khai.
4. **2 route chết đã xác nhận trước (ADM-SPR-005)** — `student-success`, `updates` — cộng thêm **`hanh-trinh-cua-toi`** (route thứ 3, mới phát hiện ở sprint này: `next.config.ts` redirect 301 sang `/portal/hanhtrinhcuatoi`, page.tsx không thể render) — tổng **3 route chết** đang tồn tại trong code.

Cả 4 phát hiện đã đưa vào Open PMO Questions ở Founder Workspace.

## nav.ts / AdminSidebar Changes

Thêm 2 nhóm mới (đặt ngay sau Dashboard, trước Website — Founder/Portal Management là lớp oversight/toàn cảnh, đặt đầu sidebar theo đúng tinh thần Acceptance "Founder mở Admin sẽ nhìn thấy toàn bộ Portal"): **"Founder"** (4 item) và **"Portal Management"** (4 item). Xác minh bằng script so sánh href trước/sau: **0 href mất**, đúng 8 href mới. Icon dùng lại hoàn toàn từ import có sẵn (Crown/Users/Search/ClipboardCheck/LayoutDashboard/Map/FileText/Library) — không thêm import mới.

## Files Changed

**Lib (mới):** `src/lib/admin/portal/{areas,pages,navigation}.ts`, `src/lib/admin/workspaceOwnership.ts`, `src/lib/admin/founder/navigation.ts`

**Components (mới):** `src/components/admin/AdminWorkspaceShell.tsx`, `src/components/admin/portal/{PortalAreaLanding,PortalPageRegistry,ContentRegistry}.tsx`, `src/components/admin/founder/WorkspaceOwnerPanel.tsx`

**Routes (mới):** `src/app/admin/(dashboard)/portal/{page,areas/page,pages/page,content/page}.tsx`, `src/app/admin/(dashboard)/founder/{page,owners/page,search/page,review-queue/page}.tsx`

**Sửa:** `src/lib/admin/nav.ts`, `src/components/admin/AdminSidebar.tsx`

**Không đổi:** Website/Brand Studio/CKOS/mọi Workspace khác, `Badge.tsx`, mọi Registry hiện có (chỉ đọc qua `useCollection`, không ghi), Portal công khai (`src/app/portal/**` chỉ đọc để liệt kê route, không sửa).

## Sự cố đã xử lý

Lint phát hiện 1 lỗi thật (`Parsing error: Invalid character` ở `review-queue/page.tsx`) — dùng backslash-escape `\"...\"` bên trong JSX attribute string, JSX không hỗ trợ escape kiểu JS cho thuộc tính (khác với string literal trong `{}`) — đã sửa bằng `&quot;`, đúng convention đã dùng từ WEB-SPR-002.

## Verification

- **Lint (`npm run lint`):** sạch sau khi sửa — 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công — toàn bộ 9 route mới build ở dạng `ƒ` (dynamic, sau Admin auth middleware).
- **Test (`npm run test`):** 139/139 pass, không regression.

## Acceptance Criteria — đối chiếu

| Acceptance | Đáp ứng |
|---|---|
| Founder có thể đi tới toàn bộ Portal | ✅ Portal Dashboard + Area Landing, link "Xem trên Portal thật →" từng Area |
| Founder nhìn thấy toàn bộ Portal Areas | ✅ 10/10 Area thật, không thiếu/thừa |
| Founder nhìn thấy toàn bộ Pages | ✅ 71/71 route thật, Page Registry lọc được theo Area |
| Founder nhìn thấy Content Registry | ✅ Dữ liệu thật từ 10 collection (Website + Brand Studio); CKOS/Academy/Premium ghi nhận rõ là chưa tham gia được |
| Founder biết Workspace Owner của từng nội dung | ✅ Workspace Owner Panel, 9/9 Workspace; 4/10 Portal Area vẫn "Chưa xác định" — ghi nhận trung thực, không gán ép |
| Build thành công | ✅ |
| Tests pass | ✅ 139/139 |

## ADM-SPR-201 Readiness

**SẴN SÀNG.** Main Shell + Portal Management Layer + Workspace Management Layer hoàn chỉnh, toàn bộ READ-ONLY đúng chỉ thị, không CRUD/Database/API/Runtime/AI nào được thêm, build/test đều pass.

**Việc tiếp theo cần PMO quyết định trước khi mở rộng:** 11 câu hỏi ở Open PMO Questions (Founder Workspace) — trong đó nổi bật nhất cho sprint tiếp theo là xác nhận Owner cho 4 Portal Area còn "Chưa xác định" và quan hệ `/portal/hetrithucai` ↔ `/portal/ckos`, vì 2 điều này ảnh hưởng trực tiếp tới việc Content Registry/Page Registry có thể mở rộng chính xác tới đâu.
