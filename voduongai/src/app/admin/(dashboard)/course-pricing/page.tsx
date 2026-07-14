import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { PREMIUM_WORKSPACE_SECTIONS } from "@/lib/admin/premium/navigation";
import { listCoursePricing } from "./actions";
import { CourseRow } from "./CourseRow";

export default async function CoursePricingAdminPage() {
  const { courses, configured } = await listCoursePricing();

  return (
    <AdminWorkspaceShell title="Premium" description="" rootHref="/admin/premium" sections={PREMIUM_WORKSPACE_SECTIONS}>
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Khoá học Premium — giá &amp; mở bán</h1>
        <p className="mt-1 text-sm text-white/50">
          Đổi giá hoặc bật/tắt mở bán tại đây sẽ cập nhật ngay trên trang Premium và Học viện AI — không
          cần sửa code. &ldquo;Đang mở bán&rdquo; = card Premium hiện nút thanh toán; &ldquo;Sắp mở đăng
          ký&rdquo; = card hiển thị &ldquo;Sắp mở đăng ký&rdquo;.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code>.
        </div>
      )}

      {configured && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wide text-white/40">
                <th className="px-3 py-3">Khoá học</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3">Giá (VND)</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <CourseRow key={c.id} course={c} />
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm text-white/40">
                    Chưa có dữ liệu khoá học. Chạy file{" "}
                    <code className="text-brand-orange">supabase-course-pricing.sql</code> trong Supabase SQL Editor
                    trước.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AdminWorkspaceShell>
  );
}
