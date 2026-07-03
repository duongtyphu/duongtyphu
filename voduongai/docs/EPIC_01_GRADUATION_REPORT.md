# EPIC 01 — CKOS (Companion Knowledge Operating System)
## Graduation Review Report

Tài liệu xác nhận chính thức việc EPIC 01 tốt nghiệp (hoặc chưa) trước khi Product Team
quyết định mở EPIC 02 — Học viện. Đánh giá dựa trên trạng thái thật của code/docs tại thời
điểm review (đã chạy `tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build` — toàn
bộ pass, không giả định).

---

## 1. Product Complete

### Các Sprint đã hoàn thành (6/6)

| Sprint | Tên | Trạng thái |
|---|---|---|
| 01 | Knowledge Foundation | ✅ Hoàn thành — KnowledgeAsset, KnowledgeSeed, Collection model + service layer |
| 02 | Learning Engine | ✅ Hoàn thành — Collection Dashboard, Learning Path, Continue Learning, Knowledge Map, Companion Guide (rule-based) |
| 03 | Knowledge Experience | ✅ Hoàn thành — Hero, Outcome, Why Matters, Step Guide, Prompt Experience, Example, Checklist, Exercise, Reflection, Companion Note, Next Action, Completion |
| 04 | CKOS Standard Library™ | ✅ Hoàn thành — 7 Standard + 9 Template + Product Book (6 file) + Quality Report |
| 05 | Knowledge Intelligence™ | ✅ Hoàn thành — Skill/AI Tool/Scenario taxonomy, Knowledge Dependency (`prerequisites[]`), Collection Relationship, Graph integrity ban đầu |
| 06 | CKOS Intelligence Layer™ / Quality Guard™ | ✅ Hoàn thành — `nextSeeds[]`, Recommendation Rules (3 rule), Graph Validation mở rộng (9 kiểm tra), Quality Guard tự động hoá (`npm test`), CKOS Constitution |

### Tính năng đã hoàn thiện

- Discovery → Collection → Knowledge Seed → Companion Guide → Collection Complete (toàn bộ
  luồng học chạy được, không có màn hình cụt).
- Mỗi Seed là "một buổi học hoàn chỉnh" đúng 14 phần Companion Content Standard + Knowledge
  Experience (Hero/Outcome/Why Matters/Step Guide/Prompt Experience/Example/Common
  Mistakes/Checklist/Exercise/Reflection/Companion Note/Next Action/Completion).
- Prompt Pack (5 prompt thật/Seed, copy được), Download Prep (nhãn, chưa xuất file thật).
- Knowledge Graph: Skill/AI Tool/Scenario Map, Knowledge Dependency 2 chiều (`prerequisites[]`
  + `nextSeeds[]`), Collection Relationship.
- Quality Guard tự động: 27 test (`npm test`), 0 lỗi trên toàn bộ 11 Seed + 2 Collection.

### Technical Debt còn lại (liệt kê chính xác, không chung chung)

1. **`KnowledgeAsset.dna.aiTools` (Sprint 01, chuỗi tự do: "ChatGPT", "Copilot"...) chưa hợp
   nhất với `KnowledgeSeed.aiTools` (Sprint 05, id taxonomy: `chatgpt`, `copilot`)** — 2 định
   dạng song song mô tả cùng khái niệm. Ghi nhận từ Sprint 05, nhắc lại ở `AIToolTaxonomy.md`,
   chưa sửa qua 2 Sprint liên tiếp (05, 06).
2. **3 Knowledge Asset thiếu step Template/SOP/Case Study** — 3 Seed mới của Sprint 04 (Viết
   Prompt Hiệu Quả, Phân Tích Excel, Tự Động Hoá) chỉ có 5/8 loại Asset thường thấy ở Seed cũ
   (Guide/Prompt/Checklist/Exercise/Reflection — thiếu Template, SOP/Framework, Case Study so
   với 8 Seed gốc của Sprint 01-04). Không chặn trải nghiệm (nội dung đầy đủ nằm trực tiếp
   trên trang Seed) nhưng không đối xứng về cấu trúc Asset với 8 Seed còn lại.
3. **`checkExercise` trong Quality Guard là heuristic đếm từ** (giới hạn 60 từ), không đo được
   chính xác "5-15 phút" vì data model không có field `exerciseMinutes`. Cần quyết định có
   thêm field này hay chấp nhận heuristic vĩnh viễn.
