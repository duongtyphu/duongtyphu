# Identity Hub v1.0 — VO DUONG AI

Hệ thống tài khoản duy nhất dùng chung cho Website, Học viện, Companion,
Premium, AI Workspace, Dự án & Cơ hội và Admin CMS. Tài liệu này ghi lại
kiến trúc, các file đã thay đổi, migration, hướng dẫn cấu hình Google
OAuth, kết quả kiểm thử, và rủi ro/việc cần Founder phê duyệt trước khi
đưa lên Production.

## Trạng thái duyệt

**Approved for Integration Review** (Founder) — kiến trúc đáp ứng đúng
định hướng đã thống nhất: tái sử dụng Supabase Auth, không tạo hệ thống
auth song song, một tài khoản cho toàn hệ sinh thái, Onboarding/User
Profile tách biệt Authentication, route protection đúng phạm vi.

- Commit giữ lại: `6f5859a`, branch `claude/landing-preview-nextjs`.
- **CHƯA merge vào `main`, CHƯA deploy Production.**
- **Cập nhật (Controlled E2E, 2026-07-29):** migration schema
  (`supabase-phase23-identity-hub.sql`) **đã được áp dụng lên Supabase
  Production từ trước** (cột onboarding + trigger `on_auth_user_created`
  đã tồn tại, xác nhận qua `information_schema`/`pg_trigger` trực tiếp).
  Trong lúc kiểm thử có kiểm soát (API thật, không qua UI), phát hiện và
  **đã sửa trực tiếp trên Supabase Production 2 bug P0** chặn hoàn toàn
  luồng đăng ký/onboarding — xem mục 5 và 6 để biết chi tiết đầy đủ, mục
  8 để biết vì sao một phần luồng còn lại (email thật, Google OAuth
  consent) **chưa** kiểm thử được trong đợt này.
