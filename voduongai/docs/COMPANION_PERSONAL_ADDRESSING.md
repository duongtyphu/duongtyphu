# Companion Personal Addressing

> Sprint — Personal Addressing. "Companion học cách gọi một con người
> bằng cách họ muốn được gọi." Xem
> `src/lib/portal/companion/companion-address.ts`.

## Vì sao "bạn" là mặc định, không phải lỗi

Khi Companion chưa biết tên một người, nó gọi "bạn" — không phải vì
thiếu dữ liệu là một khiếm khuyết cần lấp đầy bằng mọi giá, mà vì "bạn"
trong tiếng Việt đã là một cách gọi tôn trọng, ấm áp, không xa lạ. Một
người dùng mới không cần Companion "biết tên mình ngay" để cảm thấy
được chào đón — họ cần Companion không đoán bừa, không suy luận, không
biến một khoảng trống dữ liệu thành một hành vi xâm phạm.

## Vì sao Companion dùng tên khi đã biết

Khi một người tự nguyện cung cấp tên (`full_name` hôm nay; `preferred_name`
nếu tương lai schema có thêm), Companion dùng tên đó để người dùng cảm
thấy được NHẬN RA — không phải để "trông cá nhân hoá hơn" theo kiểu
marketing, mà vì một người đồng hành thật sẽ gọi đúng tên người mình
đang đồng hành cùng, ở đúng khoảnh khắc đáng để gọi.

## Vì sao không lạm dụng tên

Nhắc tên ở mọi câu là dấu hiệu của một kịch bản marketing
("Xin chào {name}! Hôm nay {name} đã..."), không phải của một người
bạn thật. Người thật chỉ gọi tên nhau ở những khoảnh khắc có ý nghĩa —
lúc gặp lại, lúc chúc mừng, lúc tâm sự — không ở mọi câu giao tiếp
thường ngày. `shouldUseUserName(context)` mã hoá đúng giới hạn này:
Greeting, Birthday, Return After Silence, Reflection Letter, Life
Moment, First Footprint, Mirror, Story → cho phép; generic tip, CTA,
error message → không, vì gọi tên ở đó giả tạo, không tự nhiên.

## Hai helper

- `getCompanionAddress(profile)` — trả về cách gọi theo thứ tự ưu tiên
  `preferredName` → `displayName` → `fullName` → `"bạn"`. Không bao giờ
  trả về chuỗi rỗng.
- `shouldUseUserName(context)` — trả về `true`/`false` theo allowlist
  ngữ cảnh cố định ở trên; không có ngoại lệ runtime, không có cấu hình
  ẩn để mở rộng ngầm danh sách này.
- `withPersonalAddress(line, profile, context)` — hàm tổng hợp dùng ở
  hầu hết các điểm tích hợp: nếu context không cho phép hoặc không có
  tên thật, trả về câu gốc không đổi; nếu có, THÊM một lời gọi ở ĐẦU câu
  (`"{tên} ơi, ..."`) — không thay thế từ "bạn" nằm giữa câu có sẵn.

## Vì sao thêm-ở-đầu, không thay-thế-giữa-câu

`LIFE_MOMENT_LINES` (`life-moment-lines.ts`) là một thư viện câu tiếng
Việt viết tay, mỗi câu đã đặt "bạn" đúng vị trí ngữ pháp giữa câu (ví
dụ: "Mình rất vui vì được biết bạn."). Thay thế trực tiếp "bạn" → tên
ở đó rủi ro phá ngữ pháp hoặc làm câu nghe ngượng. Giải pháp an toàn:
giữ nguyên câu gốc, chỉ thêm một lời gọi tên ở đầu khi điều kiện cho
phép — tự nhiên trong tiếng Việt nói, không đụng vào cấu trúc câu đã
viết tay cẩn thận.

## Privacy/Trust Rule (bắt buộc)

- KHÔNG suy luận tên từ bất kỳ nguồn nào ngoài dữ liệu người dùng đã tự
  nguyện cung cấp.
- KHÔNG bao giờ dùng email (hoặc phần trước `@`) làm tên.
- KHÔNG gọi bằng tên trừ khi context nằm trong allowlist của
  `shouldUseUserName`.
- Khi `preferred_name` tồn tại trong schema ở tương lai, nó PHẢI được
  ưu tiên cao nhất — `getCompanionAddress` đã viết sẵn đúng thứ tự này.

## Nơi đã áp dụng

- `CompanionGreetingBubble.tsx` — lời chào đầu/mừng gặp lại (context
  `"greeting"`).
- `LifeMomentBubble.tsx` — Life Moment/Birthday (context `"life_moment"`
  hoặc `"birthday"` theo `moment.type`).
- `ReturnAfterSilenceCeremony.tsx` — câu mở "Chào bạn." → "Chào {tên}."
  khi có tên thật (context `"return_after_silence"`, áp dụng trực tiếp
  vì câu này đã ở đầu câu, an toàn để thay).

## Trường hợp KHÔNG áp dụng — vì sao

- `reflection-letter.ts` chỉ là khung xét điều kiện (`buildReflectionLetterFramework`)
  để quyết định những phần nào của một Lá thư Phản chiếu có đủ chất
  liệu thật — câu văn thật do CON NGƯỜI vận hành Companion viết tay, không
  phải sinh tự động. Helper addressing ở đây chỉ có ý nghĩa như một
  GỢI Ý cho người viết (gọi đúng tên người nhận thư), không thể "áp
  dụng" vào code vì không có chuỗi văn bản nào được sinh ra ở đây để
  can thiệp.
- Mirror, Story, Companion page, Daily Thought, Inner Thought: hôm nay
  các nơi này hiển thị nội dung đã có sẵn (signal/insight đã tính toán),
  không phải câu chào trực tiếp tới một người — không có điểm tự nhiên
  nào để chèn một lời gọi tên mà không làm hỏng nội dung đang hiển thị.
  Education Debt: nếu các nơi này trong tương lai có một dòng mở đầu
  dạng "lời chào", cùng `withPersonalAddress()` này nên được áp dụng,
  không cần phát minh lại.

## Education Debt

- Schema hôm nay chưa có `preferred_name`/`display_name` — chỉ có
  `full_name`. Helper đã viết sẵn đúng thứ tự ưu tiên cho ngày schema
  có thêm field đó, không cần đổi chữ ký hàm khi đó xảy ra.
- Chưa có cơ chế nào ép buộc một điểm tích hợp copy MỚI trong tương lai
  phải dùng `shouldUseUserName`/`withPersonalAddress` — vẫn là một kỷ
  luật tự giác của người viết code, giống nhiều giới hạn khác đã ghi
  nhận trong các tài liệu Architecture Directive trước.

## Xem tiếp

`src/lib/portal/companion/companion-address.ts`,
`src/lib/portal/companion/companion-identity.ts` (tên của CHÍNH
Companion, không liên quan tới file này),
`docs/THE_TRUST_MUST_BE_REAL.md`, `docs/THE_30_YEAR_TRUST_PRINCIPLE.md`.
