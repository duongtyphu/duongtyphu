# PREMIUM-SPR-701 — Premium Course Commerce Management

**Epic:** EPIC-02 · **Phase:** Phase 7 — Premium · **Brief:** IMP-PREMIUM-701
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal Premium hiện tại là Reference Source duy nhất.

Báo cáo theo đúng format ngắn brief yêu cầu (7 mục).

---

## 1. Đã làm gì

- **Portal Mapping (Task 1):** đối chiếu trực tiếp `/portal/premium/page.tsx` — đúng 6 Section JSX (Hero, Companion Advisor, Program Grid 5 chương trình, Tư vấn 1:1, Founder Spotlight, Payment Info+FAQ). Đính chính `sectionRegistry.ts`/`contentBlockRegistry.ts` (bản cũ PORTAL-SPR-301 thiếu Hero/Payment+FAQ, gộp sai Advisor+Consult thành 1 section dù không liền kề, và có "Course Row" không tồn tại trên Portal — đó là component **Admin** tại `/admin/course-pricing`).
- **Premium Program Registry (Task 2):** thêm bảng vào `/admin/premium` — đúng 6 chương trình Founder xác nhận (5 khớp `courses` qua cùng logic `matchPatterns` mà Portal dùng, hiển thị giá/trạng thái/`course_id` thật + Tư vấn 1:1 không giá/checkout).
- **Bọc `AdminWorkspaceShell`** cho 4 route trực tiếp thuộc Task 6 ("Premium sở hữu Pricing/Checkout/Order/Entitlement"): `/admin/premium`, `/admin/course-pricing`, `/admin/orders`, `/admin/coupons`. **Không** bọc Dịch vụ/Hỗ trợ/Leads/Affiliate Hub (4 route) — cùng nhóm nav nhưng ngoài phạm vi "Course Commerce" mà Task 6 định nghĩa, không sửa để tránh scope creep trên sprint đã rất lớn.
- **Task 8 — Critical Commerce Validation:** vá 1 lỗi thật, có bằng chứng, không cần migration — xem mục 3.
- **Đính chính `workspaceOwnership.ts`:** entry Premium trước đây tuyên bố sở hữu "Học phí" như thể quản lý được cả nội dung khoá học — sửa để ghi rõ ranh giới thật (chỉ Pricing/Checkout/Order/Entitlement, không sở hữu Course Structure/Video/Document).

---

## 2. Coverage của 6 chương trình

Đúng 6 chương trình, không tự đổi tên/gộp/tạo mới — xác nhận nguồn `PREMIUM_PROGRAMS` (5 mục) + `PremiumConsult.tsx` (Tư vấn 1:1, tách riêng, có chủ đích):

| # | Chương trình | Giá/trạng thái | Curriculum/nội dung | Media |
|---|---|---|---|---|
| 1 | Lớp học AI Cơ bản | ✅ Thật (Supabase `courses`, `/admin/course-pricing`) | ❌ Hardcode (`premium-programs.ts`) | ❌ Không tồn tại |
| 2 | Lớp học AI Nâng cao | ✅ Thật | ❌ Hardcode | ❌ Không tồn tại |
| 3 | Lớp học OpenClaw | ✅ Thật | ❌ Hardcode | ❌ Không tồn tại |
| 4 | V-Solo | ✅ Thật | ❌ Hardcode | ❌ Không tồn tại |
| 5 | V-Scale | ✅ Thật | ❌ Hardcode | ❌ Không tồn tại |
| 6 | Tư vấn 1:1 | ❌ Không có giá/checkout (đúng bản chất — dịch vụ tư vấn, không phải sản phẩm số) | ❌ Hardcode (SĐT/Zalo trong `PremiumConsult.tsx`) | — |

**Mỗi lớp có checkout/order/entitlement riêng theo `course_id`** (đạt) — nhưng **0/5 lớp có cấu trúc chủ đề/chương/bài học/video/tài liệu Admin-quản lý được** (bảng `courses` chỉ có `id/name/status/price`, không có cột nội dung, không có bảng `course_lessons`). Founder Directive yêu cầu Admin quản lý được "Chủ đề/Chương/Bài học/Video/Tài liệu/File tải xuống/Prompt/Template/Bonus" cho từng lớp — **0% khả thi với schema hiện tại**, không xây CRUD giả cho phần này (đúng "Không xây CRUD giả").

---

## 3. Luồng thanh toán và cấp quyền hiện tại

Chọn chương trình → `/portal/checkout?type=course&id=<courses.id>` → `createOrder()` ghi `orders.course_id = String(id)`, giá lấy lại server-side từ `courses` (không tin giá client gửi — an toàn) → SePay webhook xác nhận đúng số tiền (`transferAmount === order.amount`, không auto-confirm sai) → `orders.status='confirmed'` → `getPurchasedIds("course_id")` đọc đúng cột đã ghi → Portal Premium hiện "Đã sở hữu" đúng lớp đã mua. **Chuỗi ID nhất quán từ checkout → order → ownership-badge, không phát hiện mismatch course_id/product_id/lesson_id ở tầng này** (khác lo ngại ban đầu của brief).

**Phát hiện thật — lỗ hổng nằm ở bước cuối, không phải bước ghi ID:** `/portal/my-products` và `/portal/account` chỉ JOIN `products(...)`/`lessons(...)` (qua FK thật), **không JOIN `courses(...)`** vì `orders.course_id` là cột `text` thường, không phải FK — không thể auto-embed. Kết quả: **học viên thanh toán thành công cho 1 trong 3 "Lớp học" nhận huy hiệu "Đã sở hữu" nhưng 2 trang này không hiển thị Video/PDF nào** (vì `courses` bản thân cũng không có cột nội dung — không phải chỉ thiếu JOIN, mà nội dung không tồn tại ở đâu để JOIN tới).

