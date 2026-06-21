-- ════════════════════════════════════════════════════════════
-- NHÓM 2 — Lead, Lịch khai giảng, Mã giảm giá, Case study,
-- Chuyên gia, Bài viết blog
-- Chạy file này trong Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════════════════

-- 1) LEAD (khách hàng tiềm năng — từ quiz, form đăng ký quan tâm...)
create table if not exists leads (
  id bigint generated always as identity primary key,
  name text,
  email text,
  phone text,
  source text,           -- vd: 'quiz', 'landing-solo', 'landing-scale'
  note text,
  status text default 'new', -- new | contacted | converted | lost
  created_at timestamptz default now()
);

-- 2) LỊCH KHAI GIẢNG
create table if not exists course_schedules (
  id bigint generated always as identity primary key,
  course_name text not null,
  start_date date,
  end_date date,
  schedule_text text,     -- vd: 'Thứ 3 - 5 - 7, 20h-21h30'
  meet_url text,           -- link Zoom/Google Meet
  seats_total int,
  seats_taken int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 3) MÃ GIẢM GIÁ
create table if not exists coupons (
  id bigint generated always as identity primary key,
  code text unique not null,
  discount_type text default 'percent', -- percent | amount
  discount_value numeric not null,
  max_uses int,
  used_count int default 0,
  expires_at timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

-- 4) CASE STUDY
create table if not exists case_studies (
  id bigint generated always as identity primary key,
  title text not null,
  client_name text,
  summary text,
  result_metric text,    -- vd: '+320% doanh thu sau 3 tháng'
  thumbnail_url text,
  link_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 5) CHUYÊN GIA
create table if not exists experts (
  id bigint generated always as identity primary key,
  name text not null,
  title text,            -- chức danh / chuyên môn
  bio text,
  avatar_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 6) BÀI VIẾT BLOG
create table if not exists blog_posts (
  id bigint generated always as identity primary key,
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  cover_url text,
  status text default 'draft', -- draft | published
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ── RLS: chỉ admin (duongvv.vn@gmail.com) được đọc/ghi toàn bộ 6 bảng trên ──
alter table leads           enable row level security;
alter table course_schedules enable row level security;
alter table coupons         enable row level security;
alter table case_studies    enable row level security;
alter table experts         enable row level security;
alter table blog_posts      enable row level security;

create policy "admin all - leads" on leads
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "admin all - course_schedules" on course_schedules
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "admin all - coupons" on coupons
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "admin all - case_studies" on case_studies
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "admin all - experts" on experts
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');
create policy "admin all - blog_posts" on blog_posts
  for all using (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- Cho phép mọi người (kể cả khách chưa đăng nhập) đọc các bảng mang tính
-- hiển thị công khai trên site: lịch khai giảng, case study, chuyên gia,
-- blog đã published. Lead và coupon KHÔNG public.
create policy "public read - course_schedules" on course_schedules
  for select using (active = true);
create policy "public read - case_studies" on case_studies
  for select using (active = true);
create policy "public read - experts" on experts
  for select using (active = true);
create policy "public read - blog_posts" on blog_posts
  for select using (status = 'published');
