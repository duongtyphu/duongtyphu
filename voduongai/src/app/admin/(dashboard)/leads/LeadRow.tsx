"use client";

import { useState } from "react";
import { updateLeadStatus, type Lead } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

const statusLabel: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  converted: "Đã chuyển đổi",
};

export function LeadRow({ lead }: { lead: Lead }) {
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function setStatus(status: "new" | "contacted" | "converted") {
    setSaving(true);
    const result = await updateLeadStatus(lead.id, status);
    setSaving(false);
    if (result.error) push(result.error);
    else push("Đã cập nhật trạng thái lead.");
  }

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-3 text-sm text-white/80">{lead.email}</td>
      <td className="px-3 py-3 text-sm text-white/80">{lead.source ?? "—"}</td>
      <td className="px-3 py-3 text-xs text-white/40">{new Date(lead.created_at).toLocaleDateString("vi-VN")}</td>
      <td className="px-3 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            lead.status === "converted"
              ? "bg-green-500/10 text-green-400"
              : lead.status === "contacted"
                ? "bg-brand-blue/10 text-brand-blue"
                : "bg-brand-orange/10 text-brand-orange"
          }`}
        >
          {statusLabel[lead.status] ?? lead.status}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          <button
            onClick={() => setStatus("contacted")}
            disabled={saving || lead.status === "contacted"}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-30"
          >
            Đã liên hệ
          </button>
          <button
            onClick={() => setStatus("converted")}
            disabled={saving || lead.status === "converted"}
            className="rounded-lg border border-green-400/20 px-2.5 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/10 disabled:opacity-30"
          >
            Chuyển đổi
          </button>
        </div>
      </td>
    </tr>
  );
}
