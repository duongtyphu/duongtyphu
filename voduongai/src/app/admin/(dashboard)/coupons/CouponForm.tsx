"use client";

import { useRef, useState } from "react";
import { createCoupon } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

export function CouponForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const result = await createCoupon(formData);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push("Đã tạo mã giảm giá.");
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-2 lg:grid-cols-5"
    >
      <input
        name="code"
        placeholder="Mã (VD: VDAI20)"
        required
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
      <select
        name="discount_type"
        defaultValue="percent"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      >
        <option value="percent">Giảm theo %</option>
        <option value="fixed">Giảm số tiền cố định</option>
      </select>
      <input
        name="discount_value"
        type="number"
        min="1"
        placeholder="Giá trị giảm"
        required
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
      <input
        name="max_uses"
        type="number"
        min="1"
        placeholder="Số lượt dùng tối đa (để trống = không giới hạn)"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
      <input
        name="expires_at"
        type="date"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded-full gradient-surface px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:col-span-2 lg:col-span-1"
      >
        {saving ? "Đang tạo..." : "Tạo mã giảm giá"}
      </button>
    </form>
  );
}
