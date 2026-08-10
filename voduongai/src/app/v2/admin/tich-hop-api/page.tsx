import { Activity, AlertTriangle, KeyRound, Percent } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { listApiKeys, listWebhooks } from "@/lib/v2/data/ops";

export const metadata = { title: "Tích hợp & API — Admin" };

export default async function AdminTichHopPage() {
  const [keys, webhooks] = await Promise.all([listApiKeys(), listWebhooks()]);

  const keyRows: TableRow[] = keys.map((key) => ({
    id: key.id,
    tags: [key.active ? "active" : "off"],
    cells: [
      { t: "strong", v: key.name },
      {
        t: "tag",
        label: key.service,
        background: "var(--v2-violet-light)",
        color: "var(--v2-violet)",
      },
      { t: "muted", v: key.maskedKey },
      { t: "text", v: key.scope },
      { t: "muted", v: key.lastUsedAt },
      {
        t: "status",
        label: key.active ? "Đang hoạt động" : "Đã tắt",
        color: key.active ? "var(--v2-green)" : "var(--v2-muted)",
      },
    ],
  }));

  const webhookRows: TableRow[] = webhooks.map((webhook) => ({
    id: webhook.id,
    cells: [
      { t: "strong", v: webhook.endpoint },
      {
        t: "tag",
        label: webhook.event,
        background: "#e6f0ff",
        color: "#1d5fd8",
      },
      { t: "muted", v: webhook.lastSentAt },
      {
        t: "status",
        label: webhook.ok ? "Thành công" : "Lỗi gần đây",
        color: webhook.ok ? "var(--v2-green)" : "var(--v2-red)",
      },
      {
        t: "status",
        label: webhook.enabled ? "Đang bật" : "Đã tắt",
        color: webhook.enabled ? "var(--v2-green)" : "var(--v2-muted)",
      },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Tích hợp & API"
        title="Tích hợp & API Keys"
        description="Quản lý API key, webhook và kết nối với các dịch vụ AI, phân tích, lưu trữ bên thứ 3."
      />

      <KpiGrid
        items={[
          { id: "keys", value: "8", label: "API Key đang hoạt động", icon: KeyRound, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "requests", value: "2,4 Tr", label: "Request / 30 ngày", icon: Activity, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "14,2%", trend: "up" },
          { id: "success", value: "99,8%", label: "Tỷ lệ thành công", icon: Percent, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "0,1%", trend: "up" },
          { id: "errors", value: "3", label: "Webhook lỗi gần đây", icon: AlertTriangle, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "1,0", trend: "down" },
        ]}
      />

      <DataTable
        title="API Keys"
        headers={["Tên key", "Dịch vụ", "Key", "Phạm vi", "Dùng gần nhất", "Trạng thái"]}
        rows={keyRows}
        totalLabel="key"
        searchPlaceholder="Tìm key hoặc dịch vụ..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "active", label: "Đang hoạt động", tag: "active" },
          { id: "off", label: "Đã tắt", tag: "off" },
        ]}
      />

      <DataTable
        title="Webhook"
        headers={["Endpoint", "Sự kiện", "Lần gửi cuối", "Kết quả", "Trạng thái"]}
        rows={webhookRows}
        pageSize={6}
      />
    </div>
  );
}
