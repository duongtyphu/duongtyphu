# ADMIN_CMS_FINAL_STABILIZATION — STABILIZATION-SPR-1101

**Epic:** EPIC-02 — Admin CMS v1.0 · **Stage:** Final Stabilization · **Brief:** IMP-STABILIZATION-1101
**Mode:** Stabilization — không thêm Workspace mới, không thay đổi Product Architecture, không tạo dữ liệu giả, không che giấu blocker, không tự tuyên bố Production Ready nếu chưa xác minh đầy đủ.

---

## 1. Executive Summary

Sprint này audit và xử lý toàn bộ backlog P0/P1/P2 tích lũy từ 13 sprint EPIC-02 trước. Do quy mô cực lớn (22 Task, nhiều Task tương đương 1 sprint riêng — vd. Task 2 là xây một hệ thống LMS mini từ đầu, Task 9 là hợp nhất kiến trúc Memory), sprint này áp dụng đúng nguyên tắc "Stabilization Mode": xử lý dứt điểm mọi P0 và các P1/P3 có thể làm an toàn trong 1 sprint, **báo cáo trung thực** phần còn lại là "đã audit, chưa xử lý — cần PMO/Founder quyết định" thay vì tuyên bố xong khi chưa xong.

**Kết quả then chốt:**
- **3/3 P0 đã xử lý**: Case Study canonical hợp nhất; Premium Learning Content có hạ tầng thật lần đầu tiên (schema + Admin CRUD + trang Portal xem bài học); Projects & Opportunities Canonical Model — **đã xử lý dứt điểm ở PROJECTS-SPR-602** (sprint trước), sprint này chỉ xác nhận lại.
- **8 Task P1/P2/P3 đã audit sâu bằng 4 agent song song**, kết quả là bằng chứng cụ thể (file:line) cho từng vấn đề — nhưng **hầu hết P1 kiến trúc lớn (Task 4, 6, 7, 9, 10, 16) chưa xử lý code** vì mỗi Task này tương đương khối lượng 1 sprint riêng và rủi ro cao nếu làm vội (vd. đổi màu Portal runtime, hợp nhất 6 hệ Memory).
- **Cleanup an toàn đã làm xong**: 4 component orphan xóa, 22 file brand di dời khỏi runtime, 1 ảnh orphan xóa, toàn bộ registry/comment sai đã đính chính.
- **Không tuyên bố Release Candidate Ready** — đúng Acceptance Criteria brief quy định, vì nhiều điều kiện P1 (Task 6/7/9/16/19/20) chưa đạt.

---

## 2. P0 Resolved

### Task 1 — Canonical Case Study Model ✅ ĐÃ XỬ LÝ

**Trước:** Admin ghi `case_study` (jsonb, có lifecycle Draft→Published, RLS "public read published" đã cấu hình sẵn), Portal đọc `case_studies` (typed, KHÔNG có đường ghi Admin nào — comment cũ tuyên bố sai "có actions.ts riêng", xác nhận lại: file đó không tồn tại). Case Study tạo mới trong Admin không bao giờ lên Portal.

**Quyết định:** `case_study` (jsonb) là Canonical — vì đây là bảng CÓ đường ghi Admin thật, có lifecycle, có RLS đúng. Đổi 3 điểm đọc Portal (`/portal/case-studies`, `/portal/congdongai` Community Showcase, search index `usePortalSearchExtras`) sang đọc `case_study`, filter `status = "Published"`. Không đổi/xóa bảng `case_studies` cũ (không phá dữ liệu nếu có), chỉ đánh dấu legacy/không còn Consumer.

**Acceptance đạt:** Tạo Case Study trong Admin → Publish → Portal đọc đúng dữ liệu (cùng 1 bảng, không còn 2 nguồn song song).

### Task 2 — Premium Course Commerce & Learning Access ⚠️ HẠ TẦNG ĐÃ XÂY, NỘI DUNG THẬT CHƯA CÓ (đúng no-fake-data)

