# ADMIN SHELL — IMP-ADM-002 (ADM-SPR-002, EPIC-02)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Đây là sprint thứ hai của EPIC-02, nối tiếp ADM-SPR-001 (`docs/admin/ADMIN_CMS_FOUNDATION.md`). Phạm vi sprint này là hoàn thiện **khung (Shell)** dùng chung cho toàn bộ Canonical Admin — layout, sidebar, header, breadcrumb, page container, responsive, access guard, cô lập Legacy, và tokenize design system — làm nền để các module nghiệp vụ (CKOS, Academy, Premium, Companion Studio, Users, Analytics, System) phát triển ở các sprint sau. **Không xây CRUD nghiệp vụ, không migration dữ liệu, không sửa database, không thay đổi Portal, không mở rộng RBAC, không thay đổi hệ thống authentication.**

---

## 1. Canonical Admin Shell Report

### Task 1 — Admin Layout

Cấu trúc layout của Canonical Admin đã đúng chuẩn Next.js App Router từ trước, không cần tái cấu trúc:

- `src/app/admin/layout.tsx` — layout gốc cho toàn bộ `/admin/*` (kể cả `/admin/login`), chỉ bọc `<AdminToastProvider>`.
- `src/app/admin/(dashboard)/layout.tsx` — layout cho vùng đã xác thực: kiểm tra Supabase auth + `members.is_admin`, sau đó render `<AdminShell>{children}</AdminShell>`.

Đây **không phải** hai layout trùng lặp/xung đột — đây là pattern nested-layout đúng chuẩn (layout gốc cho cả cây `/admin`, layout con chỉ cho vùng cần xác thực). Xác nhận: chỉ có duy nhất một `layout.tsx` cho toàn bộ 56 trang trong `(dashboard)`, không có trang nào tự định nghĩa layout cạnh tranh. **Không có thay đổi code ở Task này** — chỉ xác nhận và ghi nhận lại.

### Task 2 — Sidebar

Đã triển khai lại `src/lib/admin/nav.ts` theo đúng cấu trúc 14 nhóm PMO đã phê duyệt (xem chi tiết Mục 2 — Admin Navigation Report). 4 nhóm chưa có module (Website, Brand & Media, Companion Studio, SEO) hiển thị badge **"Sắp ra mắt"** và trỏ tới một trang placeholder tối giản (không CRUD, không nghiệp vụ) — xem `src/components/admin/ComingSoon.tsx`.

### Task 3 — Header

`src/components/admin/AdminHeader.tsx` đã có sẵn: nút thu gọn/mở sidebar, logo, `AdminSearch`, `AdminUserMenu`. Sprint này bổ sung/chuẩn hóa:

- **Page title / Breadcrumb** — mới: `src/components/admin/AdminBreadcrumb.tsx`, tự động suy ra từ URL hiện tại + `nav.ts` (Admin › Nhóm › Trang), gắn vào `AdminShell` phía trên vùng nội dung. Áp dụng cho **toàn bộ 56 trang** ngay lập tức, không cần sửa từng trang. **Cố ý không render thêm `<h1>`** — mỗi trang đã có `<h1>` riêng (qua `CrudPage`/`ResourceManager`/`ContentManager` hoặc markup tự viết); thêm một `<h1>` nữa ở tầng Shell sẽ tạo lỗi heading-hierarchy trùng lặp giống lỗi đã sửa ở Portal (IMP-SPR-006).
- **Notification Area** — mới: `src/components/admin/AdminNotifications.tsx`, một icon chuông trong Header mở dropdown trạng thái rỗng ("Chưa có thông báo nào"). Đây thuần là chỗ trống (slot) cho hệ thống thông báo tương lai — **không có dữ liệu/logic thông báo thật**, đúng yêu cầu "không xây module nghiệp vụ".
- **Search** — không đổi (`AdminSearch.tsx` đã hoạt động tốt, tìm toàn bộ `nav.ts`).
- **User profile** — không đổi (`AdminUserMenu.tsx` đã có sẵn, chỉ tokenize màu, xem Task 8).
- **Theme switch** — **không triển khai.** Admin hiện chỉ có một theme (navy tối), không tồn tại hệ thống theme sáng/tối nào để chuyển đổi. Xây theme switcher mới sẽ là tính năng mới, ngoài phạm vi "chuẩn hóa" của sprint này.

