/**
 * EPIC-A02 — Goal Engine Foundation.
 *
 * `src/ai/mentor/` là namespace MỚI, độc lập hoàn toàn khỏi Runtime chat
 * thật (`src/app/api/companion/chat`), Provider Layer, Prompt, Conversation
 * Logic, Database hiện có — chưa có bất kỳ import/export nào nối 2 bên.
 * File này CHỈ định nghĩa type/interface/helper thuần cho `Goal` — KHÔNG
 * business logic, KHÔNG AI, KHÔNG I/O (Database/Network/localStorage).
 */

export type GoalCategory =
  | "hoc-ai"
  | "hoc-prompt"
  | "hoc-cong-cu-ai"
  | "premium"
  | "xay-thuong-hieu-ca-nhan"
  | "affiliate-marketing"
  | "tao-noi-dung"
  | "xay-dung-he-thong"
  | "du-an-co-hoi"
  | "khac";

/** Taxonomy chuẩn — thứ tự ổn định, dùng cho select/dropdown/log sau này. */
export const GOAL_CATEGORIES: readonly GoalCategory[] = [
  "hoc-ai",
  "hoc-prompt",
  "hoc-cong-cu-ai",
  "premium",
  "xay-thuong-hieu-ca-nhan",
  "affiliate-marketing",
  "tao-noi-dung",
  "xay-dung-he-thong",
  "du-an-co-hoi",
  "khac",
];

/** Nhãn tiếng Việt hiển thị cho từng category. */
export const GOAL_CATEGORY_LABEL: Record<GoalCategory, string> = {
  "hoc-ai": "Học AI",
  "hoc-prompt": "Học Prompt",
  "hoc-cong-cu-ai": "Học Công cụ AI",
  premium: "Premium",
  "xay-thuong-hieu-ca-nhan": "Xây thương hiệu cá nhân",
  "affiliate-marketing": "Affiliate Marketing",
  "tao-noi-dung": "Tạo nội dung",
  "xay-dung-he-thong": "Xây dựng hệ thống",
  "du-an-co-hoi": "Dự án & Cơ hội",
  khac: "Khác",
};

export type GoalPriority = "low" | "medium" | "high";

export type GoalStatus = "candidate" | "active" | "paused" | "achieved" | "abandoned";

/**
 * Goal — đơn vị mục tiêu nền tảng của Mentor Foundation. Chỉ là SHAPE dữ
 * liệu, không gắn với bảng Database nào (EPIC-A02 không migration, không
 * persistence).
 */
export type Goal = {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  /** 0-1 — độ tự tin gán cho Goal này (1 = chắc chắn). */
  confidence: number;
};

/** Type guard thuần — chỉ kiểm tra shape, không gọi Database/Network. */
export function isGoalCategory(value: string): value is GoalCategory {
  return (GOAL_CATEGORIES as readonly string[]).includes(value);
}

/** Kẹp confidence về đúng khoảng [0, 1] — helper thuần, không suy luận. */
export function clampConfidence(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Helper thuần dựng 1 `Goal` mới — không side-effect, không lưu trữ.
 *
 * FIX EPIC-A02 — Determinism: KHÔNG còn tự sinh `id` (đã bỏ hẳn
 * `crypto.randomUUID()`/fallback timestamp+random) — caller BẮT BUỘC
 * truyền `id`. Cùng input (kể cả `id`) luôn cho ra cùng `Goal`, không còn
 * phụ thuộc đồng hồ hệ thống/số ngẫu nhiên — dễ test, dễ dự đoán, và để
 * nơi gọi (Runtime tương lai) tự quyết định chiến lược đặt id (uuid thật,
 * id suy từ conversationId, id cố định cho test...).
 */
export function createGoal(input: {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority?: GoalPriority;
  status?: GoalStatus;
  confidence?: number;
}): Goal {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    category: input.category,
    priority: input.priority ?? "medium",
    status: input.status ?? "candidate",
    confidence: clampConfidence(input.confidence ?? 0),
  };
}
