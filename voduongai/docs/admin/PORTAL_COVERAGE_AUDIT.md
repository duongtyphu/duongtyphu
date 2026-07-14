# PORTAL COVERAGE AUDIT — IMP-ADM-005 (ADM-SPR-005, EPIC-02)

**TRẠNG THÁI: NỘP CHO PMO REVIEW. Không tự merge.**

Sprint nghiên cứu và thiết kế thuần túy — **không sửa code, không CRUD, không migration, không schema, không redesign Portal**. Thực thi theo `docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`: Portal hiện tại là Reference Source duy nhất, không dùng Admin cũ để quyết định kiến trúc. Đây là bước audit bắt buộc trước khi xây tiếp bất kỳ Workspace nào.

**Phương pháp:** 4 agent nghiên cứu song song, đọc trực tiếp source code Portal (không dựa vào tài liệu cũ): (1) Route/Navigation/UI Shell, (2) Component/Widget/CTA/Banner/Dialog, (3) Content Object + Hard-coded content, (4) Companion/Memory/Persona chuyên sâu. Kết hợp với các phát hiện đã xác nhận từ ADM-SPR-001.

---

## Tóm tắt điều hành

Portal thật lớn hơn và phức tạp hơn đáng kể so với những gì Admin hiện đang "nghĩ" mình quản lý:

1. **Sidebar Portal chỉ có 10 mục, nhưng có ~65 route thật.** Phần lớn được truy cập qua deep-link nội bộ từ các trang hub, không lỗi nhưng làm IA thật khó nhìn thấy toàn cảnh.
2. **CMS "Portal Builder" đã tồn tại trong Admin từ trước — nhưng 7/8 bảng nó quản lý là orphan (mồ côi).** Admin có thể sửa `portal_cta`, `portal_featured`, `today_action_cards`, `start_here_steps`, `user_goals` (bảng của Admin), `portal_sections`, `portal_welcome` — nhưng **không trang Portal nào đọc các bảng này**. Chỉ `portal_banners` (NotificationTicker) là thực sự nối dây. Đây là phát hiện quan trọng nhất của sprint này — Admin cũ đã "ảo tưởng" về phạm vi quản trị của chính nó.
3. **Trang chủ marketing (`/`, ngoài `/portal/**`) là cụm nội dung hardcode lớn nhất, có giá trị kinh doanh cao nhất, và chưa có Workspace nào phụ trách.** Hero, TrustStats, FounderStory, FinalCTA, AcademyTeaser — toàn bộ copy + số liệu + ảnh Founder đều nằm trong code, cần deploy để sửa. `/admin/website` đã tồn tại nhưng chỉ là `ComingSoon` — sản phẩm đã tự biết đây là khoảng trống.
4. **`ecosystems.ts` (Projects & Opportunities) tự ghi chú trong code là "static data đứng thay cho CMS tương lai"** — xác nhận đây là khoảng trống đã biết trước, chưa ai xây.
5. **Companion có 3 hệ thống memory độc lập** (`memory_capsules`, `growth-view` event log, và `memory-store.ts` — phát hiện mới), không hệ nào liên kết với hệ nào, 0% admin nhìn thấy được.
6. **6 route API CKOS (`/api/v1/ckos/*`) hiện không có auth check** — không phải phạm vi sprint này để sửa, nhưng cần ghi nhận là rủi ro bảo mật cho PMO.
7. **Có một hệ thống kiểu dữ liệu tri thức khá tốt đã tồn tại** (`src/lib/portal/knowledge/types.ts`, 8 loại: AiTool/Resource/Article/Course/Project/Community/CompanionKnowledge/UserJourney) nhưng phần lớn dữ liệu thật vẫn nằm ở các file hardcode song song có từ trước, chưa dùng type system này.

---

## 1. Portal Inventory

### 1.1 Route Inventory (~65 route thật dưới `/portal/**`)

Route đầy đủ (nhóm theo khu vực), đánh dấu **[NAV]** = có trong sidebar, **[REDIRECT]** = redirect (client hoặc `next.config.ts`), **[DYN]** = route động:

