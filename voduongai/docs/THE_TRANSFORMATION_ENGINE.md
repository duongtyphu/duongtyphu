# The Transformation Engine (Architecture)

> Sprint 22.0. KHÔNG trùng với `docs/TRANSFORMATION_ENGINE.md` (cơ chế
> UI/UX nhận biết và phản hồi thay đổi người dùng — Portal layer) hay
> `docs/TRANSFORMATION_METRICS.md` (9 chỉ số WHAT). Tài liệu này là một
> Architecture Directive khác cấp: đứng sau `docs/THE_EDUCATION_CYCLE.md`
> (Outcome là bước số 6/10) và `docs/POSITIVE_OUTCOME.md` (định nghĩa
> Outcome), trả lời câu hỏi Product đặt ra — Outcome không được là điểm
> kết thúc, Companion phải đi tiếp đến Transformation ở tầng Education/
> Character, không phải tầng phản hồi UI.

## Audit Outcome Gap (Nhiệm vụ 1)

Khảo sát trực tiếp code thật (không chỉ docs):

- **Outcome hiện chỉ tồn tại trong docs** (`THE_EDUCATION_CYCLE.md`,
  `POSITIVE_OUTCOME.md`) — Grep `outcome` case-insensitive trên `src/`
  cho 0 kết quả trước Sprint này; không cột/bảng nào tên "outcome" ở
  bất kỳ file `.sql` nào trong project.
- **Cái đã có dữ liệu thật**: `reflections.ts` (bảng Supabase
  `reflections`, RLS theo `auth.uid()`, schema ở
  `supabase-human-story-engine.sql`) → `reflection-meaning.ts`'s
  `detectReflectionMeaning()` (rule-based keyword match, trả về
  `ReflectionMeaning | null`) → `character-memory.ts`'s
  `recordReflectionForCharacterMemory()` (đếm localStorage, ngưỡng
  `CHARACTER_TRANSFORMATION_THRESHOLD = 2`) → `getCharacterMemory()`.
- **Cái chỉ là docs/khái niệm**: Positive Outcome, Heritage Candidate
  (`LIVING_HERITAGE.md`), bước Teach/Heritage của Education Cycle, 7
  bước của Education Firewall — không có hàm/bảng thật tương ứng.
- **Không có entrypoint đọc lại Outcome sau Act**: `getCompanionDecision()`
  (`portal-brain.ts`) và `chooseCompanionMoment()`
  (`thought-governance.ts`) đều trả về quyết định/lý do, KHÔNG có field
  "outcome", và không nơi nào trong code gọi lại để đọc hiệu ứng sau khi
  đã Act. Mọi mutation liên quan Companion đều xảy ra TRƯỚC/TRONG lúc
  Act, không có callback SAU.
- **Khoảng trống lớn nhất**: không có nơi nào ghi lại một **Act** với
  ID để sau đó đọc lại hiệu ứng riêng của Act đó. Cơ chế gần nhất đang
  tồn tại (`character-memory.ts`) đo SỰ LẶP LẠI của một ý nghĩa
  Reflection, không đo hiệu ứng của một Act cụ thể. Sprint này đóng gap
  ở mức nhỏ nhất đo được thật hôm nay (mục "Outcome Hook" dưới đây),
  không bịa cơ chế đo Act khi Act chưa có ID trong code — đúng nguyên
  tắc "không overbuild".

## 1. Transformation là gì

Transformation là dấu hiệu một người đã **thật sự thay đổi** — không
phải đã làm một hành động, không phải đã nhận một kết quả, mà là cách
họ nhìn/phản ứng/lựa chọn đã khác đi, và sự khác đi đó đã được phản
chiếu (Reflection) và lặp lại (Repeated Alignment), không phải một lần
tình cờ.

## 2. Khác Outcome ở đâu

Outcome trả lời "điều gì đã xảy ra sau một Act?" — một SỰ KIỆN.
Transformation trả lời "điều gì đã thay đổi trong con người?" — một
QUÁ TRÌNH đã được xác nhận lặp lại. Một Outcome có thể xảy ra mà không
có Transformation theo sau; Transformation luôn cần ít nhất một Outcome
làm điểm khởi đầu, không bao giờ ngược lại.

