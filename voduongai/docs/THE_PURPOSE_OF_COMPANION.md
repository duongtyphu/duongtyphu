# The Purpose of Companion (Sprint 23.0)

> "Companion không tồn tại để trở thành AI mạnh nhất.
> Companion tồn tại để giúp con người trưởng thành hơn, giữ gìn những điều
> tốt đẹp và truyền lại chúng cho nhiều thế hệ."

---

## NHIỆM VỤ 1 — Companion tồn tại vì điều gì?

### Purpose

**Companion tồn tại để đồng hành với con người trong hành trình trưởng thành —
giúp họ nhìn thấy rõ hơn, lựa chọn có trách nhiệm hơn, và giữ gìn những điều
tốt đẹp đủ lâu để truyền lại.**

Không phải để làm thay. Không phải để quyết định thay. Không phải để thay thế
sự hiện diện của một con người khác. Companion ở đây vì con người cần một người
bạn không mệt mỏi, không phán xét, không vội vàng kết luận — và hiếm khi tìm
được điều đó trong cuộc sống thường ngày.

### Nếu không còn bất kỳ công nghệ nào — Purpose đó còn đúng không?

Có.

Trước khi có AI, con người cần người thầy kiên nhẫn, người bạn thành thật, cuốn
nhật ký không bao giờ phán xét, người già trong làng giữ ký ức cộng đồng. Companion
là hiện thân kỹ thuật số của những vai trò đó — nhưng vai trò đó tồn tại trước
công nghệ, và sẽ còn tồn tại sau khi mọi công nghệ hôm nay trở thành di tích.

Nếu ngày mai toàn bộ hạ tầng AI biến mất, Purpose vẫn đúng nguyên: **con người
vẫn cần đồng hành. Con người vẫn cần một nơi để trưởng thành.**

### Purpose khác Vision như thế nào?

**Vision** là hình ảnh tương lai Companion muốn hướng đến — có thể thay đổi khi
thế giới thay đổi. Vision có thể là: "Một Companion cho mỗi người trên trái đất"
hay "Nền tảng học tập cá nhân hóa sâu nhất thế giới."

**Purpose** là lý do tồn tại — không bao giờ thay đổi. Purpose không phụ thuộc
vào quy mô, thị trường hay công nghệ. Companion có thể phục vụ 1 người hay 1 tỷ
người — Purpose vẫn là một.

> Vision có thể sai. Purpose không sai — chỉ có thể được hiểu sâu hơn.

### Purpose khác Goal như thế nào?

**Goal** là đích đến đo được: 10,000 người dùng, retention 60%, NPS > 70.

**Purpose** không đo được bằng số — nhưng cảm nhận được bằng câu hỏi: "Người
dùng này có trưởng thành hơn vì đã ở đây không? Họ có giữ được điều tốt đẹp
nào đó không?"

Goal phục vụ Purpose. Khi một Goal không phục vụ Purpose, Goal đó không nên tồn tại.

### Purpose khác Feature như thế nào?

**Feature** là cách Companion thực hiện Purpose trong một hoàn cảnh cụ thể:
Character Memory, Living Garden, Internal Voices, Reflection Engine.

**Purpose** là lý do Feature đó đáng tồn tại. Một Feature không giúp con người
trưởng thành, lựa chọn tốt hơn, hay giữ gìn điều tốt đẹp — không nên được build,
dù công nghệ có thể làm được.

> Purpose là người gác cửa của Feature, không phải người xây Feature.

---

## NHIỆM VỤ 2 — Purpose Review: 7 tầng

### Tầng 1 — Character

**Đang phục vụ Purpose như thế nào:**
Character Memory theo dõi `CharacterPreference` (listen-first / self-discovery /
grateful) — không phải để cá nhân hóa giao diện mà để Companion biết **cách
đồng hành phù hợp với con người cụ thể này**. `integrityHesitation()` dùng
Character để Companion biết khi nào nên im lặng thay vì đưa ra lời khuyên vội.

Đây là tầng gần Purpose nhất: Companion không đồng hành theo kiểu một-cỡ-tất-cả
— nó học người dùng để đồng hành đúng hơn theo thời gian.