| Khu vực | Route | Ghi chú |
|---|---|---|
| Home | `/portal` **[NAV]** | Gem Home — 7 pillar card |
| Companion | `/portal/companion` **[NAV]**, `/portal/ai-assistant`, `/portal/su-menh-companion` **[NAV]** (+`/companion-qua-hinh-anh`) | |
| CKOS | `/portal/ckos` **[NAV]**, `/portal/hetrithucai` (+`[slug]`, `/collection/[slug]`) | hetrithucai không có trong sidebar dù là sub-hub lớn |
| Academy | `/portal/hocvienai` **[NAV]**, `/portal/vdai-academy`, `/portal/ai-academy` **[REDIRECT]**→hocvienai, `/portal/personal-brand` **[REDIRECT]**→hocvienai | |
| AI Workspace | `/portal/aiworkspace` **[NAV]** (+`[slug]`, `/bai-viet/[slug]`, `/nghe/[slug]`), `/portal/workspace`, `/portal/prompts`(+`[id]`), `/portal/tools`(+`[id]`) | |
| Premium | `/portal/premium` **[NAV]**, `/portal/checkout`(+`/order-received/[id]`), `/portal/my-products` | |
| Projects & Opportunities | `/portal/duan-cohoi` **[NAV]** (+`[ecosystemSlug]`, `/[ecosystemSlug]/[subProjectSlug]`, `/bai-viet/[slug]`), `/portal/digital-assets`(+`[slug]`, `/category/[categorySlug]`), `/portal/earn`, `/portal/affiliate-hub`, `/portal/referral` | |
| Community | `/portal/congdongai` **[NAV]**, `/portal/experts` **[REDIRECT]**→congdongai, `/portal/student-success` **[dead — redirect ở config, page.tsx còn tồn tại nhưng không thể render]**, `/portal/updates` **[dead — tương tự]** | |
| Journey/Garden/Story | `/portal/hanhtrinhcuatoi` **[NAV]**(+`/ban-do`), `/portal/hanh-trinh-cua-toi` **[REDIRECT 301]**, `/portal/khuvuoncuaban`, `/portal/mirror`, `/portal/story`, `/portal/nhatkyhoctap`, `/portal/roadmap`, `/portal/goals`(+`/new`, `/[goalId]`), `/portal/origin`, `/portal/practice` | |
| Resources/Library | `/portal/resources`(+`[id]`), `/portal/templates`, `/portal/checklists`, `/portal/sop`, `/portal/saved`, `/portal/case-studies` | |
| Users/Account | `/portal/account`, `/portal/support`, `/portal/services`, `/portal/achievements`, `/portal/start-here` | |

**2 route chết cần PMO xác nhận:** `student-success/page.tsx` và `updates/page.tsx` bị redirect vĩnh viễn ở `next.config.ts` (dòng 38-39) nhưng file `page.tsx` vẫn còn trong repo, không bao giờ render được — nội dung đã di chuyển vào `congdongai/page.tsx`. Đề xuất xóa 2 file này ở một sprint dọn dẹp (không phải sprint này — "không sửa code ngoài phạm vi cần thiết").

### 1.2 Navigation Structure

Nguồn duy nhất: `src/lib/portal/hubs.ts` (`portalNavSections`) → `PortalSidebar.tsx`. **Chỉ 10 mục**, chia 2 nhóm không có tiêu đề (chỉ cách nhau bằng đường kẻ), không mục nào chết. Có **~55 route orphan** (không có trong sidebar) — phần lớn được thiết kế có chủ đích để truy cập qua liên kết trong trang hub (VD: `/portal/mirror`, `/portal/story`, `/portal/khuvuoncuaban` đều xuất phát từ Journey hub), không phải lỗi, nhưng khiến "bản đồ Admin cần quản lý" không thể chỉ dựa vào sidebar.

### 1.3 Header

`PortalHeader.tsx`: nút toggle sidebar, logo+wordmark, `PortalSearch` (tìm kiếm toàn Portal), chuông thông báo (chỉ là Link tới `/portal/congdongai#tin-tuc`, không phải dropdown thật), icon Saved, `PortalUserMenu`. Không có mega-menu.

### 1.4 Footer

