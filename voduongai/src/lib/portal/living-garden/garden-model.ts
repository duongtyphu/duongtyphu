/**
 * Living Garden Data Model (Sprint 9.0 — Nhiệm vụ 02). Không phải hệ
 * thống điểm/XP — đây là một cách diễn giải các hành động đã có thành
 * hình ảnh một khu vườn đang lớn lên. Xem `docs/LIVING_GARDEN.md` cho
 * triết lý đầy đủ.
 *
 * Sprint này KHÔNG có DB riêng cho Garden — dữ liệu đầu vào (số lượng
 * Reflection, mục đã học, hành động đã làm...) được suy ra an toàn từ
 * các engine/dữ liệu đã tồn tại trong Portal (ví dụ `getRecentReflections`
 * ở Gem Home). Nếu không có dữ liệu, Garden hiển thị Empty State —
 * không bao giờ giả vờ có tiến trình không tồn tại.
 *
 * Internal `intensity` (0–1) chỉ dùng để tính độ "tươi" của hiệu ứng
 * hiển thị (glow, số lá/hoa vẽ ra) — không bao giờ hiển thị ra UI dưới
 * dạng điểm số, %, hay con số trần trụi.
 *
 * Sprint 12.3 (Reflection Meaning Engine) — ràng buộc kiến trúc: hàm
 * này CHỈ CỘNG, không bao giờ trừ. Một Reflection mang ý nghĩa
 * `recovery` (nghỉ ngơi) vẫn được tính là một "rễ" đã có, giống như
 * `persistence` — Garden không phạt, không giảm, không héo vì ý nghĩa
 * của Reflection là gì. Garden đọc SỰ TỒN TẠI của Reflection
 * (`reflectionsCount`), không đọc ý nghĩa hay độ dài của nó — ý nghĩa
 * Reflection chỉ dành cho Companion/Internal Voices lắng nghe, không
 * dành cho Garden chấm điểm. Xem `docs/REFLECTION_MEANING_ENGINE.md`.
 */

export type GardenStage = "dormant" | "sprouting" | "rooting" | "rising" | "blooming" | "radiant";

export const gardenStageLabel: Record<GardenStage, string> = {
  dormant: "Đang chờ hạt giống đầu tiên",
  sprouting: "Đang nảy mầm",
  rooting: "Đang bén rễ",
  rising: "Đang vươn lên",
  blooming: "Đang nở hoa",
  radiant: "Đang tỏa sáng",
};

export type GardenElementKey =
  | "roots"
  | "leaves"
  | "branches"
  | "flowers"
  | "light"
  | "water"
  | "gems";

export type GardenElementState = {
  key: GardenElementKey;
  label: string;
  meaning: string;
  stage: GardenStage;
  intensity: number;
};

export type GardenState = {
  isEmpty: boolean;
  stage: GardenStage;
  headline: string;
  elements: GardenElementState[];
};

/**
 * Đầu vào — tất cả optional, đều là số lượng hành động đã ghi nhận
 * được (không phải điểm). Không có dữ liệu nào ở đây bắt buộc; thiếu gì
 * thì phần đó coi như chưa có hạt giống.
 */
export type GardenInputs = {
  reflectionsCount?: number;
  learningTouchpoints?: number;
  actionsCompleted?: number;
  sharesCount?: number;
  recentActiveDays?: number;
  memoriesSaved?: number;
};

const ELEMENT_META: Record<GardenElementKey, { label: string; meaning: string }> = {
  roots: { label: "Rễ", meaning: "Suy ngẫm" },
  leaves: { label: "Lá", meaning: "Tri thức" },
  branches: { label: "Nhánh", meaning: "Hành động" },
  flowers: { label: "Hoa", meaning: "Chia sẻ" },
  light: { label: "Ánh sáng", meaning: "Hy vọng" },
  water: { label: "Nước", meaning: "Kiên trì" },
  gems: { label: "Viên ngọc", meaning: "Ký ức" },
};

const STAGE_THRESHOLDS: { stage: GardenStage; min: number }[] = [
  { stage: "radiant", min: 20 },
  { stage: "blooming", min: 11 },
  { stage: "rising", min: 6 },
  { stage: "rooting", min: 3 },
  { stage: "sprouting", min: 1 },
  { stage: "dormant", min: 0 },
];

function stageFromCount(count: number): GardenStage {
  const found = STAGE_THRESHOLDS.find((entry) => count >= entry.min);
  return found?.stage ?? "dormant";
}

function intensityFromCount(count: number): number {
  return Math.max(0, Math.min(1, count / 20));
}

export function buildGardenState(inputs: GardenInputs): GardenState {
  const counts: Record<GardenElementKey, number> = {
    roots: inputs.reflectionsCount ?? 0,
    leaves: inputs.learningTouchpoints ?? 0,
    branches: inputs.actionsCompleted ?? 0,
    flowers: inputs.sharesCount ?? 0,
    light: inputs.recentActiveDays ?? 0,
    water: inputs.recentActiveDays ?? 0,
    gems: inputs.memoriesSaved ?? 0,
  };

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const isEmpty = total <= 0;

  const elements = (Object.keys(ELEMENT_META) as GardenElementKey[]).map((key) => {
    const count = counts[key];
    return {
      key,
      label: ELEMENT_META[key].label,
      meaning: ELEMENT_META[key].meaning,
      stage: stageFromCount(count),
      intensity: intensityFromCount(count),
    };
  });

  const overallStage = stageFromCount(total);

  return {
    isEmpty,
    stage: overallStage,
    headline: gardenStageLabel[overallStage],
    elements,
  };
}
