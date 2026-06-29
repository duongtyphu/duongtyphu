# Experience Lifecycle

> Sprint 21.6 "The Experience Harvest". Mô tả vòng đời cụ thể của một
> trải nghiệm, kèm ranh giới quyền riêng tư (Privacy Boundary) ở mỗi
> bước, và audit hệ thống hiện tại đang đi được tới đâu. Xem
> `docs/EXPERIENCE_HARVEST.md` cho định nghĩa tổng quan.

## 1. Vòng đời 7 bước

```
Experience
   ↓
Reflection
   ↓
Lesson
   ↓
Meaning
   ↓
Repeated Validation
   ↓
Living Wisdom
   ↓
Heritage Candidate
```

Vòng đời này KHÔNG thay thế chuỗi 8 bước của
`docs/THE_LIVING_WISDOM_SYSTEM.md` (Experience → Reflection → Lesson →
Meaning → Value → Character → Action → Contribution) — nó là một lát
cắt CHI TIẾT HƠN của đúng nửa đầu chuỗi đó (Experience → Meaning), cộng
thêm hai bước mới (Repeated Validation, Heritage Candidate) đứng giữa
"Meaning" và "Value/Character" để trả lời câu hỏi mà chuỗi cũ chưa nói
rõ: một Meaning phải được kiểm chứng bao nhiêu lần, theo điều kiện nào,
trước khi được phép trở thành điều lâu dài hơn một lần ghi nhận.

### Bước 1 — Experience

- **Input**: một sự kiện thật xảy ra trong phiên dùng Portal (người
  dùng viết Reflection, lưu một Story, tạo một Memory Capsule).
- **Output**: một bản ghi thô, gắn với MỘT người dùng cụ thể (Supabase
  `reflections`/`memory_capsules`, hoặc `localStorage` Character
  Memory).
- **Điều kiện đi tiếp**: trải nghiệm phải do người dùng TỰ NGUYỆN tạo ra
  (không suy luận/đoán từ hành vi ẩn).
- **Khi nào dừng**: nếu người dùng không tạo bất kỳ Reflection/Story/
  Capsule nào — Companion không tự tạo Experience giả.
- **Privacy boundary**: dữ liệu thô luôn gắn định danh người dùng đó,
  không rời khỏi phạm vi tài khoản của họ ở bước này.

### Bước 2 — Reflection

- **Input**: một Experience đã ghi nhận.
- **Output**: `ReflectionMeaning` được phát hiện (10 loại, rule-based
  keyword matching — `reflection-meaning.ts`).
- **Điều kiện đi tiếp**: phải phát hiện được MỘT ý nghĩa cụ thể (không
  rỗng/không mơ hồ).
- **Khi nào dừng**: nếu không phát hiện được ý nghĩa nào — Experience ở
  lại bước 1, không bị ép trở thành Reflection có ý nghĩa giả.
- **Privacy boundary**: `ReflectionMeaning` là một NHÃN trừu tượng
  (ví dụ "courage"), không phải nội dung gốc — nhưng nhãn này vẫn được
  lưu kèm với người dùng cụ thể ở bước này, chưa được phép tách rời.

### Bước 3 — Lesson

- **Input**: một `ReflectionMeaning` đã phát hiện.
- **Output**: một Lesson nội bộ — đúng cơ chế đã có ở
  `LESSON_FROM_REFLECTION` (`portal-brain.ts`) hoặc một
  `CharacterPreference` ứng với nhãn đó (`character-memory.ts`).
