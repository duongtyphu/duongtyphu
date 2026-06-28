# Sprint 12.0 Review — The Intelligence Layer

> Sprint thuần kiến trúc/tài liệu — không thêm tính năng, không thêm
> UI, không tích hợp AI/LLM thật. Tất cả các "engine" mô tả trong Sprint
> này là THIẾT KẾ, đọc lại dữ liệu đã tồn tại (Reflection, Garden,
> Story, Knowledge, Journey, Mission) — chưa có dòng code triển khai
> nào được viết trong sprint này, đúng giới hạn "không code" trừ khi
> được giao rõ (Sprint này không được giao "audit + code").

## Nhiệm vụ 11 — Intelligence Review (tự trả lời trước khi tổng kết)

**Nếu bỏ Companion, Portal còn thông minh không?**
Không. Companion là nơi DUY NHẤT toàn bộ Human Context + Companion
Memory + Portal Brain output hội tụ thành một phản hồi con người có thể
cảm nhận được. Không có Companion, các engine khác (Knowledge Flow,
Next Step) vẫn chạy được về mặt logic, nhưng người dùng không có ai
"nói" những điều đó cho họ — trí tuệ tồn tại nhưng không có giọng nói.

**Nếu bỏ Garden, Portal còn hiểu con người không?**
Không đầy đủ. Garden là nguồn DUY NHẤT tổng hợp một bức tranh trưởng
thành đa chiều (học/hành động/phản chiếu/chia sẻ/kiên trì) từ nhiều OS
khác nhau. Without Garden, Portal vẫn biết từng sự kiện rời rạc
(Reflection này, hành động đó) nhưng mất đi lớp tổng hợp "con người này
đang lớn lên theo cách nào" — đây chính là input chính cho Next Step
Engine ở bước 2 (mất cân bằng yếu tố).

**Nếu bỏ Story, Portal còn nhớ người dùng không?**
Còn nhớ DỮ LIỆU (Reflection, Garden snapshot vẫn còn), nhưng KHÔNG còn
nhớ HÀNH TRÌNH — không còn nơi nối các sự kiện cách xa nhau về thời gian
thành một điểm chuyển có ý nghĩa ("từ người chỉ học Prompt, đã bắt đầu
giúp người khác"). Story là bộ nhớ DÀI HẠN duy nhất; Companion Memory
(Sprint 12.0) chỉ giữ phần GẦN NHẤT.

→ Theo đúng tiêu chí Nhiệm vụ 11: cả ba câu trả lời đều là **Không** (ở
các mức độ khác nhau) — đây là dấu hiệu kiến trúc ĐÚNG: Companion,
Garden, Story phụ thuộc lẫn nhau, không hệ thống nào có thể bị xoá mà
không để lại một lỗ hổng trí tuệ thật. Sprint 12.0 không cần thay đổi gì
thêm ở điểm này — nó chỉ cần đảm bảo các phụ thuộc NÀY được hiện thực
hoá đúng (xem cột "Mục tiêu" ở `INTELLIGENCE_GRAPH.md` — phần lớn vẫn
là thiết kế, chưa code).

## Nhiệm vụ 12 — Sprint Review

**Portal Brain là gì?**
Tầng điều phối, không phải AI/LLM/Chatbot — quyết định Companion nói gì,
Garden nhấn yếu tố nào, Knowledge gợi ý gì, Next Step là gì, và khi nào
nên im lặng — bằng cách đọc lại Human Context + Garden + Story +
Knowledge + Journey, không tạo dữ liệu mới. Chi tiết: `PORTAL_BRAIN.md`.

**Human Context hoạt động thế nào?**
Suy ra (không lưu trữ) một trong 8 ngữ cảnh tối thiểu (new/returning/
learning/practicing/losing_momentum/just_completed/stuck/thriving) từ
dữ liệu Reflection/Garden/Journey/Mission đã có, để Companion không
dùng cùng một cách nói cho mọi người. Chi tiết: `HUMAN_CONTEXT_ENGINE.md`.

**Knowledge Evolution khác hiện tại ra sao?**
Hiện tại: menu tĩnh, thứ tự giống nhau cho mọi người. Sau Sprint 12.0
(khi được code hoá): một lớp Knowledge Flow chọn điểm bắt đầu trong
Knowledge Graph đã có (`VO_DUONG_AI_KNOWLEDGE_GRAPH.md`) dựa theo chủ đề
Reflection gần nhất — đi theo các cạnh `leads_to` đã thiết kế sẵn, không
phải gợi ý ngẫu nhiên. Chi tiết: `KNOWLEDGE_EVOLUTION.md`.

**Garden Evolution khác hiện tại ra sao?**
Hiện tại: `buildGardenState` chỉ tính MỘT `GardenStage` tổng từ tổng số
hành động. Garden Evolution thêm một lớp diễn giải "đang lớn theo CÁCH
nào" (học nhiều/hành động nhiều/phản chiếu nhiều/chia sẻ nhiều/kiên
trì) từ CHÍNH các input đã có — không thêm input, không dùng điểm/Level.
Chi tiết: `LIVING_GARDEN.md` mục "Garden Evolution (Sprint 12.0)".

