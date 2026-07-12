import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { TypographyRegistry } from "@/components/admin/brand/TypographyRegistry";

export default function BrandTypographyPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Typography</h2>
          <p className="mt-1 text-sm text-white/60">
            Token typography — font family/weight/ghi chú sử dụng, sao chép sát --font-sans thật trong globals.css và
            font riêng (Inter) của Wordmark logo.
          </p>
        </div>
        <TypographyRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
