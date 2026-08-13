# Audit Supabase — trước khi thiết kế schema CKOS + Học viện AI + AI Workspace

**Ngày audit:** 2026-08-13
**Project:** `uosxpxolsvwcafxvnroy` (VO DUONG AI Project), Postgres 17.6, region ap-northeast-2
**Phạm vi:** CHỈ audit. Không tạo bảng, không sửa bảng, không migrate dữ liệu, không đề xuất schema mới.
**Nguồn dữ liệu:** `information_schema.columns`, `pg_class`/`pg_policy`, `jsonb_object_keys()` trên dữ liệu thật + đọc code `src/` (không suy đoán từ tên bảng).

---

## 1. Toàn bộ bảng schema `public` — 107 bảng, phân loại

### 1.1 Nhóm A — Bảng generic jsonb, ĐÃ đăng ký trong `SUPABASE_COLLECTIONS` (đọc/ghi qua `useCollection()` → `/api/admin/collections/[table]`)

Schema chung của cả nhóm: `id (text, PK do client đặt)`, `data (jsonb NOT NULL default '{}')`, `status (text NOT NULL default 'Draft')`, `"order" (int NOT NULL default 0)`, `created_at`, `updated_at` (cả 2 `timestamptz NOT NULL default now()`).

| Bảng | Số dòng | Bảng | Số dòng |
|---|---|---|---|
| `prompts` | 2 | `tools` | 11 |
| `templates` | 2 | `ebooks` | 1 |
| `checklists` | 2 | `sop` | 4 |
| `resources` | 10 | `blog` | 2 |
| `case_study` (legacy, khác `case_studies`) | 1 | `news` | 1 |
| `updates` | 5 | `community` | 5 |
| `student_success_stories` | 3 | `portal_banners` | 1 |
| `portal_cta` | 2 | `portal_featured` | 2 |
| `today_action_cards` | 4 | `start_here_steps` | 5 |
| `user_goals` | 5 | `roadmap_steps` | 8 |
| `daily_missions` | 3 | `affiliate_hub_sections` | 7 |
| `affiliate_hub_top_products` | 1 | `affiliate_products` | 1 |
| `affiliate_links` | 0 | `digital_asset_categories` | 5 |
| `digital_asset_projects` | 11 | `digital_asset_links` | 26 |
| `digital_asset_articles` | 6 | `digital_asset_settings` | 1 |
| `settings` | 1 | `portal_sections` | 10 |
| `portal_welcome` | 1 | `services` | 1 |
| `home_cards` | 7 | `projects` | 5 |
| `founder_profile` | 1 | `companion_persona` | 0 |
| `companion_conversation_strategy` | 0 | **`knowledge_seeds`** | **11** |
| **`knowledge_collections`** | **2** | **`best_practices`** | **13** |
| `mission_items` | 4 | `philosophy_pairs` | 4 |
| `constitution` | 10 | `genome` | 12 |
| `evolution` | 5 | `timeline` | 6 |
| `companion_flipbook_pages` | 7 | `mirror_chrome` | 1 |
| `mirror_questions` | 7 | `journal_chrome` | 1 |
| `journal_intentions` | 5 | `story_chrome` | 1 |
| `map_chrome` | 1 | `garden_chrome` | 1 |
| **`work_needs`** | **12** | **`hocvienai_faq`** | **3** |
| **`recommended_workspace`** | **8** | **`ai_workflow_sections`** | **4** |
| `ecosystem_chrome` | 5 | `ecosystem_articles` | 3 |
| `ecosystem_ratings` | 60 | `ecosystem_subprojects` | 5 |
| `landing_chrome` | 8 | `premium_chrome` | 1 |
| `premium_payment_steps` | 4 | `premium_faq` | 4 |

**Đăng ký trong `SUPABASE_COLLECTIONS` nhưng BẢNG CHƯA TỒN TẠI** (9 entry Companion Phase 7 chưa apply migration + 1 entry Phase 29): `companion_conversation_examples`, `companion_knowledge_refs`, `companion_memory_policy`, `companion_coaching_strategy`, `companion_training_scenarios`, `companion_capabilities`, `companion_safety_rules`, `companion_test_sessions`, `companion_versions`, `ai_provider_priority`.

### 1.2 Nhóm B — Bảng typed (dedicated schema), KHÔNG qua `SUPABASE_COLLECTIONS`

