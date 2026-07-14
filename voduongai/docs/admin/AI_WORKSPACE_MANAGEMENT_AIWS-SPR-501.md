# AIWS-SPR-501 — AI Workspace Management

**Epic:** EPIC-02 · **Phase:** Phase 5 — AI Workspace · **Brief:** IMP-AIWS-501
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal hiện tại là Reference Source duy nhất.

**Bối cảnh quan trọng:** Trước Sprint này, `/admin/ai-workspace` chỉ là 1 Landing Foundation (`WorkspaceSectionFoundation`, xây ở ADM-SPR-201) — không đọc bất kỳ nội dung thật nào, chỉ mô tả "sẽ quản lý trong sprint tương lai". Sprint này đối chiếu trực tiếp `/portal/aiworkspace` (JSX thật, không dựa Section Registry cũ) và phát hiện Section Registry của PORTAL-SPR-301 **thiếu 4/9 Section thật và sai thứ tự** — đã sửa. Phát hiện trọng tâm: **100% nội dung AI Workspace là TypeScript hardcode**, không có bảng Supabase/collection CRUD nào đứng sau — khác hẳn Website/Brand/Media/CKOS/Academy (đều có ít nhất một phần dữ liệu Admin-editable từ trước).

---

## Deliverable 1 — AI Workspace Review

**Portal Area thật:** `/portal/aiworkspace` (nguồn duy nhất: `src/lib/portal/hubs.ts:95`, `portalNavSections`). Không nhầm với đường dẫn `/admin/ai-workspace` (route Admin, khác chuỗi ký tự — không có dấu gạch nối trên Portal).

**Chức năng thật:** Kiến trúc "LÀM/THỰC HÀNH" (comment gốc trong `page.tsx:22-28`), phân biệt rõ với Học viện AI ("HỌC"). Mọi hành động (Companion Desk, click Workspace/Workflow/Tool/Prompt) đi qua `startCompanionWorkspace()` (`src/lib/portal/companion-workspace.ts`) → điều hướng sang `/portal/workspace` (route riêng, không thuộc AI Workspace Portal Area) để thực thi thật.

---

## Deliverable 2 — Portal Mapping

### Trang chính `/portal/aiworkspace/page.tsx` — 9 Section (đúng thứ tự JSX)

| # | Section | Nguồn dữ liệu | Số lượng | CRUD? |
|---|---|---|---|---|
| 1 | Hero | Hardcode trong `page.tsx` | — | Không |
| 2 | Companion Desk | Form nhập tự do | — | Không có danh sách để quản lý |
| 3 | Recommended Workspace | `src/data/portal/ai-workspace.ts` → `RECOMMENDED_WORKSPACES` | 8 mục | ❌ Chưa có |
| 4 | AI Workflow | `src/data/portal/ai-workspace.ts` → `AI_WORKFLOWS` | 4 mục | ❌ Chưa có |
| 5 | Prompt Library | `src/data/prompts.ts` → `prompts` | 12 mục (hiện 9) | ❌ Chưa có |
| 6 | AI Toolbox theo nhiệm vụ | `src/data/khong-gian-ai/index.ts` → `AI_TOOLS` | 10 mục (6 featured hiện ở trang chính) | ❌ Chưa có |
| 7 | Resource | `src/data/portal/ai-workspace.ts` → `AI_RESOURCES` | 4 mục | ❌ Chưa có |
| 8 | Blog AI | `src/data/khong-gian-ai/index.ts` → `AI_ARTICLES` | 23 mục (10 featured hiện ở trang chính) | ❌ Chưa có |
| 9 | Footer CTA | Hardcode trong `page.tsx` | — | Không |

### 3 route con (Child Page)

| Route | Nguồn dữ liệu | Ghi chú |
|---|---|---|
| `/portal/aiworkspace/[slug]` | `generateStaticParams()` union `AI_TOOLS` + `NEED_CATEGORIES` (9) + `PROFESSION_GROUPS` (10) | Routing/lookup, hiển thị 1 trong `ToolDetailPage`/`NeedCategoryPage`/`ProfessionDetailPage`. |
| ↳ Related Prompts (trong trang Tool/Need detail) | `src/data/khong-gian-ai/index.ts` → `AI_PROMPTS` | 30 mục. **Nguồn Prompt THỨ 3** — phát hiện mới, không nằm trong inventory ban đầu. |
| `/portal/aiworkspace/bai-viet/[slug]` | `getBlogPost()` (`src/data/blog.ts`) | Nội dung bài viết đầy đủ, hardcode. |
| `/portal/aiworkspace/nghe/[slug]` | Redirect alias | `redirect(\`/portal/aiworkspace/${slug}\`)` — không có nội dung riêng. |

