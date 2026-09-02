import { getMnytStateBundle, getMnyt7DayCompletionCounts } from "@/lib/portal/mnyt-sync";
import { getLiveMnytCategories, getLiveMnytGlobeNodes } from "@/lib/portal/live-mnyt";
import { buildBadgeDefs, buildBadgeCards } from "@/lib/mnyt/badges";
import { MnytBadgesClient } from "@/components/v2/mnyt/MnytBadgesClient";

export const metadata = { title: "Huy hiệu | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/huy-hieu` — view "Huy hiệu" (6/10, mockup dòng
 * 987-1058). `categoryTotals`/`categoryCompleted` tính từ `globeNodes` (446
 * dòng nhẹ, đã tải cho Trang chủ/Lộ trình) + `state.completedIds` — cùng
 * kỹ thuật "tính ở nơi gọi, không thêm truy vấn DB mới" đã dùng cho view
 * Lộ trình.
 */
export default async function MnytBadgesPage() {
  const state = await getMnytStateBundle();

  const [categories, globeNodes, progress7Day] = await Promise.all([
    getLiveMnytCategories(),
    getLiveMnytGlobeNodes(),
    getMnyt7DayCompletionCounts(),
  ]);

  const completedSet = new Set(state.completedIds);
  const categoryTotals: Record<string, number> = {};
  const categoryCompleted: Record<string, number> = {};
  for (const node of globeNodes) {
    categoryTotals[node.categoryKey] = (categoryTotals[node.categoryKey] ?? 0) + 1;
    if (completedSet.has(node.id)) categoryCompleted[node.categoryKey] = (categoryCompleted[node.categoryKey] ?? 0) + 1;
  }

  const defs = buildBadgeDefs(categories, categoryTotals);
  const cards = buildBadgeCards(defs, { streak: state.streak, totalCompleted: state.completedIds.length, categoryCompleted }, state.badges);

  return <MnytBadgesClient lang={state.prefs.lang} cards={cards} progress7Day={progress7Day} />;
}
