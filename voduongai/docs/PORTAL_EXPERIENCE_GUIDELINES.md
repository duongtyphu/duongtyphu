# Portal Experience Guidelines

Tài liệu chính thức về trải nghiệm và giọng nói của VO DUONG AI Portal.
Mọi Sprint sau khi viết UI/copy mới đều phải tuân theo tài liệu này.

Nguồn copy đang dùng: `src/lib/portal/warmth-engine.ts` (Warmth Engine) và
`src/lib/portal/human-flow.ts` (Human Flow Engine). Không hardcode copy rải
rác trong component — thêm câu mới vào hai file này.

## 1. Portal Personality

Portal là một người đồng hành trưởng thành, không phải một sản phẩm số.

- Bình tĩnh — không hối thúc, không cảnh báo gấp gáp.
- Khiêm tốn — không khoe AI, không khoe kiến thức.
- Thông thái — nói ít, đúng lúc, đúng việc.
- Kiên định — luôn ở đó, không thay đổi tính cách theo từng tính năng.
- Ấm áp — luôn đứng về phía người dùng.
- Đồng hành — nói "chúng ta", không chỉ "bạn".
- Không phán xét, không tạo áp lực, không bán hàng.

## 2. Voice & Tone

Giọng nói của một người bạn trưởng thành — không giống chatbot, không giống
trợ lý máy móc.

| Tình huống | Không dùng | Dùng |
|---|---|---|
| Chưa hoàn thành | "Bạn chưa hoàn thành." | "Bạn đã đi được một đoạn đường. Chúng ta cùng hoàn thành phần còn lại nhé." |
| Báo lỗi | "Sai rồi." | "Có lẽ chúng ta có thể thử một cách khác." |
| Nhắc nhở | "Bạn phải học ngay." | "Khi bạn sẵn sàng, mình sẽ luôn đồng hành." |

## 3. Emotion Design

Mỗi màn hình nên trả lời được 3 câu hỏi của người dùng:

1. Tôi đang ở đâu?
2. Tôi nên làm gì tiếp theo?
3. Tôi đang trưởng thành hơn như thế nào?

Cảm xúc thiết kế nên ưu tiên: bình yên → động lực → tự hào — theo đúng thứ
tự này, không đảo ngược (không tạo động lực bằng áp lực, không tạo tự hào
bằng so sánh với người khác).

## 4. Warmth Principles

- Ghi nhận sự cố gắng trước, kết quả sau.
- Không ăn mừng bằng hiệu ứng — ăn mừng bằng sự chân thành.
- Khi người dùng vắng mặt lâu, không trách — chỉ đón nhận.
- Mọi lời động viên phải đúng với những gì người dùng thực sự đã làm,
  không thổi phồng.

## 5. Writing Style

- Câu ngắn, ngắt dòng tự nhiên (`\n`) thay vì câu dài một mạch.
- Xưng "chúng ta" khi nói về hành trình, "bạn" khi nói về điều cá nhân.
- Không dùng dấu chấm than để tạo cảm giác gấp gáp.
- Không dùng từ ngữ kỹ thuật/AI hóa ("thuật toán", "tối ưu", "dữ liệu của bạn")
  trong copy hướng tới cảm xúc.

## 6. Microcopy Rules

- Mỗi hành động nhỏ (lưu prompt, hoàn thành bài học, lưu workflow) đều có
  một câu xác nhận mang ý nghĩa, không chỉ "Đã lưu."
- Không lặp lại đúng một câu nhiều lần liên tiếp — Warmth Engine chọn ngẫu
  nhiên trong một nhóm câu cùng ý nghĩa.
- Welcome message thay đổi theo trạng thái quay lại của người dùng
  (ngày đầu / mới quay lại / quay lại sau thời gian dài / bình thường),
  không dùng một câu "Welcome back" cố định.

## 7. Things We Never Say

- "Bạn chưa hoàn thành" / "Bạn đang chậm tiến độ."
- "Sai rồi" / "Thất bại."
- "Bạn phải..." / "Bạn cần..." mang tính ép buộc.
- Bất kỳ ngôn ngữ tạo cảm giác cạnh tranh, xếp hạng hạ thấp người dùng,
  hoặc thúc đẩy mua hàng bằng nỗi sợ bỏ lỡ.

## 8. Things We Always Encourage

- Công nhận bước nhỏ đã đi qua trước khi nói về bước tiếp theo.
- Luôn gợi ý một bước tiếp theo cụ thể, không để người dùng tự hỏi
  "Bây giờ làm gì?"
- Hỏi người dùng đôi khi, thay vì luôn chỉ dạy (Reflection Moments).
- Cho người dùng quyền nghỉ ngơi mà không cảm thấy tội lỗi.
