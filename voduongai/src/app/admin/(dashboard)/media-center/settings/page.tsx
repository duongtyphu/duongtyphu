import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaSettingsForm } from "@/components/admin/media/MediaSettingsForm";

export default function MediaSettingsPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Media Settings</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu hình chung cho Media Center (1 record duy nhất) — Upload Rules/Default Folder/Visibility/Storage
            Policy (Task 9). Foundation — chưa có cơ chế upload/storage provider thật để áp dụng các quy tắc này.
          </p>
        </div>
        <MediaSettingsForm />
      </div>
    </MediaWorkspaceShell>
  );
}
