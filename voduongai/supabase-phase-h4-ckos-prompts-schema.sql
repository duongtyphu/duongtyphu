-- ============================================================================
-- PHASE H.4 — Prompt Intelligence: Canonical Schema (SCHEMA ONLY, NOT APPLIED)
-- ============================================================================
-- Áp dụng SAU supabase-phase-g-ckos-core-tables.sql (vì `ckos_prompt_templates`
-- được tạo ở đó — file này chỉ MỞ RỘNG thêm cột, không tạo lại bảng, cộng với
-- các bảng quan hệ mới cho Prompt Intelligence).
--
-- QUYẾT ĐỊNH CANONICAL (ADR-003, xem báo cáo đi kèm): giống pattern Tool
-- Intelligence (Phase H.3) — `prompts` (jsonb, Supabase, Admin Producer thật
-- qua /admin/prompts, hiển thị qua AdminPromptsSection trên /portal/prompts)
-- là nguồn Admin ghi HIỆN TẠI, KHÔNG thay thế. `ckos_prompt_templates` (Phase
-- G, mở rộng ở đây) là lớp chuẩn hoá CKOS Runtime, nhận dữ liệu qua đồng bộ
-- 1 chiều. Đây là quyết định GIẢI QUYẾT điểm "Product Owner approval point"
-- còn treo từ Phase H.2 ADR-001 — xem rationale đầy đủ trong ADR-003.
-- ============================================================================

-- Mở rộng ckos_prompt_templates với field khớp đúng dữ liệu thật quan sát
-- được trong `prompts.data` (category, tier, featured, copyCount) + trường
-- theo dõi nguồn gốc (vì Prompt có tới 4 nguồn tĩnh khác nhau cần hợp nhất).
alter table ckos_prompt_templates add column if not exists category text;
alter table ckos_prompt_templates add column if not exists pricing_model text; -- map từ `tier`
alter table ckos_prompt_templates add column if not exists featured boolean not null default false;
alter table ckos_prompt_templates add column if not exists copy_count int not null default 0;
alter table ckos_prompt_templates add column if not exists legacy_prompt_id text; -- id gốc bảng `prompts` (vd "prompt_1")
alter table ckos_prompt_templates add column if not exists source_system text;   -- 'admin_prompts' | 'data_prompts' | 'khong_gian_ai' | 'knowledge_seed'

create unique index if not exists ckos_prompt_templates_legacy_id_key
  on ckos_prompt_templates (legacy_prompt_id)
  where legacy_prompt_id is not null;
create index if not exists ckos_prompt_templates_source_idx on ckos_prompt_templates (source_system);

comment on column ckos_prompt_templates.source_system is
  'Truy vết nguồn gốc — Prompt Intelligence có 4 nguồn tĩnh song song (xem '
  'Phase H.1/H.2), cột này giúp phân biệt khi hợp nhất và tránh double-count.';

-- ============================================================================
-- Relationship tables — Prompt → {Tool, Workflow, Lesson, Mission, Case Study,
-- Best Practice}
-- ============================================================================
-- Prompt → Tool: TÁI SỬ DỤNG bảng `ckos_tool_prompts` đã tạo ở Phase H.3
-- (tool_id, prompt_id) — không tạo bảng mới trùng lặp, chỉ là quan hệ n-n
-- nhìn từ 2 hướng của cùng 1 bảng vật lý.

-- Prompt → Workflow: TÁI SỬ DỤNG bảng `ckos_workflow_prompts` đã tạo ở Phase G
-- (supabase-phase-g-ckos-relationships.sql: workflow_id, prompt_id) — không
-- tạo bảng mới.

-- Prompt → Lesson (soft reference, `lessons.id` là bigint, ngoài CKOS Runtime)
create table if not exists ckos_prompt_lessons (
  prompt_id uuid not null references ckos_prompt_templates(id) on delete cascade,
  lesson_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (prompt_id, lesson_id)
);
alter table ckos_prompt_lessons enable row level security;
create policy "public can read prompt-lesson links" on ckos_prompt_lessons
  for select using (
    exists (select 1 from ckos_prompt_templates p where p.id = prompt_id and p.status = 'Published')
  );

-- Prompt → Mission (soft reference, Mission là static TypeScript, ngoài DB)
create table if not exists ckos_prompt_missions (
  prompt_id uuid not null references ckos_prompt_templates(id) on delete cascade,
  mission_id text not null,
  created_at timestamptz not null default now(),
  primary key (prompt_id, mission_id)
);
alter table ckos_prompt_missions enable row level security;
create policy "public can read prompt-mission links" on ckos_prompt_missions
  for select using (
    exists (select 1 from ckos_prompt_templates p where p.id = prompt_id and p.status = 'Published')
  );

-- Prompt → Case Study (soft reference, `case_studies.id` là bigint)
create table if not exists ckos_prompt_case_studies (
  prompt_id uuid not null references ckos_prompt_templates(id) on delete cascade,
  case_study_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (prompt_id, case_study_id)
);
alter table ckos_prompt_case_studies enable row level security;
create policy "public can read prompt-case-study links" on ckos_prompt_case_studies
  for select using (
    exists (select 1 from ckos_prompt_templates p where p.id = prompt_id and p.status = 'Published')
  );

-- Prompt → Best Practice (FK cứng — cả 2 bên đều là bảng CKOS uuid, Phase G)
create table if not exists ckos_prompt_best_practices (
  prompt_id uuid not null references ckos_prompt_templates(id) on delete cascade,
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (prompt_id, best_practice_id)
);
alter table ckos_prompt_best_practices enable row level security;
create policy "public can read prompt-best-practice links" on ckos_prompt_best_practices
  for select using (
    exists (select 1 from ckos_prompt_templates p where p.id = prompt_id and p.status = 'Published')
  );
