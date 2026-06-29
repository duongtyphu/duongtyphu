# Moral Compass

> Sprint 20.2 "Moral Compass" (Chapter Listening). Sprint nền tảng của
> Character Engine (`docs/CHARACTER_ENGINE.md`, Sprint 20.1) —
> KHÔNG làm Companion thông minh hơn, mà giúp Companion **lựa chọn
> đúng hơn**. Áp dụng `THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`
> lên đúng điểm chọn moment cụ thể nhất Companion có:
> `chooseCompanionMoment()` (`thought-governance.ts`, Sprint 18.6).

## 1. Moral Compass là gì

Một lớp giá trị **RULE-BASED THUẦN** đứng TRƯỚC mọi Decision Engine.
KHÔNG phải AI, KHÔNG phải LLM, KHÔNG phải Machine Learning, không vector
database. Câu hỏi cốt lõi của Moral Compass không phải:

> "Điều gì đúng?"

mà là:

> **"Điều gì là tốt nhất cho con người ở thời điểm này?"**

Đây là sự khác biệt quan trọng nhất: "đúng" gợi ý một quy tắc trừu
tượng, cố định; "tốt nhất cho con người ở thời điểm này" buộc Companion
luôn nhìn về phía người dùng cụ thể trước khi nhìn về phía quy tắc kỹ
thuật của chính nó.

Kiến trúc Decision Flow trước Sprint này là `Decision → Action`. Từ
Sprint này:

```
Character → Judgement → Moral Compass → Decision → Action → Outcome → Reflection
```

Moral Compass đứng SAU Character (Companion đã biết phẩm chất của
chính mình — `character-engine.ts`) và SAU Judgement (Companion đã
hình thành nhận định về tình huống), nhưng TRƯỚC Decision — nó là bước
cuối cùng tự vấn trước khi một Decision Candidate được phép trở thành
Decision thật.

## 2. Khác Decision Engine ở đâu

| | Decision Engine | Moral Compass |
|---|---|---|
| Câu hỏi | "Companion nên nói gì/làm gì bây giờ?" | "Điều này có tốt nhất cho con người không?" |
| Vai trò | Tạo & chọn Decision Candidate (`getCompanionDecision()`, `chooseCompanionMoment()`) | Tự vấn TRƯỚC khi một Decision Candidate được chọn |
| Có quyền tạo nội dung mới? | Có (đây là nơi nội dung/loại moment được sinh ra) | Không — không bao giờ tạo candidate, không đổi nội dung |
| Có quyền đổi kết quả chọn? | Là kết quả cuối cùng | Có — đổi kết quả chọn dựa trên Human Benefit, không dựa trên nội dung |

Moral Compass không thay thế Decision Engine — nó là điều kiện Decision
Engine phải đi qua trước khi kết quả của nó được công bố là Decision
cuối cùng.

## 3. Khác Character Engine ở đâu

Character Engine (`character-engine.ts`, Sprint 20.1) và Moral Compass
(`moral-compass.ts`, Sprint 20.2) là HAI lớp riêng, can thiệp ở HAI
điểm khác nhau trong code:

- **Character Engine** can thiệp ở `applyCharacterReview()`, ngay
  trước `loudestVoice()` trong `portal-brain.ts` — tầng "tiếng nói nội
  tâm" (`VoiceMessage`). Nó chỉ đổi thứ tự giữa các candidate **cùng
  một cấp `priority`** — không bao giờ làm `priority` thấp thắng
  `priority` cao.
- **Moral Compass** can thiệp ở `chooseCompanionMoment()` trong
  `thought-governance.ts` — tầng "loại moment nào thật sự được nói"
  (Daily Thought/Greeting/Story Moment/...). Nó đi xa hơn Character
  Engine: nó cho phép Human Benefit thắng Priority kỹ thuật cũ
  (`MOMENT_PRIORITY_ORDER`) hoàn toàn, không chỉ tie-break trong cùng
  một cấp.

Hai lớp này không xung đột — chúng phục vụ hai điểm quyết định khác
nhau trong cùng kiến trúc Companion, và cùng dựa trên `CHARACTER_PROFILE`
8 phẩm chất (`character-engine.ts`).

## 4. Khác Rule Engine thường ở đâu

Một Rule Engine kỹ thuật thuần (như `MOMENT_PRIORITY_ORDER` cũ) trả lời
câu hỏi "cái nào đứng trước theo thứ tự đã định nghĩa sẵn?" — quy tắc
được viết ra vì lý do **kỹ thuật** (engine nào được code trước, loại
moment nào "nặng" hơn về mặt hệ thống). Moral Compass dùng đúng cơ chế
rule-based (không có gì "thông minh" hơn một bảng tra cứu), nhưng quy
tắc được viết ra vì lý do **con người**: Respect, Growth, Trust,
Long-term Relationship — không phải CTR, Click, hay Time on site.

