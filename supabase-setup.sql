-- ═══════════════════════════════════════════════════════════
-- VDAI Academy — Supabase Database Setup
-- Chạy toàn bộ file này trong Supabase > SQL Editor > New query
-- ═══════════════════════════════════════════════════════════

-- 1. BẢNG THÀNH VIÊN
CREATE TABLE IF NOT EXISTS public.members (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT NOT NULL,
  full_name  TEXT,
  status     TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- User chỉ xem được data của chính mình
CREATE POLICY "users_own" ON public.members FOR SELECT
  USING (auth.uid() = id);

-- Admin xem được tất cả (thay email admin bên dưới nếu cần)
CREATE POLICY "admin_all" ON public.members FOR ALL
  USING (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- 2. BẢNG TÀI LIỆU
CREATE TABLE IF NOT EXISTS public.documents (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  url           TEXT DEFAULT '#',
  icon          TEXT DEFAULT '📄',
  bg_color      TEXT DEFAULT '#EEF4FF',
  display_order INT DEFAULT 0,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "docs_read"  ON public.documents FOR SELECT USING (active = TRUE);
CREATE POLICY "docs_admin" ON public.documents FOR ALL
  USING (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- 3. BẢNG KHOÁ HỌC
CREATE TABLE IF NOT EXISTS public.courses (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  status      TEXT DEFAULT 'coming',  -- 'coming' | 'open' | 'closed'
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses_read"  ON public.courses FOR SELECT USING (TRUE);
CREATE POLICY "courses_admin" ON public.courses FOR ALL
  USING (auth.jwt() ->> 'email' = 'duongvv.vn@gmail.com');

-- Dữ liệu mặc định khoá học
INSERT INTO public.courses (id, name, status, description) VALUES
  ('solo',  'VDAI SOLO',  'coming', 'Xây hệ thống Affiliate bằng AI — vận hành tinh gọn một người. Lộ trình 8 tuần thực chiến.'),
  ('scale', 'VDAI SCALE', 'coming', 'Nhân bản hệ thống Affiliate cùng đội nhóm — tự động hoá, mở rộng quy mô.')
ON CONFLICT (id) DO NOTHING;

-- Dữ liệu mặc định tài liệu
INSERT INTO public.documents (title, description, url, icon, bg_color, display_order) VALUES
  ('Bản đồ Affiliate AI 2025',        'Sơ đồ tổng quan hệ thống Affiliate kết hợp AI — PDF màu, in được',           '#', '🗺️', '#EEF4FF', 1),
  ('Checklist 30 ngày đầu',            'Danh sách việc cần làm tuần-by-tuần cho người mới bắt đầu Affiliate',         '#', '📋', '#F0FDF4', 2),
  ('100 Prompt AI viết content bán hàng','Bộ prompt sẵn dùng cho Facebook, TikTok, email marketing & landing page',  '#', '💬', '#FFF7ED', 3),
  ('Bộ công cụ AI miễn phí',           'Danh sách 20+ tool AI miễn phí giúp tự động hoá quy trình Affiliate',        '#', '🔧', '#F5F3FF', 4);

-- 4. TRIGGER — Tự thêm vào bảng members khi có user đăng ký mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.members (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
