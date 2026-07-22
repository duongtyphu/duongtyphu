-- Course Builder (Premium) — baseline lại 2 bảng course_modules/course_lessons
-- đã tồn tại sẵn trong DB (0 dòng, 0 RLS policy, 0 consumer code, KHÔNG có
-- trong lịch sử migration đã track trước đây — nguồn gốc/thời điểm tạo không
-- rõ). Founder xác nhận: đổi tên khớp convention chung của dự án + bổ sung
-- field còn thiếu, từ đây track đầy đủ qua apply_migration.
--
-- Đã apply trực tiếp qua Supabase MCP (migration
-- "course_builder_sections_lessons_baseline") — file này chỉ để track lại
-- trong repo theo đúng convention supabase-phaseN-*.sql, KHÔNG cần chạy lại.

-- 1) course_modules -> course_sections (khớp thuật ngữ "Section" trong Course
--    Builder, đúng tên bảng đề bài yêu cầu).
ALTER TABLE course_modules RENAME TO course_sections;
ALTER TABLE course_sections RENAME CONSTRAINT course_modules_course_id_fkey TO course_sections_course_id_fkey;

-- 2) course_sections: visible (boolean) -> status (text) — khớp convention
--    "status text default 'Draft'" dùng xuyên suốt dự án (projects,
--    best_practices...) thay vì boolean riêng lẻ. 0 dòng nên không cần migrate
--    giá trị cũ.
ALTER TABLE course_sections ADD COLUMN status text NOT NULL DEFAULT 'Draft';
ALTER TABLE course_sections DROP COLUMN visible;

-- 3) course_lessons.module_id -> section_id (khớp FK course_sections.id sau khi
--    đổi tên bảng ở bước 1).
ALTER TABLE course_lessons RENAME COLUMN module_id TO section_id;
ALTER TABLE course_lessons RENAME CONSTRAINT course_lessons_module_id_fkey TO course_lessons_section_id_fkey;

-- 4) course_lessons đã sẵn có cột `status` (text, default 'Draft') từ trước —
--    cột `visible` (boolean) bị dư, cùng ý nghĩa, xoá để tránh 2 nguồn sự thật
--    lệch nhau (đúng lý do đã bỏ ở course_sections).
ALTER TABLE course_lessons DROP COLUMN visible;

-- 5) Bổ sung 3 field Course Builder cần mà bảng cũ chưa có.
ALTER TABLE course_lessons ADD COLUMN content text;
ALTER TABLE course_lessons ADD COLUMN duration_minutes integer NOT NULL DEFAULT 0;
ALTER TABLE course_lessons ADD COLUMN is_free_preview boolean NOT NULL DEFAULT false;

-- 6) RLS: cả 2 bảng bật RLS nhưng trước đó 0 policy (không ai đọc được kể cả
--    anon Published). Thêm đúng 1 policy "public read published", cùng pattern
--    y hệt `projects`/`best_practices` đang dùng — không tự nghĩ pattern mới.
--    Ghi chú: gate theo purchase (owned/is_free_preview) là việc ở tầng
--    Portal Server Component (Bước 4), không phải RLS — đúng cách `courses`/
--    `case_studies` đang làm (đọc rộng ở DB, ẩn/hiện nội dung ở tầng UI).
CREATE POLICY "public read published" ON course_sections FOR SELECT USING (status = 'Published');
CREATE POLICY "public read published" ON course_lessons FOR SELECT USING (status = 'Published');
