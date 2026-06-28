# DAILY_THOUGHT_ENGINE — Sprint 18.5

"Companion bắt đầu có những suy nghĩ của riêng mình."

## First Principle

Daily Thought KHÔNG phải Quote Engine, KHÔNG phải Notification, KHÔNG
phải Marketing Banner, KHÔNG phải AI Tips, KHÔNG phải Random Message.
Daily Thought LÀ một suy nghĩ tự nhiên của Companion.

| | Daily Thought | Quote | Greeting | Notification | Story |
|---|---|---|---|---|---|
| Nguồn | Một điều Companion vừa nghĩ tới, gắn với ngữ cảnh thật (Garden, Reflection, Memory,...) | Trích dẫn của người khác, không gắn ngữ cảnh | Lời chào khi mở Portal/comeback | Một sự kiện hệ thống cần biết | Một câu chuyện đã lưu, kể lại nguyên vẹn |
| Mục đích | Đồng hành, phản chiếu | Truyền cảm hứng | Chào hỏi | Thông tin | Ghi nhớ |
| Tần suất | Hiếm — phần lớn là im lặng (Soulful Silence) | Có thể lặp lại, không giới hạn | Mỗi lần mở/quay lại | Khi có sự kiện | Khi có câu chuyện phù hợp |
| Giọng | "Mình vừa nghĩ..." — của riêng Companion | Giọng của tác giả khác | "Chào bạn..." | Trung lập, thông báo | Kể lại, không phải suy nghĩ mới |

## Daily Thought vs. Proactive Thoughts (Sprint 13.1)

Đây là sự khác biệt quan trọng nhất về kiến trúc, vì cả hai đều là
"Companion tự nói một điều không được hỏi" — nhưng KHÔNG phải hai hệ
thống nói trùng nhau:

- **Proactive Thoughts (13.1) là Delivery Engine** — cơ chế quyết định
  *có nói hay không, nói lúc nào, cooldown, chống lặp, im lặng khi nào*
  (`proactive-thought-engine.ts`). Đây vẫn là cơ chế DUY NHẤT của Portal
  cho việc Companion chủ động nói.
- **Daily Thought (18.5) là một Thought Source mới**, đăng ký vào đúng
  Delivery Engine đó (`ALL_THOUGHTS` trong `proactive-thought-engine.ts`
  gộp cả `PROACTIVE_THOUGHTS` và `DAILY_THOUGHTS`). Daily Thought không
  có cooldown riêng, không có storage riêng, không có bubble riêng —
  toàn bộ những thứ đó dùng lại nguyên vẹn từ Sprint 13.1.
- Khác biệt là ở **chất liệu của suy nghĩ**: Proactive Thoughts phản ứng
  với tín hiệu route/garden/reflection hiện tại ("ambient nudge"); Daily
  Thought là một suy nghĩ có nguồn rộng hơn (Garden, Reflection, Story,
  Memory, Journey, Knowledge, Life Moments, Origin Memory, Companion
  Chapter — xem `daily-thought-source.ts`) và được gate bởi
  `shouldShowDailyThoughtToday()` để hiếm hơn nhiều so với một Proactive
  Thought thông thường.

Một Delivery Engine. Nhiều Thought Sources.

## Kiến trúc

```
daily-thought-source.ts     → ThoughtSource, ThoughtContext, ThoughtFrequency,
                               mapContextToSource(), shouldShowDailyThoughtToday()
daily-thought-library.ts    → DAILY_THOUGHT (50+ câu), mỗi câu gắn một ThoughtSource
proactive-thought-engine.ts → đăng ký DAILY_THOUGHTS vào ALL_THOUGHTS, gate riêng
                               cho trigger "daily-thought" trước khi vào weightedPick()
src/app/portal/layout.tsx   → dựng ThoughtContext từ dữ liệu đã fetch sẵn
                               (lifeMoment, returnAfterSilenceMilestone), truyền
                               xuống PortalShell → CompanionPresence
```

## Thought Selector (NV03)

Mỗi lần Portal mở, Daily Thought không phải lúc nào cũng có gì để nói.
Tỉ lệ "có suy nghĩ" vs. "im lặng" KHÔNG hardcode trong logic chọn — được
định nghĩa bằng config `DAILY_THOUGHT_FREQUENCY` (`daily-thought-source.ts`),
mặc định `showProbability: 0.3`. Đổi tỉ lệ chỉ cần đổi config, không sửa
engine.

## Thought Context Mapping (NV05)

`mapContextToSource(context)` ánh xạ ngữ cảnh hiện tại sang một nguồn cụ
thể, ưu tiên tín hiệu hiếm/ý nghĩa hơn (sinh nhật, quay lại sau im lặng,
mirror năm, Origin) trước tín hiệu thường gặp (Garden, Reflection). Nếu
không có tín hiệu nào, trả về `null` — Daily Thought không random hoàn
toàn khi không có gì để nói thật.

## Soulful Silence (NV08)

Mặc định, Daily Thought hoàn toàn im lặng. Có Thought chỉ khi: (1)
`mapContextToSource()` tìm được một nguồn phù hợp, VÀ (2)
`shouldShowDailyThoughtToday()` qua được tỉ lệ config. Im lặng tự nó là
một hành động hợp lệ — không phải lỗi, không phải fallback.

## Thought History (NV07)

Không có DB mới, không có storage mới. Dùng lại nguyên vẹn
`sessionStorage` đã có ở `proactive-thought-engine.ts`
(`companion-proactive-session-shown-ids`, `companion-proactive-last-shown-at`)
— mỗi Daily Thought có `cooldownMs` ~20 giờ, đủ để không lặp lại trong
cùng một ngày, đủ nhẹ để không cần một hệ thống lưu trữ riêng.

## Boundary (bắt buộc)

Daily Thought KHÔNG được: bán hàng, quảng bá khoá học, CTA, "click vào
đây", quảng cáo, ép tương tác. Daily Thought chỉ phục vụ: sự hiện diện,
sự đồng hành, sự phản chiếu, sự trưởng thành. Mọi câu trong
`daily-thought-library.ts` được viết theo ranh giới này — không câu nào
nhắm tới hành động.

*Liên quan: `docs/COMPANION_PROACTIVE_THOUGHTS.md`,
`docs/product-bible/BOOK_DAILY_THOUGHT.md`, `proactive-thoughts.ts`,
`proactive-thought-engine.ts`, `daily-thought-source.ts`,
`daily-thought-library.ts`.*