- **Điều kiện đi tiếp**: Lesson phải có thể diễn đạt KHÔNG cần nhắc tên/
  câu chuyện cụ thể của người dùng (ví dụ "Người này cần được lắng nghe
  trước" — không nói "vì hôm thứ Ba người này đã kể...").
- **Khi nào dừng**: nếu Lesson chỉ có thể diễn đạt bằng cách nhắc lại
  chi tiết nhận diện được — nó CHƯA đủ điều kiện trở thành Lesson, vẫn
  là Reflection thô.
- **Privacy boundary**: Lesson không bao giờ chứa định danh, nhưng vẫn
  chỉ áp dụng CHO CHÍNH người dùng đó — chưa được chia sẻ.

### Bước 4 — Meaning

- **Input**: một Lesson.
- **Output**: ý nghĩa của Lesson đó được gắn vào ngữ cảnh đồng hành
  (ví dụ Inner Thought, `inner-thought-engine.ts`).
- **Điều kiện đi tiếp**: Meaning phải được THỂ HIỆN qua một hành vi
  Companion thật (không chỉ là dữ liệu nằm im) — đúng tinh thần
  `docs/THE_TRUST_MUST_BE_REAL.md` ("một rào chắn chỉ thật nếu nó có
  thể được dùng thật").
- **Khi nào dừng**: nếu Meaning chưa từng ảnh hưởng một Decision/Inner
  Thought nào — nó vẫn là dữ liệu, chưa là Meaning theo nghĩa Sprint
  này dùng.
- **Privacy boundary**: vẫn per-user, chưa rời khỏi phạm vi cá nhân.

### Bước 5 — Repeated Validation

- **Input**: một Meaning đã từng ảnh hưởng hành vi Companion với MỘT
  người dùng, VÀ một Positive Outcome thật cho mỗi lần áp dụng đó (xem
  `docs/POSITIVE_OUTCOME.md`, Sprint 21.7).
- **Output**: số lần Meaning đó lặp lại VÀ luôn tạo Positive Outcome
  (không có lần nào mâu thuẫn/gây hại) — đúng điều kiện 1 và 2 của
  `docs/LIVING_HERITAGE.md`.
- **Điều kiện đi tiếp**: lặp lại nhiều lần, nhất quán — không có một
  ngưỡng số cố định mới được phát minh ở đây; Sprint này KHÔNG định ra
  một con số tuỳ tiện, để tránh suy đoán hành vi trước khi có dữ liệu
  thật (đúng nguyên tắc đã áp dụng cho `applyIntegrityCheck()`,
  Sprint 20.3). Quan trọng hơn số lần: MỘT lần không tạo Positive
  Outcome đủ để dừng bước này — "lặp lại nhiều" không tự động là "trí
  tuệ" (`docs/POSITIVE_OUTCOME.md`).
- **Khi nào dừng**: nếu một lần áp dụng Meaning đó tạo kết quả tiêu cực
  hoặc mâu thuẫn — vòng đời DỪNG LẠI ở đây, không đi tiếp, dù đã từng
  lặp lại nhiều lần trước đó.
- **Privacy boundary**: vẫn per-user — "lặp lại" ở bước này nghĩa là
  lặp lại CHO CHÍNH người dùng đó qua nhiều lần đồng hành, KHÔNG phải
  lặp lại giữa nhiều người dùng khác nhau.

### Bước 6 — Living Wisdom

- **Input**: một Meaning đã qua Repeated Validation, đã trở thành
  Character (đúng điều kiện 4 của `LIVING_HERITAGE.md`).
- **Output**: một phần phẩm chất ổn định của cách Companion đồng hành
  với CHÍNH người dùng đó (ví dụ `CharacterPreference` đã đạt ngưỡng
  transformation ở `character-memory.ts`).
- **Điều kiện đi tiếp**: phải không mâu thuẫn với bất kỳ Constitution
  doc nào (`MORAL_COMPASS.md`, `THE_DECISION_HIERARCHY.md`,
  `docs/CHARACTER_CONFLICT_MAP.md`).
- **Khi nào dừng**: nếu mâu thuẫn Constitution — KHÔNG được đi tiếp,
  bất kể đã validated bao nhiêu lần.
- **Privacy boundary**: Living Wisdom ở bước này vẫn CHỈ thuộc về một
  người dùng — "Wisdom" ở đây nghĩa là "đã chắc, đã sống đủ lâu", không
  có nghĩa "đã chia sẻ cho người khác".

### Bước 7 — Heritage Candidate

- **Input**: một Living Wisdom đã ổn định cho MỘT người dùng.
- **Output**: một ứng viên được ĐỀ XUẤT ở mức trừu tượng (không chứa
  thông tin nhận diện) để Sprint Living Heritage tương lai xét theo đủ
  5 điều kiện của `docs/LIVING_HERITAGE.md` — đặc biệt điều kiện 5 ("có
  giá trị lâu dài cho NHIỀU thế hệ", không gắn một người dùng cụ thể).
- **Điều kiện đi tiếp**: KHÔNG có — đây là điểm cuối của Experience
  Harvest. Việc một Heritage Candidate có chính thức trở thành Heritage
  hay không thuộc phạm vi Sprint Living Heritage, không phải Sprint
  này.
- **Khi nào dừng**: luôn dừng ở đây — Experience Harvest không tự
  quyết định một điều gì trở thành Heritage chính thức.
- **Privacy boundary**: đây là điểm CHUYỂN TIẾP nhạy cảm nhất — một
  Heritage Candidate chỉ được đề xuất ở dạng nguyên tắc trừu tượng
  ("lắng nghe trước khi đề xuất" — không phải "người dùng X đã cần
  được lắng nghe khi Y"). Không có cơ chế thật nào trong code hôm nay
  thực hiện bước này — xem Privacy Boundary và Experience Debt dưới.

## 2. Privacy Boundary — tổng hợp

**Companion KHÔNG được:**

- Lưu danh tính người dùng để tạo bài học chung cho nhiều người.
- Nhắc lại câu chuyện cá nhân của người này cho người khác.
- Biến Reflection cá nhân thành dữ liệu huấn luyện nếu chưa có consent
  rõ ràng.
- Aggregate dữ liệu nhạy cảm khi chưa có thiết kế privacy riêng (xem
  `docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`).

**Companion ĐƯỢC:**

- Ghi nhận Lesson ở cấp cá nhân (`character-memory.ts`,
  `LESSON_FROM_REFLECTION`).
- Giữ bài học CHO CHÍNH người dùng đó (Character Memory, Inner Thought).
- Đề xuất Lesson candidate ở mức trừu tượng, không chứa thông tin nhận
  diện (Heritage Candidate, bước 7 — chưa có cơ chế thật, chỉ có định
  nghĩa).
- Chờ một Sprint riêng cho anonymized aggregation nếu thật sự cần
  (`docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`).

## 3. Audit — hệ thống hiện tại đang ở bước nào

| Hệ thống | File | Bước đạt được hôm nay | Có hành vi thật hay chỉ docs? |
|---|---|---|---|
| Reflection | `reflections.ts`, `reflection-meaning.ts` | Bước 1–2 (Experience, Reflection) | Hành vi thật — `ReflectionMeaning` được phát hiện rule-based |
| Memory Capsule | `memoryCapsules.ts` | Bước 1 (Experience, dạng container) | Hành vi thật — lưu Supabase, không tự sinh Lesson |
| Story | `living-stories.ts`, `story-memory.ts` | Không thuộc vòng đời này (nội dung viết sẵn, không phải trải nghiệm thu hoạch) | N/A |
| Character Memory | `character-memory.ts` | Bước 3–4, MỘT PHẦN bước 6 (Living Wisdom, qua ngưỡng transformation ≥ 2) | Hành vi thật — duy nhất trong hệ thống đạt gần tới Living Wisdom |
| `getCompanionDecision()` (`portal-brain.ts`) | — | Bước 3–4 (Lesson nội bộ, Meaning qua Inner Thought) | Hành vi thật, nhưng Lesson không hiển thị cho người dùng |
| Inner Thought (`inner-thought-engine.ts`) | — | Bước 4 (Meaning thể hiện qua hành vi) | Hành vi thật |
| Living Wisdom System (8 bước) | `docs/THE_LIVING_WISDOM_SYSTEM.md` | Mô tả tới bước 8 (Contribution) | CHỈ DOCS — Value/Action/Contribution chưa có code |
| Living Heritage | `docs/LIVING_HERITAGE.md` | Bước 7 (Heritage Candidate → xét Heritage) | CHỈ DOCS — không có code |
| Repeated Validation (bước 5) | — | `character-memory.ts` có ĐẾM lặp lại (transformation count ≥ 2) nhưng KHÔNG kiểm tra Positive Outcome (`docs/POSITIVE_OUTCOME.md`, Sprint 21.7) | MỘT PHẦN — chỉ đếm số lần, chưa kiểm tra điều kiện Positive Outcome |
| Heritage Candidate (bước 7) | — | Chưa có | CHƯA CÓ GÌ — Education Debt |
| Core Memory | `core-memory.ts` | Không thuộc vòng đời này (niềm tin gốc của Companion, không phải trải nghiệm người dùng) | N/A |

**Kết luận audit**: hôm nay, hệ thống đi xa nhất tới gần cuối bước 6
(Living Wisdom, qua Character Memory) cho CHÍNH một người dùng. Bước 7
(Heritage Candidate) và phần Positive Outcome của bước 5 (không chỉ
đếm số lần) hoàn toàn chưa có code — đây là Experience Debt lớn nhất
sau Sprint 21.6/21.7.

> **Cập nhật — `docs/POSITIVE_OUTCOME.md` (Sprint 21.7)**: audit xác
> nhận `character-memory.ts` (`CHARACTER_TRANSFORMATION_THRESHOLD`)
> chỉ đo SỐ LẦN một `ReflectionMeaning` lặp lại — nó hoàn toàn không
> biết liệu mỗi lần áp dụng Lesson tương ứng có tạo Positive Outcome
> hay không (không có Outcome nào được ghi nhận sau khi Lesson được
> dùng). "Lặp lại nhiều lần" hôm nay đồng nghĩa "đủ điều kiện chuyển
> hoá thành Character" — đây CHÍNH XÁC là khoảng trống Sprint 21.7 gọi
> tên: số lần lặp lại không tự động là Positive Outcome.

Xem tiếp: `docs/EXPERIENCE_HARVEST.md`, `docs/THE_LIVING_WISDOM_SYSTEM.md`,
`docs/LIVING_HERITAGE.md`, `docs/CHARACTER_MEMORY.md`,
`docs/POSITIVE_OUTCOME.md`,
`docs/FUTURE_ANONYMIZED_WISDOM_AGGREGATION.md`.