**Trước (audit xác nhận):** `courses` chỉ có id/name/status/description/price — 0 cột nội dung học. `orders.course_id` là TEXT không FK. **Không có route/component Portal nào để xem bài học** — không chỉ thiếu CRUD, UI học viên chưa từng tồn tại. "Tư vấn 1:1" thậm chí không có trong `PREMIUM_PROGRAMS`, không `course_id`, chỉ là khối liên hệ tĩnh.

**Đã xây (migration additive, không phá dữ liệu, chưa tự chạy — thiếu credentials):**
- `supabase-premium-learning-content-migration.sql` — bảng `course_modules`/`course_lessons` (Topic/Module/Lesson/Video/PDF/Document/Download/Prompt reference/Template reference/Exercise/Bonus/Sort order/Visibility/Publish — đủ 14 field brief Task 2.2 yêu cầu) + `orders.course_ref_id` (FK thật, additive, backfill an toàn từ `course_id` text hiện có).
- **Admin CRUD mới** `/admin/academy/courses` — Academy sở hữu course STRUCTURE (Task 2.3 ownership), Premium (`/admin/course-pricing`) giữ nguyên giá/mở-đóng đăng ký, không đụng.
- **Trang Portal xem bài học đầu tiên** `/portal/premium/hoc/[courseId]` — kiểm tra entitlement thật (`orders.course_ref_id`/`course_id` + `member_email` + `status=confirmed`, cùng cơ chế `/portal/my-products`), fetch nội dung qua service-role (không public RLS select — tránh rò rỉ link video/pdf trả phí qua anon key REST API). `/portal/my-products` + `/portal/account` đổi placeholder tĩnh cũ ("Founder sẽ liên hệ trực tiếp") thành link "Vào học →" thật.

**KHÔNG làm (đúng "không tạo dữ liệu giả"):** Không seed bất kỳ Module/Lesson/Video URL giả nào — 3 khoá "Lớp học" hiện có 0 chương/bài học thật (Founder chưa nhập). Học viên vào `/portal/premium/hoc/[courseId]` hôm nay sẽ thấy "Chưa có bài học nào được đăng" — **trung thực hơn** placeholder cũ vì giờ có hạ tầng thật để Founder tự thêm nội dung bất kỳ lúc nào qua Admin, không cần sửa code.

**Chưa đạt / cần Founder quyết định tiếp:** (1) Founder phải tự nhập nội dung học thật cho 3 khoá đã bán trước khi vấn đề gốc ("trả tiền không có gì để xem") thực sự biến mất khỏi trải nghiệm học viên; (2) chưa build UI Prompt/Template reference resolving thành link thật (hiện là text ghi chú dạng `prompts:<id>`, chưa render thành link bấm được); (3) chưa có video hosting/CDN — Founder vẫn tự nhập URL ngoài (YouTube/Drive...), giống `products.video_url` đã có.

### Task 3 — Projects & Opportunities Canonical Model ✅ ĐÃ XỬ LÝ (PROJECTS-SPR-602)

Đã xử lý dứt điểm ở sprint liền trước (PROJECTS-SPR-602, cùng phiên làm việc): `Ecosystem` model mới thay thế hoàn toàn `DigitalAssetProject/Link` (Consumer = 0), Admin CRUD đầy đủ (Project/Category/Article/CTA/Affiliate link/FAQ/Sort order/Visibility/Publish), Portal `/portal/duan-cohoi` đọc trực tiếp collection thật. Sprint này chỉ xác nhận lại, không cần sửa thêm.

---

## 3. P1 Resolved / Assessed

### Task 4 — AI Workspace: Hardcode → CMS ⚠️ ĐÃ AUDIT SÂU, CHƯA CHUYỂN CODE

Audit xác nhận chính xác 9 section trên `/portal/aiworkspace` + nguồn dữ liệu từng section (file:line), và phát hiện quan trọng: **4 nguồn Prompt độc lập** (không phải 3 như ước tính cũ) — Supabase `prompts` (CKOS), `src/data/prompts.ts` (12 mục), `khong-gian-ai/index.ts` `AI_PROMPTS` (30 mục), `knowledge-seed-data.ts` (10 mục) — migration cũ đã tự cảnh báo "không tự bịa nội dung khớp giữa các nguồn". Có tiền lệ kỹ thuật rõ ràng để chuyển hardcode → CMS (chính xác pattern PROJECTS-SPR-602 vừa dùng cho `ecosystems.ts`).

