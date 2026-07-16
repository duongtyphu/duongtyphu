# Báo cáo PMO — FOUNDER DIRECTIVE: PORTAL EXACT MIRROR ADMIN

**Trạng thái:** Hoàn thành triển khai, đã verify code + trình duyệt thật, **chưa merge, chưa deploy** — chờ PMO review.
**Nhánh:** `claude/vietnamese-greeting-zkzn2p`

---

## 1. Sidebar Admin mới

Giữ nguyên đúng 13 mục cấp 1 đã khóa (mục 8 của chỉ thị) — xác nhận lại bằng ảnh chụp desktop 1440 / tablet 768 / mobile 390:

Tổng quan · Website & Thương hiệu (Website / Thương hiệu / Thư viện Media) · Portal · Hệ tri thức AI · Học viện AI · AI Workspace · Dự án & Cơ hội · Premium · Companion · Hành trình & Cộng đồng · Người dùng · Duyệt & Xuất bản · Cài đặt.

Không tạo thêm mục cấp 1 nào. Không nội dung nào xuất hiện ở 2 menu (mục "Nội dung học" trong Premium là **liên kết** sang màn hình quản lý chương/bài học có sẵn, không phải màn hình trùng lặp).

## 2. Portal menu — đúng 10 mục, đúng thứ tự

Đối chiếu 3 nguồn độc lập, cả 3 khớp nhau 100% về số lượng, thứ tự và cách viết tên:

| # | Chỉ thị Founder | Portal Production (ảnh chụp Founder gửi) | Nguồn code Portal (`src/lib/portal/hubs.ts` — nguồn điều hướng duy nhất) | Admin (`PORTAL_AREAS_SEED`, sortOrder) |
|---|---|---|---|---|
| 1 | Trang chủ Học viện | ✅ | ✅ `/portal` | ✅ 1 |
| 2 | Companion | ✅ | ✅ `/portal/companion` | ✅ 2 |
| 3 | Hệ tri thức AI (CKOS) | ✅ | ✅ `/portal/ckos` | ✅ 3 |
| 4 | Học viện AI | ✅ | ✅ `/portal/hocvienai` | ✅ 4 |
| 5 | AI Workspace | ✅ | ✅ `/portal/aiworkspace` | ✅ 5 |
| 6 | Dự án & Cơ hội | ✅ | ✅ `/portal/duan-cohoi` | ✅ 6 |
| 7 | Premium | ✅ | ✅ `/portal/premium` | ✅ 7 |
| 8 | Hành trình của tôi | ✅ | ✅ `/portal/hanhtrinhcuatoi` | ✅ 8 |
| 9 | Sứ mệnh Companion | ✅ | ✅ `/portal/su-menh-companion` | ✅ 9 |
| 10 | Cộng đồng | ✅ | ✅ `/portal/congdongai` | ✅ 10 |

**Khả năng mở rộng (mục 2 chỉ thị)** — màn hình "Khu vực Portal" (`/admin/portal/areas`) cho Founder: đổi tên hiển thị, ẩn/hiện, đổi thứ tự (mũi tên ↑↓), gán nơi phụ trách, thêm Trang con → Phần nội dung → Nội dung → xuất bản — toàn bộ bằng dữ liệu, không sửa TypeScript/route/component. Không tự thêm khu vực thứ 11.

## 3. Danh sách menu/route đã XÓA (consumer = 0, không thuộc Portal hiện tại)

| Đã xóa | Lý do |
|---|---|
| `/admin/portal-builder` + 6 route con (start-here, today-actions, banner, featured, cta, user-goals) — 7 file route | "Portal Builder cũ" bị nêu đích danh ở mục 3 chỉ thị. Xác minh bằng grep toàn codebase: 0 trang Portal nào đọc các collection này (start-here-steps/today-action-cards/portal-cta/portal-featured/user-goals/portal-sections/portal-welcome). Không nằm trong Sidebar từ trước. |
| `/admin/portal/pages` (route + component `PortalPageRegistry.tsx`) | View chỉ-đọc trùng lặp — mọi thao tác thật đã nằm trong `/admin/portal/areas`. 0 consumer, 0 liên kết nav. |
| `/admin/portal/content` (route + component `ContentRegistry.tsx`) | View gộp chỉ-đọc trùng lặp — không có dữ liệu riêng, mọi nguồn xem được tại chỗ. 0 consumer, 0 liên kết nav. |
| `premium/ProductForm.tsx` (form "Sản phẩm số" cũ) | Mẫu form cũ cho bảng `products` — 0 checkout Portal. Gỡ khỏi màn hình Founder. |

**Giữ phía sau, không hiển thị** (đúng mục 3: "vẫn cần dữ liệu → giữ phía sau"): file dữ liệu `portalBuilder.ts`/`startHere.ts`/`todayActions.ts`/`userGoals.ts` (component `NotificationTicker` chưa mount và trang reports không nằm trong nav vẫn import); bảng `products` + server action (bảng vẫn được `/portal/my-products` join cho đơn hàng cũ); 4 file dữ liệu `areaRegistry/pageRegistry/sectionRegistry/contentBlockRegistry` (trang Portal + Tổng quan đang đọc).

