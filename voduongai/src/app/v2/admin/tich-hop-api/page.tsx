import { CheckCircle2, KeyRound, XCircle } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { checkAllProvidersHealth } from "@/ai/providers/provider-health-check";

export const metadata = { title: "Tích hợp & API — Admin" };

/**
 * `/v2/admin/tich-hop-api` — không có trang Portal 2.0 tương ứng. Đổi từ
 * mock (`@/lib/v2/data/ops` — 8 API key giả kèm chuỗi "sk-••••" trông như
 * key thật, request/tỷ lệ thành công bịa) sang `checkAllProvidersHealth()`
 * THẬT (Phase 4 Epic 01, đã dùng ở 1.0's `/admin/he-thong/api-tich-hop`) —
 * MỖI adapter chỉ tự xác nhận biến môi trường có giá trị hay không, KHÔNG
 * gọi mạng thật, KHÔNG BAO GIỜ trả về giá trị secret (chỉ boolean/tên biến
 * thiếu) — đúng nguyên tắc "Hệ thống" không hiển thị secret đã áp dụng
 * xuyên suốt Admin 1.0.
 */
export default async function AdminTichHopPage() {
  const providers = await checkAllProvidersHealth();
  const available = providers.filter((p) => p.available);

  const rows: TableRow[] = providers.map((p) => ({
    id: p.providerId,
    tags: [p.available ? "active" : "off"],
    cells: [
      { t: "strong", v: p.providerId },
      {
        t: "status",
        label: p.available ? "Đã cấu hình" : (p.reason ?? "Chưa cấu hình"),
        color: p.available ? "var(--v2-green)" : "var(--v2-muted)",
      },
      { t: "muted", v: new Date(p.checkedAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Tích hợp & API"
        title="Tích hợp & API"
        description="Trạng thái cấu hình THẬT của từng AI Provider — chỉ boolean/tên biến môi trường, không bao giờ hiện giá trị secret."
      />

      <KpiGrid
        items={[
          { id: "total", value: String(providers.length), label: "Provider đã đăng ký", icon: KeyRound, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "ok", value: String(available.length), label: "Đã cấu hình", icon: CheckCircle2, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "missing", value: String(providers.length - available.length), label: "Chưa cấu hình", icon: XCircle, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)" },
        ]}
      />

      <DataTable
        title="AI Provider"
        headers={["Provider", "Trạng thái", "Kiểm tra lúc"]}
        rows={rows}
        totalLabel="provider"
        searchPlaceholder="Tìm provider..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "active", label: "Đã cấu hình", tag: "active" },
          { id: "off", label: "Chưa cấu hình", tag: "off" },
        ]}
      />
    </div>
  );
}
