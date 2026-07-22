import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import type { GardenChrome } from "@/components/portal/garden/GardenExperience";

/**
 * Việc 9 — "Hành trình của tôi", cửa Khu vườn của bạn (cuối cùng). Nguồn
 * thật cho 5 field static chrome đã chốt (title/subtitle/footer/2
 * empty-state) — bảng `garden_chrome` (1 dòng, id='garden'), quản qua
 * /admin/hanh-trinh-cua-toi/garden-chrome.
 *
 * KHÔNG dùng cho companionLine/treeStage/buildElements/cặp CTA — các phần
 * đó là template nội suy biến runtime thật hoặc khối điều kiện gắn liền
 * nhãn+href, vẫn đọc/giữ trực tiếp trong GardenExperience.tsx như cũ,
 * không đụng (xem CLAUDE.md).
 *
 * Dùng getSupabasePublic() (không cookies()) — cùng pattern live-mirror.ts/
 * live-journal.ts/live-story.ts/live-map.ts.
 */
const DEFAULT_CHROME: GardenChrome = {
  id: "garden",
  status: "Published",
  title: "Khu vườn của bạn",
  subtitle: "Nơi những gì bạn đã học và nuôi dưỡng trở thành một khu vườn sống.",
  footer: "Khu vườn của bạn phản chiếu đúng những gì bạn đã thật sự làm — không hơn, không kém.",
  emptyStateNoTree: "Khu vườn mọc từ việc học thật. Hạt mầm đầu tiên đang chờ bạn.",
  emptyStateNoMoments: "Viên ngọc vẫn đang chờ những trải nghiệm đầu tiên của bạn.",
};

const STRING_KEYS = (Object.keys(DEFAULT_CHROME) as (keyof GardenChrome)[]).filter(
  (key) => key !== "id" && key !== "status",
);

export const getLiveGardenChrome = cache(async (): Promise<GardenChrome> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_CHROME;
  const { data, error } = await supabase.from("garden_chrome").select("id, data, status").eq("id", "garden").eq("status", "Published").maybeSingle();
  if (error || !data) return DEFAULT_CHROME;
  const d = (data.data ?? {}) as Record<string, unknown>;
  const result = { ...DEFAULT_CHROME, id: data.id, status: data.status };
  for (const key of STRING_KEYS) {
    if (typeof d[key] === "string") result[key] = d[key] as string;
  }
  return result;
});
