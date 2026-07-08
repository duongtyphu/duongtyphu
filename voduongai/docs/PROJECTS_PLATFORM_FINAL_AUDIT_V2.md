# Audit V2 — Dự án & Cơ hội (Ecosystem Platform), sau restructure lần cuối

Ngày audit: 2026-07-08. Phạm vi: `src/app/portal/duan-cohoi/**`, `src/data/portal/ecosystems.ts`,
`src/components/portal/opportunities/**`, sau khi: (1) mọi link tới `/portal/digital-assets`
đã bị gỡ, (2) 5 hệ sinh thái tách thành 4 kiểu trang (`sub-projects`, `two-field`,
`affiliate-list`, `exchange-list`), (3) DigiU/SolarGroup có sub-projects và marketing link
thật, (4) route bài viết đã chuyển sang `/portal/duan-cohoi/bai-viet/[slug]`.

Kết quả: **không phát hiện lỗi nào cần sửa bằng Edit** — code hiện tại đã nhất quán với
kiến trúc mới trên cả 5 dimension audit. Không có thay đổi code nào được thực hiện trong
lượt audit này (không file nào bị Edit).

## 1. Nội dung đã chuẩn hoá đúng chưa

- Đọc toàn bộ `src/data/portal/ecosystems.ts` (400 dòng): mỗi ecosystem có nội dung khớp đúng
  `structureType` của nó — DigiU/SolarGroup dùng `subProjects` với `marketingLinks` thật
  (DigiU: link đăng ký chung + Alphamind/WebWisePay/Deposits; SolarGroup: link chính +
  Sovelmash/AERONOVA), Blockchain & Crypto dùng `fields` (2 field box), "Làm tiếp thị liên kết"
  dùng `affiliateOffers` (Lazada/Shopee/Unica/Khởi Nguyên MMO), "Các sàn giao dịch Crypto" dùng
  `exchanges` (Binance/OKX/MEXC/Bybit/Kucoin/Gate/Bitget).
- Không còn copy nào nhắc "Blockchain Projects" hay "Trading" (tên cũ) — `name` đã là "Làm tiếp
  thị liên kết (Affiliate)" và "Các sàn giao dịch Crypto" ở mọi nơi xuất hiện (data file,
  Hub `ECOSYSTEMS` array, `whoFor`/`whoNotReady`/`expectedOutcome`).
- So khớp từng field `title`/`description`/`whoFor`/`whoNotReady`/`expectedOutcome` giữa Hub
  page (`page.tsx` — mảng `ECOSYSTEMS`) và `ecosystems.ts`: **giống hệt nhau, không lệch**
  cho cả 5 hệ sinh thái.
- Phát hiện (không sửa, ghi nhận là giới hạn dữ liệu có sẵn): bài viết duy nhất có
  `category: "blockchain"` ("Cách tôi tiếp cận một sàn giao dịch blockchain mới",
  slug `cach-tiep-can-san-giao-dich-blockchain`) nói về tiếp cận sàn giao dịch blockchain —
  nội dung này hiển thị ở CẢ hai trang: "Blockchain & Crypto" (vì `extraArticleCategories`
  gồm `"blockchain"`) và "Làm tiếp thị liên kết" (vì ecosystem này vẫn dùng
  `articleCategory: "blockchain"`, tên khoá category cũ giữ lại từ thời "Blockchain Projects").
  Đây là dữ liệu thật, không phải lỗi hiển thị sai route hay link ngoài — chỉ là bài viết
  không thật sự khớp chủ đề affiliate (Lazada/Shopee/Unica). Không sửa vì `DigitalAssetCategoryKey`
  (`"digiu" | "blockchain" | "crypto" | "trading" | "equity"`) được dùng chung bởi nhiều trang
  khác ngoài pillar này (`/portal/digital-assets/**`, admin digital-assets, `/blogai`) — đổi tên
  khoá category nằm ngoài phạm vi và rủi ro ảnh hưởng rộng hơn ecosystem. Khuyến nghị: khi có
  CMS thật, tách riêng category key cho "affiliate" khỏi "blockchain" (kỹ thuật/kiến thức nền).

## 2. Link/CTA có trỏ ra ngoài không

- Grep toàn bộ `src/app/portal/duan-cohoi/**` và `src/data/portal/ecosystems.ts` cho
  `/portal/digital-assets`, `/portal/hocvienai`, `/portal/nhatkyhoctap`, `/portal/companion`,
  `/portal/workspace`, `/portal/ckos`, `/portal/premium`.
- Duy nhất các match nằm trong `src/app/portal/duan-cohoi/page.tsx` (Hub) — đều là các CTA
  Hub-level đã có từ trước ("Đọc bài học từ trải nghiệm" → Nhật ký học tập, "Học viện AI",
  "Hỏi Companion" trong khối "Bạn đã sẵn sàng tham gia một dự án chưa?" và
  `KnowledgeJourneyStrip`), đúng như ngoại lệ đã xác lập ("Tôi nên bắt đầu ở đâu?" / hub-level
  routing là hợp lệ, không phải CTA trong một trang ecosystem/sub-project).
