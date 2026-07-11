"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";

export default function CkosWorkflowsAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Workflows"
      description="Quy trình/SOP có cấu trúc bước-theo-bước để đạt một kết quả cụ thể bằng AI."
      collectionKey="ckos-workflows"
      categoryOptions={["Nội dung", "Bán hàng", "Vận hành", "Sáng tạo"]}
    />
  );
}
