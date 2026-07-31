import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PackageOpen } from "lucide-react";

export const metadata = { title: "Tài nguyên thương hiệu · Admin" };

/**
 * ADM-V2-04 — "Tài nguyên thương hiệu" (Thương hiệu & Media). Route thật —
 * kho tài nguyên cho đối tác/cộng tác viên (banner, mẫu bài đăng, bộ nhận
 * diện tải về) phụ thuộc Media Center làm nền tảng lưu trữ trước (đúng
 * đánh giá gốc, re-audit không phát hiện gì mới) — chưa xây được cho tới
 * khi Media Center có hạ tầng upload/lưu trữ.
 */
export default async function TaiNguyenThuongHieuPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Thương hiệu & Media", href: "/admin/thuong-hieu-media/tai-lieu" }, { label: "Tài nguyên thương hiệu" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Tài nguyên thương hiệu</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kho tài nguyên dùng chung cho đối tác/cộng tác viên (banner, mẫu bài đăng, bộ nhận diện).
        </p>
      </div>

      <AdminEmptyState
        icon={PackageOpen}
        title="Cần Media Center làm nền tảng lưu trữ trước"
        description="Kho tài nguyên tải về cho đối tác/cộng tác viên phụ thuộc hạ tầng lưu trữ/upload — chưa có ở Media Center. Xây trang này sau khi Media Center có hạ tầng thật."
        action={{ label: "Xem Media Center", href: "/admin/thuong-hieu-media/media-center" }}
      />
    </div>
  );
}
