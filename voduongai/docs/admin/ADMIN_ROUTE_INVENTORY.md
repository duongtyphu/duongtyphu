# Admin CMS v2.0 — Route Inventory (đầy đủ 76 route)

Sinh bằng script đối chiếu trực tiếp nội dung từng `page.tsx` dưới
`src/app/admin/**` (Sprint 8, ADM-V2-08) — không suy đoán, không copy từ
báo cáo sprint cũ. 76 route thật, khớp 100% với `nav.ts` (80 href, một số
route dynamic phục vụ nhiều href) + 3 route không phải nav item
(`/admin`, `/admin/login`, `/admin/users/[id]`).

Cột "2-layer requireAdmin()" đánh dấu route có gọi `requireAdmin()` trực
tiếp trong `page.tsx` hay không — route DataTable/VisualEditor không gọi
trực tiếp vì `DataTable.tsx` (Server Component dùng chung) đã tự gọi, và
mọi route đều được `middleware.ts` chặn trước tiên bất kể lớp này (xem
`ADMIN_RC_REPORT.md` mục Security Review).

| Route | Label (nav.ts) | Kiểu | 2-layer requireAdmin() |
|---|---|---|---|
| `/admin` | — (redirect `/admin/dashboard`) | Bespoke | (qua middleware) |
| `/admin/aiworkspace/ai-workflow-sections` | Quy trình AI (Workflow) | VisualEditor | (qua middleware) |
| `/admin/aiworkspace/recommended-workspace` | Workspace đề xuất | VisualEditor | (qua middleware) |
| `/admin/ckos` | CKOS Dashboard | Bespoke | (qua middleware) |
| `/admin/ckos/best-practices` | Thực hành tốt (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/case-studies` | Câu chuyện thành công (Folder) | Bespoke | (qua middleware) |
| `/admin/ckos/checklists` | Checklist (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/ebooks` | Ebook (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/knowledge-collections` | Thư viện AI (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/lessons` | Lesson (Folder) | Bespoke (LessonAdminShell) | (qua middleware) |
| `/admin/ckos/prompts` | Prompt (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/resources` | Resource (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/sop` | SOP / Workflow (Folder) | DataTable | (qua DataTable) |
| `/admin/ckos/templates` | Template (Folder) | DataTable | (qua DataTable) |
| `/admin/community` | Kênh cộng đồng | DataTable | (qua DataTable) |
| `/admin/companion` | Companion (CMS quản trị AI Mentor) | Bespoke | ✓ |
| `/admin/course-pricing` | Giá khoá học Premium | Bespoke (Server Actions riêng) | (qua Server Actions) |
| `/admin/dashboard` | Tổng quan | Bespoke | ✓ |
| `/admin/duan-cohoi` | Hệ sinh thái (Live-edit) | Live-edit | ✓ |
| `/admin/duan-cohoi/[ecosystemSlug]` | 5 route chi tiết hệ sinh thái | Live-edit | ✓ |
| `/admin/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` | 5 route dự án con | Live-edit | ✓ |
| `/admin/hanh-trinh-cua-toi/garden` | Khu vườn của bạn (Live-edit) | Live-edit | ✓ |
| `/admin/hanh-trinh-cua-toi/journal` | Nhật ký học tập (Live-edit) | Live-edit | ✓ |
| `/admin/hanh-trinh-cua-toi/map` | Bản đồ hành trình (Live-edit) | Live-edit | ✓ |
| `/admin/hanh-trinh-cua-toi/mirror` | Mirror (Live-edit) | Live-edit | ✓ |
| `/admin/hanh-trinh-cua-toi/story` | My Story (Live-edit) | Live-edit | ✓ |
| `/admin/he-thong/api-tich-hop` | API & Tích hợp | Bespoke (đọc thật) | ✓ |
| `/admin/he-thong/cau-hinh-chung` | Cấu hình chung | EmptyState | ✓ |
| `/admin/he-thong/moi-truong` | Môi trường | Bespoke (đọc thật, boolean-only) | ✓ |
| `/admin/he-thong/nhat-ky-he-thong` | Nhật ký hệ thống | Bespoke (đọc `listExecutions()`, phân loại tự động gắn "EmptyState" nhưng thực tế đọc dữ liệu thật process-local) | ✓ |
| `/admin/he-thong/sao-luu` | Sao lưu | EmptyState | ✓ |
| `/admin/hocvienai/faq` | Câu hỏi thường gặp | VisualEditor | (qua middleware) |
| `/admin/hocvienai/work-needs` | Theo nhu cầu công việc | VisualEditor | (qua middleware) |
| `/admin/home-cards` | Thẻ trang chủ (Live-edit) | Live-edit | ✓ |
| `/admin/landing` | Landing Page | Live-edit | ✓ |
| `/admin/login` | — | Bespoke (form đăng nhập công khai) | (qua middleware) |
| `/admin/marketing/chien-dich` | Chiến dịch | EmptyState | ✓ |
| `/admin/marketing/chuyen-doi` | Chuyển đổi | Bespoke (đọc thật, join leads×orders) | ✓ |
| `/admin/marketing/cta` | CTA | EmptyState | ✓ |
| `/admin/marketing/email-marketing` | Email Marketing | EmptyState | ✓ |
| `/admin/marketing/phan-tich-marketing` | Phân tích Marketing | EmptyState | ✓ |
| `/admin/nguoi-dung/ho-so` | Hồ sơ của tôi | Bespoke (chỉ đọc) | ✓ |
| `/admin/nguoi-dung/hoat-dong-nguoi-dung` | Hoạt động người dùng | EmptyState-shaped nhưng đọc thật (gộp sự kiện đăng ký/đăng nhập) | ✓ |
| `/admin/nguoi-dung/phien-dang-nhap` | Phiên đăng nhập | Bespoke (đọc thật `listIdentityUsers()`) | ✓ |
| `/admin/nguoi-dung/premium-membership` | Premium Membership | Bespoke (đọc thật, theo giao dịch confirmed) | ✓ |
| `/admin/nguoi-dung/thanh-vien` | Thành viên | EmptyState (0 đơn `confirmed` tại thời điểm audit) | ✓ |
| `/admin/nguoi-dung/thiet-bi` | Thiết bị | EmptyState (Supabase Auth không expose) | ✓ |
| `/admin/nguoi-dung/vai-tro-phan-quyen` | Vai trò & Phân quyền | Bespoke (đọc thật, mô hình nhị phân `is_admin`) | ✓ |
| `/admin/premium/courses/[courseId]/builder` | Quản lý nội dung (nút từ course-pricing) | Bespoke (Course Builder, Server Actions riêng) | ✓ |
| `/admin/premium/dashboard` | Dashboard (Live-edit) | Live-edit | ✓ |
| `/admin/student-success-stories` | Câu chuyện học viên (chưa hiển thị Portal) | DataTable | (qua DataTable) |
| `/admin/su-menh-companion/flipbook` | Ảnh Companion (thứ tự & tiêu đề) | VisualEditor | (qua middleware) |
| `/admin/su-menh-companion/live-edit` | 6 khối nội dung (Live-edit) | Live-edit | ✓ |
| `/admin/thuong-hieu-media/brand-studio` | Brand Studio | EmptyState | ✓ |
| `/admin/thuong-hieu-media/logo-nhan-dien` | Logo & Nhận diện | Bespoke (chỉ đọc, xuất mã SVG) | ✓ |
| `/admin/thuong-hieu-media/media-center` | Media Center | EmptyState | ✓ |
| `/admin/thuong-hieu-media/tai-lieu` | Tài liệu | Bespoke (CRUD thật, Server Actions) | ✓ |
| `/admin/thuong-hieu-media/tai-nguyen-thuong-hieu` | Tài nguyên thương hiệu | EmptyState | ✓ |
| `/admin/tong-quan/cong-viec` | Công việc | Bespoke (đọc thật, gộp 3 bảng) | ✓ |
| `/admin/tong-quan/hoat-dong-gan-day` | Hoạt động gần đây | Bespoke (đọc thật) | ✓ |
| `/admin/tong-quan/thong-bao` | Thông báo | EmptyState | ✓ |
| `/admin/tools` | Công cụ AI | DataTable | (qua DataTable) |
| `/admin/updates` | Tin tức cộng đồng | DataTable | (qua DataTable) |
| `/admin/users` | Danh sách người dùng | Bespoke (chỉ đọc, Identity Hub) | ✓ |
| `/admin/users/[id]` | (drill-down từ Danh sách người dùng) | Bespoke | ✓ |
| `/admin/van-hanh/don-hang` | Đơn hàng | Bespoke (chỉ đọc, `orders`) | ✓ |
| `/admin/van-hanh/ho-tro-khach-hang` | Hỗ trợ khách hàng | Bespoke (chỉ đọc, `support_tickets`) | ✓ |
| `/admin/van-hanh/khach-hang-tiem-nang` | Khách hàng tiềm năng | Bespoke (chỉ đọc, `leads`) | ✓ |
| `/admin/van-hanh/ma-giam-gia` | Mã giảm giá | Bespoke (CRUD thật, `coupons`) | ✓ |
| `/admin/van-hanh/thanh-toan` | Thanh toán | EmptyState (trạng thái nằm ở Đơn hàng) | ✓ |
| `/admin/van-hanh/tiep-thi-lien-ket` | Tiếp thị liên kết | EmptyState (`referrals` 0 dòng) | ✓ |
| `/admin/website/dieu-huong` | Điều hướng | EmptyState (migration proposal chờ duyệt) | ✓ |
| `/admin/website/header-footer` | Header & Footer | Bespoke (`SingletonEditor`, bảng `settings`) | ✓ |
| `/admin/website/noi-dung-website` | Nội dung Website | EmptyState | ✓ |
| `/admin/website/popup-banner` | Popup & Banner | EmptyState | ✓ |
| `/admin/website/seo-website` | SEO Website | Bespoke (chỉ đọc, import thẳng sitemap/robots) | ✓ |

Tổng theo kiểu (script-generated, xem `ADMIN_WORKSPACE_INVENTORY.md` để
biết breakdown theo Workspace): **EmptyState 24 · Bespoke 23 · DataTable
12 · Live-edit 12 · VisualEditor 5** = 76.

**Lưu ý về độ chính xác của bộ phân loại tự động:** script chỉ tìm chuỗi
`<AdminEmptyState`/`<DataTable`/`<VisualEditor`/import trang Portal thật
trong `page.tsx` — 3 route (`nhat-ky-he-thong`, `hoat-dong-nguoi-dung`,
`chuyen-doi`) bị gắn nhãn tự động không khớp hoàn toàn bản chất thật (đọc
dữ liệu thật nhưng không dùng 1 trong 3 pattern trên) — đã ghi chú tay
đúng bản chất trong cột "Kiểu" ở trên, dựa trên đọc code trực tiếp.
