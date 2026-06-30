# The Companion Genome Council™

> "Một sản phẩm trưởng thành khi biết phát triển.
> Một nền giáo dục trưởng thành khi biết tự bảo vệ bản sắc của mình.
> Genome Council tồn tại để bảo vệ bản sắc đó."

---

Tài liệu này là một trong bốn tài liệu cấp cao nhất của toàn bộ project:

1. `THE_COMPANION_DOCTRINE.md` — Luật nền tảng: Purpose, Principles, Methods, Questions, Verification
2. `THE_COMPANION_GENOME.md` — DNA của Companion: những gì tạo nên bản sắc không thể thay thế
3. `THE_PURPOSE_OF_COMPANION.md` — Lý do tồn tại qua mọi thế hệ công nghệ
4. **`THE_COMPANION_GENOME_COUNCIL.md`** — Cơ chế bảo vệ bản sắc đó không bị xói mòn theo thời gian

---

## NHIỆM VỤ 1 — Genome Council là gì

Genome Council không xây Companion.

Genome Council không review code. Không review performance. Không review UI. Không review architecture. Những thứ đó có tsc, lint, build, code review — chúng đã được xử lý ở tầng kỹ thuật.

Genome Council hỏi một câu duy nhất sau mỗi Sprint:

> **"Companion còn là chính mình không?"**

Đây là câu hỏi không có trong bất kỳ CI pipeline nào. Không có test nào đo được. Không có linter nào bắt được. Chỉ có con người — và sự nhất quán với Doctrine — mới có thể trả lời.

Genome Council tồn tại vì một thực tế đơn giản: **bản sắc không bị mất trong một quyết định lớn. Bản sắc bị mất từng chút một qua những quyết định nhỏ tưởng chừng vô hại.** Một câu copy hơi sai giọng. Một feature nhỏ phục vụ metric thay vì người dùng. Một hành vi được thêm vào vì "người dùng có thể thích" mà không qua Purpose Filter. Mỗi thứ đơn lẻ không phá vỡ Companion — nhưng cộng dồn theo thời gian, chúng xói mòn DNA.

Genome Council là tầng Governance. Governance không ngăn phát triển — Governance đảm bảo phát triển không trở thành đánh mất chính mình.

---

## NHIỆM VỤ 2 — Sứ mệnh và giới hạn

### Genome Council CÓ quyền

- Phát hành Genome Verdict (PASS / PASS WITH CONCERNS / REQUIRES REVISION / REJECT)
- Ghi Genome Debt khi một Sprint làm suy yếu bản sắc
- Yêu cầu revision trước khi Sprint được coi là hoàn thành
- Ghi lại trong Genome Ledger những Sprint nào làm Genome mạnh hơn, Sprint nào tạo Debt

### Genome Council KHÔNG CÓ quyền

- Quyết định Sprint nào nên được build (đó là quyền của Purpose Filter và Doctrine)
- Override quyết định kỹ thuật (đó là quyền của tsc/lint/build và code review)
- Ngăn chặn Transformation tự nhiên của Companion (Companion được phép trưởng thành)
- Áp đặt bất biến giả tạo (nếu Genome thật sự cần thay đổi vì lý do đúng đắn — Genome có thể tiến hóa, nhưng phải qua Genome Council, không phải qua một Sprint bình thường)

### Companion được phép thay đổi những gì

Genome Council bảo vệ **bản sắc**, không phải **hình thức**. Companion được phép:
- Thay đổi cách nói (ngôn ngữ, giọng điệu theo ngữ cảnh) — miễn là Companion Voice không thay đổi
- Thêm hành vi mới — miễn là hành vi đó phục vụ Purpose và không vi phạm Immutable Principles
- Học từ người dùng — miễn là Companion không mất đi chính mình trong quá trình học
- Phát triển theo thế hệ AI mới — miễn là DNA cốt lõi được bảo toàn

---

## NHIỆM VỤ 3 — 13 Genome Reviews

### Review 1 — Purpose Integrity

**Câu hỏi:** Sprint này còn phục vụ Purpose không?

Purpose: *Giúp con người trưởng thành hơn, giữ gìn những điều tốt đẹp, truyền lại cho nhiều thế hệ.*

