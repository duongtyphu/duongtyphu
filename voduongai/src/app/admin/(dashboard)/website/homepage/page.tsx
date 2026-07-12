import { Home } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteHomepagePage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={Home}
        title="Homepage"
        scope="Quản lý toàn bộ nội dung trang chủ marketing công khai (không phải trang chủ Portal đã đăng nhập) — cụm nội dung hardcode có giá trị kinh doanh cao nhất được phát hiện ở ADM-SPR-005."
        willManage={[
          "Hero (headline, subhead, 2 nút CTA, số liệu nổi bật)",
          "TrustStats (số liệu uy tín: followers, tài liệu, công cụ, năm kinh nghiệm)",
          "Founder Story (tiểu sử, ảnh Founder)",
          "Problem / Solution (nội dung định vị sản phẩm)",
          "Academy Teaser (giới thiệu chương trình V-SOLO/V-SCALE)",
          "Final CTA (khối kêu gọi hành động cuối trang)",
        ]}
        portalSource="src/components/home/{Hero,TrustStats,FounderStory,Problem,Solution,AcademyTeaser,FinalCTA}.tsx — 100% hardcoded, cần deploy code để sửa. Xem docs/admin/PORTAL_COVERAGE_AUDIT.md §5 (mục 'Yes — nên đưa vào Admin sớm')."
      />
    </WebsiteWorkspaceShell>
  );
}
