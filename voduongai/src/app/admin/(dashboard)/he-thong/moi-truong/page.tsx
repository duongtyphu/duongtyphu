import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Môi trường · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Môi trường"
      description="Xem tổng quan các môi trường triển khai (Production/Preview) — KHÔNG cho chỉnh biến môi trường trực tiếp từ giao diện."
      scope={[
        "Xem môi trường hiện tại đang chạy là Production hay Preview.",
        "Xem trạng thái build/deploy gần nhất (đọc từ Vercel).",
      ]}
      note="Theo nguyên tắc bắt buộc: KHÔNG cho chỉnh environment trực tiếp từ giao diện trong sprint này, và không hiển thị bất kỳ giá trị biến môi trường nhạy cảm nào. Quản lý biến môi trường vẫn thực hiện qua Vercel Dashboard/CLI."
    />
  );
}