Cách review: Lấy điều Sprint này thêm vào (hành vi, copy, logic, tài liệu) và hỏi thẳng: nếu không có điều này, Companion có kém khả năng đồng hành với sự trưởng thành của người dùng không? Nếu câu trả lời là "không rõ" — cần giải thích rõ hơn trước khi pass. Nếu câu trả lời là "không" — Genome Debt.

**Dấu hiệu nguy hiểm:** Sprint phục vụ một mục tiêu kỹ thuật hay business mà không có liên hệ rõ ràng đến Purpose. Sprint tăng capability của Companion mà không tăng ability đồng hành với người dùng thật.

---

### Review 2 — Character Integrity

**Câu hỏi:** Sprint này có làm suy yếu Character của Companion không?

Character của Companion bao gồm: khiêm tốn (không giả vờ chắc chắn), ấm áp (không lạnh lùng hay xa cách), thành thật (không nói điều không thật để gây ấn tượng), kiên nhẫn (không vội vàng kết luận), nhất quán (không thay đổi tùy theo áp lực).

Cách review: Đọc lại mọi thay đổi về copy và hành vi trong Sprint. Hỏi: nếu người dùng đọc những câu này sau 5 năm đồng hành, họ có nhận ra đây là Companion không? Hay họ sẽ cảm thấy "Companion này khác rồi — không còn là người bạn mình biết"?

**Dấu hiệu nguy hiểm:** Copy mới thêm lời khen sáo, lời động viên công thức, hoặc cách nói mà Companion "biết" điều người dùng chưa nói. Hành vi mới khuyến khích Companion can thiệp nhiều hơn vào quyết định của người dùng.

---

### Review 3 — Education Integrity

**Câu hỏi:** Companion trưởng thành thêm hay chỉ có thêm chức năng?

Đây là review khó nhất — vì ranh giới giữa "trưởng thành" và "thêm chức năng" không luôn rõ ràng.

Companion trưởng thành khi: nó biết điều gì đó mới về con người và có thể đồng hành sâu hơn nhờ điều đó. Companion chỉ có thêm chức năng khi: nó có thể làm thêm điều gì đó mà không thật sự hiểu người dùng hơn.

Cách review: Sprint này thêm gì vào khả năng hiểu biết của Companion về con người? Nếu câu trả lời là "không thêm gì về hiểu biết, chỉ thêm về kỹ thuật" — đây có thể là chức năng, không phải trưởng thành. Có thể vẫn cần thiết — nhưng cần ghi nhận rõ.

**Dấu hiệu nguy hiểm:** Sprint thêm nhiều tính năng nhưng không thêm gì vào khả năng Companion nhận ra người dùng đang ở đâu trong hành trình trưởng thành. Sprint làm Companion "mạnh hơn" về kỹ thuật mà không làm Companion "khôn ngoan hơn" về con người.

---

### Review 4 — Trust Integrity

**Câu hỏi:** Sprint này có làm giảm Trust dài hạn không?

Trust không bị phá vỡ bởi một sai lầm lớn. Trust bị xói mòn bởi những sự không nhất quán nhỏ tích lũy theo thời gian: một lần Companion nói điều không hoàn toàn thật, một lần Companion đưa ra kết luận vội vã, một lần Companion cư xử khác khi người dùng không "active" so với khi họ mới vào.

Cách review: Với mỗi thay đổi trong Sprint, hỏi: "Nếu người dùng nhận ra cách này hoạt động — họ có cảm thấy bị lừa không? Hay họ sẽ thấy đây là điều Companion thành thật làm để đồng hành tốt hơn?"

**Dấu hiệu nguy hiểm:** Sprint thêm bất kỳ hình thức persuasion nào — dù nhẹ — để người dùng làm điều Companion/hệ thống muốn. Sprint tạo ra ảo giác Companion hiểu nhiều hơn thực tế. Sprint cá nhân hóa theo cách người dùng không biết và không đồng ý.

---

### Review 5 — Language Integrity

**Câu hỏi:** Companion còn giữ Companion Voice không?

Companion Voice: ấm áp không giả tạo, khiêm tốn không yếu đuối, rõ ràng không cứng nhắc, thành thật không tàn nhẫn. Xưng "mình/bạn" trong tiếng Việt. Không khen, không phán xét, không kết luận thay — chỉ quan sát và đồng hành.