### Task 4 — Navigation Consistency

Vì `AdminSidebar`, `AdminHeader`, và `AdminBreadcrumb` (mới) đều được gắn duy nhất một lần trong `AdminShell.tsx`, và `AdminShell` chỉ được render từ `(dashboard)/layout.tsx` — cả 56 trang (kể cả 18 trang CUSTOM tự viết markup) đều tự động dùng chung một bộ Sidebar/Header/Breadcrumb, không cần migration từng trang. Không phát hiện layout trùng lặp nào cần loại bỏ.

### Task 5 — Responsive

Xem Mục 3 — Responsive Report.

### Task 6 — Access Guard

Xác nhận: guard đã thống nhất từ trước, **không thay đổi hệ thống authentication, không mở rộng RBAC**:

- `src/middleware.ts` chặn ở network edge cho toàn bộ `/admin/:path*` (trừ `/admin/login`).
- `src/app/admin/(dashboard)/layout.tsx` có bản kiểm tra dự phòng ở server (defense in depth).
- `src/lib/admin/requireAdmin.ts` bảo vệ các Server Action/API mutation (9 file gọi trực tiếp).
- Duy nhất `/admin/page.tsx` (redirect sang `/admin/dashboard`) và `/admin/login/page.tsx` nằm ngoài `(dashboard)` — đúng thiết kế, không phải lỗ hổng.

**Không có thay đổi code ở Task này** — entry point đã nhất quán từ ADM-SPR-001.

### Task 7 — Legacy Isolation

Xem Mục 4 — Legacy Isolation Report.

### Task 8 — Design System

Đối chiếu `globals.css` phát hiện: các màu hex cứng trong Shell (`#06142D`, `#0B1F4D`, `#2563EB`, `#FF7A00`) **trùng khớp chính xác** với các token màu đã tồn tại sẵn (`--color-brand-navy`, `--color-brand-navy-soft`, `--color-brand-blue`, `--color-brand-orange`) — nghĩa là Shell trước đây vô tình "hardcode lại" đúng giá trị token thay vì tham chiếu class Tailwind sẵn có. Đã thay thế toàn bộ bằng token, **giá trị màu giữ nguyên 100%, không đổi giao diện** (xác minh bằng ảnh chụp `/admin/login` trước/sau — xem Mục 3). Đồng thời thay `text-red-300`/`hover:bg-red-400/10 hover:text-red-300` (2 chỗ) bằng token `gemos-danger` đã có sẵn, khớp với cách trang login đã dùng cho banner lỗi.

**Phạm vi tokenize:** chỉ giới hạn ở các file thuộc Shell thật sự (`AdminShell`, `AdminHeader`, `AdminSearch`, `AdminSidebar`, `AdminUserMenu`, `admin/login/page.tsx`). Các màu đỏ hardcode trong `CrudPage.tsx`, `Badge.tsx`, `Modal.tsx`, và các trang nghiệp vụ (`OrderRow`, `CouponRow`, `UserRow`, `ProductForm`, `CaseStudyForm`, v.v.) **không được đụng tới** — đó là code module nghiệp vụ, ngoài phạm vi "Shell" của sprint này.

Typography, spacing, radius, icon system: không phát hiện sai lệch trong các file Shell (đã theo System UI Font Stack từ IMP-2026-TYPO-001, dùng nhất quán `rounded-lg`/`rounded-2xl`/`rounded-full` theo token bán kính hiện có, icon 100% từ `lucide-react`). **Không redesign** — chỉ tokenize, không đổi bố cục/kích thước/màu sắc nhìn thấy được.

---

## 2. Admin Navigation Report

`src/lib/admin/nav.ts` được viết lại theo đúng 14 nhóm cấp cao nhất PMO đã duyệt: Dashboard, Website, Brand & Media, Content, CKOS, Academy, Premium, Projects & Opportunities, Community, Companion Studio, Users & Access, Analytics, SEO, System Settings.

