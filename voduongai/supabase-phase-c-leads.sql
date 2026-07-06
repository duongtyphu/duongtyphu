-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: leads
-- ============================================================================
-- Suy luận schema từ:
--   - src/app/api/leads/route.ts                    (POST — INSERT, service role)
--   - src/app/admin/(dashboard)/leads/actions.ts     (listLeads/updateLeadStatus — service role)
--
-- Khác với submissions/referrals/support_tickets: TOÀN BỘ truy cập bảng này
-- (đọc lẫn ghi) đều đi qua getSupabaseAdmin() (service role), KHÔNG có bất kỳ
-- code nào dùng anon-key session client để đọc/ghi bảng `leads` trực tiếp.
-- => An toàn để BẬT RLS mà KHÔNG cần thêm bất kỳ policy public nào (giống
-- pattern `orders`/`coupons` trong supabase-core-schema.sql) — service role
-- luôn bypass RLS nên không ảnh hưởng hành vi hiện tại.
-- ============================================================================

create table if not exists leads (
  id bigint generated always as identity primary key,
  email text not null,
  source text,
  status text not null default 'new', -- quan sát được: 'new' | 'contacted' | 'converted'
  created_at timestamptz not null default now()
);

comment on table leads is
  'Email opt-in (form landing page, /api/leads). Migration tái dựng Phase C. '
  'Toàn bộ truy cập đi qua service role — an toàn bật RLS không cần policy public.';

alter table leads enable row level security;
-- Không tạo policy nào — mọi đọc/ghi đi qua service role (getSupabaseAdmin),
-- khớp với hành vi hiện tại (không có UI/route nào dùng anon-key cho bảng này).