**Portal không có footer riêng.** `PortalShell.tsx` không render `<Footer>` nào. Footer chỉ tồn tại trên trang công khai (`src/components/site/Footer.tsx`), ngoài phạm vi `/portal/**`.

### 1.5 Breadcrumb

`src/components/portal/ui/Breadcrumb.tsx` (đã hợp nhất từ Sprint 6 Portal) — chỉ dùng ở 4 route dynamic lồng sâu (ecosystem/sub-project, aiworkspace detail/blog). 9 trang hub lớn không dùng breadcrumb.

### 1.6 Page Section Inventory (9 trang hub lớn)

Đã audit chi tiết từng section của: Home, CKOS, Học viện AI, AI Workspace, Premium, Dự án & Cơ hội, Cộng đồng, Companion, Khu vườn của bạn — mỗi trang trung bình 5-10 khối nội dung riêng biệt (hero, grid card, CTA, widget, FAQ...). Chi tiết đầy đủ theo từng trang được lưu trong ghi chú nghiên cứu sprint, dùng làm input trực tiếp cho Mục 3 (Coverage Matrix) bên dưới thay vì lặp lại ở đây.

---

## 2. Content Inventory

Tổng hợp mọi loại "Content Object" xuất hiện trên Portal + trang chủ marketing (ngoài `/portal/**` nhưng cùng hệ thống), theo đúng danh sách gợi ý trong brief cộng thêm các loại phát hiện thêm:

| Content Type | Định nghĩa ở đâu | Nguồn dữ liệu | Route hiển thị |
|---|---|---|---|
| Website (site chrome) | `SiteSettings` — `site-settings.ts` | Supabase `settings`, sửa ở `/admin/settings` | Toàn site |
| Nav menu (site công khai) | `mainNav` — `site.ts` | **Hardcoded** | Header/MobileNavDrawer công khai |
| Nav menu (Portal hub) | `portalHubs`/`portalNavSections` — `hubs.ts` | **Hardcoded** | Toàn bộ sidebar Portal |
| Landing/Home sections | Local const mỗi component — `src/components/home/*.tsx` | **Hardcoded** | `/` |
| Banner | `Banner` — `portalBuilder.ts` | Admin CRUD → `portal_banners` (**đã nối dây thật**) | NotificationTicker (toàn Portal) |
| CTA | `CtaItem` — `portalBuilder.ts` | Admin CRUD → `portal_cta` (**orphan — không nơi nào đọc**) | — |
| FAQ | Field trên `AiToolObject`/`CourseObject`/...; `ckos_faqs` riêng | Admin CRUD → `ckos_faqs` | Chưa xác nhận route công khai nào đọc |
| News | `AdminContentItem` — `content.ts` | Admin CRUD → `news` | Chưa xác nhận route công khai |
| Course | `CourseObject`; bảng `courses`/`course_schedules` | Giá/trạng thái: Supabase `courses`; nội dung khoá học: hardcoded | `/portal/vdai-academy`, `/hocvienai`, `/premium` |
| Lesson | `CourseObject.modules[].lessons`; `ckos_lessons` (SQL, chưa migrate) | Hardcoded (chủ yếu) | `/portal/hocvienai`, `/vdai-academy` |
| Prompt | `Prompt` — `data/prompts.ts`; bảng `prompts` | Hardcoded seed + Admin CRUD `prompts` (đã nối dây) | `/portal/prompts` |
| Workflow | `AiWorkflow` — `ai-workspace.ts`; `ckos_workflows` | Hardcoded + Admin CRUD `ckos-workflows` (local tier) | `/portal/aiworkspace`, `/ckos/workflows` |
| Tool | `Tool` — `data/tools.ts`; bảng `tools` | Hardcoded + Admin CRUD `tools` (đã nối dây) | `/portal/tools`, Home |
| Resource | `FreeResource` — `data/resources.ts`; bảng `resources` | Hardcoded + Admin CRUD `resources` (đã nối dây) | `/portal/resources`, Home |
| Case Study | Inline type trong `page.tsx` | Supabase `case_studies` (DB-backed hoàn toàn) | `/portal/case-studies` |
| Premium (chương trình) | `PremiumProduct` — `data/premium.ts`; `premium-programs.ts` | Copy hardcoded + giá Supabase `courses` | `/portal/premium` |
| Project/Ecosystem | `Ecosystem` — `ecosystems.ts` | **Hardcoded, tự ghi "standing in for CMS"** | `/portal/duan-cohoi` |
| Community | `CommunityChannel` — `community.ts`; bảng `community` | Admin CRUD `community` (kênh); bài post user-generated | `/portal/congdongai` |
| Journey (tiến trình) | `Journey`/`JourneyChapter`/`GrowthMilestone` | Milestone hardcoded; tiến trình tính động | `/portal/hanhtrinhcuatoi`, `/roadmap`, `/goals` |
| Reflection | `Reflection` — `reflections.ts` | User-generated; câu hỏi gợi ý hardcoded (`warmth-engine.ts`) | `/portal/nhatkyhoctap`, `/mirror` |
| Memory | `MemoryEntry`/`MemoryCapsule` — 3 hệ song song (xem §Companion) | Supabase `memory_capsules` (user) + hardcoded seed | `/portal/companion`, `/mirror` |
| Persona (Companion) | `companion-identity.ts` | **Hardcoded, cần Product Team duyệt mới đổi** | Toàn bộ Companion UI |
| Founder profile | `FounderProfile` — `data/portal/founder.ts` | **Hardcoded** (đã hợp nhất 1 nguồn duy nhất) | Home, Premium, Community |
| Companion thoughts/musings | `companion-inner-life.ts`, `thought-seeds.ts` | **Hardcoded** | `/portal/companion` |
| Digital Asset/Article | `DigitalAssetCategory` — `digitalAssets.ts` | Category hardcoded + bài viết Admin CRUD `digital-asset-articles` | `/portal/digital-assets` |
| SOP/Checklist/Template | `Sop` — `data/sop.ts` | Hardcoded + Admin CRUD song song (`sop`/`checklists`/`templates`) | `/portal/sop` etc. |
| Affiliate resource | `AffiliateResource` — `affiliate.ts` | Hardcoded + Admin CRUD `affiliate_products`/`affiliate_links` | `/portal/affiliate-hub`, `/earn` |
| Blog post | `BlogPost` — `data/blog.ts` | Hardcoded seed + Admin CRUD `blog` | `/blogai` |
| CKOS Goal/Evaluation | Supabase `ckos_goals`/`ckos_evaluation_models` | Admin CRUD (local tier) | `/portal/ckos`, `/goals` |
| Best Practice | `ckos-best-practices` collection | Admin CRUD (local tier, mới từ ADM-SPR-003) | Chưa có route công khai xác nhận |

