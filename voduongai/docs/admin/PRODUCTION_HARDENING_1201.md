# IMP-PRODUCTION-HARDENING-1201 — Admin CMS v1.0: Final Production Hardening & Deployment

**Sprint:** PRODUCTION-HARDENING-1201 · **Stage:** Production Hardening · **Mode:** Production Hardening Mode
**Ngày:** 2026-07-13 · **Branch:** `claude/vietnamese-greeting-zkzn2p` · **PR:** #48

**KẾT LUẬN NGAY ĐẦU BÁO CÁO (theo đúng STOP RULE của brief):**

> ## 🛑 PRODUCTION DEPLOYMENT BLOCKED
> KHÔNG merge PR #48. KHÔNG deploy Production. Lý do cụ thể ở mục "3. Release Recommendation" bên dưới.

---

## 1. Production Hardening Report

### 1.1. Phạm vi đã thực hiện trong sprint này

Sprint này KHÔNG lặp lại toàn bộ audit đã làm ở STABILIZATION-SPR-1101 (sprint liền trước, cùng phiên) — chỉ audit lại bằng 3 agent song song để tìm phát hiện MỚI, rồi xử lý những gì thực sự an toàn/đúng phạm vi "sửa lỗi, hoàn thiện, chuẩn hóa, productionize" mà Founder Directive cho phép.

**Đã xử lý (code changes, đã verify sạch):**

1. **Workstream H — admin.html (Founder Decision, không tự xóa):** Agent audit xác nhận `admin.html` (legacy static site ở repo root) **KHÔNG orphan về mặt dữ liệu** — vẫn là đường ghi thật vào CÙNG Supabase Production (18 bảng: orders, members, coupons...) qua auth thật (không phải bypass), chỉ orphan về mặt điều hướng (không còn link nào trỏ tới, chỉ truy cập qua bookmark/URL trực tiếp). Đã hỏi Founder trực tiếp — quyết định: **chưa xóa file, chỉ khóa ghi trước.** Đã thực hiện: `admin.html` giờ chặn toàn bộ `.insert/.update/.upsert/.delete` (kể cả Storage `.upload/.update/.remove`) ngay tại tầng client, chỉ patch runtime của riêng `admin.html` (KHÔNG đụng `assets/js/supabase-config.js` dùng chung bởi `login.html`/`register.html`/`portal.html`/`profile.html` — các trang đó vẫn cần ghi thật, không thuộc phạm vi sprint này). Thêm banner đỏ cố định ở đầu trang thông báo rõ "đã ngừng ghi dữ liệu, dùng /admin". `.select()` và auth session vẫn hoạt động — trang vẫn xem được, không bị vỡ hoàn toàn. RLS vẫn là boundary thật (không đổi).
2. **Workstream I/J — sửa lỗi mất dữ liệu âm thầm (Website Global Settings + Media Center):** phát hiện mới — cả 2 form này đã có UI ghi thật (`useCollection`) từ WEB-SPR-201/MEDIA-SPR-201 nhưng `collectionKey` (`website-global-settings`, `media-assets`) chưa từng được đăng ký trong `SUPABASE_COLLECTIONS` → mọi lần Founder lưu chỉ ghi vào `localStorage` của trình duyệt hiện tại, mất khi đổi máy/xoá cache, không đồng bộ giữa các phiên Admin. Đã thêm migration additive `supabase-production-hardening-collections-migration.sql` (2 bảng mới, shape chuẩn giống mọi bảng collection khác) và đăng ký 2 key vào `supabaseCollections.ts`. Đây là sửa lỗi thật, không phải tính năng mới — cả 2 collection hiện chưa có Portal Consumer nào (đã xác nhận qua audit).
3. **Workstream C — xác nhận lại Premium coverage:** không có gap thật cần sửa. Course-level Publish (`courses.status` open/coming) đã tồn tại đúng ở `/admin/course-pricing` theo đúng phân chia quyền sở hữu Academy (structure) / Premium (giá, mở-đóng đăng ký) đã quyết định ở STABILIZATION-SPR-1101 Task 2.3 — không phải thiếu sót.

