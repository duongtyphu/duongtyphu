# PROJECTS-SPR-602 — Projects & Opportunities Canonical Product

**Brief:** FOUNDER DIRECTIVE — PROJECTS & OPPORTUNITIES CANONICAL PRODUCT (Founder Decision, không tranh luận).
**Reference Source duy nhất:** Portal hiện tại — đặc biệt `/portal/duan-cohoi` là Canonical Product.

---

## 1. Tóm tắt

Trước sprint này, Admin Projects & Opportunities (`/admin/digital-assets`, 11 route) quản lý model
`DigitalAssetProject`/`DigitalAssetLink` — **Consumer = 0** trên `/portal/duan-cohoi` thật (chỉ phục vụ
route `/portal/digital-assets/**` đã bị Product Owner khai tử). Trong khi đó, model thật Portal đang render
(`Ecosystem`/`SubProject`/`MarketingLink`/`AffiliateOffer`/`ExchangeLink` trong `ecosystems.ts`) **100%
hardcode, 0% CRUD** — đây chính là mô tả "2 mô hình song song" mà PROJECTS-SPR-601 đã phát hiện và đã được
Founder xác nhận qua Directive này.

**Đã làm:** Gỡ bỏ hoàn toàn CRUD cũ (Project/Link/5 trang category, Báo cáo mock), xây **Ecosystem CRUD
thật** bám đúng cấu trúc `/portal/duan-cohoi`, và nối dây Portal đọc trực tiếp từ CRUD đó — không còn dấu
vết mô hình Admin cũ.

---

## 2. Data model mới (`src/data/portal/ecosystems.ts`)

Chuẩn hóa đúng 8 khái niệm brief liệt kê:

| Khái niệm brief | Field trong `Ecosystem` |
|---|---|
| Ecosystem | `Ecosystem` (object gốc) |
| Project Detail | `name`/`shortDescription`/`fullIntro`/`highlights`/`whoFor`/`whoNotReady`/`expectedOutcome` |
| Project Link | `links: EcosystemLink[]` |
| Child Project | `subProjects: SubProject[]` (mỗi sub-project có `links` + `potentialAnalysis` riêng) |
| CTA | Gộp chung vào `EcosystemLink` (label + url + visible + order) — không tạo object CTA riêng vì Portal
thật không phân biệt "CTA" và "Link" thành 2 object khác nhau, chỉ có 1 khái niệm nút bấm/link ra ngoài |
| Evaluation | `potentialAnalysis: PotentialAnalysisItem[]` (criterion/status/note, fallback bộ mặc định 6 tiêu chí) |
| FAQ | `faq: FaqItem[]` — **MỚI hoàn toàn**, trước đây không tồn tại theo từng Ecosystem (chỉ có 1 FAQ tĩnh
cấp trang, 3 câu, giữ nguyên không đổi) |
| Related Content | `relatedArticleIds: string[]` — Founder tự chọn Bài viết qua Admin; rỗng thì fallback lọc
theo `articleCategory` (cơ chế cũ) |

**Icon/Màu (Task 4 — form đơn giản):** `icon`/`colorKey` là 2 field `select` từ palette cố định
(`src/components/portal/opportunities/ecosystemVisuals.ts`) — không phải text tự do, vì icon phải là
Lucide component và màu phải khớp class Tailwind đã build sẵn (JIT không compile được class ghép từ hex
tùy ý). File này còn **gộp 2 bảng tra cứu Tailwind trùng lặp** (`ECOSYSTEM_SURFACE` ở `page.tsx` +
`SURFACE` ở `[ecosystemSlug]/page.tsx`, cùng 5 gradient định nghĩa 2 lần) thành 1 nguồn duy nhất.

**Không bịa dữ liệu:** 5 Ecosystem/9 Sub-project/link thật giữ nguyên y hệt nội dung cũ (URL thật của
DigiU/SolarGroup, tên Lazada/Shopee/Binance/OKX...). `faq: []` cho cả 5 mục — Founder chưa nhập câu hỏi
nào theo từng Ecosystem, không tự bịa.

---

## 3. Portal — nối dây Ecosystem CRUD (Task 5, 6)

