import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabasePublic } from "@/lib/supabase";
import { getPurchasedIds } from "@/lib/access";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getLiveCourseContent } from "@/lib/portal/live-course-content";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";
import { CourseLearnClient } from "./CourseLearnClient";

/**
 * Course Builder (Premium), Bước 4 — trang xem nội dung khoá học cho học
 * viên. Route mới hoàn toàn (Bước 1 xác nhận /portal/premium chỉ là
 * landing/mua, không có route con nào trước đây). Đặt tên `[courseId]`
 * (khớp param đã dùng ở Admin builder, `courses.id` là text slug-like —
 * cùng kiểu `duan-cohoi/[ecosystemSlug]`) + `/hoc` (đúng phong cách đặt
 * tên route hành động bằng tiếng Việt đã dùng — `bai-viet`, `nghe`).
 *
 * KHÔNG cần tự kiểm tra đăng nhập — `middleware.ts` đã gate TOÀN BỘ
 * `/portal/*` (xem `src/lib/protected-routes.ts`, không có ngoại lệ),
 * chưa đăng nhập tự động redirect `/login?next=...` trước khi route này
 * chạy.
 *
 * SỬA (đợt "3 khoá học Premium mới", thích nghi mô hình subscription) —
 * `owned` trước đây CHỈ đọc `getPurchasedIds("course_id")` (đơn mua RIÊNG
 * đúng khoá này) — đúng cho 5 chương trình mua-đứt cũ, nhưng SAI cho 3
 * khoá mới (giá 0đ, không ai "mua" qua checkout) vốn phải mở khoá cho MỌI
 * người đang có gói Premium thuê bao (Phase 38). Đã thêm
 * `getPremiumStatus()` (Single Source of Truth subscription, dùng khắp
 * `/v2/*`) — `owned = đã mua ĐÚNG khoá này HOẶC đang có Premium` — vẫn
 * giữ nhánh mua-đứt cũ hoạt động nếu có, không phá logic cũ.
 *
 * KHÔNG xây tiến độ học (course progress) — quyết định để sau.
 */

async function getCourseMeta(courseId: string): Promise<{ id: string; name: string } | null> {
  const supabase = getSupabasePublic();
  if (!supabase) return null;
  const { data } = await supabase.from("courses").select("id, name").eq("id", courseId).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getCourseMeta(courseId);
  return { title: course ? `Học — ${course.name}` : "Học" };
}

export async function CourseLearnPageContent({
  courseId,
  backHref = "/portal/premium",
  purchaseHref = "/portal/premium",
}: {
  courseId: string;
  /** `null` = ẩn hẳn nút quay lại (khi trang cha đã có back-link riêng). */
  backHref?: string | null;
  purchaseHref?: string;
}) {
  const course = await getCourseMeta(courseId);
  if (!course) notFound();

  const [sections, purchasedCourseIds, premium] = await Promise.all([
    getLiveCourseContent(courseId),
    getPurchasedIds("course_id"),
    getPremiumStatus(),
  ]);

  const owned = purchasedCourseIds.has(courseId) || premium.isPremium;

  return (
    <div className="space-y-6">
      {backHref !== null && <PortalBackLink href={backHref} label="Premium" tone="light" />}

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{course.name}</h1>
        {!owned && (
          <p className="mt-2 text-sm text-gray-500">
            Bạn đang xem bản xem thử — chỉ các bài học đánh dấu &quot;Xem thử&quot; mở khoá đầy đủ.{" "}
            <Link href={purchaseHref} className="font-semibold text-brand-blue hover:underline">
              Mua khoá học này →
            </Link>
          </p>
        )}
      </div>

      {sections.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white/70 px-4 py-10 text-center text-sm text-gray-400">
          Khoá học chưa có nội dung nào được xuất bản.
        </p>
      ) : (
        <CourseLearnClient sections={sections} owned={owned} purchaseHref={purchaseHref} />
      )}
    </div>
  );
}

export default async function CourseLearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseLearnPageContent courseId={courseId} />;
}
