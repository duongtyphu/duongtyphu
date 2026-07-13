# PROJECTS-SPR-601 — Projects & Opportunities Workspace Management

**Epic:** EPIC-02 · **Phase:** Phase 6 — Projects & Opportunities · **Brief:** IMP-PROJECTS-601
**Mode:** Implementation Mode — không audit lại Blueprint/Product Package, không tạo tài liệu Product mới. Portal hiện tại là Reference Source duy nhất.

**Bối cảnh quan trọng:** Đây là Workspace phức tạp nhất được đối chiếu trong toàn EPIC-02: Admin đã có **CRUD thật** (không phải giả — 5 collection Supabase: Category/Project/Link/Article/Settings, `/admin/digital-assets/*`, 11 route), nhưng đối chiếu trực tiếp với Portal thật (`/portal/duan-cohoi`) phát hiện **2 mô hình dữ liệu song song, gần như không giao nhau**: (1) `ecosystems.ts` — 5 "Ecosystem" (DigiU/SolarGroup/Crypto/Blockchain/Trading) mà Founder thực sự thấy trên Portal, 100% hardcode, 0% CRUD; (2) `digitalAssets.ts` — Category/Project/Link/Article/Settings, CRUD thật qua Supabase, nhưng Consumer thật trên `/portal/duan-cohoi` chỉ giới hạn ở Article+Category (qua route `bai-viet/[slug]`), còn Project/Link/Settings **Consumer = 0** (chỉ được đọc bởi route `/portal/digital-assets/**` đã bị Product Owner khai tử từ trước, xác nhận lại độc lập trong Sprint này, khớp phát hiện gốc của IMP-ADM-001R).

---

## Deliverable 1 — Projects Workspace Review

**Portal thật:** `/portal/duan-cohoi` — 5 Ecosystem (DigiU/SolarGroup/Crypto/Blockchain/Trading), mỗi Ecosystem có 1 trong 4 kiểu cấu trúc (`sub-projects`/`two-field`/`affiliate-list`/`exchange-list`), toàn bộ định nghĩa trong `src/data/portal/ecosystems.ts` (407 dòng, chú thích gốc xác nhận: *"Still a STATIC data file standing in for the future CMS collection... no admin/CRUD is built in this phase"*).

**Admin thật:** `/admin/digital-assets/*` — 11 route, tất cả là CRUD thật (không có route ComingSoon/placeholder nào), quản lý 1 mô hình dữ liệu **khác** (`digitalAssets.ts`), không phải Ecosystem.

---

## Deliverable 2 — Portal Mapping (Task 1)

### Trang chính `/portal/duan-cohoi/page.tsx` — 7 Section (đúng thứ tự JSX, đính chính Section Registry PORTAL-SPR-301 vốn chỉ có 2/7)

| # | Section | Nguồn dữ liệu | CRUD? |
|---|---|---|---|
| 1 | Hero | Hardcode trong `page.tsx` | Không |
| 2 | Gem Card List (5 Ecosystem) | `ECOSYSTEMS` const **nội bộ file** (bản trình bày, khác `ecosystems.ts` canonical) | ❌ Chưa có |
| 3 | Companion Marquee | `COMPANION_PLACEHOLDERS` (8 tile minh hoạ, comment gốc xác nhận không phải ảnh thật) | Không |
| 4 | "Vì sao trang này tồn tại" | Text tĩnh | Không |
| 5 | "Tiêu chí chia sẻ của tôi" | `CRITERIA` (4 mục) | ❌ Chưa có |
| 6 | "Câu hỏi thường gặp" | `FAQ` (3 câu, cấp trang, không theo Ecosystem) | ❌ Chưa có |
| 7 | "5 điều Companion muốn bạn mang theo" | `COMPANION_QUOTES` (5 mục) | ❌ Chưa có |

### 3 route con

