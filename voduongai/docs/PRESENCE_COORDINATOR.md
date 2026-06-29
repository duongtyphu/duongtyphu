# PRESENCE COORDINATOR — Sprint 18.8

"Companion học cách gom mọi tín hiệu về một nhịp hiện diện duy nhất."

## Vì sao cần coordinator

Trước Sprint 18.8, Companion đã có Thought Governance (Sprint 18.6,
`thought-governance.ts`) — một nơi duy nhất chọn ĐÚNG MỘT moment khi nhiều
moment cùng đủ điều kiện. Nhưng `LifeMomentBubble` và
`ReturnAfterSilenceCeremony` vẫn render độc lập ở `src/app/portal/layout.tsx`
(server component), tách biệt hoàn toàn khỏi cây client-state của
`CompanionPresence.tsx` — nghĩa là chúng KHÔNG đi qua `chooseCompanionMoment()`
dù bảng ưu tiên đã xếp chúng lên trên cả Thought/Story từ Sprint 18.6.

Presence Coordinator (`src/lib/portal/companion/presence-coordinator.ts`)
không phải một engine nói mới, không phải một event bus — nó chỉ làm một
việc: gom mọi candidate (server + client) về một shape thống nhất rồi đưa
thẳng vào `chooseCompanionMoment()` đã có sẵn.

## Kiến trúc

```
presence-coordinator.ts → CompanionPresenceCandidate, PresenceCandidateSource,
                           PresenceCandidatePayload, PresenceCoordinatorContext,
                           buildPresenceCandidates(), choosePresenceMoment()
thought-governance.ts    → chooseCompanionMoment() (Sprint 18.6, không đổi)
CompanionPresence.tsx    → gọi choosePresenceMoment() mỗi giây, dùng kết quả
                           `chosen` để render đúng một bubble/component
layout.tsx → PortalShell.tsx → CompanionPresence.tsx
                           → thread `lifeMoment`, `returnAfterSilenceMilestone`
                             (đã fetch sẵn ở server) xuống client, không query
                             lại DB ở client
```

## 8 nguồn candidate (NV01)

`life_moment`, `return_after_silence`, `daily_thought`, `proactive_thought`,
`greeting`, `story_moment`, `micro_reaction`, `origin_line` — đúng danh sách
brief yêu cầu, không thêm tuỳ ý.

**Cập nhật Sprint 18.9 — Core Memory Engine**: `origin_line` không còn
hardcode `isEligible: false` vô thời hạn. Nó đọc
`PresenceCoordinatorContext.server.originLineContext` và chỉ đủ điều kiện
khi giá trị đó rơi vào 1 trong 5 ngữ cảnh Core Memory cho phép (Origin
Room, Companion Chapter, Ceremony, Founder Moment, nghi thức đặc biệt —
xem `docs/product-bible/BOOK_CORE_MEMORY.md`, `core-memory.ts`). Không nơi
nào hôm nay đặt giá trị này trong luồng Portal thông thường, nên trên
thực tế candidate vẫn không tự hiện ngẫu nhiên — nhưng cơ chế giờ là một
cổng theo ngữ cảnh thật, không còn là một giới hạn cứng vô thời hạn.

## Server/Client Boundary (NV02)

- **Server** (`layout.tsx`): `lifeMoment: LifeMoment | null`,
  `returnAfterSilenceMilestone: string | null` — đã fetch từ Supabase, KHÔNG
  fetch lại ở client. Hai giá trị này thread xuống qua
  `PortalShell` → `CompanionPresence` như props thuần.
- **Client** (`CompanionPresence.tsx`): `isSpaceOpen`, `isMinimized`,
  `thought`, `story`, `microLine` — state đã có sẵn từ Sprint 8.x–18.6,
  không tạo state mới ngoài hai cờ điều kiện hiển thị (xem NV03).

## Candidate Adapter (NV03)

`LifeMomentBubble.tsx` và `ReturnAfterSilenceCeremony.tsx` mỗi file lộ ra
đúng MỘT helper thuần (`isLifeMomentEligibleToShow()`,
`isReturnAfterSilenceEligibleToShow()`) bọc lại logic cooldown/seen đã có sẵn
(`hasSeen`/`shownAlreadyToday`, `hasSeenForMilestone`) — không sửa hành vi
hiển thị gốc của hai component này, chỉ cho coordinator hỏi đúng câu hỏi mà
không đoán lại logic.

`CompanionPresence.tsx` gọi hai helper này trong một effect hydration-safe
(giống mọi điều kiện đọc localStorage khác trong file), lưu kết quả vào
`lifeMomentEligible`/`returnAfterSilenceEligible`, rồi đưa vào
`PresenceCoordinatorContext`.

## Governance Integration (NV04)