Nói cách khác: Moral Compass và Rule Engine giống nhau 100% về CÁCH
THỰC HIỆN (rule-based, không AI) — khác nhau hoàn toàn về LÝ DO mỗi quy
tắc tồn tại.

## 5. Vì sao Companion cần Moral Compass

Nếu không có lớp này, mọi điểm chọn lựa của Companion (Decision Engine,
Thought Governance) sẽ mãi mãi tối ưu theo các chỉ số kỹ thuật/thứ tự
viết code — không phải theo điều tốt nhất cho người dùng. Một Companion
"mạnh" (nhiều loại moment, nhiều engine, phản hồi nhanh) không tự động
là một Companion "đáng tin" (`THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`).
Moral Compass là cơ chế cụ thể, rule-based, có thể audit được, bảo đảm
mỗi lần Companion phải chọn giữa nhiều điều hợp lệ, nó chọn điều tốt
nhất cho CON NGƯỜI, không chỉ điều đứng trước theo bảng ưu tiên kỹ
thuật.

> **Cập nhật — `THE_DECISION_HIERARCHY.md`**: Moral Compass là CƠ CHẾ
> cụ thể thực thi tầng "human" của Decision Hierarchy (Con người →
> Nhân cách → Niềm tin → Tri thức → Hiệu suất) tại lớp Thought
> Governance. `humanBenefitRank()` thắng `momentPriority()` chính là
> tầng "human" thắng tầng "performance" — không phải một ngoại lệ
> riêng của Sprint này, mà một áp dụng cụ thể của luật chung. Xem tài
> liệu đó để biết toàn bộ 5 tầng.

## Bốn câu hỏi trước mọi lựa chọn

`reviewWithFourQuestions()` (`moral-compass.ts`) — rule-based:

1. Điều này có tôn trọng con người không? (`respectsHuman`)
2. Điều này có giúp người dùng trưởng thành hơn không? (`helpsGrowth`)
3. Điều này có phản ánh đúng nhân cách của Companion không? (`reflectsCharacter`)
4. Nếu nhiều năm sau nhìn lại, Companion có còn tự hào về lựa chọn này
   không? (`wouldBeProudLater`)

Ba câu đầu vẫn trả `true` cho 11 loại moment đang tồn tại hôm nay — RÀO
CHẮN cho loại moment MỚI trong tương lai, đúng pattern
`respectsUser`/`isHumble` ở Character Engine, chưa phải bộ lọc thật.

> **Cập nhật — `docs/THE_TRUST_MUST_BE_REAL.md` (Sprint 21.4)**: câu 4
> (`wouldBeProudLater`) không còn hardcode `true` — nó đọc thật
> `HUMAN_BENEFIT_ORDER` (`type in HUMAN_BENEFIT_ORDER`). Một
> `CompanionMomentType` mới chưa được thêm vào `HUMAN_BENEFIT_ORDER` sẽ
> khiến cờ này trả `false` thật — guardrail Trust đầu tiên có khả năng
> chặn, không chỉ lý thuyết. Ba câu đầu chưa thuộc phạm vi Sprint đó.

## Human Benefit thắng Priority

`humanBenefitRank()` (`moral-compass.ts`) thay thế `momentPriority()`
trong sort comparator của `chooseCompanionMoment()`. `HUMAN_BENEFIT_ORDER`
giữ nguyên toàn bộ `MOMENT_PRIORITY_ORDER` cũ — **trừ một thay đổi duy
nhất, có chủ đích**: `greeting` được xếp trước `daily-thought`.

Vì sao chỉ một thay đổi, không phải một bảng điểm độc lập cho từng
moment: một bảng điểm Respect/Growth/Trust/Long-term Relationship tính
riêng cho từng loại sẽ tạo ra nhiều đảo lật KHÔNG được kiểm soát (ví dụ
có thể vô tình làm `return-after-silence` hay `origin-line` thắng
`safety-boundary` — điều không bao giờ được phép xảy ra). Một thay đổi
duy nhất, được giải thích rõ, có thể audit được, đúng tinh thần "Rule-
based, không over-engineer" của brief.

## Verification — một Decision thật đã đổi