## 4. Danh sách menu đã ẨN (giữ nguyên từ sprint trước, xác nhận lại)

- 5 mục Affiliate trong Premium (tương lai: Premium → Affiliate).
- 8 tab con Thương hiệu cũ, 6 tab con Website cũ, 6 tab con Media cũ (route còn, tab ẩn).
- Màn hình cài đặt hệ thống cũ (0 consumer).
- Cây `/admin/digital-assets/**` cũ (không trong nav — trang Dự án & Cơ hội mới đã thay thế hoàn toàn; route Portal cũ `/portal/digital-assets` đã được ghi nhận khai tử từ PROJECTS-SPR-602).

## 5. Danh sách menu/nhãn đã ĐỔI TÊN (quét từ cấm — mục 7 chỉ thị)

Đã quét toàn bộ text hiển thị cho Founder và loại bỏ: Workspace (trừ tên riêng khu vực Portal "AI Workspace"), Registry, Collection, Portal Area, Content Block, Runtime, Builder, Digital Assets, Global Settings, CRUD. Các thay đổi chính:

| Trước | Sau |
|---|---|
| Portal Areas / Portal Area | Khu vực Portal |
| Workspace Owner / Workspace Ownership | Nơi phụ trách |
| Website Workspace / Academy Workspace / Journey & Community Workspace (tiêu đề trang) | Website / Học viện AI / Hành trình & Cộng đồng |
| Media Center (tiêu đề) | Thư viện Media |
| Learning Journeys / CKOS Collection | Hành trình học tập / Bộ sưu tập CKOS |
| Collections (Media) + toast/nút "Collection" | Bộ sưu tập |
| Global Search / Audit Center / System Health / Activity Timeline / Technical Debt / Future Flexibility Review (Tổng quan) | Tìm kiếm toàn Admin / Trung tâm rà soát / Sức khỏe hệ thống / Dòng thời gian hoạt động / Nợ kỹ thuật / Khả năng mở rộng tương lai |
| "chưa có CRUD" / "CRUD thật" (ghi chú bảng) | "chưa sửa được trong Admin" / "quản lý thật trong Admin" |
| "…Registry" trong mô tả trang (Page/SEO/Redirect/Navigation/Shared Section/Brand Asset/Media Asset Registry) | mô tả tiếng Việt tự nhiên (danh sách Trang, thư viện nhận diện, thư viện Media…) |
| Workspace Owner Panel | Nơi phụ trách nội dung |

Key kỹ thuật nội bộ (tên biến/type/component/collection key) giữ nguyên — chỉ đổi nhãn hiển thị, đúng nguyên tắc "giữ key nội bộ, tạo label tiếng Việt riêng".

## 6. Danh sách form đã TINH GỌN

- **Dự án & Cơ hội (mục 4 chỉ thị)** — audit trực tiếp xác nhận Admin hiện tại (PROJECTS-SPR-602) đã bám 1:1 dữ liệu thật Portal: 5 hệ sinh thái thật (DigiU/SolarGroup/Blockchain & Crypto/Affiliate/Sàn giao dịch — khớp ảnh production Founder gửi), form đúng cấu trúc Hệ sinh thái → Dự án con → Liên kết → Tiêu chí đánh giá → FAQ → Bài viết liên quan → SEO → Thứ tự → Ẩn/hiện → Xuất bản. Không còn dùng form Digital Assets cũ (cây route cũ đã tách khỏi trải nghiệm Founder). Không có field "Phân tích" riêng vì Portal dùng "Tiêu chí đánh giá" (đúng dữ liệu thật, không bịa thêm). Ghi chú tồn đọng: dự án con có field `potentialAnalysis` trong kiểu dữ liệu nhưng form chưa có ô sửa riêng (chỉ sửa được ở cấp hệ sinh thái) — gap nhỏ, ghi nhận để làm sau.
- **Premium (mục 5 chỉ thị)** — trang `/admin/premium` viết lại: bảng 6 chương trình thật (khớp ảnh production: AI Cơ bản 1.500.000đ / AI Nâng cao 3.999.999đ / OpenClaw 599.999đ / V-Solo / V-Scale "Sắp mở đăng ký" / Tư vấn 1:1 khối liên hệ) là giao diện chính; mỗi chương trình có link thẳng đến "Giá & mở bán" và "Nội dung học". Tab "Nội dung học" mới trỏ về màn hình quản lý Chương/Bài học/Video/PDF/tài liệu/file tải xuống/bài tập/bonus **có thật** (`/admin/academy/courses`, bảng `course_modules`/`course_lessons` — Founder nhập URL video/tài liệu bằng Admin, không hardcode trong component). Checkout/đơn hàng/quyền truy cập theo từng khóa đã có thật (orders.course_ref_id FK → tự mở trang học `/portal/premium/hoc/[courseId]` sau xác nhận). Form "Sản phẩm số" cũ gỡ khỏi màn hình.
- **Companion (mục 6 chỉ thị)** — giữ cấu trúc 8 tab gọn (Nhân cách/Hội thoại/Trí nhớ/Tri thức/Huấn luyện/Công cụ/Cấu hình/Phiên bản; "An toàn" hiển thị trung thực trong tab Cấu hình là chưa có cấu hình riêng). Không hiển thị danh mục kỹ thuật thành menu; không dựng giả chức năng chưa có (Chat/Agent/Voice/Planner/MCP/Tool Calling ghi nhận là hướng mở rộng, không có form giả).

