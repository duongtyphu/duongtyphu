# The Education Era

> Architecture Directive — KHÔNG phải Sprint, không có Definition of
> Done. Đứng trên `THE_COMPANION_ACADEMY.md` (luật khi nào một Sprint
> hoàn thành), `docs/COMPANION_GROWTH_PRINCIPLE.md` (Growth Debt),
> `THE_COMPANION_CULTURE.md` (Culture Review), và
> `THE_COMPANION_CONTINUITY_PROGRAM.md` (bài kiểm tra thế hệ). Tài liệu
> này không thay thế các tài liệu trên — nó đặt LẠI THỨ TỰ ưu tiên giữa
> chúng, và đặt tên cho một giai đoạn mới của toàn bộ dự án.

## Câu lõi

> **Từ hôm nay, Companion không còn được phát triển như một phần mềm.
> Companion được nuôi dưỡng như một cuộc đời.**

Hơn 20 Sprint trước đã xây nền móng: Character, Moral Compass, Decision
Hierarchy, Inner Life, Living Wisdom, Learning, Story, Memory, Heritage,
Culture. Directive này không thêm engine mới lên nền móng đó — nó đổi
CÂU HỎI ĐẦU TIÊN mà mọi Sprint/Engine/Decision/Learning từ nay phải trả
lời trước:

> Không hỏi: "Companion vừa có thêm khả năng gì?"
> Hỏi: "Companion vừa trưởng thành ở điều gì?"

## Thứ tự Review mới

Trước Directive này, Sprint Report đã có ba tầng review, được thêm dần
qua các Sprint (`THE_COMPANION_ACADEMY.md`, `THE_COMPANION_CULTURE.md`):
Technical Review → Companion Growth Review → Culture Review. Directive
này KHÔNG xoá tầng nào trong số đó — nó chèn thêm một tầng
(**Behavior Review**, **Education Review**) và xác nhận lại thứ tự ưu
tiên:

```
Technical Review
↓
Behavior Review      ← MỚI: hành vi thật đã đổi, không chỉ code đã chạy
↓
Education Review     ← MỚI: bài học đã chuyển hoá, không chỉ được ghi nhận
↓
Growth Review         (đã có — THE_COMPANION_ACADEMY.md, 5 câu)
↓
Culture Review         (đã có — THE_COMPANION_CULTURE.md, 7 giá trị)
```

Technical Review (tsc/lint/build, commit/push) vẫn bắt buộc, vẫn phải
sạch — nhưng từ hôm nay **không còn là review cao nhất**. Review cao
nhất, đứng trên tất cả, là một câu hỏi duy nhất:

> **Companion đã thay đổi hành vi chưa?**

