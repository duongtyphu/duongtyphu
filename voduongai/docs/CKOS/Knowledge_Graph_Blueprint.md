# Knowledge Graph Blueprint

CKOS — Sprint 05: Knowledge Intelligence™. Tài liệu gốc cho hệ tri thức kết nối, đứng cạnh
`CKOS_Blueprint.md` (Sprint 01-04).

## Vì sao Knowledge Graph tồn tại

Từ Sprint 01-04, mỗi Knowledge Seed đã là một bài học hoàn chỉnh — nhưng vẫn có thể đứng độc
lập, không ai biết nó liên quan gì đến phần còn lại của CKOS. Sprint 05 kết nối toàn bộ Seed
thành một hệ thống có thể khám phá theo nhiều chiều, không chỉ theo thứ tự Collection.

## Sơ đồ quan hệ

```
Collection ──seedSlugs[]──▶ Knowledge Seed ──skills[]──▶ Skill (Skill Taxonomy)
                                  │
                                  ├──aiTools[]──▶ AI Tool (AI Tool Taxonomy)
                                  ├──scenarios[]──▶ Business Scenario (Scenario Taxonomy)
                                  ├──prerequisites[]──▶ Seed khác (Knowledge Dependency)
                                  └──relatedSeeds[]──▶ Seed khác (Related Knowledge, curated)

Collection ──relatedCollections[]──▶ Collection khác (Collection Relationship)
```

## 7 chiều kết nối của một Knowledge Seed

1. **Collection** — chủ đề lớn Seed thuộc về (`collectionSlug`).
2. **Skill** — kỹ năng Seed dạy, có thể thuộc cây Skill lớn hơn (`skills[]`, Skill Taxonomy).
3. **AI Tool** — công cụ AI được dùng trong Seed (`aiTools[]`, AI Tool Taxonomy).
4. **Business Scenario** — tình huống kinh doanh áp dụng được (`scenarios[]`, Scenario Taxonomy).
5. **Prompt** — Prompt Pack của Seed (đã có từ Sprint 03, không đổi ở Sprint 05).
6. **Knowledge Dependency** — Seed nên học trước/sau (`prerequisites[]`, độc lập Collection order).
7. **Related Knowledge** — Seed liên quan theo logic Skill/Scenario chung (`relatedSeeds[]`,
   chọn thủ công, không random).

## Nguyên tắc thiết kế

- **Taxonomy chuẩn hoá, không tag tự do.** Mọi `skills`/`aiTools`/`scenarios` phải là id tồn
  tại trong `knowledge-taxonomy.ts` — xem `Tag_Standard.md`.
- **Dependency là đồ thị có hướng, không vòng lặp.** `prerequisites` không được tạo chu trình
  (A cần B, B cần A) — xem quy tắc kiểm tra trong `CKOS_Quality_Report.md` (mục Sprint 05).
- **Related Knowledge phải giải thích được bằng dữ liệu.** Nếu 2 Seed được gắn liên quan, phải
  có ít nhất 1 Skill hoặc Scenario chung — không gắn theo cảm tính.
- **Collection Relationship là một chiều mở**, không phải chu trình đóng — một chuỗi Collection
  (AI Office → AI Content → AI Marketing → AI Business) có thể tiếp tục mở rộng, không giới hạn.

## Trạng thái hiện tại (sau Sprint 05)

- 2 Collection: `ai-office`, `ai-research-presentation` — liên kết 2 chiều với nhau.
- 11 Skill, 9 AI Tool, 8 Scenario trong taxonomy (một số Scenario — Marketing, Sales,
  Affiliate — chưa có Seed nào gắn, chuẩn bị sẵn cho Collection tương lai).
- "Viết Prompt Hiệu Quả" là prerequisite của toàn bộ 10 Seed còn lại — đúng vai trò kỹ năng
  nền tảng của cả hệ thống.

Chi tiết kỹ thuật (field, service, component): xem `Product Book/02_CKOS_Architecture.md`
(cập nhật Sprint 05) hoặc code trực tiếp: `src/features/knowledge/services/knowledge-graph.service.ts`.
