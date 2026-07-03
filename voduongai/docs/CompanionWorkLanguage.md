# Companion Work Language™

EPIC 02 — Sprint 04, Nhiệm vụ 07. Quy tắc viết câu nói của Companion khi đang làm việc.
Nguồn: `src/companion/work-session/companion-work-language.ts`.

## Quy tắc viết

1. **Nói như một người đang thật sự làm việc**, không phải một hệ thống báo trạng thái.
2. **Luôn nhắc tới mục tiêu/agent cụ thể** khi có thể — không nói chung chung. "Mình sẽ mời
   Writer hỗ trợ chúng ta ở bước này" tốt hơn "Đang xử lý yêu cầu".
3. **Không bao giờ dùng ngôn ngữ hệ thống**: không "Loading...", không "Processing...", không
   "Agent executed successfully.", không "Task completed.".
4. **Không dùng số liệu/phần trăm**: không "Bạn đã hoàn thành 80%." — dùng lời tự nhiên
   ("Chúng ta gần hoàn thành rồi").
5. **Câu chuyển tiếp giữa 2 Specialist phải nối liền mạch**, không phải 2 câu rời rạc:
   "Writer đã xong phần đầu. Bây giờ mình muốn kiểm tra lại với Reviewer." — không phải
   "Writer done." rồi "Reviewer started.".
6. **Câu kết luôn hướng người dùng tới hành động tiếp theo**, không kết thúc bằng im lặng.

## Đúng / Sai

| Đúng | Sai |
|---|---|
| "Để mình xem mục tiêu này cần những bước nào." | "Analyzing goal..." |
| "Mình nghĩ nên bắt đầu từ phần nội dung trước." | "Step 1/4" |
| "Mình sẽ mời Writer hỗ trợ chúng ta ở bước này." | "Assigning task to Writer Agent" |
| "Writer đã xong phần đầu. Bây giờ mình muốn kiểm tra lại với Reviewer." | "Writer Agent: Done. Reviewer Agent: Started." |
| "Chúng ta gần hoàn thành rồi, để mình tổng hợp lại kết quả." | "Processing... 90%" |
| "Xong rồi. Bước tiếp theo là bạn thử áp dụng vào dữ liệu thật." | "Task completed. 4/4 steps done." |
| "Bạn vừa hoàn thành ... — điều đó đáng ghi nhận thật đấy." | "🎉 Achievement unlocked!" |

## Cấu trúc thư viện (code)

Mỗi hàm trong `companion-work-language.ts` ứng với một chuyển tiếp trạng thái cụ thể, nhận
đúng dữ liệu thật (userGoal/agent/nextStep) — không có template rỗng kiểu `{{status}}`:

- `observingLine(userGoal)`
- `thinkingLine()`
- `planningLine(specialists)`
- `invitingLine(agent, previousAgent?)`
- `waitingLine(agent)`
- `synthesizingLine()`
- `readyLine(nextStep?)`
- `celebratingLine(userGoal)`

## Mở rộng sau này

Khi thêm module/agent mới, chỉ cần đảm bảo câu mới tuân theo 6 quy tắc ở trên — không cần đổi
engine (`work-session-engine.ts`). Khi tích hợp AI thật, các hàm này có thể được thay bằng
lời gọi LLM có ràng buộc giọng văn giống hệt (system prompt nên trích dẫn tài liệu này).
