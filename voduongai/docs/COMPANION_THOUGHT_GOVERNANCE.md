# COMPANION_THOUGHT_GOVERNANCE — Sprint 18.6

"Companion học cách quản trị những điều mình sắp nói."

## Vì sao Companion cần governance

Tới Sprint 18.5, Companion đã có nhiều engine độc lập, mỗi engine đều
đúng trong phạm vi của nó: Proactive Thoughts, Daily Thought, Life
Moments, Story Matching, Micro Reactions, Greeting, Return After
Silence. Vấn đề không phải từng engine sai — vấn đề là khi nhiều engine
CÙNG đủ điều kiện hiển thị, không có lớp nào quyết định ai được nói
trước, ai im lặng. Không có governance, Companion có thể đồng thời chào
(Greeting) + chia sẻ một suy nghĩ (Thought) + nhắc một Life Moment — ba
giọng nói cùng lúc, dù mỗi giọng riêng lẻ đều "ấm áp".

## "Nói đúng" chưa đủ — phải "nói đúng lúc"

Một câu nói đúng nhưng nói sai lúc vẫn làm hỏng cảm giác đồng hành. Một
người bạn thật biết nhường lời: nếu vừa nói "chúc mừng sinh nhật", họ
không nói thêm "chào bạn" ngay sau đó như không có gì xảy ra. Thought
Governance (`thought-governance.ts`) chỉ làm một việc: trong số các
moment đang đủ điều kiện, chọn MỘT để nói, còn lại im lặng — dựa trên
mức độ ý nghĩa, không dựa trên thứ tự engine nào chạy trước.

## Phân loại các moment hiện có

| Loại | Engine | Bản chất |
|---|---|---|
| Life Moment | `life-moment-detector.ts` | Một dấu mốc thật trong hành trình (sinh nhật, 1 năm, quay lại sau im lặng) |
| Return After Silence | `growth-milestones.ts` + `ReturnAfterSilenceCeremony` | Một dạng Life Moment đặc biệt — mừng việc quay lại |
| Birthday | Life Moment | Một dạng Life Moment gắn ngày cụ thể |
| Origin Line | `origin-memory.ts` | Lời kể về điểm khởi đầu — tĩnh, không phải phản ứng tức thời |
| Story Moment | `story-matching-engine.ts` | Kể lại một câu chuyện cũ đã lưu |
| Daily Thought | `daily-thought-source.ts` + `daily-thought-library.ts` | Một suy nghĩ hiếm, gắn ngữ cảnh ngày |
| Proactive Thought | `proactive-thought-engine.ts` | Phản ứng ambient với tín hiệu route/garden/reflection hiện tại |
| Greeting | `CompanionGreetingBubble` | Lời chào khi mở/quay lại Portal |
| Micro Reaction | `micro-reaction-engine.ts` | Phản ứng rất nhẹ khi người dùng chạm vào Companion |
| Soulful Silence | (không phải engine) | Lựa chọn hợp lệ khi không gì đủ ý nghĩa để nói |

## Priority Rules (NV02)

`MOMENT_PRIORITY_ORDER` trong `thought-governance.ts`:

1. Safety / Boundary *(dự trữ — chưa có engine cụ thể nào dùng, xem Technical Debt)*
2. Life Moment quan trọng
3. Return After Silence
4. Birthday
5. Origin Line
6. Story Moment
7. Daily Thought
8. Proactive Thought
9. Greeting
10. Micro Reaction
11. Soulful Silence

## Conflict Rules (NV03)

Governance KHÔNG dùng một ma trận xung đột riêng (sẽ là overbuild khi
mọi cặp xung đột đều rơi vào hai tier ưu tiên khác nhau). Thay vào đó,
`chooseCompanionMoment()` chỉ chọn DUY NHẤT moment có ưu tiên cao nhất
trong số các candidate đủ điều kiện — mọi candidate còn lại tự động bị
suppress. Điều này tự nhiên thực thi đúng các cặp đã liệt kê trong brief
(Birthday + Daily Thought, Return After Silence + Greeting, Story
Moment + Proactive Thought, Origin Line + Micro Reaction, Life Moment +
Greeting) vì mỗi cặp đều khác tier — "single active moment, ưu tiên cao
thắng" cho cùng kết quả mà không cần thêm một danh sách cặp để duy trì.

## Speech Budget (NV04)

`DEFAULT_SPEECH_BUDGET`: tối đa 3 moment "lớn" (major — Daily/Proactive
Thought, Story Moment) mỗi session (`sessionStorage`), tối đa 6 mỗi ngày
(`localStorage`, reset theo ngày UTC). Micro Reaction và Greeting không
tính vào budget — chúng quá nhẹ để coi là "Companion nói nhiều". Life
Moment, Return After Silence, và Birthday được phép vượt budget — Life
Moments Engine đã tự giới hạn `maxOncePerDay` ở chính nó (Sprint 18.1),
nên không cần giới hạn chồng thêm ở đây.

## Soulful Silence được bảo vệ thế nào (NV08, kế thừa Sprint 18.5)

`chooseCompanionMoment()` trả về `"soulful-silence"` khi: (1) không
candidate nào đủ điều kiện, HOẶC (2) có candidate đủ điều kiện nhưng
Speech Budget đã hết. Im lặng luôn là kết quả hợp lệ, không phải lỗi —
không có đường nào trong code coi `"soulful-silence"` là một trường hợp
cần xử lý đặc biệt hay thông báo.

## Copy Boundary (NV06)

Không câu nào ở bất kỳ engine nào được nói: "Mình có quá nhiều điều
muốn nói", "Bạn bỏ lỡ", "Bạn nên", "Hãy quay lại mỗi ngày". Speech
Budget là một quyết định ÂM THẦM — người dùng không bao giờ được Companion
nhắc rằng nó đang "tiết kiệm lời nói". Ranh giới này được giữ bằng cách
không thêm bất kỳ copy mới nào cho governance — governance chỉ quyết định
CÓ nói hay không, không tự viết thêm câu nào.

## Integration (NV05)

Đã tích hợp trong `CompanionPresence.tsx`: trước khi `setThought`/`setStory`
thực sự hiển thị một moment "lớn", gọi `chooseCompanionMoment()` để kiểm
tra Speech Budget; nếu qua được, gọi `recordMajorMomentShown()`. Greeting
bị suppress khi `thought` hoặc `story` đang hiện (ưu tiên thấp hơn).

**Technical debt được ghi nhận, không che giấu**: Life Moment, Return
After Silence, và Birthday hiện vẫn render độc lập ở `layout.tsx`
(`LifeMomentBubble`, `ReturnAfterSilenceCeremony`) — KHÔNG đi qua
`chooseCompanionMoment()`, vì chúng là server component ở tầng layout,
tách biệt cây client-state của `CompanionPresence`. Việc thật sự nối hai
tầng này cần một coordinator chia sẻ state qua client/server boundary —
đó là một refactor cấu trúc, vượt khỏi phạm vi "Integration Light" của
Sprint này. Rủi ro thực tế hiện tại thấp vì Life Moments đã tự giới hạn
1 lần/ngày và không xảy ra cùng lúc với Thought/Story trong phần lớn
trường hợp thực tế — nhưng đây là điểm cần khép lại khi Sprint tương lai
thực sự cần governance đầy đủ.

*Liên quan: `docs/DAILY_THOUGHT_ENGINE.md`,
`docs/COMPANION_PROACTIVE_THOUGHTS.md`, `docs/LIFE_MOMENTS_ENGINE.md`,
`thought-governance.ts`, `CompanionPresence.tsx`.*
