import { getMnytStateBundle } from "@/lib/portal/mnyt-sync";
import { getLiveMnytCategories, getLiveMnytGlobeNodes, getLiveMnytTodayTopic } from "@/lib/portal/live-mnyt";
import { MnytFieldsClient } from "@/components/v2/mnyt/MnytFieldsClient";

export const metadata = { title: "Bản đồ lĩnh vực | Mỗi ngày một ý tưởng" };

/**
 * `/v2/moi-ngay-mot-y-tuong/linh-vuc` — view "Bản đồ lĩnh vực" (9/10, mockup
 * dòng 430-483). Quả cầu 3D 35 lĩnh vực (tự xoay chậm, dừng khi hover — khác
 * quả cầu Trang chủ vốn xoay bằng kéo tay) + lưới đầy đủ 35 thẻ lĩnh vực bên
 * dưới. Dùng lại NGUYÊN `categories`/`globeNodes` (446 dòng nhẹ, đã tải cho
 * Trang chủ/Lộ trình) để tính done/total mỗi lĩnh vực ở client — không thêm
 * truy vấn DB mới, cùng kỹ thuật "tính ở nơi gọi" đã dùng cho view Huy hiệu.
 */
export default async function MnytFieldsPage() {
  const state = await getMnytStateBundle();

  const [categories, globeNodes, todayTopic] = await Promise.all([
    getLiveMnytCategories(),
    getLiveMnytGlobeNodes(),
    getLiveMnytTodayTopic(state.prefs.interests),
  ]);

  return (
    <MnytFieldsClient
      lang={state.prefs.lang}
      categories={categories}
      globeNodes={globeNodes}
      completedIds={state.completedIds}
      todayCategoryKey={todayTopic?.categoryKey ?? null}
    />
  );
}
