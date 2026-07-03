# Hero Standard

Chuẩn cho **Learning Hero** (Feature 01, Sprint 03) — phần đầu tiên người học nhìn thấy trên
mỗi Knowledge Seed. Component tương ứng: `src/features/knowledge/components/LearningHero.tsx`.

## Mục đích

Hero phải tạo động lực học trong 5 giây đầu tiên — người đọc phải biết ngay: đây có phải thứ
mình cần không, mất bao lâu, và mình đang ở đâu trong hành trình lớn hơn.

## Các field bắt buộc

| Field | Nguồn dữ liệu (`KnowledgeSeed`) | Quy tắc |
|---|---|---|
| Tiêu đề | `title` | Động từ + đối tượng cụ thể. VD: "Viết Email Chuyên Nghiệp bằng AI". Không dùng câu hỏi, không dùng tiêu đề mơ hồ. |
| Subtitle | `subtitle` | 1 câu, nêu lợi ích cụ thể + thời gian. VD: "Soạn email rõ ràng, xong trong vài phút thay vì nửa giờ." |
| Learning Outcome | `whatYouWillGain[]` | Xem `CKOS_Writing_Standard.md` — hiển thị ngay dưới Hero (Feature 02), không phải trong Hero. |
| Reading Time | tính từ nội dung thật (`estimateReadingMinutes` trong `KnowledgeWorkspace.tsx`) | Không hardcode; luôn tính từ độ dài nội dung thật để tránh sai lệch khi nội dung thay đổi. |
| Difficulty | `difficulty` (`BEGINNER` / `INTERMEDIATE` / `ADVANCED`) | Beginner = không cần biết AI trước đó. Advanced = cần đã hoàn thành ít nhất 1 Seed liên quan. |
| Skills | `skillsGained[]` | 2-4 kỹ năng, mỗi kỹ năng là 1 cụm động từ ngắn (VD: "Viết prompt có bối cảnh cụ thể"), không phải danh từ trừu tượng. |
| Collection | `collectionSlug` → tên Collection | Luôn hiển thị Collection đang thuộc — không để Seed đứng một mình không có bối cảnh. |
| Progress | Tính từ `computeCollectionProgress` | "X/Y Seed trong Collection" — không phải % của riêng Seed này. |

## Ví dụ đúng

```
AI OFFICE

Viết Email Chuyên Nghiệp bằng AI
Soạn email rõ ràng, đúng giọng văn, xong trong vài phút thay vì nửa giờ.

⏱ 30 phút trọn hành trình   🎯 BEGINNER   ✨ 3/8 Seed trong Collection

[Viết prompt có bối cảnh cụ thể] [Tự kiểm tra email trước khi gửi] [Xử lý hộp thư đến có quy trình]
```

## Ví dụ sai

```
Email Marketing Toàn Tập 2024 — Bí Kíp AI Đỉnh Cao!!!

Đọc ngay để không bỏ lỡ xu hướng viết email bằng AI hot nhất hiện nay!
```

Sai vì: tiêu đề giật tít, không có subtitle nêu lợi ích cụ thể, không có thời gian/độ khó/skills,
dùng dấu chấm than nhiều lần (FOMO).
