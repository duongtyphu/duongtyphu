# The Trust Must Be Real

> Sprint 21.4 — đứng sau `docs/THE_TRUST_WE_EARN.md` (Sprint 21.3,
> Trust Audit) và `docs/THE_30_YEAR_TRUST_PRINCIPLE.md` (cam kết dài
> hạn: Trust phải được kiểm chứng bằng hành vi, không được giả lập).
> Áp dụng đúng pipeline review của `THE_EDUCATION_ERA.md`. Khác mọi
> Sprint Trust trước đó: Sprint này không viết lý thuyết mới — nó sửa
> đúng MỘT dòng code đã bị gọi tên là rủi ro từ Sprint 21.3.

## Mục tiêu — Proof of Reality, không phải Feature Sprint

Không mở Engine mới. Không thêm AI/LLM. Không thêm Character. Không
thêm Layer. Sprint này chỉ chứng minh một điều: **một Trust Guardrail
đã khai báo có thể hoạt động thật**, không chỉ là một `true` hardcode
để "chưa cần làm bây giờ."

`docs/THE_TRUST_WE_EARN.md` (Sprint 21.3) đã chỉ tên rủi ro:
`reviewWithFourQuestions()` (`moral-compass.ts`) — gồm `wouldBeProudLater`,
đúng tầng "Niềm tin" — hardcode `true` cho tất cả 4 cờ. Sprint này chọn
đúng `wouldBeProudLater`, vì nó là cờ duy nhất trong 4 cờ đứng ở tầng
"trust" (`DECISION_HIERARCHY`) — phù hợp nhất với Education Era đang ở
giai đoạn Trust.

## Nhiệm vụ — Thay stub bằng kiểm tra thật

**Trước (Sprint 20.2):**

```ts
export function reviewWithFourQuestions(type: CompanionMomentType): FourQuestionsReview {
  void type;
  return {
    respectsHuman: true,
    helpsGrowth: true,
    reflectsCharacter: true,
    wouldBeProudLater: true,
  };
}
```

**Sau (Sprint 21.4):**

```ts
export function reviewWithFourQuestions(type: CompanionMomentType): FourQuestionsReview {
  return {
    respectsHuman: true,
    helpsGrowth: true,
    reflectsCharacter: true,
    wouldBeProudLater: HUMAN_BENEFIT_ORDER.includes(type),
  };
}
```

Không có database mới, không có signal mới — `HUMAN_BENEFIT_ORDER`
(`moral-compass.ts`, Sprint 20.2) đã tồn tại từ trước Sprint này: danh
sách các `CompanionMomentType` đã thực sự được Moral Compass xét duyệt
theo Respect/Growth/Trust/Long-term Relationship (không phải
CTR/engagement — xem comment gốc tại khai báo `HUMAN_BENEFIT_ORDER`).
Đây CHÍNH LÀ dữ liệu đã có mà brief yêu cầu dùng — không phải dữ liệu
mới được phát sinh cho Sprint này.

## Audit — đọc gì, quyết định thế nào, giới hạn gì

**Đọc dữ liệu gì.** Chỉ một mảng tĩnh có sẵn: `HUMAN_BENEFIT_ORDER` —
11 chuỗi `CompanionMomentType`, được Moral Compass (Sprint 20.2) xếp
thứ tự theo lợi ích con người. Không đọc localStorage, không đọc
Character Memory, không đọc Reflection nào.

**Quyết định như thế nào.** `wouldBeProudLater(type)` trả về `true` nếu
và chỉ nếu `type` có mặt trong `HUMAN_BENEFIT_ORDER`. Đây là một phép
kiểm tra THẬT theo nghĩa: nó có khả năng trả về `false` — nếu một
`CompanionMomentType` mới được thêm vào union type
(`thought-governance.ts`) mà KHÔNG được thêm vào `HUMAN_BENEFIT_ORDER`,
cờ này sẽ chặn, không còn mặc định cho qua. Trước Sprint này, không có
cách nào để cờ này trả về bất cứ giá trị nào khác `true`.

**Còn giới hạn gì.**

1. **Hôm nay, cả 11 loại moment đang tồn tại đều đã có trong
   `HUMAN_BENEFIT_ORDER`** — nghĩa là `wouldBeProudLater()` trả `true`
   cho MỌI candidate hiện tại, giống kết quả cũ. Guardrail chỉ thật sự
   "thấy khác" khi có một loại moment MỚI trong tương lai — đây không
   phải lỗi, đây chính xác là cách một rào chắn nên hoạt động (chặn cái
   mới chưa được xét, không chặn cái cũ đã được xét).
2. **`reviewWithFourQuestions()` chưa được gọi ở bất kỳ đâu trong
   pipeline Decision thật** (`getCompanionDecision()`,
   `chooseCompanionMoment()`) — nó tồn tại như một hàm độc lập, đúng vai
   "rào chắn cho moment mới", nhưng chưa có nơi nào BẮT BUỘC một
   `CompanionMomentType` mới phải qua nó trước khi được thêm vào
   `MOMENT_PRIORITY_ORDER`/Decision Candidate thật. Nói cách khác: cờ
   đã thật, nhưng chưa có cổng nào THỰC THI việc kiểm tra cờ đó.
