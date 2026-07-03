# Checklist Standard

Chuẩn cho **Action Checklist** (Feature 09, Sprint 03). Component: `ActionChecklist.tsx`,
hook `use-checklist-tick.ts`. Field nguồn: `checklist[]` (string).

## Mục đích

Checklist không phải để đọc — phải để **tick**. Mỗi mục là một hành động người học thực hiện
xong thì đánh dấu, tạo cảm giác tiến triển thật (không phải cảm giác "đã đọc xong").

## Checklist phải là hành động — không phải lý thuyết

| ❌ Lý thuyết (sai) | ✅ Hành động (đúng) |
|---|---|
| "Hiểu rõ khái niệm bối cảnh trong prompt" | "Đã nêu rõ người nhận trong prompt" |
| "Nắm được quy trình xử lý email" | "Đã copy Prompt" |
| "Biết cách kiểm tra dữ liệu" | "Đã thử công thức trên mẫu nhỏ" |

## Quy tắc bắt buộc

1. Mỗi mục bắt đầu bằng một trong hai dạng:
   - Câu khẳng định hành động đã hoàn thành: "Đã copy Prompt", "Đã chỉnh Prompt", "Đã áp dụng"
   - Câu hỏi có/không kiểm tra được: "Đúng người nhận?", "Không lỗi chính tả?"
2. Số lượng: 3-5 mục. Ít hơn 3 thì không đủ để tạo cảm giác tiến triển; nhiều hơn 5 thì
   người học bỏ cuộc giữa chừng.
3. Mỗi mục phải kiểm tra được ngay lập tức bằng mắt/hành động — không cần suy nghĩ lâu để
   trả lời có/không.
4. Thứ tự các mục nên theo đúng trình tự thực hiện thật (không xáo trộn ngẫu nhiên).
5. Checklist khác với Step-by-Step Guide: Guide là *cách làm*, Checklist là *cách kiểm tra
   trước khi hoàn tất* — không lặp lại nội dung giữa hai phần.

## Ví dụ đúng — Checklist trước khi gửi email

```
☐ Đúng người nhận?
☐ Tiêu đề rõ ràng?
☐ Không lỗi chính tả?
☐ Đính kèm đầy đủ file?
☐ Giọng văn phù hợp?
```

## Ví dụ đúng — Checklist dạng hành động (mẫu chuẩn CKOS)

```
☐ Đã copy Prompt
☐ Đã thử Prompt
☐ Đã chỉnh Prompt
☐ Đã áp dụng
☐ Đã kiểm tra kết quả
```

## Ví dụ sai

```
☐ Hiểu được tầm quan trọng của email chuyên nghiệp
☐ Nắm được các nguyên tắc giao tiếp hiệu quả
☐ Có kiến thức nền tảng về AI
```

Sai vì: đây là mục tiêu học tập (Learning Outcome), không phải hành động kiểm tra được — không
ai có thể "tick" xong một khái niệm.
