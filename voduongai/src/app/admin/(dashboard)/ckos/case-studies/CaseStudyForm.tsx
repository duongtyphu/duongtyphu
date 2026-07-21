"use client";

import { useState } from "react";
import { createCaseStudy, updateCaseStudy, deleteCaseStudy, type CaseStudy, type CaseStudyInput } from "./actions";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: CaseStudyInput = {
  title: "",
  client_name: "",
  summary: "",
  result_metric: "",
  thumbnail_url: "",
  link_url: "",
  active: true,
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function Fields({ value, onChange }: { value: CaseStudyInput; onChange: (v: CaseStudyInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Tiêu đề"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        className={`${inputClass} sm:col-span-2`}
      />
      <input
        placeholder="Tên khách hàng / học viên"
        value={value.client_name}
        onChange={(e) => onChange({ ...value, client_name: e.target.value })}
        className={inputClass}
      />
      <input
        placeholder="Kết quả nổi bật (VD: Tăng thu nhập gấp 3 lần)"
        value={value.result_metric}
        onChange={(e) => onChange({ ...value, result_metric: e.target.value })}
        className={inputClass}
      />
      <textarea
        placeholder="Tóm tắt (hiển thị ở card /portal/case-studies)"
        value={value.summary}
        onChange={(e) => onChange({ ...value, summary: e.target.value })}
        rows={2}
        className={`${inputClass} sm:col-span-2`}
      />
      <input
        placeholder="Thumbnail URL"
        value={value.thumbnail_url}
        onChange={(e) => onChange({ ...value, thumbnail_url: e.target.value })}
        className={inputClass}
      />
      <input
        placeholder="Link chi tiết (external)"
        value={value.link_url}
        onChange={(e) => onChange({ ...value, link_url: e.target.value })}
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
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

export function NewCaseStudyForm() {
  const [value, setValue] = useState<CaseStudyInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function submit() {
    if (!value.title.trim()) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    const result = await createCaseStudy(value);
    if (result.error) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    setValue(EMPTY);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">Thêm Case Study mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3">
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} />
      </div>
      <button
        onClick={submit}
        disabled={saveState === "saving"}
        className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {saveState === "saving" ? "Đang lưu..." : "Tạo Case Study"}
      </button>
    </div>
  );
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<CaseStudyInput>({
    title: caseStudy.title,
    client_name: caseStudy.client_name ?? "",
    summary: caseStudy.summary ?? "",
    result_metric: caseStudy.result_metric ?? "",
    thumbnail_url: caseStudy.thumbnail_url ?? "",
    link_url: caseStudy.link_url ?? "",
    active: caseStudy.active,
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function save() {
    setSaveState("saving");
    const result = await updateCaseStudy(caseStudy.id, value);
    if (result.error) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá Case Study "${caseStudy.title}"?`)) return;
    await deleteCaseStudy(caseStudy.id);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex justify-end">
          <SaveStateBadge state={saveState} isDirty={false} />
        </div>
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} />
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{caseStudy.title}</h3>
          {caseStudy.client_name && <p className="mt-1 text-xs text-gray-500">{caseStudy.client_name}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            caseStudy.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {caseStudy.active ? "Đang hiển thị" : "Đã ẩn"}
        </span>
      </div>
      {caseStudy.summary && <p className="mt-2 text-sm text-gray-600">{caseStudy.summary}</p>}
      {caseStudy.result_metric && (
        <p className="mt-2 text-sm font-semibold text-brand-orange">📈 {caseStudy.result_metric}</p>
      )}
      <div className="mt-3 flex gap-2">
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
