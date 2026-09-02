import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import {
  getLiveMnytCategories,
  getLiveMnytCategoryTotals,
  getLiveMnytGlobeNodes,
  getLiveMnytGlossary,
  getLiveMnytTodayTopic,
  getLiveMnytTopicsCount,
} from "@/lib/portal/live-mnyt";
import { pickMnytGlossaryTeaser } from "@/lib/mnyt/glossary-categories";
import { MnytHomeClient } from "@/components/v2/mnyt/MnytHomeClient";

export const metadata = { title: "Mỗi ngày một ý tưởng | VO DUONG AI" };

/**
 * `/v2/moi-ngay-mot-y-tuong` — view "Trang chủ" (1/10, Giai đoạn 6). Shell
 * (header/bottom-nav/`prefs`) đã bọc sẵn ở `layout.tsx` — trang này chỉ lo
 * nội dung: ý tưởng hôm nay, dashboard cards, quả cầu 3D, dải thịnh hành,
 * gợi ý Từ điển, lưới 35 thẻ chủ đề (xem docblock `MnytHomeClient.tsx`).
 *
 * Gọi lại `getMnytStateBundle()` (đã gọi 1 lần ở `layout.tsx` cho header) —
 * chưa `cache()`-wrap được hàm này (file `"use server"`, Next.js chỉ cho
 * export hàm async — bọc `cache()` có rủi ro không còn được nhận diện đúng
 * là Server Action, xem bug đã gặp ở `GLOSSARY_CATEGORY_OPTIONS`). Chấp
 * nhận 1 round-trip DB dư ở mỗi lượt tải trang Trang chủ — nhẹ hơn hẳn rủi
 * ro build-time của việc bọc `cache()` sai chỗ.
 */
export default async function MoiNgayMotYTuongHomePage() {
  const state = await getMnytStateBundle();

  const [categories, glossary, globeNodes, categoryTotals, topicsCount, todayTopic] = await Promise.all([
    getLiveMnytCategories(),
    getLiveMnytGlossary(),
    getLiveMnytGlobeNodes(),
    getLiveMnytCategoryTotals(),
    getLiveMnytTopicsCount(),
    getLiveMnytTodayTopic(state.prefs.interests),
  ]);

  // Gợi ý Từ điển xoay theo NGÀY (epoch-day), không phải ngẫu nhiên mỗi lần
  // tải — cùng logic "today topic" (`getLiveMnytTodayTopic`).
  const glossaryTeaser = pickMnytGlossaryTeaser(glossary, 4);

  const interestNames = state.prefs.interests
    .map((key) => categories.find((c) => c.key === key)?.name)
    .filter((v): v is string => Boolean(v));

  return (
    <MnytHomeClient
      lang={state.prefs.lang}
      todayTopic={todayTopic}
      categories={categories}
      categoryTotals={categoryTotals}
      topicsCount={topicsCount}
      globeNodes={globeNodes}
      glossaryTeaser={glossaryTeaser}
      streak={state.streak}
      completedIds={state.completedIds}
      badgeCount={state.badges.length}
      interestNames={interestNames}
    />
  );
}
