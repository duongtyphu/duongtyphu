import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaAssetRegistry } from "@/components/admin/media/MediaAssetRegistry";

export default function MediaLibraryPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Thư viện</h2>
          <p className="mt-1 text-sm text-white/60">
            Toàn bộ ảnh/video/tài liệu/âm thanh — tìm kiếm và lọc theo tên, thẻ, trạng thái. Chưa có tải file lên
            thật — chỉ quản lý thông tin các file đã có sẵn trong code.
          </p>
        </div>
        <MediaAssetRegistry />
      </div>
    </MediaWorkspaceShell>
  );
}
