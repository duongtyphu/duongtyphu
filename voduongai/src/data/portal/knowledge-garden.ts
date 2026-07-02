/**
 * Khu vườn của bạn — seed data mẫu cho /portal/khu-vuon-cua-ban và
 * widget preview ở trang chủ Portal. Mỗi hành động của người dùng
 * (đọc bài, học bài, thực hành, lưu tài liệu, hỏi Companion, cảm hứng)
 * được hình ảnh hóa thành một chiếc lá trên cây.
 */

export type GardenStats = {
  totalLeaves: number;
  totalHours: number;
  streakDays: number;
  topicsCompleted: number;
  gardenLevel: string;
  percentToNextLevel: number;
};

export type GardenToday = {
  newLeaves: number;
  minutesLearned: number;
  seedsPlanted: number;
};

export type LeafActionKey =
  | "read"
  | "learn"
  | "practice"
  | "save"
  | "ask"
  | "share"
  | "challenge"
  | "explore";

export type LeafAction = {
  key: LeafActionKey;
  label: string;
  time: string;
};

export type RecentActivity = {
  id: string;
  actionKey: LeafActionKey;
  label: string;
  detail: string;
};

export const gardenStats: GardenStats = {
  totalLeaves: 247,
  totalHours: 36,
  streakDays: 28,
  topicsCompleted: 5,
  gardenLevel: "Cây trưởng thành",
  percentToNextLevel: 72,
};

export const gardenToday: GardenToday = {
  newLeaves: 6,
  minutesLearned: 42,
  seedsPlanted: 3,
};

export const LEAF_ACTIONS: LeafAction[] = [
  { key: "read", label: "Đọc bài viết", time: "5 phút trước" },
  { key: "learn", label: "Học bài học", time: "1 giờ trước" },
  { key: "practice", label: "Thực hành", time: "Hôm qua" },
  { key: "save", label: "Lưu tài liệu", time: "Hôm qua" },
  { key: "ask", label: "Đặt câu hỏi", time: "2 ngày trước" },
  { key: "share", label: "Chia sẻ", time: "3 ngày trước" },
  { key: "challenge", label: "Hoàn thành thử thách", time: "4 ngày trước" },
  { key: "explore", label: "Khám phá", time: "5 ngày trước" },
];

export const RECENT_ACTIVITIES: RecentActivity[] = [
  { id: "a1", actionKey: "read", label: "Đọc bài", detail: "10 Prompt viết content thu hút" },
  { id: "a2", actionKey: "learn", label: "Hoàn thành bài học", detail: "AI Writing Mastery" },
  { id: "a3", actionKey: "save", label: "Lưu tài liệu", detail: "Công thức viết blog chuẩn SEO" },
  { id: "a4", actionKey: "practice", label: "Thực hành prompt", detail: "Viết mô tả sản phẩm" },
  { id: "a5", actionKey: "ask", label: "Đặt câu hỏi", detail: "Hỏi Companion về lộ trình học AI" },
];

export const GARDEN_CARE_TIP =
  "Bạn đã học rất đều đặn. Hãy thử áp dụng kiến thức hôm nay vào một dự án thực tế để khu vườn nở thêm nhiều lá mới nhé.";
