"use client";

import { useState } from "react";
import { createProduct, updateProduct, deleteProduct, type Product, type ProductInput } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

const EMPTY: ProductInput = {
  title: "",
  description: "",
  type: "Ebook",
  icon: "📦",
  price: 0,
  video_url: "",
  pdf_url: "",
  active: true,
};

const TYPE_OPTIONS = ["Ebook", "Bộ Prompt", "Khóa học ngắn", "Tư vấn", "Hội viên", "Khác"];

function Fields({
  value,
  onChange,
}: {
  value: ProductInput;
  onChange: (v: ProductInput) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        placeholder="Icon (emoji)"
        value={value.icon}
        onChange={(e) => onChange({ ...value, icon: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <select
        value={value.type}
        onChange={(e) => onChange({ ...value, type: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      >
        {TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        placeholder="Tên sản phẩm"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-2"
      />
      <textarea
        placeholder="Mô tả"
        value={value.description}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
        rows={2}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white sm:col-span-2"
      />
      <input
        type="number"
        placeholder="Giá (VNĐ)"
        value={value.price}
        onChange={(e) => onChange({ ...value, price: Number(e.target.value) })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          checked={value.active}
          onChange={(e) => onChange({ ...value, active: e.target.checked })}
        />
        Đang mở bán (hiện trên Portal)
      </label>
      <input
        placeholder="Video URL"
        value={value.video_url}
        onChange={(e) => onChange({ ...value, video_url: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
      <input
        placeholder="PDF URL"
        value={value.pdf_url}
        onChange={(e) => onChange({ ...value, pdf_url: e.target.value })}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      />
    </div>
  );
}

export function NewProductForm() {
  const [value, setValue] = useState<ProductInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function submit() {
    if (!value.title.trim()) {
      push("Vui lòng nhập tên sản phẩm.");
      return;
    }
    setSaving(true);
    const result = await createProduct(value);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push("Đã tạo sản phẩm mới.");
    setValue(EMPTY);
  }

  return (
    <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-sm font-bold text-white">Thêm sản phẩm mới</h2>
      <div className="mt-3">
        <Fields value={value} onChange={setValue} />
      </div>
      <button
        onClick={submit}
        disabled={saving}
        className="mt-3 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
      >
        Tạo sản phẩm
      </button>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<ProductInput>({
    title: product.title,
    description: product.description ?? "",
    type: product.type,
    icon: product.icon ?? "📦",
    price: product.price,
    video_url: product.video_url ?? "",
    pdf_url: product.pdf_url ?? "",
    active: product.active,
  });
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function save() {
    setSaving(true);
    const result = await updateProduct(product.id, value);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push("Đã lưu sản phẩm.");
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Xoá sản phẩm "${product.title}"?`)) return;
    const result = await deleteProduct(product.id);
    if (result.error) push(result.error);
    else push("Đã xoá sản phẩm.");
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
          <span className="text-2xl">{product.icon}</span>
          <h3 className="mt-2 text-sm font-bold text-white">{product.title}</h3>
          <p className="mt-1 text-xs text-white/40">{product.type}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            product.active ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
          }`}
        >
          {product.active ? "Đang mở bán" : "Đã ẩn"}
        </span>
      </div>
      {product.description && <p className="mt-2 text-sm text-white/70">{product.description}</p>}
      <p className="mt-2 text-sm font-semibold text-brand-orange">{product.price.toLocaleString("vi-VN")}đ</p>
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
