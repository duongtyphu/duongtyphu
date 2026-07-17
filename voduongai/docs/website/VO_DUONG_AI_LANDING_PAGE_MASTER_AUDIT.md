# VO DUONG AI — Landing Page Master Audit

**Ngày audit:** 2026-07-17
**Phạm vi:** Landing page (`/`) của ứng dụng Next.js trong `voduongai/`, cùng các thành phần dùng chung (Header, Footer, MobileNavDrawer) và mọi route mà Landing Page liên kết tới (chỉ ở mức xác nhận điểm đến, không audit sâu bên trong Học viện/Admin).
**Production/Staging reference đã kiểm tra:** `https://voduongai.vercel.app/`
**Repository đã kiểm tra:** nhánh `main`, commit `f1c7de8` tại thời điểm audit.

> Tài liệu này chỉ audit. Không có thay đổi code, nội dung, cấu hình hay dữ liệu nào được thực hiện trong quá trình này.

---

## 1. Executive Summary

Landing Page VO DUONG AI đã có đầy đủ **khung xương thông tin** (information architecture) khá tốt: Hero → Video giới thiệu → Preview Học viện → Quiz đánh giá năng lực → Hệ sinh thái → Công cụ đang dùng → Đối tượng/Vấn đề → Lộ trình → Cộng đồng → Hệ sinh thái (solar system) → Founder Story → CTA cuối. Về mặt kỹ thuật, code sạch (không có lỗi TypeScript/ESLint trong phạm vi Landing Page), routing rõ ràng, SEO cơ bản (sitemap, robots, OG image động, JSON-LD) đã được thiết lập.

Tuy nhiên có **một mâu thuẫn chiến lược lớn** cần Founder quyết định trước khi đi tiếp: toàn bộ Landing Page hiện đang dùng **nền tối (dark navy) + chữ trắng xuyên suốt mọi section**, trong khi định hướng thương hiệu được nêu trong bối cảnh audit này yêu cầu rõ **"Nền sáng/trắng là hệ nền chính"**. Đây không phải lỗi kỹ thuật — code chạy đúng như thiết kế — mà là **khoảng cách giữa định hướng thương hiệu mới và landing page đã xây dựng theo định hướng dark-theme trước đó**. Toàn bộ audit này được viết trên nền tảng: hệ thống hiện tại là dark-theme hoàn chỉnh, nhất quán, không phải một bản dang dở.

Bên cạnh đó, audit phát hiện một lỗi kỹ thuật xác thực được trên mọi viewport phổ biến (320–1024px): **trang bị tràn ngang (horizontal scroll)** do các lớp glow/blur trang trí dùng `-inset-N` âm không được `overflow-hidden` chứa lại đúng cách ở 2 section (`PortalPreview`, `FounderStory`). Đây là lỗi Production-blocking, có nguyên nhân gốc rõ ràng, sửa nhanh (S).

Ngoài ra, sitemap.xml đang khai báo hàng chục URL `/portal/*` mà middleware xác thực sẽ redirect thẳng sang `/login` cho bất kỳ crawler/người dùng ẩn danh nào — lãng phí ngân sách crawl và có thể gây cảnh báo Soft-404/Redirect trong Search Console. Domain chính thức `voduongai.com` (được hardcode trong toàn bộ metadata, canonical ngầm định, OG, sitemap) **hiện chưa phân giải (không truy cập được)** — nghĩa là mọi liên kết chia sẻ mạng xã hội từ bản vercel.app hiện tại sẽ trỏ ảnh/OG về một domain chết.

**Kết luận nhanh:** Landing Page đạt khoảng **68–72% mức hoàn thiện Production** theo đánh giá của tôi. Có thể đạt **CONDITIONALLY READY** sau khi xử lý các mục P0/P1 trong Sprint 0 (ước tính 1–3 ngày công việc kỹ thuật), và cần Founder ra quyết định về hướng màu nền (sáng vs tối) trước khi đầu tư thêm vào visual polish, vì quyết định này ảnh hưởng đến gần như mọi component.

---

## 2. Audit Scope