- `/portal/duan-cohoi` (hub): bỏ mảng `ECOSYSTEMS` hardcode riêng trùng lặp gần như y hệt `ecosystems.ts`
(khác tên field, không đồng bộ) — giờ đọc `useCollection("ecosystems", ...)` làm nguồn duy nhất.
- `/portal/duan-cohoi/[ecosystemSlug]` + `/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]`: chuyển từ
Server Component tĩnh (`generateStaticParams`, build-time) sang Server wrapper mỏng (`generateMetadata`
đọc seed) + Client View đọc `useCollection` — vì nội dung giờ động qua Admin, Founder thêm Ecosystem mới
không cần deploy lại code.
- **FAQ theo từng Ecosystem** giờ hiển thị thật trên mini-site (trước đây trang này chủ động KHÔNG render
FAQ) — đúng yêu cầu brief "Nếu Portal đã thay đổi, Admin phải thay đổi theo" (ở đây ngược lại: Admin có khả
năng mới, Portal phải hiển thị nó).
- **Bài viết liên quan** ưu tiên `relatedArticleIds` Founder chọn qua Admin, fallback khớp `articleCategory`
nếu chưa chọn — không phá vỡ hành vi cũ cho Ecosystem chưa được Founder curate lại.
- `Category`/`Article` (Supabase `digital_asset_categories`/`digital_asset_articles`) **giữ nguyên** — vẫn
là Consumer thật (nhãn Bài viết + Bài viết liên quan), không nằm trong phạm vi gỡ bỏ.

---

## 4. Admin — Workspace mới (Task 1, 4, 5)

