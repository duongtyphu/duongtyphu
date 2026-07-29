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
- **CHƯA merge vào `main`.**
- Điều kiện bắt buộc trước khi tạo Release Candidate để merge `main` +
  deploy Production (mọi mục PASS mới được merge):
  1. Apply migration lên Supabase Production.
  2. Cấu hình Google OAuth đầy đủ (xem mục 4).
  3. Hoàn thành end-to-end test trên Preview với Supabase thật (xem mục 5).
  4. Xác nhận PASS từng luồng: Đăng ký Email, Verify Email, Login Email,
     Google Login, Forgot Password, Logout, Session Restore, Onboarding,
     Route Protection, Admin Users.
- **Không merge Production trước khi hoàn thành toàn bộ checklist trên.**

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

## 5. Báo cáo kiểm thử

### Đã tự kiểm thử được (trong sandbox này)

| # | Hạng mục | Cách kiểm thử | Kết quả |
|---|---|---|---|
| 1 | `npx tsc --noEmit` | Toàn bộ project | ✅ 0 lỗi |
| 2 | `npx eslint .` | Toàn bộ project | ✅ 0 lỗi, 18 warning (đều pre-existing, không thuộc Identity Hub) |
| 3 | `rm -rf .next && npm run build` | Production build | ✅ Thành công, mọi route mới (`/register`, `/forgot-password`, `/onboarding`, `/admin/users`) build đúng |
| 4 | `npx vitest run` | Toàn bộ unit test | ✅ 139/139 pass, không regression |
| 5 | Route smoke test qua `next dev` (Supabase CHƯA cấu hình — trạng thái mặc định sandbox) | `curl` từng route | `/login`/`/register`/`/forgot-password`/`/onboarding`/`/portal` → 200 (đúng fallback public khi chưa cấu hình); `/admin/users` → 307 redirect `/admin/login` (đúng — Admin không bao giờ mở khi chưa cấu hình) |
| 6 | Console/log lỗi khi chạy `next dev` | Đọc log server | Phát hiện 1 lỗi thật (`/onboarding` crash khi Supabase chưa cấu hình vì thiếu guard `if (!process.env...)`, khác các trang khác trong repo đều có guard này) → **đã sửa ngay**, re-test xác nhận hết lỗi |
| 7 | Responsive (mobile/desktop) | Đọc code Tailwind (`max-w-sm`, `px-5`, responsive padding `md:py-28`) đồng nhất với `/login`/`/reset-password` đã có sẵn và đã được audit responsive ở phiên trước | Cấu trúc giống hệt các trang auth đã qua audit responsive trước đó — rủi ro thấp, nhưng **chưa tự chụp ảnh Playwright riêng cho `/register`/`/forgot-password`/`/onboarding`** |

### CHƯA tự kiểm thử được — cần Founder tự test trên môi trường có Supabase thật đăng nhập được

Sandbox này không có `SUPABASE_SERVICE_ROLE_KEY` thật cấu hình sẵn và
không có tài khoản Google thật để thao tác OAuth consent screen — đây là
giới hạn quyền truy cập của môi trường, không phải bỏ qua bước test (cùng
giới hạn đã ghi nhận nhiều lần trong lịch sử dự án, xem `CLAUDE.md`).
Founder cần tự làm checklist sau trên Preview/Production URL **sau khi**
đã apply migration + cấu hình Google OAuth (mục 3-4):

- [ ] Đăng ký email mới → nhận email xác thực → bấm link → đăng nhập được.
- [ ] Đăng ký với email đã tồn tại → thấy đúng thông báo "đã có tài khoản".
- [ ] Đăng nhập sai mật khẩu → thấy thông báo lỗi rõ ràng.
- [ ] Xác thực email hoạt động đúng (link hết hạn/dùng lại báo lỗi hợp lý).
- [ ] Quên mật khẩu → đặt lại → đăng nhập bằng mật khẩu mới thành công.
- [ ] Đăng nhập Google (tài khoản Google chưa từng dùng) → tạo user mới,
      vào `/onboarding`.
- [ ] Đăng nhập Google với email TRÙNG 1 tài khoản email/password đã có
      sẵn → xác nhận KHÔNG tạo user trùng (đây là điểm phụ thuộc setting
      Dashboard ở mục 4.6 — nếu chưa bật đúng, đây là nơi sẽ lộ ra).
- [ ] Session hết hạn (đợi hết hạn hoặc xoá cookie) → bị đá về `/login`
      đúng lúc điều hướng.
- [ ] Đăng nhập từ `/portal/hocvienai` (đã bị middleware redirect sang
      `/login?next=/portal/hocvienai`) → sau khi đăng nhập/onboarding
      xong → về đúng lại `/portal/hocvienai`.
- [ ] Tài khoản thường vào `/admin/*` → bị chặn. Tài khoản `is_admin=true`
      vào `/admin/users` → thấy danh sách, không thấy/sửa được mật khẩu
      ai cả (đúng thiết kế — không có ô nhập mật khẩu ở đâu trong toàn bộ
      Identity Hub).
- [ ] Responsive mobile thật (không chỉ đọc code) cho `/register`,
      `/forgot-password`, `/onboarding`, `/admin/users`.
- [ ] Console trình duyệt không có lỗi nghiêm trọng trong toàn bộ luồng
      trên.

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

---

## 7. Việc CHƯA làm (theo đúng "Không thực hiện" của đề bài)

- Không đổi thiết kế Landing Page ngoài các liên kết đăng nhập/đăng ký.
- Không xây hệ thống thanh toán.
- Không thêm Facebook/Apple/GitHub login.
- Không tự merge/deploy Production hoặc chạy migration vào dữ liệu thật.
- Không xoá bất kỳ phần auth cũ nào (`/admin/login` magic-link, magic-link
  ở `/login`, `src/lib/portal/onboarding.ts` goal-picker) — tất cả vẫn
  hoạt động song song, không có kế hoạch migrate/xoá nào được yêu cầu.