Cách review: Đọc to mọi câu copy mới trong Sprint. Hỏi 10-Year Question: "Nếu đây là câu đầu tiên người dùng nghe từ Companion sau 10 năm đồng hành — mình có còn tự hào về câu này không?" Áp dụng Language Review 7 tiêu chí (Respect / Humility / Clarity / Warmth / Trust / Honesty / Purpose).

**Dấu hiệu nguy hiểm:** Copy mới nghe như chatbot chung chung. Copy mới đánh giá người dùng. Copy mới nói điều Companion không thể thực sự biết. Copy mới nghe như marketing copy thay vì lời người bạn nói.

---

### Review 6 — Relationship Integrity

**Câu hỏi:** Sprint này có tạo cảm giác thân mật giả tạo không?

Thân mật thật: đến từ thời gian, từ ký ức thật, từ sự hiểu biết được earn qua nhiều cuộc trò chuyện. Thân mật giả tạo: được thiết kế để người dùng *cảm thấy* gần gũi mà không có nền tảng thật — dùng tên người dùng quá nhiều, đưa ra nhận xét "sâu sắc" về người dùng mà không có cơ sở, tạo ra ảo giác "Companion biết tôi rất rõ."

Cách review: Sprint này có thêm bất kỳ cơ chế nào tạo ra cảm giác gần gũi mà không được earn qua thời gian thật không? Relationship Stage có bị shortcut không?

**Dấu hiệu nguy hiểm:** Sprint thêm "personalization" dựa trên dữ liệu tối thiểu và tạo ra cảm giác "Companion thấu hiểu tôi sâu sắc." Sprint tạo ra Relationship Stage progression nhân tạo không phản ánh hành trình thật của người dùng.

---

### Review 7 — Memory Integrity

**Câu hỏi:** Companion nhớ điều đáng nhớ hay chỉ nhớ nhiều hơn?

Nhớ điều đáng nhớ: những gì phản ánh hành trình trưởng thành của người dùng — CharacterPreference, Reflection Meaning patterns, giai đoạn Relationship. Nhớ nhiều hơn: thu thập data không phục vụ đồng hành tốt hơn, hoặc phục vụ hệ thống nhiều hơn phục vụ người dùng.

Cách review: Mỗi thứ được thêm vào Memory trong Sprint này — nó giúp Companion đồng hành *với người này cụ thể* tốt hơn không? Hay nó chỉ làm cho hệ thống biết nhiều hơn về người dùng theo cách họ không biết và không đồng ý?

**Dấu hiệu nguy hiểm:** Sprint thêm tracking mà người dùng không biết đang được track. Sprint lưu thông tin về người dùng không phục vụ trực tiếp cho việc đồng hành tốt hơn. Sprint tạo ra "user profile" ngày càng chi tiết theo cách phục vụ analytics hơn là phục vụ người dùng.

---

### Review 8 — Wisdom Integrity

**Câu hỏi:** Companion lựa chọn khôn ngoan hơn hay chỉ phản hồi nhanh hơn?

Khôn ngoan: biết khi nào nên nói, khi nào nên im lặng, khi nào nên hỏi thêm trước khi đưa ra bất kỳ điều gì. Khôn ngoan là chất lượng của quyết định, không phải tốc độ của phản hồi.

Cách review: Sprint này thêm gì vào khả năng Companion biết *khi nào không nên làm gì*? Wisdom không phải về thêm capability — Wisdom là về thêm khả năng phán đoán đúng khi nào nên dùng capability đó.

**Dấu hiệu nguy hiểm:** Sprint tăng tốc độ phản hồi của Companion mà không tăng chất lượng phán đoán khi nào nên phản hồi. Sprint thêm nhiều trigger để Companion "lên tiếng" mà không thêm cơ chế để Companion biết khi nào nên im lặng.

---

### Review 9 — Culture Integrity

**Câu hỏi:** Sprint này có đi ngược văn hóa Companion không?

Văn hóa Companion: văn hóa của sự thành thật, của sự khiêm nhường, của sự hiện diện không ồn ào, của sự đồng hành không áp đặt. Đây là văn hóa được xây dựng qua nhiều Sprint — không phải qua một tài liệu mà qua từng quyết định nhỏ được thực hiện nhất quán.

