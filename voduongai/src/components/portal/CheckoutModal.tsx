"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { bankConfig } from "@/lib/site";
import { createOrder, applyCoupon, getOrderStatus, type CheckoutItemType } from "@/app/portal/checkout/actions";

type CheckoutTarget = {
  itemType: CheckoutItemType;
  itemId: string | number;
  title: string;
  price: number;
};

type Stage = "info" | "loading" | "pay" | "success" | "error";

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

export function CheckoutButton({ target, label }: { target: CheckoutTarget; label: string }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("info");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [finalPrice, setFinalPrice] = useState(target.price);
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const creatingRef = useRef(false);

  useEffect(() => {
    if (stage !== "pay" || !orderId) return;
    const interval = setInterval(async () => {
      const { status } = await getOrderStatus(orderId);
      if (status === "confirmed") setStage("success");
    }, 4000);
    return () => clearInterval(interval);
  }, [stage, orderId]);

  function handleOpenInfo() {
    setOpen(true);
    setStage("info");
  }

  async function handleSubmitInfo() {
    if (creatingRef.current) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }
    creatingRef.current = true;
    setStage("loading");
    const result = await createOrder(target.itemType, target.itemId, target.title, target.price, customerName, customerPhone);
    creatingRef.current = false;
    if (!result.ok) {
      setErrorMsg(result.error);
      setStage("error");
      return;
    }
    setOrderId(result.orderId);
    setOrderCode(result.orderCode);
    setFinalPrice(result.finalPrice);
    setStage("pay");
  }

  async function handleApplyCoupon() {
    if (!orderId || !couponInput.trim()) return;
    setCouponBusy(true);
    const result = await applyCoupon(orderId, target.price, couponInput);
    setCouponBusy(false);
    if (!result.ok) {
      alert(result.error);
      return;
    }
    setFinalPrice(result.finalPrice);
    setCouponCode(result.couponCode);
  }

  function handleClose() {
    setOpen(false);
    setStage("info");
    setOrderId(null);
    setCouponCode("");
    setCouponInput("");
    setCustomerName("");
    setCustomerPhone("");
  }

  const qrUrl = orderCode
    ? `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.account}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(bankConfig.owner)}`
    : "";

  return (
    <>
      <button
        onClick={handleOpenInfo}
        className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {label}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1F4D] p-6">
            {stage === "info" && (
              <>
                <h3 className="text-lg font-bold text-white">{target.title}</h3>
                <p className="mt-1 text-sm text-white/60">
                  {target.price > 0 ? `${target.price.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-white/60">Họ và tên</label>
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60">Số điện thoại</label>
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0912345678"
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmitInfo}
                  className="mt-4 w-full rounded-full gradient-surface px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Tiếp tục →
                </button>
                <button onClick={handleClose} className="mt-2 w-full text-xs font-semibold text-white/50 hover:underline">
                  Đóng
                </button>
              </>
            )}

            {stage === "loading" && <p className="text-center text-sm text-white/70">Đang khởi tạo đơn hàng...</p>}

            {stage === "error" && (
              <div className="text-center">
                <p className="text-sm text-red-400">{errorMsg}</p>
                <button onClick={handleClose} className="mt-4 text-xs font-semibold text-white/60 hover:underline">
                  Đóng
                </button>
              </div>
            )}

            {stage === "pay" && (
              <>
                <h3 className="text-lg font-bold text-white">{target.title}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-white/60">Số tiền chuyển khoản</span>
                  <span className="text-lg font-extrabold text-white">
                    {finalPrice > 0 ? `${finalPrice.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                    {couponCode && <span className="ml-1 text-xs font-semibold text-green-400">(mã {couponCode})</span>}
                  </span>
                </div>

                {target.price > 0 && !couponCode && (
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

                {finalPrice > 0 ? (
                  <>
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <img
                        src={qrUrl}
                        alt="QR VietQR"
                        width={176}
                        height={176}
                        decoding="async"
                        className="h-44 w-44 shrink-0 rounded-lg bg-white p-2"
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
                      Đang chờ xác nhận thanh toán tự động...
                    </div>
                  </>
                ) : (
                  <p className="mt-4 rounded-lg bg-white/5 p-3 text-center text-xs text-white/70">
                    📩 Đơn đăng ký miễn phí đã được ghi nhận. Admin sẽ liên hệ và xác nhận trong 24h.
                  </p>
                )}

                {finalPrice === 0 && (
                  <button
                    onClick={() => setStage("success")}
                    className="mt-4 w-full rounded-full gradient-surface px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Gửi yêu cầu đăng ký
                  </button>
                )}
                <button onClick={handleClose} className="mt-2 w-full text-xs font-semibold text-white/50 hover:underline">
                  Đóng
                </button>
              </>
            )}

            {stage === "success" && (
              <div className="text-center">
                <p className="text-3xl">🎉</p>
                <h3 className="mt-2 text-lg font-bold text-white">Đã ghi nhận đơn hàng!</h3>
                <p className="mt-2 text-sm text-white/70">
                  Cảm ơn bạn. Nội dung sẽ xuất hiện trong{" "}
                  <strong className="text-white">Sản phẩm của tôi</strong> ngay khi xác nhận.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white hover:border-brand-violet hover:text-brand-violet"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
