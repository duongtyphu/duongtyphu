# Prompt Template

Xem quy tắc đầy đủ: `../Prompt_Standard.md`

```yaml
samplePrompt: >
  "[Role ngầm định] + [Goal] + [Input trong ngoặc vuông] + [Constraints]."

promptTips:
  - "[Mẹo thực chiến 1]"
  - "[Mẹo thực chiến 2]"

promptExampleInput: "[Input thật, đã điền biến cụ thể — không để [ngoặc vuông] trống]"
promptExampleOutput: "[Output thật AI sẽ trả về cho input trên]"

prompts: # Prompt Pack — tối thiểu 5
  - "[Prompt 1 — biến thể chính]"
  - "[Prompt 2 — biến thể tình huống khác]"
  - "[Prompt 3 — biến thể tình huống khác]"
  - "[Prompt 4 — biến thể tình huống khác]"
  - "[Prompt 5 — biến thể tình huống khác]"
```

**Ví dụ điền mẫu:**

```yaml
samplePrompt: >
  "Viết giúp tôi một email ngắn gọn, lịch sự, gửi tới [tên người nhận] để xin phản hồi về
  [nội dung đã trao đổi] sau cuộc họp ngày [ngày]. Giọng văn chuyên nghiệp, không thúc ép."

promptTips:
  - "Luôn nêu rõ người nhận và mục đích ngay trong prompt."
  - "Yêu cầu độ dài cụ thể (ví dụ: dưới 100 từ) để tránh AI viết dài dòng."

promptExampleInput: "Viết email xin phản hồi sau cuộc họp với anh Minh (Trưởng phòng Kinh
  doanh) về đề xuất ngân sách quý 3, giọng lịch sự không thúc ép."
promptExampleOutput: "Chào anh Minh, cảm ơn anh đã dành thời gian trao đổi hôm qua về đề
  xuất ngân sách quý 3. Em muốn xin phản hồi của anh khi có thời gian để em kịp hoàn thiện
  bản kế hoạch. Em cảm ơn anh nhiều."

prompts:
  - "Viết giúp tôi một email ngắn gọn, lịch sự, gửi tới [tên người nhận] để xin phản hồi về
    [nội dung] sau cuộc họp ngày [ngày]. Giọng văn chuyên nghiệp, không thúc ép."
  - "Viết email xin lỗi khách hàng vì giao hàng trễ [số ngày], giải thích ngắn gọn lý do và
    đề xuất hướng khắc phục."
  - "Viết email giới thiệu bản thân khi gia nhập nhóm mới, giọng thân thiện, không quá 80 từ."
  - "Viết email nhắc việc lịch sự cho đồng nghiệp về deadline [tên việc] sắp tới vào [ngày]."
  - "Viết email cảm ơn đối tác sau buổi hợp tác thành công, đề cập cụ thể kết quả [kết quả]."
```

Checklist trước khi coi Prompt đã hoàn chỉnh:
- [ ] Đủ 5 prompt trong Prompt Pack
- [ ] Mỗi prompt có biến trong `[ngoặc vuông]`
- [ ] Có ví dụ Input/Output thật (không để trống, không dùng "...")
- [ ] Có ít nhất 1-2 Prompt Tips thực chiến
