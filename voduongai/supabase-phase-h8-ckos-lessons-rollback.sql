-- ============================================================================
-- PHASE H.8 — Lesson Intelligence: Rollback SQL (idempotent, staged)
-- ============================================================================

-- LỰA CHỌN A — xoá dữ liệu quan hệ đã seed ở Phase H.8 (không có ở thời điểm
-- này vì migrate.sql không INSERT gì — giữ để dùng khi Phase H.9 seed thật):
delete from ckos_resource_lessons;
delete from ckos_best_practice_lessons;
delete from ckos_case_study_lessons;
delete from ckos_lesson_faqs;
delete from ckos_lesson_journeys;
delete from ckos_lesson_competencies;
-- Không đụng ckos_tool_lessons/ckos_prompt_lessons/ckos_workflow_lessons —
-- các bảng này thuộc Phase H.3/H.4/H.5, rollback riêng ở file phase đó.

-- LỰA CHỌN B — drop toàn bộ bảng quan hệ mới tạo ở H.8 và bỏ cột CKOS Object
-- Standard đã thêm vào `lessons` (KHÔNG đụng cột gốc id/title/description/
-- video_url/pdf_url/price/active/sort_order/created_at):
-- drop table if exists ckos_resource_lessons;
-- drop table if exists ckos_best_practice_lessons;
-- drop table if exists ckos_case_study_lessons;
-- drop table if exists ckos_lesson_faqs;
-- drop table if exists ckos_lesson_journeys;
-- drop table if exists ckos_lesson_competencies;
-- drop index if exists lessons_slug_key;
-- alter table lessons drop column if exists slug;
-- alter table lessons drop column if exists status;
-- alter table lessons drop column if exists version;
-- alter table lessons drop column if exists language;
-- alter table lessons drop column if exists difficulty;
-- alter table lessons drop column if exists tags;
-- alter table lessons drop column if exists metadata;
-- alter table lessons drop column if exists updated_at;

-- Trong MỌI trường hợp: dữ liệu gốc `lessons` (title/video_url/pdf_url/price/
-- active) và logic checkout/orders.lesson_id KHÔNG bị động tới.

-- Xác nhận sau rollback (Lựa chọn A):
--   select count(*) from ckos_resource_lessons; -- kỳ vọng 0
--   select count(*) from ckos_lesson_journeys; -- kỳ vọng 0
