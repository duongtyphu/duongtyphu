@AGENTS.md

## Stack
- Next.js 16.2.9 (App Router, Turbopack: `next dev --turbopack`)
- React 19, TypeScript
- Tailwind CSS v4 — token màu/spacing khai báo trong `app/globals.css` qua `@theme`
- Framer Motion cho animation
- Supabase làm backend cho admin + portal (đã có sẵn tầng dữ liệu đang chạy,
  xem mục "Tầng dữ liệu hiện có" bên dưới)

## Nguyên tắc giao diện Admin

Admin mới (`src/app/admin/**`, `src/components/admin/**`) phải dùng **NỀN
SÁNG, giống hệt `/portal`** — không dùng nền tối navy (đó là thiết kế Admin
cũ, đã bỏ). Màu nhấn CTA chính vẫn là `brand-blue`. Trước khi build bất kỳ
trang/component UI nào trong `/admin`, luôn đọc lại component thật tương ứng
ở `/portal` để lấy đúng class Tailwind/bố cục/token — luôn dùng class
Tailwind token có sẵn, không viết hex thô.

- **Nền GỐC dùng chung toàn Shell (không phải toàn bộ nền — xem mục
  "atmosphere riêng từng trang" ngay dưới):** tái sử dụng thẳng component
  `<GemBackground />` (`src/components/portal/ui/GemBackground.tsx`) ở tầng
  Shell (`AdminShell.tsx`/`PortalShell.tsx`) — giữ nguyên vị trí này, KHÔNG
  xoá khi thêm atmosphere riêng cho từng trang. Component này chỉ là `<div
  className="gemos-bg" />`; class `.gemos-bg` (`globals.css` dòng ~243) là
  layer `position: fixed; inset: 0; z-index: -1;` với `background-color:
  #F6F7F9` + gradient `#F6F7F9 → #F1F5F9`. **Lưu ý:** `#F6F7F9`/`#F1F5F9`
  KHÔNG trùng token `@theme` nào (gần nhưng khác `--color-background`
  `#F8FAFC`) — vì vậy phải dùng qua component/class có sẵn này, KHÔNG tự viết
  `bg-[#F6F7F9]` rời rạc trong từng file Admin.
- **Sidebar/card/popup:** `bg-white` + `border-gray-200` (đúng như
  `PortalShell.tsx`/`PortalHeader.tsx` đang dùng).
- **Header (topbar):** class `.gemos-topbar` = `rgba(255,255,255,0.9)` +
  `backdrop-filter: blur(18px)` + `border-bottom: #E2E8F0` (đúng như
  `TopbarGlass.tsx`).
- **Màu CTA/nhấn chính:** `--color-brand-blue` (`#2563EB`) — dùng qua
  `bg-brand-blue` / `text-brand-blue` / `border-brand-blue`.
- **`gemos-bg` (qua `<GemBackground />`) LÀ nền sáng chủ đạo của toàn bộ
  `/portal`** — không phải một phần của "tiểu hệ thống styling card", mà là
  cơ chế tạo nền thật (phủ lên `.mesh-navy` tối ở layout gốc) cho mọi route
  dùng `PortalShell`. Admin dùng đúng component này để luôn đồng bộ tự động
  với Portal qua 1 nguồn chung — KHÔNG tạo token màu mới, KHÔNG copy hex ra
  từng file.
- **Không dùng các class `gemos-*` khác ngoài `gemos-bg`** (`gemos-navy`,
  `gemos-ai-blue`, `gemos-card-title`, `gemos-gem-card`, `gemos-glass-card`,
  `gemos-btn-primary/secondary`...) cho Admin — nhóm này đúng là tiểu hệ
  thống styling riêng cho 5 loại thẻ ở vài trang `/portal/*` cụ thể (CKOS,
  Học viện AI, Workspace, Dự án & Cơ hội, Cộng đồng), không liên quan đến
  nền và không phải hệ CTA chung.

**Lịch sử quyết định (đã bị thay thế — giữ lại để biết vì sao đổi):**
Bản đầu (dựa trên grep, chưa đối chiếu ảnh chụp thực tế) từng chốt nền Admin
= `brand-navy`/`brand-navy-soft` (tối). Sau khi đối chiếu ảnh chụp `/portal`
thực tế cho thấy nền sáng, đọc lại code xác nhận `PortalShell.tsx` render
`<GemBackground />` (`z-index:-1`, sáng) phủ đè lên `.mesh-navy` gốc
(`z-index:-10`, tối) ở mọi route dùng `PortalShell` — nên nền THẬT của toàn
sản phẩm (trừ Landing/marketing) là sáng, không phải navy. Quyết định
`brand-navy` bị huỷ, thay bằng mục này.

Nếu Admin cần thêm 1 sắc thái chưa có token/class (ví dụ nền phụ nhạt hơn),
phải hỏi trước — không tự bịa hex mới.

