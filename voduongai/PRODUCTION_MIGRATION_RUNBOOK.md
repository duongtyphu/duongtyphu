# PRODUCTION MIGRATION RUNBOOK — VO DUONG AI

> Dành cho người có quyền Supabase Dashboard / service role. Claude Code KHÔNG có
> quyền này trong môi trường thực thi Phase C/D/E và KHÔNG tự chạy bất kỳ migration
> nào trong file này lên production — toàn bộ đã được xác minh tối đa qua anon key
> (read-only) và code review, nhưng việc áp dụng thật cần con người thực hiện.

## Trước khi bắt đầu — Backup

1. Vào Supabase Dashboard → Database → Backups → tạo 1 bản backup thủ công (hoặc xác nhận Point-in-Time Recovery đang bật) TRƯỚC khi chạy bất kỳ file nào dưới đây.
2. Ghi lại số dòng hiện tại của các bảng sẽ bị ảnh hưởng (chạy trong SQL Editor, chỉ đọc):
   ```sql
   select 'orders' t, count(*) from orders
   union all select 'case_study', count(*) from case_study
   union all select 'case_studies', count(*) from case_studies
   union all select 'prompts', count(*) from prompts
   union all select 'prompt_templates', count(*) from prompt_templates
   union all select 'documents', count(*) from documents;
   ```
   Lưu lại kết quả này (chụp màn hình hoặc copy) để đối chiếu sau khi chạy xong.

## Thứ tự chạy (bắt buộc theo đúng thứ tự — KHÔNG đảo)

| # | File | Mục đích | Ảnh hưởng |
|---|---|---|---|
| 1 | `supabase-phase-d-orders-select-policy.sql` | Fix bug RLS `orders` — cho phép user đọc đúng đơn của chính họ | Thêm 1 policy, không đổi dữ liệu |
| 2 | `supabase-phase-c-submissions.sql` | Ghi lại schema bảng `submissions` (đã tồn tại, chỉ để tái dựng DR) | `create table if not exists` — no-op nếu bảng đã có |
| 3 | `supabase-phase-c-referrals.sql` | Tương tự, bảng `referrals` | No-op nếu đã có |
| 4 | `supabase-phase-c-documents.sql` | Tương tự, bảng `documents` **+ bổ sung cột `bg_color` phát hiện thiếu ở Phase D** | Thêm cột mới nếu chưa có (`add column if not exists`) — an toàn |
| 5 | `supabase-phase-c-support-tickets.sql` | Tương tự, bảng `support_tickets` | No-op nếu đã có |
| 6 | `supabase-phase-c-leads.sql` | Tương tự, bảng `leads` **+ bật RLS** (đã xác nhận 100% truy cập qua service role) | `enable row level security` — không ảnh hưởng hành vi |
| 7 | `supabase-phase-c-case-studies.sql` | Tương tự, bảng `case_studies` | No-op nếu đã có |
| 8 | `supabase-phase-c-prompt-templates.sql` | Tương tự, bảng `prompt_templates` | No-op nếu đã có |
| 9 | `supabase-phase-f-case-studies-extend-schema.sql` | **BẮT BUỘC chạy trước bước 10** và trước khi dùng Admin CRUD Case Study mới (Phase F) — thêm 4 cột `slug`/`body`/`published_at`/`featured` vào `case_studies` | `add column if not exists` — an toàn, additive |
| 10 | `supabase-phase-e-sync-case-study-to-case-studies.sql` | **Chạy SAU bước 9** — đồng bộ nội dung Admin đã đăng từ `case_study` sang `case_studies` | Chỉ INSERT, dedup theo title |
| 11 | `supabase-phase-e-sync-prompts-to-prompt-templates.sql` | Tuỳ chọn (xem Phase F Canonical Table Decision — Prompt đã hiển thị đúng qua `<AdminPromptsSection>`, script này chỉ bổ sung để section "Prompt mới từ VO DUONG AI Academy" cũng có dữ liệu, không bắt buộc) | Chỉ INSERT, dedup theo title |
| 12 | `supabase-phase-c-orders-safety.sql` | UNIQUE constraint chống double-confirm thanh toán — **migration tự kiểm tra trùng lặp, tự abort nếu phát hiện trùng** | Có thể chạy bất kỳ lúc nào, độc lập với các bước trên |
| 13 | `supabase-phase-g-ckos-core-tables.sql` | Phase G — 9 bảng lõi CKOS Runtime mới (`ckos_goals`, `ckos_strategies`, `ckos_decisions`, `ckos_workflows`, `ckos_workflow_steps`, `ckos_tool_categories`, `ckos_prompt_templates`, `ckos_evaluation_models`, `ckos_best_practices`) | `create table if not exists` — an toàn, độc lập, không phụ thuộc bước nào ở trên |
| 14 | `supabase-phase-g-ckos-relationships.sql` | **Chạy SAU bước 13** (tham chiếu FK tới các bảng ở bước 13) — 6 bảng quan hệ CKOS | An toàn, additive |
| 15 | `supabase-phase-g-case-studies-ckos-standard-columns.sql` | **Chạy SAU bước 9** — bổ sung cột chuẩn CKOS (`status`, `version`, `language`, `difficulty`, `tags`, `metadata`, `updated_at`) vào `case_studies` | `add column if not exists` — an toàn, additive, không đổi cột `active`/`published_at` đã có |

