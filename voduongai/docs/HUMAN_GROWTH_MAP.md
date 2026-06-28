# Human Growth Map

Sprint 14.0 — The Human Growth Map.

Xem triết lý nền tảng tại `docs/HUMAN_GROWTH_PHILOSOPHY.md` trước khi đọc
tài liệu này.

## Human Growth Map là gì

Human Growth Map là một bản đồ phản chiếu hành trình trưởng thành của
người dùng trên VO DUONG AI — không phải dashboard, không phải hệ thống
analytics, không có điểm số hay cấp độ. Nó kết nối những hệ thống đã tồn
tại riêng lẻ (Reflection, Story, Garden, Knowledge, Journey, Companion)
thành một dòng chảy có thể kể lại được bằng ngôn ngữ con người.

## Các phần kết nối

- **Reflection** = điều người dùng nhận ra về chính mình. Mỗi Reflection
  là một dấu chân ghi lại một lần tự nhận thức.
- **Story** = điều người dùng đã đi qua. My Story là nơi những dấu chân
  này được kể lại thành một dòng thời gian.
- **Garden** = hình ảnh trưởng thành. Garden không phải số liệu — nó là
  một ẩn dụ sống cho trạng thái hiện tại của hành trình.
- **Knowledge** = điều người dùng hiểu thêm. Mỗi lần thực hành một kiến
  thức mới là một dấu chân của sự mở rộng hiểu biết.
- **Journey** = chặng đường đang đi. Đây là khung thời gian rộng hơn,
  nơi các dấu chân riêng lẻ được đặt vào một bối cảnh dài hạn.
- **Companion** = người phản chiếu và đồng hành. Companion không đánh
  giá hành trình — nó chỉ phản chiếu lại những gì đã thấy, bằng một câu
  nói ấm áp, đúng lúc.
- **Legacy** = điều còn lại theo thời gian. Không phải một thành tích
  được "mở khóa", mà là dấu ấn tự nhiên còn đọng lại sau một hành trình
  dài — những gì người dùng đã thực sự đi qua, không thể giả lập hay rút
  ngắn.

## Cách Growth Map hoạt động (kiến trúc)

1. **Growth Signal** (`growth-signals.ts`) — dữ liệu thật đã có (Reflection,
   Memory Capsule, Garden Stage...) được chuyển thành một dạng tín hiệu
   chung, không gắn điểm số hiển thị ra UI.
2. **Growth Timeline** (`growth-timeline.ts`) — các tín hiệu được dịch
   thành câu kể lại bằng ngôn ngữ con người, nhóm theo tháng, gắn vào một
   "chương" định tính (ví dụ "một mùa lặng", "một nhịp đều đặn").
3. **Growth Milestone** (`growth-milestones.ts`) — các lần đầu tiên đáng
   nhớ được ghi nhận (không phải achievement/unlock).
4. **Companion Growth Reflection** (`growth-reflection.ts`) — Companion
   chọn một câu phản chiếu phù hợp nhất tại một thời điểm, dựa trên các
   tín hiệu và milestone đã có.

Growth Map không có DB riêng trong sprint này — toàn bộ được suy ra từ
dữ liệu đã tồn tại (Reflection, Memory Capsule, Garden snapshot), cùng
nguyên tắc đã dùng ở `garden-model.ts`.
