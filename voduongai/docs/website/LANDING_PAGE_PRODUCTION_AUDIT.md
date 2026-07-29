# Audit toàn diện Landing Page VO DUONG AI — Tiêu chuẩn Production

**Phạm vi:** `src/app/page.tsx` + toàn bộ `src/components/home/**` (Hero,
EcosystemPillars, PortalPreview, QuizAssessment, SkillsShowcase, ToolsIUse,
TrustStats, Ecosystem, FinalCTA) + chrome dùng chung của route `/`
(`layout.tsx`, `Header`/`HeaderClient`, `Footer`, `ChromeGate`,
`MobileNavDrawer`, `ThemeToggleButton`, `BackToTop`, `LandingThemeProvider`)
+ cấu hình kỹ thuật liên quan (`next.config.ts`, `sitemap.ts`, `robots.ts`,
`site-settings.ts`).

**Phương pháp:** đọc toàn bộ source code liên quan (không suy đoán), chạy
`tsc --noEmit`, `eslint`, kiểm tra runtime thật qua `next dev` + Playwright
(kiểm tra overflow ngang ở 4 viewport × 2 theme, bắt lỗi console/network
thật, chụp ảnh Hero). Mỗi issue dưới đây đều có căn cứ trực tiếp trong code
hoặc kết quả kiểm thử — không có đề xuất mang tính "có thể đẹp hơn" chung
chung.

**Không redesign** — báo cáo này chỉ liệt kê lỗi, rủi ro và cơ hội cải
thiện đã có căn cứ rõ ràng. Không đề xuất đổi bố cục/thiết kế nếu không có
lý do UX/Accessibility/SEO/Performance/Conversion cụ thể.

---

## 1. Executive Summary

Trang landing hiện tại có nền tảng kỹ thuật **sạch và vững**: `tsc`/`eslint`
không có lỗi, `next build` thành công, không phát hiện tràn ngang
(horizontal overflow) ở bất kỳ breakpoint nào trong 4 viewport đã test
(375/414/768/1440px, cả 2 theme), hệ theme sáng/tối được xây đúng cách
(đọc cookie ở Server Component nên không có hiện tượng nháy sai theme khi
tải trang), có skip-link truy cập nhanh tới nội dung chính, và phần lớn
animation đã tôn trọng `prefers-reduced-motion`.

Tuy nhiên, có 3 vấn đề mức **P1 (Critical)** cần xử lý trước khi đẩy mạnh
traffic/quảng cáo: (1) **thiếu ảnh Open Graph/Twitter Card** — mọi link
chia sẻ trang này qua Zalo/Facebook/Messenger (kênh chia sẻ chính của đối
tượng người dùng Việt Nam mà site đang nhắm tới) sẽ không hiện ảnh xem
trước, giảm tỷ lệ click; (2) nội dung chuyển động tự động liên tục (băng
chạy công cụ AI, bong bóng câu hỏi trong Hero) không có cách nào để người
dùng bàn phím/chạm dừng lại, chỉ dừng khi rê chuột; (3) nhiều đoạn chữ dùng
độ mờ trắng rất thấp (`text-white/30`, `/40`, `/50`) trên nền tối, có nguy
cơ không đạt chuẩn tương phản WCAG AA.

Ngoài ra có khoảng 10 vấn đề mức **P2 (Important)** — chủ yếu về SEO
(sitemap thiếu bài Blog AI do Admin đăng, robots.txt không khớp đúng chính
sách "toàn bộ /portal yêu cầu đăng nhập" mà chính `sitemap.ts` đã ghi chú,
route `/landing-preview` đã xoá nhưng chưa có redirect), hiệu năng (ảnh
icon yêu cầu độ phân giải 400×400 cho khung hiển thị 38-77px, ảnh nguồn
`founder.png` nặng gần 2MB), và một vài rủi ro nội dung/UX cụ thể.

Không phát hiện lỗi mức **P0 (Production Blocker)** nào — trang có thể lên
production, nhưng nên xử lý các mục P1 trước khi chạy chiến dịch quảng cáo/
truyền thông lớn vì chúng ảnh hưởng trực tiếp tới chuyển đổi và khả năng
tiếp cận.

---

## 2. Production Readiness Score: **7.5 / 10**

