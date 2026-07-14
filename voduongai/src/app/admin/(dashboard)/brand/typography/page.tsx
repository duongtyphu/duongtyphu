import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { TypographyRegistry } from "@/components/admin/brand/TypographyRegistry";
import { ColorPaletteRegistry } from "@/components/admin/brand/ColorPaletteRegistry";
import { ThemeRegistry } from "@/components/admin/brand/ThemeRegistry";

export default function BrandTypographyPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Kiểu chữ</h2>
          <p className="mt-1 text-sm text-white/60">
            Font chữ theo vai trò (Tiêu đề/Nội dung/Chú thích...), sao chép đúng font thật đang chạy trên Portal.
          </p>
        </div>
        <TypographyRegistry />

        <div>
          <h2 className="text-lg font-bold text-white">Bảng màu</h2>
          <p className="mt-1 text-sm text-white/60">
            Màu thương hiệu theo vai trò (Chính/Phụ/Nhấn/Ngữ nghĩa), sao chép đúng mã màu thật đang chạy trên Portal.
          </p>
        </div>
        <ColorPaletteRegistry />

        <div>
          <h2 className="text-lg font-bold text-white">Giao diện</h2>
          <p className="mt-1 text-sm text-white/60">
            Ghi nhận các tổ hợp nền/chữ/màu nhấn đang thực sự tồn tại trên Portal/Admin — chưa có cơ chế đổi giao
            diện thật.
          </p>
        </div>
        <ThemeRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
