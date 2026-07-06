-- ============================================================================
-- PHASE H.3 — Tool Intelligence: Canonical Schema (SCHEMA ONLY, NOT APPLIED)
-- ============================================================================
-- Trạng thái: chuẩn bị sẵn sàng triển khai, CHƯA áp dụng lên production.
-- Không đổi/xoá bảng `tools` (jsonb, legacy) hay `ckos_tool_categories` (Phase G).
-- `create table if not exists` — an toàn, idempotent.
--
-- Canonical Source quyết định ở Phase H.2: Tool Intelligence dùng bảng `tools`
-- (jsonb, Supabase-backed, có Admin Producer thật qua /admin/tools) làm nguồn
-- SỰ THẬT VẬN HÀNH HIỆN TẠI. Phase H.3 này KHÔNG thay thế `tools` — thay vào
-- đó, `ckos_tools` là lớp CHUẨN HOÁ (typed, CKOS Object Standard đầy đủ) để
-- Tool Intelligence tham gia CKOS Runtime (quan hệ, versioning, event, search)
-- mà `tools` (jsonb tự do, không ràng buộc) không đáp ứng được.
--
-- Sau khi Product Owner duyệt Phase H.3: `ckos_tools` trở thành nguồn ĐỌC cho
-- CKOS Runtime API (/api/v1/ckos/tools), còn `tools` (jsonb) tiếp tục là nơi
-- Admin ghi qua UI hiện có — đồng bộ 1 chiều qua migration script (mục
-- supabase-phase-h3-ckos-tools-migrate.sql), giống pattern đã dùng an toàn ở
-- Phase E (case_study → case_studies).
-- ============================================================================

create table if not exists ckos_tools (
  id uuid primary key default gen_random_uuid(),
  -- CKOS Object Standard (Phase G.2)
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
  -- Tool-specific fields (theo CKOS Object Standard G.2 + field thật quan sát
  -- được từ `tools.data` jsonb hiện có — xem chú thích map ở migrate.sql)
  category_id uuid references ckos_tool_categories(id) on delete set null,
  website_url text,
  cta_url text,
  cta_text text,
  pricing_model text,        -- map từ `tier`/`pricing` (Free/Premium/Freemium)
  api_supported boolean not null default false,
  strengths text[] not null default '{}',   -- map từ `pros`
  limitations text[] not null default '{}', -- map từ `cons`
  alternatives text[] not null default '{}',
  -- Field bổ sung giữ nguyên giá trị thật từ legacy source (không mất thông tin)
  legacy_tool_id text,        -- lưu id gốc bên bảng `tools` (vd "tool_1") để đối chiếu/rollback
  short_description text,
  long_description text,
  use_case text,
  audience text,
  workflow_note text,
  rating numeric,
  featured boolean not null default false,
  badge text
);

alter table ckos_tools enable row level security;
create policy "public can read published ckos tools" on ckos_tools
  for select using (status = 'Published');
-- Không có policy insert/update/delete công khai — chỉ service role (Admin/migration).

create unique index if not exists ckos_tools_legacy_id_key on ckos_tools (legacy_tool_id)
  where legacy_tool_id is not null;
create index if not exists ckos_tools_category_idx on ckos_tools (category_id);
create index if not exists ckos_tools_status_idx on ckos_tools (status);

comment on table ckos_tools is
  'CKOS Tool Intelligence canonical typed table (Phase H.3). Nguồn: đồng bộ '
  '1 chiều từ bảng jsonb `tools` (Admin ghi thật). Không thay thế `tools`, '
  'chỉ là lớp chuẩn hoá cho CKOS Runtime.';

-- ============================================================================
-- Relationship tables — Knowledge Relationship (yêu cầu H.3 mục 2)
-- ============================================================================
-- Nguyên tắc chung: mỗi quan hệ là 1 bảng n-n riêng, đơn giản, có thể REVERSE
-- lookup dễ dàng. Với các Intelligence CHƯA có bảng CKOS canonical riêng
-- (Lesson, Mission, FAQ — xem ghi chú từng bảng), cột "external_id" lưu tham
-- chiếu dạng text (soft reference, không FK cứng) vì nguồn dữ liệu đó nằm
-- ngoài CKOS Runtime hiện tại (Phase H.2 Mapping đã ghi rõ).

