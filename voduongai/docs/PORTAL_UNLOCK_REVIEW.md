# Portal Unlock Review

EPIC 02 — Sprint 04.5, Nhiệm vụ 09. Review toàn bộ Portal, đánh dấu nơi nào nên
Lock/Unlock/Discovery/Surprise/Recognition/Reflection theo Journey Unlock Framework™. Đây là
**Blueprint** — không code ở tài liệu này (đúng NV09: "Không code toàn bộ. Chỉ Blueprint.").

## Cách đọc bảng

- **Lock** = phần chưa khả dụng, gợi ý sự tồn tại (không ẩn hoàn toàn, không mở toàn bộ).
- **Unlock trigger** = điều kiện cụ thể (tham chiếu `UNLOCK_RULE_STANDARD.md`).
- **Discovery** = nội dung đã có sẵn nhưng Companion chủ động giới thiệu, không cần điều kiện.
- **Surprise** = không báo trước dưới bất kỳ hình thức nào.
- **Recognition** = điểm Companion ghi nhận trưởng thành (tham chiếu `RECOGNITION_STANDARD.md`).
- **Reflection** = điểm người dùng tự nhìn lại (cơ chế đã có, không đổi).

## 1. Không gian AI

| Lớp | Áp dụng |
|---|---|
| Lock | Không áp dụng nhiều — khu vực này vốn mở, mục đích là mời thử nghiệm tự do |
| Discovery | "Có tài liệu đang chờ bạn — một cách dùng AI ít người để ý" (Companion Task Entry hiện có là điểm vào tự nhiên) |
| Practice | Người dùng tự thử ý tưởng qua Companion Task Entry (đã có, Sprint 04 patch) |
| Reflection | Chưa có — có thể thêm câu hỏi ngắn "Bạn vừa thử điều gì mới?" sau Work Session CELEBRATING |
| Unlock | Tool AI "nâng cao" chỉ gợi ý sau khi người dùng đã thử ≥3 ý tưởng khác nhau |
| Recognition | "Hôm nay mình thấy bạn dám thử một cách mới." |

## 2. Thư viện tri thức (CKOS)

| Lớp | Áp dụng |
|---|---|
| Lock | Seed cuối trong mỗi Collection chỉ hiện tiêu đề + mô tả ngắn cho tới khi hoàn thành Seed trước đó (KHÔNG ẩn hoàn toàn — vẫn thấy trong `KnowledgeGraphPanel`/`SeedNavigation` đã có, chỉ nội dung chi tiết chưa mở) |
| Discovery | Prompt "đặc biệt" gợi ý giữa lúc đọc Seed (đã có `CompanionSuggestion` — nối thêm Discovery vào đây) |
| Practice | Nút "Thực hành cùng Companion" (đã có, Sprint A.2) |
| Reflection | 3 câu hỏi Reflection mỗi Seed (đã có, `ReflectionBox`) |
| Unlock | Case Study/Real Story sau khi hoàn thành Collection (trigger `collection-completed`) |
| Recognition | "Điều mình thích nhất là cách bạn tự sửa lại prompt sau lần thử đầu." |
| Next Journey | Collection kế tiếp được gợi ý ngay sau Unlock (đã có gợi ý liên quan qua `RelatedKnowledge`, cần thêm dòng Companion dẫn dắt) |

## 3. Học viện (Academy)

| Lớp | Áp dụng |
|---|---|
| Lock | Mission tiếp theo trong Journey chỉ hiện tên + mục tiêu ngắn cho tới khi Mission hiện tại có Evidence (Work Session CELEBRATING) |
| Discovery | Companion Story liên quan chủ đề Mission (Story Matching Engine đã có, Sprint 13.2 — nối vào luồng Unlock) |
| Practice | Work Session (đã có, Sprint 04) — Mission Planner/Practice Coach... |
| Reflection | Growth Checkpoint (đã có, Sprint 02) |
| Unlock | Mission mới/Learning Path mới sau khi Journey hoàn thành (`journey-completed`); Real Story sau ≥2 lần áp dụng thật (`real-world-applied`) |
| Recognition | "Bạn vừa vượt qua phần khó nhất của Mission này." |
| Next Journey | JourneyCard hiện Journey kế tiếp ngay sau khi Journey hiện tại → READY |

