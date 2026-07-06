-- ============================================================================
-- PHASE G.1 — CKOS Runtime Foundation: Core Intelligence Tables
-- ============================================================================
-- Không xoá bảng cũ, không đổi tên bảng production đang dùng, không migrate
-- static data. Toàn bộ `create table if not exists` — an toàn để chạy nhiều
-- lần, no-op nếu đã tồn tại.
--
-- QUYẾT ĐỊNH THIẾT KẾ QUAN TRỌNG — tránh đụng tên với bảng production:
-- Work order liệt kê "tools", "prompt_templates", "case_studies" như CKOS
-- Core Intelligence Tables — nhưng CẢ 3 tên này đã là bảng production đang
-- phục vụ trang public thật (`tools` — /portal/tools; `prompt_templates` —
-- /portal/prompts, đang là 1 trong 2 lựa chọn canonical CHƯA được Product
-- Owner chốt ở Phase F; `case_studies` — /portal/case-studies, đã chốt
-- canonical ở Phase F). Tạo bảng MỚI trùng tên sẽ vi phạm trực tiếp "Không
-- đổi tên bảng production đang dùng" (vì `create table if not exists` sẽ
-- KHÔNG áp dụng được cột chuẩn CKOS lên bảng cũ có schema khác, còn nếu ép
-- CREATE TABLE thật với tên trùng thì Postgres sẽ báo lỗi vì bảng đã tồn tại
-- với schema khác — không an toàn theo đúng nghĩa đen).
--
-- Xử lý:
--   - `tools`: TÁI SỬ DỤNG nguyên trạng (jsonb, không cần bảng mới — field
--     chuẩn CKOS tools ở G.2 (category_id, website_url, pricing_model,
--     api_supported, strengths, limitations, alternatives) có thể lưu ngay
--     trong cột `data` jsonb hiện có mà không cần đổi schema).
--   - `case_studies`: TÁI SỬ DỤNG nguyên trạng theo đúng Existing Table Reuse
--     Plan đã chốt ở Phase F — mở rộng thêm cột chuẩn CKOS còn thiếu ở file
--     riêng `supabase-phase-g-case-studies-ckos-standard-columns.sql`, KHÔNG
--     tạo bảng mới.
--   - `prompt_templates`: CHƯA chốt canonical (Phase F để lại làm Product
--     Owner approval point) — tạo bảng MỚI với tên `ckos_prompt_templates`
--     (namespace riêng, không đụng bảng production `prompt_templates`/
--     `prompts` đang tranh chấp), để không tự ý quyết định thay Product Owner.
--   - `tool_categories`: chưa tồn tại bảng nào tương ứng -> tạo mới
--     `ckos_tool_categories`.
--   - `goals`, `strategies`, `decisions`, `workflows`, `workflow_steps`,
--     `evaluation_models`: chưa tồn tại -> tạo mới với tiền tố `ckos_` để
--     tách biệt rõ ràng khỏi mọi bảng production hiện có (tránh mọi khả năng
--     đụng tên trong tương lai), theo đúng tinh thần "namespace riêng cho hệ
--     thống mới" đã dùng nhất quán trong toàn bộ Phase G.
--
-- CKOS Object Standard (G.2) — mọi bảng ckos_* dưới đây đều có đủ:
--   id uuid, title, slug (unique), description, status, version, language,
--   difficulty, tags text[], metadata jsonb, created_at, updated_at,
--   published_at.
--
-- Status lifecycle (khớp convention Draft/Published/Hidden đã dùng xuyên suốt
-- codebase, mở rộng thêm Review/Approved/Archived theo yêu cầu G.4):
--   'Draft' -> 'Review' -> 'Approved' -> 'Published' -> 'Archived'
--
-- RLS: public/anon CHỈ đọc được dòng status='Published'; mọi ghi (insert/
-- update/delete) đều KHÔNG có policy công khai — chỉ qua service role
-- (getSupabaseAdmin), khớp pattern bảo mật đã dùng cho orders/coupons/leads.
-- ============================================================================

