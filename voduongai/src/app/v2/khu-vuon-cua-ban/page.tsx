import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getJourneyOverview } from "@/lib/portal/live-journey-overview";

import { KhuVuonCuaBanClient } from "./KhuVuonCuaBanClient";

export const metadata = { title: "Khu vườn của bạn | VO DUONG AI" };

/**
 * `/v2/khu-vuon-cua-ban` — Bước F. Tái dùng NGUYÊN `getJourneyOverview()`
 * (đã có ở trang "Hành trình của tôi") — trang này KHÔNG có hệ thống dữ
 * liệu riêng nào khác (garden/quest/inventory là lớp gamification hoàn
 * toàn không có backing thật, xem docblock đầy đủ trong
 * `KhuVuonCuaBanClient.tsx`).
 */
export default async function KhuVuonCuaBanPage() {
  const [premium, journey] = await Promise.all([getPremiumStatus(), getJourneyOverview()]);
  return <KhuVuonCuaBanClient premium={premium} journey={journey} />;
}
