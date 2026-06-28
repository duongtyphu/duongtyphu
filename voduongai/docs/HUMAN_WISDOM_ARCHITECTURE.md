# Human Wisdom Architecture

> Tài liệu này định nghĩa cách Portal chuyển từ "nơi chứa nội dung" sang
> "hệ thống trí tuệ" — nơi mỗi OS dạy bằng một hệ tư duy, không phải bằng
> một danh sách module.

## 0. Vì sao tài liệu này tồn tại

Portal hiện có 5 "OS" (Journey, Knowledge, Build, Connect, Legacy), mỗi
OS chứa nhiều module. Nhưng module không phải là tri thức — module chỉ là
*nơi chứa* tri thức. Nếu người dùng đi qua 5 OS mà không hiểu **vì sao**
mình cần đi qua, Portal chỉ là một menu lớn, không phải một người thầy.

Tài liệu này là nền tảng cho 4 tài liệu còn lại của Sprint 10.0:
- `PORTAL_CONTENT_STANDARD.md` — cấu trúc bắt buộc cho từng nội dung.
- `OS_CONTENT_BLUEPRINT.md` — bản thiết kế chiều sâu cho từng OS.
- `PORTAL_INTELLIGENCE_MAP.md` — luồng kết nối giữa các phần của Portal.
- `COMPANION_GROWTH_LOG.md` — ghi lại điều Companion vừa học.

⸻

## 1. Portal Wisdom Audit

### Journey OS

- **Đang dạy điều gì?** Đang dạy "bạn đang ở đâu" — có Hero, Current
  Journey Card, Growth Path Timeline, Mission 30 Day Card, Human Growth
  Detail, Milestone Card, AI Journey Coach. Đây là OS có cấu trúc tường
  thuật nhiều nhất trong 5 OS.
- **Thiếu chiều sâu gì?** Có nhiều thành phần nhưng chưa có một câu hỏi
  lớn xuyên suốt — mỗi thành phần đứng độc lập, chưa được giới thiệu như
  câu trả lời cho một câu hỏi chung.
- **Có còn giống danh sách module không?** Ít hơn 4 OS khác, nhưng phần
  cuối trang vẫn rơi về `HubModuleGrid` — tức là vẫn kết thúc bằng danh
  sách.
- **Người dùng có hiểu vì sao họ cần đi qua OS này không?** Một phần —
  Hero hiện tại nói "mỗi bước nhỏ hôm nay sẽ tạo nên phiên bản tốt hơn",
  nhưng chưa đặt rõ câu hỏi mà OS này đang trả lời.
- **Liên kết với Companion?** Có — `companion-identity.ts` map
  `/portal/journey` → trạng thái idle (mặc định), nhưng chưa có dòng copy
  nào nói rõ vai trò của Companion ở đây.
- **Liên kết với Living Garden?** Chưa trực tiếp — Journey OS chưa nhắc
  đến khu vườn dù về bản chất đây là OS gần nhất với "trưởng thành".
- **Có dẫn tới hành động và Reflection không?** Có hành động (Mission,
  Milestone) nhưng chưa có Reflection rõ ràng gắn với từng bước.

### Knowledge OS

- **Đang dạy điều gì?** Đang dạy "tri thức AI thực chiến" qua Learning
  Path Grid, Academy Section, Resource Library Grid, Practice Zone.
- **Thiếu chiều sâu gì?** Cấu trúc phẳng hơn Journey OS — chủ yếu là một
  chuỗi grid/list nối tiếp nhau, thiếu một mạch tư duy nối các phần.
- **Có còn giống danh sách module không?** Có — đây là OS gần nhất với
  "danh sách module" trong 5 OS hiện tại.
- **Người dùng có hiểu vì sao họ cần đi qua OS này không?** Một phần —
  subtitle hiện tại ("Mọi năng lực đều bắt đầu từ việc học đúng...") nói
  về cách học, chưa nói về *điều cần thay đổi trong tư duy*.
- **Liên kết với Companion?** Có — map sang trạng thái thinking, nhưng
  chưa thể hiện trong copy.
- **Liên kết với Living Garden?** Chưa — Knowledge OS lẽ ra nên gắn với
  "lá" (leaves = học) trong Living Garden nhưng chưa có dòng nào nhắc.