**QUAN TRỌNG — `gemos-bg` CHỈ là lớp nền GỐC dùng chung, KHÔNG phải toàn bộ
nền của mọi trang `/portal`:** sau quyết định `gemos-bg` ở trên, `globals.css`
có 1 đợt cập nhật riêng ("GLOBAL VISUAL UPDATE — mỗi Platform có khí quyển
riêng", dòng ~2120) — mỗi platform chính giờ phủ THÊM 1 lớp `*-atmosphere-bg`
full-bleed đè lên trên `gemos-bg` (2 lớp cùng tồn tại, không thay thế nhau),
mỗi lớp 1 tông màu/gradient riêng — KHÔNG phải chỉ xám lạnh như `gemos-bg`
gốc. Case thực tế đã gặp: `/admin/home-cards` chỉ có `gemos-bg` (thiếu
`home-atmosphere-bg`) → lệch tông rõ so với `/portal` thật, phải sửa lại.

Danh sách đầy đủ các class `*-atmosphere-bg` (họ "Global Visual Update",
`globals.css` dòng ~2129 trở đi) và trang `/portal` đang dùng — tra cứu
nhanh khi build từng module Admin (Bước 6 trở đi):

| Class (`globals.css`) | Trang `/portal` đang dùng | Module Admin tương ứng |
|---|---|---|
| `.home-atmosphere-bg` | `portal/page.tsx` (trang chủ Học viện) | `home-cards` (đã áp, xem commit fix nền) |
| `.ckos-atmosphere-bg` | `portal/ckos/page.tsx`, `portal/hetrithucai/[slug]/page.tsx`, `portal/hetrithucai/collection/[slug]/page.tsx` | CKOS / Hệ tri thức AI |
| `.academy-atmosphere-bg` | `portal/hocvienai/page.tsx` | Học viện AI |
| `.workspace-atmosphere-bg` | `portal/aiworkspace/page.tsx`, `portal/aiworkspace/[slug]/page.tsx`, `portal/aiworkspace/bai-viet/[slug]/page.tsx` | AI Workspace |
| `.projects-atmosphere-bg` | `portal/duan-cohoi/page.tsx`, `portal/duan-cohoi/[ecosystemSlug]/page.tsx`, `portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page.tsx`, `portal/duan-cohoi/bai-viet/[slug]/page.tsx` | Dự án & Cơ hội / `projects` |

Ngoài họ `*-atmosphere-bg` này, một số platform khác dùng hệ bespoke RIÊNG
(khác tên, KHÔNG thuộc họ trên, mỗi hệ có comment giải thích ngay trên định
nghĩa trong `globals.css`) — nếu sau này build trang Admin cho các module
này, phải đọc kỹ trang/component tương ứng trước, không suy đoán từ bảng
trên: `.campus-bg` (`portal/congdongai/page.tsx` — Cộng đồng), `.hub-atrium-bg`
(`portal/hanhtrinhcuatoi/page.tsx` — Hành trình của tôi), `.story-book-bg`
(`components/portal/story/MyStoryBook.tsx` — My Story), `.mirror-chamber-bg`
(`components/portal/mirror/MirrorChamber.tsx`), `.journal-notebook-bg`
(`components/portal/journal/LearningJournalNotebook.tsx`), `.map-parchment-bg`
(`components/portal/journey-map/JourneyMapAtlas.tsx`), `.sanctuary-bg`
(`components/portal/sanctuary/SanctuaryBackground.tsx`).

**Nguyên tắc bắt buộc:** trước khi build `page.tsx` cho từng collection Admin,
PHẢI đọc đúng trang `/portal` tương ứng để xác nhận (1) trang đó có dùng
chung `gemos-bg` hay có lớp khí quyển riêng khác biệt (tra bảng trên trước,
grep lại nếu module chưa có trong bảng), và (2) nếu có sắc thái riêng, trang
Admin tương ứng phải phản ánh đúng sắc thái đó bằng ĐÚNG CLASS có sẵn trong
`globals.css` — KHÔNG copy giá trị gradient/hex ra viết tay ở component
Admin (copy giá trị thay vì dùng class khiến Admin lệch màu ngay khi Portal
đổi gradient sau này — đúng lỗi đã gặp). Không mặc định 1 kiểu nền chung cho
tất cả các trang Admin, không tự suy ra từ tên trang.

## Tầng dữ liệu hiện có — QUAN TRỌNG, không xây trùng

Dự án ĐÃ CÓ SẴN 1 tầng dữ liệu admin↔portal đang chạy thật, không phải xây
lại từ đầu:
- `src/lib/admin/store.ts` (hook `useCollection`) — Portal gọi hook này để
  đọc dữ liệu do admin quản lý.
- `src/lib/admin/supabaseCollections.ts`, `requireAdmin.ts`,
  `collectionValidation.ts` — tầng backend mà `useCollection` gọi tới qua
  `src/app/api/admin/collections/**`.
- 14+ file `/portal` đang phụ thuộc trực tiếp vào chuỗi này: `tools`,
  `templates`, `digital-assets`, `affiliate-hub`, `checklists`,
  `duan-cohoi/bai-viet`, và các component `AdminPromptsSection`,
  `AdminServicesSection`, `AdminRoadmapSection`, `NotificationTicker`,
  `DigitalAssetProjectCard`.
- **TUYỆT ĐỐI KHÔNG xoá/sửa 4 file trên khi rebuild admin** — chỉ xây UI mới
  phía trên tầng dữ liệu này.
- `src/middleware.ts` xử lý chung route `/admin/*` và `/portal/*` — chỉ sửa
  phần liên quan `/admin` khi cần, không đụng phần `/portal`.

## Cấu trúc dự án
- Landing page: `src/app/page.tsx` + `src/components/home/**`
- Portal: `src/app/portal/**` + `src/components/portal/**`
- Admin: `src/app/admin/**` (đã xoá phần UI cũ ở nhánh `admin-rebuild`, giữ
  nguyên tầng dữ liệu ở mục "Tầng dữ liệu hiện có" bên trên)

## Quy ước dữ liệu
- Mọi bảng nội dung Supabase MỚI: `id`, `title`, `order_index`, `status`,
  `created_at`, `updated_at` (bảng đã có sẵn qua `supabaseCollections.ts` giữ
  nguyên cấu trúc hiện tại, không đổi để tránh vỡ Portal).
- Ghi dữ liệu dùng Server Actions (`"use server"`) cho phần build mới; phần
  cũ đã có API route riêng (`/api/admin/collections/**`) thì giữ nguyên,
  không viết lại trừ khi thật cần.
- Bảng `transactions` (nếu có): CHỈ ĐỌC trong admin.

## CKOS Coverage — trạng thái đọc/ghi thật giữa Admin và Portal

Theo dõi từng danh mục trong 7 "Intelligence" của CKOS (`/portal/ckos`) đã
thực sự nối Admin → Portal hay chưa — tránh lặp lại lỗi đã gặp (build UI
Admin nhưng Portal vẫn đọc mảng tĩnh, tưởng xong nhưng chưa xong).

- **Prompt: Full.** Admin sửa bảng `prompts` (`/admin/prompts`) → Portal
  hiển thị đúng qua `<AdminPromptsSection/>` (`useCollection("prompts")`)
  trên `/portal/prompts`. (Trang này còn 2 khối tĩnh khác không do Admin
  quản — `prompts` mảng tĩnh `src/data/prompts.ts` và bảng `prompt_templates`
  — cả 2 nằm ngoài phạm vi "Prompt" của CKOS admin, không phải lỗi.)
- **Workflow (sop): Full.** Admin sửa bảng `sop` (`/admin/ckos/sop`) →
  `/portal/sop` đọc trực tiếp bảng này (`status=Published`), không còn dùng
  mảng tĩnh `src/data/sop.ts` (đã đánh dấu `@deprecated`, giữ tạm để
  rollback nhanh).
- **Resource: Full.** Admin sửa bảng `resources` (`/admin/ckos/resources`)
  → `/portal/resources` + `/portal/resources/[id]` đọc trực tiếp bảng này
  qua `src/lib/portal/live-resources.ts`, không còn dùng mảng tĩnh
  `src/data/resources.ts` (đã đánh dấu `@deprecated`, giữ tạm để rollback
  nhanh). Khối "Tài liệu từ VO DUONG AI Academy" (bảng `documents`) là nội
  dung khác, tách biệt, không thuộc CKOS Resource.
- **Công cụ AI (tools): Full.** Admin sửa bảng `tools` (`/admin/tools`) →
  `/portal/aiworkspace` + `/portal/aiworkspace/[slug]` đọc trực tiếp bảng
  này qua `src/lib/portal/live-tools.ts`, không còn dùng mảng tĩnh
  `AI_TOOLS` (`src/data/khong-gian-ai/index.ts`, đã đánh dấu `@deprecated`).
  `NEED_CATEGORIES`/`PROFESSION_GROUPS`/`AI_ARTICLES`/`AI_PROMPTS` vẫn tĩnh
  — tương thích vì tra cứu chéo theo `slug`, không theo id.
- **Lesson: Full cho toàn bộ luồng hiển thị chính (danh sách, trang chi
  tiết, banner).** Bảng `knowledge_seeds` (**không phải `lessons`** — tên
  đó đã bị chiếm bởi bảng khoá học trả phí VDAI SOLO/SCALE thật,
  `id bigint/course_id/title/video_url/pdf_url/price`, dùng thật ở
  `/portal/vdai-academy` + `checkout/actions.ts` — gặp lỗi `relation
  "lessons" already exists` khi tạo bảng, phải đổi tên. **Luôn kiểm tra
  tên bảng có bị trùng trước khi tạo bảng mới cho module CKOS khác** —
  không giả định tên hiển nhiên còn trống). Admin sửa qua
  `/admin/ckos/lessons` (editor riêng, không phải DataTable chung — ~30
  field không vừa slide-over). Đọc qua `src/lib/portal/live-knowledge.ts`
  (`getLiveKnowledgeSeeds()`, `status=Published`) ở cả 3 nơi:
  `KnowledgeLibrary.tsx` (lưới 11 Lesson + tìm kiếm), trang chi tiết
  `/portal/hetrithucai/[slug]/page.tsx` (fetch trực tiếp trong page, không
  có `generateStaticParams()` ở trang này nên không có rủi ro build-crash),
  và `ContinueLearningBanner` (tra seed theo slug từ localStorage). Không
  còn dùng `knowledgeSeedJourneys` tĩnh ở cả 3 nơi này (đã đánh dấu
  `@deprecated`, giữ tạm để rollback).
  **Ngoại lệ đã biết, chưa Full:** bên trong trang chi tiết Lesson,
  `KnowledgeWorkspace.tsx` (component render nội dung — có sẵn marker
  code từ trước "Learning Engine — giữ nguyên, không sửa", KHÔNG đụng
  trong đợt này) vẫn gọi `getAdjacentSeeds`/`getRelatedSeedObjects`/
  `getPrerequisiteGuidance`/`getAllKnowledgeSeeds` (`knowledge-seed.service.ts`)
  và `getDependentSeeds`/`getPrerequisiteSeeds` (`knowledge-graph.service.ts`)
  — các hàm này vẫn đọc thẳng `knowledgeSeedJourneys` tĩnh để tính điều
  hướng Previous/Next, Related, Prerequisite, Knowledge Graph. Đúng vì 11
  slug migrate khớp 1:1 mảng tĩnh; nếu Founder sửa nội dung/thêm/bớt Lesson
  qua Admin mà không đồng thời sửa mảng tĩnh, riêng phần điều hướng này sẽ
  lệch — cần một việc riêng (mở khoá Learning Engine, viết lại các hàm trên
  để nhận seeds làm tham số) nếu muốn triệt để 100%.
- **Thư viện AI (Knowledge Collection): Full cho lưới Collection + số
  đếm/progress trên `CollectionCard`.** Bảng `knowledge_collections`, schema
  đơn giản hoá theo yêu cầu Founder (chỉ `name`/`description`/`seedSlugs` —
  KHÔNG khớp 1:1 type `KnowledgeCollection` thật vốn có
  `slug`/`title`/`relatedCollections`). Admin sửa qua
  `/admin/ckos/knowledge-collections` (DataTable, field `seedSlugs` là
  multi-select chọn từ `knowledge_seeds` thật). `id` của dòng chính là slug
  thật (`ai-office`, `ai-research-presentation` — đã xác nhận khớp mảng
  tĩnh cũ). `/portal/hetrithucai` đọc qua `getLiveKnowledgeCollections()`
  (cùng file `live-knowledge.ts`), map `data.name → title`, `id → slug`,
  `relatedCollections: []` (không có trong schema đơn giản hoá).
  `CollectionCard` tự fetch `getLiveKnowledgeSeeds()` để resolve
  `collection.seedSlugs` + tính đếm/progress cục bộ (không còn gọi
  `getSeedsInCollection`/`computeCollectionProgress` tĩnh). Không còn dùng
  `knowledgeCollections` tĩnh ở các chỗ này (đã đánh dấu `@deprecated`).
  **Ngoại lệ đã biết, chưa Full:** trang chi tiết Collection
  (`/portal/hetrithucai/collection/[slug]` → `KnowledgeCollectionView.tsx`)
  vẫn gọi `computeCollectionProgress`/`getSeedsWithStatus`/
  `getNextSeedToLearn`/`getSuggestedNextCollection`
  (`knowledge-collection.service.ts`) và `getRelatedCollectionObjects`
  (`knowledge-graph.service.ts`) — cùng lý do và cùng giới hạn như Lesson
  ở trên (Learning Engine, chưa mở khoá đợt này).
  **Gap đã tìm và sửa (test Founder phát hiện):** `/portal/ckos/page.tsx`
  (trang hub CKOS, khác `/portal/hetrithucai`) có 1 khu vực riêng ("Thư viện
  AI" preview + số đếm Lesson ở lưới "7 Intelligence") vẫn gọi
  `getAllKnowledgeSeeds()`/`getAllKnowledgeCollections()` tĩnh — sót lại từ
  trước, không nằm trong phạm vi migrate `/portal/hetrithucai` nên sửa sau
  vẫn không phản ánh. Đã đổi sang `getLiveKnowledgeSeeds()`/
  `getLiveKnowledgeCollections()` (cùng `live-knowledge.ts`) — sửa nội dung/
  status qua Admin giờ phản ánh đúng trên `/portal/ckos` lẫn
  `/portal/hetrithucai`.
- **Case Study:** Admin CRUD Full (`/admin/ckos/case-studies`, xem mục
  "Case Study" riêng bên dưới) — `/portal/case-studies` đọc đúng bảng
  `case_studies` (đã đọc lại code + query trực tiếp bảng để xác nhận theo
  yêu cầu Founder — `.from("case_studies").select(...).eq("active", true)`,
  khớp đúng bảng admin quản lý). Hiện bảng có **0 dòng** (Founder chưa tạo
  Case Study nào qua Admin mới) nên trang hiển thị đúng empty state — đây
  là trạng thái ĐÚNG, không phải lỗi nối sai nguồn.
- **Best Practice: Full.** Bảng mới `best_practices` (generic
  `id/data jsonb/status/order`, đã kiểm tra không trùng tên bảng nào đang
  chạy — kể cả `ckos_best_practices` của kiến trúc Phase G/H cũ, bảng đó
  không tồn tại). Migrate 13 dòng GUIDE thật từ `knowledgeSeedData`
  (title/description=summary/principle=content/legacySourceId=id gốc,
  không bịa nội dung — đối chiếu với
  `scripts/phase-h7-seed-best-practices-case-studies.ts`, dry-run cũ chưa
  từng apply). `id` mỗi dòng = slug-hoá từ `title` (khác cách file cũ làm,
  file cũ slug-hoá từ `legacy_source_id`). 2 field
  `relatedToolSlugs`/`relatedCaseStudyIds` để RỖNG khi migrate (seed gốc
  không có dữ liệu này), Founder điền dần qua Admin. Admin sửa qua
  `/admin/ckos/best-practices` ("Thực hành tốt (Folder)", DataTable
  chung — 6 field phẳng, không cần SingletonEditor).
  **`relatedCaseStudyIds` cần 1 cơ chế lấy dữ liệu riêng:** bảng
  `case_studies` là typed (không phải schema generic), nên
  `optionsSource: "case-studies"` KHÔNG đọc qua `useCollection()`/
  `/api/admin/collections/[table]` như "tools" — `FieldInput.tsx` có 1
  nhánh riêng (`CaseStudyMultiSelectField`) gọi thẳng Server Action
  `listCaseStudies()` đã có sẵn, dùng chung UI checkbox
  (`MultiSelectChecklist`) với nhánh generic — không tạo UI/FieldType mới,
  chỉ khác nguồn lấy dữ liệu.
  **Bước C (đã hoàn tất, 2 đợt):** `/portal/ckos` (`getKnowledgeCategories()`)
  đọc đếm thật từ `best_practices` (`status=Published`); field `hasRoute`
  đã bỏ hẳn (không còn category nào cần trạng thái "chưa có route" nữa).
  `/portal/ckos/best-practices` (`src/lib/portal/live-best-practices.ts`,
  `getLiveBestPractices()`) — danh sách 13 mục thật, bố cục bám đúng
  `/portal/sop` (h1+mô tả đơn giản, `card-shine`, `CompanionGuide` +
  `KnowledgeJourneyStrip` ở cuối — không dựng layout mới). Mỗi thẻ chỉ
  hiện title/description, bấm "Xem đầy đủ →" sang trang chi tiết mới
  `/portal/ckos/best-practices/[id]` (bố cục bám `/portal/prompts/[id]`)
  hiển thị `principle` đầy đủ. `CkosQuickSearch.tsx` không cần sửa —
  type/label `"best_practice"` đã có sẵn từ trước.
  `/api/v1/ckos/search/route.ts`: sửa bug tên bảng
  (`ckos_best_practices` → `best_practices`) + đổi cách đọc cột (title/
  description nằm trong `data` jsonb, không phải cột phẳng — cùng kỹ thuật
  đã dùng cho `tools`) + href mỗi kết quả trỏ đúng trang chi tiết
  `/portal/ckos/best-practices/[id]`.

**Bài học rút ra (áp dụng cho mọi module CKOS sau này):** "có trang
`/admin/*` chạy được" KHÔNG đồng nghĩa "Portal đã đọc đúng dữ liệu đó" —
luôn đọc trực tiếp code trang Portal đích (không suy đoán từ tên) để xác
nhận nó thực sự query đúng bảng Admin quản lý, trước khi báo "Full".

## CKOS — Knowledge Asset (80 mục, chưa xử lý)

Founder từng báo "Thư viện AI có khoảng 80 mục dang dở, chỉ có tiêu đề" —
con số này KHÔNG khớp 11 Lesson đã biết, đã audit riêng và xác nhận:

- **File:** `src/features/knowledge/data/knowledge-seed-data.ts`
  (`knowledgeSeedData: KnowledgeAsset[]`, đúng **80 mục**, đếm trực tiếp
  qua code — không suy đoán).
- Đây là tầng **NỀN TẢNG** của Thư viện AI (Sprint 01 "Knowledge Asset") —
  **11 Lesson** (bảng `knowledge_seeds`, Sprint 02 "Knowledge Journey")
  chỉ là hành trình đã tuyển chọn, tham chiếu vào MỘT PHẦN của 80 mục này
  qua `step.assetId` (74 step tổng cộng trong 11 Lesson, 3 `assetId=null`
  "sắp có", ~71-72 tham chiếu thật vào 80 mục này). 80 mục là tập lớn hơn
  hẳn, không phải suy ra từ 11 Lesson.
- Dữ liệu 80 mục **KHÔNG rỗng** — mỗi mục có đủ `content`/`practice`/
  `reflectionQuestions`/`nextStep`... nhưng UI hiện tại
  (`KnowledgeAssetCard`, `KnowledgeLibrary.tsx`, section "Tìm tri thức lẻ
  theo bộ lọc" trên `/portal/hetrithucai`) **không có link/onClick** nào
  để mở xem nội dung đầy đủ — chỉ hiện title + tóm tắt 2 dòng + "Bước
  tiếp theo". Vì vậy trải nghiệm thật đúng như Founder mô tả ("dang dở")
  dù dữ liệu gốc không thiếu.
- `ckos_best_practices` **KHÔNG liên quan** tới 80 mục này — bảng chưa
  tồn tại trong Supabase (`to_regclass()` → `null`), seed SQL trên đĩa
  chỉ có 13 dòng (chỉ loại GUIDE, 1 phần nhỏ của 80 mục), chưa từng chạy.

**QUYẾT ĐỊNH (Founder):** chưa đưa 80 Knowledge Asset vào Supabase/admin ở
đợt này — ưu tiên Case Study, Best Practice, CKOS Dashboard trước. Nếu làm
sau, cần: (1) audit đầy đủ field `KnowledgeAsset` trước khi thiết kế
schema, (2) migrate **giữ nguyên `assetId`** (74 điểm tham chiếu từ
`knowledge_seeds.steps` phụ thuộc trực tiếp vào các id này — đổi id là gãy
liên kết Lesson→Asset), (3) sửa UI Portal để có trang/cách xem nội dung
đầy đủ (hiện hoàn toàn chưa có, đây là gap UX thật, không chỉ là gap dữ
liệu).

## Case Study

Bảng `case_studies` (typed, không phải schema generic `id/data/status/order`)
đã tồn tại thật, `/portal/case-studies` đã đọc đúng — nhưng Admin CRUD từng
tồn tại rồi bị xoá, và schema thật hẹp hơn những gì code cũ giả định:

- **Schema live thật** (xác nhận qua `information_schema.columns`, không
  suy đoán): đúng 9 cột — `id (bigint), title (text, not null), client_name,
  summary, result_metric, thumbnail_url, link_url (text, nullable),
  active (boolean, default true), created_at (timestamptz, default now())`.
- Từng có 1 trang Admin CRUD thật cho bảng này
  (`app/admin/(dashboard)/case-study/{page.tsx,CaseStudyForm.tsx,actions.ts}`,
  dùng `requireAdmin()` + `getSupabaseAdmin()`, mẫu giống `premium/actions.ts`)
  — bị xoá cùng đợt dọn `/admin` cũ (commit `df156f3: "chore: xoá admin cũ,
  giữ nguyên tầng dữ liệu dùng chung"`), không phải vì hỏng mà vì xoá sạch cả
  `/admin` để dựng lại.
  **Quan trọng:** `actions.ts` cũ đó viết vào cột `slug/body/featured/
  published_at` — các cột này **KHÔNG tồn tại** trên bảng thật (chỉ có trong
  file SQL `supabase-phase-f-case-studies-extend-schema.sql`, chưa từng
  `apply_migration`). Nghĩa là bản Admin CRUD cũ này **chưa bao giờ hoạt
  động được** nếu ai đó thực sự bấm Lưu — sẽ lỗi Postgres "column does not
  exist". Không nên khôi phục lại nguyên bản cũ.
- `supabase-phase-g-case-studies-ckos-standard-columns.sql` (status/version/
  language/difficulty/tags/metadata/updated_at) — cũng chỉ là file SQL, chưa
  áp dụng, và ngay cả bản Admin cũ (dù sai) cũng chưa từng dùng tới các cột
  này.
- **Phạm vi Admin CRUD mới** (`/admin/ckos/case-studies`, "Câu chuyện thành
  công (Folder)"): đúng 7 field live thật — `title, client_name, summary,
  result_metric, thumbnail_url, link_url, active` — khớp chính xác những gì
  `/portal/case-studies` đọc. KHÔNG áp dụng Phase F/G ở đợt này.
- Nếu sau này muốn Case Study có `slug`/trang chi tiết riêng (dùng cột
  `slug`/`body` đã có sẵn trong Phase F), đây là **quyết định migrate riêng,
  cần duyệt tách biệt** — không tự động áp dụng theo file SQL cũ đã viết sẵn
  từ trước, vì file đó viết cho một kế hoạch (form Admin cũ) đã bị xoá.
- Comment lỗi thời trong `src/lib/admin/supabaseCollections.ts` (nhắc tới
  trang Admin case-study đã xoá như thể còn tồn tại) — đã sửa lại khi build
  Admin CRUD mới.

## CKOS Dashboard

`/admin/ckos` (trước đây 404 — nhóm sidebar "Hệ tri thức (CKOS)" chỉ có
sub-route, không có index page riêng). Tổng hợp số liệu THẬT, không mock,
từ toàn bộ 7 Intelligence:

- **9 bảng generic** (`prompts, sop, resources, templates, ebooks,
  checklists, tools, knowledge_seeds, knowledge_collections,
  best_practices`) — đã xác nhận qua `information_schema.columns` là
  **chung hệt một schema** (`id/data jsonb/status/order/created_at/
  updated_at`) trước khi code, không suy đoán. Field tên hiển thị trong
  `data` khác nhau giữa các bảng (`title` cho prompts/knowledge_seeds/
  best_practices, `name` cho các bảng còn lại) — khai báo tường minh trong
  `GENERIC_SOURCES` (`src/app/admin/(dashboard)/ckos/page.tsx`), không suy
  đoán chung 1 tên.
- **Case Study xử lý riêng** — bảng `case_studies` không có cột `status`
  (chỉ có `active` boolean) và không có `updated_at` (chỉ `created_at`).
  Dashboard gọi thẳng `listCaseStudies()` (Server Action có sẵn ở
  `case-studies/actions.ts`), báo cáo "đang hiển thị/đã ẩn" riêng biệt,
  KHÔNG gộp vào khối Published/Draft của 9 bảng generic.
- **Published/Draft tổng hợp**: cộng dồn theo giá trị `status` THẬT xuất
  hiện (không hardcode chỉ 2 loại — hiện tại chỉ có `Draft`/`Published`
  tồn tại thật, `Hidden` là option hợp lệ nhưng chưa có dòng nào dùng; nếu
  sau này có dòng `Hidden`, khối này tự hiện thêm cột tương ứng).
- **Cập nhật gần đây** (8 mục): gộp từ 9 bảng generic theo `updated_at`
  giảm dần. Case Study bị loại khỏi mục này (không có `updated_at`) — có
  ghi chú giải thích ngay trong UI, không âm thầm bỏ qua.
- Không có mẫu dashboard admin nào có sẵn trong repo để soi theo
  (`/admin/dashboard` chỉ là 2 dòng chào mừng) — dùng lưới card đơn giản,
  đúng token đã dùng xuyên suốt các trang `/admin/ckos/*`.

## Premium (`/portal/premium`) — bảng `courses`

Audit "Nhóm A" phát hiện bảng `courses` (đọc bởi `/portal/premium`,
`/portal/vdai-academy`, `checkout/actions.ts`) chỉ có 2/5 dòng đúng ra phải
có (khớp 5 chương trình trong `premium-programs.ts`), và 2 dòng đó sai giá
(V-Solo = 0đ, V-Scale = 5.999.999đ) — không chương trình nào bán được vì
cả 2 đều `status='coming'`. Đã sửa qua `execute_sql` (dữ liệu, không phải
migration/schema), sau khi Founder xác nhận từng con số — không tự đoán
giá:

| id | name | status | price |
|---|---|---|---|
| `ai-coban` (mới) | Lớp học AI Cơ bản | `open` | 1.500.000đ |
| `ai-nangcao` (mới) | Lớp học AI Nâng cao | `open` | 3.999.999đ |
| `openclaw` (mới) | Lớp học OpenClaw | `open` | 999.999đ |
| `solo` | VDAI SOLO | `coming` | 5.900.000đ |
| `scale` | VDAI SCALE | `coming` | 7.999.999đ |

Lưu ý: giá V-Scale (7.999.999đ) hiện **thấp hơn** V-Solo (5.900.000đ) —
ngược thứ tự "cá nhân &lt; đội nhóm" so với `listPrice` tham chiếu cũ trong
`premium-programs.ts` (V-Solo 7.8tr &lt; V-Scale 26tr). Đây là giá thật do
Founder xác nhận trực tiếp, không phải lỗi — chỉ ghi chú lại để không ai
nhầm là bug nếu thấy khác `listPrice` sau này. `name` mỗi dòng mới được
đặt sao cho khớp đúng `matchPatterns` của `matchCourse()` trong
`src/app/portal/premium/page.tsx` (so khớp `name.toLowerCase().includes(p)`,
không xử lý dấu — vd. "Lớp học AI Cơ bản" chứa chuỗi "cơ bản" khớp pattern
`["cơ bản", "co ban", "ai basic", "basic"]`).

**Admin UI đã rebuild** — `/admin/course-pricing` (Server Actions riêng
`actions.ts` — bảng typed, không qua `/api/admin/collections/[table]` —
`requireAdmin()` + `getSupabaseAdmin()`, cùng mẫu `case-studies/actions.ts`),
sửa `price`/`status` (`open`/`coming`) cho từng dòng. Bản cũ đã xoá cùng
`df156f3` dùng `id: number` — **KHÔNG khớp thực tế** (`id` live là `text`),
nên không copy nguyên bản cũ, viết lại với `id: string`. Nối vào sidebar
nhóm "Nội dung" (`nav.ts`), label "Giá khoá học Premium", tái dùng icon
`Wallet` đã có sẵn trong `AdminSidebar.tsx` (`navIcons["/admin/course-pricing"]`).

## Academy Journey Engine (`journey.service.ts`) — đã nối Supabase thật

**Không nhầm với CKOS "Learning Engine"** (mục "Ngoại lệ đã biết, chưa
Full" ở trên, `KnowledgeWorkspace.tsx`/`KnowledgeCollectionView.tsx`) —
đó là 2 hệ thống khác nhau, cùng bệnh (đọc mảng tĩnh) nhưng chỉ 1 cái được
sửa ở việc này:

- **CKOS Learning Engine** (`KnowledgeWorkspace.tsx`/`KnowledgeCollectionView.tsx`,
  điều hướng Previous/Next/Related/Prerequisite trong trang chi tiết
  Lesson/Collection) — **vẫn giữ nguyên, chưa đụng**, vẫn đọc
  `knowledgeSeedJourneys`/`knowledgeCollections` tĩnh như mô tả ở trên.
- **Academy Journey Engine** (`src/features/academy/services/journey.service.ts`,
  dùng bởi `JourneyCard` ở `/portal/hocvienai`) — **đã sửa xong**, giờ đọc
  Supabase thật qua `getLiveKnowledgeCollections()`/`getLiveKnowledgeSeeds()`
  (`live-knowledge.ts`), không còn đọc `knowledgeCollections`/
  `knowledgeSeedJourneys` tĩnh.

Vì per-user progress (`getSeedCompletedStepIds`) chỉ đọc được ở Client, còn
CKOS data giờ cần fetch async từ Supabase, kiến trúc đổi thành: fetch 1 lần
ở `AcademyHubPage` (Server Component, giờ `async`), truyền `collections`/
`seeds` xuống `JourneyCard` (Client) qua props thuần, mọi hàm export trong
`journey.service.ts` nhận `collections`/`seeds`/`getSeedCompletedStepIds`
làm tham số thay vì tự đọc/import. Logic điều hướng/thứ tự/ngưỡng tính
progress giữ nguyên 100% — chỉ đổi nguồn đọc dữ liệu (viết các hàm nội bộ
mới `*Live` mirror lại đúng logic cũ, không sửa các hàm dùng chung của
CKOS vì Learning Engine còn phụ thuộc chúng). `journey.service.test.ts`
vẫn dùng 2 mảng tĩnh `@deprecated` làm fixture cho unit test (khớp 1:1 dữ
liệu đã migrate lên Supabase, không cần Supabase thật để test logic).

## Bug đã sửa: `/api/admin/collections/[table]` GET không trả `status`

Phát hiện lúc Founder verify VIỆC 3 (Academy Journey Engine): sửa nội dung
1 Lesson/Knowledge Collection qua Admin xong, mục đó **biến mất khỏi mọi
nơi đọc `status='Published'`** (`/portal/hetrithucai`, `/portal/ckos`,
Journey card ở `/portal/hocvienai`).

**Nguyên nhân:** GET (`src/app/api/admin/collections/[table]/route.ts`)
chỉ `select("id, data, order")` — không lấy cột `status` (cột riêng, không
nằm trong `data` jsonb). Mọi editor (LessonEditor, DataTableRowPanel...)
đọc dữ liệu để sửa qua route này nên `item.status` luôn `undefined`. Khi
Lưu, patch gửi lên thiếu `status` → PATCH (`[id]/route.ts`) tự mặc định
`status: "Draft"` (dòng `typeof merged.status === "string" ? merged.status
: "Draft"`) — âm thầm unpublish dòng đó dù chỉ sửa nội dung không liên quan.

**Đã sửa:** GET giờ `select("id, data, status, order")`, merge `status:
row.status` vào item (đè sau `data` để không bị key trùng tên che mất).
Không cần đổi PATCH/POST/PUT — mọi form (LessonEditor, DataTableRowPanel)
đều spread toàn bộ item hiện có làm state gốc nên round-trip tự đúng khi
GET đã trả đúng `status`.

**Bug này ảnh hưởng MỌI collection dùng route chung này** (`tools`,
`prompts`, `resources`, `ebooks`, `checklists`, `sop`, `templates`,
`best-practices`, `home-cards`, `knowledge-seeds`, `knowledge-collections`,
Companion CMS...), không riêng CKOS — bất kỳ lần Lưu nào trước bản fix này
đều có rủi ro rơi status về Draft. Đã rà nhanh (`execute_sql` các bảng
chính) — hầu hết vẫn `Published` bình thường, riêng 2 dòng xác nhận bị ảnh
hưởng thật (`knowledge_collections.ai-office`,
`knowledge_seeds.viet-email-chuyen-nghiep`) và 2 dòng khác (`checklists`,
`templates`, mỗi bảng 1 dòng Draft) **chưa rõ có phải bug hay Draft có chủ
đích** — cần Founder tự kiểm tra lại nếu nghi ngờ nội dung nào "biến mất"
sau khi từng sửa qua Admin trước đây.

**Đã sửa thêm cùng đợt:** `LessonEditor.tsx` (`/admin/ckos/lessons`) trước
đó **hoàn toàn thiếu field "Trạng thái"** trong `EDITABLE_FIELDS` — không
có cách nào sửa status của 1 Lesson qua Admin (khác mọi editor CKOS khác
đều có field này). Đã thêm field `status` (select Draft/Published/Hidden)
làm field đầu tiên.

## `/admin/projects` — đính chính: KHÔNG phải link chết trong sidebar

Audit "Nhóm A" (phần Dự án & Cơ hội) từng báo "sidebar Admin có link chết
trỏ /admin/projects (404)". Re-verify lại `src/lib/admin/nav.ts` (nguồn sự
thật duy nhất cho `AdminSidebar`/`AdminSearch`, theo đúng comment đầu file)
— **không có entry `/admin/projects` nào cả**, nên sidebar thật KHÔNG hiển
thị link này, không có gì để bấm vào 404. Route `/admin/projects` cũng
không tồn tại (`src/app/admin/**` không có thư mục `projects`).

Nguồn gốc báo cáo sai: `AdminSidebar.tsx`'s `navIcons` (lookup icon theo
href, KHÔNG phải danh sách nav) có sẵn 1 dòng mồ côi
`"/admin/projects": FolderKanban` — object này chỉ được tra cứu bởi các
href đã có trong `adminNavGroups`, entry không khớp href nào thì không có
tác dụng gì (không phải dead link, chỉ là dead code). Đã dọn dòng này +
import `FolderKanban` không dùng nữa.

**Việc rebuild admin đầy đủ cho "Dự án & Cơ hội"** (bảng `projects`,
schema, trang quản lý) là việc khác, lớn hơn, cần quyết định mở rộng
schema riêng — chưa làm trong đợt này.

**Cập nhật (Việc 5, Nhóm B):** `/admin/projects` giờ là route THẬT (xem mục
"Dự án & Cơ hội" bên dưới) — đoạn "không tồn tại" ở trên chỉ đúng tại thời
điểm Việc 4, không còn đúng nữa.

## Dự án & Cơ hội (`/portal/duan-cohoi`) — bảng `projects`, phương án (a)

Audit Việc 5 phát hiện: bảng `projects` (Supabase, schema generic
`id/data/status/order`, 5 dòng, đúng 9 field:
`key/href/icon/name/description/expectation/fitCriteria/statusLabel/avoidCriteria`)
**trước đó không được trang nào đọc cả** — kể cả trang hub. Có 3 bản dữ liệu
song song cho cùng 5 hệ sinh thái: `/portal/duan-cohoi/page.tsx` (hub) tự
hardcode 1 mảng `ECOSYSTEMS` riêng trong JSX; `src/data/portal/ecosystems.ts`
(407 dòng, đầy đủ nhất — `highlights[]`/`subProjects[]`/`marketingLinks[]`/
`potentialAnalysis[]`... theo 4 `structureType` khác nhau) dùng bởi trang chi
tiết `[ecosystemSlug]`/`[subProjectSlug]`/`bai-viet/[slug]`; và bảng
`projects` mồ côi.

**Founder chọn phương án (a):** chỉ quản đúng 9 field hiện có của `projects`,
KHÔNG mở schema cho trang chi tiết (trang chi tiết vẫn đọc `ecosystems.ts`
tĩnh như trước — ngoài phạm vi việc này).

Đã làm:
- `/admin/projects` (`src/app/admin/(dashboard)/projects/page.tsx`) —
  `DataTable` chuẩn (schema generic nên không cần Server Actions riêng như
  Case Study/courses), 9 field + `status` (Draft/Published/Hidden).
- `src/lib/portal/live-projects.ts` (`getLiveProjects()`, cùng pattern
  `live-tools.ts`/`live-knowledge.ts`) — map field DB (`expectation`/
  `fitCriteria`/`avoidCriteria`) sang tên dùng ở Portal
  (`expectedOutcome`/`whoFor`/`whoNotReady`).
- `/portal/duan-cohoi/page.tsx` (hub) — bỏ mảng `ECOSYSTEMS` hardcode, đọc
  `getLiveProjects()`. `icon` lưu dạng string slug (`"layers"`,
  `"building-2"`...) trong DB — map qua `ICON_MAP` sang component Lucide
  thật, fallback `Layers` nếu slug lạ. `ECOSYSTEM_SURFACE` (bảng màu theo
  `key`) đổi từ `Record<literal-key>` (compile-time an toàn khi còn
  `as const`) sang `Record<string, ...>` + `DEFAULT_SURFACE` fallback xám
  trung tính — vì `key` giờ đến từ DB (`string` thường), Founder có thể gõ
  key lạ không khớp style nào, không được để crash.
- Nối `/admin/projects` vào `nav.ts` (nhóm "Nội dung") +
  `navIcons["/admin/projects"]` (`FolderKanban`, add lại sau khi đã dọn ở
  Việc 4 vì lúc đó route chưa tồn tại).

**Lưu ý khi Founder sửa qua Admin:** field `key` phải khớp đúng 1 trong 5
key đã định nghĩa style ở `ECOSYSTEM_SURFACE` (`digiu/solargroup/crypto/
blockchain/trading`) nếu muốn giữ đúng màu/dải màu riêng — key lạ vẫn hoạt
động (không crash) nhưng hiển thị màu xám mặc định. Field `href` phải khớp
đúng 1 trong 4 route tĩnh có sẵn ở `/portal/duan-cohoi/[ecosystemSlug]`
(theo `ecosystems.ts`) — sửa `href` thành giá trị không khớp sẽ tạo link
404 khi bấm vào thẻ.

## Sứ mệnh Companion (`/portal/su-menh-companion`) — Việc 6, Phần 1: 6 collection

Founder xác nhận: 6 khối nội dung ở trang này (khác hẳn `/portal/companion`
— xem phân biệt "2 hệ thống Companion" trong lịch sử phiên) cần tự sửa
được, không phải brand manifesto cố định. Đã tạo 6 bảng Supabase mới (cùng
khuôn generic `id/data jsonb/status/order` như Phase 2-7, migration
`supabase-phase8-companion-mission.sql`), thay 6 mảng hardcode trong
`su-menh-companion/page.tsx`:

| Bảng | Thay mảng | Số dòng | Shape `data` |
|---|---|---|---|
| `mission_items` | `MISSION_ITEMS` | 4 | `{content}` |
| `philosophy_pairs` | `PHILOSOPHY_PAIRS` | 4 | `{ai, companion}` |
| `constitution` | `CONSTITUTION` | 10 | `{content}` |
| `genome` | `GENOME` | 12 | `{key, label, meaning}` |
| `evolution` | `EVOLUTION` | 5 | `{stage, icon, meaning}` |
| `timeline` | `TIMELINE` | 6 | `{stage, philosophy, meaning, lesson}` |

Admin: 6 trang riêng dùng `VisualEditor` (không DataTable — nội dung ít,
thứ tự hiển thị quan trọng), nhóm sidebar mới "Sứ mệnh Companion" (`nav.ts`)
với nhãn tiếng Việt Founder-friendly, không lộ tên field kỹ thuật:
`/admin/su-menh-companion/{mission,philosophy,constitution,genome,evolution,timeline}`
→ "Sứ mệnh"/"Triết lý"/"Điều lệ"/"Bộ gene"/"Hành trình tiến hoá"/"Dòng thời
gian". Atmosphere dùng `<SanctuaryBackground/>` (qua `AdminAtmosphere`'s
`atmosphere` prop) — đúng nền thật của `/portal/su-menh-companion`, không
phải 1 class `*-atmosphere-bg`.

Portal `page.tsx` (đã là `"use client"` từ trước) đọc live qua
`useCollection()` cho cả 6 khối, không tách Server Component riêng.
`genome.key` giữ theo shape gốc (tên gene tiếng Anh, vd. "purpose") dù
Portal đổi sang dùng `id` của dòng làm React key (an toàn hơn key trùng
lặp của bản tĩnh cũ). `evolution.icon` giới hạn 5 slug cố định
(`seed/sprout/leaf/sparkles/infinity`, khớp `EvolutionIcon` trong
page.tsx) qua `select`, không cho gõ tay tự do.

**Lưu ý đặt tên:** khối `timeline` (6 giai đoạn "cuộc đời Companion") đặt
tên admin là "Dòng thời gian" — tránh nhầm với 1 artwork RIÊNG cũng tên
"Cuộc đời Companion" ở 7 trang flipbook (Phần 2, bảng
`companion_flipbook_pages` khác hẳn, xem mục ngay dưới đây).

## Sứ mệnh Companion — Việc 6, Phần 2: 7 trang flipbook (title/thứ tự)

7 trang flipbook "Companion qua hình ảnh"
(`/portal/su-menh-companion/companion-qua-hinh-anh`,
`CompanionFlipbook.tsx`) khác bản chất hẳn 6 khối ở Phần 1 — mỗi trang là
**1 ảnh nghệ thuật đã thiết kế sẵn (webp) + 1 tiêu đề**, không phải nội
dung văn bản. Founder xác nhận: tách riêng, chỉ quản title/thứ tự hiển
thị, **không quản/upload ảnh qua Admin** (ảnh vẫn qua quy trình thiết
kế/upload asset riêng như hiện tại).

Bảng mới `companion_flipbook_pages` (migration
`supabase-phase9-companion-flipbook.sql`, đã áp dụng, 7 dòng, cùng khuôn
generic) — giữ nguyên `id` = đúng slug trong `COMPANION_ARTWORK_SEQUENCE`
cũ (`companion-home`, `nhung-dieu-minh-tin`...). `data` có 3 field:
`title` (sửa được), `src` (đường dẫn ảnh — **có lưu nhưng KHÔNG có trong
`fields` của trang Admin**, chỉ hiển thị đọc trong `renderCard` để Founder
đối chiếu, không có ô nhập), và cột ngoài `status`/`order` như mọi bảng
khác.

Admin: `/admin/su-menh-companion/flipbook` ("Ảnh Companion (thứ tự &
tiêu đề)", cùng nhóm sidebar "Sứ mệnh Companion" với 6 mục Phần 1),
`VisualEditor`, atmosphere `<SanctuaryBackground/>` như Phần 1.

**Lưu ý quan trọng chưa xử lý:** `VisualEditor` là component dùng chung,
không có tuỳ chọn ẩn nút "Thêm mới"/"Xoá" theo từng collection. Bấm "Thêm
mới" ở trang này sẽ tạo 1 dòng KHÔNG có `src` (vì field đó không nằm trong
form) — tức 1 trang flipbook không có ảnh. Chưa thêm giới hạn này vào
component (ngoài phạm vi yêu cầu gốc) — Founder tự biết KHÔNG dùng "Thêm
mới"/"Xoá" ở trang riêng này, chỉ sửa tiêu đề + kéo-thả đổi thứ tự 7 dòng
có sẵn.

`CompanionFlipbook.tsx` đọc qua `useCollection("companion-flipbook-pages")`
thay cho mảng tĩnh `COMPANION_ARTWORK_SEQUENCE`
(`src/lib/companion-world/artwork-pages.ts`, đã đánh dấu `@deprecated`,
giữ lại tham khảo/rollback, không còn consumer nào import).

## AI Workspace (`/portal/aiworkspace`) — Việc 7, Nhóm B

Việc nhỏ nhất trong Nhóm B — hạ tầng Admin CRUD đã có sẵn, chỉ cần đổi
nguồn đọc từng phần trong `AiSpaceSections.tsx`.

**Đã làm — `PromptLibrarySection`:** đổi từ mảng tĩnh `@/data/prompts`
sang `useCollection("prompts")` (bảng thật, quản qua
`/admin/ckos/prompts`), lọc `status === "Published"`. Mirror đúng field
mapping đã dùng ở `AdminPromptsSection.tsx` (component live-prompt khác đã
có sẵn trên `/portal/prompts`) — `category`/`title` giữ nguyên tên,
`content` (nội dung prompt thật) thay cho `preview` cũ (preview cũ thực ra
là bản rút gọn của prompt, không phải mô tả — `description` trong bảng
thật mới là mô tả ngắn, không phù hợp thay `preview`). Cả phần hiển thị
(`line-clamp-2`) và phần Copy đều dùng `content`.

**Lưu ý quan trọng — sụt số lượng hiển thị:** bảng `prompts` hiện chỉ có
**2 dòng `Published`** (so với 12 dòng trong mảng tĩnh cũ, section này
trước đó hiển thị tối đa 9). Đây là đúng trạng thái dữ liệu thật (không
phải bug) — Founder cần thêm Prompt qua `/admin/ckos/prompts` nếu muốn
section này đầy hơn.

**Còn lại, CHƯA làm (chờ quyết định phạm vi):**
- `ResourceSection` (4 field điều hướng tĩnh, xem `AI_RESOURCES` trong
  `src/data/portal/ai-workspace.ts`) — mỗi thẻ hiện tại chỉ là 1 link điều
  hướng sang trang khác (`/portal/checklists`, `/portal/templates`,
  `/portal/resources`, `/portal/sop`), không phải nội dung thật của chính
  nó — cần Founder quyết định giữ nguyên hay đổi thành danh sách nội dung
  thật từ bảng `resources`.
- Blog AI (`AI_ARTICLES`, `src/data/khong-gian-ai/index.ts`) — audit phát
  hiện **không phải 1-đổi-1 đơn giản như giả định ban đầu**:
  `AiArticle` có `relatedToolSlugs`/`relatedNeedSlugs` (dùng để lọc bài
  viết liên quan theo Tool/theo Need category ở `[slug]/page.tsx`) —
  2 field này KHÔNG tồn tại trong `BlogPost`/`AdminBlogPostLike`
  (`src/data/blog.ts`, nguồn thật của `/blogai`). Đổi thẳng nguồn sẽ làm
  gãy tính năng lọc bài liên quan theo Tool/Need mà không có cách map lại.
  `AI_ARTICLES` còn được dùng ở 3 nơi: `aiworkspace/page.tsx` (bài nổi
  bật), `aiworkspace/[slug]/page.tsx` (bài liên quan theo Tool/Need), và
  `aiworkspace/bai-viet/[slug]/page.tsx` (trang chi tiết RIÊNG, song song
  với `/blogai/[slug]` — 2 trang chi tiết khác nhau cho cùng khái niệm
  "bài viết"). Cần Founder quyết định hướng trước khi code.

**Đã làm — Blog AI (`AI_ARTICLES` → bảng `blog` thật):** Founder chọn bỏ
hẳn tính năng lọc theo Tool/Need — nơi từng lọc giờ hiển thị bài mới nhất
từ bảng `blog` (đã `order by created_at desc`) thay thế, không cố map lại
quan hệ không có thật.

- `src/lib/portal/live-blog.ts` (mới) — `getLiveBlogPosts()` (cùng pattern
  `live-tools.ts`, dùng `getSupabasePublic()` để an toàn trong
  `generateStaticParams()`/Client Component) trả về `BlogPost[]` qua
  `fromAdminPost()` (adapter có sẵn trong `src/data/blog.ts`, cùng dùng ở
  `/blogai` — dùng chung 1 shape, không tạo type song song).
  `getLiveBlogPostBySlug()` tra 1 bài theo slug (dùng cho trang chi tiết).
- `aiworkspace/page.tsx` (hub, "use client") — `featuredArticles` đổi từ
  `AI_ARTICLES.filter(featured)` sang 3 bài mới nhất từ
  `getLiveBlogPosts()` (gọi qua `useEffect`, cùng pattern `getLiveTools()`
  đã có sẵn trong file này). `ArticleCard` đổi type sang `BlogPost`,
  `article.publishedAt` → `article.date` (field tên khác trong `BlogPost`).
  **Lưu ý:** `BlogPost` (qua `fromAdminPost()`) không mang field `featured`
  qua — đúng hành vi `/blogai` đã có từ trước (không tự mở rộng type dùng
  chung), nên "nổi bật" ở đây thực chất là "mới nhất".
- `aiworkspace/[slug]/page.tsx` (Server Component) — `ToolDetailPage`/
  `NeedCategoryPage` nhận thêm prop `articles: BlogPost[]` (fetch 1 lần ở
  `Page()`, `getLiveBlogPosts()` có `cache()` nên dedupe nếu gọi lại).
  `relatedArticles`/`articles` (theo Tool/Need) đổi thành `articles.slice(0,3)`
  — bỏ lọc quan hệ, hiển thị bài mới nhất.
- `aiworkspace/bai-viet/[slug]/page.tsx` — mirror đúng pattern
  `getAnyBlogPost()` đã có ở `/blogai/[slug]/page.tsx` (bài tĩnh `blogPosts`
  ưu tiên trước, không thấy mới tra `getLiveBlogPostBySlug()`).
  `generateStaticParams()` đổi từ `AI_ARTICLES.map(slug)` sang
  `blogPosts.map(slug)` (khớp đúng cách `/blogai/[slug]` tự làm — không
  liệt kê bài Admin-authored trong static params, dựa vào
  `dynamicParams=true` mặc định của Next.js để SSR on-demand cho slug live
  không nằm trong danh sách tĩnh). `related` gộp `blogPosts` + bài live,
  loại bài hiện tại, lấy 3 bài đầu.
- `AI_ARTICLES`/`AiArticle` (`src/data/khong-gian-ai/index.ts`) đánh dấu
  `@deprecated`, giữ lại tham khảo/rollback — không còn consumer nào
  import.

**Lưu ý dữ liệu thật đã thấy khi audit (không phải bug, chỉ ghi nhận):**
bảng `blog` hiện có 2 dòng Published, 1 dòng (`blog_1782479231604_rwoxu5`)
có `slug` chứa dấu cách + tiếng Việt có dấu (`"Về hệ sinh thái DigiU"`, không
phải dạng URL-safe `ve-he-sinh-thai-digiu`) — vấn đề dữ liệu có sẵn từ
trước (không phải do Việc 7 gây ra, `/blogai` cũng gặp y hệt), ngoài phạm
vi việc này.

## Việc 10 (`/portal/hocvienai`) + Việc 11 (`/portal/aiworkspace`) — cùng nguồn `ai-workspace.ts`

2 việc gộp, audit 1 lần vì cùng chung nguồn dữ liệu gốc
`src/data/portal/ai-workspace.ts` (file này còn giữ `LEARNING_PATHS`/
`AI_RESOURCES`, CHƯA migrate ở 2 việc này) — tách theo đúng trang portal
hiển thị, không theo file nguồn.

### Việc 10 — `/portal/hocvienai`: `WORK_NEEDS` (12) + FAQ (3)

- **`work_needs`** (migration `supabase-phase15-hocvienai-work-needs-faq.sql`,
  đã áp dụng, 12 dòng) — thay `WORK_NEEDS`
  (`src/data/portal/ai-workspace.ts`, đánh dấu `@deprecated`, giữ tham
  khảo/rollback). `WorkNeedSection` (`AiSpaceSections.tsx`, dùng ở
  `/portal/hocvienai` — xác nhận KHÔNG render ở `/portal/aiworkspace`,
  code đã có comment "chuyển sang Học viện AI") đọc qua
  `useCollection("work-needs", [])`, lọc `status === "Published"` — cùng
  pattern `PromptLibrarySection` đã dùng cho `prompts`. `need.id` chỉ dùng
  làm React key + `itemId` cho Companion workspace, KHÔNG dùng làm khoá
  tra cứu chỗ nào khác (đã grep xác nhận).
- **`hocvienai_faq`** (3 dòng, id synthesize `faq-1/2/3` vì mảng gốc
  không có field `id`) — thay mảng `FAQ` khai báo **inline trong
  `src/app/portal/hocvienai/page.tsx`** (không phải file dữ liệu riêng,
  đánh dấu `@deprecated` + `eslint-disable-next-line no-unused-vars` tại
  chỗ vì không còn consumer nào trong file nhưng vẫn giữ để tham khảo/
  rollback). `src/lib/portal/live-hocvienai-faq.ts` (mới,
  `getLiveHocvienaiFaq()`, cùng pattern `live-tools.ts`) fetch ở
  `AcademyHubPage` (Server Component, `Promise.all` cùng
  `getLiveKnowledgeCollections/Seeds`). **Đính chính đặt tên:** đây KHÔNG
  liên quan tới "Goals/FAQ" của CKOS mà audit Companion Admin từng xác
  nhận không tồn tại thật trong hệ thống — 2 khái niệm khác hẳn.
  Admin: `/admin/hocvienai/work-needs`, `/admin/hocvienai/faq` (nhóm
  sidebar mới "Học viện AI & AI Workspace").

### Việc 11 — `/portal/aiworkspace`: `RECOMMENDED_WORKSPACES` (8) + `AI_WORKFLOWS` (4)

- **`recommended_workspace`** (8 dòng) — thay `RECOMMENDED_WORKSPACES`.
  **Lưu ý quan trọng khi Founder sửa `id` qua Admin:**
  `src/lib/portal/foundation/mission-catalog.ts`'s
  `RECOMMENDED_WORKSPACE_TO_MISSION` là map TĨNH RIÊNG (không migrate ở
  việc này) khoá theo đúng `id` gốc (5/8 id có map:
  `viet-bai-facebook/tao-landing-page/viet-email-ban-hang/
  phan-tich-khach-hang/ke-hoach-30-ngay`) — đổi `id` qua Admin sẽ làm
  `missionId` rơi về `undefined` (không crash, chỉ mất liên kết Mission
  của phiên Companion workspace đó). Giữ nguyên các `id` gốc khi migrate.
  `RecommendedWorkspaceSection` (`/portal/aiworkspace` — xác nhận KHÔNG
  render ở `/portal/hocvienai`) đọc qua
  `useCollection("recommended-workspace", [])`.
- **`ai_workflow_sections`** (4 dòng) — thay `AI_WORKFLOWS`.
  **Đính chính quan trọng (Founder đã hỏi trước khi build):** xác nhận
  qua audit **KHÁC HẲN** bảng `sop` (Workflow/SOP đầy đủ, đã Full ở
  `/admin/ckos/sop` — xem mục "CKOS Coverage"). `sop` là tài liệu quy
  trình đầy đủ (`title/description/whenToUse/whenNotToUse/steps/
  relatedPromptId`, trang riêng `/portal/sop`); `AiWorkflow` chỉ là thẻ
  CTA nhẹ 4 mục (`id/title/steps[]/suggestedTools[]`, không mô tả/không
  tham chiếu Prompt) để mở phiên Companion workspace, render ở
  `/portal/aiworkspace`. Không trùng `id`, không chung schema — an toàn
  tạo bảng mới `ai_workflow_sections` (KHÔNG đặt tên `sop`/`ai_workflows`
  trùng ý nghĩa cũ). `AiWorkflowSection` đọc qua
  `useCollection("ai-workflow-sections", [])`.
  Admin: `/admin/aiworkspace/recommended-workspace`,
  `/admin/aiworkspace/ai-workflow-sections` (cùng nhóm sidebar "Học viện
  AI & AI Workspace" với Việc 10).

`RECOMMENDED_WORKSPACES`/`AI_WORKFLOWS`
(`src/data/portal/ai-workspace.ts`) đánh dấu `@deprecated`, giữ tham
khảo/rollback — không còn consumer nào import.

**Không đụng (ngoài phạm vi 2 việc này):** Journey Engine (`journey.service.ts`,
đã nối Supabase thật ở Việc 3), AI Toolbox (`AI_TOOLS` → bảng `tools`, đã
Full), `LEARNING_PATHS`/`AI_RESOURCES` (vẫn tĩnh, chưa migrate).

## Admin — Audit menu điều hướng (`nav.ts` + `AdminSidebar.tsx`)

**Nguyên tắc bắt buộc, áp dụng vĩnh viễn cho mọi group Admin sau này:**
mỗi group (trừ `group: null`) PHẢI ánh xạ 1:1 với ĐÚNG MỘT mục trong menu
Portal thật (`portalNavSections`, `src/lib/portal/hubs.ts`), cùng tên
gọi, cùng thứ tự Portal đang hiển thị:

```
Trang chủ Học viện → Companion → Hệ tri thức AI (CKOS) → Học viện AI
→ AI Workspace → Dự án & Cơ hội → Premium → Hành trình của tôi
→ Sứ mệnh Companion → Cộng đồng
```

**KHÔNG được gộp 2 mục Portal khác nhau vào 1 group Admin dù chúng dùng
chung file dữ liệu nguồn hay lý do kỹ thuật nào khác** — dùng chung nguồn
dữ liệu là chi tiết triển khai, không phải lý do gộp menu. Đây chính là
lỗi đã phát hiện và sửa trong đợt audit này.

### Lỗi đã sửa

1. **Việc 10+11 gộp sai** — nhóm `"Học viện AI & AI Workspace"` gộp 4
   trang quản trị (work-needs/faq thuộc `/portal/hocvienai`,
   recommended-workspace/ai-workflow-sections thuộc `/portal/aiworkspace`)
   thành 1 group, dù đây là 2 mục Portal RIÊNG BIỆT (2 và cách nhau đúng 1
   vị trí trong menu thật). Đã tách thành 2 group: `"Học viện AI"` (2
   item) và `"AI Workspace"` (nay có 3 item — xem mục 2 dưới).
2. **`"Nội dung"` gộp 4 mục Portal khác nhau vào 1 group** — phát hiện
   thêm khi audit lại toàn bộ (không chỉ tin audit gốc): nhóm `"Nội dung"`
   chứa `Công cụ AI` (nuôi `/portal/aiworkspace` — xác nhận qua CLAUDE.md
   mục CKOS Coverage, "Công cụ AI (tools): Full"), `Trang chủ Học viện`
   (nuôi `/portal` — trang chủ, KHÁC hẳn `/portal/hocvienai` dù tên rất
   giống), `Giá khoá học Premium` (nuôi `/portal/premium`), `Dự án & Cơ
   hội` (nuôi `/portal/duan-cohoi`) — 4 mục Portal khác nhau. Đã xoá
   nhóm `"Nội dung"`, tách 4 item vào đúng 4 group riêng: `Công cụ AI` →
   nhập vào group `"AI Workspace"` (cùng `Workspace đề xuất`/`Quy trình AI`);
   `Trang chủ Học viện`, `Premium`, `Dự án & Cơ hội` → mỗi mục 1 group
   riêng cùng tên Portal.
3. **Tên nhóm CKOS sai lệch nhẹ** — `"Hệ tri thức (CKOS)"` thiếu chữ "AI"
   so với tên Portal thật `"Hệ tri thức AI (CKOS)"`. Đã sửa tên group
   khớp chính xác.
4. **`/admin/companion` tách thành group riêng** — trước đây nằm chung
   `group: null` với `"Tổng quan"` (Admin's own dashboard, không map vào
   Portal item nào). Đã tách `/admin/companion` thành group `"Companion"`
   riêng (Portal mục #2), chỉ giữ lại `"Tổng quan"` ở `group: null` vì đây
   là trang nội bộ Admin, không thuộc menu Portal.

### Gap thật đã phát hiện (không phải lỗi tách nhóm — chưa xây, không tự xây thêm)

- **`"Cộng đồng"` (Portal mục #10, `/portal/congdongai`) — CHƯA có route
  Admin nào quản lý nội dung trang này.** Không tự thêm group giả — theo
  đúng nguyên tắc "chỉ liệt kê route THẬT SỰ tồn tại" của `nav.ts`.
- **`AdminSidebar.tsx`'s `navIcons` thiếu icon cho 12 route THẬT đang
  chạy:** `/admin/home-cards` và toàn bộ 11 route `/admin/ckos/*` (kể cả
  `/admin/ckos` — CKOS Dashboard) không có icon nào từ trước tới giờ —
  item vẫn hiển thị đúng (không crash), chỉ thiếu hình icon. Đã bổ sung
  đủ 12 icon còn thiếu.
- **`navIcons` có ~26 entry mồ côi** trỏ route Admin cũ đã xoá từ đợt dọn
  `df156f3` (`/admin/portal-builder/*`, `/admin/roadmap`,
  `/admin/daily-missions`, `/admin/prompts`/`/admin/templates`/
  `/admin/ebooks`/`/admin/checklists`/`/admin/sop` (bản cũ, chưa có tiền
  tố `/ckos/`), `/admin/saved`, `/admin/affiliate*`,
  `/admin/digital-assets*`, `/admin/premium`, `/admin/orders`,
  `/admin/coupons`, `/admin/services`, `/admin/support`, `/admin/blog`,
  `/admin/case-study`/`/admin/student-success` (bản cũ), `/admin/updates`,
  `/admin/community`, `/admin/users`, `/admin/leads`, `/admin/reports`,
  `/admin/settings`). **Không phải link chết** (`navIcons` chỉ tra icon
  cho item đã có trong `nav.ts`, không tự render thành link) nhưng là
  rác — đã xoá sạch, `navIcons` giờ khớp 1:1 với `nav.ts` (đã verify bằng
  script đối chiếu 3 chiều: route thật trên đĩa ↔ href trong `nav.ts` ↔
  key trong `navIcons` — cả 3 tập khớp chính xác, 0 lệch).

### Cấu trúc cuối cùng (10 group theo đúng thứ tự Portal + `Tổng quan` đứng đầu)

`Tổng quan` (ungrouped) → `Trang chủ Học viện` → `Companion` → `Hệ tri
thức AI (CKOS)` → `Học viện AI` → `AI Workspace` → `Dự án & Cơ hội` →
`Premium` → `Hành trình của tôi` → `Sứ mệnh Companion` → (không có group
`Cộng đồng`, xem gap ở trên).

### Phần 2 — Dashboard tổng quan (`/admin`, thật ra là `/admin/dashboard`)

`/admin` vẫn `redirect("/admin/dashboard")` như cũ (không đổi route).
Thay nội dung placeholder 2 dòng cũ bằng Dashboard thật:
`src/app/admin/(dashboard)/dashboard/page.tsx` đọc thẳng `adminNavGroups`
(nav.ts) làm nguồn duy nhất cho danh sách 9 group + module con (KHÔNG
định nghĩa lại danh sách module ở trang này — tự động ăn theo mọi thay
đổi nav.ts sau này, không lệch tay). Mỗi group card có link "Xem trên
Portal" (map tĩnh `PORTAL_HREF_FOR_GROUP` trong chính file — cùng cặp
group↔href Portal đã chốt ở Phần 1) và số dòng dữ liệu nhanh cho từng
module con.

**Cách lấy số dòng — KHÔNG viết API mới:** dùng đúng tầng dữ liệu mà
`/api/admin/collections/[table]` cũng dùng (`getSupabaseAdmin()` +
tên bảng thật, map tĩnh `TABLE_FOR_HREF` trong file) — KHÔNG tự
`fetch()` HTTP vào route của chính app (đã xác nhận không đáng tin cậy
trên serverless, xem comment gốc trong `fetchCollection.ts`), cùng cách
CKOS Dashboard (`/admin/ckos`) đã làm. Dùng `.select("id", {count:
"exact", head: true})` (đếm thuần, không tải cả `data` jsonb — nhẹ hơn
`fetchCollection()`/`DataTable` vì trang này chỉ cần con số). 2 bảng
TYPED riêng (`courses`, `case_studies`, không theo schema generic) tái
dùng thẳng `listCoursePricing()`/`listCaseStudies()` đã có sẵn — không
viết hàm đếm mới. Chỉ đếm TỔNG số dòng (không tách Published/Draft như
CKOS Dashboard) — đúng mức "không cần biểu đồ phức tạp" Founder yêu cầu.

`/admin/companion` (nhiều tab nội bộ riêng), `/admin/ckos` (chính nó là
trang tổng hợp), `/admin/su-menh-companion/live-edit` (công cụ thí điểm)
hiển thị không kèm số đếm — không phải 1 collection đơn, không có bảng
để đếm.

## Việc 8 — Cộng đồng (`/portal/congdongai`), Phần 1: nối Portal

Audit rút gọn (spot-check 3 điểm so với audit gốc) khớp đúng cả 3
(`community/news/updates/student_success_stories` vẫn 5/1/5/3 dòng;
mảng `NEWS` hardcode vẫn tồn tại; chưa có route Admin nào cho 4 bảng
này) — nhưng đọc thêm NỘI DUNG thật (không chỉ đếm dòng, đúng bài học
Việc 5) phát hiện 3 điểm brief gốc không lường tới, đã dừng hỏi Founder
trước khi build (không tự quyết định):

1. **`news`** (1 dòng) — không có UI consumer nào đọc bảng này (grep xác
   nhận), mồ côi thật sự. Founder quyết định: **bỏ qua hoàn toàn** ở việc
   này (không nối Portal, không build Admin).
2. **`student_success_stories`** (3 dòng) — nội dung TRÙNG hệt 3 "câu
   chuyện học viên" đã bị archive ở `/portal/student-success/page.tsx`
   (Minh Anh/Quốc Huy/Thanh Trúc) — chính là dữ liệu BỊA đã vi phạm
   NO-FAKE-DATA, giờ nằm sẵn trong Supabase. Founder quyết định: **không
   nối vào Portal** (route redirect vẫn giữ empty state trung thực hiện
   tại), **chỉ build Admin DataTable** (Phần 2) để Founder tự quản/xoá/
   sửa thành nội dung thật sau này — không xoá bảng, không tự ý xoá dữ
   liệu.
3. **`community`** (5 dòng: Facebook/YouTube/TikTok/Zalo/Telegram) —
   dùng vocabulary trạng thái riêng `"Active"/"Inactive"` (không phải
   chuẩn `Draft/Published/Hidden` như mọi bảng generic khác — đã có sẵn
   từ đợt seed trước, giữ nguyên không migrate). TikTok là kênh THẬT có
   URL thật, chưa từng hiển thị trên Portal trước đây. Telegram
   `status="Inactive"`, tự ẩn qua filter. Founder quyết định: **nối đủ**,
   chỉ hiện kênh `status="Active"`.

**Đã làm (Phần 1 — Portal, KHÔNG đụng `news`/`student_success_stories`):**
- `src/lib/portal/live-updates.ts` (mới) — `getLiveUpdates()`, đọc bảng
  `updates` (`status="Published"`, order theo cột `order`), map
  `data.publishedAt/title/type` → `{id, date, title, type}`.
- `src/lib/portal/live-community.ts` (mới) — `getLiveCommunityChannels()`,
  đọc bảng `community` (`status="Active"`), map `data.platform/label/url`
  → `{id, platform, label, url}`, lọc thêm `url.length > 0` (phòng dòng
  thiếu URL).
- `src/app/portal/congdongai/page.tsx` — khối "Community News" (id
  `tin-tuc`): `NEWS.map()` → `updates.map()` (mảng `NEWS` đánh dấu
  `@deprecated` + eslint-disable, giữ tham khảo/rollback, không còn
  consumer). Khối "Kết nối ngay hôm nay": 3 href tĩnh
  (`siteConfig.community.facebookGroup/zaloGroup`,
  `siteConfig.links.youtube`) → `channels.map()` dùng `PLATFORM_ICON`
  (map `platform` string → icon Lucide: Facebook→Globe, YouTube→PlayCircle,
  TikTok→Music2, Zalo→MessageCircle, Telegram→Send — không có brand logo
  chính thức trong lucide-react, cùng tinh thần dùng icon gợi ý chung đã
  áp dụng từ trước cho Facebook/YouTube/Zalo).

## Việc 8 — Cộng đồng, Phần 2: Admin DataTable + group sidebar

**`news` (1 dòng) — mồ côi CÓ CHỦ ĐÍCH, không phải bỏ sót.** Đã xác nhận
qua grep toàn bộ `src/`: không có component/page nào import hay đọc bảng
này — không nuôi bất kỳ khối nào ở `/portal/congdongai` hay nơi khác
(khác `updates`, cũng "tin tức" nhưng thực sự nuôi khối "Community News").
Founder quyết định (Phần 1): bỏ qua hoàn toàn ở Việc 8 — không nối Portal,
không build Admin, không xoá bảng. Nếu sau này cần dùng, đây là việc
riêng cần thiết kế UI Portal trước (bảng hiện không có consumer nào).

**Đã làm — 3 trang Admin DataTable** (cùng `AdminAtmosphere
atmosphereClassName="campus-bg"`, đúng nền thật `/portal/congdongai`):

- `/admin/community` (`src/app/admin/(dashboard)/community/page.tsx`) —
  5 field: `platform`/`label`/`url`/`status` (select `Active`/`Inactive` —
  giữ đúng vocabulary riêng của bảng này, không đổi sang chuẩn
  Draft/Published/Hidden).
- `/admin/updates` (`.../updates/page.tsx`) — 9 field:
  `title`/`slug`/`type`/`author`/`publishedAt`(date)/`shortContent`/
  `content`/`featured`(boolean)/`status` (select chuẩn
  Draft/Published/Hidden).
- `/admin/student-success-stories` (`.../student-success-stories/page.tsx`)
  — 9 field: `studentName`/`title`/`result`/`shortDescription`/`content`/
  `toolsUsed`(tags)/`relatedResource`/`featured`(boolean)/`status` (select
  chuẩn). **KHÔNG nối hiển thị lên Portal** (xem lý do NO-FAKE-DATA ở mục
  Phần 1 trên) — trang này chỉ để Founder tự xoá 3 dòng bịa (Minh Anh/Quốc
  Huy/Thanh Trúc) + nhập câu chuyện thật khi có, có comment cảnh báo ngay
  đầu file.

**`nav.ts`** — thêm group `"Cộng đồng"` (Portal mục #10, sau `"Sứ mệnh
Companion"`, đúng nguyên tắc 1:1 đã chốt ở đợt audit menu), 3 item trên
(không có `news`). **`AdminSidebar.tsx`** — thêm 3 icon
(`Users`/`Newspaper`/`Star`) cho 3 route mới; đồng thời sửa chú thích cũ
(từng liệt kê `/admin/updates`/`/admin/community` là "route cũ đã xoá" —
giờ là route THẬT, cùng tình huống đã gặp với `/admin/projects`).

**Dashboard `/admin`** — cấu trúc group/item tự động ăn theo `nav.ts`
(không cần sửa gì thêm cho phần này, đã đúng từ Phần 2 đợt audit menu
trước). Số đếm quản lý qua 2 map tĩnh trong chính `dashboard/page.tsx`
(`TABLE_FOR_HREF`, `PORTAL_HREF_FOR_GROUP`) — cùng 1 lượt sửa nhỏ như mọi
group trước đó (Premium, Dự án & Cơ hội...) khi mới thêm: bổ sung
`"Cộng đồng": "/portal/congdongai"` + 3 dòng
`community/updates/student_success_stories` → tên bảng thật. Không viết
API/Server Action mới — dùng lại đúng cơ chế đếm generic sẵn có.

## THÍ ĐIỂM (pilot) — Inline editing tại `/portal/su-menh-companion`

**Trạng thái: đang thử nghiệm, CHƯA phải phong cách UI chính thức thứ 3**
(bên cạnh VisualEditor/DataTable) — chờ Founder đánh giá trước khi quyết
định có nhân rộng cho các module khác không. Không xoá 2 mục dưới đây nếu
Founder quyết định KHÔNG nhân rộng — tự dọn khi có quyết định cuối.

Route `/admin/su-menh-companion/live-edit` render lại ĐÚNG component gốc
`src/app/portal/su-menh-companion/page.tsx` (import thẳng, cách A — không
copy, không iframe), bọc thêm `EditModeProvider`
(`src/components/portal/su-menh-companion/EditModeContext.tsx`) để bật
affordance sửa tại chỗ. Ngoài edit mode (Portal thật
`/portal/su-menh-companion`), `EditableRegion`
(`src/components/portal/su-menh-companion/EditableRegion.tsx`) render
`<>{children}</>` — không thêm phần tử DOM nào, zero rủi ro layout.

Chỉ 2 vùng đại diện đã bọc (không làm hết cả trang):
- **Điều lệ** (`constitution`) — field string đơn (`content`), bọc cả
  `<div>` row (an toàn, không bị định vị tuyệt đối).
- **Bộ gene** (`genome`) — object 3 field (`key/label/meaning`), CHỈ bọc
  `<span>` label bên trong, KHÔNG bọc `<div>` cha có `style={pos}` (định vị
  % tuyệt đối cho vòng tròn DNA) — bọc cả div cha sẽ đổi ngữ cảnh
  positioning, có rủi ro vỡ layout vòng tròn.

Lưu ý kỹ thuật quan trọng: `EditableRegion` nhận `record`/`update` qua
props từ CHÍNH `useCollection()` instance của `page.tsx` (không tự gọi
`useCollection()` riêng bên trong) — tránh 2 instance không đồng bộ sau
khi Lưu (đúng lý do `DataTableRowPanel.tsx` có prop `mutators`).

Lưu gọi thẳng `update()` của `useCollection()` (tức `/api/admin/collections/[table]`
có sẵn) — không viết API mới.

**Không thay thế `/admin/su-menh-companion/*`** (6 trang VisualEditor +
1 trang flipbook từ Việc 6) — vẫn hoạt động song song, không đổi.

**Fix sau khi Founder test:** bút sửa ở Bộ gene lúc đầu chỉ hiện khi hover
đúng label 11px (dùng `group-hover/editable`) — thực tế label rất nhỏ, chen
giữa 12 gene quanh vòng tròn, dễ không thấy/không hover trúng. Đổi sang
hiện bút sửa LUÔN (không chờ hover) cho cả 2 vùng pilot — route này chỉ
admin dùng, ưu tiên chắc chắn thấy được hơn tinh tế thẩm mỹ.

## Hành trình của tôi — Việc 9: tách static chrome cho 5 cửa

5 cửa: My Story, Mirror, Nhật ký học tập, Bản đồ hành trình, Khu vườn của
bạn. **Nguyên tắc bất biến cho cả 5 cửa:** KHÔNG đụng dữ liệu động
(`reflections`/`memory_capsules` qua Supabase, `growth-view.ts`/
localStorage per-user) — chỉ tách phần chrome tĩnh (title/subtitle/
empty-state/footer/mảng câu hỏi cố định...), giữ nguyên 100% logic kỹ
thuật (enum map, index gắn bản đồ, template nội suy biến runtime).

### Cửa 1 — Mirror (đã xong, an toàn nhất, làm trước để định hình pattern)

Audit code thật (không đoán theo tên biến) phát hiện: `invitation` (dòng
mở của Companion, `buildCompanionMirrorInvitation(growthSignals)`) tưởng
như "subtitle" tĩnh nhưng thực ra là dữ liệu ĐỘNG thật — không tách, không
có trong 2 bảng mới. Mirror thực chất không có "subtitle" tĩnh nào để tách.

2 bảng mới (migration `supabase-phase10-mirror-chrome.sql`, đã áp dụng):
- `mirror_chrome` — 1 dòng (id='mirror'): `title`, `emptyStateLine1`,
  `emptyStateLine2`, `emptyStateCtaLabel`, `footer`. Thay các chuỗi
  hardcode trong `MirrorChamber.tsx` (h1 "Mirror", 2 dòng empty-state, CTA
  label, dòng chân trang).
- `mirror_questions` — 7 dòng, thay `MIRROR_QUESTIONS`
  (`src/lib/portal/growth-map/mirror-question.ts`, giữ lại `@deprecated`
  làm fallback khi bảng live rỗng). `todaysMirrorQuestion()` đổi sang nhận
  `questions: string[]` làm tham số (mặc định `MIRROR_QUESTIONS` nếu không
  truyền — không breaking cho call site khác nếu có sau này), giữ nguyên
  100% logic xoay vòng theo ngày (`dayIndex % pool.length`).

`src/lib/portal/live-mirror.ts` (mới, cùng pattern `live-tools.ts`) —
`getLiveMirrorChrome()`/`getLiveMirrorQuestions()`, dùng
`getSupabasePublic()`. `MirrorChamber.tsx` nhận thêm prop `chrome`
(type `MirrorChrome`, export ra để `live-mirror.ts` dùng chung type) và
`questions: string[]` — fetch 1 lần ở `page.tsx` (Server Component, cùng
`Promise.all` với `getMirrorData()` hiện có), truyền props xuống, không
tự fetch trong Client Component.

Admin: `/admin/hanh-trinh-cua-toi/mirror-chrome` (1 dòng) +
`/admin/hanh-trinh-cua-toi/mirror-questions` (7 dòng), `VisualEditor`,
nhóm sidebar mới "Hành trình của tôi", atmosphere `mirror-chamber-bg`
(đúng class thật `MirrorChamber.tsx` dùng).

### Cửa 2 — Nhật ký học tập (đã xong)

Audit code thật phát hiện 3 chỗ KHÔNG được tách (giữ nguyên trong code):
- `MODULE_LABEL` (`LearningJournalNotebook.tsx`) — enum map
  `PortalModule → label`, key là union đóng, không phải prose tĩnh rời
  rạc. (Ghi chú thêm: trùng `MODULE_LABELS` ở
  `src/companion/agents/module-agent-map.ts` — dedupe là việc khác, ngoài
  phạm vi Việc 9.)
- `TODAY_PRIORITY` — mảng `{type: GrowthEventType, sentence}` theo đúng
  THỨ TỰ ưu tiên gắn với enum `GrowthEventType`; tách riêng `sentence` ra
  CMS trong khi `type`/thứ tự vẫn ở code có rủi ro desync ưu tiên khỏi
  câu chữ — giữ nguyên cả mảng trong code (cùng tinh thần với `invitation`
  ở Cửa 1).
- Dòng "`{totalRawOutputs} kết quả thật trong Workspace...`" — template
  nội suy biến runtime thật (`totalRawOutputs`), không phải chuỗi tĩnh.

Bảng mới (migration `supabase-phase11-journal-chrome.sql`, đã áp dụng):
- `journal_chrome` — 1 dòng (id='journal'): `eyebrowLabel`, `title`,
  `emptyStateLine`, `emptyStateCtaLabel`, `todaySectionLabel`,
  `todayFallbackLine`, `entriesSectionLabel`, `highlightsSectionLabel`,
  `createdSectionLabel`, `createdEmptyLine`, `lessonsSectionLabel`,
  `continueCtaLabel`, `footer`. Thay các chuỗi hardcode trong
  `LearningJournalNotebook.tsx` (eyebrow, h1, empty-state, 5 nhãn mục,
  CTA cuối trang, chân trang). CTA href (`/portal/hocvienai`,
  `/portal/workspace`) giữ nguyên trong code, CMS chỉ quản nhãn — đúng
  quyết định đã áp dụng ở Mirror.
- `journal_intentions` — 5 dòng, thay `JOURNAL_INTENTIONS`
  (`src/lib/portal/growth-map/journal-intention.ts`, giữ `@deprecated`
  làm fallback). `todaysJournalIntention()` đổi sang nhận
  `intentions: string[]` làm tham số (mặc định `JOURNAL_INTENTIONS`),
  giữ nguyên 100% logic xoay vòng theo ngày.

`src/lib/portal/live-journal.ts` (mới, cùng pattern `live-mirror.ts`) —
`getLiveJournalChrome()`/`getLiveJournalIntentions()`.
`LearningJournalNotebook.tsx` nhận thêm prop `chrome` (type
`JournalChrome`, export ra để `live-journal.ts` dùng chung) và
`intentions: string[]` — fetch 1 lần ở `page.tsx`
(`/portal/nhatkyhoctap`, `Promise.all` cùng `getJournalReflections()`).

Admin: `/admin/hanh-trinh-cua-toi/journal-chrome` (1 dòng) +
`/admin/hanh-trinh-cua-toi/journal-intentions` (5 dòng), `VisualEditor`,
cùng nhóm sidebar "Hành trình của tôi", atmosphere `journal-notebook-bg`
(đúng class thật `LearningJournalNotebook.tsx` dùng).

### Cửa 3 — My Story (đã xong)

Founder xác nhận mở rộng phạm vi (thay vì chỉ title/subtitle/2 dòng
empty-state như brief gốc) — tách **toàn bộ** chrome tĩnh, đồng bộ cách
làm với Mirror/Nhật ký học tập (30 field, 1 bảng, 1 dòng).

Audit code thật phát hiện KHÔNG tách (giữ nguyên trong code):
- `JOURNEY_CHAPTER_NAMES` (`journey-chapter.ts`) — **5 tên** (không phải 6
  như brief gốc ước lượng — đối chiếu code thật, không đoán). Dùng CHUNG 3
  cửa (Journey Hub/My Story/Bản đồ hành trình), index gắn với câu bằng
  chứng động (evidence sentence nội suy số liệu thật) — cùng lý do với
  `invitation`/`TODAY_PRIORITY` ở 2 cửa trước.
- `KIND_LABEL` (`MyStoryBook.tsx`) — enum map `MemoryCapsuleKind` (14 giá
  trị đóng, từ cột `memory_capsules.kind` thật) → label.
- `companionLine`/`understandingNote`/`growthPattern`/`qualities`/
  `buildLetter(monthlyStats)`/`importantMoments`/milestones/`createdWorks`
  — toàn bộ dữ liệu động thật từ reflections/capsules/growth-view.ts.
- "Lá thư tháng `{monthLabel}`" — chỉ tiền tố "Lá thư tháng" là chrome
  tĩnh (`monthlyLetterLabel`), `{monthLabel}` (tên tháng) vẫn nội suy động
  trong code.

Bảng mới (migration `supabase-phase12-story-chrome.sql`, đã áp dụng):
`story_chrome` — 1 dòng (id='story'), 30 field: title/subtitle/2 dòng
empty-state, 8 nhãn mục (thư tháng/khoảnh khắc/bước ngoặt/bài học/tác
phẩm/rỗng-tác-phẩm/tự gìn giữ/lưu trữ chưa sẵn sàng/viết trang mới), 2
dòng+2 CTA phần "Chương tiếp theo", và toàn bộ chuỗi trong 2
sub-component `WriteNook` (7 field: dòng chưa sẵn sàng/cảm ơn/placeholder
suy ngẫm/CTA lưu/lời mời khoảnh khắc/placeholder khoảnh khắc/CTA lưu+đã
lưu/dòng chưa có suy ngẫm) và `RemovableEntry` (4 field: nhãn gỡ/xác
nhận/CTA xoá/CTA giữ lại) — cả 2 sub-component giờ nhận `chrome` qua prop
(trước đó là component thuần không biết chrome).

`src/lib/portal/live-story.ts` (mới, cùng pattern `live-mirror.ts`/
`live-journal.ts`) — `getLiveStoryChrome()`.

Admin: `/admin/hanh-trinh-cua-toi/story-chrome` (1 dòng, 30 field),
`VisualEditor`, cùng nhóm sidebar "Hành trình của tôi", atmosphere
`story-book-bg` (đúng class thật `MyStoryBook.tsx` dùng).

### Cửa 4 — Bản đồ hành trình (đã xong, RỦI RO CAO NHẤT đã audit kỹ trước khi sửa)

Audit code thật xác nhận đúng 2 rủi ro Founder đã cảnh báo trước — **KHÔNG
tách, giữ nguyên 100% trong code:**
- `CHAPTER_DESTINATIONS` (`JourneyMapAtlas.tsx`) — mảng `{href, label}`,
  **KHÔNG có key/id nào cả**, gắn với chương chỉ bằng **vị trí index**
  (`CHAPTER_DESTINATIONS[i]` khớp `JOURNEY_CHAPTER_NAMES[i]`, `i` = 0-4).
  Nếu đưa vào bảng CMS generic (VisualEditor cho kéo-thả/xoá như mọi
  collection khác) — kéo-thả sẽ lặng lẽ gán sai chương↔đích (không lỗi,
  chỉ sai); xoá 1 dòng sẽ **crash trang** vì
  `CHAPTER_DESTINATIONS[i].href` không có bounds check, ra
  `undefined.href`.
- `PORTAL_CONNECTIONS` — field `module` (không phải `label`) là **key
  tra cứu thật** vào `getModuleActivitySummary(c.module)`
  (`growth-view.ts`, so khớp `===` với `WorkspaceSession.context.module`
  thật). Nếu để `module` là ô nhập tự do chung dòng với `label` trong
  CMS — Founder gõ nhầm sẽ KHÔNG crash, chỉ âm thầm báo "Chưa chạm tới"
  vĩnh viễn dù người dùng có hoạt động thật — nguy hiểm hơn crash vì
  không ai biết đã sai.

Cả 2 cấu trúc chỉ dùng nội bộ trong đúng 1 file (`JourneyMapAtlas.tsx`),
grep toàn bộ `src/` xác nhận không nơi nào khác import.

**Chỉ tách phần chữ hiển thị an toàn** (không phải key, không index-bound)
— bảng mới `map_chrome` (migration `supabase-phase13-map-chrome.sql`, đã
áp dụng), 1 dòng (id='map'), 12 field: title, subtitle, dòng+CTA trạng
thái trống, nhãn "Vị trí hiện tại", dòng "chưa có chương", nhãn "Năm
chương cuộc đời", chú thích 3 trạng thái, nhãn "Kết nối tới Portal", nhãn
"Premium" (khối hardcode RIÊNG ở cuối, không thuộc `PORTAL_CONNECTIONS`),
nhãn "Hướng tiếp theo", lời khép Companion.

Giữ nguyên trong code (ngoài 2 cấu trúc trên): `JOURNEY_CHAPTER_NAMES`
(dùng chung 3 cửa, đã loại trừ từ Cửa 3), `currentChapter.name/evidence`,
`connections[].count` + "Đã chạm tới/Chưa chạm tới", "Đang đồng hành/Chưa
tham gia" (đếm `premiumCount` thật), `nextDirection.text` (3 biến thể
theo `reflections.length`/`hasAnyJourney`) — toàn bộ dữ liệu/template
động thật.

`src/lib/portal/live-map.ts` (mới, cùng pattern 3 cửa trước) —
`getLiveMapChrome()`. Admin: `/admin/hanh-trinh-cua-toi/map-chrome`,
`VisualEditor`, atmosphere `map-parchment-bg`.

**Ghi chú cho tương lai (không làm ở việc này):** nếu Founder sau này
muốn `CHAPTER_DESTINATIONS`/`PORTAL_CONNECTIONS` sửa được qua Admin, đây
là quyết định thiết kế riêng, lớn hơn — cần 1 editor CỐ ĐỊNH 5 dòng
(không kéo-thả/xoá được, index lưu tường minh chứ không suy ra từ thứ tự
dòng) cho `CHAPTER_DESTINATIONS`, và field `module` hiển thị CHỈ ĐỌC
(giống `flipbook.src` ở Sứ mệnh Companion) cho `PORTAL_CONNECTIONS` —
không phải pattern VisualEditor generic mặc định.

### Cửa 5 — Khu vườn của bạn (đã xong — HOÀN TẤT CẢ 5 CỬA VIỆC 9)

Audit kỹ trước khi sửa (đúng như Cửa 4) phát hiện ranh giới KHÔNG rõ như
brief gốc dự kiến — đã STOP, báo phát hiện cụ thể, chờ Founder xác nhận
trước khi build (không tự quyết định):

- **2 "empty-state" thực ra là 2 dòng độc lập, mỗi dòng gated bởi 1 điều
  kiện dữ liệu thật KHÁC NHAU** (không phải 1 cặp như brief giả định):
  dòng "Khu vườn mọc từ việc học thật..." chỉ hiện khi
  `treeStage(summary) === null` (`gardenEmpty`); dòng "Viên ngọc vẫn đang
  chờ..." chỉ hiện khi `moments.length === 0` (mảng gộp reflections/
  capsules/milestones/output thật) — điều kiện khác hẳn. Founder xác nhận
  **tách cả 2** thành field riêng (`emptyStateNoTree`/
  `emptyStateNoMoments`), giữ nguyên 2 điều kiện gate trong code — đúng
  pattern an toàn đã dùng ở 4 cửa trước (1 chuỗi cố định + gate ở code).
- **"2 CTA" thực ra là 1 `<Link>` DUY NHẤT, nhãn VÀ href cùng đổi theo
  `gardenEmpty`** (dẫn xuất từ `treeStage`): `{gardenEmpty ? "Gieo hạt
  mầm đầu tiên" : "Tưới cho khu vườn hôm nay"}`, href cũng đổi cặp
  `/portal/hocvienai` ↔ `/portal/workspace`. Founder xác nhận **GIỮ
  NGUYÊN 100% TRONG CODE, không tách bất kỳ phần nào** — nhất quán với
  quyết định đã áp dụng cho `nextDirection.text` ở Cửa 4: tránh rủi ro
  Admin sửa 1 nửa cặp nhãn+href mà không hiểu nó gắn liền với nửa kia
  (sửa lệch → nhãn nói "Gieo hạt mầm" nhưng href lại trỏ `/portal/workspace`).

Cũng KHÔNG đụng (không có gì mơ hồ, đúng như brief gốc):
`companionLineFor()` (8 biến thể, nội suy `${act}` = hoạt động gần nhất
thật + gate theo `period` — giờ thiết bị), `treeStage()`/`stage.name`/
`stage.line` (ngưỡng số liệu thật: `missionsCompleted`/`journeysTouched`/
`competenciesPracticed`/`totalOutputs`), `buildElements()` (mảng phần tử
vườn, mỗi `meaning` nội suy đếm số thật, `name`/`emoji` gắn liền logic
chọn — cùng lý do `TODAY_PRIORITY`/`CHAPTER_DESTINATIONS`).

Bảng mới (migration `supabase-phase14-garden-chrome.sql`, đã áp dụng):
`garden_chrome` — 1 dòng (id='garden'), 5 field: `title`, `subtitle`,
`footer`, `emptyStateNoTree`, `emptyStateNoMoments`.

`src/lib/portal/live-garden.ts` (mới, cùng pattern 4 cửa trước) —
`getLiveGardenChrome()`. `GardenExperience.tsx` nhận thêm prop `chrome`
(type `GardenChrome`, export ra để `live-garden.ts` dùng chung).

**Atmosphere khác 4 cửa trước:** Garden KHÔNG có 1 class
`*-atmosphere-bg` đơn giản — nền thật là hệ nhiều lớp `garden-sky` x4 +
attribute `data-garden-period` (xem `GardenExperience.tsx` dòng 283-303).
Trang Admin (`/admin/hanh-trinh-cua-toi/garden-chrome`) dùng prop
`atmosphere` (ReactNode) của `AdminAtmosphere` — component nhỏ
`GardenAdminAtmosphere` cố định `data-garden-period="sunset"` bọc 4 lớp
`garden-sky` thật (không bịa 1 class mới, không cần chu kỳ ngày/đêm thật
ở Admin).

---

**VIỆC 9 HOÀN TẤT CẢ 5 CỬA** (Mirror → Nhật ký học tập → My Story → Bản
đồ hành trình → Khu vườn của bạn). Tổng kết:

| Cửa | Bảng | Số field | Route Admin | Không tách (lý do) |
|---|---|---|---|---|
| Mirror | `mirror_chrome` + `mirror_questions` | 5 + 7 câu | `/admin/hanh-trinh-cua-toi/mirror-chrome`, `mirror-questions` | `invitation` — dữ liệu động thật |
| Nhật ký học tập | `journal_chrome` + `journal_intentions` | 13 + 5 câu | `journal-chrome`, `journal-intentions` | `MODULE_LABEL`/`TODAY_PRIORITY` (enum map/thứ tự ưu tiên) |
| My Story | `story_chrome` | 30 | `story-chrome` | `JOURNEY_CHAPTER_NAMES` (5, dùng chung 3 cửa)/`KIND_LABEL` (enum map) |
| Bản đồ hành trình | `map_chrome` | 12 | `map-chrome` | `CHAPTER_DESTINATIONS` (không key, index-bound)/`PORTAL_CONNECTIONS` (`module` là key tra cứu thật) |
| Khu vườn của bạn | `garden_chrome` | 5 | `garden-chrome` | `companionLine`/`treeStage`/`buildElements` (template nội suy runtime); cặp CTA (nhãn+href gắn liền 1 điều kiện) |

Nguyên tắc bất biến xuyên suốt cả 5 cửa: KHÔNG đụng dữ liệu động thật
(Supabase reflections/memory_capsules, localStorage growth-view.ts) và
KHÔNG đụng bất kỳ cấu trúc nào gắn index/key/enum/điều kiện thật với văn
bản — chỉ tách phần chữ hiển thị thuần tuý, cố định, không nội suy biến,
không index-bound. 2 cửa cuối (Bản đồ hành trình, Khu vườn) đều phát
hiện ranh giới không rõ như brief gốc dự kiến — cả 2 lần đều STOP báo cụ
thể trước khi build, không tự quyết định.

## Course Builder (Premium) — Bước 1: Audit (bắt buộc trước khi build)

**Schema `courses` hiện tại** (xác nhận qua `information_schema.columns`, đã
sửa giá/status ở Việc 1/2, xem mục "Premium" ở trên): đúng 6 cột — `id
(text)`, `name`, `status`, `description`, `updated_at`, `price` — đúng 5
dòng (`ai-coban`, `ai-nangcao`, `openclaw`, `solo`, `scale`). **Lưu ý phát
hiện thêm (không sửa, ngoài phạm vi):** `src/app/portal/premium/page.tsx`'s
`type CourseRow = { id: number; ... }` khai sai kiểu (`id` thật là `text`,
`course-pricing/actions.ts` đã dùng đúng `id: string`) — không crash vì
Supabase client không ép kiểu chặt, nhưng là nợ kỹ thuật có sẵn từ trước
Course Builder, không phải lỗi do việc này gây ra.

**`/portal/premium`/`/portal/vdai-academy` — CHƯA có trang xem nội dung
khoá học nào.** Cả 2 route chỉ có đúng 1 `page.tsx` (không có route con/
`[slug]` nào) — `/portal/premium` là landing/mua (CTA thanh toán theo
`courses.status='open'`), `/portal/vdai-academy` đọc bảng **`lessons`**
(hoàn toàn khác — id bigint/title/video_url/pdf_url/price, "buổi học thật"
độc lập, KHÔNG phải nội dung của 5 khoá Premium). → Bước 4 (trang xem
lesson cho học viên) là phần bắt buộc phải build mới, không phải nối vào
trang có sẵn.

**Cơ chế xác thực đã mua:** `src/lib/access.ts`'s `getPurchasedIds(column)`
— đọc bảng `orders` (`member_email`, `status='confirmed'`, cột
`course_id`/`lesson_id`/`product_id` tuỳ loại), so khớp qua email của user
đang đăng nhập (`supabase.auth.getUser()`). Không dùng `members.is_admin`
(đó là quyền Admin, khác quyền "đã mua"). Middleware đã gate `/portal/*`
yêu cầu đăng nhập; việc "đã mua khoá X chưa" là truy vấn riêng qua
`getPurchasedIds("course_id")`, dùng lại y hệt ở `/portal/premium` — Bước 4
tái sử dụng đúng hàm này để khoá/mở nội dung lesson.

### Phát hiện ngoài dự kiến — đã STOP hỏi Founder trước khi tạo bảng mới

Bảng `course_modules` (0 dòng) và `course_lessons` (0 dòng) **đã tồn tại sẵn
trong Supabase trước khi việc này bắt đầu** — đúng cấu trúc Section→Lesson
(`course_modules.course_id` FK `courses`, `course_lessons.module_id` FK
`course_modules`, `ON DELETE CASCADE` cả 2) nhưng: (1) thiếu
`content`/`duration_minutes`/`is_free_preview` đề bài yêu cầu; (2) dùng
`visible` (boolean) thay vì `status` (text) như convention chung của dự án;
(3) có 7 field thừa không nằm trong đặc tả (`pdf_url`/`document_url`/
`download_url`/`prompt_ref`/`template_ref`/`exercise_note`/`bonus_note`);
(4) **0 RLS policy** dù RLS đã bật (không ai đọc được, kể cả Published);
(5) **không có trong lịch sử `list_migrations`** — không rõ ai/khi nào tạo;
(6) **0 kết quả grep** toàn bộ `src/` — chưa từng có code nào tham chiếu.
Tên `course_lessons` trùng thẳng tên bảng đề bài yêu cầu tạo mới, không thể
tạo trùng — đây là điểm buộc phải dừng hỏi trước khi làm Bước 2.

**Quyết định Founder:** tái sử dụng (không xoá công sức đã có), điều chỉnh
cho khớp convention + đủ field, từ nay track qua migration:

- `course_modules` → **`course_sections`** (đổi tên bảng).
- `course_lessons.module_id` → **`section_id`** (đổi tên cột, khớp bảng mới).
- `visible` (boolean) → **`status`** (text, default `'Draft'`) ở **cả 2
  bảng** — `course_sections` trước đó chỉ có `visible` (đã đổi hẳn sang
  `status`); `course_lessons` hoá ra ĐÃ SẴN CÓ cột `status` từ trước (dư
  thừa cùng `visible`) — chỉnh này chỉ cần xoá cột `visible` dư, giữ
  nguyên `status` có sẵn.
- Bổ sung 3 cột còn thiếu vào `course_lessons`: `content` (text, nullable —
  nội dung markdown), `duration_minutes` (integer, default 0),
  `is_free_preview` (boolean, default false).
- **Giữ nguyên** 7 field thừa (không xoá, có thể dùng cho tài liệu đính kèm
  lesson sau này) — **KHÔNG dùng trong Course Builder UI lần này** (ngoài
  phạm vi).
- **Giữ nguyên** tên cột `sort_order` (không đổi thành `order` dù đề bài
  gốc gợi ý tên này) — Founder chỉ yêu cầu đổi 3 điểm trên, không yêu cầu
  đổi tên cột thứ tự.
- Thêm RLS **`"public read published" ... FOR SELECT USING (status =
  'Published')`** cho cả 2 bảng — mirror ĐÚNG pattern `projects`/
  `best_practices` đang dùng (không tự nghĩ pattern mới). Gate theo
  purchase (`owned`/`is_free_preview`) là việc ở tầng Portal Server
  Component (Bước 4), không phải RLS — cùng cách `courses`/`case_studies`
  đang xử lý (đọc rộng ở DB, ẩn/hiện nội dung ở tầng UI).

Migration đã apply trực tiếp qua Supabase MCP + file track lại trong repo:
`supabase-phase17-course-builder-baseline.sql`.

**Schema cuối cùng sau baseline:**

`course_sections`: `id (bigint)`, `course_id (text, FK courses.id cascade)`,
`title (text)`, `sort_order (int, default 0)`, `status (text, default
'Draft')`, `created_at`, `updated_at`.

`course_lessons`: `id (bigint)`, `section_id (bigint, FK course_sections.id
cascade)`, `title (text)`, `video_url`, `pdf_url`, `document_url`,
`download_url`, `prompt_ref`, `template_ref`, `exercise_note`,
`bonus_note` (7 field thừa, giữ nguyên không dùng), `sort_order (int)`,
`status (text, default 'Draft')`, `content (text, nullable)`,
`duration_minutes (int, default 0)`, `is_free_preview (bool, default
false)`, `created_at`, `updated_at`.

## Đã xoá `/portal/vdai-academy` (theo yêu cầu Founder, không liên quan Course Builder)

Founder yêu cầu xoá hẳn route này — portal cũ, không audit trước, xoá luôn
(tách biệt hoàn toàn khỏi Course Builder Premium đang làm dở ở mục trên).

**Đã xoá:** `src/app/portal/vdai-academy/page.tsx` (toàn bộ route). Đã kiểm
tra `nav.ts`/`AdminSidebar.tsx`/`src/lib/portal/hubs.ts` (menu Portal
chính) — **không có entry nào** trỏ route này (route này chưa từng nằm
trong menu chính thức, chỉ được link rải rác từ vài nơi — xem "Chưa xử lý"
bên dưới).

**Bảng `lessons`** (Supabase) — **GIỮ NGUYÊN**, không xoá dữ liệu/bảng
thật. Bảng này giờ **mồ côi có chủ đích** (không còn route Portal nào đọc)
— xoá hẳn bảng (nếu Founder muốn) là quyết định riêng, sau này, ngoài
phạm vi việc này.

**Dọn dẹp trực tiếp do xoá route (không phải scope creep — hệ quả bắt
buộc của việc xoá):**
- `src/app/admin/(dashboard)/course-pricing/actions.ts` — xoá 2 dòng
  `revalidatePath("/portal/vdai-academy")` (route không còn tồn tại,
  gọi revalidate 1 path chết là dead code).
- `src/lib/admin/supabaseCollections.ts` — cập nhật lại comment lịch sử
  (dòng ~88-92, giải thích vì sao bảng CKOS đặt tên `knowledge_seeds` thay
  vì `lessons`) cho khớp thực tế mới: bảng `lessons` giờ mồ côi, không còn
  route nào đọc.

**Đã sửa 1 chỗ (bắt buộc — test tự động chặn):** `src/app/portal/account/page.tsx`
có `<a href="/portal/vdai-academy">Xem khoá học →</a>` ở empty-state "Sản
phẩm đã mua" — bị `src/__tests__/route-integrity.test.ts` (kiểm tra mọi
`href="..."` literal phải trỏ route thật/redirect đã biết) bắt fail ngay
khi chạy vitest. Đổi sang `/portal/premium` (trang khoá học thật) — đúng
route, đúng ý nghĩa CTA, không phải thêm redirect (Founder muốn 404 thật,
không muốn redirect).

**Đã sửa nốt 4 chỗ còn lại (Founder yêu cầu riêng, sau khi báo cáo lần
trước)** — dạng `href: "..."`/`link: "..."`/`ctaHref: "..."` trong object
dữ liệu (KHÔNG bị `route-integrity.test.ts` bắt vì không phải JSX literal
`href="..."`, nhưng vẫn là link chết thật khi bấm) — đổi cả 4 sang
`/portal/premium`, cùng đích với `account/page.tsx` ở trên:
- `src/components/portal/RoadmapInteractive.tsx` (2 bước lộ trình: "Học
  viện Affiliate", "V-SCALE").
- `src/data/admin/portalBuilder.ts` (1 entry — công cụ Portal Builder cũ).
- `src/data/blog.ts` (4 bài viết, field `ctaHref`).
- `src/data/portal/ai-workspace.ts` (`LEARNING_PATHS` level 5, "AI cho
  kinh doanh / đội nhóm") — **sót ở báo cáo lần trước**: có trong grep gốc
  nhưng bị bỏ sót khỏi danh sách 3 file báo cáo, chỉ phát hiện lại khi
  re-grep để verify ở lần này — đúng lý do phải chạy lại grep xác nhận
  thay vì tin vào danh sách đã liệt kê trước đó.

Đã re-run `route-integrity.test.ts` + toàn bộ vitest sau khi sửa, và grep
thủ công `"vdai-academy"` toàn bộ `src/` (không giới hạn theo test, vì test
chỉ bắt JSX `href="..."`) để xác nhận 0 kết quả còn lại — kể cả dạng
object-literal test không bắt được.

## Course Builder (Premium) — Bước 2: kết nối tầng dữ liệu

**Không đăng ký `course_sections`/`course_lessons` vào `SUPABASE_COLLECTIONS`
— đọc code `/api/admin/collections/[table]/route.ts` xác nhận route này
KHÔNG dùng được cho 2 bảng này, không chỉ ở phần cây lồng 2 cấp mà ở CẢ
CRUD CƠ BẢN:**
- GET hard-code `select("id, data, status, order")` + `.order("order", ...)`
  — 2 bảng này không có cột `data` (jsonb) hay `order` (có `sort_order`,
  không phải `order`).
- POST/PUT hard-code `upsert({ id: item.id, data: item, status, order })`
  — cũng dùng cột `data`/`order` không tồn tại; đồng thời route giả định
  `id` là **string do client tự đặt** (check `typeof item.id !== "string"`),
  trong khi `course_sections.id`/`course_lessons.id` là **bigint tự tăng**
  do Postgres cấp — không client nào tự đặt được.
- `SUPABASE_COLLECTIONS`'s comment đầu file tự mô tả đây là "the security
  boundary for the generic route" cho đúng 1 schema (`id/data/status/
  order`) — đăng ký 1 bảng lệch schema vào đây sẽ tạo endpoint gọi là
  chạy nhưng vỡ ngay khi query (lỗi "column does not exist"), không phải
  chỉ thiếu tính năng.

→ Đúng con đường đã áp dụng cho `courses`/`case_studies` (2 bảng typed
khác trong dự án): viết Server Actions riêng, không qua route chung.

**Đã tạo:** `src/app/admin/(dashboard)/premium/courses/[courseId]/builder/actions.ts`
(chỉ tầng dữ liệu — Server Actions, `"use server"` — **CHƯA có `page.tsx`**,
đúng yêu cầu chưa build UI ở bước này; thư mục vẫn build được bình thường,
không tạo route nào cho tới khi có `page.tsx`). Các hàm:

- `getCourseBuilderTree(courseId)` — đọc `course_sections` (`eq
  course_id`, `order sort_order`) rồi `course_lessons` (`in section_id`,
  `order sort_order`), gộp lại thành cây `{ sections: [{ ...section,
  lessons: [...] }] }` trong 1 lần gọi.
- `createSection`/`updateSection`/`deleteSection` — `sort_order` mới =
  đếm số dòng hiện có của khoá đó; xoá section KHÔNG cần tự xoá lesson
  con (`ON DELETE CASCADE` đã có sẵn từ Bước 1).
- `createLesson`/`updateLesson`/`deleteLesson` — cùng logic, phạm vi field
  đúng 6 cột Course Builder cần (`title/video_url/content/
  duration_minutes/is_free_preview/status`), KHÔNG động tới 7 field thừa
  (`pdf_url`...).
- `reorderCourseTree(courseId, sections: {id, lessonIds[]}[])` — nhận
  nguyên trạng thái cây mong muốn sau khi kéo-thả (thứ tự section + với
  mỗi section, thứ tự + danh sách lesson thuộc về nó), ghi lại toàn bộ
  `sort_order` (cả 2 cấp) và `section_id` (khi lesson đổi section) trong 1
  lần gọi — xử lý luôn cả 3 tình huống kéo-thả (đổi thứ tự section, đổi
  thứ tự lesson trong section, kéo lesson sang section khác) bằng 1 hàm.

Mọi hàm ghi đều `requireAdmin()` gate + `revalidatePath()` route builder
tương ứng (route Bước 3 chưa tồn tại nhưng `revalidatePath` không lỗi khi
gọi trên path chưa từng render — vô hại, sẽ có tác dụng khi Bước 3 xong).

**Verify đã chạy:**
- `npx tsc --noEmit`, `npx eslint`, `npm run build` — sạch, thư mục
  `builder/` (chỉ có `actions.ts`, chưa có `page.tsx`) build được bình
  thường, không tạo route lạ.
- `npx vitest run` — 139/139 pass.
- **Test trực tiếp qua `execute_sql`** (mirror chính xác từng câu lệnh
  trong `actions.ts`, vì Server Actions dùng `revalidatePath()` — hàm này
  cần ngữ cảnh request thật của Next.js, không gọi standalone ngoài
  server được) trên khoá `ai-coban` thật: tạo 1 section + 2 lesson (đúng
  shape `createSection`/`createLesson` insert) → đọc lại đúng thứ tự
  `sort_order` (đúng shape `getCourseBuilderTree` select) → đổi thứ tự 2
  lesson (đúng shape `reorderCourseTree` update) → xác nhận thứ tự đảo
  đúng → xoá section (đúng shape `deleteSection`) → xác nhận cascade tự
  xoá cả 2 lesson con (0 dòng còn lại). Đã dọn sạch dữ liệu test này sau
  khi xác nhận — `ai-coban` hiện lại 0 section/lesson, sẵn sàng cho Bước
  3 test từ đầu.

## Course Builder (Premium) — Bước 3: Admin UI

UI riêng (không phải VisualEditor/DataTable — quan hệ lồng 2 cấp
Section→Lesson không khớp 2 pattern generic đó), dùng đúng 8 Server
Actions đã có ở Bước 2 (`./actions.ts`), không viết thêm tầng dữ liệu.

**File mới** (cùng thư mục route `/admin/premium/courses/[courseId]/builder/`
đã tạo actions.ts ở Bước 2):
- `page.tsx` (Server Component) — `requireAdmin()` gate riêng (2 lớp
  phòng hộ, cùng nguyên tắc `DataTable.tsx`), fetch song song
  `listCoursePricing()` (lấy tên khoá hiển thị, tái dùng Server Action có
  sẵn — không viết hàm mới) + `getCourseBuilderTree(courseId)`, render
  `<CourseBuilderClient>`.
- `CourseBuilderClient.tsx` ("use client") — cây Section→Lesson cột trái +
  kéo-thả HTML5 native (`draggable`/`onDragStart`/`onDragOver`/`onDrop`,
  cùng kỹ thuật `VisualEditor.tsx` đã dùng, không thêm thư viện DnD mới).
  Khác `VisualEditor` ở chỗ cần 2 cấp lồng nhau — xử lý bằng 1 hàm chung
  `computeLessonMove()` + `commitTree()` gọi `reorderCourseTree()`:
  - Kéo section (chỉ phần header draggable) thả vào section khác → đổi
    thứ tự section.
  - Kéo lesson thả vào lesson khác (cùng hoặc khác section) → chèn đúng vị
    trí, đổi `section_id` nếu khác section.
  - Kéo lesson thả vào vùng trống của 1 section (kể cả section rỗng) →
    nối vào cuối section đó.
  - Mỗi tầng đều `e.stopPropagation()` ở `onDrop` để tránh 1 lần thả bị 2-3
    handler xử lý chồng (lesson row → lesson-list container → section
    wrapper).
  - Cập nhật local state ngay (optimistic) trước khi gọi Server Action, để
    kéo-thả mượt; nếu action lỗi thì gọi lại `getCourseBuilderTree()` để
    đồng bộ lại đúng trạng thái server (không dùng `router.refresh()` —
    gọi thẳng `getCourseBuilderTree()` như 1 Server Action bình thường vì
    nó cũng export từ file `"use server"`, không cần refetch qua props).
  - Xoá Section: `window.confirm` (cùng pattern `VisualEditor.handleDelete`)
    với cảnh báo rõ số lesson bên trong nếu > 0 ("Sẽ xoá cả X bài học bên
    trong") — cascade tự động đã có từ Bước 1, không cần xoá tay lesson
    trước.
  - Tiêu đề Section sửa trực tiếp (input inline trong header, `onBlur` mới
    gọi `updateSection`) — cột phải CHỈ dành cho form Lesson theo đúng yêu
    cầu, không có 1 "form Section" riêng.
- `LessonEditorPanel.tsx` ("use client") — form cột phải, tái dùng
  `FieldInput` (đã tách khỏi `DataTableRowPanel` từ trước cho đúng mục
  đích dùng chung) cho 6 field (`title/video_url/content/
  duration_minutes/is_free_preview/status`) — không viết lại switch JSX
  theo `FieldType` lần 2. Chưa chọn Lesson nào → empty state rõ ràng, không
  lỗi (đặt SAU mọi hook, tuân thủ Rules of Hooks).

**Nối vào `/admin/course-pricing`:** `CourseRow.tsx` thêm nút "Quản lý nội
dung" (Link) cạnh nút Lưu, dẫn đúng `/admin/premium/courses/${course.id}/builder`.

**`nav.ts`:** KHÔNG thêm href mới — chỉ thêm comment giải thích trong group
"Premium" đã có: route builder có `[courseId]` động, vào qua nút "Quản lý
nội dung" ở `/admin/course-pricing` (entry `nav.ts` đã có sẵn), không liệt
kê 5 khoá riêng trong sidebar. Vì không có href mới, Dashboard `/admin`
không cần sửa gì thêm (đã tự hiện đúng entry "Giá khoá học Premium" từ
trước).

**Verify đã chạy:** `tsc`/`eslint`/`npm run build` sạch (route
`/admin/premium/courses/[courseId]/builder` xuất hiện đúng trong build
output), `vitest run` 139/139 pass.

**Giới hạn thật của sandbox này (không phải bỏ qua — capability gap thật):**
đã thử dựng `next dev` cục bộ + xác nhận middleware redirect đúng
(`/admin/premium/courses/ai-coban/builder` và `/admin/course-pricing` đều
307 → `/admin/login` khi chưa đăng nhập, không crash) — nhưng **không thể
test tương tác thật** (tạo Section/Lesson, kéo-thả, sửa, xoá qua UI) vì
sandbox không có `SUPABASE_SERVICE_ROLE_KEY` thật (chỉ `.env.example` có
sẵn anon key public, không có service role key hay tài khoản Admin thật
nào để đăng nhập) — đây là giới hạn quyền truy cập thật của môi trường
sandbox, không phải lựa chọn bỏ qua bước test. Founder cần tự làm phần
"tạo thử qua UI thật" trên Preview URL — xem checklist trong báo cáo.

## Course Builder (Premium) — Bước 4: trang xem nội dung cho học viên

Route MỚI HOÀN TOÀN (Bước 1 đã xác nhận `/portal/premium` chỉ là landing/
mua, không có route con nào từ trước).

**Đặt tên route:** audit nhanh convention Portal hiện có
(`duan-cohoi/[ecosystemSlug]`, `aiworkspace/bai-viet/[slug]`,
`aiworkspace/nghe/[slug]`) — dùng `[courseId]` (khớp param đã dùng ở Admin
builder Bước 3, `courses.id` là text slug-like — cùng kiểu
`[ecosystemSlug]`) + segment hành động tiếng Việt `hoc` (cùng phong cách
`bai-viet`/`nghe`) → `/portal/premium/[courseId]/hoc`.

**Kiểm soát truy cập** — đúng 3 lớp yêu cầu, KHÔNG viết cơ chế mới:
1. Chưa đăng nhập → `middleware.ts` đã gate toàn bộ `/portal/*`
   (`src/lib/protected-routes.ts`, không có ngoại lệ) — tự động redirect
   `/login?next=...` TRƯỚC KHI route này chạy, không cần tự kiểm tra.
2. Đã đăng nhập, CHƯA mua → `getPurchasedIds("course_id")` (có sẵn,
   `src/lib/access.ts`, đã dùng ở `/portal/premium`) trả về
   `Set<string>` rỗng cho khoá này → mỗi lesson chỉ xem được nếu
   `is_free_preview=true`; lesson khác hiện icon khoá + nhãn xám + CTA
   "Mua khoá học này →" (`/portal/premium`) khi bấm chọn.
3. Đã mua → `purchasedCourseIds.has(courseId)` true → mọi lesson
   Published xem được toàn bộ.

**Ẩn Draft/Hidden khỏi học viên — 2 lớp, không chỉ lọc ở code:**
`src/lib/portal/live-course-content.ts` (mới, `getLiveCourseContent()`,
cùng pattern mọi `live-*.ts` khác — `cache()` + `getSupabasePublic()`)
lọc `.eq("status", "Published")` cho cả `course_sections` và
`course_lessons` — NHƯNG lớp thật sự chặn là RLS `"public read published"`
đã tạo ở Bước 1 (`USING (status = 'Published')`): với client anon key
(`getSupabasePublic()` dùng), Postgres tự chặn Draft/Hidden ở tầng
database, không phải chỉ ẩn ở tầng hiển thị — kể cả nếu code quên filter,
RLS vẫn không trả Draft/Hidden về.

**File mới:**
- `src/lib/portal/live-course-content.ts` — `getLiveCourseContent(courseId)`,
  trả về cây `{sections: [{id, title, lessons: [...]}]}`, mỗi lesson có
  `id/section_id/title/video_url/content/duration_minutes/is_free_preview`.
- `src/app/portal/premium/[courseId]/hoc/page.tsx` (Server Component) —
  lấy tên khoá qua `getSupabasePublic()` (bảng `courses` public-read hoàn
  toàn, RLS `courses_read` đã có từ trước), `notFound()` nếu courseId
  không khớp khoá nào; fetch song song `getLiveCourseContent()` +
  `getPurchasedIds("course_id")`; dùng `PortalBackLink` chuẩn (đã có sẵn
  toàn Portal, không viết link Back riêng).
- `src/app/portal/premium/[courseId]/hoc/CourseLearnClient.tsx`
  ("use client") — CHỈ ĐỌC (không kéo-thả, không CRUD — khác hẳn Admin
  builder). Cột trái: cây Section→Lesson (icon khoá/PlayCircle theo
  `viewable`, badge thời lượng). Cột phải: lesson đang chọn — video nhúng
  (chuyển URL YouTube watch/youtu.be sang dạng `/embed/`, URL khác không
  đoán được cấu trúc nhúng chung nên fallback sang link mở tab mới, cùng
  cách `/portal/account` đã xử lý `video_url` bất kỳ từ trước) + `content`
  hiển thị dạng text thuần (`whitespace-pre-wrap`, KHÔNG render markdown —
  dự án chưa có thư viện markdown nào, không thêm dependency mới cho việc
  này) + badge thời lượng. Mặc định tự chọn sẵn bài xem được đầu tiên
  (đã mua → bài đầu; chưa mua → bài xem thử đầu tiên nếu có) để trang
  không trống khi vừa vào.
- **KHÔNG xây course progress** — đúng quyết định để sau, trang này không
  lưu/đọc tiến độ học nào.

**Nối "Vào học ngay":** audit `PremiumProgramCard.tsx` phát hiện đã CÓ SẴN
đúng chỗ cần — khi `owned=true`, card đã render nút "Vào học ngay →" (trước
đó trỏ `/portal/my-products`, trang danh sách sản phẩm đã mua chung
chung). Đổi thẳng href sang `/portal/premium/${course?.id}/hoc` — vào
thẳng nội dung khoá thay vì phải qua 1 bước trung gian, không thêm
button/layout mới, không phá cấu trúc card.

**Verify đã chạy:** `tsc`/`eslint`/`npm run build` sạch (route
`/portal/premium/[courseId]/hoc` xuất hiện đúng), `vitest run` 139/139.

**Giới hạn thật, không tự chèn dữ liệu test:** định verify thêm bằng cách
chèn 1 dòng test vào `course_sections`/`course_lessons` (khoá `ai-coban`)
rồi đọc lại qua REST API bằng anon key để xác nhận RLS thật sự chặn
Draft — Founder từ chối cả 2 lần (insert test data, và cả câu hỏi xin
xác nhận cách xử lý) → đã dừng ngay, không tự ý thử lại dưới hình thức
khác. Founder tự verify trực tiếp trên Preview URL (xem checklist trong
báo cáo) — bảo đảm về mặt code: RLS policy (Bước 1) + filter tường minh
trong `getLiveCourseContent()` + không có đường nào khác đọc 2 bảng này ở
Portal ngoài file này.

## Nhóm 3 — Mở rộng Live-edit: audit kiến trúc trước khi build (bắt buộc)

Trước khi build bất kỳ module nào trong Nhóm 3 (mở rộng Live-edit "Cách A"
thay VisualEditor cũ cho 5 Cửa Hành trình + Trang chủ Học viện + Sứ mệnh
Companion + hub Dự án & Cơ hội), đã audit kiến trúc thật của từng khu vực
— phát hiện 2 vấn đề buộc dừng hỏi trước khi build (không tự quyết định):

1. **5 Cửa Hành trình + hub Dự án & Cơ hội — kiến trúc KHÁC Companion đã
   pilot.** Companion's `/portal/su-menh-companion/page.tsx` là "use
   client" thuần, tự gọi `useCollection()` cho cả 6 khối — nên pilot chỉ
   cần bọc `<EditableRegion>` trực tiếp trong JSX của chính trang đó,
   không cần sửa gì khác. Nhưng `MirrorChamber`/`LearningJournalNotebook`/
   `MyStoryBook`/`JourneyMapAtlas`/`GardenExperience` và hub
   `/portal/duan-cohoi` đều là (hoặc được render bởi) **Server Component**
   nhận `chrome`/dữ liệu qua PROPS từ `page.tsx` (đã tự fetch server-side
   qua `getLiveMirrorChrome()`/`getLiveProjects()`...) — hoàn toàn không
   dùng `useCollection()`. Nhúng `EditableRegion` trực tiếp cần
   `record`+`update` phản ứng từ `useCollection()`, nhưng gọi hook này
   luôn (bắt buộc theo Rules of Hooks, không được gọi có điều kiện) sẽ
   thêm 1 request mạng thừa cho MỌI khách Portal thật ghé Mirror/Journal/
   Story/Map/Garden/Dự án — dù họ không bao giờ vào chế độ sửa.

2. **Trang chủ Học viện (`home_cards`) — gap sâu hơn, không chỉ kiến
   trúc.** `/portal/page.tsx` (GemHomePage) THẬT hoàn toàn KHÔNG đọc bảng
   `home_cards` — cả 7 `<PillarEntranceCard>` đều hardcode JSX trực tiếp
   trong file. `/admin/home-cards` (VisualEditor) đang quản 1 bảng mồ côi,
   sửa gì cũng không ảnh hưởng trang chủ thật.

**Quyết định Founder (cả 2 điểm):**

- **Kiến trúc A/D:** thêm tham số thứ 3 `options?: { enabled?: boolean }`
  vào `useCollection()` (`src/lib/admin/store.ts`), mặc định `true` —
  KHÔNG đổi hành vi ~30+ nơi gọi 2-tham số hiện có. Khi `enabled: false`,
  `useSupabaseCollection` bỏ qua hẳn `fetch()` (dùng thẳng `seed` — chính
  là prop server đã truyền — làm dữ liệu hiển thị, `ready` ngay lập tức).
  5 component Portal thật (Mirror.../hub Dự án) sẽ gọi
  `useCollection(key, seed, { enabled: editMode })` — Portal thật
  (`editMode=false`) zero request mạng thừa; qua route live-edit tương
  ứng (`editMode=true`) mới thật sự fetch/phản ứng để sửa.
- **`home_cards`:** nối dây trước — sửa `/portal/page.tsx` đọc thật từ
  `home_cards` (cache()-wrapped Server fetch, cùng pattern
  `getLiveProjects()`) TRƯỚC khi áp Live-edit, vì sửa editor cho 1 bảng
  chẳng ai đọc là vô nghĩa. (Việc nối dây này làm ở module Trang chủ Học
  viện, chưa làm ở bước hạ tầng chung này.)

**Đã làm (bước hạ tầng chung, TRƯỚC MỌI module Nhóm 3 — đây là thay đổi
hạ tầng dùng chung ĐẦU TIÊN trong toàn bộ admin-rebuild, ảnh hưởng
`useCollection()` — hook lõi dùng bởi ~30+ nơi: mọi `VisualEditor`,
`SingletonEditor`, `DataTableRowPanel`, `FieldInput` (multi-select), và
nhiều Portal section đọc admin-authored content):**

`src/lib/admin/store.ts` — thêm tham số thứ 3 như trên. Verify theo đúng
4 điều kiện Founder yêu cầu trước khi cho phép dùng:
1. Implement đúng như đề xuất — `enabled` mặc định `true`.
2. `npx vitest run` toàn bộ — **139/139 pass**, không regression.
3. Code review 3 nơi bất kỳ đã có từ trước, xác nhận KHÔNG bị ảnh hưởng:
   - `AdminPromptsSection.tsx` (CKOS, Portal đọc `prompts`) —
     `useCollection("prompts", promptsSeed)` 2 tham số, `options`
     `undefined` → `enabled` mặc định `true`, hành vi y hệt trước.
   - `su-menh-companion/mission/page.tsx` (Sứ mệnh Companion cũ, qua
     `VisualEditor`) — `VisualEditor` tự gọi `useCollection<T>(collectionKey,
     [])` 2 tham số, cùng kết luận.
   - `course-pricing/{page,CourseRow,actions}.tsx` (Premium) — grep xác
     nhận **0 lần gọi `useCollection`** ở cả 3 file (bảng `courses` là
     typed, dùng Server Actions riêng) — hoàn toàn không tiếp xúc hook
     này, cách ly tuyệt đối khỏi thay đổi.
4. Ghi lại đầy đủ mục này trong CLAUDE.md (lý do, phạm vi, cách verify).

`tsc`/`eslint` sạch sau khi sửa (1 lỗi cú pháp tự gây ra khi viết comment
— chuỗi `/admin/*/live-edit` vô tình chứa literal `*/` đóng sớm khối
JSDoc `/** ... */`, gây hàng loạt lỗi parse phía sau — đã sửa lại thành
"route live-edit tương ứng", tránh mọi literal `*/` trong comment JSDoc
từ nay).

**Chưa build module nào của Nhóm 3 ở bước này** — đây thuần là bước hạ
tầng chung, mở khoá kỹ thuật cho Phần A/D. Tiếp theo: build từng module
theo đúng thứ tự Founder chọn (nối dây `home_cards` trước, rồi Live-edit
Trang chủ Học viện, Phần A 5 Cửa, Phần C Companion, Phần D hub Dự án).

## Nhóm 3 — Nối dây `home_cards` (trước khi áp Live-edit)

**Bước 1 — Audit:** `/portal/page.tsx` (GemHomePage) là Server Component
(`export default async function`, không `"use client"`; `robots:
{index:false}` nên SEO không phải mối lo chính, hiệu năng vẫn cẩn trọng
vì đây là trang khách vãng lai thấy đầu tiên). Đối chiếu 7 dòng
`home_cards` với 7 card hardcode: khớp đúng nội dung ở mọi field — chỉ
khác tên `description` (DB) vs `what` (prop `PillarEntranceCard`), mapping
đơn giản không phải lỗi. **Phát hiện 1 lỗi thật:** cột `"order"` của
`card_academy` (Học viện AI) là `3` thay vì `1` — sắp theo đúng cột này sẽ
đảo thứ tự "Học viện AI" ↔ "AI Workspace" so với hiển thị thật hiện tại.
Đã sửa bằng 1 `UPDATE home_cards SET "order"=1 WHERE id='card_academy'`
(dữ liệu, không phải schema) — xác nhận lại thứ tự sort đúng khớp 100%
thứ tự JSX gốc trước khi code bất kỳ dòng nào.

**Phát hiện thiết kế quan trọng khi làm Bước 2:** nếu chỉ đổi
`useCollection(key, seed, {enabled: editMode})` với `editMode` luôn
`false` ở Portal thật (đúng nguyên tắc `enabled` đã xây ở bước hạ tầng),
Portal thật sẽ KHÔNG BAO GIỜ fetch — nghĩa là sửa qua Admin sẽ không bao
giờ phản ánh lên trang chủ thật, mâu thuẫn với yêu cầu verify "sửa qua
Admin, F5 thấy ngay". **Giải quyết:** tách 2 lớp — lớp lấy dữ liệu THẬT
(freshness) là 1 hàm Server-side mới `getLiveHomeCards()` (cùng pattern
mọi `live-*.ts` khác, chạy lại mỗi request nên luôn thấy bản mới nhất);
lớp `useCollection(..., {enabled: editMode})` chỉ để CHUẨN BỊ SẴN cấu
trúc cho Live-edit sau này (pass-through `seed` — chính là kết quả
`getLiveHomeCards()` — khi `editMode=false`, không phải nguồn freshness
chính).

**Đã làm:**
- `src/lib/portal/live-home-cards.ts` (mới) — `getLiveHomeCards()`
  (`cache()` + `getSupabasePublic()`, `.eq("status","Published").order("order")`),
  map `description`→`what`, giữ `companionLineOwned` (chỉ `card_premium`
  có giá trị) làm field riêng để chọn đúng nhãn theo `ownedCount` lúc
  render (không gộp cứng vào `companionLine`).
- `src/components/portal/gem-home/EditModeContext.tsx` (mới) — y hệt
  pattern `su-menh-companion/EditModeContext.tsx`, mặc định `false`. Dựng
  sẵn để module Live-edit kế tiếp không cần sửa lại `HomePillarCards.tsx`.
- `src/components/portal/gem-home/HomePillarCards.tsx` (mới, "use
  client") — nhận `seed` (kết quả `getLiveHomeCards()`) +
  `ownedCount`/`premiumStarted` (dữ liệu per-user thật, tính sẵn ở
  server, KHÔNG lưu trong `home_cards`). Gọi
  `useCollection("home-cards", seed, {enabled: useEditMode()})` —
  `editMode=false` (Portal thật) → pass-through `seed`, 0 request mạng
  (đã code-review xác nhận: `useEffect` trong `useSupabaseCollection` có
  `if (!enabled) return;` trước khi gọi `load()`, không có đường nào khác
  gọi `fetch()`). Card `card_premium` chọn `companionLineOwned` thay
  `companionLine` khi `ownedCount > 0` — giữ đúng logic ternary gốc.
- `src/app/portal/page.tsx` — bỏ hẳn 7 khối `<PillarEntranceCard>`
  hardcode, thay bằng `<HomePillarCards seed={homeCards} .../>`.
  `GemHomePage` KHÔNG đổi kiến trúc (vẫn Server Component 100%).

**Verify NGHIÊM NGẶT đã chạy:**
- Diff CHÍNH XÁC từng field (không suy đoán) giữa 7 dòng `home_cards`
  (sau khi sửa `order`) và nội dung hardcode gốc (lấy từ git history
  `HEAD:src/app/portal/page.tsx` trước khi sửa) — **khớp 100%, không lệch
  1 ký tự** ở mọi field (title/what↔description/href/icon/accent/
  companionLine/companionLineOwned/ctaLabel/module/startedMode) và đúng
  thứ tự 7 card.
- `tsc`/`eslint`/`npm run build` sạch, `vitest run` 139/139.
- Xác nhận zero-request qua code review (không phải Network tab thật —
  sandbox không đăng nhập được, xem giới hạn đã ghi ở Course Builder Bước
  3/4): `enabled=false` chặn `load()` ở cả 2 lớp guard trong
  `useSupabaseCollection`.
- **CHƯA tự test "sửa qua Admin, F5 thấy ngay"** bằng thao tác UI thật
  (cùng giới hạn sandbox không có tài khoản Admin) — cơ chế giống hệt các
  `live-*.ts` khác đã chạy thật trong dự án (Dự án & Cơ hội, CKOS...),
  Founder tự bấm thử trên Preview URL.

**Kiến trúc sẵn sàng cho Live-edit (module kế tiếp, CHƯA build ở bước
này):** chỉ cần dựng `/admin/.../home-cards/live-edit/page.tsx` bọc
`<EditModeProvider><GemHomePage /></EditModeProvider>` + nhúng
`EditableRegion` vào `HomePillarCards.tsx`/`PillarEntranceCard.tsx` cho
đúng field an toàn — không cần sửa lại `useCollection()` hay luồng dữ
liệu đã dựng ở bước này.

## Nhóm 3, Phần B — Live-edit Trang chủ Học viện (home_cards), thay hẳn VisualEditor

Tiếp theo bước nối dây `home_cards` (mục trên) — xây Live-edit + xoá hẳn
VisualEditor cũ, route Live-edit trở thành route DUY NHẤT (`/admin/home-cards`,
giữ nguyên href để Dashboard/navIcons không cần sửa).

**Field text cần sửa qua Admin trước đây (VisualEditor cũ):** title,
description, href, ctaLabel, companionLine, accent, status — 7 field,
KHÔNG có `icon` (VisualEditor cũ cũng không cho sửa icon tự do, tránh gõ
sai làm vỡ `ICONS` lookup). Live-edit giữ ĐÚNG 7 field này, bổ sung thêm
`companionLineOwned` (field thật đã có trong DB — dùng cho nhãn Companion
khi đã sở hữu Premium — trước đây VisualEditor cũ KHÔNG có ô sửa field
này) cho đúng yêu cầu "toàn bộ field text".

**Kéo-thả đổi thứ tự:** `EditableRegion` (pattern pilot) tự nó KHÔNG hỗ
trợ kéo-thả — chỉ là popover sửa field của 1 record. Kéo-thả được thêm
riêng ở `HomePillarCards.tsx` (không phải trong `EditableRegion`), dùng
lại ĐÚNG `reorder()` (alias `set()`) đã có sẵn trong `useCollection()` —
cùng cơ chế PUT bulk-replace mà `VisualEditor.tsx` đã dùng, không viết
logic reorder mới. Native HTML5 drag (`draggable`/`onDragStart`/
`onDragOver`/`onDrop`), chỉ kích hoạt khi `editMode=true` (Portal thật
không có `draggable` nào, không đổi hành vi).

**Sửa lại 1 chỗ từ bước nối dây trước (bug tiềm ẩn, phát hiện khi build
Live-edit):** `getLiveHomeCards()` trước đó đổi tên `description`→`what`
ngay ở lớp fetch — vô hại khi `enabled` luôn `false` (bước nối dây), NHƯNG
khi Live-edit bật `enabled:true`, `useCollection()` sẽ fetch RAW qua
`/api/admin/collections/home-cards` (trả về đúng field `description`,
không có `what`) — `seed` (đã đổi tên) và dữ liệu live-fetch (chưa đổi
tên) sẽ LỆCH SHAPE, `card.what` thành `undefined` ngay khi vào edit mode.
Đã sửa: `LiveHomeCard`/`getLiveHomeCards()` giữ nguyên tên `description`
(khớp raw DB shape) — việc đổi sang prop `what` của `PillarEntranceCard`
chỉ làm ở bước cuối cùng trong `HomePillarCards.tsx`
(`what={card.description}`), không phụ thuộc `enabled`.

**File mới:**
- `src/components/portal/gem-home/EditableRegion.tsx` — y hệt
  `su-menh-companion/EditableRegion.tsx` (pilot), chỉ đổi import
  `useEditMode` sang bản riêng gem-home.

**File sửa:**
- `src/lib/portal/live-home-cards.ts` — giữ tên field `description` (xem
  lý do ở trên), thêm field `status`.
- `src/components/portal/gem-home/PillarEntranceCard.tsx` — thêm prop tuỳ
  chọn `editable?: {record, fields, update}` (mặc định `undefined`, KHÔNG
  đổi hành vi khi không truyền — đã xác nhận JSX render giống hệt cũ khi
  `editable` rỗng). Khi có `editable`, bọc khối tiêu đề+mô tả (`title`+
  `what`) trong `<EditableRegion>` — popover hiện đủ 8 field (title/
  description/href/ctaLabel/companionLine/companionLineOwned/accent/
  status), không chỉ 2 field visually wrapped (cùng kỹ thuật Genome pilot
  — 1 vùng click mở popover nhiều field).
- `src/components/portal/gem-home/HomePillarCards.tsx` — dùng
  `useEditMode()` thay vì luôn `false`; thêm kéo-thả (chỉ khi
  `editMode=true`, bọc thêm 1 `<div draggable>` quanh mỗi
  `PillarEntranceCard` — Portal thật KHÔNG có div bọc thêm này, giữ đúng
  cấu trúc DOM cũ 100%).
- `src/app/admin/(dashboard)/home-cards/page.tsx` — XOÁ HẲN nội dung
  VisualEditor cũ, thay bằng render lại `<GemHomePage/>`
  (`/portal/page.tsx` thật, import thẳng) bọc `<EditModeProvider>`. Khác
  Companion pilot (page.tsx đó "use client" vì trang gốc vốn "use
  client") — ở đây PHẢI giữ Server Component (không "use client") vì
  `GemHomePage` là `async function` cần fetch thật trước khi render;
  Next.js hỗ trợ Server Component làm `children` của Client Component
  (`EditModeProvider`) — đã build/tsc xác nhận hoạt động đúng.
- `src/lib/admin/nav.ts` — giữ nguyên href `/admin/home-cards` (Dashboard/
  navIcons không cần sửa gì), chỉ đổi label thành "Thẻ trang chủ
  (Live-edit)" + thêm comment giải thích.

**Verify:** `tsc`/`eslint`/`npm run build` sạch (route `/admin/home-cards`
vẫn xuất hiện đúng, nội dung đổi bên trong), `vitest run` 139/139. Đã
xác nhận lại JSX của `PillarEntranceCard` khi `editable` rỗng render y hệt
bản gốc (không có wrapper thừa) — Portal thật (`/portal/`) không đổi DOM
output so với bước nối dây trước.

**Chưa tự test kéo-thả/sửa field qua UI thật** (cùng giới hạn sandbox
không có tài khoản Admin đã nêu nhiều lần) — Founder tự test trên Preview
URL theo checklist.

## Nhóm 3, Phần A — Mirror: chuyển từ props sang useCollection({enabled})

Module đầu tiên của Phần A (5 Cửa Hành trình). Audit xác nhận
`MirrorChamber.tsx` nhận `chrome: MirrorChrome`/`questions: string[]` qua
props từ `/portal/mirror/page.tsx` (Server Component, tự fetch
`getLiveMirrorChrome()`/`getLiveMirrorQuestions()`) — đúng kiến trúc đã
audit ở bước hạ tầng chung, không dùng `useCollection()`.

**Sửa lại 1 lần nữa bài học `description`/`what` (home_cards):**
`getLiveMirrorChrome()` trước đây trả về `MirrorChrome` KHÔNG có `id`;
`getLiveMirrorQuestions()` trả về `string[]` đã flatten sẵn (mất hẳn
`id`/`status`). Cả 2 đều sẽ lệch shape với dữ liệu RAW mà
`useCollection()` fetch thật khi `enabled:true`. Đã sửa: `MirrorChrome`
thêm `id`/`status`; thêm type mới `MirrorQuestionRow = {id, content,
status}`, `getLiveMirrorQuestions()` trả mảng object thay vì
`string[]` — việc flatten về `string[]` (cho `todaysMirrorQuestion()`)
chuyển vào TRONG `MirrorChamber.tsx` (`questionItems.filter(status===
"Published").map(content)`), không phụ thuộc `enabled`.

**Vấn đề UX riêng của Mirror (khác `home_cards`):** `mirror_questions`
chỉ hiện ĐÚNG 1 câu xoay vòng theo NGÀY (`todaysMirrorQuestion()`), không
phải danh sách hiển thị — không có cách nào "click đúng câu cần sửa"
trong 6 ngày còn lại. Tương tự, khối "trạng thái trống"
(`emptyStateLine1/2/ctaLabel`) chỉ render khi `isFullyQuiet` — phụ thuộc
dữ liệu THẬT của member đang đăng nhập (rất có thể tài khoản Admin không
"trống" nên khối này không bao giờ hiện). Cả 2 trường hợp đều KHÔNG đảm
bảo "toàn bộ field text editable" nếu chỉ bọc `EditableRegion` tại đúng
vị trí hiển thị tự nhiên.

**Giải quyết:** thêm 1 panel "Live-edit — Nội dung Mirror" LUÔN hiện khi
`editMode=true` (đặt ngay dưới `PortalBackLink`, KHÔNG phụ thuộc
`isFullyQuiet`/ngày nào), gồm 3 vùng `EditableRegion` (tiêu đề; chân
trang + status; 3 field trạng thái trống) + danh sách đầy đủ 7 câu hỏi,
mỗi câu 1 `EditableRegion` riêng. Portal thật (`editMode=false`) — khối
này hoàn toàn KHÔNG render (`{editMode && (...)}`), 0 ảnh hưởng DOM.
**Không có kéo-thả** cho Mirror — `mirror_chrome` là singleton,
`mirror_questions` xoay vòng theo NGÀY (không theo vị trí hiển thị danh
sách), không có nhu cầu đổi thứ tự như `home_cards`.

**File mới:** `src/components/portal/mirror/EditModeContext.tsx` +
`EditableRegion.tsx` (y hệt pattern `gem-home`/Companion, chỉ đổi
import).

**File sửa:**
- `src/lib/portal/live-mirror.ts` — sửa shape như trên.
- `src/components/portal/mirror/MirrorChamber.tsx` — đổi prop
  `chrome`/`questions` → `seedChrome`/`seedQuestions`; gọi
  `useCollection("mirror-chrome", [seedChrome], {enabled: useEditMode()})`
  + `useCollection("mirror-questions", seedQuestions, {enabled: ...})`;
  thêm panel Live-edit; **KHÔNG đụng** `invitation`/`narrativeLines`/
  `reflectionMoments`/`firstFootprint`/`quietSeasonLine`/`originLine`
  (dữ liệu động thật, vẫn nhận qua props như cũ).
- `src/app/portal/mirror/page.tsx` — đổi tên prop truyền xuống
  (`seedChrome`/`seedQuestions`), không đổi logic fetch.
- `src/app/admin/(dashboard)/hanh-trinh-cua-toi/mirror/page.tsx` (mới) —
  render lại `<MirrorPage/>` (`/portal/mirror/page.tsx` thật) bọc
  `<EditModeProvider>`, cùng pattern `/admin/home-cards` (Phần B).
- **Đã xoá** `hanh-trinh-cua-toi/mirror-chrome/` +
  `hanh-trinh-cua-toi/mirror-questions/` (2 route VisualEditor cũ) — gộp
  vào route Live-edit duy nhất `hanh-trinh-cua-toi/mirror/`.
- `nav.ts` — gộp 2 entry cũ thành 1: `"Mirror (Live-edit)"` →
  `/admin/hanh-trinh-cua-toi/mirror`.
- `AdminSidebar.tsx` — gộp 2 icon key cũ thành 1.
- `dashboard/page.tsx` — xoá 2 dòng `TABLE_FOR_HREF` cũ (route giờ gộp 2
  bảng, không map 1-1 được vào cấu trúc `Record<href, 1 table>` — cùng
  cách xử lý "không có số đếm" như Companion CMS/CKOS Dashboard).

**Verify:** `tsc`/`eslint`/`npm run build` sạch (route
`/admin/hanh-trinh-cua-toi/mirror` xuất hiện đúng, 2 route cũ đã biến
mất), `vitest run` 139/139. Xác nhận qua code review: khi `editMode=false`,
`chrome = chromeItems[0] ?? seedChrome` = đúng `seedChrome` (pass-through
seed, không fetch), `publishedQuestions` tính từ `questionItems` (=
`seedQuestions`, đã lọc Published sẵn từ `getLiveMirrorQuestions()`) cho
kết quả TEXT giống hệt mảng `questions` cũ — Portal thật
(`/portal/mirror`) không đổi DOM output.

## Nhóm 3, Phần A — Nhật ký học tập: chuyển từ props sang useCollection({enabled})

Module thứ 2 của Phần A, đúng pattern Mirror. Audit xác nhận
`LearningJournalNotebook.tsx` nhận `chrome: JournalChrome`/
`intentions: string[]` qua props từ `/portal/nhatkyhoctap/page.tsx`
(Server Component, tự fetch `getLiveJournalChrome()`/
`getLiveJournalIntentions()`) — cùng kiến trúc Mirror.

**Áp dụng ngay bài học shape (`description`/`what`) từ đầu, không chờ
lỗi xảy ra:** `getLiveJournalChrome()` sửa để trả thêm `id`/`status`
(trước đó không có); thêm type mới `JournalIntentionRow = {id, content,
status}`, `getLiveJournalIntentions()` trả mảng object thay vì
`string[]` đã flatten sẵn — việc flatten về `string[]` (cho
`todaysJournalIntention()`) chuyển vào TRONG
`LearningJournalNotebook.tsx` (`intentionItems.filter(status===
"Published").map(content)`), không phụ thuộc `enabled`.

**Cùng vấn đề reachability như Mirror:** các mục "Journal entries thật"/
"khoảnh khắc"/"tác phẩm"/"bài học" chỉ hiện khi phiên đăng nhập của Admin
tình cờ có dữ liệu đó, và `journal_intentions` chỉ hiện ĐÚNG 1 câu xoay
vòng theo NGÀY — không có cách nào chắc chắn chạm được mọi field qua vị
trí hiển thị tự nhiên.

**Giải quyết:** thêm 1 panel Live-edit LUÔN hiện khi `editMode=true`
(ngay dưới `PortalBackLink`, không phụ thuộc dữ liệu runtime nào), gồm 4
vùng `EditableRegion` (tiêu đề/eyebrow; trạng thái trống; 7 nhãn mục —
today/entries/highlights/created/lessons; chân trang + continueCta +
status) + danh sách đầy đủ 5 câu ý định, mỗi câu 1 `EditableRegion`
riêng. Portal thật (`editMode=false`) — khối này hoàn toàn KHÔNG render.
**Không có kéo-thả** — cùng lý do Mirror (`journal_chrome` singleton,
`journal_intentions` xoay theo ngày, không theo vị trí).

**KHÔNG đụng** `MODULE_LABEL` (enum map `PortalModule→label`),
`TODAY_PRIORITY` (mảng gắn với thứ tự enum `GrowthEventType`),
`isSameDay`/`formatDate`/`buildEntries`, dòng nội suy
`{totalRawOutputs} kết quả thật...` — toàn bộ dữ liệu/logic động giữ
nguyên 100% như trước, đúng nguyên tắc bất biến Việc 9.

**File mới:** `src/components/portal/journal/EditModeContext.tsx` +
`EditableRegion.tsx` (y hệt pattern Mirror/gem-home, chỉ đổi import;
màu hover theo theme sáng — giống bản gem-home hơn bản tối của Mirror,
đúng `.journal-notebook-bg` là nền sáng).

**File sửa:**
- `src/lib/portal/live-journal.ts` — sửa shape như trên.
- `src/components/portal/journal/LearningJournalNotebook.tsx` — đổi prop
  `chrome`/`intentions` → `seedChrome`/`seedIntentions`; gọi
  `useCollection("journal-chrome", [seedChrome], {enabled: useEditMode()})`
  + `useCollection("journal-intentions", seedIntentions, {enabled: ...})`;
  thêm panel Live-edit.
- `src/app/portal/nhatkyhoctap/page.tsx` — đổi tên prop truyền xuống
  (`seedChrome`/`seedIntentions`), không đổi logic fetch.
- `src/app/admin/(dashboard)/hanh-trinh-cua-toi/journal/page.tsx` (mới) —
  render lại `LearningJournalPage` (`/portal/nhatkyhoctap/page.tsx`
  thật) bọc `<EditModeProvider>`, cùng pattern Mirror/`/admin/home-cards`.
- **Đã xoá** `hanh-trinh-cua-toi/journal-chrome/` +
  `hanh-trinh-cua-toi/journal-intentions/` (2 route VisualEditor cũ) —
  gộp vào route Live-edit duy nhất `hanh-trinh-cua-toi/journal/`.
- `nav.ts` — gộp 2 entry cũ thành 1: `"Nhật ký học tập (Live-edit)"` →
  `/admin/hanh-trinh-cua-toi/journal`.
- `AdminSidebar.tsx` — gộp 2 icon key cũ thành 1.
- `dashboard/page.tsx` — xoá 2 dòng `TABLE_FOR_HREF` cũ, cập nhật comment
  chung nhắc cả Mirror lẫn Nhật ký học tập làm ví dụ route gộp không có
  số đếm.

**Verify:** `rm -rf .next && npm run build` (route
`/admin/hanh-trinh-cua-toi/journal` xuất hiện đúng, 2 route cũ đã biến
mất — `.next/types` stale reference sau khi xoá route, đã gặp 3 lần liên
tiếp vdai-academy/Mirror/Journal, fix bằng rebuild sạch), `tsc`/`eslint`
sạch sau đó, `vitest run` 139/139.
