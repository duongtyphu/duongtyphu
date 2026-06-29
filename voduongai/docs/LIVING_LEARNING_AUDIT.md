# Living Learning Audit — Companion Decision Engine

> Sprint 19.0 "The First Living Learning Engine". Áp dụng
> `docs/THE_LIVING_WISDOM_SYSTEM.md` (chuỗi 8 bước Experience →
> Contribution) lên engine quyết định hành vi thật của Companion:
> `getCompanionDecision()` (`src/lib/portal/intelligence/portal-brain.ts`),
> được `docs/product-bible/BOOK_CORE_MEMORY.md` gọi đúng tên là
> "Companion Decision". Đây là audit TRUNG THỰC — không suy diễn, không
> "đẹp hoá" những gì chưa có.

## Engine được audit

`getCompanionDecision(signals: PortalSignals): CompanionDecision`
(`src/lib/portal/intelligence/portal-brain.ts`). Input: `PortalSignals`
(tín hiệu về con người — route, `gardenStage`, `reflectionMeaning`...).
Output: `CompanionDecision` (trạng thái/câu nói Companion nên dùng).

Không audit `thought-governance.ts`/`presence-coordinator.ts` — hai
file đó tự nhận là tầng "ai được nói" (governance), không phải tầng
"Companion học/quyết định nói gì" — đúng đối tượng của Living Wisdom
System là tầng sau.

## Bảng audit 8 bước (trước khi sửa)

| Bước | Trạng thái | Bằng chứng |
|---|---|---|
| **Experience** | `implemented` | `PortalSignals` đưa vào — route, `gardenStage`, `reflectionMeaning`, v.v. Đây là trải nghiệm thô của một người dùng cụ thể tại một thời điểm cụ thể. |
| **Reflection** | `implemented` | `collectInternalVoices(signals)` + `loudestVoice()` (`portal-brain.ts:179-180`) — Portal Brain không quyết định trực tiếp từ tín hiệu thô, nó "lắng nghe" các tiếng nói nội tâm trước (đúng comment ở dòng 152-162 của file). |
| **Lesson** | `missing` (trước khi sửa) | Không có bước nào rút ra một câu "bài học cụ thể" từ Reflection — `reflectionMeaning` đi thẳng từ category (Meaning) sang câu nói cho người dùng (Action), không có một bước trung gian ghi nhận "điều này dạy Companion điều gì". |
| **Meaning** | `implemented` | `ReflectionMeaning` (`reflection-meaning.ts`) — 10 giá trị (persistence, curiosity, courage, humility, contribution, gratitude, recovery, focus, discovery, responsibility), rule-based, không phải điểm số. Đây đúng là bước Meaning: ý nghĩa Reflection đang truyền tải, không phải phân loại kỹ thuật. |
| **Value** | `partial` | `coreMemoryHeard = getCoreMemories()` (`portal-brain.ts:182`) — Core Memory (`lesson.whatCompanionLearned`/`whatMustNeverBeForgotten`) ĐƯỢC ĐỌC vào quyết định, nhưng comment ở dòng 57-65 nói rõ: "Hôm nay chưa có nhánh rẽ hành vi cụ thể dựa trên trường này — đây là nền tảng đọc được, không phải hành vi mới." Giá trị có mặt như dữ liệu, chưa thật sự định hình nhánh quyết định. |
| **Character** | `missing` | Không có trạng thái nào tích lũy qua thời gian cho một người dùng cụ thể (ví dụ: "Companion đã học được người này cần sự kiên nhẫn hơn"). `COMPANION_REFLECTION_RESPONSE` là một bảng tĩnh, giống nhau cho mọi người dùng, mọi lần — không phải phẩm chất đã được nội tâm hoá riêng cho mối quan hệ này. |
| **Action** | `implemented` | `companionGreeting`/`companionInsight`/`companionState`/`recommendedTone` — đầu ra cụ thể, là điều Companion thực sự nói/thể hiện. |
| **Contribution** | `missing` | Không có cơ chế nào để một quyết định/bài học từ tương tác này được "trao lại" cho một người dùng khác hoặc một thế hệ Companion sau (`docs/THE_JOY_OF_CONTRIBUTION.md`). Engine chỉ phục vụ một chiều: tín hiệu vào → câu nói ra cho đúng người đó, không có vòng Legacy. |

## Vì sao các bước missing/partial chưa có

