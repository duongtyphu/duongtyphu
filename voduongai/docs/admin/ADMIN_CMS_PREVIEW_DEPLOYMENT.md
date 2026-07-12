# Admin CMS Preview Deployment — IMP-DEPLOY-ADMIN-001

**TRẠNG THÁI: NỘP CHO PMO (01 – Product & Roadmap) REVIEW. Không merge. Không Production.**

Preview Deployment phục vụ Founder Review trên nhánh `claude/vietnamese-greeting-zkzn2p` (PR #48), tại commit `95ae493` (IMP-ADM-200 — Admin CMS Operational Foundation, sprint gần nhất). **Không phải Production Release.**

---

## 1. Preview Deployment URL

```
https://voduongai-git-claude-vietnamese-b44ce0-duongvvvn-5816s-projects.vercel.app
```

## 2. Admin Dashboard URL

```
https://voduongai-git-claude-vietnamese-b44ce0-duongvvvn-5816s-projects.vercel.app/admin
```

(Cùng nội dung với `/admin/dashboard`.)

## 3. Deployment Status

**Ready — deploy thành công**, xác nhận qua 2 nguồn độc lập, cùng gắn với commit `95ae493` (đúng commit mới nhất):

- GitHub Commit Status API: `state: "success"`, `description: "Deployment has completed"`.
- Vercel Bot PR comment (tự động đăng trên PR #48): badge "Ready", cập nhật lúc 2026-07-12 08:45 UTC.

---

## Task 1 — Pre-deployment Verification

Chạy lại từ đầu trên working tree sạch (không có thay đổi chưa commit) trước khi xác nhận deploy:

| Kiểm tra | Kết quả |
|---|---|
| `npm run lint` | ✅ Sạch — 0 lỗi, 5 warning `no-img-element` có từ trước (không liên quan, không phải P0) |
| `npx tsc --noEmit` | ✅ Sạch |
| `npm run build` (production) | ✅ Thành công |
| `npm run test` | ✅ 139/139 pass |

**Không có lỗi P0, không có build failure — đủ điều kiện deploy theo đúng Task 1.**

## Task 2 — Environment Variable Verification

**Giới hạn quan trọng cần báo cáo trung thực:** phiên làm việc này **không có quyền truy cập Vercel CLI/Dashboard/API** (không có `.vercel/`, không có `vercel.json`, không cài `vercel` CLI, không có token) — nên **không thể trực tiếp liệt kê/xác nhận giá trị đã cấu hình trong Vercel Project Settings**. Đã làm được, thay vào đó:

**Danh sách biến môi trường CẦN THIẾT** (rà theo `process.env.*` thật trong code + `.env.example`, chỉ nêu TÊN biến, không có giá trị nào được in ra):

| Nhóm | Biến | Bắt buộc? |
|---|---|---|
| Supabase (Admin/Server) | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Có |
| Supabase Auth (Portal/Admin login) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Có (để yêu cầu đăng nhập — thiếu 2 biến này sẽ khiến Portal/Admin mở public không cần đăng nhập, theo comment trong `.env.example`) |
| Storage | Không có biến riêng — dùng chung Supabase project ở trên (chưa xác nhận có bucket Storage riêng hay không) | Chưa xác định |
| Admin/Founder identity | `FOUNDER_EMAIL`, `FOUNDER_ID` | Dùng cho tính năng Companion/Founder Identity, không phải cơ chế gate quyền Admin chính (quyền Admin dùng role-based qua Supabase, không qua biến môi trường riêng) |
| Integration — Thanh toán | `SEPAY_WEBHOOK_API_KEY` | Có, nếu cần checkout hoạt động (theo comment code: thiếu biến này webhook fail-closed) |
| Integration — Analytics | `NEXT_PUBLIC_GA_ID` | Không bắt buộc (để trống sẽ tắt tracking) |
| Integration — AI Provider (Companion Studio) | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY` (+ vài biến tuỳ chọn khác) | Không bắt buộc — thiếu bất kỳ biến nào chỉ khiến Provider đó báo "unavailable", tự động dùng `MockProviderAdapter` |

**Xác minh gián tiếp:** Build production trên Vercel đã "Ready" thành công — cho thấy các biến cần ở BUILD TIME (`NEXT_PUBLIC_*`) nhiều khả năng đã có. **Không thể xác nhận** các biến chỉ dùng ở RUNTIME phía server (`SUPABASE_SERVICE_ROLE_KEY`, `SEPAY_WEBHOOK_API_KEY`...) vì Task 4 (Route Smoke Test) bị chặn ở tầng Vercel trước khi tới được app (xem dưới) — không tự chạy được request thật để quan sát lỗi runtime.

**Không tạo database mới, không thay đổi dữ liệu production** — đúng yêu cầu, sprint này không có thao tác nào chạm tới Supabase.

## Task 3 — Preview Deployment

Nhánh `claude/vietnamese-greeting-zkzn2p` đã được push đầy đủ (commit `95ae493`), Vercel tự động deploy Preview qua tích hợp GitHub có sẵn (không cần thao tác thủ công). **Không deploy Production, không đổi domain chính, không đổi cấu hình Production** — chỉ xác nhận Preview đã "Ready".

## Task 4 — Admin Route Smoke Test

**Phát hiện quan trọng:** Preview Deployment hiện được **Vercel Deployment Protection (SSO)** bảo vệ ở tầng platform — MỌI request (kể cả trang tĩnh công khai `/`, không riêng `/admin/*`) đều bị Vercel chặn và chuyển hướng (302) sang `vercel.com/login` TRƯỚC KHI tới được ứng dụng Next.js. Xác nhận bằng `curl` trực tiếp (không dùng trình duyệt):

```
/admin           → 302 → vercel.com/sso-api (Vercel chặn, chưa tới app)
/admin/dashboard → (tương tự mọi route)
/                → 302 → vercel.com/sso-api (kể cả trang public)
```

**Hệ quả:** phiên làm việc này **không thể tự động smoke-test 404/500 ở tầng ứng dụng** — mọi response quan sát được đều là của Vercel, không phải Next.js. Đây là hành vi platform-level (Preview Deployment Protection), không phải lỗi của Admin CMS hay route nào — thực chất là điểm TỐT về bảo mật (Preview không lộ công khai), nhưng có nghĩa: **Founder (đã có tài khoản Vercel gắn với project) là người duy nhất thực hiện được smoke test thật** khi mở URL bằng trình duyệt đã đăng nhập Vercel.

**Danh sách route Founder nên tự kiểm tra** (đầy đủ theo yêu cầu Task 4, cả route cũ lẫn mới nhất từ IMP-ADM-200):

| Route | Ghi chú |
|---|---|
| `/admin` | Dashboard chính |
| `/admin/dashboard` | Alias/route Dashboard |
| `/admin/website` | Website Workspace (Canonical, 10 route con) |
| `/admin/brand` | Brand Studio (Canonical, 10 route con) |
| `/admin/media-center` | ComingSoon stub — **chưa xây**, đúng như dự kiến |
| `/admin/ckos` | CKOS Management |
| `/admin/roadmap` | Academy (route gốc hiện tại, chưa có `/admin/academy`) |
| `/admin/premium` | Premium |
| `/admin/companion-studio` | ComingSoon stub — **chưa xây**, đúng như dự kiến |
| `/admin/founder` | **Mới (ADM-SPR-200)** — Founder Workspace |
| `/admin/founder/owners` | **Mới** — Workspace Owner Panel |
| `/admin/founder/search` | **Mới** — Global Search (Placeholder) |
| `/admin/founder/review-queue` | **Mới** — Review Queue (Placeholder) |
| `/admin/portal` | **Mới** — Portal Dashboard |
| `/admin/portal/areas` | **Mới** — Portal Areas |
| `/admin/portal/pages` | **Mới** — Page Registry |
| `/admin/portal/content` | **Mới** — Content Registry |

Với mỗi route, Founder kiểm tra: không lỗi 404/500, Shell hiển thị đúng, Sidebar hoạt động, Breadcrumb hoạt động, responsive cơ bản, access guard (bị chặn/redirect login nếu chưa đăng nhập app), không vô tình rơi vào bất kỳ trang Legacy Admin nào.

## Task 5 — Founder Review Access

1. **Vercel Preview URL:** `https://voduongai-git-claude-vietnamese-b44ce0-duongvvvn-5816s-projects.vercel.app`
2. **Admin Dashboard URL:** thêm `/admin` vào URL trên.
3. **Danh sách route cần kiểm tra:** bảng ở Task 4.
4. **Hướng dẫn đăng nhập:** dùng đúng cơ chế đăng nhập Admin hiện có của app (Supabase Auth, cùng tài khoản Founder vẫn dùng để vào `/admin` trên các bản deploy trước) — **không có mật khẩu mới nào được tạo/gửi trong báo cáo này**. Trước khi vào được app, trình duyệt Founder cần đã đăng nhập Vercel (tài khoản có quyền trên project `duongvvvn-5816s-projects/voduongai`) — nếu Founder chưa có quyền Vercel, cần được thêm vào team Vercel trước (việc này ngoài phạm vi sprint này, không tự thực hiện).

**Nếu Preview bị chặn do thiếu credentials/env var:** báo cáo này liệt kê đúng TÊN biến cần thiết ở Task 2, không có giá trị nào bị lộ.

## Task 6 — Founder Visual Review Checklist

- [ ] Tổng thể giao diện Admin (bố cục, màu sắc nhất quán)
- [ ] Sidebar — đủ nhóm, không nhóm nào trống/lỗi (đặc biệt 2 nhóm mới: "Founder", "Portal Management")
- [ ] Dashboard (`/admin`, `/admin/dashboard`) hiển thị đúng
- [ ] Website Workspace — 10 route con hoạt động
- [ ] Brand Studio — 10 route con hoạt động
- [ ] CKOS — Dashboard + module con
- [ ] Academy (`/admin/roadmap` và route con) — pattern legacy, có thể giao diện khác Website/Brand
- [ ] Premium — nhiều route, dữ liệu giao dịch thật (Orders/Coupons) — **cẩn trọng, đây là dữ liệu thật, không phải test**
- [ ] Companion Studio — xác nhận vẫn là ComingSoon (chưa xây, đúng như IMP-ADM-100 đã ghi nhận)
- [ ] Media Center — xác nhận vẫn là ComingSoon (chưa xây)
- [ ] Founder Workspace (`/admin/founder`) — Governance Overview + Open PMO Questions hiển thị đúng
- [ ] Portal Management (`/admin/portal/*`) — số liệu Portal Area/Page/Content Registry đúng như báo cáo
- [ ] Mobile/tablet responsiveness — thử thu nhỏ trình duyệt hoặc DevTools device mode
- [ ] Ghi chú lại route/nội dung nào vẫn là Placeholder (không phải lỗi — là trạng thái Foundation đã biết)

---

## Known Limitations

1. **Không tự động smoke-test được 404/500 ở tầng ứng dụng** — Vercel Deployment Protection chặn mọi request trước khi tới app (Task 4).
2. **Không xác nhận trực tiếp được giá trị/sự tồn tại của env var runtime phía server trên Vercel** — không có quyền truy cập Vercel CLI/Dashboard/API từ môi trường làm việc này (Task 2).
3. Route `/admin/companion-studio` và `/admin/media-center` **cố ý** vẫn là ComingSoon — không phải lỗi phát sinh từ deploy này (đã ghi nhận từ IMP-ADM-100).
4. Academy/Premium dùng kiến trúc UI legacy (khác Website/Brand Studio) — trải nghiệm hình ảnh có thể không đồng nhất, đã ghi nhận ở `ADMIN_INFORMATION_ARCHITECTURE_V2.md`.

## Xác nhận không tác động Production

- ✅ Không merge PR #48.
- ✅ Không deploy Production (chỉ Preview, gắn với nhánh `claude/vietnamese-greeting-zkzn2p`).
- ✅ Không đổi domain chính, không đổi cấu hình Production trên Vercel (không có quyền truy cập để đổi, và không thực hiện thao tác nào).
- ✅ Không tạo/xóa/migrate dữ liệu — không có thao tác Supabase nào trong sprint này.
- ✅ Không thêm feature, không redesign, không sửa Portal — chỉ chạy verification + xác nhận trạng thái deploy có sẵn.
