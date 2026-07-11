"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";
import { Badge } from "@/components/admin/ui/Badge";

export default function CaseStudyAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Case Studies"
      description={
        'Canonical CKOS module (ADM-SPR-004) — dùng bảng jsonb "case_study" đã có sẵn (trước đây orphan). ' +
        'LƯU Ý: trang công khai /portal/case-studies vẫn đọc từ bảng typed "case_studies" (khác), nên case study soạn mới từ đây CHƯA hiển thị công khai cho tới khi có sprint riêng cập nhật đường đọc của Portal — case study cũ đã publish trước đây vẫn hiển thị bình thường. Xem docs/admin/CKOS_MANAGEMENT.md §12.'
      }
      collectionKey="case-study"
      extraColumns={[
        { key: "client_name", label: "Khách hàng" },
        {
          key: "featured",
          label: "Nổi bật",
          render: (it) => (it.featured ? <Badge tone="orange">Featured</Badge> : <span className="text-white/30">—</span>),
        },
      ]}
      extraFields={[
        { key: "client_name", label: "Tên khách hàng", type: "text" },
        { key: "result_metric", label: "Kết quả nổi bật (số liệu)", type: "text" },
        { key: "thumbnail_url", label: "Ảnh thumbnail", type: "text" },
        { key: "link_url", label: "Link ngoài (nếu có)", type: "text" },
        { key: "featured", label: "Featured", type: "boolean" },
      ]}
    />
  );
}
