# Workspace Canonical Specification (WCS) — docs/admin/workspaces/

## Purpose

Mỗi file trong thư mục này là **Workspace Canonical Specification (WCS)** của một Workspace thuộc Admin CMS (EPIC-02/EPIC-WEB/EPIC-BRAND/...). WCS là **Single Source of Truth** ở cấp Product Governance cho Workspace đó — không phải tài liệu kỹ thuật.

**Mọi Implementation Package và Technical Sprint (VD: các brief IMP-WEB-XXX, IMP-ADM-XXX) phải tham chiếu WCS tương ứng trước tiên** khi có bất kỳ câu hỏi nào về phạm vi, Information Architecture, ownership, hoặc mối quan hệ với Workspace khác. Nếu code/Sprint đã triển khai khác với WCS, WCS là bằng chứng ưu tiên — chênh lệch phải được ghi nhận và trình PMO, không tự sửa WCS để khớp với code đã lỡ làm sai.

## Folder Structure

```
docs/admin/workspaces/
├── README.md                 — file này
├── website-workspace.md      — WCS của Website Workspace
├── brand-studio.md           — WCS của Brand Studio
├── media-center.md           — WCS của Media Center
└── [workspace-slug].md       — mỗi Workspace mới thêm 1 file, đặt tên kebab-case
```

Không có thư mục con theo Workspace — mỗi Workspace đúng một file `.md` duy nhất ở cấp gốc thư mục này. Không tách WCS thành nhiều file nhỏ theo từng phần (Scope/Dashboard Vision/...) — WCS phải là một tài liệu liền mạch, dễ đọc từ trên xuống.

## Approval Workflow

1. **Draft** — WCS đang soạn, dựa trên bằng chứng tốt nhất hiện có (Product Package nếu có, Portal Coverage Audit, brief PMO đã gửi). Có thể thiếu thông tin, phải ghi rõ phần nào còn thiếu.
2. **In Review** — WCS đã đủ 15 phần theo WCS Standard v1.0, đang chờ Founder/PMO đọc và duyệt.
3. **Approved** — Founder/PMO đã xác nhận. Từ thời điểm này, mọi Sprint kỹ thuật liên quan tới Workspace đó phải tuân theo đúng WCS đã Approved — sai lệch phải trình PMO trước khi triển khai, không tự quyết.
4. **Deprecated** — Workspace bị gộp/loại bỏ/thay thế bởi Workspace khác. WCS vẫn giữ lại (không xóa) để có lịch sử, chỉ đổi Status.

**Không tự chuyển trạng thái từ Draft/In Review lên Approved.** Chỉ Founder/PMO xác nhận Approved qua một chỉ thị rõ ràng (giống mẫu "PMO Clarification"/"Founder Directive" đã dùng trong các sprint trước) — phiên làm việc kỹ thuật không tự phong Approved cho WCS mình vừa viết.

## Versioning

Mỗi WCS có `Version` (số, bắt đầu từ 1.0), `Approval Date` (ngày Founder/PMO duyệt lần đầu — để trống nếu chưa Approved), và `Last Updated` (ngày sửa gần nhất, kể cả khi chỉ thêm ghi chú nhỏ).

- Sửa **không đổi phạm vi/quyết định đã duyệt** (lỗi chính tả, làm rõ câu chữ, thêm ví dụ minh họa) → không tăng Version, chỉ cập nhật `Last Updated`.
- Sửa **thay đổi phạm vi/IA/ownership đã duyệt** (VD: thêm/bớt nhóm IA, đổi Workspace sở hữu một entity) → tăng Version (1.0 → 1.1 hoặc 2.0 tùy mức độ), yêu cầu Founder/PMO duyệt lại trước khi áp dụng cho Sprint kỹ thuật tiếp theo, và **bắt buộc** Sprint đã sản sinh ra thay đổi đó phải được PMO xác nhận rõ ràng (không tự suy luận từ context sprint kỹ thuật).

## Update Rules

- WCS chỉ chứa **Product Governance** — không CRUD, không Database, không API, không React, không Technical Design, không Implementation. Nếu một sprint kỹ thuật phát hiện chi tiết kỹ thuật cần ghi lại, chỗ đúng là tài liệu sprint report (`docs/admin/*.md` khác, VD: `ADMIN_SHELL.md`, `CKOS_MANAGEMENT.md`, `WEBSITE_WORKSPACE_FOUNDATION.md`), không phải WCS.
- Khi một sprint kỹ thuật phát hiện WCS và thực tế triển khai khác nhau (VD: tên nhóm IA lệch, phạm vi ownership chồng lấn với Workspace khác) — ghi nhận vào báo cáo sprint đó, **không tự sửa WCS**, trình PMO quyết định theo đúng thứ tự ưu tiên: Founder Decision → PMO Clarification → Portal hiện tại → tài liệu cũ (`docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`).
- Mỗi Workspace mới trước khi vào Sprint kỹ thuật đầu tiên nên có WCS ở trạng thái tối thiểu **Draft** — không bắt buộc **Approved** trước khi bắt đầu Foundation Sprint, nhưng phạm vi Sprint đó không được vượt quá những gì WCS (dù còn Draft) đã mô tả.
