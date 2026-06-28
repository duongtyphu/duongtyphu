# VO DUONG AI Knowledge Graph

> `KNOWLEDGE_ARCHITECTURE.md` định nghĩa 3 Tầng (Human/Knowledge/Action)
> và Content Relationship theo một **chuỗi tuyến tính gợi ý** (Bài học →
> Prompt → Workflow → Tool → Practice → Reflection → Story). Tài liệu
> này mở rộng chuỗi đó thành một **đồ thị (graph)** — vì thực tế một
> Reflection có thể liên kết với nhiều Story cũ, một Companion Insight
> có thể tham chiếu nhiều Pattern từ nhiều nguồn khác nhau cùng lúc, và
> các Node không phải lúc nào cũng đi theo một hướng duy nhất. Đây là
> bản đồ, không phải migration — không có thay đổi database/code nào đi
> kèm tài liệu này, đúng tinh thần `KNOWLEDGE_ARCHITECTURE.md`.

## Vì sao cần Graph, không chỉ Chuỗi

Một chuỗi (chain) trả lời "bước tiếp theo là gì". Một đồ thị trả lời
thêm: "điều này còn liên quan tới điều gì khác mà người dùng từng gặp,
ở bất kỳ thời điểm nào trong hành trình của họ". Companion chỉ có thể
"nhận ra mẫu hình" (Companion Insight, `PROPRIETARY_LEARNING_LOOP.md`)
nếu tri thức được lưu dưới dạng các Node có thể nối chéo nhau, không
phải một danh sách các bài học rời rạc.

## Các loại Node

Mỗi loại nội dung trong Portal là một loại Node trong Graph, giữ đúng
phân tầng đã có ở `KNOWLEDGE_ARCHITECTURE.md`:

| Tầng | Node |
|---|---|
| 1. Human | Companion, Story, Character, Community, Reflection |
| 2. Knowledge | Lesson (Bài học), Prompt, Tool, Workflow, SOP, Template |
| 3. Action | Practice, Project, Build, Affiliate, Automation, Brand |

Một Node có thể thuộc nhiều nhóm cùng lúc nếu thực tế đúng như vậy
(giữ nguyên nguyên tắc đa-`topic` trong `KNOWLEDGE_METADATA_STANDARD.md`).

## Các loại Cạnh (Edge)

Khác với Content Relationship (chỉ có một hướng "đường đi gợi ý"),
Graph có 4 loại cạnh, mỗi loại trả lời một câu hỏi khác nhau:

1. **`leads_to` (dẫn tới)** — chính là Content Relationship cũ
   (Lesson → Prompt → Workflow → Tool → Practice → Reflection → Story).
   Có hướng, một chiều, đúng như đã chuẩn hóa.
2. **`echoes` (vọng lại)** — nối một Reflection/Story mới với một
   Reflection/Story cũ cùng chủ đề, dù cách nhau bao lâu. Đây là cạnh
   mà Pattern Layer của `TRANSFORMATION_ENGINE.md` dùng để phát hiện
   chuyển hóa — không có trong Content Relationship cũ vì chuỗi cũ chỉ
   đi tới trước, không đi ngược về quá khứ của chính người dùng.
3. **`supports` (hỗ trợ ngang)** — nối các Node cùng tầng không có quan
   hệ trước-sau (ví dụ: hai Tool khác nhau cùng hỗ trợ một Workflow).
   Tương đương "Hỗ trợ ngang" đã có cho Template trong
   `KNOWLEDGE_ARCHITECTURE.md`, mở rộng cho mọi Node ngang tầng.
4. **`witnessed_by` (được Companion ghi nhận)** — nối bất kỳ Node nào
   với một khoảnh khắc Companion Insight nhận ra mẫu hình từ Node đó.
   Đây là cạnh duy nhất không do người dùng tạo ra trực tiếp — nó được
   Transformation Engine tạo ra khi Pattern Layer phát hiện một thay
   đổi đáng ghi nhận.

## Quy tắc bắt buộc (kế thừa, không thay thế Decision #050)

- Mọi Node ở Tầng 2 (Knowledge) phải có ít nhất một cạnh `leads_to` ra
  khỏi Tầng 2 — quy tắc này đã có ở `KNOWLEDGE_METADATA_STANDARD.md`,
  Graph chỉ kế thừa, không thay đổi.
- Cạnh `echoes` chỉ được tạo trong phạm vi của **cùng một người dùng**
  — Graph không bao giờ nối Reflection/Story của người dùng A với
  người dùng B (vi phạm tính riêng tư và Điều 5 — Companion ghi nhớ để
  chăm sóc, không để so sánh).
- Cạnh `witnessed_by` không bao giờ hiển thị cho người dùng dưới dạng
  một con số hay danh sách "đã được ghi nhận N lần" — nó chỉ tồn tại để
  Companion diễn dịch thành lời nói, đúng nguyên tắc no-gamification.

## Companion dùng Graph như thế nào

Khi một người dùng đặt câu hỏi hoặc hoàn thành một hành động, Companion
(khi nối với AI model thật, xem `COMPANION_BRAIN_ARCHITECTURE.md`) truy
vấn Graph theo 3 bước:

1. Tìm Node hiện tại (ví dụ: Reflection vừa viết).
2. Đi theo cạnh `echoes` để tìm Node cùng chủ đề trong quá khứ của
   chính người dùng đó.
3. Nếu tìm thấy một cặp Node có khoảng cách thời gian giảm dần hoặc nội
   dung sâu hơn theo thời gian — giao lại cho `TRANSFORMATION_ENGINE.md`
   để tạo một cạnh `witnessed_by` mới.

Đây là cơ chế kỹ thuật đứng sau câu hỏi "Companion nhận biết thế nào?"
đã đặt ra ở `TRANSFORMATION_ENGINE.md` — Graph là cấu trúc dữ liệu,
Transformation Engine là hành vi vận hành trên cấu trúc đó.

## Không phải một sprint database

Tài liệu này là bản đồ khái niệm để các sprint kỹ thuật sau tham chiếu
khi thực sự cần (ví dụ: khi Learning Path Engine hoặc Companion Brain
được triển khai thật) — không kéo theo bất kỳ thay đổi schema nào ngay
bây giờ, đúng giới hạn NV10 của sprint chiến lược này (chỉ thiết kế,
không viết code).