| Bảng | Số dòng | Cách truy cập |
|---|---|---|
| `members` | 16 | Server Actions + session client |
| `orders` | 4 | Checkout + webhook SePay + Admin đọc |
| `courses` | 5 | Server Actions `/admin/course-pricing` |
| `course_sections` | 2 | Server Actions Course Builder |
| `course_lessons` | 3 | Server Actions Course Builder |
| `lessons` | 1 | **mồ côi có chủ đích** (route `/portal/vdai-academy` đã xoá) |
| `case_studies` | 1 | Server Actions `/admin/ckos/case-studies` |
| `documents` | 4 | Server Actions `/admin/thuong-hieu-media/tai-lieu` |
| `saved_items` | 1 | Client `useSavedItems()` (RLS own-row) |
| `reflections` | 6 | Client (RLS own-row) |
| `memory_capsules` | 1 | Client (RLS own-row) |
| `companion_conversations` / `companion_messages` | 21 / 169 | Client (RLS own-row) |
| `coupons` | 1 | Server Actions + `applyCoupon()` |
| `referrals` | 0 | Trigger tự tạo + Admin đọc |
| `leads` | 8 | `/api/leads` + Admin đọc |
| `support_tickets` | 3 | `/portal/support` + Admin đọc |
| `email_log` | 15 | Ghi từ server |
| `products` | 0 | (chưa dùng) |
| `course_schedules` | 0 | (chưa dùng) |
| `experts` | 0 | (chưa dùng) |
| `blog_posts` | 0 | (chưa dùng — `/blogai` đọc `blog`) |
| `prompt_templates` | 0 | (mồ côi — `/portal/prompts` đọc `prompts`) |
| `notifications` | 1 | `NotificationTicker` |
| `submissions` | 0 | (chưa dùng) |
| `ecosystems` | 5 | (bảng cũ, Portal đọc `ecosystem_chrome` + `src/data/portal/ecosystems.ts`) |
| `affiliate_commission_rules` | 0 | Server Actions (migration phase27 CHƯA apply → bảng tồn tại nhưng rỗng) |
| `affiliate_link_visits` | 0 | idem |
| `affiliate_payout_requests` | 0 | idem |

### 1.3 Nhóm C — Bảng MỒ CÔI hoàn toàn (0 dòng, 0 policy, 0 tham chiếu trong `src/`)

Đây là nhóm cần chú ý nhất vì **tên trùng ý nghĩa với 3 module sắp thiết kế**:

| Bảng | Dòng | Ghi chú |
|---|---|---|
| `ai_workspace_recommended` | 0 | Trùng ý nghĩa `recommended_workspace` (8 dòng, ĐANG CHẠY THẬT) |
| `ai_workspace_workflow` | 0 | Trùng ý nghĩa `ai_workflow_sections` (4 dòng, ĐANG CHẠY THẬT) |
| `ai_workspace_prompts` | 0 | Trùng ý nghĩa `prompts` (2 dòng, ĐANG CHẠY THẬT) |
| `ai_workspace_resource` | 0 | Trùng ý nghĩa `resources` (10 dòng, ĐANG CHẠY THẬT) |
| `ai_workspace_settings` | 0 | — |
| `knowledge_seed` (SỐ ÍT) | 0 | Trùng tên gần hệt `knowledge_seeds` (11 dòng, ĐANG CHẠY THẬT) |
| `media_assets` | 0 | — |
| `mission_presentation` | 0 | — |
| `website_global_settings` | 0 | — |

**Cảnh báo tên bảng:** 6/9 bảng mồ côi này chiếm sẵn những cái tên "hiển nhiên" cho schema mới. Cùng lớp lỗi đã gặp trước đây (`lessons` bị chiếm → phải đổi thành `knowledge_seeds`; `course_modules`/`course_lessons` tồn tại sẵn ngoài migration history). Bất kỳ tên bảng mới nào cũng phải kiểm tra `to_regclass()` trước.

---

## 2. Cấu trúc chi tiết theo 3 module

### 2.1 CKOS (Hệ tri thức)

#### Tài liệu / nội dung tri thức — ĐÃ NỐI SUPABASE

