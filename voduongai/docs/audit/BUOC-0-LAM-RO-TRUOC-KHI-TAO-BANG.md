# Bước 0 — Làm rõ trước khi tạo bảng mới (CKOS + Học viện AI + AI Workspace)

**Ngày:** 2026-08-13
**Đầu vào:** `Schema-CKOS-HocVien-Workspace.md` + `Lenh-Trien-khai-Schema.md` (Founder gửi)
**Trạng thái:** ĐÃ DỪNG theo đúng lệnh — chưa tạo bảng, chưa ALTER, chưa viết Server Actions.
**Phương pháp:** đọc dữ liệu thật qua Supabase MCP + đọc code `src/` (không suy đoán từ tên).

---

## PHẦN 1 — Trả lời 2 điểm của Bước 0

### 1.1 `work_needs` vs `members.occupation` — **LÀ 2 KHÁI NIỆM KHÁC NHAU. Không trùng.**

| | `work_needs` (12 dòng, Supabase) | `members.occupation` (text tự do) |
|---|---|---|
| Trả lời câu hỏi | "Bạn muốn AI **làm giúp việc gì**?" | "Bạn **là ai** / làm nghề gì?" |
| Ví dụ giá trị thật | `viet-noi-dung`, `thiet-ke-hinh-anh`, `tao-video`, `marketing`, `ban-hang`, `nghien-cuu`, `phan-tich-du-lieu`, `hoc-tap`, `van-phong`, `coding`, `automation`, `dau-tu-du-an` | `"Nhà đầu tư"` (2/16 dòng), còn lại `null` (14/16) |
| Field | `data: {title, description, icon}` | 1 cột text |
| Nhập ở đâu | Admin quản qua `/admin/hocvienai/work-needs` | User tự gõ ở Onboarding (`OnboardingIdentityForm.tsx` — **`<input>` text tự do, KHÔNG phải `<select>`**) |
| Dùng để làm gì | Hiển thị lưới 12 thẻ nhu cầu ở `/portal/hocvienai` (`WorkNeedSection`) | Chỉ hiển thị lại ở `/portal/account` + `/admin/nguoi-dung/ho-so`. **Không lọc, không gợi ý, không tra cứu gì** |

**Kết luận:** `work_needs` phục vụ đúng "danh mục **nhu cầu công việc**" và **đã đủ dùng** — giữ nguyên trong nhóm tái sử dụng, không cần bảng mới cho phần này.

**Nhưng phát hiện thêm 1 khái niệm THỨ BA mà cả audit trước lẫn schema đều chưa nhắc — "nghề nghiệp" đã tồn tại dưới dạng mảng tĩnh:**

- `NEED_CATEGORIES` (`src/data/khong-gian-ai/index.ts:23`) — **9 mục**, slug khớp một phần `work_needs` (`viet-noi-dung`, `phan-tich-du-lieu`, `nghien-cuu`, `marketing`, `thiet-ke-hinh-anh`…) nhưng **giàu field hơn hẳn** (`subtasks[]`, `recommendedToolSlugs[]`, `relatedArticleSlugs[]`, `ctaLabel`, `ctaHref`, `emoji`, `color`) và **là nguồn của route thật `/portal/aiworkspace/[slug]`**.
- `PROFESSION_GROUPS` (cùng file, dòng 223) — **50 mục**, ĐÂY MỚI LÀ "nghề nghiệp": `dan-van-phong`, `nguoi-ban-hang-va-kinh-doanh`, `affiliate-marketing`, `content-creator`, `designer`, `lap-trinh-vien`, `sinh-vien`, `giao-vien`, `chu-doanh-nghiep`, `nha-dau-tu`… (10 nghề đầu), + 10 slug công cụ (`chatgpt`, `claude`, `cursor`…) + 30 slug tình huống công việc — **3 loại thực thể khác nhau bị gộp chung 1 mảng**.

**⚠️ Lệch dữ liệu cần Founder quyết định:** `work_needs` (12, Supabase) và `NEED_CATEGORIES` (9, tĩnh) **KHÔNG khớp nhau**:
- Có trong `work_needs` mà không có trong `NEED_CATEGORIES`: `tao-video` (vs `lam-video`), `coding` (vs `lap-trinh`), `automation` (vs `tu-dong-hoa`), `ban-hang`, `hoc-tap`, `van-phong`, `dau-tu-du-an`.
- Có trong `NEED_CATEGORIES` mà không có trong `work_needs`: `dich-thuat`.
- 3 cặp **cùng nghĩa nhưng khác slug** → bấm thẻ ở `/portal/hocvienai` không tra được sang trang `/portal/aiworkspace/[slug]`.

