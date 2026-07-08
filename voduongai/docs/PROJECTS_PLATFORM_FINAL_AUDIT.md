# Projects & Opportunities — Ecosystem Platform Final Audit (Portal 4.0)

Scope: `/portal/duan-cohoi` (Hub) + `/portal/duan-cohoi/[ecosystemSlug]`
(mini-site template), against `docs/PROJECT_ECOSYSTEM_ARCHITECTURE.md`,
`docs/PROJECT_CMS_ARCHITECTURE.md`, `docs/PROJECT_PLATFORM_BUSINESS_ARCHITECTURE.md`.
This is the final production-readiness pass before the pillar is considered
done and the team moves to Premium.

## Vấn đề đã phát hiện

Đây là audit toàn diện của phần rebuild "Ecosystem Platform" — không phải audit
lần đầu. Kết quả: **không phát hiện lỗi cần sửa trong code hiện tại.**

Cụ thể đã kiểm tra và xác nhận KHÔNG có vấn đề ở các điểm sau (trước đây từng
là lỗi ở bản list-page cũ, theo `docs/PROJECTS_FINAL_AUDIT.md` và
`docs/PROJECTS_PRODUCTION_RECONSTRUCTION.md`, nhưng đã được khắc phục đúng như
kiến trúc `PROJECT_ECOSYSTEM_ARCHITECTURE.md` yêu cầu):

- Hub card `href` (`src/app/portal/duan-cohoi/page.tsx` dòng 31/43/55/67/79)
  đã trỏ đúng `/portal/duan-cohoi/{slug}` cho cả 5 ecosystem — không còn trỏ
  vào `/portal/digital-assets/category/*` (lỗi khái niệm mà tài liệu kiến trúc
  đặt ra để sửa).
- Primary CTA của mỗi mini-site (`ecosystems.ts` → `ctas[].url`) trỏ vào
  `/portal/digital-assets/category/{slug}` — đây KHÔNG phải lỗi tái diễn: kiến
  trúc §1 cho phép mini-site tham chiếu chéo sang `digital-assets` như một
  nguồn "reference, don't duplicate", miễn Hub card không còn trỏ thẳng vào đó
  nữa (mục đích chính của tài liệu). Đã grep toàn bộ `src/` — không còn tham
  chiếu `digital-assets/category` nào khác ngoài (a) 5 CTA trên, có chủ đích,
  và (b) `src/lib/admin/nav.ts` + `AdminSidebar.tsx`, thuộc khu vực Admin quản
  lý pillar "Đầu tư cùng tôi" khác, ngoài phạm vi audit này.
- Các trang khác trong Portal trỏ về Projects (Home `portal/page.tsx`, Footer,
  sitemap, `PortalSidebar`, `hubs.ts`, Companion route-context,
  `module-agent-map.ts`, `blog.ts`, `prompts.ts`, `resources.ts`, `ckos/page.tsx`,
  `hanhtrinhcuatoi/page.tsx`, `WorkspaceMvp.tsx`, `PortalPreview.tsx`) đều trỏ
  vào `/portal/duan-cohoi` (Hub) — route hợp lệ, không cần sửa.
- Dữ liệu `whoFor`/`whoNotReady`/`learnFirst`/`expectedOutcome` giữa Hub's
  `ECOSYSTEMS` array và `ecosystems.ts` (nguồn CMS tương lai) khớp nhau cho cả
  5 ecosystem, chỉ khác nhau ở cách diễn đạt phù hợp ngữ cảnh (vd. Hub dùng "ở
  trên" vì card Blockchain nằm sau card Crypto trong cùng danh sách; mini-site
  Blockchain không cần cụm này vì đứng độc lập) — không phải drift mâu thuẫn,
  không cần hợp nhất.
- `resolveCtas()` (`ecosystems.ts`) enforce đúng quy tắc chỉ 1 CTA primary;
  cả 5 ecosystem trong data hiện tại chỉ khai báo đúng 1 `role: "primary"`.
- `companionMessage()` (`[ecosystemSlug]/page.tsx`) có 5 nhánh riêng biệt theo
  slug, đều nội suy từ field thật (`fullIntro`/`whoFor`/`whoNotReady`/
  `learnFirst`/`expectedOutcome`), không câu nào lặp lại nguyên văn câu
  Companion của Hub ("Trước khi bấm vào bất kỳ hệ sinh thái nào ở trên...");
  không câu nào mang giọng bán hàng/FOMO.
- 7 section render đúng thứ tự cố định; Video omit khi null; Products luôn
  hiện với dòng honest-empty khi rỗng; Resources omit khi rỗng; Articles đọc
  đúng từ `digitalAssetArticles` lọc theo `articleCategory` + `status ===
  "Published"`.
- `SURFACE` map trong mini-site khớp chính xác màu với `ECOSYSTEM_SURFACE` map
  của Hub cho cả 5 slug — không có "generic white card" nào, mọi section dùng
  `GemCard` (`gemos-gem-card`) có styling thương hiệu.
- Empty-state Products giải thích rõ lý do (chưa có nội dung thật đủ chi tiết)
  và bước tiếp theo trung thực (sẽ cập nhật khi có, không dựng nội dung tạm).