| Bảng | Dòng | Field trong `data` jsonb (đọc thật từ dữ liệu) |
|---|---|---|
| `knowledge_seeds` (Lesson) | 11 | `id, slug, title, subtitle, summary, problem, goal, coreIdea, whyMatters, whatYouWillGain, persona, difficulty, estimatedTime, steps, guide, guideSteps, checklist, exercise, example, scenarios, prompts, samplePrompt, promptTips, promptExampleInput, promptExampleOutput, aiTools, skills, skillsGained, prerequisites, relatedSeeds, nextSeeds, nextStep, collectionSlug, commonMistakes, reflectionQuestions, companionNote, downloadPack, status, updatedAt, updatedBy` (~40 field) |
| `knowledge_collections` (Thư viện AI) | 2 | `id, name, description, seedSlugs, status` (schema đơn giản hoá — KHÔNG khớp 1:1 type `KnowledgeCollection` thật, thiếu `slug`/`title`/`relatedCollections`) |
| `best_practices` | 13 | `id, title, description, principle, relatedToolSlugs, relatedCaseStudyIds, legacySourceId, status` |
| `sop` (Workflow) | 4 | `id, slug, name, description, category, type, tier, steps, whenToUse, whenNotToUse, relatedPromptId, featured, requiresSignup, status` |
| `resources` | 10 | `id, slug, name, description, category, type, tier, whenToUse, whenNotToUse, relatedProjectHref, featured, requiresSignup, status` |
| `prompts` | 2 | `id, slug, title, description, content, category, level, tags, tier, exampleOutput, copyCount, featured, status` |
| `templates` | 2 | `id, slug, name, description, category, type, tier, tags, fileUrl, downloadLink, thumbnail, featured, requiresSignup, status` |
| `checklists` | 2 | idem `templates` |
| `ebooks` | 1 | `id, slug, name, description, category, type, tier, tags, featured, requiresSignup, status` |
| `case_studies` (TYPED) | 1 | Cột phẳng: `id (bigint), title (NOT NULL), client_name, summary, result_metric, thumbnail_url, link_url, active (bool default true), created_at` — **9 cột, KHÔNG có `status`/`updated_at`** |
| `documents` (TYPED) | 4 | `id (int serial), title (NOT NULL), description, url (default '#'), icon (default '📄'), bg_color (default '#EEF4FF'), display_order (default 0), active (default true), created_at` |

#### Danh mục (category) — **CHƯA CÓ BẢNG NÀO**

- 7 danh mục CKOS ("Công cụ AI / Prompt / Workflow / Resource / Lesson / Best Practice / Case Study") **hardcode trong `src/app/portal/ckos/page.tsx`** (hàm `getKnowledgeCategories()`, dòng ~71) — chỉ đếm số dòng động, còn danh sách category là mảng cứng trong code.
- `data.category` của từng bảng (`sop`/`resources`/`prompts`/`templates`/`checklists`/`ebooks`/`tools`) là **chuỗi tự do trong jsonb**, không có bảng danh mục/không có FK, không có ràng buộc giá trị.
- **Ghi nhận thêm:** `getKnowledgeCategories()` đếm Prompt/Workflow/Resource từ **mảng tĩnh** `src/data/*.ts` (`prompts.length`, `sops.length`, `freeResources.length`), chỉ Tool/Best Practice/Case Study/Lesson đếm từ Supabase thật → số hiển thị trên hub CKOS hiện KHÔNG phản ánh dữ liệu Admin cho 3 loại đó.

#### Tag — **CHƯA CÓ BẢNG NÀO**

`data.tags` là mảng string bên trong jsonb của `prompts`/`templates`/`checklists`/`ebooks`. Không có bảng `tags`, không có bảng join, không chuẩn hoá, không đếm/lọc chéo được ở tầng DB.

#### Thư viện cá nhân (tài liệu/ghi chú/thư mục của user) — **NỬA CÓ, NỬA CHƯA**

| Chức năng | Trạng thái | Nơi lưu |
|---|---|---|
| Lưu mục yêu thích (Prompt/Tool/Resource/Ebook/Checklist/Lesson/Affiliate) | **CÓ BẢNG THẬT** | `saved_items` (typed): `id (uuid)`, `member_id (uuid NOT NULL)`, `item_id (text)`, `kind (text)`, `title (text)`, `href (text)`, `meta (text, nullable)`, `created_at`. **1 dòng.** `SavedKind = prompt \| tool \| resource \| ebook \| checklist \| lesson \| affiliate` |
| Bookmark Lesson (saved / read_later / favorite) | **CHƯA NỐI — localStorage** | key `vdai_knowledge_seed_bookmarks`, `src/features/knowledge/utils/use-seed-bookmark.ts`. Comment trong file ghi rõ "Sẵn sàng migrate sang Supabase sau" |
| Ghi chú / suy ngẫm | **CÓ BẢNG THẬT** | `reflections` (typed): `id (uuid)`, `member_id`, `question (NOT NULL)`, `answer (NOT NULL)`, `created_at`. **6 dòng** |
| Ký ức / cột mốc | **CÓ BẢNG THẬT** | `memory_capsules` (typed): `id (uuid)`, `member_id`, `kind`, `title`, `description`, `occurred_at`, `created_at`. **1 dòng** |
| Thư mục (folder) do user tự tạo | **KHÔNG TỒN TẠI** | Không có bảng, không có code, không có localStorage |
| Ghi chú riêng trên từng Lesson | **CHƯA NỐI — localStorage** | `use-seed-reflection.ts`, `use-checklist-tick.ts` |

