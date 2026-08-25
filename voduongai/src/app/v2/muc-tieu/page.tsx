import { getPremiumStatus } from "@/lib/v2/premium-access";

import { MucTieuClient } from "./MucTieuClient";

export const metadata = { title: "Bảng Mục tiêu | VO DUONG AI" };

/**
 * `/v2/muc-tieu` — task #61. `goal-runtime.ts` (Phase 40, Supabase-backed
 * theo `member_id`) đọc/ghi qua cache client-side (xem docblock trong file
 * đó) — trang này chỉ cần `premium` cho `PortalV2Shell`, phần Goal đọc hết
 * ở Client Component sau `hydrateGoalRuntime()`.
 */
export default async function MucTieuPage() {
  const premium = await getPremiumStatus();
  return <MucTieuClient premium={premium} />;
}
