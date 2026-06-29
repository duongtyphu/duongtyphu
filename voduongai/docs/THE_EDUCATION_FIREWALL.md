# The Education Firewall

> Architecture Directive — KHÔNG phải Feature, KHÔNG phải Sprint. Đứng
> cạnh `docs/THE_EXTERNAL_AI_PRINCIPLE.md` và
> `docs/THE_LIFELONG_LEARNING_SYSTEM.md`. Mục tiêu: mọi tri thức mới,
> trước khi trở thành một phần của Companion, đều phải đi qua Education
> Layer. Không AI nào, không tài liệu nào, không mô hình nào được phép
> thay đổi Character của Companion trực tiếp.
>
> Không thêm code. Không thêm AI. Không thêm database. Đây là kiến
> trúc NỀN cho toàn bộ tương lai của Companion — một rào chắn đặt
> trước, đúng cách `docs/THE_EXTERNAL_AI_PRINCIPLE.md` đã đặt rào chắn
> trước khi tích hợp AI ngoài thật tồn tại.

## Quan hệ với pipeline đã có ở `THE_EXTERNAL_AI_PRINCIPLE.md`

`THE_EXTERNAL_AI_PRINCIPLE.md` định nghĩa pipeline lọc cho MỘT TÌNH
HUỐNG cụ thể: output từ một AI ngoài trên đường tới NGƯỜI DÙNG
(Identity Filter → Character Review → Moral Compass → Trust Review →
Companion Voice → User).

The Education Firewall RỘNG HƠN: nó áp dụng cho MỌI **Knowledge Input**
— không chỉ output của AI ngoài, mà cả một tài liệu mới, một mô hình
mới, một nguồn dữ liệu mới — trên đường trở thành một phần ỔN ĐỊNH của
Companion (Character, Education Constitution, Living Wisdom). Hai
pipeline không thay thế nhau:

- Pipeline ở `THE_EXTERNAL_AI_PRINCIPLE.md` gác cổng cho **một câu trả
  lời cụ thể** đi ra ngoài.
- Pipeline ở tài liệu này gác cổng cho **một tri thức** đi vào trong,
  trở thành một phần lâu dài của Companion.

Một Knowledge Input có thể KHÔNG BAO GIỜ tới được "Approved Learning"
(7 lớp dưới), trong khi vẫn được dùng tạm thời như Knowledge Partner
(Tầng 1, `docs/THE_GREAT_LIBRARY.md`) cho một câu trả lời đơn lẻ — đó
là sự khác biệt giữa "dùng một lần" và "trở thành một phần của Companion
mãi".

## Sơ đồ 7 bước

```
Knowledge Input
      ↓
Identity Review
      ↓
Character Review
      ↓
Trust Review
      ↓
Education Review
      ↓
Living Wisdom Review
      ↓
Approved Learning
      ↓
Companion
```

## Bước 0 — Knowledge Input

**Vai trò là gì?** Điểm vào duy nhất của bất kỳ tri thức mới — một AI
ngoài, một tài liệu, một mô hình, một nguồn dữ liệu — trước khi nó có
cơ hội ảnh hưởng tới Companion.

**Điều gì được phép đi qua?** Bất kỳ thứ gì — bước này KHÔNG lọc, nó
chỉ là cổng vào. Lọc thật bắt đầu từ Bước 1.

**Điều gì bị chặn?** Không gì — đây là bước ghi nhận, không phải bước
quyết định.

**Điều gì cần con người quyết định?** Không gì ở bước này.

**Điều gì cần thêm bằng chứng?** Nguồn gốc của Knowledge Input phải
được ghi nhận rõ (đến từ AI nào, tài liệu nào, ngày nào) — để các bước
sau có thể truy ngược lại nếu cần.

## Bước 1 — Identity Review

