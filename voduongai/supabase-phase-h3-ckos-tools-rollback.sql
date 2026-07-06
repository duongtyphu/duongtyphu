-- ============================================================================
-- PHASE H.3 — Tool Intelligence: Rollback SQL (idempotent, staged)
-- ============================================================================
-- Chạy theo đúng thứ tự — ngược lại thứ tự tạo (relationship trước, bảng
-- chính sau cùng). Mỗi bước dùng `if exists` — an toàn chạy lại nhiều lần.
--
-- LỰA CHỌN A — Rollback chỉ DỮ LIỆU (giữ schema, xoá dòng đã migrate):
-- Dùng khi muốn chạy lại migrate.sql từ đầu (vd sau khi sửa field mapping).
truncate table ckos_tool_related_tools;
truncate table ckos_tool_faqs;
truncate table ckos_tool_case_studies;
truncate table ckos_tool_best_practices;
truncate table ckos_tool_resources;
truncate table ckos_tool_missions;
truncate table ckos_tool_lessons;
truncate table ckos_tool_workflows;
truncate table ckos_tool_prompts;
delete from ckos_tools where legacy_tool_id is not null;
-- Không xoá category tự động (có thể được dùng bởi dữ liệu khác trong tương
-- lai) — nếu muốn dọn sạch category migrate cùng đợt:
-- delete from ckos_tool_categories where slug in (
--   select lower(regexp_replace(data->>'category', '[^a-zA-Z0-9]+', '-', 'g'))
--   from tools where status = 'Published'
-- );

-- LỰA CHỌN B — Rollback TOÀN BỘ SCHEMA (chỉ chạy nếu chắc chắn muốn gỡ hẳn
-- Tool Intelligence CKOS khỏi database — KHÔNG ảnh hưởng bảng `tools` gốc):
-- drop table if exists ckos_tool_related_tools;
-- drop table if exists ckos_tool_faqs;
-- drop table if exists ckos_tool_case_studies;
-- drop table if exists ckos_tool_best_practices;
-- drop table if exists ckos_tool_resources;
-- drop table if exists ckos_tool_missions;
-- drop table if exists ckos_tool_lessons;
-- drop table if exists ckos_tool_workflows;
-- drop table if exists ckos_tool_prompts;
-- drop table if exists ckos_tools;
-- (Không drop ckos_tool_categories ở đây — bảng này thuộc Phase G, dùng chung
-- cho nhiều mục đích khác ngoài Tool Intelligence riêng lẻ.)

-- Xác nhận sau rollback (chạy tay):
--   select count(*) from ckos_tools;  -- kỳ vọng 0 (Lựa chọn A) hoặc lỗi bảng không tồn tại (Lựa chọn B)
--   select count(*) from tools;       -- PHẢI không đổi so với trước khi migrate (bảng nguồn không bị động tới)
