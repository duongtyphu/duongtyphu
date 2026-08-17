import { Card } from "@/components/v2/ui/Card";
import { PageHead } from "@/components/v2/ui/PageHead";

export const metadata = { title: "Thông báo — Admin" };

/**
 * `/v2/admin/thong-bao` — không có trang Portal 2.0 tương ứng. Hệ thống
 * chưa có bảng `notifications`/cơ chế đẩy thông báo thật nào (đã xác
 * nhận khi audit Admin 1.0 Sprint 1 "Tổng quan" — cùng kết luận: không
 * bịa danh sách thông báo/template/tỷ lệ mở). Đổi bản mock cũ (KPI + bảng
 * template gửi hàng loạt hoàn toàn bịa) sang Empty State trung thực.
 */
export default function AdminThongBaoPage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Thông báo"
        title="Thông báo"
        description="Hệ thống chưa có cơ chế thông báo/push nào — chưa có gì để quản lý ở đây."
      />
      <Card padding="admin">
        <p className="text-[13px] leading-relaxed text-[var(--v2-muted)]">
          Chưa có bảng dữ liệu hay dịch vụ gửi thông báo (email/push/in-app) nào tích hợp trong dự án. Xây
          tính năng này là 1 việc riêng, cần xác nhận phạm vi (kênh gửi, đối tượng, mẫu nội dung) trước khi
          thiết kế schema.
        </p>
      </Card>
    </div>
  );
}
