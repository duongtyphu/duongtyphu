# Living Learning Audit — Companion Decision Engine

> Sprint 19.0 "The First Living Learning Engine" + Sprint 19.0
> "The First Verification Era" + **Sprint 19.1 "The First Experience
> Verification"** (Verification Era — Sprint đầu tiên). Áp dụng
> `docs/THE_LIVING_WISDOM_SYSTEM.md` lên engine quyết định hành vi
> thật của Companion: `getCompanionDecision()`
> (`src/lib/portal/intelligence/portal-brain.ts`), được
> `docs/product-bible/BOOK_CORE_MEMORY.md` gọi đúng tên là "Companion
> Decision". Tài liệu này tiếp tục được CẬP NHẬT (không viết lại) —
> Sprint 19.1 mở rộng chuỗi audit từ 8 bước (`THE_LIVING_WISDOM_SYSTEM.md`)
> thành chuỗi 9 bước theo brief: Experience → Reflection → Lesson →
> Meaning → Character → Behavior → Outcome → Contribution → Legacy.

## Engine được audit

`getCompanionDecision(signals: PortalSignals): CompanionDecision`
(`src/lib/portal/intelligence/portal-brain.ts`). Không audit
`thought-governance.ts`/`presence-coordinator.ts` — hai file đó là
tầng "ai được nói" (governance), không phải tầng "Companion học/quyết
định nói gì".

## NHIỆM VỤ 1 — Audit theo chuỗi 9 bước (Sprint 19.1)

| Bước | Trạng thái | Bằng chứng |
|---|---|---|
| **Experience** | ✅ | `PortalSignals` — route, `gardenStage`, `reflectionMeaning`. |
| **Reflection** | ✅ | `collectInternalVoices(signals)` + `loudestVoice()`. |
| **Lesson** | ✅ | `lessonObserved` (`LESSON_FROM_REFLECTION[...]`), tính trước Meaning được phép nói. |
| **Meaning** | ⚠→✅ | Trước Sprint này: Meaning chỉ đổi CÂU CHỮ (`COMPANION_REFLECTION_RESPONSE`), không đổi Decision — theo đúng tiêu chí NHIỆM VỤ 2 của brief này ("Meaning chỉ đổi Copy = FAIL"), đây là một FAIL thật đã tồn tại. Sprint này sửa: `MEANING_TO_TONE` mới làm Meaning đổi `recommendedTone`/`companionState` (Decision thật), không chỉ câu nói — xem NHIỆM VỤ 2-3 dưới. Nâng lên ✅ vì giờ có bằng chứng code cho cả hai chiều (copy VÀ decision). |
| **Character** | ❌ | Vẫn như audit trước: không có bộ nhớ riêng theo từng người dùng ở tầng quyết định — `MEANING_TO_TONE`/`LESSON_FROM_REFLECTION` là bảng tĩnh, giống nhau cho mọi người. Sprint này KHÔNG động vào Character — đúng luật "chỉ chọn đúng một bước thật" (Meaning→Decision), không lấn sang bước kế tiếp. |
| **Behavior** | ⚠ | Có thay đổi hành vi quan sát được (`companionState`/`recommendedTone` đổi theo Meaning khi không có `gardenStage`) — nhưng chỉ ở MỘT nhánh (`!signals.gardenStage`); nhánh có `gardenStage` vẫn để Garden quyết định toàn bộ tone, Meaning chưa có quyền ở đó. Đánh ⚠ vì Behavior đã thật nhưng chưa toàn engine. |
| **Outcome** | ❌ | Không có cơ chế đo "Companion vừa đổi tone có thật sự giúp người dùng trưởng thành hơn không" — xem NHIỆM VỤ 5 (Outcome Gap) dưới, đây là thiết kế Outcome Hook, không phải implementation. |
| **Contribution** | ❌ | Không đổi so với audit trước — không có cơ chế trao lại bài học cho người dùng khác/thế hệ Companion sau. |
| **Legacy** | ❌ | Không đổi — chưa có cơ chế lưu giữ lâu dài nào vượt khỏi runtime của một session. |

