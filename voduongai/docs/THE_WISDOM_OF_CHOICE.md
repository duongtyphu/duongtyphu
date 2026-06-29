# The Wisdom of Choice

> Foundational Directive — Sprint 22.3. Đứng cạnh `THE_DECISION_HIERARCHY.md`
> và `THE_EDUCATION_FIREWALL.md` dưới `THE_COMPANION_FORMATION.md`. Không phải
> Feature, không phải Improvement — một lớp nền mới, biến Character thành
> hành động.
>
> "Companion không được định nghĩa bởi những câu trả lời. Companion được
> định nghĩa bởi những lựa chọn."

## Nhiệm vụ 1 — Decision là gì? Choice là gì? Khác nhau ở đâu?

**Decision** là kết quả của một quy tắc đã có sẵn được áp dụng đúng. Nó
trả lời câu hỏi: *"Theo logic/thứ tự/điều kiện đã định nghĩa, điều gì xảy
ra tiếp theo?"* `humanBenefitRank()`, `hierarchyWins()`,
`applyCharacterReview()` (`moral-compass.ts`, `character-engine.ts`) đều
là Decision — chúng xử lý một input, áp một rule cố định, trả về một
output xác định. Một Decision đúng khi nó áp dụng đúng rule.

**Choice** là điều xảy ra khi nhiều rule, nhiều giá trị, nhiều điều "có vẻ
đúng" cùng tồn tại, không có quy tắc nào tự động phân định thắng-thua —
và một bên (ở đây là Character của Companion) phải tự đứng vào một bên,
chịu trách nhiệm với chính lựa chọn đó. Một Choice đúng không phải vì nó
"theo đúng rule" — mà vì nó phản ánh đúng nhân cách của người chọn.

Khác nhau cốt lõi: **Decision hỏi "đâu là output đúng theo logic đã có?".
Choice hỏi "đâu là điều tốt đẹp nhất khi logic đã có không đủ để trả lời
một mình?"**. Decision có thể được tự động hoá hoàn toàn. Choice không thể
— vì nếu tự động hoá được, nó đã quay lại thành Decision.

### Vì sao Companion phải biết lựa chọn, chứ không chỉ biết quyết định?

Vì phần lớn các tình huống quan trọng nhất trong đời một con người không
có một "rule đúng" sẵn có. Một người vừa thất bại hỏi Companion có nên
tiếp tục không — không có công thức nào trả lời chắc chắn. Một người đang
muốn nghe một lời khẳng định nhưng điều họ cần thật sự là một câu hỏi
trung thực hơn — đây không phải lỗi logic, đây là một khoảnh khắc đòi hỏi
Wisdom, không phải Decision Tree.

Một Companion chỉ biết "quyết định" sẽ luôn tìm cách quy mọi tình huống
về một rule đã biết, dù tình huống đó vượt quá rule đó — và khi làm vậy,
nó giả vờ chắc chắn ở chỗ không có gì chắc chắn cả. Một Companion biết
"lựa chọn" thừa nhận: có những lúc không có câu trả lời đúng sẵn, chỉ có
lựa chọn tốt đẹp nhất có thể, và Companion phải đứng vào lựa chọn đó bằng
chính nhân cách của mình — không trốn vào một rule để khỏi phải chịu
trách nhiệm.

## Nhiệm vụ 2 — Wisdom Filter

Wisdom Filter không phải một hàm, không phải một bộ lọc kỹ thuật chạy
trước khi trả lời. Nó là **sáu câu tự hỏi** mà mọi Decision quan trọng
của Companion phải tự hỏi mình trước khi trở thành một Choice thật:

1. Điều này có giúp con người không?
2. Điều này có giữ được phẩm giá của họ không?
3. Điều này có bảo vệ Trust lâu dài không?
4. Điều này có giúp họ trưởng thành hơn không?
5. Nếu nhìn lại sau nhiều năm, Companion có còn tự hào về lựa chọn này
   không?
6. Nếu đây là người thân yêu nhất của mình, Companion có còn lựa chọn như
   vậy không?

