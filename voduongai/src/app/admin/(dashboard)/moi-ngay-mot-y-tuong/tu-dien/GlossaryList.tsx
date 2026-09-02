"use client";

import { useMemo, useState } from "react";
import {
  createMnytGlossaryTerm,
  updateMnytGlossaryTerm,
  deleteMnytGlossaryTerm,
  type MnytGlossaryRow,
  type MnytGlossaryInput,
} from "./actions";
import { GLOSSARY_CATEGORY_OPTIONS } from "./constants";
import { SaveStateBadge, type SaveState } from "@/components/admin/SaveStateBadge";

const EMPTY: MnytGlossaryInput = { term: "", term_en: "", category: "foundation", definition: "", definition_en: "", order_index: 0, status: "Published" };

const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";
const taClass = `${inputClass} min-h-[70px] resize-y`;

function Fields({ value, onChange }: { value: MnytGlossaryInput; onChange: (v: MnytGlossaryInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input placeholder="Thuật ngữ (tiếng Việt)" value={value.term} onChange={(e) => onChange({ ...value, term: e.target.value })} className={inputClass} />
      <input placeholder="Term (English)" value={value.term_en} onChange={(e) => onChange({ ...value, term_en: e.target.value })} className={inputClass} />
      <select value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} className={inputClass}>
        {GLOSSARY_CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value as MnytGlossaryInput["status"] })} className={inputClass}>
        <option value="Published">Published</option>
        <option value="Draft">Draft</option>
        <option value="Hidden">Hidden</option>
      </select>
      <textarea placeholder="Định nghĩa (tiếng Việt)" value={value.definition} onChange={(e) => onChange({ ...value, definition: e.target.value })} className={`${taClass} sm:col-span-2`} />
      <textarea placeholder="Definition (English)" value={value.definition_en} onChange={(e) => onChange({ ...value, definition_en: e.target.value })} className={`${taClass} sm:col-span-2`} />
      <input type="number" placeholder="Thứ tự" value={value.order_index} onChange={(e) => onChange({ ...value, order_index: Number(e.target.value) })} className={inputClass} />
    </div>
  );
}

function NewTermForm() {
  const [value, setValue] = useState<MnytGlossaryInput>(EMPTY);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function submit() {
    setSaveState("saving");
    setError(null);
    const result = await createMnytGlossaryTerm(value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setValue(EMPTY);
    setOpen(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
        + Thêm thuật ngữ mới
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-900">Thuật ngữ mới</h2>
        <SaveStateBadge state={saveState} isDirty={false} />
      </div>
      <div className="mt-3"><Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} /></div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button onClick={submit} disabled={saveState === "saving"} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">Thêm</button>
        <button onClick={() => setOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
      </div>
    </div>
  );
}

function TermRow({ term }: { term: MnytGlossaryRow }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<MnytGlossaryInput>(term);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaveState("saving");
    setError(null);
    const result = await updateMnytGlossaryTerm(term.id, value);
    if (result.error) {
      setSaveState("error");
      setError(result.error);
      return;
    }
    setSaveState("saved");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá thuật ngữ "${term.term}"?`)) return;
    await deleteMnytGlossaryTerm(term.id);
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex justify-end"><SaveStateBadge state={saveState} isDirty={false} /></div>
        <Fields value={value} onChange={(v) => { setValue(v); setSaveState("idle"); }} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={save} disabled={saveState === "saving"} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">Lưu</button>
          <button onClick={() => { setEditing(false); setValue(term); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-900">{term.term}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">{term.category}</span>
          {term.status !== "Published" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{term.status}</span>}
        </div>
        <p className="mt-1 truncate text-xs text-gray-500">{term.definition}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => setEditing(true)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Sửa</button>
        <button onClick={remove} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Xoá</button>
      </div>
    </div>
  );
}

export function GlossaryList({ items }: { items: MnytGlossaryRow[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const needle = q.trim().toLowerCase();
    return items.filter((t) => t.term.toLowerCase().includes(needle) || t.term_en.toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <NewTermForm />
        <input
          type="search"
          placeholder={`Tìm trong ${items.length} thuật ngữ...`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((t) => (
          <TermRow key={t.id} term={t} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-gray-400">Không tìm thấy thuật ngữ nào.</p>}
      </div>
    </div>
  );
}
