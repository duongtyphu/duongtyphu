import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { ColorPaletteRegistry } from "@/components/admin/brand/ColorPaletteRegistry";

export default function BrandColorPalettePage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Color Palette</h2>
          <p className="mt-1 text-sm text-white/60">
            Token màu thương hiệu — sao chép đúng các biến --color-brand-* thật trong globals.css, phân loại theo
            Role (Primary/Secondary/Accent/Semantic — gồm 3 Semantic Color từ nhóm GemOS Design System).{" "}
            <strong className="text-brand-orange">Lưu ý:</strong> &quot;Brand Orange&quot; hiện có 2 mã màu khác nhau
            đang tồn tại song song trong code (#FF7A00 thật vs #F97316 theo quy ước CLAUDE.md) — cần Founder chọn 1
            giá trị chính thức, xem báo cáo BRAND-SPR-001.
          </p>
        </div>
        <ColorPaletteRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
