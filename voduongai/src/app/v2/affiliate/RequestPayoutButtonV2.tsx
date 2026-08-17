"use client";

import { useState } from "react";

import { requestAffiliatePayout } from "@/app/portal/affiliate/actions";

/**
 * Bản thiết kế `Chuong trinh Affilate.html` KHÔNG có UI "yêu cầu thanh
 * toán" nào (chỉ có "Lịch sử thanh toán" tĩnh) — nhưng khả năng ghi thật
 * này ĐÃ CÓ SẴN ở 1.0 (`requestAffiliatePayout()`, RLS tự bảo vệ theo
 * `member_id`). Thêm 1 nút nhỏ vào đúng vị trí "Lịch sử thanh toán" (nơi
 * hợp lý nhất) để không bỏ phí khả năng thật đã có — tái dùng NGUYÊN
 * Server Action, chỉ viết lại UI khớp CSS classes của mockup này (`.copy-btn`
 * làm khuôn nút, không import component Tailwind của 1.0).
 */
export function RequestPayoutButtonV2({ maxAmount }: { maxAmount: number }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(maxAmount));
  const [bankInfo, setBankInfo] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (status === "done") {
    return <p style={{ fontSize: 12.5, color: "#189a52", fontWeight: 700 }}>Đã gửi yêu cầu — đội ngũ VO DUONG AI sẽ xử lý sớm.</p>;
  }

  if (!open) {
    return (
      <button
        className="copy-btn"
        style={{ background: "var(--violet)", opacity: maxAmount <= 0 ? 0.5 : 1, cursor: maxAmount <= 0 ? "not-allowed" : "pointer" }}
        disabled={maxAmount <= 0}
        onClick={() => setOpen(true)}
      >
        Yêu cầu thanh toán
      </button>
    );
  }

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

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
      <input
        type="number"
        min={1}
        max={maxAmount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="link-input"
        style={{ fontFamily: "inherit" }}
      />
      <input
        value={bankInfo}
        onChange={(e) => setBankInfo(e.target.value)}
        placeholder="Ngân hàng - Số tài khoản - Chủ TK"
        className="link-input"
        style={{ fontFamily: "inherit" }}
      />
      {status === "error" && <p style={{ fontSize: 11.5, color: "#e0455a" }}>{errorMsg}</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="copy-btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{ background: "none", border: "1px solid var(--line)", borderRadius: 10, padding: "0 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", color: "var(--muted)" }}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
