/**
 * Founder — Single Source of Truth (Portal Content Cleanup, Sprint 7).
 *
 * Trước đây `FounderSpotlight.tsx` (Premium) và `CommunityGuides.tsx`
 * (Community) mỗi nơi tự khai báo một bản sao dữ liệu Founder — đã từng
 * lệch nhau (Sprint 3 phát hiện và đồng bộ lại nội dung), nhưng vẫn là
 * hai bản độc lập, dễ lệch lại lần nữa mỗi khi có người chỉ sửa một
 * trong hai file. Từ nay, MỌI nơi hiển thị thông tin Founder phải import
 * từ file này — không khai báo lại.
 *
 * Chỉ chứa dữ kiện đã công bố trên chính website này (FounderStory ở
 * trang chủ) — không thêm thành tựu/con số không kiểm chứng được, theo
 * đúng nguyên tắc NO-FAKE-DATA (VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md §11).
 */

export type FounderProfile = {
  id: string;
  name: string;
  role: string;
  badge: string;
  photo: string;
  tags: string[];
  intro: string;
  expertise: string[];
  philosophy: string;
  achievements: string[];
};

export const FOUNDER: FounderProfile = {
  id: "vo-duong",
  name: "Võ Đương",
  role: "Nhà sáng lập VO DUONG AI",
  badge: "Nhà sáng lập",
  photo: "/images/founder-portrait.jpg",
  tags: ["AI ứng dụng", "Affiliate Marketing", "Automation", "AI Strategy", "Phát triển hệ thống"],
  intro:
    "Võ Đương là nhà sáng lập VO DUONG AI — nhà đầu tư và người ứng dụng AI thực chiến trong kinh doanh số. Với nền tảng thực chiến trong Affiliate Marketing và xây dựng hệ thống tự động hóa, anh xây VO DUONG AI thành một hệ sinh thái có lộ trình rõ ràng thay vì những thông tin rời rạc.",
  expertise: [
    "Ứng dụng AI trong kinh doanh số và Affiliate Marketing",
    "Xây dựng hệ thống tự động hóa quy trình vận hành",
    "Phát triển kênh nội dung và chiến lược phân phối",
  ],
  philosophy: "Học AI không phải để biết — mà để làm được ngay. Mỗi buổi học là một kết quả thực tế.",
  achievements: [
    "Sáng lập và trực tiếp xây dựng hệ sinh thái VO DUONG AI: Portal, Companion, hệ tri thức CKOS và các chương trình đào tạo.",
    "Đại diện Quốc gia khu vực Miền Nam — DigiU Việt Nam.",
    "Nhiều năm đầu tư và vận hành hệ thống Affiliate/tài sản số bằng AI — nội dung giảng dạy lấy từ chính trải nghiệm này.",
  ],
};
