-- ============================================================================
-- PHASE H.4 — Prompt Intelligence: Data Migration (MIGRATE, NOT APPLIED)
-- ============================================================================
-- Chạy SAU supabase-phase-h4-ckos-prompts-schema.sql. Idempotent: dedup theo
-- `legacy_prompt_id` (unique index đã tạo ở schema.sql). CHỈ INSERT, không
-- UPDATE/DELETE bảng `prompts` (nguồn) — cùng pattern an toàn Phase E/H.3.
--
-- ⚠️ QUAN TRỌNG — phạm vi file này CHỈ migrate 1/4 nguồn Prompt:
-- Chỉ bảng `prompts` (jsonb, Supabase) là nguồn CÓ THỂ query bằng SQL trực
-- tiếp. 3 nguồn còn lại (`src/data/prompts.ts` 12 item, `src/data/khong-gian-ai
-- /index.ts:AI_PROMPTS` 30 item, `src/features/knowledge/data/knowledge-seed-
-- data.ts:prompts` 10 item) là TypeScript static array, KHÔNG nằm trong
-- database — không thể viết SQL "SELECT FROM" chúng. Việc "migrate" 3 nguồn
-- này đòi hỏi 1 script Node/TS đọc trực tiếp file nguồn rồi INSERT qua
-- Supabase client, KHÔNG PHẢI thuần SQL — xem "Static Source Seeding Plan"
-- trong báo cáo đi kèm (phase-h4-prompt-intelligence-migration.md mục 5.2).
-- Không tự bịa nội dung 52 prompt đó thành INSERT VALUES ở đây vì sẽ là dữ
-- liệu giả mạo không khớp nguồn thật.
--
-- Field mapping (prompts.data jsonb -> ckos_prompt_templates), xác nhận qua
-- dữ liệu live thật (2 dòng: prompt_1, prompt_2):
--   data->>'title'        -> title
--   data->>'slug'         -> slug
--   data->>'description'  -> description
--   data->>'content'      -> template
--   data->>'exampleOutput'-> expected_output
--   data->'tags'          -> tags
--   data->>'level'        -> difficulty
--   data->>'category'     -> category
--   data->>'tier'         -> pricing_model
--   (data->>'featured')::boolean -> featured
--   (data->>'copyCount')::int    -> copy_count
--   id (cột ngoài, vd "prompt_1")-> legacy_prompt_id
--   status (cột ngoài)    -> status
--   'admin_prompts'       -> source_system (literal, đánh dấu nguồn)
-- ============================================================================

insert into ckos_prompt_templates (
  title, slug, description, status, tags, metadata,
  template, expected_output, difficulty, category, pricing_model,
  featured, copy_count, legacy_prompt_id, source_system,
  published_at, created_at, updated_at
)
select
  p.data ->> 'title',
  p.data ->> 'slug',
  p.data ->> 'description',
  'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(p.data -> 'tags') x), '{}'),
  '{}'::jsonb,
  p.data ->> 'content',
  p.data ->> 'exampleOutput',
  p.data ->> 'level',
  p.data ->> 'category',
  p.data ->> 'tier',
  coalesce((p.data ->> 'featured')::boolean, false),
  coalesce((p.data ->> 'copyCount')::int, 0),
  p.id,
  'admin_prompts',
  p.created_at,
  p.created_at,
  p.updated_at
from prompts p
where p.status = 'Published'
  and p.data ->> 'title' is not null
  and p.data ->> 'slug' is not null
  and not exists (
    select 1 from ckos_prompt_templates existing where existing.legacy_prompt_id = p.id
  );

-- Kiểm tra nhanh sau khi chạy (chạy tay):
--   select legacy_prompt_id, title, slug, category, source_system, status from ckos_prompt_templates order by created_at desc;
