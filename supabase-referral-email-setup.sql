-- ═══════════════════════════════════════════════════════════
-- VDAI Academy — Referral System + Email Automation Setup
-- Chạy toàn bộ file này trong Supabase > SQL Editor > New query
-- (Sau khi đã chạy supabase-setup.sql)
-- ═══════════════════════════════════════════════════════════

-- 1. THÊM CỘT MÃ GIỚI THIỆU VÀO BẢNG MEMBERS
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS referred_by   TEXT; -- referral_code của người giới thiệu

-- Tự sinh mã giới thiệu 8 ký tự khi thêm thành viên mới
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_referral_code ON public.members;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.generate_referral_code();

-- Cập nhật trigger tạo member mới: lấy referred_by từ metadata lúc đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.members (id, email, full_name, referred_by)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'referred_by')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. BẢNG THEO DÕI GIỚI THIỆU (REFERRALS)
CREATE TABLE IF NOT EXISTS public.referrals (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  referrer_id      UUID REFERENCES public.members(id) ON DELETE SET NULL,
  referred_email   TEXT NOT NULL,
  referred_id      UUID REFERENCES public.members(id) ON DELETE SET NULL,
  order_id         BIGINT REFERENCES public.orders(id) ON DELETE SET NULL,
  commission_rate  NUMERIC DEFAULT 0.10,   -- 10% học phí — TODO: OWNER INPUT nếu cần đổi tỉ lệ
  commission_amount INTEGER DEFAULT 0,
  status           TEXT DEFAULT 'pending', -- pending (vừa đăng ký) | confirmed (đã có đơn hàng được xác nhận) | paid (đã trả hoa hồng)
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrer_read_own" ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "referrals_admin" ON public.referrals FOR ALL
  USING (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- Khi có thành viên mới được tạo và có referred_by → tự ghi nhận lượt giới thiệu
CREATE OR REPLACE FUNCTION public.handle_new_referral()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    SELECT id INTO v_referrer_id FROM public.members WHERE referral_code = NEW.referred_by;
    IF v_referrer_id IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_email, referred_id, status)
      VALUES (v_referrer_id, NEW.email, NEW.id, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_member_referred ON public.members;
CREATE TRIGGER on_member_referred
  AFTER INSERT ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_referral();

-- Khi đơn hàng được xác nhận (status -> 'confirmed') → tính hoa hồng cho người giới thiệu
CREATE OR REPLACE FUNCTION public.handle_order_confirmed_commission()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_referral RECORD;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') THEN
    SELECT * INTO v_referral FROM public.referrals
      WHERE referred_email = NEW.member_email AND status = 'pending'
      ORDER BY created_at DESC LIMIT 1;
    IF FOUND THEN
      UPDATE public.referrals
      SET order_id = NEW.id,
          commission_amount = ROUND(NEW.amount * v_referral.commission_rate),
          status = 'confirmed'
      WHERE id = v_referral.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_confirmed ON public.orders;
CREATE TRIGGER on_order_confirmed
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_confirmed_commission();

-- 3. NHẬT KÝ EMAIL TỰ ĐỘNG (để Edge Function ghi log, tránh gửi trùng)
CREATE TABLE IF NOT EXISTS public.email_log (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id   UUID REFERENCES public.members(id) ON DELETE CASCADE,
  email_type  TEXT NOT NULL, -- 'welcome' | 'order_confirmation' | 'cohort_reminder'
  status      TEXT DEFAULT 'sent', -- sent | failed
  detail      TEXT,
  sent_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_log_admin" ON public.email_log FOR ALL
  USING (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- ═══════════════════════════════════════════════════════════
-- BƯỚC TIẾP THEO (làm trên Supabase Dashboard, không chạy được bằng SQL):
-- 1. Deploy 2 Edge Function trong thư mục supabase/functions/
--    (send-welcome-email, send-order-confirmation) bằng Supabase CLI:
--      supabase functions deploy send-welcome-email
--      supabase functions deploy send-order-confirmation
-- 2. Vào Project Settings > Edge Functions > Secrets, thêm:
--      RESEND_API_KEY = <API key lấy từ resend.com>
-- 3. Vào Database > Webhooks, tạo 2 webhook:
--      a. Table: members, Event: INSERT → gọi send-welcome-email
--      b. Table: orders, Event: UPDATE → gọi send-order-confirmation
--         (điều kiện: chỉ khi status đổi thành 'confirmed', lọc trong code function)
-- ═══════════════════════════════════════════════════════════
