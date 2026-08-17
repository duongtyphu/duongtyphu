import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getLiveSubProjects } from "@/lib/portal/live-subprojects";
import { getLiveEcosystemArticles } from "@/lib/portal/live-ecosystem-articles";
import { getLiveEcosystemRatingRows } from "@/lib/portal/live-ecosystem-ratings";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { SolarGroupClient } from "./SolarGroupClient";

export const metadata = { title: "SolarGroup | VO DUONG AI" };

/**
 * `/v2/du-an-co-hoi/solargroup` — 1:1 với `SolarGroup.html`.
 *
 * Tái dùng NGUYÊN tầng dữ liệu thật đã có sẵn cho hệ sinh thái SolarGroup ở
 * 1.0 (`ecosystem_chrome`/`ecosystem_subprojects`/`ecosystem_articles`/
 * `ecosystem_ratings`, id thật `eco_solargroup`). Xem docblock đầu
 * `SolarGroupClient.tsx` cho từng chỗ khác bản tĩnh (đặc biệt: bản thiết kế
 * có nhiều tuyên bố đầu tư/mời gọi rót vốn cụ thể — "580.000+ nhà đầu tư",
 * "$50 đầu tư tối thiểu", "Trở thành nhà đầu tư ngay hôm nay" — KHÔNG có
 * thật trong dữ liệu SolarGroup, đã thay bằng dữ liệu thật/honest
 * empty-state).
 */
export default async function SolarGroupPage() {
  const [chrome, subProjects, articles, ratings, premium] = await Promise.all([
    getLiveEcosystemChrome("eco_solargroup"),
    getLiveSubProjects("eco_solargroup"),
    getLiveEcosystemArticles("eco_solargroup"),
    getLiveEcosystemRatingRows("eco_solargroup"),
    getPremiumStatus(),
  ]);

  return <SolarGroupClient chrome={chrome} subProjects={subProjects} articles={articles} ratings={ratings} premium={premium} />;
}