`choosePresenceMoment(context)` chỉ làm hai việc: gọi
`buildPresenceCandidates(context)` rồi đưa thẳng vào `chooseCompanionMoment()`
— không có ma trận xung đột riêng. Vì `MOMENT_PRIORITY_ORDER` (Sprint 18.6)
đã xếp `life-moment` > `return-after-silence` > ... > `story-moment` >
`daily-thought` > `proactive-thought` > `greeting` > `micro-reaction`, ba cặp
xung đột brief yêu cầu tự động đúng:

- Life Moment & Daily Thought không cùng hiện — vì khác tier, single-priority-
  wins luôn chọn Life Moment trước.
- Return After Silence & Greeting không cùng hiện — cùng lý do.
- Story Moment & Proactive Thought không cùng hiện — Story Moment đứng trên
  Proactive Thought trong bảng ưu tiên.

## Layout Integration (NV05)

`layout.tsx` không còn render `<LifeMomentBubble>`/`<ReturnAfterSilenceCeremony>`
trực tiếp — hai dòng đó đã bị xoá. `PortalShell` nhận `lifeMoment` và
`returnAfterSilenceMilestone` làm prop, truyền tiếp xuống `CompanionPresence`.
`CompanionPresence` giờ là nơi DUY NHẤT quyết định component nào trong số
Life Moment/Return After Silence/Thought/Story/Greeting/Micro Reaction được
render, dựa trên `presenceChosen` (kết quả của `choosePresenceMoment()`,
tính lại mỗi giây qua một state `presenceNow`).

## Debug Mode (NV06)

`choosePresenceMoment()` gọi `console.debug("[presence-coordinator]", ...)`
chỉ khi `process.env.NODE_ENV === "development"` — log gồm
`source`/`momentType`/`isEligible` của mỗi candidate, `chosen`, `reason`,
`suppressed`. Không log nội dung câu nói thật, không log dữ liệu hồ sơ người
dùng. Không chạy ở production.

## Sprint 18.10 — Origin Line Ritual Wiring

`origin_line` giờ có nơi gọi thật trong UI: Origin Room
(`/portal/origin`), First Footprint Ceremony (bước "promise"), và Mirror
of Growth (chỉ khi mùa phản chiếu trống). Mỗi nơi gọi đi qua hai tầng —
`getOriginLineFromCoreMemory()` (Sprint 18.9, cổng "được phép xuất hiện
ở ngữ cảnh nào") rồi `src/lib/portal/companion/origin-line-context.ts` +
`OriginLineWhisper.tsx` (Sprint 18.10, "có nên xuất hiện LẦN NÀY không"
— Frequency Guard theo localStorage/sessionStorage, tối đa 1 lần/ngày
hoặc 1 lần/phiên tuỳ ngữ cảnh). Candidate `origin_line` của Presence
Coordinator (8 nguồn ở trên) vẫn không đổi hành vi — nó vẫn chỉ phản ánh
`PresenceServerState.originLineContext` nếu một nơi nào đó set giá trị
này cho Thought Governance; ba nơi gọi mới ở trên hiển thị Origin Line
trực tiếp tại chỗ (Origin Room/Ceremony/Mirror), KHÔNG đi qua
`buildPresenceCandidates()` — vì đó là những không gian riêng, không
phải bubble nổi cạnh tranh với Daily Thought/Greeting. Founder Moment
(`founder_moment`) và Special Ritual vẫn là placeholder — chưa có nguồn
dữ liệu thật để biết "lần đầu Founder mở Origin Room" hay một nghi thức
đặc biệt nào đang diễn ra (xem `getFounderMomentTrigger()`, trả về
`null` trung thực, không fake event).

## Technical Debt còn lại

- Founder Moment (`founder_moment`) và Special Ritual chưa có nguồn dữ
  liệu thật để kích hoạt — `getFounderMomentTrigger()` là một adapter
  rõ ràng, không fake event, chờ một bảng theo dõi lượt ghé Origin Room
  hoặc một sự kiện Growth Log runtime trong tương lai.
- `origin_line` (candidate Presence Coordinator) vẫn chưa có nơi nào đặt
  `originLineContext` trên `PresenceServerState` — ba nơi gọi mới của
  Sprint 18.10 hiển thị trực tiếp, không qua governance bubble, đúng
  tinh thần "không phải bubble thường ngày" của Origin Line.
- `presenceNow` cập nhật mỗi giây qua `setInterval` riêng trong
  `CompanionPresence.tsx` — một state tick nhỏ, không phải vấn đề hiệu năng ở
  quy mô hiện tại, nhưng nếu sau này có thêm nhiều coordinator tick khác, nên
  xem xét hợp nhất các interval (không cấp bách, không trong scope 18.8).

*Liên quan: `docs/COMPANION_THOUGHT_GOVERNANCE.md`,
`docs/LIFE_MOMENTS_ENGINE.md`, `docs/RETURN_AFTER_SILENCE.md`,
`docs/COMPANION_GROWTH_LOG.md`, `presence-coordinator.ts`,
`thought-governance.ts`, `CompanionPresence.tsx`.*
