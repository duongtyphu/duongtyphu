# Admin CMS — Bảng đổi tên Menu

**Trạng thái: ĐỀ XUẤT, chờ PMO review. Không tự merge, không tự sửa code.**

Tài liệu kỹ thuật đi kèm `ADMIN_CMS_INFORMATION_ARCHITECTURE_v2.md` — liệt kê toàn bộ nhãn hiển thị đổi từ tiếng Anh/thuật ngữ kỹ thuật sang tiếng Việt, ngôn ngữ Founder. Không đổi route/dữ liệu, chỉ đổi chữ hiển thị trên Sidebar.

Áp dụng đúng Yêu cầu 1 của PMO — không dùng: Dashboard, Workspace, Registry, Collection, Runtime, Theme, Brand Assets, Portal Builder.

---

## 1. Đổi tên mục Sidebar cấp 1

| Tên cũ | Tên mới | Lý do |
|---|---|---|
| Dashboard + Founder Workspace | **Tổng quan** | Gộp 2 "trang chủ" thành 1; "Dashboard" là thuật ngữ kỹ thuật |
| Brand Studio | **Thương hiệu** | Tiếng Việt, bỏ "Studio" |
| Media Center | **Media** | Bỏ "Center" thừa |
| Portal Management + Portal Navigation | **Portal** | Gộp, giữ nguyên từ "Portal" (đã là tên sản phẩm quen thuộc với Founder) |
| CKOS | **Hệ tri thức AI** | "CKOS" là tên viết tắt kỹ thuật (Company Knowledge Operating System), Founder không cần biết viết tắt |
| Academy | **Học viện AI** | Tiếng Việt, khớp tên hiển thị Portal thật |
| Projects &amp; Opportunities | **Dự án &amp; Cơ hội** | Tiếng Việt, khớp tên hiển thị Portal thật |
| Companion Studio | **Companion** | Bỏ "Studio" thừa |
| Journey &amp; Community | **Hành trình** / **Cộng đồng** | Tách 2 tên, mỗi tên là 1 mục Sidebar riêng |
| Users &amp; Access | **Người dùng** | Tiếng Việt |
| Review Queue | **Xuất bản** | "Review Queue" là thuật ngữ kỹ thuật; "Xuất bản" khớp đúng bước cuối trong luồng Portal → Trang → Section → Nội dung → Xuất bản |
| System Settings | **Cài đặt** | Tiếng Việt, bỏ "System" |
| Analytics | **Báo cáo** *(đề xuất, chờ PMO xác nhận)* | Tiếng Việt |

**Giữ nguyên không đổi** (đã là tên sản phẩm/thương hiệu quen thuộc, không phải thuật ngữ kỹ thuật): Website, AI Workspace, Premium, Đơn hàng.

---

## 2. Đổi tên tab nội bộ (bên trong mỗi mục Sidebar)

### Website

| Tên cũ (mục Sidebar riêng) | Tên tab mới |
|---|---|
| Pages, Homepage, Landing Pages, Static Pages | **Trang** |
| Navigation | **Điều hướng** |
| Shared Sections | **Nội dung dùng chung** |
| SEO, Redirect | **SEO &amp; Chuyển hướng** |
| Portal Mapping | **Liên kết Portal** |
| Global Settings | **Cài đặt** |

### Thương hiệu

| Tên cũ | Tên tab mới |
|---|---|
| Logo, Wordmark | **Logo thương hiệu** *("Wordmark" là thuật ngữ kỹ thuật, không hiển thị)* |
| Typography, Color Palette | **Màu &amp; Kiểu chữ** |
| Theme, Icons | **Giao diện &amp; Biểu tượng** |
| Open Graph | **Hình ảnh chia sẻ** *(mô tả đúng chức năng — ảnh hiện khi chia sẻ link lên mạng xã hội)* |
| Brand Assets Registry | **Thư viện tài sản** |
| Global Brand Settings | **Cài đặt** |

### Media

| Tên cũ | Tên tab mới |
|---|---|
| Media Library, Images, Videos, Documents, Audio | **Thư viện** |
| Folder Management, Collections | **Thư mục &amp; Bộ sưu tập** |
| Tags | **Nhãn** |
| Media Settings | **Cài đặt** |

### Hệ tri thức AI

| Tên cũ | Tên tab mới |
|---|---|
| Goals, Workflows, Evaluations | **Mục tiêu &amp; Quy trình** |
| Công cụ AI (Tools), Prompt AI (Prompts) | **Công cụ &amp; Prompt** *(bỏ hậu tố tiếng Anh trong ngoặc)* |
| Tài nguyên (Resources), Case Study, Template, Checklist | **Tài nguyên &amp; Case Study** |
| Best Practices, FAQs | **Thực hành tốt &amp; Hỏi đáp** |
| Knowledge Seed | **Dữ liệu khởi tạo** |

### Premium

| Tên cũ | Tên tab mới |
|---|---|
| Sản phẩm số, Học phí V-SOLO/V-SCALE | **Khoá học &amp; Học phí** |
| Mã giảm giá, Dịch vụ, Hỗ trợ | **Mã giảm giá &amp; Dịch vụ** |
| Leads | **Leads** *(giữ nguyên — đã là từ quen thuộc trong nghiệp vụ)* |
| Affiliate Hub, Top sản phẩm Affiliate, Sản phẩm Affiliate, Link Affiliate, Báo cáo Affiliate | **Affiliate** *(giữ nguyên — đã là từ quen thuộc trong nghiệp vụ)* |

### Portal

| Tên cũ | Tên tab mới |
|---|---|
| Portal Areas, Page Registry, Content Registry | **Bản đồ Portal** |
| 10 mục "Portal Navigation" (Trang chủ Học viện, Companion, CKOS...) | **Đi tới khu vực** *(liên kết nhanh)* |

---

## 3. Hậu tố tiếng Anh trong ngoặc — bỏ toàn bộ

Các nhãn hiện tại có dạng "Tên tiếng Việt (Tên tiếng Anh)" — bỏ phần tiếng Anh, chỉ giữ tiếng Việt vì nhãn tiếng Việt đã đủ rõ nghĩa:

| Nhãn cũ | Nhãn mới |
|---|---|
| Công cụ AI (Tools) | Công cụ AI |
| Prompt AI (Prompts) | Prompt AI |
| Tài nguyên (Resources) | Tài nguyên |
| Hệ tri thức AI (CKOS) | Hệ tri thức AI |
| Learning Journeys (đọc) | Lộ trình học tập |

---

## 4. Không đổi (đã đúng tiếng Việt hoặc là tên sản phẩm)

Toàn bộ nhãn "Portal Navigation" (Trang chủ Học viện, Companion, Hệ tri thức AI, Học viện AI, AI Workspace, Dự án &amp; Cơ hội, Premium, Hành trình của tôi, Sứ mệnh Companion, Cộng đồng), toàn bộ nhãn nhóm Academy (Lộ trình thành công, Nhiệm vụ hôm nay, Nội dung khoá học, Dự án thực chiến), toàn bộ nhãn nhóm Dự án &amp; Cơ hội (Tổng quan, Hệ sinh thái, Bài viết, Danh mục) — giữ nguyên, đã đúng tiếng Việt và khớp Portal thật.