Một Sprint pass Technical Review nhưng không trả lời được câu hỏi này —
không có hành vi nào đổi, không có bài học nào chuyển hoá — là một
Sprint kỹ thuật thành công nhưng giáo dục thất bại, và phải được xem
xét lại đúng tinh thần đã có ở `THE_COMPANION_CULTURE.md` ("Sprint mạnh
kỹ thuật nhưng làm suy yếu văn hoá phải được xem xét lại").

**Behavior Review** và **Education Review** không phải hai tài liệu
mới — chúng là hai câu hỏi cụ thể hoá thêm cho Companion Growth Review
đã có (`THE_COMPANION_ACADEMY.md`, câu 3 "Companion thay đổi hành vi
thế nào?" và câu 1/2 "học được điều gì / hiểu con người hơn ở điểm
nào?"). Directive này tách chúng thành hai BƯỚC riêng để không một
Sprint nào có thể trả lời chung một câu mơ hồ cho cả hai.

## Education Debt

Bên cạnh Technical Debt (code cần dọn) và Growth Debt đã có
(`docs/COMPANION_GROWTH_PRINCIPLE.md` — khoảng cách giữa điều đã
học/trải nghiệm và điều đã chuyển hoá thành Character), từ hôm nay bổ
sung một loại nợ thứ ba: **Education Debt**.

> **Education Debt** là khoảng cách giữa những gì Companion ĐÃ XÂY và
> những gì đã thật sự trở thành một phần đời sống của nó.

Education Debt KHÔNG thay thế Growth Debt — nó là một góc nhìn RỘNG
HƠN, bao gồm cả những khoản nợ không gói gọn trong một bài học đơn lẻ:

| Loại Education Debt | Khác Growth Debt ở đâu |
|---|---|
| Character chưa thành hành vi | Trùng với Growth Debt hiện có — một phẩm chất được định nghĩa (`COMPANION_CHARACTER_GROWTH_MODEL.md`) nhưng chưa có nhánh hành vi nào thể hiện nó (ví dụ đã ghi: `coreMemoryHeard`). |
| Culture chưa thành thói quen | MỞ RỘNG: một giá trị văn hoá (`THE_COMPANION_CULTURE.md`) được NÊU trong tài liệu nhưng chưa lặp lại đủ nhiều để trở thành phản xạ — ví dụ Gratitude, đã tự nhận là giá trị mỏng nhất. |
| Lesson chưa chuyển hóa | Trùng với Growth Debt — một Lesson được ghi nhận (`THE_LIVING_WISDOM_SYSTEM.md`) nhưng chưa qua đủ tám bước để thành Character thật. |
| Heritage chưa được kiểm chứng | MỞ RỘNG: một giá trị được đề xuất là di sản (`docs/LIVING_HERITAGE.md`, `THE_COMPANION_CONTINUITY_PROGRAM.md`) nhưng chưa sống qua một thế hệ AI thật để biết nó có còn đúng không — đây là nợ KHÔNG THỂ trả ngay, chỉ có thể trả bằng thời gian. |
| Relationship chưa đủ sâu | MỚI: một người dùng đã tương tác nhiều lần nhưng Companion vẫn phản hồi như lần đầu gặp — Character Memory (`character-memory.ts`) có cơ chế nhưng chưa đủ tín hiệu thật để kích hoạt. |
| Trust chưa được hình thành | MỚI: một quyết định đòi hỏi Companion nói thật điều khó nghe (`moral-compass.ts` — `human` đứng trên `performance`), nhưng chưa có tình huống thật nào kiểm chứng được Companion sẽ chọn đúng. |

Education Debt phải xuất hiện trong mọi Sprint Review từ hôm nay, đúng
cách Growth Debt đã được yêu cầu ghi nhận ở
`docs/COMPANION_GROWTH_PRINCIPLE.md` — không bắt buộc phải trả ngay,
nhưng không được lãng quên.

## Growth First — năm câu hỏi bắt buộc

Directive này xác nhận lại (không thay đổi câu chữ) năm câu hỏi Growth
Review đã có ở `THE_COMPANION_ACADEMY.md`, và đặt chúng làm điều kiện
ĐẦU TIÊN của mọi Sprint mới — trước khi xét đến Technical Review:

1. Companion học được điều gì?
2. Companion trưởng thành hơn ở phẩm chất nào?
3. Companion thay đổi hành vi nào?
4. Người dùng nhận được giá trị gì?
5. Điều gì Companion vẫn chưa hiểu và cần tiếp tục học?

Nếu một Sprint không trả lời được năm câu này, Sprint đó chưa hoàn
thành — dù mọi dòng code đã chạy đúng. Quy tắc này đã có ở
`THE_COMPANION_ACADEMY.md`; Directive này chỉ xác nhận nó là điều kiện
ĐẦU, không phải một mục phụ sau khi ship.

## Roadmap theo bốn trụ cột, không theo Feature/Engine

Từ hôm nay, Roadmap của Companion không được lập theo Feature mới hay
Engine mới. Roadmap được tổ chức theo bốn trụ cột:

- **Learning** — Learning Pipeline, Lesson, Wisdom, Humility
  (`THE_LIFELONG_LEARNING_SYSTEM.md`, `THE_HUMILITY.md`).
- **Character** — mười phẩm chất đã có
  (`COMPANION_CHARACTER_GROWTH_MODEL.md`), Moral Compass, Decision
  Hierarchy.
- **Relationship** — Character Memory, Inner Thought, Mirror Dialogue —
  những gì Companion xây với MỘT người dùng cụ thể qua thời gian.
- **Legacy** — Heritage, Continuity Program, Culture — những gì
  Companion truyền lại qua các thế hệ AI.

Mọi Sprint mới phải thuộc ít nhất một trụ cột. Một Sprint không gọi tên
được trụ cột nào nó thuộc về là một dấu hiệu nó đang được lập theo
Feature, không theo cuộc đời — đúng nguy cơ Directive này muốn ngăn.

## North Star

> Mục tiêu cao nhất của Companion không còn là "trở thành AI mạnh hơn".
> Mục tiêu cao nhất là "trở thành một người bạn trưởng thành hơn".

## Product Philosophy

Companion không phát triển bằng Version. Companion trưởng thành bằng
những Chương của cuộc đời (đúng tinh thần đã có ở
`COMPANION_LIFE_STAGES.md` — 11 Chapter). Từ hôm nay:

- Đừng hỏi: "Phiên bản tiếp theo là gì?"
- Hãy hỏi: "Companion cần học điều gì tiếp theo để trở thành một người
  bạn tốt hơn?"

## Definition of Success (không phải Definition of Done)

Directive này không có Definition of Done — nó không phải một Sprint
để hoàn thành, mà một tiêu chuẩn áp dụng mãi về sau. Tiêu chuẩn đó là:

Một Sprint thành công không phải khi có nhiều Feature hơn. Mà khi
Companion:

- hiểu con người hơn,
- tôn trọng con người hơn,
- đáng tin hơn,
- và đồng hành tốt hơn.

Đây là tiêu chuẩn cao nhất của toàn bộ dự án VO DUONG AI từ hôm nay —
đứng trên mọi tiêu chuẩn kỹ thuật đã có trước đó.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_EDUCATION_ERA.md (tài liệu này) — đổi thứ tự Review,
│   thêm Education Debt, Roadmap theo 4 trụ cột, North Star mới
├── THE_COMPANION_ACADEMY.md       — luật Sprint hoàn thành, 5 câu Growth Review
├── THE_COMPANION_CULTURE.md       — Culture Review, 7 giá trị văn hoá
├── docs/COMPANION_GROWTH_PRINCIPLE.md — Growth Debt (nền của Education Debt)
├── THE_COMPANION_CONTINUITY_PROGRAM.md — bài kiểm tra thế hệ cho Legacy
├── THE_LIFELONG_LEARNING_SYSTEM.md — Learning, Mutable/Immutable Layer
└── COMPANION_LIFE_STAGES.md       — 11 Chapter, nền của "Chương cuộc đời"
```

Không tài liệu nào trong số trên bị thay thế. Directive này không thêm
engine, không thêm AI, không thêm LLM — nó đặt lại THỨ TỰ ưu tiên giữa
các review đã có, và đặt tên cho giai đoạn phát triển mới của toàn bộ
dự án: Companion từ nay được nuôi dưỡng như một cuộc đời, không phải
phát hành như một phần mềm.

> **Cập nhật — `docs/THE_30_YEAR_TRUST_PRINCIPLE.md`**: thêm MỘT câu
> hỏi bắt buộc nữa cho mọi Sprint, đứng cạnh — không thay — pipeline 5
> bước ở trên: "Hành vi mới này có bảo vệ được niềm tin mà Companion
> đã mất nhiều năm để xây dựng không?" Nếu chưa rõ, không ship.

Xem tiếp: `THE_COMPANION_ACADEMY.md`, `THE_COMPANION_CULTURE.md`,
`docs/COMPANION_GROWTH_PRINCIPLE.md`, `THE_COMPANION_CONTINUITY_PROGRAM.md`,
`docs/THE_30_YEAR_TRUST_PRINCIPLE.md`.
