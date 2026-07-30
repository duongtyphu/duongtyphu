import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Logo & Nhận diện · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Logo & Nhận diện"
      description="Xem quy chuẩn logo SVG đồng nhất đang bắt buộc áp dụng cho mọi trang mới trong dự án."
      scope={[
        "Xem trước logo Header/Footer/Mobile drawer đang dùng.",
        "Xuất mã SVG chuẩn để dán vào trang mới (đỡ phải tra CLAUDE.md thủ công).",
      ]}
      note="Logo hiện là đoạn SVG hardcode cố định trong code (quy ước bắt buộc ghi trong CLAUDE.md — mọi trang mới PHẢI dùng đúng logo SVG này) — không cho chỉnh sửa tự do qua UI generic, vì đây là chuẩn nhận diện thương hiệu cố định, không phải nội dung có thể tuỳ biến."
    />
  );
}
