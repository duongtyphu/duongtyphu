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

/**
 * Garden Growth Stages — cây phát triển qua 7 giai đoạn dựa trên số lá
 * (hành động có ý nghĩa) đã gieo, không dựa trên đăng nhập hay thời gian
 * trôi qua. Mỗi giai đoạn có ánh sáng, thông điệp và mật độ lá riêng.
 */
export type GrowthStage = {
  key: string;
  emoji: string;
  label: string;
  message: string;
  glowColor: string;
  minLeaves: number;
  nextMinLeaves: number | null;
};

export const GROWTH_STAGES: GrowthStage[] = [
  {
    key: "seed",
    emoji: "🌰",
    label: "Hạt giống",
    message: "Bạn vừa gieo hạt giống đầu tiên. Mọi khu vườn đều bắt đầu từ đây.",
    glowColor: "rgba(180, 148, 106, 0.35)",
    minLeaves: 0,
    nextMinLeaves: 10,
  },
  {
    key: "sprout",
    emoji: "🌱",
    label: "Mầm non",
    message: "Mầm non đã nhú lên. Những bước đầu tiên luôn mong manh nhưng quan trọng nhất.",
    glowColor: "rgba(163, 230, 53, 0.35)",
    minLeaves: 10,
    nextMinLeaves: 50,
  },
  {
    key: "young-tree",
    emoji: "🌿",
    label: "Cây non",
    message: "Cây non đang bén rễ. Bạn đang xây nền tảng vững chắc cho hành trình dài hơn.",
    glowColor: "rgba(74, 222, 128, 0.35)",
    minLeaves: 50,
    nextMinLeaves: 150,
  },
  {
    key: "mature-tree",
    emoji: "🌳",
    label: "Cây trưởng thành",
    message: "Cây đã trưởng thành. Những chiếc lá đều đặn mỗi ngày đang tạo nên một tán cây vững chãi.",
    glowColor: "rgba(253, 224, 71, 0.4)",
    minLeaves: 150,
    nextMinLeaves: 300,
  },
  {
    key: "blooming-tree",
    emoji: "🌸",
    label: "Cây nở hoa",
    message: "Cây đang bước vào mùa nở hoa. Những gì bạn kiên trì vun đắp giờ đây bắt đầu tỏa hương.",
    glowColor: "rgba(244, 114, 182, 0.4)",
    minLeaves: 300,
    nextMinLeaves: 500,
  },
  {
    key: "fruit-tree",
    emoji: "🍎",
    label: "Cây kết trái",
    message: "Cây đã kết trái. Kiến thức của bạn giờ đây có thể nuôi dưỡng chính bạn và cả người khác.",
    glowColor: "rgba(249, 115, 22, 0.4)",
    minLeaves: 500,
    nextMinLeaves: 800,
  },
  {
    key: "spreading-garden",
    emoji: "🌾",
    label: "Khu vườn lan tỏa",
    message: "Khu vườn của bạn không còn chỉ cho riêng bạn. Nó đang lan tỏa và truyền cảm hứng cho người khác.",
    glowColor: "rgba(56, 189, 248, 0.4)",
    minLeaves: 800,
    nextMinLeaves: null,
  },
];

export function getGrowthStage(totalLeaves: number): { stage: GrowthStage; index: number } {
  let index = 0;
  for (let i = 0; i < GROWTH_STAGES.length; i++) {
    if (totalLeaves >= GROWTH_STAGES[i].minLeaves) index = i;
  }
  return { stage: GROWTH_STAGES[index], index };
}

export type GrowthHistoryEntry = {
  label: string;
  description: string;
};

export const GROWTH_HISTORY: GrowthHistoryEntry[] = [
  { label: "Ngày đầu tiên", description: "Bạn gieo hạt giống đầu tiên." },
  { label: "Tuần đầu tiên", description: "Chiếc lá đầu tiên nở." },
  { label: "Tháng đầu tiên", description: "Cây bắt đầu vững rễ." },
  { label: "Hôm nay", description: `Khu vườn đã có ${gardenStats.totalLeaves} chiếc lá.` },
];

export const COMPANION_GROWTH_MESSAGES = [
  "Bạn không chỉ học thêm một bài.\nBạn vừa chăm sóc thêm một phần trong khu vườn của mình.",
  "Sự trưởng thành không đến từ một bước lớn.\nNó đến từ những chiếc lá nhỏ mà bạn gieo mỗi ngày.",
];

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
