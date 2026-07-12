import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { NavigationRegistry } from "@/components/admin/website/NavigationRegistry";
import { NavigationPreview } from "@/components/admin/website/NavigationPreview";

export default function WebsiteNavigationPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Navigation</h2>
          <p className="mt-1 text-sm text-white/60">
            Navigation Registry — quản lý Group (Header/Sidebar/Footer/External) và Item bên trong (WEB-SPR-003
            Foundation, mở rộng Footer/External ở WEB-SPR-201). Sắp xếp bằng &quot;Sort Order&quot; nhập tay, không có
            Menu Builder/kéo-thả. Dữ liệu khởi tạo bên dưới sao chép đúng menu THẬT đang chạy trên Portal
            (src/lib/site.ts &quot;mainNav&quot;, src/lib/portal/hubs.ts &quot;portalNavSections&quot;,
            src/components/site/Footer.tsx, siteConfig.links) — chỉnh sửa ở đây hiện CHƯA ảnh hưởng menu thật, xem
            docs/admin/WEBSITE_WORKSPACE_FOUNDATION.md.
          </p>
        </div>
        <NavigationRegistry />
        <NavigationPreview />
      </div>
    </WebsiteWorkspaceShell>
  );
}
