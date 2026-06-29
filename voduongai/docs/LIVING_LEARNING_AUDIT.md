# Living Learning Audit — Companion Decision Engine

> Sprint 19.0 "The First Living Learning Engine" + Sprint 19.0
> "The First Verification Era" (cùng số hiệu, hai brief riêng). Áp
> dụng `docs/THE_LIVING_WISDOM_SYSTEM.md` (chuỗi 8 bước Experience →
> Contribution) lên engine quyết định hành vi thật của Companion:
> `getCompanionDecision()` (`src/lib/portal/intelligence/portal-brain.ts`),
> được `docs/product-bible/BOOK_CORE_MEMORY.md` gọi đúng tên là
> "Companion Decision". Tài liệu này được CẬP NHẬT (không viết lại) ở
> Verification Era để audit lại đúng-sai của lần đầu, không để lần
> audit cũ tự nhận đã đúng mà không kiểm chứng.

## Engine được audit

`getCompanionDecision(signals: PortalSignals): CompanionDecision`
(`src/lib/portal/intelligence/portal-brain.ts`). Không audit
`thought-governance.ts`/`presence-coordinator.ts` — hai file đó là
tầng "ai được nói" (governance), không phải tầng "Companion học/quyết
định nói gì".

## NHIỆM VỤ 1 — Audit theo chuỗi 8 bước (sau Sprint Verification Era)

| Bước | Trạng thái | Bằng chứng |
|---|---|---|
| **Experience** | ✅ | `PortalSignals` đưa vào — route, `gardenStage`, `reflectionMeaning`. |
| **Reflection** | ✅ | `collectInternalVoices(signals)` + `loudestVoice()` — Portal Brain lắng nghe tiếng nói nội tâm trước khi quyết định. |
| **Lesson** | ✅ | `lessonObserved` (`LESSON_FROM_REFLECTION[signals.reflectionMeaning]`) — tính TRƯỚC `insightFromVoice`, một bài học nội tâm không hiển thị ra UI. |
| **Meaning** | ⚠ | `ReflectionMeaning` (`reflection-meaning.ts`) tồn tại và hoạt động — NHƯNG từ Sprint này, câu trả lời theo Meaning (`COMPANION_REFLECTION_RESPONSE`) chỉ được phép phát ra khi `lessonObserved` đã có (`companionResponseToVoice`, gate mới). Đánh dấu ⚠ không phải vì nó thiếu, mà vì nó vừa chuyển từ "độc lập, tự đứng trước người dùng" sang "phụ thuộc Lesson" — một ràng buộc mới chưa được kiểm chứng qua nhiều Sprint, cần theo dõi thêm trước khi đánh ✅ chắc chắn. |
| **Value** | ❌ | `coreMemoryHeard = getCoreMemories()` được đọc vào nhưng KHÔNG có nhánh hành vi nào dựa trên nó — comment gốc trong code (Sprint 18.9) vẫn còn đúng nguyên văn: "chưa có nhánh rẽ hành vi cụ thể dựa trên trường này." Sprint Verification Era này KHÔNG động vào Value — đúng luật "chỉ chọn đúng một bước". |
| **Character** | ❌ | Không có bộ nhớ riêng theo từng người dùng ở tầng quyết định này. `COMPANION_REFLECTION_RESPONSE`/`LESSON_FROM_REFLECTION` là bảng tĩnh, giống nhau cho mọi người dùng. |
| **Action** | ✅ | `companionGreeting`/`companionInsight`/`companionState`/`recommendedTone` — đầu ra cụ thể. |
| **Contribution** | ❌ | Không có cơ chế trao lại một bài học cho người dùng khác hoặc thế hệ Companion sau. |