**Lưu ý quan trọng (Phase F)**: sau khi chạy bước 9, trang Admin `/admin/case-study` đã được viết lại để ghi trực tiếp vào `case_studies` (không còn dùng `case_study` jsonb) — nếu bước 9 CHƯA chạy mà ai đó đã vào `/admin/case-study` thao tác, trang sẽ báo lỗi "Không thể tạo/lưu case study" (cột chưa tồn tại). Phải chạy bước 9 trước khi thông báo cho Admin dùng trang mới.

**Lưu ý về Phase G (khác Case Study)**: 6 route `/api/v1/ckos/*` đã được deploy an toàn KỂ CẢ KHI bước 13-15 chưa chạy — đã smoke-test sống xác nhận các route trả `{items: [], total: 0}` (HTTP 200) thay vì lỗi 500 khi bảng CKOS chưa tồn tại. Không có thứ tự bắt buộc nghiêm ngặt giữa việc deploy code API và chạy migration 13-15, nhưng dữ liệu CKOS thật (goals/strategies/workflows/prompts CKOS...) chỉ xuất hiện sau khi bước 13-14 hoàn tất VÀ Phase H thực sự nhập dữ liệu vào các bảng đó.

**Lưu ý về các file RLS còn để dạng comment** (`supabase-phase-c-submissions.sql`, `-referrals.sql`, `-documents.sql`, `-support-tickets.sql`, `-case-studies.sql`, `-prompt-templates.sql`): mỗi file có sẵn phần policy đề xuất nhưng **để dạng comment**. TRƯỚC khi bỏ comment và bật RLS cho các bảng này, phải tự kiểm tra qua Dashboard (Database → Tables → [tên bảng] → RLS) xem RLS hiện đang BẬT hay TẮT:
- Nếu đang **TẮT**: bật RLS mà không có policy đúng sẽ **chặn toàn bộ truy cập hiện tại** (regression) — chỉ bật kèm đúng policy đã viết sẵn trong file.
- Nếu đang **BẬT** với policy khác đã có sẵn: đọc kỹ policy hiện tại trước, đừng tạo trùng/mâu thuẫn.

## Cách kiểm tra sau khi chạy

1. Chạy lại câu SELECT đếm số dòng ở bước "Trước khi bắt đầu" — số dòng của `orders`, `prompts`, `case_study` phải KHÔNG đổi (các file này không sửa dữ liệu nguồn); `case_studies` phải tăng thêm đúng số dòng Published mới trong `case_study` (dự kiến +1); `prompt_templates` phải tăng thêm đúng số dòng Published mới trong `prompts` (dự kiến +2).
2. Kiểm tra nội dung thật đã hiện đúng:
   ```sql
   select title, summary, active from case_studies order by created_at desc limit 5;
   select title, category, active from prompt_templates order by created_at desc limit 5;
   ```
3. Kiểm tra policy `orders` đã có:
   ```sql
   select policyname, cmd, qual from pg_policies where tablename = 'orders';
   ```
   Phải thấy `"members can view own orders"` với `cmd = SELECT`.
4. Mở trình duyệt (không phải qua Claude Code) và test theo mục "Test case bắt buộc" bên dưới.

