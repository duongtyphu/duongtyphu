"use client";

import { KnowledgeCrudPage } from "@/components/admin/ckos/KnowledgeCrudPage";

export default function SopAdminPage() {
  return (
    <KnowledgeCrudPage
      title="SOP"
      description="Quản lý tài nguyên hiển thị và phân phối trong Portal. Canonical CKOS module (ADM-SPR-004): Title/Summary map vào name/description để Portal tiếp tục hoạt động bình thường."
      collectionKey="sop"
      titleKey="name"
      summaryKey="description"
      extraFields={[
        { key: "thumbnail", label: "Thumbnail", type: "text" },
        { key: "fileUrl", label: "File URL", type: "text" },
        { key: "downloadLink", label: "Link tải", type: "text" },
        { key: "tier", label: "Free / Premium", type: "select", options: ["Free", "Premium"] },
        { key: "requiresSignup", label: "Yêu cầu đăng ký", type: "boolean" },
        { key: "featured", label: "Featured", type: "boolean" },
      ]}
    />
  );
}
