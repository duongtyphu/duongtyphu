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

**Còn lại — Bản đồ hành trình, Khu vườn của bạn — CHƯA làm**, theo đúng
thứ tự đã thống nhất (2 cửa cuối rủi ro cao nhất — STOP và hỏi lại nếu
audit phát hiện ranh giới tĩnh/động không rõ ràng).
