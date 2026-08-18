import { getPremiumStatus } from "@/lib/v2/premium-access";

import { SuMenhCompanionClient } from "./SuMenhCompanionClient";

export const metadata = { title: "Sứ mệnh Companion | VO DUONG AI" };

/**
 * `/v2/su-menh-companion` — theo yêu cầu Founder: giữ nguyên giao diện
 * Portal 2.0 (`PortalV2Shell`), chỉ thay nội dung "trang giữa" bằng nguyên
 * văn nội dung `/portal/su-menh-companion` (1.0) — xem
 * `SuMenhCompanionContent.tsx` (Single Source of Truth dùng chung 2 bản)
 * và `SuMenhCompanionClient.tsx` (khung Portal 2.0 bọc quanh).
 */
export default async function SuMenhCompanionPage() {
  const premium = await getPremiumStatus();

  return <SuMenhCompanionClient premium={premium} />;
}
