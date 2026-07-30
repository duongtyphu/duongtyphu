"use client";

import { useState } from "react";
import { createCoupon, updateCoupon, deleteCoupon, type Coupon, type CouponInput } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: CouponInput = {
  code: "",
  discount_type: "percent",
  discount_value: 0,
  max_uses: null,
  expires_at: null,
  active: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function Fields({ value, onChange }: { value: CouponInput; onChange: (v: CouponInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Mã (VD: VDAI50)"
        value={value.code}
        onChange={(e) => onChange({ ...value, code: e.target.value.toUpperCase() })}
        className={inputClass}
      />
      <select
        value={value.discount_type}
        onChange={(e) => onChange({ ...value, discount_type: e.target.value as "percent" | "fixed" })}
        className={inputClass}
      >
        <option value="percent">Giảm theo %</option>
        <option value="fixed">Giảm số tiền cố định (đ)</option>
      </select>
      <input
        type="number"
        placeholder={value.discount_type === "percent" ? "Phần trăm giảm (VD: 20)" : "Số tiền giảm (đ)"}
        value={value.discount_value || ""}
        onChange={(e) => onChange({ ...value, discount_value: Number(e.target.value) })}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Giới hạn số lần dùng (bỏ trống = không giới hạn)"
        value={value.max_uses ?? ""}
        onChange={(e) => onChange({ ...value, max_uses: e.target.value ? Number(e.target.value) : null })}
        className={inputClass}
      />
      <input
        type="date"
        value={toDateInputValue(value.expires_at)}
        onChange={(e) => onChange({ ...value, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={value.active}
          onChange={(e) => onChange({ ...value, active: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        Đang bật (áp dụng được ở checkout)
      </label>
    </div>
  );
}

export function NewCouponForm() {
  const [value, setValue] = useState<CouponInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createCoupon(value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setValue(EMPTY);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">Tạo mã giảm giá mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3">
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={saveState === "saving"}
        className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {saveState === "saving" ? "Đang lưu..." : "Tạo mã"}
      </button>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "Không giới hạn";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<CouponInput>({
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
    max_uses: coupon.max_uses,
    expires_at: coupon.expires_at,
    active: coupon.active,
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updateCoupon(coupon.id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    const usedNote = coupon.used_count > 0 ? ` (đã dùng ${coupon.used_count} lần)` : "";
    if (!confirm(`Xoá mã "${coupon.code}"${usedNote}? Đơn hàng đã áp mã này không bị ảnh hưởng.`)) return;
    await deleteCoupon(coupon.id);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex justify-end">
          <SaveStateBadge state={saveState} isDirty={false} />
        </div>
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button
            onClick={save}
            disabled={saveState === "saving"}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            Lưu
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-mono text-sm font-bold text-gray-900">{coupon.code}</span>
        <span className="text-sm text-gray-700">
          {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : `${coupon.discount_value.toLocaleString("vi-VN")}đ`}
        </span>
        <span className="text-sm text-gray-600">
          Đã dùng: {coupon.used_count}
          {coupon.max_uses ? ` / ${coupon.max_uses}` : " (không giới hạn)"}
        </span>
        <span className="text-sm text-gray-500">Hết hạn: {formatDate(coupon.expires_at)}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            coupon.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {coupon.active ? "Đang bật" : "Đã tắt"}
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Sửa
        </button>
        <button
          onClick={remove}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          Xoá
        </button>
      </div>
    </div>
  );
}