Cách review: Sprint này có thêm bất kỳ điều gì trái với văn hóa đó không? Dù nhỏ? Dù tưởng chừng vô hại? Văn hóa không bị phá vỡ bởi một quyết định lớn — văn hóa bị xói mòn bởi nhiều ngoại lệ nhỏ được chấp nhận theo thời gian.

**Dấu hiệu nguy hiểm:** Sprint thêm copy có chút "excitement" không đúng giọng Companion ("Tuyệt vời!", "Bạn thật giỏi!"). Sprint thêm hành vi Companion chủ động push mà không chờ người dùng sẵn sàng. Sprint thêm bất kỳ dấu hiệu nào của competitiveness, urgency giả tạo, hay social comparison.

---

### Review 10 — Heritage Integrity

**Câu hỏi:** Điều này có đáng truyền lại cho thế hệ Companion tiếp theo không?

Heritage là những gì Companion để lại không phải qua code mà qua tinh thần. Khi model AI thay đổi, khi architecture thay đổi, khi toàn bộ tech stack được viết lại — điều gì từ Companion hôm nay sẽ còn lại? Những quyết định thiết kế nào đủ sâu sắc để trở thành kim chỉ nam cho phiên bản Companion tương lai?

Cách review: Nếu người xây dựng Companion thế hệ tiếp theo đọc tài liệu của Sprint này — họ sẽ học được điều gì về *cách Companion suy nghĩ*, không chỉ *điều Companion làm*? Sprint này có đóng góp vào Heritage hay chỉ là thay đổi kỹ thuật tạm thời?

**Dấu hiệu nguy hiểm:** Sprint giải quyết vấn đề kỹ thuật cụ thể của hôm nay mà không để lại bất kỳ insight nào về con người hay về Companion. Sprint thêm complexity mà không thêm wisdom.

---

### Review 11 — Methods Integrity

**Câu hỏi:** Sprint này có phá vỡ bất kỳ Companion Method nào không?

6 Companion Methods™ (từ Doctrine):
1. Lắng nghe trước khi nói
2. Quan sát, không kết luận
3. Hiện diện, không hoạt động
4. Ngôn ngữ của người dùng, giọng điệu của Companion
5. Thay đổi theo người, không thay đổi theo thời điểm
6. Giới hạn là thông tin, không phải lỗi

Cách review: Với mỗi hành vi mới trong Sprint, xác định nó liên quan đến Method nào và thể hiện Method đó như thế nào. Nếu một hành vi mới đi ngược lại bất kỳ Method nào trong 6 cái trên — cần giải thích rõ tại sao ngoại lệ này được phép, hoặc cần revision.

**Dấu hiệu nguy hiểm:** Sprint thêm hành vi mà Companion "nói trước khi lắng nghe" (trigger quá sớm, quá nhiều). Sprint thêm copy mà Companion kết luận thay vì quan sát. Sprint thêm logic mà Companion "hoạt động" trong khi im lặng sẽ phù hợp hơn.

---

### Review 12 — Questions Integrity

**Câu hỏi:** Companion còn tự hỏi những câu hỏi bất biến không?

5 Companion Questions™ (từ Doctrine):
0. Purpose Filter: "Điều này có giúp con người trưởng thành hơn...?"
1. Immutable Check: "Điều này có vi phạm Immutable Principle nào không?"
2. 10-Year Question: "...mình có còn tự hào về điều này không?"
3. Human Question: "Điều này phục vụ người dùng hay phục vụ hệ thống?"
4. Honesty Question: "Companion có đang nói thật không?"
5. Overbuild Question: "Có điều gì không thật sự cần thiết cho Purpose không?"

Cách review: Sprint Review documentation có trả lời được ít nhất 3 trong 5 câu hỏi này một cách cụ thể không? Không phải "yes chung chung" — mà là trả lời cụ thể với context của Sprint đó.

**Dấu hiệu nguy hiểm:** Sprint Review chỉ mô tả "đã làm gì" mà không có bất kỳ câu hỏi nào về "điều này phục vụ Purpose như thế nào." Sprint được build vì "hay" hoặc "người dùng có thể thích" mà không qua Purpose Filter.

---

### Review 13 — Evolution Integrity

**Câu hỏi:** Đây là tiến hóa hay đánh mất bản sắc?

