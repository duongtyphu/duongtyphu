# Practice Framework

Quy định bắt buộc cho phần Practice trong mỗi Lesson — kế thừa trực tiếp Exercise Standard
của CKOS (`docs/CKOS/Exercise_Standard.md`), không hạ chuẩn.

## Practice phải

| Tiêu chí | Quy định |
|---|---|
| **Ngắn** | 5-15 phút — không dài hơn, không ngắn hơn (đúng ngưỡng đã thiết lập ở CKOS Exercise Standard). |
| **Thực tế** | Dùng tình huống/dữ liệu có thật, không phải ví dụ trừu tượng ("giả sử bạn là..."). |
| **Làm ngay** | Không cần chuẩn bị thêm ngoài những gì đã liệt kê ở Preparation (Lesson Blueprint, phần 2). |
| **Có kết quả** | Sinh ra 1 sản phẩm cụ thể kiểm tra được (1 email, 1 công thức, 1 đoạn văn) — không kết thúc bằng "đã hiểu hơn". |

## Practice không được là

- Câu hỏi trắc nghiệm (multiple choice).
- Bài tập lý thuyết ("Hãy giải thích khái niệm X").
- Mô phỏng không có kết quả thật (VD: "tưởng tượng bạn viết email cho khách hàng" mà không
  yêu cầu viết ra thật).
- Yêu cầu công cụ/tài khoản người học chưa chắc có sẵn (vi phạm "làm ngay").

## Quan hệ với Assignment (Lesson Blueprint, phần 5)

Practice và Assignment đều là hành động thật, khác nhau ở mức độ cá nhân hoá:

```
Practice   = Làm thử theo tình huống Lesson đưa ra (có thể dùng ví dụ đã chuẩn bị sẵn)
Assignment = Áp dụng đúng vào công việc thật, riêng của người học (không dùng ví dụ có sẵn)
```

Một Lesson **luôn có Practice**; Assignment là bước tiếp theo, sâu hơn, cũng bắt buộc theo
Lesson Blueprint nhưng có thể linh hoạt hơn về thời điểm hoàn thành (người học có thể áp dụng
Assignment vào công việc thật ngay trong ngày, không nhất thiết ngay lúc học).

## Ví dụ đúng (kế thừa từ CKOS Exercise đã có)

> "Viết 3 phiên bản của cùng một email (trang trọng, thân thiện, ngắn gọn) bằng AI, rồi chọn
> bản phù hợp nhất với người nhận thật." (Seed: Viết Email Chuyên Nghiệp bằng AI)

Đây đã là Practice đạt chuẩn — Academy tái sử dụng nguyên field `exercise` từ CKOS, không viết
lại.

## Ví dụ sai

> "Đọc lại phần Hướng dẫn và tóm tắt 3 điều bạn học được."

Sai vì: đây là hoạt động đọc lại, không phải hành động thực hành có sản phẩm đầu ra mới.
