import { Card } from "@/components/v2/ui/Card";
import { PageHead } from "@/components/v2/ui/PageHead";

export const metadata = { title: "Thư viện Media — Admin" };

/**
 * `/v2/admin/thu-vien-media` — không có trang Portal 2.0 tương ứng. Bản
 * mock cũ hiện KpiGrid bịa ("2.148 GB đã dùng", "6.842 ảnh"...) + ô "Kéo
 * thả tệp vào đây" KHÔNG có action tải lên thật (dự án chưa có hạ tầng
 * upload/lưu trữ ở BẤT KỲ đâu — đã xác nhận nhiều lần khi audit Admin 1.0
 * Sprint 4 "Thương hiệu & Media"/Media Center). Đổi sang Empty State
 * trung thực thay vì UI giả vờ upload được.
 */
export default function AdminThuVienMediaPage() {
  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tổng quan › Thư viện Media"
        title="Thư viện Media"
        description="Dự án chưa có hạ tầng upload/lưu trữ file nào — chưa có gì để quản lý ở đây."
      />
      <Card padding="admin">
        <p className="text-[13px] leading-relaxed text-[var(--v2-muted)]">
          Ảnh/video/tài liệu hiện tại đều dán URL đã host sẵn (Google Drive, ảnh tĩnh trong{" "}
          <code>public/</code>...) — không có chỗ tập trung để &quot;thư viện media&quot; quản lý. Xây
          upload thật (kèm CDN/lưu trữ) là 1 việc riêng, lớn hơn phạm vi trang này.
        </p>
      </Card>
    </div>
  );
}
