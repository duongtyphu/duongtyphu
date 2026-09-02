import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import {
  getLiveMnytCategories,
  getLiveMnytDifficulties,
  getLiveMnytGlobeNodes,
  getLiveMnytPathTopics,
  getLiveMnytTodayTopic,
  getLiveMnytTopicsCount,
} from "@/lib/portal/live-mnyt";
import { MnytPathClient } from "@/components/v2/mnyt/MnytPathClient";

export const metadata = { title: "Lộ trình leo cấp | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/lo-trinh` — view "Lộ trình leo cấp" (4/10,
 * mockup dòng 485-561). Mỗi lĩnh vực là 1 tuyến đường leo dần (node dưới
 * cùng = xuất phát, node trên cùng = đỉnh), mở khoá tuần tự theo tiến độ
 * thật; "bản đồ tiến độ" (35 lĩnh vực × N cấp độ) dùng lại `globeNodes`
 * (446 dòng nhẹ, đã tải cho Trang chủ) — không cần thêm hàm/DB truy vấn
 * mới cho việc gộp theo lĩnh vực+độ khó, chỉ tính ở client (giống cách
 * `MnytHomeClient.tsx` đã tính `categoryCompleted`).
 *
 * `getLiveMnytPathTopics()` chỉ tải TRƯỚC lĩnh vực MẶC ĐỊNH (theo "ý tưởng
 * hôm nay", cùng logic mockup `pathCat || todayTopic.catKey`) — đổi lĩnh
 * vực sau đó gọi `/api/mnyt/path` (client-side), cùng hàm dùng lại, Single
 * Source of Truth.
 *
 * Nút "Nhận chứng nhận" — mockup mở modal Certificate (1 trong 6 modal của
 * Giai đoạn 6, CHƯA build) — giữ nút hiện diện đúng vị trí, `onClick` tạm
 * no-op (cùng cách `MnytShellClient.tsx`'s `onOpenSubmit` đang chờ modal
 * "Gửi ý tưởng"), sẽ nối khi tới lượt xây modal.
 *
 * `?cat=<key>` (tuỳ chọn) — đúng hành vi `openDomainPath()` của mockup gốc:
 * view Bản đồ lĩnh vực (9/10) bấm 1 nốt/thẻ lĩnh vực sẽ điều hướng thẳng
 * sang đúng lĩnh vực đó ở đây. Validate lại `key` có khớp 1 lĩnh vực thật
 * (`categories`) trước khi dùng — query lạ/rỗng rơi về đúng logic mặc định
 * cũ (`todayTopic.catKey` → lĩnh vực đầu tiên).
 */
export default async function MnytPathPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const state = await getMnytStateBundle();
  const sp = await searchParams;

  const [categories, globeNodes, difficulties, topicsCount, todayTopic] = await Promise.all([
    getLiveMnytCategories(),
    getLiveMnytGlobeNodes(),
    getLiveMnytDifficulties(),
    getLiveMnytTopicsCount(),
    getLiveMnytTodayTopic(state.prefs.interests),
  ]);

  const requestedCategoryKey = typeof sp.cat === "string" ? sp.cat : undefined;
  const validRequestedKey = requestedCategoryKey && categories.some((c) => c.key === requestedCategoryKey) ? requestedCategoryKey : null;
  const defaultCategoryKey = validRequestedKey ?? todayTopic?.categoryKey ?? categories[0]?.key ?? "";
  const initialPathTopics = defaultCategoryKey ? await getLiveMnytPathTopics(defaultCategoryKey) : [];

  return (
    <MnytPathClient
      lang={state.prefs.lang}
      categories={categories}
      globeNodes={globeNodes}
      difficulties={difficulties}
      topicsCount={topicsCount}
      completedIds={state.completedIds}
      defaultCategoryKey={defaultCategoryKey}
      initialPathTopics={initialPathTopics}
    />
  );
}