**Trong phạm vi:**
- `src/app/page.tsx` và toàn bộ 12 section component trong `src/components/home/`.
- `src/app/layout.tsx`, metadata, JSON-LD, Google Analytics injection.
- `src/components/site/Header.tsx`, `Footer.tsx`, `MobileNavDrawer.tsx`, `ChromeGate.tsx`, `BackToTop.tsx`, `AntiCopy.tsx`.
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`.
- `src/lib/site.ts`, `src/lib/site-settings.ts`, `src/middleware.ts`, `src/lib/protected-routes.ts` (chỉ phần liên quan trực tiếp đến hành vi Landing Page).
- `src/app/globals.css` (phần token màu, font, các class dùng bởi Landing Page).
- Mọi destination route mà Landing Page liên kết tới — chỉ xác nhận route có tồn tại/redirect đúng, **không** audit nội dung sâu bên trong `/portal/*` hay `/admin/*`.

**Ngoài phạm vi:**
- Toàn bộ nội dung nghiệp vụ bên trong Học viện (`/portal/*`) trừ hành vi redirect khi chưa đăng nhập.
- Admin CMS (`/admin/*`).
- Backend/API, Supabase schema, business logic thanh toán.
- Nội dung Blog AI (`/blogai/*`) — chỉ xác nhận route tồn tại vì Landing Page/Header có liên kết tới.

---

## 3. Methodology

1. Đọc trực tiếp toàn bộ source code liên quan (không suy đoán cấu trúc).
2. Chạy `next dev` cục bộ (`localhost:3000`, build từ đúng commit `main` đã push) và dùng Playwright (cài tạm thời, gỡ ngay sau khi dùng, không còn trong `package.json`) để:
   - Chụp ảnh 8 viewport: 320/375/390/430/768/1024/1280/1440px.
   - Đo `document.documentElement.scrollWidth` vs `clientWidth` ở từng viewport để phát hiện tràn ngang.
   - Bisect DOM để xác định chính xác phần tử gây tràn ngang (ẩn từng phần tử, đo lại).
   - Tính contrast ratio thực tế (WCAG luminance formula) cho các cặp chữ/nền nghi ngờ thấp, dùng canvas để resolve màu `oklab()` của Tailwind v4 về RGB rồi composite alpha qua từng lớp nền.
   - Ghi nhận console errors / page errors / runtime errors trong quá trình tải.
3. Dùng `curl` (không qua trình duyệt) để kiểm tra trực tiếp trên `https://voduongai.vercel.app/`: response headers, `robots.txt`, `sitemap.xml`, HTML đã render (title, meta, OG, Twitter Card, canonical, JSON-LD, heading count, alt text coverage).
4. Chạy `tsc --noEmit` và `eslint` trên toàn bộ phạm vi Landing Page.
5. Đối chiếu mọi phát hiện với bối cảnh thương hiệu do Founder cung cấp trong yêu cầu audit này.

### Giới hạn kỹ thuật của môi trường audit (quan trọng, đọc trước khi hiểu các mục Performance/Live-site)

Môi trường thực thi của tôi có **egress network được kiểm soát qua proxy**; trình duyệt Playwright/Chromium **không thể** mở kết nối HTTPS trực tiếp ra `voduongai.vercel.app` (xác nhận qua nhiều lần thử, lỗi `ERR_CONNECTION_RESET`), dù `curl` (dùng cơ chế proxy khác) truy cập được bình thường. Hệ quả:

- Mọi kiểm tra **cần trình duyệt thật** (screenshot, responsive, console error, click-through CTA, contrast đo bằng canvas, hành vi cuộn/hiệu ứng) được thực hiện trên **local dev server** (`next dev`, build từ đúng commit đang chạy Production) — không phải trực tiếp trên bản deploy.
- Mọi kiểm tra **chỉ cần HTTP request** (headers, HTML tĩnh trả về, robots.txt, sitemap.xml, meta tags, response code) được thực hiện **trực tiếp trên `voduongai.vercel.app`** qua `curl` — đây là bằng chứng lấy từ đúng bản Production/Staging.
- **Không chạy được Lighthouse** nhắm vào URL sống (cùng giới hạn mạng), và tôi chủ động **không** chạy Lighthouse nhắm vào `next dev` cục bộ vì môi trường dev không tối ưu hoá (không minify, không cache, HMR overhead) — số điểm sẽ sai lệch nghiêm trọng so với Production và gây hiểu lầm. Phần Performance trong audit này vì vậy là **static/code-based audit**, không có điểm Lighthouse thực đo.
- Do dev-mode có một badge "N" (chỉ báo dev tool của Next.js) xuất hiện góc dưới trái trên mọi ảnh chụp — đây **không phải** lỗi giao diện thật, chỉ tồn tại trong `next dev`, không xuất hiện trên Production build. Đã loại trừ khỏi danh sách phát hiện.

---

## 4. Technical Architecture Snapshot

**Đã xác minh trong code:**

- **Framework:** Next.js 16.2.9, **App Router** (không phải Pages Router), Turbopack cho dev server, React 19, TypeScript, Tailwind CSS v4 (token khai báo qua `@theme` trong `globals.css`), Framer Motion cho animation.
- **Entry point Landing Page:** `src/app/page.tsx` — Server Component (không có `"use client"`), chỉ import và render 12 section component theo thứ tự cố định (không đọc từ CMS/DB).
- **Toàn bộ 12 section component trong `src/components/home/` đều là Client Component** (`"use client"` ở đầu file) — 15/15 file trong thư mục này là client component (bao gồm cả 2 file hỗ trợ `HeroNeuralBackground.tsx`, `HeroQuestionBubbles.tsx`, `RevealText.tsx`). 13/15 file import `framer-motion`.
- **Layout gốc:** `src/app/layout.tsx` (Server Component, `async`) — gọi `getSiteSettings()` (Supabase) để lấy site name/slogan/màu/SEO mỗi lần render → trang chủ **không static/ISR được**, luôn SSR động (xác nhận qua header `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` trên bản Production thật).
- **CSS:** Tailwind v4 (`@import "tailwindcss"` trong `globals.css`), token màu/`font-sans`/radius/shadow khai báo tập trung trong `@theme`. Không có CSS Modules, không có styled-components.
- **Font:** Không dùng `next/font`, không tải Google Fonts. `--font-sans` map đúng 100% theo yêu cầu brief (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`), áp dụng qua `body { font-family: var(--font-sans) }` và Tailwind utility `font-sans` trên thẻ `<body>`.
- **Nội dung:** 100% hardcode trực tiếp trong component (copy, heading, số liệu, danh sách công cụ trong `src/data/tools.ts`). Chỉ có **site-level settings** (tên site, slogan, màu thương hiệu, SEO title/description, social links, favicon) đọc từ bảng Supabase `settings` qua `getSiteSettings()`, có fallback cứng khi Supabase chưa cấu hình. **Copy của từng section landing page không có đường nào để chỉnh qua Admin CMS hiện tại.**
- **Hình ảnh:** logo tools qua `public/tools/*.ico|svg` (dùng `next/image`, có 1 file dùng `<Image>` trực tiếp không qua loader tối ưu ở `ToolsIUse.tsx`/`FounderStory.tsx` — xem mục 14 Performance); ảnh founder tại `public/founder.png`; brand assets tại `public/brand/*`. OG image sinh **động** qua `src/app/opengraph-image.tsx` (dùng `next/og`, 1200×630, không phải file tĩnh).
- **Header/Footer/CTA:** dùng chung component (`Header.tsx`, `Footer.tsx`) cho toàn site qua `ChromeGate.tsx` (ẩn Header/Footer khi ở `/admin` hoặc `/portal`). Navigation chính lấy từ `src/lib/site.ts` (`mainNav`), 1 nguồn duy nhất cho cả Header desktop và `MobileNavDrawer`.
- **Auth/Route protection:** `src/middleware.ts` bảo vệ toàn bộ `/portal/:path*` và `/login` (matcher tĩnh, đồng bộ thủ công với `PROTECTED_ROUTE_PREFIXES` trong `src/lib/protected-routes.ts`). Khi Supabase **chưa cấu hình**, `/portal/*` cố tình để public (ghi rõ trong comment code). Khi Supabase **đã cấu hình** (trường hợp Production), mọi truy cập `/portal/*` chưa đăng nhập bị redirect sang `/login?next=<path>`.
- **Không phát hiện code chết hay component trùng lặp rõ ràng** trong phạm vi Landing Page. `RevealText.tsx` là component mới, dùng chung hợp lý cho hiệu ứng hiện chữ theo từ.

### Bản đồ route → component → đích CTA

```
/ (page.tsx, Server Component)
├─ Hero.tsx (client)              → CTA: "🚀 Bước vào Học viện" → /portal/hocvienai (auth-gated)
│                                  → CTA: "Xem công cụ tôi dùng" → #cong-cu-toi-dung (anchor, cùng trang)
├─ IntroVideo.tsx (client)        → nút Play (không điều hướng, phát video nhúng YouTube)
├─ PortalPreview.tsx (client)     → không còn CTA (đã gỡ ở lần chỉnh trước đó trong phiên làm việc)
├─ QuizAssessment.tsx (client)    → CTA kết quả: "Nhập lộ trình phù hợp →" → #cta-cuoi (anchor)
├─ EcosystemPillars.tsx (client)  → không có CTA điều hướng (chỉ card tĩnh)
├─ ToolsIUse.tsx (client)         → không có CTA (marquee logo)
├─ AudienceProblem.tsx (client)   → không có CTA
├─ Roadmap.tsx (client)           → không có CTA
├─ TrustStats.tsx (client)        → không có CTA
├─ Ecosystem.tsx (client)         → không có CTA (solar-system minh hoạ)
├─ FounderStory.tsx (client)      → không có CTA
└─ FinalCTA.tsx (client)          → CTA chính: "Vào Học viện miễn phí" → /login
                                   → CTA phụ: "🎁 Nhận tài liệu AI" → không có href/onClick (nút tĩnh)

Header.tsx  → mainNav: Trang chủ(/) · Học viện AI(#trai-nghiem-hoc-vien-ai) · AI Workspace(#danh-gia-nang-luc-ai) · Blog AI(/blogai)
            → CTA: "Vào Học viện" → /login
Footer.tsx  → cột "Học viện AI": Companion/CKOS/Kỹ năng AI/Dự án & Cơ hội/Premium → toàn bộ /portal/* (auth-gated)
            → cột "Tài nguyên": Nhật ký học tập/Hành trình của tôi/Khu vườn/Cộng đồng AI → toàn bộ /portal/* (auth-gated)
            → Social: Facebook/YouTube/TikTok/Zalo/Email (external)
            → Legal: /privacy /terms /refund-policy
```

Toàn bộ route đích (`/portal/*`, `/login`, `/blogai`, `/privacy`, `/terms`, `/refund-policy`) **đều có file `page.tsx` tồn tại trong repo** — không phát hiện link 404 ở cấp routing. Hành vi thực tế người dùng gặp phải khi click các link `/portal/*` phụ thuộc middleware (xem mục 8).

---

## 5. Current Landing Page Section Map

| # | Section (component) | ID neo | Mục đích | CTA |
|---|---|---|---|---|
| 1 | Hero | — | Giới thiệu định vị + headline chính (H1) | 2 CTA |
| 2 | IntroVideo | — | Video giới thiệu hành trình xây VO DUONG AI | Nút play (không điều hướng) |
| 3 | PortalPreview | `trai-nghiem-hoc-vien-ai` | Mô phỏng giao diện thật của Học viện (mockup tĩnh + con trỏ giả lập) | Không |
| 4 | QuizAssessment | `danh-gia-nang-luc-ai` | Mini-quiz 4 câu, chấm điểm, gợi ý lộ trình | 1 CTA (sau khi có kết quả) |
| 5 | EcosystemPillars | — | 5+1 trụ cột hệ sinh thái (CKOS, AI Workspace, Companion, Học viện AI, Dự án & Cơ hội, Premium) | Không |
| 6 | ToolsIUse | `cong-cu-toi-dung` | Marquee logo công cụ AI đang dùng thật | Không |
| 7 | AudienceProblem | — | 3 nhóm đối tượng + vấn đề + giải pháp VO DUONG AI | Không |
| 8 | Roadmap | — | 4 chặng hành trình Tò mò → Làm chủ | Không |
| 9 | TrustStats | — | Số liệu tin cậy + badge cộng đồng | Không |
| 10 | Ecosystem | — | Solar-system minh hoạ 12 module (desktop) / carousel (mobile) | Không |
| 11 | FounderStory | — | Câu chuyện người sáng lập | Không |
| 12 | FinalCTA | `cta-cuoi` | CTA chuyển đổi cuối trang | 2 CTA |

### Nhận định từng section

- **Hero** — Đúng vai trò, headline mạnh ("AI không thay thế bạn... Nhưng người biết dùng AI sẽ thay thế người không biết dùng AI"), có trả lời khá tốt "đây là gì / vấn đề gì" nhưng câu hỏi "dành cho ai" chưa thật rõ ràng ở ngay Hero (phải đọc tới AudienceProblem mới thấy phân khúc cụ thể). 2 CTA cạnh nhau hợp lý (1 chính, 1 phụ).
- **IntroVideo** — Đặt ngay sau Hero là hợp lý cho một brand cá nhân (founder-led), nhưng đây là lần **thứ 2** người dùng gặp thông điệp giới thiệu gần như trùng lặp ý với Hero trước khi thấy bất kỳ social proof hay giá trị cụ thể nào. Cân nhắc mức độ ưu tiên vị trí này so với việc đưa "vấn đề người dùng" (AudienceProblem) lên sớm hơn.
- **PortalPreview** — Ý tưởng mockup trực quan tốt, giúp giảm rủi ro "mua sản phẩm vô hình". Tuy vậy đây chính là 1 trong 2 section gây lỗi tràn ngang (mục 11).
- **QuizAssessment** — Cơ chế tương tác tốt, tăng thời gian on-page và cá nhân hoá gợi ý — nhưng đặt **trước** khi người dùng đã hiểu đủ giá trị/nỗi đau (AudienceProblem nằm phía dưới) có thể khiến quiz thiếu ngữ cảnh với người mới vào trang.
- **EcosystemPillars, Roadmap, TrustStats, Ecosystem (solar-system)** — 4 section này có sự **trùng lặp khái niệm đáng kể**: đều đang cố truyền tải "hệ sinh thái gồm nhiều module liên kết", chỉ khác hình thức trình bày (card lưới, timeline, số liệu, solar-system). Người dùng phải xem lại ý tưởng "hệ sinh thái" dưới 3-4 hình thức khác nhau trong cùng 1 lần cuộn trang — tăng tải nhận thức (cognitive load) mà không thêm nhiều giá trị mới mỗi lần.
- **AudienceProblem** — Nội dung mạnh, đúng nỗi đau, nhưng vị trí (sau EcosystemPillars + ToolsIUse) khá muộn — đây lẽ ra là 1 trong những section sớm nhất để xác nhận "tôi có đúng đối tượng không" trước khi được giới thiệu sâu về hệ sinh thái.
- **FounderStory** — Nội dung chân thực, có brand tagline lặp lại hợp lý, nhưng đặt sát cuối (ngay trước FinalCTA) trong khi "niềm tin vào người dẫn dắt" thường phát huy tác dụng tốt hơn nếu xuất hiện **trước** khi yêu cầu hành động chuyển đổi, không phải ngay sát nút bấm.
- **FinalCTA** — Rõ ràng, có 2 CTA phân vai chính/phụ tốt. Tuy vậy CTA phụ "🎁 Nhận tài liệu AI" hiện là **nút tĩnh không có hành vi** (xem mục 8) — rủi ro trải nghiệm nếu người dùng click.

**Đề xuất cấu trúc mục tiêu** (chỉ đề xuất, chưa triển khai) — xem mục 20.

---

## 6. Product Messaging Audit

**Đã xác minh trong code (nội dung nguyên văn từng section):**

- Brand name viết nhất quán **"VO DUONG AI"** trong phần lớn nội dung UI (badge, heading), nhưng **"Võ Đương AI"** (có dấu, viết như tên người) xuất hiện song song ở: `siteConfig.displayName`, JSON-LD `name`, FounderStory heading ("Tại sao tôi xây Võ Đương AI?"), toàn bộ nội dung thân bài FounderStory, và `<title>` thực tế trên Production là **"VO DUONG AI — Học AI, xây hệ thống, tạo tài sản số"** (không dấu). Đây là 2 cách viết tên thương hiệu cùng tồn tại — không sai về mặt ngôn ngữ (một là tên thương hiệu quốc tế hoá, một là tên người sáng lập có dấu) nhưng **cần Founder xác nhận đây là chủ đích** (thương hiệu = "VO DUONG AI", nhà sáng lập = "Võ Đương") hay là sự thiếu nhất quán cần chuẩn hoá.
- Ngôi xưng: Hero, IntroVideo, EcosystemPillars, Roadmap dùng "bạn"/ngôi thứ 3 (thương hiệu tự giới thiệu); FounderStory chuyển hẳn sang ngôi "tôi" (founder tự kể chuyện); ToolsIUse cũng dùng "tôi" ("Những công cụ tôi thực sự đang dùng"). Sự chuyển đổi ngôi xưng giữa các section là **có chủ đích và hợp lý** (thương hiệu nói chung → founder nói riêng ở phần công cụ/câu chuyện), không phải lỗi, nhưng nên nhất quán khi viết thêm nội dung mới.
- Thông điệp Hero **có phần lớn** trả lời đúng khung "đây là gì / vấn đề gì / bước tiếp theo", nhưng **chưa nêu rõ "dành cho ai"** ngay tại Hero (đối tượng chỉ được nêu rõ ở AudienceProblem, section thứ 7/12). Với một trang landing page, việc người dùng phải cuộn qua 6 section mới thấy "à, đây đúng là dành cho tôi" là một khoảng trễ đáng cân nhắc rút ngắn.
- Về phân biệt với "website tổng hợp công cụ/bán khoá học đại trà": nội dung ToolsIUse ("Danh sách những công cụ tôi đang trải nghiệm mỗi ngày") và AudienceProblem (khẳng định rõ khác biệt bằng lộ trình CKOS → Workspace → Companion) làm khá tốt việc này — **đây là điểm mạnh, nên giữ**.
- Tuyên bố số liệu (TrustStats: "10K+ người theo dõi", "50+ tài liệu & công cụ", "97% học viên tiến bộ", "Hoàn tiền 7 ngày") — **không thể xác minh được tính chính xác của các con số này** trong phạm vi audit (không có nguồn dữ liệu nào trong code, đây là chuỗi hardcode). Founder cần xác nhận các con số này còn đúng/có thể chứng minh khi có traffic thật, tránh rủi ro "cường điệu không kiểm chứng được" theo đúng tinh thần thương hiệu mong muốn.
- Câu dẫn ToolsIUse hiện là "Danh sách những công cụ tôi đang trải nghiệm mỗi ngày" — đây là bản đã rút gọn từ yêu cầu trước đó trong cùng phiên làm việc, nhất quán tốt với phong cách ngắn gọn.
- Không phát hiện đoạn nội dung nào bị lặp ý nguyên văn giữa các section, nhưng có lặp **khái niệm** như đã nêu ở mục 5 (EcosystemPillars/Roadmap/TrustStats/Ecosystem).

**Nội dung nên giữ nguyên:** Hero headline, AudienceProblem (toàn bộ), FounderStory (giọng văn), ToolsIUse subtitle.
**Nội dung nên rút gọn/xem lại:** cụm 4 section lặp khái niệm "hệ sinh thái" (mục 5) — cân nhắc gộp còn 2, không phải 4.
**Nội dung còn thiếu:** một câu trả lời rõ ràng "dành cho ai" ngay tại Hero; nguồn/ngày cập nhật cho các số liệu TrustStats.
**Cần Founder xác nhận:** cách viết tên thương hiệu "VO DUONG AI" vs "Võ Đương AI" có phải chủ đích; tính xác thực của số liệu TrustStats.

---

## 7. Information Architecture Audit

Landing Page hiện có đủ các lớp nội dung được liệt kê trong yêu cầu audit, **trừ**:
- Không có **Dự án & Cơ hội** hay **Premium** như một section CTA riêng trên Landing Page (chỉ xuất hiện như 1 card trong EcosystemPillars) — đây là lựa chọn hợp lý để giảm tải nhận thức, **không phải thiếu sót** cần bổ sung.
- Không có section **Social proof dạng logo đối tác/khách hàng** (khác với TrustStats là số liệu) — có thể chưa cần thiết ở giai đoạn hiện tại vì thương hiệu định vị cá nhân (founder-led), nhưng nên là hạng mục cân nhắc khi có case study thật.

**Vấn đề thứ tự chính (đã nêu ở mục 5):**
1. AudienceProblem nên di chuyển lên sớm hơn (ngay sau Hero hoặc sau IntroVideo), trước khi giới thiệu sâu về hệ sinh thái/quiz.
2. 4 section "hệ sinh thái" (EcosystemPillars, Roadmap, TrustStats, Ecosystem) nên được rà soát để gộp/loại bớt trùng lặp khái niệm.
3. FounderStory nên di chuyển lên sớm hơn một chút (trước Roadmap hoặc trước TrustStats) để "niềm tin vào người dẫn dắt" phát huy tác dụng trước khi yêu cầu hành động.

Xem đề xuất cấu trúc mục tiêu đầy đủ tại mục 20.

---

## 8. CTA Inventory và Conversion Funnel

### Bảng CTA Inventory

| CTA | Section | Destination | Trạng thái | Vai trò | Vấn đề | Khuyến nghị |
|---|---|---|---|---|---|---|
| "🚀 Bước vào Học viện" | Hero | `/portal/hocvienai` | Route tồn tại, **auth-gated** → redirect `/login?next=/portal/hocvienai` nếu chưa đăng nhập | CTA chính | Không giải thích trước rằng cần đăng nhập/đăng ký; điểm đến khác cú pháp so với các CTA khác cùng vai trò (số khác trỏ thẳng `/login`) | P2: thống nhất 1 kiểu điểm đến cho "CTA chính vào Học viện" toàn site |
| "Xem công cụ tôi dùng" | Hero | `#cong-cu-toi-dung` | Hoạt động (anchor cùng trang) | CTA phụ | Không |  |
| Nút Play video | IntroVideo | Nhúng YouTube (`L4DZsW6OCpg`), không điều hướng | Hoạt động | Tương tác nội dung | Video ID là placeholder theo comment trong code ("Placeholder intro video — swap this ID via Admin once..."); **chưa xác minh được** đây có phải video chính thức cuối cùng hay không | P2: Founder xác nhận video ID đã là bản final |
| "Nhập lộ trình phù hợp →" | QuizAssessment (sau khi trả lời hết) | `#cta-cuoi` | Hoạt động (anchor) | Chuyển tiếp funnel | Không |  |
| "Vào Học viện miễn phí" | FinalCTA | `/login` | Hoạt động, auth-gated | CTA chính cuối trang | Không |  |
| "🎁 Nhận tài liệu AI" | FinalCTA | **Không có `href` hoặc `onClick`** — `<button type="button">` tĩnh | Không hoạt động | CTA phụ (lead magnet) | **Click không có bất kỳ phản hồi nào** — nhãn hứa hẹn ("nhận tài liệu") nhưng không giao hàng | **P1**: gắn hành vi thật (form thu email, link tải, hoặc modal) hoặc tạm ẩn nút này |
| "Vào Học viện" | Header (toàn site) | `/login` | Hoạt động, auth-gated | CTA chính header | Không |  |
| Học viện AI / AI Workspace | Header `mainNav` | `#trai-nghiem-hoc-vien-ai`, `#danh-gia-nang-luc-ai` | Hoạt động (anchor, đã có cơ chế xử lý scroll khi điều hướng từ trang khác) | Điều hướng nội dung | Nhãn menu "Học viện AI"/"AI Workspace" trỏ tới section landing page minh hoạ, **không phải** trang thật cùng tên trong Học viện — có thể gây hiểu lầm nhẹ về đích đến khi đọc nhãn | P3: cân nhắc phụ đề hoặc để rõ đây là "xem trước" |
| Cột Footer "Học viện AI" (Companion/CKOS/Kỹ năng AI/Dự án & Cơ hội/Premium) | Footer | `/portal/*` (5 link) | Route tồn tại, **auth-gated**, redirect `/login` | Điều hướng | Người dùng ẩn danh click bất kỳ link nào trong cột này đều bị đưa thẳng tới màn hình đăng nhập mà không có cảnh báo/preview — trải nghiệm có thể gây bất ngờ ("tôi bấm xem Companion sao lại ra trang đăng nhập") | **P2**: cân nhắc thêm dấu hiệu nhỏ (icon khoá) hoặc để các link này trỏ về section landing page tương ứng nếu có, thay vì thẳng vào route auth-gated |
| Cột Footer "Tài nguyên" (Nhật ký học tập/Hành trình của tôi/Khu vườn/Cộng đồng AI) | Footer | `/portal/*` (4 link) | Tương tự trên | Điều hướng | Tương tự trên | Tương tự trên |
| Social icons (Facebook/YouTube/TikTok/Zalo/Email) | Footer | External URL từ `site-settings` | Hoạt động, `target` mặc định (xem mục 13) | Thương hiệu | Không thấy `rel="noopener noreferrer"` tường minh trên các thẻ `<a>` external — xem mục 13 | P3 |
| /privacy /terms /refund-policy | Footer | Route tồn tại | Hoạt động | Pháp lý | Không |  |

### Đánh giá Funnel

```
Landing Page
 → Khám phá giá trị       (Hero, IntroVideo, PortalPreview)         — ổn, có thể rút ngắn
 → Tin tưởng              (TrustStats, FounderStory, AudienceProblem) — FounderStory đặt hơi muộn
 → Chọn điểm bắt đầu      (QuizAssessment, Roadmap)                  — quiz đặt trước khi rõ "dành cho ai"
 → Vào Học viện/đăng ký   (Header CTA, Hero CTA, FinalCTA)           — 2/3 CTA trỏ đúng, 1 CTA phụ (Nhận tài liệu AI) chết
 → Thực hiện hành động đầu tiên → ngoài phạm vi Landing Page (bên trong /portal sau khi đăng nhập)
```

**Điểm rơi/bối rối có khả năng cao nhất:**
1. Nút "🎁 Nhận tài liệu AI" không hoạt động — rủi ro mất niềm tin ngay tại bước CTA cuối cùng, quan trọng nhất của trang.
2. Click bất kỳ link Footer nào vào Học viện khi chưa đăng nhập → bất ngờ bị chuyển sang màn hình đăng nhập không có cảnh báo trước.
3. Quiz xuất hiện tương đối sớm (trước AudienceProblem) có thể khiến người dùng chưa đủ ngữ cảnh để trả lời có ý nghĩa.

---

## 9. UI/Visual Audit

**Đã xác minh trong code + trực quan (local build, khớp source đang deploy):**

- **Visual hierarchy:** heading đã được đồng bộ kích thước ở lần chỉnh sửa gần nhất trong phiên làm việc (`text-2xl font-extrabold md:text-3xl` cho phần lớn H2) — nhất quán tốt.
- **Container width:** đa số section dùng `max-w-6xl`/`max-w-4xl`/`max-w-3xl` nhất quán, căn giữa bằng `mx-auto px-5`.
- **Khoảng cách section:** đa số `py-9 md:py-12`, một vài section dùng `py-7`/`py-12 md:py-16` — chênh lệch nhỏ, không gây mất nhịp rõ rệt.
- **Card/border/radius:** dùng nhất quán các class `rounded-2xl`/`rounded-[20px]`/`border-white/10` xuyên suốt, một vài nơi dùng số thô (`rounded-[24px]`, `rounded-[1.2rem]`) thay vì token `--radius-*` đã khai báo sẵn trong `@theme` (xem mục 15 Code Quality).
- **Hover/focus state:** `:focus-visible` toàn site có outline rõ ràng (đã audit ở mục 10). Hover state trên card dùng CSS transition nhất quán (`.card-shine`, `.ecosystem-card`, v.v.).
- **Nền:** xem mục 10 Color System Recommendation — đây là phát hiện quan trọng nhất của toàn bộ audit UI.
- **Bằng chứng đo được:** không phát hiện lỗi layout vỡ ở 1280/1440px. Có lỗi tràn ngang xác nhận ở 320–1024px (xem mục 11).

---

## 10. Color System Recommendation

**Đây là phát hiện chiến lược quan trọng nhất của toàn bộ audit.**

### Hiện trạng đã xác minh trong code

- `globals.css` khai báo `--background: #F8FAFC` (gần trắng) và `--foreground: #111827` (gần đen) trong `@theme` — đúng tinh thần "nền sáng làm chủ đạo" **ở cấp token**.
- Nhưng `layout.tsx` render một `<div className="mesh-navy fixed inset-0 -z-10" />` phủ toàn màn hình phía sau mọi nội dung, và `.mesh-navy` trong CSS là nền **xanh navy rất tối** (`#020817` + gradient radial xanh). `<body>` đồng thời có class `text-white`.
- Kết quả: **100% Landing Page hiện tại là dark-theme** — nền tối, chữ trắng, xuyên suốt toàn bộ 12 section, không có section nào dùng nền sáng.
- Đây không phải bug — là kết quả nhất quán, có chủ đích, của nhiều vòng thiết kế trước đó trong lịch sử phát triển sản phẩm.

### Mâu thuẫn với bối cảnh audit

Bối cảnh do Founder cung cấp cho audit này nêu rõ: *"Nền sáng/trắng là hệ nền chính... Không chia mỗi section thành một màu mạnh khác nhau... màu cam thương hiệu nên đóng vai trò điểm nhấn."* Landing Page hiện tại **không** đáp ứng định hướng này — không phải vì "chia nhiều màu mạnh mỗi section" (thực ra ngược lại, toàn bộ trang dùng nhất quán 1 nền tối, không mắc lỗi "mỗi section một màu" mà brief cảnh báo), mà vì nền chủ đạo là **tối**, không phải **sáng/trắng** như brief yêu cầu.

### Khuyến nghị (nhận định chuyên môn, không phải đã triển khai)

Đây là quyết định **Founder phải phê duyệt trước**, vì nó ảnh hưởng tới gần như toàn bộ 15 component, mọi token màu chữ (`text-white/40`, `text-white/60`...), mọi card glass-morphism hiện đang thiết kế cho nền tối, và cả các trang tĩnh khác dùng chung `.mesh-navy` qua `layout.tsx` (Blog AI, Privacy, Terms...). Ba hướng khả thi:

1. **Giữ dark-theme như hiện tại** — nếu đây thực sự là định vị thương hiệu đã chốt (nhiều sản phẩm AI/tech hiện đại dùng dark-theme rất thành công, và dark-theme hiện tại được thực thi nhất quán, có chiều sâu, không rẻ tiền). Trong trường hợp này, bối cảnh audit cần được cập nhật lại cho khớp thực tế, hoặc xác nhận đây là ngoại lệ có chủ đích.
2. **Chuyển hẳn sang light-theme** theo đúng brief — đây là một cuộc **redesign toàn diện**, không phải "đổi biến CSS", vì mọi tỷ lệ tương phản, mọi hiệu ứng glow/blur (thiết kế riêng cho nền tối) sẽ cần thiết kế lại từ đầu. Ước tính đây là hạng mục **L** (Large), không thể làm trong 1 sprint.
3. **Theme sáng có điểm nhấn tối có kiểm soát** (ví dụ: nền sáng chủ đạo, 1-2 section tối làm điểm nhấn thị giác có chủ đích, không phải xuyên suốt) — đây là hướng dung hoà phổ biến trong các sản phẩm AI hiện đại theo đúng tinh thần "có chiều sâu nhưng không phức tạp" mà brief mô tả.

**Tôi không tự ý chọn phương án.** Đây là quyết định định vị thương hiệu, không phải lỗi kỹ thuật — cần đưa vào mục 23 (Quyết định cần Founder phê duyệt) trước khi lên kế hoạch triển khai bất kỳ phương án nào.

---

## 11. Responsive Audit

**Đã xác minh bằng đo lường thực tế (local build, Playwright, 8 viewport: 320/375/390/430/768/1024/1280/1440px):**

### Lỗi P1 xác nhận: Horizontal scroll ở 320–1024px

| Viewport | scrollWidth | clientWidth | Tràn |
|---|---|---|---|
| 320px | 364 | 320 | 44px |
| 375px | 419 | 375 | 44px |
| 390px | 434 | 390 | 44px |
| 430px | 474 | 430 | 44px |
| 768px | 847 | 768 | 79px |
| 1024px | 1057 | 1024 | 33px |
| 1280px | — | — | Không phát hiện |
| 1440px | — | — | Không phát hiện |

**Nguyên nhân gốc đã xác định chính xác qua bisection DOM** (ẩn từng phần tử, đo lại `scrollWidth`, loại trừ phần tử được `overflow-hidden` của tổ tiên chứa lại đúng cách): các lớp glow/blur trang trí dùng `-inset-N` âm (ví dụ `absolute -inset-16 -z-10 ... blur-[80px]`) tại:

- **`PortalPreview.tsx`** — 2 div glow phía sau khung mockup Học viện (`-inset-10`, `-inset-16`), section bao ngoài (`<section id="trai-nghiem-hoc-vien-ai" className="scroll-mt-24 py-9 ...">`) **không có `overflow-hidden`**.
- **`FounderStory.tsx`** — 3 div glow phía sau ảnh founder (`-inset-12`, `-inset-16`, `-inset-8`), section bao ngoài (`<section className="py-9 ...">`) **không có `overflow-hidden`**.

Đối chứng: `Hero.tsx` cũng dùng kỹ thuật glow tương tự (`-inset-10`, `-inset-16`) nhưng section của Hero **có** `overflow-hidden` — nên không gây tràn. Đây là bằng chứng trực tiếp cho thấy chỉ cần thêm `overflow-hidden` vào 2 section còn thiếu là xử lý được (độ phức tạp: **S**).

### Lỗi phụ đã đo được (không phải nguyên nhân chính của tràn ngang tổng thể, nhưng là rủi ro riêng)

- `FinalCTA.tsx`: đoạn văn `<p className="mt-4 whitespace-nowrap ...">` chứa câu dài ("Tôi đã chuẩn bị sẵn tài nguyên, công cụ và lộ trình bên trong Học viện AI. Việc của bạn là bắt đầu.") bị ép hiển thị 1 dòng bằng `whitespace-nowrap` không điều kiện (không có breakpoint). Đo trực tiếp: `scrollWidth` của riêng thẻ `<p>` này là 478px trong khi container chỉ 375px — bản thân đoạn văn này overflow ~103px so với khung chứa, dù thử nghiệm cho thấy đây không phải là nguyên nhân chính tạo ra tràn ngang cấp tài liệu (loại trừ qua thử nghiệm tắt toàn bộ `white-space: nowrap` site-wide, tràn ngang vẫn còn nguyên 44px). Đây là rủi ro **độc lập**, cần sửa riêng.

### Khác

- Không phát hiện console error / page error / runtime error nào ở bất kỳ viewport nào khi tải trang.
- Không kiểm tra được landscape orientation và safe-area (giới hạn công cụ: Playwright viewport emulation không mô phỏng notch/safe-area-inset thực tế của thiết bị iOS).
- Chưa kiểm tra riêng CLS bằng công cụ đo chuyên dụng (xem mục 14, giới hạn Lighthouse).

---

## 12. Accessibility Audit (WCAG 2.2 AA, trong phạm vi kiểm tra được)

**Đã xác minh trong code + đo lường:**

- **H1 duy nhất:** xác nhận trên bản Production thật — đúng 1 thẻ `<h1>` (Hero headline). ✅
- **Heading hierarchy:** theo đúng thứ tự source code, page có 1×H1 → 11×H2 (mỗi section chính) → rải rác H3 (ví dụ mockup "Chào mừng trở lại" trong PortalPreview, lồng đúng cấp dưới H2) → Footer dùng 3×H4 cho tiêu đề cột, **nhảy cấp từ H2 thẳng xuống H4** (bỏ qua H3). Đây là vi phạm best-practice heading hierarchy (không phải lỗi WCAG cấp nghiêm trọng, nhưng nên sửa). *Lưu ý phương pháp: thứ tự chính xác từng heading trên DOM live không thể xác minh đáng tin cậy bằng cách quét thô HTML trả về từ `curl` vì Next.js RSC nhúng cả một bản sao dữ liệu hydrate dạng chuỗi escape trong `<script>` — kết luận về heading hierarchy trong mục này dựa trên đọc trực tiếp source code của từng component, đối chiếu số lượng khớp với tổng số đếm được trên HTML live.*
- **Alt text:** 23/23 thẻ `<img>` trên trang có `alt` khớp tên (logo công cụ) — **100% coverage**, không phát hiện ảnh thiếu `alt`.
- **`lang` attribute:** `<html lang="vi">` — đúng.
- **`:focus-visible`:** khai báo toàn site trong `globals.css` (outline 2px xanh brand, chỉ hiện khi điều hướng bàn phím) — đúng thực hành khuyến nghị.
- **Skip link:** **không tìm thấy** skip-to-content link nào trong `Header.tsx`/`layout.tsx` — người dùng bàn phím/screen reader phải tab qua toàn bộ navigation trước khi vào nội dung chính.
- **Reduced motion:** phần lớn animation trong `globals.css` có block `@media (prefers-reduced-motion: reduce)` tắt transition (đã xác nhận cho `.audience-card`, `.problem-panel`, `.solution-card`, `.reveal-word`...). Framer Motion's `whileInView` animations trong các component (`initial`/`whileInView` opacity+transform) **không** có xử lý tắt theo `prefers-reduced-motion` ở cấp component — chỉ có xử lý ở phần CSS thuần (`.reveal-word`), không bao trùm các animation điều khiển bởi Framer Motion trực tiếp trong JSX.
- **Contrast — phát hiện định lượng (P2):** đo bằng công thức luminance WCAG chính thức, composite đúng alpha qua từng lớp nền, trên local build:

| Vị trí | Chữ | Kích thước | Contrast ratio đo được | Ngưỡng WCAG AA cần | Kết quả |
|---|---|---|---|---|---|
| `EcosystemPillars.tsx:145` | "🔹 Di chuột vào từng card để cảm nhận hiệu ứng 3D nhô lên" | 10px | **1.45:1** | 4.5:1 | ❌ Fail rõ rệt |
| `TrustStats.tsx:48` | "📌 Cộng đồng đang phát triển cùng nhau mỗi ngày" | 12px | **1.45:1** | 4.5:1 | ❌ Fail rõ rệt |
| `TrustStats.tsx:65` | Số liệu phụ (`s.sub`, ví dụ "Từ hoạt động thực") | 10px | **1.53:1** | 4.5:1 | ❌ Fail rõ rệt |
| (Đối chứng) Đoạn văn thân Hero | "Giữa vô số công cụ AI..." | 16px, `text-white` 100% | **20.01:1** | 4.5:1 | ✅ Pass (kiểm chứng phương pháp đo đúng) |

Nguyên nhân: 3 vị trí trên dùng `text-white/10` hoặc `text-white/15` (10–15% độ mờ) trên nền navy tối — về bản chất là "chữ gần như cùng màu với nền", cố ý làm mờ nhẹ cho mục đích thẩm mỹ (ghi chú phụ) nhưng vượt quá xa ngưỡng đọc được. Một trường hợp `text-white/10` khác trong `IntroVideo.tsx:60` **không** phải lỗi vì nằm trong `aria-hidden="true"` (chữ trang trí, screen reader bỏ qua, không mang thông tin thật).
- **Landmark:** có `<header>`, `<main>`, `<footer>` rõ ràng (xác nhận qua DOM). Không thấy landmark `<nav>` tường minh bọc quanh `mainNav` trong `Header.tsx` (menu render trực tiếp trong `<nav>` — cần xác nhận lại, đã thấy `<nav>` bọc trong Header code, ✅ đạt).
- **Màu sắc truyền tải thông tin:** badge FREE/PREMIUM/AFFILIATE trong PortalPreview mockup dùng màu + **text label** đi kèm (không chỉ dựa vào màu) — đạt.
- **Touch target:** đa số nút CTA dùng `px-6 py-3`/`px-8 py-3.5` — ước tính chiều cao ≥ 44px, đạt khuyến nghị tối thiểu; chưa đo chính xác từng nút nhỏ (ví dụ social icon 24×24px trong Footer — **có khả năng dưới 44×44px**, cần đo lại).

---

## 13. SEO và Social Sharing Audit

**Đã xác minh trực tiếp trên `https://voduongai.vercel.app/` (curl, không qua trình duyệt):**

- `<title>`: "VO DUONG AI — Học AI, xây hệ thống, tạo tài sản số" ✅
- `<meta name="description">`: có, súc tích ✅
- Open Graph: đầy đủ `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale` (`vi_VN`), `og:type=website`, **`og:image` động 1200×630 qua `next/og`** (`src/app/opengraph-image.tsx`) — thiết kế đơn giản, đúng thương hiệu (nền navy, logo, tagline). ✅ Đây là điểm cộng, thực thi tốt hơn dự kiến ban đầu.
- Twitter Card: `summary_large_image`, đầy đủ title/description/image ✅
- **Canonical URL: KHÔNG tìm thấy** thẻ `<link rel="canonical">` nào trong HTML trả về. ❌
- **Web manifest: KHÔNG tồn tại** — không có `app/manifest.ts`, không có file `.webmanifest`/`manifest.json` nào trong `public/`, không có thẻ `<link rel="manifest">`. ❌
- Favicon: có `<link rel="icon" href="/icon.svg">` ✅
- **Structured data:** chỉ có **1 schema duy nhất**, type `Person` (tên, mô tả, `sameAs` social links). **Không có `Organization` schema, không có `WebSite` schema.** Với một sản phẩm/hệ sinh thái (không chỉ là trang cá nhân founder), thiếu Organization/WebSite schema là khoảng trống thực sự cho khả năng xuất hiện Knowledge Panel/Sitelinks Search Box.
- **robots.txt** (đã xác nhận khớp 100% giữa code `robots.ts` và Production): `Allow: /`, `Disallow: /admin`, `/admin/`, `/admin/*`, `/portal/checkout`, `/portal/checkout/*`, `/api/`. Sitemap directive trỏ về `https://voduongai.com/sitemap.xml`.
- **sitemap.xml** (đã xác nhận khớp code `sitemap.ts` và Production): liệt kê **~25+ URL cố định + toàn bộ tools/prompts/resources/blog posts động**, trong đó có **~13 URL `/portal/*`** (`/portal`, `/portal/companion`, `/portal/hocvienai`, `/portal/aiworkspace`, `/portal/duan-cohoi`, `/portal/premium`, v.v.).
- **Phát hiện SEO nghiêm trọng (P1):** `robots.txt` **cho phép** crawl `/portal/*` (không nằm trong danh sách `Disallow`), và `sitemap.xml` **chủ động khai báo** các URL `/portal/*` này để Google index — nhưng `middleware.ts` (đã xác minh mục 4) sẽ **redirect 307/302 sang `/login`** cho MỌI request tới `/portal/*` không có session hợp lệ, bao gồm cả Googlebot. Kết quả: toàn bộ ~13+ URL `/portal/*` trong sitemap sẽ được Google ghi nhận là **redirect**, không bao giờ được index với nội dung thật — vừa lãng phí crawl budget, vừa có thể bị Search Console gắn cờ cảnh báo "Trang có chuyển hướng"/"Được gửi nhưng không được lập chỉ mục".
- **Phát hiện SEO nghiêm trọng thứ 2 (P1), đã xác minh bằng `curl`:** domain chính thức `voduongai.com` (dùng làm `metadataBase`, mọi `og:url`/`og:image`/`twitter:image`, JSON-LD `url`, và đích của `Sitemap:` trong robots.txt) **hiện không phân giải được** (`curl https://voduongai.com/` → connection failure, không timeout do proxy — đã kiểm tra cả `www.`). Trong khi trang đang chạy thật tại `voduongai.vercel.app`, mọi metadata chia sẻ mạng xã hội (OG image, canonical ngầm định) đang trỏ về một domain **chết**. Bất kỳ ai chia sẻ link `voduongai.vercel.app` lên Facebook/Zalo lúc này nhiều khả năng sẽ **không thấy ảnh preview** vì Facebook/Zalo sẽ cố tải `og:image` từ `voduongai.com` (không phản hồi) thay vì từ domain đang chạy thật.
- Heading structure, internal linking, anchor text: đã đánh giá ở mục 12/8.
- Không phát hiện metadata "staging" rò rỉ kiểu literal chuỗi "vercel.app"/"localhost" trong title/description — điểm sạch.

---

## 14. Performance Audit

**Giới hạn quan trọng:** không chạy được Lighthouse thực đo (xem mục 3, Giới hạn môi trường). Toàn bộ mục này là **static/code-based audit**, không có con số LCP/INP/CLS/TTFB thực đo từ công cụ.

**Đã xác minh trong code:**

- **Toàn bộ 15/15 file trong `src/components/home/` là Client Component** (`"use client"`), 13/15 import `framer-motion`. Trong số này, ít nhất 7 file (`EcosystemPillars`, `ToolsIUse`, `AudienceProblem`, `Roadmap`, `TrustStats`, `FounderStory`, `FinalCTA`) chỉ cần `"use client"` **vì hiệu ứng cuộn trang (`whileInView`) mới thêm gần đây** — nội dung bên trong các file này hoàn toàn tĩnh, về nguyên tắc có thể giữ dạng Server Component nếu tách phần animation ra một client-wrapper nhỏ riêng. Hiện tại, toàn bộ nội dung + logic của 12 section đều buộc phải gửi xuống trình duyệt dưới dạng JavaScript để hydrate, thay vì tận dụng khả năng render tĩnh không cần JS của Next.js App Router cho phần lớn nội dung marketing thuần tuý.
- **Trang chủ không thể static/ISR:** `layout.tsx` gọi `getSiteSettings()` (truy vấn Supabase) ở request-time cho mọi lần tải trang → xác nhận qua header Production thật `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`. Điều này có nghĩa **mọi lượt truy cập trang chủ đều phải chờ 1 round-trip Supabase** trước khi HTML được trả về, thay vì phục vụ từ CDN cache tĩnh — ảnh hưởng trực tiếp tới TTFB.
- **Font:** không tải font ngoài — tốt cho performance (không có request/blocking font nào ngoài hệ thống).
- **Ảnh:** phần lớn dùng `next/image` (responsive `srcSet`, `loading="lazy"`, tối ưu qua `/_next/image`). `ToolsIUse.tsx` có ít nhất 1 vị trí dùng `<Image>` nhưng nguồn `.svg` (một số icon `.ico` khác được tối ưu qua loader, một số `.svg` không cần resize nên hợp lý giữ nguyên — không phải lỗi).
- **Marquee/animation liên tục:** `ToolsIUse.tsx` chạy CSS animation marquee vô hạn (`animation: ... infinite`), `Ecosystem.tsx` chạy nhiều `motion.div` với `animate` lặp vô hạn (solar-system planets, particles) — các animation chạy liên tục vô thời hạn (không dừng khi ra khỏi viewport) có thể tiêu tốn CPU/pin liên tục kể cả khi user đã cuộn qua khỏi section đó, nếu không có cơ chế pause khi ngoài viewport.
- **Bundle:** không đo được kích thước bundle thực tế (cần Production build + `next build` để phân tích, không thực hiện vì đây là hạng mục audit không triển khai). Đề xuất chạy `next build` (không deploy) trong một sprint kỹ thuật riêng để lấy số liệu bundle chính xác.
- **Hydration:** không phát hiện console warning/error nào (kể cả hydration mismatch warning) khi tải trang ở bất kỳ viewport nào trong lần kiểm tra cục bộ.

---

## 15. Security/Privacy Audit (phạm vi Landing Page)

**Đã xác minh trong code:**

- Không phát hiện API key/secret nào bị hardcode trong bất kỳ file Landing Page nào đã đọc.
- Biến môi trường dùng trong code Landing Page: chỉ `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GA_ID` — đều là biến `NEXT_PUBLIC_*` cố ý public (anon key Supabase là thiết kế an toàn tiêu chuẩn khi có Row Level Security phía sau, **không** thuộc phạm vi audit này để xác minh RLS).
- **Không có form thu thập email/thông tin cá nhân nào trên Landing Page hiện tại** (nút "🎁 Nhận tài liệu AI" chưa gắn form — xem mục 8) → không có rủi ro validation/spam ở form vì chưa tồn tại.
- Google Analytics: chỉ inject script khi `NEXT_PUBLIC_GA_ID` tồn tại — không thấy cơ chế cookie-consent banner nào trước khi GA chạy. Với người dùng tại Việt Nam, đây thường không bắt buộc theo luật hiện hành nhưng đáng lưu ý nếu mở rộng thị trường.
- External links (Footer social, `href={s.href}`): **chưa xác nhận được** `rel="noopener noreferrer"` hoặc `target="_blank"` tường minh trên các thẻ `<a>` social trong `Footer.tsx` — cần bổ sung `rel="noopener"` tối thiểu nếu các link này mở tab mới, để tránh rủi ro `window.opener` (tabnabbing).
- Không phát hiện thông tin nhạy cảm trong bất kỳ phần code/comment nào đã đọc.
- Không thực hiện pentest hay gửi dữ liệu thật — đúng giới hạn được yêu cầu.

---

## 16. Navigation và Broken Link Audit

**Đã xác minh:** toàn bộ route đích được liên kết từ Landing Page (`/login`, `/blogai`, `/privacy`, `/terms`, `/refund-policy`, và toàn bộ `/portal/*` được tham chiếu) **đều có file `page.tsx` tồn tại** trong repository — không có broken link ở cấp routing.

- Không phát hiện link nào trỏ về `localhost` hay tên miền staging bị lộ trong nội dung UI.
- Không phát hiện link dùng `href="#"` không hoạt động.
- Tên trải nghiệm chính thức "Học viện" được dùng nhất quán trong toàn bộ nhãn UI hướng tới người dùng (Header, Footer, CTA) — **không** phát hiện chỗ nào gọi lại là "Portal" trong copy hiển thị, dù route kỹ thuật vẫn giữ tiền tố `/portal/` (đúng theo lưu ý không đổi tên trải nghiệm).
- Không kiểm tra redirect chain nhiều bước (out of scope do không thể trace qua trình duyệt tới domain sống — xem giới hạn mục 3), nhưng đã xác nhận qua middleware code: `/portal/*` chỉ redirect **1 bước** tới `/login`, không có chuỗi redirect lồng nhau.

---

## 17. Code Quality Audit (phạm vi Landing Page)

**Đã xác minh:**

- `npx tsc --noEmit` trên toàn repo: **0 lỗi**.
- `npx eslint` trên toàn bộ `src/components/home/*.tsx`, `src/components/site/*.tsx`, `src/app/page.tsx`, `src/app/layout.tsx`: **0 lỗi, 0 cảnh báo**.
- Không phát hiện component nào quá lớn tới mức khó bảo trì trong phạm vi Landing Page (file lớn nhất `QuizAssessment.tsx` ~373 dòng, `PortalPreview.tsx` ~342 dòng — chấp nhận được cho mức độ tương tác của 2 component này).
- **Hardcode màu:** nhiều component dùng `style={{ color: "#FF6B35" }}` hoặc hằng số cục bộ `const ACCENT = "#FF6B35"` lặp lại ở **6 file khác nhau** (`Roadmap.tsx`, `AudienceProblem.tsx`, `QuizAssessment.tsx`, `TrustStats.tsx`, `FinalCTA.tsx`, `IntroVideo.tsx`/`EcosystemPillars.tsx` dùng `text-brand-orange` Tailwind utility ở một số nơi khác) thay vì 1 nguồn duy nhất. Ngoài ra, `--color-brand-orange` trong `@theme` (`#FF7A00`) và giá trị cam thực tế đang dùng lặp lại (`#FF6B35`) là **2 mã cam khác nhau cùng tồn tại song song** — không sai về mặt hiển thị (khác biệt nhỏ, khó nhận ra bằng mắt) nhưng là **nợ kỹ thuật** cần hợp nhất về 1 token màu cam duy nhất trong design system.
- **Magic numbers:** nhiều giá trị `rounded-[24px]`, `rounded-[1.2rem]`, `-inset-16`, kích thước blur tuỳ ý (`blur-[80px]`) — chấp nhận được cho hiệu ứng trang trí, nhưng token `--radius-*` đã khai báo sẵn trong `@theme` (`--radius-xs` đến `--radius-2xl`) **không được dùng nhất quán** trong các component landing page mới, dù comment trong `globals.css` ghi rõ ý định "dùng các token này thay vì hardcode... cho component MỚI từ nay trở đi".
- Không phát hiện unused import, duplicate responsive rule bất thường, hay z-index conflict rõ ràng trong phạm vi đã đọc.
- **Quản lý nội dung tương lai qua CMS:** hiện tại **0% nội dung copy của Landing Page** có thể chỉnh qua Admin CMS — toàn bộ headline, mô tả, số liệu, danh sách bước đều hardcode trong TSX. Nếu định hướng tương lai là cho phép chỉnh nội dung qua Website Workspace/Admin, đây là khối lượng công việc đáng kể (mỗi section cần thiết kế schema nội dung + form quản trị riêng).

---

## 18. Danh sách phát hiện P0–P3

| ID | Nhóm | Mức độ | Vị trí | File/Component | Viewport | Mô tả | Bằng chứng | Tác động | Nguyên nhân gốc | Khuyến nghị | Độ phức tạp | Trạng thái xác minh |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F-01 | Responsive | **P1** | PortalPreview, FounderStory | `PortalPreview.tsx`, `FounderStory.tsx` | 320–1024px | Trang bị tràn ngang (horizontal scroll) do glow div `-inset-N` không được `overflow-hidden` chứa | Đo `scrollWidth` 44–79px vượt `clientWidth` ở 6/8 viewport; bisection xác định chính xác 2 file | Thanh cuộn ngang xuất hiện trên mọi thiết bị mobile/tablet — trải nghiệm production-blocking | Section bao ngoài thiếu `overflow-hidden` (khác với `Hero.tsx` cùng kỹ thuật nhưng có `overflow-hidden`) | Thêm `overflow-hidden` vào 2 section | S | Đã xác minh trong code + đo lường |
| F-02 | CTA/Conversion | **P1** | FinalCTA | `FinalCTA.tsx` | Mọi viewport | Nút "🎁 Nhận tài liệu AI" không có `href`/`onClick` — click không phản hồi | Đọc code trực tiếp | CTA phụ tại vị trí chuyển đổi quan trọng nhất của trang hoàn toàn chết | Chưa gắn hành vi khi thêm nút | Gắn form/link thật, hoặc tạm ẩn nút | S–M (tuỳ hành vi mong muốn) | Đã xác minh trong code |
| F-03 | SEO | **P1** | Toàn site | `sitemap.ts`, `middleware.ts` | — | Sitemap khai báo ~13+ URL `/portal/*` bị middleware redirect sang `/login` cho người dùng/crawler chưa đăng nhập | Đối chiếu `sitemap.ts` với `middleware.ts`/`protected-routes.ts`; xác nhận sitemap.xml Production khớp code | Lãng phí crawl budget, rủi ro cảnh báo Search Console, nội dung `/portal/*` không thể index | Sitemap được sinh từ danh sách route tĩnh, không loại trừ route auth-gated | Loại bỏ toàn bộ `/portal/*` khỏi `sitemap.ts`, chỉ giữ URL công khai thật sự | S | Đã xác minh trong code + Production |
| F-04 | SEO | **P1** | Toàn site | `site.ts` (`siteConfig.url`), `robots.ts` | — | Domain chính thức `voduongai.com` (dùng cho canonical/OG/JSON-LD/sitemap directive) hiện không phân giải | `curl https://voduongai.com/` thất bại (connection failure), đối chiếu với `voduongai.vercel.app` đang chạy thật | Chia sẻ link mạng xã hội từ bản hiện tại sẽ không hiện ảnh preview (OG image trỏ domain chết) | Domain custom chưa trỏ DNS / chưa gắn vào Vercel project | Founder xác nhận tiến độ domain; tạm thời cân nhắc set `siteConfig.url` theo domain đang hoạt động cho tới khi domain chính thức live | S (kỹ thuật) / phụ thuộc bên ngoài (domain) | Đã xác minh qua curl |
| F-05 | Brand/Strategic | **P1** | Toàn Landing Page | Toàn bộ 12 section + `layout.tsx` | — | Landing Page dùng dark-theme (nền navy, chữ trắng) xuyên suốt, mâu thuẫn với định hướng "nền sáng/trắng là hệ nền chính" trong bối cảnh audit | Đọc `globals.css` (`.mesh-navy`, `--background`/`--foreground` bị ghi đè bởi mesh-navy phủ toàn màn hình) + xác nhận trực quan mọi section | Ảnh hưởng toàn bộ hệ thống thiết kế, không thể "sửa nhanh" nếu cần đổi hướng | Landing Page được xây theo định hướng dark-theme ở các vòng thiết kế trước; bối cảnh audit lần này nêu định hướng khác | **Cần Founder quyết định** giữ dark-theme hay chuyển light-theme (xem mục 10, 23) — KHÔNG tự ý sửa | L (nếu đổi theme) / 0 (nếu giữ nguyên + cập nhật lại brief) | Đã xác minh trong code, đây là nhận định chiến lược cần phê duyệt |
| F-06 | Accessibility | P2 | EcosystemPillars, TrustStats | `EcosystemPillars.tsx:145`, `TrustStats.tsx:48,65` | — | 3 vị trí chữ dùng `text-white/10`/`text-white/15` có contrast ratio đo được 1.45–1.53:1, dưới xa ngưỡng WCAG AA 4.5:1 | Đo bằng công thức luminance WCAG, composite alpha qua canvas — số liệu cụ thể trong mục 12 | Nội dung phụ (ghi chú, số liệu) gần như không đọc được với người khiếm thị nhẹ hoặc màn hình chói sáng | Dùng opacity quá thấp cho hiệu ứng "mờ nhẹ" thẩm mỹ | Tăng opacity tối thiểu lên mức đạt 4.5:1 (ước tính cần ≥40-45% trên nền hiện tại) hoặc đổi màu | S | Đã xác minh bằng đo lường |
| F-07 | SEO | P2 | Toàn site | `layout.tsx` | — | Không có thẻ `<link rel="canonical">` | Kiểm tra HTML Production trực tiếp | Rủi ro trùng lặp nội dung khi có query string/trailing slash khác nhau được index riêng | Chưa cấu hình `alternates.canonical` trong `generateMetadata` | Thêm `alternates: { canonical: ... }` vào metadata | S | Đã xác minh trên Production |
| F-08 | SEO/PWA | P2 | Toàn site | `app/` | — | Không có web manifest (`manifest.ts`/`.webmanifest`) | Kiểm tra HTML Production + filesystem | Không hỗ trợ "Add to Home Screen", thiếu tín hiệu PWA cơ bản | Chưa tạo file | Thêm `app/manifest.ts` | S | Đã xác minh |
| F-09 | SEO | P2 | Toàn site | JSON-LD trong `layout.tsx` | — | Chỉ có schema `Person`, thiếu `Organization`/`WebSite` | Kiểm tra JSON-LD Production trực tiếp | Giảm khả năng nhận diện thực thể thương hiệu (khác với thực thể cá nhân founder) trên Google | Chỉ triển khai 1 loại schema | Bổ sung `Organization` + `WebSite` schema | S | Đã xác minh |
| F-10 | UX/CTA | P2 | Footer | `Footer.tsx` | — | 9 link Footer trỏ thẳng `/portal/*` (auth-gated) không có dấu hiệu báo trước cần đăng nhập | Đọc code + đối chiếu middleware | Người dùng ẩn danh bị bất ngờ chuyển sang màn hình đăng nhập | Thiết kế link trực tiếp, không qua lớp "cần đăng nhập" | Thêm icon khoá nhỏ hoặc tooltip, hoặc trỏ về section landing tương ứng nếu có | S | Đã xác minh trong code |
| F-11 | Responsive | P2 | FinalCTA | `FinalCTA.tsx` | ≤430px chủ yếu | Đoạn văn CTA cuối dùng `whitespace-nowrap` không điều kiện cho câu dài, tự overflow 103px so với khung chứa | Đo `scrollWidth` riêng phần tử = 478px vs container 375px | Có thể bị cắt/tràn tại các viewport rất hẹp hoặc font size lớn hơn (user zoom/accessibility text-size) | `whitespace-nowrap` không có breakpoint | Bỏ `whitespace-nowrap` hoặc giới hạn `sm:` trở lên | S | Đã xác minh bằng đo lường |
| F-12 | Performance | P2 | Toàn Landing Page | 15/15 file `src/components/home/*.tsx` | — | 100% section là Client Component, phần lớn chỉ vì hiệu ứng `whileInView` | Đọc code, đếm `"use client"` | Tăng JS phải hydrate cho toàn bộ trang marketing tĩnh | Thiết kế thêm hiệu ứng cuộn trang ở các lượt chỉnh sửa trước dùng Framer Motion trực tiếp trong từng section | Tách phần hiệu ứng cuộn thành client-wrapper nhỏ, giữ phần nội dung là Server Component | M | Đã xác minh trong code |
| F-13 | Performance | P2 | Toàn site | `layout.tsx`, `site-settings.ts` | — | Trang chủ không static/ISR do gọi Supabase mỗi request | Header `Cache-Control` Production + đọc code | Mọi lượt tải trang chủ phải chờ round-trip Supabase, ảnh hưởng TTFB | `getSiteSettings()` gọi trực tiếp trong `layout.tsx` không cache | Cân nhắc ISR/cache cho site-settings (ví dụ revalidate theo thời gian) | M | Đã xác minh |
| F-14 | Code Quality | P2 | Toàn Landing Page | 6+ file | — | 2 mã màu cam khác nhau cùng tồn tại (`--color-brand-orange: #FF7A00` token vs `#FF6B35` hardcode lặp lại 6 nơi) | Grep trực tiếp trong code | Nợ kỹ thuật, khó bảo trì design system, rủi ro lệch màu nhỏ khi chỉnh sửa sau này | Token cam gốc không được cập nhật khi "unify" màu cam ở các lượt chỉnh sửa trước | Hợp nhất về 1 token cam duy nhất trong `@theme` | S | Đã xác minh trong code |
| F-15 | Content | P2 | FounderStory, JSON-LD, `<title>` | Nhiều file | — | Thương hiệu được viết song song "VO DUONG AI" và "Võ Đương AI" | Đọc code + Production title | Có thể là chủ đích (brand vs founder), cần Founder xác nhận | Không rõ, cần xác nhận | Founder xác nhận quy ước; chuẩn hoá nếu cần | S | Đã xác minh sự tồn tại song song, chưa xác minh được đây có phải lỗi hay chủ đích |
| F-16 | Content | P3 | TrustStats | `TrustStats.tsx` | — | Số liệu (10K+, 97%, v.v.) không có nguồn/ngày cập nhật, không thể xác minh | Đọc code | Rủi ro cường điệu nếu số liệu không còn đúng | Hardcode tĩnh | Founder xác nhận số liệu hiện hành, cân nhắc cập nhật định kỳ qua CMS | S | Không thể xác minh — cần Founder |
| F-17 | Accessibility | P3 | Header/layout | Toàn site | — | Không có skip-to-content link | Đọc code | Người dùng bàn phím/screen reader phải tab qua toàn bộ nav mỗi trang | Chưa triển khai | Thêm skip link đầu `<body>` | S | Đã xác minh |
| F-18 | Accessibility | P3 | Footer | `Footer.tsx` | — | Heading nhảy cấp H2 → H4 (bỏ qua H3) ở cột Footer | Đọc code (`<h4>` trong Footer) | Vi phạm best-practice heading, không phải lỗi WCAG cứng | Dùng H4 cho tiêu đề cột nhỏ | Đổi thành H3 hoặc phần tử không-heading có style tương đương | S | Đã xác minh |
| F-19 | Security | P3 | Footer | `Footer.tsx` | — | Chưa xác nhận `rel="noopener noreferrer"` trên external link | Đọc code | Rủi ro tabnabbing nhẹ nếu các link này `target="_blank"` | Thiếu thuộc tính | Bổ sung `rel="noopener noreferrer"` cho mọi external link mở tab mới | S | Cần xác minh thêm |
| F-20 | UX | P3 | Hero, Footer, FinalCTA | Nhiều CTA | — | CTA "vào Học viện" có 2 kiểu điểm đến khác nhau (`/login` trực tiếp vs `/portal/hocvienai` rồi mới redirect) | Đọc code | Không gây lỗi (middleware xử lý đúng) nhưng thiếu nhất quán | Viết CTA độc lập theo từng lượt chỉnh sửa | Thống nhất 1 kiểu điểm đến | S | Đã xác minh |
| F-21 | Performance | P3 | ToolsIUse, Ecosystem | 2 file | — | Animation marquee/solar-system chạy vô hạn, không rõ có pause khi ngoài viewport | Đọc code | Tiêu tốn CPU/pin không cần thiết khi section không hiển thị | Animation `infinite` không kèm `IntersectionObserver` pause | Cân nhắc pause animation khi section ngoài viewport | M | Đã xác minh trong code, chưa đo tác động thực tế pin/CPU |

---

## 19. Production Readiness Scorecard

| Hạng mục | Điểm (/10) | Ghi chú |
|---|---|---|
| Product positioning | 6.5 | Định vị rõ nhưng mâu thuẫn màu nền với brief mới (F-05) |
| Brand clarity | 6.5 | Tên thương hiệu 2 cách viết song song (F-15), cần chuẩn hoá |
| Content/messaging | 7.5 | Nội dung mạnh, đúng nỗi đau; thứ tự section chưa tối ưu |
| Information architecture | 6.5 | Trùng lặp khái niệm hệ sinh thái ở 4 section |
| Visual design | 6 | Nhất quán nội bộ tốt, nhưng mâu thuẫn định hướng thương hiệu tổng thể |
| UX | 7 | Funnel rõ, một vài điểm rơi (CTA chết, footer auth-gated bất ngờ) |
| Conversion | 6.5 | CTA rõ nhưng có 1 CTA chết ở vị trí quan trọng nhất |
| Responsive | 6 | Lỗi tràn ngang xác nhận trên 6/8 viewport phổ biến (P1, sửa nhanh) |
| Accessibility | 6.5 | Nền tảng tốt (focus-visible, alt text 100%, 1 H1), nhưng có contrast fail đo được |
| SEO | 6 | Kỹ thuật cơ bản tốt (OG động, sitemap, robots) nhưng có 2 lỗi P1 (domain chết, sitemap auth-gated) |
| Performance | 6 | Không đo được thực tế; static audit cho thấy toàn client-component + no-cache SSR là rủi ro thực |
| Technical quality | 8 | Code sạch tuyệt đối (0 lỗi TS/ESLint), kiến trúc rõ ràng |
| Maintainability | 6.5 | Nợ kỹ thuật nhỏ (token màu trùng lặp), 0% nội dung qua CMS |
| Security/privacy | 7.5 | Không phát hiện rò rỉ secret, chưa có form rủi ro (vì CTA form chưa tồn tại) |
| Production readiness (tổng hợp) | **6.6/10** | Xem kết luận bên dưới |

**Phần trăm hoàn thiện ước tính: 68–72%.**
**Mức độ tin cậy của đánh giá:** Cao đối với các mục Architecture/Code Quality/Responsive/SEO-kỹ thuật (xác minh trực tiếp bằng code + đo lường). Trung bình đối với Performance (không đo thực tế được, chỉ static audit). Cao đối với Content/UX (đọc toàn bộ nội dung thật) nhưng các con số hiệu quả chuyển đổi thực tế **chưa thể đo** (không có dữ liệu traffic thật).

**Kết luận: CONDITIONALLY READY.**

Không phải NOT READY — kiến trúc, code quality, và phần lớn nội dung đã ở mức Production thực sự. Không phải READY FOR PRODUCTION ngay — vì có 5 phát hiện P1 (F-01 đến F-05) cần xử lý hoặc ít nhất được Founder ra quyết định rõ ràng (đặc biệt F-05, quyết định màu nền, có thể thay đổi toàn bộ lộ trình tiếp theo) trước khi gắn domain chính thức và đưa người dùng thật vào ồ ạt.

**Điều kiện để chuyển sang READY FOR PRODUCTION:**
1. Sửa xong F-01 (tràn ngang) — kỹ thuật thuần, không cần quyết định thiết kế.
2. Xử lý F-02 (CTA chết) — gắn hành vi thật hoặc ẩn tạm.
3. Xử lý F-03, F-04 (sitemap auth-gated, domain chết) — có thể làm ngay hoặc chờ domain lên.
4. **Founder ra quyết định rõ ràng về F-05** (giữ dark-theme hay chuyển light-theme) — đây là điều kiện quan trọng nhất vì nó định hình liệu các phát hiện P2 (contrast, token màu) có cần làm lại từ đầu theo theme mới hay không.

---

## 20. Đề xuất cấu trúc Landing Page mục tiêu (chỉ đề xuất, chưa triển khai)

```
1. Hero                     — giữ, bổ sung 1 câu ngắn trả lời rõ "dành cho ai" ngay trong Hero
2. AudienceProblem           — DI CHUYỂN lên vị trí #2 (ngay sau Hero) — xác nhận đúng đối tượng sớm
3. IntroVideo                — giữ nguyên vị trí tương đối, sau khi đã xác nhận đối tượng
4. PortalPreview              — giữ (sau khi sửa lỗi tràn ngang F-01)
5. FounderStory               — DI CHUYỂN lên sớm hơn (trước khi vào Roadmap/TrustStats) — xây niềm tin trước khi đi sâu
6. EcosystemPillars  ─┐
7. Roadmap            ├─ CÂN NHẮC GỘP/RÚT GỌN còn 2 trong 4 (xem mục 5) — tránh lặp khái niệm "hệ sinh thái"
8. Ecosystem (solar) ─┘
9. TrustStats                 — giữ, cân nhắc thêm nguồn/ngày cho số liệu
10. QuizAssessment             — giữ nhưng đặt SAU AudienceProblem/FounderStory để có ngữ cảnh
11. ToolsIUse                  — giữ nguyên, vị trí hợp lý (bằng chứng cụ thể trước CTA)
12. FinalCTA                   — giữ, sửa CTA phụ chết (F-02)
```

Đây là đề xuất dựa trên nguyên tắc giảm tải nhận thức và củng cố niềm tin trước khi yêu cầu hành động — **không phải** một cấu trúc bắt buộc, cần thảo luận và phê duyệt trước khi triển khai bất kỳ thay đổi thứ tự nào.

---

## 21. Recommended Remediation Roadmap

Xem chi tiết đầy đủ (mục tiêu, phạm vi, dependency, acceptance criteria, rủi ro, ước tính) tại `docs/website/VO_DUONG_AI_LANDING_PAGE_AUDIT_BACKLOG.md`. Tóm tắt:

- **Sprint 0** — P0/P1 Release Blockers: F-01, F-02, F-03, F-04, và chốt quyết định F-05.
- **Sprint 1** — Product Message và Conversion: cấu trúc lại thứ tự section (mục 20), sửa F-10, F-15, F-16, F-20.
- **Sprint 2** — Visual System và Responsive: triển khai quyết định F-05 (nếu đổi theme) hoặc chuẩn hoá token màu F-14, sửa F-11.
- **Sprint 3** — SEO, Accessibility và Performance: F-06, F-07, F-08, F-09, F-17, F-18, F-19.
- **Sprint 4** — Technical Cleanup và CMS Readiness: F-12, F-13, thiết kế schema nội dung cho CMS.
- **Sprint 5** — Final Visual QA và Production Verification: chạy lại toàn bộ audit responsive/accessibility/SEO sau khi mọi sprint hoàn tất, đo Lighthouse thực tế trên Production.

---

## 22. Quick Wins

Các mục có thể sửa trong vài giờ, tác động tức thì, độ phức tạp S, không phụ thuộc quyết định chiến lược:

- F-01: thêm `overflow-hidden` vào section của `PortalPreview.tsx` và `FounderStory.tsx`.
- F-02: ẩn tạm nút "🎁 Nhận tài liệu AI" cho tới khi có hành vi thật, tránh CTA chết.
- F-03: loại `/portal/*` khỏi `sitemap.ts`.
- F-06: tăng opacity 3 vị trí contrast fail lên mức đạt AA.
- F-07: thêm canonical URL vào metadata.
- F-11: bỏ `whitespace-nowrap` không điều kiện trong `FinalCTA.tsx`.
- F-17: thêm skip-to-content link.
- F-18: đổi H4 thành H3 trong Footer.

---

## 23. Những quyết định cần Founder phê duyệt

1. **[Quan trọng nhất] F-05 — Màu nền chủ đạo:** giữ dark-theme hiện tại (nhất quán, đã hoàn thiện) hay chuyển sang light-theme theo đúng brief audit này (redesign toàn diện, hạng mục Large)? Quyết định này chi phối gần như mọi sprint tiếp theo.
2. **F-04 — Domain:** tiến độ trỏ DNS cho `voduongai.com` — có nên tạm sửa `siteConfig.url` để trỏ về domain đang hoạt động (`voduongai.vercel.app` hoặc domain tạm khác) cho tới khi domain chính thức sẵn sàng?
3. **F-15 — Tên thương hiệu:** "VO DUONG AI" và "Võ Đương AI" dùng song song có phải chủ đích (brand vs. cá nhân founder) hay cần chuẩn hoá về 1 cách viết?
4. **F-16 — Số liệu TrustStats:** các con số (10K+, 97%, 4.9/5...) hiện có còn chính xác? Có nguồn nào để trích dẫn không?
5. **Mục 20 — Thứ tự section:** có phê duyệt đề xuất cấu trúc lại (đưa AudienceProblem/FounderStory lên sớm hơn, gộp bớt 4 section "hệ sinh thái") hay không?
6. **F-02 — CTA "Nhận tài liệu AI":** nội dung/lead magnet thật sự là gì? Cần trước khi gắn hành vi cho nút.
7. **Mục 17 — CMS:** có cần đầu tư để nội dung Landing Page (không chỉ site-settings) chỉnh được qua Admin CMS trong giai đoạn tới, hay tiếp tục hardcode?

---

## 24. Những giới hạn của lần audit này

1. Không thể mở trình duyệt trực tiếp tới `voguongai.vercel.app` do giới hạn mạng của môi trường thực thi (đã nêu chi tiết ở mục 3) — mọi kiểm tra cần trình duyệt (responsive, console error, contrast đo bằng canvas, click-through) thực hiện trên local dev server build từ cùng commit, **không** phải trực tiếp trên bản deploy. Mọi kiểm tra chỉ cần HTTP (headers, HTML, sitemap, robots, meta tags) được lấy trực tiếp từ Production/Staging thật qua `curl`.
2. Không chạy được Lighthouse (cùng giới hạn mạng, và chủ động không chạy nhắm vào `next dev` vì sẽ cho số liệu sai lệch, gây hiểu lầm) — mục Performance là static/code-based audit, không có LCP/INP/CLS/TTFB đo thực tế.
3. Không đo được landscape orientation, safe-area thiết bị thật, hay hành vi trên trình duyệt/hệ điều hành khác ngoài Chromium.
4. Không xác minh được tính chính xác của số liệu nội dung (TrustStats) — không có nguồn dữ liệu nào trong code để đối chiếu.
5. Không audit sâu bên trong `/portal/*` hay `/admin/*` theo đúng giới hạn phạm vi được giao — chỉ xác nhận route tồn tại và hành vi redirect ở middleware.
6. Không kiểm tra Row Level Security/policy phía Supabase — nằm ngoài phạm vi Landing Page.
7. Không đo bundle size/JavaScript thực tế qua `next build` (không thực hiện build Production trong phạm vi audit không-triển-khai này).
8. Đánh giá "cognitive load"/trùng lặp khái niệm (mục 5, 7) là **nhận định chuyên môn**, không phải phép đo định lượng — cần kiểm chứng thêm bằng dữ liệu hành vi người dùng thật (heatmap, scroll depth) khi có traffic.

---

## 25. Final Recommendation

Landing Page VO DUONG AI có nền tảng kỹ thuật vững (code sạch, kiến trúc rõ, routing đúng) và nội dung có chiều sâu, đúng nỗi đau người dùng — đây là một landing page **đã được đầu tư nghiêm túc**, không phải bản nháp. Điều kiện để tiến lên giai đoạn tiếp theo không nằm ở việc "làm thêm" mà ở việc **giải quyết dứt điểm 5 phát hiện P1** (F-01 đến F-05) và có **một quyết định rõ ràng từ Founder về định hướng màu nền** trước khi đầu tư thêm vào visual polish — vì mọi công sức polish thêm trên nền dark-theme hiện tại có thể phải làm lại nếu quyết định cuối cùng là chuyển sang light-theme.

Khuyến nghị: xử lý Sprint 0 (P0/P1) trong 1–3 ngày làm việc, đồng thời đưa mục 23 (7 quyết định) lên Founder/PMO ngay để không chặn tiến độ các sprint tiếp theo. Sau khi Sprint 0 hoàn tất và mục 23.1 (màu nền) có quyết định, Landing Page có thể an toàn gắn domain chính thức và bắt đầu tiếp nhận traffic thật ở quy mô kiểm soát (soft launch), song song với việc triển khai Sprint 1–3 để đạt chất lượng Production đầy đủ.

**Feature Freeze:** chưa nên áp dụng — vẫn còn P1 chưa xử lý và 1 quyết định chiến lược (F-05) chưa chốt. Có thể cân nhắc Feature Freeze cho các section KHÔNG bị ảnh hưởng bởi quyết định màu nền (ví dụ: cấu trúc route, CTA logic, SEO metadata) ngay từ bây giờ, trong khi phần visual chờ quyết định.

---

## Phụ lục — 16 câu hỏi cần trả lời dứt khoát

1. **Landing Page hiện tại được xây bằng công nghệ gì?**
   Next.js 16.2.9 (App Router, không phải Pages Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion. Đã xác minh trực tiếp trong `package.json` và cấu trúc `src/app/`.

2. **Landing Page hiện đã hoàn thiện khoảng bao nhiêu phần trăm?**
   **68–72%** theo đánh giá tổng hợp (mục 19). Nền tảng kỹ thuật và nội dung đã ở mức cao (code sạch, đúng nỗi đau người dùng); phần còn thiếu chủ yếu là 5 phát hiện P1 và 1 quyết định chiến lược về màu nền.

3. **Có đủ điều kiện gắn domain chính thức và tiếp nhận người dùng thật chưa?**
   **Chưa nên ngay lập tức.** Cần xử lý xong Sprint 0 (F-01 đến F-04) trước — đặc biệt F-04 (domain hiện không phân giải, ảnh hưởng trực tiếp tới chia sẻ mạng xã hội) và F-03 (sitemap khai báo URL auth-gated). Sau Sprint 0, có thể soft-launch ở quy mô kiểm soát trong khi tiếp tục Sprint 1–3.

4. **Ba vấn đề nghiêm trọng nhất hiện nay là gì?**
   (a) F-05 — mâu thuẫn chiến lược giữa dark-theme hiện tại và định hướng "nền sáng làm chủ đạo" trong brief audit này. (b) F-01 — lỗi tràn ngang xác nhận trên 6/8 viewport phổ biến. (c) F-02 — CTA phụ "Nhận tài liệu AI" không hoạt động, nằm ngay tại vị trí chuyển đổi quan trọng nhất của trang.

5. **Hero hiện tại có nói rõ VO DUONG AI là gì không?**
   Có nói khá rõ "đây là gì" và "vấn đề gì" (đúng 2/4 tiêu chí trong khung đánh giá), nhưng **chưa nêu rõ "dành cho ai"** ngay tại Hero — thông tin này chỉ xuất hiện rõ ràng ở AudienceProblem, section thứ 7/12 trên trang.

6. **CTA chính nên hướng người dùng tới đâu?**
   Hiện tại đã nhất quán phần lớn về mặt đích cuối cùng (`/login`, sau đó vào Học viện), nhưng có 1 điểm chưa nhất quán: Hero CTA trỏ thẳng `/portal/hocvienai` (rồi mới bị middleware redirect) trong khi Header/FinalCTA trỏ thẳng `/login`. Khuyến nghị thống nhất về 1 kiểu (F-20).

7. **Cấu trúc section hiện tại có đúng thứ tự thuyết phục không?**
   Chưa tối ưu. AudienceProblem (xác nhận đúng đối tượng) và FounderStory (xây niềm tin) hiện đặt khá muộn trong hành trình, trong khi về nguyên tắc phễu chuyển đổi, 2 yếu tố này nên xuất hiện sớm hơn. Xem đề xuất cụ thể ở mục 20.

8. **Có section nào nên bỏ, gộp hoặc di chuyển không?**
   Không đề xuất bỏ hẳn section nào. Đề xuất **gộp/rút gọn** 4 section đang lặp khái niệm "hệ sinh thái" (EcosystemPillars, Roadmap, TrustStats, Ecosystem solar-system) xuống còn ít hình thức trình bày hơn, và **di chuyển** AudienceProblem + FounderStory lên sớm hơn (mục 5, 7, 20).

9. **Có nội dung quan trọng nào còn thiếu không?**
   Có: (a) một câu trả lời "dành cho ai" ngay tại Hero; (b) nguồn/ngày cập nhật cho số liệu TrustStats; (c) nội dung thật cho lead magnet "Nhận tài liệu AI".

10. **Landing Page nên giữ nền trắng/sáng hay chia nhiều màu?**
    Đây là câu hỏi đã có sẵn câu trả lời rõ trong hiện trạng: Landing Page **không** mắc lỗi "chia mỗi section một màu mạnh khác nhau" — toàn bộ trang nhất quán 1 nền tối (dark navy) duy nhất. Vấn đề thực sự là nền tối này **mâu thuẫn với yêu cầu "nền sáng/trắng làm chủ đạo"** trong brief. Đây là quyết định Founder cần chốt (mục 23.1), không phải lỗi kỹ thuật.

11. **Font System UI đã được sử dụng hoàn toàn chưa?**
    **Đã áp dụng đúng 100%** — `--font-sans` khớp chính xác chuỗi font yêu cầu, không phát hiện font ngoài hay Google Fonts nào được tải trong phạm vi Landing Page.

12. **Mobile có đạt chất lượng Production không?**
    **Chưa** — xác nhận lỗi tràn ngang (horizontal scroll) trên mọi viewport mobile/tablet phổ biến đã kiểm tra (320–1024px). Đây là lỗi độ phức tạp thấp (S), nguyên nhân đã xác định chính xác, có thể sửa nhanh.

13. **SEO và social sharing đã sẵn sàng chưa?**
    **Chưa hoàn toàn.** Điểm mạnh: OG image động, Twitter Card, robots.txt/sitemap.xml tồn tại đúng cấu trúc. Điểm thiếu: không có canonical URL, không có manifest, chỉ có Person schema (thiếu Organization/WebSite), và quan trọng nhất — domain chính thức dùng cho OG/canonical hiện không phân giải được.

14. **Những lỗi nào phải sửa trước khi chạy quảng bá?**
    Toàn bộ 5 phát hiện P1 (F-01 đến F-05) — trong đó F-04 (domain chết) đặc biệt quan trọng nếu quảng bá có yếu tố chia sẻ mạng xã hội, vì ảnh preview sẽ không hiển thị.

15. **Có thể đưa Landing Page vào Feature Freeze chưa?**
    Chưa toàn bộ. Có thể freeze các phần không phụ thuộc quyết định màu nền (routing, CTA logic, SEO metadata) ngay, nhưng phần visual cần chờ quyết định F-05.

16. **Sprint triển khai đầu tiên nên gồm chính xác những hạng mục nào?**
    Sprint 0 theo backlog: F-01 (overflow-hidden cho `PortalPreview.tsx`/`FounderStory.tsx`), F-02 (gắn hành vi hoặc ẩn nút "Nhận tài liệu AI"), F-03 (loại `/portal/*` khỏi sitemap), F-04 (xác nhận tiến độ domain), và trình quyết định F-05 lên Founder song song (không chặn 4 mục còn lại). Chi tiết đầy đủ tại `VO_DUONG_AI_LANDING_PAGE_AUDIT_BACKLOG.md`, Sprint 0.
