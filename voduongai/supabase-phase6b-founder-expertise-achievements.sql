-- Phase 6b migration: bổ sung expertise/philosophy/achievements vào
-- founder_profile.data (không tạo bảng mới, chỉ UPDATE dòng đã có).
--
-- Nguồn: FounderSpotlight.tsx (Premium) và CommunityGuides.tsx (Cộng đồng)
-- — 2 nơi này vốn đã có `expertise`/`philosophy` giống hệt nhau; riêng
-- `achievements` chỉ tồn tại ở FounderSpotlight.tsx (CommunityGuides.tsx
-- không có field này trong type Guide). Giữ nguyên định dạng gốc: expertise
-- và achievements là mảng string, philosophy là 1 chuỗi text.
--
-- title chính thức xác nhận: "Nhà sáng lập VO DUONG AI" (giữ nguyên, không đổi).
--
-- Run this whole script once in the Supabase SQL Editor.

update founder_profile
set data = data || '{
  "expertise": [
    "Ứng dụng AI trong kinh doanh số và Affiliate Marketing",
    "Xây dựng hệ thống tự động hóa quy trình vận hành",
    "Phát triển kênh nội dung và chiến lược phân phối"
  ],
  "philosophy": "Học AI không phải để biết — mà để làm được ngay. Mỗi buổi học là một kết quả thực tế.",
  "achievements": [
    "Sáng lập và trực tiếp xây dựng hệ sinh thái VO DUONG AI: Portal, Companion, hệ tri thức CKOS và các chương trình đào tạo.",
    "Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam.",
    "Nhiều năm đầu tư và vận hành hệ thống Affiliate/tài sản số bằng AI — nội dung giảng dạy lấy từ chính trải nghiệm này."
  ]
}'::jsonb,
updated_at = now()
where id = 'founder';