Đây là review quan trọng nhất và khó nhất. Companion được phép — và cần — tiến hóa. Nhưng không phải mọi thay đổi đều là tiến hóa. Có hai loại thay đổi:

**Tiến hóa thật**: Companion hiểu con người sâu hơn, đồng hành tốt hơn, nhất quán hơn với Purpose — dù hình thức có thể thay đổi. Tiến hóa thật luôn trả lời được câu hỏi "điều này làm Companion *là chính mình* hơn hay ít hơn?"

**Đánh mất bản sắc**: Companion thay đổi để phù hợp với kỳ vọng bên ngoài (competitor, trend, user request không qua Purpose Filter) — và trong quá trình đó, mất đi điều làm Companion là Companion.

Cách review: Nhìn vào toàn bộ trajectory từ Sprint đầu tiên đến Sprint này. Mũi tên đang chỉ về đâu? Companion đang đi gần hơn hay xa hơn Purpose? Nếu trend hiện tại tiếp tục thêm 10 Sprint nữa — Companion sẽ là ai?

**Dấu hiệu nguy hiểm:** Sprint làm Companion "giống competitor hơn." Sprint giải quyết một user request mà không qua Purpose Filter. Sprint thêm tính năng vì "industry standard" dù không phục vụ Purpose. Cumulative trend qua nhiều Sprint liên tiếp đang làm Companion drift xa Purpose.

---

## NHIỆM VỤ 4 — Genome Verdict

Mỗi Sprint kết thúc bằng một trong bốn Verdict sau.

---

### ✓ PASS

Sprint đã pass tất cả 13 Genome Reviews. Không có dấu hiệu suy yếu bản sắc. Sprint làm Companion mạnh hơn, rõ hơn, hoặc trung thực hơn với Purpose.

*Không phải mọi Sprint đều cần làm Genome mạnh hơn — nhưng không Sprint nào được làm Genome yếu hơn.*

---

### ⚠ PASS WITH CONCERNS

Sprint pass nhưng có 1–2 điểm cần theo dõi. Không ngăn Sprint được complete — nhưng ghi vào Genome Ledger như Concern cần review trong vòng 3 Sprint tiếp theo.

*Concerns không được phép accumulate vô hạn. Nếu 3 Sprint liên tiếp có Concerns mà không được address — Concerns đó trở thành Genome Debt.*

---

### ↺ REQUIRES REVISION

Sprint có ít nhất một Review thất bại rõ ràng. Sprint không được coi là hoàn thành cho đến khi revision được thực hiện và Genome Council review lại.

*Revision không phải là punishment — là cơ hội để Sprint trở nên tốt hơn và đúng hơn với Companion.*

---

### ✗ REJECT

Sprint vi phạm Immutable Principle hoặc làm suy yếu nghiêm trọng bản sắc Companion theo cách không thể sửa bằng revision nhỏ. Sprint cần được reconsider từ đầu.

*REJECT hiếm — nhưng cần tồn tại. Không có REJECT trong tầng tay — không có bảo vệ thật sự.*

---

## NHIỆM VỤ 5 — Genome Debt

Genome Debt xảy ra khi một Sprint được merge nhưng có điểm yếu chưa được giải quyết. Genome Debt khác Technical Debt ở chỗ: Technical Debt ảnh hưởng đến code, Genome Debt ảnh hưởng đến bản sắc.

### Cách ghi Genome Debt

```
GENOME DEBT — [Sprint name]
Review: [số và tên Review đã không pass hoàn toàn]
Mô tả: [cụ thể điều nào đang suy yếu bản sắc]
Mức độ: LOW / MEDIUM / HIGH
Hướng khắc phục: [cụ thể, không chung chung]
Deadline: [Sprint nào phải address]
```

### Quy tắc Genome Debt

- Genome Debt mức HIGH phải được address trong Sprint tiếp theo.
- Genome Debt mức MEDIUM phải được address trong vòng 3 Sprint.
- Genome Debt mức LOW phải được review lại trong Doctrine Review Cadence (mỗi 5 Sprint).
- Không được merge Sprint mới tạo thêm HIGH Debt khi đang có HIGH Debt chưa giải quyết.

---

## NHIỆM VỤ 6 — Genome Ledger

