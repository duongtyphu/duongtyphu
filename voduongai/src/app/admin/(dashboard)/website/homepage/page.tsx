import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PageOverviewStats } from "@/components/admin/website/PageOverviewStats";
import { PageRegistry } from "@/components/admin/website/PageRegistry";

export default function WebsiteHomepagePage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Homepage</h2>
          <p className="mt-1 text-sm text-white/60">
            Quản lý metadata trang chủ marketing công khai (Title/Slug/Status/Visibility/SEO) — dùng chung Website
            Page Registry, lọc theo loại &quot;Homepage&quot;. Nội dung thật của trang chủ (Hero/TrustStats/FounderStory/
            Problem/Solution/AcademyTeaser/FinalCTA) hiện vẫn hardcode ở{" "}
            <code className="text-brand-orange">src/components/home/*.tsx</code> — chỉnh nội dung khối cần một
            sprint riêng có Visual/Block Editor (ngoài phạm vi WEB-SPR-002).
          </p>
        </div>
        <PageOverviewStats lockedPageType="Homepage" />
        <PageRegistry lockedPageType="Homepage" />
      </div>
    </WebsiteWorkspaceShell>
  );
}
