import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Header & Footer · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Header & Footer"
      description="Quản lý nội dung tĩnh của Header/Footer công khai (ngoài menu điều hướng) — logo, tagline, thông tin liên hệ, mạng xã hội."
      scope={[
        "Sửa tagline/slogan hiển thị cạnh logo.",
        "Sửa thông tin liên hệ ở Footer.",
        "Sửa/thêm liên kết mạng xã hội ở Footer.",
      ]}
      note="Header/Footer hiện là component code cố định (src/components/site/Header.tsx, Footer.tsx) dùng chung cho MỌI trang — không đụng layout/animation/cấu trúc, chỉ nội dung văn bản khi triển khai thật."
    />
  );
}
