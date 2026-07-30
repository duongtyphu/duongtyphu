import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Palette } from "lucide-react";

export const metadata = { title: "Brand Studio · Admin" };

/**
 * ADM-V2-04 — "Brand Studio" (Thương hiệu & Media). Route thật — nhưng
 * chưa có tài liệu/quy chuẩn giọng điệu thương hiệu (brand voice) nào tồn
 * tại trong dự án (đã tìm, không có file brand guide nào trong voduongai/ —
 * khác hẳn thư mục static site gốc `duongtyphu/` có `BRAND_VOICE_GUIDE.md`,
 * đó là tài liệu của website tĩnh CŨ, không thuộc phạm vi Admin CMS này).
 * Màu thương hiệu đã quản ở "Header & Footer" (Website), logo đã có ở
 * "Logo & Nhận diện" — cần Founder quyết định "Brand Studio" tổng hợp
 * thêm nội dung gì (giọng điệu/quy chuẩn viết) trước khi thiết kế schema.
 * KHÔNG nhầm với "Companion Studio™" (src/ai/**) — trợ lý AI viết nội
 * dung, không liên quan quản lý bản sắc thương hiệu.
 */
export default async function BrandStudioPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Thương hiệu & Media", href: "/admin/thuong-hieu-media/tai-lieu" }, { label: "Brand Studio" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Brand Studio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Không gian tổng hợp quản lý bản sắc thương hiệu VO DUONG AI.
        </p>
      </div>

      <AdminEmptyState
        icon={Palette}
        title="Chưa có tài liệu brand voice/quy chuẩn nội dung nào trong dự án"
        description="Màu thương hiệu và logo đã quản được ở Header & Footer/Logo & Nhận diện. Phần còn thiếu (giọng điệu, quy chuẩn viết nội dung) cần Founder xác nhận phạm vi cụ thể trước khi thiết kế schema — chưa tự tạo bảng."
        action={{ label: "Xem Header & Footer (màu thương hiệu)", href: "/admin/website/header-footer" }}
      />
    </div>
  );
}
