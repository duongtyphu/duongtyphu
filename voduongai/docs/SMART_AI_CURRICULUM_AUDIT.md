# Audit: Hiện trạng hệ thống trước khi thiết kế Giáo trình AI thông minh

Task: Audit-only, không sửa code, không đổi route, không thêm dữ liệu giả.
Phạm vi: Học viện AI, AI Workspace, Thư viện tri thức, Workspace, Companion,
Growth Event/Nhật ký/Hành trình/Khu vườn, Admin/content data.

---

## 1. Executive Summary

Portal hiện có **kiến trúc điều hướng đúng** (Học viện AI = học, AI
Workspace = làm, Thư viện tri thức = tra cứu, Workspace = hội tụ, CTA đã
hợp nhất về `startCompanionWorkspace` từ Sprint 02) nhưng **chưa có một
giáo trình thật theo chuẩn Learning OS**:

- Chỉ có **2 Learning Journey thật** (chiếu từ 2 CKOS Collection, 11 seed),
  trong khi có **80 Knowledge Asset** đã viết nội dung thật nhưng phần lớn
  chưa được tổ chức vào Collection/Journey nào.
- **Không có đầu ra thật nào được lưu lại.** Toàn bộ "thực hành cùng
  Companion" chỉ dẫn tới `/portal/workspace` — một trang hiển thị lại
  context + 3 bước kế hoạch tĩnh + khung "Kết quả sẽ hiển thị tại đây"
  (chưa xử lý, chưa lưu, chưa có Version).
- **Không có file thật nào** (.pdf/.docx/.xlsx/.md...) tồn tại trong
  `public/` cho bất kỳ Checklist/Template/Prompt Pack nào. `DownloadPrepCard`
  tự nhận trong comment: "chưa xây file thật" — hiển thị "sắp có".
- **Growth Event được ghi nhưng không ai đọc.** `WORKSPACE_STARTED` ghi vào
  `localStorage` mỗi lần bấm CTA, nhưng Nhật ký học tập/Hành trình của
  tôi/Khu vườn của bạn đều là dữ liệu tĩnh/hardcode, hoàn toàn không đọc log
  này — vòng lặp "Học → Làm → Workspace → Nhật ký → Hành trình → Khu vườn"
  đứt ngay ở bước cuối.
- **Không có chấm điểm/đánh giá** — đây là chủ đích thiết kế (Academy FAQ:
  "Companion có chấm điểm tôi không? — Không"), không phải thiếu sót, nhưng
  cũng đồng nghĩa hiện chưa có cách nào "đo được kết quả" hay "chứng minh AI
  hiệu quả hơn" như chuẩn mới yêu cầu.
- **Companion 100% rule-based, không gọi AI thật** ở phía người dùng. Có một
  hệ thống gọi AI thật (Anthropic/OpenAI qua `fetch`) nhưng chỉ dùng cho
  Admin viết nội dung, không chạm tới người dùng cuối.
- Nội dung tra cứu (CKOS) có chất lượng thật, không phải nội dung giả —
  đây là nền tảng tốt để xây giáo trình, chỉ là chưa được tổ chức + chưa có
  đường dẫn thực hành → đầu ra → lưu trữ.

---

## 2. Current Architecture

| Khu vực | Route | Component chính | Data source |
|---|---|---|---|
| Học viện AI | `/portal/academy` | `academy/page.tsx`, `JourneyCard`, `LandingPageMissionPilot` | CKOS Collections (chiếu qua `journey.service.ts`), `AI_TOOLS`, `WORK_NEEDS`/`LEARNING_PATHS` |
| AI Workspace | `/portal/khong-gian-ai` | `khong-gian-ai/page.tsx`, `AiSpaceSections.tsx` | `ai-workspace.ts`, `khong-gian-ai/index.ts`, `prompts.ts` |
| Thư viện tri thức | `/portal/library` | `KnowledgeLibrary.tsx` → `KnowledgeWorkspace.tsx` | `knowledge-collections.ts`, `knowledge-seed-data.ts`, `knowledge-seed-journeys.ts` (static TS, chưa Supabase) |
| Workspace | `/portal/workspace` | `WorkspaceMvp.tsx` | `sessionStorage`/query params (single-session, không có lịch sử) |
| Companion | mọi route | `CompanionPresence.tsx`, `companion-orchestrator.ts` | Rule-based, static template — KHÔNG gọi AI |
| Growth Event | ghi tại `companion-workspace.ts` | — | `localStorage["vdai_growth_events"]` — chỉ ghi, không ai đọc |
| Nhật ký/Hành trình/Khu vườn | `/portal/news`, `/portal/journey`, `/portal/hanh-trinh-cua-toi`, `/portal/khu-vuon-cua-ban` | từng page riêng | Supabase blog (news) hoặc static seed data (journey/garden) — không liên kết Growth Event |
| Admin/content | `src/app/admin/(dashboard)/` | ~28 section managers | Hybrid: Supabase cho prompts/templates/checklists/sop/resources/blog/case-study/news/tools/ebooks; CKOS Knowledge vẫn 100% static TS |

