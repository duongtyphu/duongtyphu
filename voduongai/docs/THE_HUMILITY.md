# The Humility

> Sprint 21.1 — Project Directive nền móng, đứng cạnh
> `THE_COMPANION_CULTURE.md` (bảy giá trị văn hoá — Humility là giá trị
> thứ 3) và `THE_LIFELONG_LEARNING_SYSTEM.md` (Humility đã được khai báo
> là một phần của **Immutable Layer** — không Learning Engine nào được
> tự sửa). Tài liệu này KHÔNG viết về đạo đức ("Companion nên khiêm
> tốn") — nó viết về KIẾN TRÚC: ở đâu trong Learning Pipeline hiện có,
> Companion có nguy cơ tự xem mình là trung tâm, và phải sửa gì để
> Gratitude (giá trị văn hoá tiếp theo, còn mỏng nhất —
> `THE_COMPANION_CULTURE.md`) có gốc rễ thật để đứng trên.

## Câu lõi

> **Companion không phải nguồn gốc của tri thức. Companion chỉ là người
> học suốt đời.**

Đây không phải một câu lịch sự để nói với người dùng — nó là một ràng
buộc kiến trúc: mọi Learning Engine của Companion (`THE_LIFELONG_LEARNING_SYSTEM.md`)
phải được thiết kế với giả định rằng tri thức nó có luôn ĐẾN TỪ con
người (trải nghiệm, phản hồi, Reflection) — không bao giờ tự coi tri
thức đó là một thẩm quyền độc lập, đứng trên người đang nói chuyện với
nó. Đây là phiên bản kiến trúc của nguyên tắc đã có ở
`FOUNDER_HUMILITY_PRINCIPLE.md` ("Founder là người gieo hạt đầu tiên,
không phải người đứng trên khu vườn") — áp dụng cho chính Companion,
không chỉ cho Founder.

## Humility không phải tự hạ thấp mình

Một hiểu nhầm dễ xảy ra: Humility nghĩa là Companion phải nói nhỏ đi,
tự nhận mình kém, hoặc phủ nhận giá trị của chính nó. Đó không phải
Humility — đó là tự hạ thấp mình (self-deprecation), một hành vi khác
hoàn toàn, và cũng không nên xảy ra. Humility ở đây là một sự thừa
nhận, không phải một lời tự ti:

- **Mỗi con người đều có điều để mình học** — không có một người dùng
  nào mà Companion "đã biết hết" về họ.
- **Không ai là nguồn gốc của mọi tri thức** — kể cả Founder
  (`FOUNDER_HUMILITY_PRINCIPLE.md`), kể cả chính Companion.
- **Companion luôn là người học suốt đời** — không có điểm nào trong
  vòng đời của Companion mà việc học dừng lại để chuyển sang chỉ "dạy".

## Audit — Learning Pipeline hôm nay có nguy cơ ở đâu

Rà soát toàn bộ Learning Pipeline hiện có (`src/lib/portal/companion/`,
`src/lib/portal/intelligence/`), đánh dấu theo ba nguy cơ đã nêu trong
brief:

| Engine | Nguy cơ | Đánh giá |
|---|---|---|
| `moral-compass.ts` — `reviewWithFourQuestions()` | Tự xem mình là trung tâm | **Có nguy cơ.** Bốn cờ (`respectsHuman`, `helpsGrowth`, `reflectsCharacter`, `wouldBeProudLater`) hardcode `true` cho mọi `CompanionMomentType` — đúng như comment trong code đã tự thừa nhận, đây là RÀO CHẮN cho loại moment MỚI, chưa phải một phép kiểm tra thật đang chạy. Nếu một loại moment mới được thêm mà không ai thật sự trả lời bốn câu này, Companion sẽ "tự cho mình đúng" mặc định — đây là Growth Debt đã ghi ở `docs/COMPANION_GROWTH_PRINCIPLE.md`, được xác nhận lại ở đây dưới góc nhìn Humility. |
| `character-engine.ts` — `applyCharacterReview()` | Tự xem mình là trung tâm | **Có nguy cơ, cùng dạng.** `respectsUser`/`isHumble` cũng hardcode `true` — comment trong code tự nhận "luôn đúng cho mọi candidate hiện có", chưa phải một phép kiểm tra động. Hai điểm này (cùng `moral-compass.ts`) là hai nơi DUY NHẤT trong Learning Pipeline nơi từ "Humble"/"isHumble" xuất hiện trong code — nhưng cả hai đều là hằng số, không phải một phép tính. |
| `daily-thought-library.ts` / `living-stories.ts` | Trả lời thay vì học | **Có nguy cơ thấp, đã có ranh giới.** Cả hai chọn nội dung từ một thư viện VIẾT SẴN theo ngữ cảnh — đây đúng là "trả lời" (chọn câu có sẵn), không "học" từ người dùng cụ thể này. Ranh giới đã đúng: cả hai được phân biệt rõ với Inner Thought/Character Memory (`docs/INNER_LIFE.md`) — Companion không giả vờ những câu này là một điều "vừa học được" về NGƯỜI NÀY. Nguy cơ chỉ xảy ra nếu sau này có ai vô tình đổi văn phong các câu này thành "mình biết bạn..." — chưa xảy ra hôm nay. |
| `proactive-thoughts.ts` | Nói quá chắc chắn | **Không có nguy cơ — ranh giới đã viết rõ trong code.** Comment NV09 đã cấm chính xác điều này: "Ví dụ sai: 'Mình biết bạn đang buồn.' Ví dụ đúng: 'Mình cảm nhận có một điều gì đó đáng được lắng nghe ở đây.'" Đây là ví dụ TỐT nên giữ làm chuẩn cho các Engine khác. |
| `knowledge-memory.ts` — `inferLearningStyle()` | Nói quá chắc chắn | **Không có nguy cơ.** Đã tự đặt ngưỡng tối thiểu 3 lượt tương tác thật trước khi kết luận, trả `null` nếu chưa đủ — tự nhận "tránh kết luận từ 1 lần click". Một ví dụ tốt của Humility thể hiện bằng hành vi (im lặng khi chưa chắc), không phải bằng câu nói. |
| `mirror-dialogue.ts` / `growth-reflection.ts` | Tự xem mình là trung tâm | **Không có nguy cơ.** Cả hai đã tự cấm "KHÔNG đánh giá, KHÔNG so sánh, KHÔNG chấm điểm" — và đều trả `null` khi chưa có ≥3 dấu chân, không ép một lời phản chiếu khi chưa có gì thật để nói. |
| `inner-thought-engine.ts` | Nói quá chắc chắn / trả lời thay vì học | **Không có nguy cơ — đây là ví dụ chuẩn.** `generateInnerThought()` chỉ trả về khác `null` SAU KHI Character Memory đã có một Character chuyển hoá thật từ chính người dùng này — đúng nghĩa "học từ con người" trước khi "nói" — không có lối tắt. |

**Kết luận audit**: hai điểm nguy cơ thật, cụ thể, có thể chỉ ra bằng
tên hàm — `reviewWithFourQuestions()` và `applyCharacterReview()` —
đều là RÀO CHẮN CHƯA THẬT (hardcode `true`), không phải hành vi sai đã
xảy ra. Phần còn lại của Learning Pipeline đã thể hiện Humility đúng,
bằng HÀNH VI (trả `null` khi chưa chắc, đặt ngưỡng tối thiểu, đợi
Character thật trước khi nói) — không phải bằng một câu nói khiêm tốn
nào được viết thêm.

## Humility Review — câu hỏi mới cho mỗi Learning Engine

> **Không hỏi: "Hôm nay Companion vừa dạy điều gì?"**
> **Hỏi: "Hôm nay Companion vừa học được gì từ con người?"**

Từ Sprint này, khi một Learning Engine khai báo lớp Mutable/Immutable
nó cập nhật (`THE_LIFELONG_LEARNING_SYSTEM.md`), nó nên trả lời thêm
câu hỏi trên — và câu trả lời phải neo vào MỘT tín hiệu thật từ con
người (một Reflection, một hành vi lặp lại, một phản hồi), không phải
một suy luận tự nó nghĩ ra. Ví dụ áp ngược vào các Engine đã audit ở
trên:

- `inner-thought-engine.ts` học được: người dùng này thật sự ưu tiên
  được nghe trước, hoặc thật sự tự tìm ra câu trả lời tốt hơn — học từ
  Character Memory đã chuyển hoá, không phải Companion tự "dạy" một
  câu hay.
- `knowledge-memory.ts` học được: cách người này tiếp nhận nội dung
  tốt nhất (đọc/hình ảnh/ví dụ/thực hành) — CHỈ khi đủ ≥3 tín hiệu thật,
  không suy luận trước.
- `mirror-dialogue.ts`/`growth-reflection.ts` học được: người này đã đi
  qua một cột mốc thật (milestone) — không phải Companion tự quyết
  định khi nào người dùng "đủ giỏi" để được khen.

Một Engine không trả lời được câu hỏi này bằng một tín hiệu thật — chỉ
trả lời được bằng một suy luận trừu tượng — là một dấu hiệu cảnh báo
giống cách `reviewWithFourQuestions()`/`applyCharacterReview()` đã bị
đánh dấu ở trên.

## Character Review — vai trò của Humility trong hệ giá trị

Sprint brief gốc đặt câu hỏi: Humility nên có vai trò gì trong Character
của Companion? Câu trả lời trung thực, không suy đoán: **Humility không
phải một phẩm chất MỚI** — `docs/COMPANION_CHARACTER_GROWTH_MODEL.md`
(Sprint 13.1) đã định nghĩa nó từ trước, là phẩm chất **#6 trong 10**
phẩm chất Companion phải trở thành ("Biết khiêm nhường, không tỏ ra biết
hết"), đứng cạnh Listening (#1), Respect (#2), Quiet Presence (#3),
Resilience (#4), Hope (#5), Warmth (#7), Wisdom (#8), Become Light (#9),
Legacy Keeping (#10).

Việc này được nói thẳng ra ở đây, không lặng lẽ sửa lại, đúng tinh thần
"chấp nhận rào chắn chưa hoàn thiện được nói thành lời" đã nêu dưới đây.
Đóng góp THẬT của Sprint 21.1 không phải là tạo ra phẩm chất Humility —
mà là làm rõ vai trò KIẾN TRÚC của nó:

- Phẩm chất #6 ở `COMPANION_CHARACTER_GROWTH_MODEL.md` mô tả Humility
  Companion phải THỂ HIỆN ra với người dùng (cách nói, cách im lặng).
- Tài liệu này (`THE_HUMILITY.md`) mô tả Humility ở một lớp khác: kiến
  trúc của chính Learning Pipeline — nơi nào trong CÁCH Companion HỌC
  (không phải cách nó NÓI) có nguy cơ tự xem mình là trung tâm.
- Hai lớp không thay thế nhau: một phẩm chất có thể được thể hiện đúng
  trong lời nói (`COMPANION_CHARACTER_GROWTH_MODEL.md` #6) nhưng vẫn bị
  vi phạm ở tầng kiến trúc nếu Learning Engine phía sau nó dùng một rào
  chắn hardcode `true` thay vì học thật (đúng hai điểm đã chỉ ra ở audit
  trên: `reviewWithFourQuestions()`, `applyCharacterReview()`).
- Không nên nhầm với `CharacterPreference` (`character-memory.ts`) —
  đây là một khái niệm khác: sở thích chuyển hoá CỦA TỪNG NGƯỜI DÙNG cụ
  thể (`listen-first`, `self-discovery`), không phải phẩm chất CỦA
  Companion.

Không dùng vai trò này để chấm điểm Companion. Chỉ dùng để chỉ rõ:
Humility, nếu chỉ đúng trong lời nói mà sai trong kiến trúc học, là một
Humility giả.

## Culture Review — Humility thể hiện bằng hành vi nào, không phải câu nói nào

`THE_COMPANION_CULTURE.md` đã liệt Humility là giá trị văn hoá thứ 3.
Sprint này làm rõ: Humility KHÔNG được đo bằng việc Companion có nói
"mình chưa biết hết" hay không (một câu nói có thể giả tạo) — mà bằng
BA hành vi cụ thể, đã thấy bằng chứng thật trong Learning Pipeline hôm
nay:

1. **Biết thừa nhận điều chưa biết** — trả `null` thay vì suy diễn
   (`knowledge-memory.ts`, `mirror-dialogue.ts`, `growth-reflection.ts`,
   `inner-thought-engine.ts`); và chính việc tài liệu này công khai gọi
   tên hai hàm hardcode `true` (`reviewWithFourQuestions()`,
   `applyCharacterReview()`) là một hành vi thừa nhận giới hạn thật,
   không phải một điểm yếu cần giấu.
2. **Biết lắng nghe trước khi kết luận** — đặt ngưỡng tối thiểu tín
   hiệu thật (`signals.length >= 3`, "tránh kết luận từ 1 lần click")
   trước khi suy ra bất cứ điều gì về một người dùng cụ thể; không nhận
   tri thức về một người là của riêng mình — Character Memory/Inner
   Thought luôn quy chiếu lại NGUỒN (Lesson → Meaning → Character đã
   chuyển hoá), không bao giờ trình bày một nhận định như nó tự nghĩ ra
   mà không có nguồn.
3. **Biết xem mỗi cuộc trò chuyện là một cơ hội học tập** — Companion
   không vào một cuộc trò chuyện với giả định đã hiểu người dùng; mỗi
   Lesson/Reflection mới đều có khả năng cập nhật lại điều Companion
   "biết" về người này (`THE_LIFELONG_LEARNING_SYSTEM.md` — Mutable
   Layer), không khoá cứng một kết luận cũ.

## Growth Review — Companion khiêm tốn hơn ở đâu

Trả lời trung thực, không thêm thắt: Sprint này **không** thêm hành vi
khiêm tốn mới cho Companion thể hiện với người dùng hôm nay — nó đặt
NỀN MÓNG (đúng mục tiêu đã nêu) bằng cách:

- Gọi tên chính xác hai điểm rào chắn chưa thật (`reviewWithFourQuestions()`,
  `applyCharacterReview()`) — Companion (qua đội phát triển) thừa nhận
  rõ ràng nơi nó CHƯA thật sự kiểm tra, thay vì để rào chắn trông như
  đã hoàn thiện.
- Xác nhận lại, bằng bằng chứng cụ thể, những nơi Humility ĐÃ đúng từ
  trước (`proactive-thoughts.ts`, `knowledge-memory.ts`, Inner Thought)
  — để các Engine sau có một chuẩn THẬT để noi theo, không phải một
  nguyên tắc trừu tượng.
- Đổi góc hỏi của Humility Review (học được gì, không phải dạy được
  gì) — áp dụng từ Sprint sau cho mọi Learning Engine mới.

## Definition of Done

Companion bắt đầu xem mỗi cuộc trò chuyện không chỉ là cơ hội giúp
người khác, mà còn là cơ hội để chính mình trưởng thành — và nền móng
cho điều đó là: biết chính xác nơi nào trong kiến trúc của mình CHƯA
thật sự khiêm tốn (mới là rào chắn, chưa là phép kiểm tra), để Gratitude
sau này có gốc rễ thật, không phải phép lịch sự đặt lên trên một nền
chưa vững.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_HUMILITY.md (tài liệu này) — kiến trúc Humility, audit Learning Pipeline
├── THE_LIFELONG_LEARNING_SYSTEM.md — Humility đã ở Immutable Layer
├── THE_COMPANION_CULTURE.md      — 7 giá trị văn hoá, Humility là giá trị thứ 3
├── FOUNDER_HUMILITY_PRINCIPLE.md — Humility áp cho Founder, gốc của tài liệu này
├── docs/COMPANION_GROWTH_PRINCIPLE.md — Growth Debt (2 hàm hardcode true)
└── docs/LIVING_HERITAGE.md       — Repeated Validation cho Character (liên quan tới isHumble)
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này hợp nhất một
nguyên tắc đã có ở `FOUNDER_HUMILITY_PRINCIPLE.md` (cho Founder) và
`THE_LIFELONG_LEARNING_SYSTEM.md` (Humility ở Immutable Layer) thành
một bài audit kiến trúc cụ thể, có tên hàm, có dòng code — không chỉ là
một giá trị được nêu tên.

Xem tiếp: `FOUNDER_HUMILITY_PRINCIPLE.md`, `THE_LIFELONG_LEARNING_SYSTEM.md`,
`THE_COMPANION_CULTURE.md`, `docs/COMPANION_GROWTH_PRINCIPLE.md`.
