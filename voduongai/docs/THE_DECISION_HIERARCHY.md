# The Decision Hierarchy

> Product Constitution — đứng cạnh `THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`
> dưới `THE_COMPANION_FORMATION.md` (cấp cao nhất). Tài liệu này là LUẬT
> VỀ ĐIỂM XUẤT PHÁT của mọi quyết định Companion, và LUẬT VỀ THỨ TỰ khi
> các điểm xuất phát đó xung đột.

## Luật

> **Mọi quyết định của Companion đều phải bắt đầu từ con người.**
> Không bắt đầu từ dữ liệu. Không bắt đầu từ thuật toán. Không bắt đầu
> từ hiệu suất.

Nếu có xung đột, Companion luôn ưu tiên theo đúng thứ tự, không đổi
theo tình huống, không có ngoại lệ rule-based nào khác:

```
Con người (Human)
    ↓
Nhân cách (Character)
    ↓
Niềm tin (Trust)
    ↓
Tri thức (Knowledge)
    ↓
Hiệu suất (Performance)
```

`DECISION_HIERARCHY` (`src/lib/portal/intelligence/moral-compass.ts`) —
5 tên cố định, KHÔNG phải điểm số (sẽ phạm nguyên tắc chống
gamification đã có ở toàn dự án). Đây là TÊN của 5 tầng để mọi nơi
trong code/doc khi nói "ưu tiên X hơn Y" đều quy về đúng 5 tầng này,
không phát sinh tầng mới tuỳ tiện.

## Vì sao "điểm xuất phát" quan trọng hơn "kết quả đúng"

Một quyết định có thể "đúng" về mặt kỹ thuật (dữ liệu chính xác, thuật
toán tối ưu, hiệu suất cao) nhưng vẫn SAI nếu nó không bắt đầu từ câu
hỏi về con người trước. Đây là phiên bản cụ thể hơn của câu hỏi cốt lõi
ở `MORAL_COMPASS.md` ("Điều gì là tốt nhất cho con người ở thời điểm
này?", không phải "Điều gì đúng?") — Decision Hierarchy trả lời thêm
một bước: ngay cả TRƯỚC khi hỏi "điều gì tốt nhất", Companion phải tự
hỏi nó đang bắt đầu suy nghĩ từ đâu.

## 5 tầng là gì, ánh xạ vào đâu trong code/doc đã có

| Tầng | Nghĩa là gì | Đã có ở đâu |
|---|---|---|
| **Con người** | Câu hỏi xuất phát luôn là về một người cụ thể, không phải một con số | `FourQuestionsReview.respectsHuman`/`helpsGrowth` (`moral-compass.ts`), Human Benefit (`HUMAN_BENEFIT_ORDER`) |
| **Nhân cách** | Quyết định phải phản ánh đúng phẩm chất Companion đang mang theo | `CHARACTER_PROFILE` 8 phẩm chất, `applyCharacterReview()` (`character-engine.ts`), `FourQuestionsReview.reflectsCharacter` |
| **Niềm tin** | Quyết định phải giữ được sự nhất quán/đáng tin theo thời gian | `FourQuestionsReview.wouldBeProudLater`, phẩm chất Integrity (`character-engine.ts`) |
| **Tri thức** | Nội dung/thông tin Companion có (Daily Thought, Knowledge, Story...) | Các Decision Candidate nội dung (`internal-voices.ts`, `daily-thought-library.ts`) |
| **Hiệu suất** | Thứ tự/tốc độ/độ chính xác kỹ thuật thuần | `MOMENT_PRIORITY_ORDER` cũ (`thought-governance.ts`, Sprint 18.6) — tầng THẤP NHẤT |

Lưu ý: 5 tầng này không phải 5 module mới — chúng là TÊN cho những gì
đã tồn tại rải rác ở Character Engine, Moral Compass, và các Decision
Candidate hiện có. Tài liệu này không tạo engine mới, không tạo điểm số
mới — nó đặt tên và thứ tự rõ ràng cho thứ đã có, đúng nguyên tắc "Không
over-engineer".

## Áp dụng thật — Thought Governance (`chooseCompanionMoment()`)

Đây là điểm code cụ thể nhất nơi Decision Hierarchy đã được áp dụng
thật, không chỉ là lý thuyết:

- **Trước**: `chooseCompanionMoment()` sắp xếp candidate theo
  `momentPriority()` — thuần tầng **Hiệu suất** (thứ tự kỹ thuật viết
  sẵn trong `MOMENT_PRIORITY_ORDER`).
- **Sau** (Sprint Moral Compass): sắp xếp theo `humanBenefitRank()` —
  tầng **Con người** — và tầng Con người thắng tầng Hiệu suất đúng thứ
  tự `DECISION_HIERARCHY`, không chỉ trong trường hợp đặc biệt.
- Ví dụ cụ thể: `"greeting"` (tôn trọng sự có mặt của một người — tầng
  Con người) được nói trước `"daily-thought"` (một suy nghĩ hay — tầng
  Tri thức), dù `MOMENT_PRIORITY_ORDER` cũ xếp ngược lại. Xem
  `docs/MORAL_COMPASS.md#verification` để biết chi tiết before/after.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md — Character > Capability
├── THE_DECISION_HIERARCHY.md (tài liệu này) — Con người → Nhân cách →
│                                  Niềm tin → Tri thức → Hiệu suất
├── docs/MORAL_COMPASS.md — cơ chế rule-based thực thi tầng Con người
│                            tại lớp Thought Governance
└── docs/CHARACTER_ENGINE.md — cơ chế rule-based thực thi tầng Nhân cách
                                tại lớp Internal Voices
```

Không tài liệu nào trong số trên bị thay thế. Decision Hierarchy là
LUẬT VỀ THỨ TỰ đứng trên cả Moral Compass và Character Engine — hai
tài liệu đó là CƠ CHẾ cụ thể thực thi luật này tại từng lớp quyết định
khác nhau.

Xem tiếp: `THE_COMPANION_FORMATION.md`,
`THE_CHARACTER_BEFORE_CAPABILITY_PRINCIPLE.md`, `docs/MORAL_COMPASS.md`,
`docs/CHARACTER_ENGINE.md`.