| Hạng mục | Điểm (/10) | Ghi chú ngắn |
|---|---|---|
| UI/UX | 8 | Rõ ràng, nhất quán; 1 rủi ro về thumbnail video không có fallback |
| Visual Design | 8.5 | Theme sáng/tối đồng bộ tốt sau các đợt sửa trước; card pattern nhất quán |
| Responsive | 8 | Không tràn ngang ở mọi breakpoint đã test; 1 rủi ro badge bị cắt ở tablet nhỏ |
| Accessibility | 6 | Skip-link + `prefers-reduced-motion` tốt, nhưng thiếu kiểm soát dừng animation tự động + rủi ro tương phản |
| SEO | 6 | Thiếu OG/Twitter image, sitemap thiếu bài Blog AI động, robots.txt lệch với chính sách đã ghi |
| Performance | 7 | Kỹ thuật ổn (build sạch, lazy video facade) nhưng vài ảnh chưa tối ưu kích thước |
| Content | 7 | Vài số liệu marketing chưa có nguồn dẫn chứng rõ ràng |
| Brand Consistency | 8 | Logo/màu/CTA đã đồng bộ tốt qua nhiều đợt sửa; thông điệp tagline hơi phân mảnh |
| Technical | 8.5 | `tsc`/`eslint`/`build` sạch; 1 route đã xoá thiếu redirect |
| Conversion | 7.5 | CTA nhất quán trỏ `/login`; thiếu tín hiệu phân biệt lần đầu ghé thăm |

**Điểm tổng (trung bình có trọng số theo mức độ ảnh hưởng production):
7.5/10.**

---

## 3. Danh sách Issues

### P1 — Critical

**P1-01 — Thiếu ảnh Open Graph / Twitter Card cho toàn site**
- **Category:** SEO / Conversion
- **File:** `src/app/layout.tsx` (hàm `generateMetadata()`, khối
  `openGraph`/`twitter`)
- **Mô tả:** `openGraph` chỉ có `type/locale/url/siteName/title/description`,
  `twitter` chỉ có `card: "summary_large_image"` + `title/description` —
  **không có field `images`** ở cả 2 khối. `card: "summary_large_image"`
  yêu cầu bắt buộc phải có ảnh để hiển thị đúng loại thẻ; thiếu ảnh, X/
  Twitter sẽ fallback về thẻ không ảnh, còn Facebook/Zalo/Messenger (kênh
  chia sẻ chính của đối tượng người dùng Việt) sẽ không hiện preview card
  nào, chỉ hiện link trần.
- **Recommendation:** Bổ sung 1 ảnh OG chuẩn (khuyến nghị 1200×630px) —
  thêm `images: [{ url, width: 1200, height: 630, alt }]` vào cả `openGraph`
  và `twitter` trong `generateMetadata()`. Có thể lấy từ `settings` (thêm
  field `ogImageUrl` vào `SiteSettings`) để Admin tự thay được, hoặc dùng
  1 file tĩnh trong `public/` làm mặc định trước mắt.

**P1-02 — Nội dung chuyển động tự động không có cách dừng cho bàn phím/cảm ứng (WCAG 2.2.2)**
- **Category:** Accessibility
- **File:** `src/components/home/ToolsIUse.tsx` (`.tools-marquee-track`,
  `globals.css` dòng ~2492-2514), `src/components/home/HeroQuestionBubbles.tsx`
- **Mô tả:** Băng chạy logo công cụ AI (`ToolsIUse`) chạy animation CSS
  liên tục (`animation: tools-marquee-scroll 50s linear infinite`), chỉ
  dừng khi `:hover` (dòng 2504) — người dùng chỉ dùng bàn phím hoặc thiết
  bị cảm ứng (không có "hover") không có cách nào dừng/tạm dừng chuyển
  động này, vi phạm WCAG 2.2.2 (Pause, Stop, Hide) vì nội dung chuyển động
  tự động, kéo dài liên tục >5 giây, hiển thị song song nội dung khác.
  Tương tự, các bong bóng câu hỏi trong lõi Hero (`HeroQuestionBubbles.tsx`)
  tự đổi nội dung liên tục vô thời hạn, không có nút dừng nào. Cả 2 đều đã
  tôn trọng `prefers-reduced-motion` (đúng, đáng ghi nhận) nhưng đó là cờ hệ
  điều hành người dùng phải tự bật trước — không thay thế được yêu cầu có 1
  cách dừng trực tiếp trên trang.