| Route | Nguồn dữ liệu | CRUD/Consumer |
|---|---|---|
| `/portal/duan-cohoi/[ecosystemSlug]` (5 trang tĩnh) | `ecosystems.ts` — `Ecosystem`, `SubProject`, `MarketingLink`, `AffiliateOffer`, `ExchangeLink` | ❌ 0% CRUD. Danh sách "Bài viết liên quan" đọc **mảng tĩnh import cứng** `digitalAssetArticles` (không phải `useCollection`) — bài viết Founder thêm mới trong Admin **không** xuất hiện ở đây. |
| `/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` (5 trang, chỉ DigiU+SolarGroup) | `ecosystems.ts` | ❌ 0% CRUD |
| `/portal/duan-cohoi/bai-viet/[slug]` | `useCollection("digital-asset-articles", ...)` + `useCollection("digital-asset-categories", ...)` | ✅ **Consumer thật** — bài viết Published từ Admin hiển thị đúng tại URL trực tiếp, kèm nhãn danh mục. |

### Bảng đối chiếu Object (Scope brief) ↔ thực tế

| Object (Scope) | Nguồn | CRUD | Consumer trên `/portal/duan-cohoi` |
|---|---|---|---|
| Ecosystem (DigiU/SolarGroup/Crypto/Blockchain/Trading) | `ecosystems.ts`, hardcode | ❌ Không | — (đây chính là "nhóm" Founder thấy, không Admin nào chạm được) |
| Sub-project | `ecosystems.ts`, hardcode | ❌ Không | — |
| CTA / External Link (MarketingLink/AffiliateOffer/ExchangeLink) | `ecosystems.ts`, hardcode | ❌ Không | — |
| Category | `digitalAssets.ts` → Supabase `digital_asset_categories` | ✅ Có | ✅ Thật, hẹp — chỉ gắn nhãn bài viết tại `bai-viet/[slug]` |
| Project | `digitalAssets.ts` → Supabase `digital_asset_projects` | ✅ Có | ❌ 0 — chỉ đọc bởi route `/portal/digital-assets/**` đã khai tử |
| Article | `digitalAssets.ts` → Supabase `digital_asset_articles` | ✅ Có | ⚠️ Thật nhưng không thể khám phá — sống ở URL trực tiếp, không hiện trong lưới "liên quan" của Ecosystem |
| Resource | Không tồn tại object riêng | ❌ Không | — |
| FAQ (theo từng Ecosystem) | Không tồn tại — chỉ có 1 FAQ tĩnh cấp trang | ❌ Không | — |
| Visibility | `MarketingLink.visible`/`AffiliateOffer.visible`/`ExchangeLink.visible` (hardcode) + `DigitalAssetProject/Article/Category.status` (CRUD nhưng Consumer như trên) | Hỗn hợp | Hỗn hợp |
| Publish | `Ecosystem.status` (hardcode, không Admin-editable) + `DigitalAssetProject/Article.status` (CRUD, Consumer như trên) | Hỗn hợp | Hỗn hợp |

**Đã sửa Section/Content Block Registry** (PORTAL-SPR-301): thêm 5 Section thiếu (Companion Marquee, "Vì sao trang tồn tại", Tiêu chí, FAQ, Companion Quotes) đúng thứ tự JSX; `contentBlockRegistry.ts` cập nhật `contentTypeNote` cho mỗi Content Block ghi rõ nguồn hardcode + trạng thái CRUD.

---

## Deliverable 3 — Workspace Ownership Validation (Task 4)

Quét toàn bộ `src/app/admin/(dashboard)/digital-assets/**` cho từ khóa "knowledge"/"learning"/"commercial"/"mentor"/"website"/"media"/"brand"/"academy"/"ckos" — 0 kết quả ngoài phạm vi.

**Kết luận Task 4: sạch — 0 chồng chéo với CKOS/Academy/Premium/Website/Media/Brand/Mentor.**

