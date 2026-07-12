import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PageOverviewStats } from "@/components/admin/website/PageOverviewStats";
import { PageRegistry } from "@/components/admin/website/PageRegistry";

export default function WebsitePagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Pages</h2>
          <p className="mt-1 text-sm text-white/60">
            Website Page Registry — danh sách tổng hợp mọi trang thuộc Website Workspace (Homepage, Landing Pages,
            Static Pages) dùng chung một cấu trúc dữ liệu (WEB-SPR-002). Quản lý metadata trang (Title/Slug/Status/
            Visibility/SEO) — chưa quản lý nội dung/bố cục trang (không có Visual Builder/Block Editor).
          </p>
        </div>
        <PageOverviewStats />
        <PageRegistry />
      </div>
    </WebsiteWorkspaceShell>
  );
}