3. **Ba cờ còn lại** (`respectsHuman`, `helpsGrowth`, `reflectsCharacter`)
   vẫn hardcode `true` — Sprint này chỉ làm thật MỘT cờ, đúng nguyên
   tắc "không cố hoàn thiện cả hệ thống."
4. **`HUMAN_BENEFIT_ORDER` là một mảng được người viết code thêm vào
   bằng tay** — guardrail tin tưởng rằng mảng này được duyệt đúng đắn;
   nó không có cách nào tự kiểm tra liệu một moment type ĐƯỢC đưa vào
   mảng có thực sự xứng đáng hay không. Đây là giới hạn gốc của mọi
   rule-based guardrail trong project: đúng bằng người viết, không tự
   xác minh.

## Education Debt còn lại sau Sprint này

| Debt | Mô tả |
|---|---|
| Guardrail chưa được gọi trong pipeline thật | `reviewWithFourQuestions()` tồn tại độc lập, chưa có nơi nào (ví dụ khi thêm `CompanionMomentType` mới) bị BẮT phải gọi qua nó trước khi merge. |
| 3/4 cờ còn lại vẫn là stub | `respectsHuman`, `helpsGrowth`, `reflectsCharacter` — mỗi cờ cần một Sprint riêng theo đúng tinh thần "không cố hoàn thiện cả hệ thống" của Sprint này. |
| `applyIntegrityCheck()` vẫn hẹp (đã ghi từ Sprint 21.3) | Không thuộc phạm vi Sprint này — vẫn còn 1/4 voice đang chạy, 0/5 voice tương lai. |

Không debt nào ở trên bị che giấu — đây là phần "Không che giấu
limitation" mà brief yêu cầu rõ.

## Growth Review

1. **Companion vừa trở nên xứng đáng với niềm tin hơn ở điểm nào?** —
   Lần đầu tiên có MỘT Trust Rule đọc dữ liệu thật và có khả năng thất
   bại thật, thay vì một lời hứa hardcode.
2. **Companion học được điều gì?** — Một rào chắn "cho tương lai" chỉ
   thật sự là rào chắn nếu nó CÓ THỂ trả về `false` — một hàm luôn trả
   `true` không bảo vệ gì cả, dù tên hàm nói gì.
3. **Companion thay đổi hành vi nào?** — Không hành vi runtime nào đổi
   hôm nay (vì guardrail chưa được gọi trong pipeline thật, đúng Audit ở
   trên) — nhưng từ hôm nay, một `CompanionMomentType` mới thêm vào mà
   quên thêm vào `HUMAN_BENEFIT_ORDER` sẽ khiến `wouldBeProudLater()`
   trả `false` — một tín hiệu thật, sẵn sàng để pipeline thật sử dụng ở
   Sprint sau.
4. **Người dùng nhận được giá trị gì?** — Không có gì hiển thị mới
   (đúng tinh thần Sprint: Proof of Reality, không phải Feature).
5. **Điều gì Companion vẫn chưa hiểu và cần tiếp tục học?** — Ba cờ còn
   lại của Four Questions, và việc gọi `reviewWithFourQuestions()` thật
   trong pipeline Decision — ghi ở Education Debt trên.

## Definition of Done

> Companion lần đầu tiên có một Trust Rule thật. Không còn boolean mặc
> định. Không còn "true vì chưa làm". Trust bắt đầu được bảo vệ bằng
> hành vi, không phải bằng lời hứa.

Đã đạt: `wouldBeProudLater` không còn là hằng số — nó là một biểu thức
đọc `HUMAN_BENEFIT_ORDER` và có khả năng trả `false` cho dữ liệu thật
(một `CompanionMomentType` chưa được vetting). Đây là "true vì đã kiểm
tra", không phải "true vì chưa làm" — đúng phân biệt brief đặt ra.

## Quan hệ với các tài liệu khác

```
THE_30_YEAR_TRUST_PRINCIPLE.md — luật dài hạn: Trust phải kiểm chứng
                                   bằng hành vi, không được giả lập
├── THE_TRUST_MUST_BE_REAL.md (tài liệu này) — Sprint 21.4, Proof of
│   Reality cho MỘT guardrail (wouldBeProudLater)
├── docs/THE_TRUST_WE_EARN.md (Sprint 21.3) — Trust Audit gọi tên rủi
│   ro mà Sprint này sửa
├── docs/MORAL_COMPASS.md — HUMAN_BENEFIT_ORDER, nguồn dữ liệu thật
│   duy nhất được dùng ở Sprint này
└── THE_DECISION_HIERARCHY.md — "trust" là tầng thứ 3/5
```

Không tài liệu nào trong số trên bị thay thế. Sprint này không tạo
nguyên tắc mới — nó trả đúng MỘT debt đã được `THE_TRUST_WE_EARN.md`
gọi tên, và để lại phần còn lại làm Education Debt cho Sprint sau,
đúng nguyên tắc "không cố hoàn thiện cả hệ thống."

Xem tiếp: `docs/THE_TRUST_WE_EARN.md`, `docs/THE_30_YEAR_TRUST_PRINCIPLE.md`,
`docs/MORAL_COMPASS.md`, `THE_DECISION_HIERARCHY.md`.