4. **Recommendation Rules 2 và 3 (Sprint 06) chưa được gọi từ UI** — chỉ là service đã test,
   chưa tích hợp vào `KnowledgeCollectionView.tsx`. Rule 1 đã tích hợp (qua
   `getPrerequisiteGuidance`), Rule 2/3 thì chưa.
5. **Chưa có CI pipeline chạy `npm test` tự động** — Quality Guard chỉ chạy khi ai đó chủ động
   gõ lệnh, không tự chặn merge/deploy.
6. **`docs/CKOS/` có 2 cặp file trùng lặp nội dung theo chủ đề** (`Skill_Taxonomy.md` vs
   `SkillTaxonomy.md`, `Scenario_Guide.md` vs `ScenarioTaxonomy.md`) — do Sprint 05 và Sprint
   06 dùng tên file hơi khác nhau cho cùng chủ đề thay vì cùng 1 file. Không sai lệch nội
   dung (đã đối chiếu chéo), nhưng là 2 nguồn cần đồng bộ thủ công nếu sửa.

---

## 2. Knowledge Complete

| Hạng mục | Số lượng | Trạng thái |
|---|---|---|
| Collection | 2 (`ai-office`, `ai-research-presentation`) | Đầy đủ mô tả, `seedSlugs[]`, `relatedCollections[]` 2 chiều |
| Knowledge Seed | 11 | Đủ 14 phần Companion Content Standard + Knowledge Experience trên cả 11 |
| Prompt | 55+ (11 Seed × tối thiểu 5 prompt/Seed qua Prompt Pack) | 100% có biến `[ngoặc vuông]`, có ví dụ Input/Output thật |
| Exercise | 11 (1/Seed) | Không rỗng, trong khung ước lượng (kiểm tra bằng heuristic, xem Technical Debt #3) |
| Reflection | 11 (1 câu riêng/Seed + 2 câu cố định toàn hệ thống ở tầng UI) | Đúng 3 câu hỏi khi hiển thị |
| Companion Note | 11 | Không chứa cụm cấm ("hành trình", "chinh phục", "phiên bản tốt nhất", "cùng nhau", "đỉnh cao"), dưới 40 từ |
| Knowledge Asset (tầng Sprint 01) | 80 (65 gốc + 15 Sprint 06) | 72/72 tham chiếu trong `steps[]` khớp, không còn asset "sắp có" nào |

### Những phần còn thiếu

- Không có Collection thứ 3 — đúng phạm vi đã giới hạn ("Không tạo Collection mới" áp dụng
  từ Sprint 03 trở đi), nhưng nghĩa là CKOS mới phủ 1 Domain (AI Office & Productivity), chưa
  chứng minh được taxonomy mở rộng tốt sang Domain khác (Marketing, Sales — đã chuẩn bị
  Scenario tag nhưng chưa có Seed thật kiểm chứng).
- 3 Scenario (`marketing`, `sales`, `affiliate`) tồn tại trong taxonomy nhưng 0 Seed sử dụng —
  là chuẩn bị trước, không phải thiếu sót, nhưng cũng chưa được "thử lửa" thật.

---

## 3. Documentation Complete

| Loại | Tài liệu | Trạng thái |
|---|---|---|
| Blueprint | `CKOS_Blueprint.md`, `Knowledge_Graph_Blueprint.md` | ✅ Đầy đủ |
| Standards | `CKOS_Writing_Standard.md`, `Hero_Standard.md`, `Prompt_Standard.md`, `Example_Standard.md`, `Exercise_Standard.md`, `Reflection_Standard.md`, `CompanionNote_Standard.md`, `Checklist_Standard.md`, `Tag_Standard.md` | ✅ 9 Standard, mỗi cái có ví dụ đúng/sai |
| Templates | 9 file `.template.md` trong `docs/CKOS/Templates/` | ✅ Đầy đủ, khớp 9 Standard |
| Product Book | 6 file `01`-`06` trong `docs/Product Book/` | ✅ Đầy đủ theo yêu cầu Sprint 04 |
| Constitution | `CKOSConstitution.md` | ✅ 10 nguyên tắc bất biến |
| Taxonomy | `KnowledgeTaxonomy.md`, `SkillTaxonomy.md`, `ScenarioTaxonomy.md`, `AIToolTaxonomy.md` | ✅ Đầy đủ, khớp code (`knowledge-taxonomy.ts`) |
| Rules | `RecommendationRules.md`, `GraphValidationRules.md`, `Relationship_Guide.md`, `Scenario_Guide.md` | ✅ Đầy đủ |
| Quality Reports | `CKOS_Quality_Report.md` (Sprint 04+05), `CKOS_Quality_Guard_Report.md` (Sprint 06 + EPIC-Closing Review) | ✅ Đầy đủ, có số liệu thật |

### Những tài liệu còn thiếu

- Không có **README điều hướng** ở gốc `docs/CKOS/` liệt kê toàn bộ 23 file theo đúng thứ tự
  đọc — người mới vào dự án phải tự dò `ls` để biết bắt đầu từ đâu.
- Chưa có tài liệu **migration guide** hướng dẫn cách chuyển dữ liệu từ file tĩnh
  (`knowledge-seed-journeys.ts`) sang database thật khi Admin (Epic riêng) cần quản lý — dù
  kiến trúc đã thiết kế sẵn sàng cho việc này (service layer tách bạch), chưa viết thành văn.

---

## 4. Legacy Assets

### Tài sản đã tạo

**Code (tái sử dụng được ngay qua `src/features/knowledge/index.ts`):**
- Type system đầy đủ: `KnowledgeAsset`, `KnowledgeSeed` (+ Companion Content Standard +
  Knowledge Experience + Knowledge Graph Links), `KnowledgeCollection`.
- Service layer: `knowledge.service.ts`, `knowledge-seed.service.ts`,
  `knowledge-collection.service.ts`, `knowledge-graph.service.ts`,
  `recommendation-rules.service.ts`.
- Quality Guard: `ckos-quality-guard.ts` + test suite chạy được ngay (`npm test`).
- ~30 component trình bày (Hero, Prompt Experience, Checklist, Companion Note...) độc lập
  UI framework cụ thể, dùng lại được cho Epic khác nếu cùng convention Tailwind.
- 3 hook client-side (progress/bookmark/reflection/checklist-tick) theo pattern
  đọc/ghi thuần, sẵn sàng migrate database.

**Documentation:** 23 file trong `docs/CKOS/` + 6 file `docs/Product Book/` — tổng ~29 tài
liệu, toàn bộ dùng tiếng Việt, có ví dụ đúng/sai cụ thể (không lý thuyết suông).

### Giá trị tái sử dụng

- Toàn bộ Taxonomy (Skill/AI Tool/Scenario) là **tài sản dùng chung** cho mọi Epic sau này —
  không Epic nào cần tạo taxonomy riêng nếu tham chiếu đúng 3 danh sách này.
- Quality Guard là **rào chắn có thể copy pattern** cho Epic khác (Học viện có thể viết
  `academy-quality-guard.ts` theo đúng cấu trúc `checkX()` + test `it.each`).
- Companion Content Standard + Knowledge Experience là **khuôn mẫu nội dung** — Học viện có
  thể tái sử dụng nguyên khuôn (Hero/Outcome/Why Matters/Step Guide...) cho bài học của mình
  thay vì tự nghĩ lại từ đầu.

### Những gì sẽ phục vụ EPIC 02 — Học viện

1. Toàn bộ Taxonomy (Skill/AI Tool/Scenario) — Học viện gắn khoá học vào đúng Skill đã có
   thay vì tạo hệ thống phân loại riêng.
2. `getPrerequisiteGuidance`/`prerequisites[]`/`nextSeeds[]` — cơ chế Dependency dùng lại
   được cho chuỗi bài học trong khoá học.
3. Recommendation Rules — logic "không đề xuất bài nâng cao khi chưa đủ điều kiện" áp dụng
   trực tiếp cho khoá học tuần tự.
4. CKOS Constitution — 10 nguyên tắc, đặc biệt nguyên tắc #10 ("CKOS là nền móng, không phải
   sản phẩm cuối") là quy tắc bắt buộc Học viện phải tuân theo khi tích hợp.

---

## 5. Quality Review

### Chất lượng kiến trúc

Vững. 3 tầng gốc (Foundation/Learning Engine/Knowledge Experience) + 2 tầng bổ sung
(Intelligence/Quality Guard) tách bạch rõ ràng — không component nào tự tính logic nghiệp vụ,
toàn bộ đi qua service layer. Client-side state (progress/bookmark/reflection) dùng pattern
đọc/ghi thuần, thiết kế sẵn cho việc migrate sang backend thật.

### Chất lượng nội dung

Cao, có kiểm chứng bằng script chứ không chỉ tự đánh giá. 11/11 Seed pass toàn bộ 7 rule
Quality Guard (Prompt/Example/Checklist/Exercise/Reflection/Companion Note/Taxonomy) sau khi
2 lỗi thật (2 prompt thiếu biến, 1 checklist lý thuyết) đã được phát hiện và sửa ở Sprint 06 —
chứng minh nội dung không phải "tự nhận đạt chuẩn" mà đã qua kiểm tra thực sự.

### Chất lượng code

`tsc --noEmit` sạch, `npm run lint` chỉ còn 5 warning `<img>` không liên quan CKOS (tồn tại từ
trước EPIC này, thuộc module khác của Portal), `npm run build` thành công, 27/27 test pass.

### Rủi ro còn tồn tại

1. **Rủi ro trôi taxonomy** — nếu Epic 02 không đọc `CKOSConstitution.md`/`Tag_Standard.md`
   trước khi thêm Skill/Scenario mới, có thể tạo taxonomy song song thay vì mở rộng cái có
   sẵn. Giảm thiểu: đã ghi rõ trong Constitution nguyên tắc #10, nhưng không có rào chắn kỹ
   thuật ép buộc (không có lint rule chặn tạo file taxonomy thứ 2).
2. **Rủi ro `aiTools` không hợp nhất** kéo dài — càng để lâu, càng khó refactor vì cả 2 định
   dạng đều có dữ liệu thật gắn vào (65 Asset dùng chuỗi tự do, 11 Seed dùng taxonomy).
3. **Rủi ro Quality Guard không được chạy** — vì chưa có CI, một người có thể thêm Seed mới vi
   phạm Standard mà không ai biết cho tới khi ai đó chủ động chạy `npm test`.

---

## 6. Ready For EPIC 02

**Đánh giá: Có thể bắt đầu, với 2 điều kiện tiên quyết chưa phải chặn cứng.**

CKOS cung cấp đủ nền móng kỹ thuật (type system, service layer, taxonomy, dependency engine,
quality guard) để Học viện xây trên đó mà không cần thiết kế lại từ đầu. Rủi ro lớn nhất
không nằm ở thiếu tính năng, mà ở **kỷ luật tuân thủ Constitution** khi Epic 02 bắt đầu mở
rộng — đây là rủi ro quy trình, không phải rủi ro kỹ thuật.

---

## 7. Graduation Recommendation

# B. READY WITH MINOR ISSUES

### Việc cần hoàn thành trước khi coi EPIC 01 đóng hoàn toàn (không chung chung):

1. Hợp nhất định dạng `aiTools` giữa `KnowledgeAsset.dna.aiTools` (chuỗi tự do, 65 Asset) và
   `KnowledgeSeed.aiTools` (taxonomy id, 11 Seed) — chọn 1 định dạng chuẩn, migrate phần còn
   lại.
2. Viết bổ sung Template/SOP/Case Study Asset cho 3 Seed mới (Viết Prompt Hiệu Quả, Phân Tích
   Excel, Tự Động Hoá) để đối xứng cấu trúc Asset với 8 Seed gốc.
3. Quyết định rõ: giữ `checkExercise` là heuristic đếm từ vĩnh viễn, hoặc thêm field
   `exerciseMinutes: number` vào `KnowledgeSeed` để kiểm tra chính xác 5-15 phút.
4. Gộp cặp file trùng chủ đề trong `docs/CKOS/`: `Skill_Taxonomy.md` + `SkillTaxonomy.md` →
   1 file; `Scenario_Guide.md` + `ScenarioTaxonomy.md` → 1 file. Tránh 2 nguồn cần đồng bộ
   thủ công.
5. Thêm README điều hướng ở `docs/CKOS/README.md` liệt kê toàn bộ tài liệu theo đúng thứ tự
   đọc cho người mới.
6. Cấu hình CI chạy `npm test` tự động trên mọi PR chạm vào
   `src/features/knowledge/` — biến Quality Guard từ "công cụ tự nguyện" thành "rào chắn bắt
   buộc" thật sự.

**Không có mục nào trong 6 việc trên chặn việc Học viện bắt đầu thiết kế song song** — chúng
là dọn dẹp kỹ thuật/tài liệu, không phải thiếu sót kiến trúc. Học viện có thể bắt đầu ngay,
6 việc trên nên xử lý trong 1 Sprint dọn dẹp ngắn trước hoặc song song với Epic 02.