**Verification sau các thay đổi trên:** `npm run lint` (0 lỗi, 5 warning `<img>` cũ), `rm -rf .next && npm run build` (thành công), `npm run test` (139/139 pass).

### 1.2. KHÔNG xử lý trong sprint này (và lý do)

Đây là phần quan trọng nhất của báo cáo — brief tự đặt ra mâu thuẫn nội tại: Founder Directive nói **"KHÔNG phát triển thêm tính năng mới"**, nhưng Workstream J đòi hỏi 100% Portal phải quản trị được qua Admin — trong khi audit (agent thứ 3, xem mục 2) xác nhận nhiều mảng Portal **hoàn toàn chưa có đường ghi Admin nào** (không phải thiếu vài field, mà là 0% — Companion, Sứ mệnh Companion, Hành trình của tôi phần nội dung biên tập, CKOS "Lesson"). Xây CRUD mới hoàn toàn cho các mảng này = tính năng mới, vi phạm chính rule đầu tiên của Mode này. Vì vậy sprint này **ưu tiên tuân thủ "không tính năng mới" hơn là ép đạt 100% coverage**, và ghi nhận đây là mâu thuẫn cần Founder quyết định hướng đi (ưu tiên cái nào) ở sprint sau — không tự ý chọn.

Ngoài ra các hạng mục lớn đã audit sâu ở STABILIZATION-SPR-1101 (Workstream A/B/E/F/G, RBAC) — **không có gì thay đổi so với báo cáo trước**, không audit lại: AI Workspace vẫn hardcode 4 nguồn Prompt độc lập; Lifecycle 15/34+ collection có pipeline; Brand Studio Color Registry vẫn localStorage-only, `layout.tsx` (Server Component) không đọc được trực tiếp; Companion Memory 6 hệ không hợp nhất; Activity Log/Audit Log thật chưa tồn tại; RBAC chỉ 1 boolean `is_admin`.

---

## 2. Portal Coverage Report (Workstream J)

Agent audit mới (khác với STABILIZATION-SPR-1101, tập trung vào các mảng CHƯA soi kỹ trước đó):

| Khu vực Portal | Verdict | Bằng chứng |
|---|---|---|
| Dự án & Cơ hội | **FULL** | PROJECTS-SPR-602 — Canonical, đã xác nhận trước |
| Cộng đồng | **PARTIAL** | `CommunityExternalLinks` đọc collection `community` thật; nhưng `LEARNING_SPACES` (`congdongai/page.tsx:118`) và `NEWS` (`:192`) vẫn hardcode |
| Hệ tri thức AI (CKOS) | **PARTIAL, tệ hơn tưởng** | Tool/Prompt/Resource/SOP có CRUD thật; nhưng hub `/portal/ckos` đếm từ seed tĩnh (`page.tsx:15-17,76-78`), và "Lesson" (nội dung tri thức thật) 100% hardcode — CRUD "Knowledge Seed" tồn tại nhưng KHÔNG nằm trong `SUPABASE_COLLECTIONS` → localStorage-only, không tới được Portal |
| Học viện AI | **NONE** cho catalog | `AI_TOOLS` hardcode (`data/khong-gian-ai/index.ts:675`), `FAQ` hardcode (`hocvienai/page.tsx:36`); "Learning Journeys" **cố ý read-only theo thiết kế** (`academy/journeys/page.tsx:19-27`, không phải lỗi) |
| Hành trình của tôi | **NONE** cho nội dung biên tập | `DOORS`/`HUB_DUST_SPOTS`/`REFLECTION_PROMPTS` hardcode; các route con (bản đồ/story/mirror/nhật ký/khu vườn) đọc Supabase thật nhưng là **dữ liệu người dùng**, không phải nội dung Founder biên tập |
| Sứ mệnh Companion | **NONE** | 100% hardcode (`GENOME`/`CONSTITUTION`/`MISSION_ITEMS`), 0 Admin CRUD — `/admin/journey` chỉ là dashboard tự-audit, không phải form |
| Companion | **NONE** | 0 Admin CRUD — `COMPANION_TODAY_THOUGHTS`/`COMPANION_MUSINGS` hardcode; `/admin/companion-studio` là bảng tự-audit tĩnh, không phải CRUD |
| Website / Global Settings | **NONE (đã sửa đường ghi ở mục 1.1)** | UI thật nhưng orphan write path — nay đã đăng ký, chờ chạy migration |
| Media Center | **NONE (đã sửa đường ghi ở mục 1.1)** | Tương tự Website Global Settings |
| Premium | mostly **FULL** hạ tầng | Schema/pricing/checkout/entitlement/learning-page đều generic, chờ migration chạy + Founder nhập nội dung thật |
| AI Workspace | **NONE** (given, STABILIZATION-SPR-1101) | Chưa đổi |
| Brand & Theme | **NONE runtime** (given) | Chưa đổi |

