import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PageOverviewStats } from "@/components/admin/website/PageOverviewStats";
import { PageRegistry } from "@/components/admin/website/PageRegistry";

export default function WebsiteStaticPagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Static Pages</h2>
          <p className="mt-1 text-sm text-white/60">
            Quản lý metadata trang tĩnh (Giới thiệu, Liên hệ...) — dùng chung danh sách Trang của Website, lọc theo loại
            &quot;Static Page&quot;. <strong>Lưu ý riêng cho trang pháp lý</strong> (Terms/Privacy/Refund/Disclaimer): Mục
            này chỉ theo dõi metadata (trạng thái/hiển thị), không chỉnh nội dung pháp lý — nội dung pháp lý vẫn nên
            qua code review, đúng khuyến nghị của docs/admin/PORTAL_COVERAGE_AUDIT.md §5.
          </p>
        </div>
        <PageOverviewStats lockedPageType="Static Page" />
        <PageRegistry lockedPageType="Static Page" />
      </div>
    </WebsiteWorkspaceShell>
  );
}
