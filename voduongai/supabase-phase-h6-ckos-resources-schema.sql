-- ============================================================================
-- PHASE H.6 — Resource Intelligence: Canonical Schema (SCHEMA ONLY, NOT APPLIED)
-- ============================================================================
-- Phân loại lại theo phát hiện Phase H.5: SOP/Checklist/Template/Ebook/
-- Resource (bảng jsonb Supabase, cùng shape phẳng `seedFor()`) là Resource
-- Intelligence, KHÔNG phải Workflow Intelligence.
--
-- 1 bảng `ckos_resources` DUY NHẤT cho cả 6 loại con (Resource/SOP/Checklist/
-- Guide/Template/Document), phân biệt bằng cột `resource_kind` — thay vì 6
-- bảng riêng, vì cả 6 loại có CÙNG hình dạng dữ liệu thật (đã xác nhận qua
-- live data: id/name/slug/category/description/tags/tier/featured/
-- requiresSignup) — tạo 6 bảng riêng sẽ là over-engineering không cần thiết.
-- ============================================================================

create table if not exists ckos_resources (
  id uuid primary key default gen_random_uuid(),
  -- CKOS Object Standard
  title text not null,
  slug text not null unique,
  description text,
  status text not null default 'Draft'
    check (status in ('Draft','Review','Approved','Published','Archived')),
  version int not null default 1,
  language text not null default 'vi',
  difficulty text,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  -- Resource-specific
  resource_kind text not null
    check (resource_kind in ('resource','sop','checklist','guide','template','document')),
  category text,
  pricing_model text,          -- map từ `tier` (Free/Premium)
  requires_signup boolean not null default false,
  featured boolean not null default false,
  file_url text,                -- nếu resource là file tải về
  external_url text,             -- nếu resource trỏ ra ngoài
  -- Truy vết nguồn
  legacy_resource_id text,       -- id gốc (vd "sop_1", "checklist_1")
  source_table text not null     -- 'sop' | 'checklists' | 'templates' | 'ebooks' | 'resources' | 'data_sop_static'
);

alter table ckos_resources enable row level security;
create policy "public can read published ckos resources" on ckos_resources
  for select using (status = 'Published');

create unique index if not exists ckos_resources_legacy_key
  on ckos_resources (legacy_resource_id, source_table)
  where legacy_resource_id is not null;
create index if not exists ckos_resources_kind_idx on ckos_resources (resource_kind);
create index if not exists ckos_resources_status_idx on ckos_resources (status);

comment on table ckos_resources is
  'Resource Intelligence canonical (Phase H.6) — hợp nhất Resource/SOP/'
  'Checklist/Guide/Template/Document dưới 1 schema, phân biệt bằng '
  'resource_kind, vì tất cả nguồn gốc (sop/checklists/templates/ebooks/'
  'resources jsonb) có cùng hình dạng dữ liệu phẳng.';

-- ============================================================================
-- Relationship: Resource ↔ Workflow (tái sử dụng ckos_workflow_resources,
-- Phase H.5) — không tạo bảng mới. Resource ↔ Tool (tái sử dụng
-- ckos_tool_resources, Phase H.3). Resource ↔ Prompt: KHÔNG có trong yêu cầu
-- H.6, bỏ qua.
-- ============================================================================
