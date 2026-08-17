import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getPurchasedIds } from "@/lib/access";
import { getSupabaseServer } from "@/lib/supabase-server";
import { PREMIUM_PROGRAMS } from "@/components/portal/premium/premium-programs";
import { matchCourse } from "@/components/portal/premium/match-course";
import { getPremiumResourceCounts, getPremiumMemberSummary } from "@/lib/portal/live-premium-v2";
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
 * `courses.id` là `text` (không phải `number`) — xem
 * `src/app/portal/premium/page.tsx` (bản 1.0) đã sửa lỗi kiểu này.
 */
type CourseRow = { id: string; status: string; price: number };

async function getCourses(): Promise<CourseRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from("courses").select("id, status, price");
  return data ?? [];
}

export default async function PremiumPage() {
  const [premium, courses, purchasedCourseIds, resourceCounts, communityChannels, faq, journey] = await Promise.all([
    getPremiumStatus(),
    getCourses(),
    getPurchasedIds("course_id"),
    getPremiumResourceCounts(),
    getLiveCommunityChannels(),
    getLivePremiumFaq(),
    getJourneyOverview(),
  ]);

  // `program.icon` là `LucideIcon` (function reference) — không serialize được
  // qua ranh giới Server→Client (đúng lỗi đã gặp ở `EcosystemOverview.tsx`,
  // xem CLAUDE.md "Bug đã sửa — 5 trang chi tiết hệ sinh thái crash"). Loại
  // bỏ trước khi truyền xuống `PremiumClient` — component này chỉ dùng SVG
  // tĩnh chép từ mockup, không render `program.icon`.
  const programCards = PREMIUM_PROGRAMS.map(({ icon: _icon, ...program }) => {
    void _icon;
    return { program, course: matchCourse(courses, program.courseId, purchasedCourseIds) };
  });

  const ownedProgramCourseIds = programCards.filter((c) => c.course?.owned).map((c) => c.program.courseId);
  const memberSummary = await getPremiumMemberSummary(ownedProgramCourseIds);

  return (
    <PremiumClient
      premium={premium}
      programCards={programCards}
      resourceCounts={resourceCounts}
      communityChannels={communityChannels}
      faq={faq}
      journey={journey}
      memberSummary={memberSummary}
    />
  );
}