**Phát hiện cấu trúc quan trọng:** đã có sẵn một hệ type "Knowledge Object" khá tốt (`src/lib/portal/knowledge/types.ts`, 8 loại: AiTool/Resource/Article/Course/Project/Community/CompanionKnowledge/UserJourney) — đây là nền schema tự nhiên cho Admin CMS tương lai, nhưng phần lớn dữ liệu thật hiện vẫn nằm ở các file hardcode song song có từ trước type system này, chưa migrate.

---

## 3. Portal Coverage Matrix

Cột: **Portal Component → Current Source → Current Owner → Should Be Managed By → Future Workspace → Status**. Status: 🟢 Đã nối dây thật · 🟡 Admin có nhưng orphan/một phần · 🔴 Hoàn toàn hardcode, chưa có Admin.

| Portal Component | Current Source | Current Owner | Should Be Managed By | Future Workspace | Status |
|---|---|---|---|---|---|
| Site settings (tên, logo URL, SEO mặc định, social) | Supabase `settings` | `/admin/settings` | Giữ nguyên | System Settings | 🟢 |
| Site nav menu công khai | Hardcoded `site.ts` | Không ai | Admin mới | Website & Landing | 🔴 |
| Footer công khai | Hardcoded `Footer.tsx` | Không ai | Admin mới | Website & Landing | 🔴 |
| Home Hero/TrustStats/FinalCTA/FounderStory/AcademyTeaser | Hardcoded `components/home/*.tsx` | Không ai (`/admin/website` là stub) | Admin mới | Website & Landing | 🔴 |
| Banner (ticker) | Supabase `portal_banners` | `/admin/portal-builder/banner` | Giữ nguyên | Website & Landing | 🟢 |
| CTA blocks | Supabase `portal_cta` | `/admin/portal-builder/cta` (orphan) | Cần nối lại hoặc bỏ | Website & Landing | 🟡 |
| Featured content | Supabase `portal_featured` | `/admin/portal-builder/featured` (orphan) | Cần nối lại hoặc bỏ | Website & Landing | 🟡 |
| Portal Home sections/welcome | Supabase `portal_sections`/`portal_welcome` | Admin CRUD (orphan) | Cần nối lại hoặc bỏ | Website & Landing / Dashboard | 🟡 |
| Today-actions/start-here steps | Supabase `today_action_cards`/`start_here_steps` | Admin CRUD (orphan) | Cần nối lại hoặc bỏ | Academy hoặc My Journey | 🟡 |
| Brand assets (logo/favicon/màu) | Static files + `SiteSettings` (chỉ URL, chưa có thư viện) | Một phần `/admin/settings` | Admin mới (Media/Brand Studio) | Brand & Media | 🟡 |
| CKOS: Tools/Prompts/Resources | Supabase thật (`tools`/`prompts`/`resources`) | `/admin/tools`,`/prompts`,`/resources` | Giữ nguyên | CKOS | 🟢 |
| CKOS: Goals/Workflows/Evaluations/Best Practices/FAQs | localStorage tier (ADM-SPR-003/004) | `/admin/ckos/*` | Nối vào Supabase thật khi xác nhận | CKOS | 🟡 |
| CKOS: Case Studies | Supabase `case_study` (jsonb, admin) vs `case_studies` (typed, Portal đọc) — 2 bảng lệch nhau | `/admin/case-study` | Cần hợp nhất 1 bảng | CKOS | 🟡 |
| Academy: giá khoá học | Supabase `courses` | `/admin/course-pricing` | Giữ nguyên | Academy | 🟢 |
| Academy: nội dung chương trình/bài học | Hardcoded (nhiều file) | Không ai | Admin mới | Academy | 🔴 |
| AI Workspace: tool/workflow/work-need copy | Hardcoded `ai-workspace.ts` | Không ai | Admin mới | AI Workspace | 🔴 |
| Premium: giá + trạng thái mở bán | Supabase `courses` | `/admin/course-pricing` | Giữ nguyên | Premium | 🟢 |
| Premium: copy chương trình (5 chương trình) | Hardcoded `premium-programs.ts` | Không ai | Admin mới | Premium | 🔴 |
| Projects & Opportunities: 5 ecosystem | Hardcoded `ecosystems.ts` (tự ghi "CMS placeholder") | Không ai | Admin mới | Projects & Opportunities | 🔴 |
| Digital assets: category | Hardcoded `digitalAssets.ts` | Một phần Admin | Admin mới | Projects & Opportunities | 🟡 |
| Digital assets: bài viết | Supabase `digital_asset_articles` | `/admin/digital-assets/articles` | Giữ nguyên | Projects & Opportunities | 🟢 |
| Community: kênh | Supabase `community` | `/admin/community` | Giữ nguyên | Community | 🟢 |
| Community: bản đồ thành viên | Hardcoded rỗng (thiếu cột location ở `members`) | Không ai | Cần quyết định model | Community | 🔴 |
| Community: Guides/mentor profile | Hardcoded, dùng chung `founder.ts` | Không ai | Admin mới | Community | 🔴 |
| Journey/Garden/Mirror/Story: milestone, câu hỏi reflection | Hardcoded rải rác nhiều file | Không ai | Admin mới | My Journey (Workspace mới) | 🔴 |
| Companion: Persona/Identity | Hardcoded, cần Product Team duyệt | Không ai | Companion Studio (có gate duyệt, không CRUD tự do) | Companion Studio | 🔴 |
| Companion: Memory (3 hệ song song) | Supabase `memory_capsules` (user) + 2 hệ khác | Không ai | Companion Studio (đọc trước, không sửa) | Companion Studio | 🔴 |
| Companion: Agent Registry | Hardcoded, 32/33 "planned" | Không ai | Companion Studio | Companion Studio | 🔴 |
| SEO: metadata từng trang | Hardcoded literal mỗi `page.tsx` | Không ai (`/admin/seo` là stub) | Admin mới | SEO | 🔴 |
| Users: ban/unban | Supabase `members` | `/admin/users` | Giữ nguyên (mở rộng field sau) | Users & Access | 🟡 |
| Legal pages (Terms/Privacy/Refund/Disclaimer) | Hardcoded body | Không ai | **Không nên** — giữ code-review | (Ngoài phạm vi CMS) | N/A |

