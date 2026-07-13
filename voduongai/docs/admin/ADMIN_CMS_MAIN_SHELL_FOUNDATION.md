# Admin CMS Main Shell Foundation — IMP-ADM-201 (ADM-SPR-201, EPIC-02 Phase 1)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Objective: xây Main Shell của Admin CMS — nền tảng để Founder quản lý toàn bộ Portal. **Không CRUD, không Database, không API, không Runtime, không Business Logic** — sprint này là Shell/Navigation, tiếp nối trực tiếp ADM-SPR-200 (Portal Management Layer + Founder Workspace đã xây ở đó vẫn giữ nguyên, sprint này hoàn thiện phần Sidebar/Navigation/Landing còn thiếu).

> ⚠️ **Lưu ý tiền đề brief (nhắc lại, không lặp chi tiết):** Context nêu "Foundation Architecture v1.0/Portal Master Coverage/Workspace Canonical Specification đã được khóa" — như đã ghi nhận ở ADM-SPR-200, chỉ 2/11 Workspace (Website, Brand Studio) thực sự có WCS Approved. Không tự sửa premise, tiếp tục triển khai dựa trên bằng chứng tốt nhất.

---

## Task 1 — Sidebar mới

**Xác nhận: không có Legacy Sidebar nào tồn tại.** Audit code xác nhận `AdminSidebar.tsx` (từ ADM-SPR-002) là component sidebar DUY NHẤT, đã wire vào `AdminShell.tsx` cho cả desktop và mobile drawer — không có bản sidebar cũ nào khác để "không sử dụng". "Sidebar mới" ở sprint này = cấu trúc dữ liệu mới cho `adminNavGroups`, không phải viết lại component.

**Đã làm:**
- Thêm nhóm **"Portal Navigation"** — đúng 10 mục bắt buộc của brief, mỗi mục trỏ `/admin/portal/areas?area=<key>` (deep-link thẳng vào 1 Portal Area cụ thể).
- Thêm 2 Workspace mới vào **"Workspace Navigation"**: **AI Workspace** (`/admin/ai-workspace`) và **Journey** (`/admin/journey`) — 2 Workspace được chính thức hóa lần đầu bởi brief này.
- **Sắp lại thứ tự** các nhóm Workspace hiện có để khớp đúng thứ tự "Workspace Navigation bắt buộc": Website → Brand Studio → Media Center → CKOS → Academy → AI Workspace → Projects & Opportunities → Premium → Journey → Companion Studio → Community.
- **Giữ nguyên, không xóa** các nhóm ngoài 2 danh sách bắt buộc (Content, Users & Access, Analytics, SEO, System Settings) — brief chỉ yêu cầu đảm bảo 2 danh sách tồn tại đầy đủ, không yêu cầu loại bỏ phần còn lại; xóa sẽ là thay đổi phá hủy không có căn cứ trong brief.
- Xác minh bằng script so sánh href trước/sau: **0 href mất**, đúng **12 href mới** (10 Portal Navigation + 2 Workspace mới).

**Giới hạn đã biết:** 10 mục Portal Navigation dùng href dạng query string (`?area=X`) — logic active-highlight hiện tại của `AdminSidebar` (`isItemActive`) chỉ so khớp `pathname`, không đọc query string, nên các mục này **không tô sáng chính xác** khi đang active (điều hướng vẫn hoạt động đúng, chỉ là giới hạn hiển thị). Không sửa bằng cách thêm `useSearchParams()` vào `AdminSidebar` vì component này nằm trong `AdminShell` — layout dùng chung cho MỌI trang Admin — thêm `useSearchParams()` ở đây sẽ buộc toàn bộ Admin phải bọc Suspense ở cấp layout, rủi ro/phạm vi vượt quá "Không triển khai Business Logic" của sprint này.

## Task 2 — Header mới

`AdminHeader.tsx` (từ ADM-SPR-002, đã có breadcrumb + notification-area placeholder) tiếp tục hoạt động đúng với cấu trúc nav mới — không có yêu cầu nội dung Header cụ thể nào mới trong brief ngoài "hoạt động", nên sprint này **xác minh, không viết lại từ đầu** (đã kiểm tra qua build + cấu trúc `AdminShell.tsx`: Header/Breadcrumb/Sidebar vẫn đúng dây, không hardcode gì cần đổi).