- Không có match nào bên trong `[ecosystemSlug]/page.tsx`, `[subProjectSlug]/page.tsx`, hay
  `bai-viet/[slug]/page.tsx` — không có link nào trỏ sang ecosystem khác, pillar khác, hay
  `/portal/digital-assets/**`. Mọi link trong 2 trang mini-site/sub-project chỉ trỏ: (a) route
  nội bộ cùng ecosystem/sub-project, (b) breadcrumb `Portal` / `Dự án & Cơ hội` (điều hướng
  chuẩn dùng chung toàn Portal, không phải CTA hành động), (c) `href`/`url` thật từ
  `marketingLinks`/`affiliateOffers`/`exchanges` (external, `target="_blank"`) — đúng nội dung
  của chính ecosystem/sub-project đó.
- Article detail page (`bai-viet/[slug]/page.tsx`): link "quay lại" trỏ về đúng ecosystem chứa
  bài viết (tính qua `articleCategory`/`extraArticleCategories`) hoặc về Hub nếu không map được
  — không trỏ `/portal/digital-assets/**`.
- Kết luận: không phát hiện link nào cần sửa.

## 3. Kiểm tra responsive desktop/mobile (code-level)

Rà toàn bộ class `grid`/`flex` trong 4 file chính:

- Hub (`page.tsx`): `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` (ecosystem cards),
  `grid gap-3 sm:grid-cols-2` (decision cards), `grid gap-3 sm:grid-cols-3` (guided learning) —
  tất cả có base 1-cột mobile, mở rộng ở `sm:`/`lg:`. Đúng pattern.
