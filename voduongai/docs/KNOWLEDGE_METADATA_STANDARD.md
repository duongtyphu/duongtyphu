# Knowledge Metadata Standard (Sprint 8.1 — Nhiệm vụ 04)

Chuẩn metadata cho mọi nội dung trong Portal (bài học, prompt, workflow,
tool, SOP, checklist, template, premium, project). **Không implement
database** trong sprint này — đây là chuẩn để các collection hiện có
(`academy`, `prompts`, `tools`, `templates`, `checklists`, `sop`,
`resources`...) dần áp dụng khi cần, không phải một migration bắt buộc
ngay.

## 6 trường metadata bắt buộc

| Trường | Ý nghĩa | Ví dụ |
|---|---|---|
| `topic` (Chủ đề) | Nhóm tri thức trong `KNOWLEDGE_ARCHITECTURE.md` mà nội dung này thuộc về | `"Prompt"`, `"Automation"` |
| `skill` (Kỹ năng) | Kỹ năng cụ thể nội dung này xây dựng, không phải chủ đề chung | `"Viết prompt cho content marketing"` |
| `level` (Mức độ) | Một trong: Cơ bản / Trung cấp / Nâng cao | `"Cơ bản"` |
| `estimatedTime` (Thời gian) | Thời gian ước tính để hoàn thành, theo cảm giác con người, không theo số liệu kỹ thuật chính xác | `"15 phút"`, `"một buổi tối"` |
| `prerequisites` (Điều kiện tiên quyết) | Danh sách nội dung nên biết trước — **gợi ý, không chặn truy cập** | `["AI Foundation: Buổi 1"]` |
| `relatedContent` (Liên quan tới) | Danh sách nội dung khác theo Content Relationship (`KNOWLEDGE_ARCHITECTURE.md`, Nhiệm vụ 02) | `["Workflow: Tự động hóa content"]` |

## Nguyên tắc áp dụng

1. **`prerequisites` không bao giờ là một cổng chặn.** Người dùng vẫn có
   thể mở một nội dung dù chưa hoàn thành điều kiện tiên quyết — trường
   này chỉ dùng để Portal/Companion gợi ý, không dùng để khóa nội dung
   (đối chiếu Điều 4 — Constitution: không ép buộc).
2. **`relatedContent` phải có ít nhất một liên kết ra khỏi Tầng 2
   (Knowledge)** nếu nội dung đó thuộc Tầng 2 — đây là cách thực thi
   Product Decision #050 ở cấp độ metadata: nếu một bài học không liên
   kết tới bất kỳ Prompt/Workflow/Tool/Project nào, nó chưa đạt chuẩn.
3. **`estimatedTime` dùng ngôn ngữ con người**, không dùng số phút chính
   xác đến mức tạo cảm giác bị đo lường ("12 phút 30 giây" sai tinh thần
   — "khoảng 15 phút" đúng hơn).
4. **`level` không phải một thước đo năng lực người dùng.** Nó mô tả độ
   phức tạp của nội dung, không mô tả người dùng "đang ở mức nào" — tránh
   lặp lại sai lầm Level/Rank đã cấm trong `HUMAN_CHARACTER_ENGINE.md`
   (No Gamification).
5. **Một nội dung có thể thuộc nhiều `topic`** nếu nó thật sự thuộc về
   nhiều nhóm tri thức (ví dụ một Template vừa thuộc Prompt vừa thuộc
   Content) — không ép một nội dung chỉ có một topic duy nhất nếu thực tế
   không đúng như vậy.

## Khi nào áp dụng chuẩn này

- Không bắt buộc migrate toàn bộ nội dung hiện có ngay.
- Áp dụng dần khi một collection được chỉnh sửa trong một sprint khác, có
  lý do cụ thể (ví dụ: sprint xây Learning Path Engine thật cần
  `prerequisites`/`relatedContent` để gợi ý đúng).
- Không bao giờ áp dụng metadata theo kiểu thêm trường cho có — mỗi
  trường phải phục vụ trực tiếp Knowledge Map, Content Relationship, hoặc
  Learning Path Engine. Nếu một trường không phục vụ một trong ba mục
  đích này — không thêm nó (đối chiếu `BEFORE_YOU_BUILD.md`).