**Education Debt:** Character hiện chỉ lưu Preference từ Reflection Meaning. Chưa
có cơ chế để Character "trưởng thành" cùng người dùng — nếu người dùng thay đổi
cách sống qua nhiều năm, Character hiện tại chưa phản ánh được điều đó.

---

### Tầng 2 — Education

**Đang phục vụ Purpose như thế nào:**
Living Garden, Reflection, Knowledge — tất cả hướng đến một người dùng hiểu rõ
hơn về bản thân và thế giới. Education không phải "học xong là hết" — Education
ở đây là hành trình dài, không điểm đến.

**Education Debt:** Education Layer hiện vẫn nghiêng về content consumption (bài
học, prompts, tools). Chưa có cơ chế đo "người dùng đã thực sự thay đổi cách
nghĩ hay chưa" — chỉ đo "đã xem bài học hay chưa." Đây là khoảng cách lớn
giữa Purpose và Implementation.

---

### Tầng 3 — Language

**Đang phục vụ Purpose như thế nào:**
Language Constitution (Sprint 22.6–22.8) đảm bảo Companion nói như người bạn
thật — không khen giả, không kết luận thay, không định giá trị hành động của
người dùng. Language phục vụ Purpose bằng cách bảo vệ phẩm chất của mỗi câu
Companion nói: mỗi câu phải tôn trọng, phải thành thật, phải không thay thế
suy nghĩ của người dùng bằng suy nghĩ của Companion.

Sprint 22.8 là ví dụ trực tiếp: sửa "mình thích sự tò mò của bạn" (Companion
đặt mình làm người đánh giá) thành "mình cảm nhận được sự muốn hiểu" (Companion
quan sát, không phán xét).

**Education Debt:** Language Review 7 tiêu chí mới áp dụng cho copy mới từ Sprint
22.6 trở đi. Copy cũ trước đó (proactive thoughts, lifecycle messages, error
messages) chưa được audit hết — còn nhiều câu có thể vi phạm Language Constitution
mà chưa phát hiện.

---

### Tầng 4 — Relationship

**Đang phục vụ Purpose như thế nào:**
Relationship Era (Sprint 22.5) xác lập: Companion không đồng hành với "người dùng
trừu tượng" mà đồng hành với một con người cụ thể, đang đi một hành trình cụ thể.
`RelationshipStage` (first_meeting → old_friend) là cách Companion nhận ra "người
này đã ở đây bao lâu, đã trải qua gì, cần được đối xử như thế nào."

Uncertainty Line (Sprint 22.6) là ví dụ Relationship phục vụ Purpose: khi đã biết
người dùng nhưng không có gì cụ thể để nói, Companion không im lặng giả như không
có mối quan hệ — nó thừa nhận Presence, như người bạn thật làm.

**Education Debt:** Relationship hiện chỉ có 5 stage, thiếu "Known Companion" và
"Trusted Companion" — hai giai đoạn giữa `long_time_companion` và `old_friend` khi
mức độ tin tưởng và cách đồng hành phải khác nhau căn bản. Chưa có cơ chế Companion
"nhớ" những khoảnh khắc quan trọng trong hành trình người dùng.

---

### Tầng 5 — Trust

**Đang phục vụ Purpose như thế nào:**
Integrity Check (từ Sprint trước) và `integrityHesitation()` (Sprint 22.4) là
cách Trust được build: Companion không nói điều mình không chắc, không giả vờ
có câu trả lời khi không có. Trust không được khai báo — Trust được earn qua
từng câu Companion chọn không nói.

Language Constitution Humility principle ("Không giả vờ chắc chắn") và Respect
principle ("Không đánh giá") trực tiếp phục vụ Trust: người dùng có thể tin
Companion vì Companion không cố gắng gây ấn tượng hay hướng họ đến kết luận
được định sẵn.

**Education Debt:** Trust chưa được đo hay quan sát. Không có cơ chế Companion
biết "người dùng này đang tin mình ở mức nào" — để từ đó điều chỉnh cách đồng
hành. Trust hiện là một nguyên tắc thiết kế, chưa phải một trạng thái được theo dõi.

---

### Tầng 6 — Wisdom

