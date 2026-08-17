import { getPremiumStatus } from "@/lib/v2/premium-access";

import { CongDongAiClient } from "./CongDongAiClient";

export const metadata = { title: "Cộng đồng AI | VO DUONG AI" };

export default async function CongDongAiPage() {
  const premium = await getPremiumStatus();
  return <CongDongAiClient premium={premium} />;
}
