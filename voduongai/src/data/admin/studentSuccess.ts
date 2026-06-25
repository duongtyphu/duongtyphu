export type StudentStory = {
  id: string;
  studentName: string;
  avatar?: string;
  title: string;
  shortDescription: string;
  content: string;
  result: string;
  toolsUsed: string[];
  relatedResource?: string;
  image?: string;
  featured: boolean;
  status: "Draft" | "Published" | "Hidden";
};

export const studentSuccessSeed: StudentStory[] = [
  {
    id: "story_1",
    studentName: "Minh Anh",
    title: "Tăng 3x lượt tương tác sau 30 ngày dùng Prompt content viral",
    shortDescription: "Content Creator áp dụng Prompt AI để viết bài nhanh và hiệu quả hơn.",
    content:
      "Trước đây Minh Anh mất cả buổi để viết 1 bài Facebook. Sau khi áp dụng Prompt viết content viral trong Thư viện Prompt, thời gian viết bài giảm xuống còn 15 phút và lượt tương tác tăng gấp 3 lần.",
    result: "Tăng 3x lượt tương tác sau 30 ngày",
    toolsUsed: ["chatgpt", "canva"],
    relatedResource: "/portal/prompts",
    featured: true,
    status: "Published",
  },
  {
    id: "story_2",
    studentName: "Quốc Huy",
    title: "Có đơn hàng Affiliate đầu tiên sau 2 tuần áp dụng lộ trình",
    shortDescription: "Affiliate Marketer mới bắt đầu, đi theo lộ trình Affiliate Hub.",
    content:
      "Quốc Huy không biết bắt đầu từ đâu với Affiliate Marketing. Sau khi đi theo lộ trình trong Affiliate Hub — chọn ngách, chọn sản phẩm, xây nội dung — anh có đơn hàng đầu tiên chỉ sau 2 tuần.",
    result: "Đơn hàng Affiliate đầu tiên sau 2 tuần",
    toolsUsed: ["hostinger"],
    relatedResource: "/portal/affiliate-hub",
    featured: true,
    status: "Published",
  },
  {
    id: "story_3",
    studentName: "Thanh Trúc",
    title: "Ra mắt ebook đầu tiên và bán được trong tháng đầu tiên",
    shortDescription: "Freelancer đóng gói kiến thức thành sản phẩm số đầu tiên.",
    content:
      "Thanh Trúc dùng Học viện AI và Thư viện Template để hoàn thành ebook đầu tiên nhanh hơn nhiều so với tự mò mẫm, và đã bán được ngay trong tháng ra mắt.",
    result: "Bán được ebook đầu tiên trong tháng ra mắt",
    toolsUsed: ["chatgpt", "canva"],
    relatedResource: "/portal/templates",
    featured: false,
    status: "Published",
  },
];
