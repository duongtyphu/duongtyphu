"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";
import { Badge } from "@/components/admin/ui/Badge";

export default function CaseStudyAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Case Studies"
      description={
        '[STABILIZATION-SPR-1101] Canonical Case Study — bảng jsonb "case_study" là nguồn DUY NHẤT, Admin ghi và Portal (/portal/case-studies, /portal/congdongai) đọc cùng bảng này, filter status="Published". Bảng "case_studies" (typed, số nhiều) không còn được Portal đọc — legacy, không xóa nhưng không còn Consumer.'
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
