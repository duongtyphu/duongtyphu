"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder, type CheckoutItemType } from "./actions";

type CheckoutTarget = {
  itemType: CheckoutItemType;
  itemId: string | number;
  title: string;
  price: number;
};

export function CheckoutForm({ target, email }: { target: CheckoutTarget; email: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const creatingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (creatingRef.current) return;
    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }
    creatingRef.current = true;
    setBusy(true);
    setError("");
    const result = await createOrder(target.itemType, target.itemId, target.title, target.price, name, phone);
    creatingRef.current = false;
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    router.push(`/portal/checkout/order-received/${result.orderId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label className="text-xs font-semibold text-gray-500">Email</label>
        <input
          value={email}
          disabled
          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500">Họ và tên</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500">Số điện thoại</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912345678"
          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <p className="text-xs text-gray-500">
        Bằng việc bấm &quot;Thanh toán ngay&quot;, bạn đồng ý với{" "}
        <Link href="/terms" target="_blank" className="text-gray-600 underline hover:text-gray-900">
          Điều khoản sử dụng
        </Link>
        ,{" "}
        <Link href="/privacy" target="_blank" className="text-gray-600 underline hover:text-gray-900">
          Chính sách bảo mật
        </Link>{" "}
        và{" "}
        <Link href="/refund-policy" target="_blank" className="text-gray-600 underline hover:text-gray-900">
          Chính sách hoàn phí
        </Link>{" "}
        của VO DUONG AI.
      </p>

      <button
        type="submit"
        disabled={busy}
        className="mt-2 w-full rounded-full gradient-surface px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Đang xử lý..." : "Thanh toán ngay →"}
      </button>
    </form>
  );
}
