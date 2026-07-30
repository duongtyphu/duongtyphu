import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Cấu hình chung · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Cấu hình chung"
      description="Các thiết lập kỹ thuật chung của hệ thống — KHÔNG bao gồm nội dung nghiệp vụ (nội dung thuộc các Workspace khác)."
      scope={[
        "Bật/tắt tính năng (feature flag) ở mức hệ thống.",
        "Thiết lập chung không thuộc về 1 module cụ thể nào.",
      ]}
      note="Hiện chưa có cơ chế cấu hình hệ thống tập trung nào trong sản phẩm — mọi cấu hình đang nằm trong code/biến môi trường."
    />
  );
}