- **Có dẫn tới hành động và Reflection không?** Có Practice Zone (hành
  động) nhưng không có Reflection được đặt câu hỏi rõ ràng sau khi học.

### Build OS

- **Đang dạy điều gì?** Đang dạy cách biến tri thức thành giá trị, qua
  Build Pillars, Build Engine Tabs (income/brand/system/premium), Project
  Opportunity Section, AI Build Coach.
- **Thiếu chiều sâu gì?** Các tab đã có subtitle nhưng subtitle mới mô tả
  *cái gì có trong tab*, chưa mô tả *nguyên lý* — ví dụ "Các nguồn thu
  nhập bạn có thể bắt đầu xây dựng ngay hôm nay" là mô tả nội dung, không
  phải nguyên lý.
- **Có còn giống danh sách module không?** Một phần — tab + subtitle đã
  tốt hơn module list thuần, nhưng vẫn là liệt kê các hướng đi, chưa dẫn
  người dùng qua một phương pháp.
- **Người dùng có hiểu vì sao họ cần đi qua OS này không?** Có phần —
  Hero hiện tại ("Học tập chỉ là điểm khởi đầu...") đã khá sâu, gần với
  Big Question chính thức.
- **Liên kết với Companion?** Có — map sang trạng thái encouraging,
  nhưng chưa có copy thể hiện.
- **Liên kết với Living Garden?** Chưa — Build OS lẽ ra gắn với "nhánh"
  (branches = thực hành) và "hoa" (flowers = chia sẻ).
- **Có dẫn tới hành động và Reflection không?** Có hành động (Project
  Opportunity) nhưng chưa có Reflection.

### Connect OS

- **Đang dạy điều gì?** Đang dạy việc kết nối qua Connect Pillars, Connect
  Engine Tabs (community/event/achievement/opportunity/contribution),
  Human Network Card.
- **Thiếu chiều sâu gì?** Tương tự Build OS — đã có tab + subtitle nhưng
  vẫn là liệt kê các *kiểu* kết nối, chưa trả lời "nên đồng hành cùng ai
  và vì sao".
- **Có còn giống danh sách module không?** Có — đặc biệt module
  "Leaderboard" trong `hubs.ts` (xem mục 4 — Tension Point) khiến OS này
  có dấu hiệu gamification, mâu thuẫn với nguyên tắc Sprint 9.0.
- **Người dùng có hiểu vì sao họ cần đi qua OS này không?** Một phần —
  Hero "Không ai tiến hóa một mình" đã có cảm xúc nhưng chưa nối với câu
  hỏi "nên đồng hành cùng ai".
- **Liên kết với Companion?** Có — map sang trạng thái encouraging.
- **Liên kết với Living Garden?** Chưa trực tiếp, dù về bản chất Connect
  OS gần nhất với "nước" (water = giúp người khác) trong Living Garden.
- **Có dẫn tới hành động và Reflection không?** Có hành động (tham gia
  event/cộng đồng) nhưng chưa có Reflection.

### Legacy OS

- **Đang dạy điều gì?** Hiện tại gần như không dạy gì — trang chỉ có
  `PageHeader` (title + subtitle từ `hubs.ts`) và `HubModuleGrid`. Không
  có Hero riêng, không có philosophy, không có nguyên lý.
- **Thiếu chiều sâu gì?** Thiếu toàn bộ — đây là OS nông nhất trong 5 OS.
- **Có còn giống danh sách module không?** Có, hoàn toàn — đây gần như
  chỉ là một trang module list thuần.
- **Người dùng có hiểu vì sao họ cần đi qua OS này không?** Không — chưa
  có gì giải thích vì sao "di sản" quan trọng.
- **Liên kết với Companion?** Có map kỹ thuật (trạng thái listening)
  nhưng không có copy nào thể hiện trên trang.
- **Liên kết với Living Garden?** Không — đây là OS lẽ ra gắn chặt nhất
  với "gems" (những ký ức được lưu giữ) nhưng chưa có liên kết nào.
- **Có dẫn tới hành động và Reflection không?** Không — không có
  Reflection, không có hành động cụ thể nào được gợi ý.

⸻

## 2. Big Question Framework

