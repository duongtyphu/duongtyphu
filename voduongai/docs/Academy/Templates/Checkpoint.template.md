# Checkpoint Template

Xem quy tắc đầy đủ: `../Growth_Checkpoint_Standard.md`.

Growth Checkpoint chỉ mở khi Journey đạt giai đoạn `GROWTH` hoặc `READY` (xem `JourneyRules.md`).

```ts
{
  journeySlug: "[slug Collection/Journey]",
  noticedToday: "",     // câu trả lời tự do của người học — không để sẵn placeholder gợi ý
  improvedSince: "",    // câu trả lời tự do của người học
  updatedAt: "",        // ISO timestamp, ghi khi lưu
}
```

## 2 câu hỏi cố định (không thay đổi theo Journey)

1. "Hôm nay bạn nhận ra điều gì?"
2. "Điều gì bạn làm tốt hơn trước?"

Không thêm câu hỏi thứ 3, không tuỳ biến câu hỏi theo từng Collection — giữ nhất quán trải
nghiệm Growth Checkpoint xuyên suốt toàn bộ Academy (tương tự cách CKOS giữ nguyên 3 câu
Reflection cho mọi Knowledge Seed).

## Checklist trước khi coi Checkpoint hoàn chỉnh

- [ ] Không có chấm điểm/đúng-sai cho câu trả lời
- [ ] Nút "Tôi đã sẵn sàng" tách biệt với nút "Lưu" — lưu câu trả lời không đồng nghĩa xác
      nhận sẵn sàng (2 hành động độc lập)
- [ ] Checkpoint chỉ hiển thị khi giai đoạn Journey là `GROWTH` hoặc `READY`
