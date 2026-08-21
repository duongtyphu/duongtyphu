import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listCoursePricing } from "../../course-pricing/actions";
import { listBadges } from "./actions";
import { NewBadgeForm, BadgeCard } from "./BadgeForm";

export const metadata = { title: "Huy hiệu · Admin" };

/**
 * Giai đoạn 8 (gộp Học viện AI 2.0) — quản lý catalog huy hiệu (`badges`),
 * hiển thị thật ở tab "Tiến độ của tôi" trên `/v2/hoc-vien-ai`.
 *
 * Tiêu chí trao thưởng DUY NHẤT bảng này hỗ trợ: hoàn thành 100% khoá học
 * đã chọn (`course_id`) — trao TỰ ĐỘNG qua `awardCourseCompletionBadges()`
 * (`src/lib/portal/live-badges.ts`), gọi ngay trong `getAcademyProgress()`
 * mỗi khi trang Học viện AI tính lại tiến độ của user đang đăng nhập.
 *
 * GIỚI HẠN THẬT (đã ghi ở live-badges.ts, nhắc lại ở đây để Admin biết khi
 * tạo huy hiệu): chưa có nơi nào trong Portal ghi được "đã học xong bài
 * này" (`user_lesson_progress`) — nên trao thưởng tự động này hiện CHƯA
 * TỪNG chạy trong thực tế, kể cả khoá miễn phí "AI cho người mới bắt đầu"
 * (16/16 bài Published). Tạo huy hiệu ở đây vẫn có tác dụng thật (hiện
 * đúng trong catalog, sẵn sàng trao ngay khi tính năng "đánh dấu đã học"
 * được xây — việc riêng, ngoài phạm vi trang này).
 */
export default async function AdminBadgesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [{ badges, configured }, { courses }] = await Promise.all([listBadges(), listCoursePricing()]);
  const courseOptions = courses.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Học viện", href: "/admin/dashboard" }, { label: "Premium", href: "/admin/course-pricing" }, { label: "Huy hiệu" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Huy hiệu & Thành tựu</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hiển thị thật ở tab &quot;Tiến độ của tôi&quot; trên <code className="text-brand-blue">/v2/hoc-vien-ai</code>.
          Mỗi huy hiệu gắn với đúng 1 khoá học — trao tự động khi user hoàn thành 100% khoá đó. <strong>Lưu ý:</strong>{" "}
          Portal hiện chưa có nút &quot;Đánh dấu đã học&quot; cho bài học nào, nên cơ chế trao thưởng tự động này chưa
          có dịp chạy thật — tạo huy hiệu ở đây vẫn hợp lệ, sẽ trao ngay khi tính năng đó được xây.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền service role để
          quản lý huy hiệu.
        </div>
      )}

      {configured && (
        <>
          <NewBadgeForm courses={courseOptions} />

          <div className="space-y-3">
            {badges.map((b) => (
              <BadgeCard key={b.id} badge={b} courses={courseOptions} />
            ))}
            {badges.length === 0 && <p className="text-sm text-gray-400">Chưa có huy hiệu nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
