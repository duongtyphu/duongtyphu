"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";

export default function CkosGoalsAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Goals"
      description="Khung mục tiêu/khuôn mẫu tư duy tái sử dụng được trong CKOS. Khác với mục tiêu cá nhân của từng học viên (user_goals) trên Portal — không phải tri thức dùng chung."
      collectionKey="ckos-goals"
      categoryOptions={["Kinh doanh", "Nội dung", "Kỹ năng", "Vận hành"]}
    />
  );
}
