import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandOpenGraphPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Open Graph</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata ảnh Open Graph mặc định của thương hiệu và Social Preview (Twitter Card) — dùng chung thư viện
            nhận diện thương hiệu, lọc theo category &quot;Open Graph Image&quot;. <strong>Khác</strong> với Open Graph
            title/description theo từng trang (thuộc cấu hình SEO trong mục Website, xem WEB-SPR-005) — mục này
            chỉ quản lý ẢNH OG/Social Preview mặc định cấp thương hiệu. Phát hiện: Portal hiện chưa có OG image nào
            (generateMetadata() không set openGraph.images) và Twitter Card cũng không set twitter.images.
          </p>
        </div>
        <BrandAssetRegistry lockedCategory="OpenGraphImage" />
      </div>
    </BrandWorkspaceShell>
  );
}
