import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PageOverviewStats } from "@/components/admin/website/PageOverviewStats";
import { PageRegistry } from "@/components/admin/website/PageRegistry";

export default function WebsiteLandingPagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Landing Pages</h2>
          <p className="mt-1 text-sm text-white/60">
            Quản lý metadata landing page (chương trình/chiến dịch) — dùng chung danh sách Trang của Website, lọc theo
            loại &quot;Landing Page&quot;. Không có công cụ dựng Landing Page tự động trong sprint này — đăng ký metadata trang trước, xây
            công cụ dựng nội dung landing page ở sprint sau.
          </p>
        </div>
        <PageOverviewStats lockedPageType="Landing Page" />
        <PageRegistry lockedPageType="Landing Page" />
      </div>
    </WebsiteWorkspaceShell>
  );
}
