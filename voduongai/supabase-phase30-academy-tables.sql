-- Phase 30 — Schema v2, Bước 4: 6 bảng Học viện AI.
--
-- Áp dụng qua Supabase MCP (apply_migration), track lại ở đây theo convention.
-- RLS + policy tạo NGAY trong cùng migration (không lặp lại tình trạng
-- "bật RLS nhưng 0 policy" của 11 bảng đã phát hiện trong audit).

-- ---------------------------------------------------------------------------
-- 1. learning_paths — lộ trình học
--
-- Thay mảng tĩnh `LEARNING_PATHS` (src/data/portal/ai-workspace.ts).
--
-- ĐÍNH CHÍNH SỐ LIỆU so với bản mô tả: đặc tả ghi `stage_order` "1-4, khớp
-- 4 giai đoạn CKOS". Dữ liệu THẬT có **5 cấp độ** (level 1-5), không phải 4
-- — đã đọc trực tiếp mảng tĩnh, không suy đoán. Seed đúng 5 dòng thật.
--
-- 2 cột mở rộng so với đặc tả (`href`, `mission_count`) — bắt buộc phải có,
-- nếu không 2 field thật của mỗi lộ trình sẽ mất khi migrate. Cùng lý do đã
-- ghi cho `ckos_categories.href` ở Phase 29.
--
-- `goal` (mảng tĩnh) map sang `description` (đặc tả) — cùng ý nghĩa, không
-- tạo thêm cột trùng.
-- ---------------------------------------------------------------------------
create table if not exists public.learning_paths (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  stage_order   int  not null default 0,
  href          text,
  mission_count int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

insert into public.learning_paths (slug, title, description, stage_order, href, mission_count) values
  ('nguoi-moi-bat-dau',   'Người mới bắt đầu',              'Làm quen AI Chat, viết prompt đầu tiên.',            1, '/portal/hocvienai',                  6),
  ('ung-dung-cong-viec',  'Ứng dụng AI vào công việc',      'Dùng AI cho các công việc hàng ngày.',              2, '/portal/hocvienai',                  8),
  ('he-thong-noi-dung',   'Xây hệ thống nội dung bằng AI',  'Lên quy trình sản xuất nội dung đều đặn.',          3, '/portal/roadmap',                   10),
  ('tu-dong-hoa',         'Tự động hóa với AI',             'Kết nối công cụ, giảm việc lặp lại thủ công.',      4, '/portal/aiworkspace/tu-dong-hoa',    6),
  ('ai-cho-doanh-nghiep', 'AI cho kinh doanh / đội nhóm',   'Áp dụng AI ở quy mô đội nhóm/doanh nghiệp.',        5, '/portal/premium',                    8)
on conflict (slug) do nothing;

alter table public.learning_paths enable row level security;
create policy "learning_paths_read" on public.learning_paths
  for select using (true);
create policy "learning_paths_admin" on public.learning_paths
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 2. learning_path_courses — junction N-N
--
-- LỖI #7 đã sửa: KHÔNG tạo cột `courses.learning_path_id`. Chỉ 1 nguồn sự
-- thật duy nhất cho quan hệ lộ trình <-> khoá học là bảng junction này (1
-- khoá học vẫn có thể xuất hiện ở nhiều lộ trình).
--
-- `course_id` kiểu TEXT — khớp `courses.id` thật ('ai-coban', 'solo'...).
-- Để RỖNG: chưa có ánh xạ lộ trình <-> khoá học nào được duyệt; 5 lộ trình
-- hiện chỉ trỏ href tới trang, không gắn khoá học cụ thể nào.
-- ---------------------------------------------------------------------------
create table if not exists public.learning_path_courses (
  id         uuid primary key default gen_random_uuid(),
  path_id    uuid not null references public.learning_paths(id) on delete cascade,
  course_id  text not null references public.courses(id) on delete cascade,
  "order"    int  not null default 0,
  created_at timestamptz not null default now(),
  unique (path_id, course_id)
);

alter table public.learning_path_courses enable row level security;
create policy "learning_path_courses_read" on public.learning_path_courses
  for select using (true);
create policy "learning_path_courses_admin" on public.learning_path_courses
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 3. user_ckos_progress — tiến độ học CKOS/Free  ⚠️ LỖI #3, BẢNG 1/2
--
-- Thay localStorage `vdai_knowledge_seed_progress` (dạng
-- `Record<seedId, stepId[]>`). `seed_id` kiểu TEXT vì `knowledge_seeds.id`
-- là text ('viet-email-chuyen-nghiep'...).
--
-- KHÔNG GỘP với `user_lesson_progress` bên dưới — 2 hệ tiến độ hoàn toàn
-- khác nhau, đây chính là lỗi #3 đã phát hiện ở Bước 0.
--
-- `completed_step_ids` dùng text[] (không phải jsonb): mảng phẳng toàn
-- chuỗi, text[] cho phép dùng toán tử mảng của Postgres và index GIN nếu
-- cần, jsonb không có lợi thế gì ở đây.
-- ---------------------------------------------------------------------------
create table if not exists public.user_ckos_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.members(id) on delete cascade,
  seed_id            text not null references public.knowledge_seeds(id) on delete cascade,
  completed_step_ids text[] not null default '{}',
  updated_at         timestamptz not null default now(),
  unique (user_id, seed_id)
);

