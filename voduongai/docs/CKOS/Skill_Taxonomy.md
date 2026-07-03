# Skill Taxonomy

Danh sách chuẩn hoá Skill (Feature 03 — Skill Map). Nguồn: `src/features/knowledge/data/knowledge-taxonomy.ts`.

## Cây Skill hiện tại

```
Communication
├── Writing
└── Prompt Engineering

AI Office
├── Data Analysis
├── Time Management
├── Meeting Facilitation
└── Presentation

Research (độc lập)
Process Automation (thuộc AI Office)
Customer Communication (thuộc Communication)
```

## Bảng đầy đủ

| id | Label | Skill cha |
|---|---|---|
| `communication` | Communication | — |
| `writing` | Writing | communication |
| `prompt-engineering` | Prompt Engineering | communication |
| `ai-office` | AI Office | — |
| `data-analysis` | Data Analysis | ai-office |
| `time-management` | Time Management | ai-office |
| `meeting-facilitation` | Meeting Facilitation | ai-office |
| `presentation` | Presentation | ai-office |
| `research` | Research | — |
| `process-automation` | Process Automation | ai-office |
| `customer-communication` | Customer Communication | communication |

## Quy tắc thêm Skill mới

1. Skill mới phải là một **năng lực có thể luyện tập được**, không phải chủ đề nội dung
   ("Excel" là công cụ → thuộc `AI Tool Taxonomy`, không phải Skill; "Data Analysis" là kỹ
   năng → đúng chỗ trong Skill Taxonomy).
2. Nếu Skill mới là nhánh con của Skill đã có, gán `parentId` — không tạo Skill trùng lặp ý
   nghĩa ở gốc khác.
3. Một Seed nên gắn 1-2 Skill, tối đa 3 — nếu cần nhiều hơn, Seed đó có thể đang ôm quá nhiều
   nội dung (xem lại theo `05_CKOS_Collection_Guide.md`).
4. Thêm Skill mới vào `SKILL_TAXONOMY` trong code, không lưu skill dạng chuỗi tự do ở bất kỳ
   Seed nào (vi phạm sẽ bị flag ở `CKOS_Quality_Report.md`).

## Skill hiện chưa có Seed nào dùng riêng

Không có — toàn bộ 11 Skill hiện tại đều được gắn cho ít nhất 1 Seed trong 2 Collection hiện
có (xem `CKOS_Quality_Report.md`, mục Sprint 05, để đối chiếu chi tiết).
