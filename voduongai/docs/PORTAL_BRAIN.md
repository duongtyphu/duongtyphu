# Portal Brain — Tầng điều phối trải nghiệm

> Sprint 12.0 — Nhiệm vụ 01. Đây là tài liệu kiến trúc, không phải tính
> năng mới và không phải AI/LLM mới. Portal Brain mô tả lại — bằng một
> tên gọi và một sơ đồ duy nhất — cách các hệ thống đã tồn tại
> (Companion, Living Garden, My Story, Knowledge, Journey) NÊN quyết
> định cùng nhau, thay vì quyết định riêng lẻ như hiện tại. Phục vụ
> trực tiếp NL05 (Phản chiếu tạo nên trí tuệ), NL06 (Companion đồng
> hành), NL07 (Garden phản ánh trưởng thành) trong
> `FIRST_PRINCIPLES_OF_VO_DUONG_AI.md`.

## Portal Brain là gì

**Portal Brain KHÔNG phải AI. KHÔNG phải LLM. KHÔNG phải Chatbot.**

Portal Brain là **tầng điều phối** — một tập hợp quy tắc đọc lại dữ liệu
đã có ở nhiều hệ thống (Reflection, Garden, Story, Knowledge, Journey) và
quyết định một đầu ra nhất quán cho trải nghiệm tiếp theo của người dùng.
Nó không tạo dữ liệu mới, không gọi mô hình ngôn ngữ nào — nó là **logic
tổng hợp** (aggregation + decision logic), giống cách `garden-model.ts`
đã đọc lại dữ liệu Reflection/Action để suy ra trạng thái Garden, nhưng
mở rộng phạm vi ra toàn bộ Portal thay vì chỉ một module.

Có thể hiểu Portal Brain như một hàm thuần (pure function) ở mức ý
tưởng:

```
PortalBrainOutput = decide(HumanContext, GardenState, StoryThread, KnowledgeGraphPosition, JourneyState)
```

không phải một dịch vụ gọi mạng, không phải một bảng dữ liệu mới.

## Portal Brain quyết định gì

| Câu hỏi | Hệ thống nhận quyết định |
|---|---|
| Companion nên nói gì lúc này? | `CompanionGreetingBubble`, `CompanionSpace` |
| Living Garden nên nhấn vào yếu tố nào? | `LivingGardenCard` (roots/leaves/branches/...) |
| Story nên ghi nhận điều gì là một khoảnh khắc? | My Story timeline |
| Knowledge nên gợi ý bài nào tiếp theo? | Knowledge Flow (xem Nhiệm vụ 06) |
| Next Best Action là gì? | Next Step engine (xem Nhiệm vụ 04) |
| Khi nào Portal nên im lặng? | Mọi hệ thống trên — không có gợi ý nào ép ra nếu không có đủ tín hiệu |

**"Khi nào nên im lặng" là một quyết định ngang hàng với các quyết định
khác** — không phải trường hợp ngoại lệ. Nếu Human Context chưa rõ
(người dùng mới chưa có Reflection nào, hoặc dữ liệu không đủ để suy ra
một gợi ý có ý nghĩa), Portal Brain trả về "không gợi ý gì" thay vì một
gợi ý ngẫu nhiên/mặc định — đúng tinh thần Companion "chờ, không thúc
giục" (`LIVING_GARDEN.md`).

## Vì sao cần một tên gọi chung

Trước Sprint 12.0, các quyết định này đã tồn tại nhưng nằm rải rác và
độc lập:

- `getStateForPath` (`companion-identity.ts`) quyết định trạng thái
  Companion — chỉ dựa vào route, không biết Garden hay Reflection.
- `buildGardenState` (`garden-model.ts`) quyết định trạng thái Garden —
  chỉ dựa vào số lượng hành động, không biết Companion đang nói gì.
- Next Best Action (nếu có) — hiện chưa có engine thật, các gợi ý nội
  dung liên quan hiện dựa vào danh sách tĩnh theo OS.

Portal Brain không thay thế các hàm này — nó là **lớp gọi chúng theo
đúng thứ tự, với cùng một Human Context làm đầu vào chung**, để
Companion, Garden, Story, Knowledge không còn "không biết" lẫn nhau.

## Quan hệ với Human Context Engine, Knowledge Flow, Next Step Engine

Portal Brain là tầng trên cùng — ba tài liệu/thiết kế sau là các thành
phần Portal Brain gọi tới:

- `HUMAN_CONTEXT` (Nhiệm vụ 03) — Portal Brain luôn bắt đầu bằng việc
  xác định Human Context trước khi quyết định bất kỳ điều gì khác.
- Next Step Engine (Nhiệm vụ 04) — một trong các đầu ra chính của Portal
  Brain.
- Knowledge Flow (Nhiệm vụ 06) — một đầu ra khác, áp dụng riêng cho
  Knowledge OS.

## Điều Portal Brain tuyệt đối không làm

- Không phải một dịch vụ AI/LLM thật — Sprint 12.0 chỉ thiết kế kiến
  trúc và quy tắc, không tích hợp mô hình nào.
- Không tạo bảng dữ liệu mới riêng cho "Brain" — nó đọc lại dữ liệu đã
  có ở Reflection/Garden/Story/Knowledge/Journey, đúng nguyên tắc đã
  giữ từ `LIVING_GARDEN.md` ("không tự ý thêm nguồn dữ liệu mới").
- Không ép ra một gợi ý khi dữ liệu chưa đủ — im lặng là một đầu ra hợp
  lệ, không phải lỗi.
- Không hiển thị logic quyết định này cho người dùng dưới dạng "vì bạn
  đạt X điểm nên Portal gợi ý Y" — người dùng chỉ thấy kết quả tự nhiên
  (một câu nói của Companion, một gợi ý bài học), không thấy "bộ não"
  đứng sau nó.
