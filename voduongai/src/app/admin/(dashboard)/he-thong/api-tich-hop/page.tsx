import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "API & Tích hợp · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="API & Tích hợp"
      description="Xem trạng thái tích hợp các dịch vụ bên ngoài (nhà cung cấp AI, thanh toán) — KHÔNG hiển thị giá trị secret key nào."
      scope={[
        "Trạng thái đã cấu hình/chưa cấu hình cho từng dịch vụ (chỉ hiện có/không, không hiện giá trị).",
        "Kiểm tra kết nối (health check) tới từng dịch vụ.",
      ]}
      note="Theo nguyên tắc bắt buộc của Admin v2.0: KHÔNG hiển thị secret key, service-role key, access token hay bất kỳ biến môi trường nhạy cảm nào qua giao diện — kể cả khi triển khai thật, trang này chỉ hiện trạng thái có/không cấu hình."
    />
  );
}
