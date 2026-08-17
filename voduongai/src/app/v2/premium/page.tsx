import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getPremiumResourceCounts, getPremiumPlanMemberSummary } from "@/lib/portal/live-premium-v2";
import { getLivePremiumPlans } from "@/lib/portal/live-premium-plans";
import { getLiveCommunityChannels } from "@/lib/portal/live-community";
import { getLivePremiumFaq } from "@/lib/portal/live-premium";
import { getJourneyOverview } from "@/lib/portal/live-journey-overview";

import { PremiumClient } from "./PremiumClient";

export const metadata = { title: "Premium | VO DUONG AI" };

/**
 * `/v2/premium` (Bước F) — 1:1 với `Premium.html`.
 *
 * Bản thiết kế có 1 nút dev-toggle "Xem: Chưa đăng ký" / "Xem: Đã đăng ký
 * Premium" để demo 2 trạng thái — KHÔNG chuyển nguyên nút này vào bản thật.
 * Trạng thái hiển thị do `getPremiumStatus()` quyết định (thật, không phải
 * toggle tay), đúng nguyên tắc đã áp dụng cho mọi trang Bước F trước.
 *
 * Phase 38 (yêu cầu riêng của Founder, đảo ngược quyết định "5 chương trình
 * mua đứt" ghi ở `PremiumClient.tsx`'s docblock cũ): bỏ hẳn 5 chương trình
 * (`PREMIUM_PROGRAMS`/`courses`) — dùng đúng 3 gói thuê bao "Gói Tháng/6
 * Tháng/12 Tháng" như bản thiết kế gốc (bảng `premium_plans` thật, không
 * còn số mẫu). Mua bất kỳ gói nào cũng mở TOÀN BỘ tính năng Portal
 * (`getPremiumStatus()` đã trả `isPremium` dùng chung cho CKOS/Học viện
 * AI/AI Workspace từ Bước D — không cần đổi gì thêm ở đó).
 */
export default async function PremiumPage() {
  const [premium, plans, resourceCounts, communityChannels, faq, journey, memberSummary] = await Promise.all([
    getPremiumStatus(),
    getLivePremiumPlans(),
    getPremiumResourceCounts(),
    getLiveCommunityChannels(),
    getLivePremiumFaq(),
    getJourneyOverview(),
    getPremiumPlanMemberSummary(),
  ]);

  return (
    <PremiumClient
      premium={premium}
      plans={plans}
      resourceCounts={resourceCounts}
      communityChannels={communityChannels}
      faq={faq}
      journey={journey}
      memberSummary={memberSummary}
    />
  );
}
