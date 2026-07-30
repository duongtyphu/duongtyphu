import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Brand Studio · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Brand Studio"
      description="Không gian tổng hợp quản lý bản sắc thương hiệu VO DUONG AI — màu sắc, font, giọng điệu, quy chuẩn hiển thị."
      scope={[
        "Xem nhanh bảng màu/design token đang dùng trong hệ thống.",
        "Quy chuẩn giọng điệu thương hiệu (brand voice) cho nội dung mới.",
        "Liên kết tới Logo & Nhận diện, Tài nguyên thương hiệu.",
      ]}
      note="Chưa có module Brand Studio nào trong sản phẩm. Có 1 hệ thống KHÁC dễ nhầm tên: 'Companion Studio™' (src/ai/**) là trợ lý AI viết nội dung cho Admin (gọi Anthropic/OpenAI...) — không liên quan quản lý bản sắc thương hiệu, không đụng tới khi triển khai Brand Studio thật."
    />
  );
}
