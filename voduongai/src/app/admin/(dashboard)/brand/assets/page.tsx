import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandAssetsPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Thư viện nhận diện</h2>
          <p className="mt-1 text-sm text-white/60">
            Toàn bộ hình ảnh nhận diện thương hiệu ở một nơi — Logo, chữ lockup thương hiệu, icon (favicon/app
            icon), ảnh chia sẻ mạng xã hội (Open Graph), ảnh/video thương hiệu và file nhận diện khác. Bảng bên
            dưới nhóm và sắp xếp theo loại, có ô tìm kiếm theo tên.
          </p>
        </div>
        <BrandAssetRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
