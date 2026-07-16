import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaAssetRegistry } from "@/components/admin/media/MediaAssetRegistry";

export default function MediaVideosPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Videos</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata video — Intro/Course/Marketing/Tutorial (Task 4), dùng chung thư viện Media, lọc theo
            category &quot;Video&quot;. <strong className="text-brand-orange">Khoảng trống thật:</strong> Portal
            hiện KHÔNG có bất kỳ video nào (không &lt;video&gt; tag, không file .mp4/.webm) — cả 4 sub-type dưới
            đây đều là mục ghi nhận khoảng trống, chưa có nội dung thật.
          </p>
        </div>
        <MediaAssetRegistry lockedCategory="Video" />
      </div>
    </MediaWorkspaceShell>
  );
}
