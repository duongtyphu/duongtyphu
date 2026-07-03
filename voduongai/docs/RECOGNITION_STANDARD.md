# Recognition Standard

EPIC 02 — Sprint 04.5, Nhiệm vụ 07. Growth Recognition — cách Companion ghi nhận sự trưởng
thành của người dùng, không dùng ngôn ngữ đo lường/hệ thống.

## Nguyên tắc cốt lõi

> Không: "100%". Không: "Completed".
> Mà: "Hôm nay mình thấy bạn...". "Bạn vừa vượt qua...". "Điều mình thích nhất...".

Recognition khác Unlock: Unlock là "có thứ mới xuất hiện"; Recognition là "Companion ghi nhận
điều người dùng vừa làm", có thể không đi kèm bất kỳ Unlock nào.

## Cấm tuyệt đối trong ngôn ngữ Recognition

- Số phần trăm ("100%", "Bạn đã hoàn thành 80%")
- Từ "Completed"/"Done"/"Hoàn thành" đứng một mình không có ngữ cảnh cảm xúc
- So sánh với người khác ("Bạn giỏi hơn 90% người dùng khác")
- Đếm số lượng thuần tuý ("Bạn đã làm 5 Mission") — nếu nhắc số lượng, phải gắn với Ý NGHĨA của
  con số đó, không phải bản thân con số

## Cấu trúc một câu Recognition (3 dạng chuẩn)

### Dạng 1 — Quan sát ("Hôm nay mình thấy bạn...")
Companion nhận xét một hành vi/thái độ cụ thể vừa quan sát được, không phải kết quả đo lường.

> "Hôm nay mình thấy bạn kiên nhẫn hơn hẳn lúc mới bắt đầu."
> "Hôm nay mình thấy bạn tự tin hỏi một câu khó hơn mọi khi."

### Dạng 2 — Cột mốc vượt qua ("Bạn vừa vượt qua...")
Dùng khi người dùng hoàn thành một thử thách cụ thể (Mission khó, lần đầu áp dụng vào việc
thật, quay lại sau một thời gian dài vắng mặt).

> "Bạn vừa vượt qua phần khó nhất của Mission này."
> "Bạn vừa vượt qua chính nỗi ngại khi lần đầu thử việc này."

### Dạng 3 — Điều Companion thích ("Điều mình thích nhất...")
Companion chọn MỘT chi tiết cụ thể (không chung chung) để nói ra là điều nó ấn tượng.

> "Điều mình thích nhất là cách bạn tự sửa lại prompt sau lần thử đầu chưa ổn."
> "Điều mình thích nhất là bạn không bỏ qua bước Reflection, dù nó không bắt buộc."

## Khi nào Recognition xuất hiện (không lạm dụng)

- Sau khi hoàn thành một Mission/Seed/Collection — không phải sau MỌI hành động nhỏ (click,
  xem trang) — tránh cảm giác "hệ thống khen liên tục cho có".
- Sau khi Work Session chuyển từ `READY` sang `CELEBRATING` (đã có cơ chế ở Sprint 04,
  `celebrateWorkSession()`) — đây là điểm nối tự nhiên nhất, Recognition line thay thế/nối tiếp
  `celebratingLine()` trong `companion-work-language.ts`.
- Khi quay lại sau một khoảng vắng mặt dài (tái dùng tín hiệu ở `first-meeting.ts`).
- Không xuất hiện dồn dập nhiều Recognition liên tiếp trong cùng một phiên.

## Recognition khác Celebration engine hiện có như thế nào

`CELEBRATING` (Companion Work Session, Sprint 04) là MỘT trạng thái kỹ thuật trong vòng đời một
Work Session. Recognition Standard là NGÔN NGỮ dùng khi ở trạng thái đó (và ở các khoảnh khắc
ghi nhận khác ngoài Work Session, ví dụ Growth Checkpoint có sẵn từ Sprint 02). Recognition
Standard không thêm state machine mới — nó là bộ quy tắc viết áp dụng vào các điểm ghi nhận đã
có sẵn.

## Đúng / Sai

| Đúng | Sai |
|---|---|
| "Hôm nay mình thấy bạn tự tin hơn khi viết prompt." | "Task Completed! 100%" |
| "Bạn vừa vượt qua bước khó nhất trong Mission này." | "Bạn đã hoàn thành 4/4 bước." |
| "Điều mình thích nhất là cách bạn không bỏ cuộc ở phần khó." | "Great job! Achievement unlocked." |

## Ranh giới

- Recognition không thay thế Growth Checkpoint (`Growth_Checkpoint_Standard.md`, Academy Sprint
  02) — Growth Checkpoint là câu hỏi phản tư MỞ do người dùng tự trả lời; Recognition là câu
  Companion CHỦ ĐỘNG nói ra ghi nhận, hai cơ chế khác nhau, có thể xảy ra cạnh nhau.
- Recognition dùng chung nguyên tắc viết với `COMPANION_UNLOCK_LANGUAGE.md`/
  `CompanionWorkLanguage.md` (không ngôn ngữ hệ thống, luôn cụ thể) nhưng phục vụ khoảnh khắc
  riêng — không gộp chung thư viện câu khi implement.
