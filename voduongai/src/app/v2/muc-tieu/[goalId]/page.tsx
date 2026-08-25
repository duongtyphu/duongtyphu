import { getPremiumStatus } from "@/lib/v2/premium-access";

import { GoalDetailClient } from "./GoalDetailClient";

export const metadata = { title: "Chi tiết mục tiêu | VO DUONG AI" };

export default async function MucTieuDetailPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const premium = await getPremiumStatus();
  return <GoalDetailClient premium={premium} goalId={goalId} />;
}
