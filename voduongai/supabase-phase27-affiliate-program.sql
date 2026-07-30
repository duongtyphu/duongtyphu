-- ============================================================================
-- ĐÃ APPLY (Founder duyệt 2026-07-30). Giữ file này làm hồ sơ tham chiếu —
-- không chạy lại nguyên khối (các create table dùng "if not exists" nên vô
-- hại nếu chạy lại, nhưng 2 create or replace function sẽ ghi đè lại đúng
-- định nghĩa hiện tại, không có tác dụng phụ).
--
-- Chương trình Affiliate chính thức VO DUONG AI — đóng 4 khoảng trống audit
-- xác nhận thực sự cần thiết, sau khi đã xác nhận toàn bộ phần còn lại
-- (referral_code, referrals, trigger tạo referral khi referred_by được set,
-- trigger tính hoa hồng khi order confirmed) ĐÃ CÓ SẴN VÀ ĐANG CHẠY — không
-- xây trùng, không tạo bảng users/orders/referrals mới.
-- ============================================================================


-- ============================================================================
-- PHẦN 1 — Ghi nhận mã giới thiệu lúc đăng ký (BẮT BUỘC để chương trình chạy)
-- ============================================================================
-- Vấn đề: members.referred_by tồn tại từ trước nhưng CHƯA BAO GIỜ được set
-- (0/16 dòng có giá trị) vì không có nơi nào trong luồng đăng ký capture mã
-- giới thiệu. Không có referred_by → trigger on_member_referred (đã có sẵn,
-- AFTER INSERT ON members) không bao giờ chạy → không dòng referrals nào
-- được tạo → toàn bộ engine hoa hồng (đã có sẵn, đang chạy) không có input.
--
-- RỦI RO: đây là 1 trong 2 nơi rủi ro cao nhất của toàn bộ đề xuất — sửa
-- trigger auth.users lõi (handle_new_auth_user), dùng CHUNG cho MỌI đăng ký
-- (Register email/password, Google OAuth, magic-link) trên toàn hệ thống,
-- kể cả user không liên quan affiliate. Đã từng có bug P0 ở đúng trigger
-- này (thiếu cột email, chặn toàn bộ đăng ký — xem CLAUDE.md).
--
-- GIẢM THIỂU RỦI RO: thay đổi CHỈ CỘNG THÊM 1 field (referred_by) vào cùng
-- 1 câu lệnh insert đã có — KHÔNG đổi/xoá bất kỳ phần nào của logic
-- id/email/full_name hiện tại. Nếu request đăng ký không có `ref_code` trong
-- user metadata (tuyệt đại đa số user, không qua link giới thiệu), giá trị
-- là NULL — hành vi giống hệt 100% như trước khi có thay đổi này. Nếu
-- `ref_code` gửi lên không khớp `referral_code` nào (gõ sai/link cũ), giá
-- trị vẫn được set (referred_by = chuỗi không hợp lệ) nhưng trigger
-- `handle_new_referral()` (đã có sẵn, không sửa) sẽ không tìm thấy
-- `referrer_id` tương ứng nên KHÔNG tạo dòng `referrals` nào — không lỗi,
-- không crash, chỉ đơn giản là referral không được ghi nhận.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.members (id, email, full_name, referred_by)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    nullif(new.raw_user_meta_data->>'ref_code', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;


-- ============================================================================
-- PHẦN 2 — Cấu hình mức hoa hồng theo sản phẩm (bảng mới + sửa 1 trigger)
-- ============================================================================
-- Bảng mới, độc lập — không đụng schema orders/referrals/courses hiện có.
create table if not exists public.affiliate_commission_rules (
  id bigint generated always as identity primary key,
  product_type text not null check (product_type in ('course', 'product', 'lesson')),
  product_id text not null,
  product_label text,
  commission_rate numeric not null default 0.10 check (commission_rate >= 0 and commission_rate <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_type, product_id)
);

alter table public.affiliate_commission_rules enable row level security;

create policy "admin_all" on public.affiliate_commission_rules
  for all using (public.is_app_admin());

-- RỦI RO (thứ 2 trong 2 rủi ro cao nhất): sửa trigger `handle_order_confirmed_commission`
-- — trigger NÀY ĐÃ CHẠY THẬT, gắn trực tiếp với luồng checkout + webhook SePay
-- (mọi đơn hàng chuyển sang "confirmed" đều chạy qua đây).
--
-- GIẢM THIỂU RỦI RO: thay đổi CHỈ THÊM 1 bước tra cứu (lookup) mức hoa hồng
-- theo sản phẩm TRƯỚC khi tính `commission_amount` — nếu không tìm thấy rule
-- nào khớp `course_id`/`product_id`/`lesson_id` của đơn hàng (đúng trạng thái
-- MẶC ĐỊNH khi bảng rules còn rỗng, vd. ngay sau khi apply migration này),
-- dùng lại ĐÚNG `commission_rate` mặc định của dòng `referrals` (0.10, hành
-- vi y hệt trigger gốc hiện tại) — 100% tương thích ngược, không Admin nào
-- cấu hình rule thì hành vi tính hoa hồng KHÔNG đổi 1 đồng nào so với hiện
-- tại. Toàn bộ logic khác (tìm dòng referrals pending theo referred_email,
-- set order_id/status='confirmed') giữ nguyên y hệt bản gốc.
create or replace function public.handle_order_confirmed_commission()
returns trigger
language plpgsql
security definer
as $function$
DECLARE
  v_referral RECORD;
  v_rate NUMERIC;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') THEN
    SELECT * INTO v_referral FROM public.referrals
      WHERE referred_email = NEW.member_email AND status = 'pending'
      ORDER BY created_at DESC LIMIT 1;
    IF FOUND THEN
      SELECT commission_rate INTO v_rate FROM public.affiliate_commission_rules
        WHERE (product_type = 'course' AND product_id = NEW.course_id)
           OR (product_type = 'product' AND NEW.product_id IS NOT NULL AND product_id = NEW.product_id::text)
           OR (product_type = 'lesson' AND NEW.lesson_id IS NOT NULL AND product_id = NEW.lesson_id::text)
        LIMIT 1;
      IF v_rate IS NULL THEN
        v_rate := v_referral.commission_rate;
      END IF;
      UPDATE public.referrals
      SET order_id = NEW.id,
          commission_amount = ROUND(NEW.amount * v_rate),
          commission_rate = v_rate,
          status = 'confirmed'
      WHERE id = v_referral.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;


-- ============================================================================
-- PHẦN 3 — Theo dõi lượt truy cập link giới thiệu (bảng mới, độc lập)
-- ============================================================================
-- "Lượt truy cập" trong trang tổng quan Affiliate của Portal — dự án hiện
-- KHÔNG có bất kỳ cơ chế click-tracking nào (đã grep xác nhận), nên đây là
-- schema THỰC SỰ mới, không phải nối dây bảng có sẵn.
create table if not exists public.affiliate_link_visits (
  id bigint generated always as identity primary key,
  referral_code text not null,
  visited_at timestamptz not null default now(),
  landing_path text
);

create index if not exists affiliate_link_visits_code_idx
  on public.affiliate_link_visits (referral_code);

alter table public.affiliate_link_visits enable row level security;

create policy "admin_all" on public.affiliate_link_visits
  for all using (public.is_app_admin());

-- Không có policy insert công khai/anon — ghi nhận lượt truy cập chỉ qua
-- Server Action dùng service-role (getSupabaseAdmin()), không phải client
-- trực tiếp — tránh bất kỳ ai spam insert giả từ trình duyệt.


-- ============================================================================
-- PHẦN 4 — Yêu cầu thanh toán hoa hồng (bảng mới, độc lập)
-- ============================================================================
-- Không có bảng nào phù hợp tái sử dụng cho "yêu cầu rút hoa hồng" — đây là
-- hành động CHỦ ĐỘNG của thành viên (khác `referrals.status` vốn chỉ do hệ
-- thống tự chuyển pending→confirmed, và `paid` cần 1 xác nhận thủ công của
-- Admin sau khi đã thực sự chuyển khoản ngoài hệ thống).
create table if not exists public.affiliate_payout_requests (
  id bigint generated always as identity primary key,
  member_id uuid not null references public.members(id) on delete cascade,
  amount_requested integer not null check (amount_requested > 0),
  bank_info text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'rejected')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  admin_note text
);

