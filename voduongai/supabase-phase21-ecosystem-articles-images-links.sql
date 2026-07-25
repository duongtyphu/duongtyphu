-- Mở rộng riêng cho "Cập nhật thông tin mới" (ecosystem_articles), theo
-- yêu cầu Founder "chèn hình ảnh, link bên ngoài vào bài viết... để admin
-- linh động và tuỳ biến bài viết hơn" + "có thể thay đổi được tất cả các
-- link liên kết và link affiliate".
--
-- KHÔNG cần ALTER TABLE (schema vẫn generic id/data jsonb/status/order) —
-- chỉ đổi SHAPE của `data`:
--   + `images: {url, caption}[]` — MỚI, ảnh phụ trong bài (khác `imageUrl`
--     là ảnh bìa/thumbnail cho thẻ trong băng chạy, giữ nguyên tách biệt).
--   + `links: {label, url, affiliate}[]` — THAY THẾ hẳn 2 field đơn
--     `linkLabel`/`linkUrl` cũ (không giới hạn số lượng link/bài, mỗi
--     link tự đánh dấu affiliate hay không).
--
-- Migrate 3 bài viết seed DigiU (Việc mở rộng "Cập nhật thông tin mới"
-- trước đó, xem supabase-phase20): mỗi bài đang có đúng 1 `linkLabel`/
-- `linkUrl` → chuyển thành `links: [{label, url, affiliate: false}]`
-- (affiliate mặc định false — link đăng ký DigiU hiện có, Founder tự bật
-- lại true qua Admin nếu xác nhận đây thực sự là link tiếp thị liên
-- kết/referral, không tự suy đoán), `images: []` (chưa có ảnh phụ nào).
update ecosystem_articles
set data = (data - 'linkLabel' - 'linkUrl')
  || jsonb_build_object(
       'links', jsonb_build_array(
         jsonb_build_object('label', data->>'linkLabel', 'url', data->>'linkUrl', 'affiliate', false)
       ),
       'images', '[]'::jsonb
     )
where data ? 'linkUrl';