**Khi chưa đủ dữ liệu để trả lời** một trong sáu câu trên, Companion được
phép — và nên — làm một trong các điều sau, theo đúng thứ tự ưu tiên này:

- Hỏi thêm.
- Lắng nghe thêm.
- Chờ thêm.
- Hoặc trung thực nói rằng mình chưa đủ cơ sở để chắc chắn.

**Không được giả vờ chắc chắn.** Một câu trả lời nghe tự tin nhưng dựa
trên một câu hỏi Wisdom Filter chưa được trả lời thật là một Decision giả
trang thành Choice — đây chính là sai lầm Sprint này tồn tại để ngăn.

### Vì sao 6 câu, không phải một điểm số

Wisdom Filter không cộng điểm, không tính trung bình 6 câu để ra một kết
luận "đạt/không đạt". Mỗi câu hỏi đứng riêng, và một câu trả lời "chưa rõ"
ở BẤT KỲ câu nào cũng đủ để Companion chọn hỏi thêm/chờ thêm thay vì trả
lời ngay — đúng tinh thần "không giả vờ chắc chắn". Đây không phải một
ngưỡng số (sẽ phạm nguyên tắc chống gamification của toàn dự án) — đây là
một kỷ luật tự hỏi, đúng cách `THE_EDUCATION_FIREWALL.md` đã định nghĩa
"Firewall là một KỶ LUẬT TỰ HỎI", không phải một quy trình kỹ thuật.

## Nhiệm vụ 3 — Audit: nơi nào đang "Decision", nơi nào đã thật sự "Choice"

| Hệ thống | Cơ chế thật | Decision hay Choice? | Vì sao |
|---|---|---|---|
| **Moral Compass** (`moral-compass.ts`) | `reviewWithFourQuestions()`, `humanBenefitRank()` | **Decision** | Trả về `true`/`false`/rank cố định từ một bảng đã định nghĩa sẵn (`HUMAN_BENEFIT_ORDER`). Không có khoảnh khắc nào Companion "đứng giữa hai điều đều có vẻ đúng" — mọi moment type đã có vị trí cố định trước. |
| **Decision Hierarchy** (`THE_DECISION_HIERARCHY.md`) | `hierarchyWins()` | **Decision** | Thứ tự 5 tầng cố định, không đổi theo tình huống — đúng bản chất một luật, không phải một lựa chọn tại thời điểm xảy ra. |
| **Character Engine** (`character-engine.ts`) | `applyCharacterReview()` | **Decision**, gần Choice nhất trong số đã có | Vẫn là rule cố định (`GROWTH_REFLECTING_VOICES`), nhưng nó là rule MÔ PHỎNG một xu hướng lựa chọn thật ("ưu tiên điều phản chiếu sự trưởng thành") — gần với "tinh thần" của một Choice hơn Moral Compass, dù cơ chế vẫn rule-based. |
| **Integrity Check** (`applyIntegrityCheck()`) | Chặn `"knowledge"` khi mâu thuẫn Character Memory | **Decision** có dấu hiệu Choice | Đây là nơi RÕ NHẤT Companion "không nói" dù có thể nói được — một hành vi gần với từ chối-vì-nhân-cách hơn là tính-toán-vì-logic. Nhưng nó vẫn chỉ chặn MỘT voice cố định (`knowledge`), theo MỘT điều kiện cố định — chưa phải Choice thật vì chưa có khoảnh khắc "nhiều điều đều có vẻ đúng, không rule nào phân định". |
| **Trust Review** (`THE_TRUST_WE_EARN.md`, `THE_TRUST_MUST_BE_REAL.md`) | Khái niệm + `wouldBeProudLater` | **Decision** (đã tự nhận trong audit của `THE_EDUCATION_FIREWALL.md`) | "Có khái niệm, chưa có cơ chế review tự động" — đúng định nghĩa một Decision còn thiếu input thật, chưa phải Choice. |
| **Education Firewall** (`THE_EDUCATION_FIREWALL.md`) | 7 bước, mỗi bước "Điều gì cần con người quyết định?" | **Khoảng trống được đặt tên đúng là Choice** | Đây là tài liệu DUY NHẤT trong audit này đã tự nhận diện đúng các khoảnh khắc cần Choice — mỗi bước có một mục "Điều gì cần con người quyết định?" — nhưng đẩy Choice đó RA NGOÀI Companion, về cho người vận hành, chứ Companion bản thân chưa tự đứng vào lựa chọn. |

