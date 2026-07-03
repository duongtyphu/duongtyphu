# Tag Standard

Chuẩn hoá toàn bộ tag trong CKOS (Feature 08). Áp dụng cho `skills`, `aiTools`, `scenarios`
trên mỗi Knowledge Seed.

## Nguyên tắc: Không Tag tự do

Trước Sprint 05, một Seed có thể được mô tả bằng bất kỳ từ nào người viết nghĩ ra. Từ Sprint
05, mọi tag phải là **id đã tồn tại** trong 1 trong 3 taxonomy:

| Taxonomy | File | Dùng cho |
|---|---|---|
| Skill Taxonomy | `data/knowledge-taxonomy.ts` → `SKILL_TAXONOMY` | `KnowledgeSeed.skills[]` |
| AI Tool Taxonomy | `data/knowledge-taxonomy.ts` → `AI_TOOL_TAXONOMY` | `KnowledgeSeed.aiTools[]` |
| Scenario Taxonomy | `data/knowledge-taxonomy.ts` → `SCENARIO_TAXONOMY` | `KnowledgeSeed.scenarios[]` |

## Quy tắc id

- Viết thường, kebab-case: `prompt-engineering`, không phải `Prompt Engineering` hay `promptEngineering`.
- Label (tên hiển thị) tách riêng khỏi id — sửa label không ảnh hưởng dữ liệu đã gắn tag.
- Không dùng dấu tiếng Việt trong id (chỉ dùng trong `label`).

## Quy trình thêm tag mới

1. Kiểm tra tag tương đương đã tồn tại chưa (đọc toàn bộ 3 taxonomy trước khi thêm mới).
2. Nếu chưa có, thêm entry mới vào đúng file taxonomy (`SKILL_TAXONOMY` /
   `AI_TOOL_TAXONOMY` / `SCENARIO_TAXONOMY`), viết cả `id` và `label`.
3. Chỉ sau khi tag đã có trong taxonomy mới được gắn vào `skills`/`aiTools`/`scenarios` của
   Seed.
4. Không xoá tag đã có nếu vẫn còn Seed tham chiếu — kiểm tra bằng cách grep id đó trong
   `knowledge-seed-journeys.ts`.

## AI Tool Taxonomy hiện tại

| id | Label |
|---|---|
| `chatgpt` | ChatGPT |
| `claude` | Claude |
| `gemini` | Gemini |
| `excel` | Excel |
| `copilot` | Copilot |
| `notebooklm` | NotebookLM |
| `perplexity` | Perplexity |
| `gamma` | Gamma |
| `otter` | Otter.ai |

## Scenario Taxonomy hiện tại

| id | Label | Đã có Seed? |
|---|---|---|
| `office-work` | Công việc văn phòng | Có |
| `management` | Quản lý | Có |
| `customer-service` | Chăm sóc khách hàng | Có |
| `research-scenario` | Nghiên cứu | Có |
| `presentation-scenario` | Trình bày / Thuyết trình | Có |
| `marketing` | Marketing | Chưa — chuẩn bị cho Collection tương lai |
| `sales` | Sales | Chưa — chuẩn bị cho Collection tương lai |
| `affiliate` | Affiliate | Chưa — chuẩn bị cho Collection tương lai |

## Ví dụ sai

```ts
skills: ["Kỹ năng viết", "AI"]  // ❌ không phải id trong taxonomy, không kebab-case
```

## Ví dụ đúng

```ts
skills: ["writing", "communication"]  // ✅ id hợp lệ, đã có trong SKILL_TAXONOMY
```