**Hai hệ "lưu" song song, không đồng bộ:** `saved_items` (Supabase, dùng ở `SaveButton.tsx`) và `vdai_knowledge_seed_bookmarks` (localStorage, dùng ở `BookmarkButton.tsx`) — 2 cơ chế khác nhau cho cùng khái niệm "lưu lại".

---

### 2.2 Học viện AI

#### Khoá học / bài học — ĐÃ NỐI SUPABASE (typed)

| Bảng | Dòng | Cột thật |
|---|---|---|
| `courses` | 5 | `id (text PK)`, `name (NOT NULL)`, `status (text, default 'coming')`, `description`, `price (int, default 0)`, `updated_at` — **6 cột** |
| `course_sections` | 2 | `id (bigint)`, `course_id (text, FK courses.id CASCADE)`, `title (NOT NULL)`, `sort_order (int, default 0)`, `status (text, default 'Draft')`, `created_at`, `updated_at` |
| `course_lessons` | 3 | `id (bigint)`, `section_id (bigint, FK course_sections.id CASCADE)`, `title (NOT NULL)`, `video_url`, `content (text)`, `duration_minutes (int, default 0)`, `is_free_preview (bool, default false)`, `sort_order`, `status (default 'Draft')`, `created_at`, `updated_at`, + **7 cột thừa chưa dùng**: `pdf_url`, `document_url`, `download_url`, `prompt_ref`, `template_ref`, `exercise_note`, `bonus_note` |
| `lessons` (KHÁC HẲN) | 1 | `id (bigint)`, `course_id (text)`, `title`, `description`, `video_url`, `pdf_url`, `price (int)`, `sort_order`, `active (bool)`, `created_at` — **mồ côi có chủ đích**, không route nào đọc |

#### Nội dung phụ trợ Học viện — ĐÃ NỐI (generic jsonb)

| Bảng | Dòng | Field `data` |
|---|---|---|
| `work_needs` | 12 | `title, description, icon` |
| `hocvienai_faq` | 3 | `q, a` (tên field 1 ký tự, KHÔNG phải `question`/`answer`) — `id` = `faq-1/2/3`, cả 3 `Published` |
| `roadmap_steps` | 8 | `id, title, description, icon, order, status` |
| `user_goals` | 5 | `id, label, description, goalKey, icon, order, relatedTool, suggestedRoute, suggestionText, status` |
| `daily_missions` | 3 | `id, title, description, link, points, taskType, repeatsDaily, order, status` |

#### Lộ trình học (Learning Path) — **CHƯA NỐI, ĐANG ĐỌC MẢNG TĨNH**

- `LEARNING_PATHS` — `src/data/portal/ai-workspace.ts` dòng 18. **Không có bảng Supabase nào.**
- `AI_RESOURCES` — cùng file, dòng 33. **Chưa nối, mảng tĩnh.**
- `NEED_CATEGORIES` / `PROFESSION_GROUPS` / `AI_PROMPTS` — `src/data/khong-gian-ai/index.ts` dòng 23/223. **Chưa nối, mảng tĩnh.**
- "Journey" (hành trình học) được suy ra runtime từ `knowledge_collections` + `knowledge_seeds` qua `journey.service.ts` — **không có bảng lộ trình riêng.**
- 80 Knowledge Asset — `src/features/knowledge/data/knowledge-seed-data.ts`, mảng tĩnh, **chưa từng đưa lên Supabase** (quyết định hoãn có chủ đích).

#### Tiến độ học (progress tracking) — **KHÔNG CÓ BẢNG NÀO. 100% localStorage**

| Dữ liệu | Nơi lưu | File |
|---|---|---|
| Bước Lesson đã hoàn thành | `localStorage["vdai_knowledge_seed_progress"]` (`Record<seedId, stepId[]>`) | `src/features/knowledge/utils/use-seed-progress.ts` |
| Tick checklist trong Lesson | localStorage | `use-checklist-tick.ts` |
| Lesson đang học dở (Continue Learning) | localStorage | `use-continue-learning.ts` |
| Growth Event / Timeline / Goal Runtime / Agent Run | localStorage (giới hạn 200-1000 bản ghi, tự cắt) | `src/lib/portal/foundation/{growth-event-bus,capability-engine,goal-runtime,agent-run-store}.ts` |

