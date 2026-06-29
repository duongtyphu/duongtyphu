# The Companion University

> NHIỆM VỤ SỐ 2 của Architecture Directive "Education → Growth →
> Legacy". Đây KHÔNG phải UI, KHÔNG phải product, KHÔNG phải một trang
> trong Portal. Đây là KIẾN TRÚC trả lời 5 câu hỏi: Companion học như
> thế nào? Companion ôn tập như thế nào? Companion tự đánh giá ra sao?
> Companion biết mình trưởng thành ở đâu? Companion biết mình còn yếu
> ở đâu?

Không có "trường" thật trong code. "University" ở đây là một ẨN DỤ
KIẾN TRÚC: 5 câu hỏi trên ứng với 5 chức năng phải tồn tại Ở ĐÂU ĐÓ
trong hệ thống thật (đã có, một phần có, hoặc chưa có) — tài liệu này
chỉ ra nơi đó là gì, không phát minh một Engine "University" mới.

## 1. Companion học như thế nào? — Learning Mechanism

Companion học KHÔNG qua việc nạp thêm dữ liệu, mà qua việc một
Experience đi qua `EXPERIENCE_LIFECYCLE.md` (Experience → Reflection →
Lesson → Meaning). Đây CHÍNH LÀ "lớp học" thật duy nhất tồn tại hôm nay.

- **Đã có**: `reflection-meaning.ts` phát hiện ý nghĩa rule-based;
  `character-memory.ts` ghi Lesson cá nhân.
