"use client";

import { useMemo, useState } from "react";
import { useCollection, genId } from "@/lib/admin/store";
import { useAdminToast } from "@/lib/admin/toast";
import { Modal, ConfirmDialog } from "@/components/admin/ui/Modal";
import { Badge, STATUS_TONE } from "@/components/admin/ui/Badge";
import { CompanionWriteButton } from "@/components/admin/ai/CompanionWriteButton";
import { CompanionQuickActions } from "@/components/admin/ai/CompanionQuickActions";
import { KnowledgeEditor } from "@/components/admin/ckos/KnowledgeEditor";
import { RelationshipPicker } from "@/components/admin/ckos/RelationshipPicker";
import {
  KNOWLEDGE_STATUSES,
  KNOWLEDGE_DIFFICULTIES,
  emptyKnowledgeItem,
  type KnowledgeItem,
} from "@/lib/admin/ckos/metadata";
import type { ColumnConfig, FieldConfig } from "@/lib/admin/fields";
import type { CompanionAgentKind, GeneratedGenericContent, GeneratedKnowledgeSeed } from "@/ai/types/ai.types";

type Item = KnowledgeItem & Record<string, unknown>;

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function emptyExtra(fields: FieldConfig[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "boolean") obj[f.key] = false;
    else if (f.type === "tags") obj[f.key] = [];
    else if (f.type === "number") obj[f.key] = 0;
    else obj[f.key] = f.options?.[0] ?? "";
  }
  return obj;
}

type AiAssistConfig = {
  kind: CompanionAgentKind;
  briefKey?: string;
  applyResult: (data: GeneratedGenericContent | GeneratedKnowledgeSeed) => Partial<Item>;
};

/**
 * Canonical CKOS CRUD framework (ADM-SPR-004) — the ONE shared component
 * every one of the 13 CKOS collections (9 modules; Resources splits into
 * 5 sibling collections) is built on. List → Detail(modal) → Create →
 * Edit → Delete → Duplicate → Archive, shared Editor, shared Metadata
 * Standard, shared Lifecycle, shared Relationship, shared Search/Filter,
 * shared Version/Changelog — identical everywhere.
 *
 * Modules whose existing Supabase table has its own presentation fields
 * that Portal/CKOS Runtime already read (Tools' `name`/`pricing`, Prompts'
 * `content`, Resources' `name`/`description`) alias the canonical
 * Title/Summary/Body fields onto those exact keys via `titleKey`/
 * `summaryKey`/`bodyKey`, and keep the rest of their presentation fields as
 * `extraFields` — so canonicalizing metadata/lifecycle/relationship/version
 * did not require breaking what Portal already renders from these tables.
 *
 * CrudPage.tsx (used by 20+ non-CKOS admin pages) is intentionally left
 * untouched — this is a parallel framework for CKOS specifically, not a
 * replacement of CrudPage for the whole Admin.
 */