**CTA đã hợp nhất** (Sprint 02): mọi "Thực hành/Giao việc/Dùng ngay cùng
Companion" gọi `startCompanionWorkspace(context)` → lưu `sessionStorage` +
ghi Growth Event → điều hướng `/portal/workspace`. Không còn 2 cơ chế song
song như trước.

---

## 3. Existing Content Inventory

| Nhóm | Đang nằm ở đâu | Số lượng thật | Dùng được thật? | Dẫn tới thực hành? | Tạo kết quả thật? |
|---|---|---|---|---|---|
| Khóa học/Journey | Học viện AI (chiếu từ CKOS Collection) | 2 Collection (11 seed) | Có nội dung thật | Có (mở Workspace) | Không (Workspace chỉ hiển thị context) |
| Knowledge Asset (bài học/guide/framework/case study) | `knowledge-seed-data.ts` | 80 asset (10 mỗi loại: GUIDE/PROMPT/TEMPLATE/CHECKLIST, 5 mỗi loại: FRAMEWORK/SOP/REFLECTION/CASE_STUDY/EXERCISE) | Nội dung thật, không giả | Một phần — chỉ 11/80 được gắn vào Collection/Journey | Không |
| Mission | 1 Mission pilot (Landing Page, không chiếu từ CKOS) | 1 | Có UI thật, có Unlock Engine thật (test có) | Có (Evidence + Reflection tự khai) | Không — không lưu bài Landing Page người dùng viết |
| Practice/Exercise | Trong mỗi Knowledge Seed (`exercise` field) | 80 (đi kèm mỗi asset) | Text thật | Có nút "Thực hành cùng Companion" | Không — nút chỉ mở Workspace, không lưu bài làm |
| Prompt (tĩnh) | `data/prompts.ts` | 12 | `preview` chỉ là teaser cắt ngắn, không có full body | Có nút "Dùng Prompt này" | Không |
| Prompt (Supabase) | `prompt_templates` table qua `/portal/prompts` | Phụ thuộc DB, có field `content` đầy đủ | Có, nếu DB có dữ liệu | Copy clipboard | Không |
| Checklist | `/portal/checklists` (CMS + static fallback) | Phụ thuộc CMS | Link `fileUrl`/`downloadLink` → mặc định `"#"` nếu chưa nhập | — | Không |
| Template | `/portal/templates` (CMS + static fallback) | Phụ thuộc CMS | Tương tự Checklist — mặc định `"#"` | — | Không |
| Resource | `/portal/resources` (Supabase `documents` + static) | Phụ thuộc DB | Có nếu DB có URL thật | — | Không |
| Workflow | `AI_WORKFLOWS` trong `ai-workspace.ts` | 4 | Chỉ là chuỗi tên bước, không có hướng dẫn chi tiết từng bước | Có nút "Thực hành quy trình này" | Không |
| AI Tool | `AI_TOOLS` | 10 | Nội dung biên tập thật (pricing/bestFor) | Không tích hợp trực tiếp (chỉ link ra ngoài) | — |
| Bài viết AI (Blog) | `AI_ARTICLES` (23 excerpt) + `/blog` | 23 (chỉ có excerpt, chưa xác nhận full body ở đâu) | Một phần | Không | Không |
| Unlockable Asset (Mission Pilot) | `unlock-assets.ts` | 3 (Prompt Pack, Checklist, Template cho Landing Page) | Text thật, nhưng xuất ra `.txt` tự sinh lúc click, không phải file thật có sẵn | Có (unlock sau Evidence+Reflection) | Không (file sinh ra không phải "kết quả người dùng tạo") |

