-- ============================================================================
-- PHASE C.2 — Missing Migration Reconstruction: support_tickets
-- ============================================================================
-- Suy luận schema từ:
--   - src/app/portal/support/actions.ts   (submitSupportTicket — INSERT, anon client)
--   - src/app/portal/support/page.tsx      (getTickets — SELECT, anon client, lọc member_email)
--   - src/app/admin/(dashboard)/support/actions.ts (listTickets/replyTicket — service role)
--
-- GHI CHÚ XÁC MINH BẮT BUỘC: giống submissions/referrals — CHƯA xác nhận RLS
-- hiện tại đang bật hay tắt trên bảng production thật. Chỉ bật RLS theo policy
-- bên dưới sau khi xác nhận qua Supabase Dashboard.
-- ============================================================================

create table if not exists support_tickets (
  id bigint generated always as identity primary key,
  member_email text not null,
  subject text not null,
  message text not null,
  reply text,
  status text not null default 'open', -- quan sát được: 'open' | 'replied' | 'closed'
  created_at timestamptz not null default now()
);

comment on table support_tickets is
  'Yêu cầu hỗ trợ (/portal/support). Migration tái dựng Phase C — '
  'xác minh RLS thật trước khi bật lần đầu trên bảng production.';

-- ⚠️ CHỈ CHẠY SAU KHI XÁC NHẬN TRẠNG THÁI RLS THẬT TRÊN PRODUCTION.
-- alter table support_tickets enable row level security;
--
-- create policy "members can view own tickets" on support_tickets
--   for select using (member_email = auth.jwt() ->> 'email');
--
-- create policy "members can submit own ticket" on support_tickets
--   for insert with check (member_email = auth.jwt() ->> 'email');
--
-- Không có policy update/delete công khai — trả lời/đổi trạng thái chỉ qua
-- getSupabaseAdmin() trong admin/support/actions.ts (service role).
