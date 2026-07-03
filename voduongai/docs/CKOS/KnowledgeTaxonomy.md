# Knowledge Taxonomy

Chuẩn hoá 8 tầng của CKOS — mọi Knowledge Asset/Seed/Collection trong hệ thống đều nằm đúng
1 vị trí trong cấu trúc này.

```
Domain
  └── Collection
        └── Module (nhóm step bên trong 1 Seed — Guide/Prompt/Checklist/...)
              └── Knowledge Seed
                    └── Skill
                          └── Scenario
                                └── AI Tool
                                      └── Tags
```

## Định nghĩa từng tầng

| Tầng | Định nghĩa | Ví dụ | Field trong code |
|---|---|---|---|
| **Domain** | Phạm vi lớn nhất — hiện tại CKOS chỉ có 1 Domain duy nhất: "Kỹ năng AI văn phòng & năng suất cá nhân". Domain khác (Marketing, Sales...) sẽ mở khi có Epic riêng ngoài CKOS. | AI Office & Productivity | (chưa có field riêng — ngầm định qua toàn bộ `knowledgeCollections`) |
| **Collection** | Chủ đề lớn, gồm nhiều Seed theo thứ tự học. | AI Office | `KnowledgeCollection.slug/title` |
| **Module** | Cụm bước bên trong 1 Seed — Guide → Prompt → Checklist → Template/SOP → Case Study → Exercise → Reflection. Không phải khái niệm độc lập, chỉ là cách gọi tầng `steps[]`. | 8 step của Seed "Viết Email..." | `KnowledgeSeed.steps[]` |
| **Knowledge Seed** | Đơn vị học tập hoàn chỉnh — "một buổi học". | Viết Email Chuyên Nghiệp bằng AI | `KnowledgeSeed` |
| **Skill** | Năng lực luyện tập được, có thể là cây cha-con. | Writing, Prompt Engineering | `KnowledgeSeed.skills[]` → `SKILL_TAXONOMY` |
| **Scenario** | Tình huống kinh doanh Seed áp dụng được. | Công việc văn phòng, Quản lý | `KnowledgeSeed.scenarios[]` → `SCENARIO_TAXONOMY` |
| **AI Tool** | Công cụ AI cụ thể được dùng trong Seed. | ChatGPT, Excel | `KnowledgeSeed.aiTools[]` → `AI_TOOL_TAXONOMY` |
| **Tags** | Tên gọi chung cho 3 tầng Skill/Scenario/AI Tool khi tham chiếu — không phải tầng riêng, không có tag tự do nằm ngoài 3 taxonomy trên (xem `Tag_Standard.md`). | — | — |

## Vì sao "Module" không phải bảng dữ liệu riêng

Ở CKOS, một Module (Guide/Prompt/Checklist...) không tồn tại độc lập ngoài ngữ cảnh 1 Seed cụ
thể — nó luôn là 1 phần tử trong mảng `steps[]` của đúng 1 Seed, trỏ tới 1 `KnowledgeAsset`
(Sprint 01) qua `assetId`. Không tạo bảng "Module" riêng để tránh trùng lặp khái niệm với
KnowledgeAsset đã có.

## Trạng thái hiện tại (cuối EPIC CKOS)

- 1 Domain (ngầm định)
- 2 Collection: `ai-office`, `ai-research-presentation`
- 11 Knowledge Seed
- 80 Knowledge Asset (65 Sprint 01 + 15 Sprint 06)
- 11 Skill, 9 AI Tool, 8 Scenario trong taxonomy chuẩn hoá

## Quan hệ với các Epic tương lai

Khi Học viện / Dự án & Cơ hội / Premium mở ra Epic riêng, chúng **không** thêm tầng mới vào
Knowledge Taxonomy này — đây là taxonomy dành riêng cho tri thức dạng "bài học ứng dụng ngay"
(CKOS). Các Epic khác sẽ có Taxonomy riêng của chúng nếu cần, tham chiếu chéo qua Skill/Scenario
chung nếu phù hợp (VD: một Khoá học trong Học viện có thể gắn cùng Skill "Prompt Engineering"
với Seed "Viết Prompt Hiệu Quả" trong CKOS).
