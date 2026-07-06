-- ============================================================================
-- PHASE H.5 — Workflow Intelligence: Canonical Schema (SCHEMA ONLY, NOT APPLIED)
-- ============================================================================
-- Áp dụng SAU supabase-phase-g-ckos-core-tables.sql (`ckos_workflows`,
-- `ckos_workflow_steps` đã tạo ở đó — file này chỉ MỞ RỘNG thêm cột + bảng
-- quan hệ mới cho Workflow Intelligence).
--
-- ⚠️ PHÁT HIỆN QUAN TRỌNG (xem Integrity Report đầy đủ trong báo cáo đi kèm):
-- Bảng Supabase `sop`/`checklists` (jsonb, có Producer thật qua Admin CRUD)
-- KHÔNG có cấu trúc "nhiều bước" (`data` chỉ là 1 tài liệu phẳng: name/slug/
-- category/description/tags — không có field `steps`). Do đó KHÔNG dùng
-- `sop`/`checklists` làm nguồn migrate chính cho `ckos_workflow_steps` (sẽ
-- tạo ra "workflow 1 bước" vô nghĩa). Canonical Source thật cho Workflow
-- Intelligence (có cấu trúc bước thật) là 2 nguồn STATIC: `knowledgeSeedJourneys`
-- (11 journey, mỗi journey 6-8 bước) và `AI_WORKFLOWS` (4 workflow, mỗi
-- workflow có danh sách bước dạng chuỗi) — cả 2 cần seeding script riêng
-- (không phải SQL thuần, xem mục Seeding Plan trong báo cáo).
-- ============================================================================

alter table ckos_workflows add column if not exists legacy_source_id text;  -- id gốc nếu có (vd "journey-01", "workflow-01")
alter table ckos_workflows add column if not exists source_system text;    -- 'knowledge_seed_journeys' | 'ai_workflows' | 'sop_table' | 'manual'
alter table ckos_workflows add column if not exists category text;

create unique index if not exists ckos_workflows_legacy_source_key
  on ckos_workflows (legacy_source_id, source_system)
  where legacy_source_id is not null;
create index if not exists ckos_workflows_source_idx on ckos_workflows (source_system);

comment on column ckos_workflows.source_system is
  'Truy vết nguồn gốc — Workflow Intelligence có nhiều nguồn (static + jsonb '
  'DB) không đồng nhất cấu trúc bước, cột này giúp phân biệt khi hợp nhất.';

-- ============================================================================
-- Relationship tables — Workflow → {Tool, Prompt, Lesson, Mission, Resource,
-- Best Practice, Case Study}
-- ============================================================================
-- Workflow → Tool: TÁI SỬ DỤNG `ckos_tool_workflows` (Phase H.3).
-- Workflow → Prompt: TÁI SỬ DỤNG `ckos_workflow_prompts` (Phase G).

-- Workflow → Lesson (soft reference, `lessons.id` bigint, ngoài CKOS Runtime)
create table if not exists ckos_workflow_lessons (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  lesson_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (workflow_id, lesson_id)
);
alter table ckos_workflow_lessons enable row level security;
create policy "public can read workflow-lesson links" on ckos_workflow_lessons
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );

-- Workflow → Mission (soft reference, Mission static TypeScript)
create table if not exists ckos_workflow_missions (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  mission_id text not null,
  created_at timestamptz not null default now(),
  primary key (workflow_id, mission_id)
);
alter table ckos_workflow_missions enable row level security;
create policy "public can read workflow-mission links" on ckos_workflow_missions
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );

-- Workflow → Resource (soft reference — Resource canonical CHƯA rõ ràng theo
-- Phase H.2 mục 2.4, nghi vấn content-duplication `admin/resources.ts` vs
-- `data/resources.ts`/`data/sop.ts`)
create table if not exists ckos_workflow_resources (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  resource_id text not null,
  created_at timestamptz not null default now(),
  primary key (workflow_id, resource_id)
);
alter table ckos_workflow_resources enable row level security;
create policy "public can read workflow-resource links" on ckos_workflow_resources
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );

-- Workflow → Best Practice (FK cứng, cả 2 bên là bảng CKOS uuid, Phase G)
create table if not exists ckos_workflow_best_practices (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (workflow_id, best_practice_id)
);
alter table ckos_workflow_best_practices enable row level security;
create policy "public can read workflow-best-practice links" on ckos_workflow_best_practices
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );

-- Workflow → Case Study (soft reference, `case_studies.id` bigint)
create table if not exists ckos_workflow_case_studies (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  case_study_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (workflow_id, case_study_id)
);
alter table ckos_workflow_case_studies enable row level security;
create policy "public can read workflow-case-study links" on ckos_workflow_case_studies
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );
