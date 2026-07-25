"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import type { FieldConfig } from "@/lib/admin/fields";
import { genId } from "@/lib/admin/store";
import type { EcosystemArticleRow, ArticleImage, ArticleLink } from "@/lib/portal/live-ecosystem-articles";

/**
 * Panel quản lý bài viết (thêm/sửa/xoá) — CHỈ hiện khi `editMode=true`,
 * mounted cạnh `ArticleTicker` (bản hiển thị thuần) trong
 * `EcosystemArticlesSection.tsx`, dùng CHUNG 1 `useCollection()` instance
 * (props `add`/`update`/`remove` truyền vào, không tự gọi hook riêng —
 * tránh 2 state không đồng bộ, cùng lý do `mutators` ở `DataTableRowPanel`).
 *
 * KHÁC `EditableRegion` (chỉ sửa field của 1 record có sẵn) — panel này hỗ
 * trợ Thêm/Xoá thật, vì "Cập nhật thông tin mới" là danh sách nội dung
 * Founder cần tự thêm/bớt theo thời gian (khác các "chrome" tĩnh 1 dòng ở
 * các module Live-edit trước).
 *
 * `images`/`links` (mở rộng riêng — "chèn hình ảnh, link ngoài vào bài
 * viết... để admin linh động và tuỳ biến bài viết hơn", "thay đổi được
 * tất cả các link liên kết và link affiliate") — 2 mảng KHÔNG giới hạn số
 * lượng, KHÔNG dùng `FieldInput`/`FieldConfig` chuẩn (kiểu đó chỉ hỗ trợ
 * `string[]` phẳng qua `type: "tags"`, không hỗ trợ mảng object) — tự
 * dựng 2 sub-editor lặp lại (thêm dòng/xoá dòng) ngay trong form này.
 */
