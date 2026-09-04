import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytFlashDeck } from "@/lib/portal/live-mnyt";
import { MnytFlashcardClient } from "@/components/v2/mnyt/MnytFlashcardClient";

export const metadata = { title: "Thẻ lật | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/the-lat` — view "Thẻ lật" (10/10, mockup dòng
 * 1218-1254). Bộ thẻ = TOÀN BỘ ý tưởng của 1 lĩnh vực (nút "Thẻ lật" ở view
 * Kho ý tưởng đã trỏ sẵn `?category=<filterCategory>`, đúng hành vi
 * `openFlashcards()` gốc) — không có `?category=`/`category=all` thì lấy
 * TOÀN BỘ 446 ý tưởng.
 */
export default async function MnytFlashcardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const state = await getMnytStateBundle();
  const sp = await searchParams;
  const categoryKey = typeof sp.category === "string" ? sp.category : null;

  const deck = await getLiveMnytFlashDeck(categoryKey);

  return <MnytFlashcardClient lang={state.prefs.lang} initialDeck={deck} />;
}