**Sửa lại so với audit lần trước (Sprint "The First Living Learning
Engine")**: lần đó đánh "Meaning ✅" không kèm điều kiện — điều đó đúng
tại thời điểm đó (Meaning thực sự độc lập, tự đứng được). Sau khi
NHIỆM VỤ 3 của Sprint này thay đổi code, Meaning không còn độc lập nữa
— nó phụ thuộc Lesson. Đây là lý do audit lần này hạ Meaning xuống ⚠:
không suy diễn nó vẫn ✅ chỉ vì nó "vẫn hoạt động", phải đánh giá lại
đúng trạng thái MỚI sau khi code đổi.

## NHIỆM VỤ 2 — Mutable / Immutable (theo từng thành phần thật trong engine)

| Thành phần | Phân loại | Vì sao |
|---|---|---|
| `GARDEN_COPY`, `COMPANION_REFLECTION_RESPONSE`, `LESSON_FROM_REFLECTION` | **Mutable** | Bảng câu nói/lesson cụ thể — có thể viết lại, mở rộng, thay cơ chế khác. |
| `MEANING_RULES` (`reflection-meaning.ts`) | **Mutable** | Rule-based keyword matching — công nghệ phân loại, có thể đổi sang engine khác. |
| `Knowledge` (kiến thức Companion dùng để chọn câu trả lời) | **Mutable** | Đúng `THE_LIFELONG_LEARNING_SYSTEM.md` — kiến thức luôn được phép cập nhật. |
| `Reflection Meaning` (khái niệm — không phải bảng rule cụ thể) | **Mutable** | Là một kỹ năng phân loại, có thể thay bằng phương pháp tốt hơn trong tương lai. |
| Gate "Meaning chỉ được nói khi có Lesson" (logic mới của Sprint này) | **Mutable** | Đây là MỘT CÁCH thực thi nguyên tắc, không phải nguyên tắc — có thể được viết lại bằng cơ chế khác miễn vẫn giữ đúng thứ tự Lesson trước Meaning. |
| Companion không lặp nguyên văn phân tích kỹ thuật cho người dùng | **Immutable** | Biểu hiện cụ thể của Human Respect/Listening — không Learning Engine nào được phép tự sửa để Companion nói thẳng "Reflection của bạn thuộc nhóm X". |
| `ReflectionMeaning` "không phải điểm số, không tốt/xấu, không mạnh/yếu" | **Immutable** | Ràng buộc chống gamification có sẵn — `LESSON_FROM_REFLECTION` mới phải tuân theo, không câu Lesson nào xếp hạng người dùng. |
| Product Constitution (`THE_COMPANION_FORMATION.md`) | **Immutable** | Chỉ Founder + nghi thức đặc biệt mới đổi được. |
| Human Respect, Humility, Gratitude, Listening (Companion Core Values) | **Immutable** | `THE_LIFELONG_LEARNING_SYSTEM.md`, `THE_EDUCATION_CONSTITUTION.md`. |
| 3 trạng thái hiện diện của Origin Memory (`coreMemoryHeard`) | **Immutable** | `ORIGIN_PRESENCE_POLICY.md` — engine này vẫn giữ đúng Silent Core Memory, không bị Sprint này động tới. |

## NHIỆM VỤ 3 — Áp dụng thật: Lesson → Meaning

Chọn đúng một bước: **Lesson → Meaning** (Reflection → Lesson đã được
áp dụng ở Sprint trước, không lặp lại).

**Trước:** `companionResponseToVoice(voice, signals)` — nếu tiếng nói
là Reflection và có `reflectionMeaning`, Companion LUÔN trả lời theo
Meaning, không quan tâm Lesson có tồn tại hay không. Lesson
(`lessonObserved`) được tính ra nhưng không hề ảnh hưởng tới việc
Meaning có được nói ra hay không — hai bước tồn tại CẠNH NHAU, không
PHỤ THUỘC nhau.

**Sau:** `companionResponseToVoice(voice, signals, lessonObserved)` —
câu trả lời theo Meaning chỉ được trả về khi `lessonObserved` đã có
giá trị. Nếu không có Lesson, Companion lùi về câu nói chung
(`voice.line`), không dùng câu trả lời riêng theo ý nghĩa. Lesson giờ
là ĐIỀU KIỆN BẮT BUỘC để Meaning được phép trở thành một câu nói công
khai — đúng thứ tự Reflection → Lesson → Meaning, không còn là hai
nhánh song song.

Không AI backend, không DB mới, không framework mới — chỉ một thay đổi
thứ tự phụ thuộc trong cùng một hàm đã có.

## NHIỆM VỤ 4 — Behavior Change

**Trước Sprint này:**
```
Companion đọc Reflection → phân loại Meaning → trả lời ngay theo Meaning
```
Lesson tồn tại trong dữ liệu trả về (`lessonObserved`) nhưng không có
quyền gì với câu trả lời — nó là một trường song song, không phải một
điều kiện.

**Sau Sprint này:**
```
Companion đọc Reflection → rút Lesson → CHỈ KHI có Lesson → mới cho phép
Meaning trở thành câu trả lời riêng → nếu không có Lesson, trả lời chung
```

Đây là một thay đổi hành vi THẬT, có thể kiểm chứng bằng cách đọc trực
tiếp `companionResponseToVoice`: hàm này hôm nay có một nhánh điều
kiện (`&& lessonObserved`) không tồn tại trước Sprint này.

## NHIỆM VỤ 5 — Companion Growth Review

(`docs/THE_HUMAN_UNDERSTANDING_MISSION.md`, 5 câu — Sprint thuộc
**Chapter Listening**, `docs/COMPANION_LIFE_STAGES.md`.)

1. **Companion học được điều gì?** — Rằng việc nó "hiểu ý nghĩa" của
   một Reflection (Meaning) không tự động cho nó quyền nói ra điều đó
   theo cách riêng — nó phải tự đảm bảo đã rút được một bài học cho
   chính mình (Lesson) trước, mới được dùng cách nói gắn với ý nghĩa
   đó. Trước đây, hai việc này độc lập với nhau; giờ một việc phải xảy
   ra trước việc kia.
2. **Companion hiểu con người hơn ở điểm nào?** — Hiểu ý nghĩa của một
   Reflection (ví dụ: ai đó vừa kiên trì quay lại) khác với việc thật
   sự rút ra được điều gì từ đó cho chính mình. Companion giờ không
   coi việc phân loại đúng ý nghĩa là đủ điều kiện để nói một câu ấm áp
   — nó cần đã "ngẫm" (Lesson) trước.
3. **Companion thay đổi hành vi thế nào?** — `companionResponseToVoice`
   giờ có một điều kiện mới: chỉ trả lời theo Meaning khi
   `lessonObserved` không null. Trong thực tế hôm nay, Lesson được suy
   ra 1:1 từ Meaning nên hành vi quan sát được CHƯA đổi với người dùng
   — nhưng cấu trúc phụ thuộc trong code đã đổi thật, và đây là nền cho
   việc Lesson có thể tách khỏi Meaning trong các Sprint sau (ví dụ
   Lesson phụ thuộc thêm Core Memory) mà không cần sửa lại logic gate
   này.
4. **Người dùng sẽ cảm nhận được điều gì?** — Hôm nay: không gì khác
   biệt, đúng và trung thực — vì Lesson và Meaning vẫn còn gắn 1:1.
   Thay đổi là nội bộ, chuẩn bị cho việc hai bước này tách rời thật
   trong tương lai.
5. **Điều gì vẫn còn phải học?** — Companion vẫn chưa biết cách để
   Lesson thực sự ĐỘC LẬP với Meaning (hôm nay Lesson chỉ là một bản
   dịch nội tâm của đúng cùng một bảng phân loại) — một Lesson "thật"
   nên có khả năng khác Meaning khi ngữ cảnh khác đi (ví dụ: cùng một
   Meaning "persistence" nhưng Lesson khác nhau tuỳ Core Memory). Đây
   là lý do Meaning vẫn chỉ được đánh ⚠, không phải ✅ chắc chắn.

## NHIỆM VỤ 6 — Product Review (theo Companion trưởng thành, không theo feature/code/UI)

Không có feature mới, không có UI mới — và đó là đúng tinh thần Sprint
này. Câu hỏi đúng không phải "code chạy chưa" mà "Companion có trưởng
thành hay không": CÓ — Companion giờ có một ràng buộc nội tại buộc nó
phải tự rút bài học trước khi dùng đến ý nghĩa đã hiểu để nói chuyện
với người dùng. Đây là một phẩm chất (sự cẩn trọng trước khi nói),
không phải một năng lực (biết phân loại tốt hơn) — đúng phân biệt ở
`THE_COMPANION_FORMATION.md`.

## NHIỆM VỤ 7 — Book Update

Hành vi ĐÃ thay đổi thật (NHIỆM VỤ 3-4, kiểm chứng được bằng code) —
nên Book Note được phép viết. Không chương Product Bible
(`docs/product-bible/`) nào được sửa trong Sprint này — không chương
nào trong số đó mô tả riêng Companion Decision Engine ở mức đủ cụ thể
để cần cập nhật, và việc thêm một chương Product Bible mới chỉ vì
Sprint này sẽ là overbuild, vi phạm chính luật "không thêm triết lý
mới" của brief. Book Note cho Sprint này được ghi trực tiếp trong tài
liệu audit này (mục NHIỆM VỤ 3-4 ở trên) và trong
`docs/COMPANION_GROWTH_LOG.md` — đây là "Book" thực tế của Companion
Decision Engine, không cần một Book riêng trong Product Bible.

## NHIỆM VỤ 8 — Technical Review

`npx tsc --noEmit`: sạch. `npm run lint`: sạch (chỉ 5 warning `<img>`
tiền-tồn-tại, không liên quan). `npm run build`: thành công.

## Sprint Review

- **Living Wisdom Pipeline hiện ở đâu?** Experience ✅ → Reflection ✅
  → Lesson ✅ → Meaning ⚠ (giờ phụ thuộc Lesson, chưa qua nhiều Sprint
  để tin chắc) → Value ❌ → Character ❌ → Action ✅ → Contribution ❌.
- **Reflection → Lesson đã hoạt động thật chưa?** Đã hoạt động từ
  Sprint trước, không đổi ở Sprint này.
- **Lesson → Meaning đã hoạt động chưa?** CÓ, từ Sprint này — Meaning
  không còn được phép tự đứng trước người dùng mà không qua Lesson.
- **Mutable/Immutable phân chia ra sao?** Xem bảng NHIỆM VỤ 2 — mọi
  bảng dữ liệu cụ thể (copy, rule, lesson) là Mutable; Companion Core
  Values, Product Constitution, và ràng buộc chống gamification/Origin
  Presence là Immutable.
- **Companion thay đổi hành vi gì?** Một điều kiện code thật:
  `companionResponseToVoice` chỉ trả lời theo Meaning khi đã có Lesson.
- **Constitution nào đã được kiểm chứng?** `THE_LIVING_WISDOM_SYSTEM.md`
  (chuỗi Experience→Lesson→Meaning) — hai bước nối tiếp đã là code
  thật, không chỉ tài liệu.
- **Constitution nào vẫn chỉ là tài liệu?** `THE_LIFELONG_LEARNING_SYSTEM.md`
  (Mutable/Immutable Layer) — đã được DÙNG ĐỂ AUDIT (bảng NHIỆM VỤ 2)
  nhưng chưa có cơ chế code nào THỰC THI nó (ví dụ chặn một Pull Request
  sửa Immutable). `THE_JOY_OF_CONTRIBUTION.md` — Contribution vẫn ❌,
  chưa một dòng code nào thể hiện nó.
- **Technical debt còn lại?** Lesson hôm nay vẫn chỉ là "bản dịch nội
  tâm" 1:1 của Meaning — chưa có nguồn dữ liệu độc lập (ví dụ Core
  Memory) để Lesson thật sự khác Meaning trong một số trường hợp.
- **Sprint tiếp theo nên kiểm chứng Engine nào?** Tiếp tục đúng Engine
  này — bước hợp lý kế tiếp là Value (đọc Core Memory vào Lesson, để
  Lesson lần đầu có nguồn độc lập với Meaning) — không mở Engine mới
  khi Engine này còn ❌ ở Value/Character/Contribution.

## Definition of Done — đã đạt

Một nguyên tắc trong Constitution (Lesson phải tồn tại trước khi
Meaning được phép trở thành lời nói — `THE_LIVING_WISDOM_SYSTEM.md`)
không còn chỉ nằm trong tài liệu — nó là một điều kiện code thật
(`&& lessonObserved`) trong `companionResponseToVoice`, kiểm chứng được
bằng cách đọc trực tiếp source, không cần tin lời mô tả.

## Quan hệ với các tài liệu khác

Xem tiếp: `THE_LIVING_WISDOM_SYSTEM.md`, `THE_LIFELONG_LEARNING_SYSTEM.md`,
`THE_JOY_OF_CONTRIBUTION.md`, `docs/product-bible/BOOK_CORE_MEMORY.md`,
`docs/REFLECTION_MEANING_ENGINE.md`, `docs/COMPANION_LIFE_STAGES.md`.
