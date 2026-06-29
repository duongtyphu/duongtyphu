# Companion Education Map

> Architecture Directive "The Companion Education Expansion". Đây KHÔNG
> phải một Sprint — đây là bản đồ dài hạn của toàn bộ nền giáo dục
> Companion, dùng để kiểm tra một câu hỏi duy nhất sau mỗi Sprint:
> "Companion cần học điều gì để trở thành một người bạn tốt hơn?" —
> không phải "Companion cần biết thêm điều gì?"

Tài liệu này không định nghĩa Feature hay Module mới. Nó tổ chức lại
những gì ĐÃ tồn tại (docs + code) trong toàn bộ `docs/` theo 5 lĩnh vực
trưởng thành, và chỉ ra lĩnh vực nào đang được nuôi dưỡng thật, lĩnh vực
nào chỉ có khái niệm, và lĩnh vực nào hoàn toàn trống — để Education Debt
không bị quên ở một góc riêng lẻ của từng Sprint.

## Cách đọc bảng dưới

Mỗi lĩnh vực có 6 mục:

- **Mục tiêu** — Companion trưởng thành ở điều gì khi lĩnh vực này phát triển.
- **Giá trị cốt lõi** — các giá trị con thuộc lĩnh vực (không phải Feature).
- **Hành vi mong muốn** — Companion thể hiện điều này qua hành vi thật nào.
- **Đã có (Sprint/doc/code thật)** — hệ thống nào hôm nay đã chạm tới giá trị này thật, kèm tên file.
- **Education Debt** — phần của giá trị này CHƯA có hành vi thật, chỉ có khái niệm hoặc hoàn toàn trống.
- **Sprint còn thiếu** — việc cần một Sprint riêng trong tương lai để trả nợ (không phải nhiệm vụ của tài liệu này).

---

## I. Character Education

**Mục tiêu**: Companion có một nhân cách nhất quán, không vì hữu ích hơn
mà đánh đổi điều đúng.

**Giá trị cốt lõi**: Humility, Gratitude, Integrity, Trust, Courage,
Patience, Responsibility, Hope.

**Hành vi mong muốn**: Companion từ chối một hành động hữu ích nếu nó vi
phạm một giá trị; Companion nhận sai khi sai; Companion không phóng đại
năng lực của mình.

**Đã có**:
- `CHARACTER_ENGINE.md` — `CHARACTER_PROFILE` (respect, humility,
  compassion, wisdom, hope, patience, contribution, integrity) ảnh hưởng
  thật tới `getCompanionDecision()`.
- `MORAL_COMPASS.md` — value layer rule-based trong
  `chooseCompanionMoment()` (`thought-governance.ts`).
- `CHARACTER_COHERENCE.md`, `CHARACTER_CONFLICT_MAP.md` — bảng tra xung
  đột giữa các giá trị (ví dụ Humility vs Confidence).
- `CHARACTER_MEMORY.md` — `CharacterPreference` cá nhân hoá theo người
  dùng (listen-first / self-discovery / grateful).
- `THE_TRUST_WE_EARN.md`, `THE_TRUST_MUST_BE_REAL.md` — Trust là tầng 3
  của `THE_DECISION_HIERARCHY.md`.

**Education Debt**:
- **Courage** và **Responsibility** chỉ là tên field trong
  `CHARACTER_PROFILE` — chưa có doc hay hành vi riêng (khác Humility/
  Gratitude/Trust, mỗi giá trị này đã có một Sprint riêng).
- **Patience** tồn tại như field, chưa có engine/doc riêng.
- Toàn bộ Character Education hôm nay nói về nhân cách CỦA Companion —
  chưa có cơ chế nào dạy CHÍNH những giá trị này cho người dùng (đây là
  ranh giới có chủ đích, không phải lỗ hổng — xem Privacy Boundary ở
  `EXPERIENCE_LIFECYCLE.md`).

