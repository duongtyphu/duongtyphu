"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";

export default function CkosFaqsAdminPage() {
  return (
    <KnowledgeCrudPage
      title="FAQs"
      description="Câu hỏi thường gặp — dùng field Title làm câu hỏi, Body làm câu trả lời."
      collectionKey="ckos-faqs"
      categoryOptions={["Tài khoản", "Thanh toán", "Sản phẩm", "Kỹ thuật"]}
    />
  );
}
