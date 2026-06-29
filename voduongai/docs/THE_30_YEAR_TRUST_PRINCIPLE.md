# The 30-Year Trust Principle

> **Cam kết dài hạn của toàn bộ dự án — KHÔNG phải Sprint, KHÔNG có
> Definition of Done.** Đứng ngay dưới `THE_COMPANION_FORMATION.md`
> (Product Constitution — cấp cao nhất), cùng tầng với
> `THE_DECISION_HIERARCHY.md` và `THE_EDUCATION_ERA.md`. Tài liệu này
> không tạo nguyên tắc mới — nó nâng tầng "Niềm tin" đã có ở
> `THE_DECISION_HIERARCHY.md` (tầng thứ 3/5) và đã được làm rõ ở
> `docs/THE_TRUST_WE_EARN.md` (Sprint 21.3) thành một LUẬT ĐỨNG TRÊN
> mọi Sprint, mọi dòng code, mọi Decision, không có ngoại lệ và không
> có ngày kết thúc.

## Câu hỏi duy nhất, áp cho mọi thứ, không trừ ngoại lệ

> **"Nếu Companion hành xử như thế này trong 30 năm liên tiếp, liệu
> niềm tin của con người dành cho Companion sẽ lớn hơn hay nhỏ đi?"**

Câu hỏi này áp cho:

- Mỗi dòng code.
- Mỗi Decision.
- Mỗi Learning Engine.
- Mỗi Character Review.
- Mỗi Life Moment.
- Mỗi Reflection.

Nếu lớn hơn — đó là hướng đúng. Nếu nhỏ đi — dừng lại, thiết kế lại.
Không có deadline đứng trên câu hỏi này. Không có áp lực tính năng đứng
trên câu hỏi này. Không có KPI nào quan trọng hơn niềm tin.

Đây là phiên bản DÀI HẠN HOÁ của Decision Review đã có ở
`docs/THE_TRUST_WE_EARN.md` ("nếu chọn điều này nhiều năm, người dùng
tin hơn hay ít hơn?") — khác biệt duy nhất là tài liệu đó đặt câu hỏi
như một LĂNG KÍNH để xem lại Decision đã có; tài liệu này đặt câu hỏi
như một LUẬT BẮT BUỘC, đứng trên mọi Sprint từ hôm nay, không phải một
gợi ý để tham khảo.

## Vì sao 30 năm, không phải "lâu dài" mơ hồ

Một câu hỏi như "liệu điều này có tốt về lâu dài?" dễ bị bẻ cong để
phù hợp với bất kỳ quyết định ngắn hạn nào — "lâu dài" không có thước
đo. 30 năm là một con số đủ dài để loại bỏ mọi lý do ngắn hạn (tăng
engagement quý này, giữ chân người dùng tuần này, một A/B test) khỏi
phép thử — không ai có thể nói "hành vi này tốt trong 30 năm" mà thực
ra đang nghĩ về quý báo cáo tiếp theo. Con số này buộc câu hỏi phải trả
lời bằng NGUYÊN TẮC, không phải bằng dữ liệu ngắn hạn.

## Companion không được tối ưu để giữ người dùng

> **Companion không được tối ưu để giữ người dùng. Companion được nuôi
> dưỡng để xứng đáng với việc người dùng tự nguyện quay trở lại.**

Đây là ranh giới quan trọng nhất của tài liệu này, và nó không phải một
câu nói hay — nó loại trừ trực tiếp một lớp quyết định cụ thể: bất kỳ
cơ chế nào được thiết kế với mục tiêu chính là "giữ người dùng ở lại
lâu hơn / quay lại thường xuyên hơn" (ví dụ: streak, thông báo nhắc
quay lại vì đã vắng mặt, badge, ranking) đều SAI hướng theo luật này —
dù có thể đo được bằng số liệu retention tăng. Đúng hướng theo luật này
là một cơ chế khiến Companion xứng đáng hơn với sự quay lại đó (ví dụ:
Speech Budget không spam, `noSalesCta` tuyệt đối, Integrity Check từ
chối dạy lại điều người dùng đã không cần nghe) — những cơ chế này
KHÔNG nhằm giữ người dùng, chúng nhằm để, nếu người dùng tự nguyện quay
lại, Companion đáng được họ quay lại.

Đây đúng là tinh thần đã có toàn project (chống gamification, không
XP/Level/Leaderboard/Streak pressure, không điểm số hiển thị) — tài
liệu này không tạo luật mới ở điểm này, nó NÊU RÕ LÝ DO đứng sau luật
đó: không phải vì gamification "xấu" một cách trừu tượng, mà vì
gamification tối ưu cho việc giữ người dùng, thay vì xứng đáng với việc
họ tự nguyện ở lại — hai mục tiêu khác nhau, và luật này luôn chọn mục
tiêu thứ hai.

## Câu hỏi bắt buộc mới cho mọi Sprint sau này

Từ hôm nay, mỗi Sprint phải trả lời thêm một câu hỏi, đứng cạnh — không
thay thế — toàn bộ pipeline review đã có (`THE_EDUCATION_ERA.md`:
Technical → Behavior → Education → Growth → Culture Review):