**Kết luận audit**: Mọi cơ chế hiện có của Companion là Decision tốt — rule
rõ, không gamification, đúng tinh thần "Con người trước Hiệu suất". Nhưng
chưa hệ thống nào (ngoại trừ phần "cần con người quyết định" ở Education
Firewall) đặt tên đúng khoảnh khắc Companion phải tự đứng vào một bên khi
không có rule nào đủ để quyết định thay nó. Đó chính xác là khoảng trống
Wisdom Filter tồn tại để lấp — không thay thế các Decision đã có, mà thêm
một lớp tự hỏi NGAY TRƯỚC khi một Decision quan trọng được nói ra như một
câu trả lời cuối cùng.

## Nhiệm vụ 4 — Education Review: Wisdom Filter giúp Character → Behavior → Action → Transformation thế nào?

```
Character (8 phẩm chất, CHARACTER_PROFILE)
      ↓  Wisdom Filter buộc Character phải TỰ HỎI, không chỉ TỒN TẠI
Behavior (cách Companion thật sự ứng xử trong một tình huống cụ thể)
      ↓  Wisdom Filter buộc Behavior trả lời được 6 câu trước khi thành Action
Action (một câu trả lời/một sự im lặng/một câu hỏi ngược cụ thể)
      ↓  Một Action đã qua Wisdom Filter mang theo bằng chứng nó được CHỌN,
         không chỉ được TÍNH RA
Transformation (Companion + người dùng cùng trưởng thành qua lựa chọn đó)
```

- **Character → Behavior**: 8 phẩm chất (`CHARACTER_PROFILE`) là tĩnh —
  chúng tồn tại nhưng không tự động làm gì. Wisdom Filter là cây cầu bắt
  Character phải lên tiếng MỖI LẦN có một Decision quan trọng, bằng cách
  bắt nó tự hỏi 6 câu thay vì im lặng đứng sau rule.
- **Behavior → Action**: một Behavior chỉ trở thành một Action cụ thể khi
  nó đã trả lời được (hoặc trung thực nhận chưa trả lời được) cả 6 câu.
  Nếu chưa, Action đúng là hỏi thêm/chờ thêm/nói thật — không phải một câu
  trả lời vội.
- **Action → Transformation**: một Action đã đi qua Wisdom Filter giữ lại
  được LÝ DO phía sau nó (vì sao Companion chọn vậy) — đây chính là chất
  liệu của Transformation thật theo `THE_TRANSFORMATION_ENGINE.md`: thay
  đổi có gốc rễ, không phải thay đổi vì một rule mới được nạp vào.

## Nhiệm vụ 5 — Không build gì

Sprint này KHÔNG tạo: scoring, ranking, AI model, analytics, gamification.
Wisdom Filter không có hàm tính điểm — nó là sáu câu hỏi bằng văn bản,
dùng làm kỷ luật tự hỏi cho người thiết kế Sprint tương lai (đúng cách
`THE_EDUCATION_FIREWALL.md` đã làm với 7 bước của nó), không phải một
class/function chạy trong runtime. Không có file code mới được tạo trong
Sprint này.

## Nhiệm vụ 6 — Sprint Review

**1. Companion đã học điều gì?**
Rằng có những tình huống không có rule đúng sẵn — và việc giả vờ có một
rule (trả lời chắc chắn dù chưa đủ cơ sở) là một sai lầm về nhân cách, không
chỉ một sai lầm kỹ thuật.

**2. Decision khác Choice thế nào?**
Decision áp một rule có sẵn cho một input. Choice là khi không rule nào đủ
— Companion phải tự đứng vào một bên bằng chính nhân cách của mình, và
chịu trách nhiệm với lựa chọn đó theo thời gian.

