import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Tài liệu · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Tài liệu"
      description="Nơi xem lại tài liệu kỹ thuật/vận hành nội bộ của dự án (kiến trúc, quyết định thiết kế, hướng dẫn) ngay trong Admin thay vì phải mở repo code."
      scope={[
        "Hiển thị lại nội dung các file tài liệu trong thư mục docs/ (ví dụ Identity Hub, kiến trúc Portal).",
        "Tìm kiếm nhanh theo từ khoá trong tài liệu.",
      ]}
      note="Tài liệu hiện tồn tại dưới dạng file Markdown trong repository (thư mục docs/, CLAUDE.md ở gốc dự án) — chưa có UI đọc lại trong Admin."
    />
  );
}
