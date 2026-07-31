"use client";

import { useState } from "react";
import { markPayoutPaid, rejectPayoutRequest } from "./actions";

export function PayoutRequestActions({ id }: { id: number }) {
  const [busy, setBusy] = useState<"paid" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMarkPaid() {
    if (!confirm("Xác nhận ĐÃ CHUYỂN KHOẢN thật cho yêu cầu này? Toàn bộ hoa hồng đang chờ của thành viên này sẽ chuyển sang trạng thái Đã thanh toán.")) return;
    setBusy("paid");
    setError(null);
    const result = await markPayoutPaid(id);
    if (result.error) setError(result.error);
    setBusy(null);
  }

  async function handleReject() {
    if (!confirm("Từ chối yêu cầu thanh toán này?")) return;
    setBusy("reject");
    setError(null);
    const result = await rejectPayoutRequest(id);
    if (result.error) setError(result.error);
    setBusy(null);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          onClick={handleMarkPaid}
          disabled={busy !== null}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {busy === "paid" ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
        </button>
        <button
          onClick={handleReject}
          disabled={busy !== null}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          Từ chối
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