## Task 3 — Portal Dashboard

Đã có từ ADM-SPR-200 (`/admin/portal`). Sprint này hoàn thiện: card mỗi Portal Area giờ link thẳng `/admin/portal/areas?area=<key>` (trước đó link chung chung tới `/admin/portal/areas`) — Founder bấm 1 lần là tới đúng Area, không phải tự chọn lại.

## Task 4 — Workspace Landing

- **2 route hoàn toàn mới**: `/admin/ai-workspace`, `/admin/journey` — dùng `WorkspaceSectionFoundation` (component Landing đã có từ WEB-SPR-001), trích dẫn đúng Portal Area/route thật tương ứng.
- **Nâng cấp 2 Landing hiện có** từ `ComingSoon` (component đơn giản) sang `WorkspaceSectionFoundation` (đầy đủ Scope/Sẽ quản lý/Nguồn Portal) để nhất quán: **Media Center**, **Companion Studio**.
- Kết quả: **11/11 Workspace Navigation bắt buộc** đều có Landing thật (Website/Brand Studio: Landing đầy đủ có Registry; CKOS/Academy/Premium/Projects & Opportunities/Community: route legacy đã có từ trước; Media Center/Companion Studio/AI Workspace/Journey: `WorkspaceSectionFoundation` — chưa có Registry nhưng có Landing nhất quán).

## Task 5 — Founder Dashboard Entry

Thêm 1 banner nhỏ, không xâm lấn, ngay dưới tiêu đề trang `/admin/dashboard` (Dashboard toàn cục, trang Founder/mọi Admin user thấy đầu tiên) — link thẳng `/admin/founder`. Không viết lại toàn bộ Dashboard legacy (ngoài phạm vi — không có yêu cầu Business Logic mới cho trang đó).

## Task 6 — Điều hướng Portal Management ↓ Workspace Management

`areas.ts` bổ sung field `ownerWorkspaceHref` cho cả 10 Portal Area (trước đó `ADM-SPR-200` chỉ có tên Workspace dạng text, không phải link). `PortalAreaLanding.tsx` giờ hiển thị nút **"Đi tới Workspace →"** ngay cạnh tên Owner Workspace khi đã xác định — bấm là nhảy thẳng từ Portal Area (Portal Management Layer) sang Workspace tương ứng (Workspace Management Layer), đúng yêu cầu "đảm bảo điều hướng giữa Portal Management Layer ↓ Workspace Management Layer".

**Tác dụng phụ tích cực:** rà lại việc gán Owner khi làm Task 6 phát hiện `areas.ts` (ADM-SPR-200) từng bỏ sót — Area "Companion" chưa có Owner dù `workspaceOwnership.ts` đã ghi Companion Studio sở hữu cả "Companion" lẫn "Sứ mệnh Companion" từ trước. Đã sửa đồng bộ 2 file.

**Kết quả:** nhờ AI Workspace/Journey được chính thức hóa + sửa lỗi đồng bộ Companion, số Portal Area **chưa có Owner giảm từ 4/10 (ADM-SPR-200) xuống còn 1/10** — chỉ còn "Trang chủ Học viện" (`/portal`), Workspace Navigation bắt buộc không liệt kê Workspace nào khớp rõ ràng cho Area này (không phải "Website" — Website Workspace sở hữu Homepage MARKETING công khai "/", khác Portal home "/portal" sau đăng nhập). Ghi nhận, trình PMO.

## Files Changed

