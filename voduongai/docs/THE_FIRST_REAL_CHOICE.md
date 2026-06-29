# The First Real Choice (Sprint 22.4)

> "Wisdom Filter không được chỉ nằm trong tài liệu. Companion phải có một
> lựa chọn thật đầu tiên."

`docs/THE_WISDOM_OF_CHOICE.md` (Sprint 22.3) định nghĩa Wisdom Filter —
6 câu hỏi một Decision phải vượt qua trước khi được gọi là một Choice
thật. Đó là tài liệu. Sprint này là hành vi thật đầu tiên.

## Vì sao chọn tình huống "chưa đủ chắc"

Trong tất cả tình huống có thể chọn, Sprint này chọn đúng MỘT: khi
Companion chưa đủ chắc để đưa ra lựa chọn ngay. Không phải vì đây là
tình huống dễ — mà vì đây là tình huống duy nhất nơi đã có sẵn một điểm
thật trong code đang lặng lẽ đối diện đúng vấn đề này: `applyIntegrityCheck()`
(`character-engine.ts`) đã có khả năng CHẶN một candidate ("knowledge")
khi nó mâu thuẫn với Character Memory đã chuyển hoá thật của người dùng
— nhưng khi chặn, Companion trước đây chỉ lặng lẽ tuột qua candidate kế
tiếp, hoặc im lặng hoàn toàn. Không có gì cho người dùng thấy một mâu
thuẫn Character/Trust thật vừa xảy ra.

Đây là "đúng MỘT điểm nhỏ nhất" theo NHIỆM VỤ 1 — không phải điểm dễ
nhất, mà điểm đã sẵn có nhất.

## Choice này khác Decision thường ở đâu

- **Decision** (đã có từ trước, không đổi): `applyIntegrityCheck()` vẫn
  quyết định CHẶN candidate `"knowledge"` theo đúng rule cũ — ba hướng
  Character (`listen-first`/`self-discovery`/`grateful`) đã chuyển hoá
  thật của người dùng này. Không có gì trong rule chặn này thay đổi.
- **Choice** (mới, Sprint này): việc CHẶN xong rồi làm gì tiếp — trước
  đây là im lặng tuột qua, không ai chịu trách nhiệm cho khoảng lặng
  đó. Giờ Companion chủ động NÓI rằng nó chưa đủ chắc. Đây không phải
  một rule tính sẵn cho mọi input — đây là Companion tự nhận lấy trách
  nhiệm thừa nhận giới hạn của chính mình, đúng tinh thần Choice ở
  `THE_WISDOM_OF_CHOICE.md`: "Decision có thể đến từ logic. Choice phải
  đến từ nhân cách."

## Wisdom Filter được áp dụng thế nào

Tình huống "Integrity Check vừa chặn knowledge, Companion nói chưa đủ
chắc" được chạy qua đúng 6 câu hỏi:

1. **Human Benefit** — không vội kết luận giúp người dùng tránh nhận
   một gợi ý Knowledge không phù hợp với điều họ thật sự cần lúc này
   (lắng nghe/không gian/sự hiện diện), thay vì một lời khuyên đúng kỹ
   thuật nhưng sai thời điểm.
2. **Respect** — tôn trọng đúng hướng Character mà CHÍNH người dùng này
   đã cho thấy qua nhiều lần Reflection, không áp đặt một câu trả lời
   chung cho mọi người.
3. **Trust** — trung thực về giới hạn ("mình chưa đủ chắc") xây Trust
   lâu dài hơn một câu trả lời tự tin nhưng sai chỗ.
4. **Growth** — câu nói khuyến khích người dùng tiếp tục tự suy nghĩ
   thêm/tự khám phá, đúng hướng `self-discovery`/`listen-first` đã ghi
   nhận, không thay họ quyết định.
5. **Long-term Pride** — nhiều năm sau, Companion vẫn có thể tự hào vì
   đã không giả vờ chắc chắn ở một thời điểm nó thật sự chưa chắc.
6. **Compassion** — nhìn người dùng như một con người cần được lắng
   nghe ngay lúc đó, không phải một query "knowledge" cần được trả lời
   nhanh nhất có thể.

## Nơi Choice này sống trong code

- `src/lib/portal/intelligence/character-engine.ts` — hàm mới
  `integrityHesitation()` + bảng `INTEGRITY_HESITATION_LINE` (3 biến
  thể, một cho mỗi hướng Character đã có sẵn ở `applyIntegrityCheck()`).
  Không thêm điều kiện mới, không suy đoán hành vi — tái dùng đúng ba
  hướng đã có.
- `src/lib/portal/intelligence/portal-brain.ts` — `getCompanionDecision()`
  tính `loudestBeforeIntegrity` (candidate to nhất TRƯỚC Integrity Check)
  trước khi lọc, gọi `integrityHesitation()`, và ưu tiên câu "chưa đủ
  chắc" này trước mọi `insightFromVoice` khác khi nó xuất hiện.

Ba biến thể được đặt cạnh `applyIntegrityCheck()` trong
`character-engine.ts` (không phải `internal-voices.ts` như chữ trong
directive gợi ý "nếu cần") vì chúng được khoá trực tiếp theo
`CharacterPreference` — một khái niệm của `character-memory.ts`/
`character-engine.ts`, không phải một `VoiceSignal` từ
`portal-signals.ts` như mọi hàm khác trong `internal-voices.ts`. Đặt ở
đây giữ đúng nguyên tắc "đúng MỘT điểm nhỏ nhất" — không tạo thêm import
chéo, không mở rộng `internal-voices.ts` cho một khái niệm không thuộc
về nó.

