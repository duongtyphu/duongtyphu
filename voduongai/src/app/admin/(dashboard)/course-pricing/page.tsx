import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listCoursePricing } from "./actions";
import { CourseRow } from "./CourseRow";

export const metadata = { title: "Giá khoá học Premium · Admin" };

export default async function CoursePricingAdminPage() {
  const { courses, configured } = await listCoursePricing();

  return (
    <div className="space-y-8">
      <AdminBreadcrumb
        trail={[{ label: "Học viện" }, { label: "Premium", href: "/admin/course-pricing" }, { label: "Giá khoá học Premium" }]}
      />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Khoá học Premium — giá &amp; mở bán</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đổi giá hoặc bật/tắt mở bán tại đây sẽ cập nhật ngay trên trang Premium và Học viện AI — không
          cần sửa code. &ldquo;Đang mở bán&rdquo; = card Premium hiện nút thanh toán; &ldquo;Sắp mở đăng
          ký&rdquo; = card hiển thị &ldquo;Sắp mở đăng ký&rdquo;.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền
          service role để quản lý giá khoá học.
        </div>
      )}

      {configured && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3">Khoá học</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Giá (VNĐ)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <CourseRow key={c.id} course={c} />
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                    Chưa có dữ liệu khoá học.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
