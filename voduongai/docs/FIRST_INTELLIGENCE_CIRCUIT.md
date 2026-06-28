# First Intelligence Circuit — Sprint 12.1

> Mạch thần kinh thật đầu tiên của Portal. Đối chiếu `docs/PORTAL_BRAIN.md`,
> `docs/PORTAL_INTELLIGENCE_MAP_V2.md`, `docs/HUMAN_CONTEXT_ENGINE.md`,
> `docs/LIVING_GARDEN.md`.

## Vì sao KHÔNG nối Garden → Companion trực tiếp

Đề xuất đầu tiên cho sprint này là một cạnh đơn giản: Companion đọc
`GardenStage` và đổi câu nói. Dễ làm, demo được ngay — nhưng sai kiến
trúc về dài hạn. Nó biến Garden thành MỘT NGUYÊN NHÂN trực tiếp tác động
lên Companion, và lần tới khi Reflection hay Knowledge cũng muốn tác
động lên Companion, Portal sẽ phải nối thêm một đường dây riêng nữa —
N module sinh ra N đường dây, không có lớp quyết định chung nào ở giữa.

Quyết định Product (Product Co-Designer) cho sprint này:

> "Không phải: Garden → Companion. Mà là: Human Signals → Portal Brain →
> Companion. Garden không phải nguyên nhân. Garden chỉ là một tín hiệu.
> Người dùng mới là trung tâm."
>
> "Portal không nên kết nối module với module. Portal phải kết nối các
> tín hiệu của con người."

## Vì sao dùng Human Signals thay vì Module Signals

Garden, Reflection, Knowledge, Story — đều chỉ là NƠI hành vi con người
được ghi lại, không phải bản chất của hành vi đó. Khi Portal Brain đọc
"tín hiệu về con người" (ví dụ: người này đang ở giai đoạn nào của hành
trình) thay vì "dữ liệu thô của một module", mọi tín hiệu mới về sau chỉ
cần được CHUYỂN ĐỔI (adapt) thành cùng một ngôn ngữ tín hiệu — không cần
sửa Portal Brain hay Companion mỗi lần có nguồn dữ liệu mới.

## GardenStage — tín hiệu thật đầu tiên

`GardenStage` (`garden-model.ts`) là tín hiệu đầu tiên có dữ liệu thật.
`src/lib/portal/intelligence/signals/garden-signal.ts` là một adapter
THUẦN (pure function) — không I/O, không side effect — chuyển
`GardenState` đã có thành một phần của `PortalSignals`:

```ts
gardenStateToSignal(garden: GardenState): Pick<PortalSignals, "gardenStage">
```

Adapter này không thay đổi cách Garden lớn lên, không thêm input mới
cho Garden — Garden vẫn hoàn toàn là chính nó, chỉ được "đọc lại" thành
một tín hiệu.

## Portal Brain quyết định, không phải Companion tự quyết

`src/lib/portal/intelligence/portal-brain.ts` export
`getCompanionDecision(signals: PortalSignals): CompanionDecision`.

Đây không phải chatbot, không sinh văn bản tự do bằng AI. Nó chỉ CHỌN
giữa các trạng thái/câu nói đã định nghĩa trước (`GARDEN_COPY`,
`states` từ `companion-identity.ts`) dựa trên tín hiệu nhận được. Companion
(`CompanionPresence.tsx`) không còn tự gọi `getStateForPath` trực tiếp để
quyết định mọi thứ — nó gọi Portal Brain, và Portal Brain mới là nơi
quyết định cuối cùng dựa trên cả route VÀ tín hiệu con người.

## Đây là mạch thần kinh thật đầu tiên

```
Garden (đã có) ──┐
                 ├─► garden-signal.ts (adapter thuần) ─► PortalSignals
Route hiện tại ──┘                                           │
                                                              ▼
                                                  portal-brain.ts
                                          getCompanionDecision(signals)
                                                              │
                                                              ▼
                                CompanionPresence / CompanionGreetingBubble /
                                CompanionSpace (hiển thị quyết định, không
                                tự quyết định)
```

Cầu nối kỹ thuật giữa Garden (tính ở server component — Gem Home, My
Story) và Companion (client component toàn cục) là
`GardenSignalSync.tsx` — một component client rỗng (`return null`), chỉ
ghi tín hiệu vào `localStorage` (tái dùng đúng pattern đã có cho
`companion-presence-position`) và phát một custom event để Companion
đang mở sẵn trên trang khác cũng cập nhật ngay, không cần reload.

## Mở rộng về sau (Reflection / Knowledge / Story)

Khi có tín hiệu thật từ Reflection (`reflectionDepth`), Knowledge
(`learningFocus`), Story (`storyMomentum`), hay nhịp quay lại
(`lastComebackDays`), `journeyState`... mỗi tín hiệu mới chỉ cần:

1. Một adapter thuần riêng (như `garden-signal.ts`) chuyển dữ liệu module
   thành một phần của `PortalSignals`.
2. Một dòng copy/luật quyết định mới trong `portal-brain.ts`.

Không cần sửa Companion, không cần sửa cách module đó hoạt động, không
cần module nào biết tới module khác — tất cả gặp nhau ĐÚNG MỘT lần ở
Portal Brain. Đây là lý do Quyết định Product của sprint này được giữ
làm tiêu chuẩn lâu dài: **mọi kết nối thông minh trong VO DUONG AI ưu
tiên Human Signals → Portal Brain → Experience Decision, không nối
module với module.**

## Cập nhật Sprint 12.2 — thêm bước "lắng nghe" giữa Signal và Decision

Sprint 12.2 (`docs/INTERNAL_VOICES_ARCHITECTURE.md`) làm rõ thêm một
bước ở giữa mạch này: trước khi Portal Brain ra quyết định, nó "lắng
nghe" các **Internal Voices** — Garden không chỉ là một con số tín hiệu
nữa, nó là tiếng nói của "Ý chí / sự trưởng thành"; Story là tiếng nói
của "Ký ức". Mạch đầy đủ hơn của Sprint 12.1 giờ là:

```
Human Signals → Internal Voices (collectInternalVoices) → Portal Brain Decision → Companion
```

Đây không phải một mạch mới, không phải một module mới — nó là góc nhìn
sâu hơn của ĐÚNG MỘT mạch đã có ở Sprint 12.1, vẫn cùng `PortalSignals`,
vẫn cùng `getCompanionDecision`.
