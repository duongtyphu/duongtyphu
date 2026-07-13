import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { SEORegistry } from "@/components/admin/website/SEORegistry";
import { SEOPreviewPlaceholder } from "@/components/admin/website/SEOPreviewPlaceholder";

export default function WebsiteSeoPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">SEO</h2>
          <p className="mt-1 text-sm text-white/60">
            SEO Registry — Meta Title/Description, Open Graph, Canonical URL, Robots, Sitemap (Foundation) cho từng
            URL thuộc Website (WEB-SPR-005). Không SEO Generator, không AI SEO, không Sitemap/Robots Generator thật —
            chỉ lưu metadata Founder tự nhập. <strong>Lưu ý:</strong> sidebar Admin đã có sẵn một mục &quot;SEO&quot;
            đứng độc lập ở cấp cao nhất (/admin/seo, ComingSoon) — chồng lấn phạm vi với nhóm này chưa được PMO xử lý,
            xem docs/admin/WEBSITE_WORKSPACE_FOUNDATION.md phần WEB-SPR-005.
          </p>
        </div>
        <SEORegistry />
        <SEOPreviewPlaceholder />
      </div>
    </WebsiteWorkspaceShell>
  );
}
