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
  /** "Lv. 7" — hiển thị đúng theo Design Reference VDAI-GARDEN-001. */
  level: number;
  /** "Vùng vàng" — tên vùng hiện tại của cây, đúng theo Reference. */
  tierName: string;
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
  totalLeaves: 128,
  totalHours: 36,
  streakDays: 24,
  topicsCompleted: 15,
  gardenLevel: "Cây trưởng thành",
  level: 7,
  tierName: "Vùng vàng",
  percentToNextLevel: 78,
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

/**
 * 6 leaf chip treo trên cây — đúng nhãn + giờ theo Design Reference
 * VDAI-GARDEN-001.
 */
export const LEAF_ACTIONS: LeafAction[] = [
  { key: "read", label: "Đọc bài viết", time: "10:24 AM" },
  { key: "learn", label: "Học bài học", time: "09:15 AM" },
  { key: "practice", label: "Thực hành", time: "08:46 AM" },
  { key: "save", label: "Lưu tài liệu", time: "11:30 AM" },
  { key: "ask", label: "Đặt câu hỏi", time: "14:20 PM" },
  { key: "share", label: "Cảm hứng", time: "16:10 PM" },
];

/**
 * Dynamic Leaf — mô hình dữ liệu đầy đủ cho một chiếc lá thật trên
 * cây. Leaf Chip Layer render từ mảng này thay vì hardcode tọa độ —
 * mỗi lá đại diện cho một hành động có ý nghĩa của người dùng, không
 * phải trang trí. Companion sẽ thêm phần tử mới vào mảng này khi có
 * dữ liệu thật (API), không cần đổi component hiển thị.
 *
 * `position` dùng tên "cành" (branch) trừu tượng thay vì toạ độ px để
 * độc lập với kích thước ảnh cây — GARDEN_LEAF_BRANCH_POSITION ánh xạ
 * mỗi tên cành sang toạ độ % cụ thể trên Tree Layer hiện tại.
 */
export type GardenLeafBranch =
  | "branch-1"
  | "branch-2"
  | "branch-3"
  | "branch-4"
  | "branch-5"
  | "branch-6";

export type GardenLeafAnimation = "wind-soft" | "just-bloomed";

export type GardenLeaf = {
  id: string;
  type: LeafActionKey;
  label: string;
  createdAt: string;
  position: GardenLeafBranch;
  animation: GardenLeafAnimation;
  tooltip: string;
  unlocked: boolean;
};

/** Toạ độ % của từng "cành" trên Tree Layer (garden-tree-scene.jpg). */
export const GARDEN_LEAF_BRANCH_POSITION: Record<GardenLeafBranch, { top: string; left: string }> = {
  "branch-1": { top: "20%", left: "32%" },
  "branch-2": { top: "24%", left: "76%" },
  "branch-3": { top: "40%", left: "22%" },
  "branch-4": { top: "41%", left: "44%" },
  "branch-5": { top: "47%", left: "76%" },
  "branch-6": { top: "64%", left: "38%" },
};

/**
 * Seed data mẫu — sau này thay bằng dữ liệu thật từ hành động của
 * người dùng (đọc bài, hoàn thành bài học, lưu tài liệu, thực hành,
 * đặt câu hỏi, chia sẻ...). Thêm phần tử mới = thêm một chiếc lá mới
 * trên cây, không cần đổi Tree Layer hay layout.
 */
export const GARDEN_LEAVES: GardenLeaf[] = [
  {
    id: "leaf-248",
    type: "read",
    label: "Đọc bài viết",
    createdAt: "2026-07-02T10:24:00",
    position: "branch-1",
    animation: "wind-soft",
    tooltip: "Bạn đã đọc: 10 Prompt viết content thu hút — 10:24 sáng",
    unlocked: true,
  },
  {
    id: "leaf-247",
    type: "learn",
    label: "Học bài học",
    createdAt: "2026-07-02T09:15:00",
    position: "branch-2",
    animation: "wind-soft",
    tooltip: "Bạn đã hoàn thành: AI Prompting Cơ Bản — 09:15 sáng",
    unlocked: true,
  },
  {
    id: "leaf-246",
    type: "practice",
    label: "Thực hành",
    createdAt: "2026-07-02T08:46:00",
    position: "branch-3",
    animation: "wind-soft",
    tooltip: "Bạn đã thực hành: Viết email chuyên nghiệp — 08:46 sáng",
    unlocked: true,
  },
  {
    id: "leaf-245",
    type: "save",
    label: "Lưu tài liệu",
    createdAt: "2026-07-01T11:30:00",
    position: "branch-4",
    animation: "wind-soft",
    tooltip: "Bạn đã lưu: 10 Prompt hữu ích cho công việc — hôm qua",
    unlocked: true,
  },
  {
    id: "leaf-244",
    type: "ask",
    label: "Đặt câu hỏi",
    createdAt: "2026-06-30T14:20:00",
    position: "branch-5",
    animation: "wind-soft",
    tooltip: "Bạn đã hỏi Companion về lộ trình học AI — 2 ngày trước",
    unlocked: true,
  },
  {
    id: "leaf-243",
    type: "share",
    label: "Cảm hứng",
    createdAt: "2026-06-29T16:10:00",
    position: "branch-6",
    animation: "wind-soft",
    tooltip: "Bạn đã chia sẻ điều học được với cộng đồng — 3 ngày trước",
    unlocked: true,
  },
];

/** Bảng gỗ nhỏ gần gốc cây — chi tiết cảm xúc, không nổi bật quá. */
export const GARDEN_TREE_CAPTION = "Mỗi chiếc lá là một điều bạn đã học.";

/** "Những chiếc lá gần đây" — đúng theo Reference. */
export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: "a1",
    actionKey: "learn",
    label: "Hoàn thành bài học",
    detail: "AI Prompting Cơ Bản",
  },
  {
    id: "a2",
    actionKey: "save",
    label: "Lưu tài liệu",
    detail: "10 Prompt hữu ích cho công việc",
  },
  {
    id: "a3",
    actionKey: "practice",
    label: "Thực hành",
    detail: "Viết email chuyên nghiệp",
  },
];

/** Quote nhỏ dưới card "Cây tri thức của bạn" (bên trái). */
export const GARDEN_QUOTE_SMALL =
  "Cây không lớn trong một ngày, và bạn cũng vậy. Hãy kiên nhẫn, từng chiếc lá sẽ kể câu chuyện của bạn. 🌱";

/** Gợi ý nổi trên vùng cây (góc dưới phải). */
export const GARDEN_CARE_TIP =
  "Bạn đã học rất đều đặn! Hãy thử áp dụng kiến thức hôm nay vào một dự án thực tế để khu vườn nở thêm nhiều lá mới nhé.";

/** "Chăm sóc khu vườn" — 3 gợi ý cho hôm nay. */
export const CARE_SUGGESTIONS = [
  { title: "Dành 20 phút học tập", subtitle: "Tưới nước cho cây tri thức" },
  { title: "Thực hành một điều mới", subtitle: "Giúp cây ra thêm lá mới" },
  { title: "Chia sẻ điều bạn học được", subtitle: "Lan tỏa giá trị đến cộng đồng" },
] as const;

/** Quote footer riêng của trang — không dùng Footer Portal. */
export const GARDEN_FOOTER_QUOTE =
  "Khu vườn này không thuộc về AI. Nó thuộc về bạn.\nCompanion chỉ là người bạn đồng hành,\ncùng bạn vun đắp từng ngày. 💗";