**Cần chuyển vị trí?** Không phát hiện thêm nhu cầu di chuyển ngoài những gì
đã xử lý ở Sprint Content Audit trước — vấn đề hiện tại không phải vị trí,
mà là **thiếu tổ chức** (80 asset chưa gắn Collection) và **thiếu đầu ra
thật**.

---

## 4. Learning Path Audit

- `getAllLearningJourneys()` = chiếu 1:1 từ `getAllKnowledgeCollections()`
  — không phải nội dung Journey độc lập, chỉ có 2 Collection tồn tại
  (`ai-office`: 8 seed, `ai-research-presentation`: 3 seed). Comment trong
  code xác nhận chủ đích: "không tạo Collection giả để lấp chỗ trống."
- `computeJourneyStatus()` tính stage (7 mức: PREPARATION→READY) từ % hoàn
  thành seed + một flag "Tôi đã sẵn sàng" tự đánh dấu (`GrowthCheckpoint`)
  — thuần rule-based trên dữ liệu progress đã có, không phải assessment.
- `JourneyTimeline` chỉ là UI hiển thị 5 mốc tĩnh, không mang dữ liệu riêng.
- `CompanionGuidance` là 7 câu tĩnh theo stage, không cá nhân hóa thật.
- **Gap lớn nhất**: 80 Knowledge Asset đã có nội dung thật nhưng chỉ 11 cái
  được tổ chức thành Collection/Journey có thể học theo lộ trình — 69 asset
  còn lại tồn tại rời rạc, không có đường vào lộ trình học có cấu trúc.

---

## 5. Practice/Workspace Audit

- Mọi CTA "thực hành" (Journey, Mission Pilot, Knowledge Exercise, Companion
  Task Entry) đều dẫn tới cùng một `/portal/workspace` MVP.
- `WorkspaceMvp.tsx` hiển thị: context đầu vào (goal/title/nguồn/route gốc),
  một danh sách 3 bước kế hoạch **tĩnh, giống nhau cho mọi trường hợp**
  (không cá nhân hóa), và một khung placeholder ghi rõ "Kết quả sẽ hiển thị
  tại đây... chưa gọi AI thật, chưa có Agent thật."
- **Không có xử lý thật, không có kết quả thật, không có lưu trữ nhiều
  phiên** — `sessionStorage` chỉ giữ MỘT context hiện tại, bị ghi đè mỗi lần
  gọi mới. Không có danh sách lịch sử Workspace, không có Portfolio, không
  có Version 2 — grep toàn repo cho "Portfolio"/"phiên bản"/"Version 2" chỉ
  ra các cụm từ marketing, không phải tính năng.
- Mission Pilot (Landing Page) có Unlock Engine thật (state machine đã test)
  nhưng "Evidence" chỉ là nút tự nhận "Mình đã thử rồi" — không có nơi nộp/
  lưu bài Landing Page thật người dùng viết.

---

## 6. Companion Integration Audit

