import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Tài nguyên thương hiệu · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Tài nguyên thương hiệu"
      description="Kho tài nguyên dùng chung cho đối tác/cộng tác viên — banner quảng bá, mẫu bài đăng, bộ nhận diện tải về."
      scope={[
        "Cho phép đối tác/cộng tác viên tải bộ banner/mẫu bài đăng chuẩn thương hiệu.",
        "Phân loại theo chương trình (Affiliate, sự kiện, ra mắt khoá học).",
      ]}
      note="Chưa có kho tài nguyên thương hiệu nào trong sản phẩm — cần Media Center hoạt động trước làm nền tảng lưu trữ."
    />
  );
}