---

## 4. Content Ownership Matrix

Cột: **Entity → Owner Workspace → Portal Consumer → Companion Consumer → Admin Editor (hiện tại) → Publish Target**.

| Entity | Owner Workspace | Portal Consumer | Companion Consumer | Admin Editor hiện tại | Publish Target |
|---|---|---|---|---|---|
| Site chrome (nav/footer/logo) | Website & Landing | Toàn site | Không | Một phần `/admin/settings` | Global layout |
| Home marketing sections | Website & Landing | `/` | Không | **Không có** (`/admin/website` = stub) | `/` |
| Banner | Website & Landing | Toàn Portal (ticker) | Không | `/admin/portal-builder/banner` | `NotificationTicker` |
| Tool | CKOS | `/portal/tools`, `/aiworkspace`, Home | Có (CKOS Runtime đọc `tools`) | `/admin/tools` | `/portal/tools/*` |
| Prompt | CKOS | `/portal/prompts` | Có (đọc `prompts`) | `/admin/prompts` | `/portal/prompts/*` |
| Resource | CKOS | `/portal/resources`, Home | Có | `/admin/resources` | `/portal/resources/*` |
| Workflow | CKOS | `/portal/aiworkspace`, `/ckos` | Chưa (route API tồn tại, chưa gọi) | `/admin/ckos/workflows` (local tier) | Chưa live |
| Goal (tri thức) | CKOS | `/portal/ckos` | Chưa | `/admin/ckos/goals` (local tier) | Chưa live |
| Evaluation | CKOS | Chưa có route công khai | Không (Evaluation Intelligence chưa xây) | `/admin/ckos/evaluations` (local tier) | Chưa live |
| Case Study | CKOS | `/portal/case-studies` | Không | `/admin/case-study` (bảng jsonb khác bảng Portal đọc — xem §3) | `/portal/case-studies` (khi hợp nhất bảng) |
| Course (giá) | Academy/Premium | `/portal/premium`, `/hocvienai` | Không | `/admin/course-pricing` | Ngay lập tức |
| Course (nội dung) | Academy | `/portal/hocvienai`, `/vdai-academy` | Không | **Không có** | Cần deploy code |
| Premium program copy | Premium | `/portal/premium` | Không | **Không có** | Cần deploy code |
| Ecosystem/Project | Projects & Opportunities | `/portal/duan-cohoi` | Không | **Không có** | Cần deploy code |
| Community channel | Community | `/portal/congdongai` | Không | `/admin/community` | Ngay lập tức |
| Founder profile | Website & Landing (nguồn), dùng lại ở Community/Premium | Home, Premium, Community | Không | **Không có** | Cần deploy code |
| Companion Persona | Companion Studio | Toàn Companion UI | Chính nó | **Không có** (cần gate duyệt Product Team) | Cần deploy code + duyệt |
| Companion Memory | Companion Studio | `/portal/companion`, `/mirror` | Chính nó | **Không có** | Runtime (user-generated), không publish |
| Journey Milestone | My Journey | `/portal/hanhtrinhcuatoi`, `/roadmap` | Gián tiếp (context nudge) | **Không có** | Cần deploy code |
| Reflection prompt | My Journey | `/portal/nhatkyhoctap`, `/mirror` | Gián tiếp | **Không có** | Cần deploy code |
| SEO metadata/trang | SEO | Toàn site (per-page) | Không | **Không có** (`/admin/seo` = stub) | Cần deploy code |
| Member (users) | Users & Access | Toàn Portal (auth) | Không | `/admin/users` (ban/unban) | Ngay lập tức |

