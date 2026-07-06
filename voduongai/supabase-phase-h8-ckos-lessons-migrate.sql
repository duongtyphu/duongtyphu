-- ============================================================================
-- PHASE H.8 — Lesson Intelligence: Migrate SQL (idempotent, NOT APPLIED)
-- ============================================================================
-- Canonical Lesson Source = bảng `lessons` (đã là single source of truth,
-- không có nguồn tĩnh trùng lặp nào cần hợp nhất — "Academy Reset" (xem
-- src/app/portal/ai-academy/page.tsx, vdai-academy/page.tsx) đã xoá mọi mảng
-- Lesson tĩnh cũ trong src/data. Do đó KHÔNG có bước "gộp nhiều nguồn vào
-- lessons" như Best Practice/Case Study (Phase H.7) — chỉ cần bổ sung cột
-- chuẩn CKOS (đã làm ở -schema.sql) và (khi có dữ liệu quan hệ thật) seed các
-- bảng quan hệ bên dưới.
--
-- Dry-run script (scripts/phase-h8-seed-lesson-relationships.ts) xác nhận:
-- KHÔNG tìm thấy bất kỳ mapping tường minh nào từ Lesson → Tool/Prompt/
-- Workflow/Resource/BestPractice/CaseStudy/FAQ/Journey/Competency trong toàn
-- bộ static source hiện có (chỉ có `RoadmapStep.relatedLesson` — 1 chiều
-- ngược, Roadmap Step → Lesson, không phải Lesson → X). Vì vậy file này
-- KHÔNG có INSERT nào cho 9 bảng quan hệ — để trống, chờ nguồn dữ liệu quan
-- hệ thật (Admin gán tay hoặc nguồn mới) ở phase sau.
-- ============================================================================

-- Không có INSERT nào ở bước này — xem Integrity Report trong báo cáo H.8,
-- mục "Missing Relationship" (dự kiến, không phải lỗi).

-- Xác nhận trạng thái hiện tại (đọc-only, để review trước khi apply):
select count(*) as total_lessons, count(*) filter (where slug is not null) as with_slug
from lessons;
