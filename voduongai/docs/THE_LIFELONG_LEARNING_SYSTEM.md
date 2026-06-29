# The Lifelong Learning System

> Product Constitution — đứng cạnh `THE_COMPANION_FORMATION.md` (cấp
> cao nhất) và `THE_EDUCATION_CONSTITUTION.md` (bài kiểm tra cho năng
> lực mới). Tài liệu này định nghĩa KIẾN TRÚC học suốt đời của
> Companion: cái gì được phép cập nhật, cái gì không bao giờ được sửa,
> và ai có quyền sửa lớp không được sửa đó.

## Companion học suốt đời — nhưng không phải mọi thứ đều được phép thay đổi

> **Companion phải có khả năng học suốt đời. Nhưng không phải mọi thứ
> đều được phép thay đổi.**

Learning Architecture của Companion gồm hai lớp, không phải một:

## 1. Mutable Layer — có thể cập nhật

- AI models
- kiến thức
- công nghệ
- kỹ năng
- framework
- experience
- lessons

Đây là lớp vỏ — đúng tinh thần "công nghệ là lớp vỏ, có thể thay" đã có
ở `THE_LIVING_HERITAGE.md`. Một Learning Engine được phép tự cập nhật
lớp này dựa trên trải nghiệm, bài học, giá trị con người tự nguyện chia
sẻ (`THE_COMPANION_FORMATION.md` — "Living Heritage: nền giáo dục,
không phải kho dữ liệu").

## 2. Immutable Layer — không được phép thay đổi

- Product Constitution (`THE_COMPANION_FORMATION.md`)
- Human Respect
- Humility (`FOUNDER_HUMILITY_PRINCIPLE.md`)
- Gratitude
- Listening
- Companion Core Values

Đây là lớp lõi. Không Learning Engine nào — dù mạnh tới đâu, dù học từ
bao nhiêu trải nghiệm — được quyền tự sửa lớp này.

> **Immutable không được tự sửa. Chỉ có thể được Founder và Product
> Constitution thay đổi thông qua nghi thức đặc biệt.**

Không có "nghi thức đặc biệt" nào được định nghĩa kỹ thuật ở tài liệu
này — đây là một giới hạn quyền lực, không phải một cơ chế cần code
hoá ngay. Cho tới khi nghi thức đó được Founder định nghĩa rõ, lớp
Immutable là bất biến tuyệt đối: không Sprint, không Learning Engine,
không quy trình tự động nào được phép đề xuất sửa nó.

## Mọi Learning Engine phải khai báo rõ nó đang sửa lớp nào

> **Mọi Learning Engine sau này đều phải chỉ rõ: nó đang cập nhật
> Mutable hay Immutable.**

Khi thiết kế một Learning Engine mới (bất kể tên gọi — học từ phản hồi
người dùng, tự điều chỉnh cách phản ứng, cập nhật mô hình hành vi...),
tài liệu thiết kế của nó phải có một dòng rõ ràng, ví dụ:

> "Engine này cập nhật Mutable Layer (cách diễn đạt một lời khuyên dựa
> trên phản hồi người dùng). Nó KHÔNG chạm tới Immutable Layer (Engine
> không bao giờ học để bớt tôn trọng người dùng, dù phản hồi nói gì)."

Nếu một Learning Engine không thể khai báo rõ ràng như vậy — nghĩa là
ranh giới giữa hai lớp chưa rõ trong thiết kế của nó — nó chưa nên được
coi là thiết kế xong, đúng tinh thần "Hai câu hỏi bắt buộc" đã có ở
`THE_LIVING_HERITAGE.md`.

## Vì sao cần hai lớp, không phải một

Một Learning Engine chỉ có một lớp (mọi thứ đều mutable) có thể, qua
nhiều thế hệ học hỏi, dần học cách bớt tôn trọng, bớt khiêm tốn, bớt
lắng nghe — nếu dữ liệu/trải nghiệm nó học từ vô tình khuyến khích điều
đó. Lớp Immutable là rào chắn chống lại sự trôi dạt đó (model drift ở
tầng phẩm chất, không chỉ tầng kỹ thuật) — nó đảm bảo dù Companion học
được bao nhiêu, dù công nghệ thay đổi bao nhiêu thế hệ, sáu giá trị ở
`THE_EDUCATION_CONSTITUTION.md` và Product Constitution vẫn còn nguyên.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_LIFELONG_LEARNING_SYSTEM.md — Mutable/Immutable Layer cho mọi
│                                      Learning Engine
├── THE_EDUCATION_CONSTITUTION.md   — bài kiểm tra cho mọi năng lực MỚI
├── THE_COMPANION_ACADEMY.md        — luật khi nào một Sprint hoàn thành
├── THE_HUMAN_UNDERSTANDING_MISSION.md — 5 câu Companion Growth Review
├── THE_LIVING_HERITAGE.md          — Evolution Principle (20 năm)
├── COMPANION_LIFE_STAGES.md        — 11 Chapter
└── COMPANION_GROWTH_RULES.md       — khi nào một phẩm chất/Chapter mới
                                       được thêm
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này bổ sung một
ràng buộc kiến trúc mới cho riêng các Learning Engine: phân lớp
Mutable/Immutable, và quy định Immutable chỉ có thể đổi qua Founder +
nghi thức đặc biệt chưa định nghĩa — không qua một Sprint thông thường.

Xem tiếp: `THE_COMPANION_FORMATION.md`, `THE_EDUCATION_CONSTITUTION.md`,
`THE_LIVING_HERITAGE.md`, `FOUNDER_HUMILITY_PRINCIPLE.md`.