**Tình huống**: cùng lúc, hai moment đều `isEligible: true`, đều
`isMajor: true`, đều đủ Speech Budget (`canAffordMajorMoment()` trả về
`true` cho cả hai) — `"daily-thought"` và `"greeting"`. Không có
`safety-boundary`/`life-moment`/`return-after-silence`/`birthday` nào
đang đủ điều kiện (các loại này luôn thắng tuyệt đối, không bị Sprint
này đổi).

**Decision TRƯỚC Sprint này** (`momentPriority()`,
`MOMENT_PRIORITY_ORDER`): `daily-thought` ở vị trí 6, `greeting` ở vị
trí 8 — `daily-thought` thắng. `chosen: "daily-thought"`, lý do: `"daily-
thought" có ưu tiên cao nhất...` — lý do hoàn toàn kỹ thuật (đứng trước
trong bảng).

**Decision SAU Sprint này** (`humanBenefitRank()`, `HUMAN_BENEFIT_ORDER`):
`greeting` ở vị trí 6, `daily-thought` ở vị trí 8 — `greeting` thắng.
`chosen: "greeting"`, lý do: `"greeting" mang lại Human Benefit cao
nhất (Moral Compass)...`.

**Điều gì đã đổi**: KHÔNG có engine mới, KHÔNG có nội dung mới — cùng
một danh sách candidate, cùng một Speech Budget, nhưng Companion chọn
chào người dùng trước khi chia sẻ một suy nghĩ hay. Sự thay đổi này
xảy ra **không phải vì Priority** (cả hai vẫn `isMajor`, cùng đủ điều
kiện) — **mà vì Character**: Moral Compass đánh giá việc thừa nhận sự
có mặt của một con người cụ thể (Respect) tốt hơn cho người dùng ở thời
điểm này so với một suy nghĩ chưa được yêu cầu.

## Companion Growth Review

Theo `THE_HUMAN_UNDERSTANDING_MISSION.md`, không hỏi "Companion thông
minh hơn ở đâu":

- **Companion nhân văn hơn ở đâu?** Companion không còn chọn moment chỉ
  vì nó "đứng trước trong bảng kỹ thuật" — nó chọn moment tôn trọng sự
  có mặt của một con người trước.
- **Companion đáng tin hơn ở đâu?** Lý do hiển thị trong
  `CompanionMomentDecision.reason` giờ nói thật về tiêu chí chọn (Human
  Benefit), không che giấu sau một từ mơ hồ ("ưu tiên cao nhất").
- **Companion trưởng thành hơn ở đâu?** Companion có thêm một bước tự
  vấn (Bốn Câu Hỏi) trước khi để bất kỳ Decision Candidate nào — kể cả
  candidate "thắng" theo bảng cũ — được nói ra.

## Định nghĩa hoàn thành

Sprint này hoàn thành vì: ít nhất một Decision của Companion
(`chooseCompanionMoment()` chọn `"greeting"` thay vì `"daily-thought"`
trong tình huống ở mục Verification) đã thay đổi — không phải vì
Priority (cả hai cùng `isMajor`, cùng đủ điều kiện, cùng đủ Speech
Budget) — mà vì Character (Human Benefit, qua Moral Compass).

## Ràng buộc kiến trúc

Không thêm AI model. Không thêm LLM. Không thêm vector database. Không
over-engineer. Toàn bộ `moral-compass.ts` là rule-based thuần (hai
mảng tra cứu + một hàm `.indexOf()`), có thể mở rộng (thêm loại moment
mới chỉ cần thêm vào `HUMAN_BENEFIT_ORDER` và viết lý do tương ứng vào
tài liệu này).

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
└── THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md
    └── docs/CHARACTER_ENGINE.md (Sprint 20.1)
        └── docs/MORAL_COMPASS.md (Sprint 20.2 — tài liệu này)
```

> **Cập nhật — `docs/CHARACTER_COHERENCE.md` (Sprint 21.5)**: Moral
> Compass xét MỘT Decision Candidate trước con người — nó KHÔNG xử lý
> xung đột giữa hai phẩm chất nội tại của Companion (`humility` vs
> `wisdom`, `compassion` vs `integrity`...). Đó là phạm vi của Character
> Coherence (`docs/CHARACTER_CONFLICT_MAP.md`) — một lớp riêng, đứng
> trước cả Moral Compass, vì một Companion phải nhất quán với chính nó
> trước khi có thể hỏi điều gì tốt nhất cho con người.

Xem tiếp: `docs/CHARACTER_ENGINE.md`, `docs/COMPANION_THOUGHT_GOVERNANCE.md`,
`THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`, `THE_COMPANION_FORMATION.md`,
`docs/CHARACTER_COHERENCE.md`.
