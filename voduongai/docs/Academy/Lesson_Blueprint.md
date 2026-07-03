# Lesson Blueprint

Cấu trúc chính thức của một Lesson trong Academy — đơn vị nhỏ nhất người học tương tác.

## 9 phần bắt buộc

```
1. Learning Goal
        ↓
2. Preparation
        ↓
3. Knowledge Reference (CKOS)
        ↓
4. Practice
        ↓
5. Assignment
        ↓
6. Reflection
        ↓
7. Companion Reflection
        ↓
8. Growth Check
        ↓
9. Next Lesson
```

## Định nghĩa từng phần

| # | Phần | Định nghĩa | Nguồn dữ liệu |
|---|---|---|---|
| 1 | **Learning Goal** | Kết quả cụ thể người học đạt được sau Lesson này — không phải chủ đề chung chung. | `KnowledgeSeed.whatYouWillGain[]` (CKOS) |
| 2 | **Preparation** | Điều kiện cần có trước khi bắt đầu (thời gian, công cụ, dữ liệu thật cần chuẩn bị). | Suy ra từ `estimatedTime` + `aiTools[]` (CKOS) |
| 3 | **Knowledge Reference** | Tham chiếu trực tiếp tới nội dung CKOS (Core Knowledge, Prompt, Example) — hiển thị lại, không viết mới. | `KnowledgeSeed` (toàn bộ Companion Content Standard) |
| 4 | **Practice** | Hành động ngắn, làm ngay, có kết quả — kế thừa `exercise` của CKOS nhưng có thể chia nhỏ hơn nếu Seed có nhiều bước thực hành riêng biệt. | `KnowledgeSeed.exercise` + `Practice_Framework.md` |
| 5 | **Assignment** | Áp dụng Practice vào đúng công việc thật của người học (không phải dữ liệu mẫu) — điều kiện hoàn thành là có sản phẩm đầu ra thật. | Mới ở tầng Academy — không có trong CKOS |
| 6 | **Reflection** | Người học tự nhận diện điều học được — kế thừa 3 câu hỏi Reflection của CKOS. | `KnowledgeSeed.reflectionQuestions[]` |
| 7 | **Companion Reflection** | Companion phản hồi ngắn dựa trên việc người học đã hoàn thành Practice/Assignment — không chấm điểm. | Rule-based, tương tự Companion Guide của CKOS |
| 8 | **Growth Check** | Câu hỏi giúp người học tự nhận 1 trong 4 dấu hiệu trưởng thành (xem `Growth_Framework.md`). | Mới ở tầng Academy |
| 9 | **Next Lesson** | Lesson tiếp theo trong Learning Path — tương ứng `nextSeeds[]`/thứ tự Collection của CKOS. | CKOS Knowledge Navigation (đã có) |

## Nguyên tắc thiết kế Lesson

1. **Không viết lại nội dung tri thức** — phần 3 (Knowledge Reference) luôn hiển thị lại dữ
   liệu CKOS, không paraphrase hay viết bản khác.
2. **Assignment khác Practice ở tính cá nhân hoá** — Practice có thể dùng ví dụ chung
   (email mẫu), Assignment bắt buộc dùng đúng công việc thật của người học (email thật họ
   đang cần gửi).
3. **Growth Check không phải bước bắt buộc để "qua bài"** — người học có thể bỏ qua, Academy
   không chặn tiến độ chỉ vì chưa trả lời Growth Check. Growth Check là công cụ tự nhận thức,
   không phải rào cản.
4. **Next Lesson luôn là 1 lựa chọn duy nhất** — kế thừa nguyên tắc "One Next Step" đã có từ
   CKOS, không hiển thị nhiều lựa chọn gây phân tán.

## Không xây trong Sprint này

Đây là Blueprint (định nghĩa cấu trúc dữ liệu/khái niệm), **không phải UI**. Theo phạm vi
Sprint 01, chưa tạo Lesson UI, chưa tạo Assignment UI — việc này thuộc Sprint 02 trở đi.
