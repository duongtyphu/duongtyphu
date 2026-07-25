import { redirect } from "next/navigation";
import SubProjectPage from "@/app/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]/page";
import { EditModeProvider } from "@/components/portal/opportunities/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Trang dự án con (Live-edit) · Admin" };

/**
 * Live-edit (Cách A) cho trang chi tiết dự án con
 * (/portal/duan-cohoi/[ecosystemSlug]/[subProjectSlug]) — 1 route dynamic
 * duy nhất phục vụ cả 5 dự án con hiện có (3 DigiU + 2 SolarGroup) và mọi
 * dự án con thêm sau này, cùng kỹ thuật route
 * `/admin/duan-cohoi/[ecosystemSlug]` đã dùng cho cấp hệ sinh thái.
 *
 * Render lại ĐÚNG component gốc `SubProjectPage` (import thẳng), bọc
 * `<EditModeProvider>` — sửa được: "Đánh giá" (6 tiêu chí, dùng chung
 * `EditModeContext`/`EditableRegion` module `opportunities`) và "Cập nhật
 * thông tin mới" (thêm/sửa/xoá bài viết riêng của dự án con này).
 */
export default async function SubProjectLiveEditPage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string; subProjectSlug: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <SubProjectPage params={params} />
    </EditModeProvider>
  );
}
