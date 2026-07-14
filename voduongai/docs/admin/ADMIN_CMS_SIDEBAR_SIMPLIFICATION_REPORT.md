# Báo cáo PMO — Triển khai Tinh gọn Sidebar Admin CMS

**Sprint:** ADMIN CMS v1.1 UI REFINEMENT — Implementation (theo PMO APPROVAL)
**Trạng thái:** Hoàn thành triển khai code, đã verify, **chưa merge, chưa deploy** — chờ PMO review.
**Nhánh:** `claude/vietnamese-greeting-zkzn2p`

---

## 1. Sidebar mới đã triển khai

Sidebar cấp 1 hiện chỉ còn **đúng 13 mục** (khớp 100% Task 2 của PMO APPROVAL), toàn bộ tiếng Việt,
đi theo Portal thật thay vì tên Workspace/Registry kỹ thuật:

1. Tổng quan
2. Website & Thương hiệu (nhóm — mở rộng gồm 3 mục con: Website, Thương hiệu, Thư viện Media)
3. Portal
4. Hệ tri thức AI
5. Học viện AI
6. AI Workspace
7. Dự án & Cơ hội
8. Premium
9. Companion
10. Hành trình & Cộng đồng
11. Người dùng
12. Duyệt & Xuất bản
13. Cài đặt

Đã xác nhận bằng ảnh chụp desktop/tablet/mobile (mục 7) — không tràn, không nhãn tiếng Anh không cần
thiết trên Sidebar, không có 2 menu trùng nội dung, mọi mục thuộc đúng 1 nhóm.

## 2. Bảng route/menu đã thay đổi

| Khu vực | Trước | Sau |
|---|---|---|
| Website | 10 tab (Dashboard/Pages/Homepage/Landing Pages/Static Pages/Navigation/Shared Sections/SEO/Redirect/Global Settings/Portal Mapping) | 7 tab: Tổng quan/Trang/Điều hướng/Nội dung dùng chung/SEO & Chuyển hướng/Liên kết Portal/Cài đặt |
| Thương hiệu | 10 tab (Dashboard/Logo/Wordmark/Typography/Color Palette/Theme/Icons/Open Graph/Assets Registry/Global Settings) | 4 tab: Tổng quan/Thư viện nhận diện/Màu & Kiểu chữ/Cài đặt |
| Thư viện Media | 10 tab (Dashboard/Library/Images/Videos/Documents/Audio/Folders/Collections/Tags/Settings) | 4 tab: Tổng quan/Thư viện/Thư mục & Bộ sưu tập/Cài đặt |
| Portal | 4 mục (Dashboard/Portal Areas/Page Registry/Content Registry) | 1 mục: Portal (Portal Areas/Page Registry/Content Registry ẩn khỏi Sidebar, route vẫn còn) |
| Founder | 4 mục (Overview/Publish Center/Review Queue/…) | Tổng quan (1 mục) + Duyệt & Xuất bản tách thành mục cấp 1 riêng |
| Premium | 12 mục (gồm 5 mục Affiliate) | 7 mục: Khoá học/Giá & mở bán/Đơn hàng/Mã giảm giá/Dịch vụ/Hỗ trợ/Leads — 5 mục Affiliate ẩn |
| Companion | 1 Dashboard tĩnh | 1 route, chuyển thành tab switcher nội bộ 8 tab: Nhân cách/Hội thoại/Trí nhớ/Tri thức/Huấn luyện/Công cụ/Cấu hình/Phiên bản |
| Cài đặt | CRUD cũ (siteName/slogan/logo/favicon/màu/SEO/footer/social — 0 consumer) | 3 mục: Tài khoản & quyền/Bảo mật/Tích hợp |

Toàn bộ URL cũ **không bị xoá** — mục ẩn khỏi Sidebar vẫn hoạt động khi truy cập trực tiếp (đúng Task 10).

## 3. Danh sách mục đã gộp

- **Website & Thương hiệu**: gộp 3 Workspace cũ (Website/Brand Studio/Media Center) vào 1 nhóm Sidebar cấp 1.
- **Thương hiệu**: gộp Typography + Color Palette + Theme vào 1 tab "Màu & Kiểu chữ".
- **Thư viện Media**: gộp Folder + Collection + Tag vào 1 tab "Thư mục & Bộ sưu tập"; gộp Images/Videos/
  Documents/Audio vào 1 tab "Thư viện" (đã lọc/tìm kiếm theo loại ngay trong bảng).
- **Website**: gộp Homepage/Landing Pages/Static Pages vào tab "Trang" (dùng chung Page Registry, có thêm
  block "Cấu trúc trang chủ" cho Homepage Section); gộp Redirect vào tab "SEO & Chuyển hướng".
- **Companion**: gộp 8 khu vực rời rạc (Page Mapping/Persona/Agent Registry/Memory/Future Flexibility…)
  thành 1 route với tab switcher client-side.
- **Founder "Tổng quan"**: gộp Workspace Health + Publish Center vào 1 trang Tổng quan.

## 4. Danh sách mục đã ẩn khỏi Sidebar

