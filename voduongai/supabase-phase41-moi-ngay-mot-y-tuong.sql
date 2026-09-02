-- Phase 41 — "Mỗi ngày một ý tưởng" (/v2/moi-ngay-mot-y-tuong)
--
-- Thiết kế đã duyệt (design_handoff_moi_ngay_1_y_tuong/, Claude Design canvas
-- .dc.html + README.md). README yêu cầu tường minh 3 thay đổi kiến trúc so
-- với bản mockup tĩnh:
--   1. Nội dung (446 ý tưởng/35 lĩnh vực/100 thuật ngữ) → bảng thật, đọc qua
--      API phân trang/lọc (không tải hết 1 lần), có Admin CRUD.
--   2. 9 khoá localStorage `mnyt_*_v1` (+ 2 khoá từ điển cũ `saved_terms`/
--      `term_srs`) → bảng Supabase theo member_id thật, mỗi loại 1 quy tắc
--      xung đột riêng (union merge / last-write-wins theo entry / POST-only).
--   3. Streak PHẢI tính ở server (đọc `mnyt_completions.completed_at` bằng
--      đồng hồ server, không tin `Date.now()` phía client) — đổi giờ máy
--      không gian lận được.
--
-- 3 bảng nội dung: public đọc `status='Published'`, ghi qua Admin (service
-- role) — đúng pattern `projects`/`best_practices`. 11 bảng state người
-- dùng: member tự quản CHÍNH dòng của mình (`auth.uid() = member_id`), đúng
-- pattern `goal_records`/`memory_entries` (Phase 40) — trừ 2 bảng POST-only
-- (`mnyt_submissions`/`mnyt_outdated_reports`, chỉ INSERT+SELECT own, không
-- UPDATE/DELETE — đây là dữ liệu của VDAI, không phải của user, theo đúng
-- README "should never sit in their browser waiting to be lost").

-- ============================================================
-- 1. NỘI DUNG — public read Published, Admin (service role) ghi
-- ============================================================

