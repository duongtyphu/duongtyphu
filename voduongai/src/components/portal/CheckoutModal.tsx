"use client";

import { useState } from "react";
import { bankConfig } from "@/lib/site";
import { createOrder, applyCoupon, getOrderStatus, type CheckoutItemType } from "@/app/portal/checkout/actions";

type CheckoutTarget = {
  itemType: CheckoutItemType;
  itemId: string | number;
  title: string;
  price: number;
};

type Stage = "loading" | "pay" | "checking" | "success" | "error";

export function CheckoutButton({ target, label }: { target: CheckoutTarget; label: string }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [finalPrice, setFinalPrice] = useState(target.price);
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);

  async function handleOpen() {
    setOpen(true);
    setStage("loading");
    const result = await createOrder(target.itemType, target.itemId, target.title, target.price);
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

  async function handleCheckStatus() {
    if (!orderId) return;
    setStage("checking");
    const { status } = await getOrderStatus(orderId);
    if (status === "confirmed") {
      setStage("success");
    } else {
      setStage("pay");
      alert("Hệ thống chưa nhận được giao dịch. Nếu bạn vừa chuyển khoản, vui lòng đợi vài giây rồi bấm lại.");
    }
  }

  function handleClose() {
    setOpen(false);
    setStage("loading");
    setOrderId(null);
    setCouponCode("");
    setCouponInput("");
  }

  const qrUrl = orderCode
    ? `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.account}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(bankConfig.owner)}`
    : "";

  return (
    <>
      <button
        onClick={handleOpen}
        className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1F4D] p-6">
            {stage === "loading" && <p className="text-center text-sm text-white/70">Đang khởi tạo đơn hàng...</p>}

            {stage === "error" && (
              <div className="text-center">
                <p className="text-sm text-red-400">{errorMsg}</p>
                <button onClick={handleClose} className="mt-4 text-xs font-semibold text-white/60 hover:underline">
                  Đóng
                </button>
              </div>
            )}

            {(stage === "pay" || stage === "checking") && (
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
                      <img src={qrUrl} alt="QR VietQR" className="h-44 w-44 rounded-lg bg-white p-2" />
                      <p className="text-xs text-white/50">Quét mã bằng app ngân hàng bất kỳ</p>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-white/80">
                      <p>🏦 Ngân hàng: <strong>{bankConfig.name}</strong></p>
                      <p>💳 Số TK: <strong>{bankConfig.account}</strong></p>
                      <p>👤 Chủ TK: <strong>{bankConfig.owner}</strong></p>
                    </div>
                    <p className="mt-3 rounded-lg bg-white/5 p-3 text-xs text-white/70">
                      📝 Nội dung CK (bắt buộc giữ nguyên): <strong>{orderCode}</strong>
                      <br />
                      Hệ thống sẽ tự động xác nhận ngay khi nhận được tiền.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 rounded-lg bg-white/5 p-3 text-center text-xs text-white/70">
                    📩 Nhấn bên dưới để gửi yêu cầu đăng ký. Admin sẽ liên hệ và xác nhận trong 24h.
                  </p>
                )}

                <button
                  onClick={finalPrice > 0 ? handleCheckStatus : () => setStage("success")}
                  disabled={stage === "checking"}
                  className="mt-4 w-full rounded-full gradient-surface px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {stage === "checking"
                    ? "Đang kiểm tra..."
                    : finalPrice > 0
                      ? "Tôi đã chuyển khoản — kiểm tra trạng thái"
                      : "Gửi yêu cầu đăng ký"}
                </button>
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
                  Cảm ơn bạn. Admin sẽ xác nhận trong 24 giờ. Nội dung sẽ xuất hiện trong{" "}
                  <strong className="text-white">Sản phẩm của tôi</strong>.
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
        </div>
      )}
    </>
  );
}