**❓ CẦN FOUNDER QUYẾT (3 lựa chọn, chưa tự làm):**
- **(a)** Chỉ chuẩn hoá `occupation` thành bảng lookup nghề nghiệp riêng (VD `professions`), giữ nguyên `work_needs`.
- **(b)** Gộp `NEED_CATEGORIES` (9, tĩnh) vào `work_needs` (mở rộng `data` thêm `subtasks/recommendedToolSlugs/ctaHref…`), thống nhất 3 cặp slug lệch, rồi mới tính bảng nghề nghiệp.
- **(c)** Chưa làm gì cả ở đợt này — chỉ ghi nhận, xử lý ở việc riêng.

---

### 1.2 "80 Knowledge Asset" — **LÀ DỮ LIỆU THẬT, KHÔNG PHẢI mục tiêu số lượng**

Xác nhận bằng cách đếm trực tiếp trong code (không suy đoán):

- **File:** `src/features/knowledge/data/knowledge-seed-data.ts` → `knowledgeSeedData: KnowledgeAsset[]`, **đúng 80 mục** (đếm bằng `id:`).
- **Type:** `KnowledgeAsset` (`src/features/knowledge/types/knowledge.types.ts`) — mô hình "mọi nội dung tri thức là 1 Asset, chỉ khác `type`". Enum `KnowledgeType` có 18 giá trị.
- **Phân loại 80 mục theo `type` thật:** GUIDE 13 · PROMPT 13 · CHECKLIST 13 · TEMPLATE 10 · REFLECTION 8 · EXERCISE 8 · SOP 5 · FRAMEWORK 5 · CASE_STUDY 5.
- **Nội dung KHÔNG rỗng** — mỗi mục có đủ `content`/`summary`/`practice`/`reflectionQuestions`/`nextStep`.

**Quan hệ với 11 Lesson trên Supabase (`knowledge_seeds`) — đã đếm lại chính xác:**
- 11 Lesson có tổng **74 step**, trong đó **72 step có `assetId`**, 2 step `assetId = null` ("sắp có").
- `assetId` được tra cứu qua **`getKnowledgeAssetBySlug(step.assetId)`** (`knowledge-seed.service.ts:79`) → **assetId trỏ tới `slug` của Asset, không phải `id`**. Đây là chi tiết quan trọng nếu migrate: **đổi `slug` sẽ gãy 72 điểm tham chiếu**, không phải đổi `id`.
- 80 Asset là **tập lớn hơn hẳn**; 11 Lesson chỉ là hành trình tuyển chọn tham chiếu vào một phần của tập đó.

**Gap UX thật (không chỉ gap dữ liệu):** UI hiện tại (`KnowledgeAssetCard`, khối "Tìm tri thức lẻ theo bộ lọc" ở `/portal/hetrithucai`) **không có link/onClick nào** để mở nội dung đầy đủ — chỉ hiện title + tóm tắt 2 dòng. Nghĩa là dù migrate lên Supabase, vẫn cần làm thêm trang/cách xem chi tiết thì mới dùng được.

**Kết luận:** đây là 1 tập dữ liệu thật, có cấu trúc, đang chạy — không phải mục tiêu "mở rộng CKOS lên 80 tài liệu". CLAUDE.md đã có quyết định trước đó của Founder: **hoãn migrate 80 Asset**, ưu tiên Case Study / Best Practice / CKOS Dashboard trước.

**❓ CẦN FOUNDER XÁC NHẬN:** quyết định hoãn đó **còn hiệu lực** hay đợt này muốn đưa 80 Asset vào schema? Nếu làm, cần kèm 3 điều kiện đã ghi trong CLAUDE.md: (1) audit đầy đủ field `KnowledgeAsset` trước khi thiết kế, (2) **giữ nguyên `slug`** (72 điểm tham chiếu), (3) làm luôn trang xem chi tiết ở Portal.

---

## PHẦN 2 — Câu hỏi mở của Bước 2 (trả lời luôn để Founder quyết 1 lượt)

### `workspace_project_outputs` — **CẦN TÁCH BẢNG RIÊNG. Không gộp được vào `workspace_project_steps`.**

Đọc `workspace-session-store.ts` xác nhận cấu trúc thật:

