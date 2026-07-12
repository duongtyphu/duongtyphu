# Media Center — Workspace Canonical Specification

> ⚠️ **Skeleton — chưa có Product Package.** Theo IMP-GOV-001 Task 2: *"Nếu Product Package của Media Center chưa hoàn thành thì chỉ tạo skeleton với trạng thái Draft."* Không tìm thấy Product Package nào cho Media Center trong repository hoặc phiên làm việc trước đó. Mọi mục dưới đây là khung (skeleton) — nội dung thật (TBD) cần một Product Package hoặc PMO Clarification riêng trước khi điền.
>
> **Cập nhật BRAND-SPR-001:** câu hỏi "Media Center có tách khỏi Brand Studio không?" (Mục 8/15 cũ) **đã được trả lời** — brief IMP-BRAND-001 xác nhận Brand Studio là Workspace độc lập với Product Package riêng, route thật `/admin/brand/*` (xem `brand-studio.md`, nay Status Approved). Media Center vẫn tách riêng nhưng **vẫn chưa có Product Package** — nav item cũ `/admin/brand-media` (gộp cả hai) đã được thay bằng `/admin/media-center` (ComingSoon) dành riêng cho Media Center.

## 1. Executive Summary

TBD — chưa có Product Package xác định vai trò/giá trị cụ thể của Media Center.

## 2. Mission

TBD.

## 3. Scope

TBD. Giả thuyết ban đầu (chưa xác nhận): thư viện media dùng chung (ảnh, video, file) cho các Workspace khác upload/chọn dùng lại, thay vì mỗi nơi tự quản lý file riêng.

## 4. Out of Scope

TBD. Dự kiến không quản lý: nhận diện thương hiệu (Logo/Favicon/Brand Colors — thuộc `brand-studio.md`), nội dung Website (thuộc Website Workspace).

## 5. Information Architecture

TBD — chỉ có 1 route placeholder `/admin/media-center` (ComingSoon, `nav.ts`), chưa có IA con nào được xác nhận.

## 6. Portal Coverage

TBD — chưa có audit riêng. `docs/admin/PORTAL_COVERAGE_AUDIT.md` không có mục Portal Coverage riêng cho Media Center.

## 7. Content Ownership

TBD.

## 8. Dependency

TBD. Ranh giới với Brand Studio **đã rõ** (BRAND-SPR-001): Brand Studio quản lý metadata/token thương hiệu (Logo/Wordmark/Typography/Color/Theme/Icons/Open Graph), Media Center (dự kiến) quản lý thư viện file media dùng chung — 2 Workspace độc lập, không còn chung 1 route.

## 9. Workflow

TBD.

## 10. Dashboard Vision

TBD.

## 11. Automation Vision

TBD.

## 12. Future Expansion

TBD.

## 13. Product Decisions

Chưa có.

## 14. Founder Decisions

Chưa có Founder Decision riêng cho Media Center. Founder Directive Greenfield Admin (`docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`) sẽ áp dụng khi Workspace này được triển khai.

## 15. PMO Decisions

- **Media Center là Workspace độc lập, tách khỏi Brand Studio — đã xác nhận** (BRAND-SPR-001, giải quyết câu hỏi treo trước đó).
- Câu hỏi còn treo: Media Center vẫn chưa có Product Package chính thức — cần PMO cung cấp trước khi có Sprint kỹ thuật đầu tiên.

---

## Status

**Draft** (skeleton) — chờ Product Package hoặc PMO Clarification trước khi điền nội dung thật.

## Version

1.0

## Approval Date

Chưa có (Draft).

## Last Updated

2026-07-12 (BRAND-SPR-001 — cập nhật Mục 5/8/15: xác nhận tách khỏi Brand Studio, route đổi sang `/admin/media-center`; vẫn Draft, vẫn chưa có Product Package).
