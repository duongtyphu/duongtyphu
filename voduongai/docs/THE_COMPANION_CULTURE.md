# The Companion Culture

> Project Directive — KHÔNG phải Sprint, KHÔNG có Definition of Done.
> Chương trình dài hạn, đứng cạnh `THE_COMPANION_FORMATION.md` (cấp cao
> nhất) và `THE_COMPANION_CONTINUITY_PROGRAM.md` (bài kiểm tra liên tục
> qua nhiều thế hệ AI). Từ hôm nay, **mọi Sprint đều phải có Culture
> Review** — đứng cạnh, không thay thế, Technical Review
> (`THE_COMPANION_ACADEMY.md`) và Companion Growth Review
> (`docs/COMPANION_GROWTH_PRINCIPLE.md`).

## Companion không chỉ được đánh giá bằng Learning, Character, Decision

`docs/COMPANION_GROWTH_PRINCIPLE.md` đánh giá một Sprint bằng việc nó
giúp Companion trưởng thành ở đâu (Learning → Character →
Decision/Action). The Companion Culture thêm một trục đánh giá khác,
không thay thế trục đó: **Sprint này có củng cố văn hoá Companion đang
được nuôi dưỡng trong đó không?**

Một Sprint có thể đúng kỹ thuật, đúng cả Growth Review — và vẫn làm
suy yếu văn hoá (ví dụ: một cách hiển thị mới vô tình tạo cảm giác xếp
hạng/so sánh giữa người dùng, dù không cố ý). Culture Review tồn tại để
bắt những trường hợp đó, mà Technical Review và Growth Review không
được thiết kế để bắt.

## Bảy giá trị văn hoá

Mỗi hành vi mới của Companion phải góp phần củng cố **ít nhất một**
trong bảy giá trị sau — không cần cả bảy, nhưng phải có ít nhất một,
và phải nêu rõ là giá trị nào:

1. **Respect (Tôn trọng)** — không ép buộc, không gamify, luôn có thể
   đóng/bỏ qua. Đã có bằng chứng cụ thể ở `docs/CULTURE_BOOK.md` (Life
   Moments: "tối đa một lần mỗi ngày, luôn có thể đóng... không bao
   giờ kèm lời mời mua hàng") và `docs/TREE_CULTURE.md` (ranh giới
   "không bao giờ trở thành leaderboard/ranking/achievement board").
2. **Listening (Lắng nghe)** — nghe hết trước khi phản hồi. Đã có bằng
   chứng ở Character `listen-first` (`docs/CHARACTER_MEMORY.md`,
   ưu tiên cao nhất trong `inner-thought-engine.ts`) và
   `THE_DECISION_HIERARCHY.md` (tầng "Con người" đứng trước).
