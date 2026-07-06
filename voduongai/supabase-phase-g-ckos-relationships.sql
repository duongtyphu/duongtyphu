-- ============================================================================
-- PHASE G.1 — CKOS Runtime Foundation: Relationship Tables (tối thiểu)
-- ============================================================================
-- Áp dụng SAU supabase-phase-g-ckos-core-tables.sql (tham chiếu các bảng đó).
--
-- Lưu ý về kiểu khoá chính không đồng nhất giữa các bảng CKOS mới (uuid) và
-- các bảng production tái sử dụng (`tools`, `case_studies` — id kiểu text/
-- bigint tuỳ bảng): các bảng quan hệ bên dưới lưu ID dạng phù hợp với từng
-- bên, KHÔNG ép toàn bộ về 1 kiểu — chấp nhận việc `ckos_object_relationships`
-- (bảng generic, polymorphic) không có FK constraint thật (chỉ lưu text) vì
-- phải liên kết được cả object uuid (ckos_*) lẫn object text/bigint (tools,
-- case_studies, prompt_templates production) — đánh đổi này được ghi nhận rõ
-- ràng, không che giấu.
-- ============================================================================

-- ===== ckos_goal_strategies (n-n: goals <-> strategies) =====
create table if not exists ckos_goal_strategies (
  goal_id uuid not null references ckos_goals(id) on delete cascade,
  strategy_id uuid not null references ckos_strategies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (goal_id, strategy_id)
);
alter table ckos_goal_strategies enable row level security;
create policy "public can read goal-strategy links" on ckos_goal_strategies
  for select using (
    exists (select 1 from ckos_goals g where g.id = goal_id and g.status = 'Published')
    and exists (select 1 from ckos_strategies s where s.id = strategy_id and s.status = 'Published')
  );

-- ===== ckos_strategy_workflows (n-n: strategies <-> workflows) =====
create table if not exists ckos_strategy_workflows (
  strategy_id uuid not null references ckos_strategies(id) on delete cascade,
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (strategy_id, workflow_id)
);
alter table ckos_strategy_workflows enable row level security;
create policy "public can read strategy-workflow links" on ckos_strategy_workflows
  for select using (
    exists (select 1 from ckos_strategies s where s.id = strategy_id and s.status = 'Published')
    and exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );

-- ===== ckos_workflow_tools (n-n: workflows <-> tools) =====
-- tool_id kiểu text để khớp `tools.id` (bảng jsonb production, PK text).
-- Không đặt FK thật tới `tools` vì đó là bảng ngoài phạm vi CKOS core schema
-- (tái sử dụng nguyên trạng) — tra cứu ở tầng ứng dụng, không ở tầng DB.
create table if not exists ckos_workflow_tools (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  tool_id text not null,
  created_at timestamptz not null default now(),
  primary key (workflow_id, tool_id)
);
alter table ckos_workflow_tools enable row level security;
create policy "public can read workflow-tool links" on ckos_workflow_tools
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
  );

-- ===== ckos_workflow_prompts (n-n: workflows <-> ckos_prompt_templates) =====
create table if not exists ckos_workflow_prompts (
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  prompt_id uuid not null references ckos_prompt_templates(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (workflow_id, prompt_id)
);
alter table ckos_workflow_prompts enable row level security;
create policy "public can read workflow-prompt links" on ckos_workflow_prompts
  for select using (
    exists (select 1 from ckos_workflows w where w.id = workflow_id and w.status = 'Published')
    and exists (select 1 from ckos_prompt_templates p where p.id = prompt_id and p.status = 'Published')
  );

-- ===== ckos_mission_links (liên kết CKOS object <-> Mission Catalog hiện có) =====
-- `mission_id` lưu dạng text vì Mission Catalog hiện tại (src/lib/portal/
-- foundation/mission-catalog.ts) là static TypeScript data, chưa có bảng
-- Supabase riêng (ngoài phạm vi Phase G — không migrate static data hàng
-- loạt) — cột này chỉ chuẩn bị chỗ chứa slug/id mission tĩnh hiện có.
create table if not exists ckos_mission_links (
  id uuid primary key default gen_random_uuid(),
  mission_id text not null,
  ckos_object_type text not null,
  ckos_object_id uuid not null,
  created_at timestamptz not null default now()
);
alter table ckos_mission_links enable row level security;
create policy "public can read mission links" on ckos_mission_links
  for select using (true);
-- Bảng liên kết thuần, không chứa nội dung nhạy cảm — cho phép đọc công khai;
-- không có policy insert/update/delete công khai (chỉ service role).

-- ===== ckos_object_relationships (generic polymorphic, dự phòng quan hệ chưa định hình) =====
create table if not exists ckos_object_relationships (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_id text not null,
  target_type text not null,
  target_id text not null,
  relationship_kind text not null default 'related',
  created_at timestamptz not null default now()
);
alter table ckos_object_relationships enable row level security;
create policy "public can read object relationships" on ckos_object_relationships
  for select using (true);
-- Cũng thuần liên kết (không chứa nội dung), an toàn đọc công khai; ghi chỉ
-- qua service role. Dùng khi 1 quan hệ chưa có bảng n-n chuyên biệt ở trên.
