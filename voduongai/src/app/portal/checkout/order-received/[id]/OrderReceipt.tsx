"use client";

import { useEffect, useState } from "react";
import { bankConfig } from "@/lib/site";
import { applyCoupon, getOrderStatus, type OrderRecord } from "../../actions";

function CopyField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <p className="flex items-center justify-between gap-2">
      <span className="text-white/60">{label}</span>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex items-center gap-1.5 font-semibold hover:underline ${highlight ? "text-brand-orange" : "text-white"}`}
      >
        {value}
        <span className="text-xs">{copied ? "✅" : "📋"}</span>
      </button>
    </p>
  );
}

export function OrderReceipt({ order }: { order: OrderRecord }) {
  const [status, setStatus] = useState(order.status);
  const [finalPrice, setFinalPrice] = useState(order.amount);
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);

  useEffect(() => {
    if (status === "confirmed" || finalPrice === 0) return;
    const interval = setInterval(async () => {
      const { status: latest } = await getOrderStatus(order.id);
      if (latest === "confirmed") setStatus("confirmed");
    }, 4000);
    return () => clearInterval(interval);
  }, [status, finalPrice, order.id]);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponBusy(true);
    const result = await applyCoupon(order.id, order.amount, couponInput);
    setCouponBusy(false);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setFinalPrice(result.finalPrice);
    setCouponCode(result.couponCode);
  }

  const orderCode = order.order_code ?? `VDAI${order.id}`;
  const qrUrl = `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.account}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(bankConfig.owner)}`;

  if (status === "confirmed") {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
        <p className="text-3xl">🎉</p>
        <h2 className="mt-2 text-lg font-bold text-white">Đã xác nhận thanh toán!</h2>
        <p className="mt-2 text-sm text-white/70">
          Nội dung sẽ xuất hiện trong <strong className="text-white">Sản phẩm của tôi</strong>.
        </p>
        <a
          href="/portal/my-products"
          className="mt-4 inline-block rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Xem sản phẩm của tôi →
        </a>
      </div>
    );
  }

  if (finalPrice === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
        <p className="text-3xl">📩</p>
        <h2 className="mt-2 text-lg font-bold text-white">Đã ghi nhận yêu cầu đăng ký</h2>
        <p className="mt-2 text-sm text-white/70">Admin sẽ liên hệ và xác nhận trong 24h.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">Số tiền chuyển khoản</span>
        <span className="text-lg font-extrabold text-white">
          {finalPrice.toLocaleString("vi-VN")}đ
          {couponCode && <span className="ml-1 text-xs font-semibold text-green-400">(mã {couponCode})</span>}
        </span>
      </div>

      {!couponCode && (
        <div className="mt-3 flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Mã giảm giá (nếu có)"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={couponBusy}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white hover:border-brand-violet hover:text-brand-violet disabled:opacity-50"
          >
            {couponBusy ? "..." : "Áp dụng"}
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-col items-center gap-2">
        <img
          src={qrUrl}
          alt="QR VietQR"
          width={208}
          height={208}
          decoding="async"
          className="h-52 w-52 shrink-0 rounded-lg bg-white p-2"
        />
        <p className="text-xs text-white/50">Quét mã bằng app ngân hàng bất kỳ</p>
      </div>

      <div className="mt-3 space-y-1.5 rounded-lg bg-white/5 p-3 text-sm">
        <p className="flex items-center justify-between gap-2">
          <span className="text-white/60">🏦 Ngân hàng</span>
          <span className="font-semibold text-white">{bankConfig.name}</span>
        </p>
        <CopyField label="💳 Số TK" value={bankConfig.account} />
        <p className="flex items-center justify-between gap-2">
          <span className="text-white/60">👤 Chủ TK</span>
          <span className="font-semibold text-white">{bankConfig.owner}</span>
        </p>
        <CopyField label="💰 Số tiền" value={`${finalPrice.toLocaleString("vi-VN")}đ`} />
        <CopyField label="📝 Nội dung CK" value={orderCode} highlight />
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-white/5 p-3 text-xs text-white/70">
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-brand-orange" />
        Đang chờ xác nhận thanh toán tự động — vui lòng không tắt trang này.
      </div>
    </div>
  );
}
