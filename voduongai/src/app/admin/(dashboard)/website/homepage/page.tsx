import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PageOverviewStats } from "@/components/admin/website/PageOverviewStats";
import { PageRegistry } from "@/components/admin/website/PageRegistry";
import { HomepageSectionRegistry } from "@/components/admin/website/HomepageSectionRegistry";

export default function WebsiteHomepagePage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Homepage</h2>
          <p className="mt-1 text-sm text-white/60">
            Quản lý metadata trang chủ marketing công khai (Title/Slug/Status/Visibility/SEO) — dùng chung danh
            sách Trang của Website, lọc theo loại &quot;Homepage&quot;.
          </p>
        </div>
        <PageOverviewStats lockedPageType="Homepage" />
        <PageRegistry lockedPageType="Homepage" />

        <div>
          <h2 className="text-lg font-bold text-white">Cấu trúc Section (Task 3, WEB-SPR-202)</h2>
          <p className="mt-1 text-sm text-white/60">
            Đúng 11 section theo thứ tự render THẬT của trang chủ (audit trực tiếp{" "}
            <code className="text-brand-orange">src/app/page.tsx</code>) — quản lý thứ tự, ẩn/hiện, và liên kết tới
            nội dung ở Shared Sections. Nội dung/bố cục bên trong từng component vẫn hardcode ở{" "}
            <code className="text-brand-orange">src/components/home/*.tsx</code> — không có Visual/Block Editor
            (ngoài phạm vi Foundation).
          </p>
        </div>
        <HomepageSectionRegistry />
      </div>
    </WebsiteWorkspaceShell>
  );
}