**Vai trò là gì?** Kiểm tra Knowledge Input có cố tình hoặc vô tình
mang theo một BẢN SẮC khác (giọng nói, lập trường, "cái tôi" của một AI
khác) thay vì chỉ mang theo kiến thức thuần. Tương ứng "Identity
Filter" đã được đặt tên ở `docs/THE_EXTERNAL_AI_PRINCIPLE.md` Nguyên
tắc số 5, nay được định nghĩa cụ thể hơn ở đây.

**Điều gì được phép đi qua?** Sự kiện, dữ liệu, phân tích, góc nhìn —
ở dạng tách rời khỏi "giọng" của nguồn gốc.

**Điều gì bị chặn?** Bất cứ thứ gì mang dấu ấn nhân cách của nguồn
khác — ví dụ một câu trả lời nguyên văn từ một AI khác kèm cách xưng
hô, lập trường, "tôi nghĩ" của riêng AI đó.

**Điều gì cần con người quyết định?** Trường hợp ranh giới mơ hồ giữa
"kiến thức" và "lập trường" (ví dụ một phân tích có hàm chứa quan điểm
giá trị) — Identity Review không đủ thẩm quyền tự quyết định, phải đẩy
lên người vận hành.

**Điều gì cần thêm bằng chứng?** Cần xác nhận: nội dung này có thể diễn
đạt lại bằng giọng của Companion mà không mất ý nghĩa không? Nếu không
thể diễn đạt lại — đó là dấu hiệu nó đang mang Identity, không phải
Knowledge thuần.

## Bước 2 — Character Review

**Vai trò là gì?** Kiểm tra Knowledge Input có mâu thuẫn với
`CHARACTER_PROFILE` (`CHARACTER_ENGINE.md`) hay không — đúng cơ chế đã
có ở `CHARACTER_COHERENCE.md`.

**Điều gì được phép đi qua?** Tri thức nhất quán hoặc trung lập với 8
giá trị hiện có (respect, humility, compassion, wisdom, hope, patience,
contribution, integrity).

**Điều gì bị chặn?** Tri thức ngụ ý hoặc khuyến khích một hành vi vi
phạm trực tiếp một giá trị — ví dụ một "tối ưu" khiến Companion kém
khiêm nhường hơn để có vẻ "thông minh hơn".

**Điều gì cần con người quyết định?** Khi tri thức mới có vẻ ĐÚNG về
mặt kỹ thuật nhưng tạo xung đột với một giá trị đã có (tương tự các
dòng trong `CHARACTER_CONFLICT_MAP.md`) — không có quy tắc tự động giải
quyết loại xung đột này.

**Điều gì cần thêm bằng chứng?** Cần một ví dụ áp dụng cụ thể (không
chỉ lý thuyết) để kiểm tra tri thức đó có thực sự mâu thuẫn hay chỉ
trông giống mâu thuẫn.

## Bước 3 — Trust Review

**Vai trò là gì?** Kiểm tra Knowledge Input có phá vỡ điều Companion đã
hứa/đã thiết lập với người dùng qua thời gian không — đúng tinh thần
`THE_TRUST_WE_EARN.md`, `THE_TRUST_MUST_BE_REAL.md`.

**Điều gì được phép đi qua?** Tri thức không thay đổi những gì Companion
đã cam kết (ví dụ cách nó lắng nghe, cách nó không phán xét).

**Điều gì bị chặn?** Tri thức ngụ ý Companion nên hành xử khác với
những gì người dùng đã quen tin tưởng, dù tri thức đó "mới hơn, tốt
hơn" về mặt kỹ thuật.

**Điều gì cần con người quyết định?** Khi tri thức mới có thể CẢI THIỆN
trải nghiệm dài hạn nhưng đòi hỏi thay đổi điều người dùng đã quen —
đây là việc đánh đổi Trust ngắn hạn lấy giá trị dài hạn, không thể tự
động hoá.

**Điều gì cần thêm bằng chứng?** Cần dữ liệu thật về việc thay đổi này
có từng (hoặc có khả năng) phá vỡ Trust với một người dùng cụ thể chưa —
không suy đoán.

