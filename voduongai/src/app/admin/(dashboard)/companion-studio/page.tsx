import { Bot } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function CompanionStudioAdminPage() {
  return (
    <ComingSoon
      icon={Bot}
      title="Companion Studio"
      description="Quản lý persona, bộ nhớ và agent registry của Companion — module sẽ được xây dựng ở sprint tiếp theo, bắt đầu bằng một dashboard chỉ đọc."
    />
  );
}