**Đã xác minh bằng script so khớp:** không mất bất kỳ href nào trong số 51 mục cũ; chỉ thêm đúng 5 mục mới (`/admin/resources` — trang đã tồn tại nhưng trước đây chưa từng có trong sidebar, một orphan-page mà cả hai audit của ADM-SPR-001 đều bỏ sót; và 4 trang Coming Soon mới). Tổng cộng hiện có **56 mục điều hướng**, không trùng lặp href.

**Quyết định gán nhóm cho các mục không khớp trực tiếp với 1 trong 14 tên** (ghi rõ để PMO có thể điều chỉnh nếu không đúng ý định):

| Cụm cũ | Gán vào nhóm mới | Lý do |
|---|---|---|
| Portal Builder (7 trang: banner, CTA, featured, start-here, today-actions, user-goals, dashboard portal) | **Content** | Đây là các khối nội dung cấu hình cho trang chủ Portal — gần với khái niệm "nội dung" nhất trong 14 nhóm, dù không hoàn toàn khớp. |
| Lộ trình (roadmap, nhiệm vụ hôm nay) | **Academy** | Gắn với hành trình học tập của học viên. |
| Dự án thực chiến (chấm điểm submissions) | **Academy** | Gắn với việc học/thực hành, không phải thương mại. |
| Học phí V-SOLO/V-SCALE (course-pricing) | **Premium** | Đây là giá bán của thực thể mua hàng canonical (Course, theo ADR-004) — thuộc về thương mại hơn là học thuật. |
| Affiliate (5 trang) | **Premium** | Affiliate là kênh doanh thu gắn liền với sản phẩm trả phí. |
| Hỗ trợ (support tickets) | **Premium** | Hỗ trợ khách hàng hiện gắn chặt với đơn hàng/thanh toán. |
| Leads | **Premium** | Phễu bán hàng trước khi thành đơn hàng. |
| ĐẦU TƯ CÙNG TÔI (digital-assets, 11 trang) | **Projects & Opportunities** | Đổi tên nhóm để khớp tên tiếng Anh đã duyệt — nội dung giữ nguyên. |
| Báo cáo (reports) | **Analytics** | Khớp trực tiếp. Các báo cáo con theo domain (affiliate/analytics, digital-assets/analytics) vẫn ở lại nhóm domain tương ứng để giữ ngữ cảnh liền mạch. |

Đây là các lựa chọn phân nhóm hợp lý nhất dựa trên thực tế repo hiện có, **không phải quyết định kiến trúc/nghiệp vụ mới** — không trang nào bị xoá, đổi URL, hay đổi dữ liệu. Nếu PMO có ý định phân nhóm khác, đây chỉ là thay đổi trong `nav.ts`, không đụng route/dữ liệu.

**4 nhóm Coming Soon** (Website, Brand & Media, Companion Studio, SEO) mỗi nhóm có đúng 1 trang placeholder (`ComingSoon.tsx`), hiển thị badge "Sắp ra mắt" màu cam ở sidebar và trong trang, không có CRUD/dữ liệu.

---

## 3. Responsive Report

**Giới hạn môi trường kiểm thử:** sandbox này không có `SUPABASE_SERVICE_ROLE_KEY`/credentials thật, nên không thể đăng nhập để render trực tiếp `AdminShell` đã xác thực (giới hạn đã ghi nhận từ Sprint 5 của EPIC-01, áp dụng tương tự cho Admin). Đã **không** tạo bất kỳ bypass tạm thời nào cho auth guard để chụp ảnh — vi phạm tinh thần Task 6 dù chỉ tạm thời. Phương pháp xác minh: chụp ảnh trực quan trang `/admin/login` (dùng chung token màu vừa tokenize) ở 3 breakpoint + rà soát source-level các class responsive của Shell.

**Xác minh trực quan** (`/admin/login`, không cần xác thực) tại desktop (1440×900), tablet (834×1112), mobile (390×844): giao diện hiển thị đúng, màu sắc giữ nguyên 100% sau khi tokenize (xác nhận Task 8 không gây lệch màu).