create table if not exists public.mnyt_categories (
  key text primary key,
  name text not null,
  name_en text not null default '',
  short_name text not null default '',
  color text not null,
  order_index int not null default 0,
  status text not null default 'Published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mnyt_categories enable row level security;
create policy "public read published mnyt categories" on public.mnyt_categories
  for select using (status = 'Published');

create table if not exists public.mnyt_topics (
  id text primary key,
  day int not null unique,
  category_key text not null references public.mnyt_categories(key),
  category_name text not null,
  category_name_en text not null default '',
  color text not null,
  title text not null,
  title_en text not null default '',
  hook text not null,
  hook_en text not null default '',
  difficulty text not null default 'Cơ bản' check (difficulty in ('Cơ bản', 'Trung bình', 'Nâng cao')),
  est_minutes int not null default 4,
  tools text[] not null default '{}',
  is_trending boolean not null default false,
  path_step int not null default 1,
  path_total int not null default 1,
  -- concept/conceptEn/apply/applyEn/mechanism/mechanismEn/risk/riskEn/
  -- takeaway/takeawayEn/promptExample/promptShort(+En)/promptDetailed(+En)/
  -- promptAdvanced(+En)/quiz/quizEn/scenarioQuiz(+En)/applyQuiz(+En)
  content jsonb not null default '{}'::jsonb,
  status text not null default 'Published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mnyt_topics enable row level security;
create policy "public read published mnyt topics" on public.mnyt_topics
  for select using (status = 'Published');
create index if not exists mnyt_topics_category_key_idx on public.mnyt_topics(category_key);
create index if not exists mnyt_topics_difficulty_idx on public.mnyt_topics(difficulty);
create index if not exists mnyt_topics_day_idx on public.mnyt_topics(day);
create index if not exists mnyt_topics_tools_idx on public.mnyt_topics using gin(tools);
-- 446 dòng — ILIKE tìm kiếm không cần chỉ số trigram riêng, không thêm
-- extension mới chỉ cho 1 tính năng tìm kiếm nhỏ.

create table if not exists public.mnyt_glossary (
  id bigint generated always as identity primary key,
  term text not null unique,
  term_en text not null default '',
  category text not null,
  definition text not null,
  definition_en text not null default '',
  order_index int not null default 0,
  status text not null default 'Published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mnyt_glossary enable row level security;
create policy "public read published mnyt glossary" on public.mnyt_glossary
  for select using (status = 'Published');
create index if not exists mnyt_glossary_category_idx on public.mnyt_glossary(category);

-- ============================================================
-- 2. STATE NGƯỜI DÙNG — member tự quản dòng của chính mình
-- ============================================================

-- 2a. mnyt_state_v1 → mnyt_user_state (1 dòng/member) + mnyt_completions
-- (log đầy đủ, nguồn duy nhất để server tự tính streak — completed_at là
-- giờ SERVER, không tin Date.now() phía client).
create table if not exists public.mnyt_user_state (
  member_id uuid primary key references auth.users(id) on delete cascade,
  streak int not null default 0,
  xp int not null default 0,
  freeze_count int not null default 0,
  freeze_month text,
  last_completed_date date,
  updated_at timestamptz not null default now()
);
alter table public.mnyt_user_state enable row level security;
create policy "member manage own mnyt user state" on public.mnyt_user_state
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create table if not exists public.mnyt_completions (
  id bigint generated always as identity primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null references public.mnyt_topics(id),
  completed_at timestamptz not null default now(),
  unique (member_id, topic_id)
);
alter table public.mnyt_completions enable row level security;
create policy "member manage own mnyt completions" on public.mnyt_completions
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);
create index if not exists mnyt_completions_member_idx on public.mnyt_completions(member_id, completed_at);

-- 2b. favs — union merge (không bao giờ mất 1 lượt yêu thích)
create table if not exists public.mnyt_favorites (
  member_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null references public.mnyt_topics(id),
  created_at timestamptz not null default now(),
  primary key (member_id, topic_id)
);
alter table public.mnyt_favorites enable row level security;
create policy "member manage own mnyt favorites" on public.mnyt_favorites
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- 2c. badges — union merge (tự tính lại từ completions+streak mỗi lần hoàn
-- thành 1 ý tưởng, chỉ INSERT khi đạt mới — không bao giờ mất huy hiệu đã có
-- kể cả nếu điều kiện đạt huy hiệu đổi sau này).
create table if not exists public.mnyt_badges (
  member_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (member_id, badge_id)
);
alter table public.mnyt_badges enable row level security;
create policy "member manage own mnyt badges" on public.mnyt_badges
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- 2d. journal/checklist — last-write-wins THEO TỪNG ENTRY (topic_id), so
-- updated_at khi đồng bộ từ cache offline, không phải "bản mới nhất thắng
-- cả blob" như localStorage cũ.
create table if not exists public.mnyt_journal_entries (
  member_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null references public.mnyt_topics(id),
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (member_id, topic_id)
);
alter table public.mnyt_journal_entries enable row level security;
create policy "member manage own mnyt journal" on public.mnyt_journal_entries
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create table if not exists public.mnyt_checklist_entries (
  member_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null references public.mnyt_topics(id),
  items boolean[] not null default '{false,false,false}',
  updated_at timestamptz not null default now(),
  primary key (member_id, topic_id)
);
alter table public.mnyt_checklist_entries enable row level security;
create policy "member manage own mnyt checklist" on public.mnyt_checklist_entries
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- 2e. submissions/outdated reports — POST-only, dữ liệu của VDAI không phải
-- của user: chỉ INSERT + SELECT dòng của chính mình (xem lại đã gửi gì ở
-- Hồ sơ), KHÔNG UPDATE/DELETE — Admin (service role) duyệt riêng.
create table if not exists public.mnyt_submissions (
  id bigint generated always as identity primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  hook text not null,
  admin_status text not null default 'Pending' check (admin_status in ('Pending', 'Reviewed', 'Rejected', 'Published')),
  created_at timestamptz not null default now()
);
alter table public.mnyt_submissions enable row level security;
create policy "member read own mnyt submissions" on public.mnyt_submissions
  for select using (auth.uid() = member_id);
create policy "member insert own mnyt submissions" on public.mnyt_submissions
  for insert with check (auth.uid() = member_id);

create table if not exists public.mnyt_outdated_reports (
  id bigint generated always as identity primary key,
  member_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null references public.mnyt_topics(id),
  created_at timestamptz not null default now(),
  unique (member_id, topic_id)
);
alter table public.mnyt_outdated_reports enable row level security;
create policy "member read own mnyt outdated reports" on public.mnyt_outdated_reports
  for select using (auth.uid() = member_id);
create policy "member insert own mnyt outdated reports" on public.mnyt_outdated_reports
  for insert with check (auth.uid() = member_id);

-- 2f. prefs — last-write-wins theo device (gộp cả 2 khoá đơn lẻ cũ
-- `reminder`/`tour_seen` vào đây, cùng bản chất "cờ 1 giá trị/thiết bị").
create table if not exists public.mnyt_prefs (
  member_id uuid primary key references auth.users(id) on delete cascade,
  lang text not null default 'vi' check (lang in ('vi', 'en')),
  interests text[] not null default '{}',
  sound_on boolean not null default true,
  calm_mode boolean not null default false,
  reminder_on boolean not null default true,
  tour_seen boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.mnyt_prefs enable row level security;
create policy "member manage own mnyt prefs" on public.mnyt_prefs
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

-- 2g. từ điển — 2 khoá cũ `saved_terms` (union merge)/`term_srs` (LWW theo
-- term, ôn tập ngắt quãng — box/due_at/seen_at khớp đúng thuật toán SRS
-- trong mockup gốc).
create table if not exists public.mnyt_saved_terms (
  member_id uuid not null references auth.users(id) on delete cascade,
  term_id bigint not null references public.mnyt_glossary(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (member_id, term_id)
);
alter table public.mnyt_saved_terms enable row level security;
create policy "member manage own mnyt saved terms" on public.mnyt_saved_terms
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create table if not exists public.mnyt_term_srs (
  member_id uuid not null references auth.users(id) on delete cascade,
  term_id bigint not null references public.mnyt_glossary(id) on delete cascade,
  box int not null default 0,
  due_at timestamptz,
  seen_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (member_id, term_id)
);
alter table public.mnyt_term_srs enable row level security;
create policy "member manage own mnyt term srs" on public.mnyt_term_srs
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);
