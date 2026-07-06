-- ============================================================================
-- PHASE H.8 — Lesson Intelligence: Verify SQL (read-only)
-- ============================================================================

-- 1. Cột CKOS Object Standard đã thêm vào `lessons` chưa, và có bao nhiêu
--    lesson đang active/published.
select count(*) as total, count(*) filter (where active) as active_count,
  count(*) filter (where status = 'Published') as published_count,
  count(*) filter (where slug is null) as missing_slug
from lessons;
-- Kỳ vọng: missing_slug = 0 (đã backfill ở -schema.sql).

-- 2. Duplicate check — trùng slug.
select slug, count(*) from lessons group by slug having count(*) > 1;
-- Kỳ vọng: 0 dòng.

-- 3. Orphan check — quan hệ trỏ tới lesson_id không tồn tại trong `lessons`.
select 'ckos_tool_lessons' as rel, lesson_id::text from ckos_tool_lessons tl
where not exists (select 1 from lessons l where l.id = tl.lesson_id)
union all
select 'ckos_prompt_lessons', lesson_id::text from ckos_prompt_lessons pl
where not exists (select 1 from lessons l where l.id = pl.lesson_id)
union all
select 'ckos_workflow_lessons', lesson_id::text from ckos_workflow_lessons wl
where not exists (select 1 from lessons l where l.id = wl.lesson_id)
union all
select 'ckos_resource_lessons', lesson_id::text from ckos_resource_lessons rl
where not exists (select 1 from lessons l where l.id = rl.lesson_id)
union all
select 'ckos_best_practice_lessons', lesson_id::text from ckos_best_practice_lessons bl
where not exists (select 1 from lessons l where l.id = bl.lesson_id)
union all
select 'ckos_case_study_lessons', lesson_id::text from ckos_case_study_lessons cl
where not exists (select 1 from lessons l where l.id = cl.lesson_id)
union all
select 'ckos_lesson_faqs', lesson_id::text from ckos_lesson_faqs lf
where not exists (select 1 from lessons l where l.id = lf.lesson_id)
union all
select 'ckos_lesson_journeys', lesson_id::text from ckos_lesson_journeys lj
where not exists (select 1 from lessons l where l.id = lj.lesson_id)
union all
select 'ckos_lesson_competencies', lesson_id::text from ckos_lesson_competencies lc
where not exists (select 1 from lessons l where l.id = lc.lesson_id);
-- Kỳ vọng: 0 dòng (chưa có dữ liệu quan hệ nào — các bảng đều schema-only,
-- rỗng ở Phase H.8, xem migrate.sql).

-- 4. Missing metadata — lesson thiếu description hoặc video_url/pdf_url.
select id, title, slug,
  (description is null or description = '') as missing_description,
  (video_url is null and pdf_url is null) as missing_content_url
from lessons
where description is null or description = '' or (video_url is null and pdf_url is null);

-- 5. Missing relationship — TẤT CẢ lesson hiện chưa có bất kỳ quan hệ nào
--    (dự kiến ở H.8, vì chưa có nguồn dữ liệu quan hệ thật — xem migrate.sql).
select l.id, l.title, 'no relationship yet' as note
from lessons l
where not exists (select 1 from ckos_tool_lessons where lesson_id = l.id)
  and not exists (select 1 from ckos_prompt_lessons where lesson_id = l.id)
  and not exists (select 1 from ckos_workflow_lessons where lesson_id = l.id)
  and not exists (select 1 from ckos_resource_lessons where lesson_id = l.id)
  and not exists (select 1 from ckos_best_practice_lessons where lesson_id = l.id)
  and not exists (select 1 from ckos_case_study_lessons where lesson_id = l.id)
  and not exists (select 1 from ckos_lesson_faqs where lesson_id = l.id)
  and not exists (select 1 from ckos_lesson_journeys where lesson_id = l.id)
  and not exists (select 1 from ckos_lesson_competencies where lesson_id = l.id);
