"use client";

import { useState } from "react";
import { requestAffiliatePayout } from "./actions";

export function RequestPayoutForm({ maxAmount }: { maxAmount: number }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(maxAmount));
  const [bankInfo, setBankInfo] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const result = await requestAffiliatePayout(Number(amount), bankInfo);
    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        Đã gửi yêu cầu thanh toán — Founder sẽ xử lý và cập nhật trạng thái sớm.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={maxAmount <= 0}
        className="rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Yêu cầu thanh toán hoa hồng
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div>
        <label className="text-xs font-semibold text-gray-500">Số tiền yêu cầu (đ)</label>
        <input
          type="number"
          min={1}
          max={maxAmount}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
        />
        <p className="mt-1 text-xs text-gray-400">Tối đa {maxAmount.toLocaleString("vi-VN")}đ (hoa hồng đã xác nhận, chưa thanh toán).</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500">Thông tin nhận tiền (ngân hàng / số tài khoản)</label>
        <input
          value={bankInfo}
          onChange={(e) => setBankInfo(e.target.value)}
          placeholder="VD: Vietcombank - 0123456789 - Nguyễn Văn A"
          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
        />
      </div>
      {status === "error" && <p className="text-xs text-red-500">{errorMsg}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting" ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