- Companion phía người dùng (Companion Desk, CompanionPresence, Orchestrator,
  Task Entry) **100% rule-based** — comment code xác nhận rõ ("Rule-based,
  chưa gọi AI thật"; "Cùng tab, không cần AI/API — chỉ là một event bus nhẹ").
- Một hệ thống gọi AI thật **có tồn tại** (`src/ai/agents/companion.agent.ts`
  → `fetch` tới Anthropic/OpenAI, cấu hình qua `ANTHROPIC_API_KEY`/
  `OPENAI_API_KEY`) nhưng **chỉ phục vụ Admin** viết nội dung
  (`CompanionWriteButton.tsx`) — hoàn toàn tách biệt, người học không bao
  giờ chạm tới AI thật này.
- Mọi CTA thực hành đã kết nối `startCompanionWorkspace` (Sprint 02) —
  điểm này đã tốt, chỉ là điểm đến (`/portal/workspace`) chưa xử lý gì thêm.
- Không có cơ chế Companion "chọn AI Agent" thật (Claude/ChatGPT/Canva/
  Gamma/Napkin như Product Principle mô tả) — chỉ có metadata mô tả Agent
  trong `agent-registry.ts`, chưa có logic điều phối multi-tool thật.

---

## 7. Resource/File Audit

- **Không một file thật nào** (.pdf/.docx/.xlsx/.md/.pptx/.csv) tồn tại
  trong `public/` — quét toàn bộ thư mục chỉ thấy ảnh/icon (`.png/.svg/
  .webp/.jpg/.ico`).
- `DownloadPrepCard.tsx` tự nhận là nhãn chờ, chưa có file thật ("sắp có").
- Checklist/Template ở `/portal/checklists`/`/portal/templates` phụ thuộc
  admin nhập `fileUrl`/`downloadLink` qua CMS — mặc định `"#"` nếu chưa có.
- Unlockable Asset (Mission Pilot) có text thật nhưng chỉ xuất `.txt` tự
  sinh lúc bấm "Lưu" (Blob client-side), không phải file chuẩn theo yêu cầu
  Learning OS (`.docx`/`.pdf` cho Landing Page, `.xlsx` cho Checklist...).
- Prompt tĩnh (`prompts.ts`) chỉ có `preview` bị cắt ngắn — không có full
  prompt body ở bất kỳ đâu cho 12 prompt này; bản Supabase (`prompt_templates`)
  có field `content` đầy đủ nhưng phụ thuộc DB có dữ liệu.

---

## 8. Assessment/Scoring Audit

- **Chủ đích không chấm điểm** — xác nhận rõ trong `use-growth-checkpoint.ts`
  ("không chấm điểm, không đúng/sai") và FAQ Academy.
- Cơ chế gần nhất với "đánh giá": `GrowthCheckpoint` (2 câu hỏi tự phản ánh,
  lưu localStorage, không chấm) và Evidence/Reflection binary gate của
  Mission Unlock (tự khai, không xác minh).
- **Không có quiz, không có rubric, không có đo lường kết quả thật, không
  có cách chứng minh "AI giúp hiệu quả hơn"** — đây là khoảng trống lớn so
  với tiêu chuẩn mới (mục 4.4/4.5 dưới đây).

---

## 9. Growth Event Audit

- `startCompanionWorkspace()` ghi đúng một loại event, `WORKSPACE_STARTED`,
  vào `localStorage["vdai_growth_events"]` (giới hạn 200 gần nhất).
- Grep toàn repo xác nhận: **key này chỉ được đọc/ghi trong chính
  `companion-workspace.ts`** — không file nào khác đọc nó.
- Nhật ký học tập (`/portal/news`) = blog Supabase, không liên quan Growth
  Event. Hành trình của tôi (`/portal/journey`, `/portal/hanh-trinh-cua-toi`)
  = dữ liệu tĩnh hoàn toàn. Khu vườn của bạn = `knowledge-garden.ts`, tự
  nhận là "seed data mẫu" — số lá/level/streak đều là số tĩnh, không tính
  từ hành vi thật.
- **Kết luận**: vòng lặp "Học → Làm → Workspace → Nhật ký → Hành trình →
  Khu vườn" hiện đứt hoàn toàn ở đoạn cuối — Growth Event được sinh ra
  nhưng vô tác dụng.

---

## 10. Gap Analysis

**Thiếu data model:**
- Model "Practice Output/Deliverable" (bài làm thật của người dùng, có type:
  facebook-post/landing-page/email/prompt..., có nội dung, có version).
- Model "Workspace Session History" (danh sách nhiều phiên, không chỉ 1
  context hiện tại).
- Model liên kết Knowledge Asset ↔ Collection (69/80 asset chưa gắn).
- Model đọc Growth Event thành số liệu hiển thị (Nhật ký/Hành trình/Khu vườn).

**Thiếu content:**
- Chỉ 2/nhiều Collection có Journey — cần tổ chức thêm asset đã có sẵn.
- Chưa có Video cho bất kỳ bài học nào (yêu cầu #5 trong Learning OS —
  Video là 1/10 thành phần bắt buộc, hiện tại 0/80 asset có video).
- Chưa có Đánh giá/Kết quả field trong Knowledge Seed type.

**Thiếu route:** không phát hiện thiếu route lớn — kiến trúc route hiện tại
đã đúng theo Sprint 02.

**Thiếu CTA:** không thiếu CTA điều hướng — thiếu CTA "Lưu kết quả",
"Xem Portfolio", "Tạo Version mới".

**Thiếu logic:**
- Logic lưu output thật vào Workspace (hiện chỉ lưu context, không lưu kết quả).
- Logic đọc Growth Event ở Nhật ký/Hành trình/Khu vườn.
- Logic Companion điều phối multi-Agent thật (Claude/ChatGPT/Canva...).
- Logic đánh giá/đo kết quả (dù không chấm điểm, vẫn cần "đo được" theo
  tiêu chuẩn mới — ví dụ số lượng/loại đầu ra, không phải điểm số).

**Thiếu file/tài liệu thật:** 100% Checklist/Template/Prompt Pack chưa có
file thật dùng được (.docx/.pdf/.xlsx/.md...).

**Thiếu liên kết giữa module:** Workspace ↔ Nhật ký/Hành trình/Khu vườn
(Growth Event chưa được đọc ở đâu ngoài nơi ghi).

---

## 11. Priority Roadmap

**P0 — Bắt buộc làm ngay (nền tảng để bất kỳ giáo trình nào hoạt động đúng
theo Learning OS Principle):**
1. Thiết kế model "Practice Output" — nơi lưu kết quả thật người dùng tạo
   ra trong Workspace (không chỉ context đầu vào).
2. Nối Growth Event → ít nhất 1 nơi hiển thị thật (vd. Khu vườn của bạn đọc
   số `WORKSPACE_STARTED` thật thay vì số tĩnh) — để "người dùng thấy mình
   đang trưởng thành" có cơ sở thật, không phải số giả.
3. Tổ chức 69 Knowledge Asset còn rời rạc vào Collection/Journey có cấu
   trúc (không tạo nội dung mới, chỉ tổ chức lại nội dung đã có).

**P1 — Nên làm trong sprint tiếp theo:**
4. Thay ít nhất 1 bộ Checklist/Template/Prompt Pack bằng file thật
   (.md/.xlsx tối thiểu) để có ví dụ mẫu đúng chuẩn "không file giả".
5. Thiết kế cơ chế "đo kết quả" không chấm điểm (đếm output/loại output,
   không phải điểm số) — chuẩn bị cho Dashboard Workspace ở mục 8 Product
   Principle.
6. Thiết kế Workspace Session History (nhiều phiên, không ghi đè).

**P2 — Làm sau:**
7. Video cho bài học (thành phần #1 trong chuẩn 10 phần, hiện chưa có).
8. Companion điều phối multi-Agent thật (Claude/ChatGPT/Canva/Gamma).
9. Mở khóa nội dung tiếp theo dựa trên Practice Output thật (thay vì
   Evidence tự khai).

---

## 12. Recommendation for Smart AI Curriculum

Nền tảng nội dung (CKOS Knowledge Asset) đã đủ chất lượng để làm gốc — vấn
đề không phải "viết thêm bài", mà là:

1. **Tổ chức lại trước khi viết thêm** — 69/80 asset đã có nội dung thật
   nhưng chưa vào lộ trình nào; ưu tiên gắn kết trước khi tạo asset mới,
   đúng tinh thần "100 Prompt dùng được tốt hơn 1000 Prompt cho có."
2. **Đóng vòng lặp Output → Workspace → Growth Event → Nhật ký/Hành
   trình/Khu vườn** trước khi thêm bất kỳ khóa học mới nào — nếu không,
   mọi bài học mới vẫn kết thúc ở "Bạn đã hoàn thành" thay vì một kết quả
   thật được lưu, vi phạm trực tiếp Learning OS Principle mục 04.
3. **Không tạo giáo trình mới cho tới khi có ít nhất 1 file thật** làm mẫu
   chuẩn (một Checklist `.xlsx` thật, một Template `.docx` thật) — để mọi
   giáo trình sau này dùng đúng chuẩn ngay từ đầu, tránh lặp lại
   `DownloadPrepCard` kiểu "sắp có."
4. Giữ nguyên triết lý không chấm điểm, nhưng bổ sung "đo được kết quả"
   theo hướng đếm/phân loại output thật (khớp Product Principle mục 8),
   không phải điểm số hay xếp hạng.

Audit trước — đã xong. Thiết kế Giáo trình AI thông minh nên bắt đầu từ P0
ở trên, không phải từ nội dung bài học mới.
