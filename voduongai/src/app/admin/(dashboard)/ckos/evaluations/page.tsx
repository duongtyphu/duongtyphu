"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";

export default function CkosEvaluationsAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Evaluations"
      description="Mô hình đánh giá/chấm điểm chất lượng đầu ra — nền tảng cho Evaluation Intelligence tương lai (chưa xây Runtime đánh giá tự động trong sprint này)."
      collectionKey="ckos-evaluations"
      categoryOptions={["Chất lượng nội dung", "Độ chính xác", "Tuân thủ giọng văn"]}
    />
  );
}
