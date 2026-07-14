import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { SEORegistry } from "@/components/admin/website/SEORegistry";
import { SEOPreviewPlaceholder } from "@/components/admin/website/SEOPreviewPlaceholder";
import { RedirectRegistry } from "@/components/admin/website/RedirectRegistry";

export default function WebsiteSeoPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">SEO</h2>
          <p className="mt-1 text-sm text-white/60">
            Tiêu đề/Mô tả Meta, Open Graph, Canonical URL, Robots, Sitemap cho từng đường dẫn thuộc Website. Chỉ lưu
            metadata Founder tự nhập, chưa tự sinh SEO/Sitemap/Robots.
          </p>
        </div>
        <SEORegistry />
        <SEOPreviewPlaceholder />

        <div>
          <h2 className="text-lg font-bold text-white">Chuyển hướng</h2>
          <p className="mt-1 text-sm text-white/60">
            Danh sách rule chuyển hướng 301/302. Chưa nối dây để tự chuyển hướng request thật — chuyển hướng thật của
            Portal vẫn khai báo tĩnh trong code.
          </p>
        </div>
        <RedirectRegistry />
      </div>
    </WebsiteWorkspaceShell>
  );
}
