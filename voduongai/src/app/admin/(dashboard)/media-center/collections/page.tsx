import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaCollectionRegistry } from "@/components/admin/media/MediaCollectionRegistry";

export default function MediaCollectionsPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Collections</h2>
          <p className="mt-1 text-sm text-white/60">
            Nhóm tuyển chọn linh hoạt (Task 6) — khác Folder (cấu trúc phân cấp cố định), Collection dùng cho mục
            đích cụ thể (VD &quot;Homepage Hero Assets&quot;). Dùng làm giá trị `collectionId` cho Media Asset.
          </p>
        </div>
        <MediaCollectionRegistry />
      </div>
    </MediaWorkspaceShell>
  );
}