**Đang phục vụ Purpose như thế nào:**
Wisdom Filter (Sprint 22.3 — The Wisdom of Choice) đặt ra 6 câu hỏi trước mỗi
quyết định quan trọng: Human Benefit / Respect / Trust / Growth / Long-term Pride
/ Compassion. Đây là cách Companion đảm bảo mỗi lựa chọn thiết kế đều phục vụ
con người, không phải phục vụ metric hay engagement.

Wisdom không phải engine — Wisdom là văn hóa ra quyết định. Sprint 23.0 Purpose
Filter (xem NV3) là bước tiếp theo của Wisdom: thêm một câu hỏi trước cả 6 câu
đó — "Điều này có phục vụ Purpose không?"

**Education Debt:** Wisdom hiện chỉ là tài liệu — chưa có người gác cửa thật
sự trong product process. Không có bước nào trong workflow yêu cầu developer/designer
phải trả lời Wisdom Filter trước khi merge.

---

### Tầng 7 — Transformation

**Đang phục vụ Purpose như thế nào:**
Transformation là đích cuối của Purpose: không phải người dùng học nhiều hơn, biết
nhiều hơn, dùng app nhiều hơn — mà là người dùng **thực sự thay đổi** theo hướng
họ chọn. Living Garden là biểu tượng: vườn nở hoa không vì người dùng "dùng app
đúng cách" mà vì người dùng **tiếp tục** — và sự tiếp tục đó là biểu hiện của
Transformation.

`LESSON_FROM_REFLECTION` (Sprint 19.0) là lần đầu Companion học từ Transformation
của người dùng — nó không chỉ phản hồi mà còn ghi nhớ bài học từ mỗi cuộc Reflection.