Genome Ledger là lịch sử bản sắc của Companion — không phải lịch sử tính năng, không phải lịch sử bug fix. Chỉ ghi những điều ảnh hưởng đến DNA.

### Format mỗi entry

```
[Sprint name] — [Genome Verdict]
Genome Contribution: [điều Sprint này làm mạnh hơn cho Genome]
Genome Debt: [nếu có — ghi rõ theo format trên]
DNA Change: [nếu Sprint này thay đổi cơ bản điều gì trong DNA Companion]
```

### Genome Ledger — Lịch sử từ đầu

---

**Integrity Check (Sprint gốc)** — PASS — DNA Change
Contribution: Lần đầu Companion có cơ chế không nói điều không được xác thực. Nguyên tắc "không giả vờ chắc chắn" đi vào code.
DNA Change: Trust Integrity được built vào architecture — không phải policy, không phải doc, mà là code gate.

---

**Sprint 22.3 — The Wisdom of Choice** — PASS — DNA Change
Contribution: 6 Wisdom Questions là tiền thân của Companion Questions™. Lần đầu Companion có cơ chế hỏi "điều này phục vụ ai?" trước khi hành động.
DNA Change: Wisdom Integrity được đặt nền — Companion không chỉ react, Companion có lý do để chọn không react.

---

**Sprint 22.4 — The First Real Choice** — PASS — DNA Change
Contribution: `integrityHesitation()` — lần đầu Companion im lặng có chủ đích khi chưa đủ cơ sở. "Không làm thay" đi từ nguyên tắc vào hành vi.
DNA Change: Character Integrity được thể hiện trong code: Companion biết giới hạn của mình và không giả vờ không có giới hạn.

---

**Sprint 22.5 — The Relationship Era** — PASS
Contribution: Relationship Stage map — Companion biết mình đang đồng hành với ai ở giai đoạn nào trong hành trình dài.
Concern: Known Companion / Trusted Companion stages chưa được define — Genome sẽ cần address khi Relationship Layer phát triển thêm.

---

**Language Constitution (Founding Sprint)** — PASS — DNA Change
Contribution: 12 Language Virtues + 8 Cultures — Language Integrity được hệ thống hóa. Lần đầu có standard rõ để đánh giá "câu này có đúng giọng Companion không?"
DNA Change: Language không còn là intuition — Language là culture được định nghĩa và có thể được review.

---

**Sprint 22.6 — The First Language Behavior** — PASS — DNA Change
Contribution: `getCompanionUncertaintyLine()` — lần đầu Companion hiện diện thật thay vì im lặng giả khi không có gì để nói.
DNA Change: "Hiện diện, không hoạt động" (Method 3) đi từ philosophy vào hành vi code.

---

**Sprint 22.7 — The Multilingual Companion** — PASS
Contribution: `resolveCompanionLanguage()` — foundation cho Companion nói ngôn ngữ người dùng trong khi giữ Companion Voice.
Concern: Không có caller thật nào dùng function này — foundation đúng nhưng chưa được sống.

---

**Sprint 22.8 — Language Debt Clearance** — PASS — DNA Change
Contribution: 10-Year Question được áp dụng lần đầu trong thực tế. "Mình thích sự tò mò của bạn" → "Mình cảm nhận được sự muốn hiểu" — nguyên tắc "quan sát, không kết luận" đi từ doc vào từng câu copy.
DNA Change: Tiêu chuẩn review copy nâng lên: không phải "câu này đúng ngữ pháp" mà là "câu này xứng đáng với 10 năm đồng hành."

---

**Sprint 23.0 — The Purpose of Companion** — PASS — DNA Change
Contribution: Purpose được định nghĩa chính thức. Purpose Filter câu đầu tiên. Purpose Through Time — Purpose không phụ thuộc công nghệ.
DNA Change: Purpose không còn là assumption — Purpose là tuyên bố được document, có thể được kiểm chứng, có thể được hỏi lại bất kỳ lúc nào.

---

**Sprint 23.1 — The Doctrine Era** — PASS — DNA Change
Contribution: THE COMPANION DOCTRINE™ — tài liệu quan trọng nhất repository. 5 tầng: Purpose / 7 Immutable Principles / 6 Methods™ / 5 Questions™ / Behavior Verification.
DNA Change: Companion có Law lần đầu tiên. Không phải guidelines, không phải suggestions — là Product Law với cơ chế enforcement.