- **Recommendation:** Thêm nút/toggle "Tạm dừng" nhìn thấy được cho băng
  chạy công cụ (đơn giản nhất: 1 icon pause nhỏ góc băng chạy, set
  `animation-play-state: paused` khi bấm). Với `HeroQuestionBubbles`, có
  thể chấp nhận được nếu tổng thời gian hiển thị 1 câu đủ ngắn và nội dung
  không mang tính thao túng/cảnh báo, nhưng nếu muốn tuân thủ chặt WCAG,
  cần thêm cách tạm dừng tương tự.

**P1-03 — Nhiều đoạn chữ dùng độ mờ trắng thấp trên nền tối, rủi ro không đạt tương phản WCAG AA**
- **Category:** Accessibility
- **File:** nhiều nơi, ví dụ `QuizAssessment.tsx` (`text-white/40` dòng
  214/379/400, `text-white/30` dòng 338), `Footer.tsx` (`text-white/50`
  dòng 152/169/180/194), `TrustStats.tsx` (`text-[#9AA1C7]` dòng 166 trên
  nền `linear-gradient(120deg,#0B1140,#171154)`), `HeaderClient.tsx`
  không bị ảnh hưởng (dùng hex đặc)
- **Mô tả:** `text-white/40`/`text-white/30` tương đương xấp xỉ
  `rgba(255,255,255,0.3-0.4)` đặt trên nền navy+tím đậm (`#020817` →
  `#1B0B33`) — với opacity 30-40%, tỷ lệ tương phản với nền tối thường rơi
  vào khoảng 2.5:1–3.5:1, dưới ngưỡng 4.5:1 mà WCAG AA yêu cầu cho chữ
  thường (dưới 18px/24px không đậm). Đây là chữ mang thông tin thật (nhãn
  "Câu hỏi 1/4", "Chưa có dữ liệu", link điều hướng Footer) chứ không phải
  chữ trang trí thuần tuý, nên cần đạt chuẩn.
- **Recommendation:** Tăng độ mờ tối thiểu lên `/60`-`/70` cho mọi chữ
  mang thông tin (giữ `/30`-`/40` chỉ cho phần tử thuần trang trí không
  mang nghĩa), hoặc đo tương phản thực tế bằng công cụ (Chrome DevTools/
  axe) cho từng cặp màu trước khi quyết định giữ nguyên.

### P2 — Important

**P2-01 — Sitemap thiếu bài viết Blog AI do Admin đăng (chỉ liệt kê bài tĩnh)**
- **Category:** SEO
- **File:** `src/app/sitemap.ts`
- **Mô tả:** `sitemap.ts` chỉ `import { blogPosts } from "@/data/blog"` —
  mảng bài viết TĨNH. Theo kiến trúc dự án đã ghi trong `CLAUDE.md`
  ("Blog AI (`AI_ARTICLES` → bảng `blog` thật)"), `/blogai` và
  `/blogai/[slug]` còn đọc thêm bài viết ĐỘNG do Admin đăng qua
  `getLiveBlogPosts()`/`getLiveBlogPostBySlug()` (`src/lib/portal/live-blog.ts`).
  Những bài này công khai, có thể lập chỉ mục theo `robots.ts` (không nằm
  trong danh sách disallow) nhưng KHÔNG xuất hiện trong sitemap — Google
  vẫn có thể tìm thấy qua link nội bộ, nhưng chậm hơn và không được khai
  báo `lastModified` chính xác.
- **Recommendation:** `sitemap.ts` gọi thêm `getLiveBlogPosts()` (đã có
  sẵn, cùng file dùng ở `/blogai`), gộp slug động vào mảng `routes` cùng
  `blogPosts` tĩnh.

