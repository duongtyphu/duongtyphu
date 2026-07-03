# Capability Framework

Mô hình 5 tầng thay thế hoàn toàn cách chấm điểm truyền thống (0-100, A/B/C, đậu/rớt).

```
Knowledge
    ↓
Practice
    ↓
Capability
    ↓
Confidence
    ↓
Growth
```

## Định nghĩa từng tầng

| Tầng | Định nghĩa | Trạng thái | Nguồn dữ liệu |
|---|---|---|---|
| **Knowledge** | Người học đã tiếp cận nội dung Knowledge Seed (đọc Guide, xem Prompt/Example). | Đã tiếp cận / Chưa tiếp cận | CKOS — `computeSeedProgress` (đã có) |
| **Practice** | Người học đã làm 1 lần theo hướng dẫn — có thể vẫn cần xem lại Guide. | Đã thử / Chưa thử | Assignment/Practice log (Academy, chưa xây trong Sprint này) |
| **Capability** | Người học làm được lần thứ 2 mà không cần xem lại Guide. | Đạt / Chưa đạt | Growth Check tự đánh giá (không chấm tự động) |
| **Confidence** | Người học tự tin làm mà không cần kiểm tra lại kết quả trước khi dùng. | Tự nhận | Growth Check |
| **Growth** | Người học áp dụng được kỹ năng này sang tình huống khác ngoài Lesson gốc. | Tự nhận | Growth Check + Reflection |

## Vì sao không dùng mô hình chấm điểm

1. **Điểm số đo trí nhớ, không đo năng lực.** Trả lời đúng câu hỏi trắc nghiệm không chứng
   minh người học làm được việc thật.
2. **Điểm số tạo áp lực so sánh**, đi ngược nguyên tắc Companion "không giáo điều, không sáo
   rỗng, không tạo FOMO" đã thiết lập từ CKOS.
3. **Năng lực không tuyến tính** — một người có thể "làm được" (Capability) nhưng chưa "tự tin"
   (Confidence) vì mới làm 1 lần; ngược lại một số kỹ năng tự tin ngay từ đầu nếu có nền tảng
   liên quan. Thang điểm 0-100 không mô tả được sự phi tuyến này; mô hình 5 tầng thì có, vì
   mỗi tầng độc lập, không cộng dồn thành 1 con số duy nhất.

## Cách tầng này chuyển hoá thành trải nghiệm

- Một người học có thể dừng ở tầng Knowledge với 1 Lesson (đã đọc nhưng chưa thực hành) — đó
  không phải "thất bại", chỉ là chưa đi tiếp.
- Growth chỉ đạt được sau khi đã đi qua đủ Practice → Capability → Confidence — không có
  đường tắt "Knowledge → Growth" bỏ qua thực hành, đúng theo Learning Philosophy.
- Academy không tự động nâng tầng cho người học (không có thuật toán "phát hiện năng lực") —
  người học tự xác nhận qua Growth Check (xem `Growth_Framework.md`), Companion chỉ đặt câu
  hỏi đúng lúc.

## Liên hệ với Lesson Blueprint

Mỗi phần trong Lesson (xem `Lesson_Blueprint.md`) ánh xạ vào đúng 1 tầng của Capability
Framework:

| Phần trong Lesson | Tầng Capability |
|---|---|
| Knowledge Reference (CKOS) | Knowledge |
| Practice | Practice |
| Assignment | Practice → Capability (làm lần 2 trên việc thật) |
| Reflection + Companion Reflection | Capability → Confidence |
| Growth Check | Growth |
