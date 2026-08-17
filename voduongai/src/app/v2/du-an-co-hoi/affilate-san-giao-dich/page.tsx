import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { AffilateSanGiaoDichClient } from "./AffilateSanGiaoDichClient";

export const metadata = { title: "Affilate sàn giao dịch | VO DUONG AI" };

/**
 * `/v2/du-an-co-hoi/affilate-san-giao-dich` — 1:1 với
 * `Affilate san giao dich.html`.
 *
 * Đúng `nav-parent="Du an Co hoi.html"` trong mockup gốc — mapping thật
 * sang hệ sinh thái `eco_trading`/slug `sangiaodich` ("Các sàn giao dịch
 * Crypto"), đã có sẵn `ecosystem_chrome.exchanges` thật (7 sàn: Binance/
 * OKX/MEXC/Bybit/Kucoin/Gate/Bitget — khớp CHÍNH XÁC 7 thẻ trong mockup).
 */
export default async function AffilateSanGiaoDichPage() {
  const [chrome, premium] = await Promise.all([getLiveEcosystemChrome("eco_trading"), getPremiumStatus()]);
  return <AffilateSanGiaoDichClient chrome={chrome} premium={premium} />;
}
