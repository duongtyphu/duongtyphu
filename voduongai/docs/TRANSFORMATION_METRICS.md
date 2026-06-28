# Transformation Metrics

> Hệ đo lường sự chuyển hóa con người — không đo hoạt động sản phẩm
> thông thường (page view, session time, số click, số bài hoàn thành).
> Mọi chỉ số dưới đây dùng để VO DUONG AI hiểu người dùng đang trưởng
> thành ra sao, **không** được biến thành điểm số/leaderboard/áp lực
> hiển thị cho người dùng (đúng nguyên tắc no-gamification từ Sprint
> 9.0).

## Nguyên tắc đo lường

- Đo xu hướng theo thời gian, không đo một con số tuyệt đối tại một
  thời điểm.
- Dữ liệu phục vụ Companion Insight và Product Team — không hiển thị
  trực tiếp dưới dạng điểm/rank cho người dùng.
- Một chỉ số thấp không có nghĩa là "thất bại" — nó là tín hiệu để
  Companion đồng hành khác đi, không phải để gắn nhãn người dùng.

## 9 chỉ số

### 1. Học sâu hơn

- **Ý nghĩa:** Người dùng dành thời gian hiểu nguyên lý, không chỉ lướt
  qua tiêu đề.
- **Dấu hiệu hành vi:** Đọc hết một bài học thay vì rời đi giữa bài;
  quay lại đọc cùng một nguyên lý nhiều lần ở các giai đoạn khác nhau.
- **Dữ liệu có thể thu thập sau này:** Thời gian trên trang nội dung,
  số lần quay lại một bài học cụ thể.
- **Không biến thành:** "Điểm hiểu bài" hiển thị cho người dùng.

### 2. Thực hành nhiều hơn

- **Ý nghĩa:** Tỷ lệ chuyển từ đọc sang hành động thật tăng theo thời
  gian.
- **Dấu hiệu hành vi:** Hoàn thành bài thực hành sau khi đọc, không chỉ
  đọc rồi rời đi.
- **Dữ liệu có thể thu thập sau này:** Số lượng Practice/Mission được
  hoàn thành so với số lượng nội dung đã xem.
- **Không biến thành:** Bảng xếp hạng "ai thực hành nhiều nhất".

### 3. Tự tin hơn

- **Ý nghĩa:** Người dùng dám hành động và chia sẻ sớm hơn, do dự ít
  hơn theo thời gian.
- **Dấu hiệu hành vi:** Khoảng thời gian từ lúc học một điều mới đến lúc
  áp dụng/chia sẻ ngắn lại.
- **Dữ liệu có thể thu thập sau này:** Thời gian giữa lần học và lần áp
  dụng đầu tiên, qua nhiều chu kỳ.
- **Không biến thành:** "Chỉ số tự tin" hiển thị công khai.

### 4. Kiên trì hơn

- **Ý nghĩa:** Người dùng quay lại sau khi bỏ lỡ hoặc gặp khó, không bỏ
  cuộc hoàn toàn.
- **Dấu hiệu hành vi:** Quay lại Portal sau một khoảng thời gian vắng
  mặt, thay vì biến mất hẳn.
- **Dữ liệu có thể thu thập sau này:** Khoảng cách giữa các lần truy
  cập, tỷ lệ quay lại sau khoảng nghỉ.
- **Không biến thành:** Streak counter gây áp lực ("đừng để mất streak").

### 5. Biết phản tỉnh hơn

- **Ý nghĩa:** Chất lượng và độ thường xuyên của Reflection tăng theo
  thời gian.
- **Dấu hiệu hành vi:** Câu trả lời Reflection dài hơn, cụ thể hơn, ít
  chung chung hơn.
- **Dữ liệu có thể thu thập sau này:** Độ dài/tần suất Reflection, mức
  độ liên quan giữa Reflection và hành động trước đó.
- **Không biến thành:** Điểm "chất lượng Reflection" so sánh giữa người
  dùng.

### 6. Biết tạo giá trị hơn

- **Ý nghĩa:** Người dùng chuyển từ tiêu thụ nội dung sang tạo ra kết
  quả/sản phẩm/dịch vụ của riêng mình.
- **Dấu hiệu hành vi:** Hoàn thành các bước trong Build OS, có sản phẩm
  thử nghiệm cụ thể.
- **Dữ liệu có thể thu thập sau này:** Số lượng dự án/thử nghiệm được
  tạo và cập nhật theo thời gian.
- **Không biến thành:** "Bảng thành tích kiến tạo" công khai.

### 7. Biết chia sẻ hơn

- **Ý nghĩa:** Người dùng sẵn sàng đưa thành quả của mình ra ngoài, cho
  cộng đồng hoặc người khác thấy.
- **Dấu hiệu hành vi:** Tham gia Connect OS, đóng góp nội dung/phản hồi
  cho người khác.
- **Dữ liệu có thể thu thập sau này:** Số lượng đóng góp/chia sẻ theo
  thời gian.
- **Không biến thành:** Leaderboard chia sẻ nhiều nhất (xem Tension
  Point đã ghi trong `HUMAN_WISDOM_ARCHITECTURE.md`).

### 8. Biết giúp người khác hơn

- **Ý nghĩa:** Người dùng chủ động hỗ trợ người khác trong cộng đồng,
  không chỉ nhận giúp đỡ.
- **Dấu hiệu hành vi:** Trả lời/hỗ trợ người mới trong cộng đồng, chia
  sẻ kinh nghiệm thật.
- **Dữ liệu có thể thu thập sau này:** Số lần đóng góp giúp người khác
  (không cần định lượng chính xác, có thể là tự báo cáo).
- **Không biến thành:** "Điểm cống hiến" xếp hạng công khai.

### 9. Biết lưu giữ tri thức hơn

- **Ý nghĩa:** Người dùng chủ động lưu lại điều quan trọng để dùng lại,
  không học rồi quên.
- **Dấu hiệu hành vi:** Lưu memory capsule, quay lại đọc Reflection/ghi
  chú cũ.
- **Dữ liệu có thể thu thập sau này:** Số lượng memory capsule được tạo
  và được mở lại sau đó.
- **Không biến thành:** Số lượng "gem đã thu thập" như một dạng điểm.
