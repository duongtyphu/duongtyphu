-- ============================================================================
-- PHASE C.3 — Orders Safety Constraint (double-confirm prevention)
-- ============================================================================
-- Mục tiêu: giảm rủi ro double-confirm thanh toán do orders.order_code và
-- orders.payment_reference hiện KHÔNG có UNIQUE constraint (Phase A finding).
--
-- GIỚI HẠN MÔI TRƯỜNG QUAN TRỌNG: môi trường thực hiện Phase C này KHÔNG có
-- SUPABASE_SERVICE_ROLE_KEY được cấu hình (biến rỗng trong .env.local), và
-- anon key bị RLS chặn hoàn toàn trên bảng `orders` (xem RLS Verification
-- Report). Vì vậy KHÔNG THỂ tự chạy duplicate-check trực tiếp trên dữ liệu
-- production từ môi trường audit này.
--
-- Thay vì yêu cầu con người chạy tay 1 câu SELECT kiểm tra trước, migration
-- này tự kiểm tra trùng lặp NGAY TRONG transaction trước khi thêm constraint,
-- và sẽ báo lỗi rõ ràng (RAISE EXCEPTION) — KHÔNG âm thầm thêm constraint nếu
-- có dữ liệu trùng — đúng yêu cầu "Không thêm constraint nếu dữ liệu hiện có
-- bị trùng". Người vận hành migration sẽ thấy lỗi cụ thể và cần dọn dữ liệu
-- trùng (merge/xoá đơn hàng trùng) trước khi chạy lại.
--
-- payment_reference cố ý cho phép NULL trùng nhau (nhiều đơn "pending" chưa
-- có mã giao dịch có thể cùng NULL) — dùng UNIQUE INDEX ... WHERE ... IS NOT
-- NULL (partial unique index) thay vì UNIQUE constraint thường để tránh chặn
-- nhầm các đơn chưa thanh toán.
-- ============================================================================

do $$
declare
  dup_order_code_count int;
  dup_payment_ref_count int;
begin
  select count(*) into dup_order_code_count
  from (
    select order_code
    from orders
    where order_code is not null
    group by order_code
    having count(*) > 1
  ) t;

  select count(*) into dup_payment_ref_count
  from (
    select payment_reference
    from orders
    where payment_reference is not null
    group by payment_reference
    having count(*) > 1
  ) t;

  if dup_order_code_count > 0 then
    raise exception
      'Phase C.3 ABORT: % nhóm order_code bị trùng trong bảng orders — '
      'dọn dữ liệu (merge/xoá đơn trùng) trước khi thêm UNIQUE constraint.',
      dup_order_code_count;
  end if;

  if dup_payment_ref_count > 0 then
    raise exception
      'Phase C.3 ABORT: % nhóm payment_reference bị trùng trong bảng orders — '
      'dọn dữ liệu trước khi thêm UNIQUE constraint (khả năng double-confirm '
      'thanh toán đã xảy ra — cần đối soát SePay trước khi migration).',
      dup_payment_ref_count;
  end if;

  raise notice 'Phase C.3: không phát hiện trùng lặp order_code/payment_reference — an toàn để thêm constraint.';
end $$;

-- Chỉ tới được đây nếu DO block ở trên không raise exception (không có trùng lặp).
alter table orders add constraint orders_order_code_key unique (order_code);

-- Partial unique index cho payment_reference — cho phép nhiều NULL (đơn pending
-- chưa có mã giao dịch), chỉ chặn trùng khi đã có giá trị thật (đã xác nhận).
create unique index if not exists orders_payment_reference_key
  on orders (payment_reference)
  where payment_reference is not null;

-- ROLLBACK (nếu cần lùi lại):
--   alter table orders drop constraint if exists orders_order_code_key;
--   drop index if exists orders_payment_reference_key;