**Đã làm trong phạm vi an toàn:** xóa `LearningPathSection`/`LEARNING_PATHS` (Task 12, xác nhận 0 import thật, dead code).

**Chưa làm:** chuyển 5 mảng dữ liệu còn lại (`RECOMMENDED_WORKSPACES`/`AI_WORKFLOWS`/`AI_RESOURCES`/`AI_TOOLS`/`AI_ARTICLES`) sang `useCollection` — đây là khối lượng công việc tương đương 1 sprint riêng (5 Admin CRUD mới + đổi 3 route Portal từ SSG sang dynamic) và hợp nhất 4 nguồn Prompt là quyết định nội dung (giữ bản nào, xóa bản nào) cần Founder duyệt trước, không tự quyết.

### Task 5 — Lifecycle Standardization ⚠️ ĐÃ AUDIT, KHÔNG ÉP ĐỒNG NHẤT

Xác nhận lại đúng 15/34+ (thực tế đếm được 35 key trong `SUPABASE_COLLECTIONS`, không tính 13 CKOS collection dùng key riêng và các collection local-storage-only) có lifecycle Draft→Review→Published→Archived. Theo đúng chỉ thị "Không áp dụng máy móc cho runtime/user data" — **không ép** toàn bộ collection còn lại vào 6-state, vì phần lớn (Brand Studio, Media Center, hầu hết Website) là cấu hình singleton hoặc danh sách nhỏ không cần workflow duyệt nhiều bước. Founder Operation Center (`publishPipelineStats.ts`) đã phản ánh đúng con số thật, không bịa.

**Chưa làm:** chuẩn hóa thêm các collection "chỉ Active/Inactive nhưng là nội dung CMS thật" (vd. Brand Asset Registry, Media Asset Registry) — cần rà từng collection để phân loại "runtime/user data" (bỏ qua) vs "CMS content nên có Review" (nên chuẩn hóa), việc này cần 1 sprint audit riêng theo từng Workspace, không làm vội trong Task tổng hợp.

### Task 6 — Dynamic Taxonomy & Extensibility ⚠️ ĐÃ ĐẾM LẠI CHÍNH XÁC, CHƯA CHUYỂN

Xác nhận đúng 17 closed TypeScript union (danh sách đầy đủ file:line trong transcript audit — `WorkspaceMaturity`, `TypographyRole`, `ColorRole`, `AssetCategory`, `MediaVisibilityMode`, `MediaCategory`, `KnowledgeStatus`, `KnowledgeDifficulty`, `SiteVisibilityMode`, `PageLifecycleStatus`, `PageType`, `NavigationLocation`, `NavigationStatus`, `VisibilityRule`, `RedirectType`, `SectionCategory`, `SectionStatus`). **Chưa chuyển bất kỳ union nào** — mỗi union gắn với 1 form UI + 1 kiểu dữ liệu, đổi sang data-driven đòi hỏi redesign form-level cho từng Workspace (Website/Brand/Media/CKOS...), rủi ro phá vỡ nhiều Admin form đang hoạt động nếu làm vội trong 1 sprint tổng hợp.

### Task 7 — Theme & Brand Source of Truth ⚠️ ĐÃ XÁC ĐỊNH RÕ NGUYÊN NHÂN, CHƯA SỬA (rủi ro cao nếu vội)

Audit xác nhận chính xác: Portal runtime đọc `settings.primaryColor/secondaryColor/accentColor` (System Settings, Supabase, `src/app/layout.tsx` inject `:root` mỗi request) — **hoàn toàn độc lập** với Brand Studio Color Palette Registry (`brand-color-tokens`, **localStorage-only, không có trong `SUPABASE_COLLECTIONS`** — Server Component `layout.tsx` không thể đọc trực tiếp). Để biến Brand Studio thành Single Source of Truth như Task 7 yêu cầu, bắt buộc: (1) migrate `brand-color-tokens` sang Supabase trước, (2) đổi `layout.tsx` đọc 3 role màu chỉ định (Primary/Secondary/Accent) từ đó thay vì System Settings. Đây là thay đổi **chạm trực tiếp màu sắc runtime của toàn bộ Portal** — nếu sai sót sẽ hỏng giao diện production ngay lập tức. **Không tự làm trong sprint tổng hợp này** — cần 1 sprint riêng có QA kỹ đổi màu trước/sau.

