# The Trust We Earn

> Sprint 21.3 — đứng sau `THE_HUMILITY.md` (Sprint 21.1) và
> `THE_GRATITUDE.md` (Sprint 21.2), áp dụng đúng pipeline review của
> `THE_EDUCATION_ERA.md` (Technical → Behavior → Education → Growth →
> Culture Review). Khác hai Sprint trước: Sprint này KHÔNG thêm
> Character mới, KHÔNG thêm Engine mới, KHÔNG thêm AI/LLM/database.
> Sprint này chỉ đặt tên và bảo vệ một nguyên tắc kiến trúc đã tồn tại
> rải rác từ trước — Niềm tin (Trust), tầng thứ 3 trong
> `THE_DECISION_HIERARCHY.md` — nhưng chưa từng được giải thích đầy đủ
> hay kiểm chứng bằng một audit thật.

## Product Decision

> **Trust không phải là thứ Companion yêu cầu. Trust là món quà mà con
> người tự nguyện trao. Companion chỉ có thể sống sao cho xứng đáng với
> món quà ấy.**

Một Companion "muốn được tin tưởng" sẽ tối ưu hành vi để TẠO CẢM GIÁC
đáng tin (giọng điệu tự tin, hứa hẹn, trấn an) — đây là hướng dễ rơi vào
diễn. Một Companion "học cách xứng đáng với niềm tin" không tối ưu cảm
giác — nó tối ưu HÀNH VI LẶP LẠI NHẤT QUÁN theo thời gian, đúng câu mở
đầu của Sprint: "Trust không phải một Engine. Trust là kết quả của hàng
nghìn hành vi đúng đắn được lặp lại một cách nhất quán." Không có một
dòng code nào "tạo ra" Trust — Trust chỉ có thể được QUAN SÁT, qua việc
mỗi Decision riêng lẻ có giữ đúng những gì đã hứa hay không.

Đây là lý do Sprint này không tạo Trust Engine: một Engine "tính điểm
Trust" sẽ biến Trust thành một con số — đúng thứ `COMPANION_GROWTH_MODEL.md`
và toàn bộ project đã cấm (không Level, không gamify, không điểm số
hiển thị). Trust ở đây là một LĂNG KÍNH để xem lại Decision đã có, không
phải một tính năng mới.

## Nhiệm vụ 1 — Trust là gì trong kiến trúc này

`docs/THE_DECISION_HIERARCHY.md` đã đặt tên "Niềm tin (Trust)" là tầng
thứ 3 trong 5 tầng (Con người → Nhân cách → Niềm tin → Tri thức →
Hiệu suất), với một dòng giải thích ngắn: "Quyết định phải giữ được sự
nhất quán/đáng tin theo thời gian." Sprint này không thay tầng đó —
Sprint này LÀM RÕ nó:

- **Trust không đo lường tại một thời điểm.** Một Decision không "đáng
  tin" hay "không đáng tin" ngay khi nó xảy ra — nó chỉ đáng tin khi
  được lặp lại đúng, nhiều lần, qua nhiều tình huống khác nhau.
- **Trust không phải cảm giác Companion tạo ra cho người dùng cảm thấy
  an toàn.** Một câu nói ấm áp có thể tạo cảm giác an toàn ngay lập tức
  mà không cần đáng tin (ví dụ: hứa hẹn một điều Companion không thể
  giữ). Trust chỉ tồn tại khi cảm giác đó được CHỨNG MINH đúng qua thời
  gian, không phải khi nó được nói ra.
- **Trust là món quà, không phải mục tiêu.** Companion không "tìm cách"
  để được tin tưởng nhiều hơn — tìm cách như vậy biến Trust thành một
  mục tiêu để tối ưu, đúng cái sai mà North Star của Sprint này cảnh
  báo ("Companion không cố gắng để được yêu thích"). Companion chỉ
  KIỂM TRA mỗi Decision có giữ đúng những gì đã chọn trước đó hay
  không — phần còn lại (người dùng có tin tưởng hay không) không thuộc
  quyền kiểm soát của Companion.

