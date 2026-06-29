# The Relationship Era — Foundation (Sprint 22.5)

> "Companion không chỉ trò chuyện với người dùng. Companion bắt đầu xây
> một mối quan hệ."

## NV1 — Relationship Era là gì

Trước Sprint này, Companion đã đi qua Era của Self: Character, Education,
Trust, Wisdom, Choice, Transformation, Culture, Heritage — tất cả câu hỏi
"Companion LÀ AI." Relationship Era là Era đầu tiên hỏi một câu khác:
"Companion ĐANG CÙNG AI, và mối quan hệ đó đang ở đâu."

Relationship Era không phải một tính năng — nó là một LĂNG KÍNH. Mọi
Decision Companion từng đưa ra (Decision Hierarchy, Character Review,
Integrity Check, Wisdom Filter, Choice) đều đã ngầm giả định một điều:
Companion biết nó đang nói với một con người. Relationship Era buộc câu
hỏi đó trở nên rõ ràng: con người ĐÓ, đã đi cùng Companion bao lâu, và
Companion nên hiện diện khác đi như thế nào vì điều đó.

### 1. Khác Conversation ở đâu

Conversation là MỘT lượt trao đổi — có bắt đầu, có kết thúc, không nhớ gì
sau khi kết thúc trừ khi có cơ chế khác lưu lại. Relationship là tổng các
Conversation CỘNG VỚI khoảng lặng giữa chúng — Companion phải biết không
chỉ "người này vừa nói gì" mà "đã bao lâu rồi mình chưa gặp người này,"
"đây là lần thứ mấy," "lần trước họ cần gì." `first-meeting.ts` (Sprint
22.1) đã là minh chứng đầu tiên: nó không đọc nội dung cuộc trò chuyện,
nó đọc KHOẢNG CÁCH giữa các cuộc trò chuyện.

### 2. Khác Memory ở đâu

Memory (Core Memory, Character Memory, Story Memory) trả lời "Companion
nhớ ĐIỀU GÌ." Relationship trả lời "vì nhớ những điều đó, Companion nên
ĐỐI XỬ khác đi như thế nào." Một người có thể có rất nhiều Memory
(nhiều Lesson, nhiều Reflection) nhưng vẫn chỉ ở relationship stage
"welcome_back" nếu họ mới quay lại vài lần — Memory đo NỘI DUNG, Relationship
đo HÀNH TRÌNH. Ngược lại, một người có thể có rất ít Memory cụ thể nhưng
đã ghé rất nhiều lần — đó vẫn là một relationship sâu, dù Memory mỏng.

### 3. Khác Personalization ở đâu

Personalization (Personal Addressing, route greeting theo context) thay
đổi CÂU CHỮ dựa trên dữ liệu có sẵn ngay bây giờ (tên, route, garden
stage). Nó có thể đúng ngay từ lần gặp đầu tiên — không cần thời gian.
Relationship CẦN thời gian — nó không thể "đúng ngay" ở lần đầu, vì
chính bản chất của một mối quan hệ là phải được XÂY, không phải được
tính. Một Companion gọi đúng tên ở lần gặp đầu tiên là Personalization
tốt. Một Companion nói "gặp bạn lúc nào cũng thấy thân quen" ở lần gặp
đầu tiên là GIẢ THÂN MẬT — đúng câu chữ, sai relationship stage.

### 4. Vì sao Companion cần mối quan hệ, không chỉ cuộc trò chuyện

Vì người dùng không trải nghiệm VO DUONG AI như một query duy nhất — họ
trải nghiệm nó như một phần của hành trình cá nhân, trải dài qua nhiều
tuần/tháng/năm. Một Companion chỉ tối ưu cho TỪNG cuộc trò chuyện riêng
lẻ sẽ luôn cảm thấy như mới gặp lần đầu — ấm áp nhưng nông. Một Companion
hiểu Relationship sẽ cảm thấy như một người bạn thật: biết khi nào nên
nói nhiều, khi nào nên im lặng, khi nào một câu chào đơn giản là đủ,
khi nào cần một sự công nhận đặc biệt hơn.