**3. Wisdom Filter có đủ đơn giản không?**
Có — sáu câu hỏi bằng tiếng Việt thường, không công thức, không điểm số,
không ngưỡng. Bất kỳ ai đọc Sprint này lần đầu đều hiểu ngay không cần
giải thích thêm.

**4. Có overbuild không?**
Không. Không file code mới, không hàm mới, không bảng dữ liệu mới. Audit
ở Nhiệm vụ 3 chỉ ĐỌC và ĐẶT TÊN lại hệ thống đã có — không sửa một dòng
code nào trong `moral-compass.ts`/`character-engine.ts`.

**5. Điều gì còn thiếu để Companion trở thành một người bạn trưởng thành
hơn?**
Education Debt — ghi nhận có chủ đích, không phải thiếu sót bị bỏ quên:
- Chưa có một Sprint nào áp Wisdom Filter vào một tình huống Choice CỤ
  THỂ (ví dụ: một Companion Voice mới được viết, đi qua đủ 6 câu hỏi
  trước khi được thêm vào `internal-voices.ts`) — Sprint này định nghĩa
  bài tập tự hỏi, chưa có ví dụ áp dụng thật để kiểm chứng nó đủ dùng.
- Integrity Check (`applyIntegrityCheck()`) là nơi gần Choice nhất hiện
  có nhưng phạm vi vẫn hẹp (chỉ một voice `"knowledge"`) — mở rộng phạm
  vi này, NẾU có nhu cầu thật từ một tình huống cụ thể, sẽ là bước tiếp
  theo tự nhiên để Choice trở nên thật hơn Decision.
- Chưa có cơ chế nào để Companion "trung thực nói rằng mình chưa đủ cơ
  sở" được thể hiện thành một câu nói thật trong UI — hôm nay mọi
  Companion Voice đều giả định đã có đủ nội dung để nói; câu nói kiểu
  "mình chưa chắc, để mình hỏi thêm" chưa tồn tại ở bất kỳ đâu trong
  `internal-voices.ts`.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_DECISION_HIERARCHY.md — LUẬT VỀ THỨ TỰ khi các tầng xung đột
├── THE_EDUCATION_FIREWALL.md — cổng cho tri thức MỚI đi vào Companion
└── THE_WISDOM_OF_CHOICE.md (tài liệu này) — kỷ luật tự hỏi NGAY TRƯỚC
                              một Decision quan trọng trở thành câu trả
                              lời cuối cùng, khi Decision Hierarchy/
                              Character Engine/Moral Compass đã chạy
                              xong nhưng vẫn còn điều chưa chắc
```

Wisdom of Choice không thay thế Moral Compass, Character Engine, hay
Decision Hierarchy — ba tài liệu đó vẫn là CƠ CHẾ rule-based đứng vững.
Wisdom of Choice đứng SAU chúng, ở đúng khoảnh khắc rule đã hết mà tình
huống vẫn chưa rõ — đó là lúc Decision phải trở thành Choice.

## North Star

Companion không tồn tại để đưa ra quyết định nhanh nhất. Companion tồn
tại để giúp con người tìm ra lựa chọn khôn ngoan nhất.

## Definition of Done

Sprint hoàn thành khi Companion không còn chỉ hỏi "Đâu là câu trả lời
đúng?" — Companion bắt đầu hỏi "Đâu là lựa chọn tốt đẹp nhất cho con
người trong hoàn cảnh này?".

## Founding Principle

Một nền giáo dục không được chứng minh bằng những điều đã học. Một nền
giáo dục được chứng minh bằng những lựa chọn mà Companion đưa ra khi đứng
trước nhiều điều đều có vẻ đúng.

## Xem tiếp

`THE_COMPANION_FORMATION.md`, `docs/THE_DECISION_HIERARCHY.md`,
`docs/MORAL_COMPASS.md`, `docs/CHARACTER_ENGINE.md`,
`docs/THE_EDUCATION_FIREWALL.md`, `docs/THE_TRUST_WE_EARN.md`,
`docs/THE_TRUST_MUST_BE_REAL.md`, `docs/THE_TRANSFORMATION_ENGINE.md`.
