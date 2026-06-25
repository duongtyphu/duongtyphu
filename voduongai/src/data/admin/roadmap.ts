export type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  relatedResource?: string;
  relatedPrompt?: string;
  relatedTool?: string;
  relatedLesson?: string;
  relatedMission?: string;
  status: "Draft" | "Published" | "Hidden";
};

export const roadmapSeed: RoadmapStep[] = [
  { id: "step_1", title: "Làm quen AI", description: "Hiểu AI là gì và ứng dụng vào công việc.", icon: "🤖", order: 1, status: "Published" },
  { id: "step_2", title: "Sử dụng Prompt", description: "Khai thác thư viện Prompt AI hiệu quả.", icon: "✨", order: 2, status: "Published" },
  { id: "step_3", title: "Xây nội dung", description: "Tạo nội dung chất lượng bằng AI.", icon: "📝", order: 3, status: "Published" },
  { id: "step_4", title: "Xây thương hiệu cá nhân", description: "Phát triển thương hiệu cá nhân trên social.", icon: "👤", order: 4, status: "Published" },
  { id: "step_5", title: "Affiliate Marketing", description: "Bắt đầu kiếm tiền với Affiliate.", icon: "🤝", order: 5, status: "Published" },
  { id: "step_6", title: "Tạo sản phẩm số", description: "Xây sản phẩm số đầu tiên của bạn.", icon: "📦", order: 6, status: "Published" },
  { id: "step_7", title: "Tạo tài sản số", description: "Tích lũy tài sản số dài hạn.", icon: "💎", order: 7, status: "Draft" },
  { id: "step_8", title: "Mở rộng hệ sinh thái", description: "Scale hệ thống và đội nhóm.", icon: "🚀", order: 8, status: "Draft" },
];

export type DailyMission = {
  id: string;
  title: string;
  description: string;
  taskType: "Học" | "Copy Prompt" | "Xem công cụ" | "Tải tài nguyên" | "Hoàn thành bài học" | "Click CTA";
  points: number;
  link: string;
  status: "Active" | "Inactive";
  repeatsDaily: boolean;
  order: number;
};

export const dailyMissionsSeed: DailyMission[] = [
  { id: "mission_1", title: "Đọc 1 bài trong Học viện AI hoặc Affiliate", description: "Mở rộng kiến thức mỗi ngày.", taskType: "Học", points: 10, link: "/portal/ai-academy", status: "Active", repeatsDaily: true, order: 1 },
  { id: "mission_2", title: "Copy 1 prompt và áp dụng ngay vào công việc", description: "Thực hành với Prompt AI.", taskType: "Copy Prompt", points: 10, link: "/portal/prompts", status: "Active", repeatsDaily: true, order: 2 },
  { id: "mission_3", title: "Xem lại bước hiện tại trong Lộ trình thành công", description: "Theo dõi tiến độ lộ trình.", taskType: "Hoàn thành bài học", points: 5, link: "/portal/roadmap", status: "Active", repeatsDaily: true, order: 3 },
];
