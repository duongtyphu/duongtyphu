# CKOS-SPR-401 — CKOS Workspace Management

**Epic:** EPIC-02 · **Phase:** Phase 4 — CKOS & Academy · **Brief:** IMP-CKOS-401
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal hiện tại là Reference Source duy nhất.

**Bối cảnh quan trọng:** CKOS Workspace đã được xây gần như hoàn chỉnh ở các sprint trước (ADM-SPR-004 canonicalization + sprint xây 5 module mới). Sprint này xác minh lại trực tiếp code hiện tại so với đúng 5 Task của brief, chỉ sửa code ở đúng 1 khoảng trống thật tìm thấy (Task 2 — sắp xếp thủ công), các phần còn lại xác nhận đã đạt.

---

## Deliverable 1 — CKOS Workspace Review

### Task 1: Knowledge Registry

✅ **Đã có sẵn, đạt yêu cầu.** `/admin/ckos` (CKOS Dashboard) tổng hợp toàn bộ 13 collection (9 Knowledge Object — Goals/Tools/Prompts/Workflows/Evaluations/Resources/Case Studies/Best Practices/FAQs — Resources có 4 collection anh em Template/Ebook/Checklist/SOP cùng kiến trúc) qua `useAllKnowledgeCollections()`: tổng số theo từng trạng thái lifecycle (Draft/In Review/Changes Requested/Approved/Published/Archived), Recently Updated, Pending Review, và grid 9 module với số lượng thật/module. Không cần sửa code.

### Task 2: Knowledge Management (tạo/chỉnh sửa/xoá/sắp xếp/publish/archive chỉ bằng dữ liệu)

| Hành động | Trạng thái trước Sprint | Sau Sprint |
|---|---|---|
| Tạo | ✅ `openCreate()` → `add()`, thuần dữ liệu | Không đổi |
| Chỉnh sửa | ✅ `openEdit()` → `update()` | Không đổi |
| Xoá | ✅ `handleDelete()` → `remove()` | Không đổi |
| Publish | ✅ `status: "Published"` (1 trong 6 lifecycle status có sẵn) | Không đổi |
| Archive | ✅ Nút "Lưu trữ" riêng, `handleArchive()` → `status: "Archived"` | Không đổi |
| **Sắp xếp** | ⚠️ **Khoảng trống thật** — chỉ có toggle sort theo ngày cập nhật (Mới→Cũ/Cũ→Mới), không có cơ chế Founder tự sắp xếp thứ tự thủ công | ✅ **Đã sửa** — xem bên dưới |

**Đã sửa (duy nhất trong Sprint này):** thêm chế độ "Sắp xếp thủ công" vào `KnowledgeCrudPage.tsx` (component dùng chung cho cả 13 collection — sửa 1 nơi, có hiệu lực trên toàn bộ 9 Knowledge Object). Dùng lại **đúng cơ chế `set()`/`reorder()` đã có sẵn** trong `useCollection()` (cùng cơ chế cột `order` mà API route `/api/admin/collections/[table]` đã hỗ trợ từ trước cho Portal Builder) — không thêm field mới vào schema, không đổi bảng Supabase (mọi bản ghi Supabase lưu dạng `data` jsonb, `sortOrder`/`order` không phải cột cứng nên không có rủi ro "unknown column"). Nút ↑/↓ chỉ bật khi không có bộ lọc/tìm kiếm nào đang áp dụng — hoán đổi vị trí trực tiếp trong mảng `items` gốc (không phải `filtered`) để không xoá nhầm bản ghi bị ẩn bởi bộ lọc khi `set()` ghi đè toàn bộ collection.

### Task 3: Relationship (Knowledge → Related Knowledge → Related Course → Related Prompt → Related Tool)

| Quan hệ | Trạng thái |
|---|---|
| Related Knowledge (bất kỳ 2 mục nào trong 13 collection CKOS) | ✅ Đã có — `RelationshipPicker.tsx`, lưu `relatedIds: string[]` dạng `${moduleKey}:${id}`, tìm kiếm chéo toàn bộ `useAllKnowledgeCollections()`, không giới hạn hướng |
| Related Prompt | ✅ Đã có — Prompts là 1 trong 13 module, `RelationshipPicker` tìm được |
| Related Tool | ✅ Đã có — Tools là 1 trong 13 module, `RelationshipPicker` tìm được |
| **Related Course** | ❌ **Không có** — "Course" (khoá học Premium) sống ở `courses` bảng Supabase riêng, quản lý qua `/admin/course-pricing` (Premium Workspace, `id` kiểu số, server actions riêng — hoàn toàn khác kiến trúc `useCollection`/`id` chuỗi của CKOS). `RelationshipPicker` chỉ tìm trong 13 collection CKOS, không bao gồm `courses`. |

**Không tự nối dây Related Course** — đúng "Không sửa ngoài phạm vi": nối CKOS vào bảng `courses` của Premium Workspace là quyết định kiến trúc liên-Workspace (đọc dữ liệu ngoài phạm vi sở hữu CKOS, xem Task 4), cần PMO quyết định trước, không unilateral thêm trong Sprint audit/implementation nhỏ này.

