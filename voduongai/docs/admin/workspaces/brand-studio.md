# Brand Studio — Workspace Canonical Specification

> ℹ️ **Cập nhật BRAND-SPR-001:** Brief IMP-BRAND-001 xác nhận rõ *"Brand Studio Product Package v1.0 đã được Founder và PMO phê duyệt"* và cung cấp Scope 10 mục cụ thể (Dashboard/Logo/Wordmark/Typography/Color Palette/Theme/Icons/Open Graph/Brand Assets Registry/Global Brand Settings). Đây là chỉ thị Founder/PMO rõ ràng, giải quyết dứt điểm cảnh báo "chưa có Product Package" của bản Draft trước (IMP-GOV-001). WCS này được viết lại theo đúng Update Rules của `docs/admin/workspaces/README.md`: Status chuyển **Draft → Approved**, Scope/IA cập nhật theo Product Package thật thay vì suy luận. Câu hỏi còn treo từ bản Draft — "Brand Studio và Media Center tách hay gộp?" — nay **đã có câu trả lời**: BRAND-SPR-001 xây Brand Studio như một Workspace **độc lập**, route thật `/admin/brand/*`; Media Center vẫn tách riêng, chưa có Product Package, vẫn Draft/ComingSoon (`/admin/media-center`).

## 1. Executive Summary

Brand Studio là nơi quản trị nhận diện thương hiệu VO DUONG AI — Logo, Wordmark, Typography, Color Palette, Theme, Icons, Open Graph, tổng hợp trong Brand Assets Registry, cộng với Global Brand Settings — để các Workspace khác (Website, CKOS, Academy...) và chính Portal có một nguồn tham chiếu nhất quán cho tài sản/token thương hiệu, thay vì rải rác trong code (`globals.css`, `Footer.tsx`, root `CLAUDE.md`...). BRAND-SPR-001 (Foundation) đã phát hiện một số bất nhất thương hiệu thật đang tồn tại (xem Mục 6) — giá trị lớn nhất của Workspace này giai đoạn đầu là **làm lộ rõ** các bất nhất đó để Founder quyết định, trước khi xây bất kỳ công cụ tự động nào.

## 2. Mission

Đảm bảo mọi nơi trong Portal và site công khai hiển thị đúng logo/màu/font/theme hiện hành — một nguồn sự thật duy nhất — và Founder có thể xem/cập nhật token thương hiệu mà không cần đọc code. Ở giai đoạn Foundation, Mission được thực hiện một phần: Registry đã có (Founder xem được), nhưng Portal/site công khai **chưa đọc từ Registry** (xem Mục 7).

## 3. Scope

Đúng 10 mục theo Product Package v1.0 (brief BRAND-SPR-001, khóa — không tự đổi tên/thêm/bớt):

1. **Dashboard** — tổng quan Brand Studio (mock data ở Foundation, xem Mục 9).
2. **Logo** — metadata các phiên bản logo (Brand Asset Registry, category Logo).
3. **Wordmark** — metadata chữ lockup thương hiệu (Brand Asset Registry, category Wordmark).
4. **Typography** — token font family/weight dùng trong thương hiệu.
5. **Color Palette** — token màu chính thức.
6. **Theme** — ghi nhận tổ hợp nền/chữ/accent đang tồn tại trong code (không phải Theme Builder).
7. **Icons** — metadata icon thương hiệu (Brand Asset Registry, category Icon).
8. **Open Graph** — metadata ảnh Open Graph mặc định cấp thương hiệu (Brand Asset Registry, category Open Graph Image).
9. **Brand Assets Registry** — danh sách tổng hợp mọi Brand Asset (Logo/Wordmark/Icon/Open Graph Image), 1 schema dùng chung.
10. **Global Brand Settings** — cấu hình thương hiệu tổng thể, 1 record duy nhất.

## 4. Out of Scope

- **Thư viện media dùng chung** (ảnh minh hoạ bài viết, ảnh khoá học, upload file thật) — thuộc `media-center.md`, Workspace riêng, vẫn Draft/chưa có Product Package.
- **Nội dung Website** (Hero, Trust Stats...) — thuộc Website Workspace.
- **Theme Builder/Logo Editor/AI Brand Generator/Asset Editor** — không triển khai ở BRAND-SPR-001 theo brief, có thể là Sprint tương lai.
- **Open Graph title/description theo từng trang** — thuộc SEO Registry của Website Workspace (WEB-SPR-005); Brand Studio's Open Graph chỉ quản lý ẢNH OG mặc định cấp thương hiệu, không phải text theo trang.

## 5. Information Architecture

10 mục ở Mục 3, mỗi mục là một route thật dưới `/admin/brand/*`:

