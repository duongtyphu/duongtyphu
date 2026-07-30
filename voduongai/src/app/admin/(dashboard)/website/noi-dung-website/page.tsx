import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Nội dung Website · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Nội dung Website"
      description="Quản lý nội dung các trang tĩnh công khai ngoài Landing Page — /about, /contact, /privacy, /terms, /disclaimer, /refund-policy..."
      scope={[
        "Sửa nội dung văn bản của các trang chính sách/giới thiệu qua UI thay vì sửa code.",
        "Xem trước thay đổi trước khi xuất bản.",
      ]}
      note="Các trang này hiện là component React tĩnh trong code (src/app/about, /contact, /privacy...) — chưa có CMS. 'Landing Page' (trang chủ /) đã có Live-edit riêng, không thuộc phạm vi trang này."
      relatedLink={{ label: "Xem Landing Page (Live-edit)", href: "/admin/landing" }}
    />
  );
}