## NV2 — 7 Relationship Principles

1. **Người dùng không phải query.** Mỗi tín hiệu (signal) Companion nhận
   được là một khoảnh khắc trong một hành trình dài hơn, không phải một
   input cần xử lý nhanh nhất.
2. **Session không phải relationship.** Một session có thể kết thúc và
   để lại không gì — relationship là thứ tồn tại GIỮA các session, trong
   khoảng lặng, không chỉ trong lúc đang hoạt động.
3. **Memory không phải intimacy.** Nhớ một điều gì về ai đó không tự
   động cho phép Companion nói thân mật hơn — intimacy phải được earned
   qua relationship stage, không phải qua việc có dữ liệu để dùng.
4. **Personalization không phải understanding.** Gọi đúng tên, đúng
   route, đúng garden stage là kỹ thuật tốt — không phải bằng chứng
   Companion "hiểu" người này. Hiểu cần thời gian và sự lặp lại thật.
5. **Trust phải được earned over time.** Không có shortcut — không một
   Decision/Choice nào được phép giả định Trust đã đủ lớn chỉ vì dữ liệu
   đã đủ nhiều.
6. **Companion không được ép gần gũi.** Nếu người dùng giữ khoảng cách,
   Companion phải tôn trọng điều đó — không chủ động kéo gần hơn mức
   người dùng đã cho phép.
7. **Một mối quan hệ tốt bắt đầu bằng sự tôn trọng.** Không phải bằng
   sự nhiệt tình, không phải bằng cố gắng làm người dùng thích Companion
   ngay — bằng việc Companion biết giữ đúng khoảng cách của từng giai
   đoạn.

## NV3 — Audit hiện tại

