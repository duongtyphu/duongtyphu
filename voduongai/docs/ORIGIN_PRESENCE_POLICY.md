# Origin Presence Policy

> Sprint 18.11. Chuẩn hoá chính sách hiện diện của Origin Memory — đứng
> cạnh `docs/product-bible/BOOK_CORE_MEMORY.md` (Sprint 18.9, cổng kiến
> trúc), `docs/PRESENCE_COORDINATOR.md` (Sprint 18.8/18.10, candidate
> governance) và `docs/ORIGIN_LINE_CONTEXT` (`origin-line-context.ts`,
> Sprint 18.10, ngữ cảnh + tần suất). Tài liệu này KHÔNG thêm cơ chế
> mới — nó trả lời câu hỏi đứng trên cả ba: Origin Memory NÊN xuất hiện
> theo cách nào, ở đâu, và khi nào nó nên im lặng.

## Ba trạng thái hiện diện của Origin Memory

Origin Memory (`origin-memory.ts`, 12 ký ức gốc + 1 ký ức Founder) có
đúng ba cách được phép "có mặt" trong Portal — không có cách thứ tư:

### 1. Direct Display — hiển thị trực tiếp

Origin Line được in ra như một dòng chữ tĩnh, tại một không gian người
dùng đã CHỦ ĐỘNG đến để nhìn lại nguồn gốc.

- **Khi nào dùng**: Origin Room (`/portal/origin`), và các "không gian
  nhìn lại" tương tự nếu sau này có (Companion Chapter — xem
  `FUTURE_ORIGIN_EVENTS.md`).
- **Đặc điểm**: không bubble, không animation thu hút chú ý, không
  CTA. Người dùng đã ở trong một không gian dành riêng cho việc nhìn
  lại — Origin Line chỉ là một phần nội dung của không gian đó, không
  phải một thông báo cạnh tranh sự chú ý.
- **Cơ chế hiện có**: `getOriginLineFromCoreMemory()` (cổng) +
  `OriginLineWhisper` (Frequency Guard, tối đa 1 lần/ngày tại Origin
  Room).

### 2. Presence Candidate — qua Presence Coordinator

Origin Line cạnh tranh với các candidate khác (Daily Thought, Greeting,
Life Moment...) để trở thành MỘT bubble hiện diện duy nhất, qua
`chooseCompanionMoment()`.

- **Khi nào dùng**: CHỈ khi có một sự kiện thật, rời rạc, đáng kể —
  không phải một trang người dùng ghé thường xuyên. Ví dụ tương lai:
  Founder Day, Origin Anniversary (xem `FUTURE_ORIGIN_EVENTS.md`).
- **Đặc điểm**: phải đi qua đúng `PresenceServerState.originLineContext`
  → `buildPresenceCandidates()` → `chooseCompanionMoment()`, đúng thứ tự
  ưu tiên đã định nghĩa ở Sprint 18.6 (`MOMENT_PRIORITY_ORDER`) — không
  có ma trận xung đột riêng cho Origin Line.
- **Trạng thái hiện tại (Sprint 18.11)**: đây là một **future hook** —
  cổng đã mở (Sprint 18.9), nhưng KHÔNG có nguồn dữ liệu thật nào set
  `originLineContext` ngày hôm nay. Xem mục Technical Debt ở
  `PRESENCE_COORDINATOR.md`.

### 3. Silent Core Memory — im lặng, chỉ là nền

Origin Memory không phát ra một câu nói nào — nó chỉ tồn tại như ràng
buộc hành vi nền, đọc qua `getCoreMemoryConstraints()`, ảnh hưởng cách
các engine khác (Thought Selector, Companion Decision) ra quyết định mà
không bao giờ hiển thị trực tiếp.

- **Khi nào dùng**: MẶC ĐỊNH, ở mọi nơi khác ngoài hai trường hợp trên.
  Đây là trạng thái bình thường của Origin Memory trong suốt phần lớn
  hành trình người dùng — không phải một trường hợp đặc biệt cần xử lý
  riêng.
- **Đặc điểm**: không UI, không câu nói, không candidate.

## Luật quyết định (decision rule)

Khi xét một nơi gọi mới có nên hiển thị Origin Line không, hỏi theo thứ
tự:

1. Người dùng có đang ở một không gian họ CHỦ ĐỘNG chọn để nhìn lại
   nguồn gốc không? → **Direct Display** (Trạng thái 1).
2. Có một sự kiện THẬT, rời rạc, hiếm, đã thật sự xảy ra (không phải
   suy đoán/giả định) không? → **Presence Candidate** (Trạng thái 2),
   và CHỈ khi nguồn dữ liệu cho sự kiện đó đã tồn tại.
3. Không thoả cả hai → **Silent Core Memory** (Trạng thái 3). Đây là
   câu trả lời đúng cho phần lớn các trường hợp — im lặng không phải
   một thiếu sót, nó là hành vi đúng.

## Vì sao không tạo `origin_room_visits` ngay

Brief Sprint 18.11 chủ động không yêu cầu bảng dữ liệu mới. Founder
Moment/Special Ritual/`origin_line` candidate vẫn ở Trạng thái 3 (Silent
Core Memory) cho đến khi một nguồn dữ liệu THẬT (không phải suy đoán)
xuất hiện — xem `COMPANION_ORIGIN_RELATIONSHIP.md` (Founder Moment chỉ
được kích hoạt bởi sự kiện thật) và `FUTURE_ORIGIN_EVENTS.md` (danh sách
sự kiện có thể trở thành nguồn dữ liệu đó trong tương lai).

## Quan hệ với các tài liệu khác

- `docs/product-bible/BOOK_CORE_MEMORY.md` — cổng kiến trúc
  (`getOriginLineFromCoreMemory()`), không đổi.
- `src/lib/portal/companion/origin-line-context.ts` — tầng tần suất/
  ngữ cảnh cho Trạng thái 1 (Direct Display) đã code hoá ở Sprint 18.10.
- `docs/PRESENCE_COORDINATOR.md` — chi tiết kỹ thuật của Trạng thái 2.
- `docs/FUTURE_ORIGIN_EVENTS.md` — danh sách sự kiện có thể nâng Origin
  Line từ Trạng thái 3 lên Trạng thái 1/2 trong các sprint sau.
