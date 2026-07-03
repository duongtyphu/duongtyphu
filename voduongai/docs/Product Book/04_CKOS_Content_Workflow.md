# 04 — CKOS Content Workflow

Quy trình viết một Knowledge Seed mới đúng chuẩn CKOS, dùng bộ Template trong
`/docs/CKOS/Templates/`.

## Bước 1 — Xác định vị trí Seed

1. Seed này thuộc Collection nào? (Xem `05_CKOS_Collection_Guide.md`.)
2. Nó đứng ở vị trí thứ mấy trong `seedSlugs[]` của Collection đó? (Quyết định Previous/Next.)
3. Có Seed nào cần hoàn thành trước Seed này không? (Nếu có, đặt nó ngay sau trong thứ tự
   Collection — Companion Guide tự động gợi ý dựa trên vị trí liền trước.)

## Bước 2 — Viết theo Template, đúng thứ tự

| # | Template | Field điền |
|---|---|---|
| 1 | `Hero.template.md` | `title`, `subtitle`, `difficulty`, `estimatedTime`, `skillsGained`, `collectionSlug` |
| 2 | `Knowledge.template.md` | `whatYouWillGain`, `whyMatters`, `problem`, `coreIdea`, `guideSteps` |
| 3 | `Prompt.template.md` | `samplePrompt`, `promptTips`, `promptExampleInput/Output`, `prompts[5]` |
| 4 | `Example.template.md` | `example` |
| 5 | `Checklist.template.md` | `checklist[3-5]` |
| 6 | `Exercise.template.md` | `exercise` |
| 7 | `Reflection.template.md` | `reflectionQuestions[0]` |
| 8 | `CompanionNote.template.md` | `companionNote` |
| 9 | `NextAction.template.md` | `nextStep` |

Viết theo đúng thứ tự này — Hero trước để xác định rõ Seed nói về gì, Reflection/Companion
Note/Next Action sau cùng vì chúng phụ thuộc vào toàn bộ nội dung đã viết trước đó.

## Bước 3 — Điền metadata còn lại

- `goal[]`: khớp với danh sách mục tiêu Companion Discovery đang hỗ trợ (xem
  `discovery-goals.ts`) — nếu mục tiêu chưa tồn tại, cần thêm vào `DISCOVERY_GOAL_TO_SEED_GOAL`.
- `persona[]`: 1-2 đối tượng cụ thể.
- `relatedSeeds[]`: 1-3 Seed liên quan thật sự (không phải toàn bộ Seed cùng Collection).
- `downloadPack`: 3 nhãn (Prompt Pack, Checklist, Template) mô tả ngắn gọn.
- `steps[]`: nếu có KnowledgeAsset thật tương ứng, gán `assetId`; nếu chưa có, để `assetId: null`
  và `required: true` (nếu nội dung đã đầy đủ ngay trên Seed) hoặc `required: false` (nếu thật
  sự chưa sẵn sàng, hiển thị "sắp có").

## Bước 4 — Tự kiểm tra bằng Quality Checklist

Chạy qua toàn bộ mục trong `06_CKOS_Quality_Checklist.md` trước khi coi Seed đã sẵn sàng.

## Bước 5 — Thêm vào Collection

Thêm slug của Seed vào đúng vị trí trong `seedSlugs[]` của Collection tương ứng
(`knowledge-collections.ts`). Không thêm Seed vào Collection mà chưa qua Bước 4.

## Lưu ý về AI hỗ trợ viết Seed

CKOS Standard Library được thiết kế để **cả người viết thật lẫn AI hỗ trợ (khi có Companion
Studio ở Epic khác)** đều tạo ra Seed cùng chất lượng. Khi AI hỗ trợ viết, luôn:

- Đưa toàn bộ 9 Standard trong `/docs/CKOS/` vào context trước khi sinh nội dung.
- Chạy qua `06_CKOS_Quality_Checklist.md` sau khi sinh, không tự động xuất bản.
- Founder/người review luôn là bước cuối cùng trước khi Seed vào Collection.