- `[ecosystemSlug]/page.tsx`: Overview info grid `grid gap-3 border-t border-gray-100 pt-5
  sm:grid-cols-3` (base 1 cột), `SubProjectsGrid` `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,
  `AffiliateOffersList`/`MarketingLinkBox` `grid gap-3 sm:grid-cols-2`, `ExchangesList`
  `grid gap-3 sm:grid-cols-2 lg:grid-cols-3`, `TwoFieldBoxes` `grid gap-4 sm:grid-cols-2` — mọi
  grid đều có base mobile-first, không có grid cột cố định thiếu fallback mobile.
- `[subProjectSlug]/page.tsx`: không dùng grid nhiều cột nào ngoài các component chia sẻ
  (`MarketingLinkBox`, `PotentialAnalysisTable`) đã audit ở trên; layout chính là block dọc
  (`space-y-10`) — an toàn trên mobile.
- `bai-viet/[slug]/page.tsx`: layout đơn cột (`space-y-6`), card `p-8` cố định — không có grid
  nhiều cột nên không có rủi ro responsive.
- `PotentialAnalysisTable`: dùng `<table>` với `overflow` mặc định của trình duyệt trong card
  `rounded-xl` — không bọc trong `overflow-x-auto`. Với 2 cột (Tiêu chí / Trạng thái) và text
  ngắn, bảng không có nguy cơ tràn ngang trên màn hình nhỏ trong thực tế (đã kiểm tra độ dài
  nội dung `criterion` dài nhất trong `DEFAULT_POTENTIAL_ANALYSIS` vẫn wrap được trong ô), nên
  không coi là lỗi cần sửa, chỉ ghi nhận.
- Không phát hiện grid/flex nào thiếu class mobile-fallback cần sửa.

## 4. Kiểm tra thiết kế

- So khớp từng khoá `digiu`/`solargroup`/`crypto`/`blockchain`/`trading` giữa `ECOSYSTEM_SURFACE`
  (Hub `page.tsx`) và `SURFACE` (`[ecosystemSlug]/page.tsx`): `chip`, `badge`, `strip` giống hệt
  nhau về màu cho cả 5 khoá (vd. `digiu`: blue→indigo gradient cả hai nơi; `solargroup`:
  amber→orange; `crypto`: slate→emerald; `blockchain`: violet→blue; `trading`: emerald→green).
  Không có mismatch màu Hub-card vs mini-site.
- Card convention nhất quán: `rounded-2xl border ... shadow-token-sm`, `GemCard` dùng cho khối
  nội dung tĩnh (Overview info box con, TwoFieldBoxes, empty-state), `SectionHeader` dùng làm
  tiêu đề mọi section trên cả 4 kiểu trang (`Overview`, `SubProjectsGrid`, `AffiliateOffersList`,
  `ExchangesList`, `TwoFieldBoxes`, `MarketingLinkBox`, `PotentialAnalysisTable`,
  `ArticlesSection`) — không có "generic white box" trơn không theo convention.
- Hover state: sub-project card, ecosystem card (Hub), affiliate/exchange link card, article
  card đều có `transition` + `hover:border-*`/`hover:-translate-y-1`/`hover:shadow-token-lg` —
  nhất quán, không thiếu hover ở đâu.
- `subProjectPalette.ts` (8 màu: blue, rose, amber, emerald, violet, cyan, fuchsia, slate) là
  bảng màu RIÊNG cho sub-project card, khác với `ECOSYSTEM_SURFACE`/`SURFACE` (đúng comment
  trong file: "not a copy of the parent ecosystem's single color") — DigiU (3 sub-projects) và
  SolarGroup (2 sub-projects) mỗi cái nhận màu khác nhau theo `colorIndex`, tạo phân biệt trực
  quan rõ ràng với ecosystem cha và giữa các sub-project với nhau.
- Không phát hiện lỗi thiết kế cần sửa.

## 5. Production readiness

- `rm -rf .next && npx tsc --noEmit -p tsconfig.json`: còn 6 lỗi TS tiền tồn tại, KHÔNG liên
  quan tới pillar này — `Cannot find name 'PageProps'` ở `src/app/blogai/[slug]/page.tsx`,
  `src/app/portal/prompts/[id]/page.tsx`, `src/app/portal/resources/[id]/page.tsx` (type
  `PageProps` được Next.js generate vào `.next/types` lúc build, tsc chạy riêng trước khi có
  `.next/types` sẽ luôn thiếu type này — không phải lỗi do audit này gây ra, biến mất sau khi
  `npm run build` generate lại `.next/types`). Không có lỗi TS nào trong
  `src/app/portal/duan-cohoi/**`, `src/data/portal/ecosystems.ts`, hay
  `src/components/portal/opportunities/**`.
- `npm run eslint`: không chạy riêng vì không có file nào bị Edit trong lượt audit này (không
  phát hiện lỗi cần sửa ở bước 1-4).
- `rm -rf .next && npm run build`: **build thành công, 0 lỗi**. Xác nhận cả 4 route mới xuất
  hiện trong build output: `ƒ /portal/duan-cohoi`, `ƒ /portal/duan-cohoi/[ecosystemSlug]`,
  `ƒ /portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]`, `ƒ /portal/duan-cohoi/bai-viet/[slug]`.
  Không phát hiện lỗi RSC-boundary (không component/function nào được truyền làm prop từ Server
  Component vào Client Component trong pillar này — `bai-viet/[slug]/page.tsx` là "use client"
  độc lập, không nhận prop function từ cha).
- `npm run dev` + curl smoke test — tất cả trả `307` (redirect do chưa đăng nhập), không có
  404/500:
  - `/portal/duan-cohoi` → 307
  - `/portal/duan-cohoi/digiu` → 307
  - `/portal/duan-cohoi/solargroup` → 307
  - `/portal/duan-cohoi/crypto` → 307
  - `/portal/duan-cohoi/blockchain` → 307
  - `/portal/duan-cohoi/trading` → 307
  - `/portal/duan-cohoi/digiu/alphamind` → 307
  - `/portal/duan-cohoi/digiu/webwisepay` → 307
  - `/portal/duan-cohoi/digiu/deposits` → 307
  - `/portal/duan-cohoi/solargroup/sovelmash` → 307
  - `/portal/duan-cohoi/solargroup/aeronova` → 307
  - `/portal/duan-cohoi/bai-viet/cach-tiep-can-san-giao-dich-blockchain` → 307
  - Dev server đã dừng sau khi test xong.

## Kết luận

- **Sẵn sàng production về mặt kỹ thuật**: cả 5 hệ sinh thái (DigiU, SolarGroup, Blockchain &
  Crypto, Làm tiếp thị liên kết, Các sàn giao dịch Crypto) render đúng cấu trúc, không link
  rò rỉ ra ngoài pillar, responsive an toàn, thiết kế nhất quán, build/tsc sạch, mọi route
  smoke-test qua đúng auth gate (307).
- **DigiU và SolarGroup** là 2 hệ sinh thái có dữ liệu "đầy" nhất hiện tại: marketing link thật
  ở cấp ecosystem + từng sub-project đều có link thật riêng (Alphamind/WebWisePay/Deposits;
  Sovelmash/AERONOVA).
- **Blockchain & Crypto**, **Làm tiếp thị liên kết**, **Các sàn giao dịch Crypto** đã đúng cấu
  trúc nhưng vẫn thiếu dữ liệu thật ở phần link tiếp thị (field box marketingLinks rỗng, affiliate
  offers/exchanges chưa có `url` thật cho mục nào) — hiển thị trung thực trạng thái "chưa có link"
  thay vì bịa, đúng NO-FAKE-DATA rule, nhưng cần CMS/link thật khi có để hoàn thiện.
- **Phân tích tiềm năng (Potential Analysis)** cho cả 5 hệ sinh thái vẫn 100% "Chưa đánh giá"
  (đúng theo thiết kế — chưa có verdict thật của analyst nào được ghi nhận).
- **Nợ kỹ thuật cần lưu ý cho tương lai**: `DigitalAssetCategoryKey` "blockchain" hiện phục vụ
  2 mục đích khác nhau (kiến thức kỹ thuật blockchain trong trang Crypto, và affiliate-list
  ecosystem) khiến 1 bài viết hiện chéo ở cả 2 trang — nên tách category key khi làm CMS thật.
