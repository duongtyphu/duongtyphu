-- ============================================================================
-- PHASE D.1 — Orders RLS Fix (SELECT policy, owner-scoped)
-- ============================================================================
-- Root cause (xác nhận ở Phase C): bảng `orders` bật RLS nhưng KHÔNG có bất kỳ
-- policy SELECT nào cho anon/authenticated — mọi đọc qua getSupabaseServer()
-- (anon-key session client) luôn trả rỗng/null, kể cả cho chính chủ đơn hàng.
-- Hệ quả nghiêm trọng nhất: /portal/checkout/order-received/[id] luôn 404 sau
-- khi thanh toán (getOrder() trả null -> notFound()).
--
-- Thay đổi trong file này CHỈ thêm 1 policy SELECT, scope theo email của chính
-- người dùng đăng nhập — không mở quyền đọc toàn bộ bảng, không thêm INSERT/
-- UPDATE/DELETE policy công khai. Luồng ghi (checkout/actions.ts, webhook
-- SePay, admin orders) tiếp tục dùng getSupabaseAdmin() (service role, bypass
-- RLS) như hiện tại — KHÔNG bị ảnh hưởng bởi migration này.
--
-- An toàn: đây là thay đổi MỞ RỘNG quyền đọc (trước: 0 quyền cho ai ngoài
-- service role; sau: user tự đọc được đơn của chính mình), khớp chính xác với
-- filter `.eq("member_email", email)` mà code đã tự làm ở tầng ứng dụng từ
-- trước — không có rủi ro lộ dữ liệu người khác vì policy so khớp đúng email
-- trong JWT của chính phiên đăng nhập.
-- ============================================================================

create policy "members can view own orders"
on orders
for select
using (
  member_email = auth.jwt() ->> 'email'
);

-- Rollback (nếu cần lùi lại):
--   drop policy if exists "members can view own orders" on orders;
