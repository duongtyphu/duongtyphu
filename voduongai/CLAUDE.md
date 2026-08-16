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
ở `/portal` **VÀ ở Landing Page bản chính thức (`/`, `src/app/page.tsx` +
`src/components/home/**`/`src/components/site/**`)** để lấy đúng class
Tailwind/bố cục/token/màu — luôn dùng class Tailwind token có sẵn, không
viết hex thô, không bịa lại 1 phiên bản khác của thứ đã có thật. Việc build
Logo & Nhận diện (ADM-V2-04) từng vi phạm chính nguyên tắc này — copy
nguyên mẫu logo tĩnh của website HTML CŨ (`duongtyphu/` ở repo root, ngoài
dự án Next.js này) thay vì đọc `HeaderClient.tsx`/`Footer.tsx` thật — đã
sửa lại, xem mục "Logo & Nhận diện — sửa snippet lệch" bên dưới.

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

## Nhóm 3, Phần A — My Story: chuyển từ props sang useCollection({enabled})

Module thứ 3 của Phần A, đúng pattern Mirror/Journal. Audit xác nhận
`MyStoryBook.tsx` nhận `chrome: StoryChrome` qua props từ
`/portal/story/page.tsx` (Server Component, tự fetch
`getLiveStoryChrome()`) — cùng kiến trúc 2 module trước, chỉ khác `story_chrome`
là bảng chrome DUY NHẤT (không có bảng danh sách câu hỏi/ý định thứ 2 đi
kèm như Mirror/Journal).

**Áp dụng ngay bài học shape (`description`/`what`) từ đầu:**
`getLiveStoryChrome()` trước đó `select("data")` và trả về `StoryChrome`
không có `id`/`status`. Đã sửa: thêm `id`/`status` vào type + query
(`select("id, data, status")`), gán trực tiếp từ cột top-level
(`result.id = data.id`, `result.status = data.status`) — KHÔNG qua vòng
lặp `STRING_KEYS` (vòng lặp đó chỉ đọc từ `data.data` jsonb, `id`/`status`
là cột riêng) để tránh bug tương tự đã gặp nếu lỡ để 2 key này lọt vào
`STRING_KEYS`.

**Reachability — nhiều field HƠN Mirror/Journal chỉ hiện có điều kiện:**
My Story có `bookIsEmpty` (ẩn toàn bộ 7 section nội dung nếu trống),
`monthlyStats.hasAnyHistory`, `importantMoments.length>0`,
`milestones.length>0`, khối "Lessons" (3 điều kiện OR), `createdWorks`
(if/else — 2 field khác nhau tuỳ nhánh), `capsules.length>0` (kéo theo cả
4 field của `RemovableEntry`), `!storageReady`, và toàn bộ 9 field trong
`WriteNook` (ẩn hẳn nếu `!signedIn`, hoặc hiện bản "chưa sẵn sàng" nếu
`!tableReady`) — tổng cộng nhiều nhánh hiển thị hơn hẳn 2 module trước,
không có cách nào đảm bảo 100% reachability qua vị trí hiển thị tự nhiên.

**Giải quyết:** cùng cơ chế panel Live-edit luôn hiện khi `editMode=true`
(ngay dưới `PortalBackLink`), nhóm 30 field thành 7 `EditableRegion`:
tiêu đề+phụ đề; 2 dòng trạng thái trống; 9 nhãn mục nội dung; khối
"Chương tiếp theo"+link Mirror (4 field); WriteNook (9 field); nhãn gỡ ký
ức tự lưu (4 field); trạng thái (`status`). Portal thật (`editMode=false`)
— khối này hoàn toàn không render. **Không có kéo-thả** — `story_chrome`
là singleton (1 dòng), không có danh sách nào cần đổi thứ tự (khác Mirror/
Journal nhưng cũng không có gì để kéo-thả cả).

**KHÔNG đụng** `JOURNEY_CHAPTER_NAMES` (dùng chung 3 cửa, index-bound —
không nằm trong file này, `chapter.name` chỉ đọc qua
`getCurrentChapterFromClient()`), `KIND_LABEL` (enum map
`MemoryCapsuleKind→label`, 14 giá trị đóng), `companionLine`/
`understandingNote`/`growthPattern`/`qualities`/`buildLetter(monthlyStats)`/
`importantMoments`/`milestones`/`createdWorks` (dữ liệu động thật từ
reflections/capsules/growth-view.ts) — giữ nguyên 100% như Việc 9 đã audit.

**File mới:** `src/components/portal/story/EditModeContext.tsx` +
`EditableRegion.tsx` (y hệt pattern Mirror/Journal, chỉ đổi import).

**File sửa:**
- `src/lib/portal/live-story.ts` — thêm `id`/`status` như trên.
- `src/components/portal/story/MyStoryBook.tsx` — đổi prop `chrome` →
  `seedChrome`; gọi `useCollection("story-chrome", [seedChrome], {enabled:
  useEditMode()})`; thêm panel Live-edit; **KHÔNG đụng** logic
  `useEffect`/`useMemo` tính dữ liệu động (giữ nguyên 100%).
- `src/app/portal/story/page.tsx` — đổi tên prop truyền xuống
  (`seedChrome`), không đổi logic fetch.
- `src/app/admin/(dashboard)/hanh-trinh-cua-toi/story/page.tsx` (mới) —
  render lại `MyStoryPage` (`/portal/story/page.tsx` thật) bọc
  `<EditModeProvider>`, cùng pattern Mirror/Journal.
- **Đã xoá** `hanh-trinh-cua-toi/story-chrome/` (1 route VisualEditor cũ)
  — gộp vào route Live-edit duy nhất `hanh-trinh-cua-toi/story/`.
- `nav.ts` — đổi label + href: `"My Story (Live-edit)"` →
  `/admin/hanh-trinh-cua-toi/story`.
- `AdminSidebar.tsx` — đổi key `navIcons` từ `story-chrome` sang `story`
  (icon `Feather` giữ nguyên).
- `dashboard/page.tsx` — xoá dòng `TABLE_FOR_HREF` cho `story-chrome`, cập
  nhật comment chung nhắc cả Mirror/Journal/My Story làm ví dụ route
  Live-edit không có số đếm.

**Verify:** `rm -rf .next && npm run build` (route
`/admin/hanh-trinh-cua-toi/story` xuất hiện đúng, route cũ đã biến mất),
`tsc`/`eslint` sạch, `vitest run` 139/139.

## Nhóm 3, Phần A — Bản đồ hành trình: chuyển từ props sang useCollection({enabled})

Module thứ 4 của Phần A, RỦI RO CAO NHẤT — đã audit lại kỹ
`JourneyMapAtlas.tsx` trước khi sửa, đúng như cảnh báo Founder đưa ra và
đúng như Việc 9 đã ghi nhận trước đó (không phát hiện gì mới, không cần
STOP hỏi lại):

- `CHAPTER_DESTINATIONS` — mảng `{href, label}` **không có key**, gắn với
  chương chỉ bằng VỊ TRÍ INDEX (`CHAPTER_DESTINATIONS[i]` khớp
  `JOURNEY_CHAPTER_NAMES[i]`). Giữ nguyên 100% trong code, không đưa vào
  `useCollection()`.
- `PORTAL_CONNECTIONS` — field `module` là KEY TRA CỨU THẬT vào
  `getModuleActivitySummary(c.module)` (so khớp `===` với
  `WorkspaceSession.context.module` thật). Giữ nguyên 100% trong code.

Chỉ tách đúng 12 field `map_chrome` đã có sẵn từ Việc 9 — không mở rộng
phạm vi.

**Áp dụng ngay bài học shape (`description`/`what`) từ đầu:**
`getLiveMapChrome()` trước đó `select("data")`, trả về `MapChrome` không
có `id`/`status`. Đã sửa: thêm `id`/`status` vào type + query
(`select("id, data, status")`), gán trực tiếp từ cột top-level (không qua
vòng lặp `STRING_KEYS` — vòng lặp đó lọc bỏ `id`/`status` để chỉ đọc từ
`data.data` jsonb), cùng cách đã làm ở My Story.

**Reachability:** `isFullyEmpty` (gate khối empty-state) và
`currentChapter === null` (gate `noChapterYetLine`) là 2 điều kiện runtime
khác nhau, phụ thuộc dữ liệu thật của phiên đang xem (rất có thể phiên
Admin không rơi vào 1 trong 2 trạng thái này) — cùng lý do 3 module trước,
thêm 1 panel Live-edit luôn hiện khi `editMode=true` (ngay dưới
`PortalBackLink`), nhóm 12 field thành 4 `EditableRegion`: tiêu đề+phụ đề
(luôn hiện tự nhiên, vẫn gộp vào panel cho nhất quán); trạng thái trống (2
field); 7 nhãn mục nội dung; lời khép Companion + trạng thái. Portal thật
(`editMode=false`) — khối này hoàn toàn không render. **Không có
kéo-thả** — `map_chrome` là singleton.

**File mới:** `src/components/portal/journey-map/EditModeContext.tsx` +
`EditableRegion.tsx` (y hệt pattern 3 module trước, chỉ đổi import).

**File sửa:**
- `src/lib/portal/live-map.ts` — thêm `id`/`status` như trên.
- `src/components/portal/journey-map/JourneyMapAtlas.tsx` — đổi prop
  `chrome` → `seedChrome`; gọi `useCollection("map-chrome", [seedChrome],
  {enabled: useEditMode()})`; thêm panel Live-edit; **KHÔNG đụng**
  `CHAPTER_DESTINATIONS`/`PORTAL_CONNECTIONS`/`currentChapter`/
  `connections[].count`/`nextDirection` (dữ liệu/cấu trúc động thật, giữ
  nguyên 100%).
- `src/app/portal/hanhtrinhcuatoi/ban-do/page.tsx` — đổi tên prop truyền
  xuống (`seedChrome`), không đổi logic fetch.
- `src/app/admin/(dashboard)/hanh-trinh-cua-toi/map/page.tsx` (mới) —
  render lại `JourneyMapPage` (`/portal/hanhtrinhcuatoi/ban-do/page.tsx`
  thật) bọc `<EditModeProvider>`, cùng pattern 3 module trước.
- **Đã xoá** `hanh-trinh-cua-toi/map-chrome/` (1 route VisualEditor cũ) —
  gộp vào route Live-edit duy nhất `hanh-trinh-cua-toi/map/`.
- `nav.ts` — đổi label + href: `"Bản đồ hành trình (Live-edit)"` →
  `/admin/hanh-trinh-cua-toi/map`.
- `AdminSidebar.tsx` — đổi key `navIcons` từ `map-chrome` sang `map` (icon
  `Compass` giữ nguyên).
- `dashboard/page.tsx` — xoá dòng `TABLE_FOR_HREF` cho `map-chrome`.

**Verify:** `rm -rf .next && npm run build` (route
`/admin/hanh-trinh-cua-toi/map` xuất hiện đúng, route cũ đã biến mất),
`tsc` sạch, `vitest run` 139/139.

## Nhóm 3, Phần A — Khu vườn của bạn: chuyển từ props sang useCollection({enabled}) (HOÀN TẤT PHẦN A)

Module thứ 5 và cuối cùng của Phần A (5 Cửa Hành trình), RỦI RO CAO NHẤT
theo audit gốc — re-audit `GardenExperience.tsx` xác nhận đúng y hệt phát
hiện của Việc 9, không có gì mới, không cần STOP:

- `companionLineFor(period, lastActivity)` — template nội suy `${act}` +
  gate theo `period`. Giữ nguyên 100% trong code.
- `treeStage(s)` — ngưỡng số liệu thật (`missionsCompleted`/
  `journeysTouched`/`competenciesPracticed`). Giữ nguyên 100%.
- `buildElements(s, counts)` — mảng phần tử vườn, mỗi `meaning` nội suy
  đếm số thật. Giữ nguyên 100%.
- Cặp CTA (`<Link href={gardenEmpty ? "/portal/hocvienai" :
  "/portal/workspace"}>{gardenEmpty ? "Gieo hạt mầm đầu tiên" : "Tưới cho
  khu vườn hôm nay"}</Link>`) — 1 `<Link>` DUY NHẤT, nhãn VÀ href cùng đổi
  theo 1 điều kiện. Giữ nguyên 100% trong code, không tách bất kỳ phần
  nào — đúng quyết định đã chốt ở Việc 9 (nhất quán với
  `nextDirection.text` ở Bản đồ hành trình).

Chỉ tách đúng 5 field `garden_chrome` đã chốt từ Việc 9 (title/subtitle/
footer/2 empty-state) — không mở rộng phạm vi.

**Áp dụng ngay bài học shape (`description`/`what`) từ đầu:**
`getLiveGardenChrome()` trước đó `select("data")`, trả về `GardenChrome`
không có `id`/`status`. Đã sửa: thêm `id`/`status` vào type + query
(`select("id, data, status")`), gán trực tiếp từ cột top-level (không qua
vòng lặp `STRING_KEYS`), cùng cách đã làm ở 3 module trước.

**Reachability:** `emptyStateNoTree` chỉ hiện khi `gardenEmpty`
(`treeStage` rỗng), `emptyStateNoMoments` chỉ hiện khi mở Viên ngọc mà
chưa có khoảnh khắc nào — cả 2 phụ thuộc dữ liệu runtime thật của phiên
đang xem. Thêm panel Live-edit luôn hiện khi `editMode=true` (ngay dưới
`PortalBackLink`), nhóm 5 field thành 3 `EditableRegion`: tiêu đề+phụ đề;
2 dòng trạng thái trống; lời khép cuối trang + trạng thái. Portal thật
(`editMode=false`) — khối này hoàn toàn không render. **Không có
kéo-thả** — `garden_chrome` là singleton.

**Atmosphere khác 4 module trước — không cần dựng riêng:** route Admin
Live-edit render lại component thật `GardenExperience` (đã tự có đủ 4 lớp
`garden-sky` + `data-garden-period` theo giờ thiết bị thật ngay trong
JSX) — khác VisualEditor cũ phải tự dựng `GardenAdminAtmosphere` giả lập
period cố định "sunset". Route Live-edit mới không cần component
atmosphere riêng nào.

**File mới:** `src/components/portal/garden/EditModeContext.tsx` +
`EditableRegion.tsx` (y hệt pattern 4 module trước, chỉ đổi import).

**File sửa:**
- `src/lib/portal/live-garden.ts` — thêm `id`/`status` như trên.
- `src/components/portal/garden/GardenExperience.tsx` — đổi prop `chrome`
  → `seedChrome`; gọi `useCollection("garden-chrome", [seedChrome],
  {enabled: useEditMode()})`; thêm panel Live-edit; **KHÔNG đụng**
  `companionLineFor`/`treeStage`/`buildElements`/cặp CTA.
- `src/app/portal/khuvuoncuaban/page.tsx` — đổi tên prop truyền xuống
  (`seedChrome`), không đổi logic fetch.
- `src/app/admin/(dashboard)/hanh-trinh-cua-toi/garden/page.tsx` (mới) —
  render lại `KnowledgeGardenPage` (`/portal/khuvuoncuaban/page.tsx`
  thật) bọc `<EditModeProvider>`, cùng pattern 4 module trước.
- **Đã xoá** `hanh-trinh-cua-toi/garden-chrome/` (1 route VisualEditor
  cũ, kể cả `GardenAdminAtmosphere` giả lập của nó) — gộp vào route
  Live-edit duy nhất `hanh-trinh-cua-toi/garden/`.
- `nav.ts` — đổi label + href: `"Khu vườn của bạn (Live-edit)"` →
  `/admin/hanh-trinh-cua-toi/garden`.
- `AdminSidebar.tsx` — đổi key `navIcons` từ `garden-chrome` sang `garden`
  (icon `Sprout` giữ nguyên).
- `dashboard/page.tsx` — xoá dòng `TABLE_FOR_HREF` cho `garden-chrome`,
  cập nhật comment chung thành "cả 5 module Hành trình của tôi".

**Verify:** `rm -rf .next && npm run build` (route
`/admin/hanh-trinh-cua-toi/garden` xuất hiện đúng cùng cả 4 route
Live-edit khác của Hành trình của tôi, route cũ đã biến mất), `tsc`/
`eslint` sạch, `vitest run` 139/139.

---

**PHẦN A HOÀN TẤT CẢ 5 CỬA HÀNH TRÌNH** (Mirror → Nhật ký học tập → My
Story → Bản đồ hành trình → Khu vườn của bạn), mỗi cửa 1 route Live-edit
duy nhất dưới `/admin/hanh-trinh-cua-toi/{mirror,journal,story,map,garden}`,
không còn VisualEditor nào chạy song song cho nhóm này. Tiếp theo: Phần D
(hub Dự án & Cơ hội).

## Nhóm 3, Phần D — Dự án & Cơ hội: audit + mở rộng theo yêu cầu riêng