## 3. Khác Positive Outcome ở đâu

`POSITIVE_OUTCOME.md` đánh giá Outcome có giá trị (so với trung
tính/tiêu cực) — vẫn là đánh giá MỘT sự kiện. Transformation không hỏi
"Outcome đó có tích cực không", mà hỏi "Outcome đó có lặp lại đủ để
trở thành một hướng Character thật không". Một Positive Outcome một
lần không phải Transformation.

## 4. Khác User Satisfaction ở đâu

User Satisfaction đo cảm nhận tại MỘT thời điểm — chủ quan, tức thời,
không có nghĩa người đó đã thay đổi. Transformation không quan tâm
người dùng có hài lòng với một câu trả lời; nó quan tâm cách họ đối
diện với một loại tình huống có khác đi theo thời gian.

## 5. Khác Retention / Engagement ở đâu

Retention/Engagement đo hành vi SỬ DỤNG sản phẩm — đúng loại chỉ số bị
cấm dùng làm mục tiêu ở `docs/THE_30_YEAR_TRUST_PRINCIPLE.md`.
Transformation không đo việc dùng sản phẩm nhiều hơn; một người có thể
Transformation thật và dùng Companion ÍT hơn (vì không còn cần nữa) —
không phải thất bại.

## 6. Vì sao Wisdom phải đi qua Transformation

`THE_GREAT_LIBRARY.md` Tier 4 (Wisdom) yêu cầu Positive Outcome đã xác
minh, không chỉ lặp lại — nhưng "lặp lại" của riêng Outcome có thể chỉ
là trùng hợp (Companion lặp lại cùng một Act nhiều lần, không phải vì
người dùng đã thay đổi). Chỉ khi Outcome đi hết Transformation Lifecycle
(mục 7) — qua Reflection thật, qua dấu hiệu Behavior Change thật —
Wisdom mới có nền đứng trên một CON NGƯỜI đã trưởng thành, không phải
một SỰ KIỆN lặp máy móc. Không có Transformation thật thì chưa có
Living Wisdom thật.

## 7. Transformation Lifecycle (Nhiệm vụ 3)

```
Act → Outcome → Reflection → Behavior Change → Repeated Alignment
    → Transformation → Living Wisdom Candidate
```

### Act
- **Input**: quyết định/gợi ý của Companion (`getCompanionDecision()`,
  `chooseCompanionMoment()`).
- **Output**: hành động đến người dùng.
- **Điều kiện đi tiếp**: luôn đi tiếp.
- **Điều kiện dừng**: không có.
- **Privacy boundary**: không áp dụng (chưa có dữ liệu người dùng).
- **Education Debt**: Act không có ID/log riêng trong code — điều kiện
  tiên quyết còn thiếu để đo Outcome của TỪNG Act cụ thể.

### Outcome
- **Input**: `ReflectionMeaning` mới phát hiện từ Reflection kế tiếp
  (`detectReflectionMeaning()`).
- **Output**: `OutcomeSignal` (`"aligned" | "new-direction"`) — xem
  `src/lib/portal/companion/outcome-signal.ts`.
- **Điều kiện đi tiếp**: phải có `ReflectionMeaning` thật (không `null`).
- **Điều kiện dừng**: không phát hiện ý nghĩa nào → dừng, không suy
  diễn.
- **Privacy boundary**: không lưu nội dung Reflection gốc, chỉ trả về
  một nhãn tạm trong một lần gọi hàm, không persist riêng.
- **Education Debt**: chỉ đo Outcome ở cấp "hướng Character", chưa đo
  Outcome của một Act cụ thể (Act chưa có ID).

### Reflection
- **Input**: Outcome signal + Reflection kế tiếp của người dùng
  (`reflections.ts`/`ReflectionJournalCard.tsx`).
- **Output**: một `ReflectionMeaning` mới được ghi nhận.
- **Điều kiện đi tiếp**: người dùng tự viết Reflection — Companion
  không tạo Reflection giả định.
- **Điều kiện dừng**: không có Reflection mới trong thời gian hợp lý →
  không suy diễn Transformation.