- Portal Areas, Page Registry, Content Registry (route Portal Management) — 0 consumer Portal, xác nhận
  bởi audit Explore agent.
- Link Affiliate, Báo cáo Affiliate, Affiliate Hub, cùng 2 mục Affiliate khác trong Premium (5 mục) — theo
  Task 7, tương lai thuộc "Premium → Affiliate", không xây mới trong sprint này.
- System Settings CRUD cũ (siteName/slogan/logo/favicon/màu/SEO/footer/social/notify-email) — 0 consumer,
  cấu hình thật đã có sẵn đúng owner (Thương hiệu/Website).
- 8 tab con Thương hiệu cũ (Logo/Wordmark/Typography/Color Palette/Theme/Icons/Open Graph/Assets Registry/
  Global Settings) — route vẫn còn, chỉ ẩn khỏi tab nav và khỏi "Truy cập nhanh" trên Dashboard.
- Tương tự với 6 tab con Website cũ và 6 tab con Media cũ.

## 5. Danh sách route/component đã xoá

**Không route hoặc component nào bị xoá.** Theo đúng Task 10 ("ưu tiên gộp/ẩn/đổi tên/tổ chức lại,
không tạo route mới chỉ để chia menu"), toàn bộ thay đổi là ẩn khỏi Sidebar/tab nav + đổi nhãn, route cũ
vẫn hoạt động khi truy cập trực tiếp bằng URL. Component dùng chung (Registry components) được tái sử
dụng nguyên vẹn, chỉ đổi heading/mô tả hiển thị sang tiếng Việt.

## 6. Danh sách dữ liệu test đã xoá

Đã xoá theo đúng phạm vi Founder Decision (chỉ 4 nguồn được nêu tên rõ):

| Bảng | Trước | Sau | Ghi chú |
|---|---|---|---|
| `orders` | 55 dòng | 0 dòng | Toàn bộ status="pending", gắn với email thật của Founder (`duongvv.vn@gmail.com`) — xác nhận là dữ liệu tự test checkout, không phải đơn hàng thật đã hoàn tất. |
| `affiliate_links` | 1 dòng | 0 dòng | — |
| `media_assets` | 0 dòng | 0 dòng | Đã trống sẵn từ trước, không có gì để xoá. |

**Không đụng đến**: `affiliate_products`, `affiliate_hub_sections`, `affiliate_hub_top_products` — các bảng
này không được Founder nêu tên rõ trong phạm vi cho phép, giữ nguyên để tránh xoá nhầm năng lực cần cho
vận hành thật.

## 7. Ảnh chụp Sidebar desktop + mobile

Đã chụp và kiểm tra trực tiếp qua Playwright (đăng nhập bằng tài khoản test, cookie session), 0 lỗi
console/page trên mọi route kiểm tra:

- Desktop (1440×900): Tổng quan, Website, Thương hiệu, Thư viện Media, Companion, Cài đặt, Premium.
- Tablet (834×1112) và Mobile (390×844): Tổng quan + drawer menu mobile — xác nhận đủ 13 mục, không tràn,
  không lỗi hiển thị.

Sidebar mobile (drawer) hiển thị đúng 13 mục, nhóm "Website & Thương hiệu" thu gọn mặc định khi không phải
route đang active (hành vi có sẵn từ trước, không phải lỗi mới).

## 8. Kết quả lint/typecheck/build/tests

| Kiểm tra | Kết quả |
|---|---|
| `npm run build` (production, sau `rm -rf .next`) | ✅ EXIT 0 — toàn bộ route build thành công |
| `npm run lint` | ✅ 0 lỗi — chỉ còn 5 warning `<img>` có từ trước (không liên quan sprint này) |
| `npm test` | ✅ 139/139 test pass (24 test file) |

---

## Ghi chú còn tồn đọng (đã cân nhắc, chủ động không sửa trong sprint này)

- **Bảng "Tình trạng các khu vực" trên `/admin/founder`** vẫn hiển thị tên Workspace tiếng Anh (Portal
  Management/Website/Brand Studio/CKOS/Academy/Premium/Projects & Opportunities/Companion Studio/Media
  Center/AI Workspace/Journey & Community). Đây là dữ liệu lấy trực tiếp từ `WORKSPACE_OWNERS.name` trong
  `src/lib/admin/workspaceOwnership.ts` — trường này được đối chiếu chéo bởi `PORTAL_AREAS_SEED.ownerWorkspace`
  và dropdown trong `PortalPageTable.tsx`. Đổi tên đòi hỏi cập nhật đồng bộ nhiều nguồn dữ liệu — nằm ngoài
  phạm vi "chỉ Sidebar/Navigation/Group/Menu/Label/UX/IA" của PMO DIRECTIVE gốc và có rủi ro làm lệch liên
  kết dữ liệu. Đề xuất: xử lý ở sprint riêng nếu Founder muốn tiếng Việt hoá luôn bảng này.
- Tên biến/type/code nội bộ (ví dụ `BrandWorkspaceShell`, `WEBSITE_PAGES_COLLECTION_KEY`, comment sprint
  code cũ) không đổi — đúng Task 1: "Tên biến/type/code nội bộ không bắt buộc đổi nếu rủi ro".