**P2-02 — `robots.txt` không khớp với chính sách "toàn bộ /portal yêu cầu đăng nhập" mà `sitemap.ts` tự ghi chú**
- **Category:** SEO / Technical
- **File:** `src/app/robots.ts`, đối chiếu comment trong `src/app/sitemap.ts`
- **Mô tả:** `sitemap.ts` có comment giải thích rõ: *"Every `/portal/*`
  route requires authentication... middleware redirects anonymous
  visitors, including crawlers, straight to `/login`... Listing them here
  would only get them indexed as redirects, wasting crawl budget."* — tức
  chính sách đã xác nhận là toàn bộ `/portal/*` không nên để crawler vào.
  Nhưng `robots.ts` chỉ disallow đúng `/portal/checkout` và
  `/portal/checkout/*`, để ngỏ toàn bộ phần còn lại của `/portal/*` (`/portal/hocvienai`,
  `/portal/aiworkspace`,...) — Googlebot vẫn sẽ thử crawl các URL này (nếu
  bị link tới từ đâu đó) và luôn nhận redirect 307 về `/login`, lãng phí
  crawl budget đúng như comment đã cảnh báo, chỉ là robots.txt chưa thực
  thi đúng ý định đó.
- **Recommendation:** Thêm `/portal/` (và `/portal/*`) vào `disallow` ở
  `robots.ts`, khớp đúng với lý do đã nêu trong `sitemap.ts`.

**P2-03 — Route `/landing-preview` đã xoá nhưng chưa có redirect**
- **Category:** SEO / Technical
- **File:** `next.config.ts` (`redirects()`)
- **Mô tả:** Route `/landing-preview` đã bị xoá hoàn toàn ở 1 đợt sửa
  trước trong chính phiên làm việc này (từng là 1 trang demo thiết kế thật,
  có thể đã được chia sẻ/bookmark/index trước khi xoá). `next.config.ts`
  hiện có danh sách redirect khá đầy đủ cho các route Portal đã đổi tên
  nhưng KHÔNG có entry nào cho `/landing-preview` — khách truy cập link cũ
  giờ nhận 404 trần thay vì được đưa về trang chủ.
- **Recommendation:** Thêm `{ source: "/landing-preview", destination: "/", permanent: true }`
  vào `redirects()`.

