# Brand Studio — Workspace Canonical Specification

> ⚠️ **Cảnh báo phạm vi (đọc trước khi dùng tài liệu này):** Không tìm thấy "Brand Studio Product Package" nào đã được Founder/PMO phê duyệt trong repository hoặc trong phiên làm việc dẫn tới IMP-GOV-001. WCS này được soạn từ bằng chứng tốt nhất hiện có (`src/lib/admin/nav.ts`, `docs/admin/PORTAL_COVERAGE_AUDIT.md`) — không phải từ một Product Package đã duyệt. Vì vậy Status = **Draft**, không phải Approved. Ngoài ra, code hiện tại (`nav.ts` dòng 32) chỉ có **một** nhóm nav gộp `"Brand & Media"` (`/admin/brand-media`, ComingSoon) — không có route/nhóm riêng "Brand Studio" tách biệt "Media Center". IMP-GOV-001 yêu cầu 2 file WCS riêng (`brand-studio.md` + `media-center.md`), nên tài liệu này tạm coi "Brand Studio" là phần **quản lý thương hiệu** (logo/favicon/màu/guideline) trong nhóm gộp đó, và `media-center.md` là phần **thư viện media**. Ranh giới này là suy luận, cần PMO xác nhận có tách 2 Workspace thật hay gộp lại thành 1 "Brand & Media" đúng như code hiện tại.

## 1. Executive Summary

Brand Studio là nơi quản trị nhận diện thương hiệu VO DUONG AI — logo, favicon, bảng màu, guideline sử dụng thương hiệu — để các Workspace khác (Website, CKOS, Academy...) và chính Portal có một nguồn duy nhất, nhất quán cho tài sản thương hiệu, thay vì file tĩnh rải rác trong code. Hiện trạng: gần như chưa có gì được xây — `SiteSettings` (`/admin/settings`) chỉ lưu được URL logo dạng text, không có thư viện/versioning/guideline nào.

## 2. Mission

Đảm bảo mọi nơi trong Portal và site công khai hiển thị đúng logo/màu/favicon hiện hành, và Founder có thể cập nhật nhận diện thương hiệu (đổi logo, đổi bảng màu) mà không cần sửa code, không cần biết tài sản đang nằm ở file nào.

## 3. Scope

- **Logo** — quản lý file logo (các biến thể: full, icon, dark/light mode), phiên bản hiện hành.
- **Favicon** — quản lý file favicon.
- **Bảng màu (Brand Colors)** — mã màu chính thức của thương hiệu, dùng tham chiếu cho các Workspace khác.
- **Brand Guideline** — quy tắc sử dụng thương hiệu (nếu Founder muốn số hoá, hiện chưa có bản nào trong repo).

*(Phạm vi trên là suy luận từ tên "Brand Studio" + mục "Brand assets" trong Portal Coverage Audit §Workspace Recommendation — chưa có Product Package xác nhận chính thức, xem cảnh báo đầu tài liệu.)*

## 4. Out of Scope

- **Thư viện media dùng chung** (ảnh minh hoạ bài viết, ảnh khoá học...) — thuộc `media-center.md`.
- **Nội dung Website** (Hero, Trust Stats...) — thuộc Website Workspace.
- **`SiteSettings` các field không liên quan thương hiệu** (tên site, SEO mặc định, social, footer text) — thuộc Global Settings (Website Workspace) hoặc System Settings hiện có, xem `website-workspace.md` Mục 8.

## 5. Information Architecture

Chưa có route thật nào dành riêng cho Brand Studio. Route duy nhất tồn tại trong code là nhóm gộp:

| Nhóm (code hiện tại) | Route | Trạng thái |
|---|---|---|
| Brand & Media | `/admin/brand-media` | ComingSoon (`nav.ts` dòng 32) — chưa có trang thật |

Không có cấu trúc IA con (VD: Logo/Favicon/Colors/Guideline như các mục ở Scope) nào đã được PMO khoá. Đây là điểm cần PMO Clarification trước khi có Sprint kỹ thuật đầu tiên cho Workspace này — tương tự cách WEB-SPR-001 đã khoá 10 nhóm cho Website Workspace.

## 6. Portal Coverage

Theo `docs/admin/PORTAL_COVERAGE_AUDIT.md` (dòng 125, 217, 253):

| Portal Component | Hiện trạng | Coverage |
|---|---|---|
| Brand assets (logo/favicon/màu) | Static files + `SiteSettings` (chỉ URL, chưa có thư viện) | Một phần qua `/admin/settings` |
| Ước tính Coverage Score | **~20%** | Thấp, xếp thứ 2 từ dưới lên trong 15 Workspace đề xuất |

Chưa có audit chi tiết riêng cho Brand Studio (Portal Coverage Audit chỉ đề cập ngắn gọn, không sâu như Website). Cần một lượt audit riêng nếu Workspace này được PMO xác nhận triển khai.