-- Tool ↔ Prompt (CKOS canonical: ckos_prompt_templates, Phase G — nhưng CHƯA
-- chốt Product Owner theo Phase H.2; bảng quan hệ này thiết kế sẵn, join theo
-- uuid ckos_prompt_templates.id — sẽ vô nghĩa cho tới khi Prompt canonical
-- được chốt và có dữ liệu thật)
create table if not exists ckos_tool_prompts (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  prompt_id uuid not null references ckos_prompt_templates(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, prompt_id)
);
alter table ckos_tool_prompts enable row level security;
create policy "public can read tool-prompt links" on ckos_tool_prompts
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Workflow (CKOS canonical: ckos_workflows, Phase G — đã tồn tại schema)
create table if not exists ckos_tool_workflows (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, workflow_id)
);
alter table ckos_tool_workflows enable row level security;
create policy "public can read tool-workflow links" on ckos_tool_workflows
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Lesson (KHÔNG có bảng CKOS canonical — "Lesson" ánh xạ tới bảng
-- `lessons` (typed, Premium/vdai-academy, Phase A) NẰM NGOÀI CKOS Runtime.
-- Soft reference bằng bigint text vì `lessons.id` là bigint, không phải uuid.
create table if not exists ckos_tool_lessons (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  lesson_id bigint not null, -- tham chiếu mềm tới lessons.id (không FK cứng — khác schema/DB domain)
  created_at timestamptz not null default now(),
  primary key (tool_id, lesson_id)
);
alter table ckos_tool_lessons enable row level security;
create policy "public can read tool-lesson links" on ckos_tool_lessons
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Mission (KHÔNG có bảng CKOS canonical — Mission hiện là static
-- TypeScript (`mission-catalog.ts` GOLDEN_MISSIONS, `companion/agents/
-- agent-registry.ts`) — soft reference bằng text mission id, vd "mission-01")
create table if not exists ckos_tool_missions (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  mission_id text not null, -- tham chiếu mềm tới GOLDEN_MISSIONS id (static, ngoài DB)
  created_at timestamptz not null default now(),
  primary key (tool_id, mission_id)
);
alter table ckos_tool_missions enable row level security;
create policy "public can read tool-mission links" on ckos_tool_missions
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Resource (CKOS canonical CHƯA rõ ràng theo Phase H.2 — nhóm
-- "Resource" đang nghi vấn content-duplication giữa admin/resources.ts và
-- data/resources.ts/sop.ts, cần xác nhận trước khi có canonical thật. Soft
-- reference bằng text resource id cho tới khi có quyết định.)
create table if not exists ckos_tool_resources (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  resource_id text not null, -- tham chiếu mềm, chờ Resource canonical được chốt
  created_at timestamptz not null default now(),
  primary key (tool_id, resource_id)
);
alter table ckos_tool_resources enable row level security;
create policy "public can read tool-resource links" on ckos_tool_resources
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Best Practice (CKOS canonical: ckos_best_practices, Phase G)
create table if not exists ckos_tool_best_practices (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  best_practice_id uuid not null references ckos_best_practices(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, best_practice_id)
);
alter table ckos_tool_best_practices enable row level security;
create policy "public can read tool-best-practice links" on ckos_tool_best_practices
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Case Study (CKOS canonical: case_studies, chốt ở Phase F — id bigint,
-- không phải uuid — soft reference vì khác domain khoá chính)
create table if not exists ckos_tool_case_studies (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  case_study_id bigint not null, -- tham chiếu mềm tới case_studies.id (bigint)
  created_at timestamptz not null default now(),
  primary key (tool_id, case_study_id)
);
alter table ckos_tool_case_studies enable row level security;
create policy "public can read tool-case-study links" on ckos_tool_case_studies
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ FAQ (Phase H.2: FAQ KHÔNG thuộc CKOS 9-Intelligence, chỉ là technical
-- consolidation riêng — soft reference bằng text faq id, sẽ vô nghĩa cho tới
-- khi FAQ có 1 nguồn chung theo đề xuất Phase H.2 mục 2.8)
create table if not exists ckos_tool_faqs (
  tool_id uuid not null references ckos_tools(id) on delete cascade,
  faq_id text not null, -- tham chiếu mềm, chờ FAQ consolidation
  created_at timestamptz not null default now(),
  primary key (tool_id, faq_id)
);
alter table ckos_tool_faqs enable row level security;
create policy "public can read tool-faq links" on ckos_tool_faqs
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_id and t.status = 'Published')
  );

-- Tool ↔ Related Tool (self-referential, n-n, không thứ tự — lưu 1 chiều,
-- ứng dụng tự suy ra 2 chiều khi query OR (tool_a_id, tool_b_id))
create table if not exists ckos_tool_related_tools (
  tool_a_id uuid not null references ckos_tools(id) on delete cascade,
  tool_b_id uuid not null references ckos_tools(id) on delete cascade,
  relationship_kind text not null default 'alternative', -- 'alternative' | 'complementary' | 'upgrade_path'
  created_at timestamptz not null default now(),
  primary key (tool_a_id, tool_b_id),
  check (tool_a_id <> tool_b_id)
);
alter table ckos_tool_related_tools enable row level security;
create policy "public can read related-tool links" on ckos_tool_related_tools
  for select using (
    exists (select 1 from ckos_tools t where t.id = tool_a_id and t.status = 'Published')
  );