**Audit bắt buộc trước khi build (theo đúng yêu cầu gốc "xác nhận
/admin/projects hiện tại là kiểu UI nào trước khi quyết định thay thế"):**
`/admin/projects` là **`DataTable`** (KHÔNG phải VisualEditor) — quản lý
1 danh sách 5 dòng hệ sinh thái thật (`digiu/solargroup/crypto/blockchain/
trading`), mỗi dòng 9 field, có sẵn Add/Edit/Xoá qua slide-over. Đây là
kiến trúc KHÁC HẲN 5 module Phần A (mỗi module đó là 1 dòng "chrome" đơn,
không phải danh sách entity thật với `key`/`icon`/`href` gắn logic routing
thật) — đã STOP báo cáo phát hiện này, không tự quyết định thay thế.

**Founder xác nhận qua 3 vòng hỏi đáp — phạm vi cuối cùng khác brief gốc:**
Founder cho biết `/admin/projects` (DataTable quản 5 thẻ hệ sinh thái ở
trang hub) đã đủ dùng, **không cần đổi** — nhưng phát hiện thêm 1 gap
thật: **5 trang CHI TIẾT hệ sinh thái** (`/portal/duan-cohoi/[ecosystemSlug]`
— digiu/solargroup/blockchain-crypto/lam-affilate/sangiaodich), trước đây
chủ động để NGOÀI phạm vi (Việc 5, phương án a — đọc tĩnh 100% từ
`src/data/portal/ecosystems.ts`), Founder giờ muốn tự sửa được. Founder
xác nhận rõ: **CHỈ 2 field an toàn — tiêu đề (`name`) và mô tả ngắn
(`shortDescription`)** — KHÔNG đụng `highlights`/`whoFor`/`whoNotReady`/
`expectedOutcome`/`fullIntro`/`statusBadge` hay bất kỳ cấu trúc lồng nào
(`marketingLinks`/`subProjects`/`fields`/`affiliateOffers`/`exchanges`/
`potentialAnalysis`) — các phần đó vẫn đọc tĩnh 100% từ `ecosystems.ts`
như cũ, ngoài phạm vi việc này. 2 CTA neo (`quickActions`) ở Hero trang
hub và toàn bộ nội dung tĩnh khác của hub (Tiêu chí chia sẻ, FAQ, 5 lời
nhắn Companion, ảnh minh hoạ đồng hành) Founder xác nhận **giữ nguyên
tĩnh**, không cần quản qua Admin.

**Kiến trúc:** bảng mới `ecosystem_chrome` (migration
`supabase-phase18-ecosystem-chrome.sql`, đã áp dụng qua Supabase MCP — 5
dòng, `id` = đúng `id` gốc trong `ecosystems.ts` (`eco_digiu`/
`eco_solargroup`/`eco_crypto`/`eco_blockchain`/`eco_trading`, ổn định,
KHÔNG đổi theo `slug` — `slug` từng đổi qua "Route Localization" trong
quá khứ, `id` thì không). 1 route Admin **dynamic** duy nhất
`/admin/duan-cohoi/[ecosystemSlug]` phục vụ cả 5 trang — cùng kỹ thuật
`[courseId]` đã dùng ở Course Builder — render lại ĐÚNG component gốc
`/portal/duan-cohoi/[ecosystemSlug]/page.tsx` (`EcosystemMiniSitePage`,
import thẳng) bọc `<EditModeProvider>`, cùng pattern Cách A đã dùng cho 5
Cửa Hành trình.

**Tách riêng phần render 2 field an toàn thành Client Component mới**
(`EcosystemOverview.tsx`) — hàm `Overview()` cũ (Server-rendered, nằm
trong chính `page.tsx`) được tách ra vì cần `useState`/`useCollection`
(client-only), phần còn lại của trang (`ArticlesSection`/`SubProjectsGrid`/
`AffiliateOffersList`/`ExchangesList`/`TwoFieldBoxes`/`MarketingLinkBox`/
`PotentialAnalysisTable`) giữ nguyên 100%, không đụng.

**`src/lib/portal/live-ecosystem-chrome.ts`** (mới) —
`getLiveEcosystemChrome(ecosystemId)` nhận `id` (không phải `slug`) làm
tham số, đúng `id, data, status` (đã áp dụng ngay từ đầu bài học shape
`description`/`what` — không cần sửa lại lần 2). Fallback về đúng nội
dung tĩnh gốc trong `ecosystems.ts` nếu Supabase chưa cấu hình/lỗi/chưa
Published. Dùng cả ở `generateMetadata()` (title/description SEO) và
`Breadcrumb` (thay `eco.name` bằng `chrome.name`) để tránh lệch chữ giữa
breadcrumb/SEO và tiêu đề H1 sau khi Founder sửa qua Admin.

**Xác nhận zero-regression về SSG/dynamic rendering:** trang
`[ecosystemSlug]/page.tsx` vẫn giữ `generateStaticParams()` (không đổi)
— audit qua `git stash` xác nhận route này **đã là `ƒ` (Dynamic)** từ
trước khi có bất kỳ thay đổi nào của việc này (không phải do thêm
`getLiveEcosystemChrome()` gây ra) — nhiều khả năng do layout `/portal`
dùng `cookies()`/session check chung, ép toàn bộ cây route `/portal/*`
thành dynamic bất kể `generateStaticParams`. Không phải regression.

**File mới:**
- `supabase-phase18-ecosystem-chrome.sql` — bảng + seed 5 dòng khớp đúng
  `name`/`shortDescription` tĩnh gốc (không đổi nội dung hiển thị mặc định).
- `src/lib/admin/supabaseCollections.ts` — thêm `"ecosystem-chrome":
  "ecosystem_chrome"`.
- `src/lib/portal/live-ecosystem-chrome.ts`.
- `src/components/portal/opportunities/EditModeContext.tsx` +
  `EditableRegion.tsx` (y hệt pattern 5 module Phần A, chỉ đổi import).
- `src/components/portal/opportunities/EcosystemOverview.tsx` — tách từ
  `Overview()` cũ, bọc `name`/`shortDescription` bằng `EditableRegion`,
  mọi field khác đọc thẳng từ `eco` (tĩnh).
- `src/app/admin/(dashboard)/duan-cohoi/[ecosystemSlug]/page.tsx` — route
  Live-edit dynamic duy nhất cho cả 5 trang chi tiết.

**File sửa:**
- `src/app/portal/duan-cohoi/[ecosystemSlug]/page.tsx` — xoá hàm
  `Overview()` cũ, gọi `<EcosystemOverview eco={eco} surface={surface}
  seedChrome={chrome} />` thay thế; `generateMetadata()` + `Breadcrumb`
  dùng `chrome.name`/`chrome.shortDescription` thay `eco.name`/
  `eco.shortDescription`.
- `src/lib/admin/nav.ts` — nhóm "Dự án & Cơ hội" giữ nguyên
  `{label: "Hệ sinh thái", href: "/admin/projects"}`, thêm 5 entry tường
  minh (không phải 1 link chung chung) trỏ 5 slug thật:
  `/admin/duan-cohoi/{digiu,solargroup,blockchain-crypto,lam-affilate,sangiaodich}`.
- `src/components/admin/AdminSidebar.tsx` — thêm 5 icon (`Layers`/
  `Building2`/`Bitcoin`/`Link2`/`LineChart`, khớp đúng icon thật mỗi hệ
  sinh thái dùng ở `ecosystems.ts`) cho 5 href mới.

**Không có số đếm ở Dashboard** cho 5 route chi tiết mới (`dashboard/
page.tsx`'s `TABLE_FOR_HREF` không thêm gì) — mỗi route là 1 trang nội
dung cụ thể (không phải danh sách collection để đếm dòng), cùng cách xử
lý "không có ở đây" như Companion CMS/CKOS Dashboard.

**Verify:** `git stash` + rebuild để xác nhận zero-regression SSG/dynamic
(xem trên); `rm -rf .next && npm run build` (route
`/admin/duan-cohoi/[ecosystemSlug]` xuất hiện đúng), `tsc`/`eslint` sạch,
`vitest run` 139/139. Migration đã áp dụng qua Supabase MCP
(`apply_migration`), xác nhận `success: true`.

**Chưa tự test qua UI thật** (cùng giới hạn sandbox không có tài khoản
Admin đã nêu nhiều lần) — Founder tự test 5 route
`/admin/duan-cohoi/{5 slug}` trên Preview URL.

## Nhóm 3, Phần C — Sứ mệnh Companion: mở rộng pilot thành Live-edit chính thức

Tiếp tục Nhóm 3 sau Phần D — Phần C (mở rộng THÍ ĐIỂM pilot ở
`/portal/su-menh-companion` từ 2 vùng đại diện lên đủ 6 khối, gộp 6 route
VisualEditor cũ thành 1) không nằm trong batch trước đó (không rõ chủ
đích bỏ qua hay chỉ sót), tiếp tục hoàn tất luôn để đóng nốt Nhóm 3.

**Audit trước khi sửa:** `page.tsx` đã **"use client" từ trước** (không
phải Server Component như 5 Cửa Hành trình) — mọi `useCollection()` cho 6
khối gọi 2-tham số, mặc định `enabled: true`, tức Portal thật ĐÃ LUÔN fetch
live 100% từ trước (không cần cơ chế `seed`/`enabled: editMode` như Phần
A/D — kiến trúc khác hẳn, không có gap "Server Component không dùng được
useCollection" ở đây). Pilot đã bọc `constitution`/`genome` bằng
`EditableRegion` — chỉ cần MỞ RỘNG thêm 4 khối còn lại
(`mission-items`/`philosophy-pairs`/`evolution`/`timeline`), không cần xây
lại từ đầu.

**Quyết định KHÔNG merge Flipbook vào cùng route** (khác biệt so với các
module trước, có lý do kỹ thuật, không phải bỏ sót): Flipbook
(`/portal/su-menh-companion/companion-qua-hinh-anh`, bảng
`companion_flipbook_pages`) là 1 carousel 3D xem ĐÚNG 1 trang/lần — kéo-thả
đổi thứ tự 7 trang cần nhìn thấy TẤT CẢ trang cùng lúc, việc VisualEditor
(card grid) đã làm tốt. Chuyển carousel sang Cách A (render lại đúng trang
carousel + EditableRegion) sẽ làm UX đổi thứ tự TỆ HƠN, không phải tốt
hơn — giữ nguyên `/admin/su-menh-companion/flipbook` (VisualEditor) như 1
route riêng, không gộp. "Sứ mệnh Companion" group giờ còn đúng 2 route
(giảm từ 8), mỗi route khớp đúng 1 UI phù hợp với bản chất nội dung của nó
— không cứng nhắc ép mọi thứ về 1 route nếu UX thật sự tệ hơn.

**Không mất khả năng Add/Xoá/Kéo-thả cho 4 khối mới** (`mission-items`/
`philosophy-pairs`/`evolution`/`timeline`) — VisualEditor cũ có các thao
tác này, `EditableRegion` không có. Chấp nhận cùng đánh đổi đã áp dụng cho
`mirror_questions`/`journal_intentions` ở Phần A (không add/xoá/kéo-thả
qua Live-edit) — các khối này là danh sách nội dung tương đối cố định
(4-6 dòng mỗi khối), không phải danh sách Founder cần thêm/bớt thường
xuyên như `home_cards`.

**File sửa (không có file mới — mọi hạ tầng `EditModeContext.tsx`/
`EditableRegion.tsx` đã có sẵn từ pilot):**
- `src/app/portal/su-menh-companion/page.tsx` — thêm 4 `FieldConfig`
  (`MISSION_FIELDS`/`PHILOSOPHY_FIELDS`/`EVOLUTION_FIELDS`/
  `TIMELINE_FIELDS`), lấy thêm `update` từ 4 `useCollection()` hiện có,
  bọc `EditableRegion` quanh khối render của `missionItems`/
  `philosophyPairs`/`evolutionStages`/`timelineStages` — mỗi khối bọc CẢ
  card (không cần tách field riêng như Genome pilot vì không có positioning
  `%` tuyệt đối nào bị ảnh hưởng).
- `src/app/admin/(dashboard)/su-menh-companion/live-edit/page.tsx` — cập
  nhật comment: từ "THÍ ĐIỂM, không thay thế" → "Live-edit CHÍNH THỨC,
  thay thế hẳn 6 route cũ", giải thích rõ lý do không gộp Flipbook.
- **Đã xoá** 6 route VisualEditor cũ: `su-menh-companion/{mission,
  philosophy,constitution,genome,evolution,timeline}/`.
- `src/lib/admin/nav.ts` — gộp 6 entry + entry pilot "🧪 Sửa trực tiếp
  (Thí điểm)" thành 1: `"6 khối nội dung (Live-edit)"` →
  `/admin/su-menh-companion/live-edit`; giữ nguyên "Ảnh Companion (thứ tự
  & tiêu đề)".
- `src/components/admin/AdminSidebar.tsx` — gộp 8 `navIcons` key cũ (6
  route + pilot `FlaskConical`) thành 2: `live-edit` (`Dna`) + `flipbook`
  (`Images`, giữ nguyên); xoá 4 import icon không dùng nữa (`Rocket`/
  `MessageCircle`/`History`/`FlaskConical`).
- `dashboard/page.tsx` — xoá 6 dòng `TABLE_FOR_HREF` cũ, cập nhật comment
  chung thêm "6 khối nội dung Sứ mệnh Companion" vào danh sách ví dụ route
  Live-edit không có số đếm.

**Verify:** `rm -rf .next && npm run build` (route
`/admin/su-menh-companion/live-edit` + `/admin/su-menh-companion/flipbook`
xuất hiện đúng, 6 route cũ đã biến mất), `tsc`/`eslint` sạch, `vitest run`
139/139.

**Chưa tự test qua UI thật** (cùng giới hạn sandbox) — Founder tự test
`/admin/su-menh-companion/live-edit` (đủ 6 khối sửa được) trên Preview
URL.

---

**NHÓM 3 HOÀN TẤT TOÀN BỘ** (Phần A — 5 Cửa Hành trình, Phần B — Trang chủ
Học viện, Phần C — Sứ mệnh Companion 6 khối, Phần D — Dự án & Cơ hội cả
hub và 5 trang chi tiết theo yêu cầu mở rộng riêng của Founder). Mỗi
module đều theo đúng nguyên tắc "1 module = đúng 1 route Live-edit chính
thức, không VisualEditor chạy song song" — trừ 1 ngoại lệ có lý do kỹ
thuật rõ ràng, đã ghi chú tại chỗ: Flipbook (Sứ mệnh Companion, carousel
xem 1 trang/lần không phù hợp kéo-thả qua Cách A).

## Dự án & Cơ hội — Live-edit cho hub (`/admin/projects` → `/admin/duan-cohoi`)

Founder yêu cầu riêng, sau khi Nhóm 3 đã đóng: chuyển nốt hub
`/admin/projects` (DataTable, ngoại lệ còn lại chưa theo Cách A) sang
Live-edit — giờ **cả hub lẫn 5 trang chi tiết hệ sinh thái đều dùng Cách
A**, không còn ngoại lệ DataTable nào trong "Dự án & Cơ hội".

**Kiến trúc:** đúng kiến trúc `home_cards` (Server Component +7 card
hardcode → tách Client Component riêng), áp dụng cho hub `projects` (9
field, 5 dòng, có `order` thật):

- **Sửa lại bài học shape (`description`/`what`) ngay từ đầu** cho
  `getLiveProjects()` — trước đó đổi tên field ngay ở lớp fetch
  (`expectation`→`expectedOutcome`, `fitCriteria`→`whoFor`,
  `avoidCriteria`→`whoNotReady`) VÀ không có `id`/`status`. Đã sửa: giữ
  nguyên tên field thô đúng shape DB (`expectation`/`fitCriteria`/
  `avoidCriteria`), thêm `id`/`status`, `select("id, data, status")` —
  việc đổi tên hiển thị (nếu cần) chỉ làm ở component render cuối cùng
  (ở đây thực ra giữ nguyên tên thô luôn, không đổi tên gì cả khi hiển
  thị — nhãn tiếng Việt "Phù hợp"/"Chưa nên tham gia nếu"/"Kỳ vọng thực
  tế" đã đủ rõ nghĩa, không cần alias field JS).
- **`src/components/portal/opportunities/ProjectCards.tsx`** (mới) —
  tách từ khối JSX render lưới ecosystem cũ (`ICON_MAP`/`ECOSYSTEM_SURFACE`/
  `DEFAULT_SURFACE` chuyển vào đây nguyên vẹn, không đổi giá trị nào).
  Nhận `seed: LiveProject[]`, gọi `useCollection("projects", seed,
  {enabled: useEditMode()})`. Portal thật (`editMode=false`) — mỗi card
  vẫn `<Link href={item.href}>` bọc icon+badge+title+description như cũ
  (điều hướng đúng như trước). Edit mode — thay `<Link>` bằng `<div>`
  không điều hướng, bọc icon+badge+title+description trong
  `EditableRegion` (mở popover đủ 9 field + status, cùng kỹ thuật "1 vùng
  click mở nhiều field" đã dùng cho `home_cards`); 2 link neo cuối thẻ
  ("Phân tích dự án"/"Đường link liên kết dự án") giữ nguyên hoạt động cả
  2 chế độ (không phải phần nội dung sửa được). Kéo-thả đổi thứ tự dùng
  đúng `reorder()` có sẵn — cùng cơ chế `HomePillarCards.tsx`.
- **Tái dùng** `src/components/portal/opportunities/EditModeContext.tsx`
  + `EditableRegion.tsx` đã có sẵn từ việc Live-edit 5 trang chi tiết hệ
  sinh thái (cùng module `opportunities`, không tạo bản sao thứ 3).
- **`src/app/portal/duan-cohoi/page.tsx`** — bỏ khối JSX render lưới
  ecosystem cũ (~50 dòng) + 3 hằng số đã chuyển, thay bằng
  `<ProjectCards seed={projects} />`. `getLiveProjects()`/props khác
  không đổi.
- **`src/app/admin/(dashboard)/duan-cohoi/page.tsx`** (mới) — render lại
  `OpportunitiesHubPage` (`/portal/duan-cohoi/page.tsx` thật) bọc
  `<EditModeProvider>`, cùng pattern `/admin/home-cards`.
- **Đã xoá** `/admin/projects` (DataTable cũ).
- `nav.ts` — đổi href `"Hệ sinh thái"` từ `/admin/projects` →
  `/admin/duan-cohoi` (nhãn thêm "(Live-edit)"), giữ nguyên 5 entry chi
  tiết hệ sinh thái không đổi.
- `AdminSidebar.tsx` — đổi key `navIcons` từ `/admin/projects` →
  `/admin/duan-cohoi` (icon `FolderKanban` giữ nguyên).
- `dashboard/page.tsx` — đổi key `TABLE_FOR_HREF` từ `/admin/projects` →
  `/admin/duan-cohoi` (vẫn map đúng 1 bảng `projects`, giữ số đếm — cùng
  cách `home-cards` giữ số đếm dù đã chuyển sang Live-edit, vì đây vẫn là
  route 1:1 với đúng 1 bảng, khác các route Live-edit merge-2-bảng như
  Mirror/Journal).

**Verify:** `rm -rf .next && npm run build` (route `/admin/duan-cohoi`
xuất hiện đúng, `/admin/projects` đã biến mất), `tsc`/`eslint` sạch (1
warning tự phát hiện — `Link` import không dùng nữa ở `page.tsx` sau khi
tách `ProjectCards.tsx`, đã xoá), `vitest run` 139/139.

## Bug đã sửa — 5 trang chi tiết hệ sinh thái crash + popup Live-edit bị cắt cụt

Founder báo "5 trang con hệ sinh thái đang bị lỗi" ngay sau khi build
xong. Test thật (chạy `next dev`, tạm bỏ biến môi trường Supabase để
`/portal/*` công khai theo đúng fallback đã có sẵn trong
`middleware.ts` — "Portal is intentionally left public when Supabase
isn't configured", vì sandbox không có tài khoản đăng nhập thật) phát
hiện 2 lỗi thật, cả 2 đều tự gây ra khi xây `EcosystemOverview.tsx`/
`EditableRegion.tsx`:

**Lỗi 1 — crash thật, cả 5 trang đều 500:** `Error: Functions cannot be
passed directly to Client Components`. Nguyên nhân: `Ecosystem.icon` có
kiểu `LucideIcon` (1 component/function reference, gán trực tiếp — vd.
`icon: Layers` trong `ecosystems.ts`) — `[ecosystemSlug]/page.tsx` (Server
Component) truyền thẳng cả `eco` (chứa `icon`) xuống `EcosystemOverview`
("use client") khi tách component. Function KHÔNG serialize được qua
ranh giới Server→Client — đúng loại lỗi đã có sẵn tiền lệ tránh ở
`PillarEntranceCard.tsx` (`home_cards`, xem comment gốc "Next.js RSC
boundary") nhưng bị bỏ sót khi tách `EcosystemOverview.tsx` lần này.

**Đã sửa:** `[ecosystemSlug]/page.tsx` tách `icon` ra khỏi `eco` bằng
destructuring (`const { icon: _ecoIcon, ...ecoWithoutIcon } = eco`) trước
khi truyền xuống Client Component, truyền thêm `iconSlug={eco.slug}`
(chuỗi thuần). `EcosystemOverview.tsx` nhận `eco: Omit<Ecosystem, "icon">`
+ `iconSlug: string`, tự resolve icon thật qua `ICON_BY_SLUG` (map cục bộ
trong chính file client, cùng kỹ thuật `PillarEntranceCard`'s `ICONS`).

**Lỗi 2 — popup "Sửa nhanh" bị cắt cụt, không kéo xuống xem hết field
được, kèm giật hình khi bấm bút:** phát hiện khi test popup thật (dựng 1
route dev-preview tạm thời ngoài `/portal`/`/admin` để bọc
`EditModeProvider` mà không cần đăng nhập, dùng Playwright chụp + thao
tác click/scroll, xoá route này ngay sau khi xác nhận xong — không phải
tính năng, chỉ là công cụ test tạm). Nguyên nhân: MỌI trang Portal
Live-edit đều có 1 wrapper ngoài cùng `overflow-hidden` (kỹ thuật
full-bleed khí quyển nền — `-mx-4 -my-6 min-h-full overflow-hidden
md:-mx-8 md:-my-8` ở `MirrorChamber`/`LearningJournalNotebook`/
`MyStoryBook`/`JourneyMapAtlas`/`GardenExperience`, và card
`overflow-hidden rounded-2xl` ở `ProjectCards`/`EcosystemOverview`).
`EditableRegion`'s popup cũ dùng `position: absolute` NẰM BÊN TRONG cây
DOM bị `overflow-hidden` này — bị cắt cụt theo đúng khung `overflow-hidden`
gần nhất, không có cách nào cuộn xem phần bị cắt. Đây là lỗi **hệ thống**,
tồn tại ở cả 8 bản sao `EditableRegion.tsx` (mirror/journal/story/
journey-map/garden/gem-home/su-menh-companion/opportunities) — không
phải riêng module Dự án & Cơ hội, chỉ là module này lộ ra rõ nhất vì có
nhiều field nhất (9-10 field/popup) nên chiều cao popup chắc chắn vượt
quá phần còn lại nhìn thấy được trong khung `overflow-hidden`.

**Đã sửa (áp dụng đồng loạt cho cả 8 file, giữ đúng nguyên tắc "8 bản sao
byte-for-byte, chỉ khác import"):** popup giờ render qua React
`createPortal` thẳng vào `document.body` — thoát khỏi MỌI
`overflow-hidden`/stacking context của tổ tiên. Định vị bằng
`position: absolute` (không phải `fixed`, để popup cuộn tự nhiên theo
trang) tính từ toạ độ thật của vùng trigger
(`getBoundingClientRect() + window.scrollX/scrollY`), kèm
`max-h-[70vh] overflow-y-auto` để tự cuộn bên trong khi danh sách field
dài hơn màn hình, và tự kẹp lại trong chiều ngang viewport (không tràn
phải khi trigger nằm sát mép phải). Đã verify bằng Playwright: bounding
box popup đúng `max-h-[70vh]` (420px ở viewport 600px cao), cuộn bên
trong panel đến tận nút "Lưu" ở cuối danh sách field — xác nhận `visible:
true`.

**Chưa xử lý — Founder cũng báo "không có mục xoá":** đúng như thiết kế
(nhất quán với Mirror/Journal/`home_cards` — Live-edit Cách A chỉ sửa
field + kéo-thự tự, không add/xoá record), KHÔNG phải bug. Cần Founder
xác nhận có muốn thêm khả năng xoá 1 hệ sinh thái qua
`ProjectCards.tsx`/hub Live-edit hay không trước khi xây — chưa tự thêm.

**File sửa:** `src/components/portal/opportunities/EcosystemOverview.tsx`,
`src/app/portal/duan-cohoi/[ecosystemSlug]/page.tsx`, và cả 8 file
`EditableRegion.tsx` (mirror/journal/story/journey-map/garden/gem-home/
su-menh-companion/opportunities — nội dung giờ byte-for-byte giống hệt
nhau, xác nhận qua `md5sum`).

**Verify:** test thật qua `next dev` (không chỉ `tsc`/`build`) — xác nhận
cả 5 trang chi tiết hệ sinh thái trả `200` + render đúng nội dung thật từ
`ecosystem_chrome` (không còn lỗi trong log dev server), popup Live-edit
cuộn được đầy đủ qua Playwright. `tsc`/`eslint` sạch, `rm -rf .next && npm
run build` sạch, `vitest run` 139/139.

## Premium — Dashboard Live-edit (mới, theo yêu cầu riêng của Founder)

Founder yêu cầu thêm 1 trang Admin mới cho nhóm "Premium": "Dashboard
thiết kế Live-edit", **giữ nguyên `/admin/course-pricing`** ("Giá khoá học
Premium" — bảng `courses`, giá + trạng thái mở bán) không đổi gì.

**Audit trước khi build:** `/portal/premium/page.tsx` (Server Component,
248 dòng) có nhiều khối chữ tĩnh: Hero (eyebrow/title 2 dòng/subtitle + 2
CTA neo anchor), 2 nhãn section ("Lớp học AI"/"Ba lớp học..." và "Chương
trình hệ thống"/"Xây hệ thống Affiliate..."), khối "Thanh toán hoạt động
thế nào" (4 bước — `PAYMENT_STEPS`), khối FAQ (4 câu —
`PREMIUM_FAQ`)... cộng thêm 3 sub-component riêng
(`PremiumAdvisor`/`PremiumConsult`/`FounderSpotlight`) và `PREMIUM_PROGRAMS`
(5 chương trình, `icon: LucideIcon` + accent màu — cùng rủi ro
`ecosystems.ts`/`eco.icon` đã gặp ở Phần D). Đã hỏi Founder phạm vi cụ
thể trước khi build (theo đúng nguyên tắc "STOP khi ranh giới không rõ") —
Founder chọn phạm vi **an toàn nhất**: chỉ Hero + 2 nhãn section + 4 bước
thanh toán + FAQ. KHÔNG đụng `PREMIUM_PROGRAMS`/`PremiumAdvisor`
(targetHref gắn anchor thật)/`PremiumConsult` (số điện thoại/Zalo)/
`FounderSpotlight` (hồ sơ Founder) — tất cả vẫn tĩnh 100% trong code.

**Phát hiện kiến trúc mới (khác mọi module trước) — 1 bảng chrome cần
hiển thị ở NHIỀU vị trí rải rác trong 1 trang:** `premium_chrome` (10
field: Hero 4 field + 2 cặp nhãn section + 2 tiêu đề khối) cần xuất hiện
ở ít nhất 4 vị trí khác nhau trong JSX (Hero, trước lưới lớp học, trước
lưới hệ thống, trong khối thanh toán, trong khối FAQ) — xen kẽ với
`PremiumAdvisor`/`PremiumConsult`/`FounderSpotlight` (không đụng). Nếu để
MỖI vị trí tự gọi `useCollection("premium-chrome", ...)` riêng, mỗi vị trí
giữ 1 bản sao state cục bộ KHÔNG đồng bộ — sửa Hero xong, nhãn section vẫn
hiện giá trị cũ tới khi tải lại trang.

**Giải quyết — pattern MỚI (chưa dùng ở module nào trước đây trong dự
án):** `PremiumChromeContext.tsx` — 1 Context Provider gọi DUY NHẤT 1 lần
`useCollection("premium-chrome", [seedChrome], {enabled: useEditMode()})`,
chia sẻ `{chrome, update}` qua React Context cho mọi component con
(`PremiumHeroBlock`/`PremiumSectionHeading`/tiêu đề trong
`PremiumPaymentSteps`/`PremiumFaqList`) qua hook `usePremiumChrome()` —
luôn đồng bộ ngay sau khi lưu, không cần tải lại trang. Đây là giải pháp
chung có thể tái dùng cho module tương lai nào cũng gặp tình huống "1
bảng chrome, nhiều vị trí hiển thị rải rác".

**`PremiumSectionHeading.tsx` — component dùng chung cho 2 nhãn section**
(nhận `eyebrowKey`/`titleKey` làm tham số thay vì viết lặp lại 2 lần) —
tránh trùng lặp vì cả 2 section dùng chung 1 cấu trúc eyebrow+title.

**File mới:**
- `supabase-phase19-premium-chrome.sql` — 3 bảng: `premium_chrome`
  (singleton), `premium_payment_steps` (4 dòng), `premium_faq` (4 dòng).
  Đã áp dụng qua Supabase MCP (`apply_migration`, `success: true`).
- `src/lib/portal/live-premium.ts` — `getLivePremiumChrome()`/
  `getLivePremiumPaymentSteps()`/`getLivePremiumFaq()`, đúng shape thô
  (`id`/`status` + field gốc) ngay từ đầu — áp dụng bài học
  `description`/`what` mà không cần sửa lại lần 2.
- `src/components/portal/premium/EditModeContext.tsx` +
  `EditableRegion.tsx` (bản sao thứ 9, byte-for-byte giống 8 bản còn lại —
  đã xác nhận qua `md5sum`, cùng cập nhật cả 9 file lên "9 bản sao" trong
  comment).
- `src/components/portal/premium/PremiumChromeContext.tsx` — Context
  Provider chia sẻ chrome/update (pattern mới, xem trên).
- `src/components/portal/premium/PremiumHeroBlock.tsx`,
  `PremiumSectionHeading.tsx`, `PremiumPaymentSteps.tsx`,
  `PremiumFaqList.tsx` — tách khỏi JSX hardcode cũ trong `page.tsx`.
- `src/app/admin/(dashboard)/premium/dashboard/page.tsx` — route Live-edit
  mới, render lại `PremiumPage` (`/portal/premium/page.tsx` thật) bọc
  `<EditModeProvider>`.

**File sửa:**
- `src/app/portal/premium/page.tsx` — xoá `PAYMENT_STEPS`/`PREMIUM_FAQ`
  hardcode, bọc phần nội dung liên quan trong
  `<PremiumChromeProvider seedChrome={chrome}>`, thay khối Hero/2 nhãn
  section/khối thanh toán/FAQ bằng 4 component mới. 2 CTA neo Hero VÀ
  `PremiumAdvisor`/`PremiumConsult`/`FounderSpotlight`/`PREMIUM_PROGRAMS`
  giữ nguyên 100%, không đụng.
- `src/lib/admin/supabaseCollections.ts` — thêm 3 dòng
  `premium-chrome`/`premium-payment-steps`/`premium-faq`.
- `src/lib/admin/nav.ts` — nhóm "Premium" thêm entry mới `"Dashboard
  (Live-edit)"` → `/admin/premium/dashboard`, GIỮ NGUYÊN entry "Giá khoá
  học Premium" → `/admin/course-pricing` không đổi.
- `src/components/admin/AdminSidebar.tsx` — thêm icon `Crown` cho
  `/admin/premium/dashboard`.
- `dashboard/page.tsx` — không thêm `TABLE_FOR_HREF` (route merge 3 bảng,
  cùng cách Mirror/Journal/6-khối-Companion), cập nhật comment chung.

**Verify:** test thật qua `next dev` (Supabase env tạm bỏ để `/portal/*`
công khai theo đúng fallback có sẵn) — `/portal/premium` trả `200`, nội
dung Hero/nhãn section/payment/FAQ render đúng, 0 lỗi log server. Test
riêng cơ chế Context chia sẻ (dựng route dev-preview tạm bỏ ngay sau khi
xong, không phải tính năng) qua Playwright: sửa Hero → popup hiện đầy đủ,
không giật/không cắt cụt (đúng bản vá `EditableRegion` trước đó); lỗi
mạng 500 khi lưu là do sandbox không có Supabase thật cấu hình (giới hạn
đã biết, không phải bug — cơ chế optimistic update của `useCollection()`
là hạ tầng có sẵn, không đổi). `tsc`/`eslint` sạch, `rm -rf .next && npm
run build` sạch, `vitest run` 139/139.

**Chưa tự test được:** lưu thật qua Admin UI có tài khoản đăng nhập
(cùng giới hạn sandbox đã nêu nhiều lần) — Founder tự test trên Preview
URL `/admin/premium/dashboard`.

## Dự án & Cơ hội — "Cập nhật thông tin mới" (băng bài viết) + "Đánh giá" nâng cấp (mới, theo yêu cầu riêng)

Founder yêu cầu: (1) đổi "Bài viết liên quan" thành "Cập nhật thông tin
mới" — băng bài viết ảnh+chữ chạy liên tục phải→trái, dừng khi chạm/hover,
bấm vào đi tới trang chi tiết; áp dụng cho CẢ hệ sinh thái và từng dự án
con, dùng CHUNG 1 form cho mọi hệ sinh thái hiện có và tương lai (6, 7,
8...); (2) nâng cấp mục "Đánh giá" (Phân tích tiềm năng) — Admin chọn
trạng thái Đạt (kèm sao 1-5) / Chưa đạt (kèm lý do: thiếu thông tin/đang
thẩm định) / Chưa đánh giá cho từng tiêu chí, áp dụng cả cấp hệ sinh thái
và dự án con. Đã hỏi 4 điểm mơ hồ trước khi build (không tự quyết định):

1. **"Đường link liên kết" của bài viết** — Founder xác nhận là link CTA
   cuối bài, trỏ thẳng link đăng ký thật của hệ sinh thái/dự án con đó
   (không phải đích điều hướng chính — điều hướng chính là trang chi tiết
   tự động theo slug, hiển thị đầy đủ "nội dung").
2. **Ảnh** — dán URL ảnh đã host sẵn (cùng pattern `thumbnail_url` của
   `case_studies`), KHÔNG xây upload ảnh thật (ngoài phạm vi). 3 ảnh
   Founder gửi cho DigiU lưu làm file tĩnh trong `public/images/duan-cohoi/digiu/`.
3. **Phạm vi "Đánh giá"** — Founder chọn "chỉ đổi trạng thái, giữ nguyên
   danh sách tiêu chí" — 6 tiêu chí GIỮ NGUYÊN cố định trong code
   (`DEFAULT_POTENTIAL_ANALYSIS`, mỗi tiêu chí có `id` ổn định), Admin
   không tự thêm/sửa/xoá tiêu chí qua UI.
4. **3 hệ sinh thái từng bị bỏ băng bài viết** (Blockchain & Crypto,
   Affiliate, Sàn giao dịch — Product Owner từng yêu cầu bỏ hẳn "Bài viết
   liên quan" ở 3 trang này) — Founder xác nhận **đảo ngược quyết định
   cũ**, áp dụng lại băng bài viết mới cho **cả 5 hệ sinh thái**.

**Kiến trúc dữ liệu — 2 bảng generic MỚI, dùng chung cho MỌI hệ sinh thái
(không hardcode theo từng hệ sinh thái, đúng yêu cầu mở rộng 6/7/8...):**

- `ecosystem_articles` (migration `supabase-phase20-ecosystem-articles-ratings.sql`)
  — schema `id/data jsonb/status/order`, mỗi dòng có `ecosystemId`
  (`eco.id`) + `subProjectId` (`""` = cấp hệ sinh thái, khác rỗng = CHỈ
  của đúng 1 dự án con đó — không lẫn 2 cấp) + `slug/title/content/
  imageUrl/linkLabel/linkUrl/seoTitle/metaDescription/displayOrder`.
  `displayOrder` là field THƯỜNG trong `data` (không phải cột `order`
  ngoài — cột đó không trả về qua GET route generic, xem comment trong
  route) — Admin tự nhập số thứ tự, KHÔNG kéo-thả (tránh phức tạp
  `reorder()` bulk-replace ảnh hưởng chéo giữa nhiều hệ sinh thái cùng
  chung 1 bảng).
- `ecosystem_ratings` — mỗi dòng khoá `${entityId}__${criterionId}`
  (entityId = `eco.id` hoặc `sub.id`, criterionId = 1 trong 6 id cố định
  của `DEFAULT_POTENTIAL_ANALYSIS`). Pre-seed sẵn 60 dòng (10 thực thể ×
  6 tiêu chí, migration) — `update()` (PATCH) luôn tìm thấy dòng có sẵn
  cho 10 thực thể hiện có; hệ sinh thái/dự án con MỚI thêm sau (chưa có
  dòng seed) — `PotentialAnalysisLive.tsx`'s `saveCriterion()` tự `add()`
  dòng mới thay vì `update()`, không cần chạy lại migration khi mở rộng.

**Bug tự phát hiện và sửa TRƯỚC khi có code nào đọc (không phải bug đã
xuất bản):** field tri-state của `ecosystem_ratings` ban đầu đặt tên
`"status"` bên trong `data` — trùng tên với cột `status` (Draft/Published)
ngoài `data` mà GET route generic merge ĐÈ SAU CÙNG lên `data` (đúng bug
đã ghi trong CLAUDE.md mục "Bug đã sửa: GET không trả status"). Phát hiện
ngay khi viết `live-ecosystem-ratings.ts`, sửa bằng `execute_sql` đổi tên
thành `"ratingStatus"` (60 dòng) trước khi build bất kỳ component nào đọc
field này — đã verify lại qua Supabase MCP xác nhận đổi tên đúng.

**`PotentialAnalysisStatus` đổi taxonomy** (`ecosystems.ts`): từ
`"not-assessed"|"met"|"not-met"|"partial"` (4 trạng thái, không sao)
sang `"not-assessed"|"met"|"not-met"` (3 trạng thái — bỏ "partial", không
dòng dữ liệu thật nào từng dùng nên xoá an toàn) + field mới
`stars?: number` (1-5, chỉ có ý nghĩa khi `met`) + `notMetReason?:
"thieu-thong-tin"|"dang-tham-dinh"` (chỉ có ý nghĩa khi `not-met`). Mỗi
`PotentialAnalysisItem` giờ có `id` ổn định (criterionId). Hàm mới
`statusBadgeLabel()` (`PotentialAnalysisTable.tsx`, export dùng chung cho
cả bản tĩnh và bản Live) render "Đạt ★★★☆☆" / "Chưa đạt — Đang thẩm định" /
"Chưa đánh giá".

**File mới:**
- `supabase-phase20-ecosystem-articles-ratings.sql` — 2 bảng + seed 60
  dòng đánh giá mặc định + 3 bài viết thật DigiU (nội dung đầy đủ, không
  rút gọn — plain text, KHÔNG markdown syntax, đúng convention dự án
  "chưa có thư viện markdown, không thêm dependency mới"). Đã áp dụng qua
  Supabase MCP + sửa `ratingStatus` qua `execute_sql` (xem trên).
- `src/lib/portal/live-ecosystem-articles.ts` — `getAllLiveEcosystemArticles()`
  (toàn bảng, dùng làm `seed`), `getLiveEcosystemArticles(ecosystemId,
  subProjectId?)` (đã lọc Published+scope, dùng cho băng chạy thật),
  `getLiveEcosystemArticleBySlug()` (trang chi tiết).
- `src/lib/portal/live-ecosystem-ratings.ts` — `getAllLiveEcosystemRatings()`,
  `getLiveEcosystemRatingRows(entityId)`.
- `src/components/portal/opportunities/ArticleTicker.tsx` — Component
  THUẦN HIỂN THỊ (không hook), băng chạy CSS (`.eco-article-marquee*`,
  `globals.css`, cùng kỹ thuật `.tools-marquee` ở Landing — track render 2
  lần, animate `-50%` loop liền mạch, dừng khi hover/focus).
- `src/components/portal/opportunities/ArticlesAdminPanel.tsx` — panel
  thêm/sửa/xoá bài viết, CHỈ hiện khi `editMode=true`, dùng
  `add`/`update`/`remove` truyền vào từ ngoài (không tự gọi
  `useCollection()` riêng).
- `src/components/portal/opportunities/EcosystemArticlesSection.tsx` — 1
  `useCollection("ecosystem-articles", allSeed, {enabled: editMode})` DUY
  NHẤT chia sẻ giữa `ArticleTicker` (hiển thị) và `ArticlesAdminPanel`
  (CRUD) — tránh 2 instance không đồng bộ (cùng lý do
  `PremiumChromeContext`).
- `src/components/portal/opportunities/PotentialAnalysisLive.tsx` — bản
  Live-edit của "Đánh giá", dùng `EditableRegion` có sẵn (module
  `opportunities`, không tạo bản sao thứ 10) bọc từng ô trạng thái tiêu
  chí; `saveCriterion()` tự chọn `update()`/`add()` tuỳ dòng đã tồn tại
  hay chưa (xem "mở rộng" ở trên).
- `src/app/portal/duan-cohoi/[ecosystemSlug]/cap-nhat/[articleSlug]/page.tsx`
  — trang chi tiết bài viết, 1 route DÙNG CHUNG cho mọi hệ sinh thái/dự án
  con (không nhân bản). KHÁC route cũ `/portal/duan-cohoi/bai-viet/[slug]`
  (đọc `digitalAssetArticles`, dữ liệu khác hẳn, vẫn giữ nguyên).
- `src/app/admin/(dashboard)/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page.tsx`
  — Live-edit (Cách A) cấp dự án con, 1 route dynamic phục vụ cả 5 dự án
  con hiện có (3 DigiU + 2 SolarGroup).
- `public/images/duan-cohoi/digiu/*.png` — 3 ảnh thật Founder gửi.

**File sửa:**
- `src/data/portal/ecosystems.ts` — taxonomy `PotentialAnalysisStatus`
  mới + `id` ổn định cho 6 tiêu chí (xem trên).
- `src/components/portal/opportunities/PotentialAnalysisTable.tsx` — bản
  ĐỌC TĨNH (giữ làm fallback/tham khảo, không còn dùng trực tiếp ở 2 trang
  thật), cập nhật taxonomy, export `STATUS_STYLE`/`STATUS_ICON`/
  `statusBadgeLabel` cho `PotentialAnalysisLive.tsx` dùng chung.
- `src/lib/admin/supabaseCollections.ts` — thêm `ecosystem-articles`/
  `ecosystem-ratings`.
- `src/app/portal/duan-cohoi/[ecosystemSlug]/page.tsx` — xoá hẳn
  `ArticlesSection` cũ (digitalAssetArticles-based) + biến
  `categories`/`articles`/`potentialAnalysis`; cả 4 nhánh `structureType`
  giờ đều gọi `PotentialAnalysisLive` + `EcosystemArticlesSection` (áp
  dụng lại băng bài viết cho tất cả 5 hệ sinh thái, theo yêu cầu #4).
- `src/app/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page.tsx`
  — thay `PotentialAnalysisTable`/empty-state "Chưa có bài viết riêng" cũ
  bằng `PotentialAnalysisLive`/`EcosystemArticlesSection`
  (`subProjectId={sub.id}` — băng bài viết RIÊNG của dự án con, không lẫn
  cấp hệ sinh thái cha).
- `src/lib/admin/nav.ts` — nhóm "Dự án & Cơ hội" thêm 5 entry con "→ Dự án
  con: ..." dưới mỗi hệ sinh thái loại `sub-projects` (DigiU/SolarGroup).

**Verify:** `tsc`/`eslint`/`rm -rf .next && npm run build` sạch (route
`/portal/duan-cohoi/[ecosystemSlug]/cap-nhat/[articleSlug]`,
`/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]`,
`/admin/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` xuất hiện đúng),
`vitest run` 139/139. **Test thật qua `next dev` với anon key thật** (dán
tạm vào biến môi trường process, xoá ngay sau khi test xong, không commit
— route dev-preview tạm `devtest-eco` ngoài `/portal`/`/admin` để đọc
thẳng qua `getLiveEcosystemArticles()`/`getLiveEcosystemArticleBySlug()`/
`getLiveEcosystemRatingRows()` mà không cần đăng nhập, xoá route này ngay
sau khi xác nhận xong): xác nhận cả 3 bài viết DigiU đọc đúng
(title/content 6938 ký tự/imageUrl/linkLabel/linkUrl), `getLiveEcosystemArticleBySlug()`
tìm đúng bài theo slug, cả 6 dòng `ecosystem_ratings` của `eco_digiu` đọc
đúng field `ratingStatus` (xác nhận bug field-collision đã sửa đúng, xem
trên). Cũng test không có Supabase (mặc định sandbox) — mọi route mới
trả `200`, 0 lỗi log server, băng bài viết/bảng đánh giá hiện đúng trạng
thái honest-empty ("Chưa có bài viết nào"/"Chưa đánh giá" cho toàn bộ 6
tiêu chí).

**Chưa tự test được:** thêm/sửa/xoá bài viết + sửa Đánh giá qua Admin UI
thật có tài khoản đăng nhập (cùng giới hạn sandbox đã nêu nhiều lần) —
Founder tự test trên Preview URL `/admin/duan-cohoi/digiu` (và 4 hệ sinh
thái khác + 5 route dự án con).

## Dự án & Cơ hội — Bài viết: ảnh phụ + nhiều link (kể cả affiliate) (mở rộng riêng)

Founder yêu cầu riêng ngay sau mục trên: "chèn hình ảnh, link bên ngoài
vào... để admin linh động và tuỳ biến bài viết hơn" + "có thể thay đổi
được tất cả các link liên kết và link affiliate". Đã hỏi trước khi build
(dự án chưa có trình soạn thảo dạng khối/markdown nào) — Founder chọn
phương án đơn giản: **gắn theo bài** (danh sách ảnh phụ + danh sách link
không giới hạn số lượng, hiển thị ở khu vực riêng trong trang chi tiết),
**không** chèn tại đúng vị trí con trỏ trong nội dung (sẽ cần xây block
editor mới, việc lớn hơn hẳn, ngoài phạm vi).

**Đổi shape `data` của `ecosystem_articles`** (không đổi schema bảng,
vẫn `id/data jsonb/status/order`):
- `images: {url, caption}[]` — MỚI, ảnh phụ hiện dưới nội dung bài (khác
  `imageUrl` — ảnh bìa/thumbnail cho thẻ trong băng chạy, giữ nguyên tách
  biệt, không gộp 2 khái niệm).
- `links: {label, url, affiliate}[]` — THAY THẾ hẳn 2 field đơn
  `linkLabel`/`linkUrl` cũ (không giới hạn số lượng/bài, hiện thành dãy
  nút ở cuối bài). Mỗi link tự đánh dấu `affiliate` — hiện nhãn
  "Affiliate" ngoài Portal khi bật, đúng tinh thần minh bạch NO-FAKE-DATA
  đã áp dụng xuyên suốt dự án.

**Migrate 3 bài viết seed DigiU** (`supabase-phase21-ecosystem-articles-images-links.sql`,
đã áp dụng qua `execute_sql`): mỗi bài đang có 1 `linkLabel`/`linkUrl` →
chuyển thành `links: [{label, url, affiliate: false}]` (affiliate mặc
định `false` — link đăng ký DigiU hiện có, Founder tự bật `true` qua
Admin nếu xác nhận đây thực sự là link tiếp thị liên kết/referral, không
tự suy đoán), `images: []`. Đã verify lại qua Supabase MCP + qua
`getLiveEcosystemArticleBySlug()` thật (route dev-preview tạm, xoá ngay
sau khi test) — cả 3 bài đọc đúng shape mới.

**`ArticlesAdminPanel.tsx`** — thêm 2 sub-editor lặp lại tự dựng
(`ImagesEditor`/`LinksEditor`, không dùng `FieldInput`/`FieldConfig`
chuẩn vì kiểu đó chỉ hỗ trợ `string[]` phẳng qua `type: "tags"`, không hỗ
trợ mảng object): mỗi dòng ảnh có URL + chú thích + nút xoá; mỗi dòng
link có nhãn + URL + checkbox Affiliate + nút xoá; cả 2 đều có nút
"Thêm ảnh"/"Thêm liên kết" ở cuối. Bỏ hẳn 2 field đơn `linkLabel`/
`linkUrl` khỏi `ARTICLE_FIELDS`.

**Trang chi tiết bài viết** — ảnh phụ hiện dạng lưới 2 cột dưới nội dung
(mỗi ảnh có `<figcaption>` nếu có chú thích); link hiện thành dãy nút màu
`brand-blue` ở cuối bài, link nào `affiliate: true` có thêm badge nhỏ
"Affiliate" ngay trên nút.

**Verify:** `tsc`/`eslint`/`rm -rf .next && npm run build` sạch,
`vitest run` 139/139. Test thật qua `next dev` với anon key thật (cùng kỹ
thuật route dev-preview tạm, xoá ngay sau khi xong) — xác nhận
`getLiveEcosystemArticleBySlug()` trả đúng `images: []`/`links: [...]`
sau migrate; test không có Supabase (mặc định sandbox) — route chi tiết
vẫn `200`, 0 lỗi log server (mảng rỗng không crash render gallery/link).

**Chưa tự test được:** thêm ảnh/link qua Admin UI thật có tài khoản đăng
nhập (cùng giới hạn sandbox) — Founder tự test trên Preview URL
`/admin/duan-cohoi/digiu`.

## Đính chính — phạm vi bỏ hover-lift thực ra hẹp hơn ban đầu

Sau khi báo cáo xong việc "bỏ hover-lift" ở mục trên, Founder xác nhận
phạm vi thật hẹp hơn nhiều so với cách hiểu ban đầu ("mọi thẻ bài
viết/nội dung trong portal"):

- **Khôi phục lại hover-lift ở TOÀN BỘ 10 file site-wide** đã lỡ bỏ
  (`congdongai/page.tsx`, `TodayGoals.tsx`, `SubProjectsSection.tsx`,
  `duan-cohoi/page.tsx`, `RoadmapInteractive.tsx`, `hanhtrinhcuatoi/page.tsx`,
  `aiworkspace/page.tsx`, `aiworkspace/[slug]/page.tsx`, `ProjectCards.tsx`,
  `AiSpaceSections.tsx`) — 24 vị trí, đưa lại đúng
  `hover:-translate-y-1`/`hover:-translate-y-0.5` như trước đợt sửa trước.
  Các thẻ này (thẻ hệ sinh thái, thẻ công cụ AI, thẻ mục tiêu, nút lộ
  trình, thẻ "cửa" Hành trình...) **không phải "bài viết"** theo đúng ý
  Founder — hover-lift ở đây vẫn được giữ.
- **Hiệu ứng băng chạy tự động phải→trái** (`.eco-article-marquee-track`,
  CSS animation liên tục của `ArticleTicker`) — **giữ nguyên, không đụng**
  (đã có ý định bỏ ở 1 phương án nhưng Founder xác nhận không cần).
- **Chỉ đúng 1 chỗ KHÔNG dùng hover-lift:** thẻ bài viết bên trong băng
  "Cập nhật thông tin mới" (`ArticleTicker.tsx`) — khi khách bấm vào 1 thẻ
  để đọc từng bài, thẻ đó không "nhô lên" khi hover. Đây là component DÙNG
  CHUNG cho mọi hệ sinh thái + dự án con (không hardcode riêng từng nơi),
  nên áp dụng tự động cho DigiU/SolarGroup/... và mọi hệ sinh thái/dự án
  con tương lai mà không cần sửa thêm gì.

**Bài học:** yêu cầu gốc "bỏ hiệu ứng nhô lên cho tất cả các bài viết
trong portal" đã bị hiểu quá rộng thành "mọi thẻ nội dung" — đúng ra chỉ
áp dụng cho đúng khái niệm "bài viết" (khối "Cập nhật thông tin mới"),
không phải mọi loại thẻ khác trong Portal.

## Dự án con — thêm field "Giới thiệu chi tiết" (fullIntro) cho ngang bằng dự án chính

Founder xác nhận Admin dự án con (AlphaMind, WebWisePay...) cần sửa được
thông tin tương tự dự án chính (DigiU, SolarGroup...) — trước đó
`ecosystem_subprojects` chỉ có `name`/`shortDescription`/`links`, thiếu
đúng 1 field so với hệ sinh thái chính: đoạn giới thiệu dài
(`fullIntro`, đã có ở `ecosystem_chrome` từ trước — xem mục "Nhóm 3, Phần D").

Đã thêm `fullIntro: string` vào `SubProjectRow`
(`live-subprojects.ts`, đọc từ `data.fullIntro`, mặc định chuỗi rỗng —
KHÔNG bắt buộc, khác `fullIntro` của hệ sinh thái chính vốn `required:
true`, vì 5 dự án con hiện có chưa có nội dung này) +
`SUBPROJECT_FIELDS` (`SubProjectsAdminPanel.tsx`, textarea) + hiển thị
trên trang chi tiết dự án con
(`[subProjectSlug]/page.tsx`, ngay dưới `shortDescription`, CHỈ hiện khi
có nội dung — tránh đoạn trống cho 5 dự án con hiện có chưa điền).
`links` (đăng ký/liên kết) và `name` đã có sẵn từ trước, không cần thêm.

**Verify:** `tsc`/`eslint` sạch, `rm -rf .next && npm run dev` (không cấu
hình Supabase) — cả 7 route liên quan (`duan-cohoi`, `duan-cohoi/digiu`,
`duan-cohoi/digiu/alphamind`, `duan-cohoi/solargroup/sovelmash`,
`aiworkspace`, `hanhtrinhcuatoi`, `congdongai`) trả `200`, 0 lỗi log.

**Chưa tự test được:** sửa field mới qua Admin UI thật có tài khoản đăng
nhập (cùng giới hạn sandbox) — Founder tự test tại
`/admin/duan-cohoi/digiu` → khối "Quản lý dự án con".

## Bug đã sửa — hover-lift còn sót ở trang chi tiết bài viết + Admin dự án con chưa sửa được trực tiếp

Founder test lại và báo 2 vấn đề, cả 2 đều là bug thật (không phải hiểu
sai phạm vi):

**1. Hover-lift còn sót ở `/portal/duan-cohoi/[ecosystemSlug]/cap-nhat/[articleSlug]`.**
Đợt audit trước chỉ grep theo `hover:-translate-y` (Tailwind utility) nên
bỏ sót `card-shine` — 1 class CSS RIÊNG (`globals.css` dòng ~157, dùng ở
hàng chục trang khác trong Portal như login/case-studies/prompts...) có
`transform: translateY(-5px) scale(1.015)` trên `:hover`, không hiện ra
qua grep `hover:` vì không phải Tailwind utility literal trong JSX. Trang
chi tiết bài viết bọc `<article className="card-shine ...">` — đây chính
là hiệu ứng nhô lên Founder vẫn thấy. **Không sửa CSS `.card-shine` dùng
chung** (ảnh hưởng hàng chục trang khác, ngoài phạm vi) — chỉ bỏ đúng
class này khỏi 1 dòng `<article>` ở trang chi tiết bài viết. Route này
DÙNG CHUNG cho cả 5 hệ sinh thái (`cap-nhat/[articleSlug]/page.tsx`,
không nhân bản theo từng hệ sinh thái) nên sửa 1 lần áp dụng cho DigiU,
SolarGroup, Blockchain & Crypto, Affiliate, Sàn giao dịch cùng lúc.

**Bài học:** khi audit "còn sót hiệu ứng nhô lên ở đâu", không được chỉ
grep theo `hover:-translate-y` (Tailwind) — phải tính cả các class CSS
riêng định nghĩa `transform` trên `:hover` trong `globals.css`
(`card-shine`, `card-tilt`...).

**2. Admin dự án con (AlphaMind/WebWisePay/Sovelmash/AeroNova) chưa sửa
được tên/mô tả/link đăng ký TRỰC TIẾP trên trang riêng của nó.** Trước đó
`/admin/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` (Live-edit dự án con)
chỉ render lại `SubProjectPage` — phần tên/mô tả/`fullIntro`/link đăng ký
hoàn toàn TĨNH, không hề bọc `EditableRegion`. Cách DUY NHẤT sửa được các
field này trước đó là quay lại trang hệ sinh thái CHA
(`/admin/duan-cohoi/digiu`), cuộn tới panel danh sách "Quản lý dự án con"
— không nhất quán với mọi module Live-edit khác (Cách A: sửa TRỰC TIẾP
đúng tại vị trí hiển thị, không cần rời trang).

**Đã sửa:** `SubProjectChromeContext.tsx` (mới) — cùng pattern
`EcosystemChromeContext`/`PremiumChromeContext`: 1 `useCollection(
"ecosystem-subprojects", [seedSub], {enabled: editMode})` DUY NHẤT, lọc
`.find(s => s.id === seedSub.id)` (bảng có nhiều dòng, không phải
singleton). `SubProjectOverview.tsx` (mới, thay khối tiêu đề tĩnh) —
`EditableRegion` cho `name`/`shortDescription`/`fullIntro` (field
`fullIntro` hiện cả khi rỗng nếu đang ở edit mode, kèm placeholder "Chưa
có giới thiệu chi tiết — bấm để thêm" để Admin có chỗ bấm ADD, không chỉ
sửa khi đã có sẵn nội dung — Portal thật vẫn ẩn hẳn khi rỗng). `SubProjectLinksBox.tsx`
(mới, thay `<MarketingLinkBox links={sub.links}/>` tĩnh) — byte-for-byte
cùng logic `EcosystemLinksBox.tsx` (đọc/ghi qua Context, `MarketingLinksFieldEditor`
khi edit mode), chỉ khác nguồn Context. `[subProjectSlug]/page.tsx` bọc
`<SubProjectChromeProvider seedSub={sub}>` quanh cả 2 component mới +
`PotentialAnalysisLive`/`EcosystemArticlesSection` (giữ nguyên).

**Không đụng** `SubProjectsAdminPanel.tsx` (panel danh sách ở trang hệ
sinh thái cha, dùng cho Add/Xoá dự án con — vẫn cần, vì
`SubProjectChromeContext` mới chỉ sửa 1 dòng đã biết `id`, không tạo mới
được) — giờ Admin có CẢ 2 cách: sửa nhanh trực tiếp trên trang riêng của
dự án con (mới, ưu tiên dùng), hoặc quản lý danh sách/thêm/xoá ở trang hệ
sinh thái cha (giữ nguyên).

**Verify:** `tsc`/`eslint` sạch. Test thật qua `next dev` (không cấu hình
Supabase) — 4 trang dự án con
(`duan-cohoi/digiu/alphamind`, `duan-cohoi/digiu/webwisepay`,
`duan-cohoi/solargroup/sovelmash`, `duan-cohoi/solargroup/aeronova`) +
1 trang bài viết (`duan-cohoi/digiu/cap-nhat/digiu-la-gi-he-sinh-thai-cong-nghe`)
trả `200`, `/admin/duan-cohoi/digiu/alphamind` trả `307` redirect login
đúng như kỳ vọng (chưa đăng nhập), 0 lỗi log server.

**Chưa tự test được:** sửa tên/mô tả/giới thiệu/link qua Admin UI thật có
tài khoản đăng nhập (cùng giới hạn sandbox đã nêu nhiều lần) — Founder tự
test tại `/admin/duan-cohoi/digiu/alphamind` (và 3 dự án con khác), xác
nhận bút sửa (✎) hiện ngay trên tên/mô tả/link, không cần quay lại trang
DigiU cha nữa.

## Thêm nút "Lưu" tường minh cho "Đường link liên kết dự án"

Founder báo thiếu nút "Lưu" ở mục LIÊN KẾT. Nguyên nhân:
`MarketingLinksFieldEditor`'s `onChange` trước đó gọi thẳng `update()`
(PATCH mạng thật) ngay trên MỖI LẦN gõ phím (label/URL) hoặc tick
ẩn/hiện — không có staging cục bộ, không có nút Lưu tường minh, không có
chỉ báo "đã lưu"/"chưa lưu" nào — dễ gây cảm giác không lưu được hoặc
giật khi gõ nhanh.

**Đã sửa** cả 2 nơi đang dùng pattern auto-save này:
- `EcosystemLinksBox.tsx` (cấp hệ sinh thái chính — DigiU, SolarGroup).
- `SubProjectLinksBox.tsx` (cấp dự án con — AlphaMind/WebWisePay/Deposits/
  Sovelmash/AeroNova).

Cả 2 đổi sang: `draft` (state cục bộ, khởi tạo từ `chrome.links`/`sub.links`,
đồng bộ lại khi chuyển sang hệ sinh thái/dự án con khác) — mọi thao tác
thêm/sửa/xoá/ẩn-hiện trong `MarketingLinksFieldEditor` giờ chỉ đổi `draft`
cục bộ, KHÔNG gọi mạng. Thêm nút **"Lưu"** tường minh (chỉ bật khi
`draft` khác `chrome.links`/`sub.links` — so sánh qua `JSON.stringify`,
mảng nhỏ nên đủ nhẹ) + `SaveStateBadge` (cùng component dùng ở
`EditableRegion`, hiện "Có thay đổi chưa lưu"/"Đang lưu..."/"Đã lưu"/"Lưu
thất bại — thử lại") — chỉ thật sự PATCH khi bấm Lưu.

**Không đụng** `MarketingLinksFieldEditor.tsx` (giữ nguyên `onChange` gọi
ngay mỗi thay đổi — đúng, vì nơi dùng thứ 3 của nó,
`SubProjectsAdminPanel.tsx`, đã có sẵn nút Lưu ở CẤP FORM cha (`form.links`
chỉ là state cục bộ của form Add/Edit dự án con, PATCH thật chỉ chạy khi
bấm Lưu của form đó) — không cần sửa, tránh 2 lớp nút Lưu lồng nhau.

**Lưu ý phạm vi:** đây là component DÙNG CHUNG, không hardcode theo từng
hệ sinh thái — áp dụng ngay cho MỌI hệ sinh thái loại `structureType ===
"sub-projects"` (hiện tại DigiU + SolarGroup, cả cấp chính lẫn dự án con)
và tự động áp dụng cho hệ sinh thái mới cùng loại sau này. 3 hệ sinh thái
còn lại (Blockchain & Crypto/Affiliate/Sàn giao dịch) hiện KHÔNG có mục
"Đường link liên kết dự án" editable qua Admin ở cấp hệ sinh thái (dùng
cấu trúc khác — "Hai mảng"/"Chương trình tiếp thị"/"Sàn giao dịch", vẫn
đọc tĩnh từ `ecosystems.ts` theo đúng quyết định phương án (a) đã chốt ở
mục "Dự án & Cơ hội — bảng projects" — chưa mở rộng ở việc này, cần xác
nhận riêng nếu Founder muốn).

**Verify:** `tsc`/`eslint` sạch. Test thật qua `next dev` — 4 route
(`duan-cohoi/digiu`, `duan-cohoi/digiu/alphamind`, `duan-cohoi/solargroup`,
`duan-cohoi/solargroup/sovelmash`) trả `200`, 0 lỗi log server.

**Chưa tự test được:** bấm Lưu qua Admin UI thật có tài khoản đăng nhập
(cùng giới hạn sandbox) — Founder tự test tại `/admin/duan-cohoi/digiu`
và `/admin/duan-cohoi/digiu/alphamind`, xác nhận nút Lưu chỉ bật khi có
thay đổi và badge "Đã lưu" hiện đúng sau khi bấm.

## BUG NGHIÊM TRỌNG ĐÃ SỬA TẬN GỐC — PATCH route âm thầm rơi status về Draft khi patch không kèm status

Founder yêu cầu rà lại toàn bộ "Dự án & Cơ hội": Admin sửa/thêm/lưu/xoá
phải phản ánh đúng trên Portal. Audit code từng file (không chỉ đọc lại
report cũ) phát hiện **bug tái diễn của đúng lớp lỗi đã "vá" cho
`ecosystem_ratings`** (mục "Bug đã sửa: PATCH route generic" ở trên) —
nhưng lần này ở TẦNG GỐC (route dùng chung), không phải 1 điểm vá riêng lẻ.

**Nguyên nhân thật (đọc lại chính route, không suy đoán):**
`/api/admin/collections/[table]/[id]/route.ts`'s PATCH handler trước đó
`select("data")` — KHÔNG lấy cột `status` ngoài hiện tại của dòng. Khi
tính `status` mới để ghi xuống, code cũ đọc `merged.status` (tức
`{...existing.data, ...patch}.status`) — chỉ tồn tại nếu `status` VÔ
TÌNH nằm bên trong `data` jsonb (hiếm, chỉ đúng với vài bảng như
`ecosystem_subprojects`/`projects` nơi form Admin có field `status` rõ
ràng) — không tồn tại thì rơi thẳng về `"Draft"`. Đây CHÍNH LÀ bug đã ghi
nhận và "vá" cho `ecosystem_ratings` trước đó, nhưng bản vá đó chỉ sửa 1
điểm gọi (`PotentialAnalysisLive.tsx` ép `status: "Published"` thủ công
mỗi lần `update()`) — không sửa gốc route, nên MỌI component Live-edit
khác dùng `EditableRegion` (chỉ patch 1-2 field text, không quản
`status`) đều vẫn dính đúng bug này.

**Xác nhận THẬT qua Supabase MCP (không chỉ suy luận trên code):**
`ecosystem_chrome.eco_digiu` đã thật sự rơi về `status='Draft'` sau khi
Founder tự test sửa tên qua `EcosystemOverview` (tên hiện là "Hệ sinh
thái DigiU----", link nhãn "Đăng ký / đăng nhập DigiUbb" — rõ ràng chuỗi
test gõ thử, không phải nội dung thật) — đúng ngay lúc Founder báo cáo
"admin chỉnh sửa xong portal không hiển thị đúng". Kiểm tra chéo
`ecosystem_subprojects`/`projects`/`ecosystem_articles`/`ecosystem_ratings`
— tất cả vẫn `Published` (chưa bị dính, vì các form đó đều có field
`status` tường minh trong `fields`/form — chỉ 4 component MỚI xây trong
đợt Dự án & Cơ hội gần đây, `EcosystemOverview`/`EcosystemLinksBox`/
`SubProjectOverview`/`SubProjectLinksBox`, dùng `EditableRegion`/`update()`
KHÔNG kèm `status`, nên có nguy cơ dính — `SubProjectOverview`/
`SubProjectLinksBox` chưa dính vì Founder chưa kịp test, nhưng lần sửa
tiếp theo chắc chắn sẽ dính giống `eco_digiu`).

**Đã sửa TẬN GỐC (1 route dùng chung, không vá từng component):**
PATCH handler giờ `select("data, status")` (lấy cả cột `status` thật hiện
tại), tính `nextStatus` theo thứ tự ưu tiên: `patch.status` (nếu client
CÓ gửi tường minh — giữ nguyên hành vi mọi form tự quản `status` như
`ProjectCards`/`ArticlesAdminPanel`/`SubProjectsAdminPanel`) → nếu không,
`existing.status` (giá trị THẬT hiện tại của dòng, vừa fetch) → chỉ rơi
về `"Draft"` nếu dòng thực sự không có status nào (không nên xảy ra với
schema `not null default 'Draft'`). Không còn đường nào patch thiếu
`status` mà bị âm thầm unpublish nữa.

**Ảnh hưởng RỘNG HƠN phạm vi "Dự án & Cơ hội" (ghi nhận, chưa audit từng
điểm):** route này dùng CHUNG cho MỌI collection generic — sửa 1 lần ở
đây tự động bảo vệ luôn mọi module Live-edit khác dùng cùng `EditableRegion`/
`update()` không kèm status: 5 Cửa Hành trình (Mirror/Nhật ký học tập/My
Story/Bản đồ hành trình/Khu vườn của bạn), Trang chủ Học viện
(`home_cards` — nhưng field đó CÓ `status` trong `EditableRegion` fields
nên vốn đã an toàn), Sứ mệnh Companion (6 khối), Premium Dashboard
(`premium_chrome`) — các module này CHƯA được audit dữ liệu thật riêng
lẻ trong đợt này (ngoài phạm vi "Dự án & Cơ hội" Founder yêu cầu), nhưng
fix ở route dùng chung này bảo vệ chúng ngay lập tức, không cần sửa thêm.
Nếu Founder muốn xác nhận dữ liệu các module đó có dòng nào đã bị dính
Draft oan trước khi có bản vá này, cần 1 lượt audit riêng (như đã làm cho
`eco_digiu` ở đây).

**Đã sửa dữ liệu (chỉ metadata, KHÔNG tự sửa nội dung):** `ecosystem_chrome.eco_digiu`
đưa `status` về lại `'Published'` qua `execute_sql` — Portal hiện lại
đúng. **CHƯA tự sửa nội dung** (`name`/link label vẫn còn "----"/"bb" từ
lần test của Founder, `url` link cũng có 1 chữ số khác bản gốc trong
`ecosystems.ts`, "660" thay vì "668" — có thể Founder đã cố ý sửa thành
link đúng thật, không đoán) — Founder tự kiểm tra và sửa lại qua
`/admin/duan-cohoi/digiu` nếu cần (bug tạo Save đã hoạt động đúng từ giờ,
lần sửa tiếp theo sẽ giữ đúng Published).

**Rà soát toàn bộ trạng thái Published/Draft của "Dự án & Cơ hội" sau khi
sửa (qua `execute_sql`, không suy đoán):** `ecosystem_chrome` 5/5
Published, `ecosystem_subprojects` 5/5 Published, `ecosystem_articles`
3/3 Published, `ecosystem_ratings` 60/60 Published, `projects` 5/5
Published — toàn bộ sạch, không còn dòng nào bị Draft oan.

**File sửa:** `src/app/api/admin/collections/[table]/[id]/route.ts` (duy
nhất — root cause).

**Verify:** `tsc`/`eslint` sạch. Test thật với anon key thật qua route
dev-preview tạm (`getLiveEcosystemChrome("eco_digiu")` + toàn bộ
`getAllLiveSubProjects()`, xoá route ngay sau khi xác nhận) — xác nhận
`chrome.status === "Published"` sau khi repair. Test lại không có
Supabase (mặc định sandbox) — 4 route Portal (`duan-cohoi`,
`duan-cohoi/digiu`, `duan-cohoi/digiu/alphamind`,
`duan-cohoi/solargroup/sovelmash`) trả `200`, `/admin/duan-cohoi/digiu`
trả `307` đúng (chưa đăng nhập), 0 lỗi log server ở cả 2 lượt test.

**Chưa tự test được:** thao tác sửa thật qua Admin UI có tài khoản đăng
nhập để xác nhận trực quan (cùng giới hạn sandbox) — nhưng lần này ĐÃ
XÁC NHẬN qua dữ liệu thật (`eco_digiu` từng dính đúng bug này) nên độ tin
cậy của bản vá cao hơn các lần verify chỉ dựa vào code review trước đó.

## Dự án & Cơ hội — 2 section mới: "Video dự án" + "Link tải tài liệu"

Founder yêu cầu thêm 2 mục mới ngay dưới "Các dự án con" ở
`/portal/duan-cohoi/digiu`, áp dụng cho **cả 5 hệ sinh thái và dự án con**
(không riêng DigiU — DigiU chỉ là nơi chạy thật trước). Admin cần
chỉnh sửa/thêm/xoá/ẩn/Lưu cho cả 2 mục.

**Data shape:** cùng kiểu `MarketingLink[]` (id/label/url/order/visible —
type có sẵn từ `ecosystems.ts`, không tạo type mới) — `videos` và
`documents` thêm vào `data` jsonb của cả `ecosystem_chrome` (cấp hệ sinh
thái) và `ecosystem_subprojects` (cấp dự án con), không cần migration
schema (jsonb generic, giống mọi field mở rộng trước đó của 2 bảng này).
Tái dùng NGUYÊN `MarketingLinksFieldEditor.tsx` cho cả 2 mục edit (đã hỗ
trợ label/url/visible/thêm/xoá) — không viết editor mới.

**Hiển thị khác nhau giữa 2 mục (lý do dùng chung shape nhưng khác UI):**
- **Video dự án** — mỗi video Published nhúng trực tiếp dạng iframe
  16:9 (chuyển URL YouTube qua `toYouTubeEmbedUrl()`, tách thành util
  dùng chung mới `src/lib/portal/videoEmbed.ts` — trước đó chỉ có 1 bản
  cục bộ trong `CourseLearnClient.tsx` (Premium), giờ refactor
  `CourseLearnClient.tsx` import từ util chung, không đổi hành vi). URL
  không phải YouTube (Vimeo/Loom/mp4 trực tiếp...) không đoán được cấu
  trúc nhúng chung, fallback sang link "Mở video ↗" mở tab mới — cùng
  nguyên tắc `CourseLearnClient.tsx` đã áp dụng.
- **Link tải tài liệu** — mỗi tài liệu Published hiện thành nút tải
  xuống (icon `Download`, không phải `ExternalLink` như `MarketingLinkBox`)
  — về hành vi thực tế vẫn là mở link trong tab mới (không có xử lý tải
  file thật phía server, đúng bản chất "link tải" trỏ ra ngoài, ví dụ
  Google Drive).

**"Ẩn" = field `visible` sẵn có trong `MarketingLink`** (không thêm field
mới) — bỏ tick "Hiển thị trên Portal" trong `MarketingLinksFieldEditor`
là ẩn khỏi Portal ngay, không cần trạng thái riêng. "Xoá" = bấm nút xoá
dòng trong editor. "Lưu" = nút Lưu tường minh + staging cục bộ, cùng cơ
chế `EcosystemLinksBox.tsx` đã sửa ở mục trên.

**File mới:**
- `src/lib/portal/videoEmbed.ts` — `toYouTubeEmbedUrl()` (tách từ
  `CourseLearnClient.tsx`).
- `src/components/portal/opportunities/EcosystemVideosBox.tsx`,
  `EcosystemDocumentsBox.tsx` — cấp hệ sinh thái, qua
  `useEcosystemChrome()`.
- `src/components/portal/opportunities/SubProjectVideosBox.tsx`,
  `SubProjectDocumentsBox.tsx` — cấp dự án con, qua
  `useSubProjectChrome()`, byte-for-byte cùng logic 2 file trên.

**File sửa:**
- `src/lib/portal/live-ecosystem-chrome.ts` — `EcosystemChrome` thêm
  `videos`/`documents`, parse qua `toLinks()` có sẵn (đã dùng cho
  `links`), cùng nguyên tắc `Array.isArray` (không phải `length>0`) để
  phân biệt "chưa migrate" với "Admin chủ động xoá hết".
- `src/lib/portal/live-subprojects.ts` — `SubProjectRow` thêm
  `videos`/`documents`, cùng cách.
- `src/app/portal/duan-cohoi/[ecosystemSlug]/page.tsx` — thêm
  `<EcosystemVideosBox/>`+`<EcosystemDocumentsBox/>` vào CẢ 4 nhánh
  `structureType` (sub-projects/two-field/affiliate-list/exchange-list —
  Founder xác nhận áp dụng tất cả 5 hệ sinh thái, không giới hạn như
  quyết định phương án (a) cũ chỉ áp dụng cho `marketingLinks`), đặt sau
  khối nội dung chính của từng loại (với `sub-projects`: sau "Các dự án
  con", đúng vị trí Founder chỉ định), trước "Đánh giá".
- `src/app/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page.tsx`
  — thêm 2 component tương ứng sau `SubProjectLinksBox`, trước "Đánh giá".
- `src/app/portal/premium/[courseId]/hoc/CourseLearnClient.tsx` — xoá bản
  `toYouTubeEmbedUrl()` cục bộ, import từ util chung mới (refactor thuần,
  0 đổi hành vi).

**Dữ liệu thật đã backfill cho DigiU** (qua `execute_sql`, theo đúng yêu
cầu "chạy dự án DigiU trước"): 1 video
(`https://youtu.be/FP-hiDgI024?si=AfGMlP5ChLk368q2`) + 1 tài liệu
(`https://drive.google.com/file/d/108n-cqf2_N0s4bLcUNPsqs8LodM73fCh/view?usp=drive_link`,
nhãn "Tài liệu DigiU"). **4 hệ sinh thái còn lại + mọi dự án con giữ
honestly rỗng** (2 section hiện empty-state trung thực "Chưa có... sẽ
cập nhật khi có") — đúng nguyên tắc NO-FAKE-DATA, Founder tự thêm qua
Admin khi có nội dung thật.

**Verify:** `tsc`/`eslint` sạch. Test thật qua anon key thật (route
dev-preview tạm, xoá ngay sau khi xong) — xác nhận
`getLiveEcosystemChrome("eco_digiu")` trả đúng `videos`/`documents` vừa
backfill, `toYouTubeEmbedUrl()` chuyển đúng
`https://youtu.be/FP-hiDgI024...` → `https://www.youtube.com/embed/FP-hiDgI024`.
Test không có Supabase (mặc định sandbox) — cả 8 route (5 hệ sinh thái +
3 dự án con mẫu) trả `200`, 0 lỗi log server.

**Chưa tự test được:** thêm/sửa/xoá/ẩn video-tài liệu qua Admin UI thật
có tài khoản đăng nhập (cùng giới hạn sandbox) — Founder tự test tại
`/admin/duan-cohoi/digiu` (xác nhận video YouTube nhúng phát được, nút
tải tài liệu mở đúng Google Drive) trước khi lặp lại cho 4 hệ sinh thái
+ dự án con còn lại.

## Bug đã sửa — trang Admin của 4 hệ sinh thái + TẤT CẢ dự án con bị crash (chỉ DigiU hoạt động)

Founder báo ngay sau khi build "Video dự án"/"Link tải tài liệu": link
Admin của SolarGroup/Blockchain & Crypto/Affiliate/Sàn giao dịch và toàn
bộ dự án con đều lỗi, chỉ DigiU (cấp hệ sinh thái) hoạt động.

**Nguyên nhân:** đợt backfill dữ liệu thật trước đó CHỈ chạy cho đúng 1
dòng `ecosystem_chrome.eco_digiu` (theo đúng yêu cầu "chạy DigiU trước") —
4 dòng `ecosystem_chrome` còn lại và cả 5 dòng `ecosystem_subprojects`
chưa từng có key `videos`/`documents` trong `data` jsonb. Fetch LIVE qua
route generic (Admin, `editMode=true`) trả về RAW jsonb — không đi qua
lớp parse phòng thủ của `getLiveEcosystemChrome()`/`getAllLiveSubProjects()`
(2 hàm đó chỉ dùng cho SEED, phía server) — nên `chrome.videos`/
`chrome.documents`/`sub.videos`/`sub.documents` là `undefined` (không
phải mảng rỗng) cho mọi dòng chưa migrate. `EcosystemVideosBox.tsx`/
`EcosystemDocumentsBox.tsx`/`SubProjectVideosBox.tsx`/
`SubProjectDocumentsBox.tsx` gọi thẳng `.filter()` lên giá trị đó → crash
toàn trang Admin (Next.js render lỗi 500) cho mọi hệ sinh thái/dự án con
KHÔNG PHẢI eco_digiu.

**Đã sửa 2 lớp (không chỉ vá dữ liệu):**
1. **Code phòng thủ** (lớp chính, bền vững) — cả 4 component đổi
   `chrome.videos`/`chrome.documents`/`sub.videos`/`sub.documents` sang
   `?? []` trước khi `.filter()`. Quan trọng vì: dòng dự án con MỚI Admin
   tự thêm qua `SubProjectsAdminPanel` (`emptySubProject()`) cũng KHÔNG
   có 2 key này — nếu chỉ vá dữ liệu (backfill) mà không sửa code, dự án
   con thêm sau này sẽ lại crash y hệt.
2. **Backfill dữ liệu còn thiếu** (qua `execute_sql`, chỉ thêm key rỗng
   `[]` nếu chưa có, KHÔNG đè lên dữ liệu đã có của `eco_digiu`) — 4 dòng
   `ecosystem_chrome` + 5 dòng `ecosystem_subprojects` giờ đều có đủ
   `videos: []`/`documents: []` — khớp đúng convention "mọi dòng có đủ
   key hiện tại của bảng" đã áp dụng cho `links`/`fullIntro` trước đó.

**File sửa:** `EcosystemVideosBox.tsx`, `EcosystemDocumentsBox.tsx`,
`SubProjectVideosBox.tsx`, `SubProjectDocumentsBox.tsx` (mỗi file thêm
đúng 1 dòng `?? []`).

**Cùng đợt — tăng kích thước hiển thị video lên 90% (yêu cầu riêng):**
"Video dự án" đổi từ lưới 2 cột (`sm:grid-cols-2`, mỗi video ~50% chiều
rộng) sang xếp dọc 1 cột, mỗi video rộng `w-[90%]` căn giữa (`mx-auto`)
— áp dụng cả `EcosystemVideosBox.tsx` lẫn `SubProjectVideosBox.tsx`.
"Link tải tài liệu" giữ nguyên lưới 2 cột (không phải video, không có
yêu cầu đổi).

**Verify:** `tsc`/`eslint` sạch. Xác nhận qua `execute_sql`: cả 5 dòng
`ecosystem_chrome` và cả 5 dòng `ecosystem_subprojects` đều có
`videos`/`documents` (`has_videos`/`has_documents = true`), `status` mọi
dòng vẫn `Published` (không bị ảnh hưởng). Test qua `next dev` (không có
Supabase) — 7 route Portal (`digiu`, `digiu/alphamind`, `solargroup`,
`solargroup/sovelmash`, `blockchain-crypto`, `lam-affilate`,
`sangiaodich`) trả `200`; 3 route Admin
(`/admin/duan-cohoi/solargroup`, `/admin/duan-cohoi/blockchain-crypto`,
`/admin/duan-cohoi/digiu/alphamind` — đúng 3 route Founder báo lỗi) trả
`307` redirect login đúng như kỳ vọng (chưa đăng nhập, KHÔNG còn crash
500 nữa), 0 lỗi trong log server.

**Bài học:** khi thêm field mới vào 1 collection đã có sẵn dòng cũ
(jsonb generic), KHÔNG được chỉ backfill dòng đang test — phải backfill
(hoặc code phòng thủ `?? []`, ưu tiên cách này vì bền hơn) cho MỌI dòng
hiện có VÀ đảm bảo path tạo dòng mới (`emptySubProject()`,
`emptyArticle()`...) cũng khởi tạo đủ key, nếu không dòng nào thiếu key
đó sẽ crash ngay khi vào edit mode (khác Portal thật — Portal luôn an
toàn nhờ `getLiveEcosystemChrome()`/`getAllLiveSubProjects()` parse
phòng thủ ở server, chỉ riêng con đường live-fetch phía Admin mới lộ ra
raw jsonb).

## Dự án & Cơ hội — Session đầu tiên (DigiU): sửa được Nhãn trạng thái/Ghi chú/Phù hợp/Chưa nên tham gia/Kỳ vọng thực tế

Founder muốn sửa được TOÀN BỘ nội dung chữ ở khối "Overview" đầu trang
chi tiết hệ sinh thái (`EcosystemOverview.tsx`) — trước đó chỉ có
`name`/`shortDescription`/`fullIntro` sửa được qua Admin, còn
`statusBadge` (nhãn góc phải)/`highlights` (danh sách ghi chú nhỏ)/
`whoFor` ("Phù hợp")/`whoNotReady` ("Chưa nên tham gia nếu")/
`expectedOutcome` ("Kỳ vọng thực tế") vẫn đọc tĩnh từ `ecosystems.ts`
(quyết định phạm vi cũ ở Nhóm 3 Phần D, giờ Founder mở rộng thêm).

**`highlights` cần cơ chế input MỚI (không dùng `type: "tags"` sẵn
có):** field này là mảng câu ghi chú ĐẦY ĐỦ (không phải từ khoá ngắn),
nhiều câu có dấu phẩy bên trong câu (vd. "Đang trong giai đoạn mình trực
tiếp theo dõi và sử dụng, chưa phải đánh giá dài hạn.") — nếu dùng
`type: "tags"` (tách theo dấu phẩy, đang dùng cho `toolsUsed`/`tags`/
`suggestedTools`... ở nơi khác) sẽ CẮT SAI ngay giữa câu. Phát hiện
`fields.ts` đã có sẵn cơ chế đúng nhu cầu này (`FieldTransform:
"newline-list"`, `toFormValueFor`/`fromFormValueFor` — mảng string ↔
textarea nhiều dòng) nhưng CHƯA TỪNG được nối vào `EditableRegion.tsx`
(chỉ `DataTableRowPanel.tsx`/`LessonEditor.tsx` dùng) — đã nối thêm vào
`EditableRegion.tsx` (chỉ bản `opportunities`, KHÔNG sửa 8 bản
byte-for-byte còn lại vì chưa module nào khác cần `transform`) — hoàn
toàn tương thích ngược (field không khai báo `transform` thì 2 hàm này
trả nguyên giá trị, hành vi y hệt cũ).

**Data:** `EcosystemChrome` (`live-ecosystem-chrome.ts`) thêm
`statusBadge: string`/`highlights: string[]`/`whoFor: string`/
`whoNotReady: string`/`expectedOutcome: string`. `statusBadge` giới hạn
đúng 5 giá trị `EcosystemStatusBadge` (select, không gõ tay tự do —
tránh Admin gõ 1 nhãn lạ phá vỡ ý nghĩa hệ thống 5 trạng thái).

**`EcosystemOverview.tsx`:** đổi từ đọc `eco.statusBadge`/`eco.highlights`/
`eco.whoFor`/`eco.whoNotReady`/`eco.expectedOutcome` (tĩnh) sang
`chrome.*` (live), có FALLBACK về `eco.*` khi `chrome.*` rỗng (`||`/
`.length > 0 ? ... : eco...`) — phòng thủ kép cùng bug "trang Admin 4 hệ
sinh thái crash" vừa sửa trước đó (không chỉ tin vào backfill). Mỗi field
bọc `EditableRegion` riêng (`statusBadge` — `as="span"`, chỉ bọc đúng cái
badge; `highlights` — bọc `<ul>`, hiện placeholder "Chưa có ghi chú — bấm
để thêm" khi rỗng VÀ đang edit mode để Admin có chỗ bấm thêm lần đầu;
`whoFor`/`whoNotReady`/`expectedOutcome` — gộp CHUNG 1 `EditableRegion`
bọc cả khối lưới 3 cột, 1 popover sửa cả 3 field cùng lúc, giống cách
`ProjectCards.tsx` gộp field).

**Bug tự phát hiện khi code (chưa từng xuất bản, sửa trước khi commit):**
`EditableRegion`'s `className` prop CHỈ áp dụng khi `editMode=true` (khi
`editMode=false` component return thẳng `<>{children}</>`, bỏ qua hoàn
toàn `className`) — nếu đặt class margin (`mt-4`/`mt-6`) trên
`EditableRegion` thay vì trên chính phần tử con, margin đó sẽ BIẾN MẤT
trên Portal thật (chỉ còn đúng trong Admin edit mode). Đã đặt đúng
`mt-4 space-y-1.5` trực tiếp trên `<ul>` (highlights) và `mt-6 grid...`
trực tiếp trên `<div>` lưới 3 cột (criteria) — không đặt trên
`EditableRegion` nữa. (Ghi chú: `DESCRIPTION_FIELDS`/`INTRO_FIELDS` ở
cùng file này đã có sẵn từ trước, dùng đúng pattern SAI này — NGOÀI PHẠM
VI đợt sửa này, chưa đụng, có thể là 1 lỗi hiển thị nhỏ có sẵn cần kiểm
tra riêng nếu Founder thấy khoảng cách đoạn văn không đúng trên Portal
thật.)

**Dữ liệu thật đã backfill cho CẢ 5 hệ sinh thái** (qua `execute_sql`,
copy verbatim từ `ecosystems.ts` — không chỉ DigiU lần này, đúng bài học
"đừng chỉ backfill dòng đang test" vừa rút ra, và 5 field này vốn ĐÃ có
nội dung thật sẵn có, không phải trống mới như video/tài liệu) —
`statusBadge`/`highlights`/`whoFor`/`whoNotReady`/`expectedOutcome` cho
DigiU/SolarGroup/Blockchain & Crypto/Affiliate/Sàn giao dịch.

**File sửa:** `src/lib/admin/fields.ts` (không đổi — cơ chế transform
đã có sẵn), `EditableRegion.tsx` (nối `toFormValueFor`/`fromFormValueFor`,
chỉ bản `opportunities`), `live-ecosystem-chrome.ts` (5 field mới),
`EcosystemOverview.tsx` (chuyển 5 field sang `chrome.*` + EditableRegion
+ sửa bug margin).

**Verify:** `tsc`/`eslint` sạch, `npx vitest run` 139/139 pass. Test thật
qua anon key thật (route dev-preview tạm, xoá ngay sau khi xong) — xác
nhận `getLiveEcosystemChrome("eco_digiu")` VÀ `getLiveEcosystemChrome("eco_trading")`
đều trả đúng 5 field mới với nội dung thật (không rỗng, không lỗi parse).
**Phát hiện phụ khi test:** dữ liệu DigiU đã được Founder tự sửa qua
Admin thật trong lúc mình đang làm việc này — tên đã sạch (không còn
"----"), nhãn link đã sạch (không còn "bb"), và có thêm 1 tài liệu mới
Founder tự thêm ("Lộ trình DigiU") — xác nhận tính năng "Video dự án"/
"Link tải tài liệu" + bản vá crash trước đó đã hoạt động đúng trên môi
trường thật của Founder. Test lại không có Supabase (mặc định sandbox) —
6 route (5 hệ sinh thái + `/admin/duan-cohoi/digiu`) trả đúng `200`/`307`,
0 lỗi log server.

**Chưa tự test được:** sửa 5 field mới qua Admin UI thật có tài khoản
đăng nhập (cùng giới hạn sandbox) — Founder tự test tại
`/admin/duan-cohoi/digiu`, xác nhận bút sửa (✎) hiện đúng ở nhãn trạng
thái/danh sách ghi chú/khối 3 cột Phù hợp-Chưa nên tham gia-Kỳ vọng thực
tế, và ô "Ghi chú" (textarea nhiều dòng) không cắt sai câu có dấu phẩy.

## Dự án & Cơ hội — Trình soạn thảo chuyên nghiệp cho "Nội dung đầy đủ" (RichTextEditor)

Founder gửi ảnh chụp thanh công cụ kiểu Google Docs, yêu cầu mục "NỘI
DUNG ĐẦY ĐỦ (HIỂN THỊ Ở TRANG CHI TIẾT)" ở "QUẢN LÝ BÀI VIẾT (LIVE-EDIT)"
phải là trình soạn thảo chuyên nghiệp (đậm/nghiêng/cỡ chữ/canh giữa/chèn
ảnh...) thay vì textarea thuần.

**Dependency mới (lần đầu trong dự án — trước đó CLAUDE.md từng ghi
"chưa có thư viện markdown nào, không thêm dependency mới" cho việc HIỂN
THỊ nội dung admin-viết; yêu cầu lần này đổi bản chất bài toán — cần
soạn thảo, không chỉ hiển thị — nên hợp lý để thêm dependency thật sự
cần thiết):**
- `@tiptap/react`/`@tiptap/pm`/`@tiptap/starter-kit` (framework rich-text
  chuẩn cho React, hỗ trợ chính thức React 19 — đã kiểm tra peer deps
  trước khi cài) + `@tiptap/extension-image`/`extension-text-align`/
  `extension-text-style`/`extension-color`/`extension-highlight`.
  `starter-kit` v3 đã TỰ bundle sẵn bold/italic/strike/underline/link/
  heading/bulletList/orderedList/blockquote/horizontalRule/undo-redo —
  không cần cài thêm gói riêng cho các field này.
- `isomorphic-dompurify` — khử độc HTML trước khi render (`dangerouslySetInnerHTML`)
  trên Portal, dù nội dung do Admin tự viết (không phải input công khai)
  vẫn chặn được `<script>`/thẻ lạ lỡ dán vào khi copy-paste — đã test
  thật (chèn `<script>alert(1)</script>` vào 1 dòng test, xác nhận bị
  lọc, giữ nguyên `<strong>`/`<em>`/`<h2>`/`<ul>` hợp lệ).
- `@tailwindcss/typography` (`@plugin "@tailwindcss/typography";` trong
  `globals.css`, cú pháp Tailwind v4) — cấp class `prose` để hiển thị
  HTML soạn ra đúng kiểu chữ mà không phải tự viết CSS cho từng thẻ
  (h2/ul/blockquote/img...).
- **Cỡ chữ KHÔNG cài package riêng** — gói chính thức
  `@tiptap/extension-font-size` mới ở tag "next" (`3.0.0-next.3`, chưa
  ổn định cho production) — tự viết 1 Extension nhỏ (~25 dòng, mở rộng
  mark `textStyle` có sẵn, đúng pattern tài liệu TipTap khuyến nghị)
  ngay trong `RichTextEditor.tsx`, không thêm dependency.

**Không xây upload file** — chèn ảnh/link đều dán URL đã host sẵn qua
`window.prompt()`, đúng convention xuyên suốt dự án (`imageUrl`/
`ArticleImage.url`/`MarketingLink.url`... đều dán URL, không có hạ tầng
upload nào từng tồn tại).

**Lưu dưới dạng HTML thay vì plain text `\n\n`-separated cũ** — đổi bản
chất field `content`. **Lớp tương thích ngược** (`src/lib/portal/richText.ts`,
mới): `looksLikeHtml()` nhận diện bài CŨ (plain text, không thẻ mở đầu
hợp lệ như `<p`/`<h2`...) khác bài MỚI (HTML từ `RichTextEditor`);
`plainTextToHtml()`/`toEditableHtml()` tự chuyển bài cũ sang HTML đúng
lúc Admin MỞ SỬA (escape ký tự đặc biệt trước khi bọc `<p>`, không mất/
sai nội dung cũ) — Admin không cần tự làm gì, bài cũ tự "nâng cấp"
đúng lúc chỉnh sửa lần đầu qua trình soạn thảo mới.

**File mới:**
- `src/components/admin/RichTextEditor.tsx` — component dùng chung
  (`src/components/admin/`, không riêng module Dự án & Cơ hội — tái
  dùng được cho field rich-text khác sau này), toolbar đủ:
  Hoàn tác/Làm lại, dropdown Tiêu đề (Bình thường/H2/H3), dropdown Cỡ
  chữ, Đậm/Nghiêng/Gạch chân/Gạch ngang, Màu chữ, Đánh dấu (highlight),
  4 kiểu canh (trái/giữa/phải/đều), Danh sách gạch đầu dòng/đánh số,
  Trích dẫn, Đường kẻ ngang, Chèn liên kết, Chèn ảnh, Xoá định dạng.
  `immediatelyRender: false` (bắt buộc với Next.js App Router, tránh lỗi
  hydration mismatch đã biết của TipTap).
- `src/lib/portal/richText.ts` — `looksLikeHtml()`/`plainTextToHtml()`/
  `toEditableHtml()` (dùng ở Admin khi mở sửa)/`sanitizeArticleHtml()`
  (dùng ở Portal khi render).

**File sửa:**
- `src/components/portal/opportunities/ArticlesAdminPanel.tsx` — tách
  `content` khỏi `ARTICLE_FIELDS` (đổi tên `ARTICLE_FIELDS_BEFORE_CONTENT`/
  `ARTICLE_FIELDS_AFTER_CONTENT`, render `RichTextEditor` xen giữa —
  cùng vị trí cũ trong form), `key={editingId}` đảm bảo mount mới đúng
  bài đang sửa mỗi lần (tránh nội dung bài trước sót lại khi chuyển sửa
  bài khác).
- `src/app/portal/duan-cohoi/[ecosystemSlug]/cap-nhat/[articleSlug]/page.tsx`
  — render có điều kiện: `looksLikeHtml(article.content)` → HTML đã khử
  độc qua `prose` class; không → giữ nguyên logic `.split("\n\n")` cũ
  (bài cũ chưa từng mở qua trình soạn thảo mới vẫn hiển thị đúng y hệt
  trước đây, không cần chạy migration nào).
- `src/app/globals.css` — thêm `@plugin "@tailwindcss/typography";`.

**Verify:** `tsc`/`eslint`/`npm run build` sạch (route
`/portal/duan-cohoi/[ecosystemSlug]/cap-nhat/[articleSlug]` build đúng),
`npx vitest run` 139/139 pass. **Test trình soạn thảo thật qua trình
duyệt** (Playwright, route dev-preview tạm chỉ render `RichTextEditor`
độc lập — không qua Admin auth, xoá ngay sau khi xong) — xác nhận: gõ
chữ → bôi đen → bấm Đậm → ra đúng `<strong>`; bấm Canh giữa → ra đúng
`style="text-align: center"`; bấm Chèn ảnh → `window.prompt()` hiện
đúng, dán URL → ra đúng `<img>`; đổi dropdown Tiêu đề sang H2 → ra đúng
`<h2>`; nút Đậm/Canh giữa hiện đúng trạng thái "đang bật" (nền xanh) khi
con trỏ nằm trong đoạn đã áp dụng. Chụp ảnh xác nhận giao diện toolbar
khớp đúng ảnh Founder gửi (Hoàn tác/Làm lại/2 dropdown/Đậm-Nghiêng-Gạch
chân-Gạch ngang/Màu/Highlight/4 canh/2 danh sách/Trích dẫn/Kẻ ngang/
Link/Ảnh/Xoá định dạng).

**Test tương thích ngược qua dữ liệu thật** (route dev-preview tạm gọi
thẳng `getLiveEcosystemArticleBySlug()`, xoá ngay sau khi xong): bài
viết DigiU seed thật (`digiu-la-gi-he-sinh-thai-cong-nghe`, plain text
từ trước) → `looksLikeHtml()` trả `false` đúng như kỳ vọng, vẫn dùng
render cũ. Chèn 1 dòng test HTML thật (kèm `<script>alert(1)</script>`
cố ý) → `looksLikeHtml()` trả `true`, `sanitizeArticleHtml()` xác nhận
lọc sạch `<script>`, giữ nguyên định dạng hợp lệ — đã xoá dòng test này
ngay sau khi xác nhận.

**Chưa tự test được:** soạn 1 bài viết thật hoàn chỉnh qua Admin UI có
tài khoản đăng nhập, bấm Lưu, xác nhận hiển thị đúng trên Portal thật
(cùng giới hạn sandbox đã nêu nhiều lần) — Founder tự test tại
`/admin/duan-cohoi/digiu`, thử đủ các nút trong thanh công cụ trên 1 bài
viết thật trước khi dùng rộng rãi.

## Dự án & Cơ hội — Bỏ "Phù hợp/Chưa nên tham gia nếu/Kỳ vọng thực tế" khỏi 5 thẻ hệ sinh thái ở trang hub

Founder yêu cầu bỏ 3 field này khỏi **5 thẻ hệ sinh thái ở trang hub**
(`/portal/duan-cohoi`) — KHÁC với 3 field cùng tên/ý nghĩa vừa mở rộng
sửa được ở trang CHI TIẾT hệ sinh thái (`EcosystemOverview.tsx`, mục
trên) — 2 nơi đọc từ 2 bảng khác nhau hoàn toàn (`projects` cho trang
hub qua `ProjectCards.tsx`, `ecosystem_chrome` cho trang chi tiết), yêu
cầu này CHỈ áp dụng cho trang hub, không đụng trang chi tiết.

**Đã bỏ cả 2 nơi theo đúng yêu cầu:**
- **Hiển thị** — xoá khối JSX render "Phù hợp"/"Chưa nên tham gia nếu"/
  "Kỳ vọng thực tế" trong `ProjectCards.tsx` (dưới tiêu đề+mô tả, trên 2
  nút "Phân tích dự án"/"Đường link liên kết dự án" — đường viền phân
  cách (`border-t`) chuyển xuống bọc trực tiếp 2 nút đó để giữ khoảng
  cách hợp lý sau khi bỏ khối giữa).
- **Admin** — xoá 3 dòng `expectation`/`fitCriteria`/`avoidCriteria` khỏi
  `PROJECT_FIELDS` (danh sách field trong popover "Sửa nhanh" ở
  `/admin/duan-cohoi`) — Admin không còn thấy/sửa được 3 field này nữa.

**KHÔNG xoá cột dữ liệu/schema** — `LiveProject` type
(`live-projects.ts`) và logic parse 3 field này vẫn giữ nguyên, chỉ
ngừng đọc/hiển thị ở `ProjectCards.tsx` — dữ liệu cũ trong bảng `projects`
không mất, có thể khôi phục hiển thị dễ dàng (1 dòng JSX) nếu Founder
đổi ý sau này, không cần chạy lại migration.

**File sửa:** `ProjectCards.tsx` (xoá field khỏi `PROJECT_FIELDS` + khối
JSX hiển thị), `live-projects.ts` (thêm comment giải thích, không đổi
logic).

**Verify:** `tsc`/`eslint` sạch. Test thật qua `next dev` (không có
Supabase) — `/portal/duan-cohoi` trả `200`, grep xác nhận 0 lần xuất
hiện "Phù hợp"/"Chưa nên tham gia nếu"/"Kỳ vọng thực tế" trong HTML trả
về, 0 lỗi log server.

## Dự án & Cơ hội — Bỏ hiệu ứng nhô lên toàn portal + sửa 3 gap Admin (dự án con, giới thiệu, Đánh giá không hiện Portal)

Founder yêu cầu 4 việc cùng lúc, đang test tại "Hệ sinh thái DigiU" nhưng
xác nhận rõ **áp dụng cho TẤT CẢ hệ sinh thái, dự án con khác** — không
riêng DigiU.

### 1. Bỏ hiệu ứng nhô lên (hover-lift) khỏi mọi thẻ bài viết/nội dung, chỉ giữ cho CTA

Audit `grep -rn "hover:-translate-y\|whileHover.*y:"` toàn `src/` — sửa 13
file, bỏ `hover:-translate-y-1`/`hover:-translate-y-0.5` khỏi mọi thẻ
card/article/tile (giữ `hover:shadow-token-lg` nếu có):
`portal/congdongai/page.tsx`, `TodayGoals.tsx`,
`duan-cohoi/[ecosystemSlug]/page.tsx` (thẻ dự án con, nay nằm trong
`SubProjectsSection`), `duan-cohoi/page.tsx` (figure trích dẫn),
`RoadmapInteractive.tsx` (2 nút chọn cấp độ), `hanhtrinhcuatoi/page.tsx`
(2 thẻ "cửa"), `aiworkspace/page.tsx` + `aiworkspace/[slug]/page.tsx` (thẻ
công cụ/bài viết), `ArticleTicker.tsx`, `ProjectCards.tsx` (6 chỗ),
`AiSpaceSections.tsx` (5 chỗ).

**Cố ý KHÔNG đụng** (CTA thật hoặc động tác trang trí ngoài phạm vi
"bài viết" Portal): `Hero.tsx`/`FinalCTA.tsx` (nút CTA hình viên thuốc,
đã `hover:-translate-y-0.5` — đúng loại hiệu ứng được giữ lại theo yêu
cầu), `Hero.tsx`'s badge nổi trang trí (`whileHover={{y:-12}}`),
`QuizAssessment.tsx` (2 chỗ, thẻ quiz Landing page, không phải "bài viết"
Portal).

### 2-3. Admin sửa được "giới thiệu hệ sinh thái" + "Đường link liên kết dự án"

`ecosystem_chrome` (bảng đã có từ Nhóm 3 Phần D, trước đó chỉ quản
`name`/`shortDescription`) mở rộng thêm 2 field: `fullIntro` (đoạn giới
thiệu dài) và `links` (thay `eco.marketingLinks` tĩnh). Backfill nội dung
thật cho cả 5 dòng qua `execute_sql` trước khi Admin mở popover (tránh
Admin thấy trống — bài học đã áp dụng từ các module trước).

**`EcosystemChromeContext.tsx`** (mới, `src/components/portal/opportunities/`)
— pattern Context chia sẻ giống `PremiumChromeContext` (1 `useCollection()`
duy nhất, chia sẻ `{chrome, update}` qua Context cho nhiều vị trí JSX
dùng), khác biệt: `ecosystem_chrome` có **5 dòng** (1/hệ sinh thái, không
phải singleton 1 dòng như Premium) nên Provider phải
`items.find(c => c.id === seedChrome.id)` thay vì `items[0]`.

`EcosystemOverview.tsx` (đã có từ Nhóm 3 Phần D) bỏ `useCollection()`
riêng, chuyển sang đọc `useEcosystemChrome()` — thêm field `fullIntro` vào
`EditableRegion`. `EcosystemLinksBox.tsx` (mới) thay `MarketingLinkBox`
tĩnh cho hệ sinh thái loại `structureType === "sub-projects"` — đọc/ghi
qua `useEcosystemChrome()`, edit mode dùng `MarketingLinksFieldEditor.tsx`
(mới, dùng chung với sub-project — xem mục 4).

**`Array.isArray` không phải `length > 0`:** `getLiveEcosystemChrome()`
(field `links`) phân biệt "chưa migrate" (fallback tĩnh) với "Admin chủ
động xoá hết link" (tôn trọng mảng rỗng thật) — cùng nguyên tắc đã áp
dụng cho các field mảng khác trong dự án.

### 4. Admin thêm được dự án con mới (không chỉ sửa 5 dòng có sẵn)

`subProjects` trong `ecosystems.ts` trước đây là mảng TĨNH cố định — Admin
không thể thêm dòng mới. Migrate sang bảng Supabase mới
`ecosystem_subprojects` (`supabase-phase22-ecosystem-subprojects.sql`,
schema generic `id/data/status/order`), seed 5 dòng thật (3 DigiU:
AlphaMind/WebWisePay/Deposits, 2 SolarGroup: Sovelmash/AeroNova) với đúng
nội dung/link đăng ký thật lấy nguyên văn từ `ecosystems.ts`.

`src/lib/portal/live-subprojects.ts` (mới) — `getAllLiveSubProjects()`
(toàn bảng, dùng làm `seed`), `getLiveSubProjects(ecosystemId)` (đã lọc
Published+sort `displayOrder`), `getLiveSubProjectBySlug()`.

**Màu thẻ suy ra từ VỊ TRÍ, không lưu `colorIndex`:** `getSubProjectSurface(index)`
nhận `index` = vị trí trong danh sách đã Published+sort `displayOrder` —
tránh Admin phải quản 1 field kỹ thuật không cần thiết. Trang chi tiết dự
án con (`[subProjectSlug]/page.tsx`) và lưới hub
(`SubProjectsSection.tsx`) PHẢI tính đúng cùng 1 logic sort+index để màu
khớp nhau giữa 2 nơi — cả 2 đều gọi `getLiveSubProjects()`/lọc giống hệt.

`SubProjectsSection.tsx` (mới) — cùng pattern
`EcosystemArticlesSection.tsx`: 1 `useCollection("ecosystem-subprojects",
allSeed, {enabled: editMode})` chia sẻ giữa lưới hiển thị (luôn có) và
`SubProjectsAdminPanel.tsx` (mới — form add/edit/xoá đầy đủ, field
name/slug/shortDescription/displayOrder/status +
`MarketingLinksFieldEditor` cho `links`, chỉ hiện khi `editMode=true`).

`[ecosystemSlug]/page.tsx` — xoá hẳn `SubProjectsGrid` tĩnh cũ, bọc
`EcosystemOverview`+`EcosystemLinksBox`+`SubProjectsSection` trong
`<EcosystemChromeProvider>`. `[subProjectSlug]/page.tsx` — bỏ hẳn
`getSubProjectBySlug()` tĩnh, đọc `getLiveSubProjects()`, suy `surface`
từ `subIndex`; **bỏ `generateStaticParams()`** (dự án con giờ động, Admin
tự thêm — route `/portal/*` vốn đã luôn render dynamic bất kể có hàm này
hay không, xác nhận qua audit trước đó ở Nhóm 3 Phần D).

`ecosystems.ts`'s `SubProject`/`subProjects`/`getSubProjectBySlug()` đánh
dấu `@deprecated`, giữ tham khảo/rollback — không còn consumer nào import
(kể cả `cap-nhat/[articleSlug]/page.tsx`, đã sửa dùng
`getAllLiveSubProjects()` để dựng link "Quay lại" đúng).

### Bug đã sửa — sửa Đánh giá qua Admin bị âm thầm rơi về Draft, biến mất khỏi Portal

Đúng loại bug đã ghi ở mục "Bug đã sửa: GET không trả status" (áp dụng
CHO MỌI collection dùng route generic, không chỉ CKOS) — nhưng đây là 1
biến thể MỚI, xảy ra ở PATCH chứ không phải GET:
`PotentialAnalysisLive.tsx`'s `saveCriterion()` gọi `update(rowId, patch)`
mà KHÔNG bao giờ gửi kèm `status` trong patch — PATCH route
(`/api/admin/collections/[table]/[id]/route.ts`) tự suy cột `status`
ngoài từ `merged.status` (`{...existing.data, ...patch}`), mặc định
`"Draft"` nếu thiếu. Kết quả: **MỌI LẦN Founder đổi trạng thái tiêu chí
Đánh giá qua Admin, dòng đó tự động rơi về Draft** — Admin vẫn thấy đúng
(service-role bypass RLS) nhưng Portal (RLS `USING (status='Published')`)
không đọc được nữa → đúng hiện tượng Founder báo "đã cập nhật trong admin
nhưng chưa hiển thị trang portal".

**Đã sửa:** `saveCriterion()` luôn ép `status: "Published"` vào patch
(cả nhánh `update()` dòng có sẵn lẫn nhánh `add()` dòng mới). Repair dữ
liệu qua `execute_sql`: xác nhận 2 dòng thật bị ảnh hưởng
(`eco_digiu__pa_public_docs`, `eco_digiu__pa_team_transparent`, cả 2
`ratingStatus: "met"` — đúng 2 tiêu chí Founder từng đổi thành "Đạt" cho
DigiU) — đã cập nhật lại `status='Published'`, xác nhận qua route
dev-preview tạm thời (đọc thật qua `getLiveEcosystemRatingRows()`, xoá
route ngay sau khi verify) rằng 2 dòng này giờ hiện đúng trên Portal.

**Bài học chung (áp dụng khi thêm collection mới trong tương lai):** field
tri-state/trạng thái riêng bên trong `data` KHÔNG được đặt tên `status`
(trùng cột ngoài — đã áp dụng, `ratingStatus`) VÀ mọi lời gọi `update()`
từ UI phải luôn kèm `status: "Published"` tường minh nếu không có ý định
đổi trạng thái publish — route generic không tự giữ nguyên giá trị cũ khi
patch thiếu field này.

**File sửa:** `PotentialAnalysisLive.tsx` (fix bug), 13 file hover-lift
(mục 1), `live-ecosystem-chrome.ts`/`EcosystemChromeContext.tsx` (mới)/
`EcosystemOverview.tsx`/`EcosystemLinksBox.tsx` (mới)/
`MarketingLinksFieldEditor.tsx` (mới, dùng chung mục 3+4) (mục 2-3),
`supabase-phase22-ecosystem-subprojects.sql` (mới)/`live-subprojects.ts`
(mới)/`SubProjectsSection.tsx` (mới)/`SubProjectsAdminPanel.tsx` (mới)/
`[ecosystemSlug]/page.tsx`/`[subProjectSlug]/page.tsx`/
`cap-nhat/[articleSlug]/page.tsx`/`ecosystems.ts` (mục 4),
`supabaseCollections.ts` (thêm `ecosystem-subprojects`).

**Verify:** `tsc`/`eslint`/`rm -rf .next && npm run build` sạch,
`vitest run` (toàn bộ pass, không regression). Test thật qua `next dev`
(không cấu hình Supabase — fallback tĩnh, xác nhận không crash) — cả 5
route Portal liên quan (`duan-cohoi/digiu`, `duan-cohoi/digiu/alphamind`,
`duan-cohoi/solargroup/sovelmash`) trả `200`, 2 route Admin tương ứng
(`/admin/duan-cohoi/digiu`, `/admin/duan-cohoi/digiu/alphamind`) trả
`307` redirect `/admin/login` đúng như kỳ vọng (chưa đăng nhập), 0 lỗi
trong log server.

**Chưa tự test được:** thao tác Admin UI thật (thêm/sửa/xoá dự án con,
sửa giới thiệu/link, đổi trạng thái Đánh giá) có tài khoản đăng nhập
(cùng giới hạn sandbox đã nêu nhiều lần) — Founder tự test trên Preview
URL, đặc biệt xác nhận lại: 2 tiêu chí "Đạt" đã sửa trước đó cho DigiU giờ
hiện đúng trên Portal (bug đã sửa), và thử thêm 1 dự án con mới ở
`/admin/duan-cohoi/digiu` để xác nhận CRUD hoạt động đúng.

## Dự án & Cơ hội — Ảnh thật cho "Những người bạn đồng hành theo năm tháng"

Founder gửi 5 ảnh thật (sự kiện/đội ngũ digiU) để thay bộ tile icon
placeholder ở marquee "Đồng hành" trên trang hub (`/portal/duan-cohoi`) —
khối này trước đó chủ động dùng icon `Users` + nhãn "Ảnh minh hoạ", có
comment giải thích rõ "chưa có ảnh thật, sẽ thay sau" (đúng nguyên tắc
"không bịa dữ liệu"). Đây là lúc hoàn tất đúng TODO đó, không phải tiền lệ
mới.

**Xử lý ảnh:** 5 ảnh gốc Founder gửi (~1.9-5.0MB/ảnh, độ phân giải DSLR gốc
~7952x5304) — dùng `sharp` (đã có sẵn trong `node_modules`, dependency của
Next.js Image, không thêm package mới) resize/cắt còn 640x640 (`fit:
"cover", position: "attention"`), nén JPEG quality 78 → còn ~55-86KB/ảnh.
Lưu tại `public/images/duan-cohoi/dong-hanh/` (thư mục mới, cùng cấp
`digiu/` đã có), đặt tên theo nội dung ảnh (`digiu-doi-ngu-01.jpg`,
`digiu-hoi-thao-ai-blockchain.jpg`, `digiu-dai-dien-hoi-thao.jpg`,
`digiu-5-nam-thanh-lap.jpg`, `digiu-doi-ngu-02.jpg`).

**Code:** `src/app/portal/duan-cohoi/page.tsx` — đổi `COMPANION_PLACEHOLDERS`
(mảng màu nền, không có ảnh) thành `COMPANION_PHOTOS` (mảng `{src, alt}`
trỏ tới 5 ảnh trên); JSX marquee đổi từ tile icon+nhãn sang `<Image>` (Next
`next/image`, `object-cover` lấp đầy khung `h-64 w-64` cũ, giữ nguyên cơ chế
marquee lặp vô hạn/`prefers-reduced-motion` không đổi). Xoá import `Users`
(không còn dùng). Đổi mô tả section từ "Hình minh hoạ — ảnh thật sẽ được
cập nhật sau." thành "Khoảnh khắc cùng cộng đồng digiU qua các sự kiện."
(không còn placeholder nên bỏ câu xin lỗi cũ).

**KHÔNG làm Admin-editable** — Founder không yêu cầu CMS cho khối này (khác
mọi việc khác trong session), giữ đúng phạm vi hẹp: chỉ thay ảnh tĩnh.

**File sửa:** `src/app/portal/duan-cohoi/page.tsx`. **File mới:** 5 ảnh
JPEG tại `public/images/duan-cohoi/dong-hanh/`.

**Verify:** `tsc`/`eslint` sạch, `vitest run` 139 test pass, `npm run
build` sạch (route `/portal/duan-cohoi` xuất hiện đúng). Test thật qua
`next dev`: `curl` xác nhận HTML server-render chứa đủ 5 `src` ảnh (kèm
`srcset` 1x/2x qua `/_next/image`), endpoint `/_next/image` cho cả 5 ảnh
trả `200`. Chụp màn hình qua Playwright bị lỗi hiển thị "Đã có lỗi xảy ra"
— xác nhận đây là lỗi client-side CÓ SẴN, không liên quan thay đổi này:
`CompanionPresence` (widget nổi toàn Portal, không phải phần việc này) gọi
Supabase browser client bị crash vì sandbox không có biến môi trường
Supabase thật (giới hạn sandbox đã nêu nhiều lần) — `curl` xác nhận
`/portal/duan-cohoi` VÀ `/portal/duan-cohoi/digiu` (trang khác, không đụng
gì) đều trả `200` như nhau, không phải lỗi riêng của thay đổi này.

## Dự án & Cơ hội — Sửa: chèn ảnh trong RichTextEditor "biến mất" (không hiển thị)

Founder báo 2 lỗi cùng lúc: (1) "Link các bài viết ở ... Cập nhật thông tin
mới đang bị lỗi", (2) "Trình soạn thảo NỘI DUNG ĐẦY ĐỦ: khi chèn hình ảnh
lỗi không hiển thị".

**(2) Đã tìm ra root cause thật và sửa.** Test bằng Playwright (trang
devtest tạm, đã xoá sau khi xong) + dữ liệu Supabase THẬT (anon key tạm
qua env, không ghi `.env.local` — đúng convention sandbox đã dùng nhiều
lần): chèn ảnh qua nút "Chèn ảnh" TẠO ĐÚNG thẻ `<img>` trong DOM (xác nhận
qua `editor.getHTML()`), nhưng khi ảnh lỗi tải (URL sai/bị chặn hotlink/
hết hạn — tình huống RẤT dễ gặp vì dự án không có upload file, Admin phải
tự dán URL đã host sẵn ở nơi khác), ảnh co về ĐÚNG kích thước 0×0 — hoàn
toàn vô hình, không icon vỡ ảnh, không alt text, khác hẳn hành vi mặc định
trình duyệt. Nguyên nhân: Tailwind Preflight (bật mặc định qua `@import
"tailwindcss"`) đặt `img { height: auto }` toàn cục — với 1 ảnh lỗi (không
có kích thước gốc), `height: auto` tính ra 0, xoá luôn khung ảnh mặc định
trình duyệt vẫn giữ. Verify bằng cách so sánh boundingBox() trước/sau: ảnh
lỗi co về `{width:0, height:0}` trước khi sửa.

**Sửa (2 phần, `globals.css` + `RichTextEditor.tsx`):**
- CSS mới `.ProseMirror img, .prose img { min-height: 60px; background-color:
  #F3F4F6; border: 1px solid #E5E7EB; }` — ép khung LUÔN nhìn thấy được dù
  ảnh đang tải/tải xong/lỗi, không phụ thuộc `height: auto` co về 0.
  `.ProseMirror` = khung soạn thảo (Admin), `.prose` = bài viết đã xuất bản
  (Portal, cùng khối HTML content) — sửa cả 2 nơi consumer của HTML content
  vì cùng 1 lỗi CSS hệ thống, không riêng Admin.
- `addImage()` giờ hỏi thêm "Mô tả ngắn cho ảnh" (không bắt buộc) → set
  `alt` khi `setImage({src, alt})` — trước đây KHÔNG set alt, nên dù có
  sửa CSS, ảnh lỗi vẫn không có gì để hiện ngoài khung trống. Có alt text,
  trình duyệt hiện luôn text đó cạnh icon vỡ ảnh khi lỗi — Admin biết ngay
  ảnh nào lỗi và lỗi gì thay vì đoán.
- Đổi prompt URL ảnh thêm gợi ý "dán link ảnh trực tiếp — không phải link
  trang web" — hướng dẫn đúng loại URL cần dán (nguyên nhân phổ biến nhất
  của ảnh lỗi khi không có upload: dán nhầm link trang xem ảnh thay vì
  link ảnh trực tiếp).

Verify bằng Playwright thật: ảnh URL local hợp lệ → hiển thị đúng kích
thước gốc (960px width thật, không bị min-height/border phá hỏng — 60px
chỉ là SÀN tối thiểu, ảnh thật luôn lớn hơn nên không bị ảnh hưởng). Ảnh
URL cố tình lỗi (domain không tồn tại) → trước khi sửa: 0×0 vô hình; sau
khi sửa: khung 60px cao, nền xám, viền, icon vỡ ảnh + alt text hiện rõ.
Chụp màn hình xác nhận bằng mắt.

**(1) Ban đầu KHÔNG tái hiện được trên sandbox (`next dev`) — Founder gửi
tiếp ảnh chụp Preview Vercel thật, cho thấy CẢ 3 bài đã Published (kể cả 2
bài plain text, không hề chạm `sanitizeArticleHtml()`) đều lỗi 500 "This
page couldn't load / A server error occurred" khi bấm — dấu hiệu quyết
định: lỗi xảy ra ở TẦNG IMPORT/MODULE, không phải ở nội dung từng bài.**

**Root cause thật:** `src/lib/portal/richText.ts` import
`isomorphic-dompurify` (bọc `jsdom` — dependency nặng, có phần native/
dynamic-require) Ở ĐẦU FILE, không điều kiện. `EcosystemArticleDetailPage`
import `looksLikeHtml`/`sanitizeArticleHtml` từ đúng file này — nên nếu
riêng việc `import` module `isomorphic-dompurify` lỗi trên runtime
serverless của Vercel (khác hẳn `next dev` cục bộ — nơi mọi thứ chạy được
bình thường, đây chính là lý do sandbox không tái hiện được), TOÀN BỘ
route `cap-nhat/[articleSlug]` sập ngay từ lúc load module, trước khi kịp
chạy dòng code nào — giải thích đúng vì sao CẢ 3 bài lỗi giống hệt nhau dù
2 bài không phải HTML.

**Đã sửa:** thay `isomorphic-dompurify` bằng `sanitize-html` — pure JS,
không phụ thuộc `jsdom`/native, an toàn cho môi trường serverless. Gỡ hẳn
`isomorphic-dompurify` khỏi `package.json` (không còn dùng ở đâu khác).
`sanitizeArticleHtml()` viết lại dùng API `sanitize-html`
(`allowedTags`/`allowedAttributes`), giữ đúng danh sách thẻ/attribute cho
phép như bản cũ.

**Verify (2 phần):**
- Viết 1 file test tạm (`richText.devtest.test.ts`, đã xoá sau khi xong,
  không commit) xác nhận `sanitize-html` giữ đúng hành vi bảo mật tương
  đương bản DOMPurify cũ: `<script>` bị xoá hoàn toàn, `onerror=` trên
  `<img>` bị xoá, thẻ định dạng (`<h2>`/`<strong>`/`<em>`/`<ul>`) và
  attribute cho phép (`href`/`target`/`rel`/`src`/`alt`) đều giữ nguyên.
- Test thật với dữ liệu Supabase THẬT (anon key tạm qua env, không ghi
  file) qua trang devtest tạm (gọi thẳng component `EcosystemArticleDetailPage`
  thật, bỏ qua middleware — sandbox không có tài khoản đăng nhập): cả 3
  bài Published của DigiU (kể cả 2 bài plain text) đều render `200` với
  đúng nội dung CTA thật ("Nhận tài liệu DigiU"/"Xem bản đồ sản phẩm"/
  "Nhận Checklist"), không còn `notFound()`/lỗi.

**Chưa tự verify được:** không thể deploy/kiểm tra lại trực tiếp trên
Vercel Preview từ sandbox này — Founder cần pull nhánh `admin-rebuild` mới
nhất, chờ Preview build lại, và bấm thử đúng 3 link đã lỗi trong ảnh chụp
để xác nhận hết lỗi 500.

**File sửa:** `package.json`/`package-lock.json` (gỡ `isomorphic-dompurify`,
thêm `sanitize-html` + `@types/sanitize-html`), `src/lib/portal/richText.ts`
(viết lại `sanitizeArticleHtml()`), `globals.css` (CSS ảnh lỗi — mục (2)),
`RichTextEditor.tsx` (`addImage()` thêm alt + prompt rõ hơn — mục (2)).

**Verify chung:** `tsc`/`eslint`/`vitest run` (139 pass)/`rm -rf .next &&
npm run build` sạch (bao gồm đúng route `cap-nhat/[articleSlug]` build
thành công — trước đây build LOCAL vẫn luôn thành công dù lỗi chỉ lộ ra ở
runtime serverless của Vercel, nên `npm run build` sạch không đủ chứng
minh hết bug này, phải test bằng dữ liệu thật + devtest như trên). Trang
devtest tạm đã xoá sau khi xong, không commit.

## Dự án & Cơ hội — "Lấy format DigiU làm chuẩn" áp dụng cho 4 hệ sinh thái còn lại

Founder yêu cầu lấy DigiU làm chuẩn, áp dụng cho Solargroup/Blockchain &
Crypto/Làm tiếp thị liên kết/Các sàn giao dịch Crypto, cả Portal lẫn
Admin. Đã hỏi rõ trước khi làm (2 lựa chọn: đổi hẳn bố cục 4 hệ sinh thái
sang dạng "dự án con" như DigiU, HAY đồng bộ tính năng/khả năng sửa Admin
nhưng giữ nguyên bố cục riêng từng loại) — Founder chọn **đồng bộ tính
năng, giữ bố cục riêng**.

**Audit trước khi sửa (qua Supabase + đọc code):** `EcosystemOverview`
(session đầu tiên)/`EcosystemVideosBox`/`EcosystemDocumentsBox`/
`EcosystemArticlesSection`/`PotentialAnalysisLive` đã render + Admin-sửa
được cho CẢ 4 loại `structureType` từ những việc trước đó — không có gì
thiếu ở đây. Khoảng trống DUY NHẤT: mục "Đường link liên kết" —
`structureType === "sub-projects"` (DigiU/Solargroup) đã có
`EcosystemLinksBox` Admin-editable qua `ecosystem_chrome.links`; 3 loại
còn lại (`two-field`/`affiliate-list`/`exchange-list`) vẫn đọc THẲNG dữ
liệu TĨNH trong `ecosystems.ts` (`eco.fields[].marketingLinks`/
`eco.affiliateOffers`/`eco.exchanges`) — Admin không sửa được, phải deploy
code mới đổi được nội dung.

**Đã sửa — làm đúng phần khoảng trống đó, không đụng gì khác:**
- `MarketingLink` (`ecosystems.ts`) thêm field tuỳ chọn `category?: string`
  — để dùng chung 1 shape cho cả `AffiliateOffer` cũ (name+category+url)
  thay vì tạo type/editor riêng.
- `MarketingLinksFieldEditor.tsx` thêm prop tuỳ chọn `categories?:
  readonly string[]` — khi truyền vào mới hiện thêm `<select>` chọn
  category mỗi dòng; mọi nơi khác (Links/Video/Tài liệu box, dự án con)
  không truyền prop này, hành vi cũ giữ nguyên 100%.
- `EcosystemChrome` (`live-ecosystem-chrome.ts`) thêm 3 field mới:
  `affiliateOffers`/`exchanges` (`MarketingLink[]`)/`fieldLinks`
  (`Record<fieldId, MarketingLink[]>`, khoá theo `field_blockchain`/
  `field_crypto`). `toLinks()` thêm tham số `requireUrl` (mặc định `true`,
  giữ đúng hành vi cũ cho `links`/`videos`/`documents`/`fieldLinks`) —
  `affiliateOffers`/`exchanges` dùng `requireUrl=false` vì 2 danh sách này
  CỐ TÌNH hiện tên dù chưa có URL thật (khung "Chưa có link tiếp thị thật,
  sẽ cập nhật khi có." — đúng nguyên tắc no-fake-data đã có sẵn từ
  `ecosystems.ts`), lọc theo URL sẽ âm thầm xoá mất các dòng đó.
  `staticFallback()` convert từ `AffiliateOffer`/`ExchangeLink`/
  `EcosystemFieldBox` tĩnh sang shape `MarketingLink` mới (name→label).
- 3 component mới (`EcosystemAffiliateOffersBox.tsx`/
  `EcosystemExchangesBox.tsx`/`EcosystemFieldLinksBox.tsx`) — cùng
  pattern draft cục bộ + nút "Lưu" + `SaveStateBadge` đã dùng cho
  `EcosystemLinksBox`, đọc/ghi qua `useEcosystemChrome()`. Portal thật giữ
  NGUYÊN visual cũ (card có/không URL, khung trống trung thực) — chỉ thêm
  khả năng sửa khi `editMode=true`.
- `page.tsx` (`[ecosystemSlug]`) — xoá hẳn `AffiliateOffersList`/
  `ExchangesList` (2 hàm tĩnh cũ), thay bằng gọi thẳng 2 component mới
  (không cần prop, đọc Context); `TwoFieldBoxes` giữ khung `GemCard`
  name/description tĩnh, thay `MarketingLinkBox` (tĩnh) bằng
  `EcosystemFieldLinksBox` (mới) bên trong mỗi field.
- Xoá hẳn `MarketingLinkBox.tsx` — không còn nơi nào import (dead code
  sau khi thay hết 3 chỗ dùng).
- Backfill Supabase (`execute_sql`, không tạo migration mới — chỉ merge
  thêm key vào `data` jsonb có sẵn) — cả 5 dòng `ecosystem_chrome` đều có
  đủ 3 field mới (rỗng cho loại không dùng), 3 dòng dùng thật
  (`eco_blockchain`: 4 chương trình affiliate tên thật/URL rỗng;
  `eco_trading`: 7 sàn tên thật/URL rỗng; `eco_crypto`: 2 khoá
  `field_blockchain`/`field_crypto` rỗng, đúng dữ liệu tĩnh hiện có) —
  COPY VERBATIM tên/category từ `ecosystems.ts`, không bịa dữ liệu mới.
  Lý do backfill (không chỉ dựa `?? []` code-level): đúng bài học "seed IS
  the live data" đã gặp ở việc "Video dự án"/"Tài liệu" trước đó — khi
  `editMode=true`, `useCollection()` fetch RAW từ Supabase, dòng thiếu key
  sẽ trả `undefined` chứ không phải `[]`/`{}`.
- Cập nhật comment cũ (đã lỗi thời) ở
  `/admin/duan-cohoi/[ecosystemSlug]/page.tsx` — từng ghi "chỉ 2 field an
  toàn sửa được", giờ liệt kê đúng toàn bộ tính năng đã đồng bộ.

**KHÔNG đổi bố cục trang** — đúng lựa chọn Founder: 4 hệ sinh thái vẫn
hiện đúng loại UI riêng (`AffiliateOffersList`-style card 2 cột, danh
sách sàn 3 cột, 2 khối Blockchain/Crypto song song) — chỉ thêm khả năng
Admin sửa nội dung bên trong, không có "lưới dự án con" nào xuất hiện ở 4
trang này.

**File sửa:** `ecosystems.ts` (thêm `category?`), `MarketingLinksFieldEditor.tsx`
(thêm `categories` prop), `live-ecosystem-chrome.ts` (3 field mới +
`toLinks(requireUrl)` + `toFieldLinks()`), `page.tsx` (`[ecosystemSlug]`),
`/admin/duan-cohoi/[ecosystemSlug]/page.tsx` (comment). **File mới:**
`EcosystemAffiliateOffersBox.tsx`/`EcosystemExchangesBox.tsx`/
`EcosystemFieldLinksBox.tsx`. **File xoá:** `MarketingLinkBox.tsx` (dead
code).

**Verify:** `tsc`/`eslint`/`vitest run` (139 pass)/`rm -rf .next && npm
run build` sạch. Test thật với dữ liệu Supabase production (anon key tạm
qua env, không ghi file) qua trang devtest tạm (đã xoá, gọi thẳng
`EcosystemMiniSitePage` thật, bỏ qua middleware): cả 5 route hệ sinh thái
trả `200`, đúng nội dung thật hiện ra (Lazada/Shopee/Unica/Khởi Nguyên
MMO có category đúng; Binance/OKX/MEXC/Bybit/Kucoin/Gate/Bitget; khối
Blockchain/Crypto rỗng trung thực). Chụp màn hình qua Playwright ở chế độ
`editMode=true` (bọc `<EditModeProvider>` tạm trong devtest, không qua
`requireAdmin()` thật) xác nhận cả 3 box mới hiện đúng form sửa (category
`<select>`, nút "Thêm liên kết"/"Lưu"), 0 lỗi console/page error.

**Chưa tự test được:** lưu thật qua Admin có tài khoản đăng nhập (giới
hạn sandbox đã nêu nhiều lần) — Founder tự test trên Preview URL, đặc
biệt xác nhận: bấm "Lưu" sau khi thêm URL thật cho 1-2 mục (ví dụ dán link
Lazada thật) → tải lại trang → link hiện đúng dạng nút bấm được (không
còn khung "Chưa có link tiếp thị thật").

## BUG P0 ĐÃ SỬA — trigger tạo `members` thiếu cột `email`, chặn TOÀN BỘ đăng ký mới

Phát hiện khi audit riêng luồng Login/Signup trên nhánh `admin-rebuild`
(`claude/landing-preview-nextjs` được tạo ra TỪ chính `admin-rebuild`).
**ĐÍNH CHÍNH (2026-08-13):** đoạn này trước đây ghi "`admin-rebuild` đã bị
xoá" — **SAI, ghi chú lạc hậu**. Nhánh `admin-rebuild` VẪN TỒN TẠI trên
remote (commit cuối 2026-07-29), nhưng đã lạc hậu ~99 commit so với nhánh
phát triển hiện tại và chỉ còn đúng 1 commit riêng (`ccae2f3` — file
tracking `supabase-phase23-fix-signup-trigger-missing-email.sql`). Nội dung
fix đó **đã có sẵn** ở nhánh hiện tại (qua `supabase-phase23-identity-hub.sql`)
và **đã apply thật trên Supabase** — xác nhận bằng `pg_get_functiondef()`:
trigger live hiện là `insert into public.members (id, email, full_name,
referred_by)`, tức có `email` (bản fix này) VÀ `referred_by` (Phase 27
Affiliate, apply sau). Không có gì cần merge từ `admin-rebuild`; nhánh đó
coi như đã bị thay thế hoàn toàn. Ghi lại nguyên vẹn ở đây vì đây là bug thật, ảnh
hưởng CHÍNH nhánh này (`landing-preview-nextjs` giờ có cả Identity Hub —
`/register`, Google OAuth — tất cả đều đi qua đúng trigger này).

**Nguyên nhân:** trigger `handle_new_auth_user()` (`AFTER INSERT ON
auth.users`, tự tạo dòng `public.members` cho mọi user mới) chỉ insert
`(id, full_name)` — thiếu `email`, trong khi `members.email` là `NOT
NULL`. Postgres raise lỗi ngay tại trigger → cả transaction tạo
`auth.users` rollback → GoTrue trả lỗi 500. Kết quả: **mọi lần đăng ký
email chưa từng tồn tại (dù qua Register/password, Google OAuth, hay
magic-link) đều thất bại.**

**Đã sửa trực tiếp trên Supabase (project `uosxpxolsvwcafxvnroy`, dùng
chung cho mọi nhánh/deploy)** — `apply_migration` sửa trigger thêm
`email`:
```sql
insert into public.members (id, email, full_name)
values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
on conflict (id) do nothing;
```
**Đã backfill 1 nạn nhân thật** đã bị rollback trước khi có bản fix:
`hhhgmail@gmail.com` (tạo 2026-06-15) — tồn tại trong `auth.users` nhưng
mồ côi trong `members`, đã insert bù, giữ nguyên `full_name` thật đã có
sẵn trong `raw_user_meta_data`.

**Đã sửa thêm 1 landmine trên chính nhánh này:** `supabase-phase23-identity-hub.sql`
(migration Identity Hub, staged — Founder tự chạy tay, chưa auto-apply)
tái tạo LẠI đúng trigger này với cùng lỗi thiếu `email` — nếu chạy như
bản gốc sẽ ghi đè bản fix, làm Register/Google OAuth/magic-link lại hỏng
hết. Đã sửa file `supabase-phase23-identity-hub.sql` thêm `email` vào
insert TRƯỚC KHI Founder chạy migration này. Đã sửa luôn
`supabase-admin-auth.sql` (script bootstrap admin) — cùng lỗi thiếu
`email`, hiện vô hại vì đã chạy thành công từ trước (row Founder đã tồn
tại), nhưng sẽ fail nếu chạy lại trên project mới/reset.

**Verify (test API thật qua `@supabase/supabase-js`, tài khoản QA
disposable domain `.invalid` — không gửi email tới ai thật, đã xoá sạch
sau test):** `signInWithPassword` đúng/sai mật khẩu → đúng hành vi;
`getUser`/`refreshSession` → session hợp lệ, refresh hoạt động (cơ chế
nền cho session persistence qua cookie `@supabase/ssr`);
`resetPasswordForEmail` báo lỗi domain `.invalid` không hợp lệ — đúng vì
GoTrue chặn trước khi gửi mail cho domain không có MX record, KHÔNG phải
bug, domain thật (gmail.com...) không gặp lỗi này. Đọc code xác nhận
`middleware.ts`/`protected-routes.ts` gate `/portal/*` đúng, `/admin/*`
check thêm `members.is_admin` riêng.

**Chưa tự test được:** đăng ký thật qua `/register`/Google OAuth trên
Preview URL của nhánh này với tài khoản Admin thật (giới hạn sandbox đã
nêu nhiều lần) — Founder tự thử 1 email thật chưa từng dùng để xác nhận
trực quan lần cuối, đặc biệt kiểm tra bước onboarding (`interests`/
`ai_goal`...) chạy đúng sau khi trigger tạo `members` thành công.

## BUG P0 ĐÃ SỬA — `members` thiếu RLS UPDATE cho user tự sửa hồ sơ, kẹt vĩnh viễn ở `/onboarding`

Phát hiện khi test trực tiếp luồng Register → Onboarding → Portal bằng
API thật (tài khoản QA disposable, domain `.invalid`) theo yêu cầu
Founder "test luồng đăng nhập vào portal". Nghiêm trọng hơn cả bug
trigger thiếu `email` đã sửa trước đó — bug này chặn **mọi user mới sau
khi đăng ký thành công**, không phải chỉ chặn lúc tạo tài khoản.

**Nguyên nhân:** `members` bật RLS nhưng chỉ có 2 policy SELECT cho user
thường (`auth.uid() = id`) + 1 policy `admin_all` (`FOR ALL USING
(is_app_admin())`) cho Admin — **không có policy UPDATE nào cho user tự
sửa hồ sơ của chính mình**. `completeOnboarding()`
(`src/app/onboarding/actions.ts`) và `updateProfile()`
(`src/app/portal/account/actions.ts`) đều gọi
`.from("members").update(...).eq("id", user.id)` qua client anon-key +
cookie session (`src/lib/supabase-server.ts`) — RLS **âm thầm lọc bỏ
dòng khỏi UPDATE (0 dòng bị ảnh hưởng, KHÔNG trả lỗi)**, code tưởng
thành công → `redirect(next)`. `middleware.ts`'s onboarding gate kiểm
tra lại `onboarding_completed_at` (vẫn `null`) → đá ngược `/onboarding`
→ **vòng lặp vô hạn, không bao giờ vào được `/portal`**. Founder chưa
từng gặp vì tài khoản Founder `is_admin=true` luôn khớp `admin_all`,
bypass hoàn toàn lỗi này.

**Đã sửa qua `apply_migration`** — thêm policy UPDATE cho user tự sửa hồ
sơ, kèm 1 trigger `BEFORE UPDATE` khoá cứng các cột nhạy cảm
(`id`/`email`/`is_admin`/`status`/`created_at`/`referral_code`/
`referred_by`) về giá trị cũ nếu người thực hiện không phải app-admin
hoặc `service_role` (đảm bảo Admin panel qua `getSupabaseAdmin()` không
bị ảnh hưởng, đồng thời chặn user tự nâng quyền admin qua chính API
onboarding/account này):
```sql
create policy "users can update own profile" on public.members
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- + trigger guard_members_self_update (xem supabase-phase24-...sql)
```

**Verify thật qua API** (cùng tài khoản QA disposable dùng để phát hiện
bug, đã xoá sạch sau test):
1. Đăng nhập, gọi đúng câu update y hệt `completeOnboarding()` →
   TRƯỚC khi sửa: `error: null`, `0 dòng bị ảnh hưởng`, đọc lại
   `onboarding_completed_at` vẫn `null` (tái hiện bug). SAU khi sửa:
   `1 dòng bị ảnh hưởng`, đọc lại đúng dữ liệu đã lưu.
2. Thử tự nâng quyền (`update({is_admin: true, email: "hacked@evil.com"})`
   trên chính dòng của mình) → bị trigger chặn hoàn toàn, đọc lại vẫn
   `is_admin: false`, email gốc không đổi — xác nhận không có lỗ hổng
   leo thang đặc quyền mới phát sinh từ bản fix.
3. Google OAuth: xác nhận provider đã cấu hình đúng trên project (gọi
   thẳng `GET /auth/v1/authorize?provider=google` → redirect 302 tới
   `accounts.google.com` với `client_id` thật, không phải lỗi "provider
   not enabled") — không tự test được toàn bộ luồng consent thật (cần
   tương tác trình duyệt + tài khoản Google thật).
4. Đọc code xác nhận `auth/callback/route.ts` dùng chung đúng cho cả
   Google OAuth/magic-link/password-reset, `sanitizeNextParam()` chặn
   open-redirect, mặc định `/portal`; Hero CTA trỏ `/login` (đúng thiết
   kế "vào thẳng portal" — middleware tự redirect `/login`→`/portal` nếu
   đã đăng nhập).

**File tracking:** `supabase-phase24-members-self-update-rls.sql`.

**Chưa tự test được:** click-through thật qua trình duyệt (Register →
verify email nếu Confirm-email đang bật → Onboarding → Portal, và toàn
bộ luồng Google OAuth) với tài khoản thật (giới hạn sandbox không có
inbox email/trình duyệt tương tác được) — Founder tự thử trên Preview
URL, đặc biệt xác nhận nút "Lưu" ở `/portal/account` giờ lưu được (bug
này ảnh hưởng cả trang đó, không riêng onboarding).

## Landing Page CMS (Phase 25) — Live-edit cho trang chủ marketing công khai (`/`)

Founder yêu cầu: "Xây Quản lý Landing Page hiện tại" — Tier 2 của kế
hoạch Admin tổng thể (Tier 1 là Portal, đã xong qua toàn bộ Nhóm 3 ở
trên; Tier 2 là trang Landing Page marketing công khai trước đăng nhập,
`/`, chưa từng có Admin CMS nào). Dùng đúng kiến trúc "Live-edit Cách A"
đã chốt cho Portal (render lại component thật + `EditableRegion`), phạm
vi **Tier 1 "An toàn"**: chỉ field text (eyebrow badge/tiêu đề/mô tả/CTA
label) của 8 trong 9 section trên `HomeClient.tsx`.

**Đã audit từng section trước khi build** (đọc full code, không suy
đoán) — loại trừ khỏi phạm vi, giữ nguyên 100% trong code:
- Toàn bộ `QuizAssessment.tsx` (`QUESTIONS`/`LEVELS`) — có logic tính
  điểm dựa trên vị trí/số lượng câu trả lời, rủi ro cao nếu cho sửa tự do
  qua UI generic (đúng nguyên tắc đã áp dụng cho CKOS Learning Engine).
- Mảng `ITEMS`/`STEPS` (`EcosystemPillars`), `LIST` (`PortalPreview`),
  `FEATURES`/`VALUES` (`TrustStats`) — mỗi phần tử gắn 1 icon PNG cố định
  trong `public/images/landing-preview/icons/`, số lượng phần tử khớp
  đúng bố cục lưới cố định (vd. `xl:flex-nowrap` 6 cột) — sửa tự do có
  rủi ro lệch layout/thiếu icon, cùng lý do các mảng icon-bound khác
  trong dự án (`CHAPTER_DESTINATIONS`...).
- `floatingBadges`/`vortexQuestions` (`Hero.tsx`) — trang trí động, không
  phải nội dung chính.
- Danh sách `tools` (`ToolsIUse.tsx`, import `@/data/tools`) — dữ liệu
  dùng chung toàn dự án, không riêng Landing Page.
- Ảnh tĩnh (`founder.png`, 3 ảnh cộng đồng) — dự án chưa có hạ tầng
  upload.
- MỌI `href` (kể cả CTA `/login`) — giữ hardcode trong code, tránh Admin
  gõ sai tạo link chết trên trang lưu lượng cao nhất hệ thống (cùng
  quyết định đã áp dụng cho `home_cards`/Premium Dashboard).

**Dữ liệu:** bảng mới `landing_chrome` (migration
`supabase-phase25-landing-chrome.sql`, đã áp dụng qua Supabase MCP —
schema generic `id/data jsonb/status/order`, 8 dòng, 1/section theo đúng
thứ tự hiển thị trong `HomeClient.tsx`: hero/ecosystem-pillars/
portal-preview/skills-showcase/tools-i-use/trust-stats/ecosystem/
final-cta). `src/lib/portal/live-landing-chrome.ts` — `LandingChromeRow`
type (tất cả field optional trừ `id`/`status`, vì mỗi section chỉ dùng
1 tập con field khác nhau) + `DEFAULT_LANDING_CHROME` (seed verbatim,
khớp 100% nội dung hardcode gốc — đã diff xác nhận qua test HTML
server-render) + `getLiveLandingChrome()` (`cache()` + `getSupabasePublic()`,
merge từng field string từ `data` jsonb đè lên default, fallback toàn bộ
default nếu Supabase chưa cấu hình/lỗi/rỗng).

**Kiến trúc chia sẻ 1 Context cho 8 component** — đúng tình huống đã gặp
với `EcosystemChromeContext`/`PremiumChromeContext` (1 bảng nhiều dòng,
cần đọc/sửa từ nhiều component khác nhau trong CÙNG 1 trang): 1 lệnh gọi
`useCollection()` duy nhất ở `LandingChromeProvider`
(`src/components/home/LandingChromeContext.tsx`, bọc quanh toàn bộ
`HomeClient`), mỗi section tự lọc đúng dòng của mình qua
`useLandingChrome(sectionId)`. `EditModeContext.tsx`/`EditableRegion.tsx`
(`src/components/home/`) — bản sao thứ 10 của pattern popover đã dùng
xuyên suốt dự án (portal thật + `home`/`premium`/`companion`...), giữ
đúng byte-for-byte kỹ thuật `createPortal` vào `document.body` +
`max-h-[70vh] overflow-y-auto`.

**8 component sửa** (`src/components/home/`, mỗi file thêm
`useLandingChrome(sectionId)` + `FieldConfig[]` + bọc `EditableRegion`
quanh đúng khối text hiển thị, thay text hardcode bằng `{chrome.field}`):
`Hero.tsx` (7 field: eyebrowBadge/headlineLine1/headlineLine2/
headlineHighlight/subheadline/ctaLabel/tagline — 3 vùng `EditableRegion`
riêng vì tagline nằm sau CTA hardcode ở giữa),
`EcosystemPillars.tsx` (5 field: eyebrowBadge/heading + roadmapHeading/
roadmapDesc/roadmapCtaLabel — 2 vùng),
`PortalPreview.tsx` (3 field: eyebrowBadge/heading/ctaLabel — 2 vùng),
`SkillsShowcase.tsx` (3 field: eyebrowBadge/heading/youtubeId — 2 vùng,
`YOUTUBE_ID` hardcode cũ xoá hẳn, thay `${chrome.youtubeId}` trong URL
embed/thumbnail),
`ToolsIUse.tsx` (2 field: eyebrowBadge/heading, heading vẫn bọc trong
`RevealText` gốc),
`TrustStats.tsx` (3 field: eyebrowBadge/heading/description),
`Ecosystem.tsx` (6 field: eyebrowBadge riêng + 5 field khối Founder —
founderQuote/founderQuoteAttribution/founderBioParagraph1/
founderBioParagraph2/founderTitle),
`FinalCTA.tsx` (2 field: heading/ctaLabel).

**Bug tự phát hiện và sửa trước khi commit (đúng lớp lỗi đã ghi ở mục
"popup Live-edit bị cắt cụt"/"bug margin `EditableRegion`" trước đó):**
lúc đầu đặt `className="mt-5 ..."` trực tiếp trên `EditableRegion` bọc
tagline (`Hero.tsx`) và `className="flex flex-1 flex-col justify-center
px-5 py-[19px]..."` trên `EditableRegion` bọc khối Founder
(`Ecosystem.tsx`) — `className` của `EditableRegion` CHỈ áp dụng khi
`editMode=true` (khi `false`, component return thẳng `<>{children}</>`,
bỏ qua hoàn toàn `className`), nên các class layout/margin đó sẽ biến
mất trên Landing Page thật. Đã sửa: mọi margin/layout class giữ nguyên
trên phần tử con thật bên trong (`<div className="mt-5 ...">`/giữ lại
`<div className="flex flex-1 flex-col justify-center ...">` bao ngoài
`EditableRegion`), không đặt trên chính `EditableRegion`.

**`page.tsx`/`HomeClient.tsx`:** `page.tsx` đổi thành `async function`,
gọi `getLiveLandingChrome()`, truyền `seedChrome` xuống `HomeClient`.
`HomeClient.tsx` nhận thêm prop `seedChrome: LandingChromeRow[]`, bọc
toàn bộ 9 section trong `<LandingChromeProvider seedChrome={seedChrome}>`
(giữ nguyên `QuizAssessment` không đụng — không cần chrome). Portal thật
(`editMode=false` mặc định) — `useCollection(key, seed, {enabled: false})`
pass-through `seedChrome`, KHÔNG fetch mạng thêm (đã verify qua code
review + test HTML server-render, cùng cơ chế đã dùng cho `home_cards`/
5 Cửa Hành trình).

**Admin route mới** `/admin/landing`
(`src/app/admin/(dashboard)/landing/page.tsx`) — render lại ĐÚNG
`HomePage` (`@/app/page`, import thẳng) bọc `<EditModeProvider>`, cùng
pattern `/admin/home-cards`/`/admin/premium/dashboard`. `nav.ts` thêm
group MỚI `"Landing Page"` (ngoại lệ có ghi chú với nguyên tắc 1:1 Portal
— trang này là marketing công khai trước đăng nhập, không thuộc 10 mục
`portalNavSections`), đặt trước "Trang chủ Học viện". `AdminSidebar.tsx`
thêm icon `Globe` cho `/admin/landing`. `dashboard/page.tsx` thêm
`PORTAL_HREF_FOR_GROUP["Landing Page"] = "/"` (nút "Xem trên Portal" trỏ
đúng trang chủ marketing) — không thêm vào `TABLE_FOR_HREF` (route merge
8 dòng của 1 bảng qua render lại trang thật, không map 1-1 vào cấu trúc
`Record<href, 1 table>` đơn giản — cùng cách xử lý Mirror/Journal/6 khối
Companion/Premium Dashboard).

**Verify:** `rm -rf .next && npm run build` sạch (route `/admin/landing`
xuất hiện đúng), `tsc --noEmit`/`eslint` sạch, `vitest run` 139/139 pass.
Test thật qua `next start` (production build, không phải `next dev`) —
`curl "/"` trả `200`, HTML server-render chứa đúng cả 3 chuỗi tiêu biểu
đã đối chiếu verbatim với bản hardcode gốc ("Học AI đúng hướng"/"Tất cả
những gì bạn cần, trong một hệ sinh thái"/"Bắt đầu hành trình chinh phục
các kỹ năng AI của bạn ngay hôm nay.") — xác nhận fallback
`DEFAULT_LANDING_CHROME` render đúng khi Supabase chưa cấu hình (sandbox).
`curl "/admin/landing"` trả `307` redirect `/admin/login` đúng như kỳ
vọng (chưa đăng nhập, cùng hành vi mọi route Live-edit khác).

**Chưa tự test được:** sửa field qua Admin UI thật có tài khoản đăng
nhập (cùng giới hạn sandbox không có `SUPABASE_SERVICE_ROLE_KEY`/tài
khoản Admin thật đã nêu nhiều lần) — Founder tự test tại
`/admin/landing`, xác nhận bút sửa (✎) hiện đúng ở cả 8 section, lưu
xong `/` (Portal thật, không qua edit mode) phản ánh đúng nội dung mới.

## BUG ĐÃ SỬA — `/admin/landing` crash ngay khi vào trang (client-side exception)

Founder báo "Lỗi Admin - Landing page" ngay sau khi Landing Page CMS vừa
deploy. Kiểm tra Vercel: deployment `READY`, không có runtime error/log
lỗi nào (mọi request `/admin/landing` đều trả `200`) — nghĩa là lỗi xảy
ra ở tầng client (crash trong trình duyệt), không lộ ra qua log server.

**Nguyên nhân:** `LandingChromeContext.tsx`'s `LandingChromeProvider`
trước đó dùng thẳng `rows: items` từ `useCollection()` — nhưng
`useSupabaseCollection` khởi tạo `items = []` khi `enabled=true` (Admin
edit mode) cho tới khi fetch xong (xem `store.ts`:
`useState<T[]>(enabled ? [] : seed)`). Nghĩa là ở LẦN RENDER ĐẦU TIÊN
tại `/admin/landing`, `rows=[]` — `useLandingChrome(sectionId)` (gọi
trong cả 8 section: Hero/EcosystemPillars/PortalPreview/SkillsShowcase/
ToolsIUse/TrustStats/Ecosystem/FinalCTA) không tìm thấy dòng nào và
`throw new Error(...)` NGAY LẬP TỨC — crash toàn trang. Đây đúng là bug
đã "vá" cho `EcosystemChromeContext`/`PremiumChromeContext` (fallback
`items.find(...) ?? seedChrome`) nhưng bị bỏ sót khi viết
`LandingChromeContext.tsx` mới cho Landing Page.

**Đã sửa:** `LandingChromeProvider` giờ merge `items` đè lên
`seedChrome` theo đúng `id`
(`seedChrome.map((seed) => items.find((r) => r.id === seed.id) ?? seed)`)
— luôn có đủ 8 dòng ngay từ lần render đầu (dùng seed làm fallback), chỉ
thay bằng dữ liệu Supabase thật sau khi fetch xong. Trên Portal thật
(`editMode=false`), `items` vốn đã bằng `seedChrome` (pass-through) nên
merge này là no-op — 0 thay đổi hành vi/hiển thị công khai.

**Verify NGHIÊM NGẶT (before/after, không chỉ đọc code):** dựng 1 route
`devtest-landing-admin` tạm (render `<EditModeProvider><HomePage/></EditModeProvider>`
không cần đăng nhập, xoá ngay sau khi xong) + test qua Playwright thật
(`next dev`, Chromium proxy args). **Trước khi sửa** (`git stash` tạm
file để tái hiện đúng code cũ): trang thiếu hẳn thẻ `<h1>` (đếm được 0),
nội dung Hero bị thay bằng "Đang tải..." — xác nhận đúng bug. **Sau khi
sửa:** `<h1>` xuất hiện đúng 1 lần, nội dung Hero/toàn trang render đầy
đủ, `page.on("pageerror")` rỗng, không có chữ "Application error" nào
trong DOM. `tsc`/`eslint` sạch, `rm -rf .next && npm run build` sạch
(route `/admin/landing` vẫn xuất hiện đúng), `vitest run` 139/139 pass.

**Bài học (áp dụng cho mọi Context multi-row tương lai):** khi viết 1
Context chia sẻ `useCollection()` cho nhiều dòng (`ecosystem_chrome`,
`landing_chrome`...), LUÔN fallback về seed theo từng `id` — không bao
giờ dùng thẳng `items` (hoặc `items[0]`) làm nguồn duy nhất, vì
`useCollection({enabled:true})` cố ý trả mảng rỗng ở lần render đầu tiên
(trước khi fetch xong) theo đúng thiết kế của `store.ts`.

**File sửa:** `src/components/home/LandingChromeContext.tsx` (duy nhất).

## KIẾN TRÚC ADMIN V2.0 — tái cấu trúc sidebar thành 8 Workspace

Founder yêu cầu tái cấu trúc Admin thành trung tâm quản trị thống nhất: 8
Workspace cấp cao bằng tiếng Việt (Tổng quan/Người dùng/Website/Học viện/
Vận hành/Marketing/Thương hiệu & Media/Hệ thống), audit trực tiếp trước khi
sửa, không xây lại từ đầu, không đổi URL route đang hoạt động, không tạo
CRUD giả cho module chưa có chức năng thật.

### Audit trước khi sửa (bắt buộc, đã làm đầy đủ)

- **Toàn bộ route `/admin/*`**: 37 `page.tsx` (không tính `dashboard`/
  `login`/top-level redirect) — đã lập bảng phân loại đầy đủ: Live-edit
  Cách A (14 route: home-cards, landing, premium/dashboard, 5 Hành trình
  của tôi, su-menh-companion/live-edit, duan-cohoi + 5 chi tiết hệ sinh
  thái + 5 dự án con), DataTable/VisualEditor CRUD (~15 route), Editor
  riêng (companion, course-pricing, ckos/lessons, ckos/case-studies,
  premium/courses/.../builder), Read-only (ckos Dashboard, users).
- **Tìm code nghiệp vụ nằm NGOÀI `/admin`** trước khi khai "Sắp triển
  khai" (tránh khai nhầm cái đã có): phát hiện quan trọng nhất — bảng
  `orders`/`leads`/`support_tickets` đã có DỮ LIỆU THẬT chảy vào liên tục
  (checkout+webhook SePay, `/api/leads`, `/portal/support`) nhưng **chưa
  từng có trang Admin nào đọc** — đây là gap thật, không phải "chưa có
  chức năng". Ngược lại, bảng `coupons` có schema nhưng **0 dòng code**
  (kể cả checkout) đọc/ghi — đây mới đúng nghĩa "chưa có chức năng thật".
  Không có Brand Studio/Media Center/campaign/email marketing nào tồn
  tại (đã grep xác nhận) — "Companion Studio™" (`src/ai/**`) là tầng AI
  Provider viết nội dung, KHÔNG phải quản lý thương hiệu, dễ nhầm tên.
- **Cơ chế auth**: `middleware.ts` gate mọi `/admin/:path*` (trừ
  `/admin/login`) qua `members.is_admin`, không có route nào bypass được
  — mọi route mới tự động được bảo vệ, không cần sửa middleware.
  `requireAdmin()` là lớp phòng hộ thứ 2 (page.tsx tự gọi), giữ nguyên.

### Cấu trúc dữ liệu mới — `src/lib/admin/nav.ts`

Đổi từ `adminNavGroups: AdminNavGroup[]` (2 tầng: group → item, 11 group
phẳng) sang `adminWorkspaces: AdminWorkspace[]` (`id`/`label`/`items?`/
`subGroups?`) — **CHỈ workspace "Học viện" dùng `subGroups`** (đúng 10
group Portal cũ, giữ nguyên 100% label/href), 7 workspace còn lại dùng
`items` phẳng. Thêm `AdminNavItem.comingSoon?: boolean` đánh dấu module
"Sắp triển khai". Hàm mới `flattenAdminNav()` làm phẳng cả 3 tầng
(Workspace/SubGroup/Item) → dùng chung cho `AdminSearch`/Dashboard.

**KHÔNG đổi 1 href nào của route đang hoạt động** — chỉ đổi cách NHÓM
hiển thị. Đã verify bằng build: toàn bộ route cũ (`/admin/ckos/*`,
`/admin/duan-cohoi/*`, `/admin/hanh-trinh-cua-toi/*`...) xuất hiện y hệt
trong output `next build`, không route nào biến mất/redirect.

### `AdminSidebar.tsx` — 3 tầng thay vì 2 tầng

Workspace (icon riêng, `workspaceIcons`) → SubGroup (chỉ "Học viện" có) →
Item (icon theo href, `navIcons`, giữ nguyên toàn bộ mapping cũ + thêm 3
icon route mới). Item `comingSoon` dùng icon `Hourglass` chung + badge
nhỏ "Sắp ra mắt" (ẩn khi sidebar thu gọn, hiện trong tooltip). State 2 cấp
độc lập (`openWorkspaces`/`openSubGroups`), tự mở đúng Workspace+SubGroup
chứa route active khi điều hướng (tách hàm thuần `findActiveNav()` ra
ngoài component — tránh lỗi React Compiler "Could not preserve existing
memoization" khi `useMemo` có nhiều điểm `return` sớm lồng trong vòng
lặp). Khi sidebar thu gọn (chỉ icon) — bỏ qua mọi header Workspace/
SubGroup, liệt kê phẳng toàn bộ item kèm tooltip hover, giữ đúng hành vi
cũ.

**Verify bằng Playwright thật** (qua `next start`, không phải `next dev`
— HMR WebSocket qua proxy sandbox gây remount silent, đã ghi nhận từ
trước, dùng `next dev` cho ra kết quả sai là "click không có tác dụng"):
click "Học viện" → hiện đúng 10 SubGroup; click "Hệ tri thức AI (CKOS)"
→ hiện đúng 11 item gốc; mở "Website" → hiện đúng 5 badge "Sắp ra mắt"
(6 item, chỉ Landing Page là thật); thu gọn sidebar → 76 link vẫn hiện
đủ dạng icon rail, 0 lỗi console/page error.

### `AdminSearch.tsx` — tìm theo Workspace/SubGroup/route

Đổi sang dùng `flattenAdminNav()`, hiển thị nhãn nhóm dạng `Workspace ·
SubGroup` khi có subGroup (vd. "Học viện · Hệ tri thức AI (CKOS)"). Thêm
tìm theo `href` (trước chỉ tìm theo `label`/`group`) — gõ 1 phần đường
dẫn route cũng ra kết quả. Kết quả có `comingSoon` hiện badge "Sắp ra
mắt" ngay trong dropdown.

### 32 route mới — 3 route THẬT (chỉ đọc) + 29 route "Sắp triển khai"

**3 route thật, chỉ đọc** (Vận hành — data đã tồn tại, chỉ thiếu UI đọc,
KHÔNG thêm action tạo/sửa/xoá/hoàn tiền/đổi trạng thái nào, không đụng
checkout/webhook SePay):
- `/admin/van-hanh/don-hang` — đọc bảng `orders` (`member_email`/
  `product_name`/`amount`/`status`/`order_code`/`customer_name`/
  `course_id`/`created_at`), badge trạng thái pending/confirmed/rejected.
- `/admin/van-hanh/khach-hang-tiem-nang` — đọc bảng `leads`.
- `/admin/van-hanh/ho-tro-khach-hang` — đọc bảng `support_tickets`, hiện
  cả `reply` nếu đã có.

**29 route "Sắp triển khai"** — dùng chung component mới
`src/components/admin/WorkspacePlaceholder.tsx` (tiêu đề + mô tả + danh
sách "Phạm vi dự kiến" + ghi chú lý do/nguồn dữ liệu liên quan +
`relatedLink` nếu có module thật gần đó) — KHÔNG CRUD giả, KHÔNG dữ liệu
mẫu bịa, mỗi trang ghi rõ vì sao chưa làm (bảng mồ côi, chưa tích hợp
dịch vụ ngoài, hành động nhạy cảm ngoài phạm vi, hoặc cần thiết kế mới):
Tổng quan (Công việc/Thông báo/Hoạt động gần đây — 3), Người dùng (Vai
trò & Phân quyền/Thành viên/Phiên đăng nhập — 3), Website (Nội dung
Website/Điều hướng/Header & Footer/Popup & Banner/SEO Website — 5), Vận
hành (Thanh toán/Mã giảm giá/Tiếp thị liên kết — 3, tránh trùng sở hữu
dữ liệu với Đơn hàng), Marketing (5), Thương hiệu & Media (5), Hệ thống
(5, KHÔNG hiển thị bất kỳ giá trị biến môi trường/secret nào).

### Dashboard v2 — `src/app/admin/(dashboard)/dashboard/page.tsx`

Viết lại hoàn toàn theo 5 lớp: (1) Tổng quan hệ thống (đếm module thật/
Sắp triển khai từ `flattenAdminNav()`), (2) Việc cần xử lý (đơn hàng
pending + ticket open, số thật), (3) Quick Actions (6 nút, CHỈ trỏ route
đã tồn tại thật — Landing Page/CKOS/Lesson/bài viết Dự án & Cơ hội/Quản
lý dự án/Đơn hàng), (4) 7 Workspace dạng card (bỏ "Tổng quan" — chính là
trang này; "Học viện" liệt kê 10 SubGroup thay vì 27 item lẻ, mỗi
SubGroup cộng dồn số đếm các item con), (5) Hoạt động gần đây (gộp
`orders`/`leads`/`support_tickets` mới nhất theo `created_at`, không
phải dữ liệu giả). Link "Xem trên..." CHỈ gắn cho Website (`/`) và Học
viện (`/portal`) — 5 Workspace còn lại không có URL công khai, không gắn
link giả.

### Đính chính rủi ro đã cân nhắc, quyết định giữ nguyên (không mở rộng)

- "Thành viên" (Người dùng) KHÔNG tách UI riêng — cùng bảng `members`
  với "Danh sách người dùng", tránh 2 menu cùng sở hữu 1 nguồn dữ liệu.
- "Thanh toán" (Vận hành) KHÔNG có trang riêng — trạng thái nằm sẵn
  trong cột `status` của Đơn hàng.
- "Tiếp thị liên kết" (Vận hành) KHÔNG đụng `ecosystem_chrome.affiliateOffers`
  (đã thuộc Workspace Học viện từ trước) — chỉ trỏ link tham chiếu.
- "CTA" (Marketing) KHÔNG sửa nội dung CTA của bất kỳ module nào — chỉ
  dự kiến đọc số liệu hiệu suất, việc sửa nội dung vẫn ở đúng module sở
  hữu (Landing Page, Premium...).

### Verify

`tsc --noEmit`/`eslint src` sạch (0 lỗi mới — 18 warning còn lại đều có
từ trước, không liên quan đợt này), `rm -rf .next && npm run build`
sạch (32 route mới + toàn bộ route cũ xuất hiện đúng), `vitest run`
139/139 pass. Test thật qua `next start` (curl, không cần đăng nhập):
Landing Page `/` vẫn `200` + nội dung y hệt trước; `/portal` `200`
(fallback công khai đúng thiết kế khi sandbox không cấu hình Supabase);
mọi route `/admin/*` (cả cũ lẫn mới, 16 route mẫu) đều `307` redirect
`/admin/login` — không route nào 404. Test tương tác Sidebar qua route
devtest tạm (`AdminShell` bọc, không cần đăng nhập — đã xoá ngay sau khi
xong): xem mục "AdminSidebar.tsx" ở trên.

**Chưa tự test được:** thao tác Admin UI thật có tài khoản đăng nhập
(cùng giới hạn sandbox không có `SUPABASE_SERVICE_ROLE_KEY`/tài khoản
Admin thật đã nêu nhiều lần) — đặc biệt 3 trang đọc dữ liệu thật (Đơn
hàng/Khách hàng tiềm năng/Hỗ trợ khách hàng) cần Founder tự xác nhận số
liệu hiển thị đúng khớp Supabase Production trên Preview URL.

## ADM-V2-01 — Sprint 1: hoàn thiện Tổng quan + Người dùng (bỏ "Sắp triển khai")

Tiếp nối KIẾN TRÚC ADMIN V2.0 ở trên — Founder duyệt kế hoạch 8-sprint
hoàn thiện toàn bộ 8 Workspace thành module quản trị thật, bỏ hẳn khung
"Sắp triển khai" cho mọi mục nay đã có cách triển khai trung thực (Empty
State chuyên nghiệp thay vì badge). Sprint 1 (ADM-V2-01) phạm vi: Tổng
quan + Người dùng — 2 Workspace đầu tiên, đúng lệnh bắt đầu của Founder.

### Audit trước khi code (không blocker nghiêm trọng)

Qua Supabase MCP (`execute_sql` trên project thật, không suy đoán):
- `members`: không có cột role/permission nào ngoài `is_admin` (boolean).
  Không có bảng role/permission/session/device nào tồn tại trong
  `information_schema.tables` — xác nhận "Vai trò & Phân quyền"/"Thiết bị"
  phải dùng Empty State trung thực hoặc hiển thị đúng mô hình nhị phân
  hiện có, KHÔNG mở schema mới ở sprint này.
- `orders`: có dữ liệu thật nhưng **0 dòng `status='confirmed'`** tại thời
  điểm audit — "Thành viên"/"Premium Membership" (định nghĩa dựa trên đơn
  hàng đã xác nhận) sẽ hiển thị Empty State trung thực cho tới khi có đơn
  đầu tiên được xác nhận (không phải lỗi, không bịa dữ liệu để "trông đầy
  hơn").
- Không có blocker nghiêm trọng → triển khai trong cùng sprint theo đúng
  chỉ đạo "nếu không có blocker, triển khai luôn".

### `nav.ts` + `AdminSidebar.tsx` — bỏ `comingSoon`, thêm 4 mục Người dùng

Bỏ `comingSoon: true` khỏi 3 mục Tổng quan (Công việc/Thông báo/Hoạt động
gần đây) và 3 mục Người dùng cũ (Vai trò & Phân quyền/Thành viên/Phiên
đăng nhập). Thêm 4 mục mới vào Người dùng: Hồ sơ của tôi, Premium
Membership, Thiết bị, Hoạt động người dùng — cả 7 mục Người dùng (ngoài
"Danh sách người dùng" đã có từ Identity Hub v1.0) đều có route thật.
`AdminSidebar.tsx`'s `navIcons` bổ sung 10 icon tương ứng (không còn item
nào trong 2 Workspace này rơi vào nhánh fallback `Hourglass`).

### `AdminEmptyState.tsx` (mới) — Empty State chuyên nghiệp, KHÁC `WorkspacePlaceholder`

`WorkspacePlaceholder` (Hourglass + badge "Sắp triển khai" + "Phạm vi dự
kiến") giữ nguyên, vẫn dùng cho 29 module Sprint 2-8 chưa tới lượt. Module
Sprint 1 đã triển khai nhưng honestly rỗng dùng `AdminEmptyState.tsx` mới
(icon trung tính + tiêu đề + mô tả + action tuỳ chọn, KHÔNG badge/khung
"sắp ra mắt") — đúng yêu cầu "Nếu chưa có dữ liệu, dùng Empty State
chuyên nghiệp... không dùng badge 'Sắp ra mắt'".

### `AdminBreadcrumb.tsx` (mới) — breadcrumb dùng chung

Nhận `trail: {label, href?}[]` tường minh từ mỗi `page.tsx` (không tra
cứu ngầm từ `nav.ts`, tránh phụ thuộc ẩn giữa cấu trúc sidebar và nội
dung trang). Đã thêm vào toàn bộ trang mới/sửa trong sprint này +
`/admin/users`.

### Workspace "Tổng quan" — 3 trang thật

- **Công việc** (`/admin/tong-quan/cong-viec`) — gộp đơn hàng
  `status=pending` + ticket `status=open` + lead `status=new` thành 1
  danh sách, mỗi dòng có badge loại + link ra đúng trang Vận hành sở hữu
  dữ liệu. CHỈ ĐỌC.
- **Thông báo** (`/admin/tong-quan/thong-bao`) — `AdminEmptyState` trung
  thực: hệ thống chưa có bảng `notifications`/cơ chế Realtime nào (đã
  grep xác nhận) — không bịa danh sách thông báo.
- **Hoạt động gần đây** (`/admin/tong-quan/hoat-dong-gan-day`) — bản đầy
  đủ hơn khối rút gọn 8 dòng ở Dashboard: gộp tới 60 dòng/bảng (orders/
  leads/support_tickets, MỌI trạng thái), tối đa 100 dòng hiển thị.

### Workspace "Người dùng" — 7 trang (3 sửa lại + 4 mới) + trang chi tiết `/admin/users/[id]`

- **Vai trò & Phân quyền** — hiển thị TRUNG THỰC mô hình nhị phân
  `is_admin` hiện có (đếm Admin/User + danh sách Admin), không bịa ra hệ
  vai trò chi tiết không tồn tại.
- **Thành viên** — thành viên = có ≥1 đơn hàng `confirmed`, gộp theo
  email + tổng chi tiêu + sản phẩm đã mua. Hiện Empty State trung thực
  (0 đơn confirmed tại thời điểm audit).
- **Premium Membership** (mới) — góc nhìn THEO TỪNG GIAO DỊCH mua khoá
  (`orders.course_id` khác rỗng + `confirmed`), join tên khoá từ bảng
  `courses` — khác "Thành viên" (gộp theo người, mọi sản phẩm). Tránh 2
  menu cùng sở hữu 1 câu hỏi nghiệp vụ bằng cách tách rõ 2 góc nhìn
  (theo NGƯỜI vs theo GIAO DỊCH), không tách CRUD/nguồn dữ liệu riêng.
- **Phiên đăng nhập** — `listIdentityUsers()` sắp theo `lastSignInAt`
  giảm dần, KHÔNG có nút thu hồi phiên (Supabase Auth cũng không có API
  liệt kê phiên theo thiết bị — hành động nhạy cảm, chủ động loại khỏi
  phạm vi).
- **Thiết bị** (mới) — `AdminEmptyState` trung thực: không có bảng
  sessions/devices nào, Supabase Auth không expose thông tin thiết bị.
  Cần schema mới nếu triển khai thật — sẽ lập báo cáo/chờ duyệt riêng,
  CHƯA tự tạo bảng ở sprint này.
- **Hồ sơ của tôi** (mới) — hồ sơ CHÍNH tài khoản Admin đang đăng nhập,
  đọc `members` theo đúng `id` phiên hiện tại. CHỈ ĐỌC — sửa hồ sơ vẫn ở
  `/portal/account` như cũ, không tạo hệ thống sửa hồ sơ song song.
- **Hoạt động người dùng** (mới) — gộp sự kiện "Đăng ký mới" +
  "Đăng nhập" từ `listIdentityUsers()`, tối đa 100 dòng, mỗi dòng link
  sang trang chi tiết người dùng.
- **`/admin/users/[id]`** (mới) — trang chi tiết drill-down: hồ sơ đầy đủ
  + lịch sử đơn hàng của đúng email đó. `identity-users.ts` thêm hàm
  `getIdentityUserById()` (dùng `auth.admin.getUserById()`, không phân
  trang lại toàn bộ `auth.users`). Cột Email ở `UsersTable.tsx` giờ là
  `Link` sang trang này.

### Dashboard — KPI thật + "Cảnh báo vận hành"

Thêm 4 ô KPI (Người dùng + số Admin, Premium Membership theo giao dịch
confirmed, Đơn hàng tổng/đã xác nhận, Doanh thu — tổng `amount` các đơn
`confirmed`, cộng dồn JS sau khi `select("amount")`, không dùng RPC mới).
Thêm khối "Cảnh báo vận hành" (`getKpisAndWarnings()`), KHÁC khối "Việc
cần xử lý" đã có (đó là việc cần làm ngay; đây là rủi ro cần lưu ý) — 3
tín hiệu khách quan tính từ dữ liệu thật, không bịa ngưỡng tuỳ tiện: đơn
hàng `pending` quá 48 giờ, ticket `open` quá 72 giờ, và chỉ có đúng 1 tài
khoản Admin (không có phương án dự phòng quyền truy cập). Không cảnh báo
nào → hiển thị "Không có cảnh báo vận hành nào" (trung thực, không giấu
khối đi).

### Diễn giải "loading/error/unauthorized state" cho sprint này

Toàn bộ ~40 route Admin hiện có (trước sprint này) đều KHÔNG có
`loading.tsx`/`error.tsx` riêng — chỉ dựa vào `src/app/loading.tsx`/
`error.tsx` gốc (Error/Suspense boundary ở root layout) + `redirect(
"/admin/login")` cho unauthorized + render lỗi Postgres inline (pattern
`{error && (...)}` đã dùng xuyên suốt, ví dụ `van-hanh/don-hang`). Để
nhất quán với toàn bộ codebase (không tạo 1 pattern loading/error riêng
chỉ cho 11 trang sprint này), 11 trang mới/sửa dùng ĐÚNG 4 trạng thái này
— **không** thêm `loading.tsx`/`error.tsx` cấp route mới. Ghi chú lại vì
`loading.tsx`/`error.tsx` gốc hiện đang style nền tối (`text-white`,
dùng cho Landing/Portal) — lệch tông với nền sáng Admin nếu lỗi/loading
thật sự trigger ở route Admin. Đây là vấn đề CÓ SẴN, áp dụng đồng đều cho
mọi route Admin từ trước tới nay (không phải regression của sprint này)
— nếu Founder muốn Admin có Error/Loading boundary riêng theo đúng nền
sáng, đây là việc riêng, cần quyết định tách biệt.

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch, `npx vitest run` 139/139 pass, `rm -rf .next && npm
run build` sạch (11 route mới/route con `[id]` xuất hiện đúng, 0 warning
mới). `next start` (cổng 4550) — 12 route Admin mẫu (10 route sprint này
+ dashboard + `/admin/users/[id]` với UUID giả) đều trả `307` redirect
`/admin/login` đúng như kỳ vọng (chưa đăng nhập), `/` trả `200`, log
server sạch. Playwright qua route `devtest-adm-v2-01` tạm (bọc
`<AdminShell email="test@example.com">`, xoá ngay sau khi xác nhận, rồi
rebuild sạch để xác nhận đã xoá hết) — mở "Người dùng"/"Tổng quan" trong
sidebar: 0 badge "Sắp ra mắt" còn sót, đủ 8 mục Người dùng + 4 mục Tổng
quan hiện đúng, `page.on("pageerror")` rỗng.

**Chưa tự test được:** thao tác Admin UI thật có tài khoản đăng nhập +
dữ liệu Production thật (cùng giới hạn sandbox không có
`SUPABASE_SERVICE_ROLE_KEY` đã nêu nhiều lần) — đặc biệt số liệu KPI/
Cảnh báo vận hành và nội dung 11 trang mới cần Founder xác nhận trên
Preview URL khớp đúng Supabase Production.

**ĐÃ DỪNG SAU SPRINT 1 theo đúng chỉ đạo** — chưa động tới Sprint 2
(Website) hay bất kỳ Workspace nào khác, chờ Founder/PMO duyệt báo cáo
sprint trước khi tiếp tục.

## ADM-V2-02 — Sprint 2: Website Workspace (Founder đã duyệt tiếp tục)

### Audit trước khi code — phát hiện quan trọng nhất: `settings` đã có sẵn, chỉ thiếu UI

Đọc code (không suy đoán) phát hiện bảng `settings` (schema generic
`id/data/status/order`, ĐÃ đăng ký trong `SUPABASE_COLLECTIONS`) đã tồn
tại từ trước và đã được `getSiteSettings()` (`src/lib/site-settings.ts`)
đọc THẬT (`getSupabaseAdmin()`, KHÔNG cache — mỗi request) để render
`<Header/>`/`<Footer/>` + metadata gốc site-wide (`src/app/layout.tsx`) —
CHỈ THIẾU 1 trang Admin để ghi vào bảng này (route `/admin/settings` cũ
từng bị dọn khỏi `navIcons` như mồ côi ở đợt audit trước — đúng lúc đó vì
chưa có route thật). Giống hệt tình huống `home_cards` đã gặp ở Nhóm 3:
"có bảng, có code đọc, chỉ thiếu UI viết" — không phải "chưa có gì".

Đã grep xác nhận field nào thật sự được dùng trước khi liệt kê vào form
(tránh tạo control "sửa không có tác dụng"): `siteName`/`slogan` (Header
+ Footer), `seoTitle`/`seoDescription` (metadata gốc), `primaryColor`/
`secondaryColor`/`accentColor` (CSS custom properties `--color-brand-*`
toàn site, `layout.tsx`), `faviconUrl` (metadata icon), `facebookUrl`/
`youtubeUrl`/`tiktokUrl`/`zaloUrl`/`adminEmailNotify` (Footer). **2 field
tồn tại trong schema nhưng KHÔNG nơi nào đọc** (`logoUrl` — Header/Footer
vẽ logo SVG cứng; `footerText` — Footer hardcode dòng Copyright riêng) —
CHỦ ĐỘNG loại khỏi form, không đưa vào để tránh CRUD giả.

Audit 4 module còn lại: `mainNav` (Header, `src/lib/site.ts`) + `columns`
(Footer, `Footer.tsx`) hardcode, KHÔNG bảng nào quản — cần migration mới.
Không có component popup/banner nào tồn tại ở tầng hiển thị (không chỉ
thiếu bảng). 6 trang tĩnh (`/about`...`/refund-policy`) là component React
nội dung dài/có cấu trúc, khác hẳn các "chrome" 1-vài-field đã Live-edit
trước đây — rủi ro pháp lý nếu sửa sai qua UI generic.

### Đã làm — 2 module thật, không cần migration

- **Header & Footer** (`/admin/website/header-footer`) — `SingletonEditor`
  (component có sẵn từ trước, dùng chung với Companion CMS) trên bảng
  `settings`, 13 field đã audit đúng như trên. Không cần migration.
- **SEO Website** (`/admin/website/seo-website`) — CHỈ ĐỌC, đúng nguyên
  tắc bắt buộc "SEO kỹ thuật không sửa tự do qua UI". Gọi TRỰC TIẾP
  `sitemap()`/`robots()` (import thẳng từ `src/app/sitemap.ts`/`robots.ts`)
  + `metadata` export của 6 trang tĩnh (import thẳng, cùng kỹ thuật "import
  page module để lấy 1 export" đã dùng cho Live-edit Cách A) — hiển thị
  ĐÚNG cấu hình đang chạy thật, tự động đồng bộ nếu code thay đổi sau này,
  không phải bản sao chép tay.

### Đã làm — 3 module còn lại: Empty State trung thực, KHÔNG comingSoon

- **Điều hướng** — thiếu đúng 1 bảng (giống Header & Footer) nhưng KHÁC ở
  mức rủi ro: Header/Footer xuất hiện ở MỌI trang công khai (Landing Page,
  lưu lượng cao nhất hệ thống), nên đã lập riêng **đề xuất migration CHƯA
  APPLY** — `supabase-phase26-site-navigation.sql` (bảng generic
  `site_navigation`, phân biệt Header/Footer qua field `location`/
  `groupLabel` trong `data`) kèm báo cáo rủi ro ngay trong file: (1) 1 href
  sai lan rộng toàn site, không giới hạn 1 trang; (2) cần sửa
  `HeaderClient.tsx`/`Footer.tsx` (tầng Shell dùng chung) để đọc bảng mới —
  rủi ro hồi quy cao hơn 1 trang con; (3) cần fallback tĩnh an toàn khi
  Supabase lỗi/rỗng; (4) đề xuất tách thành 1 việc RIÊNG, không gộp chung
  Sprint 2. **Chờ Founder xác nhận riêng trước khi `apply_migration`.**
- **Popup & Banner** — khác Điều hướng: không chỉ thiếu bảng, KHÔNG có
  component hiển thị nào ở tầng Landing Page/Portal (đã grep xác nhận).
  Phạm vi lớn hơn 1 migration đơn thuần (thời gian hiệu lực/vị trí hiển
  thị/kiểu banner) — cần Founder quyết định phạm vi cụ thể trước, CHƯA lập
  đề xuất migration.
- **Nội dung Website** — 6 trang tĩnh là component có cấu trúc/nội dung
  dài (không phải vài field chrome đơn giản), đặc biệt có 3 trang pháp lý
  (Điều khoản/Chính sách bảo mật/Hoàn phí) — sai sót khi CMS hoá có rủi ro
  pháp lý thật. Cần Founder quyết định phạm vi (rich-text nguyên trang hay
  tách theo section) trước khi thiết kế schema.

Cả 3 dùng `AdminEmptyState` (không badge "Sắp ra mắt"), mô tả trung thực
lý do + link liên quan — đúng pattern đã áp dụng cho "Thiết bị" ở Sprint 1
(module cũng cần schema mới nhưng vẫn bỏ khung "Sắp triển khai").

### `nav.ts` + `AdminSidebar.tsx`

Bỏ `comingSoon` khỏi cả 5 mục Website (Landing Page vốn đã không có từ
Sprint 0). Thêm 5 icon (`FileText`/`Navigation`/`PanelTop`/`Megaphone`/
`Search`) — không còn item nào trong Workspace này rơi vào fallback
`Hourglass`.

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch, `npx vitest run` 139/139 pass, `rm -rf .next && npm
run build` sạch (5 route Website xuất hiện đúng, 0 warning mới). `next
start` — 5 route trả `307` đúng (chưa đăng nhập), `/` vẫn `200`, log
server sạch. Playwright qua route devtest tạm (xoá + rebuild sạch sau khi
xác nhận) — mở "Website" trong sidebar: 0 badge "Sắp ra mắt" còn sót, đủ 6
mục (kể cả Landing Page) hiện đúng, `page.on("pageerror")` rỗng.

**Chưa tự test được:** sửa Header & Footer qua Admin UI thật (cùng giới
hạn sandbox không có `SUPABASE_SERVICE_ROLE_KEY`) — Founder tự test tại
`/admin/website/header-footer`, xác nhận đổi `siteName`/màu/social link
phản ánh đúng ngay trên Website (không cần deploy lại, vì `getSiteSettings()`
đọc mỗi request).

**MIGRATION CHỜ DUYỆT RIÊNG (chưa apply):**
`supabase-phase26-site-navigation.sql` — bảng `site_navigation` cho module
"Điều hướng". Xem báo cáo rủi ro đầy đủ trong chính file SQL.

**ĐÃ DỪNG SAU SPRINT 2 theo đúng chỉ đạo** — chưa động tới Sprint 3 (Học
viện) hay bất kỳ Workspace nào khác, chờ Founder/PMO duyệt báo cáo sprint
+ xác nhận riêng về đề xuất migration "Điều hướng" trước khi tiếp tục.

## ADM-V2-03 — Sprint 3: Vận hành (Operations) — Founder chọn làm trước Học viện

Founder duyệt tiếp tục nhưng chỉ định đổi thứ tự: Vận hành trước, không
theo đúng thứ tự Học viện đã nêu ở báo cáo Sprint 2. 3/6 mục
(Đơn hàng/Khách hàng tiềm năng/Hỗ trợ khách hàng) đã thật từ Sprint 0 —
sprint này hoàn thiện 3 mục còn lại + thêm breadcrumb cho cả 6.

### Audit — 2 ĐÍNH CHÍNH QUAN TRỌNG lật ngược ghi chú cũ (không tin ghi chú, grep lại trực tiếp)

**"Mã giảm giá" — ghi chú cũ SAI.** `nav.ts`/`WorkspacePlaceholder` cũ ghi
"bảng `coupons` không có code nào (kể cả checkout) đọc/ghi". Grep trực
tiếp `src/app/portal/checkout/actions.ts` phát hiện `applyCoupon()` ĐÃ
đọc/validate (`active`/`expires_at`/`max_uses`)/trừ tiền vào
`orders.amount`/tăng `used_count` — tính năng THẬT đang chạy. Xác nhận
qua Supabase MCP: 2 mã thật tồn tại, 1 mã (`VODUONG68`) đã
`used_count=2`. Vì có nghiệp vụ thật tiêu thụ dữ liệu này, xây CRUD thật
ở đây là ĐÚNG (không phải CRUD giả) — khác các trường hợp Sprint 1/2 nơi
Empty State là lựa chọn đúng vì chưa có nghiệp vụ nào tiêu thụ.

**"Tiếp thị liên kết" — ghi chú cũ THIẾU.** Ghi chú cũ chỉ biết tới nội
dung tĩnh affiliate ở Dự án & Cơ hội (`ecosystem_chrome.affiliateOffers`).
Audit lại phát hiện bảng `referrals` (`referrer_id`/`referred_email`/
`referred_id`/`order_id`/`commission_rate`/`commission_amount`/`status`
pending-confirmed-paid/`paid_at`) + `members.referral_code`/`referred_by`
— một hệ HOA HỒNG GIỚI THIỆU THẬT của chính VDAI, đã được
`/portal/referral` ("Hoa hồng giới thiệu") đọc từ trước — hoàn toàn khác
affiliate bên ngoài (Lazada/Shopee) ở Dự án & Cơ hội. Chỉ CHƯA có Admin UI
nào đọc bảng này. 0 dòng dữ liệu tại thời điểm audit.

**"Thanh toán" — re-audit xác nhận ghi chú cũ ĐÚNG**, không phát hiện gì
mới: chỉ là cột `orders.status`, cập nhật qua webhook SePay
(`src/app/api/webhooks/sepay/route.ts`), không có thực thể giao dịch
riêng nào khác.

### Đã làm

- **Mã giảm giá** (`/admin/van-hanh/ma-giam-gia`) — CRUD THẬT (Server
  Actions riêng, bảng `coupons` typed — cùng pattern `case_studies`/
  `courses`, không qua `/api/admin/collections/[table]`): tạo/sửa/xoá mã
  (code/loại giảm %/số tiền/giới hạn lượt dùng/ngày hết hạn/bật-tắt).
  `used_count` CHỈ ĐỌC (do `applyCoupon()` tự tăng, Admin không sửa tay).
  KHÔNG đụng `applyCoupon()`/luồng checkout.
- **Tiếp thị liên kết** (`/admin/van-hanh/tiep-thi-lien-ket`) — CHỈ ĐỌC
  bảng `referrals` (join email người giới thiệu qua `members`), badge
  trạng thái pending/confirmed/paid. Cùng mức thận trọng như Đơn hàng/Hỗ
  trợ khách hàng — KHÔNG thêm hành động "đánh dấu đã trả hoa hồng" (ngoài
  phạm vi đã duyệt, đây là hành động chi tiền thật). 0 dòng hiện tại →
  `AdminEmptyState`.
- **Thanh toán** (`/admin/van-hanh/thanh-toan`) — `AdminEmptyState` (bỏ
  badge "Sắp ra mắt"), giải thích rõ không tạo trang riêng, trỏ sang Đơn
  hàng.
- **Breadcrumb** — thêm `AdminBreadcrumb` vào cả 3 trang thật cũ (Đơn
  hàng/Khách hàng tiềm năng/Hỗ trợ khách hàng, xây từ Sprint 0 trước khi
  `AdminBreadcrumb` tồn tại) để cả 6 mục Vận hành đồng nhất.

### `nav.ts` + `AdminSidebar.tsx`

Bỏ `comingSoon` khỏi 3 mục còn lại (Thanh toán/Mã giảm giá/Tiếp thị liên
kết). Thêm 3 icon (`CreditCard`/`Ticket`/`Users2`).

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch, `npx vitest run` 139/139 pass, `rm -rf .next && npm
run build` sạch (6 route Vận hành xuất hiện đúng). `next start` — 6 route
trả `307` đúng, `/` vẫn `200`, log sạch. Playwright qua route devtest tạm
(xoá + rebuild sạch sau khi xác nhận) — mở "Vận hành": 0 badge "Sắp ra
mắt" còn sót, đủ 6 mục hiện đúng, `page.on("pageerror")` rỗng.

**Chưa tự test được:** tạo/sửa/xoá mã giảm giá qua Admin UI thật (cùng
giới hạn sandbox không có `SUPABASE_SERVICE_ROLE_KEY`) — Founder tự test
tại `/admin/van-hanh/ma-giam-gia`, xác nhận mã mới tạo áp dụng được ngay ở
`/portal/checkout`.

**Bài học (áp dụng cho các sprint sau):** ghi chú "chưa có code nào đọc/
ghi bảng X" trong `nav.ts`/`WorkspacePlaceholder` cũ là NHẬN ĐỊNH TẠI THỜI
ĐIỂM VIẾT, không phải sự thật vĩnh viễn — sprint nào động tới module đó
PHẢI tự grep lại từ đầu (không tin ghi chú), như đã làm với `coupons`/
`referrals` ở đây.

**ĐÃ DỪNG SAU SPRINT 3 theo đúng chỉ đạo** — chưa động tới Học viện hay
bất kỳ Workspace nào khác, chờ Founder/PMO duyệt báo cáo sprint trước khi
tiếp tục.

## ADM-V2-04 — Sprint 4: Thương hiệu & Media (Brand Studio & Media Center)

Founder chọn tiếp tục với Workspace "Thương hiệu & Media" (5 mục, cả 5
đều `comingSoon` từ Sprint 0).

### Audit — 1 đính chính phạm vi quan trọng

**"Tài liệu" — đổi phạm vi so với ý tưởng gốc.** Ghi chú gốc mô tả "đọc
lại file Markdown trong `docs/` ngay trong Admin" — ý tưởng này CHƯA từng
có gì backing thật (không có UI đọc file nào, giá trị thấp vì Founder có
thể mở repo trực tiếp). Audit phát hiện bảng `documents` (typed:
title/description/url/icon/bg_color/display_order/active) đã có **4 dòng
dữ liệu thật** và đã được `/portal/resources` ("Tài nguyên miễn phí" →
khối "Tài liệu từ VO DUONG AI Academy") đọc thật từ trước — nhưng CHƯA
từng có Admin UI. Vì đây là gap thật giá trị cao hơn hẳn ý tưởng gốc, ưu
tiên xây CRUD cho đúng bảng `documents` thay vì ý tưởng "đọc file
Markdown" (đã đổi tên field mô tả trong `nav.ts`, giữ nguyên href/label).

**Đã kiểm tra thêm, không phát hiện gì dùng được:** `digital_asset_settings`
(đăng ký trong `SUPABASE_COLLECTIONS` nhưng 0 code nào đọc — mồ côi thật,
khác `coupons` ở Sprint 3), `affiliateHub.ts`/`DigitalAssetProjectCard`
(file dữ liệu tĩnh cũ, không còn consumer nào import — tàn dư từ trước đợt
dọn admin cũ). Không có file brand voice guide nào trong `voduongai/`
(khác `BRAND_VOICE_GUIDE.md` ở gốc repo — đó là tài liệu của website tĩnh
CŨ `duongtyphu/`, KHÔNG thuộc phạm vi Admin CMS Next.js này).

### Đã làm

- **Tài liệu** (`/admin/thuong-hieu-media/tai-lieu`) — CRUD thật (Server
  Actions riêng, bảng `documents` typed, cùng pattern `case_studies`/
  `coupons`): title/description/url/icon/bg_color/display_order/active.
- **Logo & Nhận diện** (`/admin/thuong-hieu-media/logo-nhan-dien`) — CHỈ
  ĐỌC, đúng phạm vi thật của nav item ("xem trước + xuất mã SVG chuẩn"):
  render lại ĐÚNG mã HTML/SVG logo Nav/Footer copy verbatim từ quy ước bắt
  buộc trong CLAUDE.md (không tự chỉnh), kèm nút sao chép — không sửa qua
  UI (logo là chuẩn nhận diện cố định). Trỏ sang Header & Footer (Website)
  cho màu thương hiệu — không lặp lại ở đây.
- **Brand Studio / Media Center / Tài nguyên thương hiệu** —
  `AdminEmptyState` (bỏ badge "Sắp ra mắt"), mỗi trang giải thích trung
  thực lý do riêng: Brand Studio cần Founder xác nhận phạm vi nội dung
  giọng điệu/quy chuẩn viết trước khi thiết kế schema (màu + logo đã có
  chỗ quản); Media Center chưa có hạ tầng upload/lưu trữ nào (dự án chưa
  có upload thật ở bất kỳ đâu); Tài nguyên thương hiệu phụ thuộc Media
  Center làm nền trước.

### `nav.ts` + `AdminSidebar.tsx`

Bỏ `comingSoon` khỏi cả 5 mục. Thêm 5 icon (`Palette`/`Images`/
`Fingerprint`/`PackageOpen`/`FileText` — 1 số icon tái dùng từ workspace
khác theo đúng convention đã có).

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch, `npx vitest run` 139/139 pass, `rm -rf .next && npm
run build` sạch (5 route xuất hiện đúng). `next start` — 5 route trả
`307` đúng, `/` vẫn `200`, log sạch. Playwright qua route devtest tạm
(xoá + rebuild sạch sau khi xác nhận) — mở "Thương hiệu & Media": 0 badge
"Sắp ra mắt" còn sót, đủ 5 mục hiện đúng, `page.on("pageerror")` rỗng.

**Chưa tự test được:** tạo/sửa/xoá tài liệu qua Admin UI thật + xác nhận
sao chép mã logo hoạt động đúng trên trình duyệt thật (cùng giới hạn
sandbox không có `SUPABASE_SERVICE_ROLE_KEY`) — Founder tự test tại
`/admin/thuong-hieu-media/tai-lieu` và `/logo-nhan-dien`.

**ĐÃ DỪNG SAU SPRINT 4 theo đúng chỉ đạo** — chưa động tới Học viện hay
bất kỳ Workspace nào khác, chờ Founder/PMO duyệt báo cáo sprint trước khi
tiếp tục.

## ADM-V2-05 — Sprint 5: Hệ thống (System)

Founder chọn tiếp tục với Workspace "Hệ thống" (5 mục, cả 5 đều
`comingSoon` từ Sprint 0) — workspace nhạy cảm nhất: mọi ghi chú gốc đều
nhắc rõ "KHÔNG hiển thị bất kỳ giá trị biến môi trường/secret nào". Sprint
này giữ đúng ràng buộc đó tuyệt đối — mọi trang chỉ hiển thị BOOLEAN
đã cấu hình/chưa hoặc TÊN biến môi trường, KHÔNG BAO GIỜ giá trị thật.

### Audit — phát hiện 1 hạ tầng thật đã có sẵn, chưa từng lộ ra Admin

Audit `src/ai/**` (AI Service Registry, Phase 4 Epic 01 — hạ tầng có sẵn
từ trước, không phải xây mới) phát hiện:
- `checkAllProvidersHealth()` (`provider-health-check.ts`) — kiểm tra 10
  AI Provider đã đăng ký (OpenAI/Anthropic/Gemini/DeepSeek/Grok/Mistral/
  Ollama/Perplexity/Cohere/Mock) qua `adapter.healthCheck()` — MỖI adapter
  chỉ tự xác nhận ENV có giá trị hay không (`isAvailable()`), KHÔNG gọi
  mạng thật, `reason` trả về CHỈ LÀ TÊN biến môi trường thiếu (vd "Thiếu
  ANTHROPIC_API_KEY."), không bao giờ chứa giá trị — đã đọc code từng
  adapter xác nhận. Hạ tầng này đã phục vụ `/api/ai/provider-health` từ
  trước (chỉ 3/10 provider), nhưng CHƯA từng có Admin UI nào gọi.
- `provider-execution-log.ts` — log mỗi lần gọi AI Provider (provider/
  capability/success/latency/lỗi), KHÔNG log nội dung prompt/raw (đã ghi
  rõ trong chính file). **Lưu ý trung thực quan trọng:** log này lưu
  TRONG BỘ NHỚ TIẾN TRÌNH (process-local), KHÔNG phải database — tự ghi
  rõ trong file nguồn là "đủ cho dev/sandbox", cần thay bằng lưu trữ bền
  vững nếu chạy nhiều instance/serverless (ngoài phạm vi sprint này).
  Hiển thị ĐÚNG thực trạng này, không giả vờ đây là audit log đầy đủ.

Không có bảng `system_config`/`feature_flags`/`audit_log`/`app_config`
nào tồn tại (`to_regclass()` → null cả 4). `documents`/`digital_asset_settings`
kiểm tra lại — không liên quan Hệ thống. `BRAND_VOICE_GUIDE.md` không có
trong `voduongai/` (đã ghi từ Sprint 4).

### Đã làm

- **API & Tích hợp** (`/admin/he-thong/api-tich-hop`) — REAL: gọi
  `checkAllProvidersHealth()` hiển thị 10 AI Provider (đã cấu hình/chưa,
  BOOLEAN — text "Đã cấu hình" hoặc TÊN biến thiếu, không giá trị) + 2
  dịch vụ khác (SePay Webhook, Google Analytics — cùng cách boolean).
- **Nhật ký hệ thống** (`/admin/he-thong/nhat-ky-he-thong`) — REAL nhưng
  phạm vi hẹp hơn ý tưởng gốc ("log lỗi server chung" — vẫn chưa có, chỉ
  qua Vercel Dashboard): hiển thị `listExecutions()` (log AI Provider),
  kèm cảnh báo rõ "process-local, có thể rỗng giữa các lần deploy".
- **Môi trường** (`/admin/he-thong/moi-truong`) — REAL: `NODE_ENV` +
  checklist boolean cấu hình Supabase lõi (4 biến: `SUPABASE_URL`/
  `SUPABASE_SERVICE_ROLE_KEY`/`NEXT_PUBLIC_SUPABASE_URL`/
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chỉ tên biến, không giá trị). Tách rõ
  khỏi "API & Tích hợp" (AI Provider/dịch vụ khác) để không 2 trang cùng
  sở hữu 1 nội dung.
- **Cấu hình chung / Sao lưu** — `AdminEmptyState` (bỏ badge "Sắp ra
  mắt"), re-audit xác nhận đúng ghi chú gốc (không có feature-flag nào;
  sao lưu do Supabase quản lý hạ tầng, ứng dụng không có quyền đọc lại).
  Cấu hình chung trỏ sang Header & Footer (nơi đã quản site-wide settings
  thật) tránh trùng sở hữu dữ liệu.

### `nav.ts` + `AdminSidebar.tsx`

Bỏ `comingSoon` khỏi cả 5 mục. Thêm 5 icon (`SlidersHorizontal`/`Plug`/
`ScrollText`/`DatabaseBackup`/`Server`).

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch (1 lỗi `react/no-unescaped-entities` tự phát hiện và
sửa ngay — dấu ngoặc kép thẳng trong JSX text, đổi sang `&quot;`), `npx
vitest run` 139/139 pass, `rm -rf .next && npm run build` sạch (5 route
xuất hiện đúng). `next start` — 5 route trả `307` đúng, `/` vẫn `200`,
log sạch. Playwright qua route devtest tạm (xoá + rebuild sạch sau khi
xác nhận) — mở "Hệ thống": 0 badge "Sắp ra mắt" còn sót, đủ 5 mục hiện
đúng, `page.on("pageerror")` rỗng.

**Đã tự kiểm tra kỹ (khác các sprint trước):** vì đây là workspace nhạy
cảm nhất, đã đọc lại TỪNG dòng code hiển thị trước khi build — xác nhận
không có `console.log`/JSX nào in ra `process.env.X` (chỉ
`Boolean(process.env.X)` hoặc so sánh y hệt pattern đã dùng an toàn xuyên
suốt dự án từ trước).

**Chưa tự test được:** xem trạng thái AI Provider/Môi trường qua Admin UI
thật có tài khoản đăng nhập + Supabase thật (cùng giới hạn sandbox không
có `SUPABASE_SERVICE_ROLE_KEY`) — Founder tự test tại 3 trang REAL
(`api-tich-hop`/`nhat-ky-he-thong`/`moi-truong`) trên Preview URL, xác
nhận không có giá trị secret nào bị lộ dù nhìn kỹ DOM/View Source.

**ĐÃ DỪNG SAU SPRINT 5 theo đúng chỉ đạo** — chưa động tới Học viện hay
Marketing, chờ Founder/PMO duyệt báo cáo sprint trước khi tiếp tục.

## ADM-V2-06 — Sprint 6: Marketing

Founder chọn tiếp tục với Workspace "Marketing" (5 mục, cả 5 đều
`comingSoon` từ Sprint 0).

### Audit — 4/5 ghi chú gốc xác nhận ĐÚNG, 1 phát hiện mới cho "Chuyển đổi"

Re-audit toàn bộ 5 mục (grep + Supabase `to_regclass()`):
- Không có bảng `campaigns`/`email_campaigns`/`cta_events`/
  `analytics_events` nào tồn tại.
- Không có dịch vụ gửi email hàng loạt nào tích hợp (không
  Resend/SendGrid/Nodemailer/SMTP). `EmailOptInForm` (`/contact`) chỉ
  POST vào bảng `leads` (thu thập, không gửi).
- Không có cơ chế tracking click CTA nào (không gtag custom event/bảng
  riêng).
- Google Analytics chỉ chạy script frontend (`NEXT_PUBLIC_GA_ID`) — đọc
  lại số liệu cần Google Analytics Data API + quyền riêng, không tự tích
  hợp được.

→ 4/5 ghi chú gốc (Chiến dịch/Email Marketing/CTA/Phân tích Marketing)
đều ĐÚNG, không có gì mới — giữ Empty State, chỉ đổi khung hiển thị (bỏ
badge "Sắp ra mắt").

**"Chuyển đổi" — phát hiện 1 phễu nội bộ tính được KHÔNG cần GA:** ghi
chú gốc đúng là chưa có phễu đầy đủ "Landing Page → đăng ký → onboarding
→ mua khoá học" (cần page-view analytics từ GA). Nhưng có 1 phễu HẸP hơn
tính được ngay từ dữ liệu thật đã có: khách hàng tiềm năng (`leads`, có
`source`) → có trở thành khách mua hàng không (khớp `email` với
`orders.status='confirmed'`). 8 lead thật, 3 nguồn khác nhau tại thời
điểm audit. Đây là góc nhìn TỔNG HỢP theo nguồn (khác "Khách hàng tiềm
năng"/"Đơn hàng" ở Vận hành — 2 trang đó là danh sách RAW từng dòng),
không tạo 2 nơi cùng quản 1 danh sách.

### Đã làm

- **Chuyển đổi** (`/admin/marketing/chuyen-doi`) — REAL: bảng tổng hợp
  theo nguồn (số lead/số đã mua/tỷ lệ %) + 2 ô KPI (tổng lead, tỷ lệ
  chuyển đổi tổng). Join `leads.email` với `orders.member_email` (đã
  `confirmed`) bằng JS sau khi fetch cả 2 (không cần RPC/view SQL mới).
- **Chiến dịch / Email Marketing / CTA / Phân tích Marketing** —
  `AdminEmptyState` (bỏ badge "Sắp ra mắt"), mỗi trang giữ đúng lý do
  trung thực đã audit lại, thêm `relatedLink` sang module thật gần nhất
  (Mã giảm giá, Khách hàng tiềm năng, Landing Page, Chuyển đổi).

### `nav.ts` + `AdminSidebar.tsx`

Bỏ `comingSoon` khỏi cả 5 mục. Thêm 3 icon mới (`Mail`/`MousePointerClick`/
`BarChart3`), tái dùng `Megaphone`/`TrendingUp` đã có sẵn.

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch, `npx vitest run` 139/139 pass, `rm -rf .next && npm
run build` sạch (5 route xuất hiện đúng). `next start` — 5 route trả
`307` đúng, `/` vẫn `200`, log sạch. Playwright qua route devtest tạm
(xoá + rebuild sạch sau khi xác nhận) — mở "Marketing": 0 badge "Sắp ra
mắt" còn sót, đủ 5 mục hiện đúng, `page.on("pageerror")` rỗng.

**Chưa tự test được:** xem bảng Chuyển đổi qua Admin UI thật với dữ liệu
Production (cùng giới hạn sandbox không có `SUPABASE_SERVICE_ROLE_KEY`) —
Founder tự test tại `/admin/marketing/chuyen-doi`, xác nhận tỷ lệ %
khớp đúng số lead/đơn hàng thật.

**ĐÃ DỪNG SAU SPRINT 6 theo đúng chỉ đạo** — chưa động tới Học viện (còn
lại đúng 1 Workspace cuối cùng trong kế hoạch 8 sprint), chờ Founder/PMO
duyệt báo cáo sprint trước khi tiếp tục.

## ADM-V2-07 — Sprint 7 (cuối cùng): Học viện

Founder chọn tiếp tục với Workspace cuối cùng trong kế hoạch 8-sprint —
"Học viện" (10 subGroup, 38 route). Khác 6 sprint trước, sprint này KHÔNG
có `comingSoon: true` nào để gỡ.

### Audit — 0 comingSoon, workspace đã 100% thật từ trước

Grep `comingSoon` trong `nav.ts` xác nhận cả 38 route dưới workspace "Học
viện" đều KHÔNG có cờ này — toàn bộ đã là module thật (CRUD/Live-edit/
Read-only) từ các đợt Nhóm 3/CKOS/Live-edit trước khi chương trình ADM-V2
bắt đầu. Đã phân loại đầy đủ cả 38 route theo kiểu render trước khi quyết
định phạm vi sprint:
- **DataTable** (17 route: 8 CKOS + `tools`/`community`/`updates`/
  `student-success-stories` + 5 route khác) — Server+Client split, đã có
  `breadcrumb` optional prop chưa được dùng.
- **VisualEditor** (5 route: `hocvienai/work-needs`, `hocvienai/faq`,
  `aiworkspace/recommended-workspace`, `aiworkspace/ai-workflow-sections`,
  `su-menh-companion/flipbook`) — cùng tình trạng thiếu breadcrumb.
- **Bespoke Server Component** (5 route: `ckos` dashboard, `ckos/lessons`,
  `ckos/case-studies`, `course-pricing`, `companion`) — không dùng
  `DataTable`/`VisualEditor`, tự viết `<h1>`/shell riêng.
- **Live-edit Cách A** (~19 route: `home-cards`, `duan-cohoi` + 10 sub-route,
  `hanh-trinh-cua-toi` 5 cửa, `su-menh-companion/live-edit`,
  `premium/dashboard`) — render lại NGUYÊN component `/portal/*` thật.

### Quyết định phạm vi: retrofit breadcrumb, không CRUD/Empty State mới

Vì mục tiêu gốc (xoá "Sắp triển khai") đã đạt 100% từ trước, đóng góp
trung thực của sprint này là dọn 1 điểm thiếu nhất quán còn sót:
`AdminBreadcrumb` (dùng ở Sprint 1-6) chưa từng có mặt ở bất kỳ route Học
viện nào — Founder điều hướng sâu (vd. `/admin/ckos/best-practices`)
không thấy đường dẫn `Học viện → Hệ tri thức AI (CKOS) → ...`.

**Đã làm — retrofit qua props dùng chung (3 sửa component → tự động phủ
17 trang):**
- `src/components/admin/DataTable.tsx`/`DataTableClient.tsx` — thêm
  `breadcrumb?: AdminBreadcrumbItem[]` (import type từ `AdminBreadcrumb`),
  truyền xuyên Server→Client, render `<AdminBreadcrumb trail={breadcrumb}/>`
  ngay trong `<div className="space-y-4">`, trước `<h1>`. Optional, không
  đổi hành vi trang nào chưa truyền prop.
- `src/components/admin/VisualEditor.tsx` — cùng prop/pattern (component
  "use client" đơn, không có bản Server riêng).
- Đã truyền `breadcrumb` vào cả 17 trang DataTable + 5 trang VisualEditor,
  mỗi trail đúng 3 cấp: Workspace ("Học viện") → SubGroup (khớp đúng label
  trong `nav.ts`, href trỏ route đầu tiên của subGroup vì phần lớn subGroup
  không có trang index riêng — ngoại lệ CKOS đã có `/admin/ckos`) → trang
  hiện tại.
- 5 trang bespoke (`ckos` dashboard, `ckos/lessons`, `ckos/case-studies`,
  `course-pricing`, `companion`) — thêm `<AdminBreadcrumb trail={...}/>`
  trực tiếp (không qua props component dùng chung, vì các trang này tự
  viết JSX riêng).

**Chủ động KHÔNG thêm breadcrumb cho ~19 route Live-edit Cách A** — các
route này render lại NGUYÊN VẸN cây component `/portal/*` thật (không copy,
import thẳng) bọc `<EditModeProvider>`, để đảm bảo pixel-perfect giữa chế
độ sửa và trang công khai thật. Thêm bất kỳ phần tử Admin-only nào (kể cả
1 dòng breadcrumb) vào giữa cây component đó sẽ vi phạm chính nguyên tắc
kiến trúc "Live-edit Cách A" đã áp dụng xuyên suốt Nhóm 3 (rò rỉ UI Admin
vào trang Portal thật nếu lỡ đặt sai vị trí, hoặc phải sửa component Portal
gốc chỉ để thêm chrome Admin — cả 2 đều vi phạm "không đụng Portal/Landing
Page ngoài phạm vi đã duyệt"). AdminShell's sidebar đã đủ để định vị route
Live-edit đang ở đâu (label rõ ràng, vd. "Mirror (Live-edit)").

### Verify

`npx tsc --noEmit` sạch, `npx eslint src/app/admin src/components/admin
src/lib/admin` sạch, `npx vitest run` 139/139 pass, `rm -rf .next && npm
run build` sạch (toàn bộ 22 route sửa + route Live-edit khác xuất hiện
đúng, 0 route biến mất). Playwright qua route `devtest-adm-v2-07` tạm
(bọc `<AdminShell email="test@example.com">`, `next start` cổng 4551) —
mở "Học viện" trong sidebar: 0 badge "Sắp ra mắt" còn sót, đủ "Học viện
AI"/"Hệ tri thức AI (CKOS)"/"Cộng đồng" hiện đúng, `page.on("pageerror")`
rỗng — đã xoá route devtest + `rm -rf .next && npm run build` lại để xác
nhận gỡ sạch (0 tham chiếu `devtest-adm-v2-07` trong output build).

**Chưa tự test được:** xem breadcrumb hiển thị đúng qua Admin UI thật có
tài khoản đăng nhập (cùng giới hạn sandbox không có
`SUPABASE_SERVICE_ROLE_KEY` đã nêu nhiều lần) — Founder tự test tại vài
route mẫu (`/admin/ckos/best-practices`, `/admin/tools`,
`/admin/hocvienai/faq`), xác nhận breadcrumb hiện đúng 3 cấp và link cấp
giữa dẫn đúng route.

**ĐÃ DỪNG SAU SPRINT 7 theo đúng chỉ đạo — đây là sprint cuối cùng trong
kế hoạch 8-sprint ADM-V2.0.** Toàn bộ 8 Workspace (Tổng quan/Người dùng/
Website/Học viện/Vận hành/Marketing/Thương hiệu & Media/Hệ thống) giờ
không còn badge "Sắp triển khai" nào cho module đã có cách triển khai
trung thực — module nào còn thiếu hạ tầng thật (Media Center, Chiến dịch,
Email Marketing...) đều hiển thị `AdminEmptyState` trung thực kèm lý do,
không CRUD giả. Chờ Founder/PMO duyệt báo cáo Sprint 7 — đây cũng là mốc
đóng chương trình ADM-V2.0 tổng thể nếu Founder xác nhận không còn sprint
bổ sung nào khác.

## Logo & Nhận diện — sửa snippet lệch với logo thật (sau khi RC được duyệt)

Founder báo trang `/admin/thuong-hieu-media/logo-nhan-dien` đang dùng logo
"cũ". Audit xác nhận: trang này (ADM-V2-04) copy nguyên mẫu logo TĨNH của
website HTML CŨ (`duongtyphu/`, thuộc CLAUDE.md gốc ở repo root — ngoài
phạm vi Admin CMS Next.js này), KHÁC hẳn logo THẬT đang chạy trên Landing
Page/Portal (`HeaderClient.tsx`/`Footer.tsx`): cam `#F97316` (cũ) →
`#FF7A00` (thật); chữ tĩnh "VDAI"/"ACADEMY" xếp chồng, luôn trắng (cũ) →
tên site tách `brandMain`/`brandAccent` từ `settings.siteName` (đọc live ở
Header & Footer), màu accent tím `#5B21D6` khi nền sáng / trắng khi nền
tối (theme-aware, cũ luôn trắng cố định) — sai lệch từ chính đợt build
ADM-V2-04, không phải do Landing Page đổi sau đó.

**Đã sửa** `LogoSnippets.tsx` — đổi từ HTML tĩnh (`href="index.html"`,
style inline) sang đúng JSX thật copy từ `HeaderClient.tsx`/`Footer.tsx`
(dự án này là Next.js/React, dán JSX vào component mới, không phải file
`.html`). Preview trực quan (qua `dangerouslySetInnerHTML`) dùng HTML
tương đương để hiển thị đúng màu/bố cục thật, tách riêng khỏi code JSX
copy được (2 hằng số khác nhau: `*_PREVIEW_HTML` để xem, `*_SNIPPET` để
copy) — tránh nhầm copy nhầm HTML tĩnh như bản cũ.

## Affiliate Hub — nối dây Portal + Admin (dữ liệu có sẵn, bị bỏ dở)

Founder yêu cầu "cập nhật mục chương trình affiliate cho Portal và quản
lý tại Admin". Audit phát hiện dự án đã có SẴN 1 bộ nội dung "Affiliate
Hub" (hướng dẫn thực chiến làm Affiliate Marketing) được thiết kế từ
trước — 3 bảng generic Supabase đã tồn tại thật, đăng ký sẵn trong
`SUPABASE_COLLECTIONS`, có seed dữ liệu thật (không phải rỗng), RLS đã
cấu hình đúng — nhưng **KHÔNG có trang Portal nào đọc, KHÔNG có Admin UI
nào quản** trước đợt này:

| Bảng | Số dòng seed | Vai trò |
|---|---|---|
| `affiliate_hub_sections` | 7 | 7 bước hướng dẫn (Bắt đầu/Chọn ngách/Chọn sản phẩm/Xây nội dung/Công cụ/Case Study/Top sản phẩm) |
| `affiliate_products` | 1 (Hostinger) | Sản phẩm Affiliate đề xuất — đầy đủ audience/useCase/workflow/pros/cons/pricing/affiliateUrl |
| `affiliate_hub_top_products` | 1 | Featured/join — tham chiếu `productId` sang `affiliate_products`, vocabulary `Active/Inactive` riêng (giữ nguyên, cùng kiểu bảng `community`) |

**Đã hỏi Founder trước khi build (không đoán):** có 3 hệ thống khác nhau
đều gọi là "affiliate" trong dự án — (1) Affiliate Hub bị bỏ dở ở trên,
(2) "Hoa hồng giới thiệu" (`/portal/referral`, bảng `referrals`, đã hoạt
động từ trước), (3) hệ sinh thái "Làm tiếp thị liên kết"
(`/portal/duan-cohoi/lam-affilate`, đã có Admin quản lý đầy đủ từ Nhóm
3). Founder xác nhận chọn (1).

**Chủ động KHÔNG nối bảng thứ 4 cùng nhóm — `affiliate_links`** (0 dòng,
có field `clicks`/`conversions`): không có cơ chế click-tracking thật nào
tồn tại trong dự án (không route `/go/[code]` hay tương tự) — hiển thị 2
field này sẽ là số liệu bịa, vi phạm NO-FAKE-DATA. Để nguyên mồ côi, cần
quyết định riêng nếu sau này muốn xây tracking thật.

**Đã làm:**
- `src/lib/portal/live-affiliate-hub.ts` (mới) — `getLiveAffiliateHubSections()`/
  `getLiveAffiliateProducts()`/`getLiveAffiliateProductBySlug()`/
  `getLiveAffiliateHubTopProducts()`, cùng pattern `live-tools.ts`
  (`getSupabasePublic()` + `cache()`). Sắp xếp theo `data.order` (JS-side
  sort) — KHÔNG dùng cột `order` ngoài (cột đó không trả về qua GET route
  generic, đúng bài học đã ghi ở "Chuyển đổi"/ecosystem articles).
- `/portal/affiliate-hub` (mới) — hub page: 7 bước hướng dẫn (grid card +
  CTA), "Nổi bật tháng này" (badge + link hướng dẫn nội bộ + link dùng
  thử ngoài), "Sản phẩm Affiliate đề xuất" (grid, mỗi thẻ dẫn sang trang
  chi tiết). Cả 3 khối đều có Empty State trung thực nếu rỗng.
- `/portal/affiliate-hub/[slug]` (mới) — trang chi tiết sản phẩm: audience/
  useCase/pricing/workflow/pros/cons + nút "Dùng thử" trỏ `affiliateUrl`
  thật (`target="_blank" rel="noopener noreferrer"`, cùng convention
  `EcosystemAffiliateOffersBox`), kèm badge minh bạch "Affiliate — VO
  DUONG AI nhận hoa hồng nếu bạn mua qua link này" khi `isAffiliate=true`.
- `src/app/portal/duan-cohoi/[ecosystemSlug]/page.tsx` — thêm 1 banner CTA
  "Xem Affiliate Hub →" trong đúng nhánh `structureType === "affiliate-list"`
  (chỉ ảnh hưởng trang `lam-affilate`, không đụng 4 hệ sinh thái khác) —
  điểm khám phá tự nhiên từ hệ sinh thái Affiliate hiện có sang Affiliate
  Hub mới, không cần thêm mục nav Portal cấp cao mới.
- Admin: 3 trang `DataTable` mới dưới nhóm sidebar "Dự án & Cơ hội"
  (cùng nhóm với hệ sinh thái Affiliate, vì nội dung bổ trợ trực tiếp,
  không trùng lặp — hệ sinh thái là "cơ hội kinh doanh ngoài" như
  Lazada/Shopee, Affiliate Hub là "hướng dẫn thực chiến + công cụ đề
  xuất"): `/admin/duan-cohoi/affiliate-hub-sections`,
  `/admin/duan-cohoi/affiliate-products`,
  `/admin/duan-cohoi/affiliate-hub-top-products`. `productId` ở trang thứ
  3 là ô nhập text đơn giản (không multi-select) vì đây tham chiếu 1-1,
  ghi rõ hướng dẫn "nhập đúng id" trong label field.
- `nav.ts`/`AdminSidebar.tsx` (3 icon mới: `Route`/`ShoppingBag`/`Award`)/
  `dashboard/page.tsx` (`TABLE_FOR_HREF`, 3 dòng mới) — wire đầy đủ.

**Verify:** `tsc`/`eslint` sạch (0 lỗi/warning trên toàn bộ file mới/sửa),
`vitest run` 139/139 pass, `rm -rf .next && npm run build` sạch (5 route
mới xuất hiện đúng: `/portal/affiliate-hub`, `/portal/affiliate-hub/[slug]`,
3 route Admin). **Test thật với anon key thật** (route dev-preview tạm,
render trực tiếp component `AffiliateHubPage`/`AffiliateProductDetailPage`/
`EcosystemPage` không qua middleware — cùng kỹ thuật đã dùng nhiều lần
trước đó, xoá ngay sau khi xác nhận): xác nhận cả 7 section + Hostinger
(cả ở "Nổi bật tháng này" lẫn "Sản phẩm Affiliate đề xuất") + trang chi
tiết (đầy đủ audience/useCase/pricing/workflow/pros/cons/nút "Dùng thử
Hostinger ↗" trỏ đúng `https://hostinger.com?ref=voduongai`) đều render
đúng dữ liệu thật. Banner CTA trên trang hệ sinh thái `lam-affilate` cũng
xác nhận render đúng (200, không crash). Test lại không có Supabase (mặc
định sandbox) — route Admin trả `307` đúng như mọi route khác,
`/portal/affiliate-hub` fallback công khai đúng thiết kế khi Supabase
chưa cấu hình.

**Chưa tự test được:** thêm/sửa/xoá nội dung qua Admin UI thật có tài
khoản đăng nhập (cùng giới hạn sandbox đã nêu nhiều lần) — Founder tự
test tại 3 route Admin mới, xác nhận sửa xong phản ánh đúng lên
`/portal/affiliate-hub`.

## Sửa ngay sau đó — 3 trang Admin Affiliate Hub lỡ dùng sai atmosphere

Founder nhắc lại nguyên tắc bắt buộc "mọi thứ thiết kế ở Admin phải lấy
Landing Page bản chính thức và Portal hiện tại làm căn cứ". Tự audit lại
đúng 3 trang vừa xây ở mục trên phát hiện đúng 1 vi phạm: cả 3 trang
(`affiliate-hub-sections`/`affiliate-products`/`affiliate-hub-top-products`)
bọc `<AdminAtmosphere atmosphereClassName="projects-atmosphere-bg">` —
copy nhầm lớp khí quyển của `/portal/duan-cohoi` (vì xếp cùng nhóm sidebar
"Dự án & Cơ hội") thay vì đọc lại đúng trang Portal thật mà 3 bảng này
backing (`/portal/affiliate-hub`, tự viết ở mục trên) — trang đó KHÔNG có
lớp khí quyển riêng nào (chỉ `gemos-bg` mặc định, giống `/portal/earn`).

**Đã sửa:** bỏ hẳn `<AdminAtmosphere>` khỏi cả 3 trang (cùng pattern
`/admin/tools` — không bọc gì khi Portal không có atmosphere riêng).
**Bài học:** nhóm sidebar là cách TỔ CHỨC menu, không phải căn cứ để suy
ra màu nền — luôn đọc đúng trang Portal/Landing Page THẬT mà module đó
backing, không suy từ nhóm/route lân cận.

**Verify:** `tsc`/`eslint` sạch, `vitest run` 139/139, `rm -rf .next && npm
run build` sạch.

## Chương trình Affiliate — module đầy đủ (Portal + Admin), theo yêu cầu riêng

Founder yêu cầu module hoa hồng giới thiệu CHÍNH THỨC (khác Affiliate Hub
ở trên — đó là nội dung HƯỚNG DẪN cách làm affiliate ngoài, module này là
CHƯƠNG TRÌNH GIỚI THIỆU của chính VDAI): mỗi user có mã/link giới thiệu
riêng, tự động ghi nhận + tính hoa hồng khi người được giới thiệu mua hàng.

### Phát hiện quan trọng nhất — audit trực tiếp Supabase (không suy đoán)

Trước khi thiết kế bất kỳ schema nào, đã đọc trực tiếp trigger/function
thật qua Supabase MCP — phát hiện **toàn bộ động cơ hoa hồng đã tồn tại
sẵn và đang chạy**, chỉ 1 mắt xích bị thiếu:

- `members.referral_code` — tự sinh cho MỌI user mới qua trigger
  `set_referral_code` (`BEFORE INSERT ON members`).
- `members.referred_by` — cột đã có từ trước nhưng **0/16 dòng có giá
  trị** — chưa từng có nơi nào trong luồng đăng ký (`/register`, Google
  OAuth) capture mã giới thiệu để ghi vào đây.
- Trigger `on_member_referred` (`AFTER INSERT ON members`, hàm
  `handle_new_referral()`) — ĐÃ CÓ SẴN: nếu `referred_by` khớp
  `referral_code` của 1 member khác, tự tạo 1 dòng `referrals`
  (`status='pending'`).
- Trigger `on_order_confirmed` (`AFTER UPDATE ON orders`, hàm
  `handle_order_confirmed_commission()`) — ĐÃ CÓ SẴN: khi
  `orders.status` chuyển sang `'confirmed'`, tự tìm dòng `referrals`
  pending khớp `referred_email`, tính `commission_amount = amount *
  commission_rate` (mặc định 10%), chuyển `status='confirmed'`.

→ Kết luận: **KHÔNG cần xây lại cơ chế ghi nhận/tính hoa hồng** — chỉ cần
(1) vá đúng 1 chỗ hở (capture `ref_code` lúc đăng ký), (2) thêm cấu hình
hoa hồng theo sản phẩm (audit xác nhận trigger hiện tại dùng CHUNG 1 mức
10% cho mọi sản phẩm, không phân biệt), (3) thêm theo dõi lượt truy cập
(chưa có cơ chế nào), (4) thêm yêu cầu thanh toán (chưa có bảng nào phù
hợp tái dùng) — đúng nguyên tắc Reuse First/Single Source of Truth Founder
yêu cầu.

### Migration đề xuất — CHƯA APPLY, chờ Founder duyệt riêng

`supabase-phase27-affiliate-program.sql` — 4 phần, mỗi phần có báo cáo rủi
ro riêng ngay trong file:
1. Sửa `handle_new_auth_user()` (trigger `auth.users` lõi) — thêm đúng 1
   field `referred_by` vào insert có sẵn, đọc từ
   `raw_user_meta_data->>'ref_code'`. Additive-only, fallback về hành vi
   y hệt hiện tại nếu không có `ref_code`.
2. Bảng mới `affiliate_commission_rules` (product_type/product_id/
   commission_rate) + sửa `handle_order_confirmed_commission()` — thêm
   bước tra cứu rate theo sản phẩm TRƯỚC khi tính hoa hồng, fallback về
   10% mặc định nếu không có rule nào khớp.
3. Bảng mới `affiliate_link_visits` (referral_code/visited_at/
   landing_path) — theo dõi lượt truy cập, RLS chỉ admin đọc/ghi (ghi qua
   service-role, không public insert).
4. Bảng mới `affiliate_payout_requests` (member_id/amount_requested/
   bank_info/status/admin_note) — yêu cầu rút hoa hồng, RLS
   member chỉ đọc/tạo dòng của chính mình + admin toàn quyền.

**2 rủi ro cao nhất đã ghi rõ trong file:** sửa 2 trigger ĐANG CHẠY THẬT
(auth signup, order confirmation) — cả 2 đều thiết kế additive, có
fallback về hành vi hiện tại, nhưng đây là đường DUY NHẤT mọi user/đơn
hàng đi qua nên rủi ro hồi quy không phải bằng 0. Khuyến nghị Founder tự
test đăng ký 1 tài khoản có `?ref=<code>` trên Preview URL sau khi apply.

**Toàn bộ code Portal/Admin đã viết để hoạt động đúng cả TRƯỚC và SAU khi
migration được duyệt** — mọi truy vấn tới 3 bảng mới đều bắt lỗi
`42P01`/kiểm tra `error` từ Supabase (không throw), hiển thị thông báo
trung thực "chưa được kích hoạt — chờ Founder duyệt migration" thay vì
crash.

### Portal — `/portal/affiliate` (thay thế `/portal/referral` cũ)

Phát hiện: đã có sẵn `/portal/referral/page.tsx` (149 dòng, đọc đúng
`referral_code`/`referrals`, KHÔNG có trong `portalNavSections`, chỉ được
link mồ côi từ `/portal/earn`) làm gần hết việc Founder yêu cầu — **đã
CHUYỂN (không tạo trang song song)** thành `/portal/affiliate`, mở rộng
thêm QR code/lượt truy cập/khách hàng/đơn hàng/doanh thu/yêu cầu thanh
toán theo đúng yêu cầu đầy đủ. Route cũ xoá hẳn (không redirect — chưa
từng nằm trong nav chính thức nên không có rủi ro link chết ngoài 2 chỗ đã
cập nhật: `/portal/earn`, comment trong `nav.ts`).

- `src/lib/portal/live-affiliate.ts` (mới) — `getAffiliateOverview()`:
  dùng session client (`getSupabaseServer()`) cho `members`/`referrals`
  (đã có RLS "đọc dữ liệu của chính mình"); dùng `getSupabaseAdmin()` CHỈ
  cho 2 việc hẹp đã scope đúng theo dữ liệu người dùng có quyền thấy — tra
  `orders.amount` theo `order_id` đã có sẵn trong `referrals` của chính
  mình (RLS `orders` không cho referrer đọc đơn của người khác, nhưng
  referrer có quyền biết SỐ TIỀN đơn đã giới thiệu vì hoa hồng phụ thuộc
  trực tiếp), và đếm `affiliate_link_visits` theo `referral_code` của
  chính mình (bảng đó chỉ có policy admin). Giữ nguyên env-var guard
  (`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`) TRƯỚC khi gọi
  `getSupabaseServer()` — đúng convention `getPurchasedIds()`/
  `getReferralData()` cũ, tự phát hiện và sửa (xem mục Bug bên dưới).
- `src/app/portal/affiliate/page.tsx` — link giới thiệu + QR code (SVG,
  sinh server-side qua package `qrcode` — dependency MỚI, pure JS, không
  cần canvas/native, an toàn serverless) + 6 thẻ số liệu (lượt truy cập/
  đăng ký/khách hàng/đơn hàng/doanh thu/hoa hồng) + khối trạng thái thanh
  toán (số dư chờ/đã trả + nút "Yêu cầu thanh toán") + bảng lịch sử giao
  dịch đầy đủ.
- `src/app/portal/affiliate/actions.ts` — `requestAffiliatePayout()`, ghi
  qua session client (KHÔNG dùng `getSupabaseAdmin()`) để RLS
  `member_insert_own` tự bảo vệ — Security First, không có đường nào để 1
  thành viên tạo yêu cầu đứng tên người khác.
- `src/lib/portal/hubs.ts` — thêm `"Chương trình Affiliate"` (href
  `/portal/affiliate`) ngay sau `"Premium"` trong `portalNavSections`
  (đúng yêu cầu "đặt ở mục Premium" — cấu trúc nav Portal hiện tại là
  danh sách phẳng 1 tầng, không có submenu lồng, nên vị trí liền kề là
  cách thể hiện gần nhất).
- `src/components/portal/PortalSidebar.tsx` — icon `Share2` cho
  `/portal/affiliate`.

### Admin — Workspace "Affiliate" mới (8 trang)

Workspace TOÀN QUYỀN mới (`nav.ts`, id `affiliate`), đứng sau "Vận hành":
Tổng quan, Thành viên, Referral, Đơn hàng, Hoa hồng, Cấu hình hoa hồng
theo sản phẩm, Yêu cầu thanh toán, Báo cáo.

- `src/lib/affiliate/admin-data.ts` — `loadAdminReferrals()` (join
  `referrals`+`members`+`orders` 1 lần) + `summarizeByReferrer()` (gộp
  theo người giới thiệu) — DÙNG CHUNG cho cả 6 trang đọc (Tổng quan/Thành
  viên/Referral/Đơn hàng/Hoa hồng/Báo cáo), tránh 2 trang tính ra 2 con số
  khác nhau cho cùng 1 câu hỏi.
- `/admin/affiliate` (Tổng quan) — 4 KPI + top 5 người giới thiệu.
- `/admin/affiliate/thanh-vien` — người ĐÃ giới thiệu thành công (khác
  "Thành viên"/"Danh sách người dùng" ở Workspace Người dùng — góc nhìn
  theo VAI TRÒ GIỚI THIỆU, không trùng).
- `/admin/affiliate/referral` — danh sách đầy đủ, **thay thế hẳn**
  `/admin/van-hanh/tiep-thi-lien-ket` cũ (route đó giờ `redirect()` sang
  đây — tránh 2 nơi cùng sở hữu bảng `referrals`, đúng Single Ownership).
- `/admin/affiliate/don-hang` — đơn hàng lọc theo có `order_id` trong
  referrals (khác "Đơn hàng" ở Vận hành — danh sách RAW toàn bộ, không
  phân biệt nguồn).
- `/admin/affiliate/hoa-hong` — sổ giao dịch tiền (chỉ dòng đã phát sinh
  hoa hồng, khác Referral liệt kê cả lượt đăng ký chưa mua).
- `/admin/affiliate/cau-hinh-hoa-hong` — CRUD `affiliate_commission_rules`
  (Server Actions riêng, bảng typed, cùng pattern `coupons`/`case_studies`
  — không qua `/api/admin/collections/[table]`).
- `/admin/affiliate/yeu-cau-thanh-toan` — duyệt/từ chối yêu cầu rút hoa
  hồng. "Xác nhận đã thanh toán" là hành động THỦ CÔNG (Admin xác nhận đã
  chuyển khoản thật ngoài hệ thống, giống cách `orders.status` được xác
  nhận qua webhook SePay — sự kiện ngoài hệ thống, không phải trigger tự
  suy luận) — đồng thời chuyển TOÀN BỘ dòng `referrals.status='confirmed'`
  của đúng referrer đó sang `'paid'` (thiết kế đơn giản hoá: 1 lần duyệt =
  thanh toán trọn gói số dư hiện có, không chia theo từng phần tiền lẻ).
- `/admin/affiliate/bao-cao` — xu hướng theo tháng + bảng xếp hạng đầy đủ.

`AdminSidebar.tsx` — thêm `workspaceIcons.affiliate = Share2` + 8
`navIcons` tương ứng. `dashboard/page.tsx` — thêm
`TABLE_FOR_HREF["/admin/affiliate/referral"] = "referrals"` (chỉ trang
này map 1:1 vào đúng 1 bảng, 5 trang còn lại là góc nhìn gộp/join, không
đếm riêng để tránh nhiều con số trùng nhau) +
`PUBLIC_URL_FOR_WORKSPACE.affiliate` trỏ `/portal/affiliate`.

### Bug tự phát hiện và sửa trước khi commit (chưa từng xuất bản)

`getAffiliateOverview()` lúc đầu THIẾU guard kiểm tra
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` trước khi gọi
`getSupabaseServer()` — khác với `getPurchasedIds()`
(`src/lib/access.ts`)/`getReferralData()` cũ (`/portal/referral`) đều có
guard này. Khi Supabase chưa cấu hình (đúng trạng thái sandbox),
`createServerClient()` bên trong ném lỗi "Your project's URL and Key are
required..." — phát hiện qua test `next start` thật (so sánh log trước/
sau khi hit `/portal/premium` (không lỗi) vs `/portal/affiliate` (có lỗi)
để xác nhận đây là lỗi CỦA RIÊNG trang mới, không phải noise có sẵn toàn
hệ thống). Đã thêm lại đúng guard, verify lại qua `next start` — 0 dòng
lỗi trong log sau khi sửa.

### Verify

`npx tsc --noEmit`, `npx eslint src` (0 lỗi mới, 18 warning còn lại đều có
từ trước), `npx vitest run` 139/139 pass, `rm -rf .next && npm run build`
sạch (9 route mới xuất hiện đúng: `/portal/affiliate` + 8 route
`/admin/affiliate/*`). Test thật qua `next start` (không cấu hình
Supabase, đúng trạng thái sandbox) — `/portal/affiliate` trả `200` không
lỗi log; cả 8 route `/admin/affiliate/*` + `/admin/van-hanh/tiep-thi-
lien-ket` (redirect cũ) đều trả `307` redirect `/admin/login` đúng như kỳ
vọng (chưa đăng nhập). Xác nhận qua Supabase MCP: `referrals` 0 dòng thật
(Empty State đúng, không phải lỗi), `members.referred_by` 0/16 dòng có
giá trị (xác nhận đúng gap đã audit), 2 bảng mới
(`affiliate_commission_rules`/`affiliate_payout_requests`) chưa tồn tại
(xác nhận migration đúng là CHƯA apply, code xử lý honest đúng như thiết
kế).

**Chưa tự test được (giới hạn sandbox không có `SUPABASE_SERVICE_ROLE_KEY`/
tài khoản đăng nhập thật đã nêu nhiều lần):** toàn bộ luồng thật có dữ
liệu (đăng ký qua `?ref=`, mua hàng, xem thống kê, yêu cầu thanh toán,
Admin duyệt) — phụ thuộc migration `supabase-phase27-affiliate-program.sql`
được Founder duyệt và apply trước. Founder tự test trên Preview URL sau
khi duyệt migration: (1) đăng ký 1 tài khoản mới qua link
`?ref=<mã của tài khoản khác>`, xác nhận `members.referred_by` được set +
1 dòng `referrals` mới xuất hiện; (2) mua 1 sản phẩm bằng tài khoản đó,
xác nhận dòng `referrals` chuyển `confirmed` + `commission_amount` đúng;
(3) `/portal/affiliate` của người giới thiệu hiện đúng số liệu; (4) tạo 1
yêu cầu thanh toán, Admin duyệt ở `/admin/affiliate/yeu-cau-thanh-toan`,
xác nhận referrals chuyển `paid`.

## Gộp luồng Schema + UI 2.0 — Bước A/B/C (CKOS)

**Bước A — merge `claude/supabase-audit-schema-w4o7tz` vào `main`** (`b36acdb`,
9 commit, 18 bảng). Founder duyệt merge thẳng, không yêu cầu verify Preview
riêng. **Phát hiện quan trọng:** cả 18 bảng ĐÃ có sẵn trên Supabase
Production TRƯỚC lần merge (kiểm tra bằng `to_regclass`, không suy đoán) —
merge chỉ đưa phần CODE vào `main`, rủi ro DB bằng 0. Verify sau merge:
`tsc`/build sạch, 473/473 test pass.

**Bước B — rebase `feat/portal-admin-2.0` lên `main` mới.** 0 xung đột: 2
nhánh không sửa chung file nào (đã dry-run bằng `git merge-tree` trước khi
làm thật). Sau rebase: build/`tsc`/eslint sạch, 479/479 test pass.

### Bước C — import nội dung CKOS 2.0

Nguồn: 30 file `.md` Founder gửi (12 tài liệu CKOS + 16 bài Học viện + 2 file
khung) + 2 file bổ sung (khung CKOS, Tài liệu 13).

**ĐÃ ÁP DỤNG qua Supabase MCP:**
- `ckos_categories` — thay 7 dòng taxonomy CŨ của 1.0 (Công cụ AI/Prompt/
  Workflow/Resource/Lesson/Best Practice/Case Study) bằng đúng **6 danh mục**
  của thiết kế + nội dung 2.0 (Nền tảng AI · Prompt Engineering · Ứng dụng AI ·
  Công cụ AI · Kỹ năng & Tư duy · Tri thức nâng cao), kèm mô tả đầy đủ.
- `learning_paths` — thay 5 dòng cũ bằng đúng **4 giai đoạn** lộ trình CKOS
  (Nhập môn AI · Làm chủ công cụ AI · Xây dựng hệ thống AI · Tạo giá trị &
  mở rộng), kèm mô tả đầy đủ.

An toàn cho 1.0 vì đã grep xác nhận **0 trang Portal 1.0 nào đọc 2 bảng này**
(chỉ Server Actions admin của luồng A). `learning_path_courses` đang 0 dòng
nên xoá 5 lộ trình cũ không để lại FK mồ côi.

**ĐÃ SOẠN, CHỜ CHẠY** — `supabase-phase36-ckos-content-import.sql` (116KB,
sinh tự động, idempotent): 13 tài liệu + 35 tag + 54 liên kết. Không dán qua
MCP vì nội dung ~99KB — chạy 1 lần trong Supabase SQL Editor rẻ và an toàn
hơn hẳn. Xem phần đầu file SQL để biết lý do chọn bảng `knowledge_assets`
(tái dùng, không tạo bảng mới) và cách phân biệt 13 tài liệu 2.0 với 80
Knowledge Asset cũ nằm chung bảng (`content->>'categorySlug'`).

### ⚠️ Xung đột chưa xử lý — import Học viện/Workspace SẼ đụng Portal 1.0

Ràng buộc "không đụng Portal 1.0 Production" mâu thuẫn trực tiếp với "import
nội dung thật vào đúng bảng" ở 4 bảng mà **1.0 và 2.0 dùng chung**:

| Bảng | Số chỗ 1.0 đọc | Rủi ro nếu import ngay |
|---|---|---|
| `tools` | 11 | `/portal/aiworkspace` 1.0 đổi nội dung ngay lập tức |
| `recommended_workspace` | 1 | nt |
| `ai_workflow_sections` | 1 | nt |
| `courses` | 5 | **nguy hiểm nhất** — xem dưới |

`courses`: khoá nhập môn mới tên "AI cơ bản cho mọi người" CHỨA chuỗi
"cơ bản" — trùng `matchPatterns` của chương trình "Lớp học AI Cơ bản" (1.5tr)
trong `premium-programs.ts`. `matchCourse()` dùng `courses.find()` trên danh
sách đã `.order("name")`, mà "AI cơ bản..." sắp TRƯỚC "Lớp học AI Cơ bản" →
thẻ khoá trả phí trên `/portal/premium` Production sẽ hiện giá/id của khoá
FREE. Cần Founder quyết trước khi import (đổi tên khoá, hoặc cho phép sửa
`matchCourse()` — nhưng sửa là đụng code 1.0).

`knowledge_assets`/`workspace_projects` KHÔNG có vấn đề này (0 chỗ 1.0 đọc).

### ⚠️ RLS: khoá Premium ở tầng UI là KHÔNG đủ

`knowledge_assets` có policy `knowledge_assets_read_published` =
`status='PUBLISHED'` cho mọi người — nghĩa là **body của tài liệu Premium
đọc được công khai qua API** dù UI có khoá. Bước D bắt buộc phải cắt `body`
ở tầng SERVER cho tài liệu `accessLevel='premium'` khi user chưa Premium
(kiểm tra `members.premium_expires_at`), không được chỉ phủ overlay ở UI.

## Bước D + E.1 — Phân quyền Free/Premium + trang CKOS 2.0 (`/v2/he-tri-thuc`)

### Bước D — cơ chế khoá Premium

`src/lib/v2/premium-access.ts` (mới) — `getPremiumStatus()`.

**Quy tắc đọc `members.premium_expires_at` ở đây KHÁC `getPurchasedIds()`**
(`src/lib/access.ts`), dù cùng đọc 1 cột: ở đó câu hỏi là "đơn đã mua còn
hiệu lực không" nên `NULL` = "không có hạn" = GIỮ quyền; ở đây câu hỏi là
"user này CÓ PHẢI Premium không" nên `NULL` KHÔNG thể coi là Premium (hiện
16/16 member đều `NULL` — hiểu ngược lại là mở toàn bộ nội dung Premium cho
tất cả mọi người). Chốt: **Premium ⇔ `premium_expires_at` CÓ giá trị VÀ còn
hạn**.

**Điểm cần Founder quyết (chưa tự quyết):** người mua ĐỨT V-Solo/V-Scale
(đơn không có hạn → `premium_expires_at` vẫn `NULL`) hiện KHÔNG được tính
là Premium. Muốn tính thì phải hoặc set `premium_expires_at` khi xác nhận
đơn, hoặc mở rộng hàm đọc thêm `orders` — đây là quyết định kinh doanh.

**Khoá ở tầng SERVER, không chỉ overlay UI** (`src/lib/portal/live-ckos.ts`):
RLS `knowledge_assets_read_published` cho MỌI người đọc mọi dòng
`PUBLISHED`, nên chỉ phủ overlay là `body` tài liệu Premium vẫn lấy được
qua API bằng anon key. Vì vậy `getCkosDocuments()` (danh sách) KHÔNG BAO
GIỜ select `body`; `getCkosDocument(slug, status)` mới đọc `body` và CẮT BỎ
ngay tại server khi `accessLevel='premium'` mà user chưa Premium (trả
`locked: true`).

### Bước E.1 — `/v2/he-tri-thuc` (1:1 với `He tri thuc CKOS.html`)

- **Xoá** `src/app/v2/(portal)/he-tri-thuc/` (bản mock 46-màn cũ) — trang
  mới tự chứa sidebar/topbar riêng như `trang-chu`, không nằm trong
  `(portal)/layout.tsx`.
- `he-tri-thuc.css` — chép nguyên văn `<style>` gốc, prefix `.ckos`, ĐÚNG 6
  điều chỉnh y hệt bộ đã dùng cho `trang-chu.css` (prefix / `:root`→`.ckos`
  / `body`→`.ckos` / `'Inter'`→`'InterGF'` / `line-height:normal` / revert
  Preflight) — không phát sinh điều chỉnh mới nào.
- `CkosClient.tsx` + `page.tsx` — Server Component fetch dữ liệu thật +
  `getPremiumStatus()`, Client Component render (bản gốc có 2 view "Tất cả
  tri thức"/"Thư viện của tôi" + chip lọc đổi active).

**ĐÚNG 3 chỗ khác bản tĩnh** (đều thuộc phần được phép): (1) số liệu/danh
sách → dữ liệu thật thay số mẫu; (2) chip `.doc-lock` trên dòng tài liệu
Premium khi chưa Premium — dùng lại y hệt box-model `.doc-tag` (KHÔNG viền:
thêm viền làm dòng cao thêm 1px, đo được), màu lấy từ `.upgrade-btn`;
(3) trạng thái rỗng "Thư viện của tôi" dùng microcopy Founder soạn, hiển
thị bằng class `.empty-hint` VỐN CÓ SẴN trong CSS gốc.

**Giữ nguyên "trơ" đúng như mockup** (bản gốc cũng không làm gì): chip lọc
chỉ đổi active, "Xem thêm ↓", "Xem tất cả →", nút lưu, ô tìm kiếm, chuông.
Không tự thêm hành vi — chờ Founder chốt từng cái.

### 2 BUG THẬT phát hiện khi đối chiếu (không phải chỉ lỗi test)

**1. Font/ảnh `/v2/*` trong `public/` bị middleware gate.** `matcher`
`"/v2/:path*"` khớp cả `/v2/fonts/f1.woff2` → 307 redirect login. Với
Supabase đã cấu hình (Preview/Production), mọi request tài nguyên tĩnh
dưới `/v2/` đều phải qua auth check — lãng phí, và fail hoàn toàn cho
request không mang cookie. Đã sửa bằng cách **chuyển `public/v2/` →
`public/v2-static/`** (đổi 2 loại đường dẫn trong `inter-gf.css` +
`trang-chu/page.tsx` + `CkosClient.tsx`) — KHÔNG sửa middleware (dùng
chung với 1.0). Tài nguyên tĩnh không nên nằm dưới tiền tố URL có auth.

**2. `learning_paths` thiếu cột cho nhãn ngắn.** Thiết kế hiện mỗi giai
đoạn 2 dòng: tên + nhãn ngắn ("Nền tảng cơ bản"). `description` lại là
đoạn "Mục tiêu: ..." dài → thẻ đội từ 60px lên 172px. Đã thêm cột
`subtitle` (migration `learning_paths_add_subtitle`) + backfill 4 nhãn
ngắn đúng bản thiết kế, GIỮ NGUYÊN `description` cho trang lộ trình chi
tiết sau này.

### Đối chiếu định lượng: 28 khác biệt → 5, cả 5 đều giải thích được

Playwright, 1440x1000, cùng bộ font, đo tương đối so với `.app`:
- `font-family` — cùng bộ file, chỉ khác TÊN họ (`InterGF`, đổi để không
  đụng `next/font` Inter app đang dùng).
- `rightCol.h`/`helpCard.y` (-119px) — thẻ "Tài liệu phổ biến" hiện
  empty-hint trung thực thay 3 dòng "12,8k lượt xem" mẫu: **hệ thống chưa
  có cơ chế đếm lượt xem tài liệu nào**. Cần Founder quyết: xây đếm lượt
  xem thật, hay đổi tiêu chí xếp hạng.
- `rmNum` màu (2 dòng) — thiết kế tô đậm giai đoạn 1&2 (`.rm-item.done`);
  đó là tiến độ per-user, `user_ckos_progress` đang 0 dòng nên hiện đúng
  trạng thái "chưa hoàn thành giai đoạn nào".

Mọi thứ còn lại khớp CHÍNH XÁC: sidebar 224px, topbar, 5 ô thống kê, 8 chip
lọc, hero + não SVG, lưới 6 danh mục, danh sách tài liệu, thẻ cột phải,
footer, avatar.

**Verify:** `tsc`/`eslint` sạch (18 warning cũ), `vitest` 486/486,
`rm -rf .next && npm run build` sạch. Route devtest tạm dùng để đo (vì
middleware gate `/v2/*` khi Supabase đã cấu hình) đã xoá + rebuild xác nhận
sạch.

## Lệnh xử lý 3 quyết định + tiếp tục E.2 (Mục 1/2/3 + Học viện AI)

### Mục 1 — Premium mua đứt fallback: STOP, cần Founder quyết

Lệnh yêu cầu thêm fallback đọc `orders` cho hàm kiểm tra Premium (đơn mua
đứt V-Solo/V-Scale không có hạn nên `premium_expires_at` mãi `NULL`) —
nhưng kèm điều kiện dừng rõ ràng: nếu ranh giới "sản phẩm nào là mua đứt
Premium nền tảng" không rõ trong dữ liệu thật, dừng lại báo cáo thay vì tự
suy đoán.

**Audit xác nhận đúng điều kiện STOP:** không có bất kỳ cột/flag nào
(`is_premium`, `grants_premium`...) trên `courses`/`products` phân biệt
"sản phẩm mở khoá Premium nền tảng" với "khoá học độc lập". `products` có
0 dòng. Cả 5 chương trình trong `PREMIUM_PROGRAMS`
(`src/components/portal/premium/premium-programs.ts`) đều mô tả như sản
phẩm ĐỘC LẬP (mỗi cái có `description`/`audience`/`topics`/`outcome`
riêng) — không chương trình nào tự nhận là "mở khoá CKOS/nội dung
Premium". "Premium Monthly" nhắc trong lệnh không tồn tại như 1 sản phẩm
mua được thật ở bất kỳ đâu trong hệ thống.

**Kết luận:** đúng điều kiện dừng — KHÔNG tự thêm fallback đọc `orders`
vào `getPremiumStatus()`. Cần Founder xác nhận cụ thể: có sản phẩm nào
trong 5 chương trình (`ai-coban`/`ai-nangcao`/`openclaw`/`solo`/`scale`)
nên tính là "mua đứt Premium nền tảng" hay không, trước khi code logic
này — sai ở đây là rủi ro thật (ai được xem nội dung Premium).

### Mục 2 — Cơ chế đếm lượt xem CKOS thật (đã làm xong)

Bảng mới `ckos_content_views` (aggregate, đọc công khai) +
`ckos_content_view_events` (dedupe log, không policy — chỉ hàm chạm được)
+ hàm SECURITY DEFINER `record_ckos_content_view()`, theo đúng pattern
polymorphic `content_type`/`content_id` đã dùng cho `ckos_content_tags`.
Giới hạn tự quyết: **1 lượt/user/tài liệu/ngày** (dedupe qua
`viewed_date`).

`src/lib/portal/live-ckos.ts`: `recordCkosContentView()` (best-effort,
không throw) được gọi trong `getCkosDocument()` khi `!locked`.
`getCkosPopularDocuments(limit)` xếp theo `view_count` giảm dần, fallback
sang "mới nhất" (`sortedByViews: false`) khi toàn bộ đang 0 — tự quyết
định UI: dùng lại đúng class `.pop-row`/`.pop-row .views` đã có sẵn trong
`he-tri-thuc.css` (thiết kế gốc đã dự trù layout này, chỉ chưa có cơ chế
đếm) thay vì bịa layout mới.

`src/app/v2/he-tri-thuc/{page.tsx,CkosClient.tsx}`: thẻ "Tài liệu phổ
biến" đọc `getCkosPopularDocuments(3)`, hiện icon+title+lượt xem (hoặc
ngày tạo khi fallback) — thay hẳn khối `.empty-hint` cũ.

**Verify:** `tsc`/`eslint` sạch, `vitest` 486/486, `rm -rf .next && npm
run build` sạch. Đã commit + push (`8af88f9`).

### Mục 3 — không làm gì thêm

Chip lọc/tìm kiếm/chuông/nút lưu giữ nguyên như hiện tại — không có thay
đổi nào cần thực hiện cho mục này.

### Bước E.2 — `/v2/hoc-vien-ai` (1:1 với `Hoc vien AI.html`)

Thay hẳn bản mock cũ ở `src/app/v2/(portal)/hoc-vien-ai/page.tsx` (đọc
lớp mock data Phase 1, không có dữ liệu thật) bằng route tự chứa mới
`src/app/v2/hoc-vien-ai/` (sidebar/topbar riêng, cùng kiến trúc
`he-tri-thuc`/`trang-chu`) — 1:1 pixel với `Hoc vien AI.html`, tiền tố
CSS `.hva`, đúng 6 điều chỉnh kỹ thuật đã dùng cho 2 trang trước.

**Audit dữ liệu thật trước khi wiring (qua Supabase MCP):** đúng 1 khoá
Course Builder có nội dung thật — `ai-cho-nguoi-moi-bat-dau` ("AI cho
người mới bắt đầu", free, 4 `course_sections`/16 `course_lessons`, toàn
bộ Published + `is_free_preview=true`), gắn vào giai đoạn 1 "Nhập môn AI"
của `learning_paths` (bảng DÙNG CHUNG với CKOS, đã có 4 giai đoạn thật từ
Bước C) qua `learning_path_courses`. 5 khoá Premium 1.0 còn lại
(`ai-coban`/`ai-nangcao`/`openclaw`/`solo`/`scale`) KHÔNG có section/lesson
Published nào trong Course Builder (2 dòng "Section mới" Draft/0 lesson
trên `ai-coban` là dữ liệu test cũ của Founder, không phải nội dung thật).
`user_lesson_progress` (bảng thật, Phase 30) có 0 dòng — hệ thống mới,
không phải thiếu hạ tầng.

**Data layer mới `src/lib/portal/live-academy.ts`** (cùng pattern
`live-ckos.ts`):
- `getAcademyPaths()` — 4 giai đoạn thật + số bài học Published của khoá
  gắn vào từng giai đoạn (đếm qua join `course_sections`→`course_lessons`).
  `description` cắt còn CÂU ĐẦU TIÊN của `learning_paths.description`
  (đoạn "Mục tiêu: ..." dài) — tự quyết định vì `.path-card p` chỉ có
  min-height 36px (~2 dòng), còn cột `subtitle` (nhãn 2-3 từ, dùng cho
  widget CKOS) lại quá ngắn cho vị trí này; cắt câu đầu không bịa nội
  dung mới, chỉ rút gọn nội dung thật.
- `getAcademyFeaturedCourses()` — CHỈ khoá có `lessonCount > 0` (nội dung
  Course Builder thật), không lọc theo `status='open'` của `courses` (vì
  đó là trạng thái bán hàng Premium 1.0, khác khái niệm "có nội dung
  Course Builder"). Hiện đúng 1/5 vị trí mẫu của thiết kế — không độn
  placeholder cho đủ 5.
- `getAcademyProgress()` — tiến độ THẬT từ `user_lesson_progress`
  (`completed`/`in_progress`/`not_started`), tính cả khi chưa đăng nhập
  (`totalLessons`/`totalCourses` không phụ thuộc user). 0% trung thực vì
  bảng đang 0 dòng — đã verify qua dữ liệu Supabase thật (route dev-preview
  tạm, xoá ngay sau khi xong): `totalCourses=1`, `totalLessons=16` đúng,
  `completedLessons=0` đúng.
- `getAcademyLesson(lessonId, status)` — khoá `content`/`video_url` ở
  tầng SERVER khi `!is_free_preview && !status.isPremium`, đúng cơ chế
  Bước D (`getCkosDocument()`). Chưa có UI nào gọi (bản thiết kế này chỉ
  là trang hub, không có trang xem bài học riêng) — dựng sẵn hạ tầng cho
  tương lai, cùng tiền lệ `getCkosDocument()` ở Bước E.1.

**3 chỗ khác bản tĩnh (đều thuộc phần được phép — nối dữ liệu thật +
Bước D, không đổi layout/màu/font):**
1. "Lộ trình học tập gợi ý" — 4 thẻ dùng dữ liệu thật, % và "x/y bài học"
   là tiến độ thật (đa số 0% vì hệ thống mới). Icon/gradient mỗi vị trí
   GIỮ TĨNH theo đúng thiết kế (bảng `learning_paths` không có cột
   icon/màu) — cùng lý do `CHAPTER_DESTINATIONS` ở Bản đồ hành trình.
2. "Khóa học nổi bật" — chỉ 1 thẻ thật, KHÔNG có rating "★ x,x (n)" (không
   bảng đánh giá nào trong hệ thống).
3. "Hành trình học tập" (cột phải) — BỎ dòng "Điểm kinh nghiệm ... XP"
   (không có cơ chế XP thật — XP chỉ tồn tại trong
   `src/lib/v2/data/catalog.ts`, lớp mock data của các trang
   `/v2/(portal)/*` khác chưa migrate, không liên quan trang này).
4. "Lớp học sắp diễn ra" — trạng thái rỗng trung thực (không có bảng lịch
   học trực tuyến nào trong hệ thống, khác hẳn tình huống CKOS Mục 2).
5. Cả path-grid lẫn course-scroll đều có empty-hint riêng khi 0 dòng
   (bản thiết kế không tính trường hợp này vì mẫu luôn có sẵn thẻ).

**Giữ nguyên "trơ" đúng Mục 3:** 8 tab trong `.tabs-row` chỉ đổi trạng
thái active, không đổi nội dung bên dưới (mockup gốc cũng vậy — chỉ có
đúng 1 khối nội dung "Tổng quan"). Ô tìm kiếm/chuông/mọi CTA không có
đích thật giữ `href="#"`.

**Verify:** `tsc`/`eslint`/`vitest` (486/486) sạch, `rm -rf .next && npm
run build` sạch (route `/v2/hoc-vien-ai` thay đúng route mock cũ, không
ảnh hưởng `/v2/admin/hoc-vien-ai` — route ADM-V2 hoàn toàn khác). Test
thật qua `next start` với anon key thật (route dev-preview tạm, xoá ngay
sau khi xong): xác nhận 4 path-card + 1 course-card render đúng dữ liệu
thật (tên/mô tả/số bài học/% tiến độ), 3 giai đoạn còn lại hiện đúng
"0 bài học" (chưa có khoá nào gắn), 0% mọi nơi (chưa có tiến độ user
thật). Test không có Supabase (mặc định sandbox) — cả 2 nhánh (0 dữ liệu)
render đúng empty-hint, không crash, 0 route khác bị ảnh hưởng
(`/v2/he-tri-thuc`, `/` đều `200`).

**Chưa làm — không nằm trong phạm vi bản thiết kế này (1 trang hub):**
trang xem nội dung 1 bài học (route lesson-detail), 7 tab còn lại trong
`.tabs-row` (Khóa học AI cơ bản/nâng cao/Chuyên đề/Lộ trình/Giảng
viên/Tài liệu/Chứng chỉ) — đúng như bản gốc chỉ có "Tổng quan" có nội
dung thật.

Đã commit + push (`0fe8b51`). Bước tiếp theo (chưa làm, theo Quy tắc 5):
E.3 — AI Workspace.

## Lệnh "Premium mua đứt = tất cả 5 chương trình, tiếp tục E.3"

### Mục 1 — Premium mua đứt: quyết định kinh doanh đã chốt (đảo ngược STOP trước đó)

Mục "Mục 1 — Premium mua đứt fallback: STOP, cần Founder quyết" ở lệnh
trước đã dừng lại đúng vì không có cột/flag nào phân biệt "sản phẩm nào mở
khoá Premium nền tảng". Lệnh này Founder xác nhận trực tiếp: **mua BẤT KỲ
1 trong 5 chương trình trả phí** (`ai-coban`/`ai-nangcao`/`openclaw`/
`solo`/`scale`) **đều mở Premium nền tảng** (CKOS + Học viện AI + AI
Workspace) như nhau — không phân biệt gói nào, không cần lọc theo
`course_id`.

`src/lib/v2/premium-access.ts`'s `getPremiumStatus()` thêm fallback: (1)
`premium_expires_at` có giá trị và còn hạn → Premium (giữ nguyên logic Bước
D); (2) `NULL` → fallback kiểm tra có bất kỳ đơn `orders.status='confirmed'`
nào của email đó không (KHÔNG lọc `course_id`) → Premium nếu có, Free nếu
không. Test mới `src/lib/v2/__tests__/premium-access.test.ts` (5 test) phủ
đủ: còn hạn → Premium bất kể đơn hàng; `NULL` + có đơn confirmed → Premium
qua fallback; `NULL` + không đơn → Free; hết hạn + không đơn → Free; chưa
đăng nhập → `FREE_STATUS`, không chạm bảng nào. Đã commit `33d7e16`.

### Xung đột 1.0/2.0 ở `tools`/`ai_workflow_sections` — 2 lần STOP, cả 2 Founder chọn ghi đè

Trước khi import nội dung Workspace còn lại (đã hoãn từ Bước C), audit qua
Supabase xác nhận cả 2 bảng ĐANG PHỤC VỤ Portal 1.0 Production thật (không
phải bảng mồ côi): `tools` — 11 dòng, đọc bởi `live-tools.ts` cho
`/portal/aiworkspace` + `/portal/aiworkspace/[slug]`; `ai_workflow_sections`
— 4 dòng, đọc bởi `AiWorkflowSection` (`AiSpaceSections.tsx`) cho
`/portal/aiworkspace`. Đây đúng điều kiện STOP của lệnh giao gốc ("nếu
chạm Portal 1.0 Production hoặc ai xem Premium — dừng lại hỏi") — đã hỏi
qua `AskUserQuestion` 2 lần riêng biệt (không gộp, vì rủi ro khác nhau: 1
bảng đổi nội dung Công cụ AI, 1 bảng đổi nội dung Workflow):

- **`ai_workflow_sections`:** Founder chọn **ghi đè** — 4 dòng cũ (nội
  dung 1.0) → 4 workflow mẫu mới của khung nội dung Workspace 2.0.
- **`tools`:** Founder chọn **ghi đè bằng 27 công cụ mới** (khớp lựa chọn
  trên) — nhưng khi soạn migration phát hiện brief đếm trùng 2 công cụ
  dùng ở nhiều nhóm (Perplexity ở nhóm 1&6, Claude/ChatGPT ở nhóm 1&2) —
  đã ghi rõ trong migration SQL: **25 dòng DB thật** (mỗi tool 1 dòng duy
  nhất), không tạo dòng trùng để cố khớp con số "27" của brief (con số đó
  đếm theo lượt xuất hiện trong bảng, không phải số tool duy nhất).

Migration `phase37_ai_workspace_content_e3` (`apply_migration`,
`success:true`): `DELETE`+`INSERT` cả 2 bảng với nội dung mới (25
tools/6 danh mục: Trợ lý AI ×5, Viết lách & Nội dung ×4, Hình ảnh AI ×5,
Video AI ×4, Âm thanh AI ×3, Nghiên cứu & Phân tích ×4 — đúng URL công
khai thật, không placeholder); `workspace_projects` (0 dòng trước đó) thêm
2 dòng mẫu `is_sample=true` (Content YouTube AI 65% in_progress, Viết bài
blog chuẩn SEO 100% completed), chủ sở hữu kỹ thuật là `id` của Founder
(chỉ để thoả FK `NOT NULL`, không giới hạn ai xem — xem policy dưới); thêm
policy mới **`"public read sample projects" ON workspace_projects FOR
SELECT USING (is_sample = true)`** — tự quyết định (không hỏi lại) vì đây
là nhu cầu kỹ thuật nhỏ phục vụ đúng ý đồ thiết kế đã duyệt ("2 dự án mẫu
hiển thị công khai cho mọi user"), không đụng Production 1.0 (bảng 0 dòng
trước đó, không consumer 1.0 nào).

**Ảnh hưởng đã biết lên Portal 1.0:** `/portal/aiworkspace` (1.0) đổi nội
dung Công cụ AI + Workflow ngay lập tức sau migration — đây là hệ quả
Founder đã chấp nhận rõ ràng qua 2 lần `AskUserQuestion`, không phải sự cố
ngoài ý muốn.

## Bước E.3 — AI Workspace 2.0 (`/v2/ai-workspace`) — module cuối 3 module ưu tiên

Cùng kỹ thuật 1:1 đã dùng cho CKOS (Bước E.1)/Học viện AI (Bước E.2): tiền
tố CSS `.aiw`, đúng 6 điều chỉnh kỹ thuật, sidebar/topbar/`HREF_MAP` copy
verbatim, `AiWorkspaceClient.tsx` "use client" + `page.tsx` Server
Component nối dữ liệu thật + `getPremiumStatus()`. Đã xoá bản mock cũ
`src/app/v2/(portal)/ai-workspace/` (trùng route `/v2/ai-workspace` với
route mới — Turbopack chặn build nếu không xoá, đúng lỗi đã gặp ở
he-tri-thuc/hoc-vien-ai).

`src/lib/portal/live-workspace.ts` (mới):
- `getWorkspaceToolGroups()` — 6 nhóm, thứ tự = thứ tự xuất hiện đầu tiên
  trong `tools` theo cột `order` (KHÔNG hardcode danh sách 6 tên — nếu
  Admin thêm danh mục mới qua `/admin/tools` sau này, nhóm mới tự xuất
  hiện). Số đếm thật: 5/4/5/4/3/4 (khác số mẫu 12/18/15/12/8/10 trong bản
  thiết kế).
- `getWorkspaceFavoriteTools()` — "Công cụ yêu thích" không có bảng lưu
  preference nào thật; dùng đúng 5 tool id khớp bản thiết kế minh hoạ
  (`chatgpt`/`claude`/`midjourney`/`notion-ai`/`perplexity` — cả 5 đều là
  dòng thật trong `tools` sau migration, không phải bịa). Nút star chỉ
  toggle client-side, không lưu (đúng hành vi JS gốc của mockup, vốn cũng
  không persist).
- `getWorkspaceWorkflows()` — 4 dòng `ai_workflow_sections` thật.
- `getWorkspaceProjects()` — 1 câu SELECT qua `getSupabaseServer()`
  (session client) tận dụng RLS OR giữa 2 policy permissive (`own` +
  `public read sample projects`) để trả đúng "dự án thật của user đang
  đăng nhập + 2 dự án mẫu" trong 1 lần gọi, không cần 2 client/2 query.
- `getWorkspaceActivity()` — đọc `workspace_project_history` (bảng thật,
  0 dòng vì hệ thống mới — không phải thiếu hạ tầng).
- `getWorkspaceLimits(premium)` — Bước D: "1 workflow mở/tháng, tối đa 3
  dự án cùng lúc" cho Free, không giới hạn cho Premium. **Cố ý KHÔNG tái
  dùng `getWorkspaceProjects()`** cho phần tính giới hạn — vì
  `workspace_projects_admin` (policy `ALL`, không lọc chủ sở hữu) khiến
  session Admin đọc được TOÀN BỘ dự án thật của MỌI người dùng qua câu
  SELECT chung, dùng tập đó để tính hạn mức cá nhân sẽ đếm nhầm dự án của
  người khác vào quota của Admin. Dùng 1 câu query riêng, lọc tường minh
  `eq("user_id", userId).eq("is_sample", false)` sau khi tự
  `auth.getUser()`. "1 workflow mở/tháng" = số `workflow_id` KHÁC NHAU
  trong các dự án thật tạo ra trong tháng hiện tại (theo `created_at`);
  "tối đa 3 dự án" = số dự án thật có `status='in_progress'`.

**Bước D — phạm vi thực thi (đã ghi rõ trong code, không ngộ nhận):**
bản thiết kế này KHÔNG có hành động "mở workflow"/"tạo dự án" thật nào
được nối (mọi nút liên quan vẫn không có backend ghi) — nên phần chặn
dừng ở tầng HIỂN THỊ (banner `.limit-badge` dưới "Workflow mẫu" khi Free
đã dùng hết 1/1 lượt tháng; khoá "+ Tạo dự án mới" thành biến thể
`.new-proj.locked` khi Free đạt 3 dự án `in_progress` — cả 2 dùng lại
đúng cặp màu "Premium" có sẵn `#a9822c`/`#fff3d9`, không tự chế màu mới,
cùng nguyên tắc `.doc-lock` ở CKOS). Khi có module sau này thêm hành động
ghi thật (tạo dự án/mở workflow), phải gọi lại `getWorkspaceLimits()` ở
tầng Server Action đó để chặn thật — ghi rõ trong docblock để không ai
tưởng nhầm giới hạn đã được thực thi ở tầng ghi.

**9 chỗ khác bản tĩnh** (đều thuộc phạm vi được phép — nối dữ liệu thật +
Bước D, không đổi layout/màu/font — liệt kê đầy đủ trong docblock đầu
`AiWorkspaceClient.tsx`): (1) 6 nhóm công cụ dùng số đếm thật; (2) "Công
cụ yêu thích" 5 công cụ thật, mặc định cả 5 đều đang "yêu thích" (không có
dữ liệu preference thật để suy ra trạng thái khác); (3) "Dự án của bạn" —
BỎ HẲN dãy avatar cộng tác viên giả (`.avatars`, không có bảng lưu
cộng tác viên nào), giữ "Cập nhật: X" (thời gian tương đối thật) + nút
"⋯" trơ; (4) tab lọc/sort-select/view-toggle giữ TRƠ đúng bản gốc (script
gốc của chính mockup cũng chỉ đổi class `active`, không lọc/sắp xếp/đổi
layout thật — chỉ số đếm trong nhãn tab là thật); (5) "Workflow mẫu" 4
workflow thật, "X bước · Y công cụ" là số thật; (6) "Hoạt động gần đây"
đọc bảng thật, trạng thái rỗng trung thực; (7) "Gợi ý cho bạn" ghép tối đa
3 workflow thật (không thêm nguồn dữ liệu mới), bỏ hẳn nhãn "Mới" (không
có tín hiệu "mới" thật); (8) banner/khoá Bước D; (9) "Xem tất cả công cụ
→" và CTA không có đích thật khác giữ `href="#"` (chưa có `/v2/khong-gian-ai`,
thuộc 42 trang còn lại của Bước F).

**Verify:** `tsc`/`eslint` sạch (18 warning còn lại đều có từ trước, không
liên quan file mới), `vitest run` 491/491, `rm -rf .next && npm run build`
sạch (route `/v2/ai-workspace` xuất hiện đúng, route mock cũ đã biến
mất). Test thật qua `next start` với anon key thật (route dev-preview tạm
`/devtest-aiws`, xoá ngay sau khi xong): xác nhận cả 6 nhóm công cụ (số
đếm 5/4/5/4/3/4 đúng), 2 dự án mẫu (icon/gradient theo đúng workflow gắn,
status pill/progress đúng, "Cập nhật: X phút trước" đúng), 4 workflow (số
bước/công cụ đúng theo từng dòng: 6/5, 8/7, 5/5, 7/5), 5 công cụ yêu thích
đúng tagline thật, "Hoạt động gần đây" hiện đúng trạng thái rỗng trung
thực (0 dòng) — 0 lỗi log server ở cả 2 lượt test (có/không Supabase).

**Đối chiếu định lượng Playwright** (script tạm tại scratchpad, không
commit): so `.app`/`.sidebar`/`.topbar`/`.content`/`.grp-grid`/
`.proj-grid`/`.wf-grid`/3 `.card` cột phải giữa mock tĩnh (file `.html`
qua static server cục bộ) và route dev-preview thật, viewport 1440×1000.
73 diff thô → sau khi loại bỏ 2 nhóm nguyên nhân đã biết (không phải lỗi
render): (a) offset `y`/`h` cố định 65px xuyên suốt mọi container —
KHÔNG PHẢI lỗi UI, mà do route dev-preview `/devtest-aiws` nằm NGOÀI
`/v2` nên `ChromeGate` (`src/components/site/ChromeGate.tsx`) hiện Header/
Footer marketing (route `/v2/ai-workspace` thật thì `ChromeGate` tự ẩn
đúng, không có offset này); (b) tên `font-family` khác (`InterGF` vs
`Inter`, cùng bộ file — đúng pattern đã ghi nhận ở CKOS/Học viện AI) —
còn lại đúng 2 diff kích thước thật (`.topbar-right` lệch 11px,
`.proj-toolbar` lệch 19px), cả 2 đều là container `margin-left:auto` co
giãn theo độ rộng chữ bên trong — hệ quả trực tiếp của (b) (font-metric
khác nhau làm chữ "Nâng cấp Premium"/"Sắp xếp: Mới nhất" rộng khác vài
px), không phải sai lệch bố cục. 0 diff về `background-color`, 0 phần tử
thiếu (`missing`).

Đã commit + push (`b84c616`). **HOÀN TẤT CẢ 3 MODULE ƯU TIÊN** (CKOS →
Học viện AI → AI Workspace). Bước tiếp theo theo lệnh giao (Bước F — 42
trang còn lại) CHƯA bắt đầu, chờ xác nhận riêng của Founder trước khi làm
(đúng Quy tắc 5 — báo cáo xong 1 module rồi mới qua module/giai đoạn kế
tiếp).