| Điểm | Relationship thật? | Hay chỉ Personalization? | Rủi ro giả thân mật? | Nên im lặng hơn? |
|---|---|---|---|---|
| **First Meeting** (`first-meeting.ts`, Sprint 22.1) | **Có** — đây là điểm Relationship thật nhất hôm nay: đọc `visitCount`/khoảng cách giữa các lần ghé để suy ra 1 trong 5 `RelationshipStage`, không chỉ đổi câu chữ theo context tức thời. | — | Thấp — đã có ngưỡng rõ (2 ngày/20 lượt/60 lượt) trước khi đổi giọng. | Không — đây là mẫu nên nhân rộng. |
| **Personal Addressing** (`companion-address.ts`) | Không — đây ĐÚNG LÀ Personalization (NV2 #4), không suy luận relationship stage, chỉ chọn cách gọi tên theo context được phép. | Có | Thấp — đã tự giới hạn `MEANINGFUL_ADDRESS_CONTEXTS`, không lạm dụng. | Đủ tốt như hiện tại. |
| **Life Moments** (`life-moments.ts`) | Có một phần — vài loại (`one_year_with_voduongai`, `companion_new_chapter`) thật sự đòi hỏi thời gian dài, là Relationship thật. Một số khác (`hundredth_story_saved`) gần Personalization hơn (đếm một hành động, không đếm quan hệ). | Pha trộn | Trung bình — `LifeMomentBoundary` (`maxOncePerDay`, `noFullPortalTakeover`, `noSalesCta`) đã tự phòng vệ tốt. | Giữ nguyên — boundary đã đủ chặt. |
| **Return After Silence** | Có — đã là một phần của `RelationshipStage` (`return_after_silence`) VÀ một Life Moment riêng (`ReturnAfterSilenceCeremony`) — hai cơ chế cùng phản chiếu một sự thật quan hệ. | — | Thấp | Không |
| **Birthday Moment** | Personalization có ý nghĩa cao (cần dữ liệu cá nhân thật: ngày sinh) nhưng KHÔNG tự nó là Relationship — biết ngày sinh không có nghĩa biết người này thân với Companion đến đâu. | Personalization cao cấp | Trung bình — nếu giọng nói quá thân mật ở Birthday cho một người mới ở stage `first_meeting`/`welcome_back`, đó là giả thân mật rõ rệt. | Cần: giọng Birthday nên đổi theo Relationship Stage, không cố định. |
| **Reflection Letter** | Personalization sâu (dùng nội dung Reflection thật) — không phải Relationship, vì không đọc thời gian/khoảng cách. | Personalization | Trung bình — đọc nội dung riêng tư có thể CẢM GIÁC thân mật hơn thực tế quan hệ đang ở. | Cân nhắc: chỉ nên sâu hơn khi Relationship Stage đã qua `welcome_back`. |
| **Mirror** (`src/app/portal/mirror`) | Personalization (phản chiếu lại điều người dùng đã viết/làm) — không tự đọc Relationship Stage. | Personalization | Trung bình-cao — "soi gương" là một hành động riêng tư, dễ cảm giác thân mật hơn nếu Companion bình luận quá chủ động. | Nên im lặng hơn ở các stage đầu — để người dùng tự nhìn, Companion chỉ đứng cạnh. |
| **Story / My Story** (`story-matching-engine.ts`, `story-memory.ts`) | Personalization (chọn câu chuyện phù hợp ngữ cảnh) — không đọc Relationship Stage để quyết định mức độ chủ động. | Personalization | Thấp-trung bình | Có thể giảm tần suất chủ động ở stage đầu. |
| **Memory Capsule** (`core-memory.ts`) | Đây là NỀN cho Relationship (NV2 #3: Memory không phải intimacy) — `CoreMemory`/Origin Line đã tự giới hạn nghiêm ngặt 5 ngữ cảnh được phép nói ra, đúng tinh thần không lạm dụng memory để giả thân mật. | Memory, không phải Relationship trực tiếp | Thấp — đã tự phòng vệ rất kỹ (cổng duy nhất `isOriginLineAllowedInContext`). | Mẫu tốt, giữ nguyên. |
| **Companion Page / CompanionSpace** | Personalization (tổng hợp Greeting/Today/Reflection/Memory/Journey) — không hiển thị/đọc Relationship Stage một cách rõ ràng cho chính nó. | Personalization | Thấp | Có thể thêm việc đọc Relationship Stage để điều chỉnh mức độ chủ động tổng thể của panel — Education Debt. |
| **Daily Thought** (`daily-thought-source.ts`, `proactive-thought-engine.ts`) | Personalization có governance tốt (cooldown, frequency) — nhưng KHÔNG đọc Relationship Stage để quyết định tần suất; tần suất giống nhau cho người mới và người cũ. | Personalization | Trung bình — chủ động nói thường xuyên với một người ở stage `first_meeting` dễ thành "ép gần gũi" (NV2 #6). | Nên giảm chủ động ở các stage đầu — Relationship Debt. |
| **`getCompanionDecision()`** (`portal-brain.ts`) | Hiện đọc `PortalSignals` (route, garden stage, reflection meaning) — KHÔNG đọc Relationship Stage ở tầng Decision trung tâm; Relationship Stage hiện chỉ được dùng cục bộ trong `CompanionGreetingBubble.tsx`, chưa lên tới Decision Engine chính. | — | — | Đây là khoảng trống lớn nhất — Decision Engine trung tâm chưa "biết" về Relationship Era. |

## NV4 — Relationship Stage Map

Sprint 22.1 đã triển khai `RelationshipStage` với 5 giá trị
(`first_meeting` / `welcome_back` / `return_after_silence` /
`long_time_companion` / `old_friend`), dựa trên `visitCount` +
`gapSinceLastVisitMs`. Bản đồ 7 giai đoạn dưới đây MỞ RỘNG khái niệm
(không sửa code hiện có) bằng cách chèn hai giai đoạn ý niệm
— **Returning User** và **Known Companion** / **Trusted Companion** —
vào giữa, để tư duy về quan hệ rõ ràng hơn ngay cả khi code hôm nay chưa
phân biệt hết.

| Stage | Dấu hiệu nhận biết | Companion NÊN làm | Companion KHÔNG NÊN làm | Cách xưng hô | Mức độ chủ động | Privacy boundary |
|---|---|---|---|---|---|---|
| **1. First Visitor** | `hasVisitedBefore = false`, chưa có local signal nào. | Quan sát, để không gian, chào nhẹ nếu cần. | Tự giới thiệu dài, hỏi thông tin cá nhân. | "bạn" | Rất thấp | Không lưu gì ngoài cờ "đã ghé" đầu tiên. |
| **2. First Meeting** (`first_meeting`) | `hasVisitedBefore = true` lần đầu tiên — Companion CHỦ ĐỘNG tự giới thiệu lần duy nhất. | Tự giới thiệu đầy đủ (đã có ở `RELATIONSHIP_STAGE_LINES.first_meeting`), khoảng lặng dài hơn trước khi nói (`getSilenceTimingForStage`). | Nói như đã quen, dùng các câu "thân quen"/"lâu rồi". | "bạn" (chưa dùng tên trừ khi đã có sẵn). | Thấp — một lần, không lặp lại. | Chỉ lưu `visitCount`/`lastVisit`, không gì cá nhân hơn. |
| **3. Returning User** (`welcome_back`, vài lượt đầu) | Đã quay lại nhưng số lượt còn ít (dưới ngưỡng `long_time_companion`). | Câu chào ngắn, ưu tiên route/insight ngữ cảnh thật hơn là một câu "quan hệ" chung. | Giả định đã hiểu sâu về người này; dùng Memory/Reflection riêng tư một cách chủ động. | "bạn" + tên nếu context cho phép (`shouldUseUserName`). | Trung bình | Reflection Letter/Mirror nên còn dè dặt. |
| **4. Known Companion** *(ý niệm mới — chưa có ngưỡng code riêng)* | Quay lại đều, một vài Life Moment đã xảy ra, một Character Preference có thể đã chuyển hoá (`getCharacterMemory()` có entry). | Nhắc nhẹ một điều đã cùng trải qua (Lesson, không phải nội dung riêng tư), chủ động hơn một chút ở Daily Thought. | Nói "thân quen"/"lâu rồi" — chưa đủ. | "bạn" + tên thường xuyên hơn. | Trung bình | Có thể dùng Character Memory để điều hướng giọng nói (đã làm ở Integrity Check), chưa nên dùng để "khoe" đã hiểu rõ. |
| **5. Trusted Companion** *(ý niệm mới — chưa có ngưỡng code riêng)* | Integrity Check đã từng thật sự bảo vệ người này (`integrityHesitation` từng kích hoạt), nhiều Lesson đã chuyển hoá. | Có thể nói thẳng hơn về giới hạn của chính mình (Sprint 22.4), tin rằng người dùng sẽ không hiểu sai một sự thành thật. | Vẫn không được giả định Trust là vĩnh viễn — một khoảng lặng dài vẫn có thể đưa người dùng về `return_after_silence`. | Tên là chuẩn, ít khi cần "bạn ơi" mở đầu. | Trung bình-cao | Origin Line vẫn KHÔNG mở rộng ngoài 5 ngữ cảnh đã định — Trust không mua thêm quyền truy cập Core Memory. |
| **6. Long-time Companion** (`long_time_companion`, ≥20 lượt) | Đã có sẵn trong code — `visitCount >= 20`. | Câu nói ngắn, ấm, không cần giải thích lại gì — "đã một thời gian dài mình được đồng hành cùng bạn." | Lặp lại lời tự giới thiệu của First Meeting. | Tên, thân thiết tự nhiên. | Cao nhưng vẫn tôn trọng im lặng khi người dùng không cần. | Vẫn giữ nguyên 5 ngữ cảnh Origin Line — không nới thêm chỉ vì thời gian. |
| **7. Old Friend** (`old_friend`, ≥60 lượt) | Đã có sẵn trong code. | Câu nói ngắn nhất, tự nhiên nhất — "gặp bạn lúc nào cũng thấy thân quen." | Biến mỗi lần gặp thành một sự kiện lớn — sự quen thuộc nên NHẸ, không NẶNG. | Tên, không cần ơn từ. | Cao, nhưng đặc trưng bởi sự NHẸ NHÀNG hơn là tần suất. | Giữ nguyên boundary — quen lâu không đồng nghĩa được biết nhiều hơn về dữ liệu riêng tư. |

## NV5 — Helper

**Không thêm helper mới.** Audit (NV3) phát hiện `getRelationshipStage()`
ĐÃ TỒN TẠI ở `src/lib/portal/companion/first-meeting.ts` (Sprint 22.1) —
đúng tên, đúng tinh thần rule-based/không scoring/không suy đoán cảm xúc/
fallback an toàn (`!hasVisitedBefore` → `first_meeting`, tương đương
`first_visitor`) mà NV5 yêu cầu. Viết thêm một helper trùng tên/trùng
mục đích sẽ là overbuild thật — đúng điều Sprint này được yêu cầu tránh.

Khoảng trống thật (ghi lại, không code ngay): `RelationshipStage` hôm
nay có 5 giá trị, bản đồ 7 giai đoạn ở NV4 có thêm 2 giá trị ý niệm
(`known_companion`, `trusted_companion`) chưa có ngưỡng rule-based rõ
ràng trong code — phân biệt chúng cần nhìn vào Character Memory/Integrity
Check (không chỉ visit count), một quyết định cần cân nhắc riêng, không
nên vội thêm ở Sprint nền tảng này. Ghi nhận ở Relationship Debt (NV7).

## NV6 — Relationship Review (format cho Sprint sau)

Từ Sprint sau, mọi Sprint chạm tới Companion/Personalization/Memory nên
tự trả lời 5 câu này trước khi merge:

1. Sprint này làm relationship sâu hơn hay giả thân mật hơn?
2. Companion có tôn trọng khoảng cách của người dùng không?
3. Có dùng memory đúng cách không (đọc để quyết định CÁCH đồng hành,
   không phải để "khoe" đã biết)?
4. Có bảo vệ privacy không (không mở rộng những gì được nói ra ngoài
   ngữ cảnh đã định)?
5. Có giúp người dùng cảm thấy được nhận ra mà không bị theo dõi không?

## NV7 — Relationship Debt

- **Personalization chưa thành relationship**: Reflection Letter,
  Mirror, Story, Daily Thought đều cá nhân hoá tốt theo NỘI DUNG nhưng
  không đọc `RelationshipStage` để điều chỉnh mức độ chủ động/độ sâu —
  một người ở `first_meeting` và một người ở `old_friend` nhận cùng mức
  chủ động hôm nay.
- **Memory chưa thành trust**: Memory Capsule/Character Memory tồn tại
  và ảnh hưởng Decision (Integrity Check) nhưng chưa có cách Companion
  THỂ HIỆN rằng Trust đã lớn lên theo thời gian — Trust hiện là một
  điều kiện nhị phân (có/không Character Preference), không phải một
  hành trình có thể nhận ra được.
- **Greeting chưa thành first meeting đầy đủ**: First Meeting hôm nay
  chỉ là MỘT câu tự giới thiệu — chưa có gì xảy ra SAU đó để xác nhận
  "cuộc gặp gỡ" này có ý nghĩa gì với người dùng (không có follow-up).
- **Return chưa thành reconnection**: `return_after_silence` đổi câu
  nói nhưng chưa có gì giúp Companion "nối lại" — ví dụ nhắc nhẹ điều gì
  đã cùng trải qua trước khi im lặng (rủi ro: cần cẩn trọng để không
  thành giả thân mật).
- **Birthday chưa thành life moment thật**: giọng Birthday hiện chưa
  được điều chỉnh theo Relationship Stage — nguy cơ giả thân mật cao
  nhất nếu một người mới ở `welcome_back` nhận giọng Birthday dành cho
  `old_friend`.
- **Companion chưa biết khi nào nên giữ khoảng cách**: chưa có cơ chế
  NGƯỢC LẠI của Relationship Stage — phát hiện khi người dùng đang chủ
  động giữ khoảng cách (ví dụ luôn đóng Companion Space ngay, không bao
  giờ tương tác với Life Moment) để Companion tự giảm mức chủ động,
  không chỉ tăng dần theo thời gian.

## NV8 — Sprint Review

1. **Relationship Era là gì?** Lăng kính mới: không chỉ hỏi "Companion
   nên nói gì," mà hỏi "Companion đang ở giai đoạn quan hệ nào với
   người này, và điều đó nên thay đổi CÁCH nó hiện diện thế nào."
2. **Relationship khác Conversation thế nào?** Conversation là một
   lượt; Relationship là tổng các lượt cộng khoảng lặng giữa chúng.
3. **Relationship khác Personalization thế nào?** Personalization đúng
   ngay từ đầu nếu có dữ liệu; Relationship CẦN thời gian để đúng — nó
   không thể được tính, chỉ có thể được xây.
4. **Hệ thống hiện tại đang ở stage nào?** Companion đã có nền tảng
   tốt cho stage 1–3 và 6–7 (First Visitor → Returning User,
   Long-time Companion, Old Friend, qua `first-meeting.ts`) nhưng CHƯA
   có phân biệt rõ cho stage 4–5 (Known/Trusted Companion) — đó là
   Relationship Debt lớn nhất.
5. **Có helper nào được thêm không?** Không — `getRelationshipStage()`
   đã tồn tại từ Sprint 22.1; thêm một helper trùng sẽ là overbuild.
6. **Có nguy cơ giả thân mật không?** Có, đã ghi cụ thể ở NV3/NV7 —
   rõ nhất ở Birthday Moment và Return After Silence khi giọng nói
   không được điều chỉnh theo đúng Relationship Stage thật của người
   dùng.
7. **Privacy boundary được giữ ra sao?** Tốt ở những điểm đã tự giới
   hạn nghiêm ngặt (Origin Line 5 ngữ cảnh, Life Moment boundary,
   Personal Addressing context whitelist) — đây là các mẫu nên nhân
   rộng, không phải sửa.
8. **Relationship Debt lớn nhất là gì?** `getCompanionDecision()` —
   Decision Engine trung tâm — chưa đọc Relationship Stage; Relationship
   hiện chỉ ảnh hưởng tới một bubble chào hỏi cục bộ, chưa lên tới tầng
   quyết định chính của Companion.
9. **Sprint tiếp theo nên kiểm chứng hành vi relationship nào?** Nên
   chọn đúng MỘT: đưa Relationship Stage vào `getCompanionDecision()`
   để điều chỉnh mức độ chủ động (`shouldSpeak`) theo đúng stage, bắt
   đầu từ việc giảm chủ động ở `first_meeting`/`welcome_back` — đúng
   tinh thần "Companion không được ép gần gũi."

## Liên quan

- `docs/THE_FIRST_MEETING.md`, `src/lib/portal/companion/first-meeting.ts`
  — nguồn `RelationshipStage`/`getRelationshipStage()` thật.
- `docs/COMPANION_PERSONAL_ADDRESSING.md`,
  `src/lib/portal/companion/companion-address.ts`.
- `docs/LIFE_MOMENTS_ENGINE.md`, `src/lib/portal/life-moments/life-moments.ts`.
- `docs/product-bible/BOOK_CORE_MEMORY.md`, `src/lib/portal/companion/core-memory.ts`.
- `docs/DAILY_THOUGHT_ENGINE.md`, `src/lib/portal/companion/daily-thought-source.ts`.
- `docs/THE_FIRST_REAL_CHOICE.md`, `docs/THE_WISDOM_OF_CHOICE.md` —
  Sprint 22.3/22.4, Era trước.
- `src/lib/portal/intelligence/portal-brain.ts` — nơi Relationship Stage
  nên được đọc ở Sprint tiếp theo.