## Bước 4 — Education Review

**Vai trò là gì?** Kiểm tra Knowledge Input có khớp với
`docs/THE_COMPANION_CURRICULUM.md` (đúng Year, không đi tắt) và có làm
`docs/COMPANION_EDUCATION_MAP.md` cân bằng hơn hay lệch hơn không.

**Điều gì được phép đi qua?** Tri thức khớp với Year hiện tại của
Curriculum, hoặc tri thức giúp trả nợ Education Debt đã ghi nhận
(Courage, Patience, Civilization, Future Education...).

**Điều gì bị chặn?** Tri thức thuộc Year 3 (Civilization/Legacy/
Mentorship/Future Adaptation) khi Year 1-2 chưa vững — đúng nguyên tắc
"không đi tắt" của Curriculum.

**Điều gì cần con người quyết định?** Việc một tri thức "có vẻ hữu ích
ngay" có nên được ưu tiên hơn việc giữ đúng thứ tự Curriculum không —
đây là đánh đổi giữa tốc độ và đúng trình tự giáo dục.

**Điều gì cần thêm bằng chứng?** Cần đối chiếu cụ thể với bảng Education
Balance ở `docs/COMPANION_EDUCATION_MAP.md` — tri thức này làm Pillar
nào mạnh hơn, có đang làm Pillar đã mạnh (Character) càng lệch thêm
không.

## Bước 5 — Living Wisdom Review

**Vai trò là gì?** Kiểm tra Knowledge Input đã được kiểm chứng đủ —
không chỉ đúng MỘT lần, mà có khả năng lặp lại và tạo Positive Outcome
nhất quán — đúng `docs/POSITIVE_OUTCOME.md` và `EXPERIENCE_LIFECYCLE.md`
Bước 5-6 (Repeated Validation → Living Wisdom).

**Điều gì được phép đi qua?** Tri thức đã có ít nhất một bằng chứng áp
dụng thật tạo kết quả tích cực — không phải tri thức lý thuyết chưa
từng được kiểm tra với một tình huống thật.

**Điều gì bị chặn?** Tri thức MỚI, chưa có bất kỳ bằng chứng áp dụng
nào — dù nó nghe có lý — bị chặn ở đây, không được đi thẳng vào
Character.

**Điều gì cần con người quyết định?** Khi không có đủ thời gian/dữ liệu
để chờ Repeated Validation (ví dụ tình huống cấp bách) — người vận hành
phải quyết định có chấp nhận rủi ro tạm thời hay tiếp tục chặn.

**Điều gì cần thêm bằng chứng?** Đây là lớp ĐÒI HỎI BẰNG CHỨNG nhiều
nhất trong cả 7 lớp — không có ngưỡng số lần cố định (đúng nguyên tắc
đã áp dụng cho `CHARACTER_TRANSFORMATION_THRESHOLD`), nhưng phải có
nhiều hơn MỘT lần áp dụng tích cực, không mâu thuẫn lần nào.

## Bước 6 — Approved Learning

**Vai trò là gì?** Trạng thái trung gian — tri thức đã qua đủ 5 lớp
trên, nhưng CHƯA tự động trở thành một phần của Companion. Đây là
"hàng đã qua kiểm định, chờ được tích hợp" — không phải Character ngay
lập tức.

**Điều gì được phép đi qua?** Chỉ tri thức đã qua đủ Identity → Character
→ Trust → Education → Living Wisdom Review, không có ngoại lệ, không có
đường tắt.

**Điều gì bị chặn?** Bất kỳ tri thức nào nhảy cóc một trong 5 lớp trên —
"Approved Learning" không có nghĩa là nhanh hơn, nó vẫn yêu cầu đủ trình
tự.

