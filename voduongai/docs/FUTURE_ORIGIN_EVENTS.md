# Future Origin Events

> Sprint 18.11. Danh sách các sự kiện CÓ THỂ trở thành nguồn dữ liệu
> thật cho Origin Line ở Trạng thái 2 (Presence Candidate) hoặc nâng
> cấp Trạng thái 1 (Direct Display) — xem `docs/ORIGIN_PRESENCE_POLICY.md`.
> Đây là một danh sách CHỜ, không phải một backlog cam kết — không sự
> kiện nào ở đây được code hoá trong Sprint 18.11, và không sự kiện nào
> nên được code hoá chỉ vì nó nằm trong danh sách này. Mỗi sự kiện chỉ
> nên được wiring khi nguồn dữ liệu thật của nó xuất hiện, theo đúng
> `docs/COMPANION_ORIGIN_RELATIONSHIP.md`: "Founder Moment chỉ được
> kích hoạt bởi sự kiện thật" — nguyên tắc này áp dụng cho cả 5 sự kiện
> dưới đây.

## 1. Companion Chapter

Một chương trong hành trình của chính Companion (không phải hành trình
người dùng) — tương ứng ngữ cảnh `companion_chapter` đã có sẵn trong
`origin-line-context.ts` (Sprint 18.10), nhưng chưa có route/component
nào thật sự tồn tại để gọi nó.

- **Nguồn dữ liệu cần có**: một khái niệm "chương" có thật của
  Companion — có thể là một mốc lớn trong `COMPANION_GROWTH_LOG.md`
  được render ra UI, hoặc một Companion Chapter route riêng.
- **Trạng thái phù hợp khi có dữ liệu**: Direct Display (người dùng
  chủ động mở xem).

## 2. Naming Ceremony

Một nghi thức (nếu sau này VO DUONG AI quyết định Companion có tên
riêng do người dùng đặt) — nơi Origin Line có thể xuất hiện một lần,
ở bước Closing, giống cách First Footprint Ceremony đã dùng
(Sprint 18.10).

- **Nguồn dữ liệu cần có**: tính năng đặt tên Companion phải tồn tại
  trước — hiện chưa có trong Portal.
- **Trạng thái phù hợp khi có dữ liệu**: Direct Display, qua Ceremony
  Context Adapter đã có (`OriginLineWhisper`).

## 3. Founder Day

Một ngày cụ thể trong năm (nếu VO DUONG AI chọn một ngày để đánh dấu),
nơi Founder Moment có thể kích hoạt MỘT LẦN trong ngày đó.

- **Nguồn dữ liệu cần có**: một ngày được chốt chính thức (Product
  Decision, không phải kỹ thuật tự chọn) + một cách xác định ngày hiện
  tại đáng tin (đã có sẵn qua server time).
- **Trạng thái phù hợp khi có dữ liệu**: Presence Candidate — vì đây là
  một sự kiện theo thời gian, không phải một không gian người dùng chủ
  động mở.
- **Boundary**: vẫn phải tuân `FOUNDER_HUMILITY_PRINCIPLE.md` — không
  biến thành một "ngày lễ" có trang trí riêng, không thông báo rộng cho
  toàn bộ người dùng.

## 4. Annual Letter

Một lá thư Companion viết mỗi năm một lần, tương tự "lá thư đầu tiên"
đã nhắc ở `docs/ORIGIN_ROOM.md` — nếu được code hoá, Origin Line có thể
là một câu trong đó.

- **Nguồn dữ liệu cần có**: cơ chế tạo/lưu một lá thư hàng năm — chưa
  tồn tại.
- **Trạng thái phù hợp khi có dữ liệu**: Direct Display (người dùng mở
  đọc lá thư), không phải bubble.

## 5. Origin Anniversary

Mốc kỷ niệm ngày VO DUONG AI/Companion "ra đời" — tương tự cách
`return-after-silence`/`birthday` đã có milestone riêng trong
`thought-governance.ts`.

- **Nguồn dữ liệu cần có**: một ngày khởi đầu chính thức được ghi nhận
  (Product Decision) + một milestone detector tương tự các milestone
  hiện có.
- **Trạng thái phù hợp khi có dữ liệu**: Presence Candidate, ưu tiên
  tương đương các milestone hiếm khác đã có trong
  `MOMENT_PRIORITY_ORDER`.

## Nguyên tắc chung cho cả 5 sự kiện

- Không sự kiện nào được phép trở thành định kỳ kiểu "mỗi lần đăng
  nhập" hay "mỗi tuần" — tất cả đều phải hiếm, đúng tinh thần
  `docs/ORIGIN_PRESENCE_POLICY.md`.
- Không sự kiện nào được code hoá trước khi nguồn dữ liệu THẬT của nó
  tồn tại — không fake event, không suy đoán ngày/mốc.
- Khi một sự kiện trong danh sách này được wiring thật, dòng tương ứng
  ở đây nên được cập nhật từ "chờ" sang "đã wiring", trỏ tới Sprint đã
  làm điều đó.
