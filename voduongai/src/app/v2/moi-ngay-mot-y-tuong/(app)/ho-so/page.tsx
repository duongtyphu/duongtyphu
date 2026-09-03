import { getMnytStateBundle, getMnytCompletionDates, getMnytCompletionLog, getMnyt7DayCompletionCounts } from "@/lib/portal/mnyt-sync";
import { getLiveMnytCategories, getLiveMnytGlobeNodes, getLiveMnytTopicsByIds } from "@/lib/portal/live-mnyt";
import { buildBadgeDefs } from "@/lib/mnyt/badges";
import { MnytProfileClient } from "@/components/v2/mnyt/MnytProfileClient";

export const metadata = { title: "Hồ sơ | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/ho-so` — view "Hồ sơ" (8/10, mockup dòng
 * 323-427). Level (`1 + floor(xp/100)`, mockup JS dòng ~2835), tổng huy
 * hiệu (tái dùng `buildBadgeDefs()` — chỉ cần TỔNG số định nghĩa, không
 * cần từng thẻ như view Huy hiệu), so sánh tháng (`getMnytCompletionLog()`
 * + `Date` server hiện tại — cùng kỹ thuật "hôm nay" server-side đã dùng
 * cho streak), tổng kết tuần (`getMnyt7DayCompletionCounts()` cho
 * weekCount/weekXp, `getMnytCompletionLog()` join `categoryKey` qua
 * `globeNodes` cho weekTopCategory — mockup JS dòng ~3164-3186), yêu
 * thích đầy đủ (`getLiveMnytTopicsByIds(state.favoriteIds)`).
 */
export default async function MnytProfilePage() {
  const state = await getMnytStateBundle();

  const [categories, globeNodes, completionDates, completionLog, week7Day, favoriteTopics] = await Promise.all([
    getLiveMnytCategories(),
    getLiveMnytGlobeNodes(),
    getMnytCompletionDates(),
    getMnytCompletionLog(),
    getMnyt7DayCompletionCounts(),
    getLiveMnytTopicsByIds(state.favoriteIds),
  ]);

  const level = 1 + Math.floor(state.xp / 100);

  const categoryTotals: Record<string, number> = {};
  for (const node of globeNodes) categoryTotals[node.categoryKey] = (categoryTotals[node.categoryKey] ?? 0) + 1;
  const badgeDefs = buildBadgeDefs(categories, categoryTotals);
  const badgeTotalCount = badgeDefs.length;
  const badgeCount = state.badges.length;

  const totalCompletedDays = new Set(completionDates).size;

  const now = new Date();
  const thisYear = now.getUTCFullYear();
  const thisMonth = now.getUTCMonth();
  const lastMonthDate = thisMonth === 0 ? { year: thisYear - 1, month: 11 } : { year: thisYear, month: thisMonth - 1 };
  const thisMonthPrefix = `${thisYear}-${String(thisMonth + 1).padStart(2, "0")}`;
  const lastMonthPrefix = `${lastMonthDate.year}-${String(lastMonthDate.month + 1).padStart(2, "0")}`;
  let countThisMonth = 0;
  let countLastMonth = 0;
  for (const entry of completionLog) {
    if (entry.date.startsWith(thisMonthPrefix)) countThisMonth += 1;
    else if (entry.date.startsWith(lastMonthPrefix)) countLastMonth += 1;
  }

  const weekCount = week7Day.reduce((sum, d) => sum + d.count, 0);
  const weekXp = weekCount * 10;
  const topicToCategory = new Map(globeNodes.map((n) => [n.id, n.categoryKey] as const));
  const categoryNameByKey = new Map(categories.map((c) => [c.key, { name: c.name, nameEn: c.nameEn }] as const));
  const weekDateFloor = week7Day[0]?.date ?? null;
  const weekCatTally: Record<string, number> = {};
  if (weekDateFloor) {
    for (const entry of completionLog) {
      if (entry.date < weekDateFloor) continue;
      const catKey = topicToCategory.get(entry.topicId);
      if (catKey) weekCatTally[catKey] = (weekCatTally[catKey] ?? 0) + 1;
    }
  }
  let weekTopCategoryKey: string | null = null;
  let weekTopCategoryCount = 0;
  for (const [key, count] of Object.entries(weekCatTally)) {
    if (count > weekTopCategoryCount) {
      weekTopCategoryCount = count;
      weekTopCategoryKey = key;
    }
  }
  const weekTopCategory = weekTopCategoryKey ? categoryNameByKey.get(weekTopCategoryKey) ?? null : null;

  return (
    <MnytProfileClient
      lang={state.prefs.lang}
      learnerName={state.prefs.learnerName}
      level={level}
      streak={state.streak}
      badgeCount={badgeCount}
      badgeTotalCount={badgeTotalCount}
      totalCompletedDays={totalCompletedDays}
      countThisMonth={countThisMonth}
      countLastMonth={countLastMonth}
      weekCount={weekCount}
      weekXp={weekXp}
      weekTopCategoryName={weekTopCategory ? (state.prefs.lang === "en" ? weekTopCategory.nameEn : weekTopCategory.name) : null}
      favoriteTopics={favoriteTopics}
      completedIds={state.completedIds}
    />
  );
}
