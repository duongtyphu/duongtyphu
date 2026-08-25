-- Phase 40 — Di chuyển Goal Runtime (goal-runtime.ts) + Memory Store
-- (memory-store.ts) từ localStorage (per-browser, KHÔNG gắn user_id thật)
-- sang Supabase (per-member_id thật) — theo yêu cầu Founder: "Tất cả các
-- chỉ số và thông tin phải được kết nối và ghi nhận thật với hồ sơ của
-- từng học viên."
--
-- Ảnh hưởng CẢ /portal 1.0 (`/portal/goals/*`, `WorkspaceMvp.tsx`) lẫn
-- /v2 2.0 (`/v2/companion`, `/v2/bo-nho-ca-nhan-hoa`, `/v2/muc-tieu` mới) —
-- 2 module này dùng CHUNG `goal-runtime.ts`/`memory-store.ts` (Single
-- Source of Truth), không tách bản riêng cho 2.0.
--
-- Không có chức năng XOÁ goal/epic/mission/memory nào trong code hiện tại
-- (đã audit — chỉ có tạo mới + đổi status) nên không cần RLS DELETE, và
-- an toàn dùng chiến lược "upsert toàn bộ danh sách mỗi lần ghi" ở tầng
-- ứng dụng (không mất dữ liệu do thiếu logic xoá).

create table if not exists public.memory_entries (
  memory_id text primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  output_id text not null,
  portfolio_item_id text not null,
  session_id text not null,
  learning text not null default '',
  reflection text not null default '',
  knowledge text not null default '',
  best_practice text not null default '',
  capability_improvement text not null default '',
  created_at timestamptz not null default now(),
  unique (member_id, portfolio_item_id)
);
alter table public.memory_entries enable row level security;
create policy "member read own memory entries" on public.memory_entries
  for select using (auth.uid() = member_id);
create policy "member insert own memory entries" on public.memory_entries
  for insert with check (auth.uid() = member_id);

create table if not exists public.goal_records (
  goal_id text primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  description text,
  category text,
  goal_type text,
  priority text,
  expected_deliverable text,
  due_date text,
  tags jsonb,
  created_by text,
  status_history jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.goal_records enable row level security;
create policy "member manage own goals" on public.goal_records
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create table if not exists public.goal_epics (
  epic_id text primary key,
  goal_id text not null references public.goal_records(goal_id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
alter table public.goal_epics enable row level security;
create policy "member manage own epics" on public.goal_epics
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create table if not exists public.goal_missions (
  mission_id text primary key,
  epic_id text not null references public.goal_epics(epic_id) on delete cascade,
  member_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  owner text not null default 'Owner',
  department text not null,
  companion_employee_id text not null,
  input jsonb not null default '[]',
  output jsonb not null default '[]',
  deliverables jsonb not null default '[]',
  definition_of_done jsonb not null default '[]',
  status text not null default 'not_started',
  session_id text,
  created_at timestamptz not null default now()
);
alter table public.goal_missions enable row level security;
create policy "member manage own missions" on public.goal_missions
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create index if not exists goal_epics_goal_id_idx on public.goal_epics(goal_id);
create index if not exists goal_missions_epic_id_idx on public.goal_missions(epic_id);
create index if not exists memory_entries_member_id_idx on public.memory_entries(member_id);