Comment gốc trong `use-seed-progress.ts`: *"chưa có backend cho Journey, thiết kế để sau này migrate sang Supabase chỉ cần đổi phần đọc/ghi bên trong hook này"*. `goal-001-dashboard.ts` cũng đã có sẵn checklist `"Lưu trữ bền vững (Supabase) thay vì localStorage", done: false`.

**Hệ quả thực tế:** tiến độ học mất khi đổi trình duyệt/thiết bị/xoá cache; không tổng hợp được ở tầng Admin.

#### Badge / Chứng chỉ — **KHÔNG TỒN TẠI Ở BẤT KỲ TẦNG NÀO**

Grep toàn bộ `src/` (`badge`, `certificate`, `chứng chỉ`, `chung-chi`, case-insensitive): 0 kết quả thuộc nghiệp vụ. Mọi kết quả đều là UI khác nghĩa (`SaveStateBadge.tsx` — badge trạng thái lưu của Admin; `statusBadge` — nhãn trạng thái hệ sinh thái; `badge` trang trí ở Landing Page). Không bảng, không type, không localStorage, không UI.

---

### 2.3 AI Workspace

#### Nội dung Workspace — ĐÃ NỐI (generic jsonb)

| Bảng | Dòng | Field `data` |
|---|---|---|
| `recommended_workspace` (Workspace đề xuất) | 8 | `title, goal, estimatedTime, expectedOutput, suggestedTools` |
| `ai_workflow_sections` (Workflow mẫu) | 4 | `title, steps, suggestedTools` |
| `tools` (Công cụ AI) | 11 | `id, slug, name, tagline, shortDescription, longDescription, category, audience, bestFor, notGoodFor, useCase, workflow, pros, cons, pricing, pricingNote, rating, badge, logo, link, ctaText, ctaLink, affiliateUrl, tier, featured, companionSummary, relatedArticleSlugs, relatedNeedSlugs, relatedPromptId, relatedResourceHref, status` (31 field) |
| `prompts` | 2 | (dùng chung với CKOS — xem 2.1) |

#### Dự án / phiên làm việc (Workspace Session) — **KHÔNG CÓ BẢNG NÀO. 100% localStorage**

`src/lib/portal/foundation/workspace-session-store.ts` — comment gốc: *"Workspace Session thật … (localStorage, chưa có backend — đúng tinh thần 'chưa gọi AI thật' đã giữ xuyên suốt EPIC 02-03), có thể Pause/Resume/Complete, giữ Output + Version + lịch sử đầy đủ."*

Cấu trúc runtime đang có (chỉ trong localStorage, không có bảng):
- `WorkspaceSession` — context, module, trạng thái, output, version, lịch sử
- `ExecutionStepId` — 7 bước (`mission_started → preparing → research → draft → review → revision → completed`)
- Agent Run Log (`agent-run-store.ts`), Growth Event (`growth-event-bus.ts`), Mission unlock (`mission-unlock-runtime.ts`)

**Không có khái niệm "dự án" (project workspace của user) ở tầng DB.** Bảng `projects` (5 dòng) là **hệ sinh thái Dự án & Cơ hội** — hoàn toàn khác nghĩa, không liên quan AI Workspace.

#### Công cụ yêu thích — **NỬA CÓ**

- `saved_items` với `kind = 'tool'` — cơ chế thật, có bảng, có RLS. Hiện **1 dòng trong toàn bảng** (mọi kind cộng lại).
- Không có bảng riêng cho "công cụ yêu thích", không có đếm lượt yêu thích, không có xếp hạng theo user.

---

## 3. Bảng `members` — field phân quyền THẬT đang dùng

**Không có bảng `profiles`.** Bảng duy nhất là `public.members` (16 dòng), khoá `id` = `auth.users.id`.

| Cột | Kiểu | Null | Default |
|---|---|---|---|
| `id` | `uuid` | NO | — |
| `email` | `text` | NO | — |
| `full_name` | `text` | YES | — |
| `status` | `text` | YES | `'active'` |
| `created_at` | `timestamptz` | YES | `now()` |
| `referral_code` | `text` | YES | (trigger `set_referral_code` tự sinh) |
| `referred_by` | `text` | YES | — (0/16 dòng có giá trị) |
| **`is_admin`** | **`boolean`** | **NO** | **`false`** |
| `avatar_url` | `text` | YES | — |
| `occupation` | `text` | YES | — |
| `ai_goal` | `text` | YES | — |
| `interests` | `text[]` | NO | `'{}'` |
| `onboarding_completed_at` | `timestamptz` | YES | — |

### Trả lời trực tiếp câu hỏi

