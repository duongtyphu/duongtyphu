# Intelligence Graph — Sơ đồ liên kết các hệ thống Portal

> Sprint 12.0 — Nhiệm vụ 02. Mở rộng `PORTAL_INTELLIGENCE_MAP.md` (Sprint
> 10.0, mô tả luồng trải nghiệm người dùng) sang một sơ đồ **kỹ thuật**:
> mỗi node là một hệ thống/dữ liệu thật trong code, mỗi cạnh là một
> luồng đọc dữ liệu thật (không phải ẩn dụ). Không có module nào trong
> sơ đồ này được phép là một "đảo" (chỉ có cạnh đi vào, không có cạnh đi
> ra, hoặc ngược lại).

## Sơ đồ chính

```
Reflection
  ↓ (nội dung + chủ đề Reflection)
Story
  ↓ (khoảnh khắc được ghi nhận)
Garden
  ↓ (yếu tố nào đang lớn — roots/leaves/branches/...)
Knowledge
  ↓ (gợi ý bài tiếp theo theo chủ đề + Garden hiện tại)
Journey
  ↓ (cập nhật Growth Path Step / Mission milestone)
Mission
  ↓ (cột mốc vừa đạt được)
Companion
  ↓ (câu nói/trạng thái phản chiếu lại tất cả các bước trên)
Next Growth
```

`Next Growth` không phải một node kết thúc — nó vòng lại thành đầu vào
mới cho `Reflection` ở lượt tương tác sau (xem `PORTAL_INTELLIGENCE_MAP.md`
mục "luồng này không phải một con đường bắt buộc tuyến tính").

## Mỗi node biết gì về node khác (bảng phụ thuộc)

| Node | Đọc dữ liệu từ | Đưa dữ liệu cho |
|---|---|---|
| Reflection | Human Context (đang ở OS nào, vừa hành động gì) | Story, Knowledge (chủ đề) |
| Story | Reflection, Garden, Mission | Companion (khoảnh khắc để phản chiếu), Legacy |
| Garden | Reflection count, Knowledge touchpoints, Action count, Share count, Active days, Memory count | Knowledge (yếu tố nào đang yếu/mạnh), Companion (trạng thái để nói) |
| Knowledge | Reflection chủ đề, Garden (yếu tố `leaves` hiện tại), Journey (giai đoạn) | Journey, Next Step Engine |
| Journey | Knowledge vừa hoàn thành, Mission | Mission, Companion |
| Mission | Journey, Garden (`branches`) | Story, Companion |
| Companion | TẤT CẢ các node trên (qua Human Context) | Greeting/State hiển thị cho người dùng |
| Next Growth | Companion + Next Step Engine | Reflection (vòng lại) |

Đây chính là ràng buộc kỹ thuật cho **Nhiệm vụ 10 — No Silo Principle**:
một module mới muốn gia nhập sơ đồ này phải có ít nhất 3 dòng trong cột
"Đọc dữ liệu từ" hoặc "Đưa dữ liệu cho" — nếu không, nó là một module
độc lập, không được phép tồn tại theo nguyên tắc đó.

## Vì sao thứ tự là Reflection → Story → Garden → Knowledge → Journey → Mission → Companion

Thứ tự này không tuỳ ý — nó đi theo đúng cách NL05 (Phản chiếu tạo nên
trí tuệ) mô tả: hành động chỉ trở thành tri thức/trưởng thành SAU KHI
được phản chiếu (Reflection), không phải ngay khi xảy ra. Vì vậy
Reflection luôn là điểm bắt đầu của sơ đồ trí tuệ, dù về mặt trải nghiệm
người dùng có thể "vào" Portal ở bất kỳ OS nào (đúng như
`PORTAL_INTELLIGENCE_MAP.md` đã ghi).

So với `PORTAL_INTELLIGENCE_MAP.md` (luồng trải nghiệm:
`Knowledge → Practice → Reflection → Story → Garden → Companion Insight
→ Next Action → Build → Connect → Legacy`), Intelligence Graph là **góc
nhìn dữ liệu** của cùng một thực thể — không mâu thuẫn, chỉ khác lớp
trừu tượng: một tài liệu nói "người dùng trải nghiệm gì", tài liệu này
nói "hệ thống nào đọc dữ liệu của hệ thống nào".

## Cài đặt thực tế hiện tại vs. mục tiêu

| Cạnh trong sơ đồ | Hiện tại (trước Sprint 12.0) | Mục tiêu |
|---|---|---|
| Garden → Companion | Companion chỉ biết route (`getStateForPath`), không đọc `GardenState` | Companion đọc `GardenState.stage` để chọn trạng thái/lời nói |
| Reflection → Knowledge | Knowledge OS hiển thị menu tĩnh, không đọc nội dung Reflection | Knowledge Flow ưu tiên bài theo chủ đề Reflection gần nhất (Nhiệm vụ 06) |
| Mission → Story | Mission 30 ngày không tự động tạo Story entry | Mỗi cột mốc hoàn thành tạo một dòng trong Story (Nhiệm vụ 08) |
| Journey → Mission | Đã có (`growthPathSteps`, `mission30Day` cùng nằm trong `journey-hub.ts`) | Giữ nguyên, không cần thay đổi |

Đây là tài liệu kiến trúc — không có nghĩa toàn bộ cạnh "Mục tiêu" phải
được code hoá ngay trong Sprint 12.0. Bảng này là bản đồ cho các sprint
code tiếp theo, để mỗi lần code một cạnh mới, không cần thiết kế lại từ
đầu.