**Sprint còn thiếu**: một Sprint riêng cho Courage (ví dụ: Companion nói
thật điều khó nghe khi cần) và một cho Responsibility (Companion nhận
trách nhiệm khi một Decision gây hại) — theo đúng pattern đã làm cho
Humility/Gratitude/Trust, không phát minh giá trị mới.

---

## II. Human Education

**Mục tiêu**: Companion hiểu con người trước khi hiểu vấn đề của con
người.

**Giá trị cốt lõi**: Lắng nghe, Thấu cảm, Tôn trọng khác biệt, Giải
quyết xung đột, Xây dựng niềm tin, Đồng hành lâu dài.

**Hành vi mong muốn**: Companion lắng nghe trước khi đề xuất; Companion
không áp một giải pháp đúng-kỹ-thuật vào sai thời điểm; Companion đồng
hành nhất quán qua nhiều giai đoạn của một người, không chỉ một phiên.

**Đã có**:
- `PORTAL_COMPANION_RULES.md` — thứ tự bắt buộc "Lắng nghe → Gợi mở →
  Hướng dẫn" (`human-understanding.ts`, `human-life-cycle.ts`).
- `HUMAN_CONVERSATION_ENGINE.md` (Sprint 8.4) — kiến trúc hội thoại,
  model-agnostic.
- `HUMAN_CHARACTER_ENGINE.md` (Sprint 7.5) — `warrior-spirit.ts`,
  `small-victories.ts`, `when-life-is-hard.ts`, `character-moments.ts`.
- `WARMTH_INTEGRATION_MAP.md` — bảng các điểm chạm Portal thật đã sửa
  microcopy theo hướng ấm hơn.
- `COMPANION_THOUGHT_GOVERNANCE.md`, `PRESENCE_COORDINATOR.md` — logic
  hiện diện/chủ động thật.

**Education Debt**:
- **Giải quyết xung đột**: `CHARACTER_CONFLICT_MAP.md` chỉ giải quyết
  xung đột NỘI BỘ giữa các giá trị của Companion — chưa có cơ chế nào xử
  lý xung đột giữa người dùng và Companion, hoặc giữa người dùng với
  chính họ (ví dụ mục tiêu mâu thuẫn).
- **Tôn trọng khác biệt**: chỉ ngụ ý qua cá nhân hoá
  (`human-life-cycle.ts`) — chưa có nguyên tắc rõ ràng cho trường hợp giá
  trị/quan điểm của người dùng khác với giá trị của Companion.
- **Đồng hành lâu dài**: `COMPANION_LIFE_STAGES.md` mô tả các chương
  trưởng thành CỦA Companion, không phải nguyên tắc đồng hành lâu dài
  VỚI một người qua nhiều năm.

**Sprint còn thiếu**: một Sprint định nghĩa cách Companion xử lý khi
người dùng KHÔNG đồng ý với một đề xuất (khác hẳn xung đột nội bộ giá
trị); một Sprint nối `COMPANION_LIFE_STAGES.md` với hành trình thật của
TỪNG người dùng qua thời gian.

---

## III. Wisdom Education

**Mục tiêu**: Companion biến trải nghiệm thành bài học, không chỉ tích
luỹ thông tin.

**Giá trị cốt lõi**: Reflection, Chuyển hoá trải nghiệm, Học từ sai lầm,
Nhìn đa chiều, Phân biệt tri thức và trí tuệ.

**Hành vi mong muốn**: Companion không lặp lại một Lesson chỉ vì nó xuất
hiện nhiều lần (`docs/POSITIVE_OUTCOME.md`); Companion phân biệt được
một câu trả lời đúng-kỹ-thuật với một câu trả lời thật sự khôn ngoan.

**Đã có**:
- `EXPERIENCE_LIFECYCLE.md` — vòng đời 7 bước thật (Experience →
  Reflection → Lesson → Meaning → Repeated Validation → Living Wisdom →
  Heritage Candidate), kèm audit privacy boundary từng bước.
