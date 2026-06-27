# Human Story Engine — Activation Guide

Hướng dẫn kích hoạt tính năng lưu trữ ký ức (`reflections`, `memory_capsules`)
của Human Story Engine (`/portal/story`) trên Supabase project thật.

## 1. Mục đích của SQL migration

File `voduongai/supabase-human-story-engine.sql` tạo hai bảng dùng để lưu
ký ức cá nhân của từng người dùng — câu trả lời suy ngẫm hằng ngày và những
khoảnh khắc họ tự chọn cất giữ. Cho tới khi file này được chạy trên project
Supabase thật, hai bảng này chưa tồn tại và `/portal/story` chạy ở chế độ
graceful fallback (xem mục 5).

## 2. Bảng được tạo

- **`reflections`** — câu hỏi/câu trả lời của Reflection Journal.
  Cột: `id`, `member_id`, `question`, `answer`, `created_at`.
- **`memory_capsules`** — các khoảnh khắc người dùng tự lưu (Memory Capsule).
  Cột: `id`, `member_id`, `kind`, `title`, `description`, `occurred_at`.

Cả hai đều có `member_id uuid references auth.users(id) on delete cascade` —
xóa user sẽ tự xóa ký ức liên quan.

## 3. RLS hoạt động như thế nào

Cả hai bảng đều `enable row level security` với policy
`using (auth.uid() = member_id) with check (auth.uid() = member_id)` —
mỗi người dùng chỉ đọc/viết được ký ức của chính họ, không có cách nào
(qua client) để một user thấy dữ liệu của user khác. Đây là cơ chế bảo vệ
duy nhất — không có API route trung gian kiểm tra quyền.

## 4. Cách chạy SQL trong Supabase

1. Vào Supabase Dashboard → project production → **SQL Editor**.
2. Mở file `voduongai/supabase-human-story-engine.sql`, copy toàn bộ nội dung.
3. Paste vào SQL Editor → **Run**.
4. Migration dùng `create table if not exists`, an toàn để chạy nhiều lần
   (không xóa dữ liệu cũ nếu bảng đã tồn tại).

## 5. Cách kiểm tra sau khi chạy

- Vào **Table Editor**, xác nhận thấy `reflections` và `memory_capsules`.
- Vào `/portal/story` khi đã đăng nhập, thử:
  - Trả lời câu hỏi reflection hôm nay → bấm lưu → thấy lời cảm ơn xác nhận.
  - Lưu một Memory Capsule → thấy "Đã cất giữ".
  - Reload trang → cả hai phải còn xuất hiện trong "Dòng thời gian của bạn".
- Nếu trước khi chạy SQL trang hiển thị thông báo mềm
  *"Khu vực lưu ký ức đang được chuẩn bị..."*, sau khi chạy SQL và reload,
  thông báo này phải biến mất và form lưu xuất hiện trở lại.

## 6. Cách rollback nếu cần

Migration chỉ tạo bảng mới, không đổi bảng cũ — rollback an toàn nhất là
xóa hai bảng nếu cần tắt tính năng:

```sql
drop table if exists public.reflections;
drop table if exists public.memory_capsules;
```

Sau khi drop, `/portal/story` tự động quay lại chế độ graceful fallback
(không crash) — không cần deploy lại code.

## 7. Các lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| Trang luôn hiện "Khu vực lưu ký ức đang được chuẩn bị" sau khi đã chạy SQL | Chạy SQL nhầm project (ví dụ project staging thay vì production) | Kiểm tra lại `NEXT_PUBLIC_SUPABASE_URL` đang dùng và chạy SQL đúng project đó |
| Lưu reflection/capsule không thấy lỗi nhưng cũng không lưu được | RLS policy chưa được tạo (chạy thiếu phần `create policy`) | Chạy lại toàn bộ file SQL, không chỉ phần `create table` |
| Console dev hiện cảnh báo `[Human Story Engine] Bảng "..." chưa tồn tại` | Bình thường khi chưa chạy SQL trong môi trường dev/local | Chạy SQL trên project đang dùng ở `.env.local`, hoặc bỏ qua nếu đang test fallback UI |

## 8. Checklist Production

- [ ] Đã chạy `supabase-human-story-engine.sql` trên đúng project production.
- [ ] Table Editor xác nhận có `reflections` và `memory_capsules`.
- [ ] Test thật trên production: trả lời reflection, lưu capsule, reload —
      dữ liệu còn lại đúng.
- [ ] Test với 2 tài khoản khác nhau — xác nhận không thấy ký ức của nhau.
- [ ] Thông báo "Khu vực lưu ký ức đang được chuẩn bị" không còn xuất hiện
      với người dùng đã đăng nhập.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` đều sạch trước khi
      deploy.