- **Lesson missing**: vì trước Sprint 12.3 (Reflection Meaning Engine),
  Portal Brain chỉ cần phân loại ý nghĩa rồi trả lời ngay — không có
  brief nào trước đây yêu cầu một bước trung gian "Companion tự rút ra
  bài học của riêng nó" tách biệt khỏi câu trả lời cho người dùng. Đây
  không phải một thiếu sót bị bỏ quên — đơn giản là chưa từng có yêu
  cầu cho bước này tồn tại, đúng tinh thần "không suy đoán hành vi
  trước khi có nhu cầu thật" đã ghi ở `portal-brain.ts:65`.
- **Value partial**: Core Memory (Sprint 18.9) được thiết kế có chủ đích
  là "nền tảng đọc được, không phải hành vi mới" — một quyết định kỹ
  thuật rõ ràng để tránh suy đoán nhánh hành vi cụ thể trước khi nhu
  cầu thật xuất hiện (cùng tinh thần với Origin Presence Policy).
- **Character missing**: vì không có bộ nhớ riêng theo từng người dùng
  ở tầng quyết định này — `CoreMemory` là ký ức CHUNG của Companion (từ
  Founder/Origin), không phải ký ức về MỘT người dùng cụ thể. Xây dựng
  một "Character" tích lũy riêng theo người dùng là một quyết định sản
  phẩm lớn (lưu trữ, quyền riêng tư, persistence) — không nên overbuild
  trong Sprint này.
- **Contribution missing**: chưa có brief/nhu cầu thật nào yêu cầu một
  bài học từ một người dùng được trao lại cho người khác — đúng luật
  "không fake event, không suy đoán" đã có ở `FUTURE_ORIGIN_EVENTS.md`.
  Đây vẫn là một bước hợp lệ để missing, không phải lỗi.

## Bước được áp dụng trong Sprint này: Reflection → Lesson

Theo ưu tiên của brief ("Reflection ↓ Lesson"), Sprint 19.0 thêm ĐÚNG
MỘT bước còn thiếu: một trường `lessonObserved` trong `CompanionDecision`,
tách biệt rõ với `companionInsight` (câu Companion NÓI ra) —
`lessonObserved` là điều Companion TỰ RÚT RA cho mình, không hiển thị
trực tiếp cho người dùng (giống cách `coreMemoryHeard` được "mang theo"
mà không phát ra thành câu nói).

