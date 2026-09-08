-- Phase 42 — Di chuyển "Workspace Kernel" (growth-event-bus.ts +
-- workspace-session-store.ts + portfolio-store.ts) từ localStorage
-- (per-browser, KHÔNG gắn member_id thật) sang Supabase (per-member_id
-- thật), cùng tinh thần Phase 40 (goal-runtime.ts/memory-store.ts).
--
-- Phát hiện qua audit Task #52 (ưu tiên 5 khu vực dùng nhiều nhất +
-- Hành trình của tôi): 3 file này lưu TOÀN BỘ dữ liệu Task→Output→Review→
-- Approval→Portfolio (WorkspaceMvp.tsx, engine chính của Companion
-- Workspace, vào từ `/v2/muc-tieu/[goalId]`'s "Bắt đầu Nhiệm vụ") +
-- Growth Event (backbone cho Nhật ký học tập/Hành trình của tôi/Khu vườn
-- của bạn — cả /portal/* 1.0 lẫn 3 tab đã nhúng nguyên component 1.0 vào
-- /v2/hanh-trinh-cua-toi qua "Cách A") thuần localStorage — 2 học viên
-- dùng chung máy sẽ thấy chung dữ liệu, đổi máy sẽ mất hết.
--
-- Đã audit toàn bộ 3 file: KHÔNG có hàm XOÁ nào (chỉ tạo mới + cập nhật
-- trạng thái) nên an toàn dùng "upsert mỗi lần ghi", RLS không cần DELETE.
-- growth_events và portfolio_items chỉ APPEND (không update dòng đã có)
-- nên chỉ cần SELECT+INSERT; workspace_sessions cập nhật liên tục
-- (pause/resume/advance step/output mới...) nên cần đủ ALL.

create table if not exists public.growth_events (
  event_id text primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  mission_id text,
  workspace_session_id text,
  output_id text,
  capability_record_id text,
  impact_record_id text,
  modules_using jsonb not null default '[]',
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.growth_events enable row level security;
create policy "member read own growth events" on public.growth_events
  for select using (auth.uid() = member_id);
create policy "member insert own growth events" on public.growth_events
  for insert with check (auth.uid() = member_id);
create index if not exists growth_events_member_occurred_idx
  on public.growth_events (member_id, occurred_at desc);

create table if not exists public.workspace_sessions (
  session_id text primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  context jsonb not null,
  status text not null default 'active',
  current_step_id text not null default 'mission_started',
  started_at timestamptz not null,
  paused_at timestamptz,
  resumed_at timestamptz,
  finished_at timestamptz,
  history jsonb not null default '[]',
  outputs jsonb not null default '[]',
  updated_at timestamptz not null default now()
);
alter table public.workspace_sessions enable row level security;
create policy "member manage own workspace sessions" on public.workspace_sessions
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);
create index if not exists workspace_sessions_member_started_idx
  on public.workspace_sessions (member_id, started_at desc);

create table if not exists public.portfolio_items (
  portfolio_item_id text primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  output_id text not null,
  session_id text not null,
  mission_id text,
  journey_id text,
  title text not null,
  description text,
  output_type text not null,
  version integer not null default 1,
  tags jsonb not null default '[]',
  business_value text,
  capability_mapping jsonb,
  ai_impact_summary text,
  status text not null default 'active',
  output_created_at timestamptz not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.portfolio_items enable row level security;
create policy "member read own portfolio items" on public.portfolio_items
  for select using (auth.uid() = member_id);
create policy "member insert own portfolio items" on public.portfolio_items
  for insert with check (auth.uid() = member_id);
create index if not exists portfolio_items_member_created_idx
  on public.portfolio_items (member_id, output_created_at desc);
