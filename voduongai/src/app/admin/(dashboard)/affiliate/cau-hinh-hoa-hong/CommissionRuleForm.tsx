"use client";

import { useState } from "react";
import { createCommissionRule, updateCommissionRule, deleteCommissionRule, type CommissionRule, type CommissionRuleInput } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: CommissionRuleInput = {
  product_type: "course",
  product_id: "",
  product_label: "",
  commission_rate: 0.1,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function Fields({ value, onChange }: { value: CommissionRuleInput; onChange: (v: CommissionRuleInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <select
        value={value.product_type}
        onChange={(e) => onChange({ ...value, product_type: e.target.value as CommissionRuleInput["product_type"] })}
        className={inputClass}
      >
        <option value="course">Khoá học (courses.id)</option>
        <option value="product">Sản phẩm (products.id)</option>
        <option value="lesson">Bài học (lessons.id)</option>
      </select>
      <input
        placeholder="ID sản phẩm (VD: solo, scale, ai-coban)"
        value={value.product_id}
        onChange={(e) => onChange({ ...value, product_id: e.target.value })}
        className={inputClass}
      />
      <input
        placeholder="Tên hiển thị (tuỳ chọn, VD: VDAI SOLO)"
        value={value.product_label}
        onChange={(e) => onChange({ ...value, product_label: e.target.value })}
        className={inputClass}
      />
      <div>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="Mức hoa hồng (%)"
          value={value.commission_rate * 100 || ""}
          onChange={(e) => onChange({ ...value, commission_rate: Number(e.target.value) / 100 })}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-400">Mặc định toàn hệ thống là 10% nếu không có cấu hình riêng.</p>
      </div>
    </div>
  );
}

export function NewCommissionRuleForm() {
  const [value, setValue] = useState<CommissionRuleInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createCommissionRule(value);
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
        <h2 className="text-sm font-bold text-gray-900">Thêm cấu hình mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3">
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
        {saveState === "saving" ? "Đang lưu..." : "Thêm cấu hình"}
      </button>
    </div>
  );
}

export function CommissionRuleCard({ rule }: { rule: CommissionRule }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<CommissionRuleInput>({
    product_type: rule.product_type,
    product_id: rule.product_id,
    product_label: rule.product_label ?? "",
    commission_rate: rule.commission_rate,
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updateCommissionRule(rule.id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá cấu hình hoa hồng cho "${rule.product_label ?? rule.product_id}"? Về sau sẽ dùng lại mức mặc định 10%.`)) return;
    await deleteCommissionRule(rule.id);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex justify-end">
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
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">{rule.product_type}</span>
        <span className="font-mono text-sm font-bold text-gray-900">{rule.product_id}</span>
        {rule.product_label && <span className="text-sm text-gray-600">{rule.product_label}</span>}
        <span className="text-sm font-semibold text-brand-blue">{Math.round(rule.commission_rate * 100)}%</span>
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