---

## 5. Hard-coded Inventory

Đầy đủ trong ghi chú nghiên cứu; tóm tắt các cụm lớn nhất, xếp theo mức ưu tiên "Should Become Admin Managed":

**Yes (nên đưa vào Admin sớm):**
- Home Hero (headline, subhead, 2 CTA, stat badge) — `components/home/Hero.tsx`
- Founder bio + ảnh — `data/portal/founder.ts` + `components/home/FounderStory.tsx`
- TrustStats số liệu — `components/home/TrustStats.tsx`
- FinalCTA — `components/home/FinalCTA.tsx`
- AcademyTeaser (tên chương trình V-SOLO/V-SCALE, module/lesson list) — `components/home/AcademyTeaser.tsx`
- Nav menu công khai — `lib/site.ts`
- Footer link columns — `components/site/Footer.tsx`
- Ecosystem/Project mini-site (5 hệ sinh thái, đã tự ghi "CMS placeholder") — `data/portal/ecosystems.ts`
- Premium program copy (5 chương trình) — `components/portal/premium/premium-programs.ts`

**Maybe (cần PMO quyết định phạm vi/tần suất sửa):**
- Problem/Solution positioning copy — `components/home/Problem.tsx`, `Solution.tsx`
- FreeResources vault (trùng khái niệm với `data/resources.ts`, nên hợp nhất 1 nguồn thay vì sửa 2 chỗ)
- Per-page SEO metadata (giá trị cao cho trang landing như `/portal/premium`, giá trị thấp cho trang account/legal)
- Companion daily thoughts/musings (~40+ dòng copy giọng văn tinh chỉnh kỹ — rủi ro nếu mở cho người không chuyên sửa)
- CKOS FAQ (đã có model + Admin CRUD nhưng chưa xác nhận route công khai nào đọc — cần PMO xác nhận có đang dùng không)

