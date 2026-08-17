import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getLiveSubProjects } from "@/lib/portal/live-subprojects";
import { getAllLiveEcosystemArticles } from "@/lib/portal/live-ecosystem-articles";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { DuAnCoHoiClient } from "./DuAnCoHoiClient";

export const metadata = { title: "Dự án & Cơ hội | VO DUONG AI" };

/**
 * `/v2/du-an-co-hoi` — 1:1 với `Du an Co hoi.html` (hub của cả họ trang).
 *
 * Tái dùng NGUYÊN tầng dữ liệu thật đã dựng cho 4/5 trang con (DigiU/
 * SolarGroup/Các mô hình Affilate/Affilate sàn giao dịch) — Ohana KHÔNG có
 * hạ tầng thật (đúng lệnh riêng của Founder, xem `du-an-co-hoi/ohana/page.tsx`).
 * Xem docblock đầu `DuAnCoHoiClient.tsx` cho từng chỗ khác bản tĩnh.
 */
export default async function DuAnCoHoiPage() {
  const [chromeDigiu, chromeSolarGroup, chromeAffilate, chromeTrading, subDigiu, subSolarGroup, allArticles, premium] =
    await Promise.all([
      getLiveEcosystemChrome("eco_digiu"),
      getLiveEcosystemChrome("eco_solargroup"),
      getLiveEcosystemChrome("eco_blockchain"),
      getLiveEcosystemChrome("eco_trading"),
      getLiveSubProjects("eco_digiu"),
      getLiveSubProjects("eco_solargroup"),
      getAllLiveEcosystemArticles(),
      getPremiumStatus(),
    ]);

  return (
    <DuAnCoHoiClient
      chromeDigiu={chromeDigiu}
      chromeSolarGroup={chromeSolarGroup}
      chromeAffilate={chromeAffilate}
      chromeTrading={chromeTrading}
      subDigiu={subDigiu}
      subSolarGroup={subSolarGroup}
      allArticles={allArticles}
      premium={premium}
    />
  );
}