**Phát hiện cần ghi rõ (`workspaceOwnership.ts` đã sửa):** entry cũ tuyên bố "owns: Hệ sinh thái DigiU, SolarGroup, Crypto, Blockchain, Trading, Dự án, Bài viết" — **sai lệch thực tế**, vì Workspace này **0% sở hữu** 5 Ecosystem (không có đường CRUD nào chạm tới `ecosystems.ts`). Đã sửa để phản ánh đúng: Workspace sở hữu CRUD thật cho Category/Project/Link/Article/Settings, nhưng không sở hữu khái niệm "Ecosystem" mà Founder thấy trên Portal.

---

## Deliverable 4 — Future Flexibility Review (Task 5)

Founder yêu cầu đánh giá: thêm **Project/Category/Article/CTA/FAQ mới** có cần sửa TypeScript/Route/Component không.

| Hành động | Kết quả |
|---|---|
| Thêm Project mới | ✅ 0 code cần sửa (`CrudPage.add()`) — nhưng ⚠️ **Consumer = 0**, Project mới không hiển thị bất cứ đâu trên Portal thật. |
| Thêm Category mới | ✅ 0 code cần sửa — Consumer thật hẹp (chỉ ảnh hưởng nhãn bài viết, không tạo Ecosystem mới trên Portal). |
| Thêm Article mới | ✅ 0 code cần sửa — Consumer thật nhưng **không thể khám phá** (sống ở URL trực tiếp, không hiện trong Ecosystem liên quan) trừ khi Founder tự chia sẻ link. |
| Thêm CTA mới | ❌ **Không áp dụng được** — không có object "CTA" độc lập; MarketingLink gần nhất là hardcode 100%, thêm mới phải sửa `ecosystems.ts` trực tiếp. |
| Thêm FAQ mới | ❌ **Không áp dụng được** — FAQ hiện tại là 1 mảng tĩnh cấp trang (không theo Ecosystem), sửa phải edit trực tiếp `page.tsx`. |

**Kết luận: 3/5 hành động 0 code, nhưng 2/3 trong số đó (Project/Article) có khoảng trống Consumer nghiêm trọng — CRUD hoạt động trong Admin nhưng không phản ánh đúng như Founder kỳ vọng lên Portal thật.** 2/5 hành động còn lại (CTA/FAQ) không khả thi vì object không tồn tại dưới dạng Admin-manageable — đúng "Nếu chưa: Ghi rõ. Không sửa ngoài phạm vi Sprint". Không tự chuyển `ecosystems.ts` sang `useCollection`/Supabase trong Sprint này — cùng lý do đã áp dụng cho AI Workspace (AIWS-SPR-501): đây là thay đổi kiến trúc nền tảng (5 Ecosystem có 4 kiểu cấu trúc khác nhau, dữ liệu lồng nhau sâu — SubProject/Field/AffiliateOffer/ExchangeLink), vượt phạm vi 1 sprint Implementation và thuộc quyết định Blueprint.

---

## Task 2 — Workspace Structure

Rà soát 11 route: **0 Route dư, 0 Menu dư, 0 Placeholder** — cả 11 đều là CRUD/Dashboard/Report thật (không phải ComingSoon). Không có gì cần xoá.

**Đã sửa (an toàn, trong phạm vi):**
- Bọc cả 7 trang Admin thật (`page.tsx`, `projects`, `articles`, `links`, `categories`, `analytics`, `category/[key]`) trong `AdminWorkspaceShell` — trước Sprint này không trang nào dùng Shell chung, không có điều hướng chéo.
- **Xoá `viewHref` trỏ tới route đã khai tử** (`/portal/digital-assets/${slug}`) ở 2 nơi (`projects/page.tsx`, `category/[key]/page.tsx`) — nút "Xem trên Portal" trước đây đưa Founder tới URL chết; không có URL sống nào để thay vào (Consumer = 0 cho Project), nên bỏ nút thay vì trỏ sai. `viewHref` cho Article giữ nguyên (đã đúng, trỏ `/portal/duan-cohoi/bai-viet/${slug}`, xác nhận còn sống).

