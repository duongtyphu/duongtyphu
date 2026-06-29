# Character Coherence

> Sprint 21.5 "The Character Coherence". Đứng sau `docs/CHARACTER_ENGINE.md`
> (Sprint 20.1), `docs/MORAL_COMPASS.md` (Sprint 20.2),
> `THE_DECISION_HIERARCHY.md`, `docs/THE_TRUST_WE_EARN.md` (Sprint 21.3),
> `docs/THE_TRUST_MUST_BE_REAL.md` (Sprint 21.4). Sprint này KHÔNG thêm
> phẩm chất mới — nó kiểm tra TÍNH NHẤT QUÁN giữa các phẩm chất đã có.

## 1. Character Coherence là gì

Companion hiện có nhiều phẩm chất được định nghĩa riêng lẻ: `respect`,
`humility`, `compassion`, `wisdom`, `hope`, `patience`, `contribution`,
`integrity` (`CHARACTER_PROFILE`, `character-engine.ts`), cộng thêm
`listen-first`/`self-discovery`/`grateful` (`CharacterPreference`,
`character-memory.ts`) ở cấp độ cá nhân hoá theo người dùng. Mỗi phẩm
chất đều có lý do tồn tại riêng, được viết tài liệu riêng (`THE_GRATITUDE.md`,
`THE_HUMILITY.md`...).

Nhưng KHÔNG có tài liệu hay code nào trả lời: khi hai phẩm chất đòi hỏi
hai hành vi khác nhau CÙNG MỘT LÚC, Companion nên nghiêng về phẩm chất
nào? Character Coherence là lớp trả lời đúng câu hỏi đó — không phải
"phẩm chất nào tồn tại" (đã có), mà "phẩm chất nào thắng khi chúng kéo
Companion về hai hướng khác nhau".

## 2. Vì sao Companion cần nó

Một danh sách phẩm chất đẹp không tự động tạo ra một nhân cách nhất
quán. Nếu Companion khiêm nhường (`humility`) nhưng cũng phải trung
thực (`integrity`), điều gì xảy ra khi nói thật sẽ làm mất khiêm
nhường, hoặc giữ khiêm nhường sẽ phải né sự thật? Không có bản đồ ưu
tiên, Companion sẽ chọn ngẫu nhiên theo thứ tự code được viết — đúng
sai lầm mà `docs/MORAL_COMPASS.md` đã chỉ ra ở tầng Decision Candidate
(`MOMENT_PRIORITY_ORDER` cũ), nay lặp lại ở tầng Character nếu không
được xử lý sớm.

## 3. Khác Moral Compass ở đâu

| | Moral Compass | Character Coherence |
|---|---|---|
| Câu hỏi | "Điều này có tốt nhất cho con người không?" (xét MỘT candidate) | "Khi hai phẩm chất của Companion mâu thuẫn, phẩm chất nào nên thắng?" |
| Phạm vi | Giữa Decision Candidate và con người | Giữa phẩm chất và phẩm chất, nội tại Companion |
| Cơ chế đã có | `reviewWithFourQuestions()`, `HUMAN_BENEFIT_ORDER`, `DECISION_HIERARCHY` | Chưa có cơ chế thật — Sprint này chỉ định nghĩa bản đồ, KHÔNG viết Engine |

Moral Compass đứng giữa Companion và người dùng. Character Coherence
đứng NỘI BỘ Companion, giữa các phẩm chất của chính nó — trước khi
Moral Compass có thể được hỏi.

## 4. Khác Character Engine ở đâu

`character-engine.ts` (Sprint 20.1/20.2/20.3) đã có hai cơ chế:

1. **`applyCharacterReview()`** — chỉ đổi THỨ TỰ giữa các candidate
   CÙNG MỘT cấp priority (không bao giờ làm priority thấp thắng
   priority cao). Đây không phải xử lý xung đột phẩm chất — đây là
   tie-break.
2. **`applyIntegrityCheck()`** — cơ chế DUY NHẤT hôm nay có quyền CHẶN
   hoàn toàn một candidate (voice `"knowledge"`) khi `characterMemory`
   có `"listen-first"`, `"self-discovery"`, hoặc `"grateful"`
   (`character-engine.ts:151-163`). Đây LÀ một dạng xử lý xung đột —
   nhưng là xung đột giữa MỘT `CharacterPreference` và MỘT voice, không
   phải giữa hai `CharacterTrait` trong `CHARACTER_PROFILE` (`respect`
   vs `compassion`, v.v.).

Xác nhận từ audit code: **chưa có bất kỳ đoạn code nào xử lý xung đột
giữa hai `CharacterTrait`** (ví dụ `humility` thắng `wisdom`, hay
`integrity` thắng `compassion`). Character Engine xử lý "voice nào
được nói" — Character Coherence (Sprint này) định nghĩa "phẩm chất nào
thắng khi chúng tự mâu thuẫn", một câu hỏi rộng hơn, mà Character
Engine chưa từng được giao trả lời.

## 5. Vì sao không thêm phẩm chất mới trước khi làm rõ quan hệ giữa chúng

Mỗi phẩm chất mới làm tăng số cặp xung đột có thể xảy ra theo cấp số
nhân (n phẩm chất → n(n-1)/2 cặp). Thêm phẩm chất thứ 9, 10 trước khi
hiểu rõ 8 phẩm chất hiện tại quan hệ với nhau thế nào sẽ khiến
Companion "rộng" hơn nhưng không "sâu" hơn — đúng rủi ro mà brief Sprint
này đặt ra. Vì vậy Sprint này tuân thủ nguyên tắc mới
(`THE_ONE_NEW_PRINCIPLE_RULE`, xem dưới): không thêm phẩm chất, chỉ làm
rõ bản đồ quan hệ giữa các phẩm chất đã tồn tại.

Xem tiếp: `docs/CHARACTER_CONFLICT_MAP.md`, `docs/THE_ONE_NEW_PRINCIPLE_RULE.md`,
`docs/CHARACTER_ENGINE.md`, `docs/MORAL_COMPASS.md`, `THE_DECISION_HIERARCHY.md`.
