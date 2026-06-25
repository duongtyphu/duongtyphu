export type UpdateItem = {
  id: string;
  title: string;
  slug: string;
  type: "Tài nguyên mới" | "Prompt mới" | "Công cụ mới" | "Khóa học mới" | "Cập nhật hệ sinh thái" | "Thông báo";
  shortContent: string;
  content: string;
  publishedAt: string;
  author: string;
  featured: boolean;
  status: "Draft" | "Published" | "Hidden";
};

export const updatesSeed: UpdateItem[] = [
  {
    id: "update_1",
    title: "Thêm 3 Prompt mới cho Content & Affiliate",
    slug: "them-3-prompt-moi",
    type: "Prompt mới",
    shortContent: "Bổ sung Prompt viết content viral và phân tích đối thủ Affiliate.",
    content: "Đã thêm 3 prompt mới vào Thư viện Prompt, tập trung vào content viral và nghiên cứu đối thủ Affiliate.",
    publishedAt: "2026-06-20",
    author: "VO DUONG AI",
    featured: true,
    status: "Published",
  },
  {
    id: "update_2",
    title: "Cập nhật công cụ: thêm HeyGen vào Thư viện công cụ",
    slug: "them-heygen",
    type: "Công cụ mới",
    shortContent: "HeyGen giúp tạo video AI avatar khi không có thời gian quay video thật.",
    content: "HeyGen đã được thêm vào Thư viện công cụ với hướng dẫn sử dụng chi tiết.",
    publishedAt: "2026-06-15",
    author: "VO DUONG AI",
    featured: false,
    status: "Published",
  },
  {
    id: "update_3",
    title: "Ra mắt module Affiliate Hub mới với lộ trình từng bước",
    slug: "ra-mat-affiliate-hub-moi",
    type: "Cập nhật hệ sinh thái",
    shortContent: "Affiliate Hub nâng cấp thành trung tâm doanh thu với 7 section đầy đủ.",
    content: "Affiliate Hub mới gồm: Bắt đầu Affiliate, Chọn ngách, Chọn sản phẩm, Xây nội dung, Công cụ Affiliate, Case Study, Top sản phẩm tháng này.",
    publishedAt: "2026-06-10",
    author: "VO DUONG AI",
    featured: true,
    status: "Published",
  },
  {
    id: "update_4",
    title: "Thêm bài học mới trong Học viện AI: Prompt Engineering cơ bản",
    slug: "prompt-engineering-co-ban",
    type: "Khóa học mới",
    shortContent: "Bài học mới giúp học viên viết prompt hiệu quả hơn.",
    content: "Bài học Prompt Engineering cơ bản đã có trong Học viện AI.",
    publishedAt: "2026-06-01",
    author: "VO DUONG AI",
    featured: false,
    status: "Published",
  },
  {
    id: "update_5",
    title: "Cập nhật Template kế hoạch content 30 ngày",
    slug: "cap-nhat-template-content-30-ngay",
    type: "Tài nguyên mới",
    shortContent: "Template kế hoạch content 30 ngày đã được cập nhật.",
    content: "Template kế hoạch content 30 ngày trong Thư viện Template đã được cập nhật với cấu trúc mới.",
    publishedAt: "2026-05-25",
    author: "VO DUONG AI",
    featured: false,
    status: "Published",
  },
];
