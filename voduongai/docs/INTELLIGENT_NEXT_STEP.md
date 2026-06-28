# Intelligent Next Step Engine

> Sprint 12.0 — Nhiệm vụ 04. Thiết kế kiến trúc — không phải code engine
> thật. Phục vụ NL04 (Học phải đi cùng hành động), NL09 (Mỗi hành động
> đều để lại dấu chân).

## Câu hỏi engine phải trả lời

> "Hôm nay điều gì là bước nhỏ nhưng đúng nhất?"

Không phải "bước lớn nhất", không phải "bước tiếp theo theo thứ tự
menu" — một bước **nhỏ** (giữ đúng tinh thần "đồng hành, không tạo áp
lực" — NL06) và **đúng nhất** với người này, lúc này.

## Đầu vào (không còn Random)

Trước Sprint 12.0, các gợi ý "tiếp theo" trong Portal (nếu có) chủ yếu
dựa vào thứ tự tĩnh trong danh sách module (`hubs.ts`,
`journey-hub.ts`). Intelligent Next Step thay thế nguồn này bằng 7 đầu
vào, đúng theo yêu cầu Sprint:

| Đầu vào | Nguồn dữ liệu thật |
|---|---|
| Reflection | Nội dung/chủ đề Reflection gần nhất |
| Story | Khoảnh khắc gần nhất được ghi nhận trong My Story |
| Garden | `GardenState` — yếu tố nào đang yếu (chưa có hoặc thấp), yếu tố nào đang mạnh |
| Journey | `GrowthPathStep` hiện tại (`status: "current"`) trong `journey-hub.ts` |
| Human Context | Context vừa suy ra ở `HUMAN_CONTEXT_ENGINE.md` |
| Learning DNA | Cách người dùng học (xem `THE_LEARNING_DNA.md` — ví dụ ưu tiên học qua thực hành hay đọc trước) |
| Human OS | Layer nào trong 8 layer (`HUMAN_OPERATING_SYSTEM.md`) đang yếu nhất với người này |

## Logic quyết định (mô tả, không phải pseudo-code thực thi)

Engine ưu tiên theo thứ tự sau — dừng ở bước đầu tiên có tín hiệu rõ:

1. **Có một `GrowthPathStep` đang `current` chưa có hành động tương
   ứng?** → gợi ý bước hành động cho đúng step đó (giữ NL04: học đi
   cùng hành động — không để người dùng "biết" mà chưa "làm").
2. **Garden có một yếu tố đang rất yếu trong khi các yếu tố khác đang
   mạnh (mất cân bằng)?** → gợi ý hành động lấp đúng yếu tố yếu đó (ví
   dụ: nhiều `leaves` — đã học nhiều — nhưng `branches` thấp — chưa hành
   động → gợi ý một bài thực hành, không phải một bài đọc thêm).
3. **Reflection gần nhất có một chủ đề rõ ràng chưa được tiếp nối?** →
   gợi ý nội dung Knowledge nối tiếp đúng chủ đề đó (xem
   `KNOWLEDGE_EVOLUTION.md` ở Nhiệm vụ 06).
4. **Không có tín hiệu nào đủ rõ (người mới, hoặc dữ liệu quá ít)?** →
   không ép ra gợi ý "tiếp theo" — quay về gợi ý nền tảng nhất của OS mà
   người dùng đang đứng (ví dụ "Bắt đầu" trong Journey OS) — không phải
   gợi ý ngẫu nhiên.

Bước 4 là sự khác biệt quan trọng nhất so với "Random": **không có dữ
liệu thì không có gợi ý cá nhân hoá**, hệ thống lùi về một gợi ý trung
lập, an toàn — không bao giờ tự bịa một gợi ý "thông minh" từ dữ liệu
không tồn tại.

## Đầu ra

Một "Next Best Action" là một bộ tối thiểu gồm: nhãn hành động, lý do
ngắn (tuỳ chọn — chỉ hiện nếu giúp người dùng hiểu vì sao, không bắt
buộc), và đường dẫn. Không có điểm "độ phù hợp %" hiển thị ra UI (tránh
biến gợi ý thành điểm số — vi phạm NL07).

## Quan hệ với Portal Brain

Next Step Engine là MỘT trong các đầu ra Portal Brain tạo ra
(`PORTAL_BRAIN.md` mục "Portal Brain quyết định gì") — không phải một
hệ thống độc lập đứng song song với Portal Brain.

## Điều tuyệt đối không làm

- Không dùng RNG/`Math.random()` hay thứ tự cố định làm nguồn quyết
  định chính — nếu không có tín hiệu thật, trả về gợi ý nền tảng trung
  lập (bước 4), không trả về một lựa chọn ngẫu nhiên giả làm "thông
  minh".
- Không gợi ý nhiều hơn một Next Best Action nổi bật cùng lúc — nhiều
  gợi ý cùng lúc tạo cảm giác danh sách việc cần làm (to-do list áp
  lực), trái NL06.
- Không lặp lại đúng một gợi ý nhiều lần nếu người dùng đã bỏ qua —
  cần một cách "biết" gợi ý đã được đưa ra trước đó (chi tiết kỹ thuật
  để lại cho sprint code, nhưng nguyên tắc phải được giữ từ thiết kế).