| Mục | Route |
|---|---|
| Dashboard | `/admin/brand` |
| Logo | `/admin/brand/logo` |
| Wordmark | `/admin/brand/wordmark` |
| Typography | `/admin/brand/typography` |
| Color Palette | `/admin/brand/color-palette` |
| Theme | `/admin/brand/theme` |
| Icons | `/admin/brand/icons` |
| Open Graph | `/admin/brand/open-graph` |
| Brand Assets Registry | `/admin/brand/assets` |
| Global Brand Settings | `/admin/brand/settings` |

Điều hướng nội bộ: tab ngang qua đúng 10 mục (`BrandWorkspaceShell`), cùng pattern `WebsiteWorkspaceShell` (Website Workspace). Nguồn IA duy nhất trong code: `src/lib/admin/brand/navigation.ts`. Nhóm nav Admin: `"Brand Studio"` trong `src/lib/admin/nav.ts` (trước đó là 1 mục gộp "Brand & Media", ComingSoon — đã tách, xem báo cáo BRAND-SPR-001).

## 6. Portal Coverage

BRAND-SPR-001 phát hiện các bất nhất thương hiệu thật khi sưu tầm dữ liệu mẫu (không phải audit chính thức, nhưng đủ cụ thể để ghi nhận):

| Phát hiện | Chi tiết |
|---|---|
| **2 mã màu "Brand Orange" khác nhau** | `--color-brand-orange: #FF7A00` (globals.css, đang dùng thật ở Footer/Nav) vs `#F97316` (quy ước logo bắt buộc cho trang mới, root `CLAUDE.md`) |
| **Font wordmark khác font toàn site** | Logo dùng `Inter` (theo `CLAUDE.md`), toàn site dùng `--font-sans` (system font stack, không có Inter) — có thể là chủ đích, chưa xác nhận |
| **2 "theme" song song, chưa hợp nhất** | `:root` định nghĩa theme sáng (`--background: #F8FAFC`) nhưng Portal/Admin dùng nền tối hardcode trực tiếp (`bg-[#0B1F4D]`), không qua token nào |
| **Chưa có Open Graph Image mặc định** | `layout.tsx` `generateMetadata()` không set `openGraph.images` — chia sẻ link lên mạng xã hội không có ảnh preview |
| **Favicon đã có Admin CRUD ở nơi khác** | `settings.faviconUrl` qua System Settings (`/admin/settings`) — chồng lấn với Icons (Mục 3) |

## 7. Content Ownership

| Entity | Editable Workspace | Consumer Workspace/Portal | Publish Target | Visibility Rule |
|---|---|---|---|---|
| Brand Asset (Logo/Wordmark/Icon/OG Image) | Brand Studio | Chưa có (xem dưới) | Toàn site (dự kiến) | Theo `status` từng Asset |
| Typography/Color/Theme Token | Brand Studio | Chưa có (xem dưới) | Design reference (dự kiến) | N/A |
| Global Brand Settings | Brand Studio | Chưa có (xem dưới) | Toàn site (dự kiến) | Theo `status` |

**Consumer hiện tại là 0** — đúng pattern đã ghi nhận ở mọi Registry của Website Workspace (WEB-SPR-002 đến 006): Registry hoạt động thật (CRUD đầy đủ), nhưng Portal/site công khai **chưa đọc dữ liệu từ đây** — vẫn dùng trực tiếp `globals.css`/`Footer.tsx`/code hardcode. Nối Registry vào Portal thật là việc của một Sprint tương lai (tương tự "Website Publish Bridge" đã đề xuất ở WEB-SPR-006).

## 8. Dependency

- **Owns:** Brand Asset metadata (Logo/Wordmark/Icon/OG Image), Typography Token, Color Token, Theme Profile, Global Brand Settings.
- **Consumes:** `docs/admin/PORTAL_COVERAGE_AUDIT.md`, Founder Directive Greenfield Admin, `src/app/globals.css` (nguồn token màu/font/theme thật).
- **Provides (dự kiến, chưa triển khai):** Brand token cho mọi Workspace khác (Website Shared Sections cần media theo thương hiệu, v.v.).
- **Dependency Matrix:**

| Brand Studio | Workspace/mục khác | Loại chồng lấn | Trạng thái |
|---|---|---|---|
| Icons (favicon) | System Settings (`/admin/settings`, `settings.faviconUrl`) | Chồng lấn trực tiếp | Chưa PMO quyết định |
| Global Brand Settings (logo/favicon/tagline) | System Settings | Chồng lấn một phần | Chưa PMO quyết định |
| Open Graph (ảnh mặc định) | SEO Registry (Website Workspace, OG title/description theo từng trang) | Ranh giới rõ (ảnh cấp thương hiệu vs text cấp trang) nhưng phối hợp cần xác nhận | Chưa PMO xác nhận cách phối hợp |
| Toàn bộ Workspace | Media Center (`media-center.md`) | ~~Ranh giới chưa rõ~~ **Đã giải quyết** — 2 Workspace tách riêng, route riêng | Đã xác nhận BRAND-SPR-001 |