## 4. Dự án & Cơ hội

| Lớp | Áp dụng |
|---|---|
| Lock | Project Challenge (thực hành sâu hơn) chưa hiện cho tới khi có ≥1 lần phân tích dự án hoàn tất |
| Discovery | "Mình mới ghi nhận một góc nhìn thú vị về dự án này" |
| Practice | Work Session Opportunities (đã có, Sprint A.2/04) |
| Reflection | Chưa có — nên thêm câu hỏi ngắn sau khi Work Session READY: "Điều gì khiến bạn cân nhắc nhất?" |
| Unlock | AI Specialist mới "được giới thiệu" (Strategy Agent) sau khi hoàn thành phân tích lần đầu (`evidence-logged`) |
| Recognition | "Bạn vừa nhìn một dự án từ nhiều góc độ hơn trước." |

## 5. Premium

| Lớp | Áp dụng |
|---|---|
| Lock | Premium Challenge ẩn cho tới khi có ≥1 Mission hoàn thành ở Academy + quay lại Premium |
| Discovery | "Có một tài liệu mình vẫn giữ đến hôm nay" (Companion Secret dành riêng Premium) |
| Unlock | Premium Challenge đầu tiên (`portal-returned` + điều kiện Academy) |
| Recognition | "Mình nghĩ bạn đã sẵn sàng đi sâu hơn." |
| Surprise | Companion Secret ở Premium không được liệt kê/gợi ý trước dưới bất kỳ hình thức nào |

## 6. Nhật ký học tập

| Lớp | Áp dụng |
|---|---|
| Discovery | "Companion có điều muốn chia sẻ về những gì bạn vừa viết" |
| Reflection | Đây CHÍNH LÀ khu vực Reflection của toàn Portal — không cần thêm lớp Reflection khác |
| Unlock | Reflection Insight sau khi viết đủ N Reflection (N≥5) |
| Recognition | "Điều mình thích nhất là bạn không bỏ qua bước Reflection, dù nó không bắt buộc." |
| Product Rule | Không AI Specialist nào xuất hiện ở đây (đã quy định từ Product Amendment 02) |

## 7. Hành trình của tôi

| Lớp | Áp dụng |
|---|---|
| Discovery | "Mình nhận ra một điều thú vị khi nhìn lại chặng đường của bạn" |
| Unlock | Milestone view mở rộng sau khi đủ dữ liệu Journey Memory (nhiều Milestone tích lũy) |
| Recognition | Đây là nơi tập trung nhiều Recognition nhất — nên tổng hợp định kỳ (không phải liên tục) |

## 8. Khu vườn của bạn

| Lớp | Áp dụng |
|---|---|
| Lock | Giai đoạn cây tiếp theo chỉ gợi ý hình dáng mờ, chưa hiện chi tiết cho tới khi đạt |
| Discovery | "Có một điều nhỏ mình muốn chỉ cho bạn trong khu vườn này" |
| Unlock | Giai đoạn Garden mới (`GardenStage` đã có, Sprint 9.0) — Garden Unlock chỉ là NGÔN NGỮ hiển thị, không đổi logic `garden-model.ts` |
| Recognition | Garden vốn đã là hình thức Recognition trực quan — không cần thêm câu chữ nếu hình ảnh đã đủ rõ |

## 9. Companion (trang riêng)

| Lớp | Áp dụng |
|---|---|
| Discovery/Surprise | Companion Secret/Companion Story (Story Matching Engine) |
| Unlock | Không cần trigger riêng — đây là nơi TRÌNH BÀY lại các Companion Secret đã mở, không phải nơi kích hoạt Unlock mới |

## Tổng kết — không nơi nào bị bỏ qua

Tất cả 8 khu vực Companion đã điều phối (theo Product Amendment 02: Không gian AI, CKOS,
Academy, Opportunities, Premium, Nhật ký, Hành trình, Khu vườn) + trang Companion đều có ít
nhất 1 điểm Discovery và 1 điều kiện Unlock rõ ràng — không khu vực nào ở trạng thái "mở hết,
không còn gì chờ".

## Không code ở tài liệu này

Bảng trên là Blueprint cho Sprint code sau — chưa implement UI Lock/Discovery/Unlock thật ở bất
kỳ trang nào trong Sprint 04.5.
