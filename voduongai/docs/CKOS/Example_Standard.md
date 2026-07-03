# Example Standard

Chuẩn cho **Real Example** (Feature 07, Sprint 03). Component: `RealExample.tsx`,
util `split-before-after.ts`. Field nguồn: `example` (string dạng `"Trước: ... Sau: ..."`).

## Mục đích

Chứng minh giá trị bằng số liệu thật, không phải lời hứa. Người đọc phải tự nhủ
"À, đúng là tiết kiệm được thật" chứ không phải "nghe có vẻ hay".

## 3 dạng Example được chấp nhận

1. **Before → After** — "Trước: [tình huống cũ, có số liệu]. Sau: [tình huống mới, có số liệu]."
2. **Không dùng AI → Có AI** — dùng khi Seed so sánh quy trình thủ công vs. có AI hỗ trợ.
3. **Sai → Đúng** — dùng khi Seed dạy một kỹ năng dễ làm sai (VD: viết prompt, cấu trúc dữ liệu).

Chỉ chọn **1 trong 3 dạng** cho mỗi Seed — không trộn lẫn nhiều dạng trong cùng 1 Example.

## Quy tắc bắt buộc

1. Vế "Trước" (hoặc "Không dùng AI"/"Sai") phải có **số liệu thời gian hoặc số lượng cụ thể**
   (VD: "mất 30 phút", "2 ngày", "1-2 việc bị bỏ sót").
2. Vế "Sau" (hoặc "Có AI"/"Đúng") phải có kết quả **đo lường được**, không phải cảm nhận chung
   chung ("nhanh hơn nhiều" ❌ / "còn 5 phút" ✅).
3. Cả hai vế phải mô tả **cùng một công việc cụ thể**, không phải hai tình huống khác nhau.
4. Format lưu trong data: `"Trước: <câu>. Sau: <câu>."` — đúng 2 từ khoá `Trước:` và `Sau:` để
   `splitBeforeAfter()` parse tự động thành 2 card hiển thị song song.

## Ví dụ đúng

```
Trước: mất 30 phút soạn và chỉnh sửa một email báo cáo khách hàng. Sau: soạn nháp bằng AI
trong 2 phút, chỉnh sửa 3 phút — tổng 5 phút, vẫn giữ đúng giọng văn chuyên nghiệp.
```

Có số liệu cụ thể ở cả 2 vế, cùng mô tả một việc (soạn email báo cáo khách hàng).

## Ví dụ sai

```
Trước: viết email rất tốn thời gian và mệt mỏi. Sau: dùng AI giúp công việc nhẹ nhàng và
hiệu quả hơn rất nhiều.
```

Sai vì: không có số liệu cụ thể ở cả 2 vế ("rất tốn thời gian", "hiệu quả hơn rất nhiều" là
cảm nhận, không đo lường được) — không parse được thành Before/After có giá trị thật.