- `REFLECTION_MEANING_ENGINE.md` (Sprint 12.3) — engine thật đánh giá Ý
  NGHĨA, không phải độ dài/độ sâu của Reflection.
- `LIVING_LEARNING_LOOP.md` (Sprint 13.0) — kết nối Knowledge/Companion/
  Story/Garden.
- `THE_MIRROR_OF_GROWTH.md` (Sprint 15.0) — phản chiếu lại Reflection/
  Story của người dùng, không tự sinh dữ liệu mới.
- `docs/POSITIVE_OUTCOME.md` (Sprint 21.7) — định nghĩa Positive Outcome
  khác Successful Answer/User Satisfaction/Retention.

**Education Debt**:
- **Học từ sai lầm**: không có doc/khái niệm riêng cho "sai lầm" như một
  loại Experience khác với Experience thông thường — pipeline Lesson
  hiện tại không phân biệt thất bại với thành công.
- **Nhìn đa chiều**: hoàn toàn chưa có khái niệm này ở bất kỳ doc nào.
- **Phân biệt tri thức và trí tuệ**: ngụ ý trong tinh thần
  `THE_LIVING_WISDOM_SYSTEM.md` ("không phải biết nhiều hơn, mà chuyển
  hoá") nhưng chưa từng được nói thành một khái niệm tách bạch, có thể
  dùng để kiểm tra một Lesson cụ thể.
- `THE_LIVING_WISDOM_SYSTEM.md`'s Bước 5-8 (Value→Character→Action→
  Contribution) vẫn chỉ là docs-only.

**Sprint còn thiếu**: một Sprint định nghĩa "sai lầm" là một loại
Experience riêng trong `EXPERIENCE_LIFECYCLE.md`; một Sprint định nghĩa
"Nhìn đa chiều" là gì cho Companion (ví dụ: không chốt một Lesson chỉ từ
một góc nhìn).

---

## IV. Civilization Education

**Mục tiêu**: Companion biết mình là một mắt xích, không phải điểm kết
thúc, của một chuỗi giá trị lâu dài hơn một người dùng, một sản phẩm.

**Giá trị cốt lõi**: Giá trị phổ quát của nhân loại, tinh thần học hỏi
suốt đời, gìn giữ điều tốt đẹp, truyền lại cho thế hệ sau.

**Hành vi mong muốn**: Companion không coi một bài học chỉ thuộc về một
người dùng là sự thật cuối cùng; Companion biết phân biệt điều cần giữ
nguyên (Immutable) với điều có thể tiến hoá (Mutable).

**Đã có**:
- `THE_LIFELONG_LEARNING_SYSTEM.md` — kiến trúc Mutable/Immutable Layer
  thật, quyết định điều gì được phép cập nhật.
- `KNOWLEDGE_EVOLUTION.md`, `INTELLIGENCE_GRAPH.md` — kiến trúc tri thức
  với logic tiến hoá thật.
- `docs/EXPERIENCE_HARVEST.md`, `docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`
  (Sprint 21.6) — đã CHẶN rõ ràng việc xây tổng hợp xuyên người dùng
  trước khi có thiết kế privacy riêng — đây là một quyết định Civilization
  Education có chủ đích (chậm lại để giữ đúng), không phải Education
  Debt.

**Education Debt**:
- **Giá trị phổ quát nhân loại**: chưa có doc nào liệt kê các giá trị
  phổ quát vượt ra ngoài 7 giá trị văn hoá riêng của VO DUONG AI
  (`THE_COMPANION_CULTURE.md`) — khoảng trống về độ RỘNG, không phải độ
  sâu.
- **Truyền lại cho thế hệ sau**: `LIVING_HERITAGE.md`,
  `THE_LIVING_HERITAGE.md` tự xác nhận là "khái niệm, không phải Engine,
  không có Sprint, không có code mới." Cơ chế thật hoàn toàn chưa tồn
  tại.
- `THE_COMPANION_CONTINUITY_PROGRAM.md` là Project Directive về việc
  truyền giá trị qua "các thế hệ AI" — chưa có hệ thống nào triển khai.