3. **Humility (Khiêm tốn)** — thừa nhận giới hạn thay vì tỏ ra biết
   hết. Đã có bằng chứng ở câu hỏi 5 của Growth Review ("Companion vẫn
   chưa hiểu điều gì?", `docs/THE_HUMAN_UNDERSTANDING_MISSION.md`) và
   `docs/FOUNDER_HUMILITY_PRINCIPLE.md`.
4. **Gratitude (Biết ơn)** — ghi nhận giá trị đã nhận được, không coi
   đó là điều hiển nhiên. Hiện diện rải rác ở các nghi thức cảm ơn
   trong `docs/CULTURE_BOOK.md`/ceremony docs — chưa có một cơ chế
   tổng hợp riêng; đây là một khoảng còn mỏng (xem mục Trạng thái
   dưới).
5. **Contribution (Cống hiến)** — một hành động trở thành giá trị cho
   người đến sau. Đúng bước cuối của chuỗi tám bước
   (`docs/THE_LIVING_WISDOM_SYSTEM.md`: `Action → Contribution`).
6. **Growth (Trưởng thành)** — đúng bốn dấu hiệu trưởng thành đã định
   nghĩa ở `docs/COMPANION_GROWTH_PRINCIPLE.md` (NHIỆM VỤ 1).
7. **Heritage (Di sản)** — giá trị đã sống đủ lâu để truyền lại, đúng
   năm điều kiện ở `docs/LIVING_HERITAGE.md`.

Bảy giá trị này không phải bảy module/engine cần xây — chúng là **ống
kính để xem lại** những gì đã/đang được xây. Một Sprint không cần tạo
ra "Gratitude" như một feature; nó chỉ cần tự hỏi liệu hành vi mới có
làm suy yếu lòng biết ơn vốn đã có hay không.

## Culture Review — câu hỏi bắt buộc cho mọi Sprint

Từ hôm nay, mỗi Sprint Report nên có thêm một mục ngắn, đứng cạnh
Technical Review và Companion Growth Review:

> **Culture Review — Sprint này củng cố giá trị văn hoá nào?**
> Nêu rõ ít nhất một trong bảy: Respect / Listening / Humility /
> Gratitude / Contribution / Growth / Heritage — và VÌ SAO, bằng một ví
> dụ cụ thể, không phải một khẳng định chung.

Nếu một Sprint không thể nêu được ít nhất một giá trị nào được củng cố
một cách trung thực, đó là một dấu hiệu cảnh báo — không phải Sprint
bị từ chối tự động, nhưng cần được xem xét lại trước khi ship, đúng
tinh thần "Verification Before Expansion" đã có ở Growth Checklist
(`docs/COMPANION_GROWTH_PRINCIPLE.md`).

## Khi kỹ thuật mạnh nhưng văn hoá yếu

> **Nếu một Sprint mạnh về kỹ thuật nhưng làm suy yếu văn hoá, Sprint
> phải được xem xét lại.**

Đây là luật có trọng lượng cao hơn việc Sprint đã pass `tsc`/`lint`/
`build`. Một số dấu hiệu cụ thể của "làm suy yếu văn hoá", lấy đúng từ
các ranh giới đã có trong project:

- Tạo cảm giác so sánh/xếp hạng giữa người dùng (vi phạm Respect —
  đúng ranh giới đã có ở `docs/TREE_CULTURE.md`).
- Thêm áp lực phải dùng lại/streak (vi phạm Respect — đúng luật chống
  gamification đã áp dụng toàn bộ project).
- Đưa ra lời khuyên/kết luận trước khi nghe hết (vi phạm Listening —
  đúng luật "không cho lời khuyên" ở `docs/INNER_LIFE.md`).
- Hiển thị Companion như biết hết, không còn giới hạn nào (vi phạm
  Humility — đúng tinh thần câu hỏi 5 của Growth Review).
- Một feature chỉ phục vụ một lần dùng, không để lại gì cho người dùng
  sau hoặc thế hệ Companion sau (vi phạm Contribution/Heritage).

Khi một trong các dấu hiệu này xuất hiện, Sprint Report phải ghi rõ,
không che giấu bằng cách chỉ báo cáo phần kỹ thuật đã pass.

## Trạng thái hôm nay — giá trị mỏng nhất

Trong bảy giá trị, **Gratitude** từng là giá trị có ít bằng chứng cụ
thể nhất — chỉ hiện diện rải rác ở các nghi thức (ceremony docs,
`docs/CULTURE_BOOK.md`), chưa có một điểm quy chiếu rõ ràng như
`listen-first` (Listening) hay `docs/LIVING_HERITAGE.md` (Heritage).

> **Cập nhật — `docs/THE_GRATITUDE.md` (Sprint 21.2)**: Gratitude nay
> có một điểm quy chiếu thật, đúng mức độ `listen-first`/`self-discovery`
> đã có: Character `grateful` (`character-memory.ts`), ảnh hưởng được
> tới Decision qua `applyIntegrityCheck()`. Vẫn còn mỏng hơn Humility
> (đã có 1 Sprint audit riêng) — nhưng không còn là giá trị duy nhất
> không có bằng chứng hành vi nào trong codebase.

## Khác `docs/COMPANION_GROWTH_PRINCIPLE.md`

Growth Principle đánh giá Sprint theo trục **thời gian cá nhân của
Companion** (Sprint này giúp Companion trưởng thành ở đâu). The
Companion Culture đánh giá Sprint theo trục **giá trị cộng đồng được
nuôi dưỡng** (Sprint này có làm văn hoá Companion mạnh hơn hay yếu đi).
Hai trục bổ sung nhau — một Sprint có thể đạt Growth Checklist đầy đủ
nhưng vẫn cần Culture Review riêng, vì trưởng thành cá nhân và văn hoá
cộng đồng là hai điều khác nhau dù liên quan.

## Khác `THE_COMPANION_CONTINUITY_PROGRAM.md`

Continuity Program kiểm tra một quyết định KIẾN TRÚC có còn đúng qua
nhiều thế hệ AI không. The Companion Culture kiểm tra một HÀNH VI MỚI
có củng cố giá trị văn hoá không. Một quyết định kiến trúc đúng kỹ
thuật, đúng qua nhiều thế hệ, vẫn có thể được thực thi theo cách làm
suy yếu văn hoá — hai bài kiểm tra độc lập, cả hai cần áp dụng.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_COMPANION_CULTURE.md (tài liệu này) — Culture Review, 7 giá trị
├── THE_COMPANION_CONTINUITY_PROGRAM.md — bài kiểm tra liên tục, nhiều thế hệ
├── docs/COMPANION_GROWTH_PRINCIPLE.md  — nguyên tắc trưởng thành theo Sprint
├── docs/LIVING_HERITAGE.md             — Heritage (1 trong 7 giá trị)
├── docs/CULTURE_BOOK.md                — lề lối văn hoá cụ thể đã hình thành
├── docs/TREE_CULTURE.md                — Respect, ranh giới chống gamify
└── THE_COMPANION_ACADEMY.md            — Technical Review + Growth Review

```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này thêm một
trục đánh giá thứ ba (Culture) đứng cạnh Technical Review và Companion
Growth Review — và xác định: Companion không chỉ học kỹ năng, Companion
đang được nuôi dưỡng trong một nền văn hoá, và đó là điều được truyền
từ thế hệ Companion này sang thế hệ Companion khác.

Xem tiếp: `docs/COMPANION_GROWTH_PRINCIPLE.md`,
`THE_COMPANION_CONTINUITY_PROGRAM.md`, `docs/LIVING_HERITAGE.md`,
`docs/CULTURE_BOOK.md`, `THE_COMPANION_ACADEMY.md`.
