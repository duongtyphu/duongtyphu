# Reflection Template

Xem quy tắc đầy đủ: `../Reflection_Standard.md`

3 câu hỏi cố định mỗi Seed — câu 1 và 3 giữ nguyên toàn hệ thống, chỉ câu 2 thay đổi theo Seed:

```yaml
# Câu 1 — cố định (không edit, template dựng tự động từ title)
question_1: "Hôm nay bạn học được gì từ '[title]'?"

# Câu 2 — riêng của Seed này
reflectionQuestions:
  - "[Câu hỏi cụ thể về áp dụng — gắn với nội dung Seed]"

# Câu 3 — cố định (không edit)
question_3: "Điều gì còn chưa rõ với bạn?"
```

**Ví dụ điền mẫu:**

```yaml
question_1: "Hôm nay bạn học được gì từ 'Viết Email Chuyên Nghiệp bằng AI'?"
reflectionQuestions:
  - "Bạn sẽ áp dụng điều vừa học vào công việc nào hôm nay?"
question_3: "Điều gì còn chưa rõ với bạn?"
```

Checklist trước khi coi Reflection đã hoàn chỉnh:
- [ ] Đúng 3 câu hỏi, không nhiều/ít hơn
- [ ] Câu 2 cụ thể theo đúng nội dung Seed, không dùng câu chung chung
- [ ] Không dùng textarea dài — chỉ ô trả lời ngắn 3 dòng
