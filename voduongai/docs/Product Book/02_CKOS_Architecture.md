# 02 — CKOS Architecture

Kiến trúc kỹ thuật của module `src/features/knowledge/`.

## Sơ đồ thư mục

```
src/features/knowledge/
├── types/
│   ├── knowledge.types.ts             KnowledgeAsset, KnowledgeType, KnowledgeStatus
│   ├── knowledge-seed.types.ts        KnowledgeSeed, CompanionContentStandard,
│   │                                  KnowledgeExperienceContent, KnowledgeSeedStage
│   └── knowledge-collection.types.ts  KnowledgeCollection, KnowledgeCollectionProgress
├── data/
│   ├── knowledge-seed-data.ts         65 KnowledgeAsset (Sprint 01)
│   ├── knowledge-seed-journeys.ts     11 KnowledgeSeed (Sprint 01-04)
│   ├── knowledge-collections.ts       2 KnowledgeCollection
│   └── discovery-goals.ts             Companion Discovery goal → seed goal mapping
├── services/
│   ├── knowledge.service.ts           query/filter KnowledgeAsset
│   ├── knowledge-seed.service.ts      progress, suggestion, navigation, search
│   └── knowledge-collection.service.ts progress, learning path, companion guidance
├── utils/
│   ├── use-seed-progress.ts           localStorage: step completion
│   ├── use-seed-bookmark.ts           localStorage: save/read-later/favorite
│   ├── use-seed-reflection.ts         localStorage: reflection answers
│   ├── use-checklist-tick.ts          localStorage: action checklist state
│   ├── use-continue-learning.ts       localStorage: last visited in-progress seed
│   ├── split-before-after.ts          parse Example field → Before/After
│   └── knowledge-labels.ts            Vietnamese labels cho enum/filter UI
├── components/                        ~30 presentational component (Hero, Prompt
│                                       Experience, Checklist, Companion Note...)
└── workspace/
    ├── KnowledgeLibrary.tsx           Discovery + Collection grid + Asset Explorer
    ├── KnowledgeCollectionView.tsx    Collection Dashboard + Learning Path
    └── KnowledgeWorkspace.tsx         Một Knowledge Seed đầy đủ
```

## Model hierarchy

```
KnowledgeCollection (1) ──── seedSlugs[] ────▶ (n) KnowledgeSeed
KnowledgeSeed (1) ──── steps[].assetId ────▶ (n) KnowledgeAsset   (có thể null — "sắp có")
```

- **KnowledgeAsset** (Sprint 01): đơn vị tri thức nguyên tử — 1 Guide, 1 Prompt, 1 Checklist...
  Không hiển thị độc lập nữa từ Sprint 03; giờ chỉ phục vụ "Hành trình từng bước" bên trong Seed.
- **KnowledgeSeed** (Sprint 01, mở rộng Sprint 03): đơn vị học tập hoàn chỉnh — "một buổi học".
  Chứa toàn bộ Companion Content Standard (14 phần) + Knowledge Experience Content trực tiếp
  trên chính nó, không phụ thuộc hoàn toàn vào KnowledgeAsset để hiển thị nội dung.
- **KnowledgeCollection** (Sprint 01, mở rộng Sprint 02): nhóm Seed theo chủ đề lớn, có thứ tự
  học cố định (`seedSlugs[]`) dùng để tính Previous/Next/Progress.

## Route map (Portal)

```
/portal/library                        Discovery + Collection grid + Search
/portal/library/collection/[slug]      Collection Dashboard + Learning Path
/portal/library/[slug]                 Knowledge Workspace (một Seed đầy đủ)
```

## Data flow — tính năng nào đọc field nào

| Tính năng | Field nguồn | Service/Hook |
|---|---|---|
| Learning Hero | `title`, `subtitle`, `skillsGained`, `difficulty`, `estimatedTime` | — (đọc trực tiếp) |
| Learning Path / Status | `steps[]`, localStorage completedStepIds | `computeSeedProgress`, `getSeedsWithStatus` |
| Continue Learning | localStorage last-visited entry | `recordSeedVisit`, `useContinueLearning` |
| Companion Guide | `steps[]` order, Collection order | `getCompanionSuggestion`, `getPrerequisiteGuidance`, `getCollectionCompanionGuidance` |
| Prompt Experience / Pack | `samplePrompt`, `promptTips`, `promptExampleInput/Output`, `prompts[]` | — |
| Example | `example` (string `"Trước: ... Sau: ..."`) | `splitBeforeAfter` |
| Reflection | `reflectionQuestions[0]` + 2 câu cố định | `useSeedReflection` |
| Bookmark | seedId | `useSeedBookmark` |
| Download Prep | `downloadPack` | — (chỉ hiển thị nhãn, chưa xuất file) |

## Nguyên tắc kiến trúc

1. **Client-side first, migrate-ready.** Toàn bộ progress/bookmark/reflection/checklist-tick
   lưu localStorage qua các hook `use-*`, nhưng đọc/ghi qua hàm thuần (`readAll`/`writeAll`)
   tách biệt — khi có backend, chỉ cần đổi phần đọc/ghi bên trong hook, không đổi chữ ký hàm
   hay component gọi hook.
2. **Service layer là nguồn sự thật duy nhất cho logic.** Component không tự tính progress/
   suggestion — luôn gọi qua `knowledge-seed.service.ts` / `knowledge-collection.service.ts`.
3. **Rule-based, không AI, cho Companion Guide.** Toàn bộ gợi ý của Companion trong Learning
   Engine là if/else thuần dựa trên dữ liệu tiến độ — không gọi AI provider nào.