**Đã vá (an toàn, không cần migration):** `my-products/page.tsx` + `account/page.tsx` — thêm `course_id` vào `.select()` (cột có sẵn), khi đơn hàng đã confirmed nhưng không có video/pdf VÀ có `course_id`, hiển thị thông báo trung thực *"Nội dung khoá học đang được chuẩn bị — Founder sẽ liên hệ trực tiếp để cấp quyền truy cập"* thay vì im lặng không hiện gì. `/admin/orders` thêm cột "Khoá học đã mua" (course_id/product_id/lesson_id thật) để Founder tự xác minh từng đơn ghi đúng khoá nào — trực tiếp phục vụ yêu cầu Task 8 "Xác định chính xác checkout đang ghi khóa nào."

---

## 4. Nội dung nào vẫn hardcode

- Toàn bộ curriculum/nội dung 5 chương trình (`description`, `audience`, `problems`, `topics`, `outcome`, `lessonCount`, `ctaLabel`, badge/accent màu) — `src/components/portal/premium/premium-programs.ts`.
- Tư vấn 1:1: SĐT + Zalo — `PremiumConsult.tsx` (không phải `siteConfig` dù comment gốc claim vậy).
- 4 bước "Thanh toán hoạt động thế nào" + FAQ — `page.tsx`.
- **Không có Video/PDF/tài liệu nào cho 3 "Lớp học"/V-Solo/V-Scale ở bất kỳ đâu** — không phải hardcode, mà hoàn toàn không tồn tại trong dữ liệu (không có cột, không có bảng).

---

## 5. Blocker

**P0 — Cần quyết định Product/schema, KHÔNG tự chạy migration (đúng Task 8):**
1. `courses` không có mô hình nội dung học (chủ đề/chương/bài học/video/tài liệu) — cần ADD COLUMN hoặc bảng mới (`course_lessons`...) + đổi `orders.course_id` thành FK thật để JOIN được, hoặc thiết kế khác. Đây là quyết định kiến trúc Product, không phải sửa lỗi code.
2. Do (1), **17 hạng mục Admin quản lý được theo Founder Directive** (chủ đề/chương/bài học/video/tài liệu/file tải xuống/prompt/template/bonus/access policy/entitlement chi tiết theo bài học) **hiện chỉ có 2/17 khả thi** (giá, mở/đóng đăng ký — qua `/admin/course-pricing`). 15/17 cần schema mới.
3. Task 7 Future Flexibility: 2/12 hành động Founder Directive liệt kê (đổi giá, mở/đóng đăng ký) đã 0-code; **10/12 còn lại** (thêm lớp học mới ngoài 6 lớp cố định, thêm chủ đề/chương/bài học, upload video/tài liệu, sắp xếp nội dung, cấp quyền theo bài học) cần sửa schema + code — ghi rõ, không tự xử lý ngoài phạm vi Sprint.

Không có blocker chặn phần đã làm (Program Registry, Portal Mapping, Ownership, vá honest-disclosure) — các phần này verify sạch.

---

## 6. Build/test

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận 7 route đã sửa build đúng (`/admin/premium`, `/admin/course-pricing`, `/admin/orders`, `/admin/coupons`, `/portal/premium`, `/portal/my-products`, `/portal/account`)
- [x] `npm run test` — 139/139 pass
- [x] Smoke test route (build-level): đạt, không lỗi runtime khi build
- [ ] Smoke test checkout/entitlement thật: **không thực hiện được** — môi trường session này không có `.env.local`/Supabase config (`SUPABASE_SERVICE_ROLE_KEY` chưa cấu hình), không có cách nào tạo giao dịch/webhook SePay thật một cách an toàn ở đây. Đã xác minh toàn bộ luồng bằng đọc trực tiếp source code (mục 3), không phải chạy thử.

---

## 7. Files changed

**Mới:**
- `src/lib/admin/premium/navigation.ts` — `PREMIUM_WORKSPACE_SECTIONS`.
- `docs/admin/PREMIUM_WORKSPACE_MANAGEMENT_PREMIUM-SPR-701.md` (file này).

**Sửa — Admin:**
- `src/app/admin/(dashboard)/premium/actions.ts` — thêm `listProgramRegistry()` (Task 2).
- `src/app/admin/(dashboard)/premium/page.tsx` — bọc Shell, thêm bảng Premium Program Registry (6 chương trình).
- `src/app/admin/(dashboard)/course-pricing/page.tsx`, `orders/page.tsx`, `coupons/page.tsx` — bọc Shell.
- `src/app/admin/(dashboard)/orders/actions.ts`, `OrderRow.tsx` — thêm cột "Khoá học đã mua" (course_id/product_id/lesson_id thật, Task 8).

**Sửa — Portal (chỉ 2 file, chỉ UI hiển thị, không đổi luồng checkout/order/webhook):**
- `src/app/portal/my-products/page.tsx`, `src/app/portal/account/page.tsx` — thêm `course_id` vào select, hiển thị thông báo trung thực khi đơn hàng khoá học đã confirmed nhưng chưa có nội dung (Task 8).

**Sửa — Registry:**
- `src/lib/admin/portal/sectionRegistry.ts`, `contentBlockRegistry.ts` — đính chính 6 Section thật của `page_premium`.
- `src/lib/admin/workspaceOwnership.ts` — entry `premium` ghi rõ ranh giới Task 6 thật.

Không merge. Không deploy Production. Chờ PMO review.
