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
- **Best Practice, Case Study:** chưa Full — Best Practice chưa có bảng
  Supabase nào tồn tại; Case Study có bảng `case_studies` (typed riêng,
  không phải schema generic) nhưng chưa có admin CRUD.

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
