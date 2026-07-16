import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { PortalMappingTable } from "@/components/admin/website/PortalMappingTable";

export default function WebsitePortalMappingPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Liên kết Portal</h2>
          <p className="mt-1 text-sm text-white/60">
            Bảng tra cứu tổng hợp (Task 8, WEB-SPR-202) — gộp mọi đối tượng Website đã có danh sách quản lý thật (Page/
            Navigation Item/Shared Section/Homepage Section) thành 1 hàng/object với Current Route → Khu vực
            phụ trách → Publish Status → Last Updated. Đây là view READ-ONLY derive từ 4 danh sách đã tồn tại — sửa dữ
            liệu ở đúng danh sách gốc (bấm &quot;Quản lý&quot; để đi tới), không sửa trực tiếp ở đây.
          </p>
        </div>
        <PortalMappingTable />
      </div>
    </WebsiteWorkspaceShell>
  );
}