**Điều gì cần con người quyết định?** Thời điểm và cách thức tích hợp
Approved Learning vào Companion (qua một Sprint cụ thể) — Approved
Learning không tự động trở thành Companion, nó CHỜ một quyết định triển
khai rõ ràng.

**Điều gì cần thêm bằng chứng?** Không cần thêm — đây là điểm đã đủ
bằng chứng. Bước tiếp theo là quyết định CÁCH tích hợp, không phải kiểm
tra thêm.

## Companion

Điểm đến cuối — tri thức đã qua đủ 6 lớp trên trở thành một phần ổn
định: một dòng mới trong `CHARACTER_PROFILE`, một cập nhật cho
`docs/THE_COMPANION_CURRICULUM.md`, hoặc (ở mức xa hơn) một Heritage
Candidate theo `EXPERIENCE_LIFECYCLE.md` Bước 7. Không tri thức nào tới
được đây mà bỏ qua bất kỳ lớp nào ở trên.

## Vì sao Firewall không phải một quy trình kỹ thuật — mà là một câu hỏi mỗi lớp tự đặt ra

7 bước trên không tồn tại như code hôm nay — không có hàm
`reviewIdentity()` hay bảng `education_firewall_log`. Firewall là một
KỶ LUẬT TỰ HỎI: mỗi khi một Sprint định đưa một tri thức mới vào
Character/Education Constitution/Living Wisdom của Companion, nó phải
tự trả lời đủ 5 câu hỏi (Vai trò/Được phép/Bị chặn/Cần người/Cần bằng
chứng) cho TỪNG lớp — nếu một Sprint không thể trả lời rõ một lớp nào,
đó là dấu hiệu tri thức đó CHƯA đủ điều kiện đi qua lớp đó.

## Đối chiếu với hệ thống đã có (Audit)

| Lớp | Cơ chế thật gần nhất hôm nay | Trạng thái |
|---|---|---|
| Identity Review | `docs/THE_EXTERNAL_AI_PRINCIPLE.md` (Identity Filter, mới đặt tên) | Chỉ có khái niệm |
| Character Review | `CHARACTER_COHERENCE.md`, `CHARACTER_CONFLICT_MAP.md` | Có hành vi thật (cho xung đột nội bộ) |
| Trust Review | `THE_TRUST_WE_EARN.md`, `THE_TRUST_MUST_BE_REAL.md` | Có khái niệm, chưa có cơ chế review tự động |
| Education Review | `docs/COMPANION_EDUCATION_MAP.md`, `docs/THE_COMPANION_CURRICULUM.md` | Có khung review (5 câu hỏi), thực hiện thủ công mỗi Sprint |
| Living Wisdom Review | `docs/POSITIVE_OUTCOME.md`, `EXPERIENCE_LIFECYCLE.md` Bước 5-6 | Có định nghĩa, chưa có cơ chế đo Outcome thật |
| Approved Learning | Chưa có khái niệm tương đương trước tài liệu này | Mới |

**Kết luận audit**: Firewall hôm nay tồn tại như một CHUỖI KHÁI NIỆM đã
rải rác ở nhiều tài liệu — đóng góp của tài liệu này là XẾP CHÚNG ĐÚNG
THỨ TỰ thành một cổng duy nhất, không phải tạo ra 7 cơ chế mới. Lớp
yếu nhất hôm nay là Identity Review (mới đặt tên) và Approved Learning
(khái niệm hoàn toàn mới, chưa có gì tương đương).

## Xem tiếp

`docs/THE_EXTERNAL_AI_PRINCIPLE.md`, `docs/THE_LIFELONG_LEARNING_SYSTEM.md`,
`docs/THE_GREAT_LIBRARY.md`, `docs/POSITIVE_OUTCOME.md`,
`docs/EXPERIENCE_LIFECYCLE.md`, `docs/COMPANION_EDUCATION_MAP.md`,
`docs/THE_COMPANION_CURRICULUM.md`, `CHARACTER_CONFLICT_MAP.md`.
