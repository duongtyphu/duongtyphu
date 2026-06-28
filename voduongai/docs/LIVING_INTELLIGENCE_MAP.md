# Living Intelligence Map

> Đặt toàn bộ hệ thống Portal hiện có vào đúng vị trí trong Living
> Intelligence Framework V1 và Cycle (`LIVING_INTELLIGENCE_FOUNDATION.md`).
> Không thay thế `PORTAL_INTELLIGENCE_MAP_V2.md` (vốn mô tả luồng tín
> hiệu kỹ thuật Human Signals → Internal Voices → Portal Brain →
> Companion) — tài liệu này đứng ở một tầng cao hơn: vị trí của mỗi hệ
> thống trong lĩnh vực tri thức Living Intelligence, không phải trong
> luồng dữ liệu kỹ thuật.

## Bản đồ theo Framework V1 (7 trụ cột)

| Trụ cột | Hệ thống Portal | Vai trò trong trụ cột |
|---|---|---|
| Awareness | Portal Brain, Human Signals, Internal Voices | Lắng nghe tín hiệu con người, quyết định Companion nên đồng hành thế nào lúc này |
| Reflection | Reflection Journal, Reflection Meaning Engine | Biến trải nghiệm thô thành ý nghĩa, không chấm điểm độ sâu |
| Understanding | Knowledge OS, Knowledge Graph, Knowledge Flow | Kết nối ý nghĩa cá nhân với một nguyên lý/khái niệm chung |
| Action | Build OS, Next Action, Practice/Daily Mission | Tri thức phải dẫn tới một hành động cụ thể, dù nhỏ |
| Connection | Connect OS, Companion, Community | Đồng hành và được đồng hành — không điều khiển, không áp đặt |
| Transformation | Living Garden, My Story | Phản ánh sự trưởng thành đã diễn ra, không phải thành tích |
| Legacy | Legacy OS, Memory Capsule | Giữ lại điều quan trọng nhất sau cùng: một con người đã thay đổi ra sao |

Journey OS không thuộc riêng một trụ cột — nó là **lát cắt thời gian**
xuyên suốt cả 7 trụ cột (vị trí hiện tại của một người trên toàn bộ
hành trình), giống cách Companion không thuộc riêng một bước trong
Cycle.

## Bản đồ theo Living Intelligence Cycle (9 bước)

| Bước Cycle | Hệ thống Portal hiện thực hóa | Trạng thái (Sprint 12.3) |
|---|---|---|
| Experience | Practice, Knowledge content, sự kiện đời thường | Không có "engine" riêng — trải nghiệm xảy ra ngoài Portal, Portal chỉ là nơi nó được ghi nhận lại |
| Reflection | Reflection Journal | Có code thật (`reflections.ts`) |
| Meaning | Reflection Meaning Engine (`reflection-meaning.ts`) | Có code thật — kiến trúc rule-based, CHƯA nối với dữ liệu Reflection thật (xem `REFLECTION_MEANING_ENGINE.md`, mục Technical Debt) |
| Knowledge | Knowledge OS, Knowledge Graph | Có code thật, CHƯA đọc `reflectionMeaning` để gợi ý nội dung tiếp theo |
| Action | Build OS, Next Action | Có thiết kế (`INTELLIGENT_NEXT_STEP.md`), một phần có code |
| Story | My Story, `STORY_EVOLUTION.md` | Có code thật cho milestone, CHƯA tự động ghi nhận mọi Action |
| Growth | Living Garden (`garden-model.ts`) | Có code thật — chỉ cộng, không bao giờ trừ |
| Contribution | Connect OS, Community | Có thiết kế, phần lớn chưa có code (V1 silo có chủ đích) |
| New Experience | (vòng lặp quay lại Experience) | Không có engine — đây là điểm Portal chủ động "lùi lại", không cố gắng kiểm soát trải nghiệm tiếp theo của người dùng (NL06) |

## Vị trí của Portal Brain / Internal Voices trong bản đồ

Portal Brain và Internal Voices không nằm Ở MỘT trụ cột hay MỘT bước
Cycle — chúng là **hạ tầng lắng nghe xuyên suốt toàn bộ bản đồ**: mọi
tín hiệu từ mọi trụ cột (Garden từ Transformation, Reflection từ
Reflection, Knowledge từ Understanding...) đều đi qua Internal Voices
trước khi Portal Brain quyết định Companion nên nói gì. Nói cách khác:
Portal Brain là tầng điều phối của *toàn bộ* bản đồ này, không phải
một ô trong bản đồ.

## Vì sao bản đồ này còn nhiều khoảng trống

Không phải mọi ô trong hai bảng trên đều đã có code thật — đây là điều
có chủ đích, không phải thiếu sót cần lấp đầy ngay. No Silo Principle
(`product-bible/BOOK_01_NO_SILO_PRINCIPLE.md`) đã từng cảnh báo: xây
nhanh một hệ thống không kết nối còn hại hơn không xây. Bản đồ này tồn
tại để mỗi Sprint sau biết **mình đang lấp khoảng trống nào trong Living
Intelligence**, không phải để tạo áp lực lấp đầy toàn bộ trong một
Sprint.
