import { Search } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function SeoAdminPage() {
  return (
    <ComingSoon
      icon={Search}
      title="SEO"
      description="Quản lý metadata, sitemap và cấu hình SEO theo từng trang — module sẽ được xây dựng ở sprint tiếp theo."
    />
  );
}