-- ===== ckos_tool_categories =====
create table if not exists ckos_tool_categories (
  id uuid primary key default gen_random_uuid(),
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
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_tool_categories enable row level security;
create policy "public can read published tool categories" on ckos_tool_categories
  for select using (status = 'Published');

-- ===== ckos_goals =====
create table if not exists ckos_goals (
  id uuid primary key default gen_random_uuid(),
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
  target_outcome text,
  timeframe text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_goals enable row level security;
create policy "public can read published goals" on ckos_goals
  for select using (status = 'Published');

-- ===== ckos_strategies =====
create table if not exists ckos_strategies (
  id uuid primary key default gen_random_uuid(),
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
  guiding_principle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_strategies enable row level security;
create policy "public can read published strategies" on ckos_strategies
  for select using (status = 'Published');

-- ===== ckos_decisions =====
create table if not exists ckos_decisions (
  id uuid primary key default gen_random_uuid(),
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
  context text,
  options jsonb not null default '[]'::jsonb,
  chosen_option text,
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_decisions enable row level security;
create policy "public can read published decisions" on ckos_decisions
  for select using (status = 'Published');

-- ===== ckos_workflows =====
create table if not exists ckos_workflows (
  id uuid primary key default gen_random_uuid(),
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
  input_definition text,
  output_definition text,
  estimated_time text,
  automation_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_workflows enable row level security;
create policy "public can read published workflows" on ckos_workflows
  for select using (status = 'Published');

-- ===== ckos_workflow_steps =====
-- Quan hệ 1-n với ckos_workflows; tool_id lưu dạng text để tương thích với
-- tools.id (bảng jsonb hiện có, PK kiểu text) — xem ghi chú FK linh hoạt ở
-- file relationships.
create table if not exists ckos_workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references ckos_workflows(id) on delete cascade,
  step_order int not null default 0,
  title text not null,
  instruction text,
  tool_id text,
  status text not null default 'Draft'
    check (status in ('Draft','Review','Approved','Published','Archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ckos_workflow_steps enable row level security;
create policy "public can read published workflow steps" on ckos_workflow_steps
  for select using (status = 'Published');

-- ===== ckos_prompt_templates =====
-- LƯU Ý: đây LÀ bảng CKOS mới, KHÔNG phải bảng production `prompt_templates`
-- hiện có (khác tên hoàn toàn, cố ý). Xem giải thích ở đầu file.
create table if not exists ckos_prompt_templates (
  id uuid primary key default gen_random_uuid(),
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
  template text,
  variables jsonb not null default '[]'::jsonb,
  expected_output text,
  tool_ids text[] not null default '{}',
  usage_guide text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_prompt_templates enable row level security;
create policy "public can read published ckos prompt templates" on ckos_prompt_templates
  for select using (status = 'Published');

-- ===== ckos_evaluation_models =====
-- CHỈ schema, KHÔNG có dữ liệu, KHÔNG có API/UI vận hành nào gắn với bảng
-- này ở Phase G (đúng lệnh cấm "không xây Evaluation Intelligence từ mock").
-- Route /api/v1/ckos/evaluations sẽ luôn trả mảng rỗng cho tới khi có quyết
-- định phạm vi + nguồn dữ liệu thật (điều kiện tiên quyết đã ghi từ Phase C).
create table if not exists ckos_evaluation_models (
  id uuid primary key default gen_random_uuid(),
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
  rubric jsonb not null default '{}'::jsonb,
  scoring_rules jsonb not null default '{}'::jsonb,
  pass_threshold numeric,
  feedback_templates jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_evaluation_models enable row level security;
create policy "public can read published evaluation models" on ckos_evaluation_models
  for select using (status = 'Published');

-- ===== ckos_best_practices (bổ sung — nêu trong CKOS Runtime Schema Proposal Phase F) =====
create table if not exists ckos_best_practices (
  id uuid primary key default gen_random_uuid(),
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
  principle text,
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table ckos_best_practices enable row level security;
create policy "public can read published best practices" on ckos_best_practices
  for select using (status = 'Published');