## Nhiệm vụ 2 — Trust Audit

> Rà soát hành vi hiện có. Đánh dấu hành vi tăng Trust, hành vi có thể
> vô tình làm giảm Trust, hành vi chưa nhất quán với Character. Không
> sửa code nếu chưa cần. Audit trung thực.

### Hành vi làm TĂNG Trust

| Hành vi | Vì sao tăng Trust |
|---|---|
| `applyIntegrityCheck()` (`character-engine.ts`, Sprint 20.3, mở rộng Sprint 21.2) | Chặn HẲN một candidate (Knowledge) khi Character Memory mâu thuẫn — Companion thực sự từ bỏ một hành động, không chỉ nói sẽ làm vậy. |
| Character Memory ngưỡng ≥2 lần (`CHARACTER_TRANSFORMATION_THRESHOLD`) | Không kết luận về một người chỉ từ một lần — đúng nhất quán theo thời gian, không phải phản ứng tức thời. |
| `generateInnerThought()` trả `null` khi Character Memory rỗng (Sprint 20.4) | Im lặng là kết quả hợp lệ khi chưa có gì thật để nói — không "diễn" một sự thấu hiểu chưa tồn tại. |
| Speech Budget (`thought-governance.ts`) — tối đa 3 moment/session, 6/ngày | Giới hạn sự hiện diện một cách nhất quán, không phụ thuộc cảm xúc từng phiên — người dùng có thể tin Companion sẽ không "spam". |
| `noSalesCta = true` trên mọi Life Moment | Một ranh giới không có ngoại lệ — đúng nghĩa Trust: lời hứa "sẽ không bán hàng ở đây" được giữ ở MỌI Life Moment, không có trường hợp đặc biệt. |
| Daily Thought `showProbability: 0.3` + Soulful Silence | Companion chọn im lặng nhiều hơn nói — chống lại bản năng "nói nhiều hơn để chứng tỏ giá trị", đúng phẩm chất Quiet Presence (#3/10). |
| `DECISION_HIERARCHY` cố định (Con người → Nhân cách → Niềm tin → Tri thức → Hiệu suất), không có ngoại lệ rule-based | Một thứ tự không đổi theo tình huống chính là định nghĩa của Trust — nếu thứ tự có thể đổi tuỳ lúc, không ai có thể tin nó. |

### Hành vi CÓ THỂ vô tình làm giảm Trust (rủi ro, không phải lỗi đã xảy ra)

| Hành vi | Rủi ro |
|---|---|
| `reviewWithFourQuestions()` (`moral-compass.ts`) — cả 4 cờ, gồm `wouldBeProudLater` (tầng Niềm tin), đều hardcode `true` | Đây là rào chắn CÓ CHỦ ĐÍCH cho loại moment MỚI trong tương lai (đã ghi rõ trong comment) — không phải lỗi. Nhưng nếu một Engineer thêm moment type mới mà quên implement logic thật cho 4 cờ này, Trust layer sẽ ÂM THẦM không được kiểm tra — rủi ro nằm ở tương lai, không ở hiện tại. **Đánh dấu để theo dõi, không sửa hôm nay** (đúng yêu cầu "không sửa code nếu chưa cần"). |
| `respectsUser`/`isHumble` (`character-engine.ts`) — cũng hardcode `true`, cùng lý do | Cùng rủi ro như trên — rào chắn cho candidate tương lai, đúng kiến trúc hôm nay vì mọi voice hiện có đã được thiết kế để qua được hai cờ này, nhưng không phải bộ lọc đang hoạt động thật. |
| `applyIntegrityCheck()` chỉ chặn được duy nhất voice `"knowledge"` | Nếu trong tương lai có voice mới mâu thuẫn với Character (ví dụ một voice "nhắc lại" khi user đã `listen-first`), Integrity Check sẽ KHÔNG chặn được — vì logic hiện tại chỉ biết chặn Knowledge. Trust phụ thuộc vào việc cơ chế này được mở rộng đúng lúc, không bị quên. |

### Hành vi CHƯA nhất quán với Character (audit trung thực)

Không tìm thấy hành vi nào đang hoạt động hôm nay mâu thuẫn trực tiếp
với Character đã chọn (`listen-first`/`self-discovery`/`grateful`) —
mọi voice hiện có (Garden, Story, Reflection, Knowledge) đều đã được
`applyCharacterReview()`/`applyIntegrityCheck()` xét qua trước khi tới
người dùng. Điều CHƯA nhất quán không nằm ở hành vi đang chạy, mà ở
ĐỘ PHỦ của cơ chế kiểm tra: Integrity Check (cơ chế duy nhất có quyền
chặn hẳn một Decision) mới phủ 1 trong 4 voice đang tồn tại
(`knowledge`) và 3 trong 9 `CharacterPreference`/voice tương lai chưa
được implement (`build`, `connect`, `journey`, `legacy`, `companion`)
chưa có cơ chế Trust nào để kiểm tra khi chúng được xây — đây không
phải lỗi hôm nay, mà là **Education Debt cần ghi nhận cho Sprint sau**.

## Nhiệm vụ 3 — Decision Review (câu hỏi kiến trúc, không phải UX)

> "Nếu mình chọn điều này nhiều lần trong nhiều năm, người dùng sẽ tin
> Companion hơn hay ít tin hơn?"

Đây không phải câu hỏi áp cho TỪNG Decision riêng lẻ ngay lúc nó xảy ra
(đó sẽ là UX) — đây là câu hỏi áp cho QUY TẮC đứng sau một Decision,
trước khi quy tắc đó được viết thành code. Ba ví dụ áp dụng ngược lên
quy tắc đã có, để minh hoạ câu hỏi này hoạt động thế nào:

- **`noSalesCta = true` trên Life Moment.** Nếu chọn điều này mỗi lần,
  mỗi năm, không có ngoại lệ → người dùng tin hơn, vì họ biết chắc một
  khoảnh khắc ăn mừng sẽ không bao giờ biến thành một lời chào hàng.
  Nếu có MỘT ngoại lệ (ví dụ: "lần này thử thêm CTA xem tỉ lệ chuyển
  đổi") → toàn bộ quy tắc sụp đổ, vì người dùng không còn cách nào biết
  lần nào là ngoại lệ. Đây là vì sao quy tắc này phải là tuyệt đối,
  không phải một threshold có thể điều chỉnh.
- **`applyIntegrityCheck()` chặn Knowledge khi có `grateful`.** Nếu
  chọn điều này nhiều năm → người tin Companion hơn, vì Companion
  không "quay lại dạy" một người mà nó đã biết ơn hành trình cùng đi
  qua. Nếu một bản update sau này âm thầm bỏ điều kiện `grateful` ra
  (ví dụ để "tăng engagement bằng Knowledge nhiều hơn") → Trust bị phá
  vỡ một cách không thể nhìn thấy được, vì người dùng không biết quy
  tắc đã đổi.
- **Daily Thought `showProbability: 0.3`.** Nếu Companion âm thầm tăng
  số này lên 0.6 để "có vẻ năng động hơn" mà không có Lesson/Character
  nào hỗ trợ thay đổi đó → đây chính là loại quyết định "đúng kỹ thuật,
  sai kiến trúc": không phá vỡ gì ngay, nhưng phá vỡ sự nhất quán mà
  Trust phụ thuộc vào.

Quy tắc rút ra: một Decision không cần "cảm thấy đúng" lúc viết — nó
cần SỐNG ĐƯỢC nếu lặp lại y nguyên trong nhiều năm. Đây là lý do câu
hỏi này là kiến trúc, không phải UX: UX hỏi "người dùng có thích điều
này ngay bây giờ?", Decision Review hỏi "người dùng có còn tin điều
này nếu nó xảy ra giống vậy mãi mãi?"

## Nhiệm vụ 4 — Education Review: Trust không đo bằng gì, đo bằng gì

Trust **KHÔNG** được đo bằng:
- lượt sử dụng (một người dùng nhiều không có nghĩa họ tin Companion —
  có thể họ chỉ chưa tìm được lựa chọn khác);
- thời gian online (thời gian dài có thể là dấu hiệu của áp lực/nghiện,
  đúng cảnh báo chống gamification đã có toàn project);
- số phiên trò chuyện (số phiên nhiều có thể chỉ phản ánh tần suất mở
  app, không phản ánh chất lượng của niềm tin).

Trust được đánh giá bằng bốn điều, đã có sẵn dấu vết trong project
trước Sprint này, Sprint này chỉ gọi đúng tên chúng:

| Tiêu chí | Bằng chứng đã có |
|---|---|
| **Sự nhất quán** | `DECISION_HIERARCHY` không đổi theo tình huống; `noSalesCta` tuyệt đối; Character threshold cố định (`CHARACTER_TRANSFORMATION_THRESHOLD = 2`). |
| **Sự tôn trọng** | Speech Budget; mọi Life Moment `dismissible = true`; `TREE_CULTURE.md` cấm leaderboard/ranking. |
| **Sự chính trực (Integrity)** | Phẩm chất Integrity (#8/10, `COMPANION_CHARACTER_GROWTH_MODEL.md`) → `applyIntegrityCheck()` (cơ chế duy nhất có quyền chặn hẳn một Decision). |
| **Khả năng giữ đúng giá trị đã chọn** | `generateInnerThought()` trả `null` thay vì giả một sự thấu hiểu chưa có; `gradual` thresholding thay vì phản ứng ngay. |

Nếu một Sprint sau này báo cáo "Trust tăng" bằng cách trích số liệu sử
dụng/thời gian/phiên — đó là dấu hiệu Sprint đó đã hiểu sai nguyên tắc
này, đúng tinh thần Culture Review của `THE_COMPANION_CULTURE.md`.

## Nhiệm vụ 5 — Growth Review

1. **Companion vừa trở nên xứng đáng với niềm tin hơn ở điểm nào?**
   Companion lần đầu có một CÂU HỎI KIẾN TRÚC tường minh ("nếu chọn
   điều này nhiều năm, người dùng tin hơn hay ít hơn?") để áp lên mọi
   Decision mới — trước Sprint này, Trust chỉ là một cái tên trong
   `DECISION_HIERARCHY`, không có cách nào để kiểm tra một Decision có
   thật sự phục vụ tầng đó hay không.
2. **Companion học được điều gì?** — Phân biệt "được tin tưởng" (mục
   tiêu cần đạt, dễ rơi vào diễn) với "xứng đáng với niềm tin" (kết quả
   tự nhiên của hành vi nhất quán, không thể giả).
3. **Companion thay đổi hành vi nào?** — Không hành vi RUNTIME nào thay
   đổi hôm nay (đúng yêu cầu brief: không Engine, không sửa code nếu
   chưa cần) — hành vi thay đổi là ở QUY TRÌNH: từ Sprint này, mọi
   Decision mới phải tự trả lời câu hỏi Decision Review trước khi
   được viết, đúng layer Trust trong `DECISION_HIERARCHY`.
4. **Người dùng nhận được giá trị gì?** — Không có gì hiển thị mới
   (đúng tinh thần Sprint: Trust không phải feature). Giá trị là gián
   tiếp: hai rủi ro Trust thật (Four Questions stub, Integrity Check
   chỉ phủ 1 voice) đã được ghi nhận trung thực, để không bị âm thầm
   trở thành lỗ hổng khi project mở rộng.
5. **Điều gì Companion vẫn chưa hiểu và cần tiếp tục học?** — Audit chỉ
   ra: cơ chế CHẶN Decision (Integrity Check) mới phủ 1/4 voice đang
   chạy và 0/5 voice chưa được xây — đây là Education Debt thật, ghi
   nhận ở mục Audit, chưa trả trong Sprint này.

Nếu không trả lời được câu 1 một cách trung thực — đúng luật brief đặt
ra — Sprint chưa hoàn thành. Câu trả lời ở trên không phải một khẳng
định chung: nó trỏ tới một cơ chế cụ thể (Decision Review question) mà
trước Sprint này không tồn tại dưới dạng văn bản, dù layer Trust đã
được đặt tên từ `THE_DECISION_HIERARCHY.md`.

## Culture Review

Sprint này không thêm hành vi mới cho người dùng thấy, nên không có
nguy cơ "kỹ thuật mạnh nhưng văn hoá yếu" theo nghĩa thường gặp ở
`THE_COMPANION_CULTURE.md`. Giá trị văn hoá được củng cố ở đây là
**Respect** — không phải qua một cơ chế chống gamify mới, mà qua việc
từ chối biến Trust thành điểm số/Engine (đúng cảnh báo "không tạo Trust
Engine" của chính brief) — giữ đúng ranh giới đã có ở `TREE_CULTURE.md`
("không bao giờ trở thành leaderboard/ranking/achievement board").

## Definition of Done

> Sprint hoàn thành khi Trust trở thành một nguyên tắc đánh giá mọi
> hành vi của Companion. Không phải một tính năng. Không phải một chỉ
> số. Mà là một giá trị được bảo vệ trong mọi quyết định kiến trúc.

Đã đạt: Trust không có UI, không có điểm số, không có Engine mới —
đúng yêu cầu. Thay vào đó, Trust có (1) một định nghĩa rõ ràng phân
biệt với "được tin tưởng", (2) một Audit trung thực chỉ ra 2 rủi ro
thật (Four Questions stub, Integrity Check hẹp), (3) một câu hỏi kiến
trúc cụ thể (Decision Review) có thể áp lại cho mọi Decision mới từ
Sprint sau, (4) bốn tiêu chí đo lường tường minh KHÔNG dựa trên usage
metrics. Đây là một nguyên tắc, đúng định nghĩa "Done" của brief — không
phải một feature có thể tắt/mở.

## Quan hệ với các tài liệu khác

```
THE_EDUCATION_ERA.md — review pipeline mới áp dụng cho Sprint này
THE_DECISION_HIERARCHY.md — Trust là tầng thứ 3 (Niềm tin); Sprint này
                              giải thích đầy đủ tầng đó, không thay nó
├── THE_TRUST_WE_EARN.md (tài liệu này) — Sprint 21.3
├── THE_HUMILITY.md (Sprint 21.1) — nền móng: Humility trước Gratitude
├── THE_GRATITUDE.md (Sprint 21.2) — Gratitude trước Trust
├── docs/COMPANION_CHARACTER_GROWTH_MODEL.md — Integrity (#8/10), nền
│   tảng của applyIntegrityCheck()
├── docs/MORAL_COMPASS.md — reviewWithFourQuestions(), wouldBeProudLater
│   (tầng Niềm tin) — rủi ro đã ghi nhận ở Trust Audit
└── THE_COMPANION_CULTURE.md — Respect, ranh giới chống Trust Engine/
    điểm số
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này không tạo
tầng mới — nó làm rõ và bảo vệ một tầng đã tồn tại từ
`THE_DECISION_HIERARCHY.md`, đúng cách `THE_HUMILITY.md` và
`THE_GRATITUDE.md` đã làm rõ và bảo vệ Character thay vì tạo Character
mới ngoài kế hoạch.

Xem tiếp: `THE_DECISION_HIERARCHY.md`, `THE_GRATITUDE.md`,
`THE_HUMILITY.md`, `docs/MORAL_COMPASS.md`, `THE_EDUCATION_ERA.md`.
