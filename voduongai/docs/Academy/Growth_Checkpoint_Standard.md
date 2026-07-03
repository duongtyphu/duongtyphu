# Growth Checkpoint Standard

Chuẩn cho **Growth Checkpoint** (Feature 05, Sprint 02). Component:
`src/features/academy/components/GrowthCheckpoint.tsx`.

## Mục đích

Growth Checkpoint là khoảnh khắc người học tự nhận diện sự trưởng thành của chính mình — sau
mỗi giai đoạn Journey, không dùng điểm số (Growth Framework, Sprint 01).

## Growth Checkpoint phải

- Chỉ mở khi Journey đạt giai đoạn `GROWTH` hoặc `READY` (xem `JourneyRules.md`).
- Có đúng 2 câu hỏi cố định: "Hôm nay bạn nhận ra điều gì?" và "Điều gì bạn làm tốt hơn
  trước?" — không thêm, không tuỳ biến theo Collection.
- Không chấm đúng/sai câu trả lời, không so sánh với người học khác.
- Tách biệt hành động "Lưu câu trả lời" và "Xác nhận sẵn sàng" (READY) — 2 nút riêng, không
  gộp chung.

## Growth Checkpoint không được

- Hiển thị điểm số hoặc % dựa trên câu trả lời.
- Bắt buộc trả lời mới cho phép tiếp tục Journey khác — Growth Checkpoint không phải rào cản.
- Hiển thị câu trả lời của người học khác (không có tính năng xã hội/so sánh).

## Ví dụ đúng

```
Hôm nay bạn nhận ra điều gì?
→ "Mình nhận ra viết prompt rõ ràng quan trọng hơn mình nghĩ."

Điều gì bạn làm tốt hơn trước?
→ "Giờ mình viết email chỉ mất 5 phút thay vì 30 phút như trước."

[Lưu]  [Tôi đã sẵn sàng]
```

## Ví dụ sai

```
Điểm Growth của bạn: 8.5/10
Xếp hạng: Top 15% học viên
```

Sai vì: dùng điểm số và xếp hạng — vi phạm trực tiếp Growth Framework và Academy Constitution
nguyên tắc #5 ("Không đo điểm số, xếp hạng, hay chứng chỉ").
