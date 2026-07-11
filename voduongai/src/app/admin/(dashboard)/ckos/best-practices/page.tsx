"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";

export default function CkosBestPracticesAdminPage() {
  return (
    <KnowledgeCrudPage
      title="Best Practices"
      description="Thực hành tốt nhất được đúc kết từ kinh nghiệm thực chiến."
      collectionKey="ckos-best-practices"
      categoryOptions={["Prompt", "Vận hành", "Nội dung", "Bán hàng"]}
    />
  );
}
