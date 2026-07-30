import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Tiếp thị liên kết · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Tiếp thị liên kết"
      description="Theo dõi mã giới thiệu, lượt click và hoa hồng affiliate — hiện chưa có hệ theo dõi affiliate thật trong sản phẩm."
      scope={[
        "Tạo mã giới thiệu riêng cho từng cộng tác viên.",
        "Theo dõi lượt click/chuyển đổi theo mã giới thiệu.",
        "Tính và duyệt hoa hồng.",
      ]}
      note="Nội dung 'Làm tiếp thị liên kết' hiện có trên Portal (/portal/duan-cohoi/lam-affilate, /portal/earn) là trang giới thiệu tĩnh + danh sách chương trình affiliate (quản qua Workspace Học viện → Dự án & Cơ hội) — KHÔNG phải hệ theo dõi mã giới thiệu/hoa hồng thật. Không tạo trang thứ 2 cùng sở hữu nội dung đó."
      relatedLink={{ label: "Xem chương trình Affiliate (Dự án & Cơ hội)", href: "/admin/duan-cohoi/lam-affilate" }}
    />
  );
}