Mỗi phần của Portal cần trả lời được một câu hỏi lớn — câu hỏi này không
nhất thiết hiển thị nguyên văn trên UI, nhưng phải là kim chỉ nam cho mọi
copy, Hero, và nội dung bên trong:

| Phần | Big Question |
|---|---|
| Journey OS | "Mình đang ở đâu trên hành trình trưởng thành?" |
| Knowledge OS | "Điều gì mình cần hiểu để thay đổi?" |
| Build OS | "Làm sao tạo ra giá trị thật?" |
| Connect OS | "Mình nên đồng hành cùng ai?" |
| Legacy OS | "Điều gì sẽ còn lại sau tất cả?" |
| My Story | "Mình đã trở thành ai?" |
| Living Garden | "Mình đang lớn lên từng ngày như thế nào?" |
| Companion | "Mình không cần đi một mình." |

Big Question của 5 OS được đưa vào JSDoc `/** Answers: "..." */` của từng
Hero component (xem Nhiệm vụ 8) và phản chiếu trong subtitle hiển thị,
không cần hiển thị nguyên văn dấu ngoặc kép trên UI.

⸻

## 3. Wisdom Layer — 9 lớp cho mỗi OS

Mỗi OS được thiết kế qua 9 lớp tư duy. Build OS dùng làm ví dụ chuẩn
(verbatim từ Founder Message):

1. **Philosophy** — Vì sao OS này tồn tại?
   *"Thu nhập bền vững bắt đầu từ năng lực tạo ra giá trị."*
2. **Principle** — Nguyên lý cốt lõi.
   *"Đừng bắt đầu bằng việc bán. Hãy bắt đầu bằng việc giúp."*
3. **Method** — Phương pháp áp dụng.
   *"Chọn một vấn đề nhỏ, tạo một giải pháp nhỏ, kiểm chứng với một nhóm
   người thật."*
4. **Practice** — Bài thực hành.
   *"Tạo một landing page đơn giản cho một ý tưởng."*
5. **Reflection** — Câu hỏi suy ngẫm.
   *"Hôm nay mình đã tạo ra giá trị gì, dù rất nhỏ?"*
6. **Action** — Việc cần làm.
   *"Chia sẻ bản thử nghiệm đầu tiên."*
7. **Story** — Dấu chân lưu vào My Story.
   *"Dấu mốc kiến tạo đầu tiên."*
8. **Garden** — Tác động tới Living Garden.
   *"Một nhánh mới xuất hiện trong khu vườn."*
9. **Companion** — Companion nên nói gì ở đây?
   *"Một bước nhỏ hôm nay cũng có thể trở thành nền móng cho điều lớn
   hơn."*

Wisdom Layer đầy đủ cho cả 5 OS được trình bày chi tiết trong
`OS_CONTENT_BLUEPRINT.md`.

⸻

## 4. Tension Point cần lưu ý (không tự xử lý)

`hubs.ts` — module `connect` hiện có:

```
{ label: "Leaderboard", description: "Bảng xếp hạng những viên ngọc sáng nhất." }
```

Đây mâu thuẫn trực tiếp với nguyên tắc "không gamification" được thiết
lập từ Sprint 9.0 (`LIVING_GARDEN.md`). Sprint 10.0 **không** tự xoá hoặc
đổi tên module này vì việc đó nằm ngoài phạm vi "áp dụng copy cho Hero"
(Nhiệm vụ 8) và là một thay đổi điều hướng/tính năng, không phải nội
dung. Cần Product Team quyết định riêng việc giữ/đổi/xoá module này.

⸻

## 5. Companion + Living Garden + Portal — mối liên kết

- **Companion** = người đồng hành, không phải trợ lý tra cứu.
- **Living Garden** = hình ảnh của sự trưởng thành, không phải điểm số.
- **Portal** = nguồn trí tuệ nuôi dưỡng hành trình — mỗi OS là một cách
  tiếp cận khác nhau tới cùng một sự trưởng thành.

Ba phần này được nối bằng ngôn ngữ: mỗi Hero OS nói về *điều người dùng
cần hiểu*; Companion nói về *cách đồng hành qua điều đó*; Living Garden
phản chiếu *kết quả của việc đã đi qua*. Không phần nào thay thế phần
còn lại.