- Class Tailwind responsive (`grid-cols-1` mặc định → `sm:grid-cols-2/3` →
  `lg:grid-cols-3`, `flex-col` → `sm:flex-row`) trong mini-site khớp đúng quy
  ước đã dùng ở Hub — kiểm tra ở mức code, không phải visual/screenshot vì bị
  chặn bởi auth.

**Một điểm ngoài phạm vi, không thuộc trách nhiệm của lần audit này** nhưng
đáng ghi nhận: `src/data/digitalAssets.ts` (pillar "Đầu tư cùng tôi" — khác
pillar Ecosystem đang audit) có các trường `clickCount`/`clicksByCategory`/
`engagementScore` mang số liệu minh họa (không phải dữ liệu thật). Đây thuộc
phạm vi pillar `digital-assets`, không phải Ecosystem Platform, nên không sửa
trong lần audit này — nêu ra để đội ngũ cân nhắc một audit riêng cho pillar đó.

## Vấn đề đã sửa

Không có thay đổi code nào được thực hiện — audit không tìm thấy lỗi cần fix.
Toàn bộ 8 tiêu chí audit (route/link, nội dung theo ecosystem, cấu trúc
template, CTA/affiliate, Companion, nhận diện hình ảnh, empty state, production
readiness) đều đạt yêu cầu ở trạng thái hiện tại của code.

## Route/link/CTA đã chuẩn hóa

Đã xác nhận (không cần sửa) toàn bộ các route sau đều resolve đúng và không có
liên kết chết:

- `/portal/duan-cohoi` (Hub)
- `/portal/duan-cohoi/{digiu|solargroup|crypto|blockchain|trading}` (5
  mini-site)
- Mọi CTA primary/secondary của cả 5 ecosystem (nội bộ Portal hoặc
  `digital-assets/category/*` có chủ đích)
- Breadcrumb: `Portal → Dự án & Cơ hội → {tên ecosystem}`
- "Nên học trước" link cho cả 5 ecosystem (một số trỏ nội bộ, một số trỏ chéo
  sang ecosystem khác — vd. Blockchain → Crypto)
- Dải CTA lặp lại ở cuối trang + link "← Về Dự án & Cơ hội"

## Ecosystem nào đã production candidate

Đánh giá riêng từng ecosystem (cùng một template, nhưng độ "đầy" nội dung khác
nhau — đúng như kiến trúc dự liệu ở §12 "uneven content richness"):

- **DigiU** — production candidate đầy đủ nhất: Overview/CTA/FAQ (2 câu) đều
  có nội dung thật, thẳng thắn về lý do Products/Video còn trống.
- **SolarGroup** — production candidate: nội dung nghiên cứu trung thực, FAQ
  giải thích rõ vì sao trạng thái vẫn "Đang nghiên cứu".
- **Blockchain & Crypto** — production candidate: có bài học thật từ sai lầm,
  giọng điệu khách quan.
- **Blockchain Projects** — production candidate, nhưng là ecosystem "mỏng"
  nhất về FAQ (chỉ 1 câu) — vẫn hợp lệ vì FAQ là optional, không phải thiếu sót.
- **Trading** — production candidate: nội dung nhấn mạnh kỷ luật/rủi ro, không
  cam kết lợi nhuận.

Cả 5 đều KHÔNG có Video/Products/Resources thật — đây là honest-empty theo
đúng thiết kế, không phải lỗi cần chặn production.

## Phần nào còn chờ Admin/CMS thật

Theo đúng ranh giới `docs/PROJECT_CMS_ARCHITECTURE.md` đã đóng băng (admin/CRUD
chưa được xây trong giai đoạn này):

- Không có admin form để thêm Product/Article/FAQ/Resource/CTA theo ecosystem
  — mọi thay đổi nội dung hiện tại đòi hỏi sửa trực tiếp
  `src/data/portal/ecosystems.ts`.
- `video`, `products`, `resources` hiện là mảng/rỗng thật (không phải giả) cho
  cả 5 ecosystem — cần nội dung thật (video giới thiệu, danh sách sản phẩm con,
  tài liệu) trước khi các section này có gì để hiển thị; không được điền giả
  để "trông đầy đủ hơn."
- `iconKind: "Affiliate"` đã khai báo trong type nhưng chưa có CTA thật nào
  dùng — đúng như kỳ vọng của tài liệu (một link affiliate thật cần được thêm
  khi có, không dựng link giả trước).
- Thêm ecosystem thứ 6 vẫn cần thao tác sửa file `ecosystems.ts` trực tiếp (do
  admin UI chưa tồn tại) — không phải "chỉ cần tạo CMS entry" như tài liệu
  kiến trúc mô tả cho tương lai.

## Kiểm tra production

- `npx tsc --noEmit -p tsconfig.json` — sạch, không lỗi.
- `npx eslint` trên các file thuộc phạm vi audit — sạch, không lỗi/cảnh báo.
- `rm -rf .next && npm run build` — build thành công, cả `/portal/duan-cohoi`
  và `/portal/duan-cohoi/[ecosystemSlug]` đều xuất hiện trong route map, không
  lỗi RSC-boundary.
- `npm run dev` + `curl` cho cả 6 route (`/portal/duan-cohoi` + 5 slug) đều trả
  về `307` (redirect `/login`, đúng do auth-gate) — không có `404`/`500`. Dev
  server đã dừng sau khi kiểm tra xong.
