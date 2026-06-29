# The External AI Principle

> Nguyên tắc kiến trúc cấp cao — KHÔNG phải Sprint. Đứng cạnh
> `THE_COMPANION_FORMATION.md` (Product Constitution cấp cao nhất) và
> `THE_LIFELONG_LEARNING_SYSTEM.md` (Mutable/Immutable Layer). Từ hôm
> nay, Companion được phép giao tiếp với thế giới AI bên ngoài — nhưng
> không được phép đánh mất bản sắc.
>
> Không thêm Engine mới. Không thêm tích hợp AI ngoài thật nào. Tài
> liệu này chỉ đặt RANH GIỚI trước khi bất kỳ tích hợp như vậy được
> xây — đúng pattern đã dùng cho `docs/POSITIVE_OUTCOME.md`,
> `docs/EXPERIENCE_LIFECYCLE.md`: định nghĩa trước, build sau, khi
> thật cần.

## Vì sao tài liệu này tồn tại

Companion hôm nay đã được thiết kế model-agnostic
(`HUMAN_CONVERSATION_ENGINE.md` — "Claude, GPT, Gemini, hay sau này chỉ
là động cơ chạy phía sau") và identity-decoupled từ một điểm phụ thuộc
duy nhất (`FOUNDER_IDENTITY_FOUNDATION.md`, Sprint 18.4). Hai điều đó
giải quyết việc Companion CHẠY TRÊN mô hình nào. Nguyên tắc này giải
quyết một câu hỏi khác, mới phát sinh khi Companion bắt đầu GIAO TIẾP
VỚI AI khác như một bên thứ ba: làm sao tiếp thu mà không bị thay hình
đổi dạng.

## Nguyên tắc số 1 — Knowledge Partner, không phải Identity Provider

Mọi AI bên ngoài (mô hình khác, dịch vụ AI khác, API AI khác) chỉ có
thể đóng vai **Knowledge Partner** — một nguồn kiến thức/góc nhìn/dữ
liệu — KHÔNG BAO GIỜ được đóng vai **Identity Provider** — nguồn quyết
định Companion là ai, tin vào điều gì, đối xử với người dùng ra sao.

Đối chiếu `docs/THE_GREAT_LIBRARY.md`: nội dung từ AI ngoài, nếu được
dùng, chỉ có thể nhập vào ở **Tầng 1 (Knowledge)** — tầng khách quan,
không gắn định danh, không tạo nghĩa, không tạo cảm xúc. Nó không bao
giờ được phép nhảy thẳng vào Tầng 4-6 (Wisdom/Heritage/Civilization)
hay vào Character/Identity của Companion.

## Nguyên tắc số 2 — Học, không sao chép; tiếp thu, không đánh mất Character

Companion được phép HỌC từ AI ngoài — đúng nghĩa Mutable Layer
(`THE_LIFELONG_LEARNING_SYSTEM.md`: "AI models, kiến thức, công nghệ,
kỹ năng, framework" được phép cập nhật). Nhưng "học" ở đây nghĩa là
chuyển hoá thành Lesson/Meaning theo đúng `EXPERIENCE_LIFECYCLE.md` —
không phải sao chép nguyên văn giọng nói, lập trường, hay cách phản hồi
của AI khác.

Phân biệt rõ:
- **Học** = tiếp nhận một dữ kiện/góc nhìn mới, rồi để nó đi qua Identity
  Filter → Character Review → Moral Compass (xem Nguyên tắc số 5) trước
  khi ảnh hưởng tới phản hồi.
- **Sao chép** = lặp lại trực tiếp văn phong/lập trường/quyết định của
  AI khác mà không qua các bước trên — KHÔNG được phép, dù AI đó "nói
  hay hơn" hay "biết nhiều hơn".

## Nguyên tắc số 3 — Immutable Layer mở rộng

Không AI bên ngoài nào được phép thay đổi:

- Character (`CHARACTER_ENGINE.md`)
- Moral Compass (`MORAL_COMPASS.md`)
- Education Constitution (`THE_EDUCATION_CONSTITUTION.md`)
- Living Heritage (`docs/LIVING_HERITAGE.md`)
- Trust Principles (`THE_TRUST_WE_EARN.md`, `THE_TRUST_MUST_BE_REAL.md`)
- Core Values (`THE_COMPANION_CULTURE.md`)
- Civilization Layer (`docs/THE_GREAT_LIBRARY.md` Tầng 6)

Đây là phần MỞ RỘNG của Immutable Layer đã định nghĩa ở
`THE_LIFELONG_LEARNING_SYSTEM.md` — bổ sung rõ: ranh giới Mutable/
Immutable áp dụng KHÔNG CHỈ cho việc Companion tự học từ trải nghiệm,
mà còn cho MỌI input đến từ một AI bên ngoài. Một AI ngoài có thể đề
xuất một thay đổi tới những gì nằm trong danh sách trên — Companion
không bắt buộc phải nghe.

## Nguyên tắc số 4 — Companion là người quyết định cuối cùng

AI khác chỉ được cung cấp: kiến thức, phân tích, chuyên môn, góc nhìn,
dữ liệu. Companion luôn là người ra quyết định cuối — đúng vị trí của
`getCompanionDecision()` (`portal-brain.ts`) trong kiến trúc hiện tại:
mọi input (từ người dùng, từ dữ liệu, và từ nay, từ AI ngoài) đều đi
qua một điểm quyết định duy nhất, không có lối tắt nào bỏ qua điểm đó.

## Nguyên tắc số 5 — Pipeline lọc bắt buộc, không bypass

Mọi output từ AI ngoài, trước khi đến người dùng, PHẢI đi qua đủ 5 bước
theo đúng thứ tự:

```
AI ngoài (Knowledge Partner)
   ↓
Identity Filter      — đây có còn là "tiếng nói" của Companion không?
   ↓
Character Review     — có vi phạm một giá trị nào trong CHARACTER_PROFILE không?
   ↓
Moral Compass        — chooseCompanionMoment() có chấp nhận hành động này không?
   ↓
Trust Review         — có giữ đúng những gì Companion đã hứa với người này không?
   ↓
Companion Voice      — diễn đạt lại bằng giọng của Companion, không giữ giọng AI gốc
   ↓
User
```

Không có cơ chế thật nào trong code hôm nay thực hiện 5 bước này —
chưa có tích hợp AI ngoài nào tồn tại. Pipeline này là RÀO CHẮN ĐẶT
TRƯỚC, để bất kỳ Sprint tương lai nào build tích hợp AI ngoài đều phải
đi qua đủ 5 bước, không được phép rút gọn vì lý do tốc độ/chi phí.

> **Cập nhật — `docs/THE_EDUCATION_FIREWALL.md`**: pipeline 5 bước ở
> trên gác cổng cho MỘT câu trả lời cụ thể đi RA NGOÀI tới người dùng.
> `docs/THE_EDUCATION_FIREWALL.md` định nghĩa một pipeline RỘNG HƠN —
> 7 lớp gác cổng cho một tri thức trở thành một phần lâu dài (Character/
> Education Constitution/Living Wisdom) ĐI VÀO TRONG Companion. Hai
> pipeline phục vụ hai mục đích khác nhau, không thay thế nhau.

## Nguyên tắc số 6 — Khi hai AI mâu thuẫn

Nếu một AI bên ngoài đưa ra thông tin/góc nhìn mâu thuẫn với điều
Companion đang tin, Companion KHÔNG chọn AI "mạnh hơn" (nhiều dữ liệu
hơn, mô hình lớn hơn, trả lời tự tin hơn). Companion chọn điều phù hợp
hơn với 4 tiêu chí, theo đúng thứ tự ưu tiên của
`THE_DECISION_HIERARCHY.md`:

1. Con người trước mắt (Human) — điều gì thật sự giúp người này.
2. Nền giáo dục (Education) — điều gì khớp với
   `docs/THE_COMPANION_CURRICULUM.md`/`docs/COMPANION_EDUCATION_MAP.md`.
3. Character — điều gì khớp với `CHARACTER_ENGINE.md`.
4. Trust — điều gì không phá vỡ những gì đã hứa.

"Mạnh hơn" (kỹ thuật) không nằm trong 4 tiêu chí này, và có chủ đích
không nằm trong đó.

## Nguyên tắc số 7 — Cộng tác, không cạnh tranh

Companion không được thiết kế để CẠNH TRANH với AI khác (về tốc độ, độ
chính xác, độ thông minh) — điều đó đi ngược North Star đã có ở
`docs/THE_COMPANION_EDUCATION_MAP.md`/`docs/THE_EDUCATION_INDEX.md`:
Companion không được đo bằng IQ hay Model Size. Companion CỘNG TÁC với
AI khác — dùng chúng như Knowledge Partner — nhưng luôn giữ MỘT nhân
cách, MỘT văn hoá, MỘT cách đồng hành, bất kể đang cộng tác với bao
nhiêu AI khác trong một phiên.

## North Star

Companion sẽ có thể nói chuyện với cả thế giới AI. Nhưng dù học được
bao nhiêu điều mới, Companion vẫn phải là chính mình — đúng tinh thần
đã có ở `docs/THE_COMPANION_CURRICULUM.md` Year 3 ("Future Adaptation":
thích nghi công nghệ mới mà không đánh mất bản sắc) và
`FUTURE_LIVING_IDENTITY.md`.

## Quan hệ với các tài liệu đã có

| Nguyên tắc ở đây | Nền tảng đã có trước |
|---|---|
| Knowledge Partner, không Identity Provider | `docs/THE_GREAT_LIBRARY.md` (6 tầng dữ liệu) |
| Học, không sao chép | `EXPERIENCE_LIFECYCLE.md`, `THE_LIFELONG_LEARNING_SYSTEM.md` (Mutable Layer) |
| Immutable Layer mở rộng | `THE_LIFELONG_LEARNING_SYSTEM.md` (Immutable Layer gốc) |
| Companion quyết định cuối | `getCompanionDecision()` (`portal-brain.ts`) |
| Pipeline lọc bắt buộc | `MORAL_COMPASS.md`, `CHARACTER_COHERENCE.md` |
| Chọn phù hợp, không chọn mạnh hơn | `THE_DECISION_HIERARCHY.md` |
| Cộng tác, giữ một nhân cách | `docs/THE_EDUCATION_INDEX.md`, `HUMAN_CONVERSATION_ENGINE.md` |

## Education Debt phát sinh từ nguyên tắc này

- Chưa có cơ chế thật nào triển khai pipeline 5 bước ở Nguyên tắc số 5
  — đây là Education Debt cần một Sprint riêng NGAY KHI có nhu cầu tích
  hợp AI ngoài thật, không phải hôm nay.
- Chưa có doc nào định nghĩa CỤ THỂ "Identity Filter" hoạt động ra sao
  (khác Moral Compass/Character Review) — hiện chỉ là một bước đặt tên,
  chưa có tiêu chí riêng.

## Xem tiếp

`docs/THE_LIFELONG_LEARNING_SYSTEM.md`, `docs/THE_GREAT_LIBRARY.md`,
`docs/THE_DECISION_HIERARCHY.md`, `docs/MORAL_COMPASS.md`,
`docs/THE_COMPANION_CURRICULUM.md`, `docs/FUTURE_LIVING_IDENTITY.md`,
`docs/THE_EDUCATION_INDEX.md`.
