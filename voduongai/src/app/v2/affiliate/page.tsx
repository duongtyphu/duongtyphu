import QRCode from "qrcode";

import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getAffiliateOverview } from "@/lib/portal/live-affiliate";

import { AffiliateClient } from "./AffiliateClient";

export const metadata = { title: "Chương trình Affiliate | VO DUONG AI" };

/**
 * `/v2/affiliate` — 1:1 với `Chuong trinh Affilate.html`.
 *
 * Trang này ánh xạ gần như hoàn hảo sang Chương trình Affiliate CHÍNH THỨC
 * đã có thật ở 1.0 (`/portal/affiliate`, `getAffiliateOverview()` —
 * referral_code tự sinh cho mọi user, trigger tự ghi nhận/tính hoa hồng) —
 * tái dùng NGUYÊN hàm đó, không viết lại logic. Xem docblock đầu
 * `AffiliateClient.tsx` cho từng chỗ khác bản tĩnh.
 *
 * KHÔNG liên quan `Cac mo hinh Affilate.html`/`Affilate san giao dich.html`
 * — 2 trang đó có `nav-parent="Du an Co hoi.html"` (đã audit xác nhận qua
 * markup gốc), tức thuộc họ "Dự án & Cơ hội" (ecosystem `lam-affilate`/
 * `sangiaodich` đã có sẵn ở 1.0), không phải sub-page của trang này.
 */
export default async function AffiliatePage() {
  const [premium, overview] = await Promise.all([getPremiumStatus(), getAffiliateOverview()]);

  const qrSvg = overview?.referralLink
    ? await QRCode.toString(overview.referralLink, { type: "svg", margin: 1, width: 176, color: { dark: "#1c1830", light: "#ffffffff" } })
    : null;

  return <AffiliateClient premium={premium} overview={overview} qrSvg={qrSvg} />;
}
