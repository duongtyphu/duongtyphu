import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaAssetRegistry } from "@/components/admin/media/MediaAssetRegistry";

export default function MediaImagesPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Images</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata ảnh — Banner/Thumbnail/Hero/Logo Files/Gallery (Task 3), dùng chung thư viện Media, lọc
            theo category &quot;Image&quot;. <strong className="text-brand-orange">Lưu ý:</strong> phát hiện 2 ảnh
            founder khác nhau cho cùng chủ đề (`/founder.png` vs `/images/founder-portrait.jpg`) — cần Founder xác
            nhận có chủ đích hay trùng lặp ngoài ý muốn, xem báo cáo MEDIA-SPR-201.
          </p>
        </div>
        <MediaAssetRegistry lockedCategory="Image" />
      </div>
    </MediaWorkspaceShell>
  );
}
