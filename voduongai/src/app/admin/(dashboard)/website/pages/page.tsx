import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PageOverviewStats } from "@/components/admin/website/PageOverviewStats";
import { PageRegistry } from "@/components/admin/website/PageRegistry";
import { HomepageSectionRegistry } from "@/components/admin/website/HomepageSectionRegistry";

export default function WebsitePagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Trang</h2>
          <p className="mt-1 text-sm text-white/60">
            Danh sách tổng hợp mọi trang (Trang chủ, Trang đích, Trang tĩnh) — quản lý metadata trang (Tiêu đề/
            Đường dẫn/Trạng thái/Hiển thị/SEO). Chưa quản lý nội dung/bố cục trang (không có công cụ dựng trang kéo-thả).
          </p>
        </div>
        <PageOverviewStats />
        <PageRegistry />

        <div>
          <h2 className="text-lg font-bold text-white">Cấu trúc trang chủ</h2>
          <p className="mt-1 text-sm text-white/60">
            Thứ tự các khối nội dung trên trang chủ — quản lý thứ tự, ẩn/hiện, liên kết tới nội dung ở tab
            &quot;Nội dung dùng chung&quot;.
          </p>
        </div>
        <HomepageSectionRegistry />
      </div>
    </WebsiteWorkspaceShell>
  );
}
