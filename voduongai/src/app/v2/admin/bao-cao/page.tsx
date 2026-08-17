import { Eye } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { getCkosPopularDocuments } from "@/lib/portal/live-ckos";

export const metadata = { title: "Báo cáo & Analytics — Admin" };

/**
 * `/v2/admin/bao-cao` — không có trang Portal 2.0 tương ứng. Đổi từ số
 * liệu bịa hoàn toàn (lưu lượng/nguồn truy cập/bounce rate/thời gian
 * phiên — không có Google Analytics Data API tích hợp, cùng kết luận đã
 * xác nhận ở 1.0's `/admin/marketing/phan-tich-marketing`) sang đúng 1
 * mảnh dữ liệu hiệu quả nội dung THẬT đang có: lượt xem tài liệu CKOS
 * (`ckos_content_views`, xây ở Bước E.1 Mục 2). Không bịa phần còn lại.
 */
export default async function AdminBaoCaoPage() {
  const popular = await getCkosPopularDocuments(10);

  const rows: TableRow[] = popular.documents.map((doc) => ({
    id: doc.slug,
    cells: [
      { t: "strong", v: doc.title },
      { t: "text", v: String(doc.viewCount) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Tổng quan › Báo cáo & Analytics"
        title="Báo cáo & Analytics"
        description="Hệ thống chưa tích hợp Google Analytics Data API nên chưa có lưu lượng/nguồn truy cập/tỷ lệ thoát thật — chỉ hiện đúng 1 mảnh dữ liệu hiệu quả nội dung đang có: lượt xem tài liệu CKOS."
      />

      <KpiGrid
        items={[
          {
            id: "tracked",
            value: String(popular.documents.length),
            label: "Tài liệu CKOS có theo dõi lượt xem",
            icon: Eye,
            gradient: "linear-gradient(145deg,#a08bff,#6d4aff)",
          },
        ]}
      />

      <Card padding="admin">
        <CardHead title="Tài liệu CKOS xem nhiều nhất" />
        {!popular.sortedByViews ? (
          <p className="text-[12.5px] text-[var(--v2-muted)]">
            Chưa có lượt xem nào được ghi nhận — danh sách dưới đây đang sắp theo tài liệu mới nhất.
          </p>
        ) : null}
      </Card>

      {rows.length > 0 ? (
        <DataTable title="Chi tiết" headers={["Tài liệu", "Lượt xem"]} rows={rows} totalLabel="tài liệu" pageSize={10} />
      ) : (
        <Card padding="admin">
          <p className="text-[12.5px] text-[var(--v2-muted)]">Chưa có tài liệu CKOS nào.</p>
        </Card>
      )}
    </div>
  );
}