- **`is_premium`** — **KHÔNG TỒN TẠI**
- **`plan_type`** — **KHÔNG TỒN TẠI**
- **`premium_expires_at`** — **KHÔNG TỒN TẠI**
- Field phân quyền THẬT duy nhất: **`is_admin` (boolean, NOT NULL, default false)** — mô hình nhị phân Admin/User, không có vai trò trung gian, không có bảng role/permission nào trong DB.

### Quyền "đã mua / Premium" được suy ra, không lưu trên `members`

`src/lib/access.ts` → `getPurchasedIds(column)`:
- Đọc bảng **`orders`**, lọc `member_email = email user đang đăng nhập` **AND** `status = 'confirmed'`
- Lấy `course_id` / `lesson_id` / `product_id` tuỳ loại sản phẩm
- **Không có khái niệm hết hạn** — mua 1 lần = truy cập vĩnh viễn. Không cột nào lưu ngày hết hạn ở bất kỳ đâu.
- Tại thời điểm audit: `orders` có 4 dòng, **0 dòng `status='confirmed'`** → hiện chưa user nào có quyền Premium thật.

Cột liên quan trong `orders`: `member_email (NOT NULL)`, `product_id (bigint)`, `product_name`, `amount (int NOT NULL)`, `status (default 'pending')`, `confirmed_at`, `lesson_id (bigint)`, `course_id (text)`, `course_ref_id (text)`, `order_code`, `payment_reference`, `customer_name`, `customer_phone`, `created_at`.

---

## 4. RLS — trạng thái có/không

### 4.1 Tổng quan

**RLS đã BẬT (`relrowsecurity = true`) trên 100% bảng schema `public`** — không có bảng nào tắt RLS.

### 4.2 Nhưng 11 bảng BẬT RLS mà KHÔNG CÓ POLICY NÀO

`rls_enabled = true` + `0 policy` = **không ai đọc/ghi được qua anon key hoặc session user** (chỉ `service_role` bypass được):

| Bảng | Dòng |
|---|---|
| `ai_workspace_recommended` | 0 |
| `ai_workspace_workflow` | 0 |
| `ai_workspace_prompts` | 0 |
| `ai_workspace_resource` | 0 |
| `ai_workspace_settings` | 0 |
| `knowledge_seed` (số ít) | 0 |
| `companion_persona` | 0 |
| `companion_conversation_strategy` | 0 |
| `media_assets` | 0 |
| `mission_presentation` | 0 |
| `website_global_settings` | 0 |

Cả 11 đều 0 dòng nên hiện chưa gây hậu quả — nhưng đây đúng là tình huống đã ghi nhận trước đây với `course_modules`/`course_lessons` ("RLS bật, 0 policy, không ai đọc được kể cả Published").

### 4.3 RLS của các bảng liên quan trực tiếp 3 module

| Bảng | Policy |
|---|---|
| `knowledge_seeds` | ✅ `public read published [SELECT]` |
| `knowledge_collections` | ✅ `public read published [SELECT]` |
| `best_practices` | ✅ `public read published [SELECT]` |
| `sop`, `resources`, `prompts`, `templates`, `checklists`, `ebooks`, `tools` | ✅ `public read published [SELECT]` (mỗi bảng 1 policy) |
| `recommended_workspace` | ✅ `recommended_workspace_public_select [SELECT]` |
| `ai_workflow_sections` | ✅ `ai_workflow_sections_public_select [SELECT]` |
| `work_needs` | ✅ `work_needs_public_select [SELECT]` |
| `hocvienai_faq` | ✅ `hocvienai_faq_public_select [SELECT]` |
| `roadmap_steps`, `user_goals`, `daily_missions` | ✅ `public read published [SELECT]` |
| `case_studies` | ✅ 2 policy: `admin all [ALL]` + `public read [SELECT]` |
| `documents` | ✅ 2 policy: `docs_admin [ALL]` + `docs_read [SELECT]` |
| `courses` | ✅ 2 policy: `courses_admin [ALL]` + `courses_read [SELECT]` |
| `course_sections` | ✅ `public read published [SELECT]` |
| `course_lessons` | ✅ `public read published [SELECT]` |
| `lessons` | ✅ 3 policy (2 trùng lặp: `Public read active lessons` + `public read active lessons`) + `Admin all` |
| `saved_items` | ✅ `members manage own saved items [ALL]` |
| `reflections` | ✅ `members manage own reflections [ALL]` |
| `memory_capsules` | ✅ `members manage own memory capsules [ALL]` |
| `members` | ✅ 4 policy: `admin_all [ALL]`, `members can read own row [SELECT]`, `users_own [SELECT]` (trùng lặp), `users can update own profile [UPDATE]` |
| `orders` | ✅ 4 policy: `Admin all [ALL]`, `Members insert own [INSERT]`, `Members read own [SELECT]`, `members can read own orders [SELECT]` (trùng lặp) |

