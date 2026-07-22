import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { MapChrome } from "@/components/portal/journey-map/JourneyMapAtlas";

/**
 * Việc 9 — "Hành trình của tôi", cửa Bản đồ hành trình. Nguồn thật cho
 * static chrome an toàn (title/subtitle/nhãn mục/CTA/footer) — bảng
 * `map_chrome` (1 dòng, id='map'), quản qua
 * /admin/hanh-trinh-cua-toi/map-chrome.
 *
 * KHÔNG dùng cho CHAPTER_DESTINATIONS/PORTAL_CONNECTIONS/currentChapter/
 * connections[].count/nextDirection — các phần đó là cấu trúc gắn
 * index/key thật hoặc dữ liệu ĐỘNG thật, vẫn đọc trực tiếp trong
 * JourneyMapAtlas.tsx như cũ, không đụng (xem CLAUDE.md).
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern live-mirror.ts/
 * live-journal.ts/live-story.ts.
 */
const DEFAULT_CHROME: MapChrome = {
  id: "map",
  status: "Published",
  title: "Bản đồ hành trình của bạn",
  subtitle: "Không đo tốc độ. Chỉ cho biết bạn đang ở đâu, và hướng nào đang mở ra tiếp theo.",
  emptyStateLine: "Mỗi cuộc hành trình đều bắt đầu trước khi có dấu chân đầu tiên.",
  emptyStateCtaLabel: "Đặt dấu chân đầu tiên",
  currentPositionLabel: "Vị trí hiện tại",
  noChapterYetLine: "Chương đầu tiên của bạn chưa được viết — nó bắt đầu từ hoạt động thật đầu tiên.",
  chaptersSectionLabel: "Năm chương cuộc đời",
  statesCaption: "Ba trạng thái duy nhất: chưa bắt đầu, đang sống, đã đi qua — không phần trăm, không XP, không Level.",
  connectionsSectionLabel: "Kết nối tới Portal",
  premiumConnectionLabel: "Premium",
  nextDirectionSectionLabel: "Hướng tiếp theo",
  closingLine: "Con đường này có vẻ đã sẵn sàng, bất cứ khi nào bạn sẵn sàng.",
};

const STRING_KEYS = (Object.keys(DEFAULT_CHROME) as (keyof MapChrome)[]).filter(
  (key) => key !== "id" && key !== "status",
);

export const getLiveMapChrome = cache(async (): Promise<MapChrome> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CHROME;
  const { data, error } = await supabase.from("map_chrome").select("id, data, status").eq("id", "map").eq("status", "Published").maybeSingle();
  if (error || !data) return DEFAULT_CHROME;
  const d = (data.data ?? {}) as Record<string, unknown>;
  const result = { ...DEFAULT_CHROME, id: data.id, status: data.status };
  for (const key of STRING_KEYS) {
    if (typeof d[key] === "string") result[key] = d[key] as string;
  }
  return result;
});