**Kết luận Workstream J: KHÔNG đạt 100%.** Nhiều hơn số gap đã biết trước sprint này (Companion, Sứ mệnh Companion, Hành trình biên tập, CKOS Lesson là phát hiện mới, chưa từng nêu ở báo cáo nào trước — bằng chứng đủ để xác nhận không phải bỏ sót, mà là các mảng cố tình chưa có Admin do được xây dựng như trang tĩnh/biên tập trực tiếp trong code từ đầu).

---

## 3. Migration Report

**Migration KHÔNG thể chạy trong phiên làm việc này — không phải do rủi ro, mà do môi trường này không có Supabase credentials** (`env | grep -iE "supabase|database|postgres"` → rỗng; `.env.example` chỉ có tên biến, giá trị thật chỉ tồn tại trên Vercel Production). Đây là chặn cứng, không phải quyết định chủ quan.

**Danh sách migration cần chạy trên Production trước merge/deploy (theo thứ tự, tất cả additive, có rollback):**
1. `supabase-premium-learning-content-migration.sql` (STABILIZATION-SPR-1101) — `course_modules`, `course_lessons`, `orders.course_ref_id`.
2. `supabase-projects-opportunities-migration.sql` (PROJECTS-SPR-602) — bảng `ecosystems`.
3. `supabase-production-hardening-collections-migration.sql` (sprint này) — `website_global_settings`, `media_assets`.

Không migration nào xóa cột/bảng cũ, không migration nào có nguy cơ mất dữ liệu, mỗi file có comment rollback (`drop table if exists ...`) ngay trong file. Không ghi secret nào vào báo cáo này hay bất kỳ file nào trong PR.

---

## 4. Legacy Removal Report (Workstream H/I)

- `admin.html`: **chưa xóa**, đã khóa ghi (chi tiết mục 1.1). Founder quyết định: xác nhận Next.js Admin thay thế 100% đường ghi trong thời gian tới, sau đó mới xóa hoàn toàn ở sprint sau.
- Không phát hiện Dead Code/Orphan Component/Legacy Route mới nào ngoài những gì đã xử lý ở STABILIZATION-SPR-1101 (4 component orphan, `LearningPathSection`, 1 ảnh orphan, 22 file brand di dời sang `design-source/`).

---

## 5. Workspace Coverage Report

Không có Workspace mới được tạo (đúng Founder Directive "KHÔNG tạo Workspace mới"). 11 Workspace hiện có (Portal, CKOS, Academy, Premium/Course-pricing, Website, Brand, Media, Companion Studio, Journey/Community, Founder, Projects & Opportunities) giữ nguyên cấu trúc — chỉ 2 collection (Website Global Settings, Media Center) được sửa đường ghi.

---

## 6. RBAC Report

Không đổi so với STABILIZATION-SPR-1101: hệ thống chỉ có 1 boolean `is_admin` trên bảng `members` + 1 email hardcode fallback (`duongvv.vn@gmail.com`) — đủ an toàn cho mô hình thực tế hiện tại (1 Founder = 1 Admin), **chưa đáp ứng** mô hình 7-role brief từng nhắc ở các sprint trước. Không thay đổi RBAC trong sprint này (nằm ngoài phạm vi "sửa lỗi" — xây RBAC nhiều role là tính năng mới).