alter table public.affiliate_payout_requests enable row level security;

create policy "member_read_own" on public.affiliate_payout_requests
  for select using (auth.uid() = member_id);

create policy "member_insert_own" on public.affiliate_payout_requests
  for insert with check (auth.uid() = member_id);

create policy "admin_all" on public.affiliate_payout_requests
  for all using (public.is_app_admin());

-- Khi Admin xác nhận đã chuyển khoản (đổi status → 'paid'), Server Action
-- phía Admin ĐỒNG THỜI cập nhật các dòng `referrals.status='confirmed'` của
-- đúng referrer đó sang `'paid'` + set `paid_at=now()` — bằng 1 UPDATE
-- riêng trong cùng Server Action (không phải trigger DB), vì đây là hành
-- động xác nhận thủ công có chủ đích của Admin, không phải hệ quả tự động
-- của 1 sự kiện khác — nhất quán với cách `orders.status` được xác nhận
-- thủ công qua webhook SePay (sự kiện ngoài hệ thống, không phải trigger
-- nội bộ tự suy luận).


-- ============================================================================
-- BÁO CÁO TỔNG HỢP RỦI RO — đọc trước khi quyết định apply
-- ============================================================================
-- 1. Phần 1 + Phần 2 sửa 2 trigger ĐANG CHẠY THẬT (auth.users signup, orders
--    confirmation) — cả 2 đều thiết kế THUẦN CỘNG THÊM (additive), có
--    fallback về đúng hành vi hiện tại khi không có dữ liệu mới (ref_code
--    rỗng / không có rule hoa hồng nào) — rủi ro hồi quy thấp nhưng KHÔNG
--    phải bằng 0 vì đây là đường DUY NHẤT mọi user đăng ký/mọi đơn hàng đều
--    đi qua.
-- 2. Phần 3 + Phần 4 là bảng mới hoàn toàn, độc lập, RLS chặt (chỉ admin
--    đọc/ghi ở Phần 3; user chỉ đọc/tạo dòng của chính mình ở Phần 4) —
--    rủi ro thấp, không ảnh hưởng gì ngoài chính chúng nếu có lỗi.
-- 3. Khuyến nghị: Founder tự chạy thử Phần 1 (đăng ký 1 tài khoản test có
--    `?ref=<code hợp lệ>`) trên Preview URL SAU khi apply, xác nhận dòng
--    `referrals` mới xuất hiện đúng — an toàn revert bằng cách chạy lại
--    đúng định nghĩa `handle_new_auth_user()` cũ (không có `referred_by`)
--    nếu phát hiện vấn đề.
-- ============================================================================
