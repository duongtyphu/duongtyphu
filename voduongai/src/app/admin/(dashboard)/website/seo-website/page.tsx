import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "SEO Website · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="SEO Website"
      description="Xem tổng quan cấu hình SEO hiện tại của Website — không chỉnh sửa sitemap/robots/structured data kỹ thuật qua UI (giữ nguyên trong code để tránh rủi ro)."
      scope={[
        "Xem trước meta title/description từng trang tĩnh trước khi sửa nội dung.",
        "Kiểm tra nhanh trạng thái sitemap.xml/robots.txt hiện tại (chỉ đọc).",
      ]}
      note="Theo nguyên tắc bắt buộc của Admin v2.0: Sitemap, Robots, structured data (schema.org) và toàn bộ SEO kỹ thuật KHÔNG được chỉnh tự do qua UI — vẫn giữ trong code (src/app/sitemap.ts, robots.ts, layout metadata)."
    />
  );
}
