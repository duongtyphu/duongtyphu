import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { RedirectRegistry } from "@/components/admin/website/RedirectRegistry";

export default function WebsiteRedirectPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Redirect</h2>
          <p className="mt-1 text-sm text-white/60">
            Danh sách Redirect — danh sách rule 301/302 (WEB-SPR-005 Foundation). Không có cơ chế chuyển hướng tự
            động hoạt động thật — mục này chỉ lưu danh sách, chưa nối dây để thực sự chuyển hướng request thật. Toàn bộ redirect thật của
            Portal vẫn khai báo tĩnh trong next.config.ts, xem
            docs/admin/WEBSITE_WORKSPACE_FOUNDATION.md phần WEB-SPR-005.
          </p>
        </div>
        <RedirectRegistry />
      </div>
    </WebsiteWorkspaceShell>
  );
}
