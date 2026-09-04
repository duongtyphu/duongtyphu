"use client";

import { useState } from "react";
import { createMnytCategory, updateMnytCategory, deleteMnytCategory, type MnytCategoryRow } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: MnytCategoryRow = { key: "", name: "", name_en: "", short_name: "", color: "#a78bfa", order_index: 0, status: "Published" };

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function Fields({
  value,
  onChange,
  keyEditable,
}: {
  value: MnytCategoryRow;
  onChange: (v: MnytCategoryRow) => void;
  keyEditable: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Mã lĩnh vực (key, VD: cafe) — không đổi được sau khi tạo"
        value={value.key}
        disabled={!keyEditable}
        onChange={(e) => onChange({ ...value, key: e.target.value })}
        className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}
      />
      <div className="flex items-center gap-2">
        <input type="color" value={value.color} onChange={(e) => onChange({ ...value, color: e.target.value })} className="h-9 w-12 rounded border border-gray-200" />
        <input placeholder="Mã màu (#hex)" value={value.color} onChange={(e) => onChange({ ...value, color: e.target.value })} className={inputClass} />
      </div>
      <input placeholder="Tên (tiếng Việt)" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} className={inputClass} />
      <input placeholder="Tên (English)" value={value.name_en} onChange={(e) => onChange({ ...value, name_en: e.target.value })} className={inputClass} />
      <input placeholder="Tên ngắn (hiển thị dày đặc, VD: F&B)" value={value.short_name} onChange={(e) => onChange({ ...value, short_name: e.target.value })} className={inputClass} />
      <input type="number" placeholder="Thứ tự hiển thị" value={value.order_index} onChange={(e) => onChange({ ...value, order_index: Number(e.target.value) })} className={inputClass} />
      <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value as MnytCategoryRow["status"] })} className={inputClass}>
        <option value="Published">Published — hiển thị công khai</option>
        <option value="Draft">Draft — chỉ Admin thấy</option>
        <option value="Hidden">Hidden — ẩn hẳn</option>
      </select>
    </div>
  );
}

export function NewCategoryForm() {
  const [value, setValue] = useState<MnytCategoryRow>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createMnytCategory(value);
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
        <h2 className="text-sm font-bold text-gray-900">Thêm lĩnh vực mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3">
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} keyEditable />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button onClick={submit} disabled={saveState === "saving"} className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
        {saveState === "saving" ? "Đang lưu..." : "Thêm lĩnh vực"}
      </button>
    </div>
  );
}

export function CategoryCard({ category, topicCount }: { category: MnytCategoryRow; topicCount: number }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<MnytCategoryRow>(category);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaveState("saving");
    setError(null);
    const { key, ...input } = value;
    void key;
    const result = await updateMnytCategory(category.key, input);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá lĩnh vực "${category.name}"? Chỉ xoá được nếu không còn ý tưởng nào thuộc lĩnh vực này.`)) return;
    const result = await deleteMnytCategory(category.key);
    if (result.error) alert(result.error);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex justify-end">
          <SaveStateBadge state={saveState} isDirty={false} />
        </div>
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} keyEditable={false} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={save} disabled={saveState === "saving"} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">Lưu</button>
          <button onClick={() => { setEditing(false); setValue(category); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: category.color }} />
        <span className="font-semibold text-gray-900">{category.name}</span>
        <span className="font-mono text-xs text-gray-400">{category.key}</span>
        <span className="text-sm text-gray-500">{topicCount} ý tưởng</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${category.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {category.status}
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => setEditing(true)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Sửa</button>
        <button onClick={remove} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Xoá</button>
      </div>
    </div>
  );
}
