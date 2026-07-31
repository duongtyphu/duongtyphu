"use client";

import { useState } from "react";
import { createDocument, updateDocument, deleteDocument, type PortalDocument, type PortalDocumentInput } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: PortalDocumentInput = {
  title: "",
  description: "",
  url: "",
  icon: "📄",
  bg_color: "#EEF4FF",
  display_order: 0,
  active: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function Fields({ value, onChange }: { value: PortalDocumentInput; onChange: (v: PortalDocumentInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Tiêu đề"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        className={`${inputClass} sm:col-span-2`}
      />
      <textarea
        placeholder="Mô tả ngắn"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        rows={2}
        className={`${inputClass} sm:col-span-2`}
      />
      <input
        placeholder="Link tải xuống (URL)"
        value={value.url}
        onChange={(e) => onChange({ ...value, url: e.target.value })}
        className={`${inputClass} sm:col-span-2`}
      />
      <input
        placeholder="Icon (emoji, VD: 📄)"
        value={value.icon}
        onChange={(e) => onChange({ ...value, icon: e.target.value })}
        className={inputClass}
      />
      <input
        placeholder="Màu nền thẻ (mã hex, VD: #EEF4FF)"
        value={value.bg_color}
        onChange={(e) => onChange({ ...value, bg_color: e.target.value })}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Thứ tự hiển thị"
        value={value.display_order}
        onChange={(e) => onChange({ ...value, display_order: Number(e.target.value) })}
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={value.active}
          onChange={(e) => onChange({ ...value, active: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        Hiển thị trên Portal
      </label>
    </div>
  );
}

export function NewDocumentForm() {
  const [value, setValue] = useState<PortalDocumentInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createDocument(value);
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
        <h2 className="text-sm font-bold text-gray-900">Thêm tài liệu mới</h2>
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
        {saveState === "saving" ? "Đang lưu..." : "Tạo tài liệu"}
      </button>
    </div>
  );
}

export function DocumentCard({ doc }: { doc: PortalDocument }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<PortalDocumentInput>({
    title: doc.title,
    description: doc.description ?? "",
    url: doc.url ?? "",
    icon: doc.icon ?? "📄",
    bg_color: doc.bg_color ?? "#EEF4FF",
    display_order: doc.display_order,
    active: doc.active,
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updateDocument(doc.id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá tài liệu "${doc.title}"?`)) return;
    await deleteDocument(doc.id);
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
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: doc.bg_color ?? "#EEF4FF" }}
        >
          {doc.icon ?? "📄"}
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{doc.title}</h3>
          {doc.description && <p className="mt-0.5 text-xs text-gray-500">{doc.description}</p>}
          <span
            className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              doc.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {doc.active ? "Đang hiển thị" : "Đã ẩn"}
          </span>
        </div>
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
