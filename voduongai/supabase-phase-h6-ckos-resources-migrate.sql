-- ============================================================================
-- PHASE H.6 — Resource Intelligence: Data Migration (MIGRATE, NOT APPLIED)
-- ============================================================================
-- Idempotent, INSERT-only, dedup theo (legacy_resource_id, source_table).
-- Không đụng 5 bảng nguồn (sop/checklists/templates/ebooks/resources).
--
-- Field mapping (xác nhận qua dữ liệu live thật: sop_1, checklist_1 — cùng
-- hình dạng `seedFor()` cho cả 5 bảng):
--   data->>'name'          -> title
--   data->>'slug'          -> slug
--   data->>'description'   -> description
--   status (cột ngoài)     -> status
--   data->'tags'           -> tags
--   data->>'category'      -> category
--   data->>'tier'          -> pricing_model
--   (data->>'featured')::boolean       -> featured
--   (data->>'requiresSignup')::boolean -> requires_signup
--   id (cột ngoài)         -> legacy_resource_id
-- ============================================================================

-- SOP
insert into ckos_resources (
  title, slug, description, status, tags, metadata,
  resource_kind, category, pricing_model, requires_signup, featured,
  legacy_resource_id, source_table, published_at, created_at, updated_at
)
select
  s.data ->> 'name', s.data ->> 'slug', s.data ->> 'description', 'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(s.data -> 'tags') x), '{}'),
  '{}'::jsonb, 'sop', s.data ->> 'category', s.data ->> 'tier',
  coalesce((s.data ->> 'requiresSignup')::boolean, false),
  coalesce((s.data ->> 'featured')::boolean, false),
  s.id, 'sop', s.created_at, s.created_at, s.updated_at
from sop s
where s.status = 'Published' and s.data ->> 'name' is not null and s.data ->> 'slug' is not null
  and not exists (select 1 from ckos_resources r where r.legacy_resource_id = s.id and r.source_table = 'sop');

-- Checklists
insert into ckos_resources (
  title, slug, description, status, tags, metadata,
  resource_kind, category, pricing_model, requires_signup, featured,
  legacy_resource_id, source_table, published_at, created_at, updated_at
)
select
  c.data ->> 'name', c.data ->> 'slug', c.data ->> 'description', 'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(c.data -> 'tags') x), '{}'),
  '{}'::jsonb, 'checklist', c.data ->> 'category', c.data ->> 'tier',
  coalesce((c.data ->> 'requiresSignup')::boolean, false),
  coalesce((c.data ->> 'featured')::boolean, false),
  c.id, 'checklists', c.created_at, c.created_at, c.updated_at
from checklists c
where c.status = 'Published' and c.data ->> 'name' is not null and c.data ->> 'slug' is not null
  and not exists (select 1 from ckos_resources r where r.legacy_resource_id = c.id and r.source_table = 'checklists');

-- Templates
insert into ckos_resources (
  title, slug, description, status, tags, metadata,
  resource_kind, category, pricing_model, requires_signup, featured,
  legacy_resource_id, source_table, published_at, created_at, updated_at
)
select
  t.data ->> 'name', t.data ->> 'slug', t.data ->> 'description', 'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(t.data -> 'tags') x), '{}'),
  '{}'::jsonb, 'template', t.data ->> 'category', t.data ->> 'tier',
  coalesce((t.data ->> 'requiresSignup')::boolean, false),
  coalesce((t.data ->> 'featured')::boolean, false),
  t.id, 'templates', t.created_at, t.created_at, t.updated_at
from templates t
where t.status = 'Published' and t.data ->> 'name' is not null and t.data ->> 'slug' is not null
  and not exists (select 1 from ckos_resources r where r.legacy_resource_id = t.id and r.source_table = 'templates');

-- Ebooks (resource_kind = 'document', ebook = tài liệu tải về)
insert into ckos_resources (
  title, slug, description, status, tags, metadata,
  resource_kind, category, pricing_model, requires_signup, featured,
  legacy_resource_id, source_table, published_at, created_at, updated_at
)
select
  e.data ->> 'name', e.data ->> 'slug', e.data ->> 'description', 'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(e.data -> 'tags') x), '{}'),
  '{}'::jsonb, 'document', e.data ->> 'category', e.data ->> 'tier',
  coalesce((e.data ->> 'requiresSignup')::boolean, false),
  coalesce((e.data ->> 'featured')::boolean, false),
  e.id, 'ebooks', e.created_at, e.created_at, e.updated_at
from ebooks e
where e.status = 'Published' and e.data ->> 'name' is not null and e.data ->> 'slug' is not null
  and not exists (select 1 from ckos_resources r where r.legacy_resource_id = e.id and r.source_table = 'ebooks');

-- Resources (generic, resource_kind = 'resource')
insert into ckos_resources (
  title, slug, description, status, tags, metadata,
  resource_kind, category, pricing_model, requires_signup, featured,
  legacy_resource_id, source_table, published_at, created_at, updated_at
)
select
  res.data ->> 'name', res.data ->> 'slug', res.data ->> 'description', 'Published',
  coalesce((select array_agg(x) from jsonb_array_elements_text(res.data -> 'tags') x), '{}'),
  '{}'::jsonb, 'resource', res.data ->> 'category', res.data ->> 'tier',
  coalesce((res.data ->> 'requiresSignup')::boolean, false),
  coalesce((res.data ->> 'featured')::boolean, false),
  res.id, 'resources', res.created_at, res.created_at, res.updated_at
from resources res
where res.status = 'Published' and res.data ->> 'name' is not null and res.data ->> 'slug' is not null
  and not exists (select 1 from ckos_resources r where r.legacy_resource_id = res.id and r.source_table = 'resources');

-- Kiểm tra nhanh:
--   select resource_kind, source_table, title, slug, status from ckos_resources order by created_at desc;