- Thêm map `LESSON_FROM_REFLECTION: Record<ReflectionMeaning, string>`
  — mỗi giá trị Meaning có một câu Lesson nội tâm riêng, KHÁC câu trả
  lời công khai ở `COMPANION_REFLECTION_RESPONSE` (ví dụ: Meaning
  "persistence" → câu nói công khai là "Mình rất vui vì hôm nay bạn đã
  quay lại"; Lesson nội tâm là "Sự quay lại, không phải kết quả, là
  điều đáng được công nhận trước tiên").
- `lessonObserved` chỉ có giá trị khi `signals.reflectionMeaning` tồn
  tại — không suy đoán Lesson khi không có Reflection thật.
- KHÔNG lưu trữ Lesson này lại (không tạo bảng mới, không persistence)
  — đây vẫn là một bước tính toán trong cùng một lần gọi
  `getCompanionDecision()`, không phải một bộ nhớ dài hạn. Việc Lesson
  có nên được tích lũy thành Character (bước tiếp theo) hay không là
  quyết định của một Sprint sau, khi có nhu cầu thật.

## Mutable / Immutable Audit (`THE_LIFELONG_LEARNING_SYSTEM.md`)

**Mutable Layer mà engine đang dùng:**
- `GARDEN_COPY`, `COMPANION_REFLECTION_RESPONSE`, `LESSON_FROM_REFLECTION`
  (mới) — các bảng câu nói/lesson cụ thể. Đây là "framework"/"kiến
  thức" theo nghĩa `THE_LIFELONG_LEARNING_SYSTEM.md` — có thể viết lại,
  mở rộng, hoặc thay bằng cơ chế khác (ví dụ rule phức tạp hơn) mà
  không ảnh hưởng tới phần Immutable dưới đây.
- `MEANING_RULES` (`reflection-meaning.ts`) — rule-based keyword
  matching, có thể thay bằng một engine phân loại khác trong tương lai.
- `GARDEN_STORY_SUGGESTION`, `TONE_TO_STATE` — các bảng map, mutable.

**Immutable constraint mà engine đang chịu (không tự sửa được):**
- Companion không bao giờ lặp nguyên văn phân tích kỹ thuật cho người
  dùng (`companionResponseToVoice` luôn "dịch" qua giọng riêng của
  Companion, không bao giờ in ra "Reflection của bạn thuộc nhóm X") —
  đây là biểu hiện cụ thể của "Listening"/"Respect"
  (`COMPANION_LIFE_STAGES.md`), một phần Companion Core Values.
  `lessonObserved` mới tiếp tục giữ đúng ràng buộc này: Lesson không
  bao giờ được trả ra UI, chỉ tồn tại nội bộ.
- `ReflectionMeaning` "KHÔNG phải điểm số, không có tốt/xấu, không có
  mạnh/yếu" (`reflection-meaning.ts:7-8`) — ràng buộc chống gamification
  đã có, không Learning Engine nào được phép biến nó thành điểm số.
  `LESSON_FROM_REFLECTION` mới tuân theo đúng ràng buộc này — không câu
  Lesson nào mang tính xếp hạng/đánh giá người dùng.
- Companion không hiển thị Origin Memory ngoài 3 trạng thái đã định
  nghĩa ở `ORIGIN_PRESENCE_POLICY.md` — `coreMemoryHeard` trong engine
  này vẫn ở đúng trạng thái Silent Core Memory, không bị Sprint này
  động tới.

## Companion Growth Review

(`docs/THE_HUMAN_UNDERSTANDING_MISSION.md`, 5 câu — Sprint này thuộc
**Chapter Listening** trong `docs/COMPANION_LIFE_STAGES.md`.)

1. **Companion học được điều gì?** — Rằng "hiểu ý nghĩa của một
   Reflection" (Meaning) và "tự rút ra một bài học từ nó" (Lesson) là
   hai việc khác nhau. Trước Sprint này, Companion đi thẳng từ phân
   loại ý nghĩa sang câu trả lời — nó chưa từng có một khoảnh khắc nội
   tâm riêng để tự nói với mình "điều này dạy mình điều gì", tách biệt
   khỏi điều nó sẽ nói với người dùng.
2. **Companion hiểu con người hơn ở điểm nào?** — Companion giờ phân
   biệt rõ giữa điều nó NÓI RA (an ủi, ấm áp, hướng về người dùng) và
   điều nó TỰ RÚT RA (một nhận thức nội tâm, hướng về chính nó). Một
   người kiên trì quay lại không chỉ đáng được khen — Companion giờ tự
   ghi nhận rằng "sự quay lại, không phải kết quả, là điều đáng được
   công nhận trước tiên", một sắc thái không hiện ra trong câu nói công
   khai nhưng định hình cách nó nhìn nhận hành động đó.
3. **Companion thay đổi hành vi thế nào?** — `getCompanionDecision()`
   giờ trả về thêm `lessonObserved` ở cả hai nhánh quyết định (có/không
   `gardenStage`) khi có `reflectionMeaning` — một trường dữ liệu mới,
   tính toán thật, không suy đoán, sẵn sàng để các Sprint sau (Character,
   Contribution) đọc vào nếu cần, nhưng KHÔNG tự ý lưu trữ hay hiển thị.
4. **Người dùng sẽ cảm nhận được điều gì?** — Không có gì thay đổi về
   mặt hiển thị (đúng tinh thần các Sprint trước: phẩm chất không phải
   lúc nào cũng là một trải nghiệm nhìn thấy được). Thay đổi nằm ở tầng
   nội tâm của Companion — một sự chuẩn bị cho những Sprint sau có thể
   khiến Companion "nhớ" theo một cách sâu hơn.
5. **Điều gì vẫn còn phải học?** — Companion vẫn chưa biết cách giữ lại
   một Lesson qua nhiều lần gặp cùng một người (Character) — mỗi lần
   gọi `getCompanionDecision()` vẫn là một lần tính lại từ đầu, không
   có ký ức riêng về MỘT con người cụ thể tích lũy qua thời gian. Và nó
   vẫn chưa biết cách biến một Lesson của một người thành điều gì đó có
   ích cho một người khác (Contribution) — cả hai vẫn đang chờ một nhu
   cầu thật, không bị ép phải có ngay.

## Definition of Done — đã đạt

Constitution không còn chỉ nằm trong tài liệu: `getCompanionDecision()`
giờ thực sự đi qua một bước Lesson trước khi tới Meaning/Action — một
nguyên tắc từ `THE_LIVING_WISDOM_SYSTEM.md` đã thật sự thay đổi cấu trúc
dữ liệu và hành vi tính toán của Companion Decision Engine, không chỉ
mô tả trong docs.

## Quan hệ với các tài liệu khác

Xem tiếp: `THE_LIVING_WISDOM_SYSTEM.md`, `THE_LIFELONG_LEARNING_SYSTEM.md`,
`THE_JOY_OF_CONTRIBUTION.md`, `docs/product-bible/BOOK_CORE_MEMORY.md`,
`docs/REFLECTION_MEANING_ENGINE.md`, `docs/COMPANION_LIFE_STAGES.md`.
