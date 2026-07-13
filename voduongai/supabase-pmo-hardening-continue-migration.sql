-- PMO-HARDENING-CONT — PMO Resolution: tiếp tục Production Hardening,
-- "xây Admin Management cho chức năng Portal đã tồn tại KHÔNG phải tính
-- năng mới". Bổ sung các bảng còn thiếu cho Workstream 1 (AI Workspace),
-- 2 (Companion Studio — chỉ phần an toàn: Persona/Conversation Strategy),
-- 3 (Journey Mission Presentation), 4 (CKOS Lesson Management).
-- Purely additive — không đổi bảng cũ, không mất dữ liệu. Chạy 1 lần trong
-- Supabase SQL Editor trước khi merge/deploy.
--
-- Rollback: drop table if exists mission_presentation, ai_workspace_recommended,
-- ai_workspace_workflow, ai_workspace_prompts, ai_workspace_resource,
-- ai_workspace_settings, companion_persona, companion_conversation_strategy,
-- knowledge_seed;

create table if not exists mission_presentation (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table mission_presentation enable row level security;

create table if not exists ai_workspace_recommended (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_workspace_recommended enable row level security;

create table if not exists ai_workspace_workflow (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_workspace_workflow enable row level security;

create table if not exists ai_workspace_prompts (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_workspace_prompts enable row level security;

create table if not exists ai_workspace_resource (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_workspace_resource enable row level security;

create table if not exists ai_workspace_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_workspace_settings enable row level security;

create table if not exists companion_persona (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_persona enable row level security;

create table if not exists companion_conversation_strategy (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table companion_conversation_strategy enable row level security;

-- Knowledge Seed (CKOS Lesson) — Admin CRUD đã tồn tại từ trước (collectionKey
-- "knowledge-seed") nhưng chưa từng có bảng thật, nên trước đây chỉ ghi
-- localStorage. Đăng ký bảng thật ở đây để dừng mất dữ liệu Admin — LƯU Ý:
-- việc này CHƯA làm Portal (CKOS hub/route hetrithucai/[slug]) đọc từ bảng
-- này, vì shape hiện tại của Admin (flat: title/summary/goal/persona/
-- problem/coreIdea/process/samplePrompt/checklist/caseStudy/exercise/tags)
-- khác shape Portal cần (nested: steps[]/taxonomy) — ghi rõ trong báo cáo,
-- việc nối Portal đọc bảng này là hạng mục còn lại, cần 1 lượt riêng.
create table if not exists knowledge_seed (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table knowledge_seed enable row level security;
