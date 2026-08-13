-- Phase 28 — Schema v2, Bước 1: mở rộng cột/data (KHÔNG mất dữ liệu cũ).
--
-- Áp dụng qua Supabase MCP (apply_migration), track lại ở đây theo đúng
-- convention dự án. Xem docs/audit/BUOC-0-LAM-RO-TRUOC-KHI-TAO-BANG.md cho
-- lý do vì sao 2 mục đầu KHÔNG dùng ALTER TABLE.

-- ---------------------------------------------------------------------------
-- 1. hocvienai_faq — đổi KEY trong `data` jsonb: q -> question, a -> answer.
--
-- LỖI #1 của Schema v1 đã sửa: `q`/`a` KHÔNG PHẢI CỘT. Bảng này là schema
-- generic (id/data/status/order/created_at/updated_at), `q`/`a` nằm bên
-- trong `data` jsonb. `ALTER TABLE ... RENAME COLUMN q` sẽ lỗi ngay.
--
-- 3 nơi trong code đọc key cũ đã sửa cùng commit này:
--   - src/lib/portal/live-hocvienai-faq.ts (type HocvienaiFaqItem + d.q/d.a)
--   - src/app/admin/(dashboard)/hocvienai/faq/page.tsx (FieldConfig key)
--   - src/app/portal/hocvienai/page.tsx (item.q/item.a khi render)
-- ---------------------------------------------------------------------------
update public.hocvienai_faq
set data = (data - 'q' - 'a')
           || jsonb_build_object('question', data->>'q', 'answer', data->>'a')
where data ? 'q' or data ? 'a';

-- ---------------------------------------------------------------------------
-- 2. knowledge_collections — thêm KEY vào `data` jsonb, KHÔNG thêm cột.
--
-- LỖI #2 của Schema v1 đã sửa: route generic /api/admin/collections/[table]
-- chỉ `select("id, data, status, order")` và `upsert({id, data, status,
-- order})` — cột thật thêm mới sẽ không bao giờ được đọc/ghi, luôn rỗng,
-- Admin không sửa được.
--
-- ĐỔI TÊN thay vì thêm trùng: `name` -> `title`. Schema v2 yêu cầu có key
-- `title`, nhưng `name` đang giữ đúng nội dung đó. Nếu thêm `title` mà giữ
-- luôn `name` sẽ tạo 2 nguồn sự thật cho cùng 1 giá trị (đúng lớp lỗi #7 đã
-- loại bỏ ở lộ trình). Vì vậy: rename, không nhân bản.
--
-- `slug` khởi tạo = `id` (đã xác nhận id chính là slug thật: "ai-office",
-- "ai-research-presentation"). Từ nay slug sửa được độc lập với id.
--
-- `relatedCollections` dùng camelCase (KHÔNG phải snake_case
-- `related_collections` như bản mô tả) để khớp 100% convention jsonb của
-- dự án (`seedSlugs`, `relatedToolSlugs`, `relatedCaseStudyIds`...) và khớp
-- đúng tên field trong type KnowledgeCollection đang dùng ở Portal.
-- ---------------------------------------------------------------------------
update public.knowledge_collections
set data = (data - 'name')
           || jsonb_build_object(
                'title', coalesce(data->>'title', data->>'name', ''),
                'slug', coalesce(data->>'slug', id),
                'relatedCollections', coalesce(data->'relatedCollections', '[]'::jsonb)
              );

-- ---------------------------------------------------------------------------
-- 3. members.premium_expires_at — Quyết định 2 (Premium hết hạn theo USER).
--
-- NULL = không hết hạn (mua đứt/vĩnh viễn). Chỉ khi có giá trị VÀ đã qua
-- thời điểm đó mới coi là hết hạn — xem comment trong src/lib/access.ts.
-- ---------------------------------------------------------------------------
alter table public.members
  add column if not exists premium_expires_at timestamptz;

comment on column public.members.premium_expires_at is
  'Hạn dùng Premium theo USER (1 hạn chung). NULL = không hết hạn (mua đứt). Chỉ admin/service_role ghi được — xem trigger guard_members_self_update.';

-- ---------------------------------------------------------------------------
-- 4. BẢO MẬT (bắt buộc, không có trong bản mô tả nhưng không thể bỏ):
--    khoá premium_expires_at khỏi self-update.
--
-- Policy "users can update own profile" cho phép user UPDATE dòng của chính
-- mình trên MỌI cột. Nếu không khoá, bất kỳ user nào đã đăng nhập cũng có
-- thể tự set premium_expires_at = '3000-01-01' qua anon key + session, tự
-- cấp Premium vĩnh viễn cho mình. Thêm cột này vào đúng danh sách cột nhạy
-- cảm đã có sẵn (id/email/is_admin/status/created_at/referral_code/
-- referred_by) của trigger guard_members_self_update (Phase 24).
-- ---------------------------------------------------------------------------
create or replace function public.guard_members_self_update()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if auth.role() <> 'service_role' and not public.is_app_admin() then
    new.id := old.id;
    new.email := old.email;
    new.is_admin := old.is_admin;
    new.status := old.status;
    new.created_at := old.created_at;
    new.referral_code := old.referral_code;
    new.referred_by := old.referred_by;
    new.premium_expires_at := old.premium_expires_at;
  end if;
  return new;
end;
$function$;