---

## 7. Audit Report

Activity Log/Audit Log/Publish Queue đọc dữ liệu thật: **chưa tồn tại** (xác nhận lại, không đổi so với STABILIZATION-SPR-1101). Đây là 1 trong các lý do STOP.

---

## 8-9. Production URL / Admin URL

**Không có Production URL mới** — sprint này không merge, không deploy, nên không có gì thay đổi trên Production so với trước sprint. Production hiện tại (trước sprint, không đổi bởi sprint này): domain chính `https://v-academy-mauve.vercel.app` (theo `SITE_URL` trong `assets/js/supabase-config.js`) cho phần Landing Page/static site; Admin CMS Next.js build trong PR #48 vẫn chỉ tồn tại trên Preview deployment (Vercel), theo đúng chuỗi sprint trước — chưa có Production URL riêng cho Admin CMS vì chưa từng merge.

---

## 10. Founder Test Checklist (chuẩn bị sẵn cho khi Production Ready thật)

- [ ] Chạy 3 migration SQL trên Supabase Production (mục 3), theo đúng thứ tự.
- [ ] Đăng nhập `/admin` bằng tài khoản Founder — xác nhận `is_admin=true`.
- [ ] Vào `/admin/website` → Global Settings → sửa 1 field → lưu → tải lại trang → xác nhận còn dữ liệu (kiểm chứng fix migration #3).
- [ ] Vào `/admin/media-center` → thêm 1 asset → tải lại → xác nhận còn (kiểm chứng fix migration #3).
- [ ] Mở `admin.html` (URL cũ) → thử sửa 1 dòng bất kỳ → xác nhận hiện alert chặn ghi, KHÔNG lưu được.
- [ ] Vào `/admin/academy/courses` → thêm Module/Lesson thật cho 1 khoá → publish → đăng nhập Portal bằng tài khoản đã mua khoá đó → vào `/portal/premium/hoc/[courseId]` → xác nhận thấy nội dung.
- [ ] Test checkout thật 1 đơn hàng nhỏ → xác nhận entitlement tự động mở khóa.

---

## 11. Release Recommendation — 🛑 PRODUCTION DEPLOYMENT BLOCKED

Theo đúng STOP RULE của brief, liệt kê đủ điều kiện chặn:

| Điều kiện chặn (STOP RULE) | Trạng thái |
|---|---|
| Migration chưa chạy | ❌ 3 migration chưa chạy trên Production (không có credentials trong môi trường này) |
| P0/P1 tồn đọng | ❌ Workstream A (AI Workspace), B (Lifecycle), E (Brand/Theme runtime), F (Companion architecture), G (Audit Log) đều chưa đạt Production Ready |
| Portal Coverage 100% (Workstream J) | ❌ Companion, Sứ mệnh Companion, Hành trình biên tập, CKOS Lesson = 0% Admin-managed |
| RBAC đầy đủ | ❌ Chỉ 1 boolean, chưa đáp ứng mô hình role đầy đủ (dù đủ an toàn cho quy mô hiện tại) |
| Checkout/Entitlement test thật | ❌ Không thể test — không có Supabase Production credentials/trình duyệt tương tác trong môi trường này |

**Vì các điều kiện trên chưa đạt, theo đúng FINAL ACCEPTANCE của brief: KHÔNG được báo "PRODUCTION DEPLOYED".**

**Hành động đã thực hiện đúng STOP RULE:** KHÔNG merge PR #48. KHÔNG deploy Production. Đã cập nhật PR #48 với toàn bộ thay đổi sprint này. Báo cáo này nộp về 01 – Product & Roadmap để Founder quyết định hướng tiếp theo — đặc biệt là mâu thuẫn giữa "không tính năng mới" và "100% Portal Coverage" (mục 1.2), và thời điểm cấp Supabase Production credentials cho một phiên làm việc để tự chạy migration + test thật trước khi có thể tiến tới Release Candidate thật sự.
