import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaFolderRegistry } from "@/components/admin/media/MediaFolderRegistry";
import { MediaCollectionRegistry } from "@/components/admin/media/MediaCollectionRegistry";
import { MediaTagRegistry } from "@/components/admin/media/MediaTagRegistry";

export default function MediaFoldersPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Thư mục</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu trúc thư mục phân loại file (tối đa 1 cấp cha) — không phải hệ thống file thật, chỉ là thông tin tổ
            chức.
          </p>
        </div>
        <MediaFolderRegistry />

        <div>
          <h2 className="text-lg font-bold text-white">Bộ sưu tập</h2>
          <p className="mt-1 text-sm text-white/60">
            Nhóm tuyển chọn linh hoạt cho mục đích cụ thể (VD &quot;Ảnh trang chủ&quot;) — khác thư mục (cấu trúc cố
            định).
          </p>
        </div>
        <MediaCollectionRegistry />

        <div>
          <h2 className="text-lg font-bold text-white">Nhãn</h2>
          <p className="mt-1 text-sm text-white/60">
            Nhãn dùng chung cho toàn hệ thống — mỗi file có thể gắn nhiều nhãn.
          </p>
        </div>
        <MediaTagRegistry />
      </div>
    </MediaWorkspaceShell>
  );
}
