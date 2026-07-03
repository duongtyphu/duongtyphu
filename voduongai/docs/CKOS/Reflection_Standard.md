# Reflection Standard

Chuẩn cho **Reflection** (Feature 11, Sprint 03). Component: `ReflectionBox.tsx`,
hook `use-seed-reflection.ts`. Field nguồn: `reflectionQuestions[]` (câu hỏi riêng của Seed).

## Mục đích

Reflection biến việc học thụ động thành nhận thức chủ động — và chuẩn bị dữ liệu cho tính
năng Nhật ký học tập trong tương lai (ngoài phạm vi CKOS, xem `CKOS_Blueprint.md` §8).

## Quy tắc bắt buộc

1. **Đúng 3 câu hỏi** cho mỗi Seed — không nhiều hơn, không ít hơn.
2. **Không dùng textarea dài** — mỗi câu hỏi có 1 ô trả lời ngắn (3 dòng), không phải form dài.
3. Cấu trúc 3 câu cố định:
   - Câu 1 (cố định toàn hệ thống): "Hôm nay bạn học được gì từ '[tên Seed]'?"
   - Câu 2 (riêng của từng Seed, lấy từ `reflectionQuestions[0]`): thường hỏi "sẽ áp dụng vào đâu"
   - Câu 3 (cố định toàn hệ thống): "Điều gì còn chưa rõ với bạn?"
4. Câu hỏi riêng của Seed (câu 2) phải cụ thể theo đúng nội dung Seed đó, không dùng câu hỏi
   chung chung dùng được cho mọi Seed.
5. Không chấm điểm, không đúng/sai — Reflection là không gian an toàn để người học thành thật.

## Ví dụ đúng (Seed "Viết Email Chuyên Nghiệp bằng AI")

```
1. Hôm nay bạn học được gì từ "Viết Email Chuyên Nghiệp bằng AI"?
2. Bạn sẽ áp dụng điều vừa học vào công việc nào hôm nay?
3. Điều gì còn chưa rõ với bạn?
```

Câu 2 cụ thể, gắn với hành động thật ("công việc nào hôm nay") thay vì hỏi chung chung.

## Ví dụ sai

```
1. Bạn nghĩ gì về bài học này?
2. Bạn có thích nội dung này không?
3. Bạn có góp ý gì không?
```

Sai vì: không hướng đến hành động cụ thể, giống khảo sát hài lòng hơn là công cụ học tập,
không giúp người học tự nhận ra mình sẽ làm gì tiếp theo.
