# The Character Before Capability Principle

> Product Constitution — đứng cạnh `THE_COMPANION_FORMATION.md` (cấp
> cao nhất). Tài liệu này là NGUYÊN TẮC ĐÁNH GIÁ CAO NHẤT của
> Companion: Character luôn được ưu tiên trước Capability, Trust luôn
> được ưu tiên trước Performance.

## Hai câu hỏi bắt buộc cho mọi tính năng/Learning Engine/Decision Engine mới

> 1. **Tính năng này giúp Companion mạnh hơn ở đâu?**
> 2. **Tính năng này giúp Companion đáng tin hơn ở đâu?**

Mọi tính năng mới, mọi Learning Engine mới, mọi Decision Engine mới —
không trừ ngoại lệ — phải trả lời được CẢ HAI câu hỏi này trước khi
được xem là hoàn thành.

## Nếu chỉ có câu trả lời thứ nhất, Sprint chưa hoàn thành

Đây là luật cứng, không phải gợi ý. Một Sprint chứng minh được tính
năng làm Companion mạnh hơn (biết nhiều hơn, phản hồi nhanh hơn, phân
loại chính xác hơn, hành vi phong phú hơn) — nhưng không chứng minh
được tính năng đó làm Companion đáng tin hơn (tôn trọng hơn, khiêm tốn
hơn, lắng nghe hơn, ít gây tổn thương hơn) — Sprint đó CHƯA hoàn thành,
dù phần kỹ thuật (tsc/lint/build) có thể vẫn đúng và vẫn được ship.
Đây là cách áp dụng cụ thể của câu hỏi cao nhất đã có ở
`THE_COMPANION_FORMATION.md` ("Companion vừa trưởng thành thêm điều
gì?") lên đúng hai trục: Capability và Character.

## Character luôn được ưu tiên trước Capability. Trust luôn được ưu tiên trước Performance.

Khi hai mục tiêu xung đột — một thay đổi làm Companion mạnh hơn nhưng
làm giảm sự đáng tin (ví dụ: phản hồi nhanh hơn bằng cách bỏ qua bước
tôn trọng/lắng nghe; hoặc thông minh hơn bằng cách phơi bày phân tích
kỹ thuật cho người dùng) — Character/Trust thắng, không phải
Capability/Performance. Đây là phiên bản tổng quát của bài kiểm tra
"Điều này có giúp Companion mạnh hơn nhưng không tốt hơn?" đã có ở
`THE_EDUCATION_CONSTITUTION.md` — Constitution này nâng nó thành luật
đánh giá cho MỌI Sprint, không chỉ năng lực mới.

## Áp dụng

Khi viết Companion Growth Review hoặc Product Review cho một Sprint
mới (`THE_HUMAN_UNDERSTANDING_MISSION.md`, `THE_COMPANION_FORMATION.md`),
nên trả lời rõ hai câu hỏi này — đặc biệt với mọi Decision Engine/
Character Engine/Learning Engine (ví dụ `getCompanionDecision()`,
`character-engine.ts`, `reflection-meaning.ts`): câu trả lời cho câu
hỏi 1 (mạnh hơn) không được phép tự đứng một mình mà không có câu trả
lời cho câu hỏi 2 (đáng tin hơn).

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md — nguyên tắc đánh giá
│                                        cao nhất: Character > Capability,
│                                        Trust > Performance
├── THE_COMPANION_EXPERIENCE_PRINCIPLE.md — thước đo trưởng thành:
│                                            sự từng trải, không phải
│                                            số lượng tri thức
├── THE_LEARNING_ACTION_LOOP.md        — nguyên tắc học tập cao nhất:
│                                        khép vòng lặp bằng Outcome,
│                                        Outcome không phải KPI
├── THE_JOY_OF_CONTRIBUTION.md         — động lực: tri thức = trách
│                                        nhiệm trao lại, không phải
│                                        tài sản tích lũy
├── THE_LIVING_WISDOM_SYSTEM.md        — chuỗi 8 bước Experience→Contribution,
│                                        mục tiêu cuối cùng = Wisdom
├── THE_LIFELONG_LEARNING_SYSTEM.md    — Mutable/Immutable Layer cho mọi
│                                        Learning Engine
├── THE_EDUCATION_CONSTITUTION.md      — bài kiểm tra cho mọi năng lực
│                                        MỚI trước khi đưa vào nền tảng
├── THE_COMPANION_ACADEMY.md          — luật khi nào một Sprint hoàn thành
├── THE_HUMAN_UNDERSTANDING_MISSION.md — 5 câu Companion Growth Review
├── THE_LIVING_HERITAGE.md            — Evolution Principle (20 năm)
├── COMPANION_LIFE_STAGES.md          — 11 Chapter
└── COMPANION_GROWTH_RULES.md         — khi nào một phẩm chất/Chapter mới
                                         được thêm
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này xác định
nguyên tắc đánh giá cao nhất, đứng trên cả Character Engine
(`docs/CHARACTER_ENGINE.md`) lẫn mọi Capability mới — Character/Trust
luôn thắng khi có xung đột.

Xem tiếp: `THE_COMPANION_FORMATION.md`, `THE_EDUCATION_CONSTITUTION.md`,
`docs/CHARACTER_ENGINE.md`.
