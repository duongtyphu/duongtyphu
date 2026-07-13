import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaAssetRegistry } from "@/components/admin/media/MediaAssetRegistry";

export default function MediaLibraryPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Media Library</h2>
          <p className="mt-1 text-sm text-white/60">
            Toàn bộ Digital Asset (Image/Video/Document/Audio), Browse/Search/Filter theo tên, tag, trạng thái (Task
            2). Chưa có Upload thật — Foundation chỉ quản lý metadata các asset đã tồn tại trong code
            (`public/`, `src/assets/`).
          </p>
        </div>
        <MediaAssetRegistry />
      </div>
    </MediaWorkspaceShell>
  );
}
