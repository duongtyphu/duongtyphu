# VO DUONG AI — Landing Page Audit Backlog

Tài liệu này là backlog triển khai đi kèm `VO_DUONG_AI_LANDING_PAGE_MASTER_AUDIT.md`. Toàn bộ ID phát hiện (F-01 → F-21) tham chiếu mục 18 của báo cáo audit.

**Trạng thái:** Chưa triển khai. Đây là kế hoạch đề xuất, chờ Founder/PMO phê duyệt trước khi bất kỳ sprint nào bắt đầu.

> **Ghi chú cập nhật (PMO Correction, sau bản backlog gốc):** F-02 ("🎁 Nhận tài liệu AI") đã được Founder xác nhận là nhãn trang trí cố ý, không phải CTA/lead magnet — hạ từ P1 xuống P2, phạm vi công việc chỉ còn là sửa affordance (đổi phần tử phi tương tác, bỏ hover/focus), **không** gắn link giả, **không** tạo lead magnet/form/email automation. Nội dung Sprint 0 bên dưới đã được cập nhật theo đúng quyết định này; chưa có code nào được sửa.

---

## Sprint 0 — P0/P1 Release Blockers

**Mục tiêu:** Loại bỏ mọi rào cản kỹ thuật chặn việc gắn domain chính thức và tiếp nhận traffic thật ở quy mô kiểm soát.

**Phạm vi:** F-01, F-03, F-04 (P1 blockers thật sự) + F-02 (P2, đi kèm vì cùng file `FinalCTA.tsx`, độ phức tạp thấp, không phải blocker) + ra quyết định (không triển khai) cho F-05.

**Danh sách issue:**
- F-01 — Thêm `overflow-hidden` vào section bao ngoài của `PortalPreview.tsx` và `FounderStory.tsx` để chứa các div glow `-inset-N`, loại bỏ tràn ngang 320–1024px.
- F-02 *(P2 — không phải blocker, xem ghi chú PMO Correction đầu tài liệu)* — "🎁 Nhận tài liệu AI" là nhãn trang trí cố ý, **không** cần gắn destination/hành vi. Việc cần làm: đổi `<button>` hiện tại sang phần tử phi tương tác (`<span>`/`<div>`), bỏ `hover:bg-red-500`, bỏ khả năng nhận keyboard focus, chỉnh style theo hướng badge/eyebrow thay vì nút bấm. **Không** gắn link giả, **không** tạo lead magnet, **không** xây form, **không** kết nối email automation. Đổi nội dung chữ (đề xuất "Công cụ • Prompt • Tài liệu") là việc **tách riêng**, cần Founder duyệt copy trước, không làm chung với phần sửa markup.
- F-03 — Loại bỏ toàn bộ URL `/portal/*` khỏi `sitemap.ts` (chỉ giữ route thực sự công khai: `/`, `/about`, `/blogai`, `/contact`, `/privacy`, `/terms`, `/refund-policy`, và các URL blog/tools/prompts/resources công khai không yêu cầu đăng nhập).
- F-04 — Founder xác nhận tiến độ domain `voduongai.com`; nếu chưa live trong thời gian ngắn, cân nhắc tạm trỏ `siteConfig.url` về domain đang hoạt động để OG/canonical không tham chiếu domain chết.

**Dependency:** Không có dependency chặn — 4 issue có thể làm song song, độc lập với nhau. Riêng việc đổi **nội dung chữ** của F-02 (không phải phần sửa markup) phụ thuộc Founder duyệt copy trước.

**Acceptance criteria:**
- Không còn horizontal scroll ở bất kỳ viewport nào trong dải 320–1440px (đo bằng `document.documentElement.scrollWidth === clientWidth`).
- "🎁 Nhận tài liệu AI" không còn là phần tử tương tác (không `<button>`/`<a>`, không hover/focus/pointer-cursor, không nhận keyboard focus) — vẫn giữ nguyên vai trò trang trí, không có destination.
- `sitemap.xml` không chứa bất kỳ URL nào bị middleware redirect khi truy cập ẩn danh.
- `og:image`/canonical trỏ về domain đang thực sự phân giải được.

**Rủi ro:** F-04 phụ thuộc hành động ngoài code (cấu hình DNS/Vercel domain) — đội kỹ thuật không tự quyết định được, cần Founder xác nhận trước.

**Ước tính:** S (F-01, F-02 phần markup, F-03) + phụ thuộc bên ngoài (F-04).

