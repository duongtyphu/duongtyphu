import { Palette } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function BrandMediaAdminPage() {
  return (
    <ComingSoon
      icon={Palette}
      title="Brand & Media"
      description="Thư viện logo, màu thương hiệu, hình ảnh dùng chung — module sẽ được xây dựng ở sprint tiếp theo. Một số trường liên quan hiện vẫn nằm tạm trong System Settings."
    />
  );
}
