# Admin CMS v2.0 — Data Ownership Map

Liệt kê bảng Supabase nào backing route Admin nào, phân biệt schema
**generic** (`id/data jsonb/status/order/created_at/updated_at`, đăng ký
trong `src/lib/admin/supabaseCollections.ts`, đi qua route dùng chung
`/api/admin/collections/[table]`) và **typed** (schema riêng, Server
Actions riêng). **Sprint 8 (ADM-V2-08) KHÔNG thay đổi schema/RLS nào** —
tài liệu này là ảnh chụp hiện trạng, không phải đề xuất thay đổi.

## Generic collections (schema chung, RLS `SELECT USING (status='Published')` mọi bảng)

| collectionKey | Bảng Supabase | Route/Module Admin | Portal đọc tại |
|---|---|---|---|
| `prompts` | `prompts` | `/admin/ckos/prompts` | `/portal/prompts` |
| `sop` | `sop` | `/admin/ckos/sop` | `/portal/sop` |
| `resources` | `resources` | `/admin/ckos/resources` | `/portal/resources` |
| `templates` | `templates` | `/admin/ckos/templates` | (đọc qua `tools`/`templates` static) |
| `ebooks` | `ebooks` | `/admin/ckos/ebooks` | (Resource Folder) |
| `checklists` | `checklists` | `/admin/ckos/checklists` | `/portal/checklists` |
| `tools` | `tools` | `/admin/tools` | `/portal/aiworkspace` |
| `knowledge-seeds` | `knowledge_seeds` | `/admin/ckos/lessons` (editor riêng) | `/portal/hetrithucai/[slug]` |
| `knowledge-collections` | `knowledge_collections` | `/admin/ckos/knowledge-collections` | `/portal/hetrithucai` |
| `best-practices` | `best_practices` | `/admin/ckos/best-practices` | `/portal/ckos/best-practices` |
| `home-cards` | `home_cards` | `/admin/home-cards` (Live-edit) | `/portal` (trang chủ) |
| `projects` | `projects` | `/admin/duan-cohoi` (Live-edit) | `/portal/duan-cohoi` |
| `community` | `community` | `/admin/community` | `/portal/congdongai` |
| `updates` | `updates` | `/admin/updates` | `/portal/congdongai` |
| `student-success-stories` | `student_success_stories` | `/admin/student-success-stories` | **KHÔNG nối Portal** (dữ liệu cũ vi phạm no-fake-data, chờ Founder thay nội dung thật) |
| — | `news` | **KHÔNG có route Admin** | mồ côi có chủ đích (không consumer nào) |
| `work-needs` | `work_needs` | `/admin/hocvienai/work-needs` | `/portal/hocvienai` |
| `hocvienai-faq` | `hocvienai_faq` | `/admin/hocvienai/faq` | `/portal/hocvienai` |
| `recommended-workspace` | `recommended_workspace` | `/admin/aiworkspace/recommended-workspace` | `/portal/aiworkspace` |
| `ai-workflow-sections` | `ai_workflow_sections` | `/admin/aiworkspace/ai-workflow-sections` | `/portal/aiworkspace` |
| `mission-items`/`philosophy-pairs`/`constitution`/`genome`/`evolution`/`timeline` | 6 bảng cùng tên | `/admin/su-menh-companion/live-edit` | `/portal/su-menh-companion` |
| `companion-flipbook-pages` | `companion_flipbook_pages` | `/admin/su-menh-companion/flipbook` | `/portal/su-menh-companion/companion-qua-hinh-anh` |
| `mirror-chrome`/`mirror-questions` | `mirror_chrome`/`mirror_questions` | `/admin/hanh-trinh-cua-toi/mirror` | `/portal/mirror` |
| `journal-chrome`/`journal-intentions` | `journal_chrome`/`journal_intentions` | `/admin/hanh-trinh-cua-toi/journal` | `/portal/nhatkyhoctap` |
| `story-chrome` | `story_chrome` | `/admin/hanh-trinh-cua-toi/story` | `/portal/story` |
| `map-chrome` | `map_chrome` | `/admin/hanh-trinh-cua-toi/map` | `/portal/hanhtrinhcuatoi/ban-do` |
| `garden-chrome` | `garden_chrome` | `/admin/hanh-trinh-cua-toi/garden` | `/portal/khuvuoncuaban` |
| `ecosystem-chrome` | `ecosystem_chrome` | `/admin/duan-cohoi/[ecosystemSlug]` | `/portal/duan-cohoi/[ecosystemSlug]` |
| `ecosystem-articles` | `ecosystem_articles` | (panel trong trang hệ sinh thái/dự án con) | `/portal/duan-cohoi/[ecosystemSlug]/cap-nhat/[articleSlug]` |
| `ecosystem-ratings` | `ecosystem_ratings` | (panel Đánh giá trong trang hệ sinh thái/dự án con) | Khối "Đánh giá" trên trang chi tiết |
| `ecosystem-subprojects` | `ecosystem_subprojects` | `/admin/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` + panel ở trang cha | `/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]` |
| `premium-chrome`/`premium-payment-steps`/`premium-faq` | 3 bảng cùng tên | `/admin/premium/dashboard` (Live-edit) | `/portal/premium` |
| — | `landing_chrome` | `/admin/landing` (Live-edit) | `/` (Landing Page) |
| — | `settings` | `/admin/website/header-footer` (`SingletonEditor`) | `Header`/`Footer`/`layout.tsx` metadata |
| — | `companion_persona`/`companion_conversation_strategy` | **Chưa có Admin UI** (0 dòng, đăng ký sẵn cho tương lai, chưa nối) | — |