**Sửa:** `src/lib/admin/nav.ts` (Portal Navigation + reorder + 2 Workspace mới), `src/components/admin/AdminSidebar.tsx` (icon cho 12 href mới), `src/lib/admin/portal/areas.ts` (ownerWorkspaceHref + sửa Owner Companion + gán Owner cho 3 Area nhờ AI Workspace/Journey/Academy), `src/lib/admin/workspaceOwnership.ts` (thêm AI Workspace + Journey, 11 entry), `src/components/admin/portal/PortalAreaLanding.tsx` (query-param deep-link + nút "Đi tới Workspace"), `src/app/admin/(dashboard)/portal/page.tsx` (link Area card có query param, cập nhật số liệu 1/10), `src/app/admin/(dashboard)/portal/areas/page.tsx` (bọc Suspense cho `useSearchParams`), `src/app/admin/(dashboard)/media-center/page.tsx`, `src/app/admin/(dashboard)/companion-studio/page.tsx` (ComingSoon → WorkspaceSectionFoundation), `src/app/admin/(dashboard)/dashboard/page.tsx` (thêm Founder entry banner).

**Mới:** `src/app/admin/(dashboard)/ai-workspace/page.tsx`, `src/app/admin/(dashboard)/journey/page.tsx`.

**Không đổi:** Website/Brand Studio/CKOS/Portal Dashboard component logic, mọi Registry hiện có, `Badge.tsx`, `AdminShell.tsx`/`AdminHeader.tsx` (đã xác minh, không cần sửa), Portal công khai.

## Sự cố đã xử lý

Lint phát hiện 6 lỗi thật (`react/no-unescaped-entities` — dấu ngoặc kép thẳng trong JSX text ở `portal/page.tsx`, phần text mới thêm về AI Workspace/Journey) — đã sửa bằng `&quot;`, đúng convention đã dùng nhiều lần trước đó.

## Verification

- **Lint (`npm run lint`):** sạch sau khi sửa — 0 lỗi, 5 warning có từ trước (không liên quan).
- **Type-check (`npx tsc --noEmit`):** sạch.
- **Build (`npm run build`):** thành công — 2 route mới (`/admin/ai-workspace`, `/admin/journey`) build ở dạng `ƒ`, không cảnh báo Suspense/useSearchParams.
- **Test (`npm run test`):** 139/139 pass, không regression.

## Acceptance Criteria — đối chiếu

| Acceptance | Đáp ứng |
|---|---|
| Main Shell hoạt động | ✅ `AdminShell` xác minh không đổi, hoạt động đúng với nav mới |
| Sidebar hoạt động | ✅ 12 href mới, 0 mất; giới hạn active-highlight cho Portal Navigation đã ghi nhận |
| Header hoạt động | ✅ Xác minh, không cần sửa |
| Portal Dashboard hoạt động | ✅ Link Area card giờ deep-link chính xác |
| Workspace Landing hoạt động | ✅ 11/11 Workspace Navigation bắt buộc đều có Landing (2 mới, 2 nâng cấp) |
| Founder điều hướng được toàn bộ Portal | ✅ 10/10 Portal Navigation + Portal Dashboard/Areas/Pages/Content Registry |
| Founder điều hướng được toàn bộ Workspace | ✅ 11/11 Workspace Navigation bắt buộc, cộng "Đi tới Workspace →" từ Portal Area |
| Không còn phụ thuộc Legacy Admin | ✅ Xác nhận không có Legacy Sidebar; mọi route mới dùng pattern hiện hành (`WorkspaceSectionFoundation`/`AdminWorkspaceShell`) |
| Build thành công | ✅ |
| Tests pass | ✅ 139/139 |

## Phase 2 Readiness

**SẴN SÀNG.** Main Shell Foundation hoàn chỉnh theo đúng Scope (Global Layout/Sidebar/Header/Portal Navigation/Workspace Navigation/Workspace Landing/Portal Dashboard/Founder Dashboard Entry), không CRUD/Database/API/Runtime/Business Logic nào được thêm, build/test đều pass.

**Việc còn treo, cần PMO quyết định trước Phase tiếp theo:**
- Owner của Portal Area "Trang chủ Học viện" (duy nhất còn lại chưa xác định).
- 11 câu Open PMO Questions đã tích lũy từ ADM-SPR-200/IMP-ADM-100 vẫn chưa xử lý (xem Founder Workspace, `/admin/founder`).
- Giới hạn active-highlight của Portal Navigation (query-string href) — chấp nhận được ở Foundation hay cần một giải pháp Shell-level không dùng `useSearchParams` cấp layout.