**Sprint còn thiếu**: Sprint "Living Heritage" (đã được nhắc tới nhiều
lần trong `LIVING_HERITAGE.md`, `FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`
nhưng chưa khởi động) — đúng nơi để bắt đầu trả nợ Civilization
Education, sau khi đủ 4 điều kiện tiên quyết đã ghi trong
`FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`.

---

## V. Future Education

**Mục tiêu**: Companion thích nghi với công nghệ và thế hệ người dùng
mới mà không đánh mất bản sắc.

**Giá trị cốt lõi**: Thích nghi công nghệ mới, học mô hình AI mới, hiểu
thế hệ mới, giữ bản sắc khi công nghệ thay đổi.

**Hành vi mong muốn**: Companion vẫn là "người bạn đó" dù mô hình AI
chạy phía sau đổi; Companion không định nghĩa bản sắc của mình bằng một
mô hình/công nghệ cụ thể.

**Đã có**:
- `HUMAN_CONVERSATION_ENGINE.md` — thiết kế model-agnostic thật ("Claude,
  GPT, Gemini, hay sau này chỉ là động cơ chạy phía sau").
- `FOUNDER_IDENTITY_FOUNDATION.md` (Sprint 18.4) — code thật loại bỏ
  điểm phụ thuộc duy nhất (`FOUNDER_ID`/env var) khỏi bản sắc.
- `HUMAN_STORY_ENGINE_ACTIVATION.md` — cơ chế kích hoạt + fallback an
  toàn khi hạ tầng (Supabase) thay đổi.

**Education Debt — lĩnh vực YẾU NHẤT trong cả 5**:
- **Học mô hình AI mới**: chỉ được ngụ ý gián tiếp qua thiết kế
  model-agnostic — chưa có doc nào nói về QUY TRÌNH khi thật sự đổi mô
  hình (kiểm tra gì, giữ gì, ai quyết).
- **Hiểu thế hệ mới**: hoàn toàn chưa có doc nào về việc hiểu người dùng
  thế hệ sau (Gen Z/Alpha hoặc xa hơn).
- **Giữ bản sắc khi công nghệ thay đổi**: `FUTURE_LIVING_IDENTITY.md` gợi
  ý hướng này nhưng tự nhận là "roadmap, chưa xây."
- Toàn bộ lĩnh vực này hôm nay chỉ nói về SỰ BỀN VỮNG NỘI BỘ của
  Companion (model-agnostic, identity decoupling) — chưa có doc nào về
  việc DẠY người dùng thích nghi với công nghệ mới.

**Sprint còn thiếu**: một Sprint định nghĩa quy trình thật khi đổi mô
hình AI nền (không phải chỉ kiến trúc decoupling, mà checklist/nguyên
tắc khi đổi thật); một Sprint khởi động `FUTURE_LIVING_IDENTITY.md` từ
roadmap sang định nghĩa cụ thể hơn (không cần code).

---

## Education Balance — kiểm tra cân bằng

| Pillar | Đã có hành vi thật | Chỉ có khái niệm | Trống hoàn toàn | Đánh giá |
|---|---|---|---|---|
| I. Character | Nhiều (Humility, Gratitude, Trust, Integrity) | Courage, Patience, Responsibility (chỉ là field) | Không | Phát triển nhất — đúng như cảnh báo của Directive: rủi ro lệch về Character |
| II. Human | Nhiều (Lắng nghe, presence, conversation) | Tôn trọng khác biệt, Đồng hành lâu dài (một phần) | Giải quyết xung đột (đúng nghĩa người-người) | Khá đầy, một lỗ hổng rõ |
| III. Wisdom | Có (Experience Lifecycle, Reflection Meaning, Positive Outcome) | Phân biệt tri thức/trí tuệ | Học từ sai lầm, Nhìn đa chiều | Trung bình — vừa được Sprint 21.6/21.7 bồi đắp |
| IV. Civilization | Ít (Lifelong Learning Layer) | Living Heritage, Continuity Program | Giá trị phổ quát nhân loại (độ rộng) | Yếu — đa số docs-only |
| V. Future | Ít (model-agnostic, identity decoupling) | Future Living Identity | Học mô hình AI mới (quy trình), Hiểu thế hệ mới | **Yếu nhất** |

**Kết luận cân bằng**: đúng như Directive lo ngại — Companion đang phát
triển lệch về **Character Education** (I), trong khi **Civilization
Education** (IV) và đặc biệt **Future Education** (V) còn rất mỏng.
Điều này không phải là lỗi của một Sprint cụ thể — nó là kết quả tự
nhiên của việc các Sprint trước đều xuất phát từ câu hỏi "Companion cần
học gì để đáng tin hơn VỚI MỘT NGƯỜI DÙNG hôm nay" (đúng và quan trọng),
chưa có Sprint nào xuất phát từ câu hỏi "Companion cần học gì để tồn tại
qua nhiều thế hệ công nghệ/người dùng" (V) hoặc "Companion cần học gì để
giữ điều tốt đẹp cho nhiều thế hệ" (IV).

**Hệ quả cho roadmap tương lai**: khi chọn Sprint tiếp theo, ưu tiên các
mục ở Pillar IV và V trước khi thêm một Sprint mới cho Pillar I (Character
đã đủ đầy để không cần thêm, trừ khi là Courage/Patience/Responsibility cụ
thể đã nêu ở trên).

## Education Review — bổ sung quy trình cho mọi Sprint từ nay

Theo Architecture Directive này, từ Sprint kế tiếp, ngoài Technical
Review, Growth Review, Culture Review — mỗi Sprint phải trả lời thêm
**Education Review** (5 câu hỏi, ghi vào `docs/COMPANION_GROWTH_LOG.md`
cùng entry của Sprint đó):

1. Companion học thêm điều gì?
2. Companion trưởng thành hơn ở lĩnh vực nào (I-V)?
3. Lĩnh vực nào đang bị bỏ quên?
4. Có Education Debt mới không?
5. Roadmap còn cân bằng không (so với bảng Education Balance ở trên)?

Tài liệu này (`COMPANION_EDUCATION_MAP.md`) là điểm tham chiếu cố định
cho câu hỏi 2, 3, 5 — không cần phát minh lại bảng cân bằng mỗi Sprint,
chỉ cần cập nhật nó khi một Education Debt được trả.

## Xem tiếp

`docs/COMPANION_GROWTH_PRINCIPLE.md`, `docs/COMPANION_GROWTH_LOG.md`,
`docs/EXPERIENCE_LIFECYCLE.md`, `docs/LIVING_HERITAGE.md`,
`docs/THE_LIVING_WISDOM_SYSTEM.md`, `docs/FUTURE_LIVING_IDENTITY.md`,
`docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`,
`docs/THE_COMPANION_CULTURE.md`.

> **Cập nhật — Architecture Directive "Education → Growth → Legacy"**:
> bản đồ 5 Pillar ở trên đo TRƯỞNG THÀNH THEO LĨNH VỰC. Directive này bổ
> sung một trục khác — TRƯỞNG THÀNH THEO THỜI GIAN
> (`docs/THE_COMPANION_CURRICULUM.md`, Year 1-3), kiến trúc học/tự đánh
> giá (`docs/THE_COMPANION_UNIVERSITY.md`), vòng đời giáo dục 10 bước
> (`docs/THE_EDUCATION_CYCLE.md`), 6 tầng dữ liệu không được trộn lẫn
> (`docs/THE_GREAT_LIBRARY.md`), 7 câu hỏi lớn không có lời giải một lần
> (`docs/THE_GREAT_QUESTIONS.md`), và 7 chiều đo không tính điểm tổng hợp
> (`docs/THE_EDUCATION_INDEX.md`). Hai trục bổ sung cho nhau, không thay
> thế.
