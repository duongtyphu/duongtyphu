import { getPremiumStatus } from "@/lib/v2/premium-access";
import {
  getPremiumPlanMemberSummary,
  getAllLivePremiumPerks,
  getAllLivePremiumAdvisorSituations,
  getLivePremiumFounder,
} from "@/lib/portal/live-premium-v2";
import { getLivePremiumPlans } from "@/lib/portal/live-premium-plans";
import { getLiveCommunityChannels } from "@/lib/portal/live-community";
import { getLivePremiumFaq, getLivePremiumChrome, getLivePremiumPaymentSteps } from "@/lib/portal/live-premium";
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
 *
 * Giai đoạn 5 (redesign theo yêu cầu riêng Founder — xem docblock đầu
 * `PremiumClient.tsx` cho chi tiết đầy đủ từng thay đổi): bỏ hẳn "Kho tài
 * nguyên Premium"/"Premium Member nói gì?"; icon kim cương thật thay SVG;
 * viết lại quyền lợi từng gói (`premium_plans.features`) + 2 lưới quyền
 * lợi (`premium_perks`); thêm 3 khối mới port từ Portal 1.0 ("Thanh toán
 * hoạt động thế nào?" tái dùng NGUYÊN `premium_chrome`/`premium_payment_steps`
 * đã có — Single Source of Truth với `/admin/premium/dashboard`; "Không
 * chắc nên chọn gì?"/`premium_advisor_situations` và "🤝 Người đồng hành"/
 * `premium_founder` là 2 bảng MỚI vì bản 1.0 tương ứng tĩnh 100% trong
 * code, không port thẳng được — xem `supabase-phase28-premium-v2-perks-advisor-founder.sql`).
 */
export default async function PremiumPage() {
  const [premium, plans, communityChannels, faq, journey, memberSummary, chrome, paymentSteps, perks, advisorSituations, founder] =
    await Promise.all([
      getPremiumStatus(),
      getLivePremiumPlans(),
      getLiveCommunityChannels(),
      getLivePremiumFaq(),
      getJourneyOverview(),
      getPremiumPlanMemberSummary(),
      getLivePremiumChrome(),
      getLivePremiumPaymentSteps(),
      getAllLivePremiumPerks(),
      getAllLivePremiumAdvisorSituations(),
      getLivePremiumFounder(),
    ]);

  return (
    <PremiumClient
      premium={premium}
      plans={plans}
      communityChannels={communityChannels}
      faq={faq}
      journey={journey}
      memberSummary={memberSummary}
      chrome={chrome}
      paymentSteps={paymentSteps}
      perks={perks}
      advisorSituations={advisorSituations}
      founder={founder}
    />
  );
}
