import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getLiveSubProjects } from "@/lib/portal/live-subprojects";
import { getLiveEcosystemArticles } from "@/lib/portal/live-ecosystem-articles";
import { getLiveEcosystemRatingRows } from "@/lib/portal/live-ecosystem-ratings";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { DigiuClient } from "./DigiuClient";

export const metadata = { title: "DigiU | VO DUONG AI" };

/**
 * `/v2/du-an-co-hoi/digiu` — 1:1 với `DigiU.html`.
 *
 * Tái dùng NGUYÊN tầng dữ liệu thật đã có sẵn cho hệ sinh thái DigiU ở 1.0
 * (`ecosystem_chrome`/`ecosystem_subprojects`/`ecosystem_articles`/
 * `ecosystem_ratings`, id thật `eco_digiu`) — không viết lại logic đọc dữ
 * liệu, chỉ viết UI mới khớp CSS class của mockup này. Xem docblock đầu
 * `DigiuClient.tsx` cho từng chỗ khác bản tĩnh.
 */
export default async function DigiuPage() {
  const [chrome, subProjects, articles, ratings, premium] = await Promise.all([
    getLiveEcosystemChrome("eco_digiu"),
    getLiveSubProjects("eco_digiu"),
    getLiveEcosystemArticles("eco_digiu"),
    getLiveEcosystemRatingRows("eco_digiu"),
    getPremiumStatus(),
  ]);

  return <DigiuClient chrome={chrome} subProjects={subProjects} articles={articles} ratings={ratings} premium={premium} />;
}
