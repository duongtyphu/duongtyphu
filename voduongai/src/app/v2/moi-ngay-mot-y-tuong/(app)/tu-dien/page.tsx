import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytGlossary } from "@/lib/portal/live-mnyt";
import { computeGlossaryRelatedIds, isGlossaryTermAdvanced } from "@/lib/mnyt/glossary-relations";
import { MnytGlossaryClient } from "@/components/v2/mnyt/MnytGlossaryClient";

export const metadata = { title: "Từ điển AI | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/tu-dien` — view "Từ điển" (5/10, mockup dòng
 * 564-696). Chỉ 100 dòng (nhẹ, không cần phân trang thật như Kho ý tưởng)
 * — SSR tải TOÀN BỘ 1 lần, mọi lọc/tìm kiếm/xáo trộn quiz tính 100% ở
 * client (đúng cách mockup gốc vận hành trên mảng in-memory).
 *
 * "Cấp độ"/"Thuật ngữ liên quan" — nội dung THẬT do đội thiết kế biên
 * soạn (`GLOSSARY_ADVANCED`/`GLOSSARY_REL`) nhưng KHÔNG có cột lưu trong
 * schema Giai đoạn 1 — tính lại 1 LẦN ở server qua
 * `src/lib/mnyt/glossary-relations.ts` (port nguyên văn nội dung, khoá
 * theo `termEn` đã xác nhận khớp 100/100 dòng thật), truyền xuống client
 * như dữ liệu đã sẵn sàng.
 */
export default async function MnytGlossaryPage() {
  const state = await getMnytStateBundle();
  const glossary = await getLiveMnytGlossary();
  const relatedMap = computeGlossaryRelatedIds(glossary);
  const terms = glossary.map((term) => ({
    ...term,
    level: (isGlossaryTermAdvanced(term.termEn) ? "advanced" : "basic") as "advanced" | "basic",
    relatedIds: relatedMap.get(term.id) ?? [],
  }));

  return <MnytGlossaryClient lang={state.prefs.lang} terms={terms} savedTermIds={state.savedTermIds} termSrs={state.termSrs} />;
}
