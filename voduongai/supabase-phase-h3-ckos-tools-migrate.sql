-- ============================================================================
-- PHASE H.3 — Tool Intelligence: Data Migration (MIGRATE, NOT APPLIED)
-- ============================================================================
-- Chạy SAU supabase-phase-h3-ckos-tools-schema.sql. Idempotent: dedup theo
-- `legacy_tool_id` (unique index đã tạo ở schema.sql) — chạy lại nhiều lần
-- không tạo trùng. CHỈ INSERT, không UPDATE/DELETE bảng `tools` (nguồn), theo
-- đúng pattern an toàn đã dùng ở Phase E (case_study → case_studies).
--
-- Field mapping (tools.data jsonb -> ckos_tools typed), xác nhận qua dữ liệu
-- live thật (Phase G/H smoke test, ChatGPT/tool_1):
--   data->>'name'              -> title
--   data->>'slug'              -> slug
--   data->>'shortDescription'  -> description, short_description
--   data->>'longDescription'   -> long_description
--   status (cột ngoài, không phải data->>'status') -> status
--   data->>'category'          -> tags (thêm 1 phần tử), + dùng để join category_id
--   data->>'tier' / 'pricing'  -> pricing_model (ưu tiên 'tier', fallback 'pricing')
--   data->>'link' / 'ctaLink'  -> website_url / cta_url
--   data->>'ctaText'           -> cta_text
--   data->'pros'  (jsonb array) -> strengths
--   data->'cons'  (jsonb array) -> limitations
--   data->>'useCase'           -> use_case
--   data->>'audience'          -> audience
--   data->>'workflow'          -> workflow_note
--   (data->>'rating')::numeric -> rating
--   (data->>'featured')::boolean -> featured
--   data->>'badge'             -> badge
--   id (cột ngoài, vd "tool_1") -> legacy_tool_id
--   created_at, updated_at     -> giữ nguyên timestamp gốc
--
-- KHÔNG migrate `relatedPromptId`/`relatedResourceHref` vào bảng quan hệ
-- (ckos_tool_prompts/ckos_tool_resources) ở bước này — Prompt Intelligence
-- canonical CHƯA được Product Owner chốt (Phase H.2 ADR-001), và Resource
-- canonical cũng đang chờ xác nhận content-duplication. Migrate quan hệ vào
-- bảng sai đích còn tệ hơn không migrate — để trống, làm sau khi có quyết định.
-- ============================================================================

-- Bước 1: migrate category trước (nếu ckos_tool_categories rỗng, tạo tối
-- thiểu 1 category "Chưa phân loại" để category_id không NULL tràn lan —
-- KHÔNG ép buộc, chỉ tạo nếu chưa có category nào khớp tên).
insert into ckos_tool_categories (title, slug, status, published_at)
select distinct
  t.data ->> 'category',
  lower(regexp_replace(t.data ->> 'category', '[^a-zA-Z0-9]+', '-', 'g')),
  'Published',
  now()
from tools t
where t.status = 'Published'
  and t.data ->> 'category' is not null
  and not exists (
    select 1 from ckos_tool_categories c
    where c.title = t.data ->> 'category'
  );

-- Bước 2: migrate tool chính
insert into ckos_tools (
  title, slug, description, status, tags, metadata,
  category_id, website_url, cta_url, cta_text, pricing_model,
  strengths, limitations, legacy_tool_id, short_description, long_description,
  use_case, audience, workflow_note, rating, featured, badge,
  published_at, created_at, updated_at
)
select
  t.data ->> 'name',
  t.data ->> 'slug',
  t.data ->> 'shortDescription',
  'Published',
  case when t.data ->> 'category' is not null then array[t.data ->> 'category'] else '{}' end,
  '{}'::jsonb,
  (select c.id from ckos_tool_categories c where c.title = t.data ->> 'category' limit 1),
  coalesce(t.data ->> 'link', t.data ->> 'ctaLink'),
  t.data ->> 'ctaLink',
  t.data ->> 'ctaText',
  coalesce(t.data ->> 'tier', t.data ->> 'pricing'),
  coalesce((select array_agg(x) from jsonb_array_elements_text(t.data -> 'pros') x), '{}'),
  coalesce((select array_agg(x) from jsonb_array_elements_text(t.data -> 'cons') x), '{}'),
  t.id,
  t.data ->> 'shortDescription',
  t.data ->> 'longDescription',
  t.data ->> 'useCase',
  t.data ->> 'audience',
  t.data ->> 'workflow',
  nullif(t.data ->> 'rating', '')::numeric,
  coalesce((t.data ->> 'featured')::boolean, false),
  t.data ->> 'badge',
  t.created_at,
  t.created_at,
  t.updated_at
from tools t
where t.status = 'Published'
  and t.data ->> 'name' is not null
  and t.data ->> 'slug' is not null
  and not exists (
    select 1 from ckos_tools existing where existing.legacy_tool_id = t.id
  );

-- Kiểm tra nhanh sau khi chạy (chạy tay, không phải phần của migration):
--   select legacy_tool_id, title, slug, category_id, status from ckos_tools order by created_at desc;