**Cần Founder duyệt trước khi bắt đầu:**
- F-05 (mục 23.1 báo cáo audit) — quyết định giữ dark-theme hay chuyển light-theme. Sprint 0 **không** chờ quyết định này để bắt đầu (F-01, F-03, F-04 độc lập với màu nền), nhưng Sprint 2 không thể bắt đầu nếu chưa có quyết định.
- F-02 phần **nội dung chữ thay thế** ("Công cụ • Prompt • Tài liệu") — cần duyệt trước khi triển khai đổi copy; phần sửa markup/affordance không cần chờ, có thể làm ngay.

---

## Sprint 1 — Product Message và Conversion

**Mục tiêu:** Cải thiện thứ tự thông tin và độ tin cậy của funnel chuyển đổi mà không cần thay đổi visual design.

**Phạm vi:** Cấu trúc lại thứ tự section theo đề xuất mục 20 báo cáo audit; F-10, F-15, F-16, F-20.

**Danh sách issue:**
- Di chuyển `AudienceProblem` lên vị trí #2 (ngay sau `Hero`) trong `page.tsx`.
- Di chuyển `FounderStory` lên trước `Roadmap`/`TrustStats`.
- Đánh giá gộp/rút gọn 3 trong 4 section "hệ sinh thái" (`EcosystemPillars`, `Roadmap`, `Ecosystem` solar-system) — cần thiết kế nội dung trước khi code.
- F-10 — Thêm dấu hiệu (icon khoá/tooltip) cho các link Footer trỏ `/portal/*`, hoặc đổi đích tới section landing page tương ứng khi có.
- F-15 — Chuẩn hoá cách viết tên thương hiệu theo quyết định Founder (mục 23.3).
- F-16 — Cập nhật/xác nhận số liệu `TrustStats.tsx` theo dữ liệu thật.
- F-20 — Thống nhất 1 kiểu điểm đến cho mọi CTA "vào Học viện" (đề xuất: toàn bộ trỏ `/login`, không trỏ thẳng `/portal/hocvienai`).

**Dependency:** Cần Founder phê duyệt đề xuất cấu trúc mục 20 trước khi đổi thứ tự `page.tsx`. Cần nội dung/số liệu thật từ Founder cho F-16.

**Acceptance criteria:**
- Thứ tự section mới được Founder xác nhận bằng văn bản trước khi merge.
- Không section nào bị xoá nội dung khi gộp — chỉ thay đổi cách trình bày/vị trí, nội dung cốt lõi giữ nguyên trừ khi Founder yêu cầu khác.
- Mọi CTA "vào Học viện" trỏ cùng 1 đích.

**Rủi ro:** Thay đổi thứ tự section có thể ảnh hưởng animation delay/scroll-anchor hiện có (`#trai-nghiem-hoc-vien-ai`, `#danh-gia-nang-luc-ai`, `#cong-cu-toi-dung`, `#cta-cuoi`) — cần kiểm tra lại toàn bộ anchor link trong `mainNav`/Header sau khi đổi thứ tự.

**Ước tính:** M (đổi thứ tự + rà soát anchor) + L (nếu gộp nội dung 3 section hệ sinh thái cần viết lại).

---

## Sprint 2 — Visual System và Responsive

**Mục tiêu:** Triển khai quyết định màu nền (F-05) và dọn dẹp nợ kỹ thuật hệ thống màu/responsive còn lại.

**Phạm vi:** F-05 (theo quyết định Founder), F-14, F-11.

**Danh sách issue:**
- Nếu quyết định **giữ dark-theme**: cập nhật lại tài liệu định hướng thương hiệu cho khớp thực tế, không cần đổi code.
- Nếu quyết định **chuyển light-theme**: redesign toàn diện — đánh giá lại từng component (contrast, glow effect vốn thiết kế cho nền tối, card glass-morphism) — đây là dự án con riêng, cần audit thiết kế bổ sung trước khi code (không nằm trong ước tính S/M/L của backlog này).
- Nếu quyết định **theme sáng có điểm nhấn tối**: xác định chính xác section nào giữ tối, thiết kế lại ranh giới chuyển đổi giữa các nền.
- F-14 — Hợp nhất `--color-brand-orange` (`#FF7A00`) và hằng số cam lặp lại (`#FF6B35`) về 1 token duy nhất trong `@theme`, cập nhật toàn bộ 6+ file đang hardcode.
- F-11 — Bỏ `whitespace-nowrap` không điều kiện trong `FinalCTA.tsx`.

**Dependency:** Toàn bộ Sprint 2 (trừ F-11) **chặn cứng** bởi quyết định Founder ở mục 23.1. Không nên bắt đầu công việc màu sắc diện rộng trước khi có quyết định.

