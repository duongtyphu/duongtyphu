-- Giai đoạn 6 — "Bảng xếp hạng Affiliate" thật cho /v2/affiliate. Founder
-- xác nhận hiển thị TÊN ĐẦY ĐỦ + SỐ HOA HỒNG (không ẩn danh).
--
-- RLS `referrals` chỉ cho đọc dòng của chính mình (auth.uid() = referrer_id)
-- — không thể build leaderboard chỉ bằng RLS thông thường. Dùng SECURITY
-- DEFINER function thay vì mở thêm policy SELECT rộng trên `referrals`
-- (mở rộng RLS sẽ lộ TOÀN BỘ cột, kể cả referred_email/order_id — function
-- chỉ trả về đúng 4 cột an toàn đã tổng hợp).
--
-- auth.uid() vẫn phản ánh đúng JWT của người gọi dù chạy SECURITY DEFINER
-- (Supabase đọc từ request JWT claim, không đổi theo quyền hàm) — dùng để
-- luôn kèm dòng hạng của chính người gọi dù họ nằm ngoài top N.
--
-- ĐÃ APPLY qua Supabase MCP (apply_migration, success:true). File này chỉ
-- để track lại trong repo, đúng convention dự án.
create or replace function public.get_affiliate_leaderboard(limit_n int default 10)
returns table (
  rank bigint,
  member_id uuid,
  full_name text,
  total_commission numeric,
  referral_count bigint,
  is_you boolean
)
language sql
security definer
set search_path = public
stable
as $$
  with agg as (
    select
      r.referrer_id as member_id,
      sum(r.commission_amount) filter (where r.status in ('confirmed', 'paid')) as total_commission,
      count(*) as referral_count
    from public.referrals r
    group by r.referrer_id
  ),
  ranked as (
    select
      row_number() over (order by coalesce(agg.total_commission, 0) desc, agg.member_id) as rank,
      agg.member_id,
      coalesce(m.full_name, m.email, 'Thành viên VO DUONG AI') as full_name,
      coalesce(agg.total_commission, 0) as total_commission,
      agg.referral_count
    from agg
    join public.members m on m.id = agg.member_id
    where coalesce(agg.total_commission, 0) > 0
  )
  select
    ranked.rank,
    ranked.member_id,
    ranked.full_name,
    ranked.total_commission,
    ranked.referral_count,
    ranked.member_id = auth.uid() as is_you
  from ranked
  where ranked.rank <= greatest(limit_n, 1) or ranked.member_id = auth.uid()
  order by ranked.rank;
$$;

revoke all on function public.get_affiliate_leaderboard(int) from public;
grant execute on function public.get_affiliate_leaderboard(int) to authenticated;

-- BUG TỰ PHÁT HIỆN VÀ SỬA NGAY (chưa từng publish/dùng): Supabase tự cấp
-- EXECUTE cho `anon`/`authenticated` khi tạo function mới (default
-- privileges riêng của Supabase, KHÔNG đi qua pseudo-role PUBLIC) —
-- "revoke all ... from public" ở trên KHÔNG revoke được grant trực tiếp
-- này. Xác nhận qua `information_schema.routine_privileges` sau khi apply
-- lần đầu: `anon` vẫn có EXECUTE dù ý định chỉ cho `authenticated`.
revoke execute on function public.get_affiliate_leaderboard(int) from anon;