**No (nên giữ nguyên trong code):**
- Legal pages (Terms/Privacy/Refund/Disclaimer) — cần review pháp lý, không nên tự do sửa qua Admin
- Companion Persona/Identity core — tự ghi rõ cần Product Team duyệt, không phải CRUD tự do
- Brand static file mặc định (đã có override qua `SiteSettings.logoUrl`/`faviconUrl`)
- `portalBuilder.ts` seed data (chỉ là fallback, đường sửa thật đã là Admin CRUD → Supabase)

---

## 6. Workspace Recommendation

Dựa trên Portal thật (không giới hạn bởi 14 nhóm sidebar Admin đã dựng ở ADM-SPR-002), đề xuất **15 Workspace** — thêm 2 Workspace mới so với cấu trúc cũ (**AI Workspace**, **My Journey**) vì đây là 2 khu vực Portal lớn, có thật, đang hoàn toàn hardcode, và trước đây không có Workspace riêng nào phụ trách:

1. **Dashboard** — tổng quan (giữ nguyên)
2. **Website & Landing** — Home marketing, nav, footer, legal-page links (không phải nội dung pháp lý), CTA/Banner/Featured (thay thế 3 collection orphan)
3. **Brand & Media** — logo/favicon/màu + thư viện media (mới, hiện chưa có)
4. **CKOS** — Tools/Prompts/Resources/Workflows/Evaluations/Goals/Case Studies/Best Practices/FAQs (đã xây phần lớn, cần hoàn thiện theo Founder Directive mới — không alias field)
5. **Academy** — nội dung chương trình/khoá học/bài học (khác giá — giá thuộc Premium)
6. **AI Workspace** — **(mới)** tool/workflow/work-need copy riêng của khu vực AI Workspace
7. **Premium** — giá (đã có) + copy chương trình (chưa có)
8. **Projects & Opportunities** — ecosystem, digital assets
9. **Community** — kênh, guides/mentor, bản đồ thành viên
10. **My Journey** — **(mới)** Journey milestone, Garden growth stage, Reflection prompt, Mirror/Story content
11. **Companion Studio** — persona (có gate duyệt), memory (chỉ đọc trước), agent registry (chỉ đọc)
12. **Users & Access** — mở rộng dần từ ban/unban
13. **Analytics** — báo cáo tổng hợp
14. **SEO** — metadata từng trang
15. **System Settings** — cấu hình toàn site

---

## 7. Future Expansion Matrix

