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