**Acceptance criteria:**
- 1 token màu cam duy nhất được dùng ở mọi vị trí (không còn `#FF7A00`/`#FF6B35` song song).
- Không còn text nào bị tràn do `whitespace-nowrap` không điều kiện.
- Nếu đổi theme: mọi section đạt contrast AA tối thiểu trên nền mới (kiểm tra lại toàn bộ, không chỉ 3 vị trí đã phát hiện).

**Rủi ro:** Đây là sprint rủi ro cao nhất về khối lượng công việc nếu quyết định là chuyển light-theme — cần Founder hiểu rõ đây là L, không phải điều chỉnh nhỏ.

**Ước tính:** S (F-14, F-11) nếu giữ dark-theme / L (nếu chuyển light-theme, cần tách thành dự án riêng có audit thiết kế bổ sung).

---

## Sprint 3 — SEO, Accessibility và Performance

**Mục tiêu:** Đạt các tiêu chuẩn kỹ thuật Production còn thiếu về SEO, accessibility, và các cải thiện hiệu năng không phụ thuộc quyết định visual.

**Phạm vi:** F-06, F-07, F-08, F-09, F-17, F-18, F-19.

**Danh sách issue:**
- F-06 — Tăng opacity 3 vị trí contrast fail (`EcosystemPillars.tsx:145`, `TrustStats.tsx:48,65`) lên mức đạt WCAG AA (≥4.5:1 cho text <18px).
- F-07 — Thêm `alternates: { canonical: ... }` vào `generateMetadata` trong `layout.tsx`.
- F-08 — Tạo `app/manifest.ts` (tên, icon, theme-color, display mode).
- F-09 — Bổ sung JSON-LD `Organization` và `WebSite` schema bên cạnh `Person` hiện có.
- F-17 — Thêm skip-to-content link đầu `<body>` trong `layout.tsx`.
- F-18 — Đổi `<h4>` thành `<h3>` cho tiêu đề cột trong `Footer.tsx` (giữ nguyên style hiện tại qua className, chỉ đổi thẻ semantic).
- F-19 — Xác nhận và bổ sung `rel="noopener noreferrer"` cho mọi external link `target="_blank"` trong `Footer.tsx`.

**Dependency:** Độc lập với quyết định màu nền — có thể làm song song với Sprint 2 nếu có đủ nhân lực, hoặc ngay sau Sprint 0.

**Acceptance criteria:**
- Toàn bộ 3 vị trí contrast fail đạt ≥4.5:1 khi đo lại bằng cùng phương pháp (luminance formula + composite alpha).
- `curl` HTML Production cho thấy `<link rel="canonical">`, `<link rel="manifest">`, và ≥3 loại `@type` trong JSON-LD (`Person`, `Organization`, `WebSite`).
- Heading hierarchy không còn nhảy cấp khi kiểm tra lại theo source code.

**Rủi ro:** Thấp — đây là các thay đổi nhỏ, cô lập, không ảnh hưởng lẫn nhau.

**Ước tính:** S cho từng issue, tổng cộng M cho cả sprint.

---

## Sprint 4 — Technical Cleanup và CMS Readiness

**Mục tiêu:** Giảm nợ kỹ thuật về kiến trúc render và chuẩn bị nền tảng để nội dung Landing Page có thể quản lý qua CMS trong tương lai.

**Phạm vi:** F-12, F-13, F-21, thiết kế schema nội dung CMS (chỉ thiết kế, chưa triển khai UI Admin).

**Danh sách issue:**
- F-12 — Tách phần animation `whileInView` ra một client-wrapper nhỏ dùng chung, để phần nội dung chính của 7 section (`EcosystemPillars`, `ToolsIUse`, `AudienceProblem`, `Roadmap`, `TrustStats`, `FounderStory`, `FinalCTA`) có thể quay lại Server Component.
- F-13 — Đánh giá thêm cơ chế cache/ISR cho `getSiteSettings()` (ví dụ `unstable_cache`/`revalidate` theo thời gian) để trang chủ không phải chờ Supabase mỗi request.
- F-21 — Thêm cơ chế pause animation marquee/solar-system khi section ngoài viewport (`IntersectionObserver`).
- Thiết kế schema nội dung (không triển khai UI) cho từng section landing page nếu Founder xác nhận muốn quản lý qua CMS (mục 23.7 báo cáo audit) — ưu tiên các section thay đổi thường xuyên nhất (TrustStats, Hero headline).

**Dependency:** Không phụ thuộc Sprint 2/3. Có thể làm song song. Việc thiết kế schema CMS **chặn bởi quyết định Founder** ở mục 23.7.

