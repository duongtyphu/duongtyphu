# Admin CMS — Bảng ánh xạ Route cũ → Sidebar mới

**Trạng thái: ĐỀ XUẤT, chờ PMO review. Không tự merge, không tự sửa code.**

Tài liệu kỹ thuật đi kèm `ADMIN_CMS_INFORMATION_ARCHITECTURE_v2.md` — dùng để lập trình `nav.ts` mới khi PMO duyệt. **Không route nào bị đổi URL** — bảng này chỉ ánh xạ route hiện có sang vị trí hiển thị mới trên Sidebar (mục cấp 1 nào, tab nội bộ nào, hay ẨN khỏi Sidebar).

Cột "Trạng thái" — GIỮ = hiện dòng riêng ở Sidebar cấp 1; TAB = hiện thị bên trong 1 mục cấp 1, dưới dạng tab/section; ẨN = không còn trên Sidebar, route vẫn hoạt động khi truy cập trực tiếp.

---

## 1. Tổng quan

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/dashboard` | Dashboard | GIỮ → gộp nội dung vào "Tổng quan" (route chính đề xuất: `/admin/founder`) |
| `/admin/founder` | Founder Workspace | GIỮ → là "Tổng quan" |
| `/admin/founder/owners` | Workspace Owner Panel | ẨN |
| `/admin/founder/search` | Global Search | ẨN |
| `/admin/founder/review-queue` | Review Queue | GIỮ → tách thành mục cấp 1 "Xuất bản" |

## 2. Portal

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/portal` | Portal Dashboard | GIỮ → là trang chính của mục "Portal" |
| `/admin/portal/areas` | Portal Areas | TAB trong "Portal" |
| `/admin/portal/pages` | Page Registry | TAB trong "Portal" |
| `/admin/portal/content` | Content Registry | TAB trong "Portal" |
| `/admin/portal/areas?area=home` | Trang chủ Học viện | TAB trong "Portal" (bản đồ liên kết nhanh) |
| `/admin/portal/areas?area=companion` | Companion | nt |
| `/admin/portal/areas?area=ckos` | Hệ tri thức AI (CKOS) | nt |
| `/admin/portal/areas?area=hocvienai` | Học viện AI | nt |
| `/admin/portal/areas?area=aiworkspace` | AI Workspace | nt |
| `/admin/portal/areas?area=duan-cohoi` | Dự án &amp; Cơ hội | nt |
| `/admin/portal/areas?area=premium` | Premium | nt |
| `/admin/portal/areas?area=hanhtrinh` | Hành trình của tôi | nt |
| `/admin/portal/areas?area=su-menh-companion` | Sứ mệnh Companion | nt |
| `/admin/portal/areas?area=congdongai` | Cộng đồng | nt |

## 3. Website

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/website` | Dashboard | GIỮ → trang chính mục "Website" |
| `/admin/website/pages` | Pages | TAB "Trang" |
| `/admin/website/homepage` | Homepage | TAB "Trang" |
| `/admin/website/landing-pages` | Landing Pages | TAB "Trang" |
| `/admin/website/static-pages` | Static Pages | TAB "Trang" |
| `/admin/website/navigation` | Navigation | TAB "Điều hướng" |
| `/admin/website/shared-sections` | Shared Sections | TAB "Nội dung dùng chung" |
| `/admin/website/seo` | SEO | TAB "SEO &amp; Chuyển hướng" |
| `/admin/website/redirect` | Redirect | TAB "SEO &amp; Chuyển hướng" |
| `/admin/website/portal-mapping` | Portal Mapping | TAB "Liên kết Portal" |
| `/admin/website/global-settings` | Global Settings | TAB "Cài đặt" |

## 4. Thương hiệu

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/brand` | Dashboard | GIỮ → trang chính mục "Thương hiệu" |
| `/admin/brand/logo` | Logo | TAB "Logo thương hiệu" |
| `/admin/brand/wordmark` | Wordmark | TAB "Logo thương hiệu" |
| `/admin/brand/typography` | Typography | TAB "Màu &amp; Kiểu chữ" |
| `/admin/brand/color-palette` | Color Palette | TAB "Màu &amp; Kiểu chữ" |
| `/admin/brand/theme` | Theme | TAB "Giao diện &amp; Biểu tượng" |
| `/admin/brand/icons` | Icons | TAB "Giao diện &amp; Biểu tượng" |
| `/admin/brand/open-graph` | Open Graph | TAB "Hình ảnh chia sẻ" |
| `/admin/brand/assets` | Brand Assets Registry | TAB "Thư viện tài sản" |
| `/admin/brand/settings` | Global Brand Settings | TAB "Cài đặt" |

