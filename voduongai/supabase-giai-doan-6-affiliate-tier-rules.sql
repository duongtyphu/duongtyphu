-- Giai đoạn 6 (tiếp) — "Mức hoa hồng của bạn" (3 tầng) đúng thiết kế đã
-- chốt trong vdaiportal2.0.html (mục 07 "Chương trình Affiliate"): Người
-- mới 20% / Đối tác 30% (cấp nổi bật) / Đại sứ 40%, kèm quyền lợi + điều
-- kiện lên cấp theo số giao dịch thành công tích luỹ.
--
-- KHÔNG dùng chung bảng `affiliate_commission_rules` (product_type/
-- product_id/commission_rate) — bảng đó chỉ phục vụ trigger
-- handle_order_confirmed_commission() (khớp theo course/product/lesson,
-- KHÔNG có khái niệm "tầng theo số giao dịch của referrer"), và không có
-- cột cho quyền lợi/ngưỡng giao dịch. Bảng mới này độc lập, generic
-- (id/data jsonb/status/order — cùng khuôn mọi collection khác trong dự
-- án), KHÔNG được trigger nào đọc — chỉ Portal hiển thị + Admin sửa qua
-- `/admin/affiliate/cau-hinh-cap-do` (VisualEditor).
--
-- ĐÃ APPLY qua Supabase MCP (apply_migration, success:true). File này chỉ
-- để track lại trong repo, đúng convention dự án.
create table if not exists public.affiliate_tier_rules (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.affiliate_tier_rules enable row level security;

create policy "public read published" on public.affiliate_tier_rules
  for select using (status = 'Published');

create policy "admin full access" on public.affiliate_tier_rules
  for all using (is_app_admin()) with check (is_app_admin());

insert into public.affiliate_tier_rules (id, data, status, "order") values
  ('tier-new', jsonb_build_object(
    'tierKey', 'new',
    'label', 'Người mới',
    'ratePercent', 20,
    'minTransactions', 0,
    'benefits', jsonb_build_array('Hoa hồng trên mọi gói Premium', 'Bộ tài liệu marketing cơ bản'),
    'condition', 'Không yêu cầu — áp dụng ngay khi đăng ký',
    'isFeatured', false
  ), 'Published', 1),
  ('tier-partner', jsonb_build_object(
    'tierKey', 'partner',
    'label', 'Đối tác',
    'ratePercent', 30,
    'minTransactions', 10,
    'benefits', jsonb_build_array('Toàn bộ quyền lợi Người mới', 'Landing page giới thiệu riêng', 'Hỗ trợ ưu tiên'),
    'condition', 'Đạt từ 10 giao dịch thành công',
    'isFeatured', true
  ), 'Published', 2),
  ('tier-ambassador', jsonb_build_object(
    'tierKey', 'ambassador',
    'label', 'Đại sứ',
    'ratePercent', 40,
    'minTransactions', 50,
    'benefits', jsonb_build_array('Toàn bộ quyền lợi Đối tác', 'Hoa hồng cấp 2 (5%)', 'Tư vấn chiến lược 1:1'),
    'condition', 'Đạt từ 50 giao dịch thành công',
    'isFeatured', false
  ), 'Published', 3)
on conflict (id) do nothing;
