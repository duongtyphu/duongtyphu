"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { FieldInput } from "@/components/admin/FieldInput";
import type { FieldConfig } from "@/lib/admin/fields";
import { genId } from "@/lib/admin/store";
import type { EcosystemArticleRow } from "@/lib/portal/live-ecosystem-articles";

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
  { key: "imageUrl", label: "URL ảnh (dán link ảnh đã host sẵn)", type: "text", full: true },
  { key: "linkLabel", label: "Nhãn nút liên kết (CTA cuối bài, có thể để trống)", type: "text" },
  {
    key: "linkUrl",
    label: "Đường link liên kết (vd. link đăng ký hệ sinh thái/dự án con)",
    type: "text",
  },
  { key: "seoTitle", label: "SEO Title (để trống dùng luôn Tiêu đề)", type: "text", full: true },
  { key: "metaDescription", label: "Meta Description", type: "textarea", full: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

function emptyArticle(entityId: string, subProjectId: string): Record<string, unknown> {
  return {
    ecosystemId: entityId,
    subProjectId,
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
    linkLabel: "",
    linkUrl: "",
    seoTitle: "",
    metaDescription: "",
    displayOrder: 0,
    status: "Draft",
  };
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
                  {a.status} · /{a.slug || "(chưa có slug)"}
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
