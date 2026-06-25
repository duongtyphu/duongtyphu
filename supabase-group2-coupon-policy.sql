-- ════════════════════════════════════════════════════════════
-- Bổ sung cho Nhóm 2 — chỉ chạy file NÀY (không chạy lại supabase-group2.sql,
-- vì các bảng/policy ở đó đã được tạo trước rồi).
--
-- Cho phép thành viên đã đăng nhập đọc mã giảm giá đang active để áp dụng
-- lúc thanh toán ở Portal. Mã đã tắt/hết hạn vẫn không đọc được.
-- ════════════════════════════════════════════════════════════

create policy "member read active coupons" on coupons
  for select using (active = true and auth.role() = 'authenticated');