export function KnowledgeCrudPage({
  title,
  description,
  collectionKey,
  categoryOptions = [],
  titleKey = "title",
  summaryKey = "summary",
  bodyKey = "body",
  extraFields = [],
  extraColumns = [],
  viewHref,
  aiAssist,
}: {
  title: string;
  description?: string;
  collectionKey: string;
  categoryOptions?: string[];
  titleKey?: string;
  summaryKey?: string;
  bodyKey?: string;
  /** Module-specific presentation fields beyond the shared standard (e.g. Tools' pricing/ctaLink). */
  extraFields?: FieldConfig[];
  /** Extra list-table columns rendered after the standard ones (e.g. Tools' Rating). */
  extraColumns?: ColumnConfig<Item>[];
  viewHref?: (item: Item) => string;
  aiAssist?: AiAssistConfig;
}) {
  const { items, ready, add, update, remove } = useCollection<Item>(collectionKey, []);
  const { push } = useAdminToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortDesc, setSortDesc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<KnowledgeItem>({ id: "", ...emptyKnowledgeItem() });
  const [extraForm, setExtraForm] = useState<Record<string, unknown>>({});
  const [changeNote, setChangeNote] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [archiveId, setArchiveId] = useState<string | null>(null);

  const readTitle = (item: Item) => String(item[titleKey] ?? item.title ?? "");
  const readSummary = (item: Item) => String(item[summaryKey] ?? item.summary ?? "");
  const readBody = (item: Item) => String(item[bodyKey] ?? item.body ?? "");

  const categories = useMemo(() => {
    const fromData = Array.from(new Set(items.map((it) => it.category).filter(Boolean)));
    return Array.from(new Set([...categoryOptions, ...fromData]));
  }, [items, categoryOptions]);

  const authors = useMemo(() => Array.from(new Set(items.map((it) => it.author).filter(Boolean))), [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (it) =>
          readTitle(it).toLowerCase().includes(q) ||
          readSummary(it).toLowerCase().includes(q) ||
          (it.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "all") list = list.filter((it) => it.status === statusFilter);
    if (categoryFilter !== "all") list = list.filter((it) => it.category === categoryFilter);
    if (authorFilter !== "all") list = list.filter((it) => it.author === authorFilter);
    list.sort((a, b) =>
      sortDesc
        ? String(b.updatedDate ?? "").localeCompare(String(a.updatedDate ?? ""))
        : String(a.updatedDate ?? "").localeCompare(String(b.updatedDate ?? ""))
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, statusFilter, categoryFilter, authorFilter, sortDesc]);

  function openCreate() {
    setEditing(null);
    setForm({ id: "", ...emptyKnowledgeItem() });
    setExtraForm(emptyExtra(extraFields));
    setChangeNote("");
    setModalOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({
      id: item.id,
      title: readTitle(item),
      slug: item.slug ?? "",
      summary: readSummary(item),
      category: item.category ?? "",
      tags: item.tags ?? [],
      difficulty: item.difficulty ?? "",
      aiTool: item.aiTool ?? "",
      status: item.status ?? "Draft",
      version: item.version ?? 1,
      author: item.author ?? "",
      reviewer: item.reviewer ?? "",
      publishedDate: item.publishedDate ?? "",
      updatedDate: item.updatedDate ?? "",
      changelog: item.changelog ?? [],
      relatedIds: item.relatedIds ?? [],
      body: readBody(item),
    });
    setExtraForm(Object.fromEntries(extraFields.map((f) => [f.key, item[f.key] ?? emptyExtra([f])[f.key]])));
    setChangeNote("");
    setModalOpen(true);
  }

  function buildPayload(slug: string, version: number, changelog: KnowledgeItem["changelog"], today: string) {
    return {
      ...extraForm,
      [titleKey]: form.title,
      slug,
      [summaryKey]: form.summary,
      category: form.category,
      tags: form.tags,
      difficulty: form.difficulty,
      aiTool: form.aiTool,
      status: form.status,
      version,
      author: form.author,
      reviewer: form.reviewer,
      publishedDate: form.publishedDate,
      updatedDate: today,
      changelog,
      relatedIds: form.relatedIds,
      [bodyKey]: form.body,
    };
  }

  function handleSave() {
    if (!form.title.trim()) {
      push('Vui lòng nhập "Title"', "error");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const slug = form.slug.trim() || slugify(form.title);

    if (editing) {
      const nextVersion = (editing.version ?? 1) + 1;
      const changelog = changeNote.trim()
        ? [...(editing.changelog ?? []), { version: nextVersion, date: today, note: changeNote.trim() }]
        : (editing.changelog ?? []);
      update(editing.id, buildPayload(slug, nextVersion, changelog, today));
      push("Đã lưu thay đổi.");
    } else {
      add({ id: genId(collectionKey), ...buildPayload(slug, 1, [], today) } as unknown as Item);
      push("Đã thêm mới thành công.");
    }
    setModalOpen(false);
  }

  function handleDuplicate(item: Item) {
    const today = new Date().toISOString().slice(0, 10);
    add({
      ...item,
      id: genId(collectionKey),
      [titleKey]: `${readTitle(item)} (Bản sao)`,
      slug: "",
      status: "Draft",
      version: 1,
      changelog: [],
      updatedDate: today,
      publishedDate: "",
    } as unknown as Item);
    push("Đã nhân bản.");
  }

  function handleDelete() {
    if (!deleteId) return;
    remove(deleteId);
    push("Đã xóa.", "info");
    setDeleteId(null);
  }

  function handleArchive() {
    if (!archiveId) return;
    const today = new Date().toISOString().slice(0, 10);
    update(archiveId, { status: "Archived", updatedDate: today });
    push("Đã lưu trữ.", "info");
    setArchiveId(null);
  }

  function renderExtraInput(f: FieldConfig) {
    const value = extraForm[f.key];
    if (f.type === "textarea") {
      return (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => setExtraForm((s) => ({ ...s, [f.key]: e.target.value }))}
          placeholder={f.placeholder}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
        />
      );
    }
    if (f.type === "select") {
      return (
        <select
          value={String(value ?? "")}
          onChange={(e) => setExtraForm((s) => ({ ...s, [f.key]: e.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          {(f.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    if (f.type === "boolean") {
      return (
        <button
          type="button"
          onClick={() => setExtraForm((s) => ({ ...s, [f.key]: !s[f.key] }))}
          className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            value ? "border-brand-blue/40 bg-brand-blue/20 text-white" : "border-white/10 bg-white/5 text-white/50"
          }`}
        >
          {value ? "Có" : "Không"}
        </button>
      );
    }
    if (f.type === "tags") {
      return (
        <input
          value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
          onChange={(e) =>
            setExtraForm((s) => ({ ...s, [f.key]: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))
          }
          placeholder="Phân tách bằng dấu phẩy"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
        />
      );
    }
    return (
      <input
        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
        value={String(value ?? "")}
        onChange={(e) =>
          setExtraForm((s) => ({ ...s, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))
        }
        placeholder={f.placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">{title}</h1>
          {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          + Thêm mới
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm (tiêu đề, tóm tắt, tag)..."
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none sm:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
        >
          <option value="all">Trạng thái: Tất cả</option>
          {KNOWLEDGE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            <option value="all">Danh mục: Tất cả</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        {authors.length > 0 && (
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
          >
            <option value="all">Tác giả: Tất cả</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={() => setSortDesc((v) => !v)}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
        >
          Cập nhật {sortDesc ? "Mới→Cũ" : "Cũ→Mới"}
        </button>
        <span className="text-xs text-white/40">{filtered.length} mục</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        {!ready ? (
          <div className="space-y-2 p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/40">
            Chưa có tri thức nào. Bấm “Thêm mới” để tạo mục đầu tiên.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Version</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                {extraColumns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white/80">
                    <button onClick={() => openEdit(item)} className="text-left font-semibold text-white hover:text-brand-blue">
                      {readTitle(item) || "(chưa đặt tiêu đề)"}
                    </button>
                    {(item.tags ?? []).length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-white/40">{(item.tags ?? []).join(", ")}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60">{item.category || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[item.status] ?? "gray"}>{item.status ?? "Draft"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white/60">v{item.version ?? 1}</td>
                  <td className="px-4 py-3 text-white/60">{item.author || "—"}</td>
                  <td className="px-4 py-3 text-white/60">{item.updatedDate || "—"}</td>
                  {extraColumns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-white/60">
                      {c.render ? c.render(item) : String(item[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {viewHref && (
                      <a
                        href={viewHref(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                      >
                        Xem
                      </a>
                    )}
                    <button
                      onClick={() => openEdit(item)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="mr-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Nhân bản
                    </button>
                    {item.status !== "Archived" && (
                      <button
                        onClick={() => setArchiveId(item.id)}
                        className="mr-1.5 rounded-lg border border-brand-orange/20 px-3 py-1.5 text-xs font-semibold text-brand-orange hover:bg-brand-orange/10"
                      >
                        Lưu trữ
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Sửa tri thức" : "Thêm tri thức mới"} onClose={() => setModalOpen(false)} width="max-w-4xl">
        {aiAssist && (
          <div className="mb-5 space-y-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold text-violet-200">
                Nhập tiêu đề, để Companion viết giúp phần còn lại — bạn luôn xem lại trước khi lưu.
              </p>
              <CompanionWriteButton
                kind={aiAssist.kind}
                getTitle={() => form.title}
                getBrief={aiAssist.briefKey ? () => String(extraForm[aiAssist.briefKey as string] ?? "") || undefined : undefined}
                onGenerated={(data) => {
                  const patch = aiAssist.applyResult(data);
                  setForm((s) => ({ ...s, ...(patch as Partial<KnowledgeItem>) }));
                  setExtraForm((s) => ({ ...s, ...patch }));
                }}
              />
            </div>
            {form.body.trim() && (
              <CompanionQuickActions
                kind={aiAssist.kind}
                getContent={() => form.body}
                onApply={(result) =>
                  setForm((s) => ({
                    ...s,
                    body: result.content,
                    ...(result.slug ? { slug: result.slug } : {}),
                  }))
                }
              />
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
              Title <span className="text-brand-orange">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
              placeholder={slugify(form.title) || "tu-dong-tao-tu-title"}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              list={`ckos-category-options-${collectionKey}`}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
            <datalist id={`ckos-category-options-${collectionKey}`}>
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Tags</label>
            <input
              value={form.tags.join(", ")}
              onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))}
              placeholder="Phân tách bằng dấu phẩy"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm((s) => ({ ...s, difficulty: e.target.value as KnowledgeItem["difficulty"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {KNOWLEDGE_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d || "—"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">AI Tool</label>
            <input
              value={form.aiTool}
              onChange={(e) => setForm((s) => ({ ...s, aiTool: e.target.value }))}
              placeholder="VD: ChatGPT, Claude, Gemini..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as KnowledgeItem["status"] }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            >
              {KNOWLEDGE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Author</label>
            <input
              value={form.author}
              onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Reviewer</label>
            <input
              value={form.reviewer}
              onChange={(e) => setForm((s) => ({ ...s, reviewer: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Published Date</label>
            <input
              type="date"
              value={form.publishedDate}
              onChange={(e) => setForm((s) => ({ ...s, publishedDate: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Updated Date</label>
            <input
              type="date"
              value={form.updatedDate}
              disabled
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Body</label>
            <KnowledgeEditor value={form.body} onChange={(body) => setForm((s) => ({ ...s, body }))} />
          </div>

          {extraFields.length > 0 && (
            <div className="sm:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/40">Trường riêng của module này</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {extraFields.map((f) => (
                  <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                      {f.label}
                      {f.required && <span className="text-brand-orange"> *</span>}
                    </label>
                    {renderExtraInput(f)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">Relationship</label>
            <RelationshipPicker
              relatedIds={form.relatedIds}
              onChange={(relatedIds) => setForm((s) => ({ ...s, relatedIds }))}
            />
          </div>

          {editing && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/40">
                Ghi chú thay đổi (Change Log — sẽ lưu vào v{(editing.version ?? 1) + 1})
              </label>
              <input
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="VD: Cập nhật ví dụ, sửa lỗi chính tả..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none"
              />
              {(editing.changelog ?? []).length > 0 && (
                <ul className="mt-2 space-y-1 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white/50">
                  {[...(editing.changelog ?? [])].reverse().map((c, i) => (
                    <li key={i}>
                      <span className="font-semibold text-white/70">v{c.version}</span> · {c.date} — {c.note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-brand-blue px-5 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Lưu
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Xóa tri thức này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!archiveId}
        title="Lưu trữ tri thức này?"
        description="Mục sẽ chuyển sang trạng thái Archived và không còn được CKOS Runtime đọc. Có thể khôi phục sau bằng cách sửa lại Status."
        confirmLabel="Lưu trữ"
        tone="neutral"
        onCancel={() => setArchiveId(null)}
        onConfirm={handleArchive}
      />
    </div>
  );
}