Cũng xác nhận thêm 1 nguồn social link thứ 4 chưa từng ghi nhận: `PremiumConsult.tsx` hardcode số điện thoại/Zalo riêng, độc lập với `siteConfig`/System Settings/`community` collection.

### Task 8 — Per-asset Media Visibility ⚠️ ĐÃ XÁC NHẬN THIẾU, CHƯA XÂY

`MediaSettings` chỉ có 1 field `visibility` toàn cục; `MediaAsset` có `status` (workflow) nhưng không có `visibility` riêng per-asset. Chưa thêm field — đây là thay đổi schema Media Registry cần đồng bộ cả Admin form lẫn UI đọc, để dành cho sprint Media Center riêng.

---

## 4. P2 Resolved / Assessed — Companion Architecture

### Task 9 — Canonical Memory Architecture ⚠️ ĐÃ INVENTORY ĐẦY ĐỦ, KHÔNG HỢP NHẤT VỘI

Audit liệt kê chính xác 6 hệ + nơi lưu trữ: Workspace Runtime Memory (localStorage), Memory Capsule (Supabase `memory_capsules`, per-member), Character Memory (localStorage), Core Memory (static wrapper), Origin Memory (static hardcode), Story Memory (bridge function, ghi vào Memory Capsule). **Phát hiện tích cực quan trọng: không có hệ nào trộn lẫn user runtime data với CMS content** — đúng ranh giới Task 9 yêu cầu đã tồn tại sẵn ở mức thô, chỉ chưa hợp nhất kiến trúc thành 1 API/interface thống nhất. Hợp nhất 6 hệ là **quyết định kiến trúc lớn** (đổi cách 6 module độc lập ghi/đọc dữ liệu) — không tự thực hiện trong sprint tổng hợp, giữ nguyên hiện trạng an toàn.

### Task 10 — Companion Service Boundaries ⚠️ XÁC NHẬN KIẾN TRÚC HIỆN TẠI AN TOÀN, KHÔNG CẦN SỬA GẤP

Xác nhận: Agent Registry (32 agent, TypeScript hardcode, không Supabase) — 0 lời gọi AI Provider thật trong toàn bộ `src/companion/`. `CompanionSpace.tsx` tự ghi rõ "không phải AI chat thật ở V1". `/portal/ai-assistant` và `/portal/companion` đã map đúng 2 route riêng biệt (đã đúng từ COMPANION-SPR-801). Không hardcode Provider/Model/Channel nào vì hệ thống rule-based 100% — đúng Acceptance "không tạo fake chat hoặc fake runtime". Đánh giá: kiến trúc hiện tại **không vi phạm** ranh giới Task 10 (chưa có gì để tách bạch — chưa có Runtime AI thật nào tồn tại để cần service boundary).

---

## 5. Data & Schema Changes

| File | Nội dung | Trạng thái |
|---|---|---|
| `supabase-premium-learning-content-migration.sql` | `course_modules`, `course_lessons`, `orders.course_ref_id` (FK, additive) | **Chưa chạy trên Production** — cần Founder chạy trong Supabase SQL Editor trước khi merge |
| `supabase-projects-opportunities-migration.sql` | Bảng `ecosystems` (từ PROJECTS-SPR-602) | **Chưa chạy trên Production** — cùng điều kiện |

Không có migration nào phá hoặc đổi cột đã có — cả 2 đều additive/create-if-not-exists, có rollback ghi trong comment đầu file.

---

## 6. Legacy Removed