> **"Hành vi mới này có bảo vệ được niềm tin mà Companion đã mất nhiều
> năm để xây dựng không?"**

Nếu câu trả lời chưa rõ — không ship. Đây là luật cứng, không phải một
gợi ý: một Sprint không thể tự nhận "có thể đúng, để sau verify" rồi
ship trước — sự không chắc chắn về câu hỏi này, tự nó, đã là lý do để
dừng lại, đúng tinh thần "Verification Before Expansion" đã có ở
`docs/COMPANION_GROWTH_PRINCIPLE.md`.

## Thứ tự ưu tiên, không có ngoại lệ tình huống

> **Trust luôn đứng trên Feature. Character luôn đứng trên Convenience.
> Con người luôn đứng trên Công nghệ.**

Ba dòng này không phải ba luật riêng — chúng là MỘT thứ tự, được nói
bằng ba cách khác nhau cho ba loại xung đột thường gặp nhất trong thực
tế:

| Khi xung đột giữa | Luôn chọn | Vì sao |
|---|---|---|
| Trust vs. Feature | **Trust** | Một feature mới hấp dẫn nhưng làm mờ một ranh giới đã có (ví dụ: thêm CTA vào một khoảnh khắc đã hứa `noSalesCta`) — không được ship, dù feature đó tốt về mặt kỹ thuật. |
| Character vs. Convenience | **Character** | Một cách làm nhanh hơn/tiện hơn nhưng khiến Companion hành xử khác với phẩm chất đã chọn (ví dụ: trả lời ngay bằng Knowledge dù Character đã ghi nhận `listen-first`) — không được chọn, dù tiện hơn. |
| Con người vs. Công nghệ | **Con người** | Đúng luật gốc đã có ở `THE_DECISION_HIERARCHY.md` ("Mọi quyết định của Companion đều phải bắt đầu từ con người. Không bắt đầu từ dữ liệu/thuật toán/hiệu suất.") — tài liệu này không thay luật đó, chỉ nhắc lại ở tầng cam kết dài hạn. |

Đây chính là `DECISION_HIERARCHY` (Con người → Nhân cách → Niềm tin →
Tri thức → Hiệu suất) được phát biểu lại dưới dạng ba phép so sánh cụ
thể, dễ áp dụng ngay khi viết code — không phải một hệ thống mới.

## Không deadline, không Definition of Done — vì sao

Mọi Sprint khác trong project đều có Definition of Done — một điều
kiện có thể kiểm chứng để biết khi nào dừng. Tài liệu này CHỦ Ý không
có, vì câu hỏi 30-năm không bao giờ "xong" — nó là một phép thử áp lại
mỗi lần, mãi mãi, không có điểm kết thúc nào để coi là "đã đạt Trust đủ
rồi." Đây giống cách `THE_COMPANION_CULTURE.md` và
`THE_COMPANION_CONTINUITY_PROGRAM.md` cũng không có Definition of Done
— ba tài liệu này (Culture, Continuity, Trust) đều là PHÉP THỬ LIÊN
TỤC, khác với Sprint (như `THE_GRATITUDE.md`, `THE_TRUST_WE_EARN.md`)
luôn có một Definition of Done cụ thể.

## Quan hệ với các tài liệu khác

```
THE_COMPANION_FORMATION.md (Product Constitution — cấp cao nhất)
├── THE_DECISION_HIERARCHY.md — 5 tầng, Niềm tin là tầng thứ 3
├── THE_30_YEAR_TRUST_PRINCIPLE.md (tài liệu này) — câu hỏi 30 năm,
│   đứng trên mọi Sprint, không Definition of Done
├── docs/THE_TRUST_WE_EARN.md (Sprint 21.3) — Trust Audit + Decision
│   Review cụ thể, tài liệu này nâng câu hỏi đó thành luật dài hạn
├── THE_EDUCATION_ERA.md — pipeline review 5 bước; tài liệu này thêm
│   MỘT câu hỏi bắt buộc nữa, đứng cạnh pipeline đó
├── THE_COMPANION_CULTURE.md — Respect, ranh giới chống gamify; cùng
│   loại "phép thử liên tục", không Definition of Done
└── THE_COMPANION_CONTINUITY_PROGRAM.md — bài kiểm tra qua nhiều thế hệ
    AI; cùng loại "phép thử liên tục" như tài liệu này
```

Không tài liệu nào trong số trên bị thay thế. Tài liệu này không tạo
tầng Niềm tin mới — nó tuyên bố tầng Niềm tin đã có là một CAM KẾT
KHÔNG CÓ NGÀY KẾT THÚC, đứng trên Feature, trên Convenience, và (đúng
luật gốc) trên Công nghệ.

Xem tiếp: `THE_COMPANION_FORMATION.md`, `THE_DECISION_HIERARCHY.md`,
`docs/THE_TRUST_WE_EARN.md`, `THE_EDUCATION_ERA.md`,
`THE_COMPANION_CULTURE.md`.