```
WorkspaceSessionRecord
├─ sessionId, status(active|paused|completed), currentStepId
├─ startedAt / pausedAt / resumedAt / finishedAt
├─ context: WorkspaceContext  ← 20 field (module, source, title, userGoal,
│                                itemId, itemType, expectedOutput, routeFrom,
│                                journeyId, collectionId, missionId, assetId,
│                                resourceId, promptId, templateId, difficulty,
│                                currentCapability, currentJourney…)
├─ history: HistoryEntry[]    ← {label, occurredAt} — nhật ký sự kiện
└─ outputs: OutputRecord[]    ← QUAN HỆ 1-N, ĐỘC LẬP với 7 bước
    ├─ outputId, type (9 loại: word|excel|prompt|markdown|pdf|image|link|code|landing_page)
    ├─ versions: OutputVersionRecord[]  ← QUAN HỆ 1-N LỒNG TIẾP {versionNumber, content, editedAt}
    ├─ reviewStatus (not_ready|pending|reviewed)
    ├─ reflectionStatus (not_ready|pending|submitted)
    ├─ reflections: ReflectionAnswer[]  ← 1-N nữa {question, answer, submittedAt}
    ├─ agentReview?: AgentReviewResult  ← {strengths[], issues[],
    │                                      suggestedImprovements[],
    │                                      approvalRecommendation, versionSuggestion, isMock}
    ├─ approvalStatus? (draft|reviewed|needs_revision|approved)
    └─ createdAt, updatedAt
```

**Lý do bắt buộc tách:**
1. `outputs` **không gắn với step nào** — 1 session có nhiều Output, mỗi Output có vòng đời riêng (review → reflection → approval) chạy song song, không phải kết quả của 1 trong 7 bước.
2. `versions[]` là quan hệ **1-N lồng bên trong** Output → nhét vào `workspace_project_steps` sẽ thành jsonb lồng 3 tầng, không query/lọc được.
3. 3 trạng thái độc lập (`reviewStatus`, `reflectionStatus`, `approvalStatus`) + `reflections[]` + `agentReview` đều thuộc về Output, không thuộc về step.

**Đề xuất cấu trúc tối thiểu (CHƯA TẠO — chờ duyệt):** `workspace_project_outputs` (output_id, project_id FK, type, review_status, reflection_status, approval_status, agent_review jsonb, created_at, updated_at) + `workspace_output_versions` (version_number, content, edited_at) + `workspace_output_reflections` (question, answer, submitted_at). Tức **3 bảng**, không phải 1 — hoặc chấp nhận gộp `versions`/`reflections` vào jsonb nếu Founder muốn giảm số bảng (đánh đổi: không query theo version được).

**Thêm:** `WorkspaceSessionRecord.history[]` và `context` (20 field) cũng chưa có chỗ trong schema đề xuất — cần quyết định giữ `context` dạng jsonb 1 cột hay bung thành cột riêng.

---

## PHẦN 3 — ⛔ 7 LỖI KỸ THUẬT TRONG SCHEMA ĐỀ XUẤT (phải sửa trước khi chạy Bước 1/2)

Phát hiện khi đối chiếu schema đề xuất với DB thật. Nếu chạy nguyên văn sẽ hỏng hoặc không có tác dụng.

| # | Vị trí trong `Schema-CKOS-HocVien-Workspace.md` | Vấn đề | Thực tế |
|---|---|---|---|
| **1** | Phần B — `hocvienai_faq`: "đổi tên **cột** `q`→`question`, `a`→`answer`" | **`q`/`a` KHÔNG PHẢI CỘT** — chúng là key bên trong `data` jsonb. `ALTER TABLE … RENAME COLUMN q` sẽ lỗi ngay. | Bảng chỉ có 6 cột `id/data/status/order/created_at/updated_at`. Muốn đổi phải `UPDATE … SET data = data - 'q' \|\| jsonb_build_object('question', data->>'q')`. |
| **2** | Phần B — `knowledge_collections`: thêm **cột** `slug`, `title`, `related_collections uuid[]` | Đây là **bảng generic jsonb**. Thêm cột thật thì **route `/api/admin/collections/[table]` không bao giờ đọc/ghi tới** (`select("id, data, status, order")`, `upsert({id, data, status, order})`) → cột luôn rỗng, Admin không sửa được. | Phải thêm **key vào `data` jsonb**, không phải thêm cột. |
| **3** | Phần C2 — `user_lesson_progress.lesson_id FK → course_lessons` | **Nhầm 2 khái niệm "lesson" khác nhau** — đúng cái bẫy CLAUDE.md đã cảnh báo. Dữ liệu cần migrate (`vdai_knowledge_seed_progress`) có dạng `Record<seedId(text), stepId(text)[]>` của **`knowledge_seeds`** (11 dòng, id **text**), KHÔNG phải `course_lessons` (3 dòng, id **bigint**, nội dung khoá Premium). FK này không chứa được dữ liệu định migrate. | Thực chất là **2 hệ tiến độ khác nhau**: (A) tiến độ **step của CKOS Lesson** — đang có localStorage; (B) tiến độ **xem video bài học Premium** (`watched_seconds`) — **hiện chưa tồn tại ở bất kỳ đâu** (`CourseLearnClient.tsx` cố ý "KHÔNG xây course progress"). Cần **2 bảng riêng**, hoặc 1 bảng polymorphic. |
| **4** | Phần C3 — `workspace_projects.workflow_id FK → ai_workflow_sections` | `ai_workflow_sections.id` là **`text`** (bảng generic). Nếu khai `uuid` thì tạo FK thất bại. | Phải khai `text`. |
| **5** | Phần C1 — `ckos_content_tags.content_id uuid` | Không nội dung CKOS nào có id kiểu uuid: `knowledge_seeds`/`best_practices`/`sop`/`resources`/`prompts` id là **text**, `case_studies` id là **bigint**, `documents` id là **int**. | `content_id` phải là **`text`** (ép kiểu khi tra). |
| **6** | Phần C2 — `badges.course_id FK → courses` | `courses.id` là **`text`** (`ai-coban`, `solo`…), không phải uuid. | Khai `text`. |
| **7** | Phần B + C2 — `courses.learning_path_id` **VÀ** bảng junction `learning_path_courses` | **Mâu thuẫn mô hình**: `learning_path_id` = 1 khoá thuộc 1 lộ trình (1-N); junction = 1 khoá thuộc nhiều lộ trình (N-N). Có cả 2 sẽ tạo 2 nguồn sự thật, lệch nhau. | Chọn **một** — không làm cả hai. |

