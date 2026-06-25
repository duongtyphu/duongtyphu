-- Core schema gốc cho các bảng "thật" (cột kiểu dữ liệu cố định, không phải jsonb)
-- mà trước đây CHỈ tồn tại trong Supabase Dashboard, không có trong repo —
-- nếu mất project Supabase sẽ không thể dựng lại DB từ code (audit #3).
--
-- An toàn để chạy nhiều lần và chạy trên project đã có sẵn các bảng này:
-- mọi lệnh đều dùng IF NOT EXISTS / ON CONFLICT DO NOTHING, không xoá hay
-- sửa dữ liệu hiện có. Chạy toàn bộ file này một lần trong Supabase SQL Editor.

-- ===== members =====
-- 1 row / user đăng nhập qua Supabase Auth (auth.users), tạo bởi trigger
-- on-signup hoặc tự tạo khi cần (xem supabase-admin-auth.sql).
create table if not exists members (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  referral_code text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table members add column if not exists full_name text;
alter table members add column if not exists referral_code text;
alter table members add column if not exists is_admin boolean not null default false;
alter table members add column if not exists created_at timestamptz not null default now();

alter table members enable row level security;
drop policy if exists "members can read own row" on members;
create policy "members can read own row" on members for select using (auth.uid() = id);
drop policy if exists "members can update own row" on members;
create policy "members can update own row" on members for update using (auth.uid() = id);

-- ===== products (Sản phẩm số / Cửa hàng) =====
create table if not exists products (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  type text not null default 'digital',
  icon text,
  price numeric not null default 0,
  video_url text,
  pdf_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products add column if not exists description text;
alter table products add column if not exists type text not null default 'digital';
alter table products add column if not exists icon text;
alter table products add column if not exists price numeric not null default 0;
alter table products add column if not exists video_url text;
alter table products add column if not exists pdf_url text;
alter table products add column if not exists active boolean not null default true;
alter table products add column if not exists created_at timestamptz not null default now();

alter table products enable row level security;
drop policy if exists "public read active products" on products;
create policy "public read active products" on products for select using (active = true);

-- ===== lessons (Buổi học thật — Học viện AI) =====
create table if not exists lessons (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  video_url text,
  pdf_url text,
  price numeric not null default 0,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table lessons add column if not exists description text;
alter table lessons add column if not exists video_url text;
alter table lessons add column if not exists pdf_url text;
alter table lessons add column if not exists price numeric not null default 0;
alter table lessons add column if not exists active boolean not null default true;
alter table lessons add column if not exists sort_order int not null default 0;
alter table lessons add column if not exists created_at timestamptz not null default now();

alter table lessons enable row level security;
drop policy if exists "public read active lessons" on lessons;
create policy "public read active lessons" on lessons for select using (active = true);

-- ===== course_schedules (Lớp học trực tiếp) =====
create table if not exists course_schedules (
  id bigint generated always as identity primary key,
  course_name text not null,
  start_date date,
  end_date date,
  schedule_text text,
  meet_url text,
  seats_total int,
  seats_taken int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table course_schedules add column if not exists start_date date;
alter table course_schedules add column if not exists end_date date;
alter table course_schedules add column if not exists schedule_text text;
alter table course_schedules add column if not exists meet_url text;
alter table course_schedules add column if not exists seats_total int;
alter table course_schedules add column if not exists seats_taken int not null default 0;
alter table course_schedules add column if not exists active boolean not null default true;
alter table course_schedules add column if not exists created_at timestamptz not null default now();

alter table course_schedules enable row level security;
drop policy if exists "public read active course_schedules" on course_schedules;
create policy "public read active course_schedules" on course_schedules for select using (active = true);

-- ===== coupons (Mã giảm giá) =====
create table if not exists coupons (
  id bigint generated always as identity primary key,
  code text not null unique,
  discount_type text not null default 'percent',
  discount_value numeric not null default 0,
  max_uses int,
  used_count int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table coupons add column if not exists discount_type text not null default 'percent';
alter table coupons add column if not exists discount_value numeric not null default 0;
alter table coupons add column if not exists max_uses int;
alter table coupons add column if not exists used_count int not null default 0;
alter table coupons add column if not exists expires_at timestamptz;
alter table coupons add column if not exists active boolean not null default true;
alter table coupons add column if not exists created_at timestamptz not null default now();

-- Không có policy public select: coupons chỉ được đọc qua service role (admin actions
-- và webhook/checkout server action), tránh để khách duyệt hết danh sách mã giảm giá.
alter table coupons enable row level security;

-- ===== orders (Đơn hàng) =====
-- status convention: 'pending' | 'confirmed' | 'rejected' (xem webhook SePay).
create table if not exists orders (
  id bigint generated always as identity primary key,
  member_email text not null,
  product_name text,
  amount numeric not null default 0,
  status text not null default 'pending',
  order_code text,
  customer_name text,
  customer_phone text,
  payment_reference text,
  product_id bigint references products(id) on delete set null,
  lesson_id bigint references lessons(id) on delete set null,
  course_id text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table orders add column if not exists product_name text;
alter table orders add column if not exists amount numeric not null default 0;
alter table orders add column if not exists status text not null default 'pending';
alter table orders add column if not exists order_code text;
alter table orders add column if not exists customer_name text;
alter table orders add column if not exists customer_phone text;
alter table orders add column if not exists payment_reference text;
alter table orders add column if not exists product_id bigint references products(id) on delete set null;
alter table orders add column if not exists lesson_id bigint references lessons(id) on delete set null;
alter table orders add column if not exists course_id text;
alter table orders add column if not exists confirmed_at timestamptz;
alter table orders add column if not exists created_at timestamptz not null default now();

-- Không có policy public select/insert: mọi đọc/ghi orders đi qua service role
-- (server actions dùng getSupabaseAdmin, webhook SePay) để tránh lộ đơn hàng người khác.
alter table orders enable row level security;