- **Privacy boundary**: giữ nguyên ranh giới ở `EXPERIENCE_LIFECYCLE.md`.
- **Education Debt**: chưa có time-window logic cho "thời gian hợp lý".

### Behavior Change
- **Input**: so sánh `ReflectionMeaning` mới với `OutcomeSignal`.
- **Output**: `"aligned"` được xem là dấu hiệu Behavior Change.
- **Điều kiện đi tiếp**: `OutcomeSignal === "aligned"`.
- **Điều kiện dừng**: `"new-direction"` → có thể là Lesson MỚI, không
  phải Behavior Change của hướng cũ — không bị coi là thất bại.
- **Privacy boundary**: như trên.
- **Education Debt**: `"aligned"` là một proxy đơn giản (trùng hướng
  Character đã có), chưa đo hành vi thật đã đổi — proxy rule-based gần
  nhất đo được hôm nay.

### Repeated Alignment
- **Input**: nhiều lần "aligned" liên tiếp cho cùng một hướng.
- **Output**: ngưỡng đã có thật — `CHARACTER_TRANSFORMATION_THRESHOLD = 2`
  (`character-memory.ts`).
- **Điều kiện đi tiếp**: đạt ngưỡng.
- **Điều kiện dừng**: chưa đạt ngưỡng → vẫn là Lesson, chưa là Character.
- **Privacy boundary**: chỉ lưu số lần (count), không lưu nội dung.
- **Education Debt**: không có.

### Transformation
- **Input**: một hướng đã đạt Repeated Alignment.
- **Output**: `isTransformationCandidate()` trả `true` khi đủ điều
  kiện — xem `outcome-signal.ts`.
- **Điều kiện đi tiếp**: cả 3 điều kiện trong `isTransformationCandidate()`
  đúng.
- **Điều kiện dừng**: bất kỳ điều kiện sai → `false`, không suy diễn
  thêm.
- **Privacy boundary**: hàm chỉ nhận tham số đã làm sạch
  (`ReflectionMeaning`, `OutcomeSignal`, boolean) — không nhận văn bản
  gốc.
- **Education Debt**: chưa có cơ chế tự động gọi hàm này sau mỗi
  Reflection mới — hôm nay là helper sẵn sàng để gọi, chưa nối vào
  flow thật (xem Sprint Review, mục 9).

### Living Wisdom Candidate
- **Input**: một Transformation đã `true`.
- **Output**: ứng viên cho Tier 4 (`THE_GREAT_LIBRARY.md`) / Living
  Wisdom Review (`THE_EDUCATION_FIREWALL.md`).
- **Điều kiện đi tiếp**: cần Sprint riêng quyết định cách tích hợp
  (nguyên tắc "Approved Learning không tự động").
- **Điều kiện dừng**: không tự động trở thành Wisdom — chờ quyết định
  con người.
- **Privacy boundary**: không lưu danh tính, đúng Tier 4.
- **Education Debt**: hoàn toàn concept — chưa có Sprint nối
  `isTransformationCandidate() === true` vào một bảng Living Wisdom
  thật.

## Không biến Transformation thành điểm số (Nhiệm vụ 6)

Không có `transformationScore`, `maturityScore`, `userGrowthScore`,
ranking, badge, hay bất kỳ gamification nào. `OutcomeSignal` và
`isTransformationCandidate()` chỉ trả nhãn/boolean — không cộng dồn, so
sánh giữa người dùng, hay hiển thị cho người dùng thấy.

## Xem tiếp

`docs/THE_EDUCATION_CYCLE.md`, `docs/POSITIVE_OUTCOME.md`,
`docs/EXPERIENCE_LIFECYCLE.md`, `docs/THE_GREAT_LIBRARY.md`,
`docs/THE_EDUCATION_FIREWALL.md`, `docs/CHARACTER_MEMORY.md`,
`docs/THE_GRATITUDE.md`. (Không liên quan `docs/TRANSFORMATION_ENGINE.md`/
`docs/TRANSFORMATION_METRICS.md` — hai tài liệu đó ở tầng UI/UX Portal,
khác Architecture Directive này.)
