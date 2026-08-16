import { getPremiumStatus } from "@/lib/v2/premium-access";

import { ChienLuocCaNhanClient } from "./ChienLuocCaNhanClient";

export const metadata = { title: "Chiến lược cá nhân | VO DUONG AI" };

/** `/v2/chien-luoc-ca-nhan` — Bước F. Toàn bộ dữ liệu (mục tiêu) đọc localStorage nên ở Client Component. */
export default async function ChienLuocCaNhanPage() {
  const premium = await getPremiumStatus();
  return <ChienLuocCaNhanClient premium={premium} />;
}