**Policy trùng lặp đã phát hiện** (không gây lỗi, chỉ là rác): `lessons` (2 policy read active giống hệt), `products` (idem), `members` (`users_own` ≡ `members can read own row`), `orders` (`Members read own orders` ≡ `members can read own orders`), `referrals` (`Admin full access to referrals` ≡ `referrals_admin`).

---

## 5. Báo cáo tổng kết — 3 nhóm

### 5.1 ✅ TÁI SỬ DỤNG ĐƯỢC NGAY (không cần đụng gì)

| Bảng | Dùng cho | Lý do |
|---|---|---|
| `knowledge_seeds` (11) | CKOS — Lesson | Schema ~40 field đầy đủ, RLS đúng, Admin CRUD chạy thật |
| `knowledge_collections` (2) | CKOS — Thư viện AI | Đang chạy thật (schema đơn giản hoá, xem 5.3) |
| `best_practices` (13) | CKOS — Best Practice | Đầy đủ, đang chạy |
| `sop` (4), `resources` (10), `prompts` (2), `templates` (2), `checklists` (2), `ebooks` (1) | CKOS — tài liệu | Cùng schema generic, RLS đúng, Admin CRUD chạy thật |
| `case_studies` (1) | CKOS — Case Study | Typed, RLS 2 policy, Server Actions chạy thật |
| `documents` (4) | CKOS — tài liệu tải về | Typed, RLS đúng, Admin CRUD vừa xây |
| `tools` (11) | AI Workspace — công cụ | 31 field, đầy đủ nhất trong nhóm |
| `recommended_workspace` (8) | AI Workspace — workspace đề xuất | Đang chạy thật |
| `ai_workflow_sections` (4) | AI Workspace — workflow mẫu | Đang chạy thật |
| `courses` (5) + `course_sections` (2) + `course_lessons` (3) | Học viện — khoá/chương/bài | Quan hệ FK CASCADE đúng, RLS đúng, Course Builder + trang học viên chạy thật |
| `work_needs` (12), `hocvienai_faq` (3), `roadmap_steps` (8), `user_goals` (5), `daily_missions` (3) | Học viện — nội dung phụ trợ | Đang chạy thật |
| `saved_items` (1) | Thư viện cá nhân — lưu mục | Typed, RLS own-row, `SavedKind` đã có 7 loại |
| `reflections` (6), `memory_capsules` (1) | Thư viện cá nhân — ghi chú/ký ức | Typed, RLS own-row, đang chạy thật |
| `members` (16) | Định danh | Đủ dùng cho quyền Admin nhị phân |
| `orders` (4) | Quyền "đã mua" | Cơ chế `getPurchasedIds()` chạy thật |

### 5.2 ❌ CHẮC CHẮN CẦN TẠO MỚI (hiện KHÔNG có bảng nào)

| Nhu cầu | Module | Hiện trạng |
|---|---|---|
| **Tiến độ học (progress tracking)** | Học viện | 100% localStorage (`vdai_knowledge_seed_progress`) — mất khi đổi thiết bị, Admin không thấy được |
| **Badge / Chứng chỉ** | Học viện | **Không tồn tại ở bất kỳ tầng nào** (0 bảng, 0 code, 0 localStorage, 0 UI) |
| **Lộ trình học (Learning Path)** | Học viện | Mảng tĩnh `LEARNING_PATHS` (`src/data/portal/ai-workspace.ts:18`) |
| **Dự án / Phiên làm việc Workspace** | AI Workspace | 100% localStorage (`workspace-session-store.ts` — Session/Output/Version/lịch sử/7 bước Execution) |
| **Danh mục (category) CKOS** | CKOS | Hardcode trong `ckos/page.tsx:71` + chuỗi tự do trong `data.category` |
| **Tag** | CKOS | Chỉ là mảng string trong jsonb, không chuẩn hoá, không lọc chéo được ở DB |
| **Thư mục (folder) do user tự tạo** | Thư viện cá nhân | Không tồn tại (0 bảng, 0 code) |
| **Bookmark Lesson (saved/read_later/favorite)** | Thư viện cá nhân | localStorage `vdai_knowledge_seed_bookmarks` — song song và KHÔNG đồng bộ với `saved_items` |
| **Ghi chú riêng trên từng Lesson** | Thư viện cá nhân | localStorage (`use-seed-reflection.ts`, `use-checklist-tick.ts`) |
| **Phân quyền Premium có thời hạn** | Toàn hệ | Không cột nào lưu hạn dùng; quyền suy ra từ `orders.status='confirmed'` = vĩnh viễn |
| **Danh mục nhu cầu / nghề nghiệp** | AI Workspace | Mảng tĩnh `NEED_CATEGORIES`/`PROFESSION_GROUPS` (`src/data/khong-gian-ai/index.ts:23,223`) |
| **80 Knowledge Asset** | CKOS | Mảng tĩnh `knowledge-seed-data.ts`, chưa lên Supabase (hoãn có chủ đích) |