**Phát hiện phụ (không phải yêu cầu của Task 3, nhưng liên quan trực tiếp — nêu rõ để trung thực):** kể cả với 3 quan hệ ĐÃ hoạt động trong Admin (Related Knowledge/Prompt/Tool), **Portal chưa hiển thị quan hệ này cho người dùng** — `RelatedKnowledgePanel.tsx` (component Portal có sẵn, đúng 7 slot quan hệ) chỉ mount ở duy nhất `/portal/tools/[id]`, và theo đúng comment gốc trong chính file đó: *"there is currently no real relation data for ANY object in the app"* — component luôn render ở trạng thái rỗng, không đọc `relatedIds` từ CKOS. Founder tạo quan hệ trong Admin, nhưng Portal chưa đọc lại — cùng pattern Consumer=0/Publish Bridge đã ghi nhận xuyên suốt EPIC-02 cho Website/Brand/Media/Portal Management.

### Task 4: Workspace Ownership

Quét `workspaceOwnership.ts` (entry `ckos`): `owns: "Goals, Tools, Prompts, Workflows, Evaluations, Resources, Case Study, Best Practices, FAQs"` — khớp **chính xác** 9 Knowledge Object trong brief, không thừa không thiếu. Quét toàn bộ `src/lib/admin/ckos/*.ts` và `src/components/admin/ckos/*.tsx` cho từ khóa "learning"/"commercial"/"mentor"/"website"/"media"/"brand" — **0 kết quả**.

**Kết luận Task 4: Xác nhận sạch — CKOS chỉ sở hữu 9 Knowledge Object, không sở hữu Learning/Commercial/Mentor/Website/Media/Brand.**

### Task 5: Future Flexibility

Founder yêu cầu xác minh: thêm **Goal mới/Tool mới/Prompt mới/Workflow mới/Resource mới** có cần sửa TypeScript/Route/Component không. Đã đọc trực tiếp source luồng "Thêm" dùng chung cho cả 5 module (`KnowledgeCrudPage.openCreate()` → `add()`):

- Cả 5 route (`goals/page.tsx`, `tools/page.tsx`, `prompts/page.tsx`, `workflows/page.tsx`, `resources/page.tsx`) chỉ là **wrapper cấu hình mỏng** quanh `KnowledgeCrudPage` dùng chung — không có logic riêng nào chặn thêm bản ghi mới.
- **`category` là ô nhập TEXT tự do kèm gợi ý** (`<input list=...>` + `<datalist>`), **không phải union TypeScript đóng** — khác hẳn pattern `ASSET_CATEGORIES`/`COLOR_ROLES`/`MEDIA_CATEGORIES`/`SECTION_CATEGORIES` đã tìm thấy ở Website/Brand/Media (BRAND-SPR-202/MEDIA-SPR-202). Founder gõ category mới → xuất hiện ngay trong gợi ý cho lần sau, không cần sửa code.
- **Kết luận: 0 trường hợp phát hiện Founder phải sửa TypeScript, Route hoặc Component** để thêm Goal/Tool/Prompt/Workflow/Resource mới. Đây là Workspace linh hoạt nhất trong toàn bộ Admin CMS tính đến EPIC-02 Phase 4 — không có union đóng nào chặn kể cả phân loại (category), khác Brand Studio/Media Center (vẫn còn union đóng cho category/role, xem BRAND-SPR-202/MEDIA-SPR-202).

Không phát hiện gì cần "ghi rõ + không sửa" cho đúng 5 hành động được liệt kê — mục duy nhất cần ghi rõ (Related Course, Task 3) đã ghi ở trên.

---

## Deliverable 2 — Knowledge Registry

Xem Task 1. 9 Knowledge Object + 4 collection Resources-family, tất cả hiển thị đầy đủ tại `/admin/ckos` với số liệu thật (không mock).

## Deliverable 3 — Workspace Ownership Validation

Xem Task 4. Sạch, không chồng chéo.

## Deliverable 4 — Future Flexibility Review

Xem Task 5. 0 ngoại lệ cho 5 hành động được yêu cầu; Related Course (Task 3) là giới hạn duy nhất liên quan tới mở rộng, đã ghi rõ, không tự sửa.

---

## Files Changed

- `src/components/admin/ckos/KnowledgeCrudPage.tsx` — thêm chế độ Sắp xếp thủ công (Task 2), dùng lại `set()` có sẵn trong `useCollection()`. Không đổi schema, không đổi API route, có hiệu lực trên cả 13 collection cùng lúc (1 component dùng chung).
- `docs/admin/CKOS_WORKSPACE_MANAGEMENT_CKOS-SPR-401.md` (file này, mới)

## Verification

- [x] `npm run lint` — sạch
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công
- [x] `npm run test` — 139/139 pass

## Acceptance Self-check (trung thực)

| Tiêu chí | Trạng thái |
|---|---|
| ✓ CKOS quản lý toàn bộ Knowledge Objects | ✅ **Đạt** — 9/9 object, Registry + CRUD đầy đủ |
| ✓ Không chồng chéo Ownership | ✅ **Đạt** — xác nhận sạch, 0 tham chiếu ngoài phạm vi |
| ✓ Founder quản lý bằng dữ liệu | ✅ **Đạt** — bao gồm sắp xếp thủ công (mới sửa Sprint này); ⚠️ Related Course chưa quản lý được (khác Workspace, cần PMO quyết định); ⚠️ quan hệ Admin tạo ra chưa hiển thị lại trên Portal (Consumer=0 cho riêng phần relationship, không phải toàn bộ nội dung) |
| ✓ Build thành công | ✅ **Đạt** |
| ✓ Tests pass | ✅ **Đạt** (139/139) |

Không merge. Không deploy Production. Chờ PMO review.
