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

`origin_line` hiện luôn `isEligible: false` — không có engine nào kích hoạt
Origin Line như một moment hiện diện tự phát hôm nay (`origin-memory.ts` chỉ
phục vụ Origin Room page và lời nói hiếm khi có founder hiện diện). Đây là
một giới hạn được công khai trong code (xem comment ở
`buildPresenceCandidates()`), không phải một tích hợp giả tạo.

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

## Technical Debt còn lại

- `origin_line` chưa có engine sản sinh — candidate luôn `isEligible: false`
  (đã ghi nhận ở trên, không phải lỗi).
- `presenceNow` cập nhật mỗi giây qua `setInterval` riêng trong
  `CompanionPresence.tsx` — một state tick nhỏ, không phải vấn đề hiệu năng ở
  quy mô hiện tại, nhưng nếu sau này có thêm nhiều coordinator tick khác, nên
  xem xét hợp nhất các interval (không cấp bách, không trong scope 18.8).

*Liên quan: `docs/COMPANION_THOUGHT_GOVERNANCE.md`,
`docs/LIFE_MOMENTS_ENGINE.md`, `docs/RETURN_AFTER_SILENCE.md`,
`docs/COMPANION_GROWTH_LOG.md`, `presence-coordinator.ts`,
`thought-governance.ts`, `CompanionPresence.tsx`.*