**Acceptance criteria:**
- Số lượng file `"use client"` trong `src/components/home/` giảm từ 15 xuống mức tối thiểu cần thiết (Hero, IntroVideo, PortalPreview, QuizAssessment, Ecosystem, RevealText — các component thực sự cần state/interactivity phía client).
- Trang chủ có chiến lược cache rõ ràng, không còn `Cache-Control: no-store` mặc định (trừ khi Founder xác nhận cần dữ liệu real-time tuyệt đối).
- Tài liệu schema CMS (nếu được duyệt) mô tả rõ field nào ánh xạ tới component nào.

**Rủi ro:** Tách client-wrapper cần kiểm tra kỹ animation không bị vỡ khi chuyển ranh giới server/client — nên có QA thủ công từng section sau khi tách.

**Ước tính:** M (F-12), M (F-13), S (F-21), L (thiết kế schema CMS đầy đủ).

---

## Sprint 5 — Final Visual QA và Production Verification

**Mục tiêu:** Xác nhận toàn bộ thay đổi từ Sprint 0–4 hoạt động đúng trên Production thật, đo hiệu năng thực tế lần đầu tiên.

**Phạm vi:** Chạy lại toàn bộ hạng mục audit responsive/accessibility/SEO trên Production; chạy Lighthouse thực tế (mobile + desktop) trên domain chính thức sau khi F-04 được giải quyết.

**Danh sách issue:**
- Chạy lại kiểm tra horizontal-scroll ở 8 viewport trên Production thật (không chỉ local).
- Chạy Lighthouse (mobile + desktop) trên domain chính thức, ghi nhận LCP/INP/CLS/TTFB thực đo — đây là lần đầu tiên audit này có số liệu Performance thực tế, thay thế phần static-audit ở Sprint hiện tại.
- Xác nhận lại toàn bộ 21 phát hiện F-01 → F-21 đã đóng, ghi trạng thái `fixed`/`no_change_needed`/`skipped` cho từng mục.
- Kiểm tra lại Open Graph preview thật trên Facebook Sharing Debugger / Zalo sau khi domain chính thức live.
- Regression QA thủ công toàn bộ CTA funnel (Hero → Quiz → FinalCTA) trên thiết bị thật (không chỉ giả lập viewport).

**Dependency:** Chặn bởi việc hoàn tất Sprint 0–4 và domain chính thức đã live (F-04).

**Acceptance criteria:**
- Không còn phát hiện P0/P1 nào mở.
- Điểm Lighthouse Performance ≥ ngưỡng do Founder/team kỹ thuật thống nhất trước khi chạy (đề xuất tham khảo: Performance ≥80 mobile, Accessibility ≥95, SEO ≥95 — **đây là đề xuất, cần thống nhất lại, không phải tiêu chuẩn bắt buộc**).
- Production Readiness Scorecard (mục 19 báo cáo audit) được chấm lại, mục tiêu tổng thể ≥8/10.

**Rủi ro:** Nếu domain chính thức chưa live đúng hạn, sprint này không thể hoàn thành trọn vẹn phần đo Production thật — cần kế hoạch dự phòng đo tạm trên domain đang hoạt động.

**Ước tính:** M — chủ yếu là công sức QA/đo lường, không phải code mới.

---

## Tổng hợp phụ thuộc giữa các Sprint

```
Sprint 0 (không phụ thuộc) ──────────────┐
                                          │
Sprint 1 (phụ thuộc phê duyệt mục 20) ────┤
                                          ├──► Sprint 5 (phụ thuộc 0-4 hoàn tất + domain live)
Sprint 2 (phụ thuộc quyết định F-05) ─────┤
                                          │
Sprint 3 (độc lập, có thể chạy sớm) ──────┤
                                          │
Sprint 4 (độc lập, phần CMS phụ thuộc mục 23.7) ┘
```

## Những mục cần Founder duyệt trước khi bắt đầu bất kỳ Sprint nào

Xem đầy đủ tại mục 23 của `VO_DUONG_AI_LANDING_PAGE_MASTER_AUDIT.md`. Tóm tắt theo Sprint:
- **Trước Sprint 0:** không cần phê duyệt gì thêm ngoài việc đồng ý bắt đầu — F-01/F-03 là sửa lỗi kỹ thuật thuần tuý, phần markup của F-02 là dọn dẹp semantics thuần tuý (nội dung chữ thay thế của F-02 thì chờ duyệt riêng, xem Sprint 0 ở trên).
- **Trước Sprint 1:** phê duyệt đề xuất cấu trúc mục 20; xác nhận số liệu F-16; xác nhận quy ước tên thương hiệu F-15.
- **Trước Sprint 2:** **bắt buộc** có quyết định F-05 (màu nền).
- **Trước Sprint 4 (phần CMS):** xác nhận có muốn đầu tư CMS cho nội dung landing page hay không (mục 23.7).
