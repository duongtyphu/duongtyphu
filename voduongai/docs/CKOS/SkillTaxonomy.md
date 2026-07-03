# Skill Taxonomy

Bản chính thức Sprint 06 — nội dung đầy đủ, chi tiết hoá cách dùng: xem `Skill_Taxonomy.md`
(Sprint 05, vẫn còn hiệu lực, không trùng lặp — file đó có phần "quy tắc thêm Skill mới" đầy
đủ hơn).

## Danh sách Skill chính thức (11)

| id | Label | Skill cha | Seed đang dùng |
|---|---|---|---|
| `communication` | Communication | — | Viết Báo Cáo Tuần bằng AI, Tạo Slide PowerPoint bằng AI, Họp với AI, Viết Prompt Hiệu Quả |
| `writing` | Writing | communication | Viết Email Chuyên Nghiệp bằng AI, Viết Báo Cáo Tuần bằng AI, Soạn Bộ FAQ Cho Công Việc |
| `prompt-engineering` | Prompt Engineering | communication | Viết Prompt Hiệu Quả |
| `ai-office` | AI Office | — | Tóm tắt PDF bằng AI, Phân Tích Excel bằng AI, Quản Lý Thời Gian Làm Việc, Tự Động Hóa Công Việc Văn Phòng bằng AI |
| `data-analysis` | Data Analysis | ai-office | Phân Tích Excel bằng AI |
| `time-management` | Time Management | ai-office | Viết Báo Cáo Tuần bằng AI, Quản Lý Thời Gian Làm Việc |
| `meeting-facilitation` | Meeting Facilitation | ai-office | Họp với AI |
| `presentation` | Presentation | ai-office | Tạo Slide PowerPoint bằng AI |
| `research` | Research | — | Tóm tắt PDF bằng AI, Nghiên Cứu Một Chủ Đề Nhanh Chóng |
| `process-automation` | Process Automation | ai-office | Tự Động Hóa Công Việc Văn Phòng bằng AI |
| `customer-communication` | Customer Communication | communication | Soạn Bộ FAQ Cho Công Việc |

Nguồn: `src/features/knowledge/data/knowledge-taxonomy.ts` → `SKILL_TAXONOMY`. Kiểm tra tự
động bằng `checkTaxonomy()` trong `ckos-quality-guard.ts` — không Skill tự do lọt qua được.
