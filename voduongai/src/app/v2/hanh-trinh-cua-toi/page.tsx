import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getJourneyOverview } from "@/lib/portal/live-journey-overview";

import { HanhTrinhCuaToiClient } from "./HanhTrinhCuaToiClient";

export const metadata = { title: "Hành trình của tôi | VO DUONG AI" };

/**
 * `/v2/hanh-trinh-cua-toi` — Bước F. Số liệu tiến độ/lộ trình/streak/hoạt
 * động/huy hiệu đọc thật qua `getJourneyOverview()` — xem docblock đầy đủ
 * trong `src/lib/portal/live-journey-overview.ts`. Riêng "Mục tiêu đang
 * theo đuổi" đọc localStorage (`goal-runtime.ts`) nên đọc ở Client
 * Component, giống `ChienLuocCaNhanClient.tsx`.
 */
export default async function HanhTrinhCuaToiPage() {
  const [premium, journey] = await Promise.all([getPremiumStatus(), getJourneyOverview()]);
  return <HanhTrinhCuaToiClient premium={premium} journey={journey} />;
}