### Ghi chú thêm về Quyết định 2 (`premium_expires_at`)

- Thêm cột là đúng và an toàn, **nhưng cột không tự có tác dụng**: `getPurchasedIds()` (`src/lib/access.ts`) hiện chỉ lọc `status='confirmed'`, không đọc ngày hết hạn → phải sửa code cùng lúc, nếu không cột chỉ nằm im.
- Về "sửa luôn lỗi đơn hàng `confirmed` cũ đã hết hạn bị tính Premium vĩnh viễn": **hiện chưa có dữ liệu nào bị ảnh hưởng** — `orders` có 4 dòng, **cả 4 đều `pending`, 0 dòng `confirmed`**. Nghĩa là chưa user nào có quyền Premium thật.
- `premium_expires_at` nằm ở `members` (1 ngày hết hạn/user) nhưng quyền lại suy từ `orders` (nhiều đơn/user, mỗi đơn 1 sản phẩm) → cần Founder xác nhận quy tắc: hết hạn áp cho **toàn bộ** quyền của user, hay theo **từng sản phẩm**?

---

## PHẦN 4 — ⚠️ Xung đột branch (cần xác nhận trước khi commit code)

| | |
|---|---|
| Lệnh yêu cầu | làm trên branch **`admin-rebuild`** |
| Branch được giao cho phiên này | **`claude/supabase-audit-schema-w4o7tz`** (báo cáo audit trước đã push vào đây) |

Đối chiếu thật:
- `admin-rebuild` **vẫn tồn tại** trên remote (CLAUDE.md ghi "đã bị xoá" — **thông tin này đã lỗi thời**), nhưng commit cuối là **2026-07-29** — cũ hơn `main` (2026-08-03).
- Branch hiện tại **đi trước `admin-rebuild` 99 commit**; `admin-rebuild` chỉ có **1 commit** không nằm trong nhánh hiện tại (`ccae2f3` — fix trigger signup thiếu `email`), và **nội dung fix đó đã có sẵn** ở nhánh hiện tại qua `supabase-phase23-identity-hub.sql` (đã chứa `new.email`). Tức `admin-rebuild` **đã lạc hậu và bị thay thế**.

**❓ CẦN FOUNDER XÁC NHẬN:** tiếp tục trên `claude/supabase-audit-schema-w4o7tz` (khuyến nghị — mới nhất, đã có báo cáo audit), hay thật sự muốn quay lại `admin-rebuild`? **Chưa push gì sang branch khác.**

---

## PHẦN 5 — Tóm tắt: cần Founder trả lời 6 điểm trước khi chạy Bước 1

1. **Nhu cầu/nghề nghiệp** — chọn (a) / (b) / (c) ở mục 1.1.
2. **80 Knowledge Asset** — giữ quyết định hoãn, hay đưa vào đợt này?
3. **7 lỗi kỹ thuật Phần 3** — xác nhận sửa theo phương án đã nêu (đặc biệt **#3**: tách 2 hệ tiến độ CKOS vs Premium).
4. **Workspace Outputs** — chấp nhận 3 bảng (`outputs` + `versions` + `reflections`), hay gộp jsonb để giảm số bảng?
5. **`premium_expires_at`** — hết hạn theo user hay theo từng sản phẩm? (kèm việc phải sửa `getPurchasedIds()`).
6. **Branch** — `claude/supabase-audit-schema-w4o7tz` hay `admin-rebuild`?

**Chưa thực hiện bất kỳ thay đổi nào lên Supabase hoặc code sản phẩm.** File này là tài liệu duy nhất được tạo.