### 5.3 ⚠️ CẦN MỞ RỘNG THÊM CỘT / SỬA (bảng đã có nhưng thiếu)

| Bảng | Thiếu gì |
|---|---|
| `knowledge_collections` | `data` chỉ có `name/description/seedSlugs` — thiếu `slug`, `title`, `relatedCollections` so với type `KnowledgeCollection` thật. Trang chi tiết Collection vẫn phải fallback sang mảng tĩnh |
| `case_studies` | **Không có cột `status`** (chỉ `active` boolean) và **không có `updated_at`** → không gộp được vào khối Published/Draft chung, bị loại khỏi "Cập nhật gần đây" của CKOS Dashboard |
| `documents` | Không có `status`/`updated_at` (chỉ `active`/`created_at`) — cùng vấn đề `case_studies` |
| `courses` | Chỉ 6 cột. Không có `slug`, `thumbnail`, `level`, `duration`, `instructor`, `category`, `created_at` |
| `course_lessons` | **7 cột thừa chưa dùng** (`pdf_url`, `document_url`, `download_url`, `prompt_ref`, `template_ref`, `exercise_note`, `bonus_note`) — cần quyết định dùng hay bỏ trước khi thiết kế thêm |
| `course_sections` / `course_lessons` | Dùng `sort_order` (khác convention `"order"` của mọi bảng generic) — cần thống nhất tên khi thiết kế bảng mới liên quan |
| `saved_items` | `kind` là text tự do, không ràng buộc. Chưa hỗ trợ `knowledge_seed`/`best_practice`/`case_study`/`document`. Không có `folder_id` (chưa có khái niệm thư mục) |
| `members` | Không có field Premium nào (`is_premium`/`plan_type`/`premium_expires_at`) — nếu muốn phân quyền theo gói/hạn dùng thì phải mở rộng ở đây hoặc tạo bảng riêng |
| `hocvienai_faq` | Field đặt tên 1 ký tự `q`/`a` — lệch hẳn convention mọi bảng khác (`title`/`description`/`content`), khó đọc khi mở rộng |
| `lessons`, `products`, `members`, `orders`, `referrals` | Có policy RLS trùng lặp (rác, không gây lỗi) |
| 11 bảng mồ côi (mục 1.3) | Bật RLS nhưng 0 policy — nếu tái sử dụng bất kỳ bảng nào, phải thêm policy trước |

---

## 6. Rủi ro cần lưu ý trước khi thiết kế schema (không phải đề xuất, chỉ ghi nhận)

1. **6 tên bảng "hiển nhiên" đã bị chiếm** bởi bảng mồ côi 0 dòng: `ai_workspace_recommended`, `ai_workspace_workflow`, `ai_workspace_prompts`, `ai_workspace_resource`, `ai_workspace_settings`, `knowledge_seed` (số ít). Cùng lớp lỗi đã gặp với `lessons` và `course_lessons`. **Luôn `to_regclass()` trước khi đặt tên bảng mới.**
2. **Route generic `/api/admin/collections/[table]` hard-code schema `id/data/status/"order"`** — bảng nào lệch schema này (dùng `sort_order`, id bigint tự tăng, không có `data`) thì KHÔNG dùng được route chung, phải viết Server Actions riêng như `courses`/`case_studies`/`coupons`/`documents`.
3. **Field tên `status` bên trong `data` jsonb sẽ bị cột `status` ngoài ghi đè** khi GET route merge — đã gặp thật với `ecosystem_ratings` (phải đổi thành `ratingStatus`).
4. **Mọi tiến độ/session/lịch sử hiện đang ở localStorage đều có giới hạn tự cắt** (Growth Event 200 bản ghi, Timeline 1000, Agent Run có `MAX_RUNS`) — migrate lên DB sẽ mất phần dữ liệu đã bị cắt, không khôi phục được.
5. **`orders` hiện 0 dòng `confirmed`** → mọi tính năng phụ thuộc quyền Premium hiện chưa có dữ liệu thật để test.