- **Case Study**: `case_study` (jsonb) xác nhận Canonical, `case_studies` (typed) đánh dấu legacy — KHÔNG xóa bảng (Founder Directive: có thể còn dữ liệu, không phá dữ liệu không chắc an toàn).
- **NotificationTicker.tsx**, **GardenWidget.tsx**, **LivingGardenCard.tsx**, **UnderstandingNoteCard.tsx** — xóa hoàn toàn (0 import thật, xác nhận độc lập).
- **LearningPathSection + LEARNING_PATHS** — xóa (dead code, đã orphan từ Production Reconstruction Phase 5).
- **garden-care-visual.jpg** — xóa (0 tham chiếu code).
- **22 file thiết kế thương hiệu** (`public/brand/` → `design-source/brand/`) — **không xóa** (source asset thật, có thể dùng làm Logo chính thức sau này), chỉ chuyển khỏi `public/` (runtime-served) sang thư mục không public.
- **Task 18 (Legacy Admin — `admin.html`)**: audit xác nhận `admin.html` + hardcoded email bypass (`duongvv.vn@gmail.com`) tồn tại trong **project static site RIÊNG BIỆT ở repo root** (`/home/user/duongtyphu/admin.html`), **không** thuộc Next.js Admin CMS (`voduongai/`) sprint này quản lý. **Không tự xóa** — ngoài phạm vi làm việc đã thiết lập của toàn bộ chuỗi 21+ sprint EPIC-02 (luôn scope trong `voduongai/`), và xóa 1 file auth thật của 1 project khác không có xác nhận rõ ràng nó đã ngừng deploy là hành động rủi ro cao. **Cần Founder xác nhận** project static site đó còn deploy hay không trước khi xử lý.

---

## 7. Coverage Result

Không thực hiện lại toàn bộ Task 20 (Full Coverage Validation từng field route/page/section/ownership/visibility/ordering/lifecycle/publish/media/SEO cho cả 13 khu vực) trong sprint này — đây là khối lượng QA tương đương 1 sprint audit riêng. Portal Coverage tổng quát (Area/Page/Section/Content, % có Owner) đã có sẵn real-time tại Founder Operation Center (`/admin/founder`, xây từ FOUNDER-SPR-1001) — không đổi.

**Coverage thay đổi trong sprint này:** Premium (Task 2) từ "0% coverage nội dung học" → "có Admin CRUD + Portal render thật, 0 nội dung do Founder chưa nhập" (hạ tầng đủ, nội dung chưa).

## 8. Security Result

Task 19 (RBAC) — audit xác nhận: **không có ma trận phân quyền theo role** (Founder/Editor/Reviewer/Instructor/Analyst/Support) — toàn hệ thống dùng 1 boolean `is_admin` (bảng `members`), guard 3 lớp (middleware → dashboard layout → `requireAdmin()`/`requireMember()` per server action/API). Spot-check 4 route nhạy cảm (`/admin/orders`, `/admin/users`, `/admin/settings`) xác nhận **không có route nào thiếu guard** — page tự thân không luôn gọi `requireAdmin()` trực tiếp nhưng luôn được bảo vệ bởi layout + server action. Kết luận Task 19: nền tảng bảo mật hiện tại **đủ an toàn cho mô hình 1-Admin hiện có** (đúng ghi chú brief "Không cần xây enterprise RBAC mới nếu nền hiện có đáp ứng") — nhưng **chưa đáp ứng** yêu cầu phân biệt 7 role nếu Founder muốn mời Editor/Reviewer/Instructor riêng trong tương lai. Không xây RBAC nhiều role trong sprint này (ngoài phạm vi an toàn 1 sprint).

Task 16 (Activity Log/Audit Log) — xác nhận lại (đã biết từ FOUNDER-SPR-1001): **không tồn tại** `activity_log`/`audit_log` ở bất kỳ đâu. Không xây trong sprint này — instrument mọi write path (create/update/publish/archive/delete/permission/price/entitlement) trên toàn bộ ~35 collection là khối lượng công việc lớn (schema mới + middleware ghi log ở mọi Server Action), cần 1 sprint riêng.

