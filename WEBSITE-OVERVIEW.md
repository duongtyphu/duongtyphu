# Tổng quan Website VO DUONG AI

> Tài liệu tổng hợp toàn bộ cấu trúc website tại thời điểm 2026-06-25, sau khi
> hoàn tất đợt audit bảo mật/chất lượng và rebrand "VDAI" → "VO DUONG AI".

Hệ thống hiện gồm **2 phần** trong cùng repo.

## A. Trang tĩnh (root) — Website marketing/landing

Deploy qua `vercel.json`, các file HTML độc lập:

| Trang | Vai trò |
|---|---|
| `index.html` | Trang chủ — giới thiệu VO DUONG AI, quiz "Bản đồ Affiliate AI", case study, giảng viên |
| `login.html` / `register.html` | Đăng nhập / đăng ký (bản tĩnh, song song với Next.js) |
| `portal.html` / `profile.html` | Portal/hồ sơ bản tĩnh |
| `admin.html` | Trang quản trị bản tĩnh |
| `viewer.html` | Xem nội dung/tài liệu |
| `privacy.html`, `terms.html`, `refund-policy.html` | Pháp lý — đã sửa câu sai về thanh toán online |
| `thank-you.html`, `404.html` | Trang cảm ơn / lỗi 404 |

Có rewrite cho `/v-solo`, `/v-scale`, `/blog` và redirect 301 từ `/vdai-solo`,
`/vdai-scale` cũ.

⚠️ **Lưu ý kiến trúc:** các trang `terms.html` / `privacy.html` /
`refund-policy.html` và `login.html` / `register.html` / `portal.html`
**trùng chức năng** với các route tương ứng trong app Next.js (`/terms`,
`/login`, `/portal`...). Đây là 2 hệ thống song song — nên xác nhận lại đâu
là bản đang thực sự chạy production để tránh nội dung pháp lý/giá lệch nhau
giữa 2 bản.

## B. App Next.js (`voduongai/`) — Portal + Admin (hệ thống chính, có DB)

### Trang công khai

`/`, `/about`, `/contact`, `/blog`, `/blog/[slug]`, `/login`,
`/reset-password`, `/privacy`, `/terms`, `/refund-policy`

### Portal học viên (`/portal/**`) — cần đăng nhập

Tổng quan, Bắt đầu tại đây, Lộ trình thành công, Học viện AI, **Học viện
Affiliate (V-SOLO/V-SCALE)**, Thương hiệu cá nhân, Dự án thực chiến,
Prompt/Công cụ/Template/Ebook/Checklist/SOP, Affiliate Hub, Hoa hồng giới
thiệu, Sản phẩm số, Sản phẩm của tôi, Dịch vụ, Tài sản số, Case Study, Thành
công học viên, Tin tức, Đã lưu, Hỗ trợ, Cộng đồng, Hồ sơ, **Checkout**.

### Khu quản trị (`/admin/**`) — bảo vệ bởi middleware + `requireAdmin`

Dashboard, Đơn hàng, Coupon, Users, Leads, Reports, **Cài đặt** (đã sửa lỗi
trắng trang), **Học phí V-SOLO/V-SCALE** (mới thêm), Portal Builder
(banner/CTA/featured/start-here/today-actions/user-goals), toàn bộ CRUD nội
dung (Blog, Prompt, Tools, Templates, Ebooks, Checklist, SOP, Resources,
News, Updates, Community, Case Study, Student Success, AI Academy, Affiliate
Academy, Personal Brand, Affiliate (links/products/analytics), Digital
Assets (categories/projects/links/articles/analytics), Services, Roadmap,
Daily Missions, Saved, Support, Projects.

## Hạ tầng dữ liệu (Supabase)

- **Bảng core** (`supabase-core-schema.sql`): `members`, `products`,
  `lessons`, `course_schedules`, `coupons`, `orders` — idempotent, có RLS.
- **Bảng jsonb đa năng** (`supabase-phase4-migration.sql` và các phase
  trước): toàn bộ nội dung CMS (`blog`, `prompts`, `settings`,
  `affiliate_products`...).
- **`courses`** (`supabase-course-pricing.sql`): lưu giá V-SOLO/V-SCALE,
  chỉnh được qua Admin → hiển thị trực tiếp trên Portal.
- Auth qua Supabase Auth: magic link + đăng nhập mật khẩu + quên mật khẩu
  (`/reset-password`).
- Webhook SePay xác nhận thanh toán (đã vá lỗi auth bypass, log lỗi DB, so
  khớp số tiền chính xác).

## Các điểm đã vá trong đợt audit này

1. Webhook SePay fail-closed khi thiếu API key.
2. Middleware fail-closed khi thiếu env Supabase, đã bảo vệ thêm
   `/api/admin/**`.
3. Bổ sung schema SQL còn thiếu cho `orders`/`members`/`products`/`lessons`.
4. Checkout có đủ link Điều khoản/Hoàn phí; `terms.html` sửa câu sai về
   thanh toán online.
5. Sửa tên pháp lý cho đồng nhất.
6. Dọn link chết kiểu `example.com` trong tài sản số.
7. Webhook so khớp đúng số tiền (thay vì `>=`).
8. Webhook log lỗi DB.
9. Thêm đăng nhập bằng mật khẩu + luồng quên mật khẩu (`/reset-password`).
10. Bảo vệ `/api/admin/**` trong middleware.
11. Toggle "Allow new signups" trên Supabase Dashboard — cần xác nhận thủ
    công (không sửa được qua code).
12. Bổ sung SEO description/openGraph cho hầu hết trang.
13. `robots.txt` chặn crawl `/admin`, `/portal/checkout`.
14. Đồng bộ giá VND (V-SOLO 7.800.000đ / V-SCALE 26.000.000đ) + trang Admin
    chỉnh giá, hiển thị realtime trên Portal.
15. Bỏ ảnh testimonial placeholder chết, fallback về icon mặc định.
16. Rà soát lại toàn bộ rebrand "VDAI" → "VO DUONG AI / V-SOLO / V-SCALE"
    còn sót (email templates, blog, data file...). Giữ nguyên mã đơn hàng kỹ
    thuật dạng `VDAI<id>` vì là định danh khớp với webhook SePay, không phải
    tên hiển thị.
17. Sửa lỗi trang `/admin/settings` trắng trang (do `useState` chỉ đọc dữ
    liệu async một lần lúc khởi tạo), và đấu nối Cài đặt Admin (tên site,
    slogan, màu thương hiệu, SEO, social link) vào thực tế hiển thị trên
    site qua `Header`/`Footer`/`layout.tsx`.

## Còn cần xác nhận thủ công

- Toggle **"Allow new signups"** trong Supabase Dashboard (Authentication →
  Settings).
- Xác nhận kiến trúc 2 hệ thống (tĩnh vs Next.js) — cái nào là bản chạy
  chính thức trên `voduongai.com`, để tránh nội dung lệch nhau lâu dài.
