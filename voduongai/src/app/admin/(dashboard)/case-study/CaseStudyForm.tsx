"use client";

import { useState } from "react";
import { createCaseStudy, updateCaseStudy, deleteCaseStudy, type CaseStudy, type CaseStudyInput } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

const EMPTY: CaseStudyInput = {
  title: "",
  slug: "",
  client_name: "",
  summary: "",
  body: "",
  result_metric: "",
  thumbnail_url: "",
  link_url: "",
  active: true,
  featured: false,
  published_at: "",
};

function Fields({ value, onChange }: { value: CaseStudyInput; onChange: (v: CaseStudyInput) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Tiêu đề"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-2"
      />
      <input
        placeholder="Slug"
        value={value.slug}
        onChange={(e) => onChange({ ...value, slug: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <input
        placeholder="Tên khách hàng / học viên"
        value={value.client_name}
        onChange={(e) => onChange({ ...value, client_name: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <textarea
        placeholder="Tóm tắt (hiển thị ở card /portal/case-studies)"
        value={value.summary}
        onChange={(e) => onChange({ ...value, summary: e.target.value })}
        rows={2}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-2"
      />
      <textarea
        placeholder="Nội dung đầy đủ (dành cho trang chi tiết, nếu có)"
        value={value.body}
        onChange={(e) => onChange({ ...value, body: e.target.value })}
        rows={4}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-2"
      />
      <input
        placeholder="Kết quả nổi bật (VD: Tăng thu nhập gấp 3 lần)"
        value={value.result_metric}
        onChange={(e) => onChange({ ...value, result_metric: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <input
        placeholder="Ngày đăng (YYYY-MM-DD)"
        type="date"
        value={value.published_at}
        onChange={(e) => onChange({ ...value, published_at: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <input
        placeholder="Thumbnail URL"
        value={value.thumbnail_url}
        onChange={(e) => onChange({ ...value, thumbnail_url: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <input
        placeholder="Link chi tiết (external)"
        value={value.link_url}
        onChange={(e) => onChange({ ...value, link_url: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={value.active} onChange={(e) => onChange({ ...value, active: e.target.checked })} />
        Hiển thị trên Portal
      </label>
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={value.featured} onChange={(e) => onChange({ ...value, featured: e.target.checked })} />
        Nổi bật
      </label>
    </div>
  );
}

export function NewCaseStudyForm() {
  const [value, setValue] = useState<CaseStudyInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function submit() {
    if (!value.title.trim()) {
      push("Vui lòng nhập tiêu đề.");
      return;
    }
    setSaving(true);
    const result = await createCaseStudy(value);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push("Đã tạo case study mới.");
    setValue(EMPTY);
  }

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-white">Thêm case study mới</h2>
      <div className="mt-3">
        <Fields value={value} onChange={setValue} />
      </div>
      <button
        onClick={submit}
        disabled={saving}
        className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
      >
        Tạo case study
      </button>
    </div>
  );
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<CaseStudyInput>({
    title: caseStudy.title,
    slug: caseStudy.slug ?? "",
    client_name: caseStudy.client_name ?? "",
    summary: caseStudy.summary ?? "",
    body: caseStudy.body ?? "",
    result_metric: caseStudy.result_metric ?? "",
    thumbnail_url: caseStudy.thumbnail_url ?? "",
    link_url: caseStudy.link_url ?? "",
    active: caseStudy.active,
    featured: caseStudy.featured,
    published_at: caseStudy.published_at ?? "",
  });
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function save() {
    setSaving(true);
    const result = await updateCaseStudy(caseStudy.id, value);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push("Đã lưu case study.");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá case study "${caseStudy.title}"?`)) return;
    const result = await deleteCaseStudy(caseStudy.id);
    if (result.error) push(result.error);
    else push("Đã xoá case study.");
  }

  if (editing) {
    return (
      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <Fields value={value} onChange={setValue} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            Lưu
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">{caseStudy.title}</h3>
          {caseStudy.client_name && <p className="mt-1 text-xs text-white/40">{caseStudy.client_name}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            caseStudy.active ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
          }`}
        >
          {caseStudy.active ? "Đang hiển thị" : "Đã ẩn"}
        </span>
      </div>
      {caseStudy.summary && <p className="mt-2 text-sm text-white/70">{caseStudy.summary}</p>}
      {caseStudy.result_metric && <p className="mt-2 text-sm font-semibold text-brand-orange">📈 {caseStudy.result_metric}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
        >
          Sửa
        </button>
        <button
          onClick={remove}
          className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
        >
          Xoá
        </button>
      </div>
    </div>
  );
}