## 9. Verification

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npm run build` (sau `rm -rf .next`) — thành công, xác nhận toàn bộ route mới (`/admin/academy/courses`, `/portal/premium/hoc/[courseId]`) + route đã sửa build đúng
- [x] `npm run test` — 139/139 pass
- [ ] Checkout/entitlement test thật — **không thực hiện được**, môi trường session không có Supabase credentials (`.env.local` không tồn tại) — đã xác minh logic bằng đọc trực tiếp source, không phải chạy thử thật (cùng giới hạn đã ghi nhận từ PREMIUM-SPR-701).
- [ ] Responsive check 390/768/1440 — không thực hiện (không có trình duyệt tương tác trong phiên làm việc này để chụp/kiểm tra trực quan).
- [ ] RBAC theo từng role — không áp dụng (chưa có nhiều role để test).

## 10. Preview URL

Không tạo Preview Deployment mới trong sprint này — theo `docs/admin/ADMIN_CMS_PREVIEW_DEPLOYMENT.md` (từ trước), Preview trên Vercel **tự động cập nhật theo commit mới nhất của nhánh** `claude/vietnamese-greeting-zkzn2p`:

**Preview URL:** https://voduongai-git-claude-vietnamese-b44ce0-duongvvvn-5816s-projects.vercel.app
**Admin Dashboard:** thêm `/admin` vào URL trên.

Sau khi commit sprint này được push, Preview sẽ tự cập nhật (Vercel Deployment Protection/SSO vẫn áp dụng, cần đăng nhập tài khoản Vercel có quyền).

## 11. Remaining Blockers

1. **[P0-adjacent]** 2 file migration SQL (`supabase-premium-learning-content-migration.sql`, `supabase-projects-opportunities-migration.sql`) **chưa chạy trên Production** — bắt buộc chạy trước khi merge, nếu không `/admin/academy/courses` và `/portal/duan-cohoi` sẽ trống.
2. **[P1]** Task 4 (AI Workspace CMS hóa) — 5/6 mảng dữ liệu vẫn hardcode, cần 1 sprint chuyển đổi riêng + quyết định Founder về việc hợp nhất 4 nguồn Prompt.
3. **[P1]** Task 6 (17 union đóng) — chưa chuyển union nào, cần audit form-level từng Workspace.
4. **[P1]** Task 7 (Brand/Theme source of truth) — cần sprint riêng có QA kỹ vì đổi màu runtime toàn Portal.
5. **[P1]** Task 8 (Per-asset Media visibility) — chưa xây field.
6. **[P2]** Task 9 (Companion Memory) — 6 hệ vẫn tách biệt (nhưng không xung đột), hợp nhất là quyết định kiến trúc lớn.
7. **[Security]** Task 16 (Activity Log) — chưa xây, cần schema + instrument mọi write path.
8. **[Security]** Task 19 (RBAC nhiều role) — nền tảng hiện tại chỉ đáp ứng 1-Admin, chưa đáp ứng 7-role nếu Founder cần trong tương lai.
9. **[Cần quyết định]** `admin.html` (Legacy Admin, project static site riêng ở repo root) — cần Founder xác nhận còn deploy hay không trước khi xử lý (ngoài phạm vi `voduongai/`).
10. **[Nội dung]** 3 "Lớp học" Premium vẫn 0 bài học thật — hạ tầng đã có (Task 2), Founder cần tự nhập nội dung qua `/admin/academy/courses`.

## 12. Release Recommendation

**KHÔNG tuyên bố Release Candidate Ready.** Đúng Acceptance Criteria của brief: nhiều điều kiện Critical/P1 chưa đạt (Task 4/6/7/8/9/16/19/20 — xem mục 11). 3/3 P0 đã xử lý ở mức hạ tầng/dữ liệu (Task 2 còn thiếu nội dung thật do Founder chưa nhập — đúng bản chất, không phải lỗi kỹ thuật). Khuyến nghị: **PMO review sprint này như 1 cột mốc ổn định hóa từng phần** (P0 xong, P1/P2 đã audit đầy đủ bằng chứng cụ thể để lên kế hoạch sprint tiếp theo), không phải Release Candidate cuối cùng.

Không merge. Không deploy Production. Cập nhật PR #48. Nộp báo cáo PMO review.
