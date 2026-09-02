import { getMnytStateBundle, getMnytCompletionDates } from "@/lib/portal/mnyt-sync";
import { getLiveMnytTomorrowTopic } from "@/lib/portal/live-mnyt";
import { MnytCalendarClient } from "@/components/v2/mnyt/MnytCalendarClient";

export const metadata = { title: "Lịch | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/lich` — view "Lịch" (7/10, mockup dòng 271-320).
 * `tomorrowCategoryName` — tính THẬT qua `getLiveMnytTomorrowTopic()` (mới,
 * tách từ `getLiveMnytTodayTopic()` với `dayOffset=1`) — chỉ lộ TÊN lĩnh
 * vực (khớp mockup "🔒 ... đã khoá", không lộ tiêu đề ý tưởng thật).
 */
export default async function MnytCalendarPage() {
  const state = await getMnytStateBundle();

  const [completionDates, tomorrowTopic] = await Promise.all([getMnytCompletionDates(), getLiveMnytTomorrowTopic(state.prefs.interests)]);

  const now = new Date();

  return (
    <MnytCalendarClient
      lang={state.prefs.lang}
      streak={state.streak}
      completionDates={completionDates}
      initialYear={now.getUTCFullYear()}
      initialMonth={now.getUTCMonth()}
      tomorrowCategoryName={tomorrowTopic ? (state.prefs.lang === "en" ? tomorrowTopic.categoryNameEn : tomorrowTopic.categoryName) : null}
    />
  );
}