**P2-04 — Thumbnail video YouTube không có fallback khi `maxresdefault.jpg` không tồn tại**
- **Category:** Content / Performance
- **File:** `src/components/home/SkillsShowcase.tsx` (dòng 128-132)
- **Mô tả:** Ảnh đại diện video (trước khi bấm play) gọi thẳng
  `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg` qua `<img>`
  thường, không có `onError` fallback. YouTube chỉ tạo `maxresdefault.jpg`
  cho video upload đủ độ phân giải nguồn — nếu không tồn tại, YouTube trả
  về 1 ảnh xám placeholder 120×90 bị kéo giãn bởi `object-cover` thay vì
  báo lỗi rõ ràng, khiến khối video (nằm ngay cạnh nội dung "10 Kỹ năng AI
  cần có", vị trí khá nổi bật giữa trang) hiển thị mờ/vỡ hình mà không ai
  biết trừ khi kiểm tra kỹ.
- **Recommendation:** Fallback về `hqdefault.jpg` (luôn tồn tại với mọi
  video) khi `maxresdefault.jpg` lỗi, qua `onError` trên thẻ `<img>`.

**P2-05 — Ảnh icon nhỏ yêu cầu độ phân giải nguồn 400×400 nhưng không khai báo `sizes`**
- **Category:** Performance
- **File:** `EcosystemPillars.tsx`, `PortalPreview.tsx`, `TrustStats.tsx`,
  `ToolsIUse.tsx` — mọi `<Image>` icon (vd. `width={400} height={400}`
  hiển thị trong khung 38-77px)
- **Mô tả:** Các icon nhỏ (khung hiển thị 38px-77px) đều khai `width={400}
  height={400}` cho `next/image` nhưng không có prop `sizes` — Next.js tự
  sinh `srcset` dựa trên kích thước khai báo (400px) chứ không biết kích
  thước hiển thị thật, có thể phục vụ ảnh lớn hơn cần thiết nhiều lần trên
  các breakpoint rộng, tốn băng thông không cần thiết cho 1 trang có tới
  hàng chục icon cùng loại trên 1 màn hình (6 pillar + 5 roadmap step + 5
  feature + marquee 22 logo công cụ...).
- **Recommendation:** Thêm `sizes` khớp đúng kích thước hiển thị thật (vd.
  `sizes="77px"`) cho mọi icon nhỏ, hoặc giảm `width`/`height` khai báo
  xuống gần với kích thước hiển thị thực tế (vd. 96-128px thay vì 400px)
  để Next tối ưu đúng.

**P2-06 — Ảnh nguồn `founder.png` nặng gần 2MB, độ phân giải vượt xa nhu cầu hiển thị**
- **Category:** Performance
- **File:** `public/founder.png` (1.97MB, 1536×1024px), dùng ở
  `Ecosystem.tsx` trong khung `aspect-[3/1.9]` rộng khoảng 1 nửa card (tối
  đa ~500-600px ở desktop)
- **Mô tả:** `next/image` sẽ tự tối ưu khi phục vụ (resize theo viewport
  qua route `/_next/image`), nên người dùng cuối không tải nguyên 1.97MB —
  nhưng ảnh nguồn quá khổ vẫn là gánh nặng không cần thiết cho build/
  deploy, và là rủi ro nếu component này có lúc bị đổi sang phục vụ ảnh
  trực tiếp (bỏ qua `next/image`) trong tương lai.
- **Recommendation:** Nén lại `founder.png` xuống độ phân giải hợp lý (vd.
  1000×667px, đủ cho 2x DPI ở kích thước hiển thị lớn nhất) và định dạng
  nén tốt hơn (WebP/nén PNG mạnh hơn) — giảm được ước tính >80% dung lượng
  nguồn.

**P2-07 — Số liệu marketing chưa có nguồn dẫn chứng**
- **Category:** Content
- **File:** `Hero.tsx` (`floatingBadges`: "200+ Prompt AI", "50+ Công cụ
  AI", "100+ Tài nguyên"), `TrustStats.tsx` (dòng 10: "Hơn 10,000+ thành
  viên cùng học hỏi và hỗ trợ nhau mỗi ngày")
- **Mô tả:** Các con số này hiển thị như sự thật đã được xác nhận nhưng
  không liên kết tới bất kỳ nguồn dữ liệu động/thật nào trong code (khác
  hẳn nguyên tắc "không dữ liệu bịa" mà `CLAUDE.md` của dự án áp dụng rất
  nghiêm ngặt cho phần Portal/Admin) — đây là các hằng số string viết tay.
  Không nhất thiết là sai (có thể đúng thực tế), nhưng nếu số liệu không
  còn cập nhật hoặc không kiểm chứng được, đây là rủi ro uy tín thương
  hiệu khi bị người dùng/đối thủ đặt câu hỏi.
- **Recommendation:** Xác nhận với Founder các số liệu này còn đúng thực
  tế hay không; nếu có dữ liệu Supabase thật đo được (số học viên, số
  prompt trong thư viện...), cân nhắc nối số liệu động thay vì hardcode —
  không bắt buộc, tuỳ mức độ ưu tiên minh bạch dữ liệu của Founder.

**P2-08 — Badge nổi trang trí trong Hero có thể bị cắt (clip) hoàn toàn ở layout 1 cột (640-767px)**
- **Category:** Responsive
- **File:** `Hero.tsx` (`floatingBadges`, dòng 8-39; className dòng
  169-171 `isLight ? ... : "border-white/15 bg-white/[0.08]"` + `absolute`
  + offset âm như `left-[-6%] md:left-[-9%]`)
- **Mô tả:** 5 badge nổi (`200+`, `50+`, `100+`, `Affiliate Hub`,
  `AI Academy`) dùng `hidden sm:block` (ẩn hẳn dưới 640px — hợp lý) nhưng
  hiện ra từ 640px với offset âm theo %, đặt trong khung có
  `overflow-hidden` ở section cha. Đã xác nhận qua kiểm thử thật: KHÔNG
  gây tràn ngang trang (section tự cắt phần vượt ra ngoài), nhưng ở dải
  640-767px (trước khi layout chuyển sang 2 cột ở `md:` 768px), khung ảnh
  chiếm gần trọn chiều rộng viewport nên phần badge bị offset âm rất có
  thể bị cắt mất một phần hoặc toàn bộ, khiến 1 chi tiết trang trí được
  thiết kế có chủ đích lặng lẽ biến mất trong dải viewport này.
- **Recommendation:** Kiểm tra trực quan dải 640-767px (Chrome DevTools
  responsive mode) và cân nhắc chỉ hiện badge từ `md:` (768px, khi đã có
  đủ không gian 2 cột) thay vì `sm:` (640px).

**P2-09 — Cấu trúc dữ liệu có cấu trúc (JSON-LD) chỉ khai `Person`, thiếu `Organization`/`WebSite`**
- **Category:** SEO
- **File:** `src/app/layout.tsx` (biến `jsonLd`, dòng 60-68)
- **Mô tả:** Toàn bộ site chỉ phát 1 khối JSON-LD `@type: "Person"` (đại
  diện cho founder Võ Đương) cho MỌI trang qua Root Layout — không có
  `Organization`/`WebSite`/`SoftwareApplication` nào cho chính sản phẩm
  "VO DUONG AI" dù đây là 1 trang bán khoá học/hệ sinh thái sản phẩm
  (không đơn thuần blog cá nhân). Thiếu `WebSite` schema cũng đồng nghĩa
  không đủ điều kiện cho Google Sitelinks Search Box; thiếu `Organization`
  làm giảm khả năng Google hiểu đây là 1 thương hiệu/sản phẩm có cấu trúc
  rõ ràng trong Knowledge Graph.
- **Recommendation:** Thêm khối `WebSite` (name/url/potentialAction cho
  search nếu có tìm kiếm nội bộ) và/hoặc `Organization`/`EducationalOrganization`
  bên cạnh `Person` hiện có (không cần xoá `Person`, có thể giữ cả 2 dạng
  founder-centric lẫn brand-centric).

**P2-10 — Meta description mặc định dài hơn ngưỡng khuyến nghị, rủi ro bị cắt trên SERP**
- **Category:** SEO
- **File:** `src/lib/site.ts` (`siteConfig.description`, dùng làm
  `settings.seoDescription` mặc định khi Admin chưa tự đặt)
- **Mô tả:** Chuỗi mặc định dài **165 ký tự** (đã đếm chính xác), vượt
  ngưỡng ~155-160 ký tự mà Google thường hiển thị trước khi cắt (`...`)
  trên trang kết quả tìm kiếm — không sai kỹ thuật, chỉ là rủi ro thông
  điệp bị cắt cụt giữa câu trên SERP nếu Admin chưa từng ghi đè giá trị
  này qua `/admin/settings`.
- **Recommendation:** Rút gọn còn ≤155 ký tự, giữ trọn vẹn ý chính ở đầu
  câu (phần dễ bị cắt luôn là đuôi câu).

### P3 — Nice to Have

**P3-01 — Thông điệp thương hiệu (tagline) không đồng nhất giữa các vị trí**
- **Category:** Brand Consistency / Content
- **File:** `site.ts` (`siteConfig.tagline`: "Học AI • Xây hệ thống • Tạo
  tài sản số", hiển thị ở Header/Footer slogan) vs. `Hero.tsx` H1 ("Học AI
  đúng hướng. Ứng dụng thực tế. Tạo giá trị bền vững.") vs. Hero eyebrow
  ("Thương hiệu cá nhân · Hệ sinh thái AI")
- **Mô tả:** 3 vị trí nổi bật nhất của trang (slogan dưới logo, H1 chính,
  nhãn mở đầu) diễn đạt lời hứa thương hiệu theo 3 cách khác nhau — không
  sai nhưng làm loãng thông điệp cốt lõi cần ghi nhớ.
- **Recommendation:** Cân nhắc thống nhất 1 trục thông điệp chính (có thể
  vẫn giữ cách diễn đạt khác nhau về CÂU CHỮ nhưng cùng 3 trụ giá trị:
  Học AI / Xây hệ thống / Tạo tài sản số — hiện Hero H1 dùng "Ứng dụng
  thực tế"/"Tạo giá trị bền vững" là 2 khái niệm hơi khác 2 trụ gốc "Xây
  hệ thống"/"Tạo tài sản số").

**P3-02 — Toàn bộ CTA đều trỏ `/login`, không có tín hiệu phân biệt "lần đầu" vs "quay lại"**
- **Category:** Conversion
- **File:** Header, Hero, PortalPreview, FinalCTA, Footer — mọi CTA
- **Mô tả:** Đây là quyết định đã chốt rõ ràng ở phiên làm việc trước (Turn
  5), không phải lỗi — nhưng đứng từ góc độ thuần phễu chuyển đổi: dòng
  chữ phụ dưới nút Hero ghi "Miễn phí tham gia" trong khi nút bấm dẫn tới
  `/login` (không phải `/register` hay `/signup`) — nếu `/login` không tự
  có lối rẽ rõ ràng sang đăng ký ngay khi vào, khách lần đầu có thể phân
  vân "mình chưa có tài khoản, bấm vào đây có đúng không". Không đề xuất
  đổi route (đã là quyết định có chủ đích), chỉ ghi nhận như 1 điểm nên
  A/B test nếu tỷ lệ chuyển đổi CTA thấp hơn kỳ vọng.

**P3-03 — Thiếu `apple-touch-icon` / web manifest**
- **Category:** Technical / Visual Design
- **File:** `src/app/layout.tsx` (`icons: { icon: settings.faviconUrl }`)
- **Mô tả:** Chỉ khai `icon`, không có `apple-touch-icon` hay
  `manifest.json` — khi người dùng iOS/Android "Thêm vào Màn hình chính",
  hệ điều hành sẽ tự chụp ảnh chụp màn hình thay vì dùng icon thương hiệu.
- **Recommendation:** Thêm `apple` vào field `icons` (`icons: { icon,
  apple }`) trỏ 1 icon vuông ≥180×180px.

**P3-04 — Không khai báo `alternates.canonical`**
- **Category:** SEO
- **File:** `src/app/layout.tsx` (`generateMetadata()`)
- **Mô tả:** Có `metadataBase` nhưng không có `alternates: { canonical }`
  tường minh — Next.js không tự phát thẻ `<link rel="canonical">` nếu
  không khai báo. Rủi ro thấp (site chỉ có 1 domain, không có tham số query
  gây trùng lặp URL rõ ràng) nhưng là thực hành SEO tiêu chuẩn nên có.
- **Recommendation:** Thêm `alternates: { canonical: siteConfig.url + "/" }`
  (và tương tự cho các route khác nếu áp dụng pattern chung).

**P3-05 — JSON-LD `Person.description` dùng chung mô tả của site, không mô tả riêng về founder**
- **Category:** SEO / Technical
- **File:** `layout.tsx` (`jsonLd.description: settings.seoDescription`)
- **Mô tả:** Field `description` của schema `Person` nên mô tả CON NGƯỜI
  (Võ Đương), nhưng đang tái dùng nguyên `seoDescription` — vốn mô tả HỆ
  SINH THÁI sản phẩm, không phải tiểu sử/vai trò của founder. Không gây
  lỗi hiển thị nhưng là dữ liệu có cấu trúc không khớp ngữ nghĩa field.
- **Recommendation:** Viết 1 câu mô tả riêng cho founder (vd. "Nhà sáng
  lập VO DUONG AI...") thay vì tái dùng mô tả sản phẩm.

**P3-06 — `card-shine` hover-transform không có guard `prefers-reduced-motion` riêng**
- **Category:** Accessibility
- **File:** `globals.css` dòng 158-168 (`.card-shine:hover`)
- **Mô tả:** Hiệu ứng nhấc thẻ lên khi hover (`translateY(-5px) scale(1.015)`)
  áp dụng cho hầu hết card trên trang (pillar, roadmap, feature list...),
  không bọc trong `@media (prefers-reduced-motion: no-preference)`. Mức độ
  rủi ro thấp hơn nhiều so với P1-02 (đây là chuyển động do người dùng chủ
  động kích hoạt qua hover, không tự chạy), nhưng vẫn là điểm có thể cải
  thiện cho người dùng nhạy cảm với chuyển động.
- **Recommendation:** Không bắt buộc sửa ngay; cân nhắc bọc transform
  trong `@media (prefers-reduced-motion: no-preference)` nếu làm 1 đợt rà
  soát motion tổng thể sau này.

---

## 4. Quick Wins

Xếp theo tỷ lệ effort thấp / impact cao, có thể làm ngay:

1. **P1-01** — Thêm 1 ảnh OG/Twitter tĩnh 1200×630px vào `generateMetadata()` (30 phút, impact cao nhất cho traffic chia sẻ mạng xã hội).
2. **P2-03** — Thêm redirect `/landing-preview` → `/` trong `next.config.ts` (2 phút).
3. **P2-02** — Thêm `/portal/` vào `disallow` của `robots.ts`, khớp đúng chính sách đã ghi trong `sitemap.ts` (2 phút).
4. **P2-04** — Thêm `onError` fallback `hqdefault.jpg` cho thumbnail YouTube ở `SkillsShowcase.tsx` (10 phút).
5. **P2-10** — Rút ngắn `siteConfig.description` xuống ≤155 ký tự (5 phút).
6. **P3-03** — Thêm `apple-touch-icon` vào metadata `icons` (10 phút, đã có `founder`/logo SVG sẵn để tái dùng).
7. **P2-06** — Nén lại `founder.png` (không cần đổi code, chỉ thay file nguồn — 15 phút qua công cụ nén ảnh).

---

## 5. Production Checklist

| # | Hạng mục | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | `tsc --noEmit` sạch | ✅ Pass | Không lỗi |
| 2 | `eslint` sạch | ✅ Pass | Không lỗi/warning trên phạm vi landing page |
| 3 | `next build` thành công | ✅ Pass | Đã xác nhận ở các đợt sửa trước trong phiên này |
| 4 | Không tràn ngang (horizontal overflow) | ✅ Pass | Kiểm thử thật 4 viewport × 2 theme, 0 tràn |
| 5 | Không lỗi console/network khi tải trang | ⚠️ 1 cảnh báo | Thumbnail YouTube lỗi mạng trong sandbox — xem P2-04 để có fallback đúng dù mạng thật OK |
| 6 | Theme sáng/tối nhất quán, không nháy sai theme (FOUC) | ✅ Pass | Đọc cookie ở Server Component trước khi render |
| 7 | Skip-link truy cập nhanh | ✅ Pass | `#main-content`, hoạt động đúng |
| 8 | Heading hierarchy (1 `<h1>`/trang) | ✅ Pass | Chỉ `Hero.tsx` có `<h1>`, các section khác dùng `<h2>` |
| 9 | `prefers-reduced-motion` được tôn trọng | ✅ Phần lớn | Marquee, bubble, reveal-text đều có guard; `card-shine` hover chưa có (P3-06) |
| 10 | Nội dung chuyển động tự động có cách dừng | ❌ Fail | P1-02 |
| 11 | Tương phản màu đạt AA cho chữ mang thông tin | ⚠️ Cần đo lại | P1-03, chưa đo bằng công cụ chuyên dụng |
| 12 | Open Graph / Twitter Card đầy đủ (kể cả ảnh) | ❌ Fail | P1-01 |
| 13 | `sitemap.xml` đầy đủ mọi route công khai | ⚠️ Thiếu | P2-01 (thiếu bài Blog AI động) |
| 14 | `robots.txt` khớp đúng chính sách crawl | ⚠️ Lệch | P2-02 |
| 15 | Không có route đã xoá thiếu redirect | ⚠️ Thiếu 1 | P2-03 |
| 16 | Ảnh tối ưu kích thước hiển thị | ⚠️ Cần cải thiện | P2-05, P2-06 |
| 17 | CTA nhất quán, dẫn đúng đích | ✅ Pass | Đã xác nhận đúng theo yêu cầu Turn 5 trong phiên này |
| 18 | Không có link nội bộ chết (nav/footer/anchor) | ✅ Pass | Đã kiểm tra toàn bộ `mainNav` anchor (`/#companion-ai` v.v.) khớp đúng `id` thật trong DOM |
| 19 | Dữ liệu hiển thị có nguồn xác thực (không bịa số liệu) | ⚠️ Cần xác nhận | P2-07 |
| 20 | Cấu trúc dữ liệu (JSON-LD) đầy đủ cho loại trang | ⚠️ Thiếu | P2-09 |

---

## 6. Final Verdict

## **Ready with Minor Fixes**

Landing page có nền tảng kỹ thuật vững (build/type-check sạch, không tràn
layout, theme system đúng chuẩn, không có link chết) và đủ điều kiện vận
hành production ngay ở hiện tại — không có P0 nào chặn release. Tuy nhiên,
khuyến nghị xử lý 3 mục **P1** trước khi đẩy mạnh chi tiêu quảng cáo/
truyền thông diện rộng, vì cả 3 đều ảnh hưởng trực tiếp tới hiệu quả kênh
chia sẻ mạng xã hội (kênh chính của đối tượng mục tiêu) và khả năng tiếp
cận người dùng dùng bàn phím/trình đọc màn hình. Các mục P2 nên xử lý
trong 1-2 sprint kế tiếp (chủ yếu là SEO/hiệu năng, không gấp), còn P3 có
thể gộp vào các đợt polish sau.