## 7. Content Ownership

| Entity | Editable Workspace | Consumer Workspace/Portal | Publish Target | Visibility Rule |
|---|---|---|---|---|
| Logo/Favicon | Brand Studio (dự kiến) | Toàn Portal + site công khai (Header, Footer, `<head>`) | Toàn site | Luôn public khi là phiên bản hiện hành |
| Brand Colors | Brand Studio (dự kiến) | Các Workspace khác cần tham chiếu màu thương hiệu | Design token/CSS variable (chưa xây) | N/A |

**Consumer hiện tại là 0** — chưa có Sprint kỹ thuật nào cho Workspace này, toàn bộ bảng trên là dự kiến, không phải đã triển khai.

## 8. Dependency

- **Owns (dự kiến):** Logo, Favicon, Brand Colors, Brand Guideline.
- **Consumes:** `docs/admin/PORTAL_COVERAGE_AUDIT.md`, Founder Directive Greenfield Admin.
- **Provides (dự kiến):** Brand asset URL/token cho mọi Workspace khác (Website Homepage dùng logo, v.v.).
- **Dependency Matrix:**

| Brand Studio | Workspace/mục khác | Loại chồng lấn | Trạng thái |
|---|---|---|---|
| Logo/Favicon | System Settings (`/admin/settings`, hiện lưu URL logo dạng text) | Chồng lấn trực tiếp — cùng quản lý logo | Chưa PMO quyết định |
| Brand Colors | Shared Sections (Website Workspace, banner/CTA có thể cần theo màu thương hiệu) | Phụ thuộc dữ liệu | Chưa xác định |
| Toàn bộ Workspace | Media Center (`media-center.md`) | Ranh giới Brand Studio vs Media Center chưa rõ — cùng nằm trong 1 route gộp `/admin/brand-media` ở code hiện tại | **Cần PMO xác nhận: tách 2 Workspace hay gộp 1** |

## 9. Workflow

Chưa xác định — chưa có Sprint kỹ thuật nào, không có Product Workflow nào được Founder/PMO mô tả cho Brand Studio tính đến thời điểm viết tài liệu này.

## 10. Dashboard Vision

Founder mở Brand Studio và thấy ngay: logo/favicon hiện hành đang dùng, bảng màu chính thức, và nơi nào trong site đang tham chiếu chúng. *(Suy luận hợp lý từ vai trò Workspace — chưa được Founder/PMO xác nhận cụ thể.)*

## 11. Automation Vision

Chưa xác định — không có bằng chứng nào trong repo về automation mong muốn cho Workspace này.

## 12. Future Expansion

| Hướng mở rộng | Đánh giá |
|---|---|
| Mobile | Chưa áp dụng — cần asset thương hiệu chuẩn hoá trước khi app di động có thể dùng chung. |
| CRM | Không áp dụng trực tiếp. |
| Marketplace | Không áp dụng trực tiếp. |
| API | Ứng viên hợp lý cho một "Brand Asset API" nội bộ nếu nhiều Workspace cần đọc logo/màu. |
| Enterprise | Không áp dụng cho phạm vi hiện tại. |
| Multi-language | Không áp dụng — brand asset không phụ thuộc ngôn ngữ. |
| Multi-site | Nếu VDAI mở site con, cần cơ chế multi-brand — chưa có trong repo hiện tại. |
| White Label | Có thể là điểm chạm tự nhiên trong tương lai xa (đổi thương hiệu theo tenant) — hoàn toàn ngoài phạm vi hiện tại. |

## 13. Product Decisions

Chưa có — Workspace này chưa qua Sprint kỹ thuật nào, không có Product Decision nào đã ban hành.

## 14. Founder Decisions

Chưa có Founder Decision nào ghi nhận riêng cho Brand Studio trong repository tại thời điểm viết tài liệu này. Founder Directive Greenfield Admin (`docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`) áp dụng chung cho mọi Workspace tương lai, bao gồm Workspace này khi được triển khai.

## 15. PMO Decisions

Chưa có PMO Clarification nào riêng cho Brand Studio. Các câu hỏi đang chờ PMO xử lý:

- Brand Studio và Media Center là **2 Workspace riêng** hay **gộp thành 1 "Brand & Media"** đúng như `nav.ts` hiện tại?
- Nếu tách riêng: IA con của Brand Studio gồm những nhóm nào (Logo/Favicon/Colors/Guideline như Mục 3 đề xuất, hay khác)?
- Chồng lấn Logo/Favicon với System Settings (Mục 8) xử lý thế nào?

---

## Status

**Draft** — Chưa có Product Package đã phê duyệt. Tài liệu này tổng hợp bằng chứng tốt nhất hiện có, cần PMO xác nhận trước khi chuyển In Review/Approved.

## Version

1.0

## Approval Date

Chưa có (Draft).

## Last Updated

2026-07-12 (IMP-GOV-001, khởi tạo lần đầu).