| Mở rộng tương lai | Admin hiện tại có hỗ trợ không | Ghi chú |
|---|---|---|
| CRM | Không | `/admin/leads` chỉ là danh sách email thô, không có pipeline/stage/owner — cần model mới |
| Marketplace (bên thứ 3 bán hàng) | Không trực tiếp, nhưng pattern jsonb collection có thể bootstrap nhanh | Affiliate hiện tại là link ra ngoài, không phải marketplace nội bộ |
| AI Agent (tự hành động) | **Có nền móng tốt nhất trong 6 mục này** | `agent-registry.ts` + `companion-orchestrator.ts` + `work-session` đã có đủ type/routing, chỉ cần thay phần rule-based bằng thực thi AI thật |
| Mobile App | Không | Gần như không có API surface public/versioned nào ngoài 6 route CKOS (đang không auth) |
| Public API | Một phần, nhưng có lỗ hổng | 6 route `/api/v1/ckos/*` là tiền lệ duy nhất — **không có auth check**, cần vá trước khi coi là nền API thật |
| Enterprise (multi-seat/team) | Không | Không tìm thấy `organization_id`/`team_id` ở bất kỳ đâu — mọi bảng đều scope theo `member_id` đơn lẻ qua RLS — cần model dữ liệu hoàn toàn mới |

---

## 8. Coverage Score

Ước tính định tính (không phải số đo tự động — dựa trên tỷ lệ nội dung thật sự có đường sửa qua Admin và đã nối dây tới Portal), theo Workspace đề xuất ở Mục 6:

| Workspace | Coverage |
|---|---|
| Website & Landing | 10% |
| Brand & Media | 20% |
| CKOS | 70% |
| Academy | 30% |
| AI Workspace | 10% |
| Premium | 35% |
| Projects & Opportunities | 25% |
| Community | 35% |
| My Journey | 5% |
| Companion Studio | 0% |
| Users & Access | 40% |
| Analytics | 50% |
| SEO | 5% |
| System Settings | 70% |
| **Trung bình toàn Portal** | **~29%** |

**Mục tiêu cuối: 100%** cho mọi Workspace, theo đúng chỉ thị Founder Directive Mục 6. Đây là con số khởi điểm để đo tiến độ qua các sprint tiếp theo, không phải KPI chính xác tuyệt đối.

---

## 9. ADM-SPR-006 Readiness

**SẴN SÀNG** để bắt đầu Workspace đầu tiên theo Founder Directive (Portal Coverage First: audit → coverage matrix → schema sạch → kết nối → xác minh Portal → mới loại bỏ nguồn cũ).

**Đề xuất thứ tự ưu tiên** (dựa trên Coverage Score thấp nhất + giá trị kinh doanh cao nhất):

1. **Website & Landing** — coverage thấp nhất (10%) và là nội dung marketing giá trị cao nhất (Hero/TrustStats/FounderStory/FinalCTA) — đồng thời giải quyết luôn 3 bảng orphan (`portal_cta`/`portal_featured`/`portal_sections`/`portal_welcome`).
2. **CKOS hoàn thiện** — coverage đã cao nhất (70%) nhưng cần làm lại theo Founder Directive mới (bỏ alias field `titleKey`/`summaryKey`/`bodyKey` từ ADM-SPR-004, dùng Content Core chuẩn, hợp nhất 2 bảng Case Studies).
3. **My Journey** — coverage gần như 0%, là khu vực Portal lớn (Journey/Garden/Mirror/Story) chưa từng có Workspace nào phụ trách.

**Không có gì chặn** việc bắt đầu ADM-SPR-006 — mọi thành phần Portal đã xác định được Workspace chủ quản (yêu cầu Acceptance Criteria "không còn thành phần nào chưa xác định Workspace Owner" — đã đạt qua Mục 3/4).

**Cần PMO quyết định trước khi giao Sprint tiếp theo:** chọn 1 trong 3 đề xuất trên (hoặc thứ tự khác) làm Workspace đầu tiên chính thức triển khai theo quy trình Portal Coverage First đầy đủ (bao gồm cả bước xây schema/kết nối/verify — sprint này chỉ dừng ở audit + thiết kế).
