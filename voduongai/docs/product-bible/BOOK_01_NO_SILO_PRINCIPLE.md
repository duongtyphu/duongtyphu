# Product Bible — Chapter 01: No Silo Principle

> Phục vụ nguyên lý: NL05 (Phản chiếu tạo nên trí tuệ), NL06 (Companion
> đồng hành), NL07 (Garden phản ánh trưởng thành). Đúng quy tắc
> `BOOK_00_CONSTITUTION.md` đã đặt ra: mọi chương Product Bible mới phải
> mở đầu bằng việc xác định nó đang phục vụ nguyên lý nào.

## Quy tắc

**Một module mới không được phép tồn tại nếu nó không kết nối với ít
nhất ba hệ thống khác đã có trong Portal** (Companion, Living Garden, My
Story, Knowledge, Journey, Mission, hoặc một module khác đã được Product
Team chấp thuận trước).

"Kết nối" ở đây có nghĩa cụ thể, không phải ẩn dụ: module đó phải xuất
hiện như một node thật trong `INTELLIGENCE_GRAPH.md` — có ít nhất 3 dòng
ở cột "Đọc dữ liệu từ" hoặc "Đưa dữ liệu cho" trỏ tới các hệ thống khác.
Nếu không, module đó là một module độc lập (silo) và không nên được xuất
bản.

## Vì sao nguyên tắc này tồn tại

Sprint 12.0 (The Intelligence Layer) phát hiện ra rằng phần lớn các hệ
thống lớn của Portal (Companion, Living Garden, My Story, Knowledge,
Journey) đã được xây đúng, nhưng hoạt động như những hệ thống RIÊNG —
Companion không đọc Garden, Knowledge không đọc Reflection, Story không
tự động ghi nhận Mission. Founder gọi đây là vấn đề của một "tập hợp
tính năng" thay vì một "sinh thể". No Silo Principle là cách ngăn vấn đề
này lặp lại với mọi module được xây từ Sprint 12.0 trở đi.

## Cách áp dụng khi đề xuất một module mới

Trước khi viết code cho một module mới, người đề xuất phải trả lời:

1. Module này đọc dữ liệu từ hệ thống nào đã có? (ít nhất 1)
2. Module này đưa dữ liệu/tín hiệu gì cho hệ thống nào khác? (ít nhất 1
   khác với câu 1)
3. Nếu xoá module này, có hệ thống nào khác bị "mất một tín hiệu" mà nó
   từng cung cấp không? Nếu câu trả lời là "không, không ai nhận ra
   khác biệt" — module đó có khả năng là một silo, cần Product Team xem
   lại trước khi xây.

Ba câu trả lời trên cộng lại phải chỉ ra **ít nhất 3 hệ thống khác**
(không lặp lại cùng một hệ thống ba lần).

## Quan hệ với Portal Brain / Intelligence Graph

No Silo Principle là quy tắc QUẢN TRỊ (governance) — nó không tự động
kiểm tra bằng code. `INTELLIGENCE_GRAPH.md` là công cụ để kiểm tra thủ
công: vẽ thêm module mới vào sơ đồ, nếu nó chỉ có cạnh đi vào hoặc chỉ
có cạnh đi ra (không phải cả hai, với ít nhất 3 hệ thống khác tổng
cộng), nguyên tắc này coi đó là vi phạm.

## Ví dụ đúng/sai

**Sai (silo):** Một module "Daily Quote" hiển thị một câu trích dẫn
ngẫu nhiên mỗi ngày — không đọc dữ liệu người dùng, không ghi gì vào
Story/Garden, không liên quan tới Reflection hay Journey. Đây là một
tiện ích trang trí, không phải một phần của sinh thể Portal.

**Đúng (kết nối ≥3 hệ thống):** Module "30 ngày đầu tiên" (sau khi sửa ở
Sprint 11.2) — đọc dữ liệu từ Journey (`growthPathSteps`), góp tín hiệu
vào Garden (`branches`/`actionsCompleted`), và khi hoàn thành một cột
mốc, tạo một khoảnh khắc trong Story (theo `STORY_EVOLUTION.md`) — 3 hệ
thống khác nhau.

## Ngoại lệ

Một số module thực sự mang tính tiện ích hành chính, không thuộc luồng
trưởng thành (ví dụ: trang Hỗ trợ, Cài đặt tài khoản, trang Thanh toán)
— các module này KHÔNG bắt buộc tuân theo No Silo Principle, vì chúng
không thuộc phạm vi "hệ thần kinh" của Portal, chúng là hạ tầng vận
hành. Ranh giới: nếu module phục vụ trực tiếp hành trình trưởng thành
của người dùng (Knowledge/Journey/Build/Connect/Legacy/Companion/
Garden/Story), nó phải tuân theo nguyên tắc này; nếu chỉ phục vụ vận
hành/tài khoản, nó được miễn.