**Story Evolution khác hiện tại ra sao?**
Hiện tại: My Story (nếu hiển thị) gần với một Log theo thời gian. Story
Evolution tìm một điểm đầu và một điểm chuyển BẢN CHẤT (không chỉ số
lượng) trong lịch sử hành động, diễn đạt thành một câu "từ... bạn đã...”
— chỉ khi dữ liệu đủ để xác định một điểm chuyển thật, không bịa khi
chưa đủ. Chi tiết: `STORY_EVOLUTION.md`.

**Companion thay đổi thế nào?**
Từ chỉ phản hồi theo ROUTE (`getStateForPath`) sang phản hồi theo giao
của ROUTE + HUMAN CONTEXT + COMPANION MEMORY (chủ đề đang theo đuổi,
cách học, điều thường Reflection, điều đang cố thay đổi, bước tiến đáng
nhớ) — không cần AI Memory ngữ nghĩa thật, dùng kiến trúc 3 lớp (Raw
History → Memory Summary → Companion Expression). Chi tiết:
`COMPANION_MEMORY_EVOLUTION.md`.

**Portal Intelligence Map gồm gì?**
`User → Context → Brain → Knowledge → Action → Reflection → Story →
Garden → Companion → Next Growth` (vòng lại User) — kèm bảng gắn mỗi
bước với nguyên lý Hiến pháp nó phục vụ, và bảng so sánh với V1 (luồng
trải nghiệm) để làm rõ V2 là luồng QUYẾT ĐỊNH, không thay thế V1. Chi
tiết: `PORTAL_INTELLIGENCE_MAP_V2.md`.

**Có module nào vẫn còn đứng độc lập không?**
Có — và đây là disclosure trung thực, không che giấu: tại thời điểm kết
thúc Sprint 12.0, PHẦN LỚN các "cạnh" trong `INTELLIGENCE_GRAPH.md` cột
"Mục tiêu" vẫn CHƯA được code hoá (Companion chưa thực sự đọc
`GardenState`, Knowledge OS chưa thực sự đọc chủ đề Reflection, Mission
chưa tự động tạo Story entry). Sprint này xây xong BẢN ĐỒ và QUY TẮC
(Portal Brain, Human Context, các Evolution) nhưng chưa nối các module
thật bằng code — đó chính là Technical Debt rõ ràng nhất.

**Technical Debt.**
1. `companion-identity.ts` chưa nhận `GardenState`/`HumanContext` làm
   tham số — vẫn chỉ nhận `pathname`.
2. `garden-model.ts` chưa có hàm tính "cách lớn lên" (Garden Evolution)
   — hiện chỉ có `GardenStage` tổng.
3. Chưa có hàm/engine thật cho Human Context, Next Step, Knowledge
   Flow, Story Evolution — toàn bộ đang ở dạng thiết kế trong docs.
4. Chưa có cơ chế lưu "đã gợi ý Next Step nào trước đó" để tránh lặp lại
   gợi ý bị bỏ qua (nêu trong `INTELLIGENT_NEXT_STEP.md` nhưng chưa thiết
   kế chi tiết kỹ thuật).

**Đề xuất Sprint tiếp theo (Sprint 12.1 — gợi ý, chưa thực hiện):**
Code hoá MỘT cạnh trong Intelligence Graph trước, làm bằng chứng sống
("Portal đã có một bộ não, không chỉ một bản đồ bộ não") — đề xuất bắt
đầu từ cạnh **Garden → Companion** (rủi ro thấp nhất, không cần sửa dữ
liệu mới, chỉ cần `CompanionPresence`/`CompanionSpace` đọc thêm
`GardenState` bên cạnh `pathname` hiện có) trước khi mở rộng sang
Knowledge Flow và Next Step Engine.

## Definition of Done — tự đánh giá trung thực

Founder yêu cầu: "Portal không còn là tập hợp các tính năng. Portal đã
bắt đầu có một bộ não."

**Đánh giá thật:** Portal đã có TÊN GỌI, SƠ ĐỒ, và QUY TẮC cho một bộ
não (Portal Brain, Intelligence Graph, Human Context, các Evolution,
No Silo Principle) — đây là điều kiện CẦN. Điều kiện ĐỦ — bộ não đó thực
sự VẬN HÀNH trong code, người dùng thực sự cảm nhận được Companion nói
khác đi vì Garden khác đi — CHƯA đạt trong Sprint này. Sprint 12.0 hoàn
thành đúng phạm vi được giao (kiến trúc, không code), nhưng Product Team
nên hiểu Definition of Done ở mức "đã thiết kế bộ não", chưa ở mức "bộ
não đã sống" — đó là việc của Sprint 12.1 trở đi.
