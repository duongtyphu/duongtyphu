import { getPremiumStatus } from "@/lib/v2/premium-access";
import { CourseLearnPageContent } from "@/app/portal/premium/[courseId]/hoc/page";
import { CourseLearnV2Client } from "./CourseLearnV2Client";

export const metadata = { title: "Học | Premium | VO DUONG AI" };

/**
 * `/v2/premium/[courseId]/hoc` — di chuyển đích "Tiếp tục học tập" sang
 * Portal 2.0 (xem docblock `CourseLearnV2Client.tsx`). Tái dùng NGUYÊN
 * `CourseLearnPageContent` (Server Component, export từ chính
 * `/portal/premium/[courseId]/hoc/page.tsx`) — cùng data-fetching
 * (`getLiveCourseContent()`/`getPurchasedIds()`), chỉ đổi `backHref`/
 * `purchaseHref` để không link ngược `/portal/*`.
 */
export default async function CourseLearnV2Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const premium = await getPremiumStatus();

  return (
    <CourseLearnV2Client premium={premium}>
      <CourseLearnPageContent courseId={courseId} backHref={null} purchaseHref="/v2/premium" />
    </CourseLearnV2Client>
  );
}