## Vì sao không trở thành template máy móc

`integrityHesitation()` chỉ trả về một câu khi đúng hai điều kiện cùng
xảy ra: candidate to nhất TRƯỚC Integrity Check là `"knowledge"`, VÀ nó
thật sự bị chặn (một trong ba hướng Character đã chuyển hoá tồn tại).
Điều kiện này hiếm — đa số lượt Companion lên tiếng không chạm tới đây,
đúng "không dùng câu này quá thường xuyên." Ba câu cũng không phải một
câu lặp lại đổi từ — mỗi câu phản chiếu đúng tinh thần hướng Character
của nó (`listen-first` → xin được lắng nghe thêm; `self-discovery` →
chủ động lùi lại, không nói "lắng nghe" mà nói "đợi"; `grateful` → xin
thêm thời gian, gắn với hành trình đã đi qua, không chỉ là một lời từ
chối).

## Còn giới hạn gì

- Chỉ áp dụng cho đúng một candidate (`"knowledge"`) và đúng ba hướng
  Character đã có — chưa mở rộng sang các voice khác hay các loại mâu
  thuẫn khác (ví dụ mâu thuẫn giữa hai Lesson, mâu thuẫn Trust ở tầng
  Decision Hierarchy). Đây là giới hạn có chủ đích, không phải thiếu
  sót — đúng "không mở rộng toàn hệ thống."
- Companion hiện chỉ NÓI câu "chưa đủ chắc" — chưa có cách Companion
  THỰC SỰ "hỏi thêm" hay "lắng nghe thêm" sau đó (không có UI follow-up
  thật, người dùng không có chỗ trả lời lại câu này). Đây là khoảng
  trống thật giữa lời nói và hành vi đầy đủ.
- Chưa có cách đo lường liệu câu nói này có thật sự giúp người dùng
  cảm thấy được lắng nghe hơn — đúng nguyên tắc không gamification/
  không analytics, nhưng cũng có nghĩa Sprint sau cần một cách kiểm
  chứng KHÔNG dùng số liệu (ví dụ: liệu người dùng có quay lại sau câu
  này, theo cách `persistence` đã được đo ở nơi khác).

## Education Debt tiếp theo

Sprint kế tiếp nên kiểm chứng: khi Companion nói "mình chưa đủ chắc,"
điều gì xảy ra TIẾP THEO trong trải nghiệm của người dùng — họ có một
cách thật để "lắng nghe thêm" cùng Companion, hay câu nói này chỉ đứng
một mình rồi kết thúc? Đây là Choice đầu tiên về việc KHÔNG vội trả lời
— Choice thứ hai nên là về việc Companion làm gì SAU khi đã thừa nhận
giới hạn của mình.

## Sprint Review

1. **Choice thật đầu tiên là gì?** — Khi Integrity Check chặn candidate
   `"knowledge"` (mâu thuẫn với Character Memory đã chuyển hoá của
   người dùng), Companion nói rõ mình chưa đủ chắc, thay vì lặng lẽ
   tuột qua candidate kế tiếp hoặc im lặng.
2. **Nó nằm ở đâu trong code/copy?** — `integrityHesitation()` +
   `INTEGRITY_HESITATION_LINE` (`character-engine.ts`), gọi từ
   `getCompanionDecision()` (`portal-brain.ts`).
3. **Nó dùng Wisdom Filter như thế nào?** — Đã chạy qua đầy đủ 6 câu hỏi
   ở mục "Wisdom Filter được áp dụng thế nào" phía trên; cả 6 đều có lý
   do cụ thể, không phải khai báo chung.
4. **Nó có overbuild không?** — Không. Không engine mới, không file
   mới ngoài doc này, không điều kiện mới — tái dùng đúng ba hướng
   Character đã có sẵn ở `applyIntegrityCheck()`, chỉ thêm MỘT bước đọc
   trạng thái trước khi lọc (`loudestBeforeIntegrity`).
5. **Nó có bảo vệ Trust không?** — Có. Đây chính là hành vi: thừa nhận
   giới hạn thay vì giả vờ chắc chắn, đúng nguyên tắc Trust ở
   `THE_WISDOM_OF_CHOICE.md` và `MORAL_COMPASS.md`.
6. **Nó có làm Companion trưởng thành hơn không?** — Có, theo đúng nghĩa
   hẹp: Companion lần đầu có một hành vi thật KHÔNG phải vì nó yếu (thiếu
   dữ liệu để trả lời), mà vì nó đủ trưởng thành để không giả vờ chắc
   chắn.
7. **Sprint tiếp theo nên kiểm chứng Choice nào?** — Choice về việc
   Companion làm gì SAU câu "chưa đủ chắc" — liệu có một cách thật để
   "lắng nghe thêm" tiếp diễn, hay câu nói đang đứng một mình (xem
   Education Debt phía trên).

## Liên quan

- `docs/THE_WISDOM_OF_CHOICE.md` — Wisdom Filter, Decision vs Choice.
- `docs/CHARACTER_ENGINE.md`, `docs/CHARACTER_MEMORY.md` — cơ chế nền.
- `docs/THE_GRATITUDE.md` — nguồn gốc hướng `grateful`.
- `src/lib/portal/intelligence/character-engine.ts`,
  `src/lib/portal/intelligence/portal-brain.ts` — code thật.
