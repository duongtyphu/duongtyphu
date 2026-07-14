"use client";

import Link from "next/link";
import { Badge } from "@/components/admin/ui/Badge";
import { WORKSPACE_OWNERS, type WorkspaceMaturity } from "@/lib/admin/workspaceOwnership";

const MATURITY_TONE: Record<WorkspaceMaturity, "green" | "blue" | "orange" | "gray"> = {
  Canonical: "green",
  "Consistent-Legacy": "blue",
  "Mixed-Legacy": "orange",
  "Not Started": "gray",
};

const WCS_TONE: Record<string, "green" | "gray" | "red"> = {
  Approved: "green",
  Draft: "gray",
  "Chưa có": "red",
};

/**
 * Workspace Owner Panel (Task 5) — "Founder biết Workspace Owner của từng
 * nội dung." READ-ONLY, dữ liệu từ workspaceOwnership.ts (sourced từ WCS
 * + ADMIN_INFORMATION_ARCHITECTURE_V2.md, không suy diễn mới).
 */
export function WorkspaceOwnerPanel() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40">
            <th className="px-4 py-3 font-semibold">Workspace</th>
            <th className="px-4 py-3 font-semibold">Maturity</th>
            <th className="px-4 py-3 font-semibold">WCS</th>
            <th className="px-4 py-3 font-semibold">Sở hữu nội dung gì</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {WORKSPACE_OWNERS.map((ws) => (
            <tr key={ws.key} className="border-b border-white/5 hover:bg-white/[0.03]">
              <td className="px-4 py-3 font-semibold text-white">{ws.name}</td>
              <td className="px-4 py-3">
                <Badge tone={MATURITY_TONE[ws.maturity]}>{ws.maturity}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={WCS_TONE[ws.wcsStatus] ?? "gray"}>{ws.wcsStatus}</Badge>
              </td>
              <td className="px-4 py-3 max-w-md text-white/60">{ws.owns}</td>
              <td className="px-4 py-3 text-right">
                <Link href={ws.href} className="text-xs text-brand-blue hover:underline">
                  Mở Workspace →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
