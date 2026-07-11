import { Globe } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function WebsiteAdminPage() {
  return (
    <ComingSoon
      icon={Globe}
      title="Website"
      description="Quản lý nội dung trang web công khai (thông tin liên hệ, footer, trang pháp lý) — module sẽ được xây dựng ở sprint tiếp theo."
    />
  );
}
