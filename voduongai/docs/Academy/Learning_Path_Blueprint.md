# Learning Path Blueprint

Định nghĩa cách một Learning Path trong Academy được **sinh ra từ CKOS**, không tạo độc lập.

## Chuỗi sinh Learning Path

```
CKOS Collection
      ↓
Knowledge Seed (đúng thứ tự seedSlugs[] hoặc theo Learning Path CKOS đã có)
      ↓
Lesson (Academy đóng khung 1 Seed thành 1 buổi thực hành)
      ↓
Practice
      ↓
Assignment
      ↓
Reflection
      ↓
Capability
```

## Nguyên tắc — không tạo Lesson độc lập

Một Learning Path trong Academy **luôn** bắt đầu từ việc chọn 1 CKOS Collection có sẵn (VD:
"AI Office"). Mỗi Knowledge Seed trong Collection đó tương ứng đúng 1 Lesson theo thứ tự đã
có trong `seedSlugs[]`. Academy không:

- Tự tạo thứ tự học khác với thứ tự CKOS đã định nghĩa (trừ khi CKOS Collection Guide cho
  phép tuỳ biến — cần quay lại sửa ở tầng CKOS, không vá ở tầng Academy).
- Tự thêm Lesson không tương ứng Seed nào.
- Gộp 2 Collection thành 1 Learning Path nếu CKOS chưa định nghĩa `relatedCollections`.

## Quan hệ 1-1 giữa CKOS và Academy

| Tầng CKOS | Tầng Academy tương ứng |
|---|---|
| Collection | Learning Path |
| Knowledge Seed | Lesson |
| `whatYouWillGain[]` | Learning Goal của Lesson |
| `guideSteps[]` + `samplePrompt` + `example` | Knowledge Reference (hiển thị lại, không viết mới) |
| `exercise` | Practice |
| (mới) — không có trong CKOS | Assignment (áp dụng Practice vào việc thật của người học, cụ thể hơn Exercise gốc) |
| `reflectionQuestions[]` + 2 câu cố định | Reflection |
| `companionNote` | Companion Reflection (mở rộng thêm phản hồi theo tiến độ thực hành, không thay thế) |
| (mới) | Growth Check |

## Learning Path hoàn thành khi nào

Một Learning Path (= 1 CKOS Collection) được coi là hoàn thành trong Academy khi toàn bộ
Lesson tương ứng đã đạt tầng **Capability** trở lên (không bắt buộc Confidence/Growth cho mọi
Lesson — nhưng khuyến khích). Đây là điều kiện khác — và nghiêm ngặt hơn — so với "Collection
Complete" của CKOS (vốn chỉ yêu cầu hoàn thành step tracking, tầng Knowledge).

## Không xây trong Sprint này

Theo phạm vi Sprint 01 (Foundation), tài liệu này **chỉ định nghĩa cấu trúc** — chưa có
Lesson UI, chưa có Assignment UI, chưa có cơ chế lưu Practice log. Đây là Blueprint cho Sprint
02 trở đi.