## Typed tables (schema riêng, Server Actions riêng — KHÔNG qua route generic)

| Bảng | Route Admin | Ghi chú |
|---|---|---|
| `case_studies` | `/admin/ckos/case-studies` | 7 field live thật (không có `slug`/`body` dù từng có kế hoạch Phase F/G — chưa apply). |
| `courses` | `/admin/course-pricing` | `id: string` (không phải `number`), giá + trạng thái mở bán. |
| `course_sections`/`course_lessons` | `/admin/premium/courses/[courseId]/builder` | Cây Section→Lesson, kéo-thả, `ON DELETE CASCADE`. |
| `coupons` | `/admin/van-hanh/ma-giam-gia` | CRUD thật — `applyCoupon()` (checkout) đọc/ghi bảng này thật (`used_count` tự tăng). |
| `documents` | `/admin/thuong-hieu-media/tai-lieu` | CRUD thật, Portal đọc ở `/portal/resources` (khối "Tài liệu từ VO DUONG AI Academy"). |
| `orders` | `/admin/van-hanh/don-hang` | CHỈ ĐỌC — ghi qua checkout + webhook SePay, ngoài phạm vi Admin. |
| `leads` | `/admin/van-hanh/khach-hang-tiem-nang` | CHỈ ĐỌC — ghi qua `/api/leads`. |
| `support_tickets` | `/admin/van-hanh/ho-tro-khach-hang` | CHỈ ĐỌC — ghi qua `/portal/support`. |
| `referrals` | `/admin/van-hanh/tiep-thi-lien-ket` | CHỈ ĐỌC — 0 dòng tại thời điểm audit, đọc thật ở `/portal/referral`. |
| `members`/`auth.users` | `/admin/users`, `/admin/nguoi-dung/*` | Identity Hub — CHỈ ĐỌC qua Admin (sửa hồ sơ vẫn ở `/portal/account`, KHÔNG có hệ sửa song song). |
| `digital_asset_settings` | **Không có route Admin** | Đăng ký trong `SUPABASE_COLLECTIONS` nhưng 0 code nào đọc — mồ côi thật (khác `news`, đây còn nằm trong registry generic dù không typed). |

## Bảng đã có schema/hạ tầng nhưng CHƯA nối Admin (chờ quyết định riêng)

- `site_navigation` — **CHƯA TẠO**, chỉ có migration PROPOSAL
  (`supabase-phase26-site-navigation.sql`), chờ Founder duyệt riêng
  trước khi `apply_migration`.
- `companion_persona`/`companion_conversation_strategy` — bảng đã tồn
  tại (0 dòng), sẵn sàng cho "Companion CMS" (kế hoạch riêng, xem plan
  cũ `COMPANION_ADMIN_DESIGN_REPORT.md` — plan đó KHÁC route
  `/admin/companion` hiện tại, chưa triển khai).

## RLS — không đổi trong Sprint 8

Toàn bộ bảng generic dùng đúng 1 policy pattern
(`FOR SELECT USING (status = 'Published')`) cho anon/public read, ghi qua
service-role key (`getSupabaseAdmin()`, bypass RLS, tự chịu trách nhiệm
gate ở tầng `requireAdmin()`). Sprint 8 chỉ ĐỌC LẠI cấu hình hiện có để
viết tài liệu này — không `apply_migration`, không đổi policy nào. Chi
tiết đầy đủ từng bug đã sửa liên quan RLS/PATCH-status (không phải RLS
policy, mà là logic route generic) — xem `CLAUDE.md` mục "BUG NGHIÊM
TRỌNG ĐÃ SỬA TẬN GỐC — PATCH route âm thầm rơi status về Draft".
