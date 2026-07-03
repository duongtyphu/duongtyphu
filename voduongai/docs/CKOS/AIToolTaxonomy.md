# AI Tool Taxonomy

Bản chính thức Sprint 06. Nguyên tắc thêm mới: xem `Tag_Standard.md` (Sprint 05).

## Danh sách AI Tool chính thức (9)

| id | Label | Nhóm (theo yêu cầu Sprint 06) |
|---|---|---|
| `chatgpt` | ChatGPT | Writing AI / đa năng |
| `claude` | Claude | Writing AI / đa năng |
| `gemini` | Gemini | Writing AI / đa năng |
| `excel` | Excel | Spreadsheet AI |
| `copilot` | Copilot | Spreadsheet AI / Coding AI |
| `notebooklm` | NotebookLM | Research AI |
| `perplexity` | Perplexity | Research AI |
| `gamma` | Gamma | Presentation AI |
| `otter` | Otter.ai | Meeting/Research AI |

Chưa có công cụ nào thuộc nhóm **Image AI**, **Video AI**, **Coding AI** (thuần) trong 11 Seed
hiện tại — vì phạm vi CKOS hiện tại là AI Office & Productivity, chưa chạm tới sáng tạo hình
ảnh/video/lập trình. Không thêm id giả cho các nhóm này khi chưa có Seed thật cần dùng.

## Hợp nhất với tầng Asset (Sprint 01) — vấn đề còn tồn tại

`KnowledgeAsset.dna.aiTools` (Sprint 01, 65 Asset gốc) vẫn lưu chuỗi tự do ("ChatGPT",
"Copilot", "NotebookLM"...) — khác định dạng id chuẩn hoá ở tầng Seed. Đây là nợ kỹ thuật đã
ghi nhận từ `CKOS_Quality_Report.md` (Sprint 05, điểm #7), **chưa xử lý trong Sprint 06** vì
thuộc phạm vi refactor Foundation (Sprint 01), không phải nhiệm vụ của Sprint này. Xem đánh giá
ở `CKOS_Quality_Guard_Report.md` (Sprint 06 cuối cùng, mục "Vấn đề còn tồn tại").

Nguồn: `src/features/knowledge/data/knowledge-taxonomy.ts` → `AI_TOOL_TAXONOMY`.