`/admin/digital-assets` (11 route) → `/admin/projects-opportunities` (4 route, đúng tinh thần "form đơn
giản hơn"):

| Route | Nội dung |
|---|---|
| Tổng quan | Dashboard: stat thật (số Ecosystem/Dự án con/Link/FAQ), Portal Mapping bảng (nay toàn "✅ CRUD thật") |
| Hệ sinh thái | List + editor đầy đủ: Cơ bản / Nội dung / CTA & Link / Dự án con / Hai mảng / Tiêu chí đánh giá / FAQ / Bài viết liên quan / SEO & Publish |
| Bài viết | Giữ nguyên (chuyển route), Consumer thật |
| Danh mục | Giữ nguyên (chuyển route), Consumer thật |

**Đã GỠ BỎ hoàn toàn** (Task 1 — "không dùng CRUD cũ nếu không còn phù hợp"): `digital-assets/projects`,
`digital-assets/links`, `digital-assets/category/[key]` (5 route), `digital-assets/analytics` (báo cáo
100% mock, tự thân đã mất ý nghĩa khi Project/Link CRUD gỡ bỏ). Toàn bộ 8 file xóa qua `git rm`, không để
lại route/menu chết.

`Article.projectId` (field cũ trên `DigitalAssetArticle`, thuộc model Project đã gỡ CRUD): **giữ nguyên
schema** (đổi sẽ động vào type dùng chung với route Portal chết `/portal/digital-assets/**`, ngoài phạm vi
sprint) — chỉ đổi nhãn field thành "Dự án (cũ, không quản lý ở đây)" để không gây hiểu lầm, options vẫn lấy
từ danh sách project cũ có sẵn (không bịa danh sách mới).

---

## 5. Supabase migration (bắt buộc trước khi merge/deploy)

`supabase-projects-opportunities-migration.sql` — tạo bảng `ecosystems` (id/data jsonb/status/order,
RLS "public read published"), seed đúng 5 Ecosystem thật ở trên. Đăng ký `"ecosystems": "ecosystems"` vào
`SUPABASE_COLLECTIONS` (`supabaseCollections.ts`).

**⚠️ Cảnh báo rủi ro (đã ghi rõ trong file migration và trong code comment):** nếu merge/deploy
Production **trước khi** chạy script này trong Supabase SQL Editor, `/portal/duan-cohoi` sẽ hiển thị RỖNG
(API `/api/admin/collections/ecosystems` trả lỗi bảng không tồn tại → `useCollection` nhận mảng rỗng, không
có cơ chế fallback về seed). Nhánh này **chưa merge, chưa deploy** — đúng theo mọi sprint trước, nên rủi ro
này chưa xảy ra; chỉ cần Founder chạy migration trước khi merge PR #48.

---

## 6. Workspace Ownership + Founder Operation Center

- `workspaceOwnership.ts`: cập nhật `owns` cho `projects-opportunities`, `href` đổi sang
`/admin/projects-opportunities`, `maturity` nâng từ `Mixed-Legacy` → `Consistent-Legacy` (CRUD thật, Consumer
thật, không còn 2 mô hình song song).
- `founder/page.tsx`: đánh dấu **[ĐÃ XỬ LÝ]** Open Blocker P0 "Digital Assets CRUD quản lý route đã khai
tử" (cả ở PMO Question list lẫn Open Blocker list) — đây từng là 1/3 blocker P0 duy nhất của toàn hệ thống
theo FOUNDER-SPR-1001. Thêm 1 dòng Founder Decision xác nhận `/portal/duan-cohoi` là Canonical Product.
- `contentBlockRegistry.ts`: sửa `content_duancohoi_gem_cards` — hết cảnh báo "2 nguồn dữ liệu song song",
xác nhận Portal đọc thẳng collection `ecosystems` thật.

---

## 7. Future Flexibility Review (đối chiếu Acceptance)

| Founder yêu cầu | Đạt? |
|---|---|
| Thêm hệ sinh thái | ✅ — nút "+ Thêm hệ sinh thái" ở `/admin/projects-opportunities/ecosystems` |
| Thêm dự án | ✅ — cùng chỗ, editor đầy đủ |
| Thêm dự án con | ✅ — tab "Dự án con" trong editor (structureType "sub-projects") |
| Thêm affiliate link | ✅ — tab "CTA & Link" (mọi structureType), tự động có field "Danh mục" khi
structureType = "affiliate-list" |
| Thêm CTA | ✅ — cùng field Link ở trên (1 object thống nhất, không tách CTA riêng) |
| Thêm FAQ | ✅ — tab "FAQ", hiển thị thật trên mini-site |
| Thêm bài viết liên quan | ✅ — tab "Bài viết liên quan" (chọn từ Article đã Published) |

**Tất cả không cần sửa code** — đúng Acceptance "Projects & Opportunities Workspace = 100% Portal hiện
tại. Không còn dấu vết mô hình Admin cũ." (điều kiện duy nhất: đã chạy migration SQL).

---

## 8. Build/test

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` / `npm run build` — thành công, xác nhận toàn bộ route `/portal/duan-cohoi/**` +
`/admin/projects-opportunities/**` build đúng
- [x] `npm run test` — 139/139 pass

---

## 9. Files changed

**Mới:**
- `supabase-projects-opportunities-migration.sql`
- `src/components/portal/opportunities/ecosystemVisuals.ts`
- `src/components/portal/opportunities/OpportunitiesHubView.tsx`
- `src/components/portal/opportunities/EcosystemMiniSiteView.tsx`
- `src/components/portal/opportunities/SubProjectMiniSiteView.tsx`
- `src/lib/admin/projectsOpportunities/navigation.ts`
- `src/app/admin/(dashboard)/projects-opportunities/page.tsx` (Dashboard)
- `src/app/admin/(dashboard)/projects-opportunities/ecosystems/page.tsx` (list)
- `src/app/admin/(dashboard)/projects-opportunities/ecosystems/[id]/page.tsx` (editor)
- `src/app/admin/(dashboard)/projects-opportunities/categories/page.tsx` (chuyển route)
- `src/app/admin/(dashboard)/projects-opportunities/articles/page.tsx` (chuyển route)
- `docs/admin/PROJECTS_OPPORTUNITIES_CANONICAL_PROJECTS-SPR-602.md` (file này)

**Sửa:**
- `src/data/portal/ecosystems.ts` (rewrite toàn bộ data model)
- `src/components/portal/opportunities/MarketingLinkBox.tsx` (type `EcosystemLink`)
- `src/app/portal/duan-cohoi/page.tsx`, `[ecosystemSlug]/page.tsx`, `[ecosystemSlug]/[subProjectSlug]/page.tsx`, `bai-viet/[slug]/page.tsx`
- `src/lib/admin/nav.ts`, `src/components/admin/AdminSidebar.tsx`
- `src/lib/admin/supabaseCollections.ts`
- `src/lib/admin/workspaceOwnership.ts`
- `src/lib/admin/portal/contentBlockRegistry.ts`
- `src/app/admin/(dashboard)/founder/page.tsx`

**Xóa (`git rm`):**
- `src/app/admin/(dashboard)/digital-assets/**` (7 file, 11 route cũ)
- `src/lib/admin/digitalAssets/navigation.ts`

Không merge. Không deploy Production. Portal là Canonical — Admin chỉ quản lý dữ liệu của Portal.
