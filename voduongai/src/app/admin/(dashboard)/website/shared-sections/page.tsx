import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { SharedSectionRegistry } from "@/components/admin/website/SharedSectionRegistry";
import { SharedSectionPreviewPlaceholder } from "@/components/admin/website/SharedSectionPreviewPlaceholder";

export default function WebsiteSharedSectionsPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Nội dung dùng chung</h2>
          <p className="mt-1 text-sm text-white/60">
            Shared Section Registry — quản lý nội dung/copy của 9 khối dùng chung: Hero, CTA, Banner, Feature,
            Founder, Testimonial, FAQ, Footer, Announcement (WEB-SPR-004 Foundation). Quản lý headline/body/CTA —
            không có Section Builder/Landing Builder/AI Generator/Dynamic Layout Engine, không kéo-thả. Xem
            docs/admin/WEBSITE_WORKSPACE_FOUNDATION.md phần WEB-SPR-004 để biết mục nào đã có nguồn thật trên Portal
            và mục nào chỉ là minh họa (Testimonial/FAQ/Announcement — chưa có khối hardcode 1-1 tương ứng).
          </p>
        </div>
        <SharedSectionRegistry />
        <SharedSectionPreviewPlaceholder />
      </div>
    </WebsiteWorkspaceShell>
  );
}