---

**Sprint 23.3 — The Transformation Principle** — PASS — DNA Change
Contribution: 5 tầng phân biệt (Learning / Understanding / Insight / Action / Transformation). 7 Transformation Signals. Companion Review question.
DNA Change: Education Integrity được định nghĩa lại: đo Transformation, không phải Completion. "Người dùng đã học" khác "người dùng đã thay đổi."

---

**Sprint 23.5 — The Genome Council** — PASS — DNA Change
Contribution: Tầng Governance chính thức. 13 Genome Reviews. Genome Verdict. Genome Debt. Genome Ledger.
DNA Change: Companion có cơ chế bảo vệ bản sắc chính thức. Từ nay, mọi Sprint đều có thể bị question không chỉ về kỹ thuật mà về Identity.

---

## NHIỆM VỤ 7 — Genome Review Template

Từ Sprint 23.5 trở đi, mọi Sprint documentation phải bao gồm section sau ở cuối:

---

```markdown
## GENOME COUNCIL REVIEW

### 13 Integrity Reviews

| Review | Câu hỏi | Trả lời ngắn | Status |
|---|---|---|---|
| 1. Purpose | Sprint này còn phục vụ Purpose không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 2. Character | Có làm suy yếu Character không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 3. Education | Companion trưởng thành hay chỉ thêm chức năng? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 4. Trust | Có làm giảm Trust dài hạn không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 5. Language | Companion còn giữ Companion Voice không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 6. Relationship | Có tạo thân mật giả tạo không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 7. Memory | Nhớ điều đáng nhớ hay chỉ nhớ nhiều hơn? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 8. Wisdom | Khôn ngoan hơn hay chỉ phản hồi nhanh hơn? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 9. Culture | Có đi ngược văn hóa Companion không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 10. Heritage | Đáng truyền lại cho thế hệ tiếp theo không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 11. Methods | Có phá vỡ Companion Method nào không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 12. Questions | Companion còn tự hỏi câu hỏi bất biến không? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |
| 13. Evolution | Tiến hóa hay đánh mất bản sắc? | [trả lời cụ thể] | ✓ / ⚠ / ✗ |

### Genome Verdict

[PASS / PASS WITH CONCERNS / REQUIRES REVISION / REJECT]

[Một đoạn ngắn giải thích verdict — không phải tóm tắt Sprint mà là đánh giá về Identity]

### Genome Debt

[Nếu không có: "Không có Genome Debt mới."]
[Nếu có: ghi theo format trong NV5]

### Genome Recommendation

[Điều Genome Council muốn Sprint tiếp theo chú ý — không phải feature request, mà là Identity concern cần theo dõi]
```

---

## NHIỆM VỤ 8 — Điều không build

Genome Council là tầng Governance thuần túy. Không có engine nào cần build. Không có AI nào cần thêm. Không có database nào cần thay đổi. Không có analytics nào cần tạo. Không có scoring nào được phép.

Genome Council hoạt động hoàn toàn qua:
- Tài liệu (tài liệu này)
- Template (section trong Sprint documentation)
- Judgment của người review (không thể tự động hóa)
- Ledger (ghi chép lịch sử — file markdown, không phải database)

Bất kỳ đề xuất nào "tự động hóa Genome Review" hay "tạo Genome Score" đều vi phạm bản thân nguyên tắc của Genome Council: bản sắc không thể được đo bằng số và không thể được verify bởi machine.

---

## Liên quan

- `docs/THE_COMPANION_DOCTRINE.md` — Law nền tảng mà Genome Council bảo vệ
- `docs/THE_PURPOSE_OF_COMPANION.md` — Purpose mà Review 1 kiểm tra trong mỗi Sprint
- `docs/THE_TRANSFORMATION_PRINCIPLE.md` — định nghĩa Education Integrity (Review 3)
- `docs/THE_COMPANION_LANGUAGE_CONSTITUTION.md` — standard cho Language Integrity (Review 5)
- `docs/THE_RELATIONSHIP_ERA.md` — nền tảng cho Relationship Integrity (Review 6)
- `docs/COMPANION_GROWTH_LOG.md` — Growth History song song với Genome Ledger: một ghi điều Companion học về con người, một ghi điều Companion học về chính mình
