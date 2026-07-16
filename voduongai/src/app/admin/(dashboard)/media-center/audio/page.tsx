import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaAssetRegistry } from "@/components/admin/media/MediaAssetRegistry";

export default function MediaAudioPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Audio</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata audio, dùng chung thư viện Media, lọc theo category &quot;Audio&quot;.{" "}
            <strong className="text-brand-orange">Khoảng trống thật:</strong> Portal hiện KHÔNG có nội dung âm
            thanh nào (không &lt;audio&gt; tag, không file audio trong `public/`). Brief không cho danh sách
            sub-type Audio cụ thể — không tự bịa danh mục.
          </p>
        </div>
        <MediaAssetRegistry lockedCategory="Audio" />
      </div>
    </MediaWorkspaceShell>
  );
}