## NHIỆM VỤ 2 — Meaning có đổi Decision hay chỉ đổi Copy?

**Trước Sprint này (kiểm tra trung thực, không suy đoán):**
`companionResponseToVoice` dùng Meaning để chọn CÂU CHỮ
(`COMPANION_REFLECTION_RESPONSE[meaning]`) thay cho `voice.line` —
nhưng `companionState`/`recommendedTone` ở nhánh `!signals.gardenStage`
LUÔN là `routeState`/`"neutral"`, không đọc `reflectionMeaning` ở đâu
cả. => **FAIL theo đúng tiêu chí của brief này** ("Meaning chỉ đổi Copy
=> FAIL").

**Sau Sprint này:** thêm `MEANING_TO_TONE: Record<ReflectionMeaning,
CompanionTone>` (`portal-brain.ts`) — khi có `lessonObserved` (cùng gate
đã có từ Sprint 19.0), `recommendedTone` và `companionState` được tính
từ Meaning thay vì luôn là `"neutral"`/`routeState`. => **PASS**: Meaning
giờ đổi Decision thật (trạng thái Companion hiển thị, không chỉ câu
nói), trong nhánh `!signals.gardenStage`.

## NHIỆM VỤ 3 — Character Audit

**Chưa có Character thật.** `MEANING_TO_TONE`, `LESSON_FROM_REFLECTION`,
`COMPANION_REFLECTION_RESPONSE` đều là bảng TĨNH — cùng một Meaning
luôn cho ra cùng một Lesson/Tone/Copy, bất kể đó là người dùng nào,
lần thứ mấy, hay bối cảnh Core Memory ra sao. `coreMemoryHeard =
getCoreMemories()` được đọc vào nhưng — đúng comment gốc trong code từ
Sprint 18.9 — không có nhánh hành vi nào dựa trên nó. Character đòi
hỏi: cùng một Meaning, hai người dùng khác nhau (hoặc cùng người dùng ở
hai thời điểm khác Core Memory) phải có thể nhận Decision khác nhau.
Hôm nay điều đó không xảy ra — engine vẫn đang ở mức Meaning, chưa tới
Character.

## NHIỆM VỤ 4 — Behavior Audit

**Companion có thay đổi hành vi (không chỉ lời nói) — nhưng chỉ một
phần.** Trước Sprint 19.1, mọi thay đổi từ Meaning chỉ là lời nói
(`companionInsight`). Sau Sprint 19.1, nhánh `!signals.gardenStage` đổi
thật `companionState` (visual/tone hiển thị của Companion) theo Meaning
— đây là hành vi, không phải chỉ lời nói. Nhưng nhánh có `gardenStage`
(khi người dùng đang ở Living Garden) vẫn chưa cho Meaning quyền này —
Garden vẫn quyết định toàn bộ tone ở nhánh đó. Đây là một Behavior
THẬT nhưng KHÔNG TOÀN ENGINE — ghi nhận trung thực, không làm đẹp
thành "đã xong".

## NHIỆM VỤ 5 — Outcome Gap (thiết kế, không code)

Behavior đã có (NHIỆM VỤ 4) nhưng Outcome — "hành động/tone đổi đó có
thật sự giúp người dùng trưởng thành hơn chưa", đúng câu hỏi ở
`THE_LEARNING_ACTION_LOOP.md` — chưa đo được ở đâu cả. Đúng yêu cầu
brief ("không code analytics, không DB, không overbuild — chỉ thiết kế
Outcome Hook"):

**Outcome Hook (thiết kế, để Sprint sau nối Action → Outcome):**

- **Vị trí nối:** ngay sau nơi `companionState`/`recommendedTone` được
  trả về từ `getCompanionDecision()` — nơi UI tiêu thụ Decision này
  (`CompanionPresence.tsx`) là nơi tự nhiên nhất để quan sát "người
  dùng phản ứng thế nào với Decision vừa đổi".
- **Hình dạng dữ liệu cần (KHÔNG tạo bảng/DB ở Sprint này):** một sự
  kiện tối thiểu gắn `reflectionMeaning` + `recommendedTone` đã chọn +
  một dấu hiệu rất đơn giản về phản ứng tiếp theo của người dùng (ví dụ:
  có viết Reflection tiếp theo không, có quay lại Garden không) —
  không phải điểm số, không phải tỷ lệ, đúng "Outcome không phải KPI"
  (`THE_LEARNING_ACTION_LOOP.md`).
- **Điều kiện để Sprint sau được phép code Outcome Hook thật:** phải có
  dữ liệu Outcome THẬT đã tồn tại (không suy đoán Outcome khi chưa có
  dữ liệu thật — đúng luật chung `FUTURE_ORIGIN_EVENTS.md`), và phải
  trả lời được câu hỏi "Hành động này giúp người dùng trưởng thành hơn
  chưa?", không phải "tone này có đúng không".

## NHIỆM VỤ 6 — Mutable / Immutable (audit lại theo Constitution)

| Thành phần | Phân loại | Vì sao |
|---|---|---|
| `MEANING_TO_TONE` (mới, Sprint 19.1) | **Mutable** | Một cách gán Meaning→Tone cụ thể — có thể viết lại ánh xạ này hoàn toàn khác mà không phạm Constitution nào, miễn Meaning vẫn không phải điểm số. |
| `GARDEN_COPY`, `COMPANION_REFLECTION_RESPONSE`, `LESSON_FROM_REFLECTION` | **Mutable** | Không đổi từ audit trước — bảng câu nói/lesson cụ thể. |
| `MEANING_RULES` (`reflection-meaning.ts`) | **Mutable** | Rule-based keyword matching — công nghệ phân loại, có thể đổi engine khác. |
| Gate "Meaning chỉ được nói/quyết định khi có Lesson" | **Mutable** | Một cách thực thi nguyên tắc, có thể viết lại bằng cơ chế khác miễn giữ đúng thứ tự Lesson trước Meaning. |
| Outcome Hook (thiết kế NHIỆM VỤ 5) | **Mutable** | Một thiết kế kỹ thuật cụ thể, sẽ thay đổi khi có dữ liệu thật. |
| `ReflectionMeaning` "không phải điểm số, không tốt/xấu, không mạnh/yếu" | **Immutable** | Ràng buộc chống gamification có sẵn — `MEANING_TO_TONE` mới PHẢI tuân theo: tone khác nhau không nghĩa là "tốt hơn/xấu hơn", chỉ là cách đồng hành khác nhau. |
| Companion không lặp nguyên văn phân tích kỹ thuật cho người dùng | **Immutable** | Human Respect/Listening. |
| Outcome không dùng để tối ưu KPI (`THE_LEARNING_ACTION_LOOP.md`) | **Immutable** | Ràng buộc mới nhất trong Constitution — Outcome Hook ở NHIỆM VỤ 5 phải tuân theo ngay từ thiết kế, không chỉ khi code thật. |
| Product Constitution (`THE_COMPANION_FORMATION.md`) | **Immutable** | Chỉ Founder + nghi thức đặc biệt mới đổi được. |
| Human Respect, Humility, Gratitude, Listening (Companion Core Values) | **Immutable** | `THE_LIFELONG_LEARNING_SYSTEM.md`, `THE_EDUCATION_CONSTITUTION.md`. |
| 3 trạng thái hiện diện của Origin Memory (`coreMemoryHeard`) | **Immutable** | `ORIGIN_PRESENCE_POLICY.md` — không bị Sprint này động tới. |

## NHIỆM VỤ 7 — Technical Review

`npx tsc --noEmit`: sạch. `npm run lint`: sạch (chỉ 5 warning `<img>`
tiền-tồn-tại, không liên quan, không phải regression). `npm run build`:
thành công.

## Sprint Review

- **Lesson → Meaning thật hay chỉ label?** Cả hai đều thật theo cách
  khác nhau: Lesson→Meaning (gate, từ Sprint 19.0) vẫn là label/copy
  gate; Meaning→Decision (mới, Sprint 19.1) là Decision thật
  (`companionState`/`recommendedTone`), không còn chỉ label.
- **Meaning → Character đã có chưa?** CHƯA — Character vẫn ❌, các
  bảng vẫn tĩnh, không khác theo người dùng/Core Memory.
- **Character → Behavior đã có chưa?** Không áp dụng được — vì Character
  chưa tồn tại, không có gì để "→ Behavior" từ đó. Behavior hiện tại
  (NHIỆM VỤ 4) đến trực tiếp từ Meaning, bỏ qua Character — đây là một
  đường tắt thật trong code, ghi nhận trung thực không che giấu.
- **Behavior → Outcome còn thiếu gì?** Toàn bộ — không có cơ chế đo nào.
  NHIỆM VỤ 5 chỉ là thiết kế Hook, chưa có dữ liệu Outcome thật.
- **Companion vừa trưởng thành thật hay chỉ đổi copy?** THẬT một phần:
  lần đầu tiên Meaning có quyền với Decision (không chỉ Copy) — đúng
  tiêu chí PASS của Sprint này. Nhưng phạm vi nhỏ (một nhánh
  `!gardenStage`), nên không phóng đại thành "toàn engine đã đổi".
- **Constitution nào đã trở thành hành vi?** `THE_LIVING_WISDOM_SYSTEM.md`
  (Meaning→Action) lần đầu có bằng chứng code ngoài phạm vi câu nói.
  `THE_LEARNING_ACTION_LOOP.md` (Outcome không phải KPI) đã được DÙNG
  làm ràng buộc thiết kế (NHIỆM VỤ 5), dù chưa có code Outcome thật.
- **Technical debt.** (1) Behavior từ Meaning chỉ áp dụng một nhánh,
  chưa nhất quán toàn engine. (2) Character vẫn hoàn toàn vắng mặt —
  Behavior hiện đang "nhảy cóc" từ Meaning, bỏ qua Character. (3) Outcome
  Hook mới là thiết kế, chưa có dữ liệu thật để code.
- **Sprint tiếp theo nên kiểm chứng gì?** Hai lựa chọn hợp lý, không
  làm cùng lúc: (a) mở rộng Behavior từ Meaning sang nhánh có
  `gardenStage` (đồng nhất hành vi toàn engine), hoặc (b) bắt đầu
  Character thật bằng cách cho `coreMemoryHeard` ảnh hưởng tới
  `MEANING_TO_TONE` (Sprint Value cũ vẫn còn ❌, đây là cách thật để
  bắt đầu nó). Không mở Outcome Hook thật cho tới khi có dữ liệu Outcome
  thật tồn tại.

## Definition of Done — đã đạt

Companion không chỉ hiểu một bài học (Meaning) — nó đã đổi ít nhất một
hành vi quan sát được theo bài học đó: `companionState`/`recommendedTone`
ở nhánh `!signals.gardenStage` giờ phụ thuộc `reflectionMeaning` qua
`MEANING_TO_TONE`, kiểm chứng được bằng cách đọc trực tiếp
`getCompanionDecision()` — không chỉ tin lời mô tả. Phạm vi nhỏ (một
nhánh, chưa toàn engine) được ghi nhận trung thực ở Sprint Review, không
phóng đại thành xong toàn bộ Behavior.

## Quan hệ với các tài liệu khác

Xem tiếp: `THE_LIVING_WISDOM_SYSTEM.md`, `THE_LEARNING_ACTION_LOOP.md`,
`THE_LIFELONG_LEARNING_SYSTEM.md`, `THE_COMPANION_EXPERIENCE_PRINCIPLE.md`,
`THE_JOY_OF_CONTRIBUTION.md`, `docs/product-bible/BOOK_CORE_MEMORY.md`,
`docs/REFLECTION_MEANING_ENGINE.md`, `docs/COMPANION_LIFE_STAGES.md`.