**Legacy đã đánh dấu, không tự xoá (Founder Directive):** route `/portal/digital-assets/**` (Portal, không phải Admin) — đã có comment code gốc xác nhận khai tử ("Rule #0"), 3 component Portal (`DigitalAssetProjectCard.tsx` + 3 page.tsx) chỉ tồn tại để phục vụ route chết này. Không đủ thẩm quyền Sprint này để xoá code Portal (ngoài phạm vi "Projects & Opportunities Admin Workspace") — chỉ ghi nhận.

---

## Files Changed

**Mới:**
- `src/lib/admin/digitalAssets/navigation.ts` — `DIGITAL_ASSETS_WORKSPACE_SECTIONS`, khớp 1:1 11 mục `nav.ts`.
- `docs/admin/PROJECTS_WORKSPACE_MANAGEMENT_PROJECTS-SPR-601.md` (file này, mới).

**Sửa:**
- `src/app/admin/(dashboard)/digital-assets/page.tsx` — bọc `AdminWorkspaceShell`, thêm bảng Portal Mapping (Task 1) đối chiếu 10 object.
- `src/app/admin/(dashboard)/digital-assets/{projects,articles,links,categories,analytics,category/[key]}/page.tsx` — bọc `AdminWorkspaceShell`, thêm ghi chú Consumer thật/Consumer=0 vào mô tả trang; xoá `viewHref` chết ở `projects/page.tsx` và `category/[key]/page.tsx`.
- `src/lib/admin/portal/sectionRegistry.ts` — đính chính 7 Section thật cho `page_duan_cohoi` (trước chỉ có 2, thiếu 5).
- `src/lib/admin/portal/contentBlockRegistry.ts` — đính chính 7 Content Block tương ứng, ghi rõ nguồn hardcode + trạng thái CRUD từng mục.
- `src/lib/admin/workspaceOwnership.ts` — entry `projects-opportunities`: sửa `owns` từ tuyên bố sai (sở hữu 5 Ecosystem) thành mô tả chính xác (CRUD thật cho Category/Project/Link/Article/Settings, không sở hữu Ecosystem).

## Verification

- [x] `npm run lint` — sạch (0 lỗi, 5 warning `<img>` không liên quan, có từ trước)
- [x] `npx tsc --noEmit` — sạch
- [x] `npm run build` — thành công, xác nhận cả 7 route `/admin/digital-assets/*` build đúng
- [x] `npm run test` — 139/139 pass

## Acceptance Self-check (trung thực)

| Tiêu chí | Trạng thái |
|---|---|
| ✓ Workspace bám đúng Portal hiện tại | ⚠️ **Đạt phần lớn** — Admin CRUD bám đúng `digitalAssets.ts`, nhưng KHÔNG bám được khái niệm "Ecosystem" mà Founder thấy trên `/portal/duan-cohoi` (0% CRUD, ghi rõ) |
| ✓ Không tạo dữ liệu giả | ✅ **Đạt** |
| ✓ Không tạo CRUD giả | ✅ **Đạt** — không xây CRUD mới cho Ecosystem (đúng Founder Directive) |
| ✓ Không chồng chéo với CKOS | ✅ **Đạt** |
| ✓ Không chồng chéo với Academy | ✅ **Đạt** |
| ✓ Không chồng chéo với Premium | ✅ **Đạt** |
| ✓ Founder quản lý bằng dữ liệu | ⚠️ **Đạt một phần** — Project/Category/Article/Link/Settings quản lý được bằng dữ liệu (0 code), nhưng Project/Link/Settings Consumer = 0 và Article không thể khám phá từ Ecosystem; CTA/FAQ không tồn tại dưới dạng Admin-manageable — ghi rõ, không che giấu |
| ✓ Build thành công | ✅ **Đạt** |
| ✓ Tests pass | ✅ **Đạt** (139/139) |

Không merge. Không deploy Production. Chờ PMO review.
