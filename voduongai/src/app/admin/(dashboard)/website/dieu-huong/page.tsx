import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Điều hướng · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Điều hướng"
      description="Quản lý các đường dẫn menu điều hướng công khai trên Website (Header, Footer) qua UI thay vì sửa code."
      scope={[
        "Thêm/sửa/xoá/đổi thứ tự mục menu Header.",
        "Thêm/sửa/xoá liên kết trong từng cột Footer.",
      ]}
      note="Menu Header/Footer hiện hardcode trong src/components/site/Header.tsx và Footer.tsx — sửa an toàn qua UI generic có rủi ro tạo link chết trên trang có lưu lượng cao nhất hệ thống, cần thiết kế validate kỹ trước khi mở."
    />
  );
}