**⚠️ Phát hiện quan trọng — 3 nguồn "Prompt" trùng tên, độc lập hoàn toàn:**
1. Bảng Supabase `prompts` (CKOS sở hữu, `/admin/prompts`, `/portal/prompts`).
2. `src/data/prompts.ts` → `prompts` (12 mục) — Prompt Library trên trang chính AI Workspace.
3. `src/data/khong-gian-ai/index.ts` → `AI_PROMPTS` (30 mục) — Related Prompts trong trang chi tiết Tool/Need.

Không tự gộp 3 nguồn (ngoài phạm vi Sprint, cần quyết định kiến trúc liên-Workspace) — chỉ ghi rõ trong Dashboard mới (`/admin/ai-workspace`) để Founder biết khi tìm "Prompt" ở đâu.

**Đã sửa Section Registry (PORTAL-SPR-301):** `sectionRegistry.ts`/`contentBlockRegistry.ts` (mục `page_aiworkspace`) trước Sprint chỉ có 5 Section, thiếu Hero/AI Toolbox/Blog AI/Footer CTA và sai thứ tự Companion Desk. Đã sửa thành đúng 9 Section theo thứ tự JSX thật.

---

## Deliverable 3 — Workspace Ownership Validation (Task 4)

Quét `workspaceOwnership.ts` (entry `ai-workspace`) và mọi file trong `src/app/admin/(dashboard)/ai-workspace/` cho từ khóa "knowledge"/"learning"/"commercial"/"mentor"/"website"/"media"/"brand" — 0 kết quả ngoài các tham chiếu mô tả ranh giới (không phải sở hữu).

**Phát hiện cần ghi rõ:** `WorkNeedSection` — dùng dữ liệu `WORK_NEEDS`, khai báo **trong cùng file** `src/data/portal/ai-workspace.ts` (dễ nhầm là thuộc AI Workspace) — nhưng thực tế **mount tại `/portal/hocvienai/page.tsx:103` (Academy)**, không phải `/portal/aiworkspace`. Tên file gây nhầm lẫn nhưng AI Workspace **không sở hữu** nội dung này — đã ghi rõ trong Dashboard, không tự di chuyển file (ngoài phạm vi, rủi ro phá vỡ import Academy).

**Legacy đã đánh dấu (Founder Directive — "Nếu phát hiện Legacy: Đánh dấu. Không tự xoá"):** `LearningPathSection`/`LEARNING_PATHS` (5 mục, cùng file `ai-workspace.ts`) — comment gốc trong `/portal/hocvienai/page.tsx:24` xác nhận đã bị gỡ khỏi Portal ("Production Reconstruction (Phase 5): bỏ Lộ trình học AI"), không còn mount ở bất kỳ đâu. Dữ liệu + component mồ côi thật — **không tự xoá**, chỉ ghi nhận.

**Kết luận Task 4: AI Workspace chỉ sở hữu 9 Section + 3 route con của `/portal/aiworkspace`. Không chồng chéo CKOS/Academy/Companion/Brand/Media/Website.**

---

## Deliverable 4 — Future Flexibility Review (Task 5)

Founder yêu cầu đánh giá: sau Sprint, Founder có thể **thêm trang AI Workspace / thêm section / thêm nội dung / thêm nhóm thực hành** chỉ bằng dữ liệu hoặc cấu hình hay chưa.

**Kết luận: CHƯA — 0/4 hành động khả thi bằng dữ liệu.** Lý do khác hẳn Academy (đối tượng không tồn tại) — ở đây **đối tượng tồn tại và có thật trên Portal**, nhưng toàn bộ được biên dịch cứng vào TypeScript:

| Hành động | Hiện trạng |
|---|---|
| Thêm 1 mục Recommended Workspace/AI Workflow/Resource mới | ❌ Phải sửa trực tiếp mảng TypeScript trong `src/data/portal/ai-workspace.ts` (không có `useCollection`/CRUD). |
| Thêm 1 Tool/Prompt/Article mới vào AI Toolbox/Prompt Library/Blog AI | ❌ Phải sửa `src/data/khong-gian-ai/index.ts` hoặc `src/data/prompts.ts`. |
| Thêm 1 trang chi tiết mới (`[slug]`) | ❌ `generateStaticParams()` đọc trực tiếp từ các mảng trên — thêm route mới yêu cầu vừa sửa dữ liệu vừa nằm trong phạm vi static generation của route đã có, không phải thêm "trang AI Workspace mới" độc lập. |
| Thêm 1 "nhóm thực hành" mới (Section mới trên trang chính) | ❌ Yêu cầu sửa JSX của `page.tsx` (thêm `<section>` mới) — không phải cấu hình dữ liệu. |

