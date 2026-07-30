import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Chuyển đổi · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Chuyển đổi"
      description="Theo dõi phễu chuyển đổi — từ khách truy cập Landing Page đến đăng ký, đến mua khoá học."
      scope={[
        "Phễu: lượt xem Landing Page → đăng ký tài khoản → hoàn tất onboarding → mua khoá học.",
        "Tỷ lệ chuyển đổi theo từng bước, theo khoảng thời gian.",
      ]}
      note="Cần dữ liệu analytics theo phễu (funnel), hiện dự án chỉ có Google Analytics cơ bản (NEXT_PUBLIC_GA_ID) — chưa có tầng tổng hợp phễu chuyển đổi nội bộ."
    />
  );
}
