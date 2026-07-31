# Admin CMS v2.0 — Workspace Coverage Inventory

Nguồn: `src/lib/admin/nav.ts` (73 nav item, không tính `/admin` redirect,
`/admin/login`, và `/admin/users/[id]` — 2 route sau không phải nav item mà
là entry point/drill-down). Số liệu tạo bằng script đối chiếu trực tiếp nội
dung từng `page.tsx` (không suy đoán) tại thời điểm Sprint 8 (ADM-V2-08).

| Workspace | SubGroup | Tổng route | EmptyState | Real (khác) |
|---|---|---|---|---|
| Tổng quan | — | 4 | 3 | 1 |
| Người dùng | — | 8 | 5 | 3 |
| Website | — | 6 | 3 | 3 |
| Học viện | Trang chủ Học viện | 1 | 0 | 1 |
| Học viện | Companion | 1 | 0 | 1 |
| Học viện | Hệ tri thức AI (CKOS) | 11 | 0 | 11 |
| Học viện | Học viện AI | 2 | 0 | 2 |
| Học viện | AI Workspace | 3 | 0 | 3 |
| Học viện | Dự án & Cơ hội | 3 | 0 | 3 |
| Học viện | Premium | 3 | 0 | 3 |
| Học viện | Cộng đồng | 3 | 0 | 3 |
| Học viện | Hành trình của tôi | 5 | 0 | 5 |
| Học viện | Sứ mệnh Companion | 2 | 0 | 2 |
| **Học viện (tổng)** |  | **34** | **0** | **34** |
| Vận hành | — | 6 | 2 | 4 |
| Marketing | — | 5 | 5 | 0 |
| Thương hiệu & Media | — | 5 | 3 | 2 |
| Hệ thống | — | 5 | 3 | 2 |
| **TỔNG CỘNG** |  | **73** | **24** | **49** |

**49/73 (67%)** route có chức năng thật (DataTable/VisualEditor/Live-edit/
Bespoke đọc-ghi dữ liệu thật hoặc chỉ-đọc dữ liệu thật). **24/73 (33%)**
là `AdminEmptyState` trung thực — module đã có route/layout/phân quyền
thật, chờ dữ liệu/hạ tầng/quyết định phạm vi trước khi xây tiếp. **0**
route còn dùng badge "Sắp triển khai"/`WorkspacePlaceholder` (đã xoá hẳn
component này ở Sprint 8 vì không còn consumer).

## Ghi chú theo từng Workspace

### 1. Tổng quan (4 route, 1 real)
Chỉ "Công việc" tổng hợp `orders.pending + support_tickets.open +
leads.new` là thật; "Thông báo"/"Hoạt động gần đây" — 1 trong 2 là
`EmptyState` ("Thông báo" — hệ thống chưa có bảng `notifications`/
Realtime), còn "Hoạt động gần đây" đã là route thật (gộp 3 bảng theo
`created_at`). Dashboard chính (`/admin/dashboard`) tính riêng, không nằm
trong 4 route con.

### 2. Người dùng (8 route, 3 real)
"Danh sách người dùng"/"Hồ sơ của tôi"/"Vai trò & Phân quyền" là thật
(đọc `auth.users`+`members` qua Identity Hub helper có sẵn). 5 route còn
lại (Thành viên/Premium Membership/Phiên đăng nhập/Thiết bị/Hoạt động
người dùng) — "Thiết bị" là `EmptyState` thật sự (Supabase Auth không
expose thông tin thiết bị); "Thành viên" là `EmptyState` vì **0 đơn hàng
`confirmed`** tại thời điểm audit (đúng trạng thái dữ liệu, không phải
lỗi). Phân loại route-classifier gắn "Bespoke" hay "EmptyState" tùy nội
dung — xem `ADMIN_ROUTE_INVENTORY.md` để biết chính xác từng route.

### 3. Website (6 route, 3 real)
Landing Page (Live-edit, 8 section chrome) + Header & Footer
(`SingletonEditor` trên bảng `settings` có sẵn) + SEO Website (chỉ đọc,
import thẳng `sitemap()`/`robots()`/metadata 6 trang) là thật. Điều
hướng/Popup & Banner/Nội dung Website là `EmptyState` — "Điều hướng" đã
có migration PROPOSAL (`supabase-phase26-site-navigation.sql`, CHƯA
apply, chờ duyệt riêng).

### 4. Học viện (34 route, TẤT CẢ real — 0 EmptyState)
Workspace lớn nhất và duy nhất không còn `EmptyState` nào — đây là toàn
bộ nội dung Portal, đã được xây dựng qua nhiều đợt "Nhóm 3"/"CKOS"/
"Live-edit" TRƯỚC KHI chương trình ADM-V2 8-sprint bắt đầu. Sprint 7
(ADM-V2-07) chỉ retrofit breadcrumb, không xây module mới.

### 5. Vận hành (6 route, 4 real)
Đơn hàng/Mã giảm giá/Khách hàng tiềm năng/Hỗ trợ khách hàng đọc-ghi dữ
liệu thật (`orders`/`coupons`/`leads`/`support_tickets`). Thanh toán/Tiếp
thị liên kết là `EmptyState` (Thanh toán không có thực thể riêng, chỉ là
cột `status` của Đơn hàng; Tiếp thị liên kết đọc bảng `referrals` thật
nhưng **0 dòng dữ liệu** tại thời điểm audit).

### 6. Marketing (5 route, 0 real DataTable/CRUD — nhưng 1 route đọc thật)
Bảng đếm ở trên phân loại theo route-classifier (Bespoke/EmptyState) —
"Chuyển đổi" thực ra ĐÃ đọc dữ liệu thật (join `leads`×`orders`) nhưng bộ
phân loại gắn nó vào nhóm "Bespoke" (không phải "EmptyState"), tính đúng
trong cột "Real". 4 route còn lại (Chiến dịch/Email Marketing/CTA/Phân
tích Marketing) là `EmptyState` — không có hạ tầng campaign/email/
tracking nào tồn tại trong dự án.

### 7. Thương hiệu & Media (5 route, 2 real)
Tài liệu (CRUD thật, bảng `documents`) + Logo & Nhận diện (chỉ đọc, xuất
mã SVG chuẩn) là thật. Brand Studio/Media Center/Tài nguyên thương hiệu
là `EmptyState` — chưa có hạ tầng upload/lưu trữ media nào trong dự án.

### 8. Hệ thống (5 route, 2 real)
API & Tích hợp (đọc `checkAllProvidersHealth()`, 10 AI Provider) + Môi
trường (boolean checklist Supabase + `NODE_ENV`) là thật. "Nhật ký hệ
thống" route-classifier gắn `EmptyState` nhưng thực ra CÓ đọc
`listExecutions()` (log AI Provider) — xem ghi chú route-level trong
`ADMIN_ROUTE_INVENTORY.md`. Cấu hình chung/Sao lưu là `EmptyState` thật
(không có feature-flag nào; sao lưu do Supabase quản lý hạ tầng).
**Nguyên tắc bất biến của toàn Workspace này:** không route nào hiển thị
giá trị biến môi trường/secret — chỉ boolean đã cấu hình/chưa hoặc tên
biến thiếu.
