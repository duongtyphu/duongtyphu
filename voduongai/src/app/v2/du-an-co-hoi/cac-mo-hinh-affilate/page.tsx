import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getPremiumStatus } from "@/lib/v2/premium-access";

import { CacMoHinhAffilateClient } from "./CacMoHinhAffilateClient";

export const metadata = { title: "Các mô hình Affilate | VO DUONG AI" };

/**
 * `/v2/du-an-co-hoi/cac-mo-hinh-affilate` — 1:1 với `Cac mo hinh Affilate.html`.
 *
 * Đúng `nav-parent="Du an Co hoi.html"` trong mockup gốc — mapping thật sang
 * hệ sinh thái `eco_blockchain`/slug `lam-affilate` ("Làm tiếp thị liên
 * kết"), đã có sẵn `ecosystem_chrome.affiliateOffers` thật (4 chương trình:
 * Lazada/Shopee/Unica/Khởi Nguyên MMO — xem docblock đầu
 * `CacMoHinhAffilateClient.tsx`).
 */
export default async function CacMoHinhAffilatePage() {
  const [chrome, premium] = await Promise.all([getLiveEcosystemChrome("eco_blockchain"), getPremiumStatus()]);
  return <CacMoHinhAffilateClient chrome={chrome} premium={premium} />;
}