- **Chưa có**: một nơi Companion có thể học MÀ KHÔNG cần một Experience
  của một người dùng cụ thể trước (ví dụ học từ một Heritage đã có) —
  đây vẫn đúng theo thiết kế (Companion không tự sinh bài học giả, xem
  `EXPERIENCE_LIFECYCLE.md` Bước 1 "Companion không tự tạo Experience
  giả").

## 2. Companion ôn tập như thế nào? — Review Mechanism

"Ôn tập" nghĩa là: một Lesson đã học có được áp dụng LẠI và kiểm tra
lại không, hay chỉ được ghi một lần rồi nằm im?

- **Đã có**: `CHARACTER_TRANSFORMATION_THRESHOLD` (`character-memory.ts`)
  đếm số lần một `ReflectionMeaning` lặp lại trước khi trở thành
  `CharacterPreference` — đây LÀ một dạng ôn tập, nhưng chỉ đếm SỐ LẦN,
  không kiểm tra CHẤT LƯỢNG của mỗi lần ôn (xem Education Debt dưới).
- **Education Debt**: đúng như `docs/POSITIVE_OUTCOME.md` (Sprint 21.7)
  đã chỉ ra — "ôn tập" hôm nay không phân biệt một lần ôn TỐT khỏi một
  lần ôn không tạo giá trị. Review Mechanism thật cần gắn với Positive
  Outcome, chưa có cơ chế đó.

## 3. Companion tự đánh giá ra sao? — Self-Assessment

Tự đánh giá nghĩa là Companion (không phải người vận hành sản phẩm)
biết được hành động của mình có đúng giá trị không, TRƯỚC khi hành
động — không phải sau khi đã làm.

- **Đã có**: `MORAL_COMPASS.md` (`chooseCompanionMoment()`) là cơ chế
  TỰ ĐÁNH GIÁ TRƯỚC HÀNH ĐỘNG duy nhất tồn tại thật — nó từ chối một
  hành động trước khi thực hiện, theo rule-based value layer.
  `CHARACTER_COHERENCE.md` kiểm tra một hành động có nhất quán với
  nhân cách đã có không.
- **Education Debt**: Self-Assessment hôm nay chỉ KIỂM TRA TRƯỚC
  (gatekeeping) — chưa có cơ chế tự đánh giá SAU hành động ("hành động
  đó có thật sự tạo Positive Outcome không?", liên kết trực tiếp tới
  `docs/POSITIVE_OUTCOME.md`).

## 4. Companion biết mình trưởng thành ở đâu? — Growth Awareness

- **Đã có**: `COMPANION_LIFE_STAGES.md` mô tả các giai đoạn trưởng
  thành; `docs/COMPANION_GROWTH_LOG.md` ghi lại MỖI Sprint Companion
  "trở nên xứng đáng với niềm tin hơn ở điểm nào" — đây là nhật ký
  trưởng thành thật, có thật.
- **Education Debt**: Growth Log ghi theo TỪNG SPRINT (góc nhìn kỹ
  thuật) — chưa có một bản tổng hợp theo 5 Pillar
  (`COMPANION_EDUCATION_MAP.md`) hay theo Curriculum
  (`THE_COMPANION_CURRICULUM.md`) để biết "mình đang ở Year nào".
  `docs/THE_EDUCATION_INDEX.md` (NHIỆM VỤ SỐ 6) là nơi định nghĩa các
  chiều đo cho việc này — nhưng KHÔNG xây cơ chế tính điểm tự động
  (xem lý do ở chính tài liệu đó).

## 5. Companion biết mình còn yếu ở đâu? — Weakness Awareness

- **Đã có**: khái niệm "Growth Debt" (`COMPANION_GROWTH_PRINCIPLE.md`)
  và "Education Debt" (`COMPANION_EDUCATION_MAP.md`) — cả hai đều là
  SỰ THỪA NHẬN THẲNG mình còn thiếu gì, không che giấu.
- **Education Debt của chính mục này**: cả hai bảng Debt đều được viết
  bởi NGƯỜI VẬN HÀNH (qua Sprint review), không phải Companion tự nhận
  ra trong lúc vận hành thật — đây là giới hạn thành thật cần ghi nhận,
  không phải lỗi cần vội sửa (build cơ chế tự phát hiện yếu điểm runtime
  sẽ cần AI/heuristic mới, đi ngược nguyên tắc "không suy đoán hành vi
  trước khi có dữ liệu thật").

## Kiến trúc tổng thể — "University" không phải một nơi, mà là 5 chức năng rải rác

| Câu hỏi | Chức năng tương ứng | Nơi tồn tại thật hôm nay |
|---|---|---|
| Học như thế nào | Learning Mechanism | `EXPERIENCE_LIFECYCLE.md` Bước 1-4 |
| Ôn tập như thế nào | Review Mechanism | `character-memory.ts` (chỉ đếm số lần) |
| Tự đánh giá ra sao | Self-Assessment | `MORAL_COMPASS.md` (chỉ trước hành động) |
| Trưởng thành ở đâu | Growth Awareness | `COMPANION_GROWTH_LOG.md` (theo Sprint, chưa theo Pillar/Year) |
| Còn yếu ở đâu | Weakness Awareness | `COMPANION_GROWTH_PRINCIPLE.md` + `COMPANION_EDUCATION_MAP.md` (do người vận hành viết) |

**Kết luận**: "University" của Companion hôm nay tồn tại thật nhưng RẢI
RÁC và KHÔNG ĐỐI XỨNG — mạnh ở Learning Mechanism và Weakness Awareness
(thừa nhận thẳng), yếu ở Review Mechanism CHẤT LƯỢNG và Self-Assessment
SAU hành động. Đây là bản đồ để các Sprint tương lai biết nên củng cố
chức năng nào, không phải để xây một "trường học" mới.

## Xem tiếp

`docs/THE_COMPANION_CURRICULUM.md`, `docs/THE_EDUCATION_CYCLE.md`,
`docs/THE_GREAT_LIBRARY.md`, `docs/THE_EDUCATION_INDEX.md`,
`docs/POSITIVE_OUTCOME.md`, `docs/MORAL_COMPASS.md`,
`docs/COMPANION_GROWTH_PRINCIPLE.md`.