## 9. Workflow

**Asset/Token Lifecycle (Product Workflow, không phải Technical Workflow):**

```
Draft → Active → Inactive → Archived
```

Dùng lại đúng 4 trạng thái của Navigation Registry (Website Workspace) — một Asset/Token được thêm (Draft), đưa vào dùng (Active), tạm ngưng (Inactive), hoặc lưu trữ khi không còn dùng (Archived). Không có bước "Review/Approved" nhiều cấp như Website Page — token/asset thương hiệu là cấu hình, không phải nội dung marketing cần duyệt nhiều vòng.

## 10. Dashboard Vision

Founder mở Brand Studio Dashboard và thấy ngay: số lượng Brand Asset/Color Token/Typography Token/Theme Profile hiện có, và — quan trọng nhất ở giai đoạn này — danh sách các **bất nhất thương hiệu cần xác nhận** (2 mã cam khác nhau, theme kép, thiếu OG image). BRAND-SPR-001 xây Dashboard với **Mock Data** (đúng chỉ thị Task 2 của brief) — số liệu thật xem trực tiếp ở từng Registry, không phải trên Dashboard.

## 11. Automation Vision

Định hướng tương lai (chưa implement):
- Tự động phát hiện khi code dùng mã màu không khớp Color Palette đã Active (lint rule hoặc CI check).
- Đồng bộ 2 chiều: Registry → CSS variable thật (thay vì Registry chỉ là bản ghi chú song song).
- Cảnh báo khi thêm Brand Asset mới mà chưa có Usage Note.

## 12. Future Expansion

| Hướng mở rộng | Đánh giá |
|---|---|
| Mobile | Cần Brand Asset API trước khi app di động dùng chung token. |
| CRM | Không áp dụng trực tiếp. |
| Marketplace | Không áp dụng trực tiếp. |
| API | Ứng viên tự nhiên — "Brand Asset API" nội bộ cho các Workspace khác đọc token. |
| Enterprise | Không áp dụng cho phạm vi hiện tại. |
| Multi-language | Không áp dụng — brand token không phụ thuộc ngôn ngữ. |
| Multi-site | Cần cơ chế multi-brand nếu VDAI mở site con — chưa có. |
| White Label | Điểm chạm tự nhiên trong tương lai xa (đổi thương hiệu theo tenant) — ngoài phạm vi hiện tại. |

## 13. Product Decisions

- Brand Asset dùng **một schema chung** cho cả 4 category (Logo/Wordmark/Icon/Open Graph Image), phân biệt bằng `category` — cùng nguyên tắc Shared Structure đã dùng cho Website Page Registry.
- Status dùng lại **đúng** model 4 trạng thái của Navigation Registry (Website Workspace) — không định nghĩa Status riêng cho từng Registry mới của Brand Studio.
- Theme Foundation **ghi nhận hiện trạng** (kể cả khi có 2 theme song song chưa hợp nhất), không tự "sửa" thành 1 theme hay tự chọn theme nào là đúng.

## 14. Founder Decisions

- **Brand Studio Product Package v1.0 — Approved.** Xác nhận qua brief IMP-BRAND-001: *"Đây là Workspace thứ hai được phép triển khai kỹ thuật"* (sau Website Workspace).
- **Greenfield Admin Architecture** áp dụng cho toàn bộ Brand Studio — không kế thừa Legacy Admin, không giữ compatibility với dữ liệu test.

## 15. PMO Decisions

- **Brand Studio và Media Center là 2 Workspace riêng — đã xác nhận** (giải quyết câu hỏi treo từ bản Draft trước).
- 3 điểm chồng lấn còn treo (Mục 8): Icons/Global Brand Settings vs System Settings, phối hợp Open Graph với SEO Registry — **chưa PMO xử lý**, ghi nhận tại BRAND-SPR-001.
- Thứ tự ưu tiên khi phát hiện khác biệt: **Founder Decision → PMO Clarification → Portal hiện tại → tài liệu cũ** (không đổi, áp dụng chung mọi Workspace).

---

## Status

**Approved** — Product Package v1.0 xác nhận qua brief IMP-BRAND-001 (Founder Directive). WCS này (viết lại theo WCS Standard v1.0) thay thế bản Draft trước (IMP-GOV-001), phản ánh Scope/IA thật đã triển khai ở BRAND-SPR-001.

## Version

1.0

## Approval Date

2026-07-12 (BRAND-SPR-001, qua Founder Directive trong brief IMP-BRAND-001).

## Last Updated

2026-07-12 (BRAND-SPR-001 — viết lại từ Draft, cập nhật Status/Scope/IA/Dependency theo Product Package thật).