- Điều kiện bắt buộc trước khi tạo Release Candidate để merge `main` +
  deploy Production (mọi mục PASS mới được merge):
  1. ~~Apply migration lên Supabase Production~~ — **đã xong** (xem trên).
  2. Cấu hình Google OAuth đầy đủ (xem mục 4) — **chưa xác nhận được** từ
     sandbox này (không có Dashboard access), chỉ xác nhận provider đã
     bật ở tầng `/auth/v1/authorize` (xem mục 5).
  3. Hoàn thành end-to-end test trên Preview với Supabase thật (xem mục
     5) — **CHƯA hoàn thành**, đặc biệt luồng cần gửi email thật (đang bị
     Supabase's email rate limit chặn, xem mục 8) và luồng Google OAuth
     consent thật (cần trình duyệt + tài khoản Google thật, không thực
     hiện được trong sandbox này dưới bất kỳ hình thức nào).
  4. Xác nhận PASS từng luồng — xem bảng trạng thái đầy đủ ở mục 5.
- **KHÔNG tuyên bố Identity Hub đã hoàn tất E2E, và không merge
  Production, cho tới khi luồng email (đăng ký/verify/forgot-password)
  và Google OAuth được Founder tự kiểm thử thành công trên Preview với
  Supabase thật** (checklist đầy đủ ở mục 5.3).

---

**KHÔNG nhầm với** `docs/FOUNDER_IDENTITY_FOUNDATION.md` /
`docs/FUTURE_LIVING_IDENTITY.md` / `docs/THE_EVOLUTION_WITH_IDENTITY.md` /
`src/lib/portal/identity/identity-layer.ts` — nhóm tài liệu/file đó nói về
**"Founder Identity"/"Companion identity"** (nhân dạng/tính cách AI
Companion nhận diện Founder), một khái niệm hoàn toàn khác với **danh
tính người dùng (authentication/account)** mà tài liệu này mô tả.

---

## 1. Kiến trúc & user flow

### Nguyên tắc

- **`auth.users` (Supabase Auth) là nguồn danh tính chuẩn duy nhất** —
  email, mật khẩu (hash do Supabase quản, app không bao giờ chạm vào),
  provider (email/google), trạng thái xác thực email, session.
- **`members` (bảng đã có sẵn từ trước) là bảng profile DUY NHẤT** cho
  toàn hệ sinh thái — mở rộng thêm cột onboarding thay vì tạo bảng
  `profiles` song song. Đã có RLS `auth.uid() = id` (chỉ tự đọc/sửa row
  của chính mình).
- **Role tối thiểu:** `members.is_admin` (boolean) — không có bảng
  `roles` riêng, không cần cho phạm vi v1.
- **Membership/entitlement/course enrollment tách biệt hoàn toàn:**
  `orders`, `courses`, `course_sections`, `course_lessons` — không bảng
  nào trong nhóm này bị đụng tới ở Identity Hub v1.0.

### Sơ đồ luồng

```
Đăng ký (email+password hoặc Google)
  → auth.users có row mới
  → trigger on_auth_user_created tự tạo members row (full_name, is_admin=false)
  → [email+password] Supabase gửi email xác thực (nếu bật "Confirm email")
       → user bấm link → /auth/callback → có session
  → [Google] redirect thẳng về /auth/callback → có session ngay
  → middleware thấy members.onboarding_completed_at = null
  → redirect /onboarding?next=<trang muốn vào>
  → user điền hồ sơ → completeOnboarding() → members.onboarding_completed_at = now()
  → redirect next (mặc định /portal/hocvienai)

Đăng nhập (email+password / magic-link / Google) — /login
  → middleware kiểm tra onboarding_completed_at mỗi lần vào /portal/*
  → đã xong → vào thẳng trang đang muốn truy cập (next param)
  → chưa xong (vd. tài khoản cũ trước Identity Hub) → /onboarding trước

Quên mật khẩu — /forgot-password → email → /reset-password (qua /auth/callback)

Đăng xuất — LogoutButton (đã có sẵn, không đổi)

Admin — /admin/login (magic-link) → middleware kiểm tra members.is_admin
  → /admin/users: danh sách toàn bộ user (đọc qua Supabase Auth Admin API
    + members), không xem/đặt được mật khẩu
```

### Route protection

| Vùng | Route | Yêu cầu |
|---|---|---|
| Public | `/`, `/about`, marketing pages | Không yêu cầu |
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback` | Không yêu cầu (đã đăng nhập thì `/login`/`/register` tự đá về `/portal`) |
| Onboarding | `/onboarding` | Cần đăng nhập, không cần đã onboarding xong |
| Member | `/portal/*` | Cần đăng nhập **và** `onboarding_completed_at` đã có |
| Admin | `/admin/*` (trừ `/admin/login`) | Cần đăng nhập **và** `members.is_admin = true` |

Toàn bộ gate nằm ở `src/middleware.ts` (chặn navigation) — API/Server
Action mutating vẫn tự gọi `requireAdmin()`/`requireMember()`
(`src/lib/admin/requireAdmin.ts`, không đổi) làm lớp phòng thủ thứ 2,
đúng nguyên tắc đã áp dụng từ trước cho `/api/admin/*`.

**Lưu ý quan trọng:** khi `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`
chưa cấu hình (local/demo), `/portal/*` vẫn công khai theo đúng fallback
đã có từ trước (`middleware.ts`, comment "Portal is intentionally left
public when Supabase isn't configured") — `/onboarding`/`/register` cũng
theo đúng fallback này (không có khái niệm session thật để gate). `/admin/*`
vẫn KHÔNG BAO GIỜ mở trong trạng thái này (redirect `/admin/login`, không
đổi).

### Onboarding — 2 khái niệm khác nhau, không gộp

`src/lib/portal/identity-onboarding.ts` (Identity Hub, MỚI) khác hẳn
`src/lib/portal/onboarding.ts` (đã có từ trước, KHÔNG đụng tới):

| | Identity Hub onboarding (mới) | Goal-picker onboarding (đã có, giữ nguyên) |
|---|---|---|
| Route | `/onboarding` (bắt buộc, gate ở middleware) | Modal trong `/portal/*` (`OnboardingJourney.tsx`) |
| Lưu ở đâu | `members` (Supabase, đồng bộ mọi thiết bị) | `localStorage` (chỉ trên máy đó) |
| Trường dữ liệu | Họ tên, ảnh đại diện, nghề nghiệp, mục tiêu học AI, 5 lựa chọn (học tập/công việc/kinh doanh/Affiliate/thương hiệu cá nhân) | Mục tiêu/cấp độ/thời gian mỗi ngày (điều hướng gợi ý) |
| Bắt buộc? | Có — chặn vào `/portal/*` tới khi hoàn thành | Không — có nút "Bỏ qua, để sau" |

---

## 2. File đã thay đổi

### Database (viết sẵn, CHƯA tự apply — xem mục 7)
- `supabase-phase23-identity-hub.sql` — cột onboarding trên `members` +
  trigger `handle_new_auth_user()`.
- `supabase-phase23-identity-hub-rollback.sql`.

### App code — mới
- `src/lib/auth/safe-next.ts` — sanitize redirect `next` param (chống
  open-redirect), dùng chung 4 nơi.
- `src/components/auth/GoogleIcon.tsx` — tách khỏi `/login` để dùng chung
  với `/register`.
- `src/components/auth/OnboardingIdentityForm.tsx`.
- `src/lib/portal/identity-onboarding.ts` — `InterestId`/`INTEREST_OPTIONS`.
- `src/app/register/page.tsx` — đăng ký email+password + Google.
- `src/app/forgot-password/page.tsx` — route riêng (tách khỏi flow inline
  trong `/login` cũ).
- `src/app/onboarding/page.tsx` + `src/app/onboarding/actions.ts`.
- `src/lib/admin/identity-users.ts` — `listIdentityUsers()`.
- `src/app/admin/(dashboard)/users/page.tsx` + `UsersTable.tsx`.

### App code — sửa
- `src/app/login/page.tsx` — dùng `GoogleIcon`/`sanitizeNextParam` chung,
  thay nút "Quên mật khẩu?" inline bằng link `/forgot-password`, thêm
  link `/register`. Không đổi luồng magic-link/password hiện có.
- `src/app/auth/callback/route.ts` — dùng `sanitizeNextParam` chung
  (hành vi không đổi).
- `src/middleware.ts` — thêm `/onboarding`/`/register` vào matcher, thêm
  gate onboarding-completion cho `/portal/*`.
- `src/lib/protected-routes.ts` — thêm `/onboarding` vào
  `PROTECTED_ROUTE_PREFIXES`.
- `src/lib/admin/nav.ts` — thêm "Người dùng" vào group `null`.
- `src/components/admin/AdminSidebar.tsx` — thêm icon cho `/admin/users`.

### Không đụng tới (đã audit, đủ chuẩn hoặc ngoài phạm vi)
- 4 helper Supabase client (`supabase-server.ts`/`supabase-browser.ts`/
  `supabase.ts`/`getSupabasePublic`) — giữ nguyên 100%.
- `requireAdmin()`/`requireMember()` — giữ nguyên 100%.
- `/admin/login` (magic-link) — giữ nguyên, không thêm Google (đúng thiết
  kế tách biệt Admin/Portal login đã có từ trước).
- `orders`/`courses`/`course_sections`/`course_lessons` — không đụng.
- `src/lib/portal/onboarding.ts`/`OnboardingJourney.tsx` (goal-picker) —
  không đụng, xem bảng so sánh ở mục 1.
- Landing Page (`src/app/page.tsx`, `src/components/home/**`) — không đổi
  gì ngoài các link đăng nhập/đăng ký đã trỏ `/login` từ trước.

---

## 3. Migration & environment variables mẫu

Xem `supabase-phase23-identity-hub.sql` (đầy đủ comment giải thích từng
phần). Tóm tắt:

```sql
alter table members add column if not exists avatar_url text;
alter table members add column if not exists occupation text;
alter table members add column if not exists ai_goal text;
alter table members add column if not exists interests text[] not null default '{}';
alter table members add column if not exists onboarding_completed_at timestamptz;
-- + CHECK constraint giới hạn interests theo đúng 5 slug
-- + trigger on_auth_user_created (tự tạo members row khi có user mới)
```

An toàn: mọi thay đổi là `add column if not exists` (idempotent, cộng
dồn), không có `drop`/`not null` ép trên dữ liệu cũ. Rollback tương ứng ở
`supabase-phase23-identity-hub-rollback.sql`.

**Cách apply (Founder tự làm, xem mục 7):** Supabase Dashboard → SQL
Editor → dán nội dung `supabase-phase23-identity-hub.sql` → Run. Verify
bằng 2 câu lệnh cuối file (đã viết sẵn dạng comment).

Environment variables — **không cần thêm biến mới**. Toàn bộ `.env.example`
hiện có đã đủ:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Google OAuth **không cần biến môi trường app** — Client ID/Secret cấu
hình thẳng trên Supabase Dashboard (xem mục 4).

---

## 4. Hướng dẫn cấu hình Google OAuth (Founder tự làm trên Supabase Dashboard)

1. Tạo OAuth Client trên [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   → **OAuth client ID** → Application type: **Web application**.
2. **Authorized redirect URI** — thêm đúng URL Supabase cung cấp sẵn:
   `https://<project-ref>.supabase.co/auth/v1/callback` (lấy chính xác ở
   bước 3 bên dưới, Supabase hiển thị sẵn URL này).
3. Supabase Dashboard → **Authentication → Providers → Google** → bật
   **Enable Sign in with Google** → dán **Client ID** + **Client Secret**
   từ bước 1 → Save.
4. **Authentication → URL Configuration** → **Site URL** =
   `https://voduongai.com` (hoặc domain thật) + **Redirect URLs** thêm
   `https://voduongai.com/auth/callback` (và bản `*.vercel.app` nếu còn
   test trên đó).
5. **Bật "Confirm email"** (Authentication → Providers → Email → "Confirm
   email") nếu muốn yêu cầu xác thực email trước khi đăng nhập được bằng
   password — đúng yêu cầu "Xác thực email" của Identity Hub. Nếu tắt,
   `signUp()` trả session ngay, code ở `/register` đã tự xử lý đúng cả 2
   trường hợp (xem `src/app/register/page.tsx`).
6. **Auto-link tài khoản Google + email trùng địa chỉ** — Authentication
   → Providers, tìm mục liên quan "manual linking"/account linking theo
   đúng phiên bản GoTrue của project (tên setting có thể khác nhau giữa
   các bản Supabase) — bật để user đăng ký bằng email/password rồi sau
   đó đăng nhập Google cùng email KHÔNG bị tạo user thứ 2. Đây là setting
   ở tầng Supabase, app không tự viết logic linking (tự viết sai có rủi
   ro account-takeover) — **cần Founder tự xác nhận bật đúng**, xem rủi
   ro ở mục 7.

---

## 5. Báo cáo kiểm thử (Controlled E2E — cập nhật 2026-07-29)

**Nguyên tắc của đợt kiểm thử này (theo yêu cầu Founder):** không gửi
thêm email test thật, không bypass xác thực email bằng cách chỉnh thẳng
`email_confirmed_at`/cờ trạng thái để giả PASS, không merge/deploy
Production. Mọi kết quả dưới đây phân biệt rõ 3 nguồn nguyên nhân khi
không PASS được:

- **[BUG ỨNG DỤNG]** — lỗi thật trong code/schema của dự án.
- **[GIỚI HẠN SUPABASE]** — hành vi/giới hạn của chính dịch vụ Supabase
  (vd. rate limit gửi email mặc định), không phải lỗi code.
- **[GIỚI HẠN SANDBOX]** — giới hạn của môi trường kiểm thử này cụ thể
  (proxy mạng, không có trình duyệt tương tác thật với tài khoản Google
  thật), sẽ không xảy ra với Founder test trên Preview qua trình duyệt
  thường.

### 5.1 Bảng trạng thái từng luồng

| Luồng | Trạng thái | Cách đã kiểm thử | Ghi chú |
|---|---|---|---|
| Đăng ký Email (mới) | 🔴 **BLOCKED** | — | [GIỚI HẠN SUPABASE] `signUp()` bị `429 over_email_send_rate_limit` (xem mục 8). Cơ chế insert `members` phía sau (trigger) đã PASS riêng — xem hàng "Trigger tạo `members`" bên dưới. |
| Đăng ký Email đã tồn tại — thông báo đúng | 🔴 **BLOCKED** | — | [GIỚI HẠN SUPABASE] cùng lý do — mọi lệnh gọi `signUp()` (kể cả trùng email) đều bị rate limit trước khi tới bước kiểm tra trùng. Logic hiển thị thông báo đã đọc code xác nhận đúng (`register/page.tsx` dòng 64-75, tách rõ case "already registered"/"already exists" khỏi lỗi chung) nhưng chưa tự bấm được để thấy tận mắt. |
| Verify Email (bấm link xác thực) | 🔴 **BLOCKED** | — | [GIỚI HẠN SUPABASE] cần 1 email xác thực thật gửi thành công trước, phụ thuộc luồng bị chặn ở trên. |
| Trigger tạo `members` row khi có `auth.users` mới | 🟢 **PASS** | Insert trực tiếp đúng shape GoTrue dùng vào `auth.users`/`auth.identities` (không qua email, không phải `signUp()`) — xác nhận `members` row tự tạo đúng `email`/`full_name`, `interests=[]`, `onboarding_completed_at=null` | [BUG ỨNG DỤNG đã sửa] Bug gốc: trigger thiếu cột `email` (NOT NULL) → mọi đăng ký thật rollback. Đã `apply_migration` sửa trực tiếp trên Production, verify lại xác nhận đúng. |
| Login Email — đúng/sai mật khẩu | 🟢 **PASS** | `signInWithPassword()` qua API thật, cả 2 trường hợp | Test trên tài khoản tạo bằng insert trực tiếp (không qua `signUp()` thật) — xác nhận đúng **cơ chế đăng nhập**, không thay cho việc xác nhận toàn bộ luồng đăng ký→login từ đầu (phần đó vẫn phụ thuộc luồng email đang BLOCKED). |
| Google Login | 🟡 **PARTIAL** | `GET /auth/v1/authorize?provider=google` → xác nhận redirect 302 thật tới `accounts.google.com` kèm `client_id` thật (provider đã bật, không phải lỗi "not enabled") | [GIỚI HẠN SANDBOX] không có trình duyệt tương tác thật + tài khoản Google thật → không hoàn thành được consent→callback→session→onboarding. **Không đánh dấu PASS cho tới khi Founder tự đăng nhập Google thật trên Preview** (xem checklist 5.3). |
| Google Login — tài khoản trùng email/password có sẵn (chống tạo user trùng) | 🔴 **BLOCKED** | — | [GIỚI HẠN SANDBOX] phụ thuộc hoàn toàn vào Google consent thật (không thể giả lập). Đây cũng là điểm phụ thuộc 1 setting trên Supabase Dashboard (mục 4.6, "account linking") mà sandbox này không đọc được trạng thái bật/tắt. |
| Forgot Password → đặt lại → login mật khẩu mới | 🔴 **BLOCKED** | — | [GIỚI HẠN SUPABASE] `resetPasswordForEmail()` cũng đi qua cùng hạn ngạch gửi email, đã cạn (mục 8). |
| Logout | 🟢 **PASS** (cơ chế) / 🟡 **PARTIAL** (UI) | `signOut()` qua API → `getUser()` sau đó trả `null` đúng | Cơ chế signOut xác nhận đúng qua API. Click thật nút "Đăng xuất" qua trình duyệt **chưa** live-test được trong đợt này ([GIỚI HẠN SANDBOX] — Playwright/Chromium trong sandbox không gọi được ra Supabase qua CORS preflight khi có proxy mạng, xem mục 8). Code `LogoutButton.tsx` đã đọc, logic đơn giản/không rủi ro (`signOut()` → `router.push("/login")`). |
| Session Restore | 🟡 **PARTIAL** | `refreshSession(refresh_token)` qua API → session mới cấp thành công | Xác nhận đúng cơ chế nền (refresh token) mà `@supabase/ssr` dùng để khôi phục session qua cookie. **Chưa** test thật kịch bản "đóng/mở lại trình duyệt" hay "đợi session hết hạn tự nhiên rồi điều hướng" — cần trình duyệt thật, để dành cho checklist Founder. |
| Onboarding gate (RLS tự sửa hồ sơ) | 🟢 **PASS** | Login thật → gọi đúng câu UPDATE y hệt `completeOnboarding()` → xác nhận lưu đúng dữ liệu; thử `update({is_admin:true, email:"..."})` trên chính hàng của mình → bị trigger chặn hoàn toàn | [BUG ỨNG DỤNG đã sửa] Bug gốc: `members` thiếu RLS policy UPDATE cho user tự sửa hồ sơ → mọi user mới kẹt vĩnh viễn giữa `/onboarding`↔`/portal`. Đã thêm policy + trigger khoá cột nhạy cảm, verify cả chiều "lưu đúng" lẫn chiều "không tự nâng quyền được". |
| Route Protection — chưa đăng nhập | 🟢 **PASS** | `curl` trực tiếp vào server thật (không qua Supabase, không cần email/account) | `/portal/hocvienai`, `/onboarding` → 307 tới `/login?next=...` đúng path gốc. `/admin/users`, `/admin/dashboard` → 307 tới `/admin/login`. `/login`, `/register`, `/admin/login` (chưa đăng nhập) → 200, render bình thường. |
| Route Protection — user thường bị chặn `/admin/*`, admin vào được `/admin/users` | 🟡 **PARTIAL** | Đọc code `middleware.ts` (check `members.is_admin` qua `auth.uid()`) + `requireAdmin()` (lớp phòng thủ thứ 2, độc lập ở tầng page) — cùng pattern RLS đã live-verify đúng ở hàng "Onboarding gate" | Chưa live-click với 1 session non-admin thật VÀ 1 session admin thật trong đợt này (đúng ràng buộc "không chỉnh trạng thái user để đánh dấu PASS" — không tự flip `is_admin` của bất kỳ ai để né việc test). Founder tự xác nhận trên Preview bằng 2 tài khoản thật (checklist 5.3). |
| Redirect `next` + chống Open Redirect | 🟢 **PASS** (phần server) / 🟡 **PARTIAL** (phần client sau login) | `curl /auth/callback?next=https://evil.com` (có/không kèm `code` giả) và `?next=//evil.com` → cả 3 đều chỉ redirect `/login?error=auth`, KHÔNG BAO GIỜ phản chiếu giá trị độc hại ra `Location`. `/login?next=https://evil.com`, `/register?next=https://evil.com` → 200, không crash/leak server-side. | Đọc code `sanitizeNextParam()` xác nhận chỉ chấp nhận path nội bộ (`/...`, không phải `//...`). Vòng lặp đầy đủ "login thành công → redirect đúng `next` hợp lệ" cần session thật, để dành checklist Founder. |
| Admin Users (`/admin/users`) | 🟡 **PARTIAL** | Redirect chưa-đăng-nhập → `/admin/login` đã live-test (307). Đọc code xác nhận double-gate (`middleware.ts` + `requireAdmin()` ngay trong `page.tsx`, redirect nếu `null`) | Nội dung danh sách user thật (`listIdentityUsers()`, cần `SUPABASE_SERVICE_ROLE_KEY`) và hành vi với session admin thật chưa live-test — để dành checklist Founder. |
| `npx tsc --noEmit` / `npx eslint` / `npm run build` / `npx vitest run` | 🟢 **PASS** | Chạy lại trong đợt này | 0 lỗi tsc/eslint, build production thành công (route `/register`/`/forgot-password`/`/onboarding`/`/admin/users` xuất hiện đúng), 139/139 vitest pass — không regression từ 2 bug fix vừa áp dụng. |

### 5.2 Vì sao "PASS (cơ chế qua API)" không đồng nghĩa "PASS end-to-end qua UI thật"

Một số hàng trên ghi PASS dựa trên gọi thẳng Supabase Auth API (không
qua UI/trình duyệt) — đây là cách kiểm thử hợp lệ cho **đúng phần được
test** (trigger, RLS, cơ chế signIn/signOut/refresh), nhưng KHÔNG chứng
minh toàn bộ trải nghiệm người dùng thật (bấm nút, thấy đúng màn hình,
đúng thông báo lỗi hiển thị, redirect đúng đích sau khi tương tác UI).
Founder cần tự đóng nốt vòng lặp UI thật trên Preview theo checklist
5.3 trước khi coi bất kỳ luồng nào là "đã xong hoàn toàn".

### 5.3 Checklist Founder tự chạy trên Preview (Supabase thật, trình duyệt thật)

Không có cách nào thay thế được bước này bằng sandbox — cần trình duyệt
tương tác thật (Google consent) và hộp thư thật (nhận email xác thực).
Chạy theo đúng thứ tự, dùng 1 email thật của Founder cho từng bước:

- [ ] Đăng ký email mới (`/register`) → thấy màn hình "Kiểm tra email".
- [ ] Nhận được email xác thực → bấm link → được đưa vào `/onboarding`
      (không phải lỗi/màn hình trắng).
- [ ] Điền xong `/onboarding` → được đưa đúng vào `/portal/hocvienai`
      (hoặc đúng `next` nếu vào từ 1 link `/portal/...` cụ thể).
- [ ] Đăng ký lại với đúng email vừa dùng → thấy thông báo "Email này đã
      có tài khoản. Hãy đăng nhập hoặc dùng Quên mật khẩu."
- [ ] Đăng xuất → thử `/portal/hocvienai` → bị đá về `/login`.
- [ ] Đăng nhập lại bằng mật khẩu SAI → thấy "Email hoặc mật khẩu không
      đúng."
- [ ] Đăng nhập lại bằng mật khẩu ĐÚNG → vào thẳng `/portal` (không phải
      `/onboarding` lần 2).
- [ ] Quên mật khẩu (`/forgot-password`) → nhận được email → bấm link →
      vào `/reset-password` → đặt mật khẩu mới → thấy "Đã đặt lại mật
      khẩu thành công."
- [ ] Đăng nhập bằng mật khẩu MỚI → thành công. Thử mật khẩu CŨ → thất
      bại.
- [ ] "Tiếp tục với Google" (tài khoản Google CHƯA từng dùng trên hệ
      thống) → tạo user mới → vào `/onboarding`.
- [ ] "Tiếp tục với Google" với 1 tài khoản Google có email TRÙNG 1 tài
      khoản email/password đã có sẵn → xác nhận đăng nhập vào ĐÚNG tài
      khoản cũ (không tạo user thứ 2) — đây là điểm phụ thuộc setting
      "account linking" ở Supabase Dashboard (mục 4.6), nếu sai sẽ lộ ra
      ở đúng bước này.
- [ ] Vào `/portal/hocvienai` lúc chưa đăng nhập → bị đá `/login?next=...`
      → đăng nhập xong → quay đúng lại `/portal/hocvienai` (không rơi về
      `/portal` mặc định).
- [ ] Tài khoản thường (`is_admin=false`) vào `/admin/users` → bị chặn,
      đá về `/admin/login`.
- [ ] Tài khoản `is_admin=true` vào `/admin/users` → thấy danh sách user
      thật, không có ô xem/sửa mật khẩu ở bất kỳ đâu.
- [ ] Responsive mobile thật (không chỉ đọc code) cho `/register`,
      `/forgot-password`, `/onboarding`, `/admin/users`.
- [ ] Mở DevTools Console trong toàn bộ luồng trên → không có lỗi
      nghiêm trọng nào.

---

## 6. Rủi ro & việc cần Founder phê duyệt trước khi lên Production

1. **Áp dụng migration `supabase-phase23-identity-hub.sql` vào Production
   — CHƯA được tự động chạy** (đúng yêu cầu "không tự thay đổi dữ liệu
   thật"). Founder cần tự chạy trên Supabase Dashboard SQL Editor, verify
   bằng 2 câu lệnh cuối file, rồi mới deploy code lên. Nếu deploy code
   trước khi có migration, `/onboarding` và `/admin/users` sẽ lỗi (thiếu
   cột/trigger) — **thứ tự bắt buộc: migration trước, deploy code sau**.
2. **Google OAuth provider chưa xác nhận được có bật trên Supabase Dashboard
   hay chưa** — code đã sẵn sàng (nút "Tiếp tục với Google" hoạt động ở cả
   `/login` và `/register`), nhưng nếu provider chưa bật ở Dashboard, user
   bấm vào sẽ gặp lỗi từ phía Supabase. Cần Founder xác nhận đã làm đúng
   mục 4.
3. **Auto-link tài khoản Google + email trùng phụ thuộc 1 setting Dashboard
   (mục 4.6) mà tên gọi/hành vi chính xác thay đổi theo phiên bản GoTrue** —
   không tự chắc chắn 100% từ code, cần Founder tự bật và tự test đúng
   kịch bản "đăng ký email/password trước, đăng nhập Google cùng email
   sau" để xác nhận không tạo 2 user.
4. **User cũ (đăng ký trước khi Identity Hub v1.0 tồn tại) sẽ bị chặn vào
   `/portal/*` cho tới khi hoàn thành `/onboarding`** — đây là hành vi
   ĐÚNG THEO YÊU CẦU ("Người dùng mới hoàn thành onboarding trước khi vào
   Học viện"), nhưng cũng áp dụng cho user cũ đã dùng Portal từ trước
   (họ chưa từng có `onboarding_completed_at`). Nếu Founder muốn user cũ
   được miễn onboarding, cần 1 quyết định riêng (vd. backfill
   `onboarding_completed_at = created_at` cho user cũ trong cùng đợt
   migration) — **chưa tự quyết định, hỏi Founder trước khi thêm dòng
   backfill này vào migration.**
5. **`/admin/users` hiện tại là chỉ xem (read-only)** — không có thao tác
   đổi role (cấp/rút quyền Admin) hay khoá tài khoản qua UI, đúng những gì
   đề bài mô tả (Danh sách/Tìm kiếm/Role/Trạng thái/Ngày đăng ký/Lần đăng
   nhập/Provider — không nhắc thao tác chỉnh sửa). Nếu Founder muốn thêm
   khả năng đổi role qua UI, đây là việc riêng cần duyệt (thao tác cấp
   quyền Admin là hành động nhạy cảm, nên có xác nhận rõ ràng trước khi
   xây).
6. **`orders.member_email` vẫn là text match, không FK tới `auth.users`/
   `members`** (phát hiện từ audit, không phải lỗi mới) — nếu user đổi
   email trên tài khoản, lịch sử mua hàng cũ (`getPurchasedIds()`) sẽ
   không khớp được nữa. Đây là nợ kỹ thuật có từ trước Identity Hub v1.0,
   NGOÀI PHẠM VI đợt này (đề bài không yêu cầu sửa hệ thống order) — ghi
   nhận lại để Founder biết, không tự sửa.
7. **Chưa test thật với Supabase Production** (xem mục 5) — mọi xác nhận
   ở trên dựa trên: đọc code kỹ + build/test/lint sạch + smoke-test qua
   `next dev` ở trạng thái Supabase chưa cấu hình. Founder cần tự chạy
   checklist ở mục 5 trên Preview/Production URL trước khi coi Identity
   Hub là "đã xong" hoàn toàn.
8. **2 bug P0 đã tìm và sửa TRỰC TIẾP trên Supabase Production trong lúc
   kiểm thử** (xin phép Founder trước cả 2 lần, không tự ý) — cần Founder
   biết rõ đã đụng gì vào dữ liệu/schema thật, dù không đụng code:
   - Trigger `handle_new_auth_user()` (`on_auth_user_created`) thiếu cột
     `email` khi insert `public.members` (`NOT NULL`) → MỌI đăng ký mới
     (Register/Google/magic-link) đều rollback, lỗi 500. Đã sửa qua
     `apply_migration`, backfill 1 nạn nhân thật (`hhhgmail@gmail.com`,
     mồ côi từ 2026-06-15, trước khi Identity Hub tồn tại).
   - `members` thiếu RLS policy UPDATE cho user tự sửa hồ sơ (chỉ có
     SELECT + `admin_all`) → mọi user mới hoàn thành xong `/onboarding`
     bị kẹt vĩnh viễn (UPDATE bị RLS lọc âm thầm, 0 dòng, không lỗi) →
     vòng lặp `/onboarding`↔`/portal` vô hạn. Đã thêm policy UPDATE +
     trigger khoá cột nhạy cảm (`is_admin`/`email`/`id`/`status`/
     `referral_code`/`referred_by`) chống tự nâng quyền qua đúng lỗ hổng
     vừa mở.
   - Cả 2 file SQL tracking đã commit vào repo (nhánh
     `claude/landing-preview-nextjs`):
     `supabase-phase23-fix-signup-trigger-missing-email.sql` (lịch sử,
     tạo trên nhánh `admin-rebuild` cũ trước khi gộp) và
     `supabase-phase24-members-self-update-rls.sql`.
   - **Founder cần tự xác nhận lại 2 thay đổi này khi review migration
     `supabase-phase23-identity-hub.sql`** — trigger trong file migration
     gốc đó (`create or replace function handle_new_auth_user()`) ĐÃ
     ĐƯỢC SỬA để thêm `email` (không còn khớp 100% với phiên bản gốc
     Founder có thể đã đọc/duyệt trước đó) — nếu Founder có bản backup/
     bản đã review riêng của file này, cần đối chiếu lại.

---

## 8. Email Rate Limit — điều tra & đề xuất (chưa triển khai, chờ Founder duyệt)

### 8.1 Loại limit đã chạm

Xác nhận qua **Supabase Auth logs thật** (`get_logs`, service `auth`),
không suy đoán — mọi lần `signUp()`/`resetPasswordForEmail()`/
`signInWithOtp()` gửi email trong đợt kiểm thử này đều trả về:

```json
{
  "status": 429,
  "error": "429: email rate limit exceeded",
  "error_code": "over_email_send_rate_limit",
  "path": "/signup"  // hoặc "/otp"
}
```

Đây là **giới hạn gửi email mặc định của Supabase Auth khi dùng mailer
tích hợp sẵn (built-in, chưa cấu hình Custom SMTP)** — theo tài liệu
chính thức của Supabase, mailer mặc định giới hạn rất thấp (khuyến nghị
chính thức: **bắt buộc cấu hình Custom SMTP trước khi có traffic thật**,
mailer mặc định chỉ dành cho việc phát triển/thử nghiệm). Đây là hành vi
đúng thiết kế của Supabase, KHÔNG phải bug ở code dự án.

### 8.2 Thời gian chạm limit (từ log thật)

| Thời điểm (UTC) | Endpoint | Referer |
|---|---|---|
| 2026-07-29 05:12:23 | `/otp` | `https://voduongai.vercel.app` |
| 2026-07-29 06:10:34 | `/signup` | `https://voduongai.vercel.app` |
| 2026-07-29 06:10:35 | `/signup` | `https://voduongai.vercel.app` |

**Lưu ý quan trọng:** cả 3 request bị chặn đều mang `referer:
https://voduongai.vercel.app` — tức là traffic THẬT từ Preview/Production
deploy trên Vercel, KHÔNG phải request phát sinh từ sandbox kiểm thử này
(các script test trong sandbox gọi thẳng REST API, không mang theo
referer đó). Nhiều khả năng đã có người (Founder hoặc người khác) tự thử
đăng ký trên Preview URL trong cùng khung giờ và cũng bị chặn bởi đúng
limit này.

**Không xác định được chính xác thời điểm cooldown hết hạn** — Supabase
không lộ thông tin "còn bao lâu nữa được gửi tiếp" qua log hay qua API
công khai nào mà sandbox này đọc được (không có Management API endpoint
cho việc này trong bộ công cụ hiện có). Theo tài liệu Supabase, cửa sổ
giới hạn của mailer mặc định là **theo giờ** — nếu đúng, hạn ngạch nhiều
khả năng đã/sẽ tự làm mới trong vòng 1 giờ kể từ lần bị chặn gần nhất
(06:10:35 UTC hôm nay), nhưng đây là suy luận dựa trên tài liệu chung của
Supabase, không phải số liệu xác nhận được cho riêng project này.

### 8.3 Đánh giá nhu cầu Custom SMTP

**Cần thiết, mức độ ưu tiên cao, trước khi có traffic thật.** Lý do:

- Giới hạn mặc định đã bị chạm chỉ bởi hoạt động kiểm thử + có thể vài
  lượt thử của 1 người — một đợt ra mắt/traffic tăng đột biến thật chắc
  chắn sẽ chạm limit này ngay, khiến **user thật đăng ký/quên-mật-khẩu
  thất bại hàng loạt** mà không có cách nào tăng hạn ngạch tức thời.
- Đây là khuyến nghị chính thức của Supabase cho mọi project chuẩn bị
  lên production, không riêng dự án này.

**Không tự cấu hình Custom SMTP trong đợt này** — đây là thay đổi cấu
hình Supabase Dashboard (Authentication → Settings → SMTP Settings),
cần Founder tự chọn nhà cung cấp (Resend, Postmark, SendGrid, AWS SES...)
và tự nhập credential thật (API key nhà cung cấp) — sandbox này không có
và không nên có quyền truy cập những credential đó.

### 8.4 Đề xuất chống rate-limit trước khi ra mắt (đề xuất — CHƯA triển khai)

1. **Custom SMTP** (mục 8.3) — giải pháp gốc rễ, giải quyết luôn cả vấn
   đề độ tin cậy gửi email (mailer mặc định của Supabase cũng có tỷ lệ
   vào spam cao hơn SMTP có domain xác thực riêng).
2. **Giám sát lỗi gửi email** — thêm cảnh báo (Vercel log alert / Sentry
   / tương đương đã dùng trong dự án nếu có) khi API trả `error_code:
   over_email_send_rate_limit`/`over_sms_send_rate_limit` để Founder biết
   ngay khi user thật bắt đầu bị ảnh hưởng, không phải đợi user report.
3. **Thông báo lỗi thân thiện ở UI** — hiện tại `register/page.tsx`/
   `forgot-password/page.tsx` khi `signUp()`/`resetPasswordForEmail()`
   lỗi chỉ hiện thông báo chung ("Không thể tạo tài khoản, vui lòng thử
   lại." / "Không gửi được liên kết, vui lòng thử lại.") — user thật gặp
   đúng lỗi rate-limit sẽ thấy thông báo này và **không hiểu vì sao**,
   dễ bấm thử lại liên tục làm tình hình nặng hơn. Đề xuất: phân biệt
   riêng `error_code === "over_email_send_rate_limit"` (nếu message lộ ra
   được ở tầng client) → thông báo rõ "Hệ thống đang gửi email quá nhiều
   trong thời gian ngắn, vui lòng thử lại sau vài phút" thay vì thông báo
   lỗi chung.
4. **Chống gửi lại liên tục (client-side throttle)** — thêm cooldown
   ngắn (vd. disable nút 30-60s sau khi gửi) cho nút "Gửi liên kết đăng
   nhập"/"Gửi liên kết đặt lại mật khẩu"/"Đăng ký" để giảm khả năng 1
   user tự làm cạn hạn ngạch của chính họ bằng cách bấm lại nhiều lần khi
   thấy màn hình không đổi ngay lập tức.
5. **Không tự triển khai bất kỳ đề xuất nào ở trên** trong đợt này — cần
   Founder duyệt trước, đặc biệt mục 1 (cần credential thật) và mục 2
   (cần biết dự án đã có sẵn công cụ giám sát nào, tránh tạo trùng).

---

## 9. Việc CHƯA làm (theo đúng "Không thực hiện" của đề bài)

- Không đổi thiết kế Landing Page ngoài các liên kết đăng nhập/đăng ký.
- Không xây hệ thống thanh toán.
- Không thêm Facebook/Apple/GitHub login.
- Không tự merge/deploy Production hoặc chạy migration vào dữ liệu thật.
- Không xoá bất kỳ phần auth cũ nào (`/admin/login` magic-link, magic-link
  ở `/login`, `src/lib/portal/onboarding.ts` goal-picker) — tất cả vẫn
  hoạt động song song, không có kế hoạch migrate/xoá nào được yêu cầu.