## 5. Media

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/media-center` | Dashboard | GIỮ → trang chính mục "Media" |
| `/admin/media-center/library` | Media Library | TAB "Thư viện" |
| `/admin/media-center/images` | Images | TAB "Thư viện" |
| `/admin/media-center/videos` | Videos | TAB "Thư viện" |
| `/admin/media-center/documents` | Documents | TAB "Thư viện" |
| `/admin/media-center/audio` | Audio | TAB "Thư viện" |
| `/admin/media-center/folders` | Folder Management | TAB "Thư mục &amp; Bộ sưu tập" |
| `/admin/media-center/collections` | Collections | TAB "Thư mục &amp; Bộ sưu tập" |
| `/admin/media-center/tags` | Tags | TAB "Nhãn" |
| `/admin/media-center/settings` | Media Settings | TAB "Cài đặt" |

## 6. Hệ tri thức AI

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/ckos` | CKOS Dashboard | GIỮ → trang chính mục "Hệ tri thức AI" |
| `/admin/ckos/goals` | Goals | TAB "Mục tiêu &amp; Quy trình" |
| `/admin/ckos/workflows` | Workflows | TAB "Mục tiêu &amp; Quy trình" |
| `/admin/ckos/evaluations` | Evaluations | TAB "Mục tiêu &amp; Quy trình" |
| `/admin/tools` | Công cụ AI (Tools) | TAB "Công cụ &amp; Prompt" |
| `/admin/prompts` | Prompt AI (Prompts) | TAB "Công cụ &amp; Prompt" |
| `/admin/resources` | Tài nguyên (Resources) | TAB "Tài nguyên &amp; Case Study" |
| `/admin/case-study` | Case Study | TAB "Tài nguyên &amp; Case Study" |
| `/admin/templates` | Template *(chuyển từ nhóm Content)* | TAB "Tài nguyên &amp; Case Study" |
| `/admin/checklists` | Checklist *(chuyển từ nhóm Content)* | TAB "Tài nguyên &amp; Case Study" |
| `/admin/ckos/best-practices` | Best Practices | TAB "Thực hành tốt &amp; Hỏi đáp" |
| `/admin/ckos/faqs` | FAQs | TAB "Thực hành tốt &amp; Hỏi đáp" |
| `/admin/knowledge-seed` | Knowledge Seed | TAB "Dữ liệu khởi tạo" |

## 7. Học viện AI

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/academy` | Academy Dashboard | GIỮ → trang chính mục "Học viện AI" |
| `/admin/roadmap` | Lộ trình thành công | TAB |
| `/admin/daily-missions` | Nhiệm vụ hôm nay | TAB |
| `/admin/academy/courses` | Nội dung khoá học | TAB |
| `/admin/projects` | Dự án thực chiến | TAB |
| `/admin/academy/journeys` | Learning Journeys (đọc) | TAB |

## 8. AI Workspace

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/ai-workspace` | AI Workspace | GIỮ |
| `/admin/blog` | Blog AI *(chuyển từ nhóm Content)* | TAB trong "AI Workspace" |

## 9. Dự án &amp; Cơ hội

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/projects-opportunities` | Tổng quan | GIỮ → trang chính |
| `/admin/projects-opportunities/ecosystems` | Hệ sinh thái | TAB |
| `/admin/projects-opportunities/articles` | Bài viết | TAB |
| `/admin/projects-opportunities/categories` | Danh mục | TAB |

## 10. Premium

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/premium` | Sản phẩm số | GIỮ → trang chính mục "Premium" |
| `/admin/course-pricing` | Học phí V-SOLO / V-SCALE | TAB "Khoá học &amp; Học phí" |
| `/admin/coupons` | Mã giảm giá | TAB "Mã giảm giá &amp; Dịch vụ" |
| `/admin/services` | Dịch vụ | TAB "Mã giảm giá &amp; Dịch vụ" |
| `/admin/support` | Hỗ trợ | TAB "Mã giảm giá &amp; Dịch vụ" |
| `/admin/leads` | Leads | TAB "Leads" |
| `/admin/affiliate-hub` | Affiliate Hub | TAB "Affiliate" |
| `/admin/affiliate-hub/top-products` | Top sản phẩm Affiliate | TAB "Affiliate" |
| `/admin/affiliate/products` | Sản phẩm Affiliate | TAB "Affiliate" |
| `/admin/affiliate/links` | Link Affiliate | TAB "Affiliate" |
| `/admin/affiliate/analytics` | Báo cáo Affiliate | TAB "Affiliate" |

## 11. Đơn hàng

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/orders` | Đơn hàng | GIỮ → tách khỏi Premium, thành mục cấp 1 riêng |

## 12. Companion

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/companion-studio` | Companion Studio | GIỮ, đổi nhãn hiển thị → "Companion" |

## 13. Hành trình

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/journey` | Dashboard (trong nhóm "Journey &amp; Community") | GIỮ → tách thành mục cấp 1 "Hành trình" |

## 14. Cộng đồng

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/community` | Cộng đồng (trong nhóm "Journey &amp; Community") | GIỮ → tách thành mục cấp 1 "Cộng đồng" |

## 15. Người dùng

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/users` | Users &amp; Access | GIỮ, đổi nhãn → "Người dùng" |

## 16. Cài đặt

| Route | Nhãn cũ | Trạng thái mới |
|---|---|---|
| `/admin/settings` | System Settings | GIỮ, đổi nhãn → "Cài đặt" |
| `/admin/reports` | Analytics | GIỮ tạm (vị trí cụ thể chờ PMO xác nhận — xem IA §8) |

## 17. Ẩn khỏi Sidebar (route vẫn hoạt động, không xoá dữ liệu)

| Route | Nhãn cũ | Lý do ẩn |
|---|---|---|
| `/admin/founder/owners` | Workspace Owner Panel | Ngôn ngữ kỹ thuật, không phải nhu cầu vận hành hằng ngày |
| `/admin/founder/search` | Global Search | Chưa triển khai thật (placeholder) |
| `/admin/student-success` | Thành công học viên | Orphan — route Portal cũ đã archive |
| `/admin/updates` | Tin tức &amp; Cập nhật | Orphan — Portal đọc dữ liệu khác |
| `/admin/news` | Tin nội bộ | Orphan |
| `/admin/ebooks` | Ebook | Orphan — không route Portal nào hiển thị |
| `/admin/sop` | SOP | Orphan — Portal đọc file tĩnh khác |
| `/admin/saved` (trang Admin, khác `/portal/saved`) | Tài nguyên đã lưu | 100% dữ liệu mock |
| `/admin/portal-builder/banner` | Banner | Orphan — component đọc dữ liệu này chưa được mount ở Portal |

**Tổng: 17 mục Sidebar cấp 1 (18 nếu Analytics tách riêng), 9 route ẩn, không route nào bị xoá hoặc đổi URL.**