**Rà soát source-level `AdminShell.tsx`** (đã đọc toàn bộ, không đổi logic breakpoint):
- Sidebar desktop: `hidden shrink-0 ... md:block` — ẩn dưới 768px, hiện từ 768px trở lên, có thể thu gọn (`collapsed`, lưu `localStorage`).
- Drawer mobile: `fixed inset-0 z-50 md:hidden`, chỉ render khi `drawerOpen`, có nút đóng + phím Escape.
- Nút toggle dùng đúng ngưỡng `window.innerWidth < 768` — khớp chính xác với breakpoint `md:` (768px) của Tailwind, không lệch pha giữa JS và CSS.
- `AdminHeader`: input tìm kiếm desktop ẩn dưới `md` (`hidden ... md:block`), thay bằng icon + overlay toàn màn hình dưới `md` (`md:hidden`) — pattern đã có từ trước, không đổi.
- `AdminUserMenu`: email đầy đủ ẩn dưới `sm` (`hidden ... sm:inline`), chỉ hiện avatar tròn — giữ Header gọn trên mobile.
- Nút `AdminNotifications` mới thêm là một nút tròn 36×36px cố định, không có class responsive riêng — cùng kích thước với nút Search/toggle sẵn có, không có rủi ro tràn ngang ở 390px (tổng chiều rộng các phần tử cố định trong Header ở mobile: toggle 36px + logo ~28px + search-icon 36px + notifications 36px + avatar ~36px + khoảng cách `gap-2` — nằm trong giới hạn 390px với biên độ an toàn).

**Kết luận:** không phát hiện vấn đề responsive từ rà soát source. Khuyến nghị ADM-SPR-003 (khi có Supabase credentials thật hoặc tài khoản admin test) bổ sung một vòng kiểm thử trực quan đầy đủ trên Shell đã xác thực để xác nhận 100%.

---

## 4. Legacy Isolation Report

- **`admin.html` không xuất hiện trong `nav.ts`** — xác nhận, chưa từng có, không cần sửa.
- **Canonical Admin không điều hướng ngược về Legacy** — grep toàn bộ `src/` cho chuỗi `"admin.html"`: **0 kết quả**. Không có link, redirect, hay tham chiếu nào từ Next.js Admin trỏ về `admin.html`.
- **Các điểm còn phụ thuộc (chưa cô lập được, cần ghi nhận):** cô lập ở tầng *điều hướng* không đồng nghĩa cô lập ở tầng *dữ liệu*. Theo `docs/admin/ADMIN_CMS_FOUNDATION.md` §13 (Risk R1), `admin.html` vẫn đang ghi trực tiếp vào ít nhất 11 bảng Supabase mà Canonical Admin cũng ghi vào (`courses`, `coupons`, `orders`, `leads`, `support_tickets`, `products`, `submissions`, `case_studies`, `members`, và hai cặp bảng khác-tên-cùng-khái-niệm `blog_posts`/`blog`, `prompt_templates`/`prompts`). Đây là phụ thuộc thật, không thể "cô lập" bằng cách sửa sidebar — cần Phase 1-3 của Legacy Admin Sunset Plan (đã ghi trong ADMIN_CMS_FOUNDATION.md §12), nằm ngoài phạm vi sprint Shell này.
- **Không sửa `admin.html`** trong sprint này, đúng yêu cầu "Không xóa Legacy Admin."

---

## 5. Files Changed

**Sửa đổi (7 file):**
- `src/lib/admin/nav.ts` — viết lại theo 14 nhóm PMO duyệt, thêm `comingSoon?: boolean`.
- `src/components/admin/AdminShell.tsx` — gắn `AdminBreadcrumb`, tokenize màu.
- `src/components/admin/AdminHeader.tsx` — thêm `AdminNotifications`, tokenize màu.
- `src/components/admin/AdminSidebar.tsx` — icon cho 5 mục mới, hiển thị badge "Sắp ra mắt", tokenize màu tooltip.
- `src/components/admin/AdminSearch.tsx` — tokenize màu overlay/dropdown.
- `src/components/admin/AdminUserMenu.tsx` — tokenize màu dropdown + trạng thái lỗi.
- `src/app/admin/login/page.tsx` — tokenize màu nền/card/logo/thông báo lỗi.

