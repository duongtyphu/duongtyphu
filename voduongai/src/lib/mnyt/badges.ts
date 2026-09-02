/**
 * Định nghĩa huy hiệu — thuần dữ liệu, dùng CHUNG giữa Server Action tính
 * huy hiệu mới đạt (`completeMnytTopic()`, `src/lib/portal/mnyt-sync.ts`)
 * và view "Huy hiệu" (hiển thị catalog đầy đủ + trạng thái đã/chưa đạt).
 *
 * Khớp `getBadgeDefs()` của mockup gốc: 6 huy hiệu cố định (3 theo streak +
 * 3 theo tổng số đã hoàn thành) + 1 huy hiệu "Chuyên gia <lĩnh vực>" cho MỖI
 * lĩnh vực (hoàn thành đủ 100% ý tưởng của lĩnh vực đó) — nhưng tách hàm
 * `check` ra khỏi closure (mockup dùng closure bắt `this.topics`), nhận
 * tường minh `{streak, totalCompleted, categoryCompleted}` làm tham số, để
 * gọi được từ Server Action (không có state client).
 */

export type BadgeTier = "bronze" | "silver" | "gold";

export const TIER_COLORS: Record<BadgeTier, string> = { bronze: "#cd7f32", silver: "#b6bfcb", gold: "#ffd700" };

export type BadgeCheckInput = {
  streak: number;
  totalCompleted: number;
  /** Đếm số ý tưởng ĐÃ hoàn thành theo từng `category_key`. */
  categoryCompleted: Record<string, number>;
};

export type BadgeDef = {
  id: string;
  label: string;
  desc: string;
  type: "streak" | "total" | "category";
  tier?: BadgeTier;
  categoryKey?: string;
  categoryColor?: string;
  target: number;
  check: (input: BadgeCheckInput) => boolean;
};

const FIXED_BADGE_DEFS: BadgeDef[] = [
  { id: "streak-3", label: "Kiên trì 3 ngày", desc: "Duy trì chuỗi học 3 ngày liên tiếp", type: "streak", tier: "bronze", target: 3, check: (i) => i.streak >= 3 },
  { id: "streak-7", label: "Chuỗi lửa 7 ngày", desc: "Duy trì chuỗi học 7 ngày liên tiếp", type: "streak", tier: "silver", target: 7, check: (i) => i.streak >= 7 },
  { id: "streak-30", label: "Huyền thoại 30 ngày", desc: "Duy trì chuỗi học 30 ngày liên tiếp", type: "streak", tier: "gold", target: 30, check: (i) => i.streak >= 30 },
  { id: "total-10", label: "Nhà thám hiểm", desc: "Hoàn thành 10 ý tưởng bất kỳ", type: "total", tier: "bronze", target: 10, check: (i) => i.totalCompleted >= 10 },
  { id: "total-50", label: "Bậc thầy AI", desc: "Hoàn thành 50 ý tưởng bất kỳ", type: "total", tier: "silver", target: 50, check: (i) => i.totalCompleted >= 50 },
  { id: "total-100", label: "Toàn năng", desc: "Hoàn thành 100 ý tưởng bất kỳ", type: "total", tier: "gold", target: 100, check: (i) => i.totalCompleted >= 100 },
];

export function buildBadgeDefs(categories: { key: string; name: string; color: string }[], categoryTotals: Record<string, number>): BadgeDef[] {
  const categoryDefs: BadgeDef[] = categories.map((cat) => {
    const total = categoryTotals[cat.key] ?? 0;
    return {
      id: `cat-${cat.key}`,
      label: `Chuyên gia ${cat.name}`,
      desc: `Hoàn thành cả ${total} ý tưởng trong ${cat.name}`,
      type: "category",
      categoryKey: cat.key,
      categoryColor: cat.color,
      target: total,
      check: (i) => total > 0 && (i.categoryCompleted[cat.key] ?? 0) >= total,
    };
  });
  return [...FIXED_BADGE_DEFS, ...categoryDefs];
}
