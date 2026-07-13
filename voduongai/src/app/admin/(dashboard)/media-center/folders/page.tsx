import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaFolderRegistry } from "@/components/admin/media/MediaFolderRegistry";

export default function MediaFoldersPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Folder Management</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu trúc thư mục phân loại asset (tối đa 1 cấp cha), dùng làm giá trị `folderId` cho Media Asset (Task
            6). 5 Folder seed bám theo nhóm asset thật đã audit — không phải hệ thống file thật, chỉ là metadata tổ
            chức.
          </p>
        </div>
        <MediaFolderRegistry />
      </div>
    </MediaWorkspaceShell>
  );
}
