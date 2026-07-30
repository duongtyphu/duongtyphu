-- PHASE 26 — "Điều hướng" (Website Workspace, ADM-V2-02)
-- ĐỀ XUẤT MIGRATION — CHƯA APPLY. Chờ Founder duyệt trước khi chạy (đúng
-- nguyên tắc "cần migration mới phải lập báo cáo schema/rủi ro và dừng
-- chờ duyệt" của kế hoạch Admin v2.0).
--
-- Mục tiêu: cho phép Admin tự sửa menu Header (mainNav, src/lib/site.ts)
-- và 2 cột link Footer (columns, src/components/site/Footer.tsx) — hiện cả
-- 2 đều hardcode trong code, không có bảng nào quản lý.
--
-- Thiết kế: 1 bảng generic DÙNG CHUNG cho cả Header lẫn Footer (khác điểm
-- so với các bảng generic khác — thường 1 bảng = 1 khái niệm nội dung; ở
-- đây "điều hướng" là 1 khái niệm duy nhất, chỉ khác VỊ TRÍ hiển thị) —
-- phân biệt bằng field "location" (header|footer) + "groupLabel" (chỉ
-- Footer cần, vd. "Khám phá"/"Hành trình" — Header không có nhóm).
--
-- RỦI RO CẦN FOUNDER CÂN NHẮC TRƯỚC KHI DUYỆT:
-- 1. Header/Footer xuất hiện ở MỌI trang công khai (Landing Page — lưu
--    lượng cao nhất hệ thống) — 1 href sai tạo link chết lan toả toàn site,
--    không giới hạn ở 1 trang con như các module CMS khác.
-- 2. Cần sửa `HeaderClient.tsx` (đang dùng thẳng `mainNav` từ site.ts) và
--    `Footer.tsx` (đang dùng thẳng mảng `columns` cứng) để đọc bảng mới —
--    đây là thay đổi ở tầng SHELL dùng chung toàn site, rủi ro hồi quy cao
--    hơn hẳn 1 trang Portal/Admin đơn lẻ nếu không test kỹ qua next start.
-- 3. Cần fallback tĩnh an toàn (giữ nguyên mainNav/columns làm seed/fallback
--    khi Supabase lỗi/rỗng) để Header/Footer không bao giờ "trống trơn" —
--    đúng pattern getLiveXxx() đã dùng cho mọi module Live-edit khác.
-- 4. Đây là module RENDER TRÊN MỌI TRANG — đề xuất làm thành 1 việc RIÊNG,
--    tách khỏi Sprint 2 (Website) hiện tại, để có thời gian test kỹ hơn
--    (không gộp chung với các trang con ít rủi ro hơn như Header & Footer
--    nội dung/SEO Website).
--
-- KHÔNG apply file này cho tới khi có xác nhận riêng từ Founder.

create table if not exists public.site_navigation (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'Draft',
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_navigation enable row level security;

create policy "public read published" on public.site_navigation
  for select using (status = 'Published');

create policy "admin_all" on public.site_navigation
  for all using (is_app_admin()) with check (is_app_admin());

-- Seed dự kiến (KHÔNG chạy cùng lúc tạo bảng — chỉ tham khảo để Founder
-- hình dung shape dữ liệu, copy verbatim từ mainNav/columns hiện tại):
--
-- insert into public.site_navigation (id, data, status, "order") values
--   ('nav_home', '{"location":"header","label":"Trang chủ","href":"/"}', 'Published', 0),
--   ('nav_companion', '{"location":"header","label":"Companion","href":"/#companion-ai"}', 'Published', 1),
--   ('nav_hocvien', '{"location":"header","label":"Học viện AI","href":"/#trai-nghiem-hoc-vien-ai"}', 'Published', 2),
--   ('nav_kynang', '{"location":"header","label":"Kỹ năng AI","href":"/#ky-nang-ai"}', 'Published', 3),
--   ('nav_congcu', '{"location":"header","label":"Công cụ AI","href":"/#cong-cu-toi-dung"}', 'Published', 4),
--   ('nav_congdong', '{"location":"header","label":"Cộng đồng","href":"/#cong-dong"}', 'Published', 5),
--   ('nav_hanhtrinh', '{"location":"header","label":"Hành trình của tôi","href":"/#he-sinh-thai-cua-toi"}', 'Published', 6),
--   ('footer_kham_pha_1', '{"location":"footer","groupLabel":"Khám phá","label":"Học viện AI","href":"/login"}', 'Published', 0),
--   -- ... (còn lại 7 dòng footer khác, copy verbatim từ Footer.tsx `columns`)
