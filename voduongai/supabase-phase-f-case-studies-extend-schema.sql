-- ============================================================================
-- PHASE F.2 — Case Study Admin CRUD Mapping Fix: extend case_studies schema
-- ============================================================================
-- Mục tiêu: cho phép Admin CRUD ghi trực tiếp vào `case_studies` (bảng public
-- /portal/case-studies thật sự đọc) mà KHÔNG mất bất kỳ trường nào Admin hiện
-- đang dùng qua form cũ (ghi vào `case_study` jsonb qua ContentManager).
--
-- Form Admin hiện tại (AdminContentItem, dùng chung cho blog/case-study/news/
-- community) có các trường: title, slug, summary, body, status, publishedAt,
-- featured. Bảng `case_studies` (typed, đã tồn tại, Phase C/D) chỉ có: title,
-- client_name, summary, result_metric, thumbnail_url, link_url, active,
-- created_at — THIẾU slug/body/published_at/featured.
--
-- Thay vì thu hẹp form Admin (mất khả năng viết slug/nội dung đầy đủ/ngày đăng/
-- đánh dấu nổi bật — tính năng Admin đang dùng thật), ta MỞ RỘNG schema
-- `case_studies` bằng cột mới (additive, nullable/có default, an toàn — không
-- đổi/xoá cột cũ, không ảnh hưởng 3 dòng dữ liệu hiện có nếu có).
-- ============================================================================

alter table case_studies add column if not exists slug text;
alter table case_studies add column if not exists body text;
alter table case_studies add column if not exists published_at date;
alter table case_studies add column if not exists featured boolean not null default false;

comment on column case_studies.slug is 'Slug bài viết chi tiết (nếu case study có trang riêng) — bổ sung Phase F để khớp form Admin.';
comment on column case_studies.body is 'Nội dung đầy đủ (rich text/markdown) — bổ sung Phase F, public page hiện chỉ hiển thị summary/result_metric, body dành cho khi có trang chi tiết.';
comment on column case_studies.published_at is 'Ngày đăng hiển thị — bổ sung Phase F để khớp form Admin.';
comment on column case_studies.featured is 'Đánh dấu case study nổi bật — bổ sung Phase F để khớp form Admin.';