## Test case bắt buộc cho checkout/order (PHẢI làm bằng tài khoản thật, trình duyệt thật)

1. Đăng nhập bằng 1 tài khoản có ít nhất 1 đơn hàng `status='confirmed'` → vào `/portal/my-products` → phải thấy đúng sản phẩm đã mua (trước đây luôn rỗng).
2. Cùng tài khoản đó → vào `/portal/account` → mục "đơn hàng của tôi" phải hiện đúng lịch sử đơn hàng.
3. Tạo 1 đơn hàng test mới → sau khi "thanh toán" (hoặc set `status='confirmed'` thủ công qua Admin) → vào `/portal/checkout/order-received/[id]` với đúng `id` đó → **phải KHÔNG còn 404** (trước đây luôn 404 do bug RLS).
4. Đăng nhập bằng tài khoản KHÁC (không phải chủ đơn hàng ở bước 1-3) → thử truy cập `/portal/checkout/order-received/[id]` với `id` của người khác → phải nhận 404/không thấy dữ liệu (đảm bảo policy không rò rỉ chéo).
5. Mở tab ẩn danh (chưa đăng nhập) → gọi trực tiếp REST API `GET {SUPABASE_URL}/rest/v1/orders?select=*` bằng anon key → phải nhận mảng rỗng `[]` (không đọc được gì).
6. Vào Admin (`/admin/orders`) → xác nhận danh sách đơn hàng vẫn hiển thị đầy đủ như trước (không bị ảnh hưởng bởi policy mới, vì Admin dùng service role).
7. Kiểm tra webhook SePay (nếu có môi trường test/staging riêng) vẫn xác nhận đơn hàng bình thường.
8. Vào `/portal/case-studies` → phải thấy case study "Học viên A tăng thu nhập Affiliate gấp 3 lần sau 60 ngày" (trước đây trống).
9. Vào `/portal/prompts` → phải thấy 2 prompt mới ("Viết content viral cho Facebook", "Phân tích đối thủ Affiliate") xen giữa/trước danh sách prompt tĩnh.

## Cách rollback

| File | Cách lùi lại |
|---|---|
| `supabase-phase-d-orders-select-policy.sql` | `drop policy if exists "members can view own orders" on orders;` |
| 7 migration Phase C (`submissions`...`prompt-templates`) | Chỉ `drop table if exists <tên>;` NẾU CHẮC CHẮN bảng đó vừa được tạo mới hoàn toàn bởi migration này (không có dữ liệu production từ trước) — với `documents`/`case_studies`/`prompt_templates`/`leads`... đã xác nhận Phase D là bảng **đã tồn tại từ trước**, nên rollback thực chất chỉ cần `alter table documents drop column if exists bg_color;` (nếu muốn lùi riêng phần cột mới) và `alter table leads disable row level security;` — KHÔNG drop bảng vì sẽ mất dữ liệu thật đang có |
| `supabase-phase-f-case-studies-extend-schema.sql` | `alter table case_studies drop column if exists slug, drop column if exists body, drop column if exists published_at, drop column if exists featured;` — chỉ làm nếu chắc chắn Admin CRUD mới (`/admin/case-study`) chưa được ai dùng để nhập dữ liệu vào các cột này |
| `supabase-phase-e-sync-case-study-to-case-studies.sql` | `delete from case_studies where title in (select data->>'title' from case_study where status='Published');` |
| `supabase-phase-e-sync-prompts-to-prompt-templates.sql` | `delete from prompt_templates where title in (select data->>'title' from prompts where status='Published');` |
| `supabase-phase-c-orders-safety.sql` | `alter table orders drop constraint if exists orders_order_code_key; drop index if exists orders_payment_reference_key;` (đã ghi sẵn trong file) |

## Điều tuyệt đối không làm khi chạy runbook này

- Không drop `case_study`, `case_studies`, `prompts`, `prompt_templates`.
- Không sửa `/portal/case-studies` hay `/portal/prompts` (code) — Phase E chỉ đồng bộ dữ liệu, không đổi code page.
- Không tự ý bật RLS cho bảng đang ở trạng thái chưa xác minh (xem "Lưu ý về các file RLS còn để dạng comment" ở trên).
