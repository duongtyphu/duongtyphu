# Human Story Engine — QA Checklist

Checklist kiểm thử thủ công cho `/portal/story` trước khi coi Sprint 7.1 là
xong, và mỗi khi có thay đổi liên quan tới Reflection Journal / Memory
Capsule / My Story timeline.

## 1. User mới vào `/portal/story`

- [ ] Đăng nhập bằng tài khoản chưa có reflection/capsule nào.
- [ ] Hero "Cuốn sách hành trình của bạn" render đúng.
- [ ] Timeline hiển thị ít nhất "Ngày đầu tiên bạn đến VO DUONG AI".
- [ ] Empty state ấm áp hiển thị đúng nếu timeline trống hoàn toàn (tài
      khoản test qua API, không có `created_at` hợp lệ).

## 2. User viết reflection

- [ ] Câu hỏi hôm nay hiển thị trong Reflection Journal card.
- [ ] Gõ câu trả lời, bấm "Lưu lại suy ngẫm này" → thấy lời cảm ơn xác nhận.
- [ ] Reflection xuất hiện trong timeline với emoji 🧠.
- [ ] AI Companion Memory card cập nhật trích dẫn câu trả lời vừa lưu.

## 3. User tạo memory capsule

- [ ] Chọn một loại (Cột mốc/Bài học/Quyết định/Vượt qua khó khăn/Thành tựu).
- [ ] Gõ tiêu đề, bấm "Cất giữ vào My Story" → nút đổi thành "Đã cất giữ"
      trong 3 giây.
- [ ] Capsule xuất hiện trong timeline với emoji đúng loại.

## 4. User reload page

- [ ] Sau khi reload, reflection vừa lưu vẫn còn trong timeline.
- [ ] Sau khi reload, capsule vừa lưu vẫn còn trong timeline.
- [ ] Reflection Journal card hiển thị trạng thái "đã trả lời hôm nay" (không
      cho trả lời lại câu hỏi của ngày hôm đó).

## 5. User khác không thấy dữ liệu của user này

- [ ] Đăng nhập bằng tài khoản B (khác tài khoản A ở bước 2–3).
- [ ] Timeline của B không chứa reflection/capsule của A.
- [ ] Companion Memory card của B không trích dẫn câu trả lời của A.
- [ ] (Nếu có quyền truy cập Supabase) xác nhận RLS đang bật trên cả hai
      bảng — không chỉ dựa vào việc UI lọc đúng.

## 6. Monthly letter render đúng

- [ ] Với tài khoản đã có reflection/capsule trong tháng hiện tại — lá thư
      nhắc đúng số lượng, giọng văn ấm áp, không giống báo cáo.
- [ ] Với tài khoản hoàn toàn chưa có lịch sử (chưa từng có reflection hay
      capsule) — lá thư hiển thị câu "Lá thư đầu tiên sẽ được viết khi hành
      trình của bạn có đủ những dấu chân đầu tiên." thay vì lá thư mặc định.

## 7. Fallback khi chưa chạy SQL

- [ ] Trên môi trường chưa chạy `supabase-human-story-engine.sql` (hoặc đã
      `drop table` để test), `/portal/story` không crash, không hiện lỗi kỹ
      thuật (không có stack trace, không có "Internal Server Error").
- [ ] Reflection Journal card hiển thị "Khu vực lưu ký ức đang được chuẩn bị.
      Bạn vẫn có thể xem hành trình của mình." thay vì textarea.
- [ ] Memory Capsule form hiển thị cùng thông báo mềm, không có input.
- [ ] Khu vực timeline hiển thị thêm thông báo mềm phía trên, không hiện
      timeline rỗng gây hiểu lầm là "chưa có gì cả".
- [ ] Console dev (không phải production) có đúng một dòng warning rõ ràng
      mỗi bảng, không lặp lại liên tục mỗi lần render.

## 8. Mobile responsive

- [ ] Ở màn hình hẹp (≤ 390px), Reflection Journal card và Companion Memory
      card xếp chồng dọc, không bị tràn ngang.
- [ ] Segmented control loại capsule (Cột mốc/Bài học/...) tự xuống dòng,
      không bị cắt.
- [ ] Timeline đọc được, không bị vỡ layout trên mobile.

## 9. Build/lint

- [ ] `npx tsc --noEmit` — 0 lỗi.
- [ ] `npm run lint` — 0 lỗi (chỉ các warning `<img>` đã tồn tại từ trước).
- [ ] `npm run build` — build thành công, `/portal/story` xuất hiện trong
      danh sách route.
