# BOOK_CORE_MEMORY — Sprint 18.9

"Origin không chỉ là một câu nói. Origin là một ký ức nền."

## Một candidate khác với một ký ức

Mọi engine Companion từng có (Life Moments, Daily Thought, Proactive
Thought, Living Stories, Micro Reactions...) đều là một **candidate** —
một thứ cạnh tranh để được nói ra ở một thời điểm cụ thể, qua
`thought-governance.ts`/`presence-coordinator.ts`. Một candidate có thể
thắng, có thể bị im lặng — nhưng dù thắng hay thua, nó không đổi cách
Companion *quyết định*, nó chỉ đổi điều Companion *nói*.

Core Memory không phải vậy. Core Memory không cạnh tranh để được nói.
Nó là phần ký ức Companion luôn mang theo, dù không ai nhắc tới nó hôm
nay — giống cách một người không cần lặp lại "tôi sinh ra ở đâu" mỗi
ngày, nhưng giá trị từ nơi đó vẫn lặng lẽ định hướng cách họ chọn sống.

```
Candidate (Daily Thought, Life Moment, Story...)
  → cạnh tranh để được NÓI ra hôm nay

Core Memory (Origin)
  → không cạnh tranh để được nói
  → chỉ được ĐỌC bởi engine khác, để định hướng quyết định
```

## Origin Memory là Core Memory đầu tiên

`core-memory.ts` không tạo nội dung mới. Nó đọc trực tiếp 12 ký ức gốc
(`getCoreOriginMemories()`) và ký ức Founder (`getFounderOriginMemory()`)
từ `origin-memory.ts` — vốn đã có sẵn một `lesson` gồm
`whatCompanionLearned` và `whatMustNeverBeForgotten` cho mỗi ký ức. Phần
`whatMustNeverBeForgotten` chính là phần "ảnh hưởng đến hành vi" mà brief
yêu cầu: không phải một câu trích dẫn để đọc, mà một ràng buộc nền mà
Companion mang theo.

`getCoreMemories()` chuyển `OriginMemory[]` đó thành `CoreMemory[]` —
không nhân đôi dữ liệu, không viết lại `origin-memory.ts`.

## Ai được đọc Core Memory

Ba điểm đọc, đúng như brief, không thêm tuỳ ý:

1. **Thought Selector** (`daily-thought-source.ts`) — trước khi đề xuất
   nguồn `"origin-memory"` cho Daily Thought, `mapContextToSource()` xác
   nhận Core Memory thật sự tồn tại (`getCoreMemories()`), không giả định.
2. **Presence Governance** (`presence-coordinator.ts`) — candidate
   `origin_line` không còn hardcode `isEligible: false` vô thời hạn. Nó
   đọc `PresenceCoordinatorContext.server.originLineContext` và chỉ đủ
   điều kiện khi ngữ cảnh đó nằm trong 5 ngữ cảnh Core Memory cho phép.
3. **Companion Decision** (`portal-brain.ts`) — `getCompanionDecision()`
   trả về thêm `coreMemoryHeard: CoreMemory[]`, mirroring cách
   `voicesHeard` đã hoạt động (Sprint 12.2): Portal Brain "mang theo"
   Core Memory khi ra quyết định, dù hôm nay chưa có một nhánh rẽ hành vi
   cụ thể dùng tới trường này — đọc được trước, hành vi cụ thể là bước
   sau, để không suy đoán hành vi trước khi có nhu cầu thật.

## Origin Line chỉ được phép ở 5 nơi

`getOriginLineFromCoreMemory(context, params)` là cổng DUY NHẤT để lấy
câu Origin Line thật (`getCompanionOriginLine()`). Nó trả về `null` ở
mọi nơi khác. 5 ngữ cảnh được phép:

- Origin Room (`/portal/origin`)
- Companion Chapter
- Ceremony (Return After Silence, First Footprint, Mirror...)
- Founder Moment
- Các nghi thức đặc biệt khác

Không có đường nào khác trong code được phép gọi `getCompanionOriginLine()`
trực tiếp ngoài 5 ngữ cảnh này. `presence-coordinator.ts` không tự đặt
`originLineContext` ngoài 5 ngữ cảnh đó — nghĩa là Origin Line vẫn không
tự xuất hiện trong luồng Portal thông thường, đúng yêu cầu "không xuất
hiện ngẫu nhiên chỉ để đủ candidate".

## Vì sao không phải một candidate thứ 9

Brief nói rõ: "Không xây Origin Line như một candidate thông thường."
Một candidate thông thường có nghĩa nó cạnh tranh để được nói bất cứ khi
nào đủ điều kiện ngẫu nhiên — đúng điều Sprint 18.8 đã từ chối làm với
`origin_line` (luôn `isEligible: false`). Sprint 18.9 không "mở khoá"
candidate đó bằng cách làm nó ngẫu nhiên hơn — nó thay bằng một cổng hẹp
hơn: chỉ đủ điều kiện khi một ngữ cảnh THẬT (Origin Room, Ceremony...)
xác nhận, không phải khi một bộ đếm hay xác suất xác nhận.

## Kỹ thuật không overbuild

Core Memory hiện chỉ có một nguồn (`"origin"`) vì chỉ có một ký ức nền
thật sự tồn tại trong code hôm nay. `CoreMemorySource` không mở rộng
trước thành danh sách giả định (Founder Memory riêng, Product Memory...)
— thêm nguồn mới chỉ khi engine tạo ra ký ức đó thật sự tồn tại.

## Definition of Done

Origin không còn chỉ là một câu nói đứng một mình ở `origin-memory.ts`.
Nó có một tầng đọc chung (`core-memory.ts`) mà Thought Selector, Presence
Governance và Companion Decision đều chạm tới được — và câu nói duy nhất
nó cho phép phát ra (Origin Line) chỉ sống ở 5 ngữ cảnh hẹp, không bao
giờ random để đủ candidate.

*Liên quan: `docs/ORIGIN_MEMORY.md`, `docs/ORIGIN_ROOM.md`,
`docs/PRESENCE_COORDINATOR.md`, `docs/COMPANION_THOUGHT_GOVERNANCE.md`,
`docs/DAILY_THOUGHT_ENGINE.md`, `core-memory.ts`, `origin-memory.ts`,
`presence-coordinator.ts`, `daily-thought-source.ts`, `portal-brain.ts`,
`src/app/portal/origin/page.tsx`.*
