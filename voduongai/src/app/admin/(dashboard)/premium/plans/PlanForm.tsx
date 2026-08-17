"use client";

import { useState } from "react";
import { createPremiumPlan, updatePremiumPlan, deletePremiumPlan, type PremiumPlanRow, type PremiumPlanInput } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: PremiumPlanInput = {
  name: "",
  subtitle: "",
  price: 0,
  original_price: null,
  duration_days: 30,
  features: [],
  is_featured: false,
  cta_label: "Chọn gói",
  status: "Draft",
  order: 0,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function featuresToText(features: string[]): string {
  return features.join("\n");
}

function textToFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function Fields({ value, onChange }: { value: PremiumPlanInput; onChange: (v: PremiumPlanInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Tên gói (VD: Gói Tháng)"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        className={inputClass}
      />
      <input
        placeholder="Nhãn phụ (VD: Linh hoạt – Học ngay)"
        value={value.subtitle}
        onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Giá bán (đ)"
        value={value.price || ""}
        onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Giá gạch ngang (bỏ trống nếu không có)"
        value={value.original_price ?? ""}
        onChange={(e) => onChange({ ...value, original_price: e.target.value ? Number(e.target.value) : null })}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Số ngày hiệu lực (VD: 30 / 180 / 365)"
        value={value.duration_days || ""}
        onChange={(e) => onChange({ ...value, duration_days: Number(e.target.value) })}
        className={inputClass}
      />
      <input
        placeholder="Nhãn nút CTA (VD: Chọn gói tháng)"
        value={value.cta_label}
        onChange={(e) => onChange({ ...value, cta_label: e.target.value })}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Thứ tự hiển thị (số nhỏ hiện trước)"
        value={value.order}
        onChange={(e) => onChange({ ...value, order: Number(e.target.value) })}
        className={inputClass}
      />
      <select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as "Draft" | "Published" })}
        className={inputClass}
      >
        <option value="Draft">Nháp — chưa hiện trên Portal</option>
        <option value="Published">Đã xuất bản — hiện trên /v2/premium</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
        <input
          type="checkbox"
          checked={value.is_featured}
          onChange={(e) => onChange({ ...value, is_featured: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        Gói nổi bật (viền tím, tách bóng — thường đặt cho gói khuyến khích mua nhất)
      </label>
      <textarea
        placeholder={"Tính năng, mỗi dòng 1 mục (VD:\nTruy cập toàn bộ CKOS\nHỗ trợ ưu tiên)"}
        value={featuresToText(value.features)}
        onChange={(e) => onChange({ ...value, features: textToFeatures(e.target.value) })}
        rows={4}
        className={`${inputClass} sm:col-span-2`}
      />
    </div>
  );
}

export function NewPlanForm() {
  const [id, setId] = useState("");
  const [value, setValue] = useState<PremiumPlanInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createPremiumPlan(id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setId("");
    setValue(EMPTY);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">Tạo gói Premium mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3">
        <input
          placeholder="Mã gói — không đổi được sau khi tạo (VD: premium-thang)"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setSaveState("idle");
          }}
          className={`${inputClass} mb-3`}
        />
        <Fields
          value={value}
          onChange={(v) => {
            setValue(v);
            setSaveState("idle");
          }}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={saveState === "saving"}
        className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {saveState === "saving" ? "Đang lưu..." : "Tạo gói"}
      </button>
    </div>
  );
}

export function PlanCard({ plan }: { plan: PremiumPlanRow }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<PremiumPlanInput>({
    name: plan.name,
    subtitle: plan.subtitle,
    price: plan.price,
    original_price: plan.original_price,
    duration_days: plan.duration_days,
    features: plan.features,
    is_featured: plan.is_featured,
    cta_label: plan.cta_label,
    status: plan.status,
    order: plan.order,
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updatePremiumPlan(plan.id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá gói "${plan.name}" (${plan.id})? Đơn hàng cũ đã gắn gói này không bị ảnh hưởng.`)) return;
    await deletePremiumPlan(plan.id);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <code className="text-xs font-bold text-gray-500">{plan.id}</code>
          <SaveStateBadge state={saveState} isDirty={false} />
        </div>
        <Fields
          value={value}
          onChange={(v) => {
            setValue(v);
            setSaveState("idle");
          }}
        />
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
        <span className="text-sm font-bold text-gray-900">{plan.name}</span>
        <code className="text-xs text-gray-400">{plan.id}</code>
        <span className="text-sm text-gray-700">
          {plan.price.toLocaleString("vi-VN")}đ
          {plan.original_price ? <span className="ml-1 text-gray-400 line-through">{plan.original_price.toLocaleString("vi-VN")}đ</span> : null}
        </span>
        <span className="text-sm text-gray-600">{plan.duration_days} ngày</span>
        {plan.is_featured && (
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Nổi bật</span>
        )}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            plan.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {plan.status === "Published" ? "Đã xuất bản" : "Nháp"}
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