**Mới (7 file):**
- `src/components/admin/AdminBreadcrumb.tsx`
- `src/components/admin/AdminNotifications.tsx`
- `src/components/admin/ComingSoon.tsx`
- `src/app/admin/(dashboard)/website/page.tsx`
- `src/app/admin/(dashboard)/brand-media/page.tsx`
- `src/app/admin/(dashboard)/companion-studio/page.tsx`
- `src/app/admin/(dashboard)/seo/page.tsx`

**Không đổi:** mọi file trong `src/app/admin/(dashboard)/**` thuộc 51 trang nghiệp vụ hiện có (CrudPage/ResourceManager/ContentManager/CUSTOM) — không trang nào bị sửa nội dung, chỉ được "thừa hưởng" Breadcrumb mới qua Shell dùng chung. Database, migration, checkout, RBAC, authentication: không đổi.

---

## 6. Verification

- **Lint (`npm run lint`):** 0 lỗi, 5 warning có từ trước (không liên quan sprint này).
- **Build (`npm run build`):** thành công, toàn bộ route biên dịch — xác nhận cả 4 trang Coming Soon và `/admin/resources` đã có trong danh sách route.
- **Test (`npm run test`):** 139/139 pass, không có regression.
- **So khớp `nav.ts`:** script xác nhận không mất href nào, chỉ thêm đúng 5 mục mới, không trùng lặp.
- **Xác minh trực quan:** ảnh chụp `/admin/login` ở 3 breakpoint, màu sắc giữ nguyên sau tokenize.

---

## 7. ADM-SPR-003 Readiness

**SẴN SÀNG — ADM-SPR-003 có thể bắt đầu.** Shell hiện đã có:
- Layout thống nhất, đã xác nhận không trùng lặp.
- Sidebar đầy đủ 14 nhóm theo cấu trúc PMO duyệt, không mất route nào, có chỗ đứng rõ ràng cho mọi module tương lai (kể cả 4 module chưa xây, đã có placeholder + route thật).
- Header hoàn chỉnh: title/breadcrumb tự động, search, notification slot, user menu.
- Breadcrumb dùng chung, áp dụng tự động cho toàn bộ trang hiện tại và tương lai — không cần migration khi thêm module mới.
- Access guard đã xác nhận nhất quán, không đổi.
- Legacy đã cô lập ở tầng điều hướng (0 tham chiếu); phụ thuộc dữ liệu còn lại đã ghi rõ, chờ Legacy Sunset Plan riêng.
- Design token cho Shell đã nhất quán, không còn hex cứng trong các file Shell.

**Hai điểm cần PMO xác nhận trước khi giao module đầu tiên (không phải blocker, chỉ là lựa chọn cần chốt):**
1. **Cách phân nhóm 9 cụm trang không khớp trực tiếp 1-trong-14 tên** (Mục 2 ở trên) — nếu PMO muốn phân nhóm khác (ví dụ tách Affiliate/Leads/Hỗ trợ ra khỏi Premium), đây là việc sửa `nav.ts`, rẻ và an toàn để làm ở đầu ADM-SPR-003.
2. **Thứ tự module nào xây trước** — `docs/admin/ADMIN_CMS_FOUNDATION.md` §14 đã đề xuất thứ tự (giảm rủi ro Legacy trước, rồi Role foundation, Content lifecycle, Premium/ADR-004, Companion Studio dashboard) — sprint này không thay đổi đề xuất đó, chỉ nhắc lại để PMO chốt trước khi giao việc.

Không phát hiện vấn đề nào buộc phải chặn ADM-SPR-003.

---

## Phạm vi tuân thủ (Scope discipline)

Theo đúng yêu cầu "Out of Scope" của brief, sprint này **không**: xây CRUD nghiệp vụ nào, không migration dữ liệu, không sửa database, không đụng CKOS/Academy/Premium Management, không xây Companion runtime, không xây Analytics thật, không đụng User Management, không thay đổi Portal (ngoại trừ không có thay đổi nào tới Portal trong sprint này). Toàn bộ thay đổi code giới hạn ở 14 file liệt kê tại Mục 5, tất cả đều thuộc về Shell/khung, không phải module nghiệp vụ.
