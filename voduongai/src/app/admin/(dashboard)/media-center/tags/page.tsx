import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaTagRegistry } from "@/components/admin/media/MediaTagRegistry";

export default function MediaTagsPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Media Tags</h2>
          <p className="mt-1 text-sm text-white/60">
            Tag dùng chung cho toàn hệ thống (Task 7) — danh sách phẳng, không phân cấp. Mỗi Media Asset có thể gắn
            nhiều tag (xem field `tags` ở Media Library/Images/Videos/Documents/Audio).
          </p>
        </div>
        <MediaTagRegistry />
      </div>
    </MediaWorkspaceShell>
  );
}