## 7. Bảng đối chiếu Portal → Admin (sau khi sửa)

| Portal (menu thật) | Nơi quản lý trong Admin | Dữ liệu |
|---|---|---|
| Trang chủ Học viện | Portal → Khu vực Portal (cấu trúc) | Cấu trúc bằng dữ liệu; nội dung khối trang chủ Portal phần lớn là dữ liệu người dùng thật |
| Companion | Companion (8 tab) | Nhân cách/quy tắc hiện hardcode — hiển thị trung thực, chưa dựng form giả |
| Hệ tri thức AI (CKOS) | Hệ tri thức AI (9 module + bài học) | Supabase thật |
| Học viện AI | Học viện AI (Lộ trình/Nhiệm vụ/Dự án/Hành trình học tập/Nội dung khóa) | Supabase thật |
| AI Workspace | AI Workspace (5/9 section sửa được thật) | 2/9 section còn hardcode (AI Toolbox, Blog AI) — ghi nhận |
| Dự án & Cơ hội | Dự án & Cơ hội (Hệ sinh thái/Bài viết/Danh mục) | Supabase thật, 1:1 Portal |
| Premium | Premium (6 chương trình/Nội dung học/Giá/Đơn hàng/Mã giảm giá) | Supabase thật |
| Hành trình của tôi | Hành trình & Cộng đồng | Phần lớn là dữ liệu người dùng thật — không tạo form giả |
| Sứ mệnh Companion | Hành trình & Cộng đồng (trình bày) | Hardcode — ghi nhận trung thực |
| Cộng đồng | Hành trình & Cộng đồng | 2/10 section dữ liệu thật, 8/10 hardcode — ghi nhận |

## 8. Ảnh chụp Admin

Chụp bằng trình duyệt thật (Chromium/Playwright), đăng nhập admin thật, đúng 3 viewport chỉ thị:
- Desktop 1440px: Tổng quan, Portal, Khu vực Portal (đủ 10 mục đúng thứ tự), Premium, Dự án & Cơ hội, Companion, Hành trình & Cộng đồng, Học viện AI, AI Workspace, Website, Thương hiệu, Thư viện Media, Cài đặt, Duyệt & Xuất bản.
- Tablet 768px + Mobile 390px: Tổng quan + drawer menu mobile (đủ 13 mục, không tràn, không lỗi hiển thị).

Ghi chú console: các trang render sạch; thông báo 503 duy nhất đến từ API nội bộ `/api/admin/collections/*` do môi trường kiểm thử cục bộ **không có** `SUPABASE_SERVICE_ROLE_KEY` (cố ý không đưa secret vào sandbox) — đây là fallback có chủ đích của `useCollection` (tự chuyển về dữ liệu cục bộ), không phải lỗi code; Production trên Vercel có đủ secret nên không xảy ra.

## 9. Kết quả lint/typecheck/build/tests

| Kiểm tra | Kết quả |
|---|---|
| `npm run build` (production, typecheck kèm theo) | ✅ EXIT 0 |
| `npm run lint` | ✅ 0 lỗi (5 warning `<img>` có từ trước, ngoài phạm vi) |
| `npm test` | ✅ 139/139 pass (24 file test) |

## Tồn đọng đã cân nhắc, chủ động không làm trong sprint này

1. **Giá trị dữ liệu "Nơi phụ trách" còn tên tiếng Anh** (Companion Studio/CKOS/Academy/Projects & Opportunities/Journey & Community…): đây là **giá trị dữ liệu** trong `WORKSPACE_OWNERS.name`, được đối chiếu chéo bởi seed 4 lớp cấu trúc Portal và các ô chọn. Đổi đòi hỏi migrate đồng bộ mọi seed + dữ liệu localStorage cũ của trình duyệt Founder (nguy cơ lệch hiển thị dữ liệu đã lưu). Đề xuất: sprint riêng "Việt hóa tên khu vực quản trị" với migration đầy đủ.
2. **Mô tả giới thiệu 5 chương trình Premium** (chủ đề/đối tượng/kết quả trong `premium-programs.ts`) và **khối Tư vấn 1:1** còn hardcode — muốn Founder tự sửa cần thêm bảng dữ liệu mới (đụng schema, mục 10 chỉ thị chỉ cho phép khi bắt buộc) — chờ Founder quyết.
3. **AI Toolbox + Blog AI (2/9 section AI Workspace)** còn hardcode do ràng buộc `generateStaticParams` — đã ghi chú trung thực trong Admin.
4. Không xóa dữ liệu thật nào trong sprint này; không đổi database schema; không đổi URL nào ngoài các route đã xóa ở mục 3.
