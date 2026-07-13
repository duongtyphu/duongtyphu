import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { TypographyRegistry } from "@/components/admin/brand/TypographyRegistry";

export default function BrandTypographyPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Typography</h2>
          <p className="mt-1 text-sm text-white/60">
            Token typography — font family/weight/ghi chú sử dụng, phân loại theo Role (System/Heading/Body/
            Caption/Display), sao chép sát --font-sans thật trong globals.css và font riêng (Inter) của Wordmark
            logo. <strong className="text-brand-orange">Lưu ý:</strong> role &quot;Display&quot; hiện là khoảng
            trống thật — --font-display trong globals.css trỏ thẳng về --font-sans, chưa có font display riêng.
          </p>
        </div>
        <TypographyRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
