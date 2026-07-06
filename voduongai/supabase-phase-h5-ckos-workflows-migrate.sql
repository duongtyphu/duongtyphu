-- ============================================================================
-- PHASE H.5 — Workflow Intelligence: Data Migration (MIGRATE, NOT APPLIED)
-- ============================================================================
-- ⚠️ KHÁC VỚI TOOL/PROMPT: không có 1 bảng Supabase nào chứa cấu trúc
-- "workflow nhiều bước" thật. `sop` (jsonb, Producer thật qua /admin/sop) chỉ
-- là tài liệu phẳng (name/category/description), KHÔNG có field `steps`.
-- File này migrate `sop` như "workflow 1 bước duy nhất" (step_order=1,
-- instruction = description) — ĐÂY LÀ GIẢI PHÁP TẠM, không phản ánh đúng bản
-- chất "quy trình nhiều bước" của Workflow Intelligence thật. Đề xuất CHÍNH
-- trong báo cáo đi kèm là seed từ `knowledgeSeedJourneys`/`AI_WORKFLOWS`
-- (static, có cấu trúc bước thật) qua script riêng (mục Seeding Plan) —
-- KHÔNG viết SQL literal cho 15 workflow đó ở đây vì không có toàn văn các
-- bước trong ngữ cảnh phiên này (tránh bịa dữ liệu).
--
-- Idempotent: dedup theo (legacy_source_id, source_system). CHỈ INSERT,
-- không đụng bảng `sop` nguồn.
-- ============================================================================

insert into ckos_workflows (
  title, slug, description, status, tags, metadata,
  category, legacy_source_id, source_system,
  published_at, created_at, updated_at
)
select
  s.data ->> 'name',
  s.data ->> 'slug',
  s.data ->> 'description',
  'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(s.data -> 'tags') x), '{}'),
  '{}'::jsonb,
  s.data ->> 'category',
  s.id,
  'sop_table',
  s.created_at,
  s.created_at,
  s.updated_at
from sop s
where s.status = 'Published'
  and s.data ->> 'name' is not null
  and s.data ->> 'slug' is not null
  and not exists (
    select 1 from ckos_workflows existing
    where existing.legacy_source_id = s.id and existing.source_system = 'sop_table'
  );

-- Tạo đúng 1 bước placeholder cho mỗi workflow vừa migrate từ `sop` (vì
-- nguồn không có cấu trúc bước thật — xem cảnh báo ở đầu file).
insert into ckos_workflow_steps (workflow_id, step_order, title, instruction, status)
select
  w.id,
  1,
  'Xem chi tiết SOP',
  w.description,
  'Published'
from ckos_workflows w
where w.source_system = 'sop_table'
  and not exists (
    select 1 from ckos_workflow_steps st where st.workflow_id = w.id
  );

-- Kiểm tra nhanh sau khi chạy:
--   select w.legacy_source_id, w.title, count(st.id) as step_count
--   from ckos_workflows w left join ckos_workflow_steps st on st.workflow_id = w.id
--   where w.source_system = 'sop_table' group by w.id, w.legacy_source_id, w.title;