const ARTICLE_FIELDS: FieldConfig[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
  {
    key: "slug",
    label: "Slug (phần cuối URL, không dấu/không khoảng trắng)",
    type: "text",
    required: true,
    placeholder: "vd. digiu-la-gi-he-sinh-thai-cong-nghe",
  },
  { key: "displayOrder", label: "Thứ tự hiển thị (số nhỏ hơn hiện trước)", type: "number" },
  { key: "content", label: "Nội dung đầy đủ (hiện ở trang chi tiết)", type: "textarea", full: true, required: true },
  { key: "imageUrl", label: "URL ảnh bìa (thẻ trong băng chạy + đầu trang chi tiết)", type: "text", full: true },
  { key: "seoTitle", label: "SEO Title (để trống dùng luôn Tiêu đề)", type: "text", full: true },
  { key: "metaDescription", label: "Meta Description", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-blue focus:outline-none";

function emptyArticle(entityId: string, subProjectId: string): Record<string, unknown> {
  return {
    ecosystemId: entityId,
    subProjectId,
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
    images: [] as ArticleImage[],
    links: [] as ArticleLink[],
    seoTitle: "",
    metaDescription: "",
    displayOrder: 0,
    status: "Draft",
  };
}

/** Danh sách ảnh phụ trong bài — thêm/xoá dòng, mỗi dòng URL + chú thích. */
function ImagesEditor({
  images,
  onChange,
}: {
  images: ArticleImage[];
  onChange: (next: ArticleImage[]) => void;
}) {
  function update(i: number, patch: Partial<ArticleImage>) {
    onChange(images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  }
  function remove(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...images, { url: "", caption: "" }]);
  }

  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        Ảnh phụ trong bài (không giới hạn số lượng, hiện dưới nội dung)
      </label>
      <div className="space-y-2">
        {images.map((img, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50/60 p-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                type="text"
                value={img.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="URL ảnh"
                className={inputClass}
              />
              <input
                type="text"
                value={img.caption}
                onChange={(e) => update(i, { caption: e.target.value })}
                placeholder="Chú thích ảnh (tuỳ chọn)"
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Xoá ảnh"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-brand-blue hover:text-brand-blue"
      >
        <Plus className="h-3.5 w-3.5" />
        Thêm ảnh
      </button>
    </div>
  );
}

/** Danh sách link trong bài (thường + affiliate) — thêm/xoá dòng, mỗi
 * dòng Nhãn nút + URL + cờ Affiliate. Thay hẳn 2 field đơn cũ. */
function LinksEditor({ links, onChange }: { links: ArticleLink[]; onChange: (next: ArticleLink[]) => void }) {
  function update(i: number, patch: Partial<ArticleLink>) {
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function remove(i: number) {
    onChange(links.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...links, { label: "", url: "", affiliate: false }]);
  }

  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        Liên kết trong bài (nút CTA + link affiliate — không giới hạn số lượng, hiện ở cuối bài)
      </label>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50/60 p-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                type="text"
                value={link.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Nhãn nút, vd. Đăng ký DigiU"
                className={inputClass}
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => update(i, { url: e.target.value })}
                placeholder="Đường link"
                className={inputClass}
              />
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={link.affiliate}
                  onChange={(e) => update(i, { affiliate: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Đây là link tiếp thị liên kết (affiliate) — hiện nhãn &quot;Affiliate&quot; ngoài Portal
              </label>
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Xoá link"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-brand-blue hover:text-brand-blue"
      >
        <Plus className="h-3.5 w-3.5" />
        Thêm liên kết
      </button>
    </div>
  );
}

export function ArticlesAdminPanel({
  articles,
  ecosystemId,
  subProjectId,
  add,
  update,
  remove,
}: {
  articles: EcosystemArticleRow[];
  ecosystemId: string;
  subProjectId: string;
  add: (item: EcosystemArticleRow) => void | Promise<void>;
  update: (id: string, patch: Partial<EcosystemArticleRow>) => void | Promise<void>;
  remove: (id: string) => void | Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  function startAdd() {
    setEditingId("__new__");
    setForm(emptyArticle(ecosystemId, subProjectId));
  }

  function startEdit(article: EcosystemArticleRow) {
    setEditingId(article.id);
    setForm({ ...article });
  }

  function cancel() {
    setEditingId(null);
    setForm({});
  }

  async function save() {
    if (editingId === "__new__") {
      await add({
        id: genId("eco_article"),
        ecosystemId,
        subProjectId,
        ...form,
      } as EcosystemArticleRow);
    } else if (editingId) {
      await update(editingId, form as Partial<EcosystemArticleRow>);
    }
    cancel();
  }

  async function handleDelete(article: EcosystemArticleRow) {
    if (!window.confirm(`Xoá bài viết "${article.title}"? Không thể hoàn tác.`)) return;
    await remove(article.id);
  }

  const formImages = Array.isArray(form.images) ? (form.images as ArticleImage[]) : [];
  const formLinks = Array.isArray(form.links) ? (form.links as ArticleLink[]) : [];

  return (
    <div className="mt-3 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Quản lý bài viết (Live-edit)</p>
        {editingId === null && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm bài viết mới
          </button>
        )}
      </div>

      {editingId !== null ? (
        <div className="space-y-3 rounded-lg border border-blue-200 bg-white p-4">
          {ARTICLE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {f.label}
              </label>
              <FieldInput field={f} value={form[f.key]} onChange={(value) => setForm((prev) => ({ ...prev, [f.key]: value }))} />
            </div>
          ))}

          <ImagesEditor images={formImages} onChange={(next) => setForm((prev) => ({ ...prev, images: next }))} />
          <LinksEditor links={formLinks} onChange={(next) => setForm((prev) => ({ ...prev, links: next }))} />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-brand-blue px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
            >
              Lưu
            </button>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <p className="text-xs text-gray-500">Chưa có bài viết nào — bấm &quot;Thêm bài viết mới&quot; để tạo.</p>
      ) : (
        <ul className="space-y-1.5">
          {articles.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-gray-900">{a.title || "(chưa có tiêu đề)"}</p>
                <p className="text-[11px] text-gray-400">
                  {a.status} · /{a.slug || "(chưa có slug)"} · {a.images.length} ảnh phụ · {a.links.length} link
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-brand-blue"
                  aria-label="Sửa"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Xoá"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