**Không tự chuyển các mảng dữ liệu này sang `useCollection`/Supabase trong Sprint này.** Lý do: (1) đây là thay đổi kiến trúc nền tảng (data-source migration), không phải "implementation" theo nghĩa mở rộng Admin CRUD lên dữ liệu đã sẵn có — mọi Workspace trước đó trong EPIC-02 (Website/Brand/Media/CKOS/Portal Management/Academy) đều xây CRUD trên dữ liệu **đã** ở dạng `useCollection`-tương thích (localStorage hoặc Supabase), chưa từng có tiền lệ tự ý chuyển đổi từ TypeScript hardcode sang database trong 1 sprint; (2) route `[slug]/page.tsx` (786 dòng) dùng `generateStaticParams()` đọc trực tiếp từ các mảng này — chuyển sang dữ liệu động đòi hỏi đổi chiến lược render (SSG → cần ISR/dynamic), rủi ro ảnh hưởng hiệu năng/SEO của trang đang chạy thật; (3) Mode Sprint này "không audit lại Blueprint/Product Package" — quyết định model hoá lại toàn bộ nội dung AI Workspace thành Content Core chuẩn thuộc phạm vi Blueprint, không phải 1 sprint Implementation đơn lẻ.

**Đây là hạn chế kỹ thuật thật (khác Academy — nơi 5/6 object không tồn tại). Ghi rõ theo đúng "Nếu chưa: Ghi rõ. Không sửa ngoài phạm vi Sprint".**

---

## Files Changed

**Mới:**
- `src/lib/admin/aiWorkspace/navigation.ts` — `AI_WORKSPACE_SECTIONS` (1 mục — đúng thực tế chỉ có 1 trang Admin thật).
- `docs/admin/AI_WORKSPACE_MANAGEMENT_AIWS-SPR-501.md` (file này, mới).

**Sửa:**
- `src/app/admin/(dashboard)/ai-workspace/page.tsx` — thay `WorkspaceSectionFoundation` placeholder bằng Dashboard thật: bọc `AdminWorkspaceShell`, 2 bảng Portal Mapping (9 Section trang chính + 3 route con), khối Workspace Ownership ghi rõ ranh giới với Academy (WorkNeedSection) và Legacy (LearningPathSection).
- `src/lib/admin/portal/sectionRegistry.ts` — đính chính 9 Section thật cho `page_aiworkspace` (trước chỉ có 5, sai thứ tự).
- `src/lib/admin/portal/contentBlockRegistry.ts` — đính chính 9 Content Block tương ứng, mỗi block ghi rõ nguồn file + số lượng + trạng thái CRUD.
- `src/lib/admin/nav.ts` — bỏ `comingSoon: true` cho mục "AI Workspace" (nay có nội dung thật, không còn là placeholder rỗng).
- `src/lib/admin/workspaceOwnership.ts` — entry `ai-workspace`: cập nhật `owns` từ "(Chưa xây)" thành mô tả chính xác 9 Section + ranh giới WorkNeedSection.

## Verification

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận `/admin/ai-workspace` build đúng
- [x] `npm run test` — 139/139 pass

## Acceptance Self-check (trung thực)

| Tiêu chí | Trạng thái |
|---|---|
| ✓ AI Workspace bám đúng Portal hiện tại | ✅ **Đạt** — Dashboard đối chiếu chính xác 9 Section + 3 route con, đính chính Section Registry cũ |
| ✓ Không tạo dữ liệu giả | ✅ **Đạt** — không thêm mục nào Portal không có |
| ✓ Không tạo CRUD giả | ✅ **Đạt** — Dashboard là view đọc/đối chiếu, không có nút Add/Edit/Delete nào giả vờ hoạt động |
| ✓ Không chồng chéo với CKOS | ✅ **Đạt** — xác nhận sạch, kể cả điểm dễ nhầm (3 nguồn Prompt) đã ghi rõ ranh giới |
| ✓ Không chồng chéo với Academy | ✅ **Đạt** — phát hiện + ghi rõ ranh giới WorkNeedSection (thuộc Academy dù cùng file dữ liệu) |
| ✓ Founder quản lý bằng dữ liệu | ❌ **Chưa đạt** — 0/4 hành động Task 5 khả thi, ghi rõ lý do kỹ thuật (100% TypeScript hardcode), không tự sửa ngoài phạm vi |
| ✓ Build thành công | ✅ **Đạt** |
| ✓ Tests pass | ✅ **Đạt** (139/139) |

Không merge. Không deploy Production. Chờ PMO review.
