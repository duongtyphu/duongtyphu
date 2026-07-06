-- ============================================================================
-- PHASE H.7 — Best Practice & Case Study Intelligence: Canonical Schema
-- (SCHEMA ONLY, NOT APPLIED)
-- ============================================================================
-- Áp dụng SAU supabase-phase-g-ckos-core-tables.sql (`ckos_best_practices`)
-- và supabase-phase-g-case-studies-ckos-standard-columns.sql (`case_studies`
-- đã có cột status/version/language/difficulty/tags/metadata/updated_at từ
-- Phase G, published_at/slug/body/featured từ Phase F).
-- ============================================================================

-- Mở rộng ckos_best_practices với truy vết nguồn (giống pattern H.3-H.6).
alter table ckos_best_practices add column if not exists legacy_source_id text;
alter table ckos_best_practices add column if not exists source_system text; -- 'knowledge_seed_guide' | 'companion_constitution' (chưa dùng, xem ADR-006) | 'community_rules' (chưa dùng)

create unique index if not exists ckos_best_practices_legacy_key
  on ckos_best_practices (legacy_source_id, source_system)
  where legacy_source_id is not null;
create index if not exists ckos_best_practices_source_idx on ckos_best_practices (source_system);

-- case_studies (Phase F/G) chỉ cần thêm cột truy vết nguồn tương tự.
alter table case_studies add column if not exists legacy_source_id text;
alter table case_studies add column if not exists source_system text; -- 'knowledge_seed_case_study' | 'student_success' | 'case_study_legacy_jsonb'

create unique index if not exists case_studies_legacy_key
  on case_studies (legacy_source_id, source_system)
  where legacy_source_id is not null;

comment on column ckos_best_practices.source_system is
  'Truy vết nguồn — Best Practice hợp nhất từ nhiều nơi (Knowledge Asset '
  'GUIDE, và tương lai có thể tham chiếu Companion Constitution/Community '
  'Rules mà KHÔNG sao chép nội dung — xem ADR-006).';
comment on column case_studies.source_system is
  'Truy vết nguồn — Case Study hợp nhất từ knowledge_seed_case_study, '
  'student_success, và case_study (bảng jsonb legacy, đã có sync script '
  'riêng từ Phase E).';

-- ============================================================================
-- Relationship tables — 9 loại theo yêu cầu H.7
-- ============================================================================

-- Best Practice → Tool (mới — chưa có bảng nào từ Phase trước phủ chiều này)
create table if not exists ckos_best_practice_tools (
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (best_practice_id, tool_id)
);
alter table ckos_best_practice_tools enable row level security;
create policy "public can read best-practice-tool links" on ckos_best_practice_tools
  for select using (
    exists (select 1 from ckos_best_practices b where b.id = best_practice_id and b.status = 'Published')
  );

-- Best Practice → Prompt: TÁI SỬ DỤNG `ckos_prompt_best_practices` (Phase H.4).
-- Best Practice → Workflow: TÁI SỬ DỤNG `ckos_workflow_best_practices` (Phase H.5).
-- Best Practice → Resource (mới, soft reference — Resource canonical mới có ở Phase H.6)
create table if not exists ckos_best_practice_resources (
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  resource_id uuid not null references ckos_resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (best_practice_id, resource_id)
);
alter table ckos_best_practice_resources enable row level security;
create policy "public can read best-practice-resource links" on ckos_best_practice_resources
  for select using (
    exists (select 1 from ckos_best_practices b where b.id = best_practice_id and b.status = 'Published')
  );

-- Case Study → Tool (mới)
create table if not exists ckos_case_study_tools (
  case_study_id bigint not null references case_studies(id) on delete cascade,
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (case_study_id, tool_id)
);
alter table ckos_case_study_tools enable row level security;
create policy "public can read case-study-tool links" on ckos_case_study_tools
  for select using (
    exists (select 1 from case_studies c where c.id = case_study_id and c.active = true)
  );

-- Case Study → Prompt: TÁI SỬ DỤNG `ckos_prompt_case_studies` (Phase H.4).
-- Case Study → Workflow: TÁI SỬ DỤNG `ckos_workflow_case_studies` (Phase H.5).
-- Case Study → Resource (mới)
create table if not exists ckos_case_study_resources (
  case_study_id bigint not null references case_studies(id) on delete cascade,
  resource_id uuid not null references ckos_resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (case_study_id, resource_id)
);
alter table ckos_case_study_resources enable row level security;
create policy "public can read case-study-resource links" on ckos_case_study_resources
  for select using (
    exists (select 1 from case_studies c where c.id = case_study_id and c.active = true)
  );

-- Case Study → Best Practice (mới — quan hệ đặc trưng của H.7: 1 case study
-- có thể minh hoạ cho 1+ best practice)
create table if not exists ckos_case_study_best_practices (
  case_study_id bigint not null references case_studies(id) on delete cascade,
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (case_study_id, best_practice_id)
);
alter table ckos_case_study_best_practices enable row level security;
create policy "public can read case-study-best-practice links" on ckos_case_study_best_practices
  for select using (
    exists (select 1 from case_studies c where c.id = case_study_id and c.active = true)
  );