create index if not exists user_ckos_progress_user_idx on public.user_ckos_progress (user_id);

alter table public.user_ckos_progress enable row level security;
create policy "user_ckos_progress_own" on public.user_ckos_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_ckos_progress_admin" on public.user_ckos_progress
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 4. user_lesson_progress — tiến độ học Premium  ⚠️ LỖI #3, BẢNG 2/2
--
-- Tiến độ xem video bài học Premium. CHƯA TỒN TẠI ở bất kỳ tầng nào từ
-- trước (kể cả localStorage) — `CourseLearnClient.tsx` cố ý không xây
-- course progress. Đây là tính năng MỚI hoàn toàn, không migrate từ đâu cả.
--
-- `lesson_id` kiểu BIGINT — đã xác nhận `course_lessons.id` là bigint
-- (đặc tả v2 ghi "kiểm tra đúng kiểu id thật trước khi tạo FK", đã kiểm tra
-- qua information_schema.columns).
-- ---------------------------------------------------------------------------
create table if not exists public.user_lesson_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid   not null references public.members(id) on delete cascade,
  lesson_id       bigint not null references public.course_lessons(id) on delete cascade,
  status          text   not null default 'not_started'
                    check (status in ('not_started','in_progress','completed')),
  watched_seconds int    not null default 0,
  completed_at    timestamptz,
  updated_at      timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists user_lesson_progress_user_idx on public.user_lesson_progress (user_id);

alter table public.user_lesson_progress enable row level security;
create policy "user_lesson_progress_own" on public.user_lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_lesson_progress_admin" on public.user_lesson_progress
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 5. badges — huy hiệu
--
-- LỖI #6 đã sửa: `course_id` kiểu TEXT (khớp `courses.id`), không phải uuid.
-- Nullable: badge có thể không gắn khoá học nào (huy hiệu theo hành vi/CKOS).
--
-- Để RỖNG: hệ badge chưa từng tồn tại ở bất kỳ tầng nào (0 bảng, 0 code, 0
-- UI) nên không có dữ liệu thật nào để seed — không bịa danh sách huy hiệu.
-- ---------------------------------------------------------------------------
create table if not exists public.badges (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  icon        text,
  course_id   text references public.courses(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.badges enable row level security;
create policy "badges_read" on public.badges
  for select using (true);
create policy "badges_admin" on public.badges
  for all using (public.is_app_admin()) with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- 6. user_badges — huy hiệu user đã đạt
--
-- RLS: user chỉ ĐỌC huy hiệu của chính mình, KHÔNG tự insert/update/delete
-- được (khác `user_ckos_progress`/`user_lesson_progress` — tiến độ do user
-- tự ghi). Huy hiệu phải do hệ thống/admin cấp qua service_role, nếu không
-- bất kỳ user nào cũng tự cấp huy hiệu cho mình được.
-- ---------------------------------------------------------------------------
create table if not exists public.user_badges (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.members(id) on delete cascade,
  badge_id  uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index if not exists user_badges_user_idx on public.user_badges (user_id);

alter table public.user_badges enable row level security;
create policy "user_badges_read_own" on public.user_badges
  for select using (auth.uid() = user_id);
create policy "user_badges_admin" on public.user_badges
  for all using (public.is_app_admin()) with check (public.is_app_admin());