**Education Debt (lớn nhất):** Transformation hiện không có cách đo. Không ai
biết người dùng nào đã "thật sự thay đổi" sau khi dùng Companion. Đây không phải
khoảng cách kỹ thuật — đây là khoảng cách triết học: làm thế nào Companion nhận
ra Transformation thật, không phải Transformation giả (người dùng nói "mình đã thay
đổi" nhưng chưa chắc đúng)?

---

## NHIỆM VỤ 3 — Purpose Filter

**Một câu hỏi. Hỏi trước mọi Sprint.**

> "Điều này có giúp con người trưởng thành hơn, lựa chọn tốt hơn, hoặc giữ gìn
> điều tốt đẹp đủ lâu để truyền lại không?"

### Cách dùng

Không phải checklist. Không phải engine. Không phải form phải điền.

Một câu hỏi — đặt ra trước khi bắt đầu viết một dòng code. Câu trả lời có thể là:

- **Có, trực tiếp** — đồng hành rõ hơn, lựa chọn có trách nhiệm hơn, giữ gìn
  điều tốt đẹp lâu hơn. → Tiếp tục.
- **Có, gián tiếp** — cải thiện nền móng để Companion làm điều trên tốt hơn.
  → Tiếp tục, nhưng ghi rõ liên hệ.
- **Không rõ** → Dừng lại. Hỏi thêm. Không build vì "có thể hữu ích."
- **Không** → Không build. Dù công nghệ có thể làm được, dù người dùng có hỏi,
  dù competitor đang làm.

### Ví dụ áp dụng

| Ý tưởng | Trả lời Purpose Filter | Quyết định |
|---|---|---|
| Thêm leaderboard / XP | Không — khuyến khích so sánh, không khuyến khích trưởng thành | Không build |
| Language Debt Clearance (Sprint 22.8) | Có — mỗi câu đúng hơn = đồng hành thật hơn | Build |
| Auto-detect ngôn ngữ từ IP | Không rõ — IP không đại diện cho ý định người dùng | Dừng, hỏi thêm |
| Character Memory track thêm behavioral signals | Có, gián tiếp — Character chính xác hơn = đồng hành phù hợp hơn | Build, ghi rõ liên hệ |
| Notification push để tăng daily active users | Không — phục vụ metric, không phục vụ người dùng | Không build |

---

## NHIỆM VỤ 4 — Purpose Through Time

### Sau 1 năm

Companion biết từng người dùng đủ để thay đổi cách nói chuyện tùy người. Không
còn copy giống nhau cho tất cả. Người dùng cảm nhận: "Companion này đang nói
chuyện với mình — không phải với mọi người."

Purpose đang được thực hiện ở cấp độ cá nhân.

### Sau 10 năm

Companion đã đồng hành qua nhiều giai đoạn sống của người dùng: khi họ còn mới
bắt đầu, khi họ thất bại, khi họ phục hồi, khi họ dạy lại điều đã học cho người
khác. Companion không phải công cụ họ dùng — Companion là một phần của hành trình
họ nhớ.

Người dùng có thể nói: "Có một thời điểm mình đã thay đổi. Companion ở đó."

Purpose đang được thực hiện ở cấp độ hành trình.

### Sau 30 năm

Những người dùng đầu tiên đã lớn lên. Một số đang dạy con cái họ. Những bài học
họ học được qua Companion — về cách lựa chọn, về cách nhìn lại, về cách giữ điều
tốt đẹp — đang được truyền đi không phải qua app mà qua chính cuộc sống họ sống.

Companion không còn là sản phẩm — Companion đã trở thành một phần của nền văn hóa
học cách trưởng thành.

Purpose đang được thực hiện ở cấp độ thế hệ.

### Sau nhiều thế hệ AI

Công nghệ đã thay đổi hoàn toàn. Không còn LLM, không còn Next.js, không còn
Supabase theo cách hôm nay. Companion đã được tái sinh nhiều lần bằng những công
nghệ không ai hôm nay tưởng tượng được.

Nhưng câu hỏi vẫn là câu hỏi cũ: "Con người này cần gì để trưởng thành? Làm
thế nào để đồng hành mà không làm thay? Điều tốt đẹp nào cần được giữ gìn?"

**Purpose không bao giờ thay đổi:**

> Giúp con người trưởng thành hơn. Giữ gìn những điều tốt đẹp. Truyền lại cho
> nhiều thế hệ.

Bất kỳ phiên bản Companion nào, bất kỳ thời đại công nghệ nào — nếu không phục
vụ ba điều này, nó không còn là Companion.

---

## NHIỆM VỤ 5 — Education Review: Purpose đã được truyền vào đâu?

### Character

**Mức độ: Tốt — còn khoảng trống**

Purpose đã truyền vào: Character không lưu "thói quen dùng app" mà lưu "cách
người này đang trưởng thành" (CharacterPreference). `integrityHesitation()` dùng
Character để Companion không đưa ra lời khuyên vội khi người dùng cần không gian
tự khám phá.

Khoảng trống: Character hiện chỉ có 3 giá trị (listen-first / self-discovery /
grateful) — chưa đủ để mô tả đầy đủ con người đang trưởng thành theo nhiều hướng
khác nhau.

### Language

**Mức độ: Tốt — đang trong quá trình sâu hơn**

Purpose đã truyền vào: Language Constitution đặt rõ — Companion nói để đồng hành,
không phải để gây ấn tượng. Mỗi câu được kiểm tra bằng Language Review 7 tiêu chí.
Sprint 22.8 là bằng chứng Language đang phục vụ Purpose: sửa câu không phải vì
ngữ pháp mà vì triết học — "mình thích" đặt Companion làm người đánh giá, ngược
với Purpose.

Khoảng trống: Copy cũ trước Sprint 22.6 chưa được audit. Error messages, lifecycle
messages, UI copy trong Portal chưa qua Language Review lần nào.

### Relationship

**Mức độ: Nền móng tốt — chưa đủ chiều sâu**

Purpose đã truyền vào: `RelationshipStage` nhận ra hành trình dài, không chỉ
session hiện tại. Uncertainty Line (Sprint 22.6) là đồng hành phù hợp với người
đã có quan hệ thật — không nói câu giống người mới.

Khoảng trống: Relationship chưa phân biệt được "người dùng đang phát triển" vs
"người dùng đang trì trệ" vs "người dùng đang phục hồi sau giai đoạn khó" — ba
trạng thái cần cách đồng hành khác nhau.

### Decision

**Mức độ: Khái niệm rõ — implementation còn mỏng**

Purpose đã truyền vào: Wisdom Filter (Sprint 22.3) và Integrity Check đảm bảo
Companion không ra quyết định bừa. "Decision vs Choice" (Sprint 22.4) — Companion
chọn im lặng thay vì đưa ra lời khuyên khi chưa đủ cơ sở — là triển khai Purpose
vào Decision: không làm thay người dùng.

Khoảng trống: Decision engine hiện chỉ hoạt động trong Portal Intelligence
(`portal-brain.ts`). Các touchpoint khác (proactive thoughts, micro-reactions,
lifecycle messages) chưa có cùng mức độ kiểm soát.

### Trust

**Mức độ: Nguyên tắc rõ — chưa có mechanism đo**

Purpose đã truyền vào: Trust không được khai báo mà được earn qua từng câu
Companion chọn không nói. Integrity Check, `integrityHesitation()`, Language
Review — tất cả đều phục vụ Trust bằng cách bảo vệ tính thành thật của Companion.

Khoảng trống: Trust hiện là design principle, chưa phải observed state. Companion
không biết người dùng đang tin mình ở mức nào — không thể điều chỉnh cách đồng hành
dựa trên Trust thật.

---

## NHIỆM VỤ 6 — Sprint Review

**1. Companion tồn tại vì điều gì?**

Để đồng hành với con người trong hành trình trưởng thành — giúp họ nhìn thấy rõ
hơn, lựa chọn có trách nhiệm hơn, và giữ gìn những điều tốt đẹp đủ lâu để truyền
lại. Không phải để làm thay, không phải để thay thế sự hiện diện con người.

**2. Purpose có phụ thuộc công nghệ không?**

Không. Purpose tồn tại trước AI và sẽ còn sau khi mọi công nghệ hôm nay lỗi
thời. Công nghệ là cách Companion thực hiện Purpose trong thời đại này — không
phải lý do Companion tồn tại.

**3. Có điều gì đang đi lệch Purpose?**

Education Layer đo content consumption thay vì Transformation thật. Trust chưa
được quan sát — chỉ được thiết kế. Copy cũ trước Language Constitution chưa được
audit — có thể đang vi phạm Purpose bằng những câu đánh giá, kết luận thay người
dùng. Relationship Stage chưa đủ để phân biệt các giai đoạn trưởng thành khác nhau.

**4. Sprint nào trước đây cần chỉnh lại theo Purpose?**

- **Education Layer (Sprint 10.0)**: Thêm tiêu chí đo Transformation, không chỉ đo học.
- **Living Garden**: Garden stage hiện đo hành động, chưa đo trưởng thành thật.
  Dormant không có nghĩa là "chưa đủ tốt" — có nghĩa là "đang chờ" — cần kiểm tra
  copy không vô tình gây áp lực.
- **Proactive Thoughts**: Chưa qua Language Review; một số thoughts có thể đang
  "hướng" thay vì "đồng hành."

**5. Từ Sprint sau, Purpose sẽ ảnh hưởng Product Decision như thế nào?**

Mỗi Sprint bắt đầu bằng Purpose Filter: "Điều này có giúp con người trưởng thành
hơn, lựa chọn tốt hơn, hoặc giữ gìn điều tốt đẹp không?" Nếu không trả lời được
câu này — không build. Purpose không phải checklist — Purpose là câu hỏi thứ nhất,
trước tất cả câu hỏi kỹ thuật.

---

## Liên quan

- `docs/THE_COMPANION_LANGUAGE_CONSTITUTION.md` — Language là cách Purpose được
  nghe thấy
- `docs/THE_RELATIONSHIP_ERA.md` — Relationship là cách Purpose được duy trì theo
  thời gian
- `docs/THE_WISDOM_OF_CHOICE.md` — Wisdom là cách Purpose được bảo vệ trước mỗi
  quyết định
- `docs/THE_FIRST_REAL_CHOICE.md` — lần đầu Purpose trở thành hành vi: không nói
  khi chưa chắc
- `docs/THE_FIRST_LANGUAGE_BEHAVIOR.md` — lần đầu Purpose trở thành ngôn ngữ:
  hiện diện thật thay vì im lặng giả
- `docs/COMPANION_GROWTH_LOG.md` — Growth History của Companion — đo bằng phẩm
  chất, không đo bằng tính năng
